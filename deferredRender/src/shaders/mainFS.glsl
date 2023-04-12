 #version 300 es
    precision highp float;

    uniform LightUnifoprms{
        mat4 mvp;
        vec4 position;
        vec4 color;
    } uLight;

    uniform vec3 uEyePosition;

    uniform sampler2D uPositionBuffer;
    uniform sampler2D uNormalBuffer;
    uniform sampler2D uUVBuffer;
    uniform sampler2D uTextureMap;

    out vec4 fragColor;

    void main(){

        ivec2 fragCoord = ivec2(gl_FragCoord.xy);
        vec3 position = texelFetch(uPositionBuffer,fragCoord,0).xyz;
        vec3 normal = normalize(texelFetch(uNormalBuffer,fragCoord,0).xyz);
        vec2 uv = texelFetch(uUVBuffer, fragCoord,0).xy;

        vec4 baseColor = texture(uTextureMap,uv);

        vec3 eyeDirection = normalize(uEyePosition-position);
        vec3 lightVec = uLight.position.xyz - position;
        float attenuation = 1.0 - length(lightVec);
        vec3 lightDirection = normalize(lightVec);
        vec3 reflectionDirection = reflect(-lightDirection,normal);
        float nDotL = max(dot(lightDirection,normal),0.0);
        vec3 diffuse =  nDotL * uLight.color.rgb;
        float ambient = 0.1;
        vec3 specular = pow(max(dot(reflectionDirection,eyeDirection),0.0),20.0)*uLight.color.rgb;

        fragColor = vec4(attenuation * (ambient+diffuse+specular)* baseColor.rgb , baseColor.a);
                    
    } 