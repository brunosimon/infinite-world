import Game from '@/Game.js'
import PlayerView from '@/State/PlayerView.js'

export default class Player
{
    constructor()
    {
        this.game = new Game()
        this.time = this.game.time
        this.controls = this.game.controls

        this.rotation = 0
        this.inputSpeed = 0.01
        this.inputBoostSpeed = 0.03
        this.speed = 0

        this.position = {}
        this.position.current = {
            x: 0.1,
            y: 0,
            z: 0.1
        }
        this.position.previous = {
            x: this.position.current.x,
            y: this.position.current.y,
            z: this.position.current.z
        }
        this.position.delta = {
            x: 0,
            y: 0,
            z: 0
        }

        this.view = new PlayerView(this)
    }

    update()
    {
        this.view.update()

        if(this.controls.keys.down.forward || this.controls.keys.down.backward || this.controls.keys.down.strafeLeft || this.controls.keys.down.strafeRight)
        {
            this.rotation = this.view.theta

            if(this.controls.keys.down.forward)
            {
                if(this.controls.keys.down.strafeLeft)
                    this.rotation += Math.PI * 0.25
                else if(this.controls.keys.down.strafeRight)
                    this.rotation -= Math.PI * 0.25
            }
            else if(this.controls.keys.down.backward)
            {
                if(this.controls.keys.down.strafeLeft)
                    this.rotation += Math.PI * 0.75
                else if(this.controls.keys.down.strafeRight)
                    this.rotation -= Math.PI * 0.75
                else
                    this.rotation -= Math.PI
            }
            else if(this.controls.keys.down.strafeLeft)
            {
                this.rotation += Math.PI * 0.5
            }
            else if(this.controls.keys.down.strafeRight)
            {
                this.rotation -= Math.PI * 0.5
            }

            const speed = this.controls.keys.down.boost ? this.inputBoostSpeed : this.inputSpeed

            const x = Math.sin(this.rotation) * this.time.delta * speed
            const z = Math.cos(this.rotation) * this.time.delta * speed

            this.position.current.x -= x
            this.position.current.z -= z
        }

        this.position.delta.x = this.position.current.x - this.position.previous.x
        this.position.delta.y = this.position.current.y - this.position.previous.y
        this.position.delta.z = this.position.current.z - this.position.previous.z

        this.position.previous.x = this.position.current.x
        this.position.previous.y = this.position.current.y
        this.position.previous.z = this.position.current.z

        this.speed = Math.hypot(this.position.delta.x, this.position.delta.y, this.position.delta.z)
    }
}