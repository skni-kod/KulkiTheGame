import { ballsList, createBall } from "./balls.js";

export class LocalStorage {
    static init() {
        if (!localStorage.getItem("settings")) {
            localStorage.setItem("settings", JSON.stringify({
                level: 1,
                money: 100,
                b1: 0,
                b2: 0,
                b3: 1,
                b4: 0,
                b5: 0,
            }));
        }
    }

    static setItem(key: string, value: any) {
        let temp = JSON.parse(localStorage.getItem("settings") || "{}");
        if (temp){
            temp[key] = value;
            localStorage.setItem("settings", JSON.stringify(temp));
        }
    }

    static addItem(key: string){
        let temp = JSON.parse(localStorage.getItem("settings") || "{}");
        if (temp){
            temp[key] = temp[key] + 1;
            localStorage.setItem("settings", JSON.stringify(temp));
        }
    }

    static getItem(key: string) {
        const item = localStorage.getItem("settings");
        return item ? JSON.parse(item)[key] : null;
    }

    static clear() {
        localStorage.clear();
    }

    static removeItem(key: string) {
        let temp = JSON.parse(localStorage.getItem("settings") || "{}");
        if (temp){
            delete temp[key];
            localStorage.setItem("settings", JSON.stringify(temp));
        }
    }
    
    static consoleLog() {
        console.log(JSON.parse(localStorage.getItem("settings") || "{}"));
    }
}

export function initBalls(){
    function addBall(amount: number, type: number){
        for (let i = 0; i < amount; i++){
            switch (type) {
                case 1:
                    createBall(ballsList.b1);
                    break;
                case 2:
                    createBall(ballsList.b2);
                    break;
                case 3:
                    createBall(ballsList.b3);
                    break;
                case 4:
                    createBall(ballsList.b4);
                    break;
            
                default:
                    break;
            }
        }
    }
    if(LocalStorage.getItem("b1")){
        addBall(LocalStorage.getItem("b1"),1);
    }
    if(LocalStorage.getItem("b2")){
        addBall(LocalStorage.getItem("b2"),2);
    }
    if(LocalStorage.getItem("b3")){
        addBall(LocalStorage.getItem("b3"),3);
    }
    if(LocalStorage.getItem("b4")){
        addBall(LocalStorage.getItem("b4"),4);
    }
}