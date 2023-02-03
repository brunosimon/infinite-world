import Registry from '@/Registry.js' 

import * as THREE from 'three'

import vertexShader from './shaders/noises/vertex.glsl'
import fragmentShader from './shaders/noises/fragment.glsl'

function Noises()
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

Registry.register('View.MATERIALS', 'Noises', Noises)
export default Noises