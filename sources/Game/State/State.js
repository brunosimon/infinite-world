import Time from './Time.js'
import Controls from './Controls.js'
import Viewport from './Viewport.js'
import DayCycle from './DayCycle.js'
import Sun from './Sun.js'
import Player from './Player.js'
import Terrains from './Terrains.js'
import Chunks from './Chunks.js'

export default class State
{
    static instance

    static getInstance()
    {
        return State.instance
    }

    constructor()
    {
        if(State.instance)
            return State.instance

        State.instance = this

        this.time = new Time()
        this.controls = new Controls()
        this.viewport = new Viewport()
        this.day = new DayCycle()
        this.sun = new Sun()
        this.player = new Player()
        this.terrains = new Terrains()
        this.chunks = new Chunks()
    }

    resize()
    {
        this.viewport.resize()
    }

    update()
    {
        this.time.update()
        this.controls.update()
        this.day.update()
        this.sun.update()
        this.player.update()
        this.chunks.update()
    }
}