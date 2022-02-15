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

        this.created = false

        this.terrainState.on('ready', () =>
        {
            this.create()
        })
    }

    create()
    {
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
            this.geometry.index = new THREE.BufferAttribute(this.terrainState.indices, 1, false)

            // Create mesh
            this.mesh = new THREE.Mesh(this.geometry, this.terrains.material)
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