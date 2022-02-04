import * as THREE from 'three'
import Game from './Game.js'
import ChunksManager from './ChunksManager.js'
import Player from './Player.js'
import Sky from './Sky.js'
import TerrainsManager from './TerrainsManager.js'

export default class World
{
    constructor(_options)
    {
        this.game = new Game()
        this.player = this.game.player
        this.scene = this.game.scene
        this.resources = this.game.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
        })

        this.chunksManager = new ChunksManager()
        this.player = new Player()
        this.sky = new Sky()

        // this.terrainsManager = new TerrainsManager()
        // this.terrainsManager.createTerrain(200, 0, 0, 1, 4, 4, 4, 4)
    }

    resize()
    {
    }

    update()
    {
        this.player.update()

        this.chunksManager.reference.x = this.player.position.current.x
        this.chunksManager.reference.z = this.player.position.current.z
        this.chunksManager.update()
        
        const topology = this.chunksManager.getTopologyForPosition(this.player.position.current.x, this.player.position.current.z)

        if(topology)
        {
            this.player.position.current.y = topology.elevation
        }

    }

    destroy()
    {
    }
}