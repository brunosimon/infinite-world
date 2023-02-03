import Registry from '@/Registry.js' 

import * as THREE from 'three'
import { PointTextHelper } from '@jniac/three-point-text-helper'

class ChunkHelper
{
    constructor(chunkSate)
    {
        this.engine = new Registry.Engine.Engine()
        this.view = new Registry.View.View()
        this.scene = this.view.scene
        
        this.chunkEngine = chunkSate

        this.areaVisible = true
        this.idVisible = true
        this.neighboursIdVisible = true

        // this.setGroup()
        // this.setArea()
        // this.setId()
        // this.setNeighboursIds()
    }

    setGroup()
    {
        this.group = new THREE.Group()
        this.group.position.x = this.chunkEngine.x
        this.group.position.z = this.chunkEngine.z
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
            new THREE.PlaneGeometry(this.chunkEngine.size, this.chunkEngine.size),
            new THREE.MeshBasicMaterial({ wireframe: true })
        )
        this.area.geometry.rotateX(Math.PI * 0.5)

        this.area.material.color.multiplyScalar((this.chunkEngine.depth + 1) / (this.engine.chunks.maxDepth)) 

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
            text: this.chunkEngine.id,
            color: '#ffc800',
            size: (this.engine.chunks.maxDepth - this.chunkEngine.depth + 1) * 6,
            position: new THREE.Vector3(0, (this.engine.chunks.maxDepth - this.chunkEngine.depth) * 10, 0)
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

        if(this.chunkEngine.neighbours.size === 0)
            return

        this.neighboursIds = new PointTextHelper({ charMax: 4 })
        this.neighboursIds.material.depthTest = false
        this.neighboursIds.material.onBeforeRender = () => {}
        this.neighboursIds.material.onBuild = () => {}
        this.group.add(this.neighboursIds)

        const nChunk = this.chunkEngine.neighbours.get('n')
        const eChunk = this.chunkEngine.neighbours.get('e')
        const sChunk = this.chunkEngine.neighbours.get('s')
        const wChunk = this.chunkEngine.neighbours.get('w')

        const size = (this.engine.chunks.maxDepth - this.chunkEngine.depth + 1) * 6
        const y = (this.engine.chunks.maxDepth - this.chunkEngine.depth) * 10

        const nLabel = nChunk ? nChunk.id : ''
        this.neighboursIds.display({
            text: nLabel,
            color: '#00bfff',
            size: size,
            position: new THREE.Vector3(
                0,
                y,
                - this.chunkEngine.quarterSize
            )
        })
        
        const eLabel = eChunk ? eChunk.id : ''
        this.neighboursIds.display({
            text: eLabel,
            color: '#00bfff',
            size: size,
            position: new THREE.Vector3(
                this.chunkEngine.quarterSize,
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
                this.chunkEngine.quarterSize
            )
        })
        
        const wLabel = wChunk ? wChunk.id : ''
        this.neighboursIds.display({
            text: wLabel,
            color: '#00bfff',
            size: size,
            position: new THREE.Vector3(
                - this.chunkEngine.quarterSize,
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

    destroy()
    {
        this.destroyGroup()
        this.destroyArea()
        this.destroyId()
        this.destroyNeighboursIds()
    }
}

Registry.register('View', 'ChunkHelper', ChunkHelper)
export default ChunkHelper