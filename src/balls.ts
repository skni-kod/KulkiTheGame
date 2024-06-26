//Balls ༼ つ ◕_◕ ༽つ
import {areaBottom, areaLeft, areaRight, areaTop, balls, bricks, canvas, context, brickX, brickY} from "./index.js";
import { updateHps } from "./bricks.js";

let ballImages = new Array();

export let ballsList = {
    b1: {
        r: 20,
        color: "yellow",
        brickFunction: "basic",
        wallFunction: "bounce",
        speed: 2,
        imageSpirit: "../assets/1.png",
        ballIndex: 0
    },
    b2: {
        r: 20,
        color: "green",
        brickFunction: "explode",
        wallFunction: "bounce",
        speed: 3,
        imageSpirit: "../assets/2.png",
        ballIndex: 1
    },
    b3: {
        r: 10,
        color: "blue",
        brickFunction: "basic",
        wallFunction: "sniper",
        speed: 10,
        imageSpirit: "../assets/3.png" ,
        ballIndex: 2
    },
    b4: {
        r: 10,
        color: "purple",
        brickFunction: "basic",
        wallFunction: "split",
        speed: 20,
        imageSpirit: "../assets/4.png" ,
        ballIndex: 3
        
    },
}

const ball1Image = document.createElement("img");
const ball2Image = document.createElement("img");
const ball3Image = document.createElement("img");
const ball4Image = document.createElement("img");
//const ball5Image = document.createElement("img");

ball1Image.src = ballsList.b1.imageSpirit.toString();
ball2Image.src = ballsList.b2.imageSpirit.toString();
ball3Image.src = ballsList.b3.imageSpirit.toString();
ball4Image.src = ballsList.b4.imageSpirit.toString();
//ball5Image.src = ballsList.b5.imageSpirit.toString();

ballImages.push(ball1Image);
ballImages.push(ball2Image);
ballImages.push(ball3Image);
ballImages.push(ball4Image);
//ballImages.push(ball5Image);

export function createBall(Object){
    let ball = new Ball(Object);
    balls.push(ball);
}

export function updateBalls(){
    for(let i:number = 0; i < balls.length; i++){
        balls[i].update();
    }
}

function getIndex(x : number, y : number) : number {
    //console.log(x, y);
    return x + (y * 16);
}

