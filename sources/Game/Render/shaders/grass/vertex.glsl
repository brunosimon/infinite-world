#define M_PI 3.1415926535897932384626433832795

uniform float uSize;
uniform vec3 uPlayerPosition;
uniform sampler2D uTerrainATexture;
uniform float uTerrainASize;
uniform vec2 uTerrainAOffset;

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
    // modelPosition.xyz += newCenter.xyz;
    modelPosition.xz += newCenter.xz;

    // Rotate blade to face camera
    float angleToCamera = atan(modelCenter.x - cameraPosition.x, modelCenter.z - cameraPosition.z);
    modelPosition.xz = rotateUV(modelPosition.xz, angleToCamera, modelCenter.xz);

    // Elevation
    vec2 terrainUv = modelPosition.zx / uTerrainASize;
    // terrainUv.x = 1.0 - terrainUv.x;
    // terrainUv.y = 1.0 - terrainUv.y;
    float elevation = texture2D(uTerrainATexture, terrainUv).r;
    // elevation = (elevation - 0.5) * (160.0 * 2.0);
    modelPosition.y += elevation;

    // Final position
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vec3 grassColor = vec3(0.4, 0.50, 0.2);
    grassColor += 0.2 * tipness * distanceAttenuation;
    // vColor = grassColor;
    vColor = vec3(terrainUv, 1.0);
}