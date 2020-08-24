precision highp float;

uniform sampler2D samplerTex;
uniform sampler2D samplerShadowMap;
uniform sampler2D samplerNormalMap;
uniform sampler2D samplerSpecularMap;
uniform sampler2D samplerDepthMap;

uniform float u_shininess;
uniform float u_diffuse;
uniform float u_normalPower;
uniform float u_depth_scale;

varying vec2 v_uv;
varying vec3 v_LightDir;
varying vec3 v_ViewDir;
varying mat3 v_tbnMatrix;
varying vec3 v_Pos;


const vec3 source_diffuse_color  = vec3(1.0,1.0,1.0);
const vec3 source_ambient_color  = vec3(0.2,0.2,0.2);
const vec3 source_specular_color = vec3(0.5,0.5,0.5);
//const float depth_scale = 0.1;

const vec3 mat_diffuse_color = vec3(0.5,0.5,0.5);

vec2 Parallax(vec2 uv, vec3 view_dir)
{
  // Parallax mapping
        float depth = texture2D(samplerDepthMap, uv).r;
        vec2 p = view_dir.xy * (depth * u_depth_scale);
        return uv - p;
}

vec2 Parallax_Step(vec2 uv, vec3 view_dir)
{  
  // float depth = texture2D(samplerDepthMap,uv).r;
   
    float num_layers = 64.0; 
//    float layer_depth = 1.0/num_layers;
//    float cur_layer_depth = 0.0;
  
//    vec2 delta_uv =  view_dir.xy * u_depth_scale / (view_dir.z * num_layers); 
  
//    vec2 cur_uv = uv;
//    float depth_from_tex = texture2D(samplerDepthMap,cur_uv).r; 
//    for(int i = 0; i <= 32 ;i++)
//    {
//       cur_uv -=delta_uv;
//       depth_from_tex = texture2D(samplerDepthMap,cur_uv).r; 
//       cur_layer_depth += layer_depth;

//       if(cur_layer_depth <= depth_from_tex) 
//        break;
//    }
   
//    return cur_uv;


        float layer_depth = 1.0 / num_layers;
        float cur_layer_depth = 0.0;
        vec2 delta_uv = view_dir.xy * u_depth_scale / (view_dir.z * num_layers);
        vec2 cur_uv = uv;
        float depth_from_tex = texture2D(samplerDepthMap, cur_uv).r;
        for (int i = 0; i < 64; i++) {
            cur_layer_depth += layer_depth;
            cur_uv.x -= delta_uv.x;
            cur_uv.y += delta_uv.y;
           // cur_uv += delta_uv;
            depth_from_tex = texture2D(samplerDepthMap, cur_uv).r;
            if (depth_from_tex < cur_layer_depth) {
                break;
            }

        }
       
        // vec2 prev_uv = cur_uv + delta_uv;
        // float next = depth_from_tex - cur_layer_depth;
        // float prev = texture2D(samplerDepthMap, prev_uv).r - cur_layer_depth + layer_depth;
        // float weight = next/(next-prev);
        // return mix(cur_uv,prev_uv,weight);       
         

        // Steep parallax mapping
        return cur_uv;
      


}

vec2 ParallaxMapping(vec2 texCoords, vec3 viewDir)
{
  float heigth = texture2D(samplerDepthMap,texCoords).r;
  return texCoords - viewDir.xy * (heigth * u_depth_scale); 
}


void main() {
    vec2 uv = v_uv * 1.0;
    vec3 light_dir = normalize(v_LightDir - v_Pos);
    vec3 view_dir = normalize(v_ViewDir - v_Pos);
  
    uv = Parallax_Step(uv,view_dir);
    
    vec3 colorTex = vec3(texture2D(samplerTex, uv));
    //uv = v_uv * 10.0 ;
    vec3 colorSpecular = vec3(texture2D(samplerSpecularMap,uv));
    vec3 colorNormal = normalize(2.0 * vec3(texture2D(samplerNormalMap,uv)) - 1.0); //-1 +1
    
    colorNormal = normalize(vec3(colorNormal.xy * u_normalPower,colorNormal.z * 1.0));
    //colorNormal = normalize(v_tbnMatrix * colorNormal);
    
    vec3 L = normalize(light_dir);
    vec3 V = normalize(view_dir);
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
