import {getShader,getProgram} from "../ShaderUtil.js"
import * as glMatrix from "../../glm/index.js";

function loadAxisShaders(gl) {

    const shaderAxis = {
        vertex: `#version 300 es
        in vec3 aPosition;
        in vec3 aColor;
        
        uniform mat4 u_Mmatrix;
        uniform mat4 u_Vmatrix;
        uniform mat4 u_Pmatrix;
        
        out vec3 vColor;
        
        void main() {
            vColor = aColor;
            gl_Position = u_Pmatrix*u_Vmatrix*u_Mmatrix*vec4(aPosition,1.0);
        }`,
        fragment:`#version 300 es
        precision mediump float;
       
        in vec3 vColor;
        
        out vec4 fragColor;

        void main() {
            fragColor = vec4(vColor, 1.0);
        }`
    }    


    let vShader = getShader(gl,'vs',shaderAxis.vertex);              if(!vShader)    return null;
    let fShader = getShader(gl,'fs',shaderAxis.fragment);            if(!fShader)    return null;
    if(!fShader) {gl.deleteShader(vShader);  return null;}
    let shaderProgram_Axis = getProgram(gl,vShader,fShader);
     gl.useProgram(shaderProgram_Axis);
     shaderProgram_Axis.vaoAxis = gl.createVertexArray();
     gl.bindVertexArray(shaderProgram_Axis.vaoAxis);

     shaderProgram_Axis.u_Pmatrix_axis = gl.getUniformLocation(shaderProgram_Axis,'u_Pmatrix');
     shaderProgram_Axis.u_Mmatrix_axis = gl.getUniformLocation(shaderProgram_Axis,'u_Mmatrix');
     shaderProgram_Axis.u_Vmatrix_axis = gl.getUniformLocation(shaderProgram_Axis,'u_Vmatrix');

     shaderProgram_Axis.a_Position_axis = gl.getAttribLocation(shaderProgram_Axis,'aPosition');
     gl.enableVertexAttribArray(shaderProgram_Axis.a_Position_axis);
     shaderProgram_Axis.aColor_axis = gl.getAttribLocation(shaderProgram_Axis,'aColor');
     gl.enableVertexAttribArray( shaderProgram_Axis.aColor_axis);
     gl.useProgram(null);
     gl.bindVertexArray(null);
    return shaderProgram_Axis;

}

function loadAxisHelper(gl,shaderProgram_Axis,MATRIX) {

    const axis_vertex = [

        -1.0, 0.0,0.0,   1.0,0.0,0.0,  //x
        1.0, 0.0,0.0,   1.0,0.0,0.0,

        0.0,-1.0,0.0,   0.0,1.0,0.0,  //y
        0.0, 1.0,0.0,   0.0,1.0,0.0,

        0.0,0.0,-1.0,   0.0,0.0,1.0,  //z
        0.0,0.0, 1.0,   0.0,0.0,1.0
    ];

    gl.useProgram(shaderProgram_Axis);
   
    gl.bindVertexArray(shaderProgram_Axis.vaoAxis);
    
    let AXIS = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,AXIS);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(axis_vertex),gl.STATIC_DRAW);
    //-----------------------------------------------------------------------
    let  MODELMATRIX_AXIS   = glMatrix.mat4.create();
    glMatrix.mat4.identity(MODELMATRIX_AXIS);

    

    gl.uniformMatrix4fv(
      shaderProgram_Axis.u_Pmatrix_axis,
      false,
      MATRIX.PROJMATRIX
    );
    gl.uniformMatrix4fv(
      shaderProgram_Axis.u_Vmatrix_axis,
      false,
      MATRIX.VIEWMATRIX
    );
    gl.uniformMatrix4fv(shaderProgram_Axis.u_Mmatrix_axis,false,MODELMATRIX_AXIS);

    gl.bindBuffer(gl.ARRAY_BUFFER,AXIS);
    gl.vertexAttribPointer(shaderProgram_Axis.a_Position_axis,3,gl.FLOAT,false,4*6,0);
    gl.vertexAttribPointer(shaderProgram_Axis.aColor_axis,3,gl.FLOAT,false,4*6,4*3);

    gl.drawArrays(gl.LINES,0,6);
    gl.useProgram(null);
    gl.bindVertexArray(null);

}

export {loadAxisShaders,loadAxisHelper}