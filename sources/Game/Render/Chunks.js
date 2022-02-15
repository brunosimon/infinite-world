import * as THREE from 'three'

import Game from '@/Game.js'
import State from '@/State/State.js'
import Chunk from '@/Render/Chunk.js'

export default class Chunks
{
    constructor()
    {
        this.game = new Game()
        this.state = new State()
        this.debug = this.game.debug

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