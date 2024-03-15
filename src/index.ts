import { LocalStorage } from "./localStorage.js";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const context = canvas.getContext("2d");
if (context === null) {
    throw new Error('2D content not available');
}

let ballObject = {
    x: 10,
    y: 10,
    r: 15,
    color: "red"
}

let drawBall = function () {
    context.beginPath();
    context.arc(ballObject.x, ballObject.y, ballObject.r, 0, Math.PI * 2);
    context.fillStyle = ballObject.color;
    context.fill();

}

context.clearRect(0, 0, 1600, 1000);
drawBall();

LocalStorage.init();
LocalStorage.removeItem("b10");
console.log(LocalStorage.consoleLog());

while (true) {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    await sleep(50);
    ballObject.x += 1;
    context.fillStyle = "white";
    context.clearRect(0, 0, 1600, 1000);
    drawBall();
}