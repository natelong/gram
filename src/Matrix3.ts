import Matrix4 = require("./Matrix4");

export = Matrix3;

class Matrix3 {
    private array : Float32Array;

    constructor() {
        this.array = new Float32Array(9);
        this.identity();
    }

    public getArray() : Float32Array {
        return this.array;
    }

    public get(index : number) : number {
        return this.array[index];
    }

    public set(index : number, value : number) : void {
        this.array[index] = value;
    }

    public clone() : Matrix3 {
        var out = new Matrix3();
        this.copyTo(out);

        return out;
    }

    public copyTo(other : Matrix3) : Matrix3 {
        var a = this.array;

        other.set(0, a[0]);
        other.set(1, a[1]);
        other.set(2, a[2]);
        other.set(3, a[3]);
        other.set(4, a[4]);
        other.set(5, a[5]);
        other.set(6, a[6]);
        other.set(7, a[7]);
        other.set(8, a[8]);

        return this;
    }

    public identity() : Matrix3 {
        var a = this.array;

        a[0] = 1;
        a[1] = 0;
        a[2] = 0;
        a[3] = 0;
        a[4] = 1;
        a[5] = 0;
        a[6] = 0;
        a[7] = 0;
        a[8] = 1;

        return this;
    }

    public invert() : Matrix3 {
        var a   = this.array,
            a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a10 = a[3],
            a11 = a[4],
            a12 = a[5],
            a20 = a[6],
            a21 = a[7],
            a22 = a[8],

            b01 = a22 * a11 - a12 * a21,
            b11 = -a22 * a10 + a12 * a20,
            b21 = a21 * a10 - a11 * a20,

            // Calculate the determinant
            det = a00 * b01 + a01 * b11 + a02 * b21;

        if (!det) return;
        det = 1.0 / det;

        a[0] = b01 * det;
        a[1] = (-a22 * a01 + a02 * a21) * det;
        a[2] = (a12 * a01 - a02 * a11) * det;
        a[3] = b11 * det;
        a[4] = (a22 * a00 - a02 * a20) * det;
        a[5] = (-a12 * a00 + a02 * a10) * det;
        a[6] = b21 * det;
        a[7] = (-a21 * a00 + a01 * a20) * det;
        a[8] = (a11 * a00 - a01 * a10) * det;

        return this;
    }

    public transpose() : Matrix3 {
        var a   = this.array,
            a01 = a[1],
            a02 = a[2],
            a12 = a[5];

        a[1] = a[3];
        a[2] = a[6];
        a[3] = a01;
        a[5] = a[7];
        a[6] = a02;
        a[7] = a12;

        return this;
    }

    public copyFromMatrix4(other : Matrix4) : Matrix3 {
        var a = this.array;

        a[0] = other.get(0);
        a[1] = other.get(1);
        a[2] = other.get(2);
        a[3] = other.get(4);
        a[4] = other.get(5);
        a[5] = other.get(6);
        a[6] = other.get(8);
        a[7] = other.get(9);
        a[8] = other.get(10);

        return this;
    }
}