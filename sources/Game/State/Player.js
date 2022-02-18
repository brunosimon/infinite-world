import Game from '@/Game.js'
import PlayerView from '@/State/PlayerView.js'
import { vec3 } from 'gl-matrix'

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
        this.position.current = vec3.fromValues(0.1, 0, 0.1)
        this.position.previous = vec3.clone(this.position.current)
        this.position.delta = vec3.create()

        this.view = new PlayerView(this)
    }

    update()
    {
        this.view.update()

        if(this.view.mode !== PlayerView.MODE_FLY && (this.controls.keys.down.forward || this.controls.keys.down.backward || this.controls.keys.down.strafeLeft || this.controls.keys.down.strafeRight))
        {
            this.rotation = this.view.thirdPerson.theta

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

            this.position.current[0] -= x
            this.position.current[2] -= z
        }

        vec3.sub(this.position.delta, this.position.current, this.position.previous)
        vec3.copy(this.position.previous, this.position.current)

        this.speed = vec3.len(this.position.delta)
    }
}