// Структура библиотеки это один файл программки демки в которую импортируються общие файлы.

// import VELO_3D from './src/velo.js';
//import Scene from './src/Scene.js';
import { myGUI }  from './src/guiSetting.js';

import {
    glMatrix,
    mat2, mat2d, mat3, mat4,
    quat, quat2,
    vec2, vec3, vec4,
  } from "./src/glm/index.js";

  import * as ShaderUtil from './src/ShaderUtil.js';

async function main() {
   
    const canvas = document.getElementById("canvasGL");
    if (!canvas) {
        console.log('failed');
        return;
    }
    canvas.width = 1800;
    canvas.height = 900;

    let gl;
    try {

        gl = canvas.getContext("webgl2", { antialias: true });
        gl.canvas = canvas;

    } catch (e) {
        alert("You are not webgl compatible :(");
        return false;
    }
    // -------------------- Настройка сцены // main ----------------------//
    const gui =myGUI();
 

    const animate = function (time) {
        //console.log(time);
        window.requestAnimationFrame(animate);
    };
    animate(0);
   // tick(VELO.gl,draw);
};

main();

// async function draw(gl,scene){
//     // --------------------Отрисовка // draw ----------------------//

//     scene.draw(gl);
   

    
// }
// async function tick(gl,draw) {
      
//         const animate = function () {
           
//            requestAnimationFrame(animate);
         
//            // -------------------- Анимация // animate ----------------------//
//            scene.models.forEach(element => {
//                 element.rotationSet(element.rotationAnime);
//             });            

//             draw(gl,scene);
//         };
//         await animate();
//     }

