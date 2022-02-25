import * as THREE from 'three'

import Game from '@/Game.js'
import Render from '@/Render/Render.js'
import State from '@/State/State.js'

export default class Water
{
    constructor()
    {
        this.game = new Game()
        this.render = new Render()
        this.state = new State()
        this.scene = this.render.scene

        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshBasicMaterial({ color: '#1d3456' })
        )
        this.mesh.geometry.rotateX(- Math.PI * 0.5)
        this.scene.add(this.mesh)
    }

    update()
    {
        const playerState = this.game.state.player

        this.mesh.position.set(
            playerState.position.current[0],
            0,
            playerState.position.current[2]
        )
    }
}