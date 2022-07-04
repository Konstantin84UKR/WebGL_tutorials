

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


import * as glMatrix from "./src/glm/index.js";
import { Plane } from "./src/utils/Primitives/Plane.js";
import { loadCubeMap,loadSkyBoxBuffer,loadSkyBoxBufferPlane } from "./src/utils/skybox.js";

async function main() {
  /**
   * INIT
   */

  /** @type {HTMLCanvasElement} */
  //let canvas = await createCanvasGl(800, 600); //let canvas = await createCanvasGl(window.innerWidth, window.innerHeight);
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
   * EVENT
   */
  
  //  window.addEventListener('resize',()=>{
  //   sizes.width = window.innerWidth,
  //   sizes.height =  window.innerHeight
  
  //   //Update camera
  //   camera.aspect = sizes.width / sizes.height;
  //   camera.updateProjectionMatrix();
  
  //   //Update render
  //   renderer.setSize(sizes.width, sizes.height)
  //   renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
  // })

  window.addEventListener('dblclick',()=>{

    if(!document.fullscreenElement){
        canvas.requestFullscreen();
    }else{
        document.exitFullscreen()
    }
})
  
  /**
   * SHADER
   */
  const shaderProgram = await createPromiseShaderProgram(
    gl,
    "./src/shaders/vs_reflect.glsl",
    "./src/shaders/fs_reflect.glsl"
  );

  gl.useProgram(shaderProgram);
  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  // Attrib
  let a_Position = gl.getAttribLocation(shaderProgram, "a_Position");
  gl.enableVertexAttribArray(a_Position);
  let a_uv = gl.getAttribLocation(shaderProgram, "a_uv");
  gl.enableVertexAttribArray(a_uv);
  let a_normal = gl.getAttribLocation(shaderProgram, "a_normal");
  gl.enableVertexAttribArray(a_normal);
  // Uniform
  // let u_Color = gl.getUniformLocation(shaderProgram, "u_Color");
  let u_mMatrix = gl.getUniformLocation(shaderProgram, "u_mMatrix");
  let u_vMatrix = gl.getUniformLocation(shaderProgram, "u_vMatrix");
  let u_pMatrix = gl.getUniformLocation(shaderProgram, "u_pMatrix");
  var u_texture = gl.getUniformLocation(shaderProgram, "u_texture");

  let u_skybox = gl.getUniformLocation(shaderProgram, 'u_skybox');

  let u_worldCameraPosition = gl.getUniformLocation(shaderProgram, 'u_worldCameraPosition');
  let u_useTextureColor = gl.getUniformLocation(shaderProgram, 'u_useTextureColor');
  let u_useReflectColor = gl.getUniformLocation(shaderProgram, 'u_useReflectColor');


  //gl.useProgram(skybox_shaderProgram);
  gl.uniform1i(u_skybox, 1);
  gl.useProgram(null);
  gl.bindVertexArray(null);

  // SKYBOX CUBE
  // const skybox_shaderProgram = await createPromiseShaderProgram(
  //   gl,
  //   "./src/shaders/vs_skybox.glsl",
  //   "./src/shaders/fs_skybox.glsl"
  // );
  // gl.useProgram(skybox_shaderProgram);
  // let skybox_vao = gl.createVertexArray();
  // gl.bindVertexArray(skybox_vao);
  // // Attrib
  // let u_Matrices_skybox = gl.getUniformBlockIndex(skybox_shaderProgram, "Matrices");
  // gl.uniformBlockBinding(skybox_shaderProgram, u_Matrices_skybox, 0);

  // //let u_Vmatrix = gl.getUniformLocation(shaderProgram_skybox, 'u_Vmatrix');
  // let u_sampler_skybox = gl.getUniformLocation(skybox_shaderProgram, 'skybox');

  // gl.useProgram(skybox_shaderProgram);
  // gl.uniform1i(u_sampler_skybox, 1);
  // gl.useProgram(null);
  // gl.bindVertexArray(null);

  // SKYBOX PLANE
  const skybox_shaderProgram = await createPromiseShaderProgram(
    gl,
    "./src/shaders/vs_skyboxplane.glsl",
    "./src/shaders/fs_skyboxplane.glsl"
  );
  gl.useProgram(skybox_shaderProgram);
  let skybox_vao = gl.createVertexArray();
  gl.bindVertexArray(skybox_vao);
  // Attrib
  let u_Matrices_skybox = gl.getUniformBlockIndex(skybox_shaderProgram, "Matrices");
  gl.uniformBlockBinding(skybox_shaderProgram, u_Matrices_skybox, 0);

  //let u_Vmatrix = gl.getUniformLocation(shaderProgram_skybox, 'u_Vmatrix');
  let u_sampler_skybox = gl.getUniformLocation(skybox_shaderProgram, 'skybox');

  gl.useProgram(skybox_shaderProgram);
  gl.uniform1i(u_sampler_skybox, 1);
  gl.useProgram(null);
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



// SKYBOX CUBE
let skyboxTexture = await loadCubeMap(gl);

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

  let TRIANGLE_NORMAL = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_NORMAL);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(mainModel.normals),
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

  // SKYBOX CUBE
 
  //gl.bindVertexArray(null);
  //let CUBE_VERTEX =  await loadSkyBoxBuffer(gl);
  let CUBE_VERTEX =  await loadSkyBoxBufferPlane(gl);
  //=============================================================
  /**
   * MATRIX
   */
  let MODELMATRIX =  glMatrix.mat4.create();
  let VIEWMATRIX =  glMatrix.mat4.create();
  let PROJMATRIX =  glMatrix.mat4.create();

  glMatrix.mat4.identity(PROJMATRIX);
  let fovy = (90 * Math.PI) / 180;
  glMatrix.mat4.perspective(PROJMATRIX, fovy, canvas.width / canvas.height, 1, 50);
  glMatrix.mat4.lookAt(VIEWMATRIX, [-7.0, 5.0, 10.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
  glMatrix.mat4.translate(MODELMATRIX, MODELMATRIX, [0.0, -1.0, 0.0]);

  //glMatrix.mat4.scale(MODELMATRIX, MODELMATRIX, [3.0, 3.0, 3.0]);


  //gl.uniformMatrix4fv(u_mMatrix ,false, MODELMATRIX);
  // gl.uniformMatrix4fv(u_vMatrix,false, VIEWMATRIX);
  // gl.uniformMatrix4fv(u_pMatrix,false, PROJMATRIX);

  
  const VIEWMATRIX_SKYBOX = glMatrix.mat4.create();

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

  
  
   // gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);
  
  /*========================= DRAWING ========================= */
  gl.clearColor(0.2, 0.8, 0.2, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearDepth(1.0);

  let old_time = 0.0;
  const animate = function (time) {

    // MODEL 
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

    glMatrix.mat4.rotateY(MODELMATRIX, MODELMATRIX, 0.0001 * dT);
    gl.uniformMatrix4fv(u_mMatrix, false, MODELMATRIX);

    gl.uniformMatrix4fv(u_vMatrix, false, camera.vMatrix);
    gl.uniformMatrix4fv(u_pMatrix, false, camera.pMatrix);

    //BUFFER
    // gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_VERTEX);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    //gl.uniform3fv(u_Color, [1.0, 0.5, 0.1]);

    let u_useTextureColor = gl.getUniformLocation(shaderProgram, 'u_useTextureColor');
    let u_useReflectColor = gl.getUniformLocation(shaderProgram, 'u_useReflectColor');

    gl.uniform3fv(u_worldCameraPosition,camera.eye);
    gl.uniform1f(u_useTextureColor,gui.useTextureColor);
    gl.uniform1f(u_useReflectColor,gui.useReflectColor);


    gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_UV);
    gl.vertexAttribPointer(a_uv, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_NORMAL);
    gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);

    /**
     * TEXTURE
     */
    if (texture.webGLtexture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture.webGLtexture);
      gl.uniform1i(u_texture, 0);
    }

    if (skyboxTexture) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP,skyboxTexture);
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
     * SKYBOX
     */
     gl.depthFunc(gl.LEQUAL);
    // gl.depthMask(gl.TRUE);
     gl.useProgram(skybox_shaderProgram);
     gl.enableVertexAttribArray(0); 

     glMatrix.mat4.copy(VIEWMATRIX_SKYBOX,camera.vMatrix)
     VIEWMATRIX_SKYBOX[12]=0;
     VIEWMATRIX_SKYBOX[13]=0;
     VIEWMATRIX_SKYBOX[14]=0;

     let sceneUniformData_skybox = new Float32Array(16 * 2);
     sceneUniformData_skybox.set(PROJMATRIX);
     sceneUniformData_skybox.set(VIEWMATRIX_SKYBOX, 16);
    
     let sceneUniformBuffer_skybox = gl.createBuffer();
     let Matrices_skybox = gl.getUniformBlockIndex(skybox_shaderProgram, 'Matrices');
     gl.bindBufferBase(gl.UNIFORM_BUFFER, Matrices_skybox, sceneUniformBuffer_skybox);
     gl.bufferData(gl.UNIFORM_BUFFER, sceneUniformData_skybox, gl.STATIC_DRAW);
     gl.uniform1i(u_sampler_skybox, 0);


     if (skyboxTexture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP,skyboxTexture);
     }

     gl.bindBuffer(gl.ARRAY_BUFFER, CUBE_VERTEX);
     gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 4 * (2), 0);

     gl.drawArrays(gl.TRIANGLES, 0, 6);
     gl.useProgram(null);

    gl.flush();

    window.requestAnimationFrame(animate);
  };

  animate(0);
}

main();

console.log(2 + 2);
