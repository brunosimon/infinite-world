uniform sampler2D uGradientTexture;
uniform vec2 uViewportSize;
uniform sampler2D uFogTexture;

varying float vElevation;
varying float vFresnel;
varying float vLightness;
varying float vFogDepth;
varying vec3 vColor;

void main()
{
    float elevationMix = vElevation;
    // elevationMix += mix(0.0, vFresnel, sign(vElevation - 0.5) * 0.5 + 0.5);
    // elevationMix += vFresnel;

    vec3 color = vColor;

    // Shade
    vec3 shadeColor = color * vec3(0.0, 0.4, 1.0);
    color = mix(color, shadeColor, vLightness);

    // Sun fresnel
    color = mix(color, vec3(1.0, 1.0, 1.0), clamp(vFresnel, 0.0, 1.0));

    // Fog
    float uFogIntensity = 0.0025;
    vec2 screenUv = gl_FragCoord.xy / uViewportSize;
    vec3 fogColor = texture2D(uFogTexture, screenUv).rgb;
    
    float fogIntensity = 1.0 - exp(- uFogIntensity * uFogIntensity * vFogDepth * vFogDepth );
    color = mix(color, fogColor, fogIntensity);

    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(vColor, 1.0);
}