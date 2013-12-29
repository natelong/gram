///<reference path="WebGL.d.ts" />
import Matrix4  = require("./Matrix4");
import Vector3  = require("./Vector3");
import Graphics = require("./Graphics");
import Color    = require("./Color");

export = Mesh;

class Mesh {
    public translation : Matrix4;
    public rotation    : Matrix4;
    public scaling     : Matrix4;

    private identity     : Matrix4;
    private vertexBuffer : WebGLBuffer;
    private vertexCount  : number;
    private graphics     : Graphics;

    private stride         = 40;
    private positionOffset = 0;
    private colorOffset    = 12;
    private normalOffset   = 28;

    constructor(graphics : Graphics, vertices : Array<number>, color : Color) {
        var gl = graphics.gl;

        this.graphics = graphics;

        this.translation = new Matrix4().identity();
        this.rotation    = new Matrix4().identity();
        this.scaling     = new Matrix4().identity();
        this.identity    = new Matrix4().identity();

        var newVertices = <Array<number>>[];

        for(var i = 0; i < vertices.length; i += 9) {
            var v    = vertices,
                a    = new Vector3(v[i], v[i+1], v[i+2]),
                b    = new Vector3(v[i+3], v[i+4], v[i+5]),
                c    = new Vector3(v[i+6], v[i+7], v[i+8]),
                d1   = new Vector3(b.x - a.x, b.y - a.y, b.z - a.z),
                d2   = new Vector3(c.x - a.x, c.y - a.y, c.z - a.z),
                norm = d1.cross(d2).normalize();

            newVertices = newVertices.concat(a.getArray());
            newVertices = newVertices.concat(color.getArray());
            newVertices = newVertices.concat(norm.getArray());

            newVertices = newVertices.concat(b.getArray());
            newVertices = newVertices.concat(color.getArray());
            newVertices = newVertices.concat(norm.getArray());

            newVertices = newVertices.concat(c.getArray());
            newVertices = newVertices.concat(color.getArray());
            newVertices = newVertices.concat(norm.getArray());
        }

        this.vertexCount = newVertices.length / 10;
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newVertices), gl.STATIC_DRAW);
    }

    public draw() : void {
        var graphics = this.graphics,
            p        = graphics.program;

        this.identity.identity();

        p.setAttribute("aVertexPosition", this.vertexBuffer, 3, this.stride, this.positionOffset);
        p.setAttribute("aVertexNormal", this.vertexBuffer, 3, this.stride, this.normalOffset);
        p.setAttribute("aVertexColor", this.vertexBuffer, 4, this.stride, this.colorOffset);

        graphics.drawArrays(
            this.vertexCount,
            this.identity.multiply(this.translation)
                         .multiply(this.rotation)
                         .multiply(this.scaling),
            graphics.gl.TRIANGLES
        );

//        graphics.drawShadowBuffer(
//            this.vertexCount,
//            this.identity.multiply(this.translation)
//                         .multiply(this.rotation)
//                         .multiply(this.scaling)
//        );
    }

    public rotate(angle : number, axis : Vector3) : void {
        this.rotation.rotate(angle, axis);
    }

    public translate(amount : Vector3) : void {
        this.translation.translate(amount);
    }

    public scale(amount : Vector3) : void {
        this.scaling.scale(amount);
    }

    public static fromMap(map : Array<number>) : Array<number> {
        var out  = <Array<number>>[],
            size = Math.sqrt(map.length),
            o    = size / 2;

        for(var y = 0; y < size - 1; y++) {
            for(var x = 0; x < size - 1; x++) {
                out = out.concat([
                    x-o,   y-o,   map[y * size + x],
                    x+1-o, y-o,   map[y * size + x + 1],
                    x-o,   y+1-o, map[(y+1) * size + x],
                    x+1-o, y-o,   map[y * size + x + 1],
                    x+1-o, y+1-o, map[(y+1) * size + x + 1],
                    x-o,   y+1-o, map[(y+1) * size + x]
                ]);
            }
        }

        return out;
    }
}