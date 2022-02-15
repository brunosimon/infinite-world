import Game from '@/Game.js'
import State from '@/State/State.js'
import ChunkHelper from '@/Render/ChunkHelper.js'

export default class Chunk
{
    constructor(chunkState)
    {
        this.game = new Game()
        this.state = new State()
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