export = InputManager;

class InputManager {
    public  wheel = 0;

    private keys      : boolean[];
    private last_keys : boolean[];
    private count     : number;

    constructor(count : number) {
        this.count     = count;
        this.keys      = <boolean[]>[];
        this.last_keys = <boolean[]>[];

        for(var i = 0; i < count; i++) {
            this.keys[i] = false;
        }

        window.addEventListener("keydown", this.keyDown.bind(this), false);
        window.addEventListener("keyup",   this.keyUp.bind(this),   false);
        window.addEventListener("wheel",   this.scroll.bind(this),  false);
    }

    public update() : void {
        for(var i = 0; i < this.count; i++) {
            this.last_keys[i] = this.keys[i];
        }

        this.wheel = 0;
    }

    public isDown(key : number) : boolean {
        return this.keys[key];
    }

    public isPressed(key : number) : boolean {
        return this.keys[key] && !this.last_keys[key];
    }

    private keyDown(e : KeyboardEvent) : void {
//        console.log("Down: " + e.keyCode);
        this.keys[e.keyCode] = true;
    }

    private keyUp(e : KeyboardEvent) : void {
        this.keys[e.keyCode] = false;
    }

    private scroll(e : MouseWheelEvent) : void {
        e.preventDefault();
        this.wheel += e.wheelDelta;
    }

    public static keys = {
        UP    : 38,
        DOWN  : 40,
        LEFT  : 37,
        RIGHT : 39,

        A : 65,
        B : 66,
        C : 67,
        D : 68,
        E : 69,
        F : 70,
        G : 71,
        H : 72,
        I : 73,
        J : 74,
        K : 75,
        L : 76,
        M : 77,
        N : 78,
        O : 79,
        P : 80,
        Q : 81,
        R : 82,
        S : 83,
        T : 84,
        U : 85,
        V : 86,
        W : 87,
        X : 88,
        Y : 89,
        Z : 90
    };
}