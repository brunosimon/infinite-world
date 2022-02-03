uniform float uMaxElevation;
uniform float uFresnelOffset;
uniform float uFresnelScale;
uniform float uFresnelPower;
uniform vec3 uSunDirection;

varying float vElevation;
varying float vFresnel;
varying float vLightness;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vec3 viewDirection = normalize(modelPosition.xyz - cameraPosition);
    vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);

    // Lightness
    float lightness = dot(normal, - uSunDirection);
    float smoothness = 0.0;
    lightness = (lightness * (1.0 - smoothness)) + smoothness;
    lightness = clamp(lightness, 0.0, 1.0);
    
    // lightness = step(0.5, lightness);

    // Fresnel
    float fresnel = uFresnelOffset + uFresnelScale * (1.0 + dot(viewDirection, worldNormal));
    fresnel = pow(fresnel, uFresnelPower);

    vElevation = modelPosition.y / uMaxElevation + 0.5;
    vFresnel = fresnel;
    vLightness = lightness;
}