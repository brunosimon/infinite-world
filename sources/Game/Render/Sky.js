import * as THREE from 'three'

import Game from '@/Game.js'
import Render from '@/Render/Render.js'
import SkyMaterial from '@/Materials/SkyMaterial'

export default class Sky
{
    constructor()
    {
        this.game = new Game()
        this.render = new Render()
        this.scene = this.render.scene
        this.debug = this.game.debug

        this.radius = 1000

        this.geometry = new THREE.SphereGeometry(this.radius, 128, 64)
        this.material = new SkyMaterial()
        
        this.material.uniforms.uColorDayLow.value.set('#f0fff9')
        this.material.uniforms.uColorDayHigh.value.set('#2e89ff')
        this.material.uniforms.uColorNightLow.value.set('#004794')
        this.material.uniforms.uColorNightHigh.value.set('#001624')
        this.material.uniforms.uColorSun.value.set('#ff4000')
        this.material.uniforms.uColorDawn.value.set('#ff1900')
        this.material.uniforms.uDayProgress.value = 0
        this.material.side = THREE.BackSide
        // this.material.wireframe = true
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)

        this.setSun()
        this.setDebug()
    }

    setSun()
    {
        this.sun = {}
        this.sun.distance = this.radius - 10
        
        const geometry = new THREE.CircleGeometry(0.02 * this.sun.distance, 32)
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
        this.sun.mesh = new THREE.Mesh(geometry, material)
        this.scene.add(this.sun.mesh)
    }

    update()
    {
        const dayState = this.game.state.day
        const sunState = this.game.state.sun
        const playerState = this.game.state.player

        this.mesh.position.set(
            playerState.position.current.x,
            playerState.position.current.y,
            playerState.position.current.z
        )
        this.material.uniforms.uSunPosition.value.set(sunState.position.x, sunState.position.y, sunState.position.z)
        this.material.uniforms.uDayProgress.value = dayState.progress
        
        this.sun.mesh.position.set(
            playerState.position.current.x + sunState.position.x * this.sun.distance,
            playerState.position.current.y + sunState.position.y * this.sun.distance,
            playerState.position.current.z + sunState.position.z * this.sun.distance
        )
        this.sun.mesh.lookAt(
            playerState.position.current.x,
            playerState.position.current.y,
            playerState.position.current.z
        )
    }

    setDebug()
    {
        if(!this.debug.active)
            return

        const debugFolder = this.debug.ui.addFolder('sky')

        debugFolder.addColor(this.material.uniforms.uColorDayLow, 'value').name('uColorDayLow')
        debugFolder.addColor(this.material.uniforms.uColorDayHigh, 'value').name('uColorDayHigh')
        debugFolder.addColor(this.material.uniforms.uColorNightLow, 'value').name('uColorNightLow')
        debugFolder.addColor(this.material.uniforms.uColorNightHigh, 'value').name('uColorNightHigh')
        debugFolder.addColor(this.material.uniforms.uColorSun, 'value').name('uColorSun')
        debugFolder.addColor(this.material.uniforms.uColorDawn, 'value').name('uColorDawn')
    }
}