precision highp float;

uniform sampler2D samplerTex;

uniform vec4 u_colorPick;
uniform vec3 u_Pick_ok;
uniform float u_Clicked;

uniform vec2 u_FogDist;
uniform vec3 u_fogColor;

varying vec2 v_uv;
varying float v_dist;

void main() {

    vec3 colorTex = vec3(texture2D(samplerTex, v_uv));
    float fog = clamp((u_FogDist.y -v_dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);
    vec3 color = mix(u_fogColor, colorTex, fog);

    gl_FragColor =  vec4(color, 1.0);

}
