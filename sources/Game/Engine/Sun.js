import Registry from '@/Registry.js' 
import Game from '@/Game.js'
import Engine from '@/Engine/Engine.js'

class Sun
{
    constructor()
    {
        this.game = Game.getInstance()
        this.engine = Engine.getInstance()

        this.theta = Math.PI * 0.8 // All around the sphere
        this.phi = Math.PI * 0.45 // Elevation
        this.position = { x: 0, y: 0, z: 0 }
    }

    update()
    {
        const dayEngine = this.engine.day

        const angle = - (dayEngine.progress + 0.25) * Math.PI * 2
        this.phi = (Math.sin(angle) * 0.3 + 0.5) * Math.PI
        this.theta = (Math.cos(angle) * 0.3 + 0.5) * Math.PI

        const sinPhiRadius = Math.sin(this.phi)

        this.position.x = sinPhiRadius * Math.sin(this.theta)
        this.position.y = Math.cos(this.phi)
        this.position.z = sinPhiRadius * Math.cos(this.theta)
    }
}

Registry.register('Engine', 'Sun', Sun)
export default Sun