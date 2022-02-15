import Day from '@/State/Day.js'
import Sun from '@/State/Sun.js'
import Player from '@/State/Player.js'
import Terrains from '@/State/Terrains.js'
import Chunks from '@/State/Chunks.js'

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
        this.sun = new Sun()
        this.player = new Player()
        this.terrains = new Terrains()
        this.chunks = new Chunks()
    }

    update()
    {
        this.day.update()
        this.sun.update()
        this.player.update()
        this.terrains.update()

        this.chunks.reference.x = this.player.position.current.x
        this.chunks.reference.z = this.player.position.current.z
        this.chunks.update()
        
        const topology = this.chunks.getTopologyForPosition(this.player.position.current.x, this.player.position.current.z)

        if(topology)
        {
            this.player.position.current.y = topology.elevation
        }
    }
}