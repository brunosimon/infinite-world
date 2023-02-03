import GAME from '@/Game.js' 

import * as THREE from 'three'

class Grass
{
    constructor()
    {
        this.world = new GAME.World()
        this.view = new GAME.VIEW.View()
        this.engine = new GAME.ENGINE.Engine()
        this.time = this.world.time
        this.scene = this.view.scene
        this.noises = this.view.noises

        this.details = 200
        this.size = this.engine.chunks.minSize
        this.count = this.details * this.details
        this.fragmentSize = this.size / this.details
        this.bladeWidthRatio = 1.5
        this.bladeHeightRatio = 4
        this.bladeHeightRandomness = 0.5
        this.positionRandomness = 0.5
        this.noiseTexture = this.noises.create(128, 128)

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
        const centers = new Float32Array(this.count * 3 * 2)
        const positions = new Float32Array(this.count * 3 * 3)
        // const tipness = new Float32Array(this.count * 3)

        for(let iX = 0; iX < this.details; iX++)
        {
            const fragmentX = (iX / this.details - 0.5) * this.size + this.fragmentSize * 0.5
            
            for(let iZ = 0; iZ < this.details; iZ++)
            {
                const fragmentZ = (iZ / this.details - 0.5) * this.size + this.fragmentSize * 0.5

                const iStride9 = (iX * this.details + iZ) * 9
                const iStride6 = (iX * this.details + iZ) * 6
                // const iStride3 = (iX * this.details + iZ) * 3

                // Center (for blade rotation)
                const centerX = fragmentX + (Math.random() - 0.5) * this.fragmentSize * this.positionRandomness
                const centerZ = fragmentZ + (Math.random() - 0.5) * this.fragmentSize * this.positionRandomness

                centers[iStride6    ] = centerX
                centers[iStride6 + 1] = centerZ

                centers[iStride6 + 2] = centerX
                centers[iStride6 + 3] = centerZ

                centers[iStride6 + 4] = centerX
                centers[iStride6 + 5] = centerZ

                // Position
                const bladeWidth = this.fragmentSize * this.bladeWidthRatio
                const bladeHalfWidth = bladeWidth * 0.5
                const bladeHeight = this.fragmentSize * this.bladeHeightRatio * (1 - this.bladeHeightRandomness + Math.random() * this.bladeHeightRandomness)

                positions[iStride9    ] = - bladeHalfWidth
                positions[iStride9 + 1] = 0
                positions[iStride9 + 2] = 0

                positions[iStride9 + 3] = 0
                positions[iStride9 + 4] = bladeHeight
                positions[iStride9 + 5] = 0

                positions[iStride9 + 6] = bladeHalfWidth
                positions[iStride9 + 7] = 0
                positions[iStride9 + 8] = 0

                // // Tipness
                // tipness[iStride3    ] = 0
                // tipness[iStride3 + 1] = 1
                // tipness[iStride3 + 2] = 0
            }
        }
        
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('center', new THREE.Float32BufferAttribute(centers, 2))
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        // this.geometry.setAttribute('tipness', new THREE.Float32BufferAttribute(tipness, 1))
    }

    setMaterial()
    {
        const chunksEngine = this.engine.chunks
        const terrainsSate = this.engine.terrains

        // this.material = new THREE.MeshBasicMaterial({ wireframe: true, color: 'green' })
        this.material = new GAME.VIEW.MATERIALS.Grass()
        this.material.uniforms.uTime.value = 0
        this.material.uniforms.uGrassDistance.value = this.size
        this.material.uniforms.uPlayerPosition.value = new THREE.Vector3()
        this.material.uniforms.uTerrainSize.value = chunksEngine.minSize
        this.material.uniforms.uTerrainTextureSize.value = terrainsSate.segments
        this.material.uniforms.uTerrainATexture.value = null
        this.material.uniforms.uTerrainAOffset.value = new THREE.Vector2()
        this.material.uniforms.uTerrainBTexture.value = null
        this.material.uniforms.uTerrainBOffset.value = new THREE.Vector2()
        this.material.uniforms.uTerrainCTexture.value = null
        this.material.uniforms.uTerrainCOffset.value = new THREE.Vector2()
        this.material.uniforms.uTerrainDTexture.value = null
        this.material.uniforms.uTerrainDOffset.value = new THREE.Vector2()
        this.material.uniforms.uNoiseTexture.value = this.noiseTexture
        this.material.uniforms.uFresnelOffset.value = 0
        this.material.uniforms.uFresnelScale.value = 0.5
        this.material.uniforms.uFresnelPower.value = 2
        this.material.uniforms.uSunPosition.value = new THREE.Vector3(- 0.5, - 0.5, - 0.5)
        // this.material.wireframe = true
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(
            this.geometry,
            this.material
        )
        this.mesh.frustumCulled = false
        this.scene.add(this.mesh)
    }

