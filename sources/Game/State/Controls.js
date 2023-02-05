import EventsEmitter from 'events'

import Game from '@/Game.js'
import State from '@/State/State.js'

export default class Controls
{
    constructor()
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()

        this.events = new EventsEmitter()

        this.setKeys()
        this.setPointer()

        this.events.on('debugDown', () =>
        {
            if(location.hash === '#debug')
                location.hash = ''
            else
                location.hash = 'debug'

            location.reload()
        })
    }

    setKeys()
    {
        this.keys = {}
        
        // Map
        this.keys.map = [
            {
                codes: [ 'ArrowUp', 'KeyW' ],
                name: 'forward'
            },
            {
                codes: [ 'ArrowRight', 'KeyD' ],
                name: 'strafeRight'
            },
            {
                codes: [ 'ArrowDown', 'KeyS' ],
                name: 'backward'
            },
            {
                codes: [ 'ArrowLeft', 'KeyA' ],
                name: 'strafeLeft'
            },
            {
                codes: [ 'ShiftLeft', 'ShiftRight' ],
                name: 'boost'
            },
            {
                codes: [ 'KeyP' ],
                name: 'pointerLock'
            },
            {
                codes: [ 'KeyV' ],
                name: 'cameraMode'
            },
            {
                codes: [ 'KeyB' ],
                name: 'debug'
            },
            {
                codes: [ 'KeyF' ],
                name: 'fullscreen'
            },
            {
                codes: [ 'Space' ],
                name: 'jump'
            },
            {
                codes: [ 'ControlLeft', 'KeyC' ],
                name: 'crouch'
            },
        ]

        // Down keys
        this.keys.down = {}

        for(const mapItem of this.keys.map)
        {
            this.keys.down[mapItem.name] = false
        }

        // Find in map per code
        this.keys.findPerCode = (key) =>
        {
            return this.keys.map.find((mapItem) => mapItem.codes.includes(key))
        }

        // Event
        window.addEventListener('keydown', (event) =>
        {
            const mapItem = this.keys.findPerCode(event.code)
            
            if(mapItem)
            {
                this.events.emit('keyDown', mapItem.name)
                this.events.emit(`${mapItem.name}Down`)
                this.keys.down[mapItem.name] = true
            }
        })

        window.addEventListener('keyup', (event) =>
        {
            const mapItem = this.keys.findPerCode(event.code)
            
            if(mapItem)
            {
                this.events.emit('keyUp', mapItem.name)
                this.events.emit(`${mapItem.name}Up`)
                this.keys.down[mapItem.name] = false
            }
        })
    }

    setPointer()
    {
        this.pointer = {}
        this.pointer.down = false
        this.pointer.deltaTemp = { x: 0, y: 0 }
        this.pointer.delta = { x: 0, y: 0 }

        window.addEventListener('pointerdown', (event) =>
        {
            this.pointer.down = true
        })

        window.addEventListener('pointermove', (event) =>
        {
            this.pointer.deltaTemp.x += event.movementX
            this.pointer.deltaTemp.y += event.movementY
        })

        window.addEventListener('pointerup', () =>
        {
            this.pointer.down = false
        })
    }

    update()
    {
        this.pointer.delta.x = this.pointer.deltaTemp.x
        this.pointer.delta.y = this.pointer.deltaTemp.y

        this.pointer.deltaTemp.x = 0
        this.pointer.deltaTemp.y = 0
    }
}