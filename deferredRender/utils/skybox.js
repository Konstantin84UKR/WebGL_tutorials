
function loadCubeMap(gl) {
    

    let folder = 'resource/test';
    let formalImage = 'png';


    let cubeTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP,cubeTexture);
   
    let imagePX = new Image();
    imagePX.src = `${folder}/px.${formalImage}`; 
    imagePX.addEventListener('load',function() {
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imagePX);
    });
   
    let imageNX = new Image();
    imageNX.src = `${folder}/nx.${formalImage}`; 
    imageNX.addEventListener('load',function() {
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imageNX);
    });   

    let imagePY = new Image();
    imagePY.src = `${folder}/py.${formalImage}`; 
    imagePY.addEventListener('load',function() {
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imagePY);
    });
   
    let imageNY = new Image();
    imageNY.src = `${folder}/ny.${formalImage}`; 
    imageNY.addEventListener('load',function() {
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imageNY);
    });
   
    let imagePZ = new Image();
    imagePZ.src = `${folder}/pz.${formalImage}`; 
    imagePZ.addEventListener('load',function() {
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imagePZ);
    });
   
    let imageNZ = new Image();
    imageNZ.src = `${folder}/nz.${formalImage}`; 
    imageNZ.addEventListener('load',function() {
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imageNZ);
    });
   
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
    
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

    //gl.skybox = cubeTexture;
    gl.bindTexture(gl.TEXTURE_CUBE_MAP,null);
    return cubeTexture;
}

function loadSkyBoxBuffer(gl) {
    
    const skyboxVertices = [
        -1.0,  1.0, -1.0,
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
        -1.0,  1.0, -1.0,
     
        -1.0, -1.0,  1.0,
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        -1.0, -1.0,  1.0,
     
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,
     
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
     
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
     
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0

        // -0.5, -0.5,  -0.5,
        // -0.5,  0.5,  -0.5,
        //  0.5, -0.5,  -0.5,
        // -0.5,  0.5,  -0.5,
        //  0.5,  0.5,  -0.5,
        //  0.5, -0.5,  -0.5,
    
        // -0.5, -0.5,   0.5,
        //  0.5, -0.5,   0.5,
        // -0.5,  0.5,   0.5,
        // -0.5,  0.5,   0.5,
        //  0.5, -0.5,   0.5,
        //  0.5,  0.5,   0.5,
    
        // -0.5,   0.5, -0.5,
        // -0.5,   0.5,  0.5,
        //  0.5,   0.5, -0.5,
        // -0.5,   0.5,  0.5,
        //  0.5,   0.5,  0.5,
        //  0.5,   0.5, -0.5,
    
        // -0.5,  -0.5, -0.5,
        //  0.5,  -0.5, -0.5,
        // -0.5,  -0.5,  0.5,
        // -0.5,  -0.5,  0.5,
        //  0.5,  -0.5, -0.5,
        //  0.5,  -0.5,  0.5,
    
        // -0.5,  -0.5, -0.5,
        // -0.5,  -0.5,  0.5,
        // -0.5,   0.5, -0.5,
        // -0.5,  -0.5,  0.5,
        // -0.5,   0.5,  0.5,
        // -0.5,   0.5, -0.5,
    
        //  0.5,  -0.5, -0.5,
        //  0.5,   0.5, -0.5,
        //  0.5,  -0.5,  0.5,
        //  0.5,  -0.5,  0.5,
        //  0.5,   0.5, -0.5,
        //  0.5,   0.5,  0.5,
    ];

    let CUBE_VERTEX = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, CUBE_VERTEX);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(skyboxVertices),gl.STATIC_DRAW);
   
    return CUBE_VERTEX
}

function loadSkyBoxBufferPlane(gl) {
    
    const skyboxVertices = [
        -1, -1,
        1, -1,
       -1,  1,
       -1,  1,
        1, -1,
        1,  1,      
    ];

    let CUBE_VERTEX = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, CUBE_VERTEX);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(skyboxVertices),gl.STATIC_DRAW);
   
    return CUBE_VERTEX
}

export {loadCubeMap,loadSkyBoxBuffer,loadSkyBoxBufferPlane}