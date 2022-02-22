import * as THREE from 'three'

import Game from '@/Game.js'
import Render from '@/Render/Render.js'
import State from '@/State/State.js'
import GrassMaterial from '@/Render/Materials/GrassMaterial.js'

export default class Grass
{
    constructor()
    {
        this.game = new Game()
        this.render = new Render()
        this.state = new State()
        this.scene = this.render.scene

        this.details = 120
        this.size = 100
        this.count = this.details * this.details
        this.fragmentSize = this.size / this.details
        this.bladeWidthRatio = 0.8
        this.bladeHeightRatio = 1.5
        this.bladeHeightRandomness = 0
        this.positionRandomness = 0

        // const gridHelper = new THREE.GridHelper(100, 100)
        // this.scene.add(gridHelper)

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(200, 200),
            new THREE.MeshBasicMaterial({ color: 'rgb(102, 127, 51)' })
        )
        floor.rotation.x = - Math.PI * 0.5
        this.scene.add(floor)

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
        const centers = new Float32Array(this.count * 3 * 3)
        const positions = new Float32Array(this.count * 3 * 3)
        const tipness = new Float32Array(this.count * 3)

        for(let iX = 0; iX < this.details; iX++)
        {
            const fragmentX = (iX / this.details - 0.5) * this.size + this.fragmentSize * 0.5
            
            for(let iZ = 0; iZ < this.details; iZ++)
            {
                const fragmentZ = (iZ / this.details - 0.5) * this.size + this.fragmentSize * 0.5

                const iStride9 = (iX * this.details + iZ) * 9
                const iStride3 = (iX * this.details + iZ) * 3

                // Center (for blade rotation)
                const centerX = fragmentX + (Math.random() - 0.5) * this.fragmentSize * this.positionRandomness
                const centerZ = fragmentZ + (Math.random() - 0.5) * this.fragmentSize * this.positionRandomness

                centers[iStride9    ] = centerX
                centers[iStride9 + 1] = 0
                centers[iStride9 + 2] = centerZ

                centers[iStride9 + 3] = centerX
                centers[iStride9 + 4] = 0
                centers[iStride9 + 5] = centerZ

                centers[iStride9 + 6] = centerX
                centers[iStride9 + 7] = 0
                centers[iStride9 + 8] = centerZ

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

                // Tipness
                tipness[iStride3    ] = 0
                tipness[iStride3 + 1] = 1
                tipness[iStride3 + 2] = 0
            }
        }
        
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('center', new THREE.Float32BufferAttribute(centers, 3))
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        this.geometry.setAttribute('tipness', new THREE.Float32BufferAttribute(tipness, 1))
    }

    setMaterial()
    {
        // this.material = new THREE.MeshBasicMaterial({ wireframe: true, color: 'green' })
        this.material = new GrassMaterial()
        this.material.uniforms.uPlayerPosition.value = new THREE.Vector3()
        this.material.uniforms.uSize.value = this.size
        this.material.uniforms.uTerrainATexture.value = null
        this.material.uniforms.uTerrainASize.value = null
        this.material.uniforms.uTerrainAOffset.value = new THREE.Vector2()
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
        const playerState = this.state.player
        const playerPosition = playerState.position.current
        const chunksState = this.state.chunks

        this.mesh.position.set(playerPosition[0], 0, playerPosition[2])
        // this.mesh.position.set(playerPosition[0], playerPosition[1], playerPosition[2])
        this.material.uniforms.uPlayerPosition.value.set(playerPosition[0], playerPosition[1], playerPosition[2])
    
        // Get terrain data
        const currentChunkState = chunksState.getDeepestChunkForPosition(playerPosition[0], playerPosition[2])

        // console.log(currentChunkState)

        if(currentChunkState && currentChunkState.terrain && currentChunkState.terrain.renderInstance.texture)
        {
            this.material.uniforms.uTerrainATexture.value = currentChunkState.terrain.renderInstance.texture
            this.material.uniforms.uTerrainASize.value = currentChunkState.size
            this.material.uniforms.uTerrainAOffset.value.set(
                ((playerPosition[0] - currentChunkState.x + currentChunkState.size * 0.5) / currentChunkState.size) % 1,
                ((playerPosition[2] - currentChunkState.z + currentChunkState.size * 0.5) / currentChunkState.size) % 1
            )

            // console.log(this.material.uniforms.uTerrainASize.value)
        }
    }
}