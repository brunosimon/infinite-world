uniform sampler2D uGradientTexture;
uniform vec2 uViewportSize;
uniform sampler2D uFogTexture;

varying float vSunReflection;
varying float vSunShade;
varying float vFogDepth;
varying vec3 vColor;

vec3 applySunShade(vec3 baseColor)
{
    vec3 shadeColor = baseColor * vec3(0.0, 0.4, 1.0);
    return mix(baseColor, shadeColor, vSunShade);
}

vec3 applySunReflection(vec3 baseColor)
{
    return mix(baseColor, vec3(1.0, 1.0, 1.0), clamp(vSunReflection, 0.0, 1.0));
}

vec3 applyFog(vec3 baseColor)
{
    float uFogIntensity = 0.0025;
    vec2 screenUv = gl_FragCoord.xy / uViewportSize;
    vec3 fogColor = texture2D(uFogTexture, screenUv).rgb;
    
    float fogIntensity = 1.0 - exp(- uFogIntensity * uFogIntensity * vFogDepth * vFogDepth );
    return mix(baseColor, fogColor, fogIntensity);
}

void main()
{
    vec3 color = vColor;

    // Sun
    color = applySunShade(color);

    // Sun fresnel
    color = applySunReflection(color);

    // Fog
    color = applyFog(color);

    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(vColor, 1.0);
}