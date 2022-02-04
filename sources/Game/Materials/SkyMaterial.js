import * as THREE from 'three'

import vertexShader from '../shaders/sky/vertex.glsl'
import fragmentShader from '../shaders/sky/fragment.glsl'

export default function()
{
    const material = new THREE.ShaderMaterial({
        uniforms:
        {
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    return material
}