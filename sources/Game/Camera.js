import * as THREE from 'three'
import Game from './Game.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor(_options)
    {
        // Options
        this.game = new Game()
        this.config = this.game.config
        this.debug = this.game.debug
        this.time = this.game.time
        this.sizes = this.game.sizes
        this.targetElement = this.game.targetElement
        this.scene = this.game.scene

        // Set up
        this.mode = 'debug' // default \ debug

        this.setInstance()
        this.setModes()
    }

    setInstance()
    {
        // Set up
        this.instance = new THREE.PerspectiveCamera(25, this.config.width / this.config.height, 0.1, 1000)
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
        this.modes.debug.instance.position.set(- 50, 100, 100)
        
        this.modes.debug.orbitControls = new OrbitControls(this.modes.debug.instance, this.targetElement)
        this.modes.debug.orbitControls.enabled = this.modes.debug.active
        this.modes.debug.orbitControls.screenSpacePanning = true
        this.modes.debug.orbitControls.enableKeys = false
        this.modes.debug.orbitControls.zoomSpeed = 0.25
        this.modes.debug.orbitControls.enableDamping = true
        this.modes.debug.orbitControls.update()
    }


    resize()
    {
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()

        this.modes.default.instance.aspect = this.config.width / this.config.height
        this.modes.default.instance.updateProjectionMatrix()

        this.modes.debug.instance.aspect = this.config.width / this.config.height
        this.modes.debug.instance.updateProjectionMatrix()
    }

    update()
    {
        // Update debug orbit controls
        this.modes.debug.orbitControls.update()

        // Apply coordinates
        this.instance.position.copy(this.modes[this.mode].instance.position)
        this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion)
        this.instance.updateMatrixWorld() // To be used in projection
    }

    destroy()
    {
        this.modes.debug.orbitControls.destroy()
    }
}
