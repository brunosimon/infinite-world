import Registry from '@/Registry.js' 

class Debug
{
    static instance

    static getInstance()
    {
        return Debug.instance
    }

    constructor()
    {
        if(Debug.instance)
            return Debug.instance

        Debug.instance = this

        this.active = false

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