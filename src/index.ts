import { LocalStorage } from "./localStorage.js";
import {ballsList, createBall, updateBalls} from "./balls.js";

export const canvas = document.getElementById("game") as HTMLCanvasElement;
export const areaLeft : number = 0;
export const areaRight : number = canvas.width - 400;
export const areaTop : number = 0;
export const areaBottom : number = canvas.height;
export const context = canvas.getContext("2d");
if (context === null) {
    throw new Error('2D content not available');
}

LocalStorage.init();
let stage: number = LocalStorage.getItem("level");
let money: number  = LocalStorage.getItem("money");
let mouseX: number = 0; 
let mouseY: number = 0;
let loopInterval = setInterval(loop,25);
export let bricks = new Array();
export let balls = new Array();

initGame();

console.log(bricks);

function initGame(){
    createBoard(512);
    //createBall(ballsList.b1);
    //createBall(ballsList.b2);
    //createBall(ballsList.b3);
    createBall(ballsList.b4);
}

function createBoard(numberOfBricks: number){
    for (let i: number = 0; i < numberOfBricks; i++){
        createBrick();
    }
}

function clearContext(){
    context.clearRect(0,0,canvas.width,canvas.height);
}

function loop(){
    draw();
    ballHit();
}

function draw(){
    clearContext();
    updateBricks();
    updateBalls();
}

//Bricks
function Brick(x:number, y:number, width:number, height:number){
    this.x = x;
    this.y = y;
    this.hp = (Math.random() * 3 > 2.6 ? Math.floor(Math.random() * 10) : 0);
    this.width = width;
    this.height = height;
    this.strokeStyle = "black";

    this.update = () => {
        if (this.hp > 0) {
            switch (this.hp % 8) {
                case 0:
                    context.fillStyle = "#25f522";
                    break;
                case 1:
                    context.fillStyle = "#34a412";
                    break;
                case 2:
                    context.fillStyle = "#aaaadf";
                    break;
                case 3:
                    context.fillStyle = "#6078fe";
                    break;
                case 4:
                    context.fillStyle = "#298253";
                    break;
                case 5:
                    context.fillStyle = "#abcdef";
                    break;
                case 6:
                    context.fillStyle = "#fedcbe";
                    break;
                case 7:
                    context.fillStyle = "#888888";
                    break;
            }
            context.fillRect(this.x,this.y,this.width,this.height);
            context.strokeStyle = this.strokeStyle;
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

function createBrick(){
    let offsetX: number = (areaRight - areaLeft) / 16;
    let offsetY: number = (areaBottom - areaTop) / 32;
    let x = 0;
    let y = 0;
    bricks.push(new Brick(bricks.length % 16 * offsetX,Math.floor(bricks.length / 16) * offsetY,offsetX,offsetY));
}

function removeBrick(id){
    bricks[id].hp = 0;
}

function updateBricks(){
    for(let i:number = 0; i < bricks.length; i++){
        bricks[i].update();
    }
}

function ballHit(){
    // fu
    //for(let i: number = 0; i < bricks.length; i++){
    //    for (let j: number = 0; j < balls.length; j++){
    //        if(
    //            (balls[j].x > bricks[i].x) &&
    //            (balls[j].x < bricks[i].x + bricks[i].width) &&
    //            (balls[j].y + balls[j].radius > bricks[i].y) &&
    //            (balls[j].y - balls[j].radius < bricks[i].y + bricks[i].height)){
    //            removeBrick(i);
    //        }
    //    }
    //}
}