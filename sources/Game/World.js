import GAME from '@/Game.js'

import Debug from '@/Debug/Debug.js'
import Time from '@/Utils/Time.js'
import MathUtils from '@/Utils/MathUtils.js'

import Controls from '@/Controls.js'
import Engine from '@/Engine/Engine.js'
import View from '@/View/View.js'

import Viewport from '@/Viewport.js'

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
        this.mathUtils = new MathUtils()
        this.setViewport()
        this.setControls()
        this.setEngine()
        this.setView()
        
        window.addEventListener('resize', () =>
        {
            this.resize()
        })

        this.update()
    }

    setViewport()
    {
        this.viewport = new Viewport()
    }

    setControls()
    {
        this.controls = new Controls()
    }

    setEngine()
    {
        this.state = new Engine()
    }

    setView()
    {
        this.view = new View()
    }

    update()
    {
        this.controls.update()
        this.state.update()
        this.view.update()

        window.requestAnimationFrame(() =>
        {
            this.update()
        })
    }

    resize()
    {
        this.viewport.update()
        this.view.resize()
    }

    destroy()
    {
        
    }
}

GAME.register('', 'World', World)
export default World