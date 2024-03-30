import { LocalStorage } from "./localStorage.js";
import { ballsList, createBall, updateBalls } from "./balls.js";
import { createBrick, updateBricks, removeBrick, createBoard, updateHps, setHps } from "./bricks.js";

export const canvas = document.getElementById("game") as HTMLCanvasElement;
const h4 = document.querySelectorAll("h4");
const navigation = document.getElementById("navigation");
export const areaLeft : number = 0;
export const areaRight : number = 1600;
export const areaTop : number = 0;
export const areaBottom : number = 1000;
export const brickX = (areaRight - areaLeft) / 16;
export const brickY = (areaBottom - areaTop) / 32;
export const context = canvas.getContext("2d");
let stage: number = LocalStorage.getItem("level");
let money: number = LocalStorage.getItem("money");
let mouseX: number = 0;
let mouseY: number = 0;
export let densityX: number = 16;
export let densityY: number = 32;
let loopInterval = setInterval(loop,1000 / 100);
export let bricks = new Array();
export let balls = new Array();
export let bricksHps = new Array();

LocalStorage.init();
if (context === null) {
    throw new Error('2D content not available');
}

h4.forEach(  (el)=> {
    el.onclick = () =>{
        createBall(ballsList.b1);
    }
});

initGame();

function nextLevel(){
    stage++;
    LocalStorage.setItem("level", stage);
    createBoard(34);
}

function initBalls(){
    function addBall(amount: number, type: number){
        for (let i = 0; i < amount; i++){
            switch (type) {
                case 1:
                    createBall(ballsList.b1);
                    break;
                case 2:
                    createBall(ballsList.b2);
                    break;
                case 3:
                    createBall(ballsList.b3);
                    break;
                case 4:
                    createBall(ballsList.b4);
                    break;
            
                default:
                    break;
            }
        }
    }
    if(LocalStorage.getItem("b1")){
        addBall(LocalStorage.getItem("b1"),1);
    }
    if(LocalStorage.getItem("b2")){
        addBall(LocalStorage.getItem("b2"),2);
    }
    if(LocalStorage.getItem("b3")){
        addBall(LocalStorage.getItem("b3"),3);
    }
    if(LocalStorage.getItem("b4")){
        addBall(LocalStorage.getItem("b4"),4);
    }
}

function initGame(){
    canvas.width = areaRight;
    canvas.height = areaBottom;
    navigation.style.width = "150px";
    navigation.style.height = String(canvas.height) + "px";
    LocalStorage.setItem("b3",1);
    LocalStorage.consoleLog();
    createBoard(512);
    setHps();
    initBalls();
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
    updateHps();
    updateBalls();
    if(bricks.length==0){
        nextLevel();
    }
}

function ballHit() {
    // for (let i: number = 0; i < bricks.length; i++) {
    //     for (let j: number = 0; j < balls.length; j++) {
    //         if (
    //             (balls[j].x > bricks[i].x) &&
    //             (balls[j].x < bricks[i].x + bricks[i].width) &&
    //             (balls[j].y + balls[j].radius > bricks[i].y) &&
    //             (balls[j].y - balls[j].radius < bricks[i].y + bricks[i].height)) {
    //             bricks[i].health--;
    //             if(bricks[i].health==0){
    //                 removeBrick(i);
    //             }
    //         }
    //     }
    // }
}