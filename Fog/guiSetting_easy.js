function myGUI(gl) {

    let settingGUI = {

        normal: false,
        axis: false,
        Clicked: false,

    }

    let FogSetting = function () {
        this.FogDist_near = 0.2;
        this.FogDist_far = 25.0;
        this.colorFog = [125, 125, 125];
    };

    let Fog = new FogSetting();

    let gui = new dat.GUI();
    gui.add(settingGUI, 'normal');
    gui.add(settingGUI, 'axis');
    let controllerFogDist_near = gui.add(Fog, 'FogDist_near').min(0.2).max(25.0).step(0.5);
    let controllerFogDist_far = gui.add(Fog, 'FogDist_far').min(1.0).max(25.0).step(0.5);
    gui.addColor(Fog, 'colorFog');

    controllerFogDist_near.onChange(function (value) {
        if (Fog.FogDist_near > (Fog.FogDist_far - 5.0)){
            Fog.FogDist_near = (Fog.FogDist_far - 5.0);
           // Fog.FogDist_far = (Fog.FogDist_near + 5.0);
        }
    });

    controllerFogDist_far.onChange(function (value) {
        if (Fog.FogDist_near >(Fog.FogDist_far - 5.0)) {
            Fog.FogDist_far = (Fog.FogDist_near + 5.0);

        }
    });

    return {settingGUI, Fog};
}