import Registry from '@/Registry.js'
import Engine from '@/Engine/Engine.js'

class Chunks
{
    constructor()
    {
        this.engine = Engine.getInstance()
        
        this.engine.chunks.on('create', (chunkEngine) =>
        {
            const chunk = new Registry.View.Chunk(chunkEngine)

            chunkEngine.on('destroy', () =>
            {
                chunk.destroy()
            })
        })
    }

    update()
    {

    }
}

Registry.register('View', 'Chunks', Chunks)
export default Chunks