function  createGameDataBuffer(gl,shaderProgram){

    let cubeShaderData ={};

    cubeShaderData.u_Pmatrix = gl.getUniformLocation(shaderProgram,'u_Pmatrix');
    cubeShaderData.u_Mmatrix = gl.getUniformLocation(shaderProgram,'u_Mmatrix');
    cubeShaderData.u_Vmatrix = gl.getUniformLocation(shaderProgram,'u_Vmatrix');
    cubeShaderData.u_Color   = gl.getUniformLocation(shaderProgram,'u_Color');

    cubeShaderData.a_Position  = gl.getAttribLocation(shaderProgram,'a_Position');

    gl.enableVertexAttribArray(cubeShaderData.a_Position);

    let triangle_vertex = [
        -0,-0,-0,     1,1,0,
        2,-0,-0,     1,1,0,
        2, 2,-0,     1,1,0,
        -0, 2,-0,     1,1,0,

        -0,-0, 2,     0,0,1,
        2,-0, 2,     0,0,1,
        2, 2, 2,     0,0,1,
        -0, 2, 2,     0,0,1,

        -0,-0,-0,     0,1,1,
        -0, 2,-0,     0,1,1,
        -0, 2, 2,     0,1,1,
        -0,-0, 2,     0,1,1,

        2,-0,-0,     1,0,0,
        2, 2,-0,     1,0,0,
        2, 2, 2,     1,0,0,
        2,-0, 2,     1,0,0,

        -0,-0,-0,    1,0,1,
        -0,-0, 2,    1,0,1,
        2,-0, 2,     1,0,1,
        2,-0,-0,     1,0,1,

        -0, 2,-0,    0,1,0,
        -0, 2, 2,    0,1,0,
        2, 2, 2,     0,1,0,
        2, 2,-0,     0,1,0

    ];

    cubeShaderData.TRIANGLE_VERTEX = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,cubeShaderData.TRIANGLE_VERTEX);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(triangle_vertex),gl.STATIC_DRAW);

    let triangle_face = [
        0,1,2,
        0,2,3,

        4,5,6,
        4,6,7,

        8,9,10,
        8,10,11,

        12,13,14,
        12,14,15,

        16,17,18,
        16,18,19,

        20,21,22,
        20,22,23
    ];

    cubeShaderData.TRIANGLE_FACES = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,cubeShaderData.TRIANGLE_FACES);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(triangle_face),gl.STATIC_DRAW);

    return cubeShaderData;

}
