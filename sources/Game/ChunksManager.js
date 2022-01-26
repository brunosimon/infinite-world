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
        this.maxSplitCount = 5
        this.maxSize = this.minSize * Math.pow(2, this.maxSplitCount)
        this.splitRatioPerSize = 1.3
        this.lastId = 0
        
        this.baseChunks = new Map()
        this.chunks = new Map()

        this.terrainsManager = new TerrainsManager()

        this.testSplit()
        window.setInterval(() =>
        {
            this.testSplit()
        }, 100)
    }

    createChunk(halfSize, x, z, splitCount)
    {
        const chunk = new Chunk(this, halfSize, x, z, splitCount)

        this.chunks.set(this.lastId++, chunk)

        return chunk
    }

    underSplitDistance(size, chunkX, chunkY)
    {
        const distance = this.mathUtils.distance(this.player.position.x, this.player.position.z, chunkX, chunkY)
        return distance < size * this.splitRatioPerSize
    }

    testSplit()
    {
        for(const [key, chunk] of this.chunks)
        {
            chunk.needsTest = true
        }

        const neighboursGrid = this.getNeighboursGrid()

        // Destroy chunk not in neighbours anymore
        for(const [key, chunk] of this.baseChunks)
        {
            if(!neighboursGrid.find((gridItem) => gridItem.key === key))
            {
                chunk.destroy()
                this.baseChunks.delete(key)
            }
        }

        // Create new chunks
        for(const gridItem of neighboursGrid)
        {
            if(!this.baseChunks.has(gridItem.key))
            {
                const chunk = this.createChunk(this.maxSize, gridItem.x, gridItem.z, 0)
                this.baseChunks.set(gridItem.key, chunk)
            }
        }
        
        // Test chunks
        for(const [ key, chunk ] of this.baseChunks)
        {
            chunk.testSplit()
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

        // // Filter by distance
        // const filteredGrid = grid.filter((gridItem) =>
        // {
        //     // return this.underSplitDistance(this.maxSize, gridItem.x, gridItem.z)
        //     return true
        // })

        return grid
    }

    getChunkForPosition(x, z)
    {
        for(const [key, chunk] of this.baseChunks)
        {
            if(chunk.isInside(x, z))
            {
                return chunk
            }
        }
    }

    getTopologyForPosition(x, z)
    {
        const deepestChunk = this.getDeepestChunkForPosition(this.player.position.x, this.player.position.z)

        const topology = deepestChunk.terrain.getTopologyForPosition(x, z)

        return topology
    }

    getDeepestChunkForPosition(x, z)
    {
        const baseChunk = this.getChunkForPosition(x, z)
        const chunk = baseChunk.getChunkForPosition(x, z)
        return chunk
    }
}