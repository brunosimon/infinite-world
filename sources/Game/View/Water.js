import GAME from '@/Game.js' 

import * as THREE from 'three'

class Water
{
    constructor()
    {
        this.world = new GAME.World()
        this.view = new GAME.VIEW.View()
        this.engine = new GAME.ENGINE.Engine()
        this.scene = this.view.scene

        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshBasicMaterial({ color: '#1d3456' })
        )
        this.mesh.geometry.rotateX(- Math.PI * 0.5)
        // this.scene.add(this.mesh)
    }

    update()
    {
        const playerEngine = this.world.engine.player

        this.mesh.position.set(
            playerEngine.position.current[0],
            0,
            playerEngine.position.current[2]
        )
    }
}

GAME.register('VIEW', 'Water', Water)
export default Water