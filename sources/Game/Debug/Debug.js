import Game from '@/Game.js' 

class Debug
{
    constructor()
    {
        if(location.hash === '#debug')
        {
            this.activate()
        }
    }

    activate()
    {
        if(this.active)
            return
            
        this.active = true
        this.ui = new Game.DEBUG.UI()
        this.stats = new Game.DEBUG.Stats()
    }
}

Game.register('DEBUG', 'Debug', Debug)
export default Debug