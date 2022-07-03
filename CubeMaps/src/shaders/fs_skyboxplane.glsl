#version 300 es
precision highp float;
layout(location = 0) out vec4 fragColor;

uniform Matrices {
    mat4 u_Pmatrix;
    mat4 u_Vmatrix;

} u_Matrix;

in vec2 v_UV;

uniform samplerCube skybox;

void main() {
    vec4 pos = inverse(u_Matrix.u_Pmatrix * u_Matrix.u_Vmatrix) * vec4(v_UV,1.0,1.0);
    //vec4 pos =   vec4(v_UV,1.0,1.0);
    fragColor = texture(skybox, normalize(pos.xyz/pos.w));
    //fragColor = vec4(0.36, 0.11, 0.11, 1);
}