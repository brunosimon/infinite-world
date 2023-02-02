import GAME from '@/Game.js'

import '@/Utils/EventEmitter.js'
import '@/Utils/Loader.js'
import '@/Utils/MathUtils.js'
import '@/Utils/Time.js'

import '@/World.js'
import '@/Viewport.js'
import '@/Resources.js'
import '@/Controls.js'

import '@/Debug/Debug.js'
import '@/Debug/Stats.js'
import '@/Debug/UI.js'

import '@/Render/Camera.js'
import '@/Render/Chunk.js'
import '@/Render/ChunkHelper.js'
import '@/Render/Chunks.js'
import '@/Render/Grass.js'
import '@/Render/Noises.js'
import '@/Render/Player.js'
import '@/Render/Render.js'
import '@/Render/Renderer.js'
import '@/Render/Sky.js'
import '@/Render/Terrain.js'
import '@/Render/TerrainGradient.js'
import '@/Render/Terrains.js'
import '@/Render/Water.js'

import '@/Render/Materials/Grass.js'
import '@/Render/Materials/Noises.js'
import '@/Render/Materials/SkyBackground.js'
import '@/Render/Materials/SkySphere.js'
import '@/Render/Materials/Stars.js'
import '@/Render/Materials/Terrain.js'
import '@/Render/Materials/Player.js'

import '@/State/Chunk.js'
import '@/State/Chunks.js'
import '@/State/Day.js'
import '@/State/Player.js'
import '@/State/PlayerView.js'
import '@/State/PlayerViewFly.js'
import '@/State/PlayerViewThirdPerson.js'
import '@/State/State.js'
import '@/State/Sun.js'
import '@/State/Terrain.js'
import '@/State/Terrains.js'

window.world = new GAME.World({
    domElement: document.querySelector('.game')
})