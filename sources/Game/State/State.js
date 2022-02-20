import Day from '@/State/Day.js'
import Sun from '@/State/Sun.js'
import Player from '@/State/Player.js'
import Terrains from '@/State/Terrains.js'
import Chunks from '@/State/Chunks.js'
import Game from '@/Game.js'

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

        this.game = new Game()
        this.day = new Day()
        this.sun = new Sun()
        this.player = new Player()
        this.terrains = new Terrains()
        this.chunks = new Chunks()

        // window.requestAnimationFrame(() =>
        // {
        //     this.terrains.create(64, 0, 0, 1)
        // })
    }

    update()
    {
        this.day.update()
        this.sun.update()
        this.player.update()
        this.chunks.update()
    }
}