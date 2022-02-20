import SimplexNoise from './SimplexNoise.js'

let simplexNoise = null

const crossProduct = (a, b) =>
{
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ]
}

const normalize = (vector) =>
{
    const length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2])
    return [
        vector[0] / length,
        vector[1] / length,
        vector[2] / length
    ]
}

const getElevation = (x, y, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power, elevationOffset, iterationsOffsets) =>
{
    let elevation = 0
    let frequency = baseFrequency
    let amplitude = 1
    let normalisation = 0

    for(let i = 0; i < iterations; i++)
    {
        const noise = simplexNoise.noise2D(x * frequency + iterationsOffsets[i][0], y * frequency + iterationsOffsets[i][1])
        elevation += noise * amplitude

        normalisation += amplitude
        amplitude *= persistence
        frequency *= lacunarity
    }

    elevation /= normalisation
    elevation = Math.pow(Math.abs(elevation), power) * Math.sign(elevation)
    elevation *= baseAmplitude
    elevation += elevationOffset

    return elevation
}

onmessage = function(event)
{
    const id = event.data.id
    const size = event.data.size
    const baseX = event.data.x
    const baseZ = event.data.z
    const seed = event.data.seed
    const subdivisions = event.data.subdivisions
    const lacunarity = event.data.lacunarity
    const persistence = event.data.persistence
    const iterations = event.data.iterations
    const baseFrequency = event.data.baseFrequency
    const baseAmplitude = event.data.baseAmplitude
    const power = event.data.power
    const elevationOffset = event.data.elevationOffset
    const iterationsOffsets = event.data.iterationsOffsets
    
    const segments = subdivisions + 1
    simplexNoise = new SimplexNoise(seed)

    /**
     * Positions
     */
    const skirtCount = subdivisions * 4 + 4
    const basePositions = new Float32Array((segments + 1) * (segments + 1) * 3) // Bigger to calculate normals more accurately
    const positions = new Float32Array(segments * segments * 3 + skirtCount * 3)

    for(let iX = 0; iX < segments + 1; iX++)
    {
        const x = baseX + (iX / subdivisions - 0.5) * size

        for(let iZ = 0; iZ < segments + 1; iZ++)
        {
            const z = baseZ + (iZ / subdivisions - 0.5) * size
            const elevation = getElevation(x, z, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power, elevationOffset, iterationsOffsets)

            const iReferenceStride = (iX * (segments + 1) + iZ) * 3
            basePositions[iReferenceStride    ] = x
            basePositions[iReferenceStride + 1] = elevation
            basePositions[iReferenceStride + 2] = z

            if(iX < segments && iZ < segments)
            {
                const iStride = (iX * segments + iZ) * 3
                positions[iStride    ] = x
                positions[iStride + 1] = elevation
                positions[iStride + 2] = z
            }
        }
    }
    
    /**
     * Normals
     */
    const normals = new Float32Array(segments * segments * 3 + skirtCount * 3)
    
    const interSegmentX = - size / subdivisions
    const interSegmentZ = - size / subdivisions

    for(let iX = 0; iX < segments; iX ++)
    {
        for(let iZ = 0; iZ < segments; iZ ++)
        {
            // Indexes
            const iReferenceStride = (iX * (segments + 1) + iZ) * 3

            // Elevations
            const currentElevation = basePositions[iReferenceStride + 1]
            const neighbourXElevation = basePositions[iReferenceStride + (segments + 1) * 3 + 1]
            const neighbourZElevation = basePositions[iReferenceStride + 3 + 1]

            // Deltas
            const deltaX = [
                interSegmentX,
                currentElevation - neighbourXElevation,
                0
            ]

            const deltaZ = [
                0,
                currentElevation - neighbourZElevation,
                interSegmentZ
            ]

            // Normal
            const normal = normalize(crossProduct(deltaZ, deltaX))

            const iStride = (iX * segments + iZ) * 3
            normals[iStride    ] = normal[0]
            normals[iStride + 1] = normal[1]
            normals[iStride + 2] = normal[2]
        }
    }

    /**
     * Indices
     */
    const indicesCount = subdivisions * subdivisions
    const indices = new (indicesCount < 65535 ? Uint16Array : Uint32Array)(indicesCount * 6 + subdivisions * 4 * 6 * 4)
    
    for(let iX = 0; iX < subdivisions; iX++)
    {
        for(let iZ = 0; iZ < subdivisions; iZ++)
        {
            const a = iX * (subdivisions + 1) + (iZ + 1)
            const b = iX * (subdivisions + 1) + iZ
            const c = (iX + 1) * (subdivisions + 1) + iZ
            const d = (iX + 1) * (subdivisions + 1) + (iZ + 1)

            const iStride = (iX * subdivisions + iZ) * 6
            indices[iStride    ] = d
            indices[iStride + 1] = b
            indices[iStride + 2] = a

            indices[iStride + 3] = d
            indices[iStride + 4] = c
            indices[iStride + 5] = b
        }
    }
    
    /**
     * Skirt
     */
    let skirtIndex = segments * segments
    let indicesSkirtIndex = segments * segments
    for(let iZ = 0; iZ < segments; iZ ++)
    {
        const iPosition = (0 * segments + iZ)
        const iPositionStride = iPosition * 3

        // Position
        positions[skirtIndex * 3    ] = positions[iPositionStride + 0]
        positions[skirtIndex * 3 + 1] = positions[iPositionStride + 1] - 8
        positions[skirtIndex * 3 + 2] = positions[iPositionStride + 2]

        // Normal
        normals[skirtIndex * 3    ] = normals[iPositionStride + 0]
        normals[skirtIndex * 3 + 1] = normals[iPositionStride + 1]
        normals[skirtIndex * 3 + 2] = normals[iPositionStride + 2]

        // Index
        if(iZ < segments - 1)
        {
            const a = iPosition
            const b = iPosition + 1
            const c = skirtIndex
            const d = skirtIndex + 1

            const iIndexStride = indicesSkirtIndex * 6
            indices[iIndexStride    ] = a
            indices[iIndexStride + 1] = d
            indices[iIndexStride + 2] = b

            indices[iIndexStride + 3] = d
            indices[iIndexStride + 4] = a
            indices[iIndexStride + 5] = c

            indicesSkirtIndex++
        }

        skirtIndex++
    }
    
    for(let iZ = 0; iZ < segments; iZ++)
    {
        const iX = segments - 1
        const iPosition = iX * segments + iZ
        const iPositionStride = iPosition * 3

        // Position
        positions[skirtIndex * 3    ] = positions[iPositionStride + 0]
        positions[skirtIndex * 3 + 1] = positions[iPositionStride + 1] - 8
        positions[skirtIndex * 3 + 2] = positions[iPositionStride + 2]

        // Normal
        normals[skirtIndex * 3    ] = normals[iPositionStride + 0]
        normals[skirtIndex * 3 + 1] = normals[iPositionStride + 1]
        normals[skirtIndex * 3 + 2] = normals[iPositionStride + 2]

        // Index
        if(iZ < segments - 1)
        {
            const a = iPosition
            const b = iPosition + 1
            const c = skirtIndex
            const d = skirtIndex + 1

            const iIndexStride = indicesSkirtIndex * 6
            indices[iIndexStride    ] = b
            indices[iIndexStride + 1] = c
            indices[iIndexStride + 2] = a

            indices[iIndexStride + 3] = c
            indices[iIndexStride + 4] = b
            indices[iIndexStride + 5] = d

            indicesSkirtIndex++
        }
        
        skirtIndex++
    }

    for(let iX = 0; iX < segments; iX++)
    {
        const iZ = 0
        const iPosition = (iX * segments + iZ)
        const iPositionStride = iPosition * 3

        // Position
        positions[skirtIndex * 3    ] = positions[iPositionStride + 0]
        positions[skirtIndex * 3 + 1] = positions[iPositionStride + 1] - 8
        positions[skirtIndex * 3 + 2] = positions[iPositionStride + 2]

        // Normal
        normals[skirtIndex * 3    ] = normals[iPositionStride + 0]
        normals[skirtIndex * 3 + 1] = normals[iPositionStride + 1]
        normals[skirtIndex * 3 + 2] = normals[iPositionStride + 2]

        // Index
        if(iX < segments - 1)
        {
            const a = iPosition
            const b = iPosition + segments
            const c = skirtIndex
            const d = skirtIndex + 1

            const iIndexStride = indicesSkirtIndex * 6
            indices[iIndexStride    ] = b
            indices[iIndexStride + 1] = c
            indices[iIndexStride + 2] = a

            indices[iIndexStride + 3] = c
            indices[iIndexStride + 4] = b
            indices[iIndexStride + 5] = d

            indicesSkirtIndex++
        }

        skirtIndex++
    }

    for(let iX = 0; iX < segments; iX++)
    {
        const iZ = segments - 1
        const iPosition = (iX * segments + iZ)
        const iPositionStride = iPosition * 3

        // Position
        positions[skirtIndex * 3    ] = positions[iPositionStride + 0]
        positions[skirtIndex * 3 + 1] = positions[iPositionStride + 1] - 8
        positions[skirtIndex * 3 + 2] = positions[iPositionStride + 2]

        // Normal
        normals[skirtIndex * 3    ] = normals[iPositionStride + 0]
        normals[skirtIndex * 3 + 1] = normals[iPositionStride + 1]
        normals[skirtIndex * 3 + 2] = normals[iPositionStride + 2]

        // Index
        if(iX < segments - 1)
        {
            const a = iPosition
            const b = iPosition + segments
            const c = skirtIndex
            const d = skirtIndex + 1

            const iIndexStride = indicesSkirtIndex * 6
            indices[iIndexStride    ] = a
            indices[iIndexStride + 1] = d
            indices[iIndexStride + 2] = b

            indices[iIndexStride + 3] = d
            indices[iIndexStride + 4] = a
            indices[iIndexStride + 5] = c

            indicesSkirtIndex++
        }

        skirtIndex++
    }

    // Post
    postMessage({ id, basePositions, positions, normals, indices })
}