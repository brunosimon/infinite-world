import Registry from '@/Registry.js'

import '@/EventEmitter.js'
import Game from '@/Game.js'

import '@/Debug/Debug.js'
import '@/Debug/Stats.js'
import '@/Debug/UI.js'

import '@/State/Time.js'
import '@/State/Viewport.js'
import '@/State/Controls.js'
import '@/State/Chunk.js'
import '@/State/Chunks.js'
import '@/State/Day.js'
import '@/State/Player.js'
import '@/State/Camera.js'
import '@/State/CameraFly.js'
import '@/State/CameraThirdPerson.js'
import '@/State/State.js'
import '@/State/Sun.js'
import '@/State/Terrain.js'
import '@/State/Terrains.js'

import '@/View/Camera.js'
import '@/View/Chunk.js'
import '@/View/ChunkHelper.js'
import '@/View/Chunks.js'
import '@/View/Grass.js'
import '@/View/Noises.js'
import '@/View/Player.js'
import '@/View/View.js'
import '@/View/Renderer.js'
import '@/View/Sky.js'
import '@/View/Terrain.js'
import '@/View/TerrainGradient.js'
import '@/View/Terrains.js'
import '@/View/Water.js'

import '@/View/Materials/Grass.js'
import '@/View/Materials/Noises.js'
import '@/View/Materials/SkyBackground.js'
import '@/View/Materials/SkySphere.js'
import '@/View/Materials/Stars.js'
import '@/View/Materials/Terrain.js'
import '@/View/Materials/Player.js'

class Component
{
    constructor()
    {
        this.a = 'tata'
    }
}

class Components
{
    constructor()
    {
        this.stateComponents = []
        this.viewComponents = []
    }

    add(stateComponent = null, viewComponent = null)
    {
        // Associate
        if(stateComponent && viewComponent)
        {
            if(viewComponent)
                stateComponent.view = viewComponent

            if(stateComponent)
                viewComponent.view = stateComponent
        }

        // Save
        if(!(viewComponent in this.viewComponents))
            this.viewComponents.push(viewComponent)

        if(!(stateComponent in this.stateComponents))
            this.stateComponents.push(stateComponent)
    }

    update()
    {
        for(const component of this.stateComponents)
            component.update()

        for(const component of this.viewComponents)
            component.update()
    }
}

class Chunk
{
    constructor()
    {
        
    }
}

class ChunkState
{
    constructor()
    {
        
    }
}

class ChunkView
{
    constructor()
    {
        
    }
}

const game = new Game()
document.querySelector('.game').append(game.view.renderer.instance.domElement)