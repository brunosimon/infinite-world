import * as THREE from 'three'
import Game from '@/Game.js'
import Camera from '@/World/Camera.js'
import Renderer from '@/World/Renderer.js'
import Sky from '@/World/Sky.js'

export default class World
{
    static instance

    constructor(_options)
    {
        if(World.instance)
        {
            return World.instance
        }
        World.instance = this

        this.game = new Game()
        this.player = this.game.player
        this.scene = this.game.scene
        this.resources = this.game.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
        })

        this.sky = new Sky()
        this.camera = new Camera()
        this.renderer = new Renderer()
    }

    resize()
    {
    }

    update()
    {
        this.sky.update()
        this.camera.update()
        this.renderer.update()
    }

    destroy()
    {
    }
}