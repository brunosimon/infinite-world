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

        this.testPlayer()
        window.setInterval(() =>
        {
            this.testPlayer()
        }, 100)
    }

    underSplitDistance(size, chunkX, chunkY)
    {
        const distance = this.mathUtils.distance(this.player.position.x, this.player.position.z, chunkX, chunkY)
        return distance < size * 1
    }

    testPlayer()
    {
        const neighboursGrid = this.getNeighboursGrid()

        // Destroy chunk not in neighbours anymore
        for(const [key, chunk] of this.chunks)
        {
            if(!neighboursGrid.find((gridItem) => gridItem.key === key))
            {
                chunk.destroy()
                this.chunks.delete(key)
            }
        }

        // Create new chunks
        for(const gridItem of neighboursGrid)
        {
            if(!this.chunks.has(gridItem.key))
            {
                const chunk = new Chunk(this, this.maxSize, gridItem.x, gridItem.z)
                this.chunks.set(gridItem.key, chunk)
            }
        }
        
        // Test chunks
        for(const [ key, chunk ] of this.chunks)
        {
            chunk.testPlayer()
        }
    }

    getNeighboursGrid()
    {
        const currentX = Math.round(this.player.position.x / this.maxSize)
        const currentZ = Math.round(this.player.position.z / this.maxSize)

        // Find normalize neighbours
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

        // Create key and multiply by max size of chunks
        for(const gridItem of grid)
        {
            gridItem.key = `${gridItem.x}${gridItem.z}`
            gridItem.x *= this.maxSize
            gridItem.z *= this.maxSize
        }

        // Filter by distance
        const filteredGrid = grid.filter((gridItem) =>
        {
            return this.underSplitDistance(this.maxSize, gridItem.x, gridItem.z)
        })

        return filteredGrid
    }
}