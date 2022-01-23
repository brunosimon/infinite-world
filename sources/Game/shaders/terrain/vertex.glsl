uniform float uMaxElevation;
uniform float uFresnelOffset;
uniform float uFresnelScale;
uniform float uFresnelPower;

varying float vElevation;
varying float vFresnel;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vec3 viewDirection = normalize(modelPosition.xyz - cameraPosition);
    vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);

    float fresnel = uFresnelOffset + uFresnelScale * (1.0 + dot(viewDirection, worldNormal));
    fresnel = pow(fresnel, uFresnelPower);

    vElevation = modelPosition.y / uMaxElevation + 0.5;
    vFresnel = fresnel;
}