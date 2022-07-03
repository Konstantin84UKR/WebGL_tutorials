function get_texture(gl, image_URL) {
  var image = new Image();
  image.src = image_URL;
  image.webGLtexture = false;

  image.onload = function (e) {
    var texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.NEAREST_MIPMAP_LINEAR
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);

    image.webGLtexture = texture;
  };

  return image;
}

function loadVertex() {
  let vertex = [
    -1, -1, -1, 0.0, 0.0, 1, -1, -1, 1.0, 0.0, 1, 1, -1, 1.0, 1.0, -1, 1, -1,
    0.0, 1.0,

    -1, -1, 1, -0.5, -0.5, 1, -1, 1, 1.5, -0.5, 1, 1, 1, 1.5, 1.5, -1, 1, 1,
    -0.5, 1.5,

    -1, -1, -1, 0, 0, -1, 1, -1, 1, 0, -1, 1, 1, 1, 1, -1, -1, 1, 0, 1,

    1, -1, -1, 0, 0, 1, 1, -1, 1, 0, 1, 1, 1, 1, 1, 1, -1, 1, 0, 1,

    -1, -1, -1, 0, 0, -1, -1, 1, 1, 0, 1, -1, 1, 1, 1, 1, -1, -1, 0, 1,

    -1, 1, -1, 0, 0, -1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, -1, 0, 1,
  ];

  return vertex;
}

function loadFace() {
  let face = [
    0, 1, 2, 0, 2, 3,

    4, 5, 6, 4, 6, 7,

    8, 9, 10, 8, 10, 11,

    12, 13, 14, 12, 14, 15,

    16, 17, 18, 16, 18, 19,

    20, 21, 22, 20, 22, 23,
  ];

  return face;
}

function loadJSON(gl, modelURL) {
  var xhr = new XMLHttpRequest();
  var model;

  xhr.open("GET", modelURL, false);
  xhr.onload = function () {
    if (xhr.status != 200) {
      alert("LOAD" + xhr.status + ": " + xhr.statusText);
    } else {
      gl.model = JSON.parse(xhr.responseText);
      // model = JSON.parse(xhr.responseText);
      // return true;
    }
  };
  xhr.send();
}

function loadFile(gl,modelURL) {
  var xhr = new XMLHttpRequest();
  var model;

  xhr.open('GET', modelURL, false);
  xhr.onload = function () {
      if (xhr.status != 200) {

          alert('LOAD' + xhr.status + ': ' + xhr.statusText);
      } else {

          gl.modelOBJ = xhr.responseText;
         // model = JSON.parse(xhr.responseText);
         // return true;
      }
  }
  xhr.send();
}


// function normalHelper(gl,ModelIndices,ModelNormal) {
//
//    gl.newNormal = [];
//
//    for(let i = 0; i<= ModelIndices.length; i = i+3){
//
//         var vectorVer = glMatrix.vec3.create();
//         vectorVer[0] = ModelIndices[i];
//         vectorVer[1] = ModelIndices[i+1];
//         vectorVer[2] = ModelIndices[i+2];
//
//         var vectorNormal = glMatrix.vec3.create();
//         vectorNormal[0] = ModelNormal[i];
//         vectorNormal[1] = ModelNormal[i+1];
//         vectorNormal[2] = ModelNormal[i+2];
//
//
//         glMatrix.vec3.add(vectorNormal,vectorNormal,vectorVer);
//
//        gl.newNormal.push(vectorNormal);
//
//    }
//
//
//    return  gl.newNormal;
//
// }
