#version 300 es

layout(std140, column_major) uniform;

layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec2 a_uv;

uniform Matrices {
    mat4 u_Pmatrix;
    mat4 u_Mmatrix;
    mat4 u_Vmatrix;
    mat4 u_Nmatrix;
} u_Matrix;

out vec3 v_normal;
out vec2 v_uv;

void main() {

    v_uv = a_uv;
    v_normal = normalize(vec3(u_Matrix.u_Nmatrix * vec4(a_normal, 0.0))); // Normal in model space
    gl_Position = u_Matrix.u_Pmatrix * u_Matrix.u_Vmatrix * u_Matrix.u_Mmatrix * vec4(a_Position, 1.0);

}
