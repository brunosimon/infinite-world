import SimplexNoise from './SimplexNoise.js'

let simplexNoise = null

const getElevation = (x, y, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power) =>
{
    let elevation = 0
    let frequency = baseFrequency
    let amplitude = baseAmplitude
    let normalisation = 0

    for(let i = 0; i < iterations; i++)
    {
        const noise = simplexNoise.noise2D(x * frequency, y * frequency) * 0.5 + 0.5
        elevation += noise * amplitude

        normalisation += amplitude
        amplitude *= persistence
        frequency *= lacunarity
    }

    elevation /= normalisation
    elevation = Math.pow(elevation, power)

    return elevation
}

const crossProduct = (a, b) =>
{
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ]
}

onmessage = function(event)
{
    const id = event.data.id
    const baseX = event.data.x
    const baseZ = event.data.z
    const seed = event.data.seed
    const subdivisions = event.data.subdivisions
    const size = event.data.size
    const lacunarity = event.data.lacunarity
    const persistence = event.data.persistence
    const iterations = event.data.iterations
    const baseFrequency = event.data.baseFrequency
    const baseAmplitude = event.data.baseAmplitude
    const power = event.data.power

    const segments = subdivisions + 1
    simplexNoise = new SimplexNoise(seed)

    /**
     * Positions
     */
    const positions = new Float32Array(segments * segments * 3)
    
    for(let iX = 0; iX < segments; iX ++)
    {
        const x = baseX + (iX / subdivisions - 0.5) * size

        for(let iZ = 0; iZ < segments; iZ ++)
        {
            const iStride = (iX * segments + iZ) * 3
            const z = baseZ + (iZ / subdivisions - 0.5) * size

            const elevation = getElevation(x, z, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power)
            
            positions[iStride    ] = x
            positions[iStride + 1] = elevation
            positions[iStride + 2] = z
        }
    }

    /**
     * Normals
     */
    const normals = new Float32Array(segments * segments * 3)
    
    const interSegmentX = - size / subdivisions
    const interSegmentZ = - size / subdivisions
    
    for(let iX = 0; iX < segments - 1; iX ++)
    {
        for(let iZ = 0; iZ < segments - 1; iZ ++)
        {
            // Indexes
            const iStride = (iX * segments + iZ) * 3
            const iXClamped = Math.min(iX, segments - 2)
            const iZClamped = Math.min(iZ, segments - 2)
            const iStrideClamped = (iXClamped * segments + iZClamped) * 3

            // Elevations
            const currentElevation = positions[iStrideClamped + 1]
            const neighbourXElevation = positions[iStrideClamped + segments * 3 + 1]
            const neighbourZElevation = positions[iStrideClamped + 3 + 1]

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
            const normal = crossProduct(deltaZ, deltaX)

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