import * as THREE from 'three'

import View from '@/View/View.js'
import NoisesMaterial from './Materials/NoisesMaterial.js'

export default class Noises
{
    constructor()
    {
        this.view = View.getInstance()
        this.renderer = this.view.renderer
        this.scene = this.view.scene
        
        this.setCustomRender()
        this.setMaterial()
        this.setPlane()
        // this.setHelper()

        // const texture = this.createNoise(128, 128)
    }

    setCustomRender()
    {
        this.customRender = {}
        this.customRender.scene = new THREE.Scene()
        this.customRender.camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0.1, 10)
    }

    setMaterial()
    {
        this.material = new NoisesMaterial()
    }

    setPlane()
    {
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            this.material
        )
        this.plane.frustumCulled = false
        this.customRender.scene.add(this.plane)
    }

    setHelper()
    {
        this.helper = {}
        this.helper.geometry = new THREE.PlaneGeometry(1, 1)
        this.helper.material = new THREE.MeshBasicMaterial()
        
        const meshA = new THREE.Mesh(
            this.helper.geometry,
            this.helper.material
        )
        meshA.position.y = 5 + 1
        meshA.position.x = - 1
        meshA.scale.set(2, 2, 2)
        
        const meshB = new THREE.Mesh(
            this.helper.geometry,
            this.helper.material
        )
        meshB.position.y = 5 + 1
        meshB.position.x = 1
        meshB.scale.set(2, 2, 2)
        
        const meshC = new THREE.Mesh(
            this.helper.geometry,
            this.helper.material
        )
        meshC.position.y = 5 - 1
        meshC.position.x = - 1
        meshC.scale.set(2, 2, 2)
        
        const meshD = new THREE.Mesh(
            this.helper.geometry,
            this.helper.material
        )
        meshD.position.y = 5 - 1
        meshD.position.x = 1
        meshD.scale.set(2, 2, 2)

        window.requestAnimationFrame(() =>
        {
            this.scene.add(meshA)
            // this.scene.add(meshB)
            // this.scene.add(meshC)
            // this.scene.add(meshD)
        })
    }

    create(width, height)
    {
        const renderTarget = new THREE.WebGLRenderTarget(
            width,
            height,
            {
                generateMipmaps: false,
                wrapS: THREE.RepeatWrapping,
                wrapT: THREE.RepeatWrapping
            }
        )
        
        this.renderer.instance.setRenderTarget(renderTarget)
        this.renderer.instance.render(this.customRender.scene, this.customRender.camera)
        this.renderer.instance.setRenderTarget(null)

        const texture = renderTarget.texture
        // texture.wrapS = THREE.RepeatWrapping
        // texture.wrapT = THREE.RepeatWrapping

        if(this.helper)
            this.helper.material.map = texture

        return texture
    }
}
