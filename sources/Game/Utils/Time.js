import EventEmitter from '@/Utils/EventEmitter.js'

export default class Time extends EventEmitter
{
    /**
     * Constructor
     */
    constructor()
    {
        super()

        this.start = Date.now() / 1000
        this.current = this.start
        this.elapsed = 0
        this.delta = 16 / 1000
        this.playing = true

        this.tick = this.tick.bind(this)
        this.tick()
    }

    play()
    {
        this.playing = true
    }

    pause()
    {
        this.playing = false
    }

    /**
     * Tick
     */
    tick()
    {
        this.ticker = window.requestAnimationFrame(this.tick)

        const current = Date.now() / 1000

        this.delta = current - this.current
        this.elapsed += this.playing ? this.delta : 0
        this.current = current

        if(this.delta > 60 / 1000)
        {
            this.delta = 60 / 1000
        }

        if(this.playing)
        {
            this.trigger('tick')
        }
    }

    /**
     * Stop
     */
    stop()
    {
        window.cancelAnimationFrame(this.ticker)
    }
}
