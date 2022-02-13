import Game from '@/Game.js'

export default class PlayerView
{
    constructor(player)
    {
        this.game = new Game()
        this.viewport = this.game.viewport
        this.scene = this.game.scene
        this.controls = this.game.controls

        this.player = player

        this.distance = 30
        this.phi = Math.PI * 0.45
        this.theta = - Math.PI * 0.25
        this.position = { x: 0, y: 0, z: 0 }
        this.elevation = 2

        this.phiLimits = { min: 0.1, max: Math.PI - 0.1 }

        this.updatePosition()
    }

    updatePosition()
    {
        const sinPhiRadius = Math.sin(this.phi) * this.distance

        this.position.x = sinPhiRadius * Math.sin(this.theta)
        this.position.y = Math.cos(this.phi) * this.distance
        this.position.z = sinPhiRadius * Math.cos(this.theta)

        this.position.y += this.elevation
    }

    update()
    {
        if(this.controls.pointer.down || this.viewport.pointerLock.active)
        {
            this.phi -= this.controls.pointer.delta.y * 2
            this.theta -= this.controls.pointer.delta.x * 2

            if(this.phi < this.phiLimits.min)
                this.phi = this.phiLimits.min
            if(this.phi > this.phiLimits.max)
                this.phi = this.phiLimits.max
        }
        
        this.updatePosition()
    }
}