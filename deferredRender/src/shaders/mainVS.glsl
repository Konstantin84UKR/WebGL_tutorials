   #version 300 es

    layout(std140, column_major) uniform;

    layout(location=0) in vec4 aPosition;

    uniform LightUnifoprms{
        mat4 mvp;
        vec4 position;
        vec4 color;
    } uLight;

    void main(){
        gl_Position = uLight.mvp * aPosition;
    }