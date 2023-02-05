import Registry from '@/Registry.js'
import State from '@/State/State.js'

class Chunks
{
    constructor()
    {
        this.state = State.getInstance()
        
        this.state.chunks.on('create', (chunkState) =>
        {
            const chunk = new Registry.View.Chunk(chunkState)

            chunkState.on('destroy', () =>
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