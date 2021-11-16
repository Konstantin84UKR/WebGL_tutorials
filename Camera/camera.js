class Camera{
    constructor(gl,cameraType){

        this.gl = gl;

        this.sensitivity = 0.5;

        let viewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.identity(viewMatrix);

        let  projMatrix = glMatrix.mat4.create();
        glMatrix.mat4.identity(projMatrix);

        let  fovy =  40 * Math.PI / 180;
        glMatrix.mat4.perspective(projMatrix,fovy,gl.canvas.width/gl.canvas.height,1,100);

        this.vMatrix = viewMatrix;
        this.pMatrix = projMatrix;

        this.eye	    = glMatrix.vec3.create();	//Traditional X,Y,Z 3d position
        glMatrix.vec3.set( this.eye,0.0,0.0,20.0);
        this.center		= glMatrix.vec3.create([0.0,1.0,0.0]);        	//How much to scale a mesh. Having a 1 means no scaling is done.
        glMatrix.vec3.set( this.center,0.0,1.0,0.0);
        this.up	        = glMatrix.vec3.create(0.0,1.0,0.0);	//Hold rotation values based on degrees, Object will translate it to radians
        glMatrix.vec3.set( this.up,0.0,1.0,0.0);


        this.eye

        this.lookAt();

        window.addEventListener("keydown", this.onkeydown.bind(this)   , false);
        window.addEventListener("keyup",  this.onkeyup.bind(this)   , false);

   }
    //function(e){oThis.mouseMove(e); 
    // //Methods
    // activatePerspective(){
    //     glMatrix.mat4.perspective(45,gl.viewportWidth/gl.viewportHeigth, 0.1,100,this.pMatrix);
    // };

    // activateOrtho(){
    //     //glMatrix.mat4.ortho(this.pMatrix, left, right, bottom, top, 0.1, 100) };
    //      glMatrix.mat4.ortho(PROJMATRIX,-5.,5.,-5.,5., .1,25.);
    // };

    lookAt(){
      glMatrix.mat4.lookAt(this.vMatrix,this.eye,this.center,this.up);  
    }


    translate_eye(dXYZ){
        glMatrix.vec3.add(this.eye,this.eye,dXYZ);
        glMatrix.mat4.translate(this.vMatrix,this.vMatrix,this.eye);
        this.lookAt();
    }


    onkeydown(e) {

        if (e.key === "w")   {this.translate_eye([0.0,0.0,this.sensitivity])}
        if (e.key === "s") {this.translate_eye([0.0,0.0,-this.sensitivity])}

        if (e.key === "a")   {this.translate_eye([this.sensitivity,0.0,0.0])}
        if (e.key === "d") {this.translate_eye([-this.sensitivity,0.0,0.0])}

    };

    onkeyup(e){

        if (e.key === "ArrowUp")   {this.dZ = 0.0;}
        if (e.key === "ArrowDown") {this.dZ = 0.0;}

    }

    
    
}