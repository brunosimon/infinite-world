#define M_PI 3.1415926535897932384626433832795

uniform float uSize;
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

attribute vec3 center;
attribute float tipness;

varying vec3 vColor;

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
    float halfSize = uSize * 0.5;
    newCenter.x = mod(newCenter.x + halfSize, uSize) - halfSize;
    newCenter.z = mod(newCenter.z + halfSize, uSize) - halfSize;
    vec4 modelCenter = modelMatrix * vec4(newCenter, 1.0);

    // Distance attenuation
    float distanceAttenuation = distance(uPlayerPosition.xz, modelCenter.xz) / uSize * 2.0;
    distanceAttenuation = 1.0 - smoothstep(0.3, 1.0, distanceAttenuation);

    vec3 scaledPosition = position * distanceAttenuation;
    vec4 modelPosition = modelMatrix * vec4(scaledPosition, 1.0);

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
    modelPosition.y -= 1.0 - terrainColor.g;

    // Final position
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vec3 grassColor = vec3(0.4, 0.50, 0.2);
    grassColor += 0.2 * tipness * distanceAttenuation;
    vColor = grassColor;
    // vColor = vec3(terrainAUv, 1.0);
}