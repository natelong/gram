///<reference path="WebGL.d.ts" />
import Matrix3       = require("./Matrix3");
import Matrix4       = require("./Matrix4");
import Vector3       = require("./Vector3");
import Shader        = require("./Shader");
import Utils         = require("./Utils");
import ShaderProgram = require("./ShaderProgram");
import Shaders       = require("./Shaders");

export = Graphics;

class Graphics {
    public gl : WebGLRenderingContext;
    public viewportWidth  : number;
    public viewportHeight : number;
    public currentProgram : ShaderProgram;
    public defaultProgram : ShaderProgram;
    public shadowProgram  : ShaderProgram;
    public perspective    : Matrix4;
    public view           : Matrix4;

    // for shadows
    public shadowFrameBuffer : WebGLFramebuffer;
    public frameTexture      : WebGLTexture;
    public renderBuffer      : WebGLRenderbuffer;

    private matrixStack : Array<Matrix4>;

    constructor(canvas : HTMLCanvasElement) {
        var gl : WebGLRenderingContext;

        try {
            this.gl = gl = canvas.getContext("experimental-webgl");
            this.viewportWidth = canvas.width;
            this.viewportHeight = canvas.height;
        } catch(e) {}

        if (!gl) throw new Error("Couldn't initialize WebGL");

        this.initShaders();

        gl.clearColor(0, 0, 0, 1);
        gl.enable(gl.DEPTH_TEST);

        this.perspective = new Matrix4().perspective(
            Utils.degToRad(45),
            this.viewportWidth / this.viewportHeight,
            0.1,
            100
        );

        this.view = new Matrix4().lookAt(new Vector3(10, 10, 10), Vector3.Zero, Vector3.Y);

        this.initFrameBuffer();
    }

    public clear() {
        var gl = this.gl;

        gl.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    public pushMatrix(matrix : Matrix4) : void {
        this.matrixStack.push(matrix.clone());
    }

    public popMatrix() : Matrix4 {
        return this.matrixStack.pop();
    }

    private initShaders(fragment? : Shader, vertex? : Shader) : void {
        var gl = this.gl;

        if(!fragment) fragment = new Shader(gl, gl.FRAGMENT_SHADER, Shaders.defaultfrag);
        if(!vertex) vertex = new Shader(gl, gl.VERTEX_SHADER, Shaders.defaultvert);

        this.defaultProgram = new ShaderProgram(
            gl,
            fragment,
            vertex, [
                "uMMatrix",
                "uVMatrix",
                "uPMatrix",
                "uNMatrix",
                "uAmbientColor",
                "uLightDirection",
                "uLightColor",
                "uLightBias",
                "uLightProjection",
                "uLightView",
                "uDepth"
            ],[
                "aVertexPosition",
                "aVertexColor",
                "aVertexNormal"
            ]);

        this.shadowProgram = new ShaderProgram(
            gl,
            new Shader(gl, gl.FRAGMENT_SHADER, Shaders.lightfrag),
            new Shader(gl, gl.VERTEX_SHADER, Shaders.lightvert),
            [
                "uMMatrix",
                "uVMatrix",
                "uPMatrix"
            ],[
                "aVertexPosition"
            ]
        );

        this.useProgram(this.defaultProgram);
    }

    public useProgram(program : ShaderProgram) : void {
        if(this.currentProgram) this.currentProgram.deleteAllAttributes();
        program.initAllAttributes();
        program.initAllUniforms();
        program.use();
        this.currentProgram = program;
    }

    public drawArrays(count : number, model : Matrix4, mode : number) : void {
        var gl = this.gl,
            p  = this.currentProgram,
            b  = new Matrix4().bias(),
            n  = new Matrix3().copyFromMatrix4(model).invert().transpose().getArray(),
            lp = new Matrix4().orthographic(-10, 10, -10, 10, -10, 20),
            lv = new Matrix4().lookAt(new Vector3(-0.25, -0.25, -1), Vector3.Zero, Vector3.Y);

        gl.uniform3f(p.uniforms["uAmbientColor"], 0.2, 0.2, 0.25);
        gl.uniform3fv(p.uniforms["uLightDirection"], new Vector3(0.25, 0.25, 1).getFloat32Array());
        gl.uniform3f(p.uniforms["uLightColor"], 0.85, 0.85, 0.8);

        gl.uniformMatrix4fv(p.uniforms["uMMatrix"], false, model.getArray());
        gl.uniformMatrix4fv(p.uniforms["uVMatrix"], false, this.view.getArray());
        gl.uniformMatrix4fv(p.uniforms["uPMatrix"], false, this.perspective.getArray());
        gl.uniformMatrix3fv(p.uniforms["uNMatrix"], false, n);

        gl.uniformMatrix4fv(p.uniforms["uLightBias"], false, b.getArray());
        gl.uniformMatrix4fv(p.uniforms["uLightProjection"], false, lp.getArray());
        gl.uniformMatrix4fv(p.uniforms["uLightView"], false, lv.getArray());

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
        gl.uniform1i(p.uniforms["uDepth"], 0);

        gl.drawArrays(mode, 0, count);
    }

    public drawShadowBuffer(count : number, model : Matrix4) : void {
        var gl         = this.gl,
            p          = this.currentProgram,
            projection = new Matrix4().orthographic(-10, 10, -10, 10, -10, 20),
            view       = new Matrix4().lookAt(new Vector3(-0.25, -0.25, -1), Vector3.Zero, Vector3.Y);

        gl.uniformMatrix4fv(p.uniforms["uMMatrix"], false, model.getArray());
        gl.uniformMatrix4fv(p.uniforms["uVMatrix"], false, view.getArray())
        gl.uniformMatrix4fv(p.uniforms["uPMatrix"], false, projection.getArray());

        gl.drawArrays(gl.TRIANGLES, 0, count);
    }

    private initFrameBuffer() : void {
        var gl   = this.gl,
            size = 512;

        this.shadowFrameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadowFrameBuffer);

        this.frameTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        this.renderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size, size);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.frameTexture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}