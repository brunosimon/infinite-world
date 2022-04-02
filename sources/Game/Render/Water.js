import GAME from '@/Game.js' 

import * as THREE from 'three'

class Water
{
    constructor()
    {
        this.world = new GAME.World()
        this.render = new GAME.RENDER.Render()
        this.state = new GAME.STATE.State()
        this.scene = this.render.scene

        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshBasicMaterial({ color: '#1d3456' })
        )
        this.mesh.geometry.rotateX(- Math.PI * 0.5)
        // this.scene.add(this.mesh)
    }

    update()
    {
        const playerState = this.world.state.player

        this.mesh.position.set(
            playerState.position.current[0],
            0,
            playerState.position.current[2]
        )
    }
}

GAME.register('RENDER', 'Water', Water)
export default Water