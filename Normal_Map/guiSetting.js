
function myGUI(gl) {

    const settingGUI =  {

        rotateX: 0.0,
        model_X:  0.0,
        model_Y:  1.0,
        model_Z:  0.0,

        source_directionX: 0.0,
        source_directionY: 5.0,
        source_directionZ: 5.0,

        view_directionX: 0.0,
        view_directionY: 2.0,
        view_directionZ: 4.0,

        shininess: 10.0,
        normal: false,
        axis: false,
        diffuse: false,
        normalPower: 1.0,
    }



    let gui = new dat.GUI();

    const source_direction = gui.addFolder('source direction');
    source_direction.add(settingGUI,'source_directionX').min(-15.0).max(15.0).step(0.1);
    source_direction.add(settingGUI,'source_directionY').min(0.0).max(15.0).step(0.1);
    source_direction.add(settingGUI,'source_directionZ').min(-15.0).max(15.0).step(0.1);
    source_direction.open()

    gui.add(settingGUI,'shininess').min(1.0).max(50.0).step(1.0);

    const model = gui.addFolder('model');
    model.add(settingGUI,'model_X').min(-5.0).max(5.0).step(0.1);
    model.add(settingGUI,'model_Y').min(-5.0).max(5.0).step(0.1);
    model.add(settingGUI,'model_Z').min(-5.0).max(5.0).step(0.1);

    model.open();


    const view = gui.addFolder('view');
    view.add(settingGUI,'view_directionX').min(-15.0).max(15.0).step(0.1);
    view.add(settingGUI,'view_directionY').min(-15.0).max(15.0).step(0.1);
    view.add(settingGUI,'view_directionZ').min(-15.0).max(15.0).step(0.1);

    view.open();

    gui.add(settingGUI,'normal');
    gui.add(settingGUI,'axis');

    gui.add(settingGUI,'diffuse');
    gui.add(settingGUI,'normalPower').min(0.0).max(2.0).step(0.1);


    return settingGUI;
}