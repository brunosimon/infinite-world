import DebugUI from '@/DebugUI.js'
import DebugStats from '@/DebugStats.js'

export default class Debug
{
    constructor()
    {
        this.active = window.location.hash === '#debug'

        if(this.active)
        {
            this.ui = new DebugUI()
            this.stats = new DebugStats()
        }
    }
}