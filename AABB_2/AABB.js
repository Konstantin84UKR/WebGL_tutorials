
  let OCTREE={
    center:  [0,0,0],
    size: [0,0,0],
    faces: [],
    children: [],
    leaf: false
  };

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


function AABB_init_Vertex(ModelVertices,ModelIndices){

  // // -- AABB ---
  // let min_x = Number.MAX_VALUE;
  // let max_x = Number.MIN_VALUE;
  // let min_y = Number.MAX_VALUE;
  // let max_y = Number.MIN_VALUE;
  // let min_z = Number.MAX_VALUE;
  // let max_z = Number.MIN_VALUE;

  
  // Определяем габариты бокса
  // ищем самую большую и самую маленбкую координату по всем осям
  
  min_max_value_Node = {
    min_x: Number.MAX_VALUE,
    max_x: Number.MIN_VALUE,
    min_y: Number.MAX_VALUE,
    max_y: Number.MIN_VALUE,
    min_z: Number.MAX_VALUE,
    max_z: Number.MIN_VALUE
  }

  let calculate_min_max_value_Node = (ModelVertices,min_max_value_Node,ModelIndices) => {
      
    //ModelIndices = ModelIndices.flat();
    
    for (let index = 0; index < ModelVertices.length; index = index + 3) {

        let indexOfVertex = ModelVertices[index];

        if (parseFloat(ModelVertices[index]) < min_max_value_Node.min_x) min_max_value_Node.min_x = parseFloat(ModelVertices[index]);
        if (parseFloat(ModelVertices[index]) > min_max_value_Node.max_x) min_max_value_Node.max_x = parseFloat(ModelVertices[index]);
  
        if (parseFloat(ModelVertices[index + 1]) < min_max_value_Node.min_y) min_max_value_Node.min_y = parseFloat(ModelVertices[index + 1]);
        if (parseFloat(ModelVertices[index + 1]) > min_max_value_Node.max_y) min_max_value_Node.max_y = parseFloat(ModelVertices[index + 1]);
  
        if (parseFloat(ModelVertices[index + 2]) <  min_max_value_Node.min_z) min_max_value_Node.min_z = parseFloat(ModelVertices[index + 2]);
        if (parseFloat(ModelVertices[index + 2]) >  min_max_value_Node.max_z) min_max_value_Node.max_z = parseFloat(ModelVertices[index + 2]);
    } 

    return min_max_value_Node;

  }

  min_max_value_OCTREE = calculate_min_max_value_Node(ModelVertices,min_max_value_Node,ModelIndices);

//   for (let index = 0; index < ModelVertices.length; index = index + 3) {
//       if (parseFloat(ModelVertices[index]) < min_x) min_x = parseFloat(ModelVertices[index]);
//       if (parseFloat(ModelVertices[index]) > max_x) max_x = parseFloat(ModelVertices[index]);

//       if (parseFloat(ModelVertices[index + 1]) < min_y) min_y = parseFloat(ModelVertices[index + 1]);
//       if (parseFloat(ModelVertices[index + 1]) > max_y) max_y = parseFloat(ModelVertices[index + 1]);

//       if (parseFloat(ModelVertices[index + 2]) < min_z) min_z = parseFloat(ModelVertices[index + 2]);
//       if (parseFloat(ModelVertices[index + 2]) > max_z) max_z = parseFloat(ModelVertices[index + 2]);
//   }

//   center_AABB[0] = (max_x - min_x) / 2;
//   center_AABB[1] = (max_y - min_y) / 2;
//   center_AABB[2] = (max_z - min_z) / 2;

  //SET THE ROOT OF THE OCTREE AS THE BOUNDIND BOX
  OCTREE.center[0]= min_max_value_OCTREE.max_x -(min_max_value_OCTREE.max_x - min_max_value_OCTREE.min_x) / 2;
  OCTREE.center[1]= min_max_value_OCTREE.max_y- (min_max_value_OCTREE.max_y - min_max_value_OCTREE.min_y) / 2;
  OCTREE.center[2]= min_max_value_OCTREE.max_z- (min_max_value_OCTREE.max_z - min_max_value_OCTREE.min_z) / 2;
  
  OCTREE.size[0]= min_max_value_OCTREE.max_x - min_max_value_OCTREE.min_x;
  OCTREE.size[1]= min_max_value_OCTREE.max_y - min_max_value_OCTREE.min_y;
  OCTREE.size[2]= min_max_value_OCTREE.max_z - min_max_value_OCTREE.min_z;


  let allFaces = [];
  // готовим структуру данных 
  // фейс - координаты точек
  for (let index = 0; index < ModelIndices.length; index+=3) {
      // ModelIndices[index];
      let iA = ModelIndices[index];
      let iB = ModelIndices[index+1];
      let iC = ModelIndices[index+2];
   
      let points = [
          [ModelVertices[iA*3],ModelVertices[iA*3 +1],ModelVertices[iA*3 +2 ]],
          [ModelVertices[iB*3],ModelVertices[iB*3 +1],ModelVertices[iB*3 +2 ]],
          [ModelVertices[iC*3],ModelVertices[iC*3 +1],ModelVertices[iC*3 +2 ]]
      ]

      allFaces.push({
        indices: [iA, iB, iC],
        points: points
      })

  }

  let test_AABB_triangle = function(center,size,points){
   
    let result = false;  
   
    points.forEach(point=>{
  
        if( 
            (point[0]<=center[0]+size[0]/2 && point[0]>=center[0]-size[0]/2) 
            && (point[1]<=center[1]+size[1]/2 && point[1]>=center[1]-size[1]/2)
            && (point[2]<=center[2]+size[2]/2 && point[2]>=center[2]-size[2]/2)
         ){
            result = true
          } else{
            result = false
          }   
  
    })    


    return result;
  }

  let build_octree_node = function(node, faces){

    faces.forEach(face => {
        if(test_AABB_triangle(node.center,node.size,face.points)){
            node.faces.push(face);
        }else{
           let a = 5; 
        }
    });

    node.leaf=(node.faces.length<32);

    if(!node.leaf){
        // Подразбиваем бокс на восемь маленьких боксов
        let child_size = [node.size[0]/2, node.size[1]/2, node.size[2]/2];

        let x,y,z;
        for(x=-0.5;x<=0.5;++x){
            for(y=-0.5;y<=0.5;++y){
                for(z=-0.5;z<=0.5;++z){
                    //console.log("x = " + x + "  y = " + y + " z = " +z);    
                    node.children.push({
                        center: [node.center[0]+ x * child_size[0],
                                 node.center[1]+ y * child_size[1],
                                 node.center[2]+ z * child_size[2]],
                        size:child_size,
                        faces:[],
                        children:[],
                        leaf:false          
                    });
                }
            } 
        }
    
                //build children
            node.children.forEach(function(child){
                build_octree_node(child, node.faces);
            });
        
    }

   
  }
  
  build_octree_node(OCTREE, allFaces);
  

  //---------------------------------------------------------

  // строки данные буффера для рисования бокса 

  let AABB_Vertices = [];

  let calculate_AABB_for_Node = (node,min_max_value) => {
    let  AABB_Vertices_for_node = [];
   
    let v1 = [min_max_value.max_x, min_max_value.min_y, min_max_value.max_z];
    let v2 = [min_max_value.max_x, min_max_value.max_y, min_max_value.max_z];
    let v3 = [min_max_value.min_x, min_max_value.max_y, min_max_value.max_z];
    let v4 = [min_max_value.min_x, min_max_value.min_y, min_max_value.max_z];
  
    let v5 = [min_max_value.max_x, min_max_value.min_y, min_max_value.min_z];
    let v6 = [min_max_value.max_x, min_max_value.max_y, min_max_value.min_z];
    let v7 = [min_max_value.min_x, min_max_value.max_y, min_max_value.min_z];
    let v8 = [min_max_value.min_x, min_max_value.min_y, min_max_value.min_z];
  
    AABB_Vertices_for_node.push(v1);
    AABB_Vertices_for_node.push(v2);
    AABB_Vertices_for_node.push(v2);
    AABB_Vertices_for_node.push(v3);
    AABB_Vertices_for_node.push(v3);
    AABB_Vertices_for_node.push(v4);
    AABB_Vertices_for_node.push(v4);
    AABB_Vertices_for_node.push(v1);
  
    AABB_Vertices_for_node.push(v5);
    AABB_Vertices_for_node.push(v6);
    AABB_Vertices_for_node.push(v6);
    AABB_Vertices_for_node.push(v7);
    AABB_Vertices_for_node.push(v7);
    AABB_Vertices_for_node.push(v8);
    AABB_Vertices_for_node.push(v8);
    AABB_Vertices_for_node.push(v5);
  
    AABB_Vertices_for_node.push(v1);
    AABB_Vertices_for_node.push(v5);
    AABB_Vertices_for_node.push(v2);
    AABB_Vertices_for_node.push(v6);
    AABB_Vertices_for_node.push(v3);
    AABB_Vertices_for_node.push(v7);
    AABB_Vertices_for_node.push(v4);
    AABB_Vertices_for_node.push(v8);
  
    AABB_Vertices_for_node = AABB_Vertices_for_node.flat();
    return AABB_Vertices_for_node;
  }
  
  AABB_Vertices =  calculate_AABB_for_Node(OCTREE,min_max_value_OCTREE);

  OCTREE.children.forEach(node => {
    //node = OCTREE.children[2]
    let min_max_value_Node = {
        min_x: node.center[0] - node.size[0]/2,
        max_x: node.center[0] + node.size[0]/2,
        min_y: node.center[1] - node.size[1]/2,
        max_y: node.center[1] + node.size[1]/2,
        min_z: node.center[2] - node.size[2]/2,
        max_z: node.center[2] + node.size[2]/2
      }

    // let indexFace = [];

    // node.faces.forEach(face => {
    //     indexFace.push( face.indices);     
    // })
    // indexFace = indexFace.flat();

    //min_max_value_NODE = calculate_min_max_value_Node(ModelVertices,min_max_value_Node,indexFace);  

   // min_max_value_NODE = calculate_min_max_value_Node(ModelVertices,min_max_value_Node,indexFace);  

    AABB_Vertices_NODE =  calculate_AABB_for_Node(node,min_max_value_Node);
    AABB_Vertices.push(AABB_Vertices_NODE);
    
  })

//   let v1 = [min_max_value_OCTREE.max_x, min_max_value_OCTREE.min_y, min_max_value_OCTREE.max_z];
//   let v2 = [min_max_value_OCTREE.max_x, min_max_value_OCTREE.max_y, min_max_value_OCTREE.max_z];
//   let v3 = [min_max_value_OCTREE.min_x, min_max_value_OCTREE.max_y, min_max_value_OCTREE.max_z];
//   let v4 = [min_max_value_OCTREE.min_x, min_max_value_OCTREE.min_y, min_max_value_OCTREE.max_z];

//   let v5 = [min_max_value_OCTREE.max_x, min_max_value_OCTREE.min_y, min_max_value_OCTREE.min_z];
//   let v6 = [min_max_value_OCTREE.max_x, min_max_value_OCTREE.max_y, min_max_value_OCTREE.min_z];
//   let v7 = [min_max_value_OCTREE.min_x, min_max_value_OCTREE.max_y, min_max_value_OCTREE.min_z];
//   let v8 = [min_max_value_OCTREE.min_x, min_max_value_OCTREE.min_y, min_max_value_OCTREE.min_z];

//   AABB_Vertices.push(v1);
//   AABB_Vertices.push(v2);
//   AABB_Vertices.push(v2);
//   AABB_Vertices.push(v3);
//   AABB_Vertices.push(v3);
//   AABB_Vertices.push(v4);
//   AABB_Vertices.push(v4);
//   AABB_Vertices.push(v1);

//   AABB_Vertices.push(v5);
//   AABB_Vertices.push(v6);
//   AABB_Vertices.push(v6);
//   AABB_Vertices.push(v7);
//   AABB_Vertices.push(v7);
//   AABB_Vertices.push(v8);
//   AABB_Vertices.push(v8);
//   AABB_Vertices.push(v5);

//   AABB_Vertices.push(v1);
//   AABB_Vertices.push(v5);
//   AABB_Vertices.push(v2);
//   AABB_Vertices.push(v6);
//   AABB_Vertices.push(v3);
//   AABB_Vertices.push(v7);
//   AABB_Vertices.push(v4);
//   AABB_Vertices.push(v8);

//   AABB_Vertices = AABB_Vertices.flat();
  AABB_Vertices =  AABB_Vertices.flat();
  
  AABB_Vertices_Struct = {
    AABB_Vertices: AABB_Vertices,
    min_x: min_max_value_OCTREE.min_x,
    max_x: min_max_value_OCTREE.max_x,
    min_y: min_max_value_OCTREE.min_y,
    max_y: min_max_value_OCTREE.max_y,
    min_z: min_max_value_OCTREE.min_z,
    max_z: min_max_value_OCTREE.max_z
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