float getSunShade(vec3 normal)
{
    float sunShade = dot(normal, - uSunPosition);
    sunShade = sunShade * 0.5 + 0.5;
    // sunShade = smoothstep(uLightnessEdgeMin , uLightnessEdgeMax, sunShade);

    return sunShade;
}