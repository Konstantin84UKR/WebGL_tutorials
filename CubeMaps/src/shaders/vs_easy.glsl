         #version 300 es
        //  uniform mat4 u_mMatrix;
        //  uniform mat4 u_vMatrix;
        //  uniform mat4 u_pMatrix;

         layout (location=0) in vec2 a_Position;
         //layout (location=1) in float a_PointSize;
        
         void main()
          {
           gl_PointSize = 10.0;
           gl_Position = vec4(a_Position,0.0,1.0);
          }
