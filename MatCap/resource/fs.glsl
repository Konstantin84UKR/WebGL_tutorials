#version 300 es
precision highp float;

layout(std140, column_major) uniform;

in vec3 v_normal;

uniform sampler2D samplerTex;
uniform mat4 u_Vmatrix;

layout(location = 0) out vec4 fragFragColor;

void main() {

    // Move normal to view space
    vec2 muv = vec2(u_Vmatrix * vec4(normalize(v_normal), 0)) * 0.5 + vec2(0.5, 0.5);
    // read texture inverting Y value
    // gl_FragColor = texture2D(samplerTex, vec2(muv.x, 1.0 - muv.y));
    fragFragColor = texture(samplerTex, vec2(muv.x, muv.y)); //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
}
