// import { PointTextHelper } from '@jniac/three-point-text-helper'
// import * as THREE from 'three'

import Game from '@/Game.js'
import State from '@/State/State.js'
// import ChunkHelper from '@/State/ChunkHelper.js'
import EventEmitter from '@/Utils/EventEmitter.js'

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

export default class Chunk extends EventEmitter
{
    constructor(id, chunksManager, parent, quadPosition, size, x, z, depth)
    {
        super()
        
        this.game = new Game()
        this.state = new State()
        this.scene = this.game.scene
        this.mathUtils = this.game.mathUtils

        this.id = id
        this.chunksManager = chunksManager
        this.parent = parent
        this.quadPosition = quadPosition
        this.size = size
        this.x = x
        this.z = z
        this.depth = depth

        this.precision = this.depth / this.chunksManager.maxDepth
        this.maxSplit = this.depth === this.chunksManager.maxDepth
        this.splitted = false
        this.splitting = false
        this.unsplitting = false
        this.quadsNeedsUpdate = true
        this.terrainNeedsUpdate = true
        this.neighbours = new Map()
        this.chunks = new Map()
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

        // this.chunkHelper = new ChunkHelper(this)
    }

    throttleUpdate()
    {
        if(!this.quadsNeedsUpdate)
            return

        this.quadsNeedsUpdate = false

        const underSplitDistance = this.chunksManager.underSplitDistance(this.size, this.x, this.z)

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

        for(const [key, chunk] of this.chunks)
            chunk.throttleUpdate()
    }

    update()
    {
        if(this.final && this.terrainNeedsUpdate && this.neighbours.size === 4)
        {
            this.createTerrain()
            this.terrainNeedsUpdate = false
        }

        for(const [key, chunk] of this.chunks)
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

            for(const [key, chunk] of this.chunks)
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
            for(const [key, chunk] of this.chunks)
                chunk.destroy()

            this.chunks.clear()
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
        const neChunk = this.chunksManager.createChunk(this, 'ne', this.halfSize, this.x + this.quarterSize, this.z - this.quarterSize, this.depth + 1)
        this.chunks.set('ne', neChunk)

        const nwChunk = this.chunksManager.createChunk(this, 'nw', this.halfSize, this.x - this.quarterSize, this.z - this.quarterSize, this.depth + 1)
        this.chunks.set('nw', nwChunk)
        
        const swChunk = this.chunksManager.createChunk(this, 'sw', this.halfSize, this.x - this.quarterSize, this.z + this.quarterSize, this.depth + 1)
        this.chunks.set('sw', swChunk)

        const seChunk = this.chunksManager.createChunk(this, 'se', this.halfSize, this.x + this.quarterSize, this.z + this.quarterSize, this.depth + 1)
        this.chunks.set('se', seChunk)

        for(const [key, chunk] of this.chunks)
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
        //     // console.log(wChunk.chunks.get('ne'))
        //     // console.log(wChunk.chunks.get('se'))

        //     if(nChunk && nChunk.splitted && nChunk.depth === this.depth)
        //     {
        //         nChunk.chunks.get('sw').terrainNeedsUpdate = true
        //         nChunk.chunks.get('se').terrainNeedsUpdate = true
        //     }

        //     if(eChunk && eChunk.splitted && eChunk.depth === this.depth)
        //     {
        //         eChunk.chunks.get('nw').terrainNeedsUpdate = true
        //         eChunk.chunks.get('sw').terrainNeedsUpdate = true
        //     }

        //     if(sChunk && sChunk.splitted && sChunk.depth === this.depth)
        //     {
        //         sChunk.chunks.get('nw').terrainNeedsUpdate = true
        //         sChunk.chunks.get('ne').terrainNeedsUpdate = true
        //     }

        //     if(wChunk && wChunk.splitted && wChunk.depth === this.depth)
        //     {
        //         wChunk.chunks.get('ne').terrainNeedsUpdate = true
        //         wChunk.chunks.get('se').terrainNeedsUpdate = true
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
        
        this.terrain = this.state.terrainsManager.createTerrain(
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

        this.state.terrainsManager.destroyTerrain(this.terrain.id)
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
        for(const [key, chunk] of this.chunks)
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
                for(const [key, chunk] of this.chunks)
                    chunk.destroy()

                this.chunks.clear()
            }
        }

        this.destroyFinal()
        // this.chunkHelper.destroy()
    }

    isInside(x, z)
    {
        return x > this.bounding.xMin && x < this.bounding.xMax && z > this.bounding.zMin && z < this.bounding.zMax
    }

    getChunkForPosition(x, z)
    {
        if(!this.splitted)
            return this

        for(const [key, chunk] of this.chunks)
        {
            if(chunk.isInside(x, z))
                return chunk.getChunkForPosition(x, z)
        }

        return false
    }
}