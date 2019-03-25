  
  function setEvent(){
	  
	  document.addEventListener("keydown", keydownEvent, false);
      
      var button = document.getElementById('update');
      button.addEventListener("click",{handleEvent:updateGame, gl:gl,},false);
	  
  }
 
 function keydownEvent(e) {

    if (e.keyCode == 38) {
        goRun = 8;
    } else if (e.keyCode == 40) {
        goRun = 2;
    } else if (e.keyCode == 37) {
        goRun = 4;
    } else if (e.keyCode == 39) {
        goRun = 6;
    }

}

function updateGame(e) {

        var grid_x =  document.getElementById("Grid_X");
        var grid_y =  document.getElementById("Grid_Y");

        if(grid_x.value > 30){
            grid_x.value = 30;
        }else if(grid_x.value < 3){
            grid_x.value = 3;
        }

        if(grid_y.value > 30){
            grid_y.value = 30;
        }else if(grid_y.value < 3){
            grid_y.value = 3;
        }

        bufferUpdate(this.gl,gridBuild());
        matrixUpdate(this.gl);

   };