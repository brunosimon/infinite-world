import Registry from '@/Registry.js' 
import Game from '@/Game.js'
import Engine from '@/Engine/Engine.js'

class DayCycle
{
    constructor()
    {
        this.game = Game.getInstance()
        this.engine = Engine.getInstance()

        this.autoUpdate = true
        this.timeProgress = 0
        this.progress = 0
        this.duration = 15 // Seconds

        this.setDebug()
    }

    update()
    {
        const time = this.engine.time

        if(this.autoUpdate)
        {
            this.timeProgress += time.delta / this.duration
            this.progress = this.timeProgress % 1
        }
    }

    setDebug()
    {
        const debug = this.game.debug

        if(!debug.active)
            return

        const folder = debug.ui.getFolder('engine/dayCycle')

        folder
            .add(this, 'autoUpdate')

        folder
            .add(this, 'progress')
            .min(0)
            .max(1)
            .step(0.001)

        folder
            .add(this, 'duration')
            .min(5)
            .max(100)
            .step(1)
    }
}

Registry.register('Engine', 'DayCycle', DayCycle)
export default DayCycle