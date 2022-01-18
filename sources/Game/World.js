import * as THREE from 'three'
import Game from './Game.js'
import ChunksManager from './ChunksManager.js'
import TerrainsManager from './TerrainsManager.js'

export default class World
{
    constructor(_options)
    {
        this.game = new Game()
        this.config = this.game.config
        this.scene = this.game.scene
        this.resources = this.game.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
        })

        this.chunksManager = new ChunksManager()

        // this.terrainsManager = new TerrainsManager()
        // this.terrainsManager.createTerrain(200, 0, 0)

        // // Dummy
        // this.dummy = new THREE.Mesh(
        //     new THREE.BoxGeometry(1, 1, 1),
        //     new THREE.MeshNormalMaterial()
        // )
        // this.scene.add(this.dummy)

        // Axis helper
        this.axisHelper = new THREE.AxesHelper(5)
        this.scene.add(this.axisHelper)
    }

    resize()
    {
    }

    update()
    {
    }

    destroy()
    {
    }
}