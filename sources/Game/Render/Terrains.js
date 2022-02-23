import * as THREE from 'three'

import Game from '@/Game.js'
import State from '@/State/State.js'
import Render from '@/Render/Render.js'
import Terrain from '@/Render/Terrain.js'
import TerrainGradient from '@/Render/TerrainGradient.js'
import TerrainMaterial from '@/Render/Materials/TerrainMaterial.js'

export default class Terrains
{
    constructor()
    {
        this.game = new Game()
        this.state = new State()
        this.render = new Render()
        this.viewport = this.game.viewport
        this.debug = this.game.debug
        this.sky =  this.render.sky

        this.setGradient()
        this.setMaterial()
        this.setDebug()

        this.state.terrains.on('create', (terrainState) =>
        {
            const terrain = new Terrain(this, terrainState)

            terrainState.on('destroy', () =>
            {
                terrain.destroy()
            })
        })
    }

    setGradient()
    {
        this.gradient = new TerrainGradient()
    }

    setMaterial()
    {
        this.material = new TerrainMaterial()
        this.material.uniforms.uGradientTexture.value = this.gradient.texture
        this.material.uniforms.uLightnessSmoothness.value = 0.25
        this.material.uniforms.uLightnessEdgeMin.value = 0
        this.material.uniforms.uLightnessEdgeMax.value = 1
        this.material.uniforms.uMaxElevation.value = this.state.terrains.baseAmplitude
        this.material.uniforms.uFresnelOffset.value = 0
        this.material.uniforms.uFresnelScale.value = 0.5
        this.material.uniforms.uFresnelPower.value = 2
        this.material.uniforms.uSunPosition.value = new THREE.Vector3(- 0.5, - 0.5, - 0.5)
        this.material.uniforms.uViewportSize.value = new THREE.Vector2(this.viewport.width * this.viewport.pixelRatio, this.viewport.height * this.viewport.pixelRatio)
        this.material.uniforms.uFogTexture.value = this.sky.customRender.texture

        // this.material.wireframe = true

        // const dummy = new THREE.Mesh(
        //     new THREE.SphereGeometry(30, 64, 32),
        //     this.material
        // )
        // dummy.position.y = 50
        // this.scene.add(dummy)
    }

    setDebug()
    {
        if(!this.debug.active)
            return

        const debugFolder = this.debug.ui.addFolder('terrains')

        debugFolder
            .add(this.material, 'wireframe')

        debugFolder
            .add(this.material.uniforms.uLightnessSmoothness, 'value')
            .min(0)
            .max(1)
            .step(0.001)
            .name('uLightnessSmoothness')
        
        debugFolder
            .add(this.material.uniforms.uLightnessEdgeMin, 'value')
            .min(0)
            .max(1)
            .step(0.001)
            .name('uLightnessEdgeMin')
        
        debugFolder
            .add(this.material.uniforms.uLightnessEdgeMax, 'value')
            .min(0)
            .max(1)
            .step(0.001)
            .name('uLightnessEdgeMax')
        
        debugFolder
            .add(this.material.uniforms.uFresnelOffset, 'value')
            .min(- 1)
            .max(1)
            .step(0.001)
            .name('uFresnelOffset')
        
        debugFolder
            .add(this.material.uniforms.uFresnelScale, 'value')
            .min(0)
            .max(2)
            .step(0.001)
            .name('uFresnelScale')
        
        debugFolder
            .add(this.material.uniforms.uFresnelPower, 'value')
            .min(1)
            .max(10)
            .step(1)
            .name('uFresnelPower')
    }

    update()
    {
        const sunState = this.state.sun

        this.material.uniforms.uSunPosition.value.set(sunState.position.x, sunState.position.y, sunState.position.z)
    }

    resize()
    {
        this.material.uniforms.uViewportSize.value.set(this.viewport.width * this.viewport.pixelRatio, this.viewport.height * this.viewport.pixelRatio)
    }
}