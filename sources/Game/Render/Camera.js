import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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

        // Set up
        this.mode = 'default' // default \ debug

        this.setInstance()
        this.setModes()
    }

    setInstance()
    {
        // Set up
        this.instance = new THREE.PerspectiveCamera(45, this.viewport.width / this.viewport.height, 0.1, 5000)
        this.instance.rotation.reorder('YXZ')

        this.scene.add(this.instance)
    }

    setModes()
    {
        this.modes = {}

        // Default
        this.modes.default = {}
        this.modes.default.instance = this.instance.clone()
        this.modes.default.instance.rotation.reorder('YXZ')

        // Debug
        this.modes.debug = {}
        this.modes.debug.instance = this.instance.clone()
        this.modes.debug.instance.rotation.reorder('YXZ')
        this.modes.debug.instance.position.set(- 200, 500, 500)
        
        // this.modes.debug.orbitControls = new OrbitControls(this.modes.debug.instance, this.domElement)
        // this.modes.debug.orbitControls.enabled = this.modes.debug.active
        // this.modes.debug.orbitControls.screenSpacePanning = true
        // this.modes.debug.orbitControls.enableKeys = false
        // this.modes.debug.orbitControls.zoomSpeed = 0.25
        // this.modes.debug.orbitControls.enableDamping = true
        // this.modes.debug.orbitControls.update()
    }


    resize()
    {
        this.instance.aspect = this.viewport.width / this.viewport.height
        this.instance.updateProjectionMatrix()

        this.modes.default.instance.aspect = this.viewport.width / this.viewport.height
        this.modes.default.instance.updateProjectionMatrix()

        this.modes.debug.instance.aspect = this.viewport.width / this.viewport.height
        this.modes.debug.instance.updateProjectionMatrix()
    }

    update()
    {
        const playerSate = this.state.player

        // Camera
        const viewPosition = {
            x: playerSate.position.current.x + playerSate.view.position.x,
            y: playerSate.position.current.y + playerSate.view.position.y,
            z: playerSate.position.current.z + playerSate.view.position.z
        }
        this.modes.default.instance.position.copy(viewPosition)
        this.modes.default.instance.lookAt(playerSate.position.current.x, playerSate.position.current.y + playerSate.view.elevation, playerSate.position.current.z)

        // // Update debug orbit controls
        // this.modes.debug.orbitControls.update()

        // Apply coordinates
        this.instance.position.copy(this.modes[this.mode].instance.position)
        this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion)
        this.instance.updateMatrixWorld() // To be used in projection
    }

    destroy()
    {
        // this.modes.debug.orbitControls.destroy()
    }
}
