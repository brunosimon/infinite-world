import Registry from '@/Registry.js' 

import * as THREE from 'three'

import vertexShader from './shaders/stars/vertex.glsl'
import fragmentShader from './shaders/stars/fragment.glsl'

function Stars()
{
    const material = new THREE.ShaderMaterial({
        uniforms:
        {
            uSunPosition: { value: new THREE.Vector3() },
            uSize: { value: 0.01 },
            uBrightness: { value: 0.5 },
            uHeightFragments: { value: null }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    return material
}

Registry.register('View.MATERIALS', 'Stars', Stars)
export default Stars