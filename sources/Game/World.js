import Game from '@/Game.js'

import Debug from '@/Debug/Debug.js'
import Time from '@/Utils/Time.js'

import Engine from '@/Engine/Engine.js'
import View from '@/View/View.js'

class World
{
    static instance

    constructor(_options = {})
    {
        // Singleton
        if(World.instance)
        {
            return World.instance
        }
        World.instance = this

        // Options
        this.domElement = _options.domElement

        if(!this.domElement)
        {
            console.warn('Missing \'domElement\' property')
            return
        }

        this.seed = 'p'
        this.time = new Time()
        this.debug = new Debug()
        this.setEngine()
        this.setView()
        
        window.addEventListener('resize', () =>
        {
            this.resize()
        })

        this.update()
    }

    setEngine()
    {
        this.engine = new Engine()
    }

    setView()
    {
        this.view = new View()
    }

    update()
    {
        this.engine.update()
        this.view.update()

        window.requestAnimationFrame(() =>
        {
            this.update()
        })
    }

    resize()
    {
        this.engine.resize()
        this.view.resize()
    }

    destroy()
    {
        
    }
}

Game.register('', 'World', World)
export default World