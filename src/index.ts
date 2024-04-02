import { LocalStorage, initBalls } from "./localStorage.js";
import { ballsList, createBall, updateBalls } from "./balls.js";
import { createBrick, updateBricks, removeBrick, createBoard, updateHps, setHps } from "./bricks.js";
import { initNavbar } from "./navbar.js";

export const canvas = document.getElementById("game") as HTMLCanvasElement;
const navigation = document.getElementById("navigation");
export const areaLeft : number = 0;
export const areaRight : number = 1600;
export const areaTop : number = 0;
export const areaBottom : number = 1000;
export const brickX = (areaRight - areaLeft) / 16;
export const brickY = (areaBottom - areaTop) / 32;
export const context = canvas.getContext("2d");
export let money: number = LocalStorage.getItem("money");
export let stage: number = LocalStorage.getItem("level");
let mouseX: number = 0;
let mouseY: number = 0;
export let densityX: number = 16;
export let densityY: number = 32;
let loopInterval = setInterval(loop,1000/60);
export let bricks = new Array();
export let balls = new Array();
export let bricksHps = new Array();

if (context === null) {
    throw new Error('2D content not available');
}

initGame();

function initGame(){
    LocalStorage.clear(); //development only
    LocalStorage.init();
    LocalStorage.consoleLog();
    canvas.width = areaRight;
    canvas.height = areaBottom;
    navigation.style.width = "150px";
    navigation.style.height = String(canvas.height) + "px";
    createBoard(512);
    setHps();
    initBalls();
    initNavbar();
}

function clearContext() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function loop() {
    draw();
}

function draw() {
    clearContext();
    updateBricks();
    updateHps();
    updateBalls();
}
