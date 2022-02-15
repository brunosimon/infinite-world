import Game from '@/Game.js'

export default class Day
{
    constructor()
    {
        this.game = new Game()

        this.autoUpdate = true
        this.timeProgress = 0
        this.progress = 0
        this.duration = 15 // Seconds

        this.setDebug()
    }

    update()
    {
        const time = this.game.time

        if(this.autoUpdate)
        {
            this.timeProgress += time.delta * 0.001 / this.duration
            this.progress = this.timeProgress % 1
        }
    }

    setDebug()
    {
        const debug = this.game.debug

        if(!debug.active)
            return

        const debugFolder = debug.ui.addFolder('day')

        debugFolder
            .add(this, 'autoUpdate')

        debugFolder
            .add(this, 'progress')
            .min(0)
            .max(1)
            .step(0.001)

        debugFolder
            .add(this, 'duration')
            .min(5)
            .max(100)
            .step(1)
    }
}