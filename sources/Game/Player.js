import * as THREE from 'three'

import Game from './Game.js'

export default class Player
{
    constructor()
    {
        this.game = new Game()
        this.scene = this.game.scene
        this.camera = this.game.camera

        this.position = {
            x: 3,
            y: 0,
            z: 2
        }

        this.setControls()
        this.setHelper()
    }

    setControls()
    {
        this.controls = {
            up: false,
            right: false,
            down: false,
            left: false,
            shift: false
        }

        window.addEventListener('keydown', (event) =>
        {
            if(event.key === 'ArrowUp')
                this.controls.up = true
            else if(event.key === 'ArrowRight')
                this.controls.right = true
            else if(event.key === 'ArrowDown')
                this.controls.down = true
            else if(event.key === 'ArrowLeft')
                this.controls.left = true
            else if(event.key === 'Shift')
                this.controls.shift = true
        })

        window.addEventListener('keyup', (event) =>
        {
            if(event.key === 'ArrowUp')
                this.controls.up = false
            else if(event.key === 'ArrowRight')
                this.controls.right = false
            else if(event.key === 'ArrowDown')
                this.controls.down = false
            else if(event.key === 'ArrowLeft')
                this.controls.left = false
            else if(event.key === 'Shift')
                this.controls.shift = false
        })
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
        this.helper.add(this.axisHelper)
    }

    update()
    {
        const playerSpeed = this.controls.shift ? 5 : 0.1

        if(this.controls.up)
            this.position.z += - playerSpeed
        if(this.controls.right)
            this.position.x += playerSpeed
        if(this.controls.down)
            this.position.z += playerSpeed
        if(this.controls.left)
            this.position.x += - playerSpeed
        
        this.helper.position.copy(this.position)

        this.camera.modes.default.instance.position.copy(this.position)
        this.camera.modes.default.instance.position.y = 1.7
    }
}