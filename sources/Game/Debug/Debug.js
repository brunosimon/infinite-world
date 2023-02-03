import Registry from '@/Registry.js' 

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
        this.ui = new Registry.DEBUG.UI()
        this.stats = new Registry.DEBUG.Stats()
    }
}

Registry.register('DEBUG', 'Debug', Debug)
export default Debug