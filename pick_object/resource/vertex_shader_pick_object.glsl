attribute vec3 a_Position;
attribute vec2 a_uv;

uniform mat4 u_Pmatrix;
uniform mat4 u_Mmatrix;
uniform mat4 u_Vmatrix;

varying vec2 v_uv;

void main() {

    v_uv = a_uv;
    gl_Position = u_Pmatrix*u_Vmatrix*u_Mmatrix*vec4(a_Position,1.0);

}