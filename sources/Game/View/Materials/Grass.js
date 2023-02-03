import GAME from '@/Game.js' 

import * as THREE from 'three'

import vertexShader from './shaders/grass/vertex.glsl'
import fragmentShader from './shaders/grass/fragment.glsl'

function Grass()
{
    const material = new THREE.ShaderMaterial({
        uniforms:
        {
            uTime: { value: null },
            uGrassDistance: { value: null },
            uPlayerPosition: { value: null },
            uTerrainSize: { value: null },
            uTerrainTextureSize: { value: null },
            uTerrainATexture: { value: null },
            uTerrainAOffset: { value: null },
            uTerrainBTexture: { value: null },
            uTerrainBOffset: { value: null },
            uTerrainCTexture: { value: null },
            uTerrainCOffset: { value: null },
            uTerrainDTexture: { value: null },
            uTerrainDOffset: { value: null },
            uNoiseTexture: { value: null },
            uFresnelOffset: { value: null },
            uFresnelScale: { value: null },
            uFresnelPower: { value: null },
            uSunPosition: { value: null },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    return material
}

GAME.register('VIEW.MATERIALS', 'Grass', Grass)
export default Grass