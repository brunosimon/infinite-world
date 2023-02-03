import Registry from '@/Registry.js' 

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
        
        this.camera = new Registry.View.Camera()
        this.renderer = new Registry.View.Renderer()
        this.noises = new Registry.View.Noises()
        this.sky = new Registry.View.Sky()
        this.water = new Registry.View.Water()
        this.terrains = new Registry.View.Terrains()
        this.chunks = new Registry.View.Chunks()
        this.player = new Registry.View.Player()
        this.grass = new Registry.View.Grass()
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

Registry.register('View', 'View', View)
export default View