import * as THREE from 'three'

import Game from './Game.js'
import PlayerView from './PlayerView.js'

export default class Player
{
    constructor()
    {
        this.game = new Game()
        this.time = this.game.time
        this.scene = this.game.scene
        this.camera = this.game.camera
        this.controls = this.game.controls

        this.rotation = 0
        this.speed = 0.01
        this.boostSpeed = 0.03

        this.position = {}
        this.position.current = {
            x: 3,
            y: 0,
            z: 2
        }
        this.position.previous = {
            x: this.position.current.x,
            y: this.position.current.y,
            z: this.position.current.z
        }
        this.position.delta = {
            x: 0,
            y: 0,
            z: 0
        }

        this.view = new PlayerView(this)
        this.setHelper()
    }

    setHelper()
    {
        this.helper = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 1.8, 0.5),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        )
        this.helper.geometry.translate(0, 0.9, 0)

        this.scene.add(this.helper)
        
        // Axis helper
        this.axisHelper = new THREE.AxesHelper(50)
        this.scene.add(this.axisHelper)
    }

    update()
    {
        this.view.update()

        if(this.controls.keys.down.forward || this.controls.keys.down.backward || this.controls.keys.down.strafeLeft || this.controls.keys.down.strafeRight)
        {
            const speed = this.controls.keys.down.boost ? this.boostSpeed : this.speed
            let angle = this.view.theta

            if(this.controls.keys.down.backward)
                angle += Math.PI
            if(this.controls.keys.down.strafeLeft)
                angle += Math.PI * 0.5
            if(this.controls.keys.down.strafeRight)
                angle -= Math.PI * 0.5
            
            const x = Math.sin(angle) * this.time.delta * speed
            const z = Math.cos(angle) * this.time.delta * speed

            this.position.current.x -= x
            this.position.current.z -= z
        }

        // Helper
        this.helper.rotation.y = this.view.theta
        this.helper.position.copy(this.position.current)
        this.axisHelper.position.copy(this.position.current)
        
        // Camera
        const viewPosition = {
            x: this.position.current.x + this.view.position.x,
            y: this.position.current.y + this.view.position.y,
            z: this.position.current.z + this.view.position.z
        }
        this.camera.modes.default.instance.position.copy(viewPosition)
        this.camera.modes.default.instance.lookAt(this.position.current.x, this.position.current.y, this.position.current.z)
    }
}