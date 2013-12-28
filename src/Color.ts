export = Color;

class Color {
    public r : number;
    public g : number;
    public b : number;
    public a : number;

    constructor(r : number, g : number, b : number, a : number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public getArray() : Array<number> {
        return [this.r, this.g, this.b, this.a];
    }

    public static White = new Color(1, 1, 1, 1);
    public static Blue  = new Color(0, 0, 1, 1);
}