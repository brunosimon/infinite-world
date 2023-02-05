import Registry from '@/Registry.js' 
import Game from '@/Game.js'

class State
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

        this.game = Game.getInstance()
        this.time = new Registry.State.Time()
        this.controls = new Registry.Controls()
        this.viewport = new Registry.Viewport()
        this.day = new Registry.State.DayCycle()
        this.sun = new Registry.State.Sun()
        this.player = new Registry.State.Player()
        this.terrains = new Registry.State.Terrains()
        this.chunks = new Registry.State.Chunks()
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

Registry.register('State', 'State', State)
export default State