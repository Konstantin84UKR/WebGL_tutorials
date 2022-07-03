export async function initWebGL2(canvas) {
    // Get A WebGL context
     let gl;
    try {
      gl = canvas.getContext("webgl2", { antialias: false });
    } catch (e) {
      alert("You are not webgl compatible :(");
      return false;
    }
    return gl;
  }

export async function createCanvasGl(width,height){
    /** @type {HTMLCanvasElement} */
    const canvas = document.body.appendChild(document.createElement("canvas"));
   
    if (!canvas) {
    console.log("failed");
      return;
    }

    canvas.width = width; //screen.width;
    canvas.height = height; //screen.height;

    return canvas;
}  



//TODO Resize Canvas