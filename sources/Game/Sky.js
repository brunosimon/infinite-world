import * as THREE from 'three'

import Game from './Game.js'
import SkyMaterial from './Materials/SkyMaterial'

export default class Sky
{
    constructor()
    {
        this.game = new Game()
        this.world = this.game.world
        this.scene = this.game.scene

        this.geometry = new THREE.SphereGeometry(1000, 128, 64)
        this.material = new SkyMaterial()
        this.material.side = THREE.BackSide
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    update()
    {
        const sun = this.game.world.sun

        this.material.uniforms.uSunPosition.value.set(sun.position.x, sun.position.y, sun.position.z)
    }
}