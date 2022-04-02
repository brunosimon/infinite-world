import GAME from '@/Game.js' 

class MathUtils
{
    distance(aX, aY, bX, bY)
    {
        return Math.hypot(aX - bX, aY - bY)
    }
}

GAME.register('UTILS', 'MathUtils', MathUtils)
export default MathUtils