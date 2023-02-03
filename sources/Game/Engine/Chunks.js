import GAME from '@/Game.js' 

import { vec2 } from 'gl-matrix'

class Chunks extends GAME.UTILS.EventEmitter
{
    constructor()
    {
        super()

        this.world = new GAME.World()
        this.state = new GAME.ENGINE.Engine()
        this.mathUtils = this.world.mathUtils

        this.reference = vec2.create()
        this.minSize = 64
        this.maxDepth = 4
        this.maxSize = this.minSize * Math.pow(2, this.maxDepth)
        this.splitRatioPerSize = 1.3
        this.lastId = 0
        
        this.children = new Map()
        this.allChildren = new Map()

        this.setThrottle()
        this.throttleUpdate()
    }

    setThrottle()
    {
        this.throttle = {}
        this.throttle.lastKey = null
        this.throttle.test = () =>
        {
            const key = `${Math.round(this.reference[0] / this.minSize * 2 + 0.5)}${Math.round(this.reference[1] / this.minSize * 2 + 0.5)}`
            if(key !== this.throttle.lastKey)
            {
                this.throttle.lastKey = key
                this.throttleUpdate()
            }
        }
    }

    throttleUpdate()
    {
        for(const [key, chunk] of this.allChildren)
        {
            chunk.quadsNeedsUpdate = true
        }

        const chunksCoordinates = this.getProximityChunkCoordinates()

        // Destroy chunk not in neighbours anymore
        for(const [key, chunk] of this.children)
        {
            if(!chunksCoordinates.find((coordinates) => coordinates.key === key))
            {
                chunk.destroy()
                this.children.delete(key)
            }
        }

        // Create new chunks
        for(const coordinates of chunksCoordinates)
        {
            if(!this.children.has(coordinates.key))
            {
                const chunk = this.create(null, null, this.maxSize, coordinates.x, coordinates.z, 0)
                this.children.set(coordinates.key, chunk)
            }
        }
        
        // Test chunks
        for(const [ key, chunk ] of this.children)
        {
            chunk.throttleUpdate()
        }

        // Update neighbours
        this.updateNeighbours()
    }

    update()
    {
        const player = this.state.player
        vec2.set(this.reference, player.position.current[0], player.position.current[2])

        this.throttle.test()
        for(const [ key, chunk ] of this.children)
        {
            chunk.update()
        }
    }

    create(parent, quadPosition, halfSize, x, z, depth)
    {
        const id = this.lastId++
        const chunk = new GAME.ENGINE.Chunk(id, this, parent, quadPosition, halfSize, x, z, depth)

        this.allChildren.set(id, chunk)

        this.trigger('create', [ chunk ])

        return chunk
    }

    underSplitDistance(size, chunkX, chunkY)
    {
        const distance = this.mathUtils.distance(this.reference[0], this.reference[1], chunkX, chunkY)
        return distance < size * this.splitRatioPerSize
    }

    updateNeighbours()
    {
        // Update base chunks neighbours
        for(const [key, chunk] of this.children)
        {
            const coordinates = key.split(',')
            const x = parseFloat(coordinates[0])
            const z = parseFloat(coordinates[1])

            const nChunkKey = `${x},${z - 1}`
            const eChunkKey = `${x + 1},${z}`
            const sChunkKey = `${x},${z + 1}`
            const wChunkKey = `${x - 1},${z}`

            const nChunk = this.children.get(nChunkKey) ?? false
            const eChunk = this.children.get(eChunkKey) ?? false
            const sChunk = this.children.get(sChunkKey) ?? false
            const wChunk = this.children.get(wChunkKey) ?? false

            chunk.updateNeighbours(nChunk, eChunk, sChunk, wChunk)
        }

        // All not base chunks in depth order
        const chunks = [...this.allChildren.values()].filter(chunk => chunk.depth > 0).sort((a, b) => a.depth - b.depth)

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

            chunk.updateNeighbours(nChunk, eChunk, sChunk, wChunk)
        }
    }

    getProximityChunkCoordinates()
    {
        const currentX = Math.round(this.reference[0] / this.maxSize)
        const currentZ = Math.round(this.reference[1] / this.maxSize)

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
        for(const [key, chunk] of this.children)
        {
            if(chunk.isInside(x, z))
            {
                return chunk
            }
        }
    }

    getTopologyForPosition(x, z)
    {
        const currentChunk = this.getDeepestChunkForPosition(x, z)

        if(!currentChunk || !currentChunk.terrain)
            return false

        const topology = currentChunk.terrain.getTopologyForPosition(x, z)
        return topology
    }

    getDeepestChunkForPosition(x, z)
    {
        const baseChunk = this.getChunkForPosition(x, z)
        if(!baseChunk)
            return false

        const chunk = baseChunk.getChunkForPosition(x, z)
        return chunk
    }
}

GAME.register('ENGINE', 'Chunks', Chunks)
export default Chunks