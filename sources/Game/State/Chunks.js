import EventsEmitter from 'events'
import { vec2 } from 'gl-matrix'

import State from '@/State/State.js'
import Chunk from './Chunk.js'

export default class Chunks
{
    constructor()
    {
        this.state = State.getInstance()

        this.minSize = 64
        this.maxDepth = 4
        this.maxSize = this.minSize * Math.pow(2, this.maxDepth)
        this.splitRatioPerSize = 1.3
        this.lastId = 0
        
        this.events = new EventsEmitter()
        this.mainChunks = new Map()
        this.allChunks = new Map()
        this.playerChunkKey = null

        this.check()
    }

    check()
    {
        // Set all children flag for check
        for(const [key, chunk] of this.allChunks)
            chunk.needsCheck = true

        // Get the coordinates to main chunks around the player
        const mainChunksCoordinates = this.getMainChunksCoordinates()

        // Destroy main chunks not in proximity anymore
        for(const [key, chunk] of this.mainChunks)
        {
            if(!mainChunksCoordinates.find((coordinates) => coordinates.key === key))
            {
                chunk.destroy()
                this.mainChunks.delete(key)
            }
        }

        // Create new main chunks
        for(const coordinates of mainChunksCoordinates)
        {
            if(!this.mainChunks.has(coordinates.key))
            {
                const chunk = this.create(null, null, this.maxSize, coordinates.x, coordinates.z, 0)
                this.mainChunks.set(coordinates.key, chunk)
            }
        }
        
        // Check chunks
        for(const [ key, chunk ] of this.mainChunks)
            chunk.check()

        // Update neighbours
        this.updateAllNeighbours()
    }

    update()
    {
        // Check only if player coordinates changed to to another minimal chunk
        const player = this.state.player
        const playerChunkKey = `${Math.round(player.position.current[0] / this.minSize * 2 + 0.5)}${Math.round(player.position.current[2] / this.minSize * 2 + 0.5)}`

        if(playerChunkKey !== this.playerChunkKey)
        {
            this.playerChunkKey = playerChunkKey
            this.check()
        }
        
        // Update main chunks
        for(const [ key, chunk ] of this.mainChunks)
            chunk.update()
    }

    create(parent, quadPosition, halfSize, x, z, depth)
    {
        const id = this.lastId++
        const chunk = new Chunk(id, this, parent, quadPosition, halfSize, x, z, depth)

        this.allChunks.set(id, chunk)

        this.events.emit('create', chunk)

        return chunk
    }

    updateAllNeighbours()
    {
        // Update main chunks neighbours
        for(const [key, chunk] of this.mainChunks)
        {
            const coordinates = key.split(',')
            const x = parseFloat(coordinates[0])
            const z = parseFloat(coordinates[1])

            const nChunkKey = `${x},${z - 1}`
            const eChunkKey = `${x + 1},${z}`
            const sChunkKey = `${x},${z + 1}`
            const wChunkKey = `${x - 1},${z}`

            const nChunk = this.mainChunks.get(nChunkKey) ?? false
            const eChunk = this.mainChunks.get(eChunkKey) ?? false
            const sChunk = this.mainChunks.get(sChunkKey) ?? false
            const wChunk = this.mainChunks.get(wChunkKey) ?? false

            chunk.setNeighbours(nChunk, eChunk, sChunk, wChunk)
        }

        // All not main chunks in depth order
        const chunks = [...this.allChunks.values()].filter(chunk => chunk.depth > 0).sort((a, b) => a.depth - b.depth)

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
                nChunk = chunk.parent.children.get('nw')

            // From quad
            else if(chunk.quadPosition === 'se') 
                nChunk = chunk.parent.children.get('ne')

            // From parent neighbours
            else
            {
                const parentNeighbour = chunk.parent.neighbours.get('n')
                if(parentNeighbour)
                {
                    if(parentNeighbour.splitted)
                        nChunk = parentNeighbour.children.get(chunk.quadPosition === 'nw' ? 'sw' : 'se')
                    else
                        nChunk = parentNeighbour
                }
            }

            /**
             * East
             */
            // From quad
            if(chunk.quadPosition === 'nw') 
                eChunk = chunk.parent.children.get('ne')

            // From quad
            else if(chunk.quadPosition === 'sw') 
                eChunk = chunk.parent.children.get('se')

            // From parent neighbours
            else
            {
                const parentNeighbour = chunk.parent.neighbours.get('e')
                if(parentNeighbour)
                {
                    if(parentNeighbour.splitted)
                        eChunk = parentNeighbour.children.get(chunk.quadPosition === 'ne' ? 'nw' : 'sw')
                    else
                        eChunk = parentNeighbour
                }
            }

            /**
             * South
             */
            // From quad
            if(chunk.quadPosition === 'nw') 
                sChunk = chunk.parent.children.get('sw')

            // From quad
            else if(chunk.quadPosition === 'ne') 
                sChunk = chunk.parent.children.get('se')

            // From parent neighbours
            else
            {
                const parentNeighbour = chunk.parent.neighbours.get('s')
                if(parentNeighbour)
                {
                    if(parentNeighbour.splitted)
                        sChunk = parentNeighbour.children.get(chunk.quadPosition === 'sw' ? 'nw' : 'ne')
                    else
                        sChunk = parentNeighbour
                }
            }

            /**
             * West
             */
            // From quad
            if(chunk.quadPosition === 'ne')
                wChunk = chunk.parent.children.get('nw')

            // From quad
            else if(chunk.quadPosition === 'se')
                wChunk = chunk.parent.children.get('sw')

            // From parent neighbours
            else
            {
                const parentNeighbour = chunk.parent.neighbours.get('w')
                if(parentNeighbour)
                {
                    if(parentNeighbour.splitted)
                        wChunk = parentNeighbour.children.get(chunk.quadPosition === 'nw' ? 'ne' : 'se')
                    else
                        wChunk = parentNeighbour
                }
            }

            chunk.setNeighbours(nChunk, eChunk, sChunk, wChunk)
        }
    }

    getMainChunksCoordinates()
    {
        const player = this.state.player
        const currentX = Math.round(player.position.current[0] / this.maxSize)
        const currentZ = Math.round(player.position.current[2] / this.maxSize)

        // Find normalize neighbours
        const mainChunksCoordinates = [
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
        for(const coordinates of mainChunksCoordinates)
        {
            coordinates.coordinatesX = coordinates.x
            coordinates.coordinatesZ = coordinates.z
            coordinates.key = `${coordinates.x},${coordinates.z}`
            coordinates.x *= this.maxSize
            coordinates.z *= this.maxSize
        }

        return mainChunksCoordinates
    }

    underSplitDistance(size, chunkX, chunkY)
    {
        const player = this.state.player
        const distance = Math.hypot(player.position.current[0] - chunkX, player.position.current[2] - chunkY)
        return distance < size * this.splitRatioPerSize
    }

    getChildChunkForPosition(x, z)
    {
        for(const [key, chunk] of this.mainChunks)
        {
            if(chunk.isInside(x, z))
            {
                return chunk
            }
        }
    }

    getDeepestChunkForPosition(x, z)
    {
        const baseChunk = this.getChildChunkForPosition(x, z)
        if(!baseChunk)
            return false

        const chunk = baseChunk.getChildChunkForPosition(x, z)
        return chunk
    }

    getElevationForPosition(x, z)
    {
        const currentChunk = this.getDeepestChunkForPosition(x, z)

        if(!currentChunk || !currentChunk.terrain)
            return false

        const elevation = currentChunk.terrain.getElevationForPosition(x, z)
        return elevation
    }
}