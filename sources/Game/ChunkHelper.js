import { PointTextHelper } from '@jniac/three-point-text-helper'
import * as THREE from 'three'

import Game from './Game.js'

export default class Chunk
{
    constructor(chunk)
    {
        this.game = new Game()
        this.scene = this.game.scene
        
        this.chunk = chunk

        this.areaVisible = true
        this.idVisible = true
        this.neighboursIdVisible = true

        this.setGroup()
        this.update()
    }

    setGroup()
    {
        this.group = new THREE.Group()
        this.group.position.x = this.chunk.x
        this.group.position.z = this.chunk.z
        this.scene.add(this.group)
    }

    destroyGroup()
    {
        if(!this.group)
            return

        this.scene.remove(this.group)
    }

    setArea()
    {
        this.destroyArea()

        if(!this.areaVisible)
            return

        this.area = new THREE.Mesh(
            new THREE.PlaneGeometry(this.chunk.size, this.chunk.size),
            new THREE.MeshBasicMaterial({ wireframe: true })
        )
        this.area.geometry.rotateX(Math.PI * 0.5)

        this.area.material.color.multiplyScalar((this.chunk.depth + 1) / (this.chunk.chunksManager.maxDepth)) 

        this.group.add(this.area)
    }

    destroyArea()
    {
        if(!this.area)
            return

        this.area.geometry.dispose()
        this.area.material.dispose()
        this.group.remove()
    }

    setId()
    {
        this.destroyId()

        if(!this.idVisible)
            return

        this.id = new PointTextHelper({ charMax: 4 })
        this.id.material.depthTest = false
        this.id.material.onBeforeRender = () => {}
        this.id.material.onBuild = () => {}
        this.id.display({
            text: this.chunk.id,
            color: '#ffc800',
            size: (this.chunk.chunksManager.maxDepth - this.chunk.depth + 1) * 6,
            position: new THREE.Vector3(0, (this.chunk.chunksManager.maxDepth - this.chunk.depth) * 10, 0)
        })
        this.group.add(this.id)
    }

    destroyId()
    {
        if(!this.id)
            return

        this.id.geometry.dispose()
        this.id.material.dispose()
        this.group.remove(this.id)
    }

    setNeighboursIds()
    {
        this.destroyNeighboursIds()

        if(!this.neighboursIdVisible)
            return

        if(this.chunk.neighbours.size === 0)
            return

        this.neighboursIds = new PointTextHelper({ charMax: 4 })
        this.neighboursIds.material.depthTest = false
        this.neighboursIds.material.onBeforeRender = () => {}
        this.neighboursIds.material.onBuild = () => {}
        this.group.add(this.neighboursIds)

        const nChunk = this.chunk.neighbours.get('n')
        const eChunk = this.chunk.neighbours.get('e')
        const sChunk = this.chunk.neighbours.get('s')
        const wChunk = this.chunk.neighbours.get('w')

        const size = (this.chunk.chunksManager.maxDepth - this.chunk.depth + 1) * 6
        const y = (this.chunk.chunksManager.maxDepth - this.chunk.depth) * 10

        const nLabel = nChunk ? nChunk.id : ''
        this.neighboursIds.display({
            text: nLabel,
            color: '#00bfff',
            size: size,
            position: new THREE.Vector3(
                0,
                y,
                - this.chunk.quarterSize
            )
        })
        
        const eLabel = eChunk ? eChunk.id : ''
        this.neighboursIds.display({
            text: eLabel,
            color: '#00bfff',
            size: size,
            position: new THREE.Vector3(
                this.chunk.quarterSize,
                y,
                0
            )
        })
        
        const sLabel = sChunk ? sChunk.id : ''
        this.neighboursIds.display({
            text: sLabel,
            color: '#00bfff',
            size: size,
            position: new THREE.Vector3(
                0,
                y,
                this.chunk.quarterSize
            )
        })
        
        const wLabel = wChunk ? wChunk.id : ''
        this.neighboursIds.display({
            text: wLabel,
            color: '#00bfff',
            size: size,
            position: new THREE.Vector3(
                - this.chunk.quarterSize,
                y,
                0
            )
        })
    }

    destroyNeighboursIds()
    {
        if(!this.neighboursIds)
            return

        this.neighboursIds.geometry.dispose()
        this.neighboursIds.material.dispose()
        this.group.remove(this.neighboursIds)
    }

    update()
    {
        this.setArea()
        this.setId()
        this.setNeighboursIds()
    }

    destroy()
    {
        this.destroyGroup()
        this.destroyArea()
        this.destroyId()
        this.destroyNeighboursIds()
    }
}