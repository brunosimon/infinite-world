varying vec2 vUv;

void main()
{
    vec3 colorA = vec3(1.0);
    vec3 colorB = vec3(0.1, 0.5, 1.0);
    // vec3 colorB = vec3(1.0, 0.0, 0.0);
    float mixStrength = abs(vUv.y - 0.5) * 2.0;
    mixStrength = 1.0 - pow(1.0 - mixStrength, 5.0);

    vec3 color = mix(colorA, colorB, mixStrength);
    gl_FragColor = vec4(color, 1.0);
}