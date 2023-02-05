import State from '@/State/State.js'
import Chunk from './Chunk.js'

export default class Chunks
{
    constructor()
    {
        this.state = State.getInstance()
        
        this.state.chunks.on('create', (chunkState) =>
        {
            const chunk = new Chunk(chunkState)

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