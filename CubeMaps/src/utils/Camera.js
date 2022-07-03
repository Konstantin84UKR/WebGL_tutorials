import * as glMatrix from "../glm/index.js";

export class Camera{
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

        this.transformMatFront = glMatrix.mat4.create();

        this.eye	    = glMatrix.vec3.create();	//Traditional X,Y,Z 3d position
        glMatrix.vec3.set( this.eye,0.0,0.0,10.0);
        this.front		= glMatrix.vec3.create();        	//How much to scale a mesh. Having a 1 means no scaling is done.
        glMatrix.vec3.set( this.front,0.0,0.0,-1.0);
        this.up	        = glMatrix.vec3.create();	//Hold rotation values based on degrees, Object will translate it to radians
        glMatrix.vec3.set( this.up,0.0,1.0,0.0); 
        this.upWorld    = glMatrix.vec3.create();	
        glMatrix.vec3.set( this.upWorld,0.0,1.0,0.0); 


        this.right    = glMatrix.vec3.create();	    

        this.sensitivity = 0.5; 
        this.yaw = 0.0;
        this.pitch = 0.0;//-90.0*Math.PI/180;

        this.look = glMatrix.vec3.create();
       
        this.sensitivity = 0.5; 
       
        this.drag=false;
        this.old_x = 0.0;
        this.old_y = 0.0;
        this.dX = 0.0;
        this.dY = 0.0;
        

        this.lookAt();

        window.addEventListener("keydown", this.onkeydown.bind(this)   , false);
        window.addEventListener("keypress", this.onkeypress.bind(this)   , false);
        window.addEventListener("keyup",  this.onkeyup.bind(this)   , false);

        this.gl.canvas.addEventListener("mousedown", this.mouseDown.bind(this)     , false);
        this.gl.canvas.addEventListener("mouseout" ,this.mouseOut.bind(this)       , false);
        this.gl.canvas.addEventListener("mousemove",this.mouseMove.bind(this)      , false);
        this.gl.canvas.addEventListener("mouseup"  , this.mouseUp.bind(this)       , false);
       

   }

    lookAt(){
      glMatrix.vec3.add(this.look,this.front,this.eye);   
      //glMatrix.vec3.normalize(this.look,this.look); 
      glMatrix.mat4.lookAt(this.vMatrix,this.eye,this.look,this.up);  
    }


    translate_eye(key){
        let temp = glMatrix.vec3.create();
        switch (key) {
            case "W":
                glMatrix.vec3.copy(temp, this.front);
                break;
            case "S":
                  glMatrix.vec3.negate(temp, this.front);
                  break;   
            case "A":
                    glMatrix.vec3.cross(temp, this.up , this.front);
                    glMatrix.vec3.normalize(temp, temp);
                    break;   
            case "D":
                    glMatrix.vec3.cross(temp, this.up , this.front);
                    glMatrix.vec3.normalize(temp, temp);
                    glMatrix.vec3.negate(temp, temp);
                    break;                 
            default:
                glMatrix.vec3.add(this.eye,this.eye,temp);
                break;
        }
        //glMatrix.vec3.negate(temp, this.front);
        const speedCamera = 0.3;
        glMatrix.vec3.scale(temp, temp, speedCamera);


       glMatrix.vec3.add(this.eye,this.eye,temp);
       // glMatrix.mat4.translate(this.vMatrix,this.vMatrix,this.eye);
        this.lookAt();
    }

    onkeydown(e) {

        // if (e.key === "w") { this.translate_eye('W')}
        // if (e.key === "s") { this.translate_eye('S')}
        // if (e.key === "a") { this.translate_eye('A')}
        //if (e.key === "d") { this.translate_eye('D')}

    };

    onkeypress(e) {

        if (e.key === "w") { this.translate_eye('W')}
        if (e.key === "s") { this.translate_eye('S')}
        if (e.key === "a") { this.translate_eye('A')}
        if (e.key === "d") { this.translate_eye('D')}

    };press

    onkeyup(e){
    }

    updateCameraVectors(){
        // let frontTemp = glMatrix.vec3.create();
        // frontTemp[0] = Math.cos(this.yaw) * Math.cos(this.pitch);
        // frontTemp[1] = Math.sin(this.pitch);
        // frontTemp[2] = Math.sin(this.yaw) * Math.cos(this.pitch);
        // glMatrix.vec3.negate(frontTemp, frontTemp);
        // glMatrix.vec3.normalize(this.front, frontTemp);

        glMatrix.mat4.identity(this.transformMatFront);
        
        glMatrix.vec3.cross(this.right,this.front,this.upWorld); 
        glMatrix.vec3.cross(this.up,this.right,this.front); 
       
    }  

    mouseDown(e){
        console.log('mouseDown');
        this.drag=true;
        this.old_x=e.pageX, this.old_y=e.pageY;
        e.preventDefault();
        return false;
    }

    mouseUp(e){
        this.drag=false;
    }

    mouseMove(e){
        if (!this.drag) {
            return false;
        } else {

            this.dX=(e.pageX-this.old_x)*2*Math.PI/this.gl.canvas.width;
            this.dY=(e.pageY-this.old_y)*2*Math.PI/this.gl.canvas.height;
            this.old_x=e.pageX;
            this.old_y=e.pageY;

            this.updateCameraVectors();
            this.upDateRotate();
            this.lookAt();

            e.preventDefault();
        }
        e.preventDefault();
    }

    mouseOut(e){
        this.drag=false;
    }
   

    upDateRotate(){
        glMatrix.mat4.rotate(this.transformMatFront,this.transformMatFront,-this.dX,this.up);   
        glMatrix.mat4.rotate(this.transformMatFront,this.transformMatFront,-this.dY,this.right);  
        glMatrix.vec3.transformMat4(this.front,this.front,this.transformMatFront);      
      
        glMatrix.vec3.normalize(this.front,this.front);
    }

    reset(){
     
        glMatrix.vec3.set( this.eye,0.0,0.0,10.0);
        glMatrix.vec3.set( this.front,0.0,0.0,-1.0);
        glMatrix.vec3.set( this.up,0.0,1.0,0.0); 
        glMatrix.vec3.set( this.upWorld,0.0,1.0,0.0); 

        this.lookAt();
        
    }
    
}
