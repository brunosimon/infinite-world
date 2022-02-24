uniform sampler2D uGradientTexture;
uniform vec2 uViewportSize;
uniform sampler2D uFogTexture;

varying float vSunReflection;
varying float vSunShade;
varying float vDepth;
varying vec3 vColor;

#include ../partials/getSunShadeColor.glsl;

vec3 getSunReflectionColor(vec3 baseColor)
{
    return mix(baseColor, vec3(1.0, 1.0, 1.0), clamp(vSunReflection, 0.0, 1.0));
}

vec3 getFogColor(vec3 baseColor)
{
    float uFogIntensity = 0.0025;
    vec2 screenUv = gl_FragCoord.xy / uViewportSize;
    vec3 fogColor = texture2D(uFogTexture, screenUv).rgb;
    
    float fogIntensity = 1.0 - exp(- uFogIntensity * uFogIntensity * vDepth * vDepth );
    return mix(baseColor, fogColor, fogIntensity);
}

void main()
{
    vec3 color = vColor;

    // Sun
    color = getSunShadeColor(color, vSunShade);

    // Sun fresnel
    color = getSunReflectionColor(color);

    // Fog
    color = getFogColor(color);

    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(vColor, 1.0);
}