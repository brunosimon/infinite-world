import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'

export default class Camera
{
    constructor(_options)
    {
        // Options
        this.state = State.getInstance()
        this.view = View.getInstance()
        this.scene = this.view.scene
        this.viewport = this.state.viewport

        this.setInstance()
    }

    setInstance()
    {
        // Set up
        this.instance = new THREE.PerspectiveCamera(45, this.viewport.width / this.viewport.height, 0.1, 5000)
        this.instance.rotation.reorder('YXZ')

        this.scene.add(this.instance)
    }

    resize()
    {
        this.instance.aspect = this.viewport.width / this.viewport.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        const playerSate = this.state.player

        // Apply coordinates from view
        this.instance.position.set(playerSate.camera.position[0], playerSate.camera.position[1], playerSate.camera.position[2])
        this.instance.quaternion.set(playerSate.camera.quaternion[0], playerSate.camera.quaternion[1], playerSate.camera.quaternion[2], playerSate.camera.quaternion[3])
        // this.instance.updateMatrixGame() // To be used in projection
    }

    destroy()
    {
    }
}