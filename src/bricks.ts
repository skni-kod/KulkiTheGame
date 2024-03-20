import {areaBottom, areaLeft, areaRight, areaTop, balls, bricks, canvas, context, densityX, densityY, bricksHps} from "./index.js";

const brickColor = {
    0: "#25f522",
    1: "#34a412",
    2: "#aaaadf",
    3: "#6078fe",
    4: "#298253",
    5: "#abcdef",
    6: "#fedcbe",
    7: "#888888",
    8: "#18acac",
    9: "#99ac99"
}

//Bricks
function Brick(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.hp = (Math.random() * 3 > 2.6 ? Math.floor(Math.random() * 10) : 0);
    this.width = width;
    this.height = height;
    this.strokeStyle = "black";

    this.update = () => {
        if (this.hp > 0) {
            context.fillStyle = brickColor[this.hp % 10];
            context.fillRect(this.x,this.y,this.width,this.height);
            context.strokeStyle = this.strokeStyle;
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

function brickHp(x: number, y: number, hp: number){
    this.x = x;
    this.y = y;
    this.hp = hp;

    this.update = () => {
        if (this.hp > 0){
            context.fillStyle = "Black";
            context.font = "800 18px Arial";
            context.textAlign = "center";
            context.fillText(this.hp,this.x,this.y);
        }
    }
}

export function createBrick(){
    let offsetX: number = (areaRight - areaLeft) / densityX;
    let offsetY: number = (areaBottom - areaTop) / densityY;
    let x = 0;
    let y = 0;
    bricks.push(new Brick(bricks.length % densityX * offsetX,Math.floor(bricks.length / densityX) * offsetY,offsetX,offsetY));
}

export function setHps(){
    for (let i: number = 0; i < bricks.length; i++) {
       bricksHps.push(new brickHp(bricks[i].x + bricks[i].width / 2, bricks[i].y + bricks[i].height / 1.5 , bricks[i].hp));
    }
}

export function removeBrick(id){
    bricks[id].hp = 0;
}

export function updateBricks() {
    for (let i: number = 0; i < bricks.length; i++) {
        bricks[i].update();
    }
}

export function updateHps(){
    for (let i: number = 0; i < bricksHps.length; i++) {
        bricksHps[i].update();
    }
}