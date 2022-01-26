uniform sampler2D uGradientTexture;

varying float vElevation;
varying float vFresnel;

void main()
{
    float elevationMix = vElevation;
    elevationMix += mix(0.0, vFresnel, sign(vElevation - 0.5) * 0.5 + 0.5);
    // elevationMix += vFresnel;

    vec3 color = texture2D(uGradientTexture, vec2(0.5, elevationMix)).rgb;

    // if(vElevation < 0.5)
    //     color = vec3(0.0);

    // color += vFresnel;

    gl_FragColor = vec4(color, 1.0);

    // gl_FragColor = vec4(vec3(sign(vElevation - 0.5) * 0.5 + 0.5), 1.0);
}