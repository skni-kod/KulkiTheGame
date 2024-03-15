export class LocalStorage {
    static init() {
        if (!localStorage.getItem("settings")) {
            localStorage.setItem("settings", JSON.stringify({
                level: 1,
                money: 100,
                b1: 0,
                b2: 0,
                b3: 0,
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
