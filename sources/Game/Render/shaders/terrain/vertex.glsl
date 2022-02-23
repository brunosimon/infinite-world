uniform float uLightnessSmoothness;
uniform float uLightnessEdgeMin;
uniform float uLightnessEdgeMax;
uniform float uFresnelOffset;
uniform float uFresnelScale;
uniform float uFresnelPower;
uniform vec3 uSunPosition;
uniform sampler2D uTexture;

varying float vSunReflection;
varying float vSunShade;
varying float vFogDepth;
varying vec3 vColor;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vec3 viewDirection = normalize(modelPosition.xyz - cameraPosition);
    vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
    vec3 viewNormal = normalize(normalMatrix * normal);

    // Lightness
    float sunShade = dot(normal, - uSunPosition);
    sunShade = sunShade * 0.5 + 0.5;
    float smoothness = uLightnessSmoothness;
    sunShade = smoothstep(uLightnessEdgeMin , uLightnessEdgeMax, sunShade);

    // Sun reflection
    vec3 sunViewReflection = reflect(uSunPosition, viewNormal);
    float sunViewStrength = max(0.2, dot(sunViewReflection, viewDirection));

    float fresnel = uFresnelOffset + uFresnelScale * (1.0 + dot(viewDirection, worldNormal));
    fresnel *= sunViewStrength;
    fresnel = pow(fresnel, uFresnelPower);

    // Colors
    vec4 terrainColor = texture2D(uTexture, uv);
    vec3 grassColor = vec3(0.4, 0.50, 0.2);
    vec3 dirtColor = vec3(0.3, 0.2, 0.1);
    vec3 color = mix(dirtColor, grassColor, terrainColor.g);

    // Varyings
    vSunReflection = fresnel;
    vSunShade = sunShade;
	vFogDepth = - viewPosition.z;
    vColor = color;
}