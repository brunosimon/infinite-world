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
        this.inputSpeed = 0.01
        this.inputBoostSpeed = 0.03
        this.speed = 0

        this.position = {}
        this.position.current = {
            x: 0.1,
            y: 0,
            z: 0.1
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
            new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false })
        )
        this.helper.geometry.translate(0, 0.9, 0)

        const arrow = new THREE.Mesh(
            new THREE.ConeGeometry(0.2, 0.2, 4),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false })
        )
        arrow.rotation.x = - Math.PI * 0.5
        arrow.position.y = 1.5
        arrow.position.z = - 0.5
        this.helper.add(arrow)

        this.scene.add(this.helper)
        
        // Axis helper
        this.axisHelper = new THREE.AxesHelper(3)
        this.scene.add(this.axisHelper)
    }

    update()
    {
        this.view.update()

        if(this.controls.keys.down.forward || this.controls.keys.down.backward || this.controls.keys.down.strafeLeft || this.controls.keys.down.strafeRight)
        {
            let directionAngle = this.view.theta

            if(this.controls.keys.down.forward)
            {
                if(this.controls.keys.down.strafeLeft)
                    directionAngle += Math.PI * 0.25
                else if(this.controls.keys.down.strafeRight)
                    directionAngle -= Math.PI * 0.25
            }
            else if(this.controls.keys.down.backward)
            {
                if(this.controls.keys.down.strafeLeft)
                    directionAngle += Math.PI * 0.75
                else if(this.controls.keys.down.strafeRight)
                    directionAngle -= Math.PI * 0.75
                else
                    directionAngle -= Math.PI
            }
            else if(this.controls.keys.down.strafeLeft)
            {
                directionAngle += Math.PI * 0.5
            }
            else if(this.controls.keys.down.strafeRight)
            {
                directionAngle -= Math.PI * 0.5
            }

            const speed = this.controls.keys.down.boost ? this.inputBoostSpeed : this.inputSpeed

            const x = Math.sin(directionAngle) * this.time.delta * speed
            const z = Math.cos(directionAngle) * this.time.delta * speed

            this.position.current.x -= x
            this.position.current.z -= z
            
            this.helper.rotation.y = directionAngle
        }

        this.position.delta.x = this.position.current.x - this.position.previous.x
        this.position.delta.y = this.position.current.y - this.position.previous.y
        this.position.delta.z = this.position.current.z - this.position.previous.z

        this.position.previous.x = this.position.current.x
        this.position.previous.y = this.position.current.y
        this.position.previous.z = this.position.current.z

        this.speed = Math.hypot(this.position.delta.x, this.position.delta.y, this.position.delta.z)
        
        // Helper
        this.helper.position.copy(this.position.current)
        this.axisHelper.position.copy(this.position.current)
        
        // Camera
        const viewPosition = {
            x: this.position.current.x + this.view.position.x,
            y: this.position.current.y + this.view.position.y,
            z: this.position.current.z + this.view.position.z
        }
        this.camera.modes.default.instance.position.copy(viewPosition)
        this.camera.modes.default.instance.lookAt(this.position.current.x, this.position.current.y + this.view.elevation, this.position.current.z)
    }
}