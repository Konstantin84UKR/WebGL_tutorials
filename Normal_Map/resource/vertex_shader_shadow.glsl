attribute vec3 a_Position;

uniform mat4 u_Pmatrix;
uniform mat4 u_Mmatrix;
uniform mat4 u_Vmatrix;

varying float v_Depth;

void main() {

    vec4 position = u_Pmatrix*u_Vmatrix*u_Mmatrix*vec4(a_Position,1.0);
    float zBuf = position.z/position.w;
    v_Depth = 0.5+zBuf*0.5;

    gl_Position = position;
}