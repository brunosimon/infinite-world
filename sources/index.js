import Game from '@/Game.js'

const game = new Game()
document.querySelector('.game').append(game.view.renderer.instance.domElement)

// class Component
// {
//     constructor()
//     {
//         this.a = 'tata'
//     }
// }

// class Components
// {
//     constructor()
//     {
//         this.stateComponents = []
//         this.viewComponents = []
//     }

//     add(stateComponent = null, viewComponent = null)
//     {
//         // Associate
//         if(stateComponent && viewComponent)
//         {
//             if(viewComponent)
//                 stateComponent.view = viewComponent

//             if(stateComponent)
//                 viewComponent.view = stateComponent
//         }

//         // Save
//         if(!(viewComponent in this.viewComponents))
//             this.viewComponents.push(viewComponent)

//         if(!(stateComponent in this.stateComponents))
//             this.stateComponents.push(stateComponent)
//     }

//     update()
//     {
//         for(const component of this.stateComponents)
//             component.update()

//         for(const component of this.viewComponents)
//             component.update()
//     }
// }

// class Chunk
// {
//     constructor()
//     {
        
//     }
// }

// class ChunkState
// {
//     constructor()
//     {
        
//     }
// }

// class ChunkView
// {
//     constructor()
//     {
        
//     }
// }