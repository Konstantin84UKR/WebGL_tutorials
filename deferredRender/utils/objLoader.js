// Реализация основного парсера
// без загрузки индексов вершин 
// без расчета касателиных и бикасательных к нормалям вершин


export async function loadOBJ(obj) {
  // На вход получаем просто текст файла OBJ
  // Удаляем пробелы по краям
  let objText = obj.trim() + "\n";

  // let startSTR = 0;
  // let finishSTR = objText.indexOf("\n", 0);

  // Создаем создаем вспомогательные массивы для данных 
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

  // Разбиваем все строки файла на элемены массива обрабатваем данные кадлой строки отдельно в цикле
  let objLineArray = objText.split("\n");

  for (let indexLine = 0; indexLine < objLineArray.length; indexLine++) {
    let line = objLineArray[indexLine];
    line = line.trim().replace(/\s+/g, " ");

    let lineData = line.split(" "); // Разбиваем строку на массив елементов по разделителю
    const typeVertexData = lineData[0];  // Нулевой элемент это пит даннх в строке

    if (typeVertexData === "v") {
      //"vertex"
      lineData.shift(); // Удаляем "v" остаеться только -0.859375 0.382812 -0.382812
      lineData = lineData.map(parseFloat); // Приводим стрку к числу
      V.push(lineData); // помешаем во временный массив Вертексов

    } else if (typeVertexData === "vt") { 
      lineData.shift();
      //lineData.slice(0, 2);
      lineData = lineData.map(parseFloat);
      lineData[2] = 0.0; // в некоторых случаях координаты будет три я всегда ставлю 0 на третью тектурную координату
      // T.push(lineData.slice(0, 2));
      T.push(lineData);
    } else if (typeVertexData === "vn") {
      lineData.shift();
      lineData = lineData.map(parseFloat);
      N.push(lineData);
    } else if (typeVertexData === "f") { //индексы модели
      lineData.shift();

      // Обрабатываем ситуацию когда у нас не треугольник ,а полигон
      // в этом случаи нужно создать индексы для треугольников
      // WebGl не работает с полигонами и квадами  


      // lineData.length-2  это количество треугольников образованых в этой строке
      // Если индекса три то 3-2 = один треугольник 
      // Если индексов пять то 5-2 = 3 трекгольника 
      // index = 0 это какой по счету треугольник создаеться сейчас

      for (let index = 0; index < lineData.length - 2; index++) {
        for (let indexTriangel = 0; indexTriangel < 3; indexTriangel++) {
          let vertexDataArray = lineData[indexTriangel + index];
          if (indexTriangel == 2) {
            indexTriangel = lineData.length - 1;
            vertexDataArray = lineData[indexTriangel];
          }
          
          // текушая конкретная точка модели
          let vertexData = vertexDataArray.split("/");

          // Math.abs('-1')
          // отрицатеотный индекс указывает на то расчет идет с конца массива.
          // На пример 1 это первый индекс ,а -1 это последний
          for (let i = 0; i < 3; i++) {
            if (vertexData[0] < 0) {
              vertexData[0] = V.length + 1 + parseInt(vertexData[0]);
            }
            if (vertexData[1] < 0) {
              vertexData[1] = T.length + 1 + parseInt(vertexData[1]);
            }
            if (vertexData[2] < 0) {
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

  //Возрашаем структуру массивов с подготовлеными данными
  return {
    vertex,
    uv,
    normals,
    faces,
  };
}
