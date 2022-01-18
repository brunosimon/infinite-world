import * as THREE from 'three'

import Game from './Game.js'
import EventEmitter from './Utils/EventEmitter.js'

export default class Chunk extends EventEmitter
{
    constructor(chunksManager, size, x, z)
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

        this.terrainsManager = this.chunksManager.terrainsManager
        this.initial = this.size == this.chunksManager.maxSize
        this.smallest = this.size == this.chunksManager.minSize

        this.halfSize = size * 0.5
        this.quarterSize = this.halfSize * 0.5
        this.chunks = []
        this.final = false
        this.splitted = false

        this.test()
    }

    test()
    {
        const distance = this.mathUtils.distance(this.player.position.x, this.player.position.z, this.x, this.z)

        /**
         * Split or not
         */
        // Under split distance, not the smallest and not yet splitted
        if(distance < this.size * 1.25 && !this.smallest && !this.splitted)
            this.split()

        // Above split distance and splitted
        if(distance >= this.size * 1.25 && this.splitted)
            this.unsplit()

        /**
         * Create final or not
         */
        if(!this.splitted)
        {
            if(!this.final)
                this.setFinal()
        }
        else
        {
            if(this.final)
                this.unsetFinal()
        }
        
        /**
         * Test sub chunks
         */
        for(const chunk of this.chunks)
            chunk.test()
    }

    setFinal()
    {
        this.final = true

        this.createHelper()
        this.createTerrain()
    }

    unsetFinal()
    {
        this.final = false

        this.destroyHelper()
        this.destroyTerrain()
    }

    split()
    {
        this.splitted = true

        // Create 4 neighbours chunks
        const fourGrid = this.getFourGrid()

        for(const gridItem of fourGrid)
        {
            const chunk = new Chunk(this.chunksManager, this.halfSize, gridItem.x, gridItem.z)
            let readyCount = 0
            chunk.on('ready', () =>
            {
                this.testReady()
            })
            this.chunks.push(chunk)
        }
    }

    unsplit()
    {
        this.splitted = false

        // Destroy chunks
        for(const chunk of this.chunks)
        {
            chunk.destroy()
        }

        this.chunks = []
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

    destroy()
    {
        if(this.splitted)
        {
            this.unsplit()
        }

        this.chunks = []
        
        if(this.final)
        {
            this.unsetFinal()
        }
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

        this.helper.position.y = (this.chunksManager.maxSize - this.size) / 16

        this.scene.add(this.helper)
    }

    destroyHelper()
    {
        this.helper.geometry.dispose()
        this.helper.material.dispose()
        this.scene.remove(this.helper)
    }

    testReady()
    {
        if(this.final)
        {
            if(this.terrain.ready)
            {
                this.ready = true
                this.trigger('ready')
            }
        }
        else
        {
            let chunksReadyCount = 0
            
            for(const chunk of this.chunks)
            {
                if(chunk.ready)
                    chunksReadyCount++
            }

            if(chunksReadyCount == 4)
            {
                this.ready = true
                this.trigger('ready')
            }
        }
    }
}