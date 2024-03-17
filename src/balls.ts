//Balls ༼ つ ◕_◕ ༽つ
import {balls, canvas, context} from "./index.js";

export let ballsList = {
    b1: {
        r: 15,
        color: "yellow",
        function: "basic",
        speed: 2,
        dX: Math.random(),
        dY: Math.random(),
    },
    b2: {
        r: 20,
        color: "green",
        function: "touch",
        speed: 2,
        dX: Math.random(),
        dY: Math.random(),
    },
    b3: {
        r: 10,
        color: "blue",
        function: "sniper",
        speed: 4,
        dX: Math.random(),
        dY: Math.random(),
    },
    b4: {
        r: 25,
        color: "purple",
        function: "explode",
        speed: 1,
        dX: Math.random() ,
        dY: Math.random(),
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
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.speed = Object.speed;
    this.dX = ((Math.random() * 2) - 1) * this.speed;
    this.dY = (((Math.random() * 2) - 1) > 0 ? 1 : -1 ) * (Math.sqrt((this.speed * this.speed) - (Math.pow((this.dX), 2))));
    this.radius = Object.r;
    this.color = Object.color;

    this.update = () =>{
        this.y+=this.dY;
        this.x+=this.dX;
        this.bounds();
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
        context.fill();
    }

    this.bounds = function(){
        if(this.x + this.radius/2 >= canvas.width || this.x - this.radius/2 < 0) {
            this.dX *= -1;
        }
        if(this.y - this.radius/2 < 0 || this.y + this.radius/2 >= canvas.height ){
            this.dY *= -1;
        }
        this.x += this.dX;
        this.y += this.dY;
    }
}