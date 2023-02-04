import Registry from '@/Registry.js'

import Debug from '@/Debug/Debug.js'
import Engine from '@/Engine/Engine.js'
import View from '@/View/View.js'

class Game
{
    static instance

    static getInstance()
    {
        return Game.instance
    }

    constructor()
    {
        if(Game.instance)
            return Game.instance

        Game.instance = this

        this.seed = 'p'
        this.debug = new Debug()
        this.engine = new Engine()
        this.view = new View()
        
        window.addEventListener('resize', () =>
        {
            this.resize()
        })

        this.update()
    }

    update()
    {
        this.engine.update()
        this.view.update()

        window.requestAnimationFrame(() =>
        {
            this.update()
        })
    }

    resize()
    {
        this.engine.resize()
        this.view.resize()
    }

    destroy()
    {
        
    }
}

Registry.register('', 'Game', Game)
export default Game