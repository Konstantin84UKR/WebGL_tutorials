
function myGUI() {

    var settingGUI =  {

        source_ambient_color_R: 0.5,
        rotateX: 0.0,
        model_X:  0.0,
        model_Y:  0.0,
        model_Z:  0.0,

        source_directionX: 0.0,
        source_directionY: 1.0,
        source_directionZ: 5.0,

        size: 1.03,
        color: [ 255, 128, 0],
        shininess: 10.0,

        normal: false,
        axis: true,

    }

    let gui = new dat.GUI();
  
    var  source_direction = gui.addFolder('source direction');
    source_direction.add(settingGUI,'source_directionX').min(-5.0).max(5.0).step(0.1);
    source_direction.add(settingGUI,'source_directionY').min(-5.0).max(5.0).step(0.1);
    source_direction.add(settingGUI,'source_directionZ').min(-15.0).max(15.0).step(0.1);
    source_direction.open()

    gui.add(settingGUI,'shininess').min(1.0).max(50.0).step(1.0);

    var  model = gui.addFolder('model');
    model.add(settingGUI,'model_X').min(-5.0).max(5.0).step(0.1);
    model.add(settingGUI,'model_Y').min(-5.0).max(5.0).step(0.1);
    model.add(settingGUI,'model_Z').min(-5.0).max(5.0).step(0.1);

    model.open();

    var  view = gui.addFolder('Stensil');
    view.add(settingGUI,'size').min(1.01).max(1.1).step(0.01);  
    view.addColor(settingGUI, 'color');

    view.open();

    gui.add(settingGUI,'normal');
    gui.add(settingGUI,'axis');

    return settingGUI;
}