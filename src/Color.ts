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

    public getArray() : number[] {
        return [this.r, this.g, this.b, this.a];
    }

    public static Black = new Color(0, 0, 0, 1);
    public static Gray  = new Color(0.5, 0.5, 0.5, 1);
    public static White = new Color(1, 1, 1, 1);
    public static Blue  = new Color(0, 0, 1, 1);
    public static Green = new Color(0, 1, 0, 1);
    public static Red   = new Color(1, 0, 0, 1);
}