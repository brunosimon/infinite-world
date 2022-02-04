import * as THREE from 'three'

import Game from './Game.js'
import SkyMaterial from './Materials/SkyMaterial'

export default class Sky
{
    constructor()
    {
        this.game = new Game()
        this.scene = this.game.scene

        this.geometry = new THREE.SphereGeometry(1000)
        this.material = new SkyMaterial()
        this.material.side = THREE.BackSide
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }
}