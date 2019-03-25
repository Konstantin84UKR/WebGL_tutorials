// Game grid
function gridBuild() {

    var grid_x =  parseFloat(document.getElementById("Grid_X").value);
    var grid_y =  parseFloat(document.getElementById("Grid_Y").value);

   grid_x =  (grid_x > 30) ? 30 : grid_x;
   grid_y =  (grid_y > 30) ? 30 : grid_y;

    var grid ={
        grid_vertex: null,
        grid_face: null
    };

    var grid_vertex = [];

    for(var i=0; i<=(2*grid_x); i = i + 2){
        grid_vertex.push(i, 0, 0);
        grid_vertex.push(i, 2*grid_y, 0);
    }
    for(var i=0; i<=(2*grid_y); i = i + 2){
        grid_vertex.push(0, i, 0);
        grid_vertex.push(2*grid_x, i, 0);
    }

       var grid_face = [];

    for(var i=0; i<((grid_x +1) * (grid_y +1)); i++){
        grid_face.push(i);
    }

    grid.grid_x = grid_x;
    grid.grid_y = grid_y;
    grid.grid_vertex = grid_vertex;
    grid.grid_face   = grid_face;
    grid.grid_count =  grid_vertex.length / 3 ;

    return grid;
}

function bufferUpdate(gl,grid) {

    gl.GRID_VERTEX = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.GRID_VERTEX);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(grid.grid_vertex),gl.STATIC_DRAW);

    gl.GRID_FACES = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.GRID_FACES);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(grid.grid_face),gl.STATIC_DRAW);

    gl.grid = grid;

}

function matrixUpdate(gl){

     var PROJMATRIX = mat4.perspective(40,gl.canvas.width/gl.canvas.height,1,200);
     var MODELMATRIX_SNAKE = mat4.create();
     var MODELMATRIX_GRID = mat4.create();
     var VIEWMATRIX = mat4.create();

     mat4.identity(MODELMATRIX_SNAKE);
     mat4.identity(MODELMATRIX_GRID);
     mat4.identity(VIEWMATRIX);
     // mat4.translate(VIEWMATRIX, [0.0, 0.0, -50.0]);
     mat4.rotateX(MODELMATRIX_SNAKE,0);
     mat4.rotateX(MODELMATRIX_GRID,0);
     //mat4.translate(MODELMATRIX_GRID,[-gl.grid.grid_x, -gl.grid.grid_y, 0.0]);

     var gridsize = (gl.grid.grid_x>gl.grid.grid_y) ? gl.grid.grid_x : gl.grid.grid_y;
     mat4.lookAt([gl.grid.grid_x, -20.0, gridsize * 3.0],[gl.grid.grid_x, gl.grid.grid_y, 0.0],[0.0, 1.0, 0.0],VIEWMATRIX);

     gl.PROJMATRIX        = PROJMATRIX;
     gl.MODELMATRIX_SNAKE = MODELMATRIX_SNAKE;
     gl.MODELMATRIX_GRID  = MODELMATRIX_GRID;
     gl.VIEWMATRIX        = VIEWMATRIX;


}

function snakeContriller(gl,snakePosition,goRun) {

    if(goRun==8){
        snakePosition.y = snakePosition.y + 1;
        if(snakePosition.y >= (gl.grid.grid_y)){
            snakePosition.y= 0.0;
        }

    }else if(goRun==2){
        snakePosition.y = snakePosition.y - 1;
        if(snakePosition.y < 0){
            snakePosition.y = gl.grid.grid_y-1;
        }

    }else if(goRun==4){
        snakePosition.x = snakePosition.x - 1;
        if(snakePosition.x < 0){
            snakePosition.x = gl.grid.grid_x-1;
        }

    }else if(goRun==6){
        snakePosition.x = snakePosition.x + 1;
        if(snakePosition.x >= gl.grid.grid_x){
            snakePosition.x = 0;
        }
    }

    return snakePosition;
}



function swapSnake(snake){

    if(snake.length==0){snake.push([0,0]);}

    var len = snake.length;

    for(i=len-1;i>0; i-=1){

        var a = snake[i-1][0];
        var b = snake[i-1][1];

        snake[i][0] = a;
        snake[i][1] = b;

    }

    return snake;

}

function EatApple(gl,snake,apple){

    let xSnake = Math.round(snake[0][0]);
    let xApple = Math.round(apple.positionX);
    let ySnake = Math.round(snake[0][1]);
    let yApple = Math.round(apple.positionY);
    apple.Eat = false;

    if ((xSnake == xApple)&(ySnake == yApple)) {

        apple.positionX = rand(0.0,gl.grid.grid_x-1,2.0);
        apple.positionY = rand(0.0,gl.grid.grid_y-1,2.0);

        apple.Eat = true;

    }else {

    }

     return apple;
}

function rand(min,max,num){
    return Math.floor(Math.floor(Math.random()*(max-min+1)+min) / num) * num;
}