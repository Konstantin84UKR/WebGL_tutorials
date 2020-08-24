
function loadNormalShaders(gl) {

    var normal_shader_vertex_source="\n\
         attribute vec3 a_Position;\n\
         \n\
         uniform mat4 u_Pmatrix;\n\
         uniform mat4 u_Mmatrix;\n\
         uniform mat4 u_Vmatrix;\n\
         \n\
         void main() {\n\
         gl_PointSize = 5.0;\n\
         gl_Position = u_Pmatrix*u_Vmatrix*u_Mmatrix*vec4(a_Position,1.0);\n\
         }";

    var normal_shader_fragment_source="\n\
        precision mediump float;\n\
        \n\
        void main() {\n\
        gl_FragColor = vec4(0.0,0.1,0.5,1.0);\n\
        }";

    var vShader = getShader(gl,'vs',normal_shader_vertex_source);              if(!vShader)    return null;
    var fShader = getShader(gl,'fs',normal_shader_fragment_source);            if(!fShader)    return null;
    if(!fShader) {gl.deleteShader(vShader);  return null;}
    var shaderProgram_Normal = getProgram(gl,vShader,fShader);

    shaderProgram_Normal.u_Pmatrix_normal = gl.getUniformLocation(shaderProgram_Normal,'u_Pmatrix');
    shaderProgram_Normal.u_Mmatrix_normal = gl.getUniformLocation(shaderProgram_Normal,'u_Mmatrix');
    shaderProgram_Normal.u_Vmatrix_normal = gl.getUniformLocation(shaderProgram_Normal,'u_Vmatrix');
    shaderProgram_Normal.a_Position_normal  = gl.getAttribLocation(shaderProgram_Normal,'a_Position');

    return shaderProgram_Normal;


}

function normalHelperArray(gl,ModelVertices,ModelNormal,NORMALMATRIX,MODELMATRIX) {

    gl.newNormal = [];

    for(let i = 0; i<= ModelVertices.length; i = i+3){

        var vectorVer = glMatrix.vec3.create();
        vectorVer[0] = ModelVertices[i];
        vectorVer[1] = ModelVertices[i+1];
        vectorVer[2] = ModelVertices[i+2];

        var vectorNormal = glMatrix.vec3.create();
        vectorNormal[0] = ModelNormal[i];
        vectorNormal[1] = ModelNormal[i+1];
        vectorNormal[2] = ModelNormal[i+2];

        var vectorVer4 = glMatrix.vec4.create();
        vectorVer4[0] = ModelVertices[i];
        vectorVer4[1] = ModelVertices[i+1];
        vectorVer4[2] = ModelVertices[i+2];
        vectorVer4[3] = 1.0;

       // glMatrix.vec4.transformMat4(vectorVer4,vectorVer4,MODELMATRIX);
       // glMatrix.vec3.transformMat4(vectorNormal,vectorNormal,MODELMATRIX);
        glMatrix.vec3.transformMat4(vectorNormal,vectorNormal,NORMALMATRIX);
        glMatrix.vec3.scale(vectorNormal,vectorNormal,0.2);


      //  glMatrix.vec3.set(vectorVer,vectorVer4[0],vectorVer4[1],vectorVer4[2]);
        glMatrix.vec3.add(vectorNormal,vectorNormal,vectorVer);

        let v = [].concat.apply([], vectorVer);
        let vn = [].concat.apply([], vectorNormal);

        gl.newNormal.push(v);
        gl.newNormal.push(vn);

    }
}

function VertexNormalHelper(gl,shaderProgram_Normal,PROJMATRIX,VIEWMATRIX,MODELMATRIX,NORMALMATRIX) {

   //--- Normal ------------------------------------------------------------------------

    let ModelVertices   =  gl.model.meshes[0].vertices;
    let ModelNormal     =  gl.model.meshes[0].normals;

    normalHelperArray(gl,ModelVertices,ModelNormal,NORMALMATRIX,MODELMATRIX);
    let newNormal = [].concat.apply([], gl.newNormal);

    let  TRIANGLE_NORMAL = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,TRIANGLE_NORMAL);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(newNormal),gl.DYNAMIC_DRAW);

    //-----------------------------------------------------------------------

     gl.useProgram(shaderProgram_Normal);
     gl.enableVertexAttribArray(shaderProgram_Normal.a_Position_normal);


     gl.uniformMatrix4fv(shaderProgram_Normal.u_Pmatrix_normal, false, PROJMATRIX);
     gl.uniformMatrix4fv(shaderProgram_Normal.u_Mmatrix_normal, false, MODELMATRIX);
     gl.uniformMatrix4fv(shaderProgram_Normal.u_Vmatrix_normal, false, VIEWMATRIX);

     gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_NORMAL);
     gl.vertexAttribPointer(shaderProgram_Normal.a_Position_normal, 3, gl.FLOAT, false, 4 * (3), 0);
     // gl.drawArrays(gl.POINTS, ModelNormal.length, gl.FLOAT, 0);
     gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_NORMAL);
     gl.drawArrays(gl.LINES, 0, newNormal.length/3);

 }