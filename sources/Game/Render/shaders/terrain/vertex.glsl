uniform vec3 uPlayerPosition;
uniform float uLightnessSmoothness;
// uniform float uLightnessEdgeMin;
// uniform float uLightnessEdgeMax;
uniform float uFresnelOffset;
uniform float uFresnelScale;
uniform float uFresnelPower;
uniform vec3 uSunPosition;
uniform float uGrassDistance;
uniform sampler2D uTexture;

varying float vSunReflection;
varying float vSunShade;
varying float vFogDepth;
varying vec3 vColor;

#include ../partials/getSunShade.glsl;
#include ../partials/getGrassAttenuation.glsl;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vec3 viewDirection = normalize(modelPosition.xyz - cameraPosition);
    vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
    vec3 viewNormal = normalize(normalMatrix * normal);

    // Sun shade
    float sunShade = getSunShade(normal);

    // Sun reflection
    vec3 sunViewReflection = reflect(uSunPosition, viewNormal);
    float sunViewStrength = max(0.2, dot(sunViewReflection, viewDirection));

    float fresnel = uFresnelOffset + uFresnelScale * (1.0 + dot(viewDirection, worldNormal));
    float sunReflection = fresnel * sunViewStrength;
    sunReflection = pow(sunReflection, uFresnelPower);
    // sunReflection = 0.0;

    // Colors
    vec4 terrainColor = texture2D(uTexture, uv);

    vec3 uGrassLowColor = vec3(0.4, 0.5, 0.2);
    vec3 uGrassHighColor = vec3(0.4 * 1.3, 0.5 * 1.3, 0.2 * 1.3);
    

    // Distance attenuation
    float grassDistanceAttenuation = getGrassAttenuation(modelPosition.xz);
    vec3 grassColor = mix(uGrassLowColor, uGrassHighColor, 1.0 - (grassDistanceAttenuation * terrainColor.g));

    // vec3 dirtColor = vec3(0.3, 0.2, 0.1);
    // vec3 color = mix(dirtColor, grassColor, terrainColor.g);

    // Varyings
    vSunReflection = sunReflection;
    vSunShade = sunShade;
	vFogDepth = - viewPosition.z;
    vColor = grassColor;
}