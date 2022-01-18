import Game from './Game.js'
import Perlin from './Perlin.js'
import Terrain from './Terrain.js'

export default class TerrainsManager
{
    constructor()
    {
        this.game = new Game()
        this.debug = this.game.debug

        this.perlin = new Perlin()
        this.seed = 'd'
        this.subdivisions = 60
        this.lacunarity = 2.05
        this.persistence = 0.45
        this.iterations = 6
        this.baseFrequency = 0.008
        this.baseAmplitude = 60
        this.power = 5

        this.segments = this.subdivisions + 1

        this.lastId = 0
        this.terrains = new Map()

        this.setWorkers()
        this.setDebug()
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
                terrain.create(event.data.positions, event.data.normals, event.data.indices)
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
            this.terrains.delete(id)
        }
    }

    recreate()
    {
        for(const [key, terrain] of this.terrains)
        {
            console.log(terrain.size, terrain.x, terrain.z)
            // this.createTerrain(terrain.size, terrain.x, terrain.z)
            
            console.time(`terrainsManager: worker (${terrain.id})`)
            this.worker.postMessage({
                id: terrain.id,
                size: terrain.size,
                x: terrain.x,
                z: terrain.z,
                seed: this.seed,
                subdivisions: this.subdivisions,
                lacunarity: this.lacunarity,
                persistence: this.persistence,
                iterations: this.iterations,
                baseFrequency: this.baseFrequency,
                baseAmplitude: this.baseAmplitude,
                power: this.power
            })
        }
    }

    setDebug()
    {
        if(!this.debug.active)
            return

        const debugFolder = this.debug.ui.addFolder('terrain')

        debugFolder
            .add(this, 'subdivisions')
            .min(10)
            .max(400)
            .step(1)
            .onFinishChange(() => this.recreate())

        debugFolder
            .add(this, 'lacunarity')
            .min(1)
            .max(5)
            .step(0.01)
            .onFinishChange(() => this.recreate())

        debugFolder
            .add(this, 'persistence')
            .min(0)
            .max(1)
            .step(0.01)
            .onFinishChange(() => this.recreate())

        debugFolder
            .add(this, 'iterations')
            .min(1)
            .max(10)
            .step(1)
            .onFinishChange(() => this.recreate())

        debugFolder
            .add(this, 'baseFrequency')
            .min(0)
            .max(0.01)
            .step(0.0001)
            .onFinishChange(() => this.recreate())

        debugFolder
            .add(this, 'baseAmplitude')
            .min(0)
            .max(100)
            .step(0.1)
            .onFinishChange(() => this.recreate())

        debugFolder
            .add(this, 'power')
            .min(1)
            .max(10)
            .step(1)
            .onFinishChange(() => this.recreate())

        
        // this.subdivisions = 200
        // this.lacunarity = 2.25
        // this.persistence = 0.5
        // this.iterations = 6
        // this.baseFrequency = 0.02
        // this.baseAmplitude = 30
        // this.power = 4
    }
}