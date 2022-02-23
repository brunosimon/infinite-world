import * as THREE from 'three'

import Game from '@/Game.js'
import Camera from '@/Render/Camera.js'
import Renderer from '@/Render/Renderer.js'
import Sky from '@/Render/Sky.js'
import Terrains from '@/Render/Terrains.js'
import Chunks from '@/Render/Chunks.js'
import Player from '@/Render/Player.js'
import Grass from '@/Render/Grass'

export default class Render
{
    static instance

    constructor(_options)
    {
        if(Render.instance)
        {
            return Render.instance
        }
        Render.instance = this

        this.game = new Game()
        this.scene = new THREE.Scene()
        
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.sky = new Sky()
        this.terrains = new Terrains()
        this.chunks = new Chunks()
        this.player = new Player()
        this.grass = new Grass()
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