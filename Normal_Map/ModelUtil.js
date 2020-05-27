
   function  get_texture(gl,image_URL){

    var image = new Image();
    image.src = image_URL;
    image.webGLtexture = false;

    image.onload = function (e) {

        var texture = gl.createTexture();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);

        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D,null);

        image.webGLtexture = texture;

    };

    return image;

}

   function loadVertex() {

       let  vertex =
           [
               -1,-1,-1,    0.0,0.0,
               1,-1,-1,     1.0,0.0,
               1, 1,-1,     1.0,1.0,
               -1, 1,-1,    0.0,1.0,

               // -1,-1, 1,    -0.5,-0.5,
               // 1,-1, 1,     1.5,-0.5,
               // 1, 1, 1,     1.5,1.5,
               // -1, 1, 1,    -0.5,1.5,
               //
               // -1,-1,-1,    0,0,
               // -1, 1,-1,    1,0,
               // -1, 1, 1,    1,1,
               // -1,-1, 1,    0,1,
               //
               // 1,-1,-1,     0,0,
               // 1, 1,-1,     1,0,
               // 1, 1, 1,     1,1,
               // 1,-1, 1,     0,1,
               //
               // -1,-1,-1,    0,0,
               // -1,-1, 1,    1,0,
               // 1,-1, 1,     1,1,
               // 1,-1,-1,     0,1,
               //
               // -1, 1,-1,    0,0,
               // -1, 1, 1,    1,0,
               // 1, 1, 1,     1,1,
               // 1, 1,-1,     0,1

           ];

        return vertex;

   }

   function loadFace() {

       let  face = [

           0,1,2,
           0,2,3,

           // 4,5,6,
           // 4,6,7,
           //
           // 8,9,10,
           // 8,10,11,
           //
           // 12,13,14,
           // 12,14,15,
           //
           // 16,17,18,
           // 16,18,19,
           //
           // 20,21,22,
           // 20,22,23,

       ];

       return face;

   }

   function loadJSON(gl,modelURL) {
       var xhr = new XMLHttpRequest();
       var model;

       xhr.open('GET', modelURL, false);
       xhr.onload = function () {
           if (xhr.status != 200) {

               alert('LOAD' + xhr.status + ': ' + xhr.statusText);
           } else {

               gl.model = JSON.parse(xhr.responseText);
              // model = JSON.parse(xhr.responseText);
              // return true;
           }
       }
       xhr.send();
   }

   function loadBuffer(gl,meshes) {

       let modelbuffer = {

           TRIANGLE_VERTEX:0,
           TRIANGLE_UV:0,
           TRIANGLE_NORMAL:0,
           TRIANGLE_TANGENT:0,
           TRIANGLE_BITANGENT:0,
           TRIANGLE_FACES:0,
           ModelIndiceslength:0,
       };

       let ModelVertices   =  meshes.vertices;
       let ModelIndices    =  [].concat.apply([], meshes.faces);
       let ModelTexCoords  =  meshes.texturecoords[0];
       let ModelNormal     =  meshes.normals;
       let ModelTangent     =  meshes.tangents;
       let ModelBiTangent     =  meshes.bitangents;
       modelbuffer.ModelIndiceslength = ModelIndices.length;

       modelbuffer.TRIANGLE_VERTEX = gl.createBuffer();
       gl.bindBuffer(gl.ARRAY_BUFFER,modelbuffer.TRIANGLE_VERTEX);
       gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(ModelVertices),gl.STATIC_DRAW);

     // modelbuffer.TRIANGLE_VERTEX = TRIANGLE_VERTEX;

       modelbuffer.TRIANGLE_UV = gl.createBuffer();
       gl.bindBuffer(gl.ARRAY_BUFFER,modelbuffer.TRIANGLE_UV);
       gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(ModelTexCoords),gl.STATIC_DRAW);

       modelbuffer.TRIANGLE_NORMAL = gl.createBuffer();
       gl.bindBuffer(gl.ARRAY_BUFFER,modelbuffer.TRIANGLE_NORMAL);
       gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(ModelNormal),gl.STATIC_DRAW);

       modelbuffer.TRIANGLE_TANGENT = gl.createBuffer();
       gl.bindBuffer(gl.ARRAY_BUFFER,modelbuffer.TRIANGLE_TANGENT);
       gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(ModelTangent),gl.STATIC_DRAW);

       modelbuffer.TRIANGLE_BITANGENT = gl.createBuffer();
       gl.bindBuffer(gl.ARRAY_BUFFER,modelbuffer.TRIANGLE_BITANGENT);
       gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(ModelBiTangent),gl.STATIC_DRAW);

       modelbuffer.TRIANGLE_FACES = gl.createBuffer();
       gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,modelbuffer.TRIANGLE_FACES);
       gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(ModelIndices),gl.STATIC_DRAW);

       gl.modelbufferPlane = modelbuffer;
       return modelbuffer;

   }
