import * as THREE from 'three'
import seedrandom from 'seedrandom'

import Game from './Game.js'
import Perlin from './Perlin.js'
import Terrain from './Terrain.js'
import TerrainGradient from './TerrainGradient.js'
import TerrainMaterial from './Materials/TerrainMaterial.js'
import TerrainWorker from './Workers/Terrain.js?worker'

export default class TerrainsManager
{
    constructor()
    {
        this.game = new Game()
        this.scene = this.game.scene
        this.debug = this.game.debug

        this.seed = this.game.seed + 'b'
        this.random = new seedrandom(this.seed)
        this.perlin = new Perlin()
        this.subdivisions = 40
        this.lacunarity = 2.05
        this.persistence = 0.45
        this.maxIterations = 6
        this.baseFrequency = 0.003
        this.baseAmplitude = 160
        this.power = 2
        this.elevationOffset = 1

        this.segments = this.subdivisions + 1
        this.iterationsFormula = TerrainsManager.ITERATIONS_FORMULA_POWERMIX

        this.lastId = 0
        this.terrains = new Map()
        
        // Iterations offsets
        this.iterationsOffsets = []

        for(let i = 0; i < this.maxIterations; i++)
            this.iterationsOffsets.push([(this.random() - 0.5) * 200000, (this.random() - 0.5) * 200000])

        this.setWorkers()
        this.setGradient()
        this.setMaterial()
        this.setDebug()
    }

    setWorkers()
    {
        this.worker = TerrainWorker()

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
            elevationOffset: this.elevationOffset,
            iterationsOffsets: this.iterationsOffsets
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
                elevationOffset: this.elevationOffset,
                iterationsOffsets: this.iterationsOffsets
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
        this.material.uniforms.uLightnessSmoothness.value = 0.25
        this.material.uniforms.uLightnessEdgeMin.value = 0
        this.material.uniforms.uLightnessEdgeMax.value = 1
        this.material.uniforms.uMaxElevation.value = this.baseAmplitude
        this.material.uniforms.uFresnelOffset.value = 0
        this.material.uniforms.uFresnelScale.value = 0.5
        this.material.uniforms.uFresnelPower.value = 2
        this.material.uniforms.uSunPosition.value = new THREE.Vector3(- 0.5, - 0.5, - 0.5)

        // this.material.wireframe = true

        // const dummy = new THREE.Mesh(
        //     new THREE.SphereGeometry(30, 64, 32),
        //     this.material
        // )
        // dummy.position.y = 50
        // this.scene.add(dummy)
    }

    update()
    {
        const sun = this.game.world.sun

        this.material.uniforms.uSunPosition.value.set(sun.position.x, sun.position.y, sun.position.z)
    }

    setDebug()
    {
        if(!this.debug.active)
            return

        const debugFolder = this.debug.ui.addFolder('terrainsManager')
        const geometryDebugFolder = debugFolder.addFolder('geometry')

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
            
        const materialDebugFolder = debugFolder.addFolder('material')
        
        materialDebugFolder
            .add(this.material.uniforms.uLightnessSmoothness, 'value')
            .min(0)
            .max(1)
            .step(0.001)
            .name('uLightnessSmoothness')
        
        materialDebugFolder
            .add(this.material.uniforms.uLightnessEdgeMin, 'value')
            .min(0)
            .max(1)
            .step(0.001)
            .name('uLightnessEdgeMin')
        
        materialDebugFolder
            .add(this.material.uniforms.uLightnessEdgeMax, 'value')
            .min(0)
            .max(1)
            .step(0.001)
            .name('uLightnessEdgeMax')
        
        materialDebugFolder
            .add(this.material.uniforms.uFresnelOffset, 'value')
            .min(- 1)
            .max(1)
            .step(0.001)
            .name('uFresnelOffset')
        
        materialDebugFolder
            .add(this.material.uniforms.uFresnelScale, 'value')
            .min(0)
            .max(2)
            .step(0.001)
            .name('uFresnelScale')
        
        materialDebugFolder
            .add(this.material.uniforms.uFresnelPower, 'value')
            .min(1)
            .max(10)
            .step(1)
            .name('uFresnelPower')

        // this.material.uniforms.uFresnelOffset.value = 0
        // this.material.uniforms.uFresnelScale.value = 0.5
        // this.material.uniforms.uFresnelPower.value = 2
    }
}

TerrainsManager.ITERATIONS_FORMULA_MAX = 1
TerrainsManager.ITERATIONS_FORMULA_MIN = 2
TerrainsManager.ITERATIONS_FORMULA_MIX = 3
TerrainsManager.ITERATIONS_FORMULA_POWERMIX = 4