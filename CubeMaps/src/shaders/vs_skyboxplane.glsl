#version 300 es

layout(location = 0) in vec2 a_Position;

out vec2 v_UV;

uniform Matrices {
    mat4 u_Pmatrix;
    mat4 u_Vmatrix;

} u_Matrix;

void main() {
    v_UV = normalize(a_Position);
    gl_Position = vec4(a_Position,1.0,1.0);
}