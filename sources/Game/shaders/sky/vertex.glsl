#define M_PI 3.1415926535897932384626433832795

uniform vec3 uSunPosition;

varying vec3 vColor;

vec3 blendAdd(vec3 base, vec3 blend) {
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

    vec3 uSunColor = vec3(1.0);
    // float sunStrength = pow(max(0.0, 1.0 - distanceToSun * 0.5), 2.0);
    float sunStrength = smoothstep(0.0, 1.0, clamp(1.0 - distanceToSun, 0.0, 1.0));
    // float sunStrength = 1.0 - smoothstep(distanceToSun * 2.0, 0.0, 1.0);

    // Color
    vec3 colorA = vec3(1.0);
    vec3 colorB = vec3(0.1, 0.5, 1.0);
    
    float mixStrength = abs(uv.y - 0.5) * 2.0;
    mixStrength = 1.0 - pow(1.0 - mixStrength, 5.0);

    vec3 color = mix(colorA, colorB, mixStrength);

    color = blendAdd(color, uSunColor, sunStrength);

    float temp = distanceToSun * 2.0;
    vColor = vec3(color);
}