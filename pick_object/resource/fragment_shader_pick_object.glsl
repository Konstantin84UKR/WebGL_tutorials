precision highp float;

uniform sampler2D samplerTex;

uniform vec4 u_colorPick;
uniform vec3 u_Pick_ok;
uniform float u_Clicked;

varying vec2 v_uv;

void main() {

    vec3 colorTex = vec3(texture2D(samplerTex,v_uv));
    if(u_Clicked == 1.0){
        gl_FragColor =  u_colorPick;
    }else{
        gl_FragColor =  vec4(u_Pick_ok + colorTex,1.0);
    }


}
