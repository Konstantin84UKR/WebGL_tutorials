attribute vec2 a_Position;
attribute vec2 a_UV;

varying vec2 v_UV;
void main() {
    v_UV = a_UV;
    gl_Position = vec4(a_Position,0.0,1.0);
}
