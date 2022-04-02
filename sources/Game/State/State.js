import GAME from '@/Game.js' 

class State
{
    static instance

    constructor(_options)
    {
        if(State.instance)
        {
            return State.instance
        }
        State.instance = this

        this.world = new GAME.World()
        this.day = new GAME.STATE.Day()
        this.sun = new GAME.STATE.Sun()
        this.player = new GAME.STATE.Player()
        this.terrains = new GAME.STATE.Terrains()
        this.chunks = new GAME.STATE.Chunks()

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

GAME.register('STATE', 'State', State)
export default State