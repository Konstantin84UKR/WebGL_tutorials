import { createFetchShaderProgram } from '../utils/ShaderUtil.js'

function main() {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas-webgl');
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext('webgl2');
    
    canvas.width = 500;
    canvas.height = 500;
    

    let shaderProgram = createFetchShaderProgram(gl, 'src/shaders/basicVS.glsl', 'src/shaders/basicFS.glsl');


}

main();

