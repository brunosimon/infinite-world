import GAME from '@/Game.js' 

class Chunks
{
    constructor()
    {
        this.world = new GAME.World()
        this.state = new GAME.STATE.State()
        
        this.state.chunks.on('create', (chunkState) =>
        {
            const chunk = new GAME.RENDER.Chunk(chunkState)

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

GAME.register('RENDER', 'Chunks', Chunks)
export default Chunks