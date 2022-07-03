         #version 300 es
         uniform mat4 u_mMatrix;
         uniform mat4 u_vMatrix;
         uniform mat4 u_pMatrix;

        // uniform vec3 u_Color;

         layout(location = 0) in vec4 a_Position;
         layout(location = 1) in vec2 a_uv;
         layout(location = 2) in vec3 a_normal;

         out vec3 v_worldPosition;
         out vec3 v_worldNormal;
         out vec2 v_uv;
         out vec3 v_normal;
                
         void main()
          {
        //   v_Color = u_Color; 
           v_uv = a_uv;  
           v_normal =  a_normal;  
           //v_worldNormal =  mat3(u_mMatrix) * a_normal;
           v_worldNormal = mat3(u_mMatrix) * a_normal;
           v_worldPosition = (u_mMatrix * a_Position).xyz;
           
           gl_PointSize = 5.0;
           gl_Position = u_pMatrix * u_vMatrix * u_mMatrix *a_Position;
          }
