import GAME from '@/Game.js' 

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
        this.ui = new GAME.DEBUG.UI()
        this.stats = new GAME.DEBUG.Stats()
    }
}

GAME.register('DEBUG', 'Debug', Debug)
export default Debug