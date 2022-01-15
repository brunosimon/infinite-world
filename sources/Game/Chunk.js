import * as THREE from 'three'

import Game from './Game.js'

export default class Chunk
{
    constructor(chunksManager, size, x, z)
    {
        this.game = new Game()
        this.scene = this.game.scene
        this.mathUtils = this.game.mathUtils

        this.chunksManager = chunksManager
        this.size = size
        this.x = x
        this.z = z
        
        this.reference = this.chunksManager.reference

        this.halfSize = size * 0.5
        this.quarterSize = this.halfSize * 0.5
        this.isDivided = false
        this.chunks = []

        this.testDivide()
        this.setHelper()
    }

    testDivide()
    {
        // Not yet divided
        if(!this.isDivided)
        {
            // Limit to minimal chunk size
            if(this.size <= this.chunksManager.minSize)
            {
                return
            }

            const distance = this.mathUtils.distance(this.reference.position.x, this.reference.position.z, this.x, this.z)

            if(distance < this.size)
            {
                this.divide()
            }
        }

        for(const chunk of this.chunks)
        {
            chunk.testDivide()
        }
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

    divide()
    {
        this.isDivided = true

        const fourGrid = this.getFourGrid()

        for(const gridItem of fourGrid)
        {
            const chunk = new Chunk(this.chunksManager, this.halfSize, gridItem.x, gridItem.z)
            this.chunks.push(chunk)
        }
    }

    setHelper()
    {
        this.helper = new THREE.Mesh(
            new THREE.PlaneGeometry(this.size, this.size),
            new THREE.MeshBasicMaterial({ wireframe: true })
        )
        this.helper.geometry.rotateX(Math.PI * 0.5)
        this.helper.position.x = this.x
        this.helper.position.z = this.z

        this.scene.add(this.helper)
    }
}