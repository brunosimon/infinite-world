import * as THREE from 'three'

import Game from './Game.js'

export default class Sun
{
    constructor()
    {
        this.game = new Game()
        this.scene = this.game.scene
        this.debug = this.game.debug

        this.theta = Math.PI * 0.25 // All around the sphere
        this.phi = Math.PI * 0.45 // Elevation

        this.position = { x: 0, y: 0, z: 0 }

        this.setHelper()
        this.setDebug()

        this.update()
    }

    setHelper()
    {
        this.helper = new THREE.Mesh(
            new THREE.SphereGeometry(1, 16, 8),
            new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true })
        )

        this.scene.add(this.helper)
    }

    updatePosition()
    {
        const sinPhiRadius = Math.sin(this.phi)

        this.position.x = sinPhiRadius * Math.sin(this.theta)
        this.position.y = Math.cos(this.phi)
        this.position.z = sinPhiRadius * Math.cos(this.theta)
    }

    update()
    {
        this.updatePosition()

        this.helper.position.copy(this.position).multiplyScalar(5)
    }

    setDebug()
    {
        if(!this.debug.active)
            return

        const debugFolder = this.debug.ui.addFolder('sun')

        debugFolder
            .add(this, 'theta')
            .min(- Math.PI)
            .max(Math.PI)
            .step(0.001)

        debugFolder
            .add(this, 'phi')
            .min(0)
            .max(Math.PI)
            .step(0.001)
    }
}