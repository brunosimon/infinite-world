import GAME from '@/Game.js' 

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

        this.world = new GAME.World()
        this.scene = new THREE.Scene()
        
        this.camera = new GAME.VIEW.Camera()
        this.renderer = new GAME.VIEW.Renderer()
        this.noises = new GAME.VIEW.Noises()
        this.sky = new GAME.VIEW.Sky()
        this.water = new GAME.VIEW.Water()
        this.terrains = new GAME.VIEW.Terrains()
        this.chunks = new GAME.VIEW.Chunks()
        this.player = new GAME.VIEW.Player()
        this.grass = new GAME.VIEW.Grass()
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

GAME.register('VIEW', 'View', View)
export default View