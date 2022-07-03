// Реализация основного парсера
// без загрузки индексов вершин 
// без расчета касателиных и бикасательных к нормалям вершин


function loadOBJ(gl, obj) {
  
  let objText = obj.trim() + "\n";


  let startSTR = 0;
  let finishSTR = objText.indexOf("\n", 0);

  let V = [1];
  let T = [1];
  let N = [1];
  let F = [1]; // TODO
  let vertex = [];
  let uv = [];
  let normals = [];
  let faces = [];
  let face = [];

  let faceindex = 0; // TODO

  let objLineArray = objText.split("\n");

  for (let indexLine = 0; indexLine < objLineArray.length; indexLine++) {
   
    let line = objLineArray[indexLine];
    line = line.trim().replace(/\s+/g, ' '); 
   
    let lineData = line.split(" ");
    const typeVertexData = lineData[0];
  
    if (typeVertexData === "v") {
      lineData.shift();
      lineData = lineData.map(parseFloat);
      V.push(lineData);
    } else if (typeVertexData === "vt") {
      lineData.shift();
      //lineData.slice(0, 2);
      lineData = lineData.map(parseFloat);
      lineData[2]=0.0;
     // T.push(lineData.slice(0, 2));
      T.push(lineData);
    } else if (typeVertexData === "vn") {
      lineData.shift();
      lineData = lineData.map(parseFloat);
      N.push(lineData);
    } else if (typeVertexData === "f") {
      lineData.shift();
     
      // lineData.length-2  это количество треугольников образованых в этой строке
      //  index = 0 это какой по счету треугольник создаеться сейчас             
      for (let index = 0; index < lineData.length-2; index++) {  
        for (let indexTriangel = 0; indexTriangel < 3; indexTriangel++) {
           let vertexDataArray = lineData[indexTriangel+index];
         if(indexTriangel == 2 ) {
           indexTriangel = lineData.length -1;
           vertexDataArray = lineData[indexTriangel];
        }
        
        vertexData = vertexDataArray.split("/");

         // Math.abs('-1')
         // отрицатеотный индекс указывает на то расчет идет с конца массива.
         // На пример 1 это первый индекс ,а -1 это последний
        for (let i = 0; i < 3; i++) {
          if(vertexData[0]< 0){
             vertexData[0] = V.length + 1 + parseInt(vertexData[0]);
          }
          if(vertexData[1]< 0){
            vertexData[1] = T.length + 1 + parseInt(vertexData[1]);
          }   
          if(vertexData[2]< 0){
            vertexData[2] = N.length + 1 + parseInt(vertexData[2]);
          }        
        } 

        for (let index = 0; index < vertexData.length; index++) {
            
          switch (index) {
            case 0:
               vertex.push(V[vertexData[0]]);
              break;

            case 1:
              uv.push(T[vertexData[1]]);
              break;
                
            case 2:
               normals.push(N[vertexData[2]]);
              break;    
          
            default:
              break;
          }  
                              
        }  

        faces.push(faceindex);
        faceindex++;
        
            // if (vertexData.length === 1) {

            //   vertex.push(V[vertexData[0]]);

            // } else if (vertexData.length === 2) {

            //   vertex.push(V[vertexData[0]]);
            //   uv.push(parseFloat(T[vertexData[1]]));

            // } else if (vertexData.length === 3) {

            //   vertex.push(V[vertexData[0]]);
            //   uv.push(T[vertexData[1]]);
            //   normals.push(N[vertexData[2]]);

            // }            
          }        
      }     
    }   
  }

  return {
    vertex,
    uv,
    normals,
    faces,
  };
}
