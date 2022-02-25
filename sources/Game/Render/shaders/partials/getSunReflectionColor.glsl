vec3 getSunReflectionColor(vec3 baseColor, float sunReflection)
{
    return mix(baseColor, vec3(1.0, 1.0, 1.0), clamp(sunReflection, 0.0, 1.0));
}