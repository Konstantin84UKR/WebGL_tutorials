function load_xhr(gl, URL) {

    let xhr = new XMLHttpRequest();

    xhr.open('GET', URL, false);
    xhr.onload = function () {
        if (this.status != 200) {
            alert('LOAD' + xhr.status + ': ' + xhr.statusText);
        } else {
            gl.shader_src = xhr.responseText;
            //console.log(shader_src);
        }
    }
    xhr.send();

}

function main() {

    // Initialize the context
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });

    canvas.width = 500;
    canvas.height = 500;

    // Create Shaders
    // Method 1
    // Shader text is a regular java-script string
    const VSHADER_STRING_SOURCE =
        'attribute vec2 a_Position;\n' +
        'attribute vec3 a_Color;\n' +
        'varying vec3 v_Color;\n' +
        'void main() {\n' +
        ' v_Color = a_Color;\n' +
        ' gl_Position = vec4(a_Position,0.0,1.0);\n' +
        ' }\n';


    const FSHADER_STRING_SOURCE =
        ' precision mediump float;\n' +
        ' uniform vec4 u_FragColor;\n' +
        ' varying vec3 v_Color;\n' +
        ' void main() {\n' +
        ' gl_FragColor = vec4(0.1,0.1,0.9,1.0);\n' +
        ' }\n';

    // Method 2
    // Shader text wander in a separate script
    const VSHADER_SCRIPT_SOURCE = document.getElementById('vertex_shader').text;
    const FSHADER_SCRIPT_SOURCE = document.getElementById('fragment_shader').text;

    // Method 3
    // Load shader text using XMLHttpRequest
    load_xhr(gl, 'resource/vs.glsl');
    const VSHADER_XMLHttpRequest_SOURCE = gl.shader_src;
    load_xhr(gl, 'resource/fs.glsl');
    const FSHADER_XMLHttpRequest_SOURCE = gl.shader_src;

    // Method 4
    // Load shader text using Promise
    let VSHADER_Promise_SOURCE;
    let FSHADER_Promise_SOURCE;
    function LoadShaderTextUsingPromise(URL) {

        let promise = new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', URL, false);
            xhr.onload = () => resolve(xhr.responseText);
            xhr.onerror = () => resolve(console.log(xhr.statusText));
            xhr.send();
        });

        return promise;
    }

    // LoadShaderTextUsingPromise('resource/vs.glsl')
    //     .then(function (data) {
    //         VSHADER_Promise_SOURCE = data;
    //         console.log(VSHADER_Promise_SOURCE);
    //     });
    // LoadShaderTextUsingPromise('resource/fs_2.glsl')
    //     .then(function (data) {
    //         FSHADER_Promise_SOURCE = data;
    //         console.log(FSHADER_Promise_SOURCE);
    //     });

    let vs_promise = LoadShaderTextUsingPromise('resource/vs.glsl');
    let fs_promise = LoadShaderTextUsingPromise('resource/fs_2.glsl');

    Promise.all([vs_promise, fs_promise]).then(data => {
        VSHADER_Promise_SOURCE = data[0];
        FSHADER_Promise_SOURCE = data[1];
    });


    // Method 5
    // Load shader text using fetch
    let VSHADER_fetch_SOURCE;
    fetch('resource/vs.glsl')
        .then(data => { return data.text(); })
        .then(data => {
            //console.log(data);
            VSHADER_fetch_SOURCE = data;
        });

    let FSHADER_fetch_SOURCE;
    fetch('resource/fs_1.glsl')
        .then(data => { return data.text() })
        .then(data => {
            // console.log(data);
            FSHADER_fetch_SOURCE = data;
        });
    //------------------------------------------------------------------------------------------------------------------//

    let animate = function () {

        let VSHADER_SOURCE;
        let FSHADER_SOURCE;
        const radio = document.getElementsByName("shader");

        for (let i = 0; i < radio.length; i++) {
            if (radio[i].checked) {
                if (radio[i].value == 'string_shader') {
                    VSHADER_SOURCE = VSHADER_STRING_SOURCE;
                    FSHADER_SOURCE = FSHADER_STRING_SOURCE;
                } else if (radio[i].value == 'script_shader') {
                    VSHADER_SOURCE = VSHADER_SCRIPT_SOURCE;
                    FSHADER_SOURCE = FSHADER_SCRIPT_SOURCE;
                } else if (radio[i].value == 'XMLHttpRequest_shader') {
                    VSHADER_SOURCE = VSHADER_XMLHttpRequest_SOURCE;
                    FSHADER_SOURCE = FSHADER_XMLHttpRequest_SOURCE;
                } else if (radio[i].value == 'fetch_shader') {
                    VSHADER_SOURCE = VSHADER_fetch_SOURCE;
                    FSHADER_SOURCE = FSHADER_fetch_SOURCE;
                } else if (radio[i].value == 'Promise_shader') {
                    VSHADER_SOURCE = VSHADER_Promise_SOURCE;
                    FSHADER_SOURCE = FSHADER_Promise_SOURCE;
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
                -0.5, -0.5,
                -0.5, 0.5,
                0.5, 0.5,
                0.5, -0.5,
            ];


        const BUFFER_VERTEX = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, BUFFER_VERTEX);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_arr), gl.STATIC_DRAW);

        const face_arr = [0, 1, 2, 0, 2, 3];
        const BUFFER_INDEX = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, BUFFER_INDEX);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(face_arr), gl.STATIC_DRAW);

        //-- RENDER-- //
        gl.useProgram(shaderProgram);

        var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
        // var a_Color = gl.getAttribLocation(shaderProgram,'a_Color');

        gl.enableVertexAttribArray(a_Position);
        // gl.enableVertexAttribArray(a_Color);

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.5, 0.5, 0.5, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindBuffer(gl.ARRAY_BUFFER, BUFFER_VERTEX);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * (2), 0);
        // gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false, 4*(3+2),4*2);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, BUFFER_INDEX);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        gl.flush();
        window.requestAnimationFrame(animate);
    }
    animate(0);
}


