import { LocalStorage } from "./localStorage.js";
import { Test } from "./test.js";

const board = document.getElementById("game") as HTMLCanvasElement;
const context = board.getContext("2d");
if (context === null) {
    throw new Error('2D content not available');
}

let ballObject = {
    x: 350,
    y: 350,
    r: 15,
    color: "red"
}

let drawBall = function () {
    context.beginPath();
    context.arc(ballObject.x, ballObject.y, ballObject.r, 0, Math.PI * 2);
    context.fillStyle = ballObject.color;
    context.fill();

}

context.clearRect(0, 0, 700, 700);
drawBall();



const el = document.getElementById("game");
console.log(el);

const test = new Test();


LocalStorage.init();
LocalStorage.removeItem("b10");
console.log(LocalStorage.consoleLog());
console.log(LocalStorage.consoleLog());