attribute vec3 a_Position;
attribute vec2 a_uv;
attribute vec3 a_normal;

uniform mat4 u_Pmatrix;
uniform mat4 u_Mmatrix;
uniform mat4 u_Vmatrix;
uniform mat4 u_Nmatrix;

uniform mat4 u_Lmatrix;
uniform mat4 u_PLmatrix;

varying vec2 v_uv;
varying vec3 v_color;
varying vec3 v_normal;
varying vec3 v_vertPos;
varying vec3 v_LightPos;

void main() {

    v_uv = a_uv;

    vec4 lightPos = u_Lmatrix * u_Mmatrix * vec4(a_Position,1.0);
    lightPos = u_PLmatrix * lightPos;
    vec3 lightPosDNC = lightPos.xyz/lightPos.w;

    v_LightPos = vec3(0.5,0.5,0.5) + lightPosDNC * 0.5;

    vec3 N = normalize(a_normal);
    v_normal  = (u_Nmatrix * vec4(a_normal,1.0)).xyz;

    vec3 v_vertPos = (u_Vmatrix * u_Mmatrix*vec4(a_Position,1.0)).xyz;

    gl_Position = u_Pmatrix*u_Vmatrix*u_Mmatrix*vec4(a_Position,1.0);

}