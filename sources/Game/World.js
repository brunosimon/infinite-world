import * as THREE from 'three'
import Game from './Game.js'
import ChunksManager from './ChunksManager.js'
import TerrainsManager from './TerrainsManager.js'

export default class World
{
    constructor(_options)
    {
        this.game = new Game()
        this.player = this.game.player
        this.config = this.game.config
        this.scene = this.game.scene
        this.resources = this.game.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
        })

        this.chunksManager = new ChunksManager()

        // this.terrainsManager = new TerrainsManager()
        // this.terrainsManager.createTerrain(200, 0, 0, 1)
    }

    resize()
    {
    }

    update()
    {
        const topology = this.chunksManager.getTopologyForPosition(this.player.position.x, this.player.position.z)

        if(topology)
            this.player.position.y = topology.elevation
    }

    destroy()
    {
    }
}