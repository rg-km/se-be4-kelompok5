const CELL_SIZE = 20; // resize object
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
const MOVE_INTERVAL = 150;
var SPEED = MOVE_INTERVAL;

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
        scoreReset: 0,
        life: 3,
        level: 0,
    }
}

//display object in vancas
let snake1 = initSnake("green");

let apple1 = {
    color: "red",
    position: initPosition(),
}
let apple2 = {
    color: "green",
    position: initPosition(),
}
let life = {
    position: initPosition(),
}
let wall1 = {
    position: initPosition(),
}
let wall2 = {
    position: initPosition(),
}

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

/*  SCORE - START (DISPLAY)*/
function drawScore(snake) {
    let scoreCanvas;
    if (snake.color == snake1.color) {
        scoreCanvas = document.getElementById("score1Board");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
}
/*  SCORE - END (DISPLAY)*/

/*  SNAKE - START (DISPLAY)*/
function drawSnake(ctx, snake){
    ctx.fillStyle = snake.color;

    //draw head
    if(snake.direction === DIRECTION.UP){
        let img = document.getElementById("head");
        ctx.drawImage(img, snake.head.x * CELL_SIZE, snake.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    } else if(snake.direction === DIRECTION.DOWN){
        let img = document.getElementById("headDown");
        ctx.drawImage(img, snake.head.x * CELL_SIZE, snake.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    } else if(snake.direction === DIRECTION.LEFT){
        let img = document.getElementById("headLeft");
        ctx.drawImage(img, snake.head.x * CELL_SIZE, snake.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    } else if(snake.direction === DIRECTION.RIGHT){
        let img = document.getElementById("headRight");
        ctx.drawImage(img, snake.head.x * CELL_SIZE, snake.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    // draw body
    for (let i = 1; i < snake.body.length; i++) {
        let img = document.getElementById("body");
        ctx.drawImage(img, snake.body[i].x * CELL_SIZE, snake.body[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        // drawCell(ctx, snake.body[i].x, snake.body[i].y, snake.color);
    }
}
/* SNAKE - END */

/* HEALTH - START (DISPLAY)*/
function drawLife(ctx, snake) {
    // show level life
    var startPosition = 0;
    let img = document.getElementById("life");
    for (let i = 1; i <= snake.life; i++){
        ctx.drawImage(img, startPosition * CELL_SIZE, 0 * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        startPosition += 1;
    }
}

function drawLifeBonus(ctx, life) {
    let img = document.getElementById("life_blue");
    ctx.drawImage(img, life.position.x * CELL_SIZE, life.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}
/* HEALTH - END */

/* WALL - START (DISPLAY)*/
function drawWall(wall1, wall2, choice) {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");
    let img = document.getElementById("wall_red");
    let img2 = document.getElementById("wall_yel");

    if (choice == 1) {
        for (let i = 0; i<= 6; i++){
            ctx.drawImage(img, wall1.position.x * CELL_SIZE, i * CELL_SIZE + 30, CELL_SIZE, CELL_SIZE);
        }
    }
    if (choice == 2) {
        for (let i = 0; i<= 6; i++){
            ctx.drawImage(img, wall1.position.x * CELL_SIZE, i * CELL_SIZE + 30, CELL_SIZE, CELL_SIZE);
            ctx.drawImage(img2, i * CELL_SIZE + 10, wall2.position.y * CELL_SIZE + 30, CELL_SIZE, CELL_SIZE);
        }
    }
    if (choice == 3) {
        for (let i = 0; i<= 6; i++){
            ctx.drawImage(img, wall1.position.x * CELL_SIZE, i * CELL_SIZE + 30, CELL_SIZE, CELL_SIZE);
            ctx.drawImage(img, i * CELL_SIZE + 10, wall1.position.y * CELL_SIZE + 30, CELL_SIZE, CELL_SIZE);
            ctx.drawImage(img2, wall2.position.x * CELL_SIZE, i * CELL_SIZE + 250, CELL_SIZE, CELL_SIZE);
        }  
    }
    if (choice == 4) {
        for (let i = 0; i<= 6; i++){
            ctx.drawImage(img, wall1.position.x * CELL_SIZE, i * CELL_SIZE + 30, CELL_SIZE, CELL_SIZE);
            ctx.drawImage(img, i * CELL_SIZE + 10, wall1.position.y * CELL_SIZE + 30, CELL_SIZE, CELL_SIZE);
            ctx.drawImage(img2, wall2.position.x * CELL_SIZE, i * CELL_SIZE + 250, CELL_SIZE, CELL_SIZE);
            ctx.drawImage(img2, i * CELL_SIZE + 200, wall2.position.y * CELL_SIZE + 30, CELL_SIZE, CELL_SIZE);
        } 
    }
}
/* WALL - END */

function soundEffect(choice){
    var audio;
    switch(choice) {
        case 1: audio = document.getElementById("getApple"); break;
        case 2: audio = document.getElementById("getHealth"); break;
        case 3: audio = document.getElementById("reachLevel"); break;
        case 4: audio = document.getElementById("gameOver"); break;
    }
    
    audio.play();
}

//function isPrime use for prime number
function isPrime(number) {
    let divider = 0;

    for (let i = 1; i <= number; i++) {
        if (number % i == 0) {
            divider++;
        }
    }
    return (divider == 2) ? true : false
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        //draw snake
        drawSnake(ctx, snake1);
        
        //draw apple
        let imgApple = document.getElementById("apple");
        ctx.drawImage(imgApple, apple1.position.x * CELL_SIZE, apple1.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.drawImage(imgApple, apple2.position.x * CELL_SIZE, apple2.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        //draw life
        drawLife(ctx, snake1);
        //draw life bonus
        if (isPrime(snake1.score)) {
            drawLifeBonus(ctx, life);
        }

        //draw level
        document.getElementById("level").innerHTML = "Level Snake: " + snake1.level;
        var sounds = document.getElementById("")
        document.getElementById("speed").innerHTML = "Speed : " + SPEED + " ms";

        drawScore(snake1);
        
    }, REDRAW_INTERVAL);
}


function eat(snake, apple1, apple2, life) {
    //eat apple1
    if (snake.head.x == apple1.position.x && snake.head.y == apple1.position.y) {
        apple1.position = initPosition();
        snake.score++;
        snake.scoreReset++;
        snake.body.push({x: snake.head.x, y: snake.head.y}); //increment snake body when eat apple
        soundEffect(1);
    } 
    //eat apple2
    if (snake.head.x == apple2.position.x && snake.head.y == apple2.position.y) {
        apple2.position = initPosition();
        snake.score++;
        snake.scoreReset++;
        snake.body.push({x: snake.head.x, y: snake.head.y});
        soundEffect(1);
    }
    //eat health
    if (snake.head.x == life.position.x && snake.head.y == life.position.y) {
        life.position = initPosition();
        snake.life++;
        soundEffect(2);
    }
    level(snake);
}

function level(snake) {
   
    // snake.level = 1;
    while (snake.scoreReset == 5) {
        if (snake.level <= 4) {
            if (snake.level == 0) {
                drawWall(wall1, wall2, 1);
            } else if (snake.level == 1) {
                drawWall(wall1, wall2, 2);
            } else if (snake.level == 2) {
                drawWall(wall1, wall2, 3);
            } else if (snake.level == 3) {
                drawWall(wall1, wall2, 4);
            }
            snake.level++;
            SPEED -= 20;
            document.getElementById("levelUp").innerHTML = "LEVEL UP";
            soundEffect(3);
            setTimeout(function (){
               document.getElementById("levelUp").innerHTML = "";
            },   3000)
       }
       snake.scoreReset = 0;
   } 
}

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

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple1, apple2, life);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple1, apple2, life);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple1, apple2, life);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple1, apple2, life);
}

function checkCollision(snakes) {
    let isCollide = false;
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    snake1.life--;
                    if (snake1.life == 0) {
                        isCollide = true;
                    }
                }
            }
        }
    }
    if (isCollide) {
        document.getElementById("over").innerHTML = "GAME OVER";
        soundEffect(4);
        SPEED = 150;
        setTimeout(function (){
            document.getElementById("over").innerHTML = "";
        }, 3000)
    }
    return isCollide;
}

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
        setTimeout(function() {
            move(snake);
        }, SPEED);
    } else {
        console.log("collide", snake.color);
        if (snake == snake1) {
            snake1 = initSnake("purple");
            setTimeout(function() {
                move(snake1);
            }, SPEED);
        }
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

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

function initGame() {
    move(snake1);
}

initGame();