import Perlin from './Perlin.js'
import Terrain from './Terrain.js'

export default class TerrainsManager
{
    constructor()
    {
        this.perlin = new Perlin()
        this.seed = 'd'
        this.subdivisions = 200
        this.lacunarity = 2.25
        this.persistence = 0.5
        this.iterations = 6
        this.baseFrequency = 0.02
        this.baseAmplitude = 30
        this.power = 4

        this.segments = this.subdivisions + 1

        this.lastId = 0
        this.terrains = new Map()

        this.setWorkers()
    }

    setWorkers()
    {
        this.worker = new Worker('/static/workers/terrain.js', { type: 'module' })

        this.worker.onmessage = (event) =>
        {
            console.timeEnd(`terrainsManager: worker (${event.data.id})`)

            const terrain = this.terrains.get(event.data.id)

            if(terrain)
            {
                terrain.set(event.data.positions, event.data.normals, event.data.indices)
            }
        }
    }

    createTerrain(size, x, z)
    {
        // Create id
        const id = this.lastId++

        // Create terrain
        const terrain = new Terrain(id, size, x, z)
        this.terrains.set(terrain.id, terrain)

        // Post to worker
        console.time(`terrainsManager: worker (${terrain.id})`)
        this.worker.postMessage({
            id: terrain.id,
            x,
            z,
            seed: this.seed,
            subdivisions: this.subdivisions,
            size: size,
            lacunarity: this.lacunarity,
            persistence: this.persistence,
            iterations: this.iterations,
            baseFrequency: this.baseFrequency,
            baseAmplitude: this.baseAmplitude,
            power: this.power
        })

        return terrain
    }

    destroyTerrain(id)
    {
        const terrain = this.terrains.get(id)

        if(terrain)
        {
            terrain.destroy()
        }
    }
}