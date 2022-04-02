import GAME from '@/Game.js' 

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

class Chunk extends GAME.UTILS.EventEmitter
{
    constructor(id, chunks, parent, quadPosition, size, x, z, depth)
    {
        super()
        
        this.world = new GAME.World()
        this.state = new GAME.STATE.State()
        this.mathUtils = this.world.mathUtils

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
        this.quadsNeedsUpdate = true
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

        this.throttleUpdate()

        if(!this.splitted)
        {
            this.createFinal()
        }

        this.testReady()
    }

    throttleUpdate()
    {
        if(!this.quadsNeedsUpdate)
            return

        this.quadsNeedsUpdate = false

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
            chunk.throttleUpdate()
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

    updateNeighbours(nChunk, eChunk, sChunk, wChunk)
    {
        this.neighbours.set('n', nChunk)
        this.neighbours.set('e', eChunk)
        this.neighbours.set('s', sChunk)
        this.neighbours.set('w', wChunk)

        // this.chunkHelper.setNeighboursIds()
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

        this.trigger('ready')
    }

    unsetReady()
    {
        if(!this.ready)
            return

        this.ready = false

        this.trigger('unready')
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
            chunk.on('ready', () =>
            {
                this.testReady()
            })
        }

        // // Update neighbour terrains to match new subdivision
        // if(this.id === 16)
        // {
        //     const nChunk = this.neighbours.get('n')
        //     const eChunk = this.neighbours.get('e')
        //     const sChunk = this.neighbours.get('s')
        //     const wChunk = this.neighbours.get('w')

        //     // console.log(wChunk)
        //     // console.log(wChunk.children.get('ne'))
        //     // console.log(wChunk.children.get('se'))

        //     if(nChunk && nChunk.splitted && nChunk.depth === this.depth)
        //     {
        //         nChunk.children.get('sw').terrainNeedsUpdate = true
        //         nChunk.children.get('se').terrainNeedsUpdate = true
        //     }

        //     if(eChunk && eChunk.splitted && eChunk.depth === this.depth)
        //     {
        //         eChunk.children.get('nw').terrainNeedsUpdate = true
        //         eChunk.children.get('sw').terrainNeedsUpdate = true
        //     }

        //     if(sChunk && sChunk.splitted && sChunk.depth === this.depth)
        //     {
        //         sChunk.children.get('nw').terrainNeedsUpdate = true
        //         sChunk.children.get('ne').terrainNeedsUpdate = true
        //     }

        //     if(wChunk && wChunk.splitted && wChunk.depth === this.depth)
        //     {
        //         wChunk.children.get('ne').terrainNeedsUpdate = true
        //         wChunk.children.get('se').terrainNeedsUpdate = true
        //     }
        // }
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

        // const nChunk = this.neighbours.get('n')
        // const eChunk = this.neighbours.get('e')
        // const sChunk = this.neighbours.get('s')
        // const wChunk = this.neighbours.get('w')
        
        this.terrain = this.state.terrains.create(
            this.size,
            this.x,
            this.z,
            this.precision
        )
        this.terrain.on('ready', () =>
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

        this.trigger('destroy')
    }

    isInside(x, z)
    {
        return x > this.bounding.xMin && x < this.bounding.xMax && z > this.bounding.zMin && z < this.bounding.zMax
    }

    getChunkForPosition(x, z)
    {
        if(!this.splitted)
            return this

        for(const [key, chunk] of this.children)
        {
            if(chunk.isInside(x, z))
                return chunk.getChunkForPosition(x, z)
        }

        return false
    }
}

GAME.register('STATE', 'Chunk', Chunk)
export default Chunk