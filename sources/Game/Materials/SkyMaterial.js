import * as THREE from 'three'

import vertexShader from '../shaders/sky/vertex.glsl'
import fragmentShader from '../shaders/sky/fragment.glsl'

export default function()
{
    const material = new THREE.ShaderMaterial({
        uniforms:
        {
            uSunPosition: { value: new THREE.Vector3() },
            uColorDayLow: { value: new THREE.Color() },
            uColorDayHigh: { value: new THREE.Color() },
            uColorNightLow: { value: new THREE.Color() },
            uColorNightHigh: { value: new THREE.Color() },
            uColorSun: { value: new THREE.Color() },
            uColorDawn: { value: new THREE.Color() },
            uDayProgress: { value: 0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    return material
}