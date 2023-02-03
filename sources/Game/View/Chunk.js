import Registry from '@/Registry.js' 

class Chunk
{
    constructor(chunkEngine)
    {
        this.game = new Registry.Game()
        this.engine = new Registry.Engine.Engine()
        this.scene = this.game.scene

        this.chunkEngine = chunkEngine

        this.helper = new Registry.View.ChunkHelper(this.chunkEngine)
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