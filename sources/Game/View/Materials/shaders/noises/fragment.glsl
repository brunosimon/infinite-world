varying vec2 vUv;

#include ../partials/perlin3dPeriodic.glsl;

void main()
{
    float uFrequency = 8.0;

    float noiseR = perlin3dPeriodic(vec3(vUv * uFrequency, 123.456), vec3(uFrequency)) * 0.5 + 0.5;
    float noiseG = perlin3dPeriodic(vec3(vUv * uFrequency, 456.789), vec3(uFrequency)) * 0.5 + 0.5;
    float noiseB = perlin3dPeriodic(vec3(vUv * uFrequency, 789.123), vec3(uFrequency)) * 0.5 + 0.5;

    gl_FragColor = vec4(noiseR, noiseG, noiseB, 1.0);
}