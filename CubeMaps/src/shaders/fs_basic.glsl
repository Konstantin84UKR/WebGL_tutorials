         #version 300 es
         precision mediump float;
         //uniform vec4 u_Color;
         uniform sampler2D u_texture;
         
        // in vec3 v_Color;
         in vec2 v_uv;
         out vec4 fragColor;        
         
         void main() {         
              //fragColor  = v_Color;
              //fragColor  = vec4(v_Color,1.0);
              //vec4 color = texture(u_texture,v_uv);
              fragColor  = texture(u_texture,v_uv);
         }