import {areaBottom, areaLeft, areaRight, areaTop, balls, bricks, canvas, context, densityX, densityY, bricksHps} from "./index.js";

//Bricks
function Brick(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.hp = (Math.random() * 3 > 2 ? Math.floor(Math.random() * 10) : 0);
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

function brickHp(x: number, y: number, hp: number, brickIndex: number){
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.brickIndex = brickIndex;

    this.update = () => {
        if (this.hp > 0){
            this.hp = bricks[brickIndex].hp;
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

export function createBoard(numberOfBricks: number){
    for (let i: number = 0; i < numberOfBricks; i++){
        createBrick();
    }
}

export function setHps(){
    for (let i: number = 0; i < bricks.length; i++) {
       bricksHps.push(new brickHp(bricks[i].x + bricks[i].width / 2, bricks[i].y + bricks[i].height / 1.5 , bricks[i].hp, i));
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