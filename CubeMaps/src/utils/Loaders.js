
async function loadJSON(model, modelURL) {
    var xhr = new XMLHttpRequest();
    //var model;

    xhr.open('GET', modelURL, false);
    xhr.onload = function () {
        if (xhr.status != 200) {

            alert('LOAD' + xhr.status + ': ' + xhr.statusText);
        } else {

            model.mesh = JSON.parse(xhr.responseText);
            // model = JSON.parse(xhr.responseText);
           // model =  gl.model;
            return true;
        }
    }
    xhr.send();


//     fetch(modelURL)
//   .then((response) => {
//     return response.json();
//   })
//   .then((data) => {
//     return data;
//   });
}

async function  get_texture(gl,image_URL){

    var image = new Image();
    image.src = image_URL;
    image.webGLtexture = false;

    // var texture = gl.createTexture();
    // gl.bindTexture(gl.TEXTURE_2D, texture);
    // // заполняем текстуру голубым пикселем 1x1
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    // new Uint8Array([0, 0, 255, 255]));

    // image.webGLtexture = texture;


    image.addEventListener('load', function (e) {

        let texture = gl.createTexture();
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
        image.nameTexture = image_URL;

    });

    return image;

}


export {loadJSON,get_texture}