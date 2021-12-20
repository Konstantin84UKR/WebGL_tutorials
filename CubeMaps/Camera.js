class Camera {

    constructor(gl,cameraType){

        this.gl = gl;

        let viewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.identity(viewMatrix);

        let  projMatrix = glMatrix.mat4.create();
        glMatrix.mat4.identity(projMatrix);

        let  fovy =  40 * Math.PI / 180;
        glMatrix.mat4.perspective(projMatrix,fovy,gl.canvas.width/gl.canvas.height,1,100);

        this.vMatrix = viewMatrix;
        this.pMatrix = projMatrix;

        this.eye	    = vec3.create([0.0,0.0,10.0]);	//Traditional X,Y,Z 3d position
        this.center		= vec3.create([0.0,1.0,0.0]);	//How much to scale a mesh. Having a 1 means no scaling is done.
        this.up	        = vec3.create([0.0,1.0,0.0]);	//Hold rotation values based on degrees, Object will translate it to radians

   }

    //Methods
    activatePerspective(){
        glMatrix.mat4.perspective(45,gl.viewportWidth/gl.viewportHeigth, 0.1,100,this.pMatrix);
    };

    activateOrtho(){
        glMatrix.mat4.ortho(this.pMatrix, left, right, bottom, top, 0.1, 100) };
        // glMatrix.mat4.ortho(PROJMATRIX,-5.,5.,-5.,5., .1,25.);
    };



}