const CELL_SIZE = 20;
const CANVAS_SIZE = 500;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}

var MOVE_INTERVAL = 150;


//array wall
var wallX = [];
var wallY = [];

//array wall for level
var wall2 = [
    {
        x1: 5,
        x2: 20,
        y: 5,
    }
];
var wall3 = [
    {
        x1: 5,
        x2: 20,
        y: 10,
    }
];
var wall4 = [
    {
        x1: 5,
        x2: 20,
        y: 15,
    }
];
var wall5 = [
    {
        x: 5,
        y1: 5,
        y2: 20,
    },
    {
        x: 19,
        y1: 7,
        y2: 20,
    }
];

//random position
function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

//init head and body
function initHeadAndBody() {
    let head = initPosition();
    let body = [{ x: head.x, y: head.y }];
    return {
        head: head,
        body: body,
    }
}

//init direction
function initDirection() {
    return Math.floor(Math.random() * 4);
}

//init snake
function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
        scoreReset: 0,
        level: 0,
        life: 3,
    }
}

//life snake display canvas
let lifes = {
    position: initPosition(),
}

let snake1 = initSnake("#B96E54");

//init apple
let apple = {
    color: "red",
    position: initPosition(),
}

let apple1 = {
    color: "green",
    position: initPosition(),
}

//drawCell 
function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

//drawScore display score
function drawScore(snake) {
    let scoreCanvas;
    if (snake.color == snake1.color) {
        scoreCanvas = document.getElementById("score1Board");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "50px monogram";
    scoreCtx.fillStyle = "#A2C758";
    scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
}

function drawLifeCorner(ctx, snake){
    let imgLife = document.getElementById("life");
    var lifePositionX = 0;
    for (let i = 1; i <= snake.life; i++) {
        ctx.drawImage(imgLife, lifePositionX * CELL_SIZE, 0 * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        lifePositionX = lifePositionX + 1;
    }  
}

//function isPrime use for prime number
function isPrime(number) {
    let divider = 0;

    for (let i = 1; i <= number; i++) {
        if (number % i == 0) {
            divider++
        }
    }
    return (divider == 2) ? true : false
}

//drawLife use to display health in canvas
function drawLife(ctx, lifes) {

    let img = document.getElementById("life");
        ctx.drawImage(
            img,
            lifes.position.x * CELL_SIZE,
            lifes.position.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );
}

//function initWall display on level 2
function initWall2() {
    for (let i = 0; i < wall2.length; i++){
        for (let j = wall2[i].x1; j <= wall2[i].x2; j++) {
            wallX.push(j);
            wallY.push(wall2[i].y);
        }
    }
}

//function initWall display on level 3
function initWall3() {
    for (let i = 0; i < wall3.length; i++){
        for (let j = wall3[i].x1; j <= wall3[i].x2; j++) {
            wallX.push(j);
            wallY.push(wall3[i].y);
        }
    }
}

//function initWall display on level 4
function initWall4() {
    for (let i = 0; i < wall4.length; i++){
        for (let j = wall4[i].x1; j <= wall4[i].x2; j++) {
            wallX.push(j);
            wallY.push(wall4[i].y);
        }
    }
}

//function initWall display on level 5
function initWall5() {
    for (let i = 0; i < wall5.length; i++){
        for (let j = wall5[i].y1; j <= wall5[i].y2; j++) {
            wallY.push(j);
            wallX.push(wall5[i].x);
        }
    }
}

//draw the Wall
function createWall() {
    let wallCanvas = document.getElementById("snakeBoard");
    let ctx = wallCanvas.getContext("2d");
    imgTrap = new Image();
    var i = 0;
    while(i < wallX.length){
        imgTrap.src = 'assets/bush2.png';
        ctx.drawImage(imgTrap, wallX[i] * CELL_SIZE, wallY[i] * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        i++;
    }
}

//drawSnake use to display snake on canvas
function drawSnake(ctx, snake) {
    ctx.fillStyles = snake.color;
    
    // draw head
    if(snake.direction === DIRECTION.UP){
        let img = document.getElementById("head");
        ctx.drawImage(img, snake.head.x * CELL_SIZE, snake.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    } else if(snake.direction === DIRECTION.DOWN){
        let img1 = document.getElementById("headdown");
        ctx.drawImage(img1, snake.head.x * CELL_SIZE, snake.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    } else if(snake.direction === DIRECTION.LEFT){
        let img2 = document.getElementById("headleft");
        ctx.drawImage(img2, snake.head.x * CELL_SIZE, snake.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    } else if(snake.direction === DIRECTION.RIGHT){
        let img3 = document.getElementById("headright");
        ctx.drawImage(img3, snake.head.x * CELL_SIZE, snake.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    // draw body
    for (let i = 1; i < snake.body.length; i++) {
        drawCell(ctx, snake.body[i].x, snake.body[i].y, snake.color);
    }
}

//function draw use to exec all draw
function draw() {
    setInterval(function () {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        //for clear rect
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        //drawSnake
        drawSnake(ctx, snake1)

        //drawLife Corner
        drawLifeCorner(ctx, snake1);

        //drawApple 1
        let img = document.getElementById("apple");
        ctx.drawImage(
            img,
            apple.position.x * CELL_SIZE,
            apple.position.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );
        //drawApple 2
        ctx.drawImage(
            img,
            apple1.position.x * CELL_SIZE,
            apple1.position.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );

        //draw health on prime number
          if (isPrime(snake1.score)) {
              drawLife(ctx, lifes);
          }

        //call funtion createWall
        createWall();


        //display current level
        document.getElementById("level").innerHTML = "Current Level: " + snake1.level;

        //display score
        document.getElementById("score").innerHTML = "Score";
        drawScore(snake1);

        //display speed
        document.getElementById("speed").innerHTML = "Speed " + MOVE_INTERVAL + " ms";

    }, REDRAW_INTERVAL);
}

//function use to snake can teleport 
function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

//function for snake can eat apple and health
function eat(snake, apple, apple1) {
    //eat apple 1
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
        apple.position = initPosition();
        snake.score++;
        snake.scoreReset++;
        var msk = document.getElementById("eatApple");
        msk.play();
        snake.body.push({ x: snake.head.x, y: snake.head.y });
    }
    //eat apple 2
    if (snake.head.x == apple1.position.x && snake.head.y == apple1.position.y) {
        apple1.position = initPosition();
        snake.score++;
        snake.scoreReset++;
        var msk = document.getElementById("eatApple");
        msk.play();
        snake.body.push({ x: snake.head.x, y: snake.head.y });
    }
    //eat health and push to array
    if (snake.head.x == lifes.position.x && snake.head.y == lifes.position.y && isPrime(snake.score)) {
        lifes.position = initPosition();
        snake.life++;
        var msk = document.getElementById("getHealth");
        msk.play();
    }

    //snake level
    while (snake.scoreReset === 5) {
        if (snake.level <= 4) {
            if (snake.level == 0) {
                initWall2();
            } else if (snake.level == 1) {
                initWall3();
            } else if (snake.level == 2) {
                initWall4();
            } else if (snake.level == 3) {
                wallX = [];
                wallY = [];
                initWall5();
            }
            snake.level++;
            MOVE_INTERVAL -= 20;
            document.getElementById("levelUp").innerHTML = "LEVEL UP";
            var msk = document.getElementById("lvlUp");
            msk.play();
            setTimeout(function (){
                document.getElementById("levelUp").innerHTML = "";
            }, 3000)
        }
        snake.scoreReset = 0;
    }
}

//function for snake move left
function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple, apple1, lifes);
}

//function for snake move right
function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple, apple1, lifes);
}

//function for snake move down
function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple, apple1, lifes);
}

//function for snake move up
function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple, apple1, lifes);
}

