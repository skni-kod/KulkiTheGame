//Balls ༼ つ ◕_◕ ༽つ
import {areaBottom, areaLeft, areaRight, areaTop, balls, bricks, canvas, context, brickX, brickY} from "./index.js";
import { updateHps } from "./bricks.js";

export let ballsList = {
    b1: {
        r: 20,
        color: "yellow",
        brickFunction: "basic",
        wallFunction: "bounce",
        speed: 2,
    },
    b2: {
        r: 20,
        color: "green",
        brickFunction: "explode",
        wallFunction: "bounce",
        speed: 3,
    },
    b3: {
        r: 10,
        color: "blue",
        brickFunction: "basic",
        wallFunction: "sniper",
        speed: 3,
    },
    b4: {
        r: 10,
        color: "purple",
        brickFunction: "basic",
        wallFunction: "split",
        speed: 20,
    },
}


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


    this.update = () =>{
        this.handleCollisions();

        // drawing
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
        context.fill();
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

        //console.log("start ", this.dX, this.dY, this.mX, this.mY);
        while (remainingX != 0 || remainingY != 0) {

            let afterX = this.x + remainingX;
            let afterY = this.y + remainingY;
            // the ratio is the absolute ratio of distance to the wall to the vector in given axis, 0 means no collision
            let ratioY : number = 0;
            let ratioX : number = 0;

            let didCollide = false;

            {
                // calculating brick collisions, attempt No 2
                // a lot of these calculations will be moved to the beginning and saved in the object to improve speed

                // first define a distance to travel between bound checks
                // too small will lead to decreased performance, too high may result in clipping
                // it will need to be optimized via experiments
                const travelDistance : number = 1;

                // calculate the travel in x and y to know how much to move without much calculation
                // this should be faster too, oh wait, this is javascript
                const travelX : number = this.dX / this.speed * travelDistance;
                const travelY : number = this.dY / this.speed * travelDistance;

                // creating a brick offset array, will hold data about which bricks to check collision with
                let brickTable = [[], [], []];
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

                    // checking which bricks exist
                    let isX = false;
                    if (coordX > 0 && coordX < 15 && bricks[getIndex(coordX + brickTable[0][0], coordY)].hp > 0) {
                        isX = true;
                    }
                    let isY = false;
                    if (coordY > 0 && coordY < 31 && bricks[getIndex(coordX, coordY + brickTable[1][1])].hp > 0) {
                        isY = true;
                    }
                    let isC = false;
                    if (coordX > 0 && coordX < 15 && coordY > 0 && coordY < 31 && bricks[getIndex(coordX + brickTable[2][0], coordY + brickTable[2][1])].hp > 0) {
                        isC = true;
                    }

                    // check which things are crossed
                    let crossX = false;
                    if (coordX > 0 && coordX < 15 && Math.abs(lineX + brickTable[0][2] - currentX) <= this.radius) {
                        crossX = true;
                    }
                    let crossY = false;
                    if (coordY > 0 && coordY < 31 && Math.abs(lineY + brickTable[1][3] - currentY) <= this.radius) {
                        crossY = true;
                    }
                    let crossC = false;
                    if (coordX > 0 && coordX < 15 && coordY > 0 && coordY < 31 &&
                        Math.sqrt(Math.pow(lineX + brickTable[2][2] - currentX, 2) +
                        Math.pow(lineY + brickTable[2][3] - currentY, 2)) < this.radius) {
                        crossC = true;
                    }

                    // TODO: ADD DELTA CALCULATIONS

                    // now just check what to do
                    if (isX && isY) {
                        // both are present so corner cannot be hit
                        if (crossX) {
                            // collided in x, did it in y?
                            if (crossY) {
                                // yes, check distance to see which is closer

                                // TODO: fix this
                                this.reverseX();
                                this.reverseY();
                                didCollide = true;
                                break;
                            }
                            else {
                                // just X, reverse it
                                // TODO: fix this
                                this.reverseX();
                                didCollide = true;
                                break;
                            }
                        }
                        else if (crossY) {
                            // just Y, reverse it
                            // TODO: fix this
                            this.reverseY();
                            didCollide = true;
                            break;
                        }
                    }
                    else if (isX) {
                        // x is present, maybe corner too
                        if (crossX || crossC) {
                            // X, reverse it
                            // TODO: fix this
                            this.reverseX();
                            didCollide = true;
                            break;
                        }

                    }
                    else if (isY) {
                        // y is present, maybe corner too
                        if (crossY || crossC) {
                            // Y, reverse it
                            // TODO: fix this
                            this.reverseY();
                            didCollide = true;
                            break;
                        }
                    }
                    else if (isC) {
                        // only corner, do a corner calc and be home free
                        if (crossC) {
                            // TODO: fix this
                            this.reverseX();
                            this.reverseY();
                            didCollide = true;
                            break;
                        }
                    }






                    //// checking collision with the bricks from the table
                    //let colY = false;
                    //let colX = false;
                    //let colCX = false;
                    //let colCY = false;
//
//
                    //// first x, check if the brick can actually be checked and if it still exists
//
                   //if (coordX > 0 && coordX < 15 && bricks[getIndex(coordX + brickTable[0][0], coordY)].hp > 0) {
                   //    // now check if it collides
                   //    //console.log("     ", Math.abs((coordX + brickTable[0][0]) * brickX - currentX), this.radius);
                   //    if (Math.abs(lineX + brickTable[0][2] - currentX) <= this.radius) {
                   //        colX = true;
                   //        console.log("Collision on X!");
                   //        this.dX *= -1;
                   //        return;
                   //    }
                   //}

                   //// next is y
                   //if (coordY > 0 && coordY < 31 && bricks[getIndex(coordX, coordY + brickTable[1][1])].hp > 0) {
                   //    if (Math.abs(lineY + brickTable[1][3] - currentY) <= this.radius) {
                   //        colY = true;
                   //        console.log("Collision on Y!");
                   //        this.dY *= -1;
                   //        return;
                   //    }
                   //}

                   //// next is corner
                   //if (coordX > 0 && coordX < 15 && coordY > 0 && coordY < 31 && bricks[getIndex(coordX + brickTable[2][0], coordY + brickTable[2][1])].hp > 0) {


                   //    // checking if it is within the corner point
                   //    if (!colX && !colY) {
                   //        if (Math.sqrt(Math.pow(lineX + brickTable[2][2] - currentX, 2) + Math.pow(lineY + brickTable[2][3] - currentY, 2)) < this.radius) {
                   //            // there's a collision on a corner!
                   //            console.log("Collision on C!");
                   //            this.dX *= -1;
                   //            this.dY *= -1;
                   //            return;
                   //        }
                   //    }

                   //if (coordX > 0 && coordX < 15 && coordY > 0 && coordY < 31 && bricks[getIndex(coordX + brickTable[2][0], coordY + brickTable[2][1])].hp > 0) {
                   //    // now check if it collides
                   //    //console.log("     ", Math.abs((coordX + brickTable[2][0]) * brickX - currentX), this.radius);
                   //    if (Math.abs(lineX + brickTable[2][2] - currentX) <= this.radius) {
                   //        console.log("Collision on X!");
                   //        this.dX *= -1;
                   //        return;
                   //    }
                   //}
                }
            }


            if (didCollide) {
                //continue;
                return;
                // TODO: change to continue after delta calc
            }

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