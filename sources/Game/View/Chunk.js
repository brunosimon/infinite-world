import Registry from '@/Registry.js' 
import Game from '@/Game.js'
import Engine from '@/Engine/Engine.js'

class Chunk
{
    constructor(chunkEngine)
    {
        this.game = Game.getInstance()
        this.engine = Engine.getInstance()
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