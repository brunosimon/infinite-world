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

        this.setThrottle()
        this.throttleUpdate()
        // window.setInterval(() =>
        // {
        //     this.throttleUpdate()
        // }, 1000)
    }

    setThrottle()
    {
        this.throttle = {}
        this.throttle.lastKey = null
        this.throttle.test = () =>
        {
            const key = `${Math.round(this.player.position.x / this.minSize * 2 + 0.5)}${Math.round(this.player.position.z / this.minSize * 2 + 0.5)}`
            if(key !== this.throttle.lastKey)
            {
                this.throttle.lastKey = key
                this.throttleUpdate()
            }
        }
    }

    throttleUpdate()
    {
        for(const [key, chunk] of this.chunks)
        {
            chunk.quadsNeedsUpdate = true
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
        
        // Test chunks
        for(const [ key, chunk ] of this.baseChunks)
        {
            chunk.throttleUpdate()
        }

        // Update neighbours
        this.updateNeighbours()
    }

    update()
    {
        this.throttle.test()
        for(const [ key, chunk ] of this.baseChunks)
        {
            chunk.update()
        }
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

            const nChunk = this.baseChunks.get(nChunkKey) ?? false
            const eChunk = this.baseChunks.get(eChunkKey) ?? false
            const sChunk = this.baseChunks.get(sChunkKey) ?? false
            const wChunk = this.baseChunks.get(wChunkKey) ?? false

            chunk.updateNeighbours(nChunk, eChunk, sChunk, wChunk)
        }

        // All not base chunks in depth order
        const chunks = [...this.chunks.values()].filter(chunk => chunk.depth > 0).sort((a, b) => a.depth - b.depth)

        for(const chunk of chunks)
        {
            let nChunk = false
            let eChunk = false
            let sChunk = false
            let wChunk = false

            /**
             * North
             */
            // From quad
            if(chunk.quadPosition === 'sw') 
                nChunk = chunk.parent.chunks.get('nw')

            // From quad
            else if(chunk.quadPosition === 'se') 
                nChunk = chunk.parent.chunks.get('ne')

            // From parent neighbours
            else
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

            /**
             * East
             */
            // From quad
            if(chunk.quadPosition === 'nw') 
                eChunk = chunk.parent.chunks.get('ne')

            // From quad
            else if(chunk.quadPosition === 'sw') 
                eChunk = chunk.parent.chunks.get('se')

            // From parent neighbours
            else
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

            /**
             * South
             */
            // From quad
            if(chunk.quadPosition === 'nw') 
                sChunk = chunk.parent.chunks.get('sw')

            // From quad
            else if(chunk.quadPosition === 'ne') 
                sChunk = chunk.parent.chunks.get('se')

            // From parent neighbours
            else
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

            /**
             * West
             */
            // From quad
            if(chunk.quadPosition === 'ne')
                wChunk = chunk.parent.chunks.get('nw')

            // From quad
            else if(chunk.quadPosition === 'se')
                wChunk = chunk.parent.chunks.get('sw')

            // From parent neighbours
            else
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

        if(deepestChunk.terrain)
        {
            const topology = deepestChunk.terrain.getTopologyForPosition(x, z)

            return topology
        }
    }

    getDeepestChunkForPosition(x, z)
    {
        const baseChunk = this.getChunkForPosition(x, z)
        const chunk = baseChunk.getChunkForPosition(x, z)
        return chunk
    }
}