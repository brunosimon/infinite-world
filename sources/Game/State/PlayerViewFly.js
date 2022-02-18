import Game from '@/Game.js'
import { vec3, quat2, mat4 } from 'gl-matrix'

export default class PlayerViewFly
{
    constructor(player)
    {
        this.game = new Game()
        this.viewport = this.game.viewport
        this.time = this.game.time
        this.controls = this.game.controls

        this.player = player

        this.active = false

        this.worldUp = vec3.fromValues(0, 1, 0)

        this.forward = vec3.fromValues(0, 0, 1)
        this.rightward = vec3.fromValues(1, 0, 0)
        this.upward = vec3.fromValues(0, 1, 0)
        
        this.backward = vec3.create()
        vec3.negate(this.backward, this.forward)
        
        this.leftward = vec3.create()
        vec3.negate(this.leftward, this.rightward)
        
        this.downward = vec3.create()
        vec3.negate(this.downward, this.upward)

        this.position = vec3.fromValues(0, 40, 0)
        this.quaternion = quat2.create()
        this.rotateX = Math.PI * 0.5
        this.rotateY = 0
        this.rotateXLimits = { min: 0, max: Math.PI }
    }

    activate()
    {
        this.active = true
    }

    deactivate()
    {
        this.active = false
    }

    update()
    {
        if(!this.active)
            return
            
        // Rotation X and Y
        if(this.controls.pointer.down || this.viewport.pointerLock.active)
        {
            this.rotateX -= this.controls.pointer.delta.y * 2
            this.rotateY -= this.controls.pointer.delta.x * 2

            if(this.rotateX < this.rotateXLimits.min)
                this.rotateX = this.rotateXLimits.min
            if(this.rotateX > this.rotateXLimits.max)
                this.rotateX = this.rotateXLimits.max
        }
        
        // Rotation Matrix
        const rotationMatrix = mat4.create()
        mat4.rotateY(rotationMatrix, rotationMatrix, this.rotateY)
        mat4.rotateX(rotationMatrix, rotationMatrix, this.rotateX - Math.PI * 0.5)
        quat2.fromMat4(this.quaternion, rotationMatrix)
        
        // Update directions
        vec3.set(this.forward, 0, 0, 1)
        vec3.transformMat4(this.forward, this.forward, rotationMatrix)

        vec3.set(this.rightward, 1, 0, 0)
        vec3.cross(this.rightward, this.worldUp, this.forward)

        vec3.set(this.upward, 1, 0, 0)
        vec3.cross(this.upward, this.forward, this.rightward)
        
        vec3.negate(this.backward, this.forward)
        
        vec3.negate(this.leftward, this.rightward)
        
        vec3.negate(this.downward, this.upward)

        // Position
        const direction = vec3.create()
        if(this.controls.keys.down.forward)
            vec3.add(direction, direction, this.backward)
            
        if(this.controls.keys.down.backward)
            vec3.add(direction, direction, this.forward)
            
        if(this.controls.keys.down.strafeRight)
            vec3.add(direction, direction, this.rightward)
            
        if(this.controls.keys.down.strafeLeft)
            vec3.add(direction, direction, this.leftward)
            
        if(this.controls.keys.down.jump)
            vec3.add(direction, direction, this.upward)
            
        if(this.controls.keys.down.crouch)
            vec3.add(direction, direction, this.downward)

        const speed = (this.controls.keys.down.boost ? 0.1 : 0.03) * this.time.delta
            
        vec3.normalize(direction, direction)
        vec3.scale(direction, direction, speed)
        vec3.add(this.position, this.position, direction)
    }
}
