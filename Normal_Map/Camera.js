class Camera {

    constructor(gl, cameraType) {

        this.gl = gl;

        let viewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.identity(viewMatrix);


        let projMatrix = glMatrix.mat4.create();
        glMatrix.mat4.identity(projMatrix);

        let fovy = 40 * Math.PI / 180;
        glMatrix.mat4.perspective(projMatrix, fovy, gl.canvas.width / gl.canvas.height, 1, 100);

        // this.vMatrix = viewMatrix;
        this.pMatrix = projMatrix;

        this.eye = glMatrix.vec3.create();
        glMatrix.vec3.set(this.eye, 0.0, 0.0, 10.0);

        // this.eye = vec3.create([0.0, 0.0, 10.0]);	//Traditional X,Y,Z 3d position

        this.center = glMatrix.vec3.create();
        glMatrix.vec3.set(this.center, 0.0, 1.0, 0.0);

        //this.center = vec3.create([0.0, 1.0, 0.0]);	//How much to scale a mesh. Having a 1 means no scaling is done.

        this.up = glMatrix.vec3.create();
        glMatrix.vec3.set(this.up, 0.0, 1.0, 0.0);

        //this.up = vec3.create([0.0, 1.0, 0.0]);	//Hold rotation values based on degrees, Object will translate it to radians


        glMatrix.mat4.lookAt(viewMatrix, [1.0, 5.0, 10.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

        this.vMatrix = viewMatrix;
        this.pMatrix = projMatrix;

    }

    //Methods
    activatePerspective() {
        glMatrix.mat4.perspective(45, gl.viewportWidth / gl.viewportHeigth, 0.1, 100, this.pMatrix);
    };

    activateOrtho() {
        glMatrix.mat4.ortho(this.pMatrix, left, right, bottom, top, 0.1, 100)
    };
    // glMatrix.mat4.ortho(PROJMATRIX,-5.,5.,-5.,5., .1,25.);
};

class CameraController {
    constructor(c, gui) {
        let oThis = this;
        this.camera = c;
        this.gui = gui;

        document.addEventListener("keydown", function (e) { oThis.onkeydown(e); });
        document.addEventListener("keyup", function (e) { oThis.onkeyup(e); });
        document.addEventListener("keypress", function (e) { oThis.onkeypress(e); });

        this.position = glMatrix.vec3.create();
        this.position.x = this.gui.view_directionX;
        this.position.z = this.gui.view_directionZ;
    }

    updateMatrix() {
        // glMatrix.mat4.lookAt(this.camera.vMatrix, [this.gui.view_directionX, this.gui.view_directionY, this.gui.view_directionZ], [0.0, 1.0, 0.0], [0.0, 1.0, 0.0]);
        glMatrix.mat4.lookAt(this.camera.vMatrix, [this.position.x, this.gui.view_directionY, this.position.z], [0.0, 1.0, 0.0], [0.0, 1.0, 0.0]);
    }

    onkeydown = function (e) {

        // if (e.key === "ArrowUp") { this.dZ = 0.03; }
        // if (e.key === "ArrowDown") { this.dZ = -0.03; }

    };

    onkeyup = function (e) {

        // if (e.key === "ArrowUp") { this.dZ = 0.0; }
        // if (e.key === "ArrowDown") { this.dZ = 0.0; }

    }

    onkeypress = function (e) {

        if (e.key === "d") { this.position.x += 0.1; }
        if (e.key === "a") { this.position.x -= 0.1; }

        if (e.key === "w") { this.position.z -= 0.1; }
        if (e.key === "s") { this.position.z += 0.1; }

    }

}
