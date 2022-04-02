import GAME from '@/Game.js' 

import * as THREE from 'three'

class Render
{
    static instance

    constructor(_options)
    {
        if(Render.instance)
        {
            return Render.instance
        }
        Render.instance = this

        this.world = new GAME.World()
        this.scene = new THREE.Scene()
        
        this.camera = new GAME.RENDER.Camera()
        this.renderer = new GAME.RENDER.Renderer()
        this.noises = new GAME.RENDER.Noises()
        this.sky = new GAME.RENDER.Sky()
        this.water = new GAME.RENDER.Water()
        this.terrains = new GAME.RENDER.Terrains()
        this.chunks = new GAME.RENDER.Chunks()
        this.player = new GAME.RENDER.Player()
        this.grass = new GAME.RENDER.Grass()
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

GAME.register('RENDER', 'Render', Render)
export default Render