    update()
    {
        const playerEngine = this.engine.player
        const playerPosition = playerEngine.position.current
        const chunksEngine = this.engine.chunks
        const sunEngine = this.engine.sun

        this.material.uniforms.uTime.value = this.time.elapsed
        this.material.uniforms.uSunPosition.value.set(sunEngine.position.x, sunEngine.position.y, sunEngine.position.z)
        
        this.mesh.position.set(playerPosition[0], 0, playerPosition[2])
        // this.mesh.position.set(playerPosition[0], playerPosition[1], playerPosition[2])
        this.material.uniforms.uPlayerPosition.value.set(playerPosition[0], playerPosition[1], playerPosition[2])
    
        // Get terrain data
        const aChunkEngine = chunksEngine.getDeepestChunkForPosition(playerPosition[0], playerPosition[2])

        if(aChunkEngine && aChunkEngine.terrain && aChunkEngine.terrain.renderInstance.texture)
        {
            // Texture A
            this.material.uniforms.uTerrainATexture.value = aChunkEngine.terrain.renderInstance.texture
            this.material.uniforms.uTerrainAOffset.value.set(
                aChunkEngine.x - aChunkEngine.size * 0.5,
                aChunkEngine.z - aChunkEngine.size * 0.5
            )
            
            const chunkPositionRatioX = (playerPosition[0] - aChunkEngine.x + aChunkEngine.size * 0.5) / aChunkEngine.size
            const chunkPositionRatioZ = (playerPosition[2] - aChunkEngine.z + aChunkEngine.size * 0.5) / aChunkEngine.size
            
            // Texture B
            const bChunkSate = aChunkEngine.neighbours.get(chunkPositionRatioX < 0.5 ? 'w' : 'e')

            if(bChunkSate && bChunkSate.terrain && bChunkSate.terrain.renderInstance.texture)
            {
                this.material.uniforms.uTerrainBTexture.value = bChunkSate.terrain.renderInstance.texture
                this.material.uniforms.uTerrainBOffset.value.set(
                    bChunkSate.x - bChunkSate.size * 0.5,
                    bChunkSate.z - bChunkSate.size * 0.5
                )
            }
            
            // Texture C
            const cChunkSate = aChunkEngine.neighbours.get(chunkPositionRatioZ < 0.5 ? 'n' : 's')

            if(cChunkSate && cChunkSate.terrain && cChunkSate.terrain.renderInstance.texture)
            {
                this.material.uniforms.uTerrainCTexture.value = cChunkSate.terrain.renderInstance.texture
                this.material.uniforms.uTerrainCOffset.value.set(
                    cChunkSate.x - cChunkSate.size * 0.5,
                    cChunkSate.z - cChunkSate.size * 0.5
                )
            }
            
            // Texture D
            const dChunkSate = bChunkSate.neighbours.get(chunkPositionRatioZ < 0.5 ? 'n' : 's')

            if(dChunkSate && dChunkSate.terrain && dChunkSate.terrain.renderInstance.texture)
            {
                this.material.uniforms.uTerrainDTexture.value = dChunkSate.terrain.renderInstance.texture
                this.material.uniforms.uTerrainDOffset.value.set(
                    dChunkSate.x - dChunkSate.size * 0.5,
                    dChunkSate.z - dChunkSate.size * 0.5
                )
            }
        }
    }
}

GAME.register('VIEW', 'Grass', Grass)
export default Grass