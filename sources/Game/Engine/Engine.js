import GAME from '@/Game.js' 

class Engine
{
    static instance

    constructor(_options)
    {
        if(Engine.instance)
        {
            return Engine.instance
        }
        Engine.instance = this

        this.world = new GAME.World()
        this.day = new GAME.ENGINE.Day()
        this.sun = new GAME.ENGINE.Sun()
        this.player = new GAME.ENGINE.Player()
        this.terrains = new GAME.ENGINE.Terrains()
        this.chunks = new GAME.ENGINE.Chunks()

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

GAME.register('ENGINE', 'Engine', Engine)
export default Engine