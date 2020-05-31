precision highp float;

uniform sampler2D samplerTex;
uniform sampler2D samplerShadowMap;
uniform sampler2D samplerNormalMap;
uniform sampler2D samplerSpecularMap;

uniform float u_shininess;
uniform float u_diffuse;
uniform float u_normalPower;

varying vec2 v_uv;
varying vec3 v_LightDir;
varying vec3 v_ViewDir;
varying mat3 v_tbnMatrix;


const vec3 source_diffuse_color  = vec3(1.0,1.0,1.0);
const vec3 source_ambient_color  = vec3(0.1,0.1,0.1);
const vec3 source_specular_color = vec3(0.5,0.5,0.5);

const vec3 mat_diffuse_color = vec3(0.5,0.5,0.5);

void main() {

    vec2 uv = v_uv * 2.0;
    vec3 colorTex = vec3(texture2D(samplerTex, uv));
    vec3 colorSpecular = vec3(texture2D(samplerSpecularMap,uv));
    vec3 colorNormal = normalize(2.0 * vec3(texture2D(samplerNormalMap,uv)) - 1.0);
    
    colorNormal = normalize(vec3(colorNormal.xy * u_normalPower,colorNormal.z * 1.0));
    colorNormal = normalize(v_tbnMatrix * colorNormal);
    
    vec3 L = normalize(v_LightDir);
    vec3 V = normalize(v_ViewDir);
    vec3 R = normalize(reflect(-L,colorNormal));

    float D = max(0.0,dot(colorNormal,L));
    float S = dot(V,R);
    S = clamp(S,0.0,1.0);
    S = clamp(pow(S,u_shininess),0.0,1.0);

    float spec_setting = (u_shininess+ 5.0) /50.0;
    vec3 I_specular = source_specular_color * S * colorSpecular.x * spec_setting;

    vec3 color =  I_specular +  source_diffuse_color * D * mat_diffuse_color;
    color = color + source_ambient_color;

     if(u_diffuse <= 0.0){
         gl_FragColor =  vec4(color,1.0);
     }else{
         gl_FragColor =  vec4(color * colorTex ,1.0);
     }

}