function damageBrick(n : number, d : number) {
    if (bricks[n].hp < d) {
        bricks[n].hp = 0;
    }
    else {
        bricks[n].hp -= d;
    }
}
export function Ball(Object){

    this.x = (areaRight + areaLeft) / 2;
    this.y = (areaTop + areaBottom) / 2;

    this.speed = Object.speed;
    this.dX = ((Math.random() * 2) - 1) * this.speed;
    this.dY = (((Math.random() * 2) - 1) > 0 ? 1 : -1 ) * (Math.sqrt((this.speed * this.speed) - (Math.pow((this.dX), 2))));

    this.radius = Object.r;
    this.color = Object.color;
    this.brickFunction = Object.brickFunction;
    this.wallFunction = Object.wallFunction;
    this.image = Object.imageSpirit;
    this.ballIndex = Object.ballIndex;

    this.update = () =>{
        this.handleCollisions();
 
        // drawing  
        if (this.image != "none"){
            context.fillStyle = "rgba(255, 255, 255, 0.1)";
            context.drawImage(ballImages[this.ballIndex],this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2); 
        }
        else{
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
            context.fill();
        }
    }

    this.reverseX = function() {
        this.dX *= -1;
    }

    this.reverseY = function() {
        this.dY *= -1;
    }

    this.handleCollisions = function(){
        let remainingX : number = this.dX;
        let remainingY : number = this.dY;

        //console.log("start ", this.dX, this.dY);
        while (remainingX != 0 || remainingY != 0) {

            let afterX = this.x + remainingX;
            let afterY = this.y + remainingY;
            // the ratio is the absolute ratio of distance to the wall to the vector in given axis, 0 means no collision
            let ratioY : number = 0;
            let ratioX : number = 0;

            {
                // calculating brick collisions, attempt No 2
                // a lot of these calculations will be moved to the beginning and saved in the object to improve speed

                // first define a distance to travel between bound checks
                // too small will lead to decreased performance, too high may result in clipping
                // it will need to be optimized via experiments
                const travelDistance : number = 2;

                // calculate the travel in x and y to know how much to move without much calculation
                // this should be faster too, oh wait, this is javascript
                const travelX : number = this.dX / this.speed * travelDistance;
                const travelY : number = this.dY / this.speed * travelDistance;

                // creating a brick offset array, will hold data about which bricks to check collision with
                let brickTable = [[], [], [], []];
                // x, y, corner order, in format [coordX, coordY, lineX, lineY] offsets
                if (travelX > 0) {
                    brickTable[0] = [1, 0, brickX, 0];
                    if (travelY > 0) {
                        brickTable[1] = [0, 1, 0, brickY];
                        brickTable[2] = [1, 1, brickX, brickY];
                    }
                    else {
                        brickTable[1] = [0, -1, 0, 0];
                        brickTable[2] = [1, -1, brickX, 0];
                    }
                }
                else {
                    brickTable[0] = [-1, 0, 0, 0];
                    if (travelY > 0) {
                        brickTable[1] = [0, 1, 0, brickY];
                        brickTable[2] = [-1, 1, 0, brickY];
                    }
                    else {
                        brickTable[1] = [0, -1, 0, 0];
                        brickTable[2] = [-1, -1, 0, 0];
                    }
                }

                // now start a loop, going this distance and stopping when it's reached, probably a break will exit it
                let currentX = this.x;
                let currentY = this.y;
                while (currentX != afterX && currentY != afterY) {

                    // calculate the coords to check from
                    let coordX = Math.floor(currentX / brickX);
                    let lineX = coordX * brickX;
                    let coordY = Math.floor(currentY / brickY);
                    let lineY = coordY * brickY;

                    // move the ball to the new position
                    if (Math.abs(currentX - afterX) < Math.abs(travelX) && Math.abs(currentY - afterY) < Math.abs(travelY)) {
                        currentX = afterX;
                        currentY = afterY;
                    }
                    else {
                        currentX += travelX;
                        currentY += travelY;
                    }

                    if (currentX > areaRight - this.radius || currentX < areaLeft + this.radius ||
                        currentY > areaBottom - this.radius || currentY < areaTop + this.radius) {
                        break;
                    }

                    // checking which bricks exist
                    let isX = false;
                    if (((this.dX > 0 && coordX < 15) || (this.dX <= 0 && coordX > 0)) && bricks[getIndex(coordX + brickTable[0][0], coordY)].hp > 0) {
                        isX = true;
                    }
                    let isY = false;
                    if (((this.dY > 0 && coordY < 31) || (this.dY <= 0 && coordY > 0)) && bricks[getIndex(coordX, coordY + brickTable[1][1])].hp > 0) {
                        isY = true;
                    }
                    let isC = false;
                    if (((this.dX > 0 && coordX < 15) || (this.dX <= 0 && coordX > 0)) &&
                        ((this.dY > 0 && coordY < 31) || (this.dY <= 0 && coordY > 0)) &&
                        bricks[getIndex(coordX + brickTable[2][0], coordY + brickTable[2][1])].hp > 0) {
                        isC = true;
                    }

                    // check which things are crossed
                    let crossX = false;
                    if (((this.dX > 0 && coordX < 15) || (this.dX <= 0 && coordX > 0)) && Math.abs(lineX + brickTable[0][2] - currentX) <= this.radius) {
                        crossX = true;
                    }
                    let crossY = false;
                    if (((this.dY > 0 && coordY < 31) || (this.dY <= 0 && coordY > 0)) && Math.abs(lineY + brickTable[1][3] - currentY) <= this.radius) {
                        crossY = true;
                    }
                    let crossC = false;
                    if (((this.dX > 0 && coordX < 15) || (this.dX <= 0 && coordX > 0)) &&
                        ((this.dY > 0 && coordY < 31) || (this.dY <= 0 && coordY > 0)) &&
                        Math.sqrt(Math.pow(lineX + brickTable[2][2] - currentX, 2) +
                        Math.pow(lineY + brickTable[2][3] - currentY, 2)) < this.radius) {
                        crossC = true;
                    }

                    // now just check what to do
                    if (isX && isY && crossX && crossY) {
                        // both are present so corner cannot be hit, check which is closer
                        if (crossY && Math.abs((lineY + brickTable[1][3] - currentY) / remainingY) < Math.abs((lineX + brickTable[0][2] - currentX) / remainingX)) {
                            // y is present
                            // calculate the ratio of movement
                            let ratio = (remainingY > 0 ? (lineY + brickTable[1][3] - this.radius - this.y) : (this.y - (lineY + brickTable[1][3] + this.radius))) / remainingY;
                            // move and change remaining
                            this.x += remainingX * ratio;
                            this.y += remainingY * ratio;
                            remainingX *= (1 - ratio);
                            remainingY *= -(1 - ratio);
                            this.reverseY();
                            damageBrick(getIndex(coordX + brickTable[1][0], coordY + brickTable[1][1]), 1);
                            break;
                        }
                        else {
                            // x is present
                            // calculate the ratio of movement
                            let ratio = (remainingX > 0 ? (lineX + brickTable[0][3] - this.radius - this.x) : (this.x - (lineX + brickTable[0][3] + this.radius))) / remainingX;
                            // move and change remaining
                            this.x += remainingX * ratio;
                            this.y += remainingY * ratio;
                            remainingX *= -(1 - ratio);
                            remainingY *= (1 - ratio);
                            this.reverseX();
                            damageBrick(getIndex(coordX + brickTable[0][0], coordY + brickTable[0][1]), 1);
                            break;
                        }
                    }
                    else if (isX && (crossX || crossC)) {
                        // x is present, maybe corner too
                        // calculate the ratio of movement
                        let ratio = (remainingX > 0 ? (lineX + brickTable[0][3] - this.radius - this.x) : (this.x - (lineX + brickTable[0][3] + this.radius))) / remainingX;
                        // move and change remaining
                        this.x += remainingX * ratio;
                        this.y += remainingY * ratio;
                        remainingX *= -(1 - ratio);
                        remainingY *= (1 - ratio);
                        this.reverseX();
                        damageBrick(getIndex(coordX + brickTable[0][0], coordY + brickTable[0][1]), 1);
                        break;
                    }
                    else if (isY && (crossY || crossC)) {
                        // y is present, maybe corner too
                        // calculate the ratio of movement
                        let ratio = (remainingY > 0 ? (lineY + brickTable[1][3] - this.radius - this.y) : (this.y - (lineY + brickTable[1][3] + this.radius))) / remainingY;
                        // move and change remaining
                        this.x += remainingX * ratio;
                        this.y += remainingY * ratio;
                        remainingX *= (1 - ratio);
                        remainingY *= -(1 - ratio);
                        this.reverseY();
                        damageBrick(getIndex(coordX + brickTable[1][0], coordY + brickTable[1][1]), 1);
                        break;
                    }
                    else if (isC && crossC) {
                        // only corner, the worst possible case, requires finding a precise distance where it touches

                        // find the coords
                        let correctX = lineX + brickTable[2][2] - (this.radius * this.dX / this.speed);
                        let correctY = lineY + brickTable[2][3] - (this.radius * this.dY / this.speed);

                        // get the ratio
                        let ratio = remainingX > 0 ? Math.abs(lineX + brickTable[2][2] - correctX) / Math.abs(lineX + brickTable[2][2] - currentX) : Math.abs(lineY + brickTable[2][3] - correctY) / Math.abs(lineY + brickTable[2][3] - currentY);
                        this.x += remainingX * ratio;
                        this.y += remainingY * ratio;


                        if (Math.abs(remainingX) > Math.abs(remainingY)) {
                            remainingX *= -(1 - ratio);
                            remainingY *= (1 - ratio);
                            this.reverseX();
                        }
                        else {
                            remainingX *= (1 - ratio);
                            remainingY *= -(1 - ratio);
                            this.reverseY();
                        }
                        damageBrick(getIndex(coordX + brickTable[2][0], coordY + brickTable[2][1]), 1);
                        break;
                    }
                }
            }
            //console.log("1");
            //console.log("2 ", this.dX, this.dY);


            // no bounce check for now, just collision testing

            // calculating the ratio for wall collisions
            if (afterX > areaRight - this.radius) {
                ratioX = Math.abs((areaRight - this.x - this.radius) / remainingX);
            }
            else if (afterX < areaLeft + this.radius) {
                ratioX = Math.abs((this.x - areaLeft - this.radius) / remainingX);
            }
            if (afterY > areaBottom - this.radius) {
                ratioY = Math.abs((areaBottom - this.y - this.radius) / remainingY);
            }
            else if (afterY < areaTop + this.radius) {
                ratioY = Math.abs((this.y - areaTop - this.radius) / remainingY);
            }

            // ending the loop if there was no collision
            if (ratioX == 0 && ratioY == 0) {
                this.x = afterX;
                this.y = afterY;
                remainingX = 0;
                remainingY = 0;
                break;
            }

            // TODO: add wall and brick bounce function switches

            // calculating the collision
            if (ratioX != 0 && (ratioY == 0 || ratioX < ratioY)) {
                // prioritize X delta
                this.x += ratioX * remainingX;
                remainingX *= -(1 - ratioX);
                this.y += ratioX * remainingY;
                remainingY *= 1 - ratioX;

                // reversing the direction
                this.reverseX();
            }
            else {
                // prioritize Y delta
                this.x += ratioY * remainingX;
                remainingX *= 1 - ratioY;
                this.y += ratioY * remainingY;
                remainingY *= -(1 - ratioY);

                // reversing the direction
                this.reverseY();

            }
        }
    }
}