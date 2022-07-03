#version 300 es

layout(location = 0) in vec3 a_Position;

out vec3 v_UV;

uniform Matrices {
    mat4 u_Pmatrix;
    mat4 u_Vmatrix;

} u_Matrix;

void main() {
;
    vec4 pos = u_Matrix.u_Pmatrix * u_Matrix.u_Vmatrix * vec4(a_Position, 1.0);
    v_UV = normalize(a_Position);
    gl_Position = pos.xyww;
}