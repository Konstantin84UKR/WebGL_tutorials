         #version 300 es
         uniform mat4 u_mMatrix;
         uniform mat4 u_vMatrix;
         uniform mat4 u_pMatrix;

        // uniform vec3 u_Color;

         layout(location = 0) in vec4 a_Position;
         layout(location = 1) in vec2 a_uv;

       //  out vec3 v_Color;
         out vec2 v_uv;
                
         void main()
          {
        //   v_Color = u_Color; 
           v_uv = a_uv;     
           gl_PointSize = 5.0;
           gl_Position = u_pMatrix * u_vMatrix * u_mMatrix *a_Position;
          }
