class MouseController{

    constructor(gl){
    var oThis = this;
    //this.drag = false;

    this.dZ = 0.0;
    this.dX = 0.0;
    this.dY = 0.0;

    this.theta = 0.0;
    this.phi = 0.0;

    this.old_x = 0.0;
    this.old_y = 0.0;
    this.old_z = 0.0;

    this.CaptureMouseEvent = 0;

    this.canvas = gl.canvas;


        // this.canvas.addEventListener("mousedown", function(e){oThis.mouseDown(e); });
        //
        // this.canvas.addEventListener("mouseup", function(e){oThis.mouseUp(e); });
        //
        // this.canvas.addEventListener("mouseout", function(e){oThis.mouseUp(e); });
        //
        // this.canvas.addEventListener("mousemove", function(e){oThis.mouseMove(e); });
        //
        //document.addEventListener("keydown", onkeydown(e));
       // document.addEventListener("keyup",  onkeyup(e));

    }




    activateCameraController(){

        var CaptureMouseEvent = {

           drag : false,

           dZ : 0.0,
           dX : 0.0,
           dY : 0.0,

           theta : 0.0,
           phi : 0.0,

           old_x : 0.0,
           old_y : 0.0,
           old_z : 0.0,

    };

        var mouseDown = function(e) {

            console.log('mouseDown');
            CaptureMouseEvent.drag=true;
            CaptureMouseEvent.old_x=e.pageX, CaptureMouseEvent.old_y=e.pageY;
            e.preventDefault();
            return false;
        };

        var mouseUp=function(e){
            CaptureMouseEvent.drag=false;
        };

        var mouseMove=function(e) {
            if (!CaptureMouseEvent.drag) {
                return false;
            } else {

                CaptureMouseEvent.dX=(e.pageX-CaptureMouseEvent.old_x)*2*Math.PI/this.width;
                CaptureMouseEvent.dY=(e.pageY-CaptureMouseEvent.old_y)*2*Math.PI/this.height;
                CaptureMouseEvent.old_x=e.pageX;
                CaptureMouseEvent.old_y=e.pageY;

                e.preventDefault();
            }
            e.preventDefault();
        };

        var onkeydown = function (e) {

            if (e.key === "ArrowUp")   {this.dZ = 0.03; }
            if (e.key === "ArrowDown") {this.dZ = -0.03;}

        };

        var onkeyup = function(e){

            if (e.key === "ArrowUp")   {this.dZ = 0.0;}
            if (e.key === "ArrowDown") {this.dZ = 0.0;}

        }

        // this.canvas.addEventListener("mousedown", mouseDown , false);
        // this.canvas.addEventListener("mouseout" , mouseUp   , false);
        // this.canvas.addEventListener("mousemove", mouseMove , false);
        // this.canvas.addEventListener("mouseup"  , mouseUp   , false);
        window.addEventListener("keydown", onkeydown   , false);
        window.addEventListener("keyup",  onkeyup   , false);

        this.CaptureMouseEvent = CaptureMouseEvent;

}

}