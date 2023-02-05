import * as THREE from 'three'

import vertexShader from './shaders/terrain/vertex.glsl'
import fragmentShader from './shaders/terrain/fragment.glsl'

export default function TerrainMaterial()
{
    const material = new THREE.ShaderMaterial({
        uniforms:
        {
            uPlayerPosition: { value: null },
            uGradientTexture: { value: null },
            uLightnessSmoothness: { value: null },
            uFresnelOffset: { value: null },
            uFresnelScale: { value: null },
            uFresnelPower: { value: null },
            uSunPosition: { value: null },
            uFogTexture: { value: null },
            uGrassDistance: { value: null },
            uTexture: { value: null }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    return material
}
