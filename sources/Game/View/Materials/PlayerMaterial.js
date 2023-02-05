import * as THREE from 'three'

import vertexShader from './shaders/player/vertex.glsl'
import fragmentShader from './shaders/player/fragment.glsl'

export default function PlayerMaterial()
{
    const material = new THREE.ShaderMaterial({
        uniforms:
        {
            uColor: { value: null },
            uLightnessSmoothness: { value: null },
            uSunPosition: { value: null }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    return material
}
