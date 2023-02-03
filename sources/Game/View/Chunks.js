import Registry from '@/Registry.js' 

class Chunks
{
    constructor()
    {
        this.engine = new Registry.Engine.Engine()
        
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