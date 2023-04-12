#version 300 es

layout(std140, column_major) uniform;

layout(location = 0 ) in vec4 aPosition;
layout(location = 1 ) in vec4 aUV
layout(location = 2 ) in vec4 aNormal;

uniform SceneUniform {
    mat4 viewProj;
    vec4 eyePosition;
    vec4 ligthPosition;
} uScene;

uniform mat4 uModel;

out vec4 vPosition;
out vec4 vUV;
out vec4 vNormal;

void main(){
    vec4 worldPosition = uModel * aPosition;
    vPosition = worldPosition;
    vUV = aUV;
    vNormal = (uModel * aNormal).xyz;
    gl_Position = uScene.viewProj * worldPosition;
}