precision highp float;

uniform vec3  u_source_direction;
uniform float u_outline;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_vertPos;

void main() {

    vec3 lightDir    = normalize(u_source_direction - v_vertPos);
    vec3 L = normalize(lightDir);
    float diffuse = dot(v_normal,L);

    if(diffuse > 0.9){
         diffuse = 1.0;
    }else if(diffuse > 0.1){
         diffuse = 0.7;
    }else {
         diffuse = 0.3;
    }

    vec3 color = vec3(0.9,diffuse,0.0);
    color *= u_outline;
    gl_FragColor = vec4(color,1.0);
}
