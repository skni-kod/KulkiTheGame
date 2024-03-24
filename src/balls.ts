//Balls ༼ つ ◕_◕ ༽つ
import {areaBottom, areaLeft, areaRight, areaTop, balls, bricks, canvas, context, brickX, brickY} from "./index.js";
import { updateHps } from "./bricks.js";

export let ballsList = {
    b1: {
        r: 15,
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
        speed: 4,
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

    // coordinates of current edges
    this.r1X = -this.dY * (this.radius / this.speed);
    this.r1Y = this.dX * (this.radius / this.speed);
    this.r2X = this.dY * (this.radius / this.speed);
    this.r2Y = -this.dX * (this.radius / this.speed);
    this.mX = this.dX * (this.radius / this.speed);
    this.mY = this.dY * (this.radius / this.speed);

    this.update = () =>{
        this.handleCollisions();

        // drawing
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
        context.fill();
    }

    this.calculateBricks = function(x : number, y : number, remX : number, remY : number ) {
        // in order: is, x, y

        if (remX > 0 ) {
            if (x + remX >= areaRight) {
                remX = areaRight - x - 1;
            }
        }
        else {
            if (x + remX <= areaLeft) {
                remX = x - areaLeft + 1;
            }
        }

        if (remY > 0 ) {
            if (y + remY >= areaBottom) {
                remY = areaBottom - y - 1;
            }
        }
        else {
            if (y + remY <= areaTop) {
                remY = y - areaTop + 1;
            }
        }
        //console.log(x, y);
        while (remX != 0 && remY != 0) {

           // console.log("looping");
            // while there's a distance left check
            let ratX  = -1;
            let ratY  = -1;
            let offX = 0;
            let offY = 0;
            if (remX > 0) {
                // x in pos
                // get nearest line to right
                let temp = Math.ceil(x / brickX) * brickX;
                if (temp >= areaRight) {

                }
                else if (remX >= temp - x) {
                    // there's a collision, save the ratio to the line
                    ratX = (temp - x) / remX;
                    offX = 1;
                }
                // else there's no collision, leave the ratio at -1
            }
            else if (remX < 0) {
                // x in neg
                // get nearest line to left
                let temp = Math.floor(x / brickX) * brickX;
                if (temp <= areaLeft) {

                }
                else if (remX <= temp - x) {
                    // there's a collision, save the ratio to the line
                    ratX = (temp - x) / remX;
                    offX = -1;
                }
                // else there's no collision, leave the ratio at -1
            }
            //console.log("1");
            // same for Y
            if (remY > 0) {
                // y in pos
                // get nearest line to down
                let temp = Math.ceil(y / brickY) * brickY;
                if (temp >= areaBottom) {

                }
                else if (remY >= temp - y) {
                    // there's a collision, save the ratio to the line
                    ratY = (temp - y) / remY;
                    offY = 1;
                }
                // else there's no collision, leave the ratio at -1
            }
            else if (remY < 0) {
                // y in neg
                // get nearest line to up
                let temp = Math.floor(y / brickY) * brickY;
                if (temp <= areaTop) {

                }
                else if (remY <= temp - y) {
                    // there's a collision, save the ratio to the line
                    ratY = (temp - y) / remY;
                    offY = -1;
                }
                // else there's no collision, leave the ratio at -1
            }
            //console.log("2");

            // now check if there were collisions
            //console.log(x, y, ratX, ratY);
            if ((x > areaLeft + brickX || remX >= 0) && (x < areaRight - brickX || remX < 0) && ratX > 0 && (ratX < ratY || ratY == -1) && bricks[getIndex(Math.floor(x / brickX) + offX, Math.floor(y / brickY))].hp > 0) {
                //console.log("col X");
                // X must be closer
                return [1, x + ratX * remX, y + ratX * remY, getIndex(Math.floor(x / brickX) + offX, Math.floor(y / brickY))];
            }
            else if ((y > areaTop + brickY || remY >= 0) && (y < areaBottom - brickY || remY < 0) && ratY > 0 && bricks[getIndex(Math.floor(x / brickX), Math.floor(y / brickY) + offY)].hp > 0) {
                //console.log("col Y");
                // Y is nearer
                return [2, x + ratY * remX, y + ratY * remY, getIndex(Math.floor(x / brickX), Math.floor(y / brickY) + offY)];
            }
            else {
                //console.log("3", brickX, brickY);
                // no collision, move the calculation a little further
                if (Math.abs(remX) < brickX) {
                    if (Math.abs(remY) < brickY) {
                        //console.log("4");
                        // loop ends here, no collision and distance has been traveled
                        return [0];
                    }
                    else {
                        //console.log("5");
                        // y still has travel left after
                        if (remY < 0) {
                            x += (1 + (brickY / remY)) * remX;
                            y -= brickY;
                            remX *= 1 + (brickY / remY);
                            remY += brickY;
                        }
                        else {
                            x += (1 - (brickY / remY)) * remX;
                            y += brickY;
                            remX *= 1 - (brickY / remY);
                            remY -= brickY;
                        }
                    }

                }
                else if (Math.abs(remY) < brickY) {
                    //console.log("6");
                    // x still has travel left after
                    if (remX < 0) {
                        y += (1 + (brickX / remX)) * remY;
                        x -= brickX;
                        remY *= 1 + (brickX / remX);
                        remX += brickX;
                    }
                    else {
                        y += (1 - (brickX / remX)) * remY;
                        x += brickX;
                        remY *= 1 - (brickX / remX);
                        remX -= brickX;
                    }
                }
            }
        }
        return [0, 0, 0];
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

            // calculating wall collisions
            // UNOPTIMIZED, EXPERIMENTAL

            //let r = this.calculateBricks(this.x, this.y, remainingX, remainingY);
            //if (r[0] != 0) {
            //    remainingX -= r[1] - this.x;
            //    remainingY -= r[2] - this.y;
            //    this.x = r[1];
            //    this.y = r[2];
            //    if (r[0] == 1) {
            //        // reverse X
            //        this.dX *= -1;
            //        this.mX *= -1;
            //        this.r1X *= -1;
            //        this.r2X *= -1;
            //    }
            //    else {
            //        this.dY *= -1;
            //        this.mY *= -1;
            //        this.r1Y *= -1;
            //        this.r2Y *= -1;
            //    }
            //}

            //console.log("start");
            let resE1 = this.calculateBricks(this.x + this.r1X, this.y + this.r1Y, remainingX, remainingY);
            let resE2 = this.calculateBricks(this.x + this.r2X, this.y + this.r2Y, remainingX, remainingY);
            let resM = this.calculateBricks(this.x + this.mX, this.y + this.mY, remainingX, remainingY);
            //let resE2 = [0, 0, 0];
            //let resE1 = [0, 0, 0];
            //console.log("after");
            // good ol if's
            // get distance
            let which = 0;
            let min = 1000000;
            if (resE1[0] != 0) {
                min = Math.pow(resE1[1], 2) + Math.pow(resE1[2], 2);
                which = 1;
            }
            if (resE2[0] != 0) {
                let temp = Math.pow(resE2[1], 2) + Math.pow(resE2[2], 2);
                if (temp < min) {
                    min = temp;
                    which = 2;
                }
            }
            if (resM[0] != 0) {
                let temp = Math.pow(resM[1], 2) + Math.pow(resM[2], 2);
                if (temp < min) {
                    min = temp;
                    which = 3;
                }
            }
            //console.log("a1 ", this.x, this.y)

            if (which != 0) {
                // now there's only one, the one closest
                switch (which) {
                    case 1:
                        // edge 1
                        //console.log("calc: ", resE1);
                        remainingX -= (resE1[1] - this.r1X) - this.x;
                        remainingY -= (resE1[2] - this.r1Y) - this.y;
                        this.x = resE1[1] - this.r1X;
                        this.y = resE1[2] - this.r1Y;
                        if (resE1[0] == 1) {
                            // reverse X
                            this.dX *= -1;
                            this.mX *= -1;
                            this.r1X *= -1;
                            this.r2X *= -1;
                        }
                        else {
                            this.dY *= -1;
                            this.mY *= -1;
                            this.r1Y *= -1;
                            this.r2Y *= -1;
                        }
                        bricks[resE1[3]].hp--;
                        updateHps();
                        //console.log("a3 ", this.x, this.y)
                        break;
                    case 2:
                        // edge 2
                        remainingX -= (resE2[1] - this.r2X) - this.x;
                        remainingY -= (resE2[2] - this.r2Y) - this.y;
                        this.x = resE2[1] - this.r2X;
                        this.y = resE2[2] - this.r2Y;
                        if (resE2[0] == 1) {
                            // reverse X
                            this.dX *= -1;
                            this.mX *= -1;
                            this.r1X *= -1;
                            this.r2X *= -1;
                        }
                        else {
                            this.dY *= -1;
                            this.mY *= -1;
                            this.r1Y *= -1;
                            this.r2Y *= -1;
                        }
                        //console.log("a4 ", this.x, this.y)
                        bricks[resE2[3]].hp--;
                        updateHps();

                        break;
                    case 3:
                        //console.log("prea5 ", this.x, this.y)
                        // middle
                        remainingX -= (resM[1] - this.mX) - this.x;
                        remainingY -= (resM[2] - this.mY) - this.y;
                        this.x = resM[1] - this.mX;
                        this.y = resM[2] - this.mY;
                        //console.log(resM[1], resM[2], )
                        if (resM[0] == 1) {
                            // reverse X
                            this.dX *= -1;
                            this.mX *= -1;
                            this.r1X *= -1;
                            this.r2X *= -1;
                        }
                        else {
                            this.dY *= -1;
                            this.mY *= -1;
                            this.r1Y *= -1;
                            this.r2Y *= -1;
                        }
                        //console.log("a5 ", this.x, this.y)
                        bricks[resM[3]].hp--;
                        updateHps();
                        break;
                }
                //console.log("a2 ", this.x, this.y)
                continue;
            }

            //console.log("after loop");


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
                this.dX *= -1;
                this.mX *= -1;
                this.r1X *= -1;
                this.r2X *= -1;
            }
            else {
                // prioritize Y delta
                this.x += ratioY * remainingX;
                remainingX *= 1 - ratioY;
                this.y += ratioY * remainingY;
                remainingY *= -(1 - ratioY);

                // reversing the direction
                this.dY *= -1;
                this.mY *= -1;
                this.r1Y *= -1;
                this.r2Y *= -1;

            }
        }
    }
}