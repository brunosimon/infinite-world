uniform float uLightnessSmoothness;
uniform float uLightnessEdgeMin;
uniform float uLightnessEdgeMax;
uniform float uMaxElevation;
uniform float uFresnelOffset;
uniform float uFresnelScale;
uniform float uFresnelPower;
uniform vec3 uSunPosition;

varying float vElevation;
varying float vFresnel;
varying float vLightness;
// varying vec3 vColor;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vec3 viewDirection = normalize(modelPosition.xyz - cameraPosition);
    vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
    vec3 viewNormal = normalize(normalMatrix * normal);

    // Lightness
    float lightness = dot(normal, - uSunPosition);
    lightness = lightness * 0.5 + 0.5;
    float smoothness = uLightnessSmoothness;
    // lightness = (lightness * (1.0 - smoothness)) + smoothness;
    // lightness = clamp(lightness, 0.0, 1.0);
    lightness = smoothstep(uLightnessEdgeMin , uLightnessEdgeMax, lightness);

    // Sun reflection
    vec3 sunViewReflection = reflect(uSunPosition, viewNormal);
    float sunViewStrength = max(0.2, dot(sunViewReflection, viewDirection));

    float fresnel = uFresnelOffset + uFresnelScale * (1.0 + dot(viewDirection, worldNormal));
    fresnel *= sunViewStrength;
    fresnel = pow(fresnel, uFresnelPower);

    // vColor = vec3(fresnel);

    vElevation = modelPosition.y / uMaxElevation + 0.5;
    vFresnel = fresnel;
    vLightness = lightness;
}