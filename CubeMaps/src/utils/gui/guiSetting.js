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
        amplitude: 0.005,

        pixelate: 10.0,

        grayFactor: 0.0,
       
        MatCap: 0,

        useTextureColor : false,
        useReflectColor : false
    }



    let gui = new dat.GUI();

    // const model = gui.addFolder('model');
    // model.add(settingGUI,'model_X').min(-5.0).max(5.0).step(0.1);
    // model.add(settingGUI,'model_Y').min(-5.0).max(5.0).step(0.1);
    // model.add(settingGUI,'model_Z').min(-5.0).max(5.0).step(0.1);
    // //model.open();
   
    // const view = gui.addFolder('view');
    // view.add(settingGUI,'view_directionX').min(-15.0).max(15.0).step(0.1);
    // view.add(settingGUI,'view_directionY').min(-15.0).max(15.0).step(0.1);
    // view.add(settingGUI,'view_directionZ').min(-15.0).max(15.0).step(0.1);
    // //view.open();

    gui.add(settingGUI,'normal');
    gui.add(settingGUI,'axis');
    gui.add(settingGUI,'useTextureColor');
    gui.add(settingGUI,'useReflectColor');

    const camera = gui.addFolder('camera');
    camera.add(settingGUI, 'cameraReset');
    camera.open();

    //gui.add(settingGUI,'resetCamera').name('Reset Animation');

    // const postEffect = gui.addFolder('postEffect');
    // postEffect.add(settingGUI,"wave").min(0.0).max(100.0).step(0.1);
    // postEffect.add(settingGUI,"amplitude").min(0.000).max(0.08).step(0.001);
    // postEffect.add(settingGUI,"pixelate").min(1.0).max(20.0).step(1.0);
    // postEffect.add(settingGUI,"grayFactor").min(0.0).max(1.0).step(0.1);
    // postEffect.open();

    // gui.add(settingGUI, 'MatCap', { 
    //     green: 0, 
    //     clay: 1,
    //     grey: 2,
    //     redclay: 3,
    //     skin: 4,
    //     skin2: 5,
    //     crome: 6,
       
    // } );

    return settingGUI;
}
