import { LocalStorage } from "./localStorage.js";
import { ballsList, createBall, updateBalls } from "./balls.js";
import { createBrick, updateBricks, removeBrick } from "./bricks.js";

export const canvas = document.getElementById("game") as HTMLCanvasElement;
export const areaLeft : number = 0;
export const areaRight : number = canvas.width;
export const areaTop : number = 0;
export const areaBottom : number = canvas.height;
export const context = canvas.getContext("2d");
let stage: number = LocalStorage.getItem("level");
let money: number = LocalStorage.getItem("money");
let mouseX: number = 0;
let mouseY: number = 0;
export let densityX: number = 16;
export let densityY: number = 32;
let loopInterval = setInterval(loop,25);
export let bricks = new Array();
export let balls = new Array();

LocalStorage.init();
if (context === null) {
    throw new Error('2D content not available');
}


initGame();

console.log(bricks);

function nextLevel(){
    stage++;
    LocalStorage.setItem("level", stage);
    createBoard(34);
}

function initGame(){
    createBoard(512);
    createBall(ballsList.b1);
    createBall(ballsList.b2);
    createBall(ballsList.b3);
    createBall(ballsList.b4);
}

function createBoard(numberOfBricks: number){
    for (let i: number = 0; i < numberOfBricks; i++){
        createBrick();
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
            }
        }
    }
}