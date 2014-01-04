export = Vector3;

class Vector3 {
    public x : number;
    public y : number;
    public z : number;

    constructor(x? : number, y? : number, z? : number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    public getArray() : number[] {
        return [this.x, this.y, this.z];
    }

    public getFloat32Array() : Float32Array {
        return new Float32Array([this.x, this.y, this.z]);
    }

    public normalize() : Vector3 {
        var x = this.x,
            y = this.y,
            z = this.z,
            len = x * x + y * y + z * z;

        if(len > 0) {
            len = 1 / Math.sqrt(len);
            this.x = x * len;
            this.y = y * len;
            this.z = z * len;
        }

        return this;
    }

    public dot(other : Vector3) : number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    public cross(other : Vector3) : Vector3 {
        var out = new Vector3();

        out.x = this.y * other.z - this.z * other.y;
        out.y = this.z * other.x - this.x * other.z;
        out.z = this.x * other.y - this.y * other.x;

        return out;
    }

    public static X    = new Vector3(1, 0, 0);
    public static Y    = new Vector3(0, 1, 0);
    public static Z    = new Vector3(0, 0, 1);
    public static One  = new Vector3(1, 1, 1);
    public static Zero = new Vector3(0, 0, 0);
}