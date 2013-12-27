///<reference path="WebGL.d.ts" />
import Matrix4  = require("./Matrix4");
import Vector3  = require("./Vector3");
import Graphics = require("./Graphics");

export = Mesh;

class Mesh {
    private modelView    : Matrix4;

    private vertexBuffer : WebGLBuffer;
    private indexBuffer  : WebGLBuffer;
    private indexCount   : number;

    private stride         = 40;
    private positionOffset = 0;
    private colorOffset    = 12;
    private normalOffset   = 28;

    constructor(graphics : Graphics, vertices : Array<number>, indices : Array<number>) {
        var gl = graphics.gl;

        this.modelView = new Matrix4();
        this.modelView.identity();

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.indexCount = indices.length;
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    }

    public draw(graphics : Graphics, perspective : Matrix4) : void {
        graphics.setPositionBuffer(this.vertexBuffer, this.stride, this.positionOffset);
        graphics.setNormalBuffer(this.vertexBuffer, this.stride, this.normalOffset);
        graphics.setColorBuffer(this.vertexBuffer, this.stride, this.colorOffset);
        graphics.drawIndices(this.indexBuffer, this.indexCount, perspective, this.modelView, graphics.gl.TRIANGLES);
    }

    public rotate(angle : number, axis : Vector3) : void {
        this.modelView.rotate(angle, axis);
    }

    public translate(position : Vector3) : void {
        this.modelView.translate(position);
    }
}