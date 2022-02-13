#define M_PI 3.1415926535897932384626433832795

uniform vec3 uSunPosition;
uniform vec3 uColorDayLow;
uniform vec3 uColorDayHigh;
uniform vec3 uColorNightLow;
uniform vec3 uColorNightHigh;
uniform vec3 uColorSun;
uniform vec3 uColorDawn;
uniform float uDayProgress;

varying vec3 vColor;

vec3 blendAdd(vec3 base, vec3 blend)
{
	return min(base+blend,vec3(1.0));
}

vec3 blendAdd(vec3 base, vec3 blend, float opacity)
{
	return (blendAdd(base, blend) * opacity + base * (1.0 - opacity));
}

void main()
{
    // Vertex position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vec3 normalizedPosition = normalize(position);
    float distanceToSun = distance(normalizedPosition, uSunPosition);

    /**
     * Atmosphere
     */
    float lowIntensity = (uv.y - 0.5) * 2.0;
    lowIntensity = pow(1.0 - lowIntensity, 10.0);

    vec3 colorDay = mix(uColorDayHigh, uColorDayLow, lowIntensity);
    vec3 colorNight = mix(uColorNightHigh, uColorNightLow, lowIntensity);
    float dayIntensity = abs(uDayProgress - 0.5) * 2.0;
    vec3 color = mix(colorNight, colorDay, dayIntensity);

    /**
     * Sun atmosphere
     */
    float sunAmosphereStrength = smoothstep(0.0, 1.0, clamp(1.0 - distanceToSun, 0.0, 1.0));
    color = blendAdd(color, uColorSun, sunAmosphereStrength * 0.5);

    /**
     * Dawn
     */
    float downIntensity = 1.0 - min(1.0, (uv.y - 0.5) * 20.0);
    float dawnIntensity = (1.0 - distanceToSun * 1.0);
    dawnIntensity *= downIntensity;
    dawnIntensity = clamp(dawnIntensity, 0.0, 1.0);

    color = blendAdd(color, uColorDawn, dawnIntensity);

    /**
     * Sun glow
     */
    float sunGlowStrength = pow(max(0.0, 1.0 + 0.05 - distanceToSun * 2.5), 2.0);
    color = blendAdd(color, uColorSun, sunGlowStrength);

    vColor = vec3(color);
}