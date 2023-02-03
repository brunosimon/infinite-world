import Game from '@/Game.js' 

class Day
{
    constructor()
    {
        this.world = new Game.World()

        this.autoUpdate = true
        this.timeProgress = 0
        this.progress = 0
        this.duration = 15 // Seconds

        this.setDebug()
    }

    update()
    {
        const time = this.world.time

        if(this.autoUpdate)
        {
            this.timeProgress += time.delta / this.duration
            this.progress = this.timeProgress % 1
        }
    }

    setDebug()
    {
        const debug = this.world.debug

        if(!debug.active)
            return

        const folder = debug.ui.getFolder('state/day')

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

Game.register('ENGINE', 'Day', Day)
export default Day