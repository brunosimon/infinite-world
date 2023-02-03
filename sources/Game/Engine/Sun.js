import GAME from '@/Game.js' 

class Sun
{
    constructor()
    {
        this.world = new GAME.World()
        this.engine = new GAME.ENGINE.Engine()

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

GAME.register('ENGINE', 'Sun', Sun)
export default Sun