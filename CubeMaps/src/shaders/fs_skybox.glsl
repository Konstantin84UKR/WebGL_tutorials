#version 300 es
precision highp float;
layout(location = 0) out vec4 fragColor;

in vec3 v_UV;

uniform samplerCube skybox;

void main() {
    vec3 UV = vec3(v_UV.x, v_UV.y, v_UV.z);
    fragColor = texture(skybox, normalize(UV));
   // fragColor = vec4(0.36, 0.11, 0.11, 1);
}