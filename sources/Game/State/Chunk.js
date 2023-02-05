import EventsEmitter from 'events'

import State from '@/State/State.js'

// Cardinal directions
//         N
//         
//           x
// W       + →     E
//        z↓
//           
//         S

// Children chunks keys:
// +-----+-----+
// | nw  |  ne |
// +-----+-----+
// | sw  |  se |
// +-----+-----+

// Neighbour chunks keys:
//       +-----+
//       |  n  |
// +-----+-----+-----+
// |  w  |     |  e  |
// +-----+-----+-----+
//       |  s  |
//       +-----+

export default class Chunk
{
    constructor(id, chunks, parent, quadPosition, size, x, z, depth)
    {
        this.state = State.getInstance()

        this.id = id
        this.chunks = chunks
        this.parent = parent
        this.quadPosition = quadPosition
        this.size = size
        this.x = x
        this.z = z
        this.depth = depth

        this.precision = this.depth / this.chunks.maxDepth
        this.maxSplit = this.depth === this.chunks.maxDepth
        this.splitted = false
        this.splitting = false
        this.unsplitting = false
        this.needsCheck = true
        this.terrainNeedsUpdate = true
        this.neighbours = new Map()
        this.children = new Map()
        this.ready = false
        this.final = false
        this.halfSize = size * 0.5
        this.quarterSize = this.halfSize * 0.5
        this.bounding = {
            xMin: this.x - this.halfSize,
            xMax: this.x + this.halfSize,
            zMin: this.z - this.halfSize,
            zMax: this.z + this.halfSize
        }

        this.events = new EventsEmitter()

        this.check()

        if(!this.splitted)
        {
            this.createFinal()
        }

        this.testReady()
    }

    check()
    {
        if(!this.needsCheck)
            return

        this.needsCheck = false

        const underSplitDistance = this.chunks.underSplitDistance(this.size, this.x, this.z)

        if(underSplitDistance)
        {
            if(!this.maxSplit && !this.splitted)
                this.split()
        }
        
        else
        {
            if(this.splitted)
                this.unsplit()
        }

        for(const [key, chunk] of this.children)
            chunk.check()
    }

    update()
    {
        if(this.final && this.terrainNeedsUpdate && this.neighbours.size === 4)
        {
            this.createTerrain()
            this.terrainNeedsUpdate = false
        }

        for(const [key, chunk] of this.children)
            chunk.update()
    }

    setNeighbours(nChunk, eChunk, sChunk, wChunk)
    {
        this.neighbours.set('n', nChunk)
        this.neighbours.set('e', eChunk)
        this.neighbours.set('s', sChunk)
        this.neighbours.set('w', wChunk)
    }

    testReady()
    {
        if(this.splitted)
        {
            let chunkReadyCount = 0

            for(const [key, chunk] of this.children)
            {
                if(chunk.ready)
                    chunkReadyCount++
            }

            if(chunkReadyCount === 4)
            {
                this.setReady()
            }
        }
        else
        {
            if(this.terrain && this.terrain.ready)
            {
                this.setReady()
            }
        }
    }

    setReady()
    {
        if(this.ready)
            return

        this.ready = true

        // Is splitting
        if(this.splitting)
        {
            this.splitting = false

            this.destroyFinal()
        }

        // Is unsplitting
        if(this.unsplitting)
        {
            this.unsplitting = false

            // Destroy chunks
            for(const [key, chunk] of this.children)
                chunk.destroy()

            this.children.clear()
        }

        this.events.emit('ready')
    }

    unsetReady()
    {
        if(!this.ready)
            return

        this.ready = false

        this.events.emit('unready')
    }

    split()
    {
        this.splitting = true
        this.splitted = true

        this.unsetReady()

        // Create 4 neighbours chunks
        const neChunk = this.chunks.create(this, 'ne', this.halfSize, this.x + this.quarterSize, this.z - this.quarterSize, this.depth + 1)
        this.children.set('ne', neChunk)

        const nwChunk = this.chunks.create(this, 'nw', this.halfSize, this.x - this.quarterSize, this.z - this.quarterSize, this.depth + 1)
        this.children.set('nw', nwChunk)
        
        const swChunk = this.chunks.create(this, 'sw', this.halfSize, this.x - this.quarterSize, this.z + this.quarterSize, this.depth + 1)
        this.children.set('sw', swChunk)

        const seChunk = this.chunks.create(this, 'se', this.halfSize, this.x + this.quarterSize, this.z + this.quarterSize, this.depth + 1)
        this.children.set('se', seChunk)

        for(const [key, chunk] of this.children)
        {
            chunk.events.on('ready', () =>
            {
                this.testReady()
            })
        }
    }

    unsplit()
    {
        if(!this.splitted)
            return

        this.splitted = false
        this.unsplitting = true

        this.unsetReady()

        this.createFinal()
    }

    createTerrain()
    {
        this.destroyTerrain()

        this.terrain = this.state.terrains.create(
            this.size,
            this.x,
            this.z,
            this.precision
        )
        this.terrain.events.on('ready', () =>
        {
            this.testReady()
        })
    }

    destroyTerrain()
    {
        if(!this.terrain)
            return

        this.state.terrains.destroyTerrain(this.terrain.id)
    }

    createFinal()
    {
        if(this.final)
            return

        this.final = true
        this.terrainNeedsUpdate = true
    }

    destroyFinal()
    {
        if(!this.final)
            return

        this.final = false
        this.terrainNeedsUpdate = false

        this.destroyTerrain()
    }

    destroy()
    {
        for(const [key, chunk] of this.children)
            chunk.off('ready')

        if(this.splitted)
        {
            this.unsplit()
        }
        else
        {
            // Was unsplitting
            if(this.unsplitting)
            {
                // Destroy chunks
                for(const [key, chunk] of this.children)
                    chunk.destroy()

                this.children.clear()
            }
        }

        this.destroyFinal()
        // this.chunkHelper.destroy()

        this.events.emit('destroy')
    }

    isInside(x, z)
    {
        return x > this.bounding.xMin && x < this.bounding.xMax && z > this.bounding.zMin && z < this.bounding.zMax
    }

    getChildChunkForPosition(x, z)
    {
        if(!this.splitted)
            return this

        for(const [key, chunk] of this.children)
        {
            if(chunk.isInside(x, z))
                return chunk.getChildChunkForPosition(x, z)
        }

        return false
    }
}