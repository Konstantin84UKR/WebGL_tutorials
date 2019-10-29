attribute vec2 a_Position;
attribute vec3 a_Color;
varying vec3 v_Color;
void main() {
    v_Color = a_Color;
    gl_Position = vec4(a_Position,0.0,1.0);
}
