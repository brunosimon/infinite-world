import { PointTextHelper } from '@jniac/three-point-text-helper'
import * as THREE from 'three'

import Game from './Game.js'
import EventEmitter from './Utils/EventEmitter.js'

// Children chunks indexes:
// +-----+-----+
// |  0  |  1  |
// +-----+-----+
// |  3  |  2  |
// +-----+-----+


// Neighbour chunks:
//       +-----+
//       |  0  |
// +-----+-----+-----+
// |  3  |  x  |  1  |
// +-----+-----+-----+
//       |  2  |
//       +-----+

export default class Chunk extends EventEmitter
{
    constructor(id, chunksManager, parent, size, x, z, depth)
    {
        super()
        
        this.game = new Game()
        this.scene = this.game.scene
        this.mathUtils = this.game.mathUtils
        this.player = this.game.player

        this.id = id
        this.chunksManager = chunksManager
        this.parent = parent
        this.size = size
        this.x = x
        this.z = z
        this.depth = depth

        this.terrainsManager = this.chunksManager.terrainsManager
        this.precision = this.depth / this.chunksManager.maxDepth
        this.canSplit = this.depth < this.chunksManager.maxDepth
        this.splitted = false
        this.splitting = false
        this.unsplitting = false
        this.needsTest = true
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

        for(const [key, chunk] of this.chunks)
            chunk.testSplit()
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
        const fourGrid = this.getFourGrid()

        let i = 0
        for(const gridItem of fourGrid)
        {
            const chunk = this.chunksManager.createChunk(this, this.halfSize, gridItem.x, gridItem.z, this.depth + 1)
            chunk.on('ready', () =>
            {
                this.testReady()
            })
            this.chunks.set(i++, chunk)
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
            { x: this.x - this.quarterSize, z: this.z + this.quarterSize }, // 0: Up Left
            { x: this.x + this.quarterSize, z: this.z + this.quarterSize, }, // 1: Up right
            { x: this.x + this.quarterSize, z: this.z - this.quarterSize }, // 2: Down right 
            { x: this.x - this.quarterSize, z: this.z - this.quarterSize }, // 3: Down Left
        ]

        return grid
    }

    createTerrain()
    {
        this.terrain = this.terrainsManager.createTerrain(this.size, this.x, this.z, this.precision)
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
        const group = new THREE.Group()
        group.position.x = this.x
        group.position.z = this.z
        this.scene.add(group)

        const labels = new PointTextHelper({ charMax: 3 })
        labels.material.depthTest = false
        labels.material.onBeforeRender = () => {}
        labels.material.onBuild = () => {}
        labels.display({ text: this.id, color: 'cyan', size: 4, position: new THREE.Vector3(0, 1, 0) })
        group.add(labels)
        
        const area = new THREE.Mesh(
            new THREE.PlaneGeometry(this.size, this.size),
            new THREE.MeshBasicMaterial({ wireframe: true })
        )
        area.geometry.rotateX(Math.PI * 0.5)

        area.material.color.multiplyScalar((this.depth + 1) / (this.chunksManager.maxDepth)) 

        group.add(area)

        this.helper = { group, labels, area }
    }

    destroyHelper()
    {
        this.scene.remove(this.helper.group)

        this.helper.area.geometry.dispose()
        this.helper.area.material.dispose()
        this.scene.remove(this.helper.area)
        
        this.helper.labels.geometry.dispose()
        this.helper.labels.material.dispose()
        this.scene.remove(this.helper.labels)
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