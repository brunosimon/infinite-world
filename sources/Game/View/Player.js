import Registry from '@/Registry.js' 

import * as THREE from 'three'

class Player
{
    constructor()
    {
        this.game = new Registry.Game()
        this.engine = new Registry.Engine.Engine()
        this.view = new Registry.View.View()
        this.scene = this.view.scene

        this.setGroup()
        this.setHelper()
        this.setDebug()
    }

    setGroup()
    {
        this.group = new THREE.Group()
        this.scene.add(this.group)
    }
    
    setHelper()
    {
        this.helper = new THREE.Mesh()
        this.helper.material = new Registry.View.MATERIALS.Player()
        this.helper.material.uniforms.uColor.value = new THREE.Color('#fff8d6')
        this.helper.material.uniforms.uSunPosition.value = new THREE.Vector3(- 0.5, - 0.5, - 0.5)

        this.helper.geometry = new THREE.CapsuleGeometry(0.5, 0.8, 3, 16),
        this.helper.geometry.translate(0, 0.9, 0)
        this.group.add(this.helper)

        // const arrow = new THREE.Mesh(
        //     new THREE.ConeGeometry(0.2, 0.2, 4),
        //     new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false })
        // )
        // arrow.rotation.x = - Math.PI * 0.5
        // arrow.position.y = 1.5
        // arrow.position.z = - 0.5
        // this.helper.add(arrow)
        
        // // Axis helper
        // this.axisHelper = new THREE.AxesHelper(3)
        // this.group.add(this.axisHelper)
    }

    setDebug()
    {
        const debug = this.game.debug

        if(!debug.active)
            return

        // Sphere
        const playerFolder = debug.ui.getFolder('view/player')

        playerFolder.addColor(this.helper.material.uniforms.uColor, 'value')
    }


    update()
    {
        const playerEngine = this.engine.player
        const sunEngine = this.engine.sun

        this.group.position.set(
            playerEngine.position.current[0],
            playerEngine.position.current[1],
            playerEngine.position.current[2]
        )
        
        // Helper
        this.helper.rotation.y = playerEngine.rotation
        this.helper.material.uniforms.uSunPosition.value.set(sunEngine.position.x, sunEngine.position.y, sunEngine.position.z)
    }
}

Registry.register('View', 'Player', Player)
export default Player