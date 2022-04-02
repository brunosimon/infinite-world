import GAME from '@/Game.js' 

class Chunk
{
    constructor(chunkState)
    {
        this.world = new GAME.World()
        this.state = new GAME.STATE.State()
        this.scene = this.world.scene

        this.chunkState = chunkState

        this.helper = new GAME.RENDER.ChunkHelper(this.chunkState)
    }

    update()
    {

    }

    destroy()
    {
    }
}

GAME.register('RENDER', 'Chunk', Chunk)
export default Chunk