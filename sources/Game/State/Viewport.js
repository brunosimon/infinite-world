import Game from '@/Game.js'
import State from '@/State/State.js'

export default class Viewport
{
    constructor()
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.controls = this.state.controls
        this.domElement = this.game.domElement

        this.width = null
        this.height = null
        this.smallestSide = null
        this.biggestSide = null
        this.pixelRatio = null
        this.clampedPixelRatio = null

        this.setPointerLock()
        this.setFullscreen()

        this.controls.events.on('pointerLockDown', () =>
        {
            this.pointerLock.toggle()
        })

        this.controls.events.on('fullscreenDown', () =>
        {
            this.fullscreen.toggle()
        })

        this.resize()
    }

    setPointerLock()
    {
        this.pointerLock = {}
        this.pointerLock.active = false
        
        this.pointerLock.toggle = () =>
        {
            if(this.pointerLock.active)
                this.pointerLock.deactivate()
            else
                this.pointerLock.activate()
        }
        
        this.pointerLock.activate = () =>
        {
            this.domElement.requestPointerLock()
        }

        this.pointerLock.deactivate = () =>
        {
            document.exitPointerLock()
        }
        
        document.addEventListener('pointerlockchange', () =>
        {
            this.pointerLock.active = !!document.pointerLockElement
        })
    }

    setFullscreen()
    {
        this.fullscreen = {}
        this.fullscreen.active = false
        
        this.fullscreen.toggle = () =>
        {
            if(this.fullscreen.active)
                this.fullscreen.deactivate()
            else
                this.fullscreen.activate()
        }
        
        this.fullscreen.activate = () =>
        {
            this.domElement.requestFullscreen()
        }

        this.fullscreen.deactivate = () =>
        {
            document.exitFullscreen()
        }
        
        document.addEventListener('fullscreenchange', () =>
        {
            this.fullscreen.active = !!document.fullscreenElement
        })
    }

    normalise(pixelCoordinates)
    {
        const minSize = Math.min(this.width, this.height)
        return {
            x: pixelCoordinates.x / minSize,
            y: pixelCoordinates.y / minSize,
        }
    }

    resize()
    {
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.smallestSide = this.width < this.height ? this.width : this.height
        this.biggestSide = this.width > this.height ? this.width : this.height
        this.pixelRatio = window.devicePixelRatio
        this.clampedPixelRatio = Math.min(this.pixelRatio, 2)
    }
}