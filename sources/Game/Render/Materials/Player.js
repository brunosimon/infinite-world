import GAME from '@/Game.js' 

import * as THREE from 'three'

import vertexShader from './shaders/player/vertex.glsl'
import fragmentShader from './shaders/player/fragment.glsl'

function Player()
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

GAME.register('RENDER.MATERIALS', 'Player', Player)
export default Player