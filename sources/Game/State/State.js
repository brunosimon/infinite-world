import Day from '@/State/Day.js'
import Sun from '@/State/Sun.js'
import Player from '@/State/Player.js'
import TerrainsManager from '@/State/TerrainsManager.js'
import ChunksManager from '@/State/ChunksManager.js'

export default class State
{
    static instance

    constructor(_options)
    {
        if(State.instance)
        {
            return State.instance
        }
        State.instance = this

        this.day = new Day()
        this.day = new Day()
        this.sun = new Sun()
        this.player = new Player()
        this.terrainsManager = new TerrainsManager()
        this.chunksManager = new ChunksManager()
    }

    update()
    {
        this.day.update()
        this.sun.update()
        this.player.update()
        this.terrainsManager.update()

        this.chunksManager.reference.x = this.player.position.current.x
        this.chunksManager.reference.z = this.player.position.current.z
        this.chunksManager.update()
        
        const topology = this.chunksManager.getTopologyForPosition(this.player.position.current.x, this.player.position.current.z)

        if(topology)
        {
            this.player.position.current.y = topology.elevation
        }
    }
}