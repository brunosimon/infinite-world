import Game from '@/Game.js' 

class Chunks
{
    constructor()
    {
        this.engine = new Game.ENGINE.Engine()
        
        this.engine.chunks.on('create', (chunkEngine) =>
        {
            const chunk = new Game.VIEW.Chunk(chunkEngine)

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

Game.register('VIEW', 'Chunks', Chunks)
export default Chunks