import * as THREE from 'three'

import Game from '@/Game.js'
import State from '@/State/State.js'
import Render from '@/Render/Render.js'

export default class Camera
{
    constructor(_options)
    {
        // Options
        this.game = new Game()
        this.state = new State()
        this.render = new Render()
        this.scene = this.render.scene
        this.viewport = this.game.viewport
        this.debug = this.game.debug
        this.time = this.game.time
        this.sizes = this.game.sizes
        this.domElement = this.game.domElement

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

        // // Camera
        // const viewPosition = {
        //     x: playerSate.position.current.x + playerSate.view.position.x,
        //     y: playerSate.position.current.y + playerSate.view.position.y,
        //     z: playerSate.position.current.z + playerSate.view.position.z
        // }
        // this.modes.default.instance.position.copy(viewPosition)
        // this.modes.default.instance.lookAt(playerSate.position.current.x, playerSate.position.current.y + playerSate.view.elevation, playerSate.position.current.z)

        // Apply coordinates
        this.instance.position.set(playerSate.view.position[0], playerSate.view.position[1], playerSate.view.position[2])
        this.instance.quaternion.set(playerSate.view.quaternion[0], playerSate.view.quaternion[1], playerSate.view.quaternion[2], playerSate.view.quaternion[3])
        // console.log(playerSate.view.quaternion[0])
        this.instance.updateMatrixWorld() // To be used in projection
    }

    destroy()
    {
        // this.modes.debug.orbitControls.destroy()
    }
}