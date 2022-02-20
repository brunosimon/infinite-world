import Debug from './Debug.js'
import Time from './Utils/Time.js'
import Sizes from './Utils/Sizes.js'
import MathUtils from './Utils/MathUtils.js'

import Resources from './Resources.js'
import Controls from './Controls.js'
import State from './State/State.js'
import Render from './Render/Render.js'

import assets from './assets.js'
import Viewport from './Viewport.js'

export default class Game
{
    static instance

    constructor(_options = {})
    {
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

        this.seed = 'a'
        this.time = new Time()
        this.sizes = new Sizes()
        this.debug = new Debug()
        this.mathUtils = new MathUtils()
        this.setViewport()
        this.setResources()
        this.setControls()
        this.setState()
        this.setRender()
        
        this.sizes.on('resize', () =>
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
        if(this.stats)
            this.stats.update()
        
        if(this.controls)
            this.controls.update()

        if(this.state)
            this.state.update()

        if(this.render)
            this.render.update()

        window.requestAnimationFrame(() =>
        {
            this.update()
        })
    }

    resize()
    {
        if(this.viewport)
            this.viewport.update()

        if(this.camera)
            this.camera.resize()

        if(this.renderer)
            this.renderer.resize()

        if(this.render)
            this.render.resize()

        if(this.render)
            this.render.resize()
    }

    destroy()
    {
        
    }
}
