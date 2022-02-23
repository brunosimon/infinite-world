#define M_PI 3.1415926535897932384626433832795

uniform float uGrassDistance;
uniform vec3 uPlayerPosition;
uniform float uTerrainSize;
uniform float uTerrainTextureSize;
uniform sampler2D uTerrainATexture;
uniform vec2 uTerrainAOffset;
uniform sampler2D uTerrainBTexture;
uniform vec2 uTerrainBOffset;
uniform sampler2D uTerrainCTexture;
uniform vec2 uTerrainCOffset;
uniform sampler2D uTerrainDTexture;
uniform vec2 uTerrainDOffset;
uniform vec3 uSunPosition;

attribute vec3 center;
attribute float tipness;

varying vec3 vColor;

#include ../partials/getSunShade.glsl;
#include ../partials/getSunShadeColor.glsl;
#include ../partials/getGrassAttenuation.glsl;

vec2 rotateUV(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

void main()
{
    // Recalculate center and keep around player
    vec3 newCenter = center;
    newCenter -= uPlayerPosition;
    float halfSize = uGrassDistance * 0.5;
    newCenter.x = mod(newCenter.x + halfSize, uGrassDistance) - halfSize;
    newCenter.z = mod(newCenter.z + halfSize, uGrassDistance) - halfSize;
    vec4 modelCenter = modelMatrix * vec4(newCenter, 1.0);

    // Distance attenuation
    float distanceAttenuation = getGrassAttenuation(modelCenter.xz);

    // vec3 scaledPosition = position * distanceAttenuation;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Move grass to center
    modelPosition.xz += newCenter.xz;

    // Rotate blade to face camera
    float angleToCamera = atan(modelCenter.x - cameraPosition.x, modelCenter.z - cameraPosition.z);
    modelPosition.xz = rotateUV(modelPosition.xz, angleToCamera, modelCenter.xz);

    // Elevation from terrain textures
    vec2 terrainAUv = (modelPosition.xz - uTerrainAOffset.xy) / uTerrainSize;
    vec2 terrainBUv = (modelPosition.xz - uTerrainBOffset.xy) / uTerrainSize;
    vec2 terrainCUv = (modelPosition.xz - uTerrainCOffset.xy) / uTerrainSize;
    vec2 terrainDUv = (modelPosition.xz - uTerrainDOffset.xy) / uTerrainSize;

    float fragmentSize = 1.0 / uTerrainTextureSize;
    vec4 terrainAColor = texture2D(uTerrainATexture, terrainAUv * (1.0 - fragmentSize) + fragmentSize * 0.5);
    vec4 terrainBColor = texture2D(uTerrainBTexture, terrainBUv * (1.0 - fragmentSize) + fragmentSize * 0.5);
    vec4 terrainCColor = texture2D(uTerrainCTexture, terrainCUv * (1.0 - fragmentSize) + fragmentSize * 0.5);
    vec4 terrainDColor = texture2D(uTerrainDTexture, terrainDUv * (1.0 - fragmentSize) + fragmentSize * 0.5);

    vec4 terrainColor = vec4(0);
    terrainColor += step(0.0, terrainAUv.x) * step(terrainAUv.x, 1.0) * step(0.0, terrainAUv.y) * step(terrainAUv.y, 1.0) * terrainAColor;
    terrainColor += step(0.0, terrainBUv.x) * step(terrainBUv.x, 1.0) * step(0.0, terrainBUv.y) * step(terrainBUv.y, 1.0) * terrainBColor;
    terrainColor += step(0.0, terrainCUv.x) * step(terrainCUv.x, 1.0) * step(0.0, terrainCUv.y) * step(terrainCUv.y, 1.0) * terrainCColor;
    terrainColor += step(0.0, terrainDUv.x) * step(terrainDUv.x, 1.0) * step(0.0, terrainDUv.y) * step(terrainDUv.y, 1.0) * terrainDColor;

    modelPosition.y += terrainColor.a;
    modelCenter.y += terrainColor.a;

    // Terrain texture attenuation
    modelPosition.xyz = mix(modelPosition.xyz, modelCenter.xyz, 1.0 - (distanceAttenuation * terrainColor.g));

    // Final position
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Grass color
    vec3 uGrassLowColor = vec3(0.4, 0.5, 0.2);
    vec3 uGrassHighColor = vec3(0.4 * 1.3, 0.5 * 1.3, 0.2 * 1.3);
    vec3 grassColor = mix(uGrassLowColor, uGrassHighColor, tipness);

    // Sun shade
    float sunShade = getSunShade(vec3(0.0, 1.0, 0.0));
    grassColor = getSunShadeColor(grassColor, sunShade);

    vColor = grassColor;
    // vColor = vec3(terrainAUv, 1.0);
}