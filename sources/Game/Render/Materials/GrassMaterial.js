import * as THREE from 'three'

import vertexShader from '../shaders/grass/vertex.glsl'
import fragmentShader from '../shaders/grass/fragment.glsl'

export default function()
{
    const material = new THREE.ShaderMaterial({
        uniforms:
        {
            uSize: { value: null },
            uPlayerPosition: { value: null },
            uTerrainATexture: { value: null },
            uTerrainASize: { value: null },
            uTerrainAOffset: { value: null }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    return material
}