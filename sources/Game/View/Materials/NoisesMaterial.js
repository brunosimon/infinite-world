import * as THREE from 'three'

import vertexShader from './shaders/noises/vertex.glsl'
import fragmentShader from './shaders/noises/fragment.glsl'

export default function NoisesMaterial()
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