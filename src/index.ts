import { LocalStorage } from "./localStorage.js";
import { Test } from "./test.js";

const el = document.getElementById("game");
console.log(el);

const test = new Test();


LocalStorage.init();
LocalStorage.removeItem("b10");
console.log(LocalStorage.consoleLog());