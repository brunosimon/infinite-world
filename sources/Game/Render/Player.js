import * as THREE from 'three'

import Game from '@/Game.js'
import State from '@/State/State.js'
import Render from '@/Render/Render.js'

export default class Player
{
    constructor()
    {
        this.game = new Game()
        this.state = new State()
        this.render = new Render()
        this.scene = this.render.scene

        this.playerState = this.state.player

        this.setGroup()
        this.setHelper()
    }

    setGroup()
    {
        this.group = new THREE.Group()
        this.scene.add(this.group)
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

        this.group.add(this.helper)
        
        // Axis helper
        this.axisHelper = new THREE.AxesHelper(3)
        this.group.add(this.axisHelper)
    }

    update()
    {
        this.group.position.set(
            this.playerState.position.current[0],
            this.playerState.position.current[1],
            this.playerState.position.current[2]
        )
        
        // Helper
        this.helper.rotation.y = this.playerState.rotation
    }
}