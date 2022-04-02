import GAME from '@/Game.js' 

import * as THREE from 'three'

class Sky
{
    constructor()
    {
        this.world = new GAME.World()
        this.render = new GAME.RENDER.Render()
        this.viewport = this.world.viewport
        this.renderer = this.render.renderer
        this.scene = this.render.scene

        this.setCustomRender()
        this.setBackground()
        this.setSphere()
        this.setSun()
        this.setDebug()
    }

    setCustomRender()
    {
        this.customRender = {}
        this.customRender.scene = new THREE.Scene()
        this.customRender.camera = this.render.camera.instance.clone()
        this.customRender.resolutionRatio = 0.1
        this.customRender.renderTarget = new THREE.WebGLRenderTarget(
            this.viewport.width * this.customRender.resolutionRatio,
            this.viewport.height * this.customRender.resolutionRatio,
            {
                generateMipmaps: false
            }
        )
        this.customRender.texture = this.customRender.renderTarget.texture
    }

    setBackground()
    {
        this.background = {}
        
        this.background.geometry = new THREE.PlaneGeometry(2, 2)
        
        // this.background.material = new THREE.MeshBasicMaterial({ wireframe: false, map: this.customRender.renderTarget.texture })
        this.background.material = new GAME.RENDER.MATERIALS.SkyBackground()
        this.background.material.uniforms.uTexture.value = this.customRender.renderTarget.texture
        // this.background.material.wireframe = true
        this.background.material.depthTest = false
        this.background.material.depthWrite = false
        
        this.background.mesh = new THREE.Mesh(this.background.geometry, this.background.material)
        this.background.mesh.frustumCulled = false
        
        this.scene.add(this.background.mesh)
    }

    setSphere()
    {
        this.sphere = {}
        this.sphere.geometry = new THREE.SphereGeometry(10, 128, 64)
        this.sphere.material = new GAME.RENDER.MATERIALS.SkySphere()
        
        this.sphere.material.uniforms.uColorDayLow.value.set('#f0fff9')
        this.sphere.material.uniforms.uColorDayHigh.value.set('#2e89ff')
        this.sphere.material.uniforms.uColorNightLow.value.set('#004794')
        this.sphere.material.uniforms.uColorNightHigh.value.set('#001624')
        this.sphere.material.uniforms.uColorSun.value.set('#ff4000')
        this.sphere.material.uniforms.uColorDawn.value.set('#ff1900')
        this.sphere.material.uniforms.uDayProgress.value = 0
        this.sphere.material.side = THREE.BackSide
        // this.sphere.material.wireframe = true
        this.sphere.mesh = new THREE.Mesh(this.sphere.geometry, this.sphere.material)
        this.customRender.scene.add(this.sphere.mesh)
    }

    setSun()
    {
        this.sun = {}
        this.sun.distance = 1000
        
        const geometry = new THREE.CircleGeometry(0.02 * this.sun.distance, 32)
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
        this.sun.mesh = new THREE.Mesh(geometry, material)
        this.scene.add(this.sun.mesh)
    }

    setDebug()
    {
        const debug = this.world.debug

        if(!debug.active)
            return

        const folder = debug.ui.getFolder('render/sky')

        folder.addColor(this.sphere.material.uniforms.uColorDayLow, 'value').name('uColorDayLow')
        folder.addColor(this.sphere.material.uniforms.uColorDayHigh, 'value').name('uColorDayHigh')
        folder.addColor(this.sphere.material.uniforms.uColorNightLow, 'value').name('uColorNightLow')
        folder.addColor(this.sphere.material.uniforms.uColorNightHigh, 'value').name('uColorNightHigh')
        folder.addColor(this.sphere.material.uniforms.uColorSun, 'value').name('uColorSun')
        folder.addColor(this.sphere.material.uniforms.uColorDawn, 'value').name('uColorDawn')
    }

    update()
    {
        const dayState = this.world.state.day
        const sunState = this.world.state.sun
        const playerState = this.world.state.player

        // Sphere
        this.sphere.material.uniforms.uSunPosition.value.set(sunState.position.x, sunState.position.y, sunState.position.z)
        this.sphere.material.uniforms.uDayProgress.value = dayState.progress
        
        // Sun
        this.sun.mesh.position.set(
            playerState.position.current[0] + sunState.position.x * this.sun.distance,
            playerState.position.current[1] + sunState.position.y * this.sun.distance,
            playerState.position.current[2] + sunState.position.z * this.sun.distance
        )
        this.sun.mesh.lookAt(
            playerState.position.current[0],
            playerState.position.current[1],
            playerState.position.current[2]
        )

        // Render in render target
        this.customRender.camera.quaternion.copy(this.render.camera.instance.quaternion)
        this.renderer.instance.setRenderTarget(this.customRender.renderTarget)
        this.renderer.instance.render(this.customRender.scene, this.customRender.camera)
        this.renderer.instance.setRenderTarget(null)
    }

    resize()
    {
        this.customRender.renderTarget.width = this.viewport.width * this.customRender.resolutionRatio
        this.customRender.renderTarget.height = this.viewport.height * this.customRender.resolutionRatio
    }
}

GAME.register('RENDER', 'Sky', Sky)
export default Sky