import SimplexNoise from 'simplex-noise'

export default class Perlin
{
    constructor()
    {
        this.simplexNoise = new SimplexNoise()
    }

    get2D(x, y, lacunarity, persistence, iterations, baseFrequency, baseAmplitude, power)
    {
        let elevation = 0
        let frequency = baseFrequency
        let amplitude = baseAmplitude
        let normalisation = 0

        for(let i = 0; i < iterations; i++)
        {
            const noise = this.simplexNoise.noise2D(x * frequency, y * frequency) * 0.5 + 0.5
            elevation += noise * amplitude

            normalisation += amplitude
            amplitude *= persistence
            frequency *= lacunarity
        }

        elevation /= normalisation
        elevation = Math.pow(elevation, power)

        return elevation
    }
}