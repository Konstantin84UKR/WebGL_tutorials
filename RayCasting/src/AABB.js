const  AABB_shaderSource = {
    vertex: `attribute vec3 a_Position;
      
    uniform mat4 u_Pmatrix;
    uniform mat4 u_Mmatrix;
    uniform mat4 u_Vmatrix;
  
    void main() {
  
        gl_PointSize = 10.0;
        gl_Position = u_Pmatrix*u_Vmatrix*u_Mmatrix*vec4(a_Position,1.0);
    
    }`,

    fragment:`precision mediump float;
      
    void main() {

         gl_FragColor =  vec4(0.9,0.8,0.0,1.0);
    }`
}

function AABB_createShader(gl,source,type){
    let shader;
    if(type == 'vs'){
        shader = gl.createShader(gl.VERTEX_SHADER);
    }else if(type=='fs'){
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }else {
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

function AABB_getProgram(gl,vertex,fragment) {
   
    let vShader = AABB_createShader(gl,vertex,'vs')
    let fShader = AABB_createShader(gl,fragment,'fs')
    

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram,vShader);
    gl.attachShader(shaderProgram,fShader);
    gl.linkProgram(shaderProgram);

    if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS) ) {
        var info = gl.getProgramInfoLog(shaderProgram);
      //  throw new Error('Could not compile WebGL program. \n\n' + info);
      }
   
    return shaderProgram;

}

function AABB_init_Shader(gl){
    
    let shaderProgram_AABB = AABB_getProgram(gl,AABB_shaderSource.vertex,AABB_shaderSource.fragment); 

    gl.useProgram(shaderProgram_AABB);
    let u_Pmatrix_AABB = gl.getUniformLocation(shaderProgram_AABB, 'u_Pmatrix');
    let u_Mmatrix_AABB = gl.getUniformLocation(shaderProgram_AABB, 'u_Mmatrix');
    let u_Vmatrix_AABB = gl.getUniformLocation(shaderProgram_AABB, 'u_Vmatrix');

    let a_Position_AABB = gl.getAttribLocation(shaderProgram_AABB, 'a_Position');
    gl.useProgram(null);

    let AABB_shaderStruct = {
        shaderProgram_AABB,
        u_Pmatrix_AABB,
        u_Mmatrix_AABB,
        u_Vmatrix_AABB,
        a_Position_AABB
    }

    return AABB_shaderStruct;
}


function AABB_init_Vertex(ModelVertices){

  // -- AABB ---
  let min_x = Number.MAX_VALUE;
  let max_x = Number.MIN_VALUE *-1;
  let min_y = Number.MAX_VALUE;
  let max_y = Number.MIN_VALUE *-1;
  let min_z = Number.MAX_VALUE;
  let max_z = Number.MIN_VALUE *-1;

  let center_AABB = [];
  //parseFloat()
  for (let index = 0; index < ModelVertices.length; index = index + 3) {
      if (parseFloat(ModelVertices[index]) < min_x) min_x = parseFloat(ModelVertices[index]);
      if (parseFloat(ModelVertices[index]) > max_x) max_x = parseFloat(ModelVertices[index]);

      if (parseFloat(ModelVertices[index + 1]) < min_y) min_y = parseFloat(ModelVertices[index + 1]);
      if (parseFloat(ModelVertices[index + 1]) > max_y) max_y = parseFloat(ModelVertices[index + 1]);

      if (parseFloat(ModelVertices[index + 2]) < min_z) min_z = parseFloat(ModelVertices[index + 2]);
      if (parseFloat(ModelVertices[index + 2]) > max_z) max_z = parseFloat(ModelVertices[index + 2]);
  }

  center_AABB[0] = (max_x - min_x) / 2;
  center_AABB[1] = (max_y - min_y) / 2;
  center_AABB[2] = (max_z - min_z) / 2;


  let AABB_Vertices = [];

  let v1 = [max_x, min_y, max_z];
  let v2 = [max_x, max_y, max_z];
  let v3 = [min_x, max_y, max_z];
  let v4 = [min_x, min_y, max_z];

  let v5 = [max_x, min_y, min_z];
  let v6 = [max_x, max_y, min_z];
  let v7 = [min_x, max_y, min_z];
  let v8 = [min_x, min_y, min_z];

  AABB_Vertices.push(v1);
  AABB_Vertices.push(v2);
  AABB_Vertices.push(v2);
  AABB_Vertices.push(v3);
  AABB_Vertices.push(v3);
  AABB_Vertices.push(v4);
  AABB_Vertices.push(v4);
  AABB_Vertices.push(v1);

  AABB_Vertices.push(v5);
  AABB_Vertices.push(v6);
  AABB_Vertices.push(v6);
  AABB_Vertices.push(v7);
  AABB_Vertices.push(v7);
  AABB_Vertices.push(v8);
  AABB_Vertices.push(v8);
  AABB_Vertices.push(v5);

  AABB_Vertices.push(v1);
  AABB_Vertices.push(v5);
  AABB_Vertices.push(v2);
  AABB_Vertices.push(v6);
  AABB_Vertices.push(v3);
  AABB_Vertices.push(v7);
  AABB_Vertices.push(v4);
  AABB_Vertices.push(v8);

  AABB_Vertices = AABB_Vertices.flat();

  AABB_Vertices_Struct = {
    AABB_Vertices,
    min_x,
    max_x,
    min_y,
    max_y,
    min_z,
    max_z
  }

  return  AABB_Vertices_Struct;

}

function AABB_init_buffer(gl,AABB_Vertices){

    let AABB_VERTEX = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, AABB_VERTEX);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(AABB_Vertices), gl.STATIC_DRAW);
    return AABB_VERTEX;
}

function AABB_render(gl,AABB_shaderStruct,AABB_VERTEX,AABB_Vertices,PROJMATRIX,MODELMATRIX,VIEWMATRIX){
  
    gl.useProgram(AABB_shaderStruct.shaderProgram_AABB);
    gl.uniformMatrix4fv(AABB_shaderStruct.u_Pmatrix_AABB, false, PROJMATRIX);
    gl.uniformMatrix4fv(AABB_shaderStruct.u_Mmatrix_AABB, false, MODELMATRIX);
    gl.uniformMatrix4fv(AABB_shaderStruct.u_Vmatrix_AABB, false, VIEWMATRIX);

    gl.bindBuffer(gl.ARRAY_BUFFER, AABB_VERTEX);
    gl.vertexAttribPointer(AABB_shaderStruct.a_Position_AABB, 3, gl.FLOAT, false, 4 * (3), 0);
    gl.drawArrays(gl.LINES, 0, AABB_Vertices.length);
    gl.useProgram(null);
}

function test(){
    console.log("OK")
}