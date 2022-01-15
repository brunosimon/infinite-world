#define M_PI 3.1415926535897932384626433832795

uniform vec3 uLightAColor;
uniform vec3 uLightAPosition;
uniform float uLightAIntensity;
uniform vec3 uLightBColor;
uniform vec3 uLightBPosition;
uniform float uLightBIntensity;

uniform vec2 uSubdivision;

uniform vec3 uOffset;

uniform float uDistortionFrequency;
uniform float uDistortionStrength;
uniform float uDisplacementFrequency;
uniform float uDisplacementStrength;

uniform float uFresnelOffset;
uniform float uFresnelMultiplier;
uniform float uFresnelPower;

uniform float uTime;

varying vec3 vColor;

#pragma glslify: perlin4d = require('../partials/perlin4d.glsl')
#pragma glslify: perlin3d = require('../partials/perlin3d.glsl')

vec3 getDisplacedPosition(vec3 _position)
{
    vec3 distoredPosition = _position;
    distoredPosition += perlin4d(vec4(distoredPosition * uDistortionFrequency + uOffset, uTime)) * uDistortionStrength;

    float perlinStrength = perlin4d(vec4(distoredPosition * uDisplacementFrequency + uOffset, uTime));
    
    vec3 displacedPosition = _position;
    displacedPosition += normalize(_position) * perlinStrength * uDisplacementStrength;

    return displacedPosition;
}

void main()
{
    // Position
    vec3 displacedPosition = getDisplacedPosition(position);
    vec4 viewPosition = viewMatrix * vec4(displacedPosition, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    // Bi tangents
    float distanceA = (M_PI * 2.0) / uSubdivision.x;
    float distanceB = M_PI / uSubdivision.x;

    vec3 biTangent = cross(normal, tangent.xyz);

    vec3 positionA = position + tangent.xyz * distanceA;
    vec3 displacedPositionA = getDisplacedPosition(positionA);

    vec3 positionB = position + biTangent.xyz * distanceB;
    vec3 displacedPositionB = getDisplacedPosition(positionB);

    vec3 computedNormal = cross(displacedPositionA - displacedPosition.xyz, displacedPositionB - displacedPosition.xyz);
    computedNormal = normalize(computedNormal);

    // Fresnel
    vec3 viewDirection = normalize(displacedPosition.xyz - cameraPosition);
    float fresnel = uFresnelOffset + (1.0 + dot(viewDirection, computedNormal)) * uFresnelMultiplier;
    fresnel = pow(max(0.0, fresnel), uFresnelPower);

    // Color
    float lightAIntensity = max(0.0, - dot(computedNormal.xyz, normalize(- uLightAPosition))) * uLightAIntensity;
    float lightBIntensity = max(0.0, - dot(computedNormal.xyz, normalize(- uLightBPosition))) * uLightBIntensity;

    vec3 color = vec3(0.0);
    color = mix(color, uLightAColor, lightAIntensity * fresnel);
    color = mix(color, uLightBColor, lightBIntensity * fresnel);
    color = mix(color, vec3(1.0), clamp(pow(max(0.0, fresnel - 0.8), 3.0), 0.0, 1.0));

    // Varying
    vColor = color;
}