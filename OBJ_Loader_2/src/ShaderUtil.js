function getShader(gl, id, str){

    var shader;
    if(id == 'vs'){
        shader = gl.createShader(gl.VERTEX_SHADER);

    }else if(id=='fs'){
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }else {
        return null;
    }
    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;

}

function getProgram(gl,vShader,fShader) {

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram,vShader);
    gl.attachShader(shaderProgram,fShader);
    gl.linkProgram(shaderProgram);
    //gl.useProgram(shaderProgram);

    var success = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
    if (!success) {
        // something went wrong with the link
        throw ("program failed to link:" + gl.getProgramInfoLog (shaderProgram));
    }
   

    return shaderProgram;

}

function createDomShaderProgram(gl, vectId,fragId) {

    var vShaderTxt = document.getElementById(vectId).text;                      if(!vShaderTxt) return null;
    var fShaderTxt = document.getElementById(fragId).text;                      if(!fShaderTxt) return null;
    var vShader = getShader(gl,'vs',vShaderTxt);                                if(!vShader)    return null;
    var fShader = getShader(gl,'fs',fShaderTxt);                                if(!fShader)    return null;

    if(!fShader) {gl.deleteShader(vShader);  return null;}

    var shaderProgram = getProgram(gl,vShader,fShader);

    return shaderProgram;
}