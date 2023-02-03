uniform vec3 uSunPosition;
uniform vec3 uColor;

varying vec3 vWorldNormal;

#include ../partials/getSunShade.glsl;
#include ../partials/getSunShadeColor.glsl;

void main()
{
    vec3 color = uColor;

    float sunShade = getSunShade(vWorldNormal);
    color = getSunShadeColor(color, sunShade);
    
    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(vColor, 1.0);
}