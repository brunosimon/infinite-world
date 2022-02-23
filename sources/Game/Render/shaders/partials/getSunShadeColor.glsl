vec3 getSunShadeColor(vec3 baseColor, float sunShade)
{
    vec3 shadeColor = baseColor * vec3(0.0, 0.4, 1.0);
    return mix(baseColor, shadeColor, sunShade);
}