//Balls ༼ つ ◕_◕ ༽つ
import {areaBottom, areaLeft, areaRight, areaTop, balls, canvas, context} from "./index.js";

export let ballsList = {
    b1: {
        r: 15,
        color: "yellow",
        brickFunction: "basic",
        wallFunction: "bounce",
        speed: 200,
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
        r: 25,
        color: "purple",
        brickFunction: "basic",
        wallFunction: "split",
        speed: 4,
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

    this.handleCollisions = function(){
        let remainingX : number = this.dX;
        let remainingY : number = this.dY;

        //console.log(remainingX, remainingY, this.x, this.y);
        while (remainingX != 0 || remainingY != 0) {

            let afterX = this.x + remainingX;
            let afterY = this.y + remainingY;
            // the ratio is the absolute ratio of distance to the wall to the vector in given axis, 0 means no collision
            let ratioY : number = 0;
            let ratioX : number = 0;



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
            if (ratioX > ratioY) {
                // prioritize X direction
                this.x += ratioX * remainingX;
                remainingX *= -(1 - ratioX);
                this.y += ratioX * remainingY;
                remainingY *= 1 - ratioX;

                if (this.x > areaRight) {
                    this.x = (areaRight - (this.x - areaRight));
                }
                else if (this.x < areaLeft) {
                    this.x *= -1;
                }

                this.dX *= -1;
            }
            else {
                // prioritize Y direction
                this.x += ratioY * remainingX;
                remainingX *= 1 - ratioY;
                this.y += ratioY * remainingY;
                remainingY *= -(1 - ratioY);

                // temp fix until further debugging is done
                if (this.y > areaBottom) {
                    this.y = (areaBottom - (this.y - areaBottom));
                }
                else if (this.y < areaTop) {
                    this.y *= -1;
                }

                this.dY *= -1;
                //console.log("y\n");
            }

            //console.log(afterX, afterY, remainingX, remainingY, ratioX, ratioY);


            //remainingX = 0;
            //remainingY = 0;
        }
    }

    this.handleCollisionsOld = function(){
        this.y+=this.dY;
        this.x+=this.dX;
        // old system, will be replaced by a superior one
        if(this.x + this.radius >= areaRight || this.x - this.radius < 0) {
            this.dX *= -1;
        }
        if(this.y + this.radius >= areaBottom || this.y - this.radius < 0) {
            this.dY *= -1;
        }
    }
}