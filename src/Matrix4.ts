import Vector3 = require("./Vector3");

export = Matrix4;

class Matrix4 {
    public static EPSILON = 0.000001;

    private array : Float32Array;

    constructor() {
        this.array = new Float32Array(16);
        this.identity();
    }

    public getArray() : Float32Array {
        return this.array;
    }

    public get(index : number) : number {
        return this.array[index];
    }

    public set(index : number, value : number) {
        this.array[index] = value;
    }

    public clone() : Matrix4 {
        var out = new Matrix4();
        this.copyTo(out);

        return out;
    }

    public copyTo(other : Matrix4) : void {
        other.set(0,  this.array[0]);
        other.set(1,  this.array[1]);
        other.set(2,  this.array[2]);
        other.set(3,  this.array[3]);
        other.set(4,  this.array[4]);
        other.set(5,  this.array[5]);
        other.set(6,  this.array[6]);
        other.set(7,  this.array[7]);
        other.set(8,  this.array[8]);
        other.set(9,  this.array[9]);
        other.set(10, this.array[10]);
        other.set(11, this.array[11]);
        other.set(12, this.array[12]);
        other.set(13, this.array[13]);
        other.set(14, this.array[14]);
        other.set(15, this.array[15]);
    }

    public identity() : void {
        this.array[0]  = 1;
        this.array[1]  = 0;
        this.array[2]  = 0;
        this.array[3]  = 0;
        this.array[4]  = 0;
        this.array[5]  = 1;
        this.array[6]  = 0;
        this.array[7]  = 0;
        this.array[8]  = 0;
        this.array[9]  = 0;
        this.array[10] = 1;
        this.array[11] = 0;
        this.array[12] = 0;
        this.array[13] = 0;
        this.array[14] = 0;
        this.array[15] = 1;
    }

    public transpose() : void {
        var a01 = this.array[1],
            a02 = this.array[2],
            a03 = this.array[3],
            a12 = this.array[6],
            a13 = this.array[7],
            a23 = this.array[11];

        this.array[1]  = this.array[4];
        this.array[2]  = this.array[8];
        this.array[3]  = this.array[12];
        this.array[4]  = a01;
        this.array[6]  = this.array[9];
        this.array[7]  = this.array[13];
        this.array[8]  = a02;
        this.array[9]  = a12;
        this.array[11] = this.array[14];
        this.array[12] = a03;
        this.array[13] = a13;
        this.array[14] = a23;
    }

    public translate(v : Vector3) : void {
        var x = v.x,
            y = v.y,
            z = v.z,
            a00 = this.array[0],
            a01 = this.array[1],
            a02 = this.array[2],
            a03 = this.array[3],
            a10 = this.array[4],
            a11 = this.array[5],
            a12 = this.array[6],
            a13 = this.array[7],
            a20 = this.array[8],
            a21 = this.array[9],
            a22 = this.array[10],
            a23 = this.array[11],
            a30 = this.array[12],
            a31 = this.array[13],
            a32 = this.array[14],
            a33 = this.array[15];

        this.array[0] = a00 + a03 * x;
        this.array[1] = a01 + a03 * y;
        this.array[2] = a02 + a03 * z;
        this.array[3] = a03;

        this.array[4] = a10 + a13 * x;
        this.array[5] = a11 + a13 * y;
        this.array[6] = a12 + a13 * z;
        this.array[7] = a13;

        this.array[8]  = a20 + a23 * x;
        this.array[9]  = a21 + a23 * y;
        this.array[10] = a22 + a23 * z;
        this.array[11] = a23;

        this.array[12] = a30 + a33 * x;
        this.array[13] = a31 + a33 * y;
        this.array[14] = a32 + a33 * z;
        this.array[15] = a33;
    }

    public scale(v : Vector3) : void {
        var x = v.x,
            y = v.y,
            z = v.z;

        this.array[0]  = this.array[0]  * x;
        this.array[1]  = this.array[1]  * x;
        this.array[2]  = this.array[2]  * x;
        this.array[3]  = this.array[3]  * x;
        this.array[4]  = this.array[4]  * y;
        this.array[5]  = this.array[5]  * y;
        this.array[6]  = this.array[6]  * y;
        this.array[7]  = this.array[7]  * y;
        this.array[8]  = this.array[8]  * z;
        this.array[9]  = this.array[9]  * z;
        this.array[10] = this.array[10] * z;
        this.array[11] = this.array[11] * z;
        this.array[12] = this.array[12];
        this.array[13] = this.array[13];
        this.array[14] = this.array[14];
        this.array[15] = this.array[15];
    }

    public rotate(angle : number, axis : Vector3) : void {
        var x = axis.x,
            y = axis.y,
            z = axis.z,
            len = Math.sqrt(x * x + y * y + z * z),
            s = Math.sin(angle),
            c = Math.cos(angle),
            t = 1 - c;

        if(Math.abs(len) < Matrix4.EPSILON) return;

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        var a00 = this.array[0],
            a01 = this.array[1],
            a02 = this.array[2],
            a03 = this.array[3],
            a10 = this.array[4],
            a11 = this.array[5],
            a12 = this.array[6],
            a13 = this.array[7],
            a20 = this.array[8],
            a21 = this.array[9],
            a22 = this.array[10],
            a23 = this.array[11];

        var b00 = x * x * t + c,
            b01 = y * x * t + z * s,
            b02 = z * x * t - y * s,
            b10 = x * y * t - z * s,
            b11 = y * y * t + c,
            b12 = z * y * t + x * s,
            b20 = x * z * t + y * s,
            b21 = y * z * t - x * s,
            b22 = z * z * t + c;

        this.array[0]  = a00 * b00 + a10 * b01 + a20 * b02;
        this.array[1]  = a01 * b00 + a11 * b01 + a21 * b02;
        this.array[2]  = a02 * b00 + a12 * b01 + a22 * b02;
        this.array[3]  = a03 * b00 + a13 * b01 + a23 * b02;
        this.array[4]  = a00 * b10 + a10 * b11 + a20 * b12;
        this.array[5]  = a01 * b10 + a11 * b11 + a21 * b12;
        this.array[6]  = a02 * b10 + a12 * b11 + a22 * b12;
        this.array[7]  = a03 * b10 + a13 * b11 + a23 * b12;
        this.array[8]  = a00 * b20 + a10 * b21 + a20 * b22;
        this.array[9]  = a01 * b20 + a11 * b21 + a21 * b22;
        this.array[10] = a02 * b20 + a12 * b21 + a22 * b22;
        this.array[11] = a03 * b20 + a13 * b21 + a23 * b22;
    }

    public rotateX(angle : number) : void {
        this.rotate(angle, Vector3.X);
    }

    public rotateY(angle : number) : void {
        this.rotate(angle, Vector3.Y);
    }

    public rotateZ(angle : number) : void {
        this.rotate(angle, Vector3.Z);
    }

    public perspective(fov : number, aspect : number, near : number, far : number) {
        var f = 1.0 / Math.tan(fov / 2),
            nf = 1 / (near - far);

        this.array[0]  = f / aspect;
        this.array[1]  = 0;
        this.array[2]  = 0;
        this.array[3]  = 0;
        this.array[4]  = 0;
        this.array[5]  = f;
        this.array[6]  = 0;
        this.array[7]  = 0;
        this.array[8]  = 0;
        this.array[9]  = 0;
        this.array[10] = (far + near) * nf;
        this.array[11] = -1;
        this.array[12] = 0;
        this.array[13] = 0;
        this.array[14] = (2 * far * near) * nf;
        this.array[15] = 0;
    }


    public toString() : string {
        var a = this.array;
        return "Matrix4 (" + a[0]  + ", " + a[1]  + ", " + a[2]  + ", " + a[3]  + ", " +
                             a[4]  + ", " + a[5]  + ", " + a[6]  + ", " + a[7]  + ", " +
                             a[8]  + ", " + a[9]  + ", " + a[10] + ", " + a[11] + ", " +
                             a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
    }

    public static create() : Matrix4 {
        return new Matrix4();
    }
}
