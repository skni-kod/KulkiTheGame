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

let moveBall = function (object) {
    if(object.x + object.r/2 >= canvas.width || object.x - object.r/2 < 0) {
        object.dX *= -1;

    }
    if(object.y - object.r/2 < 0 || object.y + object.r/2 >= canvas.height ){
        object.dY *= -1;
    }
    object.x += object.dX * object.speed;
    object.y += object.dY * object.speed;
}

let drawBall = function (object) {
    context.beginPath();
    context.arc(object.x, object.y, object.r, Math.random(), Math.PI * 2);
    context.fillStyle = object.color;
    context.fill();
    moveBall(object);
}

let ball1 = Object.create(ballsList.b1);
let ball2 = Object.create(ballsList.b3);
LocalStorage.init();
LocalStorage.removeItem("b10");
console.log(LocalStorage.consoleLog());

while (true) {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    await sleep(10);
    context.clearRect(0, 0, 1600, 1000);
    context.fillStyle = "white";
    drawBall(ball1);
    drawBall(ball2);
}