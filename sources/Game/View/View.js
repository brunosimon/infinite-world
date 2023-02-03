import Game from '@/Game.js' 

import * as THREE from 'three'

class View
{
    static instance

    constructor(_options)
    {
        if(View.instance)
        {
            return View.instance
        }
        View.instance = this

        this.scene = new THREE.Scene()
        
        this.camera = new Game.VIEW.Camera()
        this.renderer = new Game.VIEW.Renderer()
        this.noises = new Game.VIEW.Noises()
        this.sky = new Game.VIEW.Sky()
        this.water = new Game.VIEW.Water()
        this.terrains = new Game.VIEW.Terrains()
        this.chunks = new Game.VIEW.Chunks()
        this.player = new Game.VIEW.Player()
        this.grass = new Game.VIEW.Grass()
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
        this.sky.resize()
        this.terrains.resize()
    }

    update()
    {
        this.sky.update()
        this.water.update()
        this.terrains.update()
        this.chunks.update()
        this.player.update()
        this.grass.update()
        this.camera.update()
        this.renderer.update()
    }

    destroy()
    {
    }
}

Game.register('VIEW', 'View', View)
export default View