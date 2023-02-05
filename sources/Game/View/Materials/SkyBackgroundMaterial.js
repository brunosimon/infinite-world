import * as THREE from 'three'

import vertexShader from './shaders/skyBackground/vertex.glsl'
import fragmentShader from './shaders/skyBackground/fragment.glsl'

export default function SkyBackgroundMaterial()
{
    const material = new THREE.ShaderMaterial({
        uniforms:
        {
            uTexture: { value: null }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    return material
}