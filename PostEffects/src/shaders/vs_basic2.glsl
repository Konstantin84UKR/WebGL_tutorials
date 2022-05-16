         #version 300 es
         uniform mat4 u_mMatrix;
         uniform mat4 u_vMatrix;
         uniform mat4 u_pMatrix;

         layout (location=0) in vec4 a_Position;
         layout (location=1) in float a_PointSize;
        
         void main()
          {
           gl_PointSize = a_PointSize;
           gl_Position = u_pMatrix * u_vMatrix * u_mMatrix *a_Position;
          }
