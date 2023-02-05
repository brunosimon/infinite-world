import Game from '@/Game.js'
import State from '@/State/State.js'
import ChunkHelper from './ChunkHelper.js'

export default class Chunk
{
    constructor(chunkState)
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.scene = this.game.scene

        this.chunkState = chunkState

        this.helper = new ChunkHelper(this.chunkState)
    }

    update()
    {

    }

    destroy()
    {
    }
}
