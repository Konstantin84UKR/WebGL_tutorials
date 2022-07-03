class MouseController{

    constructor(gl){
    var oThis = this;
    this.drag = false;

    this.dZ = 0.0;
    this.dX = 0.0;
    this.dY = 0.0;

    this.theta = 0.0;
    this.phi = 0.0;

    this.old_x = 0.0;
    this.old_y = 0.0;
    this.old_z = 0.0;

    this.dWheel = 0.0;


    this.canvas = gl.canvas;


        this.canvas.addEventListener("mousedown", function(e){oThis.mouseDown(e); });

        this.canvas.addEventListener("mouseup", function(e){oThis.mouseUp(e); });

        this.canvas.addEventListener("mouseout", function(e){oThis.mouseUp(e); });

        this.canvas.addEventListener("mousemove", function(e){oThis.mouseMove(e); });

        this.canvas.addEventListener('wheel',  function(e){oThis.onWheel(e);});

        document.addEventListener("keydown", function(e){ oThis.onkeydown(e); });
        document.addEventListener("keyup", function(e){ oThis.onkeyup(e); });

    }


    mouseDown=function(e) {

        this.drag = true;
        this.old_x = e.pageX, this.old_y = e.pageY;
        e.preventDefault();
        return false;
    };

    mouseUp=function(e){

        this.drag=false;

    };

    mouseMove=function(e) {
        if (!this.drag) return false;

        this.dX=(e.pageX-this.old_x)*2*Math.PI/this.canvas.width,
        this.dY=(e.pageY-this.old_y)*2*Math.PI/this.canvas.height;

       // this.theta += this.dX;
       // this.phi += this.dY;

        this.old_x=e.pageX, this.old_y=e.pageY;

        e.preventDefault();
    };

    onkeydown = function (e) {

        if (e.key === "ArrowUp")   {this.dZ = -0.03; }
        if (e.key === "ArrowDown") {this.dZ = 0.03;}

    };

    onkeyup = function(e){

        if (e.key === "ArrowUp")   {this.dZ = 0.0;}
        if (e.key === "ArrowDown") {this.dZ = 0.0;}

    };

    onWheel =  function(e){
        e = e || window.event;
      
        // wheelDelta не даёт возможность узнать количество пикселей
       this.dWheel = e.deltaY || e.detail || e.wheelDelta;
      
       // var info = document.getElementById('delta');
      
        //info.innerHTML = +info.innerHTML + delta;
      
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      }


}