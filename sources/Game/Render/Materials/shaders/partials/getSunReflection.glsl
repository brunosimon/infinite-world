float getSunReflection(vec3 viewDirection, vec3 worldNormal, vec3 viewNormal)
{
    vec3 sunViewReflection = reflect(uSunPosition, viewNormal);
    float sunViewStrength = max(0.2, dot(sunViewReflection, viewDirection));

    float fresnel = uFresnelOffset + uFresnelScale * (1.0 + dot(viewDirection, worldNormal));
    float sunReflection = fresnel * sunViewStrength;
    sunReflection = pow(sunReflection, uFresnelPower);

    return sunReflection;
}