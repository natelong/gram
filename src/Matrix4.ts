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
        var a = this.array;

        other.set(0,  a[0]);
        other.set(1,  a[1]);
        other.set(2,  a[2]);
        other.set(3,  a[3]);
        other.set(4,  a[4]);
        other.set(5,  a[5]);
        other.set(6,  a[6]);
        other.set(7,  a[7]);
        other.set(8,  a[8]);
        other.set(9,  a[9]);
        other.set(10, a[10]);
        other.set(11, a[11]);
        other.set(12, a[12]);
        other.set(13, a[13]);
        other.set(14, a[14]);
        other.set(15, a[15]);
    }

    public identity() : Matrix4 {
        var a = this.array;

        a[0]  = 1;
        a[1]  = 0;
        a[2]  = 0;
        a[3]  = 0;
        a[4]  = 0;
        a[5]  = 1;
        a[6]  = 0;
        a[7]  = 0;
        a[8]  = 0;
        a[9]  = 0;
        a[10] = 1;
        a[11] = 0;
        a[12] = 0;
        a[13] = 0;
        a[14] = 0;
        a[15] = 1;

        return this;
    }

    public transpose() : void {
        var a   = this.array,
            a01 = a[1],
            a02 = a[2],
            a03 = a[3],
            a12 = a[6],
            a13 = a[7],
            a23 = a[11];

        a[1]  = a[4];
        a[2]  = a[8];
        a[3]  = a[12];
        a[4]  = a01;
        a[6]  = a[9];
        a[7]  = a[13];
        a[8]  = a02;
        a[9]  = a12;
        a[11] = a[14];
        a[12] = a03;
        a[13] = a13;
        a[14] = a23;
    }

    public translate(v : Vector3) : void {
        var a = this.array,
            x = v.x,
            y = v.y,
            z = v.z,
            a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3],
            a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7],
            a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11],
            a30 = a[12],
            a31 = a[13],
            a32 = a[14],
            a33 = a[15];

        a[0] = a00 + a03 * x;
        a[1] = a01 + a03 * y;
        a[2] = a02 + a03 * z;
        a[3] = a03;

        a[4] = a10 + a13 * x;
        a[5] = a11 + a13 * y;
        a[6] = a12 + a13 * z;
        a[7] = a13;

        a[8]  = a20 + a23 * x;
        a[9]  = a21 + a23 * y;
        a[10] = a22 + a23 * z;
        a[11] = a23;

        a[12] = a30 + a33 * x;
        a[13] = a31 + a33 * y;
        a[14] = a32 + a33 * z;
        a[15] = a33;
    }

    public scale(v : Vector3) : void {
        var a = this.array,
            x = v.x,
            y = v.y,
            z = v.z;

        a[0]  = a[0]  * x;
        a[1]  = a[1]  * x;
        a[2]  = a[2]  * x;
        a[3]  = a[3]  * x;
        a[4]  = a[4]  * y;
        a[5]  = a[5]  * y;
        a[6]  = a[6]  * y;
        a[7]  = a[7]  * y;
        a[8]  = a[8]  * z;
        a[9]  = a[9]  * z;
        a[10] = a[10] * z;
        a[11] = a[11] * z;
        a[12] = a[12];
        a[13] = a[13];
        a[14] = a[14];
        a[15] = a[15];
    }

    public rotate(angle : number, axis : Vector3) : void {
        var a = this.array,
            x = axis.x,
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

        var a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3],
            a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7],
            a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11];

        var b00 = x * x * t + c,
            b01 = y * x * t + z * s,
            b02 = z * x * t - y * s,
            b10 = x * y * t - z * s,
            b11 = y * y * t + c,
            b12 = z * y * t + x * s,
            b20 = x * z * t + y * s,
            b21 = y * z * t - x * s,
            b22 = z * z * t + c;

        a[0]  = a00 * b00 + a10 * b01 + a20 * b02;
        a[1]  = a01 * b00 + a11 * b01 + a21 * b02;
        a[2]  = a02 * b00 + a12 * b01 + a22 * b02;
        a[3]  = a03 * b00 + a13 * b01 + a23 * b02;
        a[4]  = a00 * b10 + a10 * b11 + a20 * b12;
        a[5]  = a01 * b10 + a11 * b11 + a21 * b12;
        a[6]  = a02 * b10 + a12 * b11 + a22 * b12;
        a[7]  = a03 * b10 + a13 * b11 + a23 * b12;
        a[8]  = a00 * b20 + a10 * b21 + a20 * b22;
        a[9]  = a01 * b20 + a11 * b21 + a21 * b22;
        a[10] = a02 * b20 + a12 * b21 + a22 * b22;
        a[11] = a03 * b20 + a13 * b21 + a23 * b22;
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

    public multiply(other : Matrix4) : Matrix4 {
        var a   = this.array,
            b   = other.getArray(),
            a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3],
            a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7],
            a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11],
            a30 = a[12],
            a31 = a[13],
            a32 = a[14],
            a33 = a[15];

        // Cache only the current line of the second matrix
        var b0 = b[0],
            b1 = b[1],
            b2 = b[2],
            b3 = b[3];

        a[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        a[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        a[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        a[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b[4];
        b1 = b[5];
        b2 = b[6];
        b3 = b[7];
        a[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        a[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        a[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        a[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b[8];
        b1 = b[9];
        b2 = b[10];
        b3 = b[11];
        a[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        a[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        a[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        a[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b[12];
        b1 = b[13];
        b2 = b[14];
        b3 = b[15];
        a[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        a[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        a[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        a[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        return this;
    }

    public perspective(fov : number, aspect : number, near : number, far : number) : Matrix4 {
        var a = this.array,
            f = 1.0 / Math.tan(fov / 2),
            nf = 1 / (near - far);

        a[0]  = f / aspect;
        a[1]  = 0;
        a[2]  = 0;
        a[3]  = 0;
        a[4]  = 0;
        a[5]  = f;
        a[6]  = 0;
        a[7]  = 0;
        a[8]  = 0;
        a[9]  = 0;
        a[10] = (far + near) * nf;
        a[11] = -1;
        a[12] = 0;
        a[13] = 0;
        a[14] = (2 * far * near) * nf;
        a[15] = 0;

        return this;
    }

    public orthographic(left : number, right : number, bottom : number, top : number, near : number, far : number) : Matrix4 {
        var a  = this.array,
            lr = 1 / (left - right),
            bt = 1 / (bottom - top),
            nf = 1 / (near - far);

        a[0] = -2 * lr;
        a[1] = 0;
        a[2] = 0;
        a[3] = 0;
        a[4] = 0;
        a[5] = -2 * bt;
        a[6] = 0;
        a[7] = 0;
        a[8] = 0;
        a[9] = 0;
        a[10] = 2 * nf;
        a[11] = 0;
        a[12] = (left + right) * lr;
        a[13] = (top + bottom) * bt;
        a[14] = (far + near) * nf;
        a[15] = 1;

        return this;
    }

    public lookAt(eye : Vector3, center : Vector3, up : Vector3) : Matrix4 {
        var a = this.array,
            x0 : number,
            x1 : number,
            x2 : number,
            y0 : number,
            y1 : number,
            y2 : number,
            z0 : number,
            z1 : number,
            z2 : number,
            len : number,
            eyex = eye.x,
            eyey = eye.y,
            eyez = eye.z,
            upx = up.x,
            upy = up.y,
            upz = up.z,
            centerx = center.x,
            centery = center.y,
            centerz = center.z;

        if (Math.abs(eyex - centerx) < Matrix4.EPSILON &&
            Math.abs(eyey - centery) < Matrix4.EPSILON &&
            Math.abs(eyez - centerz) < Matrix4.EPSILON) {
            return new Matrix4().identity();
        }

        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;

        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        a[0] = x0;
        a[1] = y0;
        a[2] = z0;
        a[3] = 0;
        a[4] = x1;
        a[5] = y1;
        a[6] = z1;
        a[7] = 0;
        a[8] = x2;
        a[9] = y2;
        a[10] = z2;
        a[11] = 0;
        a[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        a[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        a[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        a[15] = 1;

        return this;
    }

    public bias() : Matrix4 {
        this.array[0] = 0.5;
        this.array[0] = 0.0;
        this.array[0] = 0.0;
        this.array[0] = 0.0;
        this.array[0] = 0.0;
        this.array[0] = 0.5;
        this.array[0] = 0.0;
        this.array[0] = 0.0;
        this.array[0] = 0.0;
        this.array[0] = 0.0;
        this.array[0] = 0.5;
        this.array[0] = 0.0;
        this.array[0] = 0.5;
        this.array[0] = 0.5;
        this.array[0] = 0.5;
        this.array[0] = 1.0;

        return this;
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
