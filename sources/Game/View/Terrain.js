import GAME from '@/Game.js' 

import * as THREE from 'three'

class Terrain
{
    constructor(terrains, terrainEngine)
    {
        this.world = new GAME.World()
        this.engine = new GAME.ENGINE.Engine()
        this.view = new GAME.VIEW.View()
        this.scene = this.view.scene

        this.terrains = terrains
        this.terrainEngine = terrainEngine
        this.terrainEngine.renderInstance = this

        this.created = false

        this.terrainEngine.on('ready', () =>
        {
            this.create()
        })
    }

    create()
    {
        const terrainsEngine = this.engine.terrains

        // Recreate
        if(this.created)
        {
            // Dispose of old geometry
            this.geometry.dispose()

            // Create new geometry
            this.geometry = new THREE.BufferGeometry()
            this.geometry.setAttribute('position', new THREE.BufferAttribute(this.terrainEngine.positions, 3))
            this.geometry.setAttribute('normal', new THREE.BufferAttribute(this.terrainEngine.normals, 3))
            this.geometry.index = new THREE.BufferAttribute(this.terrainEngine.indices, 1, false)
        
            this.mesh.geometry = this.geometry
        }

        // Create
        else
        {
            // Create geometry
            this.geometry = new THREE.BufferGeometry()
            this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.terrainEngine.positions, 3))
            this.geometry.setAttribute('normal', new THREE.Float32BufferAttribute(this.terrainEngine.normals, 3))
            this.geometry.setAttribute('uv', new THREE.Float32BufferAttribute(this.terrainEngine.uv, 2))
            this.geometry.index = new THREE.BufferAttribute(this.terrainEngine.indices, 1, false)

            // Texture
            this.texture = new THREE.DataTexture(
                this.terrainEngine.texture,
                terrainsEngine.segments,
                terrainsEngine.segments,
                THREE.RGBAFormat,
                THREE.FloatType,
                THREE.UVMapping,
                THREE.ClampToEdgeWrapping,
                THREE.ClampToEdgeWrapping,
                THREE.LinearFilter,
                THREE.LinearFilter
            )
            this.texture.flipY = false
            this.texture.needsUpdate = true

            // // Material
            // this.material = this.terrains.material.clone()
            // this.material.uniforms.uTexture.value = this.texture

            // Create mesh
            this.mesh = new THREE.Mesh(this.geometry, this.terrains.material)
            this.mesh.userData.texture = this.texture
            // this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshNormalMaterial())
            this.scene.add(this.mesh)
            
            this.created = true
        }
    }

    update()
    {

    }

    destroy()
    {
        if(this.created)
        {
            this.geometry.dispose()
            this.scene.remove(this.mesh)
        }
    }
}

GAME.register('VIEW', 'Terrain', Terrain)
export default Terrain