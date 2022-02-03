import * as THREE from 'three'

import Game from './Game.js'
import Perlin from './Perlin.js'
import Terrain from './Terrain.js'
import TerrainGradient from './TerrainGradient.js'
import TerrainMaterial from './Materials/TerrainMaterial.js'

export default class TerrainsManager
{
    constructor()
    {
        this.game = new Game()
        this.debug = this.game.debug

        this.perlin = new Perlin()
        this.seed = 'g'
        this.subdivisions = 40
        this.lacunarity = 2.05
        this.persistence = 0.45
        this.maxIterations = 6
        this.baseFrequency = 0.003
        this.baseAmplitude = 160
        this.power = 2
        this.elevationOffset = 1

        this.segments = this.subdivisions + 1
        this.iterationsFormula = TerrainsManager.ITERATIONS_FORMULA_MAX

        this.lastId = 0
        this.terrains = new Map()

        this.setWorkers()
        this.setGradient()
        this.setMaterial()
        this.setDebug()
    }

    setWorkers()
    {
        this.worker = new Worker('/static/workers/terrain.js', { type: 'module' })

        this.worker.onmessage = (event) =>
        {
            // console.timeEnd(`terrainsManager: worker (${event.data.id})`)

            const terrain = this.terrains.get(event.data.id)

            if(terrain)
            {
                terrain.create(event.data.positions, event.data.normals, event.data.indices)
            }
        }
    }

    getIterationsForPrecision(precision)
    {
        if(this.iterationsFormula === TerrainsManager.ITERATIONS_FORMULA_MAX)
            return this.maxIterations

        if(this.iterationsFormula === TerrainsManager.ITERATIONS_FORMULA_MIN)
            return Math.floor((this.maxIterations - 1) * precision) + 1

        if(this.iterationsFormula === TerrainsManager.ITERATIONS_FORMULA_MIX)
            return Math.round((this.maxIterations * precision + this.maxIterations) / 2)

        if(this.iterationsFormula === TerrainsManager.ITERATIONS_FORMULA_POWERMIX)
            return Math.round((this.maxIterations * (precision, 1 - Math.pow(1 - precision, 2)) + this.maxIterations) / 2)
    }

    createTerrain(size, x, z, precision)
    {
        // Create id
        const id = this.lastId++

        // Create terrain
        const iterations = this.getIterationsForPrecision(precision)
        const terrain = new Terrain(this, id, size, x, z, precision)
        this.terrains.set(terrain.id, terrain)

        // Post to worker
        // console.time(`terrainsManager: worker (${terrain.id})`)
        this.worker.postMessage({
            id: terrain.id,
            x,
            z,
            seed: this.seed,
            subdivisions: this.subdivisions,
            size: size,
            lacunarity: this.lacunarity,
            persistence: this.persistence,
            iterations: iterations,
            baseFrequency: this.baseFrequency,
            baseAmplitude: this.baseAmplitude,
            power: this.power,
            elevationOffset: this.elevationOffset
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
            // this.createTerrain(terrain.size, terrain.x, terrain.z)
            
            // console.time(`terrainsManager: worker (${terrain.id})`)
            const iterations = this.getIterationsForPrecision(terrain.precision)
            this.worker.postMessage({
                id: terrain.id,
                size: terrain.size,
                x: terrain.x,
                z: terrain.z,
                seed: this.seed,
                subdivisions: this.subdivisions,
                lacunarity: this.lacunarity,
                persistence: this.persistence,
                iterations: iterations,
                baseFrequency: this.baseFrequency,
                baseAmplitude: this.baseAmplitude,
                power: this.power,
                elevationOffset: this.elevationOffset
            })
        }
    }

    setGradient()
    {
        this.gradient = new TerrainGradient()
    }

    setMaterial()
    {
        this.material = new TerrainMaterial()
        this.material.uniforms.uGradientTexture.value = this.gradient.texture
        this.material.uniforms.uMaxElevation.value = this.baseAmplitude
        this.material.uniforms.uFresnelOffset.value = 0
        this.material.uniforms.uFresnelScale.value = 0.5
        this.material.uniforms.uFresnelPower.value = 2

        // this.material.wireframe = true
    }

    setDebug()
    {
        if(!this.debug.active)
            return

        const debugFolder = this.debug.ui.addFolder('terrain')

        debugFolder
            .add(this.material, 'wireframe')

        debugFolder
            .add(this, 'subdivisions')
            .min(1)
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
            .add(this, 'maxIterations')
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
            .max(500)
            .step(0.1)
            .onFinishChange(() => this.recreate())

        debugFolder
            .add(this, 'power')
            .min(1)
            .max(10)
            .step(1)
            .onFinishChange(() => this.recreate())

        debugFolder
            .add(this, 'elevationOffset')
            .min(- 10)
            .max(10)
            .step(1)
            .onFinishChange(() => this.recreate())

        debugFolder
            .add(
                this,
                'iterationsFormula',
                {
                    'max': TerrainsManager.ITERATIONS_FORMULA_MAX,
                    'min': TerrainsManager.ITERATIONS_FORMULA_MIN,
                    'mix': TerrainsManager.ITERATIONS_FORMULA_MIX,
                    'powerMix': TerrainsManager.ITERATIONS_FORMULA_POWERMIX,
                }
            )
            .onFinishChange(() => this.recreate())
    }
}

TerrainsManager.ITERATIONS_FORMULA_MAX = 1
TerrainsManager.ITERATIONS_FORMULA_MIN = 2
TerrainsManager.ITERATIONS_FORMULA_MIX = 3
TerrainsManager.ITERATIONS_FORMULA_POWERMIX = 4