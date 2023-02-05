import Registry from '@/Registry.js' 
import Game from '@/Game.js'
import State from '@/State/State.js'

class Chunk
{
    constructor(chunkState)
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.scene = this.game.scene

        this.chunkState = chunkState

        this.helper = new Registry.View.ChunkHelper(this.chunkState)
    }

    update()
    {

    }

    destroy()
    {
    }
}

Registry.register('View', 'Chunk', Chunk)
export default Chunk