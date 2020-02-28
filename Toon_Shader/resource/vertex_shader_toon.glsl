attribute vec3 a_Position;
attribute vec3 a_normal;

uniform mat4 u_Pmatrix;
uniform mat4 u_Mmatrix;
uniform mat4 u_Vmatrix;
uniform mat4 u_Nmatrix;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_vertPos;

void main() {

    vec3 N = normalize(a_normal);
    v_normal  = (u_Nmatrix * vec4(N,1.0)).xyz;
    v_vertPos = (u_Vmatrix * u_Mmatrix*vec4(a_Position,1.0)).xyz;

    gl_Position = u_Pmatrix*u_Vmatrix*u_Mmatrix*vec4(a_Position,1.0);

}