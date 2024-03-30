import { createBall, ballsList } from "./balls.js";
import { LocalStorage } from "./localStorage.js";

const levelLabel = document.getElementById("levelLabel");
const moneyLabel = document.getElementById("moneyLabel");
const buttons = document.querySelectorAll(".grid-item");
const b1Count = document.getElementById("b1Count");
const b2Count = document.getElementById("b2Count");
const b3Count = document.getElementById("b3Count");
const b4Count = document.getElementById("b4Count");
const b5Count = document.getElementById("b5Count");
const b6Count = document.getElementById("b6Count");

let moneyStringParse: string;

const currencyDisplay = {
    1: "K",
    2: "M",
    3: "B",
    4: "T",
    5: "AA",
    6: "AB",
    7: "AC",
    8: "AD",
    9: "AE",
    10: "AF",
    11: "AG",
    12: "AH",
    13: "AI",
    14: "AJ",
    15: "AK"
}

function calculateMoneyDisplay(money: number){
    function recCountTousands(val: number){
        let result = 0;
        if (val / 1000 >= 1) {
            result += 1 + recCountTousands(val / 1000);
        }
        return result;
   
    }
    return moneyStringParse = (money / Math.pow(1000,recCountTousands(money))).toFixed(1) + currencyDisplay[recCountTousands(money)];
}

function btnclick(e){

    if (e.currentTarget.attributes.key.nodeValue == "b1"){
        createBall(ballsList.b1);
        LocalStorage.addItem("b1");
        updateNavbar();
    } 
    else if (e.currentTarget.attributes.key.nodeValue == "b2"){
        createBall(ballsList.b2);
        LocalStorage.addItem("b2");
        updateNavbar();
    }   
    else if (e.currentTarget.attributes.key.nodeValue == "b3"){
        createBall(ballsList.b3);
        LocalStorage.addItem("b3");
        updateNavbar();
    } 
    else if (e.currentTarget.attributes.key.nodeValue == "b4"){
        createBall(ballsList.b4);
        LocalStorage.addItem("b4");
        updateNavbar();
    } 
}

function updateNavbar(){
    levelLabel.textContent = "Level " + LocalStorage.getItem("level");
    moneyLabel.textContent = calculateMoneyDisplay(LocalStorage.getItem("money"));
    b1Count.textContent = LocalStorage.getItem("b1");
    b2Count.textContent = LocalStorage.getItem("b2");
    b3Count.textContent = LocalStorage.getItem("b3");
    b4Count.textContent = LocalStorage.getItem("b4");
    b5Count.textContent = LocalStorage.getItem("b5");
    b6Count.textContent = LocalStorage.getItem("b6");
}

export function initNavbar(){
    LocalStorage.setItem("money", 999111110003331231213123312312312312312331231200);
    updateNavbar();
    buttons.forEach(  (el)=> {
        el.addEventListener("click", btnclick);
    });
    
}