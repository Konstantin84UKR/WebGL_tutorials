export class Plane {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  create() {
    let mesh = {
      vertex: [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1],
      uv: [0, 0, 1, 0, 1, 1, 0, 1],
      index: [0, 1, 2, 0, 2, 3],
    };
    this.shader = this.getShader();
    this.mesh = mesh;
  }

  getShader() {
    const shader = {
      vertex: `#version 300 es
         uniform mat4 u_mMatrix;
         uniform mat4 u_vMatrix;
         uniform mat4 u_pMatrix;
       
         layout(location = 0) in vec4 a_Position;
         layout(location = 1) in vec2 a_uv;
     
         out vec2 v_uv;
                
         void main()
          {
           v_uv = a_uv;     
           //gl_PointSize = 5.0;
           gl_Position = u_pMatrix * u_vMatrix * u_mMatrix *a_Position;
          }`,
      fragment: `#version 300 es
         precision mediump float;
       
         uniform sampler2D u_texture;  
         uniform float u_time;  
         uniform float u_wave; 
         uniform float u_amplitude; 
         
         uniform float u_pixelate; 
         uniform vec2 u_resolution;  
         
         uniform float u_grayFactor; 
     
         in vec2 v_uv;
         out vec4 fragColor;        
         
         void main() {       
            
            vec2 uv = v_uv;

            //WAVE
            float wave = u_wave;
            float amplitude = u_amplitude;
            float y = sin(v_uv.x * wave + u_time ) * amplitude ;
            uv = vec2(v_uv.x, v_uv.y+y);                    
           

            //PIXELATE
            float dx = u_pixelate / u_resolution.x;
            float dy = u_pixelate / u_resolution.y;
            uv = vec2(dx*(floor(uv.x/dx)),
                            dy*(floor(uv.y/dy)));
                    
            vec4 color = texture(u_texture,uv);
          
            //GRAYSCALE
            vec3 lum = vec3(0.299, 0.587, 0.114);
            vec3 gray = vec3(dot(lum, color.rgb));   
            vec4 grayColor =  vec4(mix(color.rgb, gray, u_grayFactor),1.0);      
           
            
            fragColor  = grayColor;
       
         }`,
    };

    return shader;
  }
}
