    #version 300 es
    precision highp float;

    in vec4 vPosition;
    in vec4 vNormal;
    in vec4 vUV;

    layout(location=0) out vec4 fragPosition;
    layout(location=1) out vec4 fragNormal;
    layout(location=2) out vec4 fragUV;

    void main(){
        fragPosition = vPosition;
        fragNormal = vec4(normalize(vNormal.xyz),0.0);
        fragUV = vUV;
    }