 // Скомуниздил идею парсинга у этого парня
 //https://github.com/sketchpunk/FunWithWebGL2/blob/master/lesson_011/ObjLoader.js

function loadOBJ(gl, obj) {
  //console.log(txt);
  let objText = obj.trim() + "\n";
  //console.log(txt);

  let startSTR = 0;
  let finishSTR = objText.indexOf("\n", 0);

  let V = [1];
  let T = [1];
  let N = [1];
  let F = [1];
  let vertex = [];
  let uv = [];
  let normals = [];
  let face = [];

  let objLineArray = objText.split("\n");

  for (let index = 0; index < objLineArray.length; index++) {
    const line = objLineArray[index];
    console.log(line);

    let lineData = line.split(" ");

    const typeVertexData = lineData[0];

    if (typeVertexData === "v") {
      lineData.shift();
      V.push(lineData);
    } else if (typeVertexData === "vt") {
      lineData.shift();
      T.push(lineData);
    } else if (typeVertexData === "vn") {
      lineData.shift();
      N.push(lineData);
    } else if (typeVertexData === "f") {
      lineData.shift();

      // Может быть как три вертекса на триугольник так и четыре на квад
      // https://github.com/sketchpunk/FunWithWebGL2/blob/master/lesson_011/ObjLoader.js
      
      let isQuad = false;

            for (let index = 0; index < lineData.length; index++) {
              
                  if(index == 3 && !isQuad){
                    index = 2;
                    isQuad = true;
                  }
              const element = lineData[index]; 
                    // v0  v1  v2  v3  
                    // v0  v1  v2 
                    // v2  v3  v0     
                
              vertexData = element.split("/");

              if (vertexData.length === 1) {
                vertex.push(V[vertexData[0]]);
              } else if (vertexData.length === 2) {
                vertex.push(V[vertexData[0]]);
                uv.push(T[vertexData[1]]);
              } else if (vertexData.length === 3) {
                vertex.push(V[vertexData[0]]);
                uv.push(T[vertexData[1]]);
                normals.push(N[vertexData[2]]);
              }
             
              face.push(parseInt(vertexData[0]) - 1);
                 
              if(index == 3 && isQuad){ // v0
                vertexData = lineData[0].split("/");

                if (vertexData.length === 1) {
                  vertex.push(V[vertexData[0]]);
                } else if (vertexData.length === 2) {
                  vertex.push(V[vertexData[0]]);
                  uv.push(T[vertexData[1]]);
                } else if (vertexData.length === 3) {
                  vertex.push(V[vertexData[0]]);
                  uv.push(T[vertexData[1]]);
                  normals.push(N[vertexData[2]]);
                } 

                face.push(parseInt(vertexData[0]) - 1);
              } 
              
            };

     

     
      


      // lineData.map((vertexDataArray) => {
      //   vertexData = vertexDataArray.split("/");

      //   if (vertexData.length === 1) {
      //     vertex.push(V[vertexData[0]]);
      //   } else if (vertexData.length === 2) {
      //     vertex.push(V[vertexData[0]]);
      //     uv.push(T[vertexData[1]]);
      //   } else if (vertexData.length === 3) {
      //     vertex.push(V[vertexData[0]]);
      //     uv.push(T[vertexData[1]]);
      //     normals.push(N[vertexData[2]]);
      //   }

      //   face.push(parseInt(vertexData[0]) - 1);
      // });
    }
  }

  return {
    vertex,
    uv,
    normals,
    face,
  };
}