//function for check collision snake
function checkCollision(snakes) {
    let isCollide = false;
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    snake1.life--;
                    if(snake1.life == 0){
                        isCollide = true;
                    }
                }
            }
        }
    }

    //check collision wall and snake
    for (let i = 0; i < wallX.length; i++) {
        if (snake1.head.x === wallX[i] && (snake1.direction == 2 || snake1.direction == 3)) {
            if (snake1.head.y === wallY[i] || snake1.head.y === wallY[i]) {
                snake1.life--;
                if(snake1.life == 0){
                    isCollide = true;
                }
            }
        }
        if (snake1.head.y === wallY[i] && (snake1.direction == 0 || snake1.direction == 1)) {
            if (snake1.head.x === wallX[i] || snake1.head.x === wallX[i]) {
                snake1.life--;
                if(snake1.life == 0){
                    isCollide = true;
                }
            }
        }
    } 

    //code for check apple and health so it doesn't appear in the obstacle
    for (let i = 0; i < wallX.length; i++) {
        if (apple.position.x === wallX[i]) {
            if (apple.position.y === wallY[i] || apple.position.y === wallY[i]) {
                apple.position = initPosition();
            }
        }
        if (apple1.position.y === wallY[i]) {
            if (apple1.position.x === wallX[i] || apple1.position.x === wallX[i]) {
                apple1.position = initPosition();
            }
        }
        if (lifes.position.y === wallY[i]) {
            if (lifes.position.x === wallX[i] || lifes.position.x === wallX[i]) {
                lifes.position = initPosition();
            }
        }
    }

    //if collide and life 0 exec code game over
    if (isCollide) {
        var audio = document.getElementById("gameOverSound");
        document.getElementById("gameOver").innerHTML = "GAME OVER";
        audio.play();
        MOVE_INTERVAL = 150;
        wallX = [];
        wallY = [];
        snake1 = initSnake("#B96E54");
        setTimeout(function (){
            document.getElementById("gameOver").innerHTML = "";
        }, 3000)
    }
    return isCollide;
}

//function for snake move
function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);

            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if (!checkCollision([snake1])) {
        setTimeout(function () {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }
}

//function moveBody use for the body following the head
function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

//function turn for oppositeDirection
function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

//event listener for playing game use arrow
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake1, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake1, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake1, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake1, DIRECTION.DOWN);
    }
})

//function playing a game
function initGame() {
    move(snake1);
}

//play game
initGame();
