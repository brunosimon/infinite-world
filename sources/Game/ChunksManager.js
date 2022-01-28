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
        this.maxDepth = 5
        this.maxSize = this.minSize * Math.pow(2, this.maxDepth)
        this.splitRatioPerSize = 1.3
        this.lastId = 0
        
        this.baseChunks = new Map()
        this.chunks = new Map()

        this.terrainsManager = new TerrainsManager()

        this.testSplit()
        this.updateNeighbours()
        window.setInterval(() =>
        {
            this.testSplit()
            // this.updateNeighbours()
        }, 1000)
    }

    createChunk(parent, quadPosition, halfSize, x, z, depth)
    {
        const id = this.lastId++
        const chunk = new Chunk(id, this, parent, quadPosition, halfSize, x, z, depth)

        this.chunks.set(id, chunk)

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

        const chunksCoordinates = this.getProximityChunkCoordinates()

        // Destroy chunk not in neighbours anymore
        for(const [key, chunk] of this.baseChunks)
        {
            if(!chunksCoordinates.find((coordinates) => coordinates.key === key))
            {
                chunk.destroy()
                this.baseChunks.delete(key)
            }
        }

        // Create new chunks
        for(const coordinates of chunksCoordinates)
        {
            if(!this.baseChunks.has(coordinates.key))
            {
                const chunk = this.createChunk(null, null, this.maxSize, coordinates.x, coordinates.z, 0)
                this.baseChunks.set(coordinates.key, chunk)
            }
        }

        // Update neighbours
        for(const coordinates of chunksCoordinates)
        {
            const chunk = this.baseChunks.get(coordinates.key)
            chunk.neighbours.set(0, this.baseChunks.get(`${coordinates.coordinatesX}${coordinates.coordinatesZ - 1}`))
            chunk.neighbours.set(1, this.baseChunks.get(`${coordinates.coordinatesX + 1}${coordinates.coordinatesZ}`))
            chunk.neighbours.set(2, this.baseChunks.get(`${coordinates.coordinatesX}${coordinates.coordinatesZ + 1}`))
            chunk.neighbours.set(3, this.baseChunks.get(`${coordinates.coordinatesX - 1}${coordinates.coordinatesZ}`))
        }
        
        // Test chunks
        for(const [ key, chunk ] of this.baseChunks)
        {
            chunk.testSplit()
        }
    }

    updateNeighbours()
    {
        // Update base chunks neighbours
        for(const [key, chunk] of this.baseChunks)
        {
            const coordinates = key.split(',')
            const x = parseFloat(coordinates[0])
            const z = parseFloat(coordinates[1])

            const nChunkKey = `${x},${z - 1}`
            const eChunkKey = `${x + 1},${z}`
            const sChunkKey = `${x},${z + 1}`
            const wChunkKey = `${x - 1},${z}`

            const nChunk = this.baseChunks.get(nChunkKey)
            const eChunk = this.baseChunks.get(eChunkKey)
            const sChunk = this.baseChunks.get(sChunkKey)
            const wChunk = this.baseChunks.get(wChunkKey)

            chunk.updateNeighbours(nChunk, eChunk, sChunk, wChunk)
        }

        // All not base chunks in depth order
        const chunks = [...this.chunks.values()].filter(chunk => chunk.depth > 0).sort((a, b) => a.depth - b.depth)

        for(const chunk of chunks)
        {
            let nChunk = null
            let eChunk = null
            let sChunk = null
            let wChunk = null

            // North
            if(chunk.quadPosition === 'sw') // From quad
                nChunk = chunk.parent.chunks.get('nw')
            else if(chunk.quadPosition === 'se') // From quad
                nChunk = chunk.parent.chunks.get('ne')
            else // From parent neighbours
            {
                const parentNeighbour = chunk.parent.neighbours.get('n')
                if(parentNeighbour)
                {
                    if(parentNeighbour.splitted)
                        nChunk = parentNeighbour.chunks.get(chunk.quadPosition === 'nw' ? 'sw' : 'se')
                    else
                        nChunk = parentNeighbour
                }
            }

            // East
            if(chunk.quadPosition === 'nw') // From quad
                eChunk = chunk.parent.chunks.get('ne')
            else if(chunk.quadPosition === 'sw') // From quad
                eChunk = chunk.parent.chunks.get('se')
            else // From parent neighbours
            {
                const parentNeighbour = chunk.parent.neighbours.get('e')
                if(parentNeighbour)
                {
                    if(parentNeighbour.splitted)
                        eChunk = parentNeighbour.chunks.get(chunk.quadPosition === 'ne' ? 'nw' : 'sw')
                    else
                        eChunk = parentNeighbour
                }
            }

            // Sounth
            if(chunk.quadPosition === 'nw') // From quad
                sChunk = chunk.parent.chunks.get('sw')
            else if(chunk.quadPosition === 'ne') // From quad
                sChunk = chunk.parent.chunks.get('se')
            else // From parent neighbours
            {
                const parentNeighbour = chunk.parent.neighbours.get('s')
                if(parentNeighbour)
                {
                    if(parentNeighbour.splitted)
                        sChunk = parentNeighbour.chunks.get(chunk.quadPosition === 'sw' ? 'nw' : 'ne')
                    else
                        sChunk = parentNeighbour
                }
            }

            // West
            if(chunk.quadPosition === 'ne') // From quad
                wChunk = chunk.parent.chunks.get('nw')
            else if(chunk.quadPosition === 'se') // From quad
                wChunk = chunk.parent.chunks.get('sw')
            else // From parent neighbours
            {
                const parentNeighbour = chunk.parent.neighbours.get('w')
                if(parentNeighbour)
                {
                    if(parentNeighbour.splitted)
                        wChunk = parentNeighbour.chunks.get(chunk.quadPosition === 'nw' ? 'ne' : 'se')
                    else
                        wChunk = parentNeighbour
                }
            }

            chunk.updateNeighbours(nChunk, eChunk, sChunk, wChunk)
        }
    }

    getProximityChunkCoordinates()
    {
        const currentX = Math.round(this.player.position.x / this.maxSize)
        const currentZ = Math.round(this.player.position.z / this.maxSize)

        // Find normalize neighbours
        const chunksCoordinates = [
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
        for(const coordinates of chunksCoordinates)
        {
            coordinates.coordinatesX = coordinates.x
            coordinates.coordinatesZ = coordinates.z
            coordinates.key = `${coordinates.x},${coordinates.z}`
            coordinates.x *= this.maxSize
            coordinates.z *= this.maxSize
        }

        // // Filter by distance
        // const filteredGrid = coordinates.filter((coordinates) =>
        // {
        //     // return this.underSplitDistance(this.maxSize, coordinates.x, coordinates.z)
        //     return true
        // })

        return chunksCoordinates
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