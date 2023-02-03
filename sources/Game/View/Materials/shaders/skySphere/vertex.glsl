#define M_PI 3.1415926535897932384626433832795

uniform vec3 uSunPosition;

uniform float uAtmosphereElevation;
uniform float uAtmospherePower;
uniform vec3 uColorDayCycleLow;
uniform vec3 uColorDayCycleHigh;
uniform vec3 uColorNightLow;
uniform vec3 uColorNightHigh;

uniform float uDawnAngleAmplitude;
uniform float uDawnElevationAmplitude;
uniform vec3 uColorDawn;

uniform float uSunAmplitude;
uniform float uSunMultiplier;
uniform vec3 uColorSun;

uniform float uDayCycleProgress;

varying vec3 vColor;

vec3 blendAdd(vec3 base, vec3 blend)
{
	return min(base + blend, vec3(1.0));
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

    /**
     * Sky and atmosphere
     */
    // Horizon intensity
    float horizonIntensity = (uv.y - 0.5) / uAtmosphereElevation;
    horizonIntensity = pow(1.0 - horizonIntensity, uAtmospherePower);

    // Color day
    vec3 colorDayCycle = mix(uColorDayCycleHigh, uColorDayCycleLow, horizonIntensity);
    
    // Color night
    vec3 colorNight = mix(uColorNightHigh, uColorNightLow, horizonIntensity);
    
    // Mix between day and night
    float dayIntensity = abs(uDayCycleProgress - 0.5) * 2.0;
    vec3 color = mix(colorNight, colorDayCycle, dayIntensity);

    /**
     * Sun glow
     */
    // Distance to sun
    float distanceToSun = distance(normalizedPosition, uSunPosition);

    /**
     * Dawn
     */
    // Dawn angle intensity
    float dawnAngleIntensity = dot(normalize(uSunPosition.xz), normalize(normalizedPosition.xz));
    dawnAngleIntensity = smoothstep(0.0, 1.0, (dawnAngleIntensity - (1.0 - uDawnAngleAmplitude)) / uDawnAngleAmplitude);

    // Dawn elevation intensity
    float dawnElevationIntensity = 1.0 - min(1.0, (uv.y - 0.5) / uDawnElevationAmplitude);

    // Dawn day progress intensity
    float dawnDayCycleIntensity = cos(uDayCycleProgress * 4.0 * M_PI + M_PI) * 0.5 + 0.5;

    // Final dawn intensity and color
    float dawnIntensity = clamp(dawnAngleIntensity * dawnElevationIntensity * dawnDayCycleIntensity, 0.0, 1.0);
    color = blendAdd(color, uColorDawn, dawnIntensity);

    /**
     * Sun glow
     */
    // Sun intensity
    float sunIntensity = smoothstep(0.0, 1.0, clamp(1.0 - distanceToSun / uSunAmplitude, 0.0, 1.0)) * uSunMultiplier;
    color = blendAdd(color, uColorSun, sunIntensity);

    float sunGlowStrength = pow(max(0.0, 1.0 + 0.05 - distanceToSun * 2.5), 2.0);
    color = blendAdd(color, uColorSun, sunGlowStrength);

    vColor = vec3(color);
    // vColor = vec3(sunIntensity);
}