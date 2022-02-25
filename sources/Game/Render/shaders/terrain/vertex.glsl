uniform vec3 uPlayerPosition;
uniform float uLightnessSmoothness;
uniform float uFresnelOffset;
uniform float uFresnelScale;
uniform float uFresnelPower;
uniform vec3 uSunPosition;
uniform float uGrassDistance;
uniform sampler2D uTexture;
uniform sampler2D uFogTexture;

varying vec3 vColor;

#include ../partials/getSunShade.glsl;
#include ../partials/getGrassAttenuation.glsl;
#include ../partials/getSunShadeColor.glsl;
#include ../partials/getSunReflection.glsl;
#include ../partials/getSunReflectionColor.glsl;
#include ../partials/getFogColor.glsl;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    float depth = - viewPosition.z;
    gl_Position = projectionMatrix * viewPosition;

    vec3 viewDirection = normalize(modelPosition.xyz - cameraPosition);
    vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
    vec3 viewNormal = normalize(normalMatrix * normal);

    // Colors
    vec4 terrainColor = texture2D(uTexture, uv);

    vec3 uGrassLowColor = vec3(0.4, 0.5, 0.2);
    vec3 uGrassHighColor = vec3(0.4 * 1.3, 0.5 * 1.3, 0.2 * 1.3);
    
    // Distance attenuation
    float grassDistanceAttenuation = getGrassAttenuation(modelPosition.xz);
    vec3 grassColor = mix(uGrassLowColor, uGrassHighColor, 1.0 - (grassDistanceAttenuation * terrainColor.g));

    vec3 color = grassColor;

    // Sun shade
    float sunShade = getSunShade(normal);
    color = getSunShadeColor(color, sunShade);

    // Sun reflection
    float sunReflection = getSunReflection(viewDirection, worldNormal, viewNormal);
    color = getSunReflectionColor(color, sunReflection);

    // Fog
    vec2 screenUv = (gl_Position.xy / gl_Position.w * 0.5) + 0.5;
    color = getFogColor(color, depth, screenUv);

    // vec3 dirtColor = vec3(0.3, 0.2, 0.1);
    // vec3 color = mix(dirtColor, grassColor, terrainColor.g);

    // Varyings
    vColor = color;
    // vColor = vec3(uv.x);
}