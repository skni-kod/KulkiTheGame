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
        color: "yellow",
        function: "basic"
    },
    b2: {
        x: canvas.width/2,
        y: canvas.height/2,
        color: "green",
        function: "touch"
    },
    b3: {
        x: canvas.width/2,
        y: canvas.height/2,
        color: "blue",
        function: "sniper"
    },
    b4: {
        x: canvas.width/2,
        y: canvas.height/2,
        color: "purple",
        function: "explode"
    },
}


let drawBall = function (object) {
    context.beginPath();
    context.arc(object.x, object.y, 15, 0, Math.PI * 2);
    context.fillStyle = object.color;
    context.fill();
}

let ball1 = Object.create(ballsList.b2);
LocalStorage.init();
LocalStorage.removeItem("b10");
console.log(LocalStorage.consoleLog());

while (true) {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    await sleep(50);
    context.clearRect(0, 0, 1600, 1000);
    context.fillStyle = "white";
    drawBall(ball1);
}