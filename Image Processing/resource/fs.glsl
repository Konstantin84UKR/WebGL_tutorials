precision mediump float;
uniform sampler2D u_tex;

varying vec2 v_UV;
void main() {
     gl_FragColor = texture2D(u_tex,v_UV);
}
