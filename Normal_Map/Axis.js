
function loadAxisShaders(gl) {

    var axis_shader_vertex_source = "\n\
         attribute vec3 a_Position;\n\
         attribute vec3 aColor;\n\
         \n\
         uniform mat4 u_Pmatrix;\n\
         uniform mat4 u_Mmatrix;\n\
         uniform mat4 u_Vmatrix;\n\
         \n\
         varying vec3 vColor;\n\
         \n\
         void main() {\n\
         vColor = aColor;\n\
         gl_Position = u_Pmatrix*u_Vmatrix*u_Mmatrix*vec4(a_Position,1.0);\n\
         }";

    var axis_shader_fragment_source = "\n\
        precision mediump float;\n\
        \n\
        varying vec3 vColor;\n\
        \n\
        void main() {\n\
        gl_FragColor = vec4(vColor, 1.0);\n\
        }";


    var vShader = getShader(gl,'vs',axis_shader_vertex_source);              if(!vShader)    return null;
    var fShader = getShader(gl,'fs',axis_shader_fragment_source);            if(!fShader)    return null;
    if(!fShader) {gl.deleteShader(vShader);  return null;}
    var shaderProgram_Axis = getProgram(gl,vShader,fShader);

    shaderProgram_Axis.u_Pmatrix_axis = gl.getUniformLocation(shaderProgram_Axis,'u_Pmatrix');
    shaderProgram_Axis.u_Mmatrix_axis = gl.getUniformLocation(shaderProgram_Axis,'u_Mmatrix');
    shaderProgram_Axis.u_Vmatrix_axis = gl.getUniformLocation(shaderProgram_Axis,'u_Vmatrix');

    shaderProgram_Axis.a_Position_axis = gl.getAttribLocation(shaderProgram_Axis,'a_Position');
   // gl.enableVertexAttribArray( shaderProgram_Axis.a_Position_axis);
    shaderProgram_Axis.aColor_axis = gl.getAttribLocation(shaderProgram_Axis,'aColor');
   // gl.enableVertexAttribArray( shaderProgram_Axis.aColor_axis);

    return shaderProgram_Axis;

}

function loadAxisHelper(gl,shaderProgram_Axis,PROJMATRIX,VIEWMATRIX,MODELMATRIX) {

    var axis_vertex = [

        -1.0, 0.0,0.0,   1.0,0.0,0.0,  //x
        1.0, 0.0,0.0,   1.0,0.0,0.0,

        0.0,-1.0,0.0,   0.0,1.0,0.0,  //y
        0.0, 1.0,0.0,   0.0,1.0,0.0,

        0.0,0.0,-1.0,   0.0,0.0,1.0,  //z
        0.0,0.0, 1.0,   0.0,0.0,1.0
    ];

    AXIS = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,AXIS);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(axis_vertex),gl.STATIC_DRAW);
    //-----------------------------------------------------------------------
    let  MODELMATRIX_AXIS   = glMatrix.mat4.create();
    glMatrix.mat4.identity(MODELMATRIX_AXIS);

    gl.useProgram(shaderProgram_Axis);

    gl.enableVertexAttribArray(shaderProgram_Axis.a_Position_axis);
    gl.enableVertexAttribArray(shaderProgram_Axis.aColor_axis);

    gl.uniformMatrix4fv(shaderProgram_Axis.u_Pmatrix_axis,false,PROJMATRIX);
    gl.uniformMatrix4fv(shaderProgram_Axis.u_Vmatrix_axis,false,VIEWMATRIX);
    gl.uniformMatrix4fv(shaderProgram_Axis.u_Mmatrix_axis,false,MODELMATRIX_AXIS);

    gl.bindBuffer(gl.ARRAY_BUFFER,AXIS);
    gl.vertexAttribPointer(shaderProgram_Axis.a_Position_axis,3,gl.FLOAT,false,4*6,0);
    gl.vertexAttribPointer(shaderProgram_Axis.aColor_axis,3,gl.FLOAT,false,4*6,4*3);

    gl.drawArrays(gl.LINES,0,6);

    gl.disableVertexAttribArray(shaderProgram_Axis.a_Position_axis);
    gl.disableVertexAttribArray(shaderProgram_Axis.aColor_axis);

    gl.useProgram(null);

}