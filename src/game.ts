import {LocalStorage} from "./localStorage";

export class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor() {
        this.canvas = document.getElementById("game") as HTMLCanvasElement;
        console.log(this.canvas);

        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        console.log(this.context);

        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 1;

        LocalStorage.init();
        LocalStorage.removeItem("b10");
        console.log(LocalStorage.consoleLog());

        this.context.fillStyle = "#43FF00";
        console.log("draw");

        this.context.fillRect(0, 0, 100, 100);
    }


}