export default class MathUtils
{
    distance(aX, aY, bX, bY)
    {
        return Math.hypot(aX - bX, aY - bY)
    }
}