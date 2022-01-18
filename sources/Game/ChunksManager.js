import Game from './Game.js'
import Chunk from './Chunk.js'
import TerrainsManager from './TerrainsManager.js'

export default class ChunksManager
{
    constructor()
    {
        this.game = new Game()
        this.scene = this.game.scene
        this.player = this.game.player
        this.mathUtils = this.game.mathUtils

        this.minSize = 16
        this.maxSize = this.minSize * Math.pow(2, 4)

        this.terrainsManager = new TerrainsManager()
        this.chunks = new Map()

        this.test()
        window.setInterval(() =>
        {
            this.test()
        }, 100)
    }

    test()
    {
        this.testNeighbourChunks()
        
        for(const [ key, chunk ] of this.chunks)
        {
            chunk.test()
        }
    }

    testNeighbourChunks()
    {
        const nineGrid = this.getNeighboursGrid()

        // Destroy
        for(const [key, chunk] of this.chunks)
        {
            if(!nineGrid.find((gridItem) => gridItem.key === key))
            {
                chunk.destroy()
                this.chunks.delete(key)
            }
        }

        // Create
        for(const gridItem of nineGrid)
        {
            if(!this.chunks.has(gridItem.key))
            {
                const chunk = new Chunk(this, this.maxSize, gridItem.x, gridItem.z)
                this.chunks.set(gridItem.key, chunk)
            }
        }
    }

    getNeighboursGrid()
    {
        const currentX = Math.round(this.player.position.x / this.maxSize)
        const currentZ = Math.round(this.player.position.z / this.maxSize)

        const grid = [
            { x: currentX, z: currentZ }, // Current
            { x: currentX, z: currentZ + 1 }, // Up
            { x: currentX + 1, z: currentZ + 1, }, // Up right
            { x: currentX + 1, z: currentZ }, // Right
            { x: currentX + 1, z: currentZ - 1 }, // Down right 
            { x: currentX, z: currentZ - 1 }, // Down
            { x: currentX - 1, z: currentZ - 1 }, // Down left
            { x: currentX - 1, z: currentZ }, // Left
            { x: currentX - 1, z: currentZ + 1 }, // Up left
        ]

        for(const gridItem of grid)
        {
            gridItem.key = `${gridItem.x}${gridItem.z}`
            gridItem.x *= this.maxSize
            gridItem.z *= this.maxSize
        }

        const distanceFilteredGrid = grid.filter((gridItem) =>
        {
            const distance = this.mathUtils.distance(this.player.position.x, this.player.position.z, gridItem.x, gridItem.z)
            return distance < this.maxSize * 1.25
        })

        return distanceFilteredGrid
    }
}