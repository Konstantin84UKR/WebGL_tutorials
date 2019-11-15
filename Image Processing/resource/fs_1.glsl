precision mediump float;
uniform sampler2D u_tex;
uniform vec2 u_textureSize;

varying vec2 v_UV;

void main() {

    vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;

    vec4 Color = (
        texture2D(u_tex, v_UV) +
        texture2D(u_tex, v_UV + vec2(onePixel.x, 0.0)) +
        texture2D(u_tex, v_UV + vec2(-onePixel.x, 0.0)) +
        texture2D(u_tex, v_UV + vec2(0.0, onePixel.y)) +
        texture2D(u_tex, v_UV + vec2(0.0, -onePixel.y))
        )/5.0;

   // float Color = texture2D(u_tex, v_UV + vec2(onePixel.x, 0.0)).g;

    //gl_FragColor = texture2D(u_tex,v_UV + vec2(-onePixel.x * 10.,0.0));
    gl_FragColor = vec4(Color.rgb,1.0);
}
