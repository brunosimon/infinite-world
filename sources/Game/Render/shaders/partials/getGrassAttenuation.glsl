float getGrassAttenuation(vec2 position)
{
    float distanceAttenuation = distance(uPlayerPosition.xz, position) / uGrassDistance * 2.0;
    return 1.0 - clamp(0.0, 1.0, smoothstep(0.3, 1.0, distanceAttenuation));
}