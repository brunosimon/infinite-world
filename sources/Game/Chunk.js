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

        this.halfSize = size * 0.5
        this.quarterSize = this.halfSize * 0.5
        this.chunks = []
        this.final = false
        this.splitted = false

        this.testPlayer()
    }

    testPlayer()
    {
        const underSplitDistance = this.chunksManager.underSplitDistance(this.size, this.x, this.z)

        /**
         * Split or not
         */
        // Under split distance, not the smallest and not yet splitted
        if(underSplitDistance && this.canSplit && !this.splitted)
            this.split()

        // Above split distance and splitted
        if(!underSplitDistance && this.splitted)
            this.unsplit()

        /**
         * Create final or not
         */
        if(this.splitted)
        {
            if(this.final)
                this.unsetFinal()
        }
        else
        {
            if(!this.final)
                this.setFinal()
        }
        
        /**
         * Test sub chunks
         */
        for(const chunk of this.chunks)
            chunk.testPlayer()
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
            const chunk = this.chunksManager.createChunk(this.halfSize, gridItem.x, gridItem.z, this.splitCount + 1)
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
            this.trigger('ready')
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

        this.helper.position.y = - (this.chunksManager.maxSize - this.size) / 16

        this.scene.add(this.helper)
    }

    destroyHelper()
    {
        this.helper.geometry.dispose()
        this.helper.material.dispose()
        this.scene.remove(this.helper)
    }

    destroy()
    {
        if(this.splitted)
        {
            this.unsplit()
        }

        if(this.final)
        {
            this.unsetFinal()
        }
    }
}