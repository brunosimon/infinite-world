import * as THREE from 'three'

import Game from './Game.js'
import EventEmitter from './Utils/EventEmitter.js'

export default class Chunk extends EventEmitter
{
    constructor(chunksManager, size, x, z, splitCount)
    {
        super()
        
        this.game = new Game()
        this.scene = this.game.scene
        this.mathUtils = this.game.mathUtils
        this.player = this.game.player

        this.chunksManager = chunksManager
        this.size = size
        this.x = x
        this.z = z
        this.splitCount = splitCount

        this.terrainsManager = this.chunksManager.terrainsManager
        this.canSplit = this.splitCount < this.chunksManager.maxSplitCount
        this.splitted = false
        this.splitting = false
        this.unsplitting = false
        this.needsTest = true
        this.chunks = []
        this.ready = false

        this.halfSize = size * 0.5
        this.quarterSize = this.halfSize * 0.5

        this.testSplit()

        if(!this.splitted)
        {
            this.createFinal()
        }

        this.testReady()
    }

    testSplit()
    {
        if(!this.needsTest)
            return

        this.needsTest = false

        const underSplitDistance = this.chunksManager.underSplitDistance(this.size, this.x, this.z)

        if(underSplitDistance)
        {
            if(this.canSplit && !this.splitted)
                this.split()
        }
        
        else
        {
            if(this.splitted)
                this.unsplit()
        }

        for(const chunk of this.chunks)
            chunk.testSplit()
    }

    testReady()
    {
        if(this.splitted)
        {
            let chunkReadyCount = 0

            for(const chunk of this.chunks)
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
            if(this.terrain.ready)
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
            for(const chunk of this.chunks)
                chunk.destroy()

            this.chunks = []
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
        const fourGrid = this.getFourGrid()

        for(const gridItem of fourGrid)
        {
            const chunk = this.chunksManager.createChunk(this.halfSize, gridItem.x, gridItem.z, this.splitCount + 1)
            chunk.on('ready', () =>
            {
                this.testReady()
            })
            this.chunks.push(chunk)
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

    getFourGrid()
    {
        const grid = [
            { x: this.x + this.quarterSize, z: this.z + this.quarterSize, }, // Up right
            { x: this.x + this.quarterSize, z: this.z - this.quarterSize }, // Down right 
            { x: this.x - this.quarterSize, z: this.z - this.quarterSize }, // Down Left
            { x: this.x - this.quarterSize, z: this.z + this.quarterSize }, // Up Left
        ]

        return grid
    }

    createTerrain()
    {
        this.terrain = this.terrainsManager.createTerrain(this.size, this.x, this.z)
        this.terrain.on('ready', () =>
        {
            this.testReady()
        })
    }

    destroyTerrain()
    {
        this.terrainsManager.destroyTerrain(this.terrain.id)
    }

    createHelper()
    {
        this.helper = new THREE.Mesh(
            new THREE.PlaneGeometry(this.size, this.size),
            new THREE.MeshBasicMaterial({ wireframe: true })
        )
        this.helper.geometry.rotateX(Math.PI * 0.5)
        this.helper.position.x = this.x
        this.helper.position.z = this.z

        this.helper.position.y = - (this.chunksManager.maxSplitCount - this.splitCount + 1) * 4

        this.helper.material.color.multiplyScalar((this.splitCount + 1) / (this.chunksManager.maxSplitCount)) 

        this.scene.add(this.helper)
    }

    destroyHelper()
    {
        this.helper.geometry.dispose()
        this.helper.material.dispose()
        this.scene.remove(this.helper)
    }

    createFinal()
    {
        if(this.final)
            return

        this.final = true

        this.createTerrain()
        this.createHelper()
    }

    destroyFinal()
    {
        if(!this.final)
            return

        this.final = false

        this.destroyTerrain()
        this.destroyHelper()
    }

    destroy()
    {
        for(const chunk of this.chunks)
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
                for(const chunk of this.chunks)
                    chunk.destroy()

                this.chunks = []
            }
        }

        this.destroyFinal()
    }
}