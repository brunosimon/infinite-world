import { vec3, quat2, mat4 } from 'gl-matrix'

import Game from '@/Game.js'
import State from '@/State/State.js'

export default class CameraFly
{
    constructor(player)
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.viewport = this.state.viewport
        this.time = this.state.time
        this.controls = this.state.controls

        this.player = player

        this.active = false

        this.gameUp = vec3.fromValues(0, 1, 0)

        this.defaultForward = vec3.fromValues(0, 0, 1)

        this.forward = vec3.clone(this.defaultForward)
        this.rightward = vec3.create()
        this.upward = vec3.create()
        this.backward = vec3.create()
        this.leftward = vec3.create()
        this.downward = vec3.create()
        
        vec3.cross(this.rightward, this.gameUp, this.forward)
        vec3.cross(this.upward, this.forward, this.rightward)
        vec3.negate(this.backward, this.forward)
        vec3.negate(this.leftward, this.rightward)
        vec3.negate(this.downward, this.upward)

        this.position = vec3.fromValues(40, 10, 40)
        this.quaternion = quat2.create()
        this.rotateX = - Math.PI * 0.15
        this.rotateY = Math.PI * 0.25
        this.rotateXLimits = { min: - Math.PI * 0.5, max: Math.PI * 0.5 }
    }

    activate(position = null, quaternion = null)
    {
        this.active = true

        if(position !== null && quaternion !== null)
        {
            // Position
            vec3.copy(this.position, position)
            
            // Rotations
            const rotatedForward = vec3.clone(this.defaultForward)
            vec3.transformQuat(rotatedForward, rotatedForward, quaternion)

            // Rotation Y
            const rotatedYForward = vec3.clone(rotatedForward)
            rotatedYForward[1] = 0
            this.rotateY = vec3.angle(this.defaultForward, rotatedYForward)

            if(vec3.dot(rotatedForward, vec3.fromValues(1, 0, 0)) < 0)
                this.rotateY *= - 1

            // Rotation X
            this.rotateX = vec3.angle(rotatedForward, rotatedYForward)

            if(vec3.dot(rotatedForward, vec3.fromValues(0, 1, 0)) > 0)
                this.rotateX *= - 1
        }
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
            const normalisedPointer = this.viewport.normalise(this.controls.pointer.delta)
            this.rotateX -= normalisedPointer.y * 2
            this.rotateY -= normalisedPointer.x * 2

            if(this.rotateX < this.rotateXLimits.min)
                this.rotateX = this.rotateXLimits.min
            if(this.rotateX > this.rotateXLimits.max)
                this.rotateX = this.rotateXLimits.max
        }

        // console.log('this.rotateY', this.rotateY)
        
        // Rotation Matrix
        const rotationMatrix = mat4.create()
        mat4.rotateY(rotationMatrix, rotationMatrix, this.rotateY)
        mat4.rotateX(rotationMatrix, rotationMatrix, this.rotateX)
        quat2.fromMat4(this.quaternion, rotationMatrix)
        
        // Update directions
        vec3.copy(this.forward, this.defaultForward)
        vec3.transformMat4(this.forward, this.forward, rotationMatrix)
        vec3.cross(this.rightward, this.gameUp, this.forward)
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

        const speed = (this.controls.keys.down.boost ? 30 : 10) * this.time.delta
            
        vec3.normalize(direction, direction)
        vec3.scale(direction, direction, speed)
        vec3.add(this.position, this.position, direction)
    }
}