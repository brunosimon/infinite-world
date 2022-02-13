import * as THREE from 'three'

import Debug from './Debug.js'
import Time from './Utils/Time.js'
import Sizes from './Utils/Sizes.js'
import Stats from './Utils/Stats.js'
import MathUtils from './Utils/MathUtils.js'

import Resources from './Resources.js'
import Controls from './Controls.js'
import State from './State/State.js'
import World from './World/World.js'

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
        this.setStats()
        this.setViewport()
        this.setScene()
        this.setResources()
        this.setControls()
        this.setState()
        this.setWorld()
        
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        this.update()
    }

    setStats()
    {
        if(this.debug.active)
        {
            this.stats = new Stats(true)
        }
    }

    setViewport()
    {
        this.viewport = new Viewport()
    }

    setScene()
    {
        this.scene = new THREE.Scene()
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

    setWorld()
    {
        this.world = new World()
    }

    update()
    {
        if(this.stats)
            this.stats.update()
        
        if(this.controls)
            this.controls.update()

        if(this.state)
            this.state.update()

        if(this.world)
            this.world.update()

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

        if(this.world)
            this.world.resize()

        if(this.world)
            this.world.resize()
    }

    destroy()
    {
        
    }
}
