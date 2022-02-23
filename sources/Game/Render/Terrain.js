import * as THREE from 'three'

import Game from '@/Game.js'
import State from '@/State/State.js'
import Render from '@/Render/Render.js'

export default class Terrain
{
    constructor(terrains, terrainState)
    {
        this.game = new Game()
        this.state = new State()
        this.render = new Render()
        this.scene = this.render.scene

        this.terrains = terrains
        this.terrainState = terrainState
        this.terrainState.renderInstance = this

        this.created = false

        this.terrainState.on('ready', () =>
        {
            this.create()
        })
    }

    create()
    {
        const terrainsState = this.state.terrains

        // Recreate
        if(this.created)
        {
            // Dispose of old geometry
            this.geometry.dispose()

            // Create new geometry
            this.geometry = new THREE.BufferGeometry()
            this.geometry.setAttribute('position', new THREE.BufferAttribute(this.terrainState.positions, 3))
            this.geometry.setAttribute('normal', new THREE.BufferAttribute(this.terrainState.normals, 3))
            this.geometry.index = new THREE.BufferAttribute(this.terrainState.indices, 1, false)
        
            this.mesh.geometry = this.geometry
        }

        // Create
        else
        {
            // Create geometry
            this.geometry = new THREE.BufferGeometry()
            this.geometry.setAttribute('position', new THREE.BufferAttribute(this.terrainState.positions, 3))
            this.geometry.setAttribute('normal', new THREE.BufferAttribute(this.terrainState.normals, 3))
            this.geometry.setAttribute('uv', new THREE.BufferAttribute(this.terrainState.uv, 2))
            this.geometry.index = new THREE.BufferAttribute(this.terrainState.indices, 1, false)

            // Texture
            this.texture = new THREE.DataTexture(
                this.terrainState.texture,
                terrainsState.segments,
                terrainsState.segments,
                THREE.RGBAFormat,
                THREE.FloatType,
                THREE.UVMapping,
                THREE.ClampToEdgeWrapping,
                THREE.ClampToEdgeWrapping,
                THREE.LinearFilter,
                THREE.LinearFilter
            )
            this.texture.flipY = false
            this.texture.needsUpdate = true

            // // Material
            // this.material = this.terrains.material.clone()
            // this.material.uniforms.uTexture.value = this.texture

            // Create mesh
            this.mesh = new THREE.Mesh(this.geometry, this.terrains.material)
            this.mesh.userData.texture = this.texture
            // this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshNormalMaterial())
            this.scene.add(this.mesh)
            
            this.created = true
        }
    }

    update()
    {

    }

    destroy()
    {
        if(this.created)
        {
            this.geometry.dispose()
            this.scene.remove(this.mesh)
        }
    }
}