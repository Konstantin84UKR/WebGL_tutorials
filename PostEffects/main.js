// Структура библиотеки это один файл программки демки в которую импортируються общие файлы.
// Фунции хелперы будут одни на все проекты Цель сделать реализацию демок максимально быстрой
// и не отвлекаться каждый раз на написание повторяюшигося кода

// При этом некоторые процедуры будут в виде шаблона и переписываються для каждой демки отдельно.

import { initWebGL2, createCanvasGl } from "./src/utils/utilsWebGL.js";
import { createPromiseShaderProgram ,createShaderProgramFromJSobj} from "./src/utils/ShaderUtil.js";
import { myGUI } from "./src/utils/gui/guiSetting.js";
import * as LOADERS from "./src/utils/Loaders.js";
import { Camera } from "./src/utils/Camera.js";
import { loadAxisHelper, loadAxisShaders } from "./src/utils/helpers/Axis.js";
import {
  loadNormalShaders,
  VertexNormalHelper,
} from "./src/utils/helpers/VertexNormalsHelper.js";
//import * as dat from './src/utils/gui/dat.gui.module.js';

import * as glMatrix from "./src/glm/index.js";
import { Plane } from "./src/utils/Primitives/Plane.js";
//import { GUI } from "./src/utils/gui/dat.gui.module.js";

async function main() {
  /**
   * INIT
   */

  /** @type {HTMLCanvasElement} */
  let canvas = await createCanvasGl(window.innerWidth, window.innerHeight);
  /** @type {WebGLRenderingContext} */
  let gl = await initWebGL2(canvas);
  //=============================================================
  /**
   * GUI
   */
  const gui = myGUI(gl);
  //=============================================================
  /**
   * SHADER
   */
  const shaderProgram = await createPromiseShaderProgram(
    gl,
    "./src/shaders/vs_basic.glsl",
    "./src/shaders/fs_basic.glsl"
  );

  gl.useProgram(shaderProgram);
  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  // Attrib
  let a_Position = gl.getAttribLocation(shaderProgram, "a_Position");
  gl.enableVertexAttribArray(a_Position);
  let a_uv = gl.getAttribLocation(shaderProgram, "a_uv");
  gl.enableVertexAttribArray(a_uv);
  // Uniform
  // let u_Color = gl.getUniformLocation(shaderProgram, "u_Color");
  let u_mMatrix = gl.getUniformLocation(shaderProgram, "u_mMatrix");
  let u_vMatrix = gl.getUniformLocation(shaderProgram, "u_vMatrix");
  let u_pMatrix = gl.getUniformLocation(shaderProgram, "u_pMatrix");
  var u_texture = gl.getUniformLocation(shaderProgram, "u_texture");
  gl.bindVertexArray(null);

  // FULLSCREEN Plane
  let FULLSCREEN_Plane = new Plane();
  FULLSCREEN_Plane.create();
  FULLSCREEN_Plane.shaderProgram = await createShaderProgramFromJSobj(
    gl,
    FULLSCREEN_Plane.shader
  );
  gl.useProgram(FULLSCREEN_Plane.shaderProgram);
  let FULLSCREEN_vao = gl.createVertexArray();
  gl.bindVertexArray(FULLSCREEN_vao);
  let FULLSCREEN_a_Position = gl.getAttribLocation(shaderProgram, "a_Position");
  gl.enableVertexAttribArray(FULLSCREEN_a_Position);
  let FULLSCREEN_a_uv = gl.getAttribLocation(shaderProgram, "a_uv");
  gl.enableVertexAttribArray(FULLSCREEN_a_uv);

  let FULLSCREEN_Plane_u_mMatrix = gl.getUniformLocation(FULLSCREEN_Plane.shaderProgram, "u_mMatrix");
  let FULLSCREEN_Plane_u_vMatrix = gl.getUniformLocation(FULLSCREEN_Plane.shaderProgram, "u_vMatrix");
  let FULLSCREEN_Plane_u_pMatrix = gl.getUniformLocation(FULLSCREEN_Plane.shaderProgram, "u_pMatrix");
  let FULLSCREEN_Plane_u_texture = gl.getUniformLocation(FULLSCREEN_Plane.shaderProgram, "u_texture");
  let FULLSCREEN_Plane_u_time = gl.getUniformLocation(FULLSCREEN_Plane.shaderProgram, "u_time");
  //WAVE
  let FULLSCREEN_Plane_u_wave = gl.getUniformLocation(FULLSCREEN_Plane.shaderProgram, "u_wave");
  let FULLSCREEN_Plane_u_amplitude = gl.getUniformLocation(FULLSCREEN_Plane.shaderProgram, "u_amplitude");
  //PIXELATE
  let FULLSCREEN_Plane_u_pixelate = gl.getUniformLocation(FULLSCREEN_Plane.shaderProgram, "u_pixelate");
  let FULLSCREEN_Plane_u_resolution = gl.getUniformLocation(FULLSCREEN_Plane.shaderProgram, "u_resolution");
  //GRAYSCALE
  let FULLSCREEN_Plane_u_grayFactor = gl.getUniformLocation(FULLSCREEN_Plane.shaderProgram, "u_grayFactor");

  
  gl.bindVertexArray(null);
  //=============================================================
  /**
   * LOADERS
   */

  let model = {
    url: "resource/model.json",
    mesh: undefined,
  };

  gl.activeTexture(gl.TEXTURE0);
  await LOADERS.loadJSON(model, model.url);
  console.log(model.mesh);

  const mainModel = model.mesh.meshes[0];

  let texture = await LOADERS.get_texture(gl, "resource/uv.jpg");
  gl.useProgram(shaderProgram);
  gl.uniform1i(u_texture, 0);
  gl.useProgram(null);

  let textureFULLSCREEN = await LOADERS.get_texture(gl, "resource/Kyiv.jpg");
  gl.useProgram(FULLSCREEN_Plane.shaderProgram);
  gl.uniform1i(FULLSCREEN_Plane_u_texture, 1);
  gl.useProgram(null);

  //=============================================================
  /**
   * BUFFER
   */
  //var triangle_vertex = [0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0];
  gl.useProgram(shaderProgram);
  gl.bindVertexArray(vao);
  let TRIANGLE_VERTEX = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_VERTEX);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(mainModel.vertices),
    gl.STATIC_DRAW
  );

  let TRIANGLE_UV = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_UV);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(mainModel.texturecoords[0]),
    gl.STATIC_DRAW
  );

  let TRIANGLE_FACES = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(mainModel.faces.flat()),
    gl.STATIC_DRAW
  );
  gl.bindVertexArray(null);

  // BUFFER FULLSCREEN Plane
  gl.useProgram(FULLSCREEN_Plane.shaderProgram)
  gl.bindVertexArray(FULLSCREEN_vao);

  let FULLSCREEN_Plane_VERTEX = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, FULLSCREEN_Plane_VERTEX);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(FULLSCREEN_Plane.mesh.vertex),
    gl.STATIC_DRAW
  );

  let FULLSCREEN_Plane_UV = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, FULLSCREEN_Plane_UV);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(FULLSCREEN_Plane.mesh.uv),
    gl.STATIC_DRAW
  );

  let FULLSCREEN_Plane_FACES = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, FULLSCREEN_Plane_FACES);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(FULLSCREEN_Plane.mesh.index),
    gl.STATIC_DRAW
  );
  gl.bindVertexArray(null);

  //=============================================================
  /**
   * MATRIX
   */
  let MODELMATRIX =  glMatrix.mat4.create();
  let VIEWMATRIX =  glMatrix.mat4.create();
  let PROJMATRIX =  glMatrix.mat4.create();

  glMatrix.mat4.identity(PROJMATRIX);
  let fovy = (40 * Math.PI) / 180;
  glMatrix.mat4.perspective(PROJMATRIX, fovy, canvas.width / canvas.height, 1, 50);
  glMatrix.mat4.lookAt(VIEWMATRIX, [-7.0, 5.0, 10.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
  glMatrix.mat4.translate(MODELMATRIX, MODELMATRIX, [0.5, 1.0, 0.0]);

  // gl.uniformMatrix4fv(u_mMatrix ,false, MODELMATRIX);
  // gl.uniformMatrix4fv(u_vMatrix,false, VIEWMATRIX);
  // gl.uniformMatrix4fv(u_pMatrix,false, PROJMATRIX);

  // MATRIX FULLSCREEN Plane
  let FULLSCREEN_MATRIX =  glMatrix.mat4.create();
  

  //=============================================================
  /**
   * CAMERA
   */
  let camera = new Camera(gl, 0);
  gl.camera = camera;
  //=============================================================
  /**
   * HELPERS
   */

  let shaderProgram_axis = loadAxisShaders(gl);
  let shaderProgram_normalHelpers = loadNormalShaders(gl);
  let NORMALMATRIX_HELPER =  glMatrix.mat4.create();

 //=============================================================
  /**
   * FRAMEBUFFER 
   */

   let fbo = gl.createFramebuffer();
   gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
   
   let rbo = gl.createRenderbuffer();
   gl.bindRenderbuffer(gl.RENDERBUFFER,rbo);
   gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,canvas.width,canvas.height);

   let texture_FrameBuffer = gl.createTexture();
   gl.bindTexture(gl.TEXTURE_2D,texture_FrameBuffer);

   gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,canvas.width,canvas.height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.LINEAR);

   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);

   gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture_FrameBuffer,0);
   gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,rbo);

   gl.bindTexture(gl.TEXTURE_2D,null);
   gl.bindRenderbuffer(gl.RENDERBUFFER,null);
   gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  
   // gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);
  
  /*========================= DRAWING ========================= */
  gl.clearColor(0.2, 0.8, 0.2, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearDepth(1.0);

  let old_time = 0.0;
  const animate = function (time) {

    // FRAMEBUFFER 
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearDepth(1.0);

    // --- TIME
    let dT = time - old_time;
    old_time = time;

    gl.viewport(0.0, 0.0, canvas.width,  canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shaderProgram);
    gl.bindVertexArray(vao);

    //MATRIX

    glMatrix.mat4.rotateY(MODELMATRIX, MODELMATRIX, 0.0005 * dT);
    gl.uniformMatrix4fv(u_mMatrix, false, MODELMATRIX);

    gl.uniformMatrix4fv(u_vMatrix, false, camera.vMatrix);
    gl.uniformMatrix4fv(u_pMatrix, false, camera.pMatrix);

    //BUFFER
    // gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_VERTEX);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    //gl.uniform3fv(u_Color, [1.0, 0.5, 0.1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_UV);
    gl.vertexAttribPointer(a_uv, 2, gl.FLOAT, false, 0, 0);

    /**
     * TEXTURE
     */
    if (texture.webGLtexture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture.webGLtexture);
      gl.uniform1i(u_texture, 0);
    }

    //gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_VERTEX);
    //gl.drawArrays(gl.TRIANGLES, 0, model.mesh.meshes[0].vertices.length);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
    gl.drawElements(
      gl.TRIANGLES,
      mainModel.faces.flat().length,
      gl.UNSIGNED_SHORT,
      0
    );

    //=============================================================
    /**
     * HELPERS
     */
    if (gui.axis) {
      loadAxisHelper(
        gl,
        shaderProgram_axis,
        camera.pMatrix,
        camera.vMatrix,
        MODELMATRIX
      );
    }

    if (gui.normal) {
      //Normal matrix Helper
      glMatrix.mat4.identity(NORMALMATRIX_HELPER);
      glMatrix.mat4.scale(NORMALMATRIX_HELPER, NORMALMATRIX_HELPER, [1.0, 1.0, 1.0]);
      glMatrix.mat4.invert(NORMALMATRIX_HELPER, NORMALMATRIX_HELPER);
      glMatrix.mat4.transpose(NORMALMATRIX_HELPER, NORMALMATRIX_HELPER);

      VertexNormalHelper(
        gl,
        shaderProgram_normalHelpers,
        mainModel,
        camera.pMatrix,
        camera.vMatrix,
        MODELMATRIX,
        NORMALMATRIX_HELPER
      );
    }


    //=============================================================
    /**
     * FULLSCREEN
     */
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0.0, 0.0, canvas.width,canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearDepth(1.0);

    gl.useProgram(FULLSCREEN_Plane.shaderProgram);
    gl.bindVertexArray(FULLSCREEN_vao);

    
//MATRIX
    //glMatrix.mat4.rotateY(MODELMATRIX, MODELMATRIX, 0.001 * dT);
    gl.uniformMatrix4fv(FULLSCREEN_Plane_u_mMatrix, false, FULLSCREEN_MATRIX);
    gl.uniformMatrix4fv(FULLSCREEN_Plane_u_vMatrix, false, FULLSCREEN_MATRIX);
    gl.uniformMatrix4fv(FULLSCREEN_Plane_u_pMatrix, false, FULLSCREEN_MATRIX);
//WAVE
    gl.uniform1f(FULLSCREEN_Plane_u_time, time * 0.001); 
    gl.uniform1f(FULLSCREEN_Plane_u_wave, gui.wave); 
    gl.uniform1f(FULLSCREEN_Plane_u_amplitude, gui.amplitude); 
//PIXELATE
    gl.uniform1f(FULLSCREEN_Plane_u_pixelate, gui.pixelate); 
    gl.uniform2f(FULLSCREEN_Plane_u_resolution, canvas.width,canvas.height); 
//GRAYSCALE
    gl.uniform1f(FULLSCREEN_Plane_u_grayFactor, gui.grayFactor); 

    //gl.uniform1f(FULLSCREEN_Plane_u_time, Date.now()); 
    //console.log(time);
    //BUFFER
    // gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, FULLSCREEN_Plane_VERTEX);
    gl.vertexAttribPointer(FULLSCREEN_a_Position, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, FULLSCREEN_Plane_UV);
    gl.vertexAttribPointer(FULLSCREEN_a_uv, 2, gl.FLOAT, false, 0, 0);

    /**
     * TEXTURE
     */
    if (texture_FrameBuffer) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture_FrameBuffer);
      gl.uniform1i(FULLSCREEN_Plane_u_texture, 0);
    }

   
    //textureFULLSCREEN

    // gl.bindBuffer(gl.ARRAY_BUFFER, FULLSCREEN_Plane_VERTEX);
    // gl.drawArrays(gl.TRIANGLES, 0, FULLSCREEN_Plane.mesh.vertex.length);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, FULLSCREEN_Plane_FACES);
    gl.drawElements(
      gl.TRIANGLES,
      FULLSCREEN_Plane.mesh.index.length,
      gl.UNSIGNED_SHORT,
      0
    );

    gl.flush();

    window.requestAnimationFrame(animate);
  };

  animate(0);
}

main();

console.log(2 + 2);
