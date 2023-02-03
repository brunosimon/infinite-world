import GAME from '@/Game.js' 

class Chunk
{
    constructor(chunkEngine)
    {
        this.world = new GAME.World()
        this.engine = new GAME.ENGINE.Engine()
        this.scene = this.world.scene

        this.chunkEngine = chunkEngine

        this.helper = new GAME.VIEW.ChunkHelper(this.chunkEngine)
    }

    update()
    {

    }

    destroy()
    {
    }
}

GAME.register('VIEW', 'Chunk', Chunk)
export default Chunk