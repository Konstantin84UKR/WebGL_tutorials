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

//--- Promise ---//
async function LoadShaderTextUsingPromise(URL) {

    let promise = new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', URL, true);
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => resolve(console.log(xhr.statusText));
        xhr.send();
    });

    return promise;
}

async function createPromiseShaderProgram(gl,URL_vs,URL_fs) {

    let vertex_shader_promise = await LoadShaderTextUsingPromise(URL_vs);
    let fragment_shader_promise = await LoadShaderTextUsingPromise(URL_fs);

    let shaderProgram = await Promise.all([vertex_shader_promise,
        fragment_shader_promise
        ]).then(data => {

        let vShaderTxt = data[0];
        let fShaderTxt = data[1];
        let vShader = getShader(gl,'vs',vShaderTxt);                                if(!vShader)    return null;
        let fShader = getShader(gl,'fs',fShaderTxt);                                if(!fShader)    return null;

        if(!fShader) {gl.deleteShader(vShader);  return null;}
        let shaderProgram = getProgram(gl,vShader,fShader);
        return shaderProgram;

    }).catch(e => console.log(e));

    return shaderProgram;
}