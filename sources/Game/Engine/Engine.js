import Registry from '@/Registry.js' 

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
        
        this.game = new Registry.Game()
        this.time = new Registry.Engine.Time()
        this.controls = new Registry.Controls()
        this.viewport = new Registry.Viewport()
        this.day = new Registry.Engine.DayCycle()
        this.sun = new Registry.Engine.Sun()
        this.player = new Registry.Engine.Player()
        this.terrains = new Registry.Engine.Terrains()
        this.chunks = new Registry.Engine.Chunks()
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

Registry.register('Engine', 'Engine', Engine)
export default Engine