import Registry from '@/Registry.js' 
import View from '@/View/View.js'
import State from '@/State/State.js'

import * as THREE from 'three'

class Water
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()
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
        const playerState = this.state.player

        this.mesh.position.set(
            playerState.position.current[0],
            0,
            playerState.position.current[2]
        )
    }
}

Registry.register('View', 'Water', Water)
export default Water