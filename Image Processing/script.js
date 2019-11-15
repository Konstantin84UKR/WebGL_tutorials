
function main() {

    // Initialize the context
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });

    canvas.width = 700;
    canvas.height = 700;

    // Load shader text using Promise
    let VSHADER_Promise_SOURCE;

    let FSHADER_Promise_SOURCE;
    let FSHADER_Promise_SOURCE_1;
    let FSHADER_Promise_SOURCE_2;
    let FSHADER_Promise_SOURCE_3;

    function LoadShaderTextUsingPromise(URL) {

        let promise = new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', URL, true);
            xhr.onload = () => resolve(xhr.responseText);
            xhr.onerror = () => resolve(console.log(xhr.statusText));
            xhr.send();
        });

        return promise;
    }

    let vs_promise = LoadShaderTextUsingPromise('resource/vs.glsl');
    let fs_promise = LoadShaderTextUsingPromise('resource/fs.glsl');
    let fs1_promise = LoadShaderTextUsingPromise('resource/fs_1.glsl');
    let fs2_promise = LoadShaderTextUsingPromise('resource/fs_2.glsl');
    let fs3_promise = LoadShaderTextUsingPromise('resource/fs_3.glsl');
    let Start = false;
    Promise.all([vs_promise, fs_promise, fs1_promise, fs2_promise, fs3_promise]).then(data => {
        VSHADER_Promise_SOURCE = data[0];
        FSHADER_Promise_SOURCE = data[1];
        FSHADER_Promise_SOURCE_1 = data[2];
        FSHADER_Promise_SOURCE_2 = data[3];
        FSHADER_Promise_SOURCE_3 = data[4];
        animate(0);
    });
    //------------------------------------------------------------------------------------------------------------------//
    let tex = get_texture(gl, 'resource/yachik.jpg');

    //------------------------------------------------------------------------------------------------------------------//

    let animate = function () {

        let VSHADER_SOURCE = VSHADER_Promise_SOURCE;
        let FSHADER_SOURCE = FSHADER_Promise_SOURCE_2;


        const radio = document.getElementsByName("shader");

        for (let i = 0; i < radio.length; i++) {
            if (radio[i].checked) {
                if (radio[i].value == 'original') {
                    VSHADER_SOURCE = VSHADER_Promise_SOURCE;
                    FSHADER_SOURCE = FSHADER_Promise_SOURCE;
                } else if (radio[i].value == 'blur') {
                    VSHADER_SOURCE = VSHADER_Promise_SOURCE;
                    FSHADER_SOURCE = FSHADER_Promise_SOURCE_1;
                } else if (radio[i].value == 'blur_2') {
                    VSHADER_SOURCE = VSHADER_Promise_SOURCE;
                    FSHADER_SOURCE = FSHADER_Promise_SOURCE_2;
                } else if (radio[i].value == 'blur_3') {
                    VSHADER_SOURCE = VSHADER_Promise_SOURCE;
                    FSHADER_SOURCE = FSHADER_Promise_SOURCE_3;
                } else if (radio[i].value == 'blur_4') {
                    VSHADER_SOURCE = VSHADER_Promise_SOURCE;
                    FSHADER_SOURCE = FSHADER_Promise_SOURCE_2;
                }
            };
        }

        const VS = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(VS, VSHADER_SOURCE);
        gl.compileShader(VS);

        const FS = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(FS, FSHADER_SOURCE);
        gl.compileShader(FS);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, VS);
        gl.attachShader(shaderProgram, FS);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            let info = gl.getProgramInfoLog(shaderProgram);
            throw new Error('Could not compile WebGL program. \n\n' + info);
        }

        const vertex_arr =
            [
                -0.9, -0.9,
                -0.9, 0.9,
                0.9, 0.9,
                0.9, -0.9,
            ];


        const BUFFER_VERTEX = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, BUFFER_VERTEX);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_arr), gl.STATIC_DRAW);

        const uv_arr =
            [
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0
            ];

        const BUFFER_UV = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, BUFFER_UV);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv_arr), gl.STATIC_DRAW);

        const face_arr = [0, 1, 2, 0, 2, 3];
        const BUFFER_INDEX = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, BUFFER_INDEX);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(face_arr), gl.STATIC_DRAW);

        //-- RENDER-- //
        gl.useProgram(shaderProgram);

        let a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
        let a_UV = gl.getAttribLocation(shaderProgram, 'a_UV');
        let u_tex = gl.getUniformLocation(shaderProgram, 'u_tex');
        let u_textureSize = gl.getUniformLocation(shaderProgram, 'u_textureSize');
        //u_textureSize
        //  gl.uniform2f(u_textureSize,tex.webGLtexture.width,tex.webGLtexture.height);
        gl.uniform1i(u_tex, 0);
        if (tex.webGLtexture) {
            let texsize = glMatrix.vec2.create();
            gl.uniform2fv(u_textureSize, glMatrix.vec2.set(texsize, tex.width, tex.height));
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, tex.webGLtexture);
        }
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_UV);

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.5, 0.5, 0.5, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindBuffer(gl.ARRAY_BUFFER, BUFFER_VERTEX);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * (2), 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, BUFFER_UV);
        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 4 * (2), 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, BUFFER_INDEX);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        gl.flush();
        window.requestAnimationFrame(animate);
    }
    animate(0);
}


