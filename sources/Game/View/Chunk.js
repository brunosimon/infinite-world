import Game from '@/Game.js' 

class Chunk
{
    constructor(chunkEngine)
    {
        this.world = new Game.World()
        this.engine = new Game.ENGINE.Engine()
        this.scene = this.world.scene

        this.chunkEngine = chunkEngine

        this.helper = new Game.VIEW.ChunkHelper(this.chunkEngine)
    }

    update()
    {

    }

    destroy()
    {
    }
}

Game.register('VIEW', 'Chunk', Chunk)
export default Chunk