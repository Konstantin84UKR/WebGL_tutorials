precision highp float;

varying float v_Depth;
void main() {
    gl_FragColor =  vec4(v_Depth,0.0,0.0,1.0);
}
