import Game from '@/Game.js' 

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
        
        this.controls = new Game.Controls()
        this.viewport = new Game.Viewport()
        this.world = new Game.World()
        this.day = new Game.ENGINE.Day()
        this.sun = new Game.ENGINE.Sun()
        this.player = new Game.ENGINE.Player()
        this.terrains = new Game.ENGINE.Terrains()
        this.chunks = new Game.ENGINE.Chunks()

        // window.requestAnimationFrame(() =>
        // {
        //     this.terrains.create(64, 0, 0, 1)
        // })
    }

    resize()
    {
        this.viewport.resize()
    }

    update()
    {
        this.controls.update()
        this.day.update()
        this.sun.update()
        this.player.update()
        this.chunks.update()
    }
}

Game.register('ENGINE', 'Engine', Engine)
export default Engine