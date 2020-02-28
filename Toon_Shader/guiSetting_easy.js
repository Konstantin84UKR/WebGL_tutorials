
function myGUI(gl) {

    var settingGUI = {

        normal: false,
        axis: false,
        Clicked: false

    }

    let gui = new dat.GUI();
    gui.add(settingGUI, 'normal');
    gui.add(settingGUI, 'axis');
    gui.add(settingGUI, 'Clicked');

    return settingGUI;
}