import * as THREE from 'three'

import Game from './Game.js'
import EventEmitter from './Utils/EventEmitter.js'

export default class Terrain extends EventEmitter
{
    constructor(terrainsManager, id, size, x, z, precision, northSubdivisionRatio, eastSubdivisionRatio, southSubdivisionRatio, westSubdivisionRatio)
    {
        super()

        this.game = new Game()
        this.scene = this.game.scene
        this.mathUtils = this.game.mathUtils

        this.terrainsManager = terrainsManager
        this.id = id
        this.size = size
        this.x = x
        this.z = z
        this.precision = precision
        this.northSubdivisionRatio = northSubdivisionRatio
        this.eastSubdivisionRatio = eastSubdivisionRatio
        this.southSubdivisionRatio = southSubdivisionRatio
        this.westSubdivisionRatio = westSubdivisionRatio

        this.halfSize = this.size * 0.5
        this.ready = false
    }

    create(positions, normals, indices)
    {
        // Destroy in case already exist
        this.destroy()

        this.positions = positions
        this.normals = normals
        this.indices = indices

        // Geometry
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
        this.geometry.setAttribute('normal', new THREE.BufferAttribute(this.normals, 3))
        this.geometry.index = new THREE.BufferAttribute(this.indices, 1, false)
        // this.geometry.computeVertexNormals()

        // Mesh
        this.mesh = new THREE.Mesh(this.geometry, this.terrainsManager.material)
        this.scene.add(this.mesh)

        this.ready = true

        this.trigger('ready')
    }

    // getTopologyForPosition(x, z)
    // {
    //     if(!this.ready)
    //     {
    //         console.warn('terrain not ready')
    //     }

    //     const subdivisions = this.terrainsManager.subdivisions
    //     const segments = subdivisions + 1

    //     // Relative position
    //     const relativeX = x - this.x + this.halfSize
    //     const relativeZ = z - this.z + this.halfSize

    //     // Indexes
    //     const aIndexX = Math.floor(relativeX / subdivisions)
    //     const aIndexZ = Math.floor(relativeZ / subdivisions)
        
    //     const bIndexX = aIndexX + 1
    //     const bIndexZ = aIndexZ
        
    //     const cIndexX = aIndexX
    //     const cIndexZ = aIndexZ + 1
        
    //     const dIndexX = aIndexX + 1
    //     const dIndexZ = aIndexZ + 1

    //     // Positions
    //     const aElevation = this.positions[(aIndexX * segments + aIndexZ) * 3 + 1]
    //     const bElevation = this.positions[(bIndexX * segments + bIndexZ) * 3 + 1]
    //     const cElevation = this.positions[(cIndexX * segments + cIndexZ) * 3 + 1]
    //     const dElevation = this.positions[(dIndexX * segments + dIndexZ) * 3 + 1]

    //     // Ratio
    //     const xRatio = (relativeX / subdivisions) % 1
    //     const zRatio = (relativeZ / subdivisions) % 1

    //     // Bilinear interpolation
    //     const aToBElevation = aElevation + (bElevation - aElevation) * xRatio
    //     const dToCElevation = dElevation + (cElevation - dElevation) * xRatio
    //     const elevation = aToBElevation + (dToCElevation - aToBElevation) * zRatio
        
    //     return elevation
    // }

    getTopologyForPosition(x, z)
    {
        if(!this.ready)
        {
            console.warn('terrain not ready')
            return
        }

        const subdivisions = this.terrainsManager.subdivisions
        const segments = subdivisions + 1
        const subSize = this.size / subdivisions

        // Relative position
        const relativeX = x - this.x + this.halfSize
        const relativeZ = z - this.z + this.halfSize

        // Ratio
        const xRatio = (relativeX / subSize) % 1
        const zRatio = (relativeZ / subSize) % 1
        
        // Indexes
        const aIndexX = Math.floor(relativeX / subSize)
        const aIndexZ = Math.floor(relativeZ / subSize)
            
        const cIndexX = aIndexX + 1
        const cIndexZ = aIndexZ + 1

        const bIndexX = xRatio < zRatio ? aIndexX : aIndexX + 1
        const bIndexZ = xRatio < zRatio ? aIndexZ + 1 : aIndexZ

        const aStrideIndex = (aIndexX * segments + aIndexZ) * 3
        const bStrideIndex = (bIndexX * segments + bIndexZ) * 3
        const cStrideIndex = (cIndexX * segments + cIndexZ) * 3

        // Weights
        const weight1 = xRatio < zRatio ? 1 - zRatio : 1 - xRatio
        const weight2 = xRatio < zRatio ? - (xRatio - zRatio) : xRatio - zRatio
        const weight3 = 1 - weight1 - weight2
        
        // Elevation
        const aElevation = this.positions[aStrideIndex + 1]
        const bElevation = this.positions[bStrideIndex + 1]
        const cElevation = this.positions[cStrideIndex + 1]
        const elevation = aElevation * weight1 + bElevation * weight2 + cElevation * weight3

        // Normal
        const aNormalX = this.normals[aStrideIndex]
        const aNormalY = this.normals[aStrideIndex + 1]
        const aNormalZ = this.normals[aStrideIndex + 2]

        const bNormalX = this.normals[bStrideIndex]
        const bNormalY = this.normals[bStrideIndex + 1]
        const bNormalZ = this.normals[bStrideIndex + 2]

        const cNormalX = this.normals[cStrideIndex]
        const cNormalY = this.normals[cStrideIndex + 1]
        const cNormalZ = this.normals[cStrideIndex + 2]

        const normal = [
            aNormalX * weight1 + bNormalX * weight2 + cNormalX * weight3,
            aNormalY * weight1 + bNormalY * weight2 + cNormalY * weight3,
            aNormalZ * weight1 + bNormalZ * weight2 + cNormalZ * weight3
        ]

        return { elevation, normal }
    }

    destroy()
    {
        if(this.ready)
        {
            this.geometry.dispose()
            this.scene.remove(this.mesh)
        }
    }
}