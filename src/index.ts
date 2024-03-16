import { LocalStorage } from "./localStorage.js";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const context = canvas.getContext("2d");
if (context === null) {
    throw new Error('2D content not available');
}

let ballsList = {
    b1: {
        x: canvas.width/2,
        y: canvas.height/2,
        r: 15,
        color: "yellow",
        function: "basic",
        speed: 2,
        dX: Math.random(),
        dY: Math.random(),
    },
    b2: {
        x: canvas.width/2,
        y: canvas.height/2,
        r: 20,
        color: "green",
        function: "touch",
        speed: 2,
        dX: Math.random(),
        dY: Math.random(),
    },
    b3: {
        x: canvas.width/2,
        y: canvas.height/2,
        r: 10,
        color: "blue",
        function: "sniper",
        speed: 4,
        dX: Math.random(),
        dY: Math.random(),
    },
    b4: {
        x: canvas.width/2,
        y: canvas.height/2,
        r: 25,
        color: "purple",
        function: "explode",
        speed: 1,
        dX: Math.random() ,
        dY: Math.random(),
    },
}

LocalStorage.init();
let stage: number = LocalStorage.getItem("level");
let money: number  = LocalStorage.getItem("money");
let mouseX: number = 0; 
let mouseY: number = 0;
let loopInterval = setInterval(loop,10); 
let bricks = new Array();
let balls = new Array();

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

//Balls ༼ つ ◕_◕ ༽つ
function createBall(Object){
    let ball = new Ball(Object);
    balls.push(ball);
}

function updateBalls(){
    for(let i:number = 0; i < balls.length; i++){
        balls[i].update();
    }
}

function Ball(Object){
    this.x = Object.x;
    this.y = Object.y;
    this.speed = Object.speed;
    this.dX = ((Math.random() * 2) - 1);
    this.dY = ((Math.floor(Math.random() * (1 - (-1)) - 1) == 0 ? 1 : -1) == 1 ? 
    (this.dX > 0 ? 1 - this.dX : 1 + this.dX) : (this.dX > 0 ? -1 + this.dX : -1 - this.dX));
    this.radius = Object.r;
    this.color = Object.color;

    this.update = () =>{
        this.y+=this.dY;
		this.x+=this.dX;
		this.bounds();
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
		context.fill();
    }

    this.bounds = function(){
		if(this.x + this.radius/2 >= canvas.width || this.x - this.radius/2 < 0) {
            this.dX *= -1;
        }
        if(this.y - this.radius/2 < 0 || this.y + this.radius/2 >= canvas.height ){
            this.dY *= -1;
        }
        this.x += this.dX * this.speed;
        this.y += this.dY * this.speed;
	}
}