//Balls ༼ つ ◕_◕ ༽つ
import {areaBottom, areaLeft, areaRight, areaTop, balls, bricks, canvas, context} from "./index.js";

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
        speed: 8,
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

    // coordinates of current edges
    this.r1X = -this.dY;
    this.r1Y = this.dX;
    this.r2X = this.dY;
    this.r2Y = -this.dX;

    // linear function in form of f(x) = ax + b
    this.lA = this.dY / this.dX;
    this.lB = this.y - (this.x * this.lA);

    this.radius = Object.r;
    this.color = Object.color;
    this.brickFunction = Object.brickFunction;
    this.wallFunction = Object.wallFunction;

    this.update = () =>{
        this.handleCollisionsOld();

        // drawing
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
        context.fill();
    }

    // this.handleCollisions = function(){
    //     let remainingX : number = this.dX;
    //     let remainingY : number = this.dY;

    //     //console.log(remainingX, remainingY, this.x, this.y);
    //     while (remainingX != 0 || remainingY != 0) {

    //         let afterX = this.x + remainingX;
    //         let afterY = this.y + remainingY;
    //         // the ratio is the absolute ratio of distance to the wall to the vector in given axis, 0 means no collision
    //         let ratioY : number = 0;
    //         let ratioX : number = 0;

    //         // calculating wall collisions
    //         // get coords of blocks that are on the ball's path via linear function
    //         // maybe an array and then a check where it gets first?

    //         let candidates = []
    //         // vector based algorithm here, finding the next lines crossed by the function up until the end point

    //         let startX = this.x + this.r1X;
    //         let startY = this.y + this.r1Y;
    //         let endX = afterX + this.r1X;
    //         let endY = afterY + this.r1Y;
    //         // first loop here
    //         let x = remainingX;
    //         let y = remainingY;
    //         let brickX = bricks[0].width;
    //         let brickY = bricks[0].height;
    //         while (x != 0 && y != 0) {
    //             // finding the vector ratio to the nearest grid lines in x and y in the correct direction
    //             let ratX = 0;
    //             let ratY = 0;
    //             if (x > 0) {
    //                 ratX = (Math.ceil(this.x / brickX) * brickX - this.x) / x;
    //             }
    //             else {
    //                 ratX = (Math.floor(this.x / brickX) * brickX - this.x) / x;
    //             }
    //             if (x > 0) {
    //                 ratY = (Math.ceil(this.x / brickY) * brickY - this.x) / x;
    //             }
    //             else {
    //                 ratY = (Math.floor(this.x / brickY) * brickY - this.x) / x;
    //             }

    //             if (ratX > ratY) {
    //                 //
    //             }
    //         }

    //         startX = this.x + this.r2X;
    //         startY = this.y + this.r2Y;
    //         endX = afterX + this.r2X;
    //         endY = afterY + this.r2Y;
    //         // second loop here


    //         // no bounce check for now, just collision testing

    //         // calculating the ratio for wall collisions
    //         if (afterX > areaRight - this.radius) {
    //             ratioX = Math.abs((areaRight - this.x - this.radius) / remainingX);
    //         }
    //         else if (afterX < areaLeft + this.radius) {
    //             ratioX = Math.abs((this.x - areaLeft - this.radius) / remainingX);
    //         }
    //         if (afterY > areaBottom - this.radius) {
    //             ratioY = Math.abs((areaBottom - this.y - this.radius) / remainingY);
    //         }
    //         else if (afterY < areaTop + this.radius) {
    //             ratioY = Math.abs((this.y - areaTop - this.radius) / remainingY);
    //         }

    //         // ending the loop if there was no collision
    //         if (ratioX == 0 && ratioY == 0) {
    //             this.x = afterX;
    //             this.y = afterY;
    //             remainingX = 0;
    //             remainingY = 0;
    //             break;
    //         }

    //         // TODO: add wall and brick bounce function switches

    //         // calculating the collision
    //         if (ratioX < ratioY) {
    //             // prioritize X delta
    //             this.x += ratioX * remainingX;
    //             remainingX *= -(1 - ratioX);
    //             this.y += ratioX * remainingY;
    //             remainingY *= 1 - ratioX;

    //             if (this.x > areaRight) {
    //                 this.x = (areaRight - (this.x - areaRight));
    //                 console.log("stillx");
    //             }
    //             else if (this.x < areaLeft) {
    //                 this.x *= -1;
    //                 console.log("stillx");
    //             }

    //             // reversing the direction
    //             this.dX *= -1;
    //             this.r1X *= -1;
    //             this.r2X *= -1;
    //             this.lB += 2 * this.lA * this.x;
    //             this.lA *= -1;
    //         }
    //         else {
    //             // prioritize Y delta
    //             this.x += ratioY * remainingX;
    //             remainingX *= 1 - ratioY;
    //             this.y += ratioY * remainingY;
    //             remainingY *= -(1 - ratioY);

    //             // temp fix until further debugging is done
    //             if (this.y > areaBottom) {
    //                 this.y = (areaBottom - (this.y - areaBottom));
    //                 console.log("stilly");
    //             }
    //             else if (this.y < areaTop) {
    //                 this.y *= -1;
    //                 console.log("stilly");
    //             }

    //             // reversing the direction
    //             this.dY *= -1;
    //             this.r1Y *= -1;
    //             this.r2Y *= -1;
    //             this.lB += 2 * this.lA * this.x;
    //             this.lA *= -1;

    //         }
    //     }
    // }

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