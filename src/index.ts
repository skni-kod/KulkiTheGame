import { LocalStorage } from "./localStorage.js";
import { ballsList, createBall, updateBalls } from "./balls.js";

export const canvas = document.getElementById("game") as HTMLCanvasElement;
export const context = canvas.getContext("2d");
if (context === null) {
    throw new Error('2D content not available');
}

LocalStorage.init();
let stage: number = LocalStorage.getItem("level");
let money: number = LocalStorage.getItem("money");
let mouseX: number = 0;
let mouseY: number = 0;
let loopInterval = setInterval(loop, 10);
let bricks = new Array();
export let balls = new Array();

initGame();

console.log(bricks);

function initGame() {
    drawBoard(2);
    createBall(ballsList.b1);
    createBall(ballsList.b2);
    createBall(ballsList.b3);
    createBall(ballsList.b4);
}

function nextLevel(){
    stage++;
    LocalStorage.setItem("level", stage);
    drawBoard(34);
}

function drawBoard(numberOfBricks: number) {
    for (let i: number = 0; i < numberOfBricks; i++) {
        drawBrick();
    }
}

function clearContext() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function loop() {
    draw();
    ballHit();
}

function draw() {
    clearContext();
    updateBricks();
    updateBalls();
    if(bricks.length==0){
        nextLevel();
    }
}

//Bricks
function Brick(x: number, y: number, width: number, height: number, health: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.health = health;
    this.color = "#25f522";
    this.strokeStyle = "black";

    this.update = () => {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeStyle = this.strokeStyle;
        context.strokeRect(this.x, this.y, this.width, this.height);
    }
}

function drawBrick() {
    let offsetX: number = canvas.width / 16;
    let offsetY: number = canvas.height / 32;
    let x = 0;
    let y = 0;

    if (bricks.length != 0) {
        x = bricks[bricks.length - 1].x;
        y = bricks[bricks.length - 1].y;

        if (bricks[bricks.length - 1].x > canvas.width - offsetX) {
            y += offsetY;
            x = 0;
        } else {
            x += offsetX;
        }
    }
    createBrick(x, y, offsetX, offsetY, LocalStorage.getItem("level"));
}

function createBrick(x: number, y: number, width: number, height: number, health: number) {
    let brick = new Brick(x, y, width, height, health);
    bricks.push(brick);
}

function removeBrick(id) {
    bricks.splice(id, 1);
}

function updateBricks() {
    for (let i: number = 0; i < bricks.length; i++) {
        bricks[i].update();
    }
}

function ballHit() {
    for (let i: number = 0; i < bricks.length; i++) {
        for (let j: number = 0; j < balls.length; j++) {
            if (
                (balls[j].x > bricks[i].x) &&
                (balls[j].x < bricks[i].x + bricks[i].width) &&
                (balls[j].y + balls[j].radius > bricks[i].y) &&
                (balls[j].y - balls[j].radius < bricks[i].y + bricks[i].height)) {
                bricks[i].health--;
                if(bricks[i].health==0){
                    removeBrick(i);
                }
                if ((balls[j].y + balls[j].radius > bricks[i].y) &&
                    (balls[j].y - balls[j].radius < bricks[i].y + bricks[i].height)) {
                    balls[j].dY *= -1;
                }
                if ((balls[j].x > bricks[i].x) &&
                    (balls[j].x < bricks[i].x + bricks[i].width)) {
                    balls[j].dX *= -1;
                }
                
            }
        }
    }
}