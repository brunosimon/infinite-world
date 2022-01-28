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

const getElevation = (x, y, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power) =>
{
    let elevation = 0
    let frequency = baseFrequency
    let amplitude = 1
    let normalisation = 0

    for(let i = 0; i < iterations; i++)
    {
        const noise = simplexNoise.noise2D(x * frequency + 765.432, y * frequency - 123.456)
        elevation += noise * amplitude

        normalisation += amplitude
        amplitude *= persistence
        frequency *= lacunarity
    }

    elevation /= normalisation
    elevation = Math.pow(Math.abs(elevation), power) * Math.sign(elevation)
    elevation *= baseAmplitude
    elevation += 1

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
    const edgeXMinSubdivisionRatio = event.data.edgeXMinSubdivisionRatio
    const edgeXMaxSubdivisionRatio = event.data.edgeXMaxSubdivisionRatio
    const edgeZMinSubdivisionRatio = event.data.edgeZMinSubdivisionRatio
    const edgeZMaxSubdivisionRatio = event.data.edgeZMaxSubdivisionRatio

    const segments = subdivisions + 1
    simplexNoise = new SimplexNoise(seed)

    /**
     * Positions
     */
    const overflowPositions = new Float32Array((segments + 1) * (segments + 1) * 3) // Bigger to calculate normals more accurately
    const positions = new Float32Array(segments * segments * 3)
    
    for(let iX = 0; iX < segments + 1; iX ++)
    {
        const x = baseX + (iX / subdivisions - 0.5) * size

        for(let iZ = 0; iZ < segments + 1; iZ ++)
        {
            const z = baseZ + (iZ / subdivisions - 0.5) * size
            let elevation = 0

            if(edgeXMinSubdivisionRatio > 1 && iX === 0 && iZ % edgeXMinSubdivisionRatio > 0)
            {
                const aIZ = Math.floor(iZ / edgeXMinSubdivisionRatio) * edgeXMinSubdivisionRatio
                const aZ = baseZ + (aIZ / subdivisions - 0.5) * size
                const aElevation = getElevation(x, aZ, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power)
                
                const bIZ = Math.ceil(iZ / edgeXMinSubdivisionRatio) * edgeXMinSubdivisionRatio
                const bZ = baseZ + (bIZ / subdivisions - 0.5) * size
                const bElevation = getElevation(x, bZ, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power)

                const ratio = iZ % edgeXMinSubdivisionRatio / edgeXMinSubdivisionRatio
                elevation = aElevation + (bElevation - aElevation) * ratio
            }
            else if(edgeXMaxSubdivisionRatio > 1 && iX === segments - 1 && iZ % edgeXMaxSubdivisionRatio > 0)
            {
                const aIZ = Math.floor(iZ / edgeXMaxSubdivisionRatio) * edgeXMaxSubdivisionRatio
                const aZ = baseZ + (aIZ / subdivisions - 0.5) * size
                const aElevation = getElevation(x, aZ, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power)
                
                const bIZ = Math.ceil(iZ / edgeXMaxSubdivisionRatio) * edgeXMaxSubdivisionRatio
                const bZ = baseZ + (bIZ / subdivisions - 0.5) * size
                const bElevation = getElevation(x, bZ, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power)

                const ratio = iZ % edgeXMaxSubdivisionRatio / edgeXMaxSubdivisionRatio
                elevation = aElevation + (bElevation - aElevation) * ratio
            }
            else if(edgeZMinSubdivisionRatio > 1 && iZ === 0 && iX % edgeZMinSubdivisionRatio > 0)
            {
                const aIX = Math.floor(iX / edgeZMinSubdivisionRatio) * edgeZMinSubdivisionRatio
                const aX = baseZ + (aIX / subdivisions - 0.5) * size
                const aElevation = getElevation(aX, z, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power)
                
                const bIX = Math.ceil(iX / edgeZMinSubdivisionRatio) * edgeZMinSubdivisionRatio
                const bX = baseZ + (bIX / subdivisions - 0.5) * size
                const bElevation = getElevation(bX, z, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power)

                const ratio = iX % edgeZMinSubdivisionRatio / edgeZMinSubdivisionRatio
                elevation = aElevation + (bElevation - aElevation) * ratio
            }
            else if(edgeZMaxSubdivisionRatio > 1 && iZ === segments - 1 && iX % edgeZMaxSubdivisionRatio > 0)
            {
                const aIX = Math.floor(iX / edgeZMaxSubdivisionRatio) * edgeZMaxSubdivisionRatio
                const aX = baseZ + (aIX / subdivisions - 0.5) * size
                const aElevation = getElevation(aX, z, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power)
                
                const bIX = Math.ceil(iX / edgeZMaxSubdivisionRatio) * edgeZMaxSubdivisionRatio
                const bX = baseZ + (bIX / subdivisions - 0.5) * size
                const bElevation = getElevation(bX, z, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power)

                const ratio = iX % edgeZMaxSubdivisionRatio / edgeZMaxSubdivisionRatio
                elevation = aElevation + (bElevation - aElevation) * ratio
            }
            else
            {
                elevation = getElevation(x, z, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power)
            }
            
            const iOverflowStride = (iX * (segments + 1) + iZ) * 3
            overflowPositions[iOverflowStride    ] = x
            overflowPositions[iOverflowStride + 1] = elevation
            overflowPositions[iOverflowStride + 2] = z

            if(iX < segments && iZ < segments)
            {
                const iStride = (iX * segments + iZ) * 3
                positions[iStride    ] = x
                positions[iStride + 1] = elevation
                positions[iStride + 2] = z
            }

            const linearStepCount = 3
            if(iX === 0 || iX % linearStepCount)
            {
            }

        }
    }
    
    /**
     * Normals
     */
    const normals = new Float32Array(segments * segments * 3)
    
    const interSegmentX = - size / subdivisions
    const interSegmentZ = - size / subdivisions
    
    for(let iX = 0; iX < segments; iX ++)
    {
        for(let iZ = 0; iZ < segments; iZ ++)
        {
            // Indexes
            const iOverflowStride = (iX * (segments + 1) + iZ) * 3

            // Elevations
            const currentElevation = overflowPositions[iOverflowStride + 1]
            const neighbourXElevation = overflowPositions[iOverflowStride + (segments + 1) * 3 + 1]
            const neighbourZElevation = overflowPositions[iOverflowStride + 3 + 1]

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
    const indices = new (indicesCount < 65535 ? Uint16Array : Uint32Array)(indicesCount * 6)
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

    // Post
    postMessage({ id, positions, normals, indices })
}