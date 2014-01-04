///<reference path="WebGL.d.ts" />
import Line       = require("./Line");
import Graphics   = require("./Graphics");
import Matrix4    = require("./Matrix4");
import IRenderableComponent = require("./IRenderableComponent");

export = LineManager;

class LineManager implements IRenderableComponent {
    public type   = "LineManager";
    public active = true;

    public lines    : Line[];
    public graphics : Graphics;
    public width    = 1;

    private lineBuffer    : WebGLBuffer;
    private drawType      : number;
    private bufferedCount = 0;
    private vertCount     = 0;
    private transform     = new Matrix4().identity();

    private stride         = 40;
    private positionOffset = 0;
    private colorOffset    = 12;
    private normalOffset   = 28;

    constructor(graphics : Graphics, type? : number) {
        this.lines    = <Line[]>[];
        this.graphics = graphics;
        this.drawType = type || graphics.gl.LINES;

        this.lineBuffer = graphics.gl.createBuffer();
    }

    public add(line : Line) : void {
        this.lines.push(line);
    }

    public remove(index : number) : void {
        this.lines.splice(index, 1);
    }

    public update(delta : number) : void {
        var gl       = this.graphics.gl,
            self     = this,
            vertices : number[];

        if(this.bufferedCount !== this.lines.length) {
            this.vertCount = 0;
            vertices = <number[]>[];
            this.bufferedCount = this.lines.length;
            this.lines.forEach(function(l : Line) {
                l.points.forEach(function(point) {
                    self.vertCount++;
                    vertices.push(point.x, point.y, point.z, l.color.r, l.color.g, l.color.b, l.color.a, 0, 0, 0);
                });
            });

            gl.deleteBuffer(this.lineBuffer);
            this.lineBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        }
    }

    public draw() : void {
        var gl = this.graphics.gl,
            p  = this.graphics.currentProgram;

        p.setAttribute("aVertexPosition", this.lineBuffer, 3, this.stride, this.positionOffset);
        p.setAttribute("aVertexNormal", this.lineBuffer, 3, this.stride, this.normalOffset);
        p.setAttribute("aVertexColor", this.lineBuffer, 4, this.stride, this.colorOffset);

        gl.lineWidth(this.width);
        this.graphics.drawArrays(
            this.vertCount,
            this.transform,
            this.drawType
        );
    }
}