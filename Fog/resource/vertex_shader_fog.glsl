attribute vec3 a_Position;
attribute vec2 a_uv;

uniform mat4 u_Pmatrix;
uniform mat4 u_Mmatrix;
uniform mat4 u_Vmatrix;
uniform vec3 u_eye;

varying vec2 v_uv;
varying float v_dist;

void main() {

    v_uv = a_uv;
    vec4 pos = u_Mmatrix * vec4(a_Position, 1.0);
    v_dist = distance(pos.xyz, u_eye);
    gl_Position = u_Pmatrix*u_Vmatrix*u_Mmatrix*vec4(a_Position, 1.0);

}