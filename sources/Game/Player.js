import * as THREE from 'three'

import Game from './Game.js'
import PlayerView from './PlayerView.js'

export default class Player
{
    constructor()
    {
        this.game = new Game()
        this.scene = this.game.scene
        this.camera = this.game.camera
        this.controls = this.game.controls

        this.rotation = 0

        this.position = {
            x: 3,
            y: 0,
            z: 2
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
        this.helper.add(this.axisHelper)
    }

    update()
    {
        this.helper.position.copy(this.position)

        this.view.update()
        
        this.camera.modes.default.instance.position.copy(this.view.position)
        this.camera.modes.default.instance.lookAt(this.position.x, this.position.y, this.position.z)
    }
}