import Registry from '@/Registry.js'
import View from '@/View/View.js'
import Engine from '@/Engine/Engine.js'

import * as THREE from 'three'

class Camera
{
    constructor(_options)
    {
        // Options
        this.engine = Engine.getInstance()
        this.view = View.getInstance()
        this.scene = this.view.scene
        this.viewport = this.engine.viewport

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
        const playerSate = this.engine.player

        // Apply coordinates from view
        this.instance.position.set(playerSate.camera.position[0], playerSate.camera.position[1], playerSate.camera.position[2])
        this.instance.quaternion.set(playerSate.camera.quaternion[0], playerSate.camera.quaternion[1], playerSate.camera.quaternion[2], playerSate.camera.quaternion[3])
        // this.instance.updateMatrixGame() // To be used in projection
    }

    destroy()
    {
    }
}

Registry.register('View', 'Camera', Camera)
export default Camera