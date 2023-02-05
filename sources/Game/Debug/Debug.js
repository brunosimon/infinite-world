import Stats from './Stats.js'
import UI from './UI.js'

export default class Debug
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
        this.ui = new UI()
        this.stats = new Stats()
    }
}
