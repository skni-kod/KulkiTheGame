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
let bricks = new Array();
export let balls = new Array();

initGame();

console.log(bricks);

function initGame(){
    drawBoard(34);
    createBall(ballsList.b1);
    createBall(ballsList.b2);
    createBall(ballsList.b3);
    createBall(ballsList.b4);
}

function drawBoard(numberOfBricks: number){
    for (let i: number = 0; i < numberOfBricks; i++){
        drawBrick();
    }
}

function clearContext(){
    context.clearRect(0,0,canvas.width,canvas.height);
}

function loop(){
    draw();
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
    this.width = width;
    this.height = height;
    this.color = "#25f522";
    this.strokeStyle = "black";

    this.update = () => {
        context.fillStyle = this.color;
        context.fillRect(this.x,this.y,this.width,this.height);
        context.strokeStyle = this.strokeStyle;
        context.strokeRect(this.x, this.y, this.width, this.height);
    }
}

function drawBrick(){
    let offsetX: number = canvas.width / 16;
    let offsetY: number = canvas.height / 32;
    let x = 0;
    let y = 0;

    if (bricks.length!=0){
        x = bricks[bricks.length - 1].x;
        y = bricks[bricks.length - 1].y;

        if (bricks[bricks.length - 1].x > canvas.width - offsetX){
            y += offsetY;
            x = 0;
        }else{
            x += offsetX;
        }
    }
    createBrick(x,y,offsetX,offsetY);
}

function createBrick(x: number, y:number, width: number, height: number){
    let brick = new Brick(x,y,width,height);
    bricks.push(brick);
}

function updateBricks(){
    for(let i:number = 0; i < bricks.length; i++){
        bricks[i].update();
    }
}

