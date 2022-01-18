import * as THREE from 'three'

import Game from './Game.js'
import EventEmitter from './Utils/EventEmitter.js'

export default class Terrain extends EventEmitter
{
    constructor(id, size, x, z)
    {
        super()

        this.game = new Game()
        this.scene = this.game.scene

        this.id = id
        this.size = size
        this.x = x
        this.z = z

        this.created = false
    }

    create(positions, normals, indices)
    {
        this.positions = positions
        this.normals = normals
        this.indices = indices

        // Not yet created
        if(!this.created)
        {
            this.created = true
            this.createHelper()
        }
        else
        {
            this.destroyHelper()
            this.createHelper()
        }
    }

    createHelper()
    {
        // Geometry
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
        geometry.setAttribute('normal', new THREE.BufferAttribute(this.normals, 3))
        geometry.index = new THREE.BufferAttribute(this.indices, 1, false)
        // geometry.computeVertexNormals()

        // Material
        // const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, wireframe: false })
        // const material = new THREE.MeshStandardMaterial()
        const material = new THREE.MeshNormalMaterial({ wireframe: false })

        // Mesh
        this.helper = new THREE.Mesh(geometry, material)
        this.scene.add(this.helper)
    }

    destroyHelper()
    {
        if(!this.created)
            return
            
        this.helper.geometry.dispose()
        this.helper.material.dispose()
        this.scene.remove(this.helper)
    }

    destroy()
    {
        this.destroyHelper()
    }
}