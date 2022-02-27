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
        this.material.uniforms.uPlayerPosition.value = new THREE.Vector3()
        this.material.uniforms.uGradientTexture.value = this.gradient.texture
        this.material.uniforms.uLightnessSmoothness.value = 0.25
        this.material.uniforms.uFresnelOffset.value = 0
        this.material.uniforms.uFresnelScale.value = 0.5
        this.material.uniforms.uFresnelPower.value = 2
        this.material.uniforms.uSunPosition.value = new THREE.Vector3(- 0.5, - 0.5, - 0.5)
        this.material.uniforms.uFogTexture.value = this.sky.customRender.texture
        this.material.uniforms.uGrassDistance.value = this.state.chunks.minSize

        this.material.onBeforeRender = (renderer, scene, camera, geometry, mesh) =>
        {
            this.material.uniforms.uTexture.value = mesh.userData.texture
            this.material.uniformsNeedUpdate = true
        }

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
        const debug = this.game.debug

        if(!debug.active)
            return

        const folder = debug.ui.getFolder('render/terrains')

        folder
            .add(this.material, 'wireframe')

        folder
            .add(this.material.uniforms.uLightnessSmoothness, 'value')
            .min(0)
            .max(1)
            .step(0.001)
            .name('uLightnessSmoothness')
        
        folder
            .add(this.material.uniforms.uFresnelOffset, 'value')
            .min(- 1)
            .max(1)
            .step(0.001)
            .name('uFresnelOffset')
        
        folder
            .add(this.material.uniforms.uFresnelScale, 'value')
            .min(0)
            .max(2)
            .step(0.001)
            .name('uFresnelScale')
        
        folder
            .add(this.material.uniforms.uFresnelPower, 'value')
            .min(1)
            .max(10)
            .step(1)
            .name('uFresnelPower')
    }

    update()
    {
        const playerState = this.state.player
        const playerPosition = playerState.position.current
        const sunState = this.state.sun

        this.material.uniforms.uPlayerPosition.value.set(playerPosition[0], playerPosition[1], playerPosition[2])
        this.material.uniforms.uSunPosition.value.set(sunState.position.x, sunState.position.y, sunState.position.z)
    }

    resize()
    {
    }
}