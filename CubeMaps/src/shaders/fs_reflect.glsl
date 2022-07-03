         #version 300 es
         precision mediump float;
         
         uniform float u_useTextureColor;
         uniform float u_useReflectColor;
         uniform sampler2D u_texture;
         uniform samplerCube u_skybox;
         uniform vec3 u_worldCameraPosition;

         // in vec3 v_Color;
          in vec2 v_uv;
         // in vec3 v_normal;
         in vec3 v_worldPosition;
         in vec3 v_worldNormal;
         
         out vec4 fragColor;        
         
         void main() {         
              //fragColor  = v_Color;
              //fragColor  = vec4(v_Color,1.0);
             
              vec4 color = texture(u_texture,v_uv);

              vec3 worldNormal = normalize(v_worldNormal);
              vec3 eyeToSurfaceDir = normalize(v_worldPosition - u_worldCameraPosition);
              vec3 directionReflect = reflect(eyeToSurfaceDir,worldNormal);
            
              vec4 textureColorReflect = texture(u_skybox, directionReflect);
             // fragColor = vec4(textureColor.xyz, 1.0);

              float air = 1.00;
              float glass = 1.53; 
              float ratio = air / glass;
              vec3 directionRefract= refract(eyeToSurfaceDir, normalize(worldNormal), ratio);
              vec4 textureColorRefract = texture(u_skybox,directionRefract);

              vec4 textureColor = mix(textureColorRefract,textureColorReflect,u_useReflectColor);
              textureColor = mix(textureColor,color,u_useTextureColor);
              
              fragColor = vec4(textureColor.xyz, 1.0);
             
         }