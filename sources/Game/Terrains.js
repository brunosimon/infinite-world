import Perlin from './Perlin.js'
import Game from './Game.js'
import * as THREE from 'three'

export default class Terrains
{
    constructor(subdivisions, size, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power)
    {
        this.game = new Game()
        this.scene = this.game.scene
        this.mathUtils = this.game.mathUtils

        this.perlin = new Perlin()
        this.seed = 'b'
        this.subdivisions = 100
        this.lacunarity = 2
        this.persistence = 0.5
        this.iterations = 4
        this.baseFrequency = 0.1
        this.baseAmplitude = 1
        this.power = 4

        this.segments = this.subdivisions + 1

        this.itemId = 0
        this.items = new Map()

        this.setWorkers()
    }

    setWorkers()
    {
        this.worker = new Worker('/static/workers/terrain.js', { type: 'module' })

        this.worker.onmessage = (event) =>
        {
            console.timeEnd(`worker${event.data.id}`)

            const item = this.items.get(event.data.id)

            item.helper = this.getHelper(event.data.positions, event.data.normals, event.data.indices)
        }
    }

    create(size, x, z)
    {
        const item = {
            id: this.itemId++
        }
        this.items.set(item.id, item)

        console.time(`worker${item.id}`)

        this.worker.postMessage({
            id: item.id,
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
    }

    getHelper(positions, normals, indices)
    {
        // Geometry
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
        geometry.index = new THREE.BufferAttribute(indices, 1, false)
        // geometry.computeVertexNormals()

        // Material
        // const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, wireframe: false })
        // const material = new THREE.MeshStandardMaterial()
        const material = new THREE.MeshNormalMaterial({ wireframe: true })

        // Mesh
        const helper = new THREE.Mesh(geometry, material)
        this.scene.add(helper)

        return helper
    }
}