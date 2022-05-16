import * as dat from './dat.gui.module.js';

export function myGUI(gl) {




    const settingGUI =  {

        rotateX: 0.0,
        model_X:  0.0,
        model_Y:  1.0,
        model_Z:  0.0,

        view_directionX: 0.0,
        view_directionY: 2.0,
        view_directionZ: -10.0,
     
        normal: false,
        axis: false,

        cameraReset: function(){
           console.log(gl.camera.reset());
        },

        wave: 30.0,
        amplitude: 0.05,

        pixelate: 10.0,

        grayFactor: 1.0,
       
        MatCap: 0
    }



    let gui = new dat.GUI();

    gui.add(settingGUI,'normal');
    gui.add(settingGUI,'axis');

    const camera = gui.addFolder('camera');
    camera.add(settingGUI, 'cameraReset');
    camera.open();

    const postEffect = gui.addFolder('postEffect');
    postEffect.add(settingGUI,"wave").min(0.0).max(100.0).step(0.1);
    postEffect.add(settingGUI,"amplitude").min(0.000).max(0.08).step(0.001);
    postEffect.add(settingGUI,"pixelate").min(1.0).max(20.0).step(1.0);
    postEffect.add(settingGUI,"grayFactor").min(0.0).max(1.0).step(0.1);
    postEffect.open();


    return settingGUI;
}