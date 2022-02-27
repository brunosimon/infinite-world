import Debug from '@/Debug/Debug.js'
import Time from '@/Utils/Time.js'
import MathUtils from '@/Utils/MathUtils.js'

import Resources from '@/Resources.js'
import Controls from '@/Controls.js'
import State from '@/State/State.js'
import Render from '@/Render/Render.js'

import assets from '@/assets.js'
import Viewport from '@/Viewport.js'

export default class Game
{
    static instance

    constructor(_options = {})
    {
        // Singleton
        if(Game.instance)
        {
            return Game.instance
        }
        Game.instance = this

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
        this.setResources()
        this.setControls()
        this.setState()
        this.setRender()
        
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

    setResources()
    {
        this.resources = new Resources(assets)
    }

    setControls()
    {
        this.controls = new Controls()
    }

    setState()
    {
        this.state = new State()
    }

    setRender()
    {
        this.render = new Render()
    }

    update()
    {
        this.controls.update()
        this.state.update()
        this.render.update()

        window.requestAnimationFrame(() =>
        {
            this.update()
        })
    }

    resize()
    {
        this.viewport.update()
        this.render.resize()
    }

    destroy()
    {
        
    }
}
