///<reference path="WebGL.d.ts" />
import Matrix3 = require("./Matrix3");
import Matrix4 = require("./Matrix4");
import Vector3 = require("./Vector3");
import Shader  = require("./Shader");

export = Graphics;

class Graphics {
    public gl : WebGLRenderingContext;
    public viewportWidth  : number;
    public viewportHeight : number;
    public shaderProgram  : WebGLProgram;

    // TODO: Replace these with something more sane
    public positionAttribute : number;
    public colorAttribute    : number;
    public normalAttribute   : number;

    public pUniform              : WebGLUniformLocation;
    public mvUniform             : WebGLUniformLocation;
    public nMatrixUniform        : WebGLUniformLocation;
    public ambientColorUniform   : WebGLUniformLocation;
    public lightDirectionUniform : WebGLUniformLocation;
    public lightColorUniform     : WebGLUniformLocation;

    private matrixStack : Array<Matrix4>;

    constructor(canvas : HTMLCanvasElement, fragmentId? : string, vertexId? : string) {
        var gl : WebGLRenderingContext;

        try {
            this.gl = gl = canvas.getContext("experimental-webgl");
            this.viewportWidth = canvas.width;
            this.viewportHeight = canvas.height;
        } catch(e) {}

        if (gl) {
            this.initShaders(fragmentId, vertexId);

            gl.clearColor(0, 0, 0, 1);
            gl.enable(gl.DEPTH_TEST);
        } else {
            console.error("Couldn't initialize WebGL");
        }
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

    private initShaders(fragmentId? : string, vertexId? : string) : void {
        var gl       = this.gl,
            program  = this.shaderProgram = gl.createProgram();

        var fragment : Shader;
        if(fragmentId) {
            fragment = new Shader(gl, fragmentId);
        } else {
            fragment = Shader.defaultFragment(gl);
        }

        var vertex : Shader;
        if(vertexId) {
            vertex = new Shader(gl, vertexId);
        } else {
            vertex = Shader.defaultVertex(gl);
        }

        gl.attachShader(program, vertex.shader);
        gl.attachShader(program, fragment.shader);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Could not initialize shaders");
            return;
        }

        gl.useProgram(program);

        this.pUniform              = gl.getUniformLocation(program, "uPMatrix");
        this.mvUniform             = gl.getUniformLocation(program, "uMVMatrix");
        this.nMatrixUniform        = gl.getUniformLocation(program, "uNMatrix");
        this.ambientColorUniform   = gl.getUniformLocation(program, "uAmbientColor");
        this.lightDirectionUniform = gl.getUniformLocation(program, "uLightDirection");
        this.lightColorUniform     = gl.getUniformLocation(program, "uLightColor");

        this.positionAttribute = gl.getAttribLocation(program, "aVertexPosition");
        gl.enableVertexAttribArray(this.positionAttribute);

        this.colorAttribute = gl.getAttribLocation(program, "aVertexColor");
        gl.enableVertexAttribArray(this.colorAttribute);

        this.normalAttribute = gl.getAttribLocation(program, "aVertexNormal");
        gl.enableVertexAttribArray(this.normalAttribute);
    }

    public setMatrixUniforms(pMatrix : Matrix4, mvMatrix : Matrix4) : void {
        var gl = this.gl;

        gl.uniformMatrix4fv(this.pUniform, false, pMatrix.getArray());
        gl.uniformMatrix4fv(this.mvUniform, false, mvMatrix.getArray());

        var normalMatrix = new Matrix3().copyFromMatrix4(mvMatrix).invert().transpose();
        gl.uniformMatrix3fv(this.nMatrixUniform, false, normalMatrix.getArray());
    }

    public setPositionBuffer(positionBuffer : WebGLBuffer, stride? : number, offset? : number) : void {
        var gl = this.gl;

        stride = stride || 0;
        offset = offset || 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(this.positionAttribute, 3, gl.FLOAT, false, stride, offset);
    }

    public setColorBuffer(colorBuffer : WebGLBuffer, stride? : number, offset? : number) : void {
        var gl = this.gl;

        stride = stride || 0;
        offset = offset || 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(this.colorAttribute, 4, gl.FLOAT, false, stride, offset);
    }

    public setNormalBuffer(normalBuffer : WebGLBuffer, stride? : number, offset? : number) : void {
        var gl = this.gl;

        stride = stride || 0;
        offset = offset || 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.vertexAttribPointer(this.normalAttribute, 3, gl.FLOAT, false, stride, offset);
    }

    public drawIndices(indexBuffer : WebGLBuffer, indexCount : number, perspective : Matrix4, modelView : Matrix4, mode : number) : void {
        var gl = this.gl;

        gl.uniform3f(this.ambientColorUniform, 0.2, 0.2, 0.2);
        gl.uniform3fv(this.lightDirectionUniform, new Vector3(0.25, 0.25, 1).getArray());
        gl.uniform3f(this.lightColorUniform, 0.8, 0.8, 0.8);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.setMatrixUniforms(perspective, modelView);
        gl.drawElements(mode, indexCount, gl.UNSIGNED_SHORT, 0);
    }
}