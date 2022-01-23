import * as THREE from 'three'

import Game from './Game.js'
import EventEmitter from './Utils/EventEmitter.js'

export default class Terrain extends EventEmitter
{
    constructor(terrainsManager, id, size, x, z, precision)
    {
        super()

        this.game = new Game()
        this.scene = this.game.scene

        this.terrainsManager = terrainsManager
        this.id = id
        this.size = size
        this.x = x
        this.z = z
        this.precision = precision

        this.ready = false
    }

    create(positions, normals, indices)
    {
        // Destroy in case already exist
        this.destroy()

        this.positions = positions
        this.normals = normals
        this.indices = indices

        // Geometry
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
        this.geometry.setAttribute('normal', new THREE.BufferAttribute(this.normals, 3))
        this.geometry.index = new THREE.BufferAttribute(this.indices, 1, false)
        // this.geometry.computeVertexNormals()

        // Material
        this.material = this.terrainsManager.helperMaterial

        // Mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)

        this.ready = true

        this.trigger('ready')
    }

    destroy()
    {
        if(this.ready)
        {
            this.geometry.dispose()
            this.material.dispose()
            this.scene.remove(this.mesh)
        }
    }
}