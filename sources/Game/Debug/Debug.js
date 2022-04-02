import GAME from '@/Game.js' 

class Debug
{
    constructor()
    {
        this.active = window.location.hash === '#debug'

        if(this.active)
        {
            this.ui = new GAME.DEBUG.UI()
            this.stats = new GAME.DEBUG.Stats()
        }
    }
}

GAME.register('DEBUG', 'Debug', Debug)
export default Debug