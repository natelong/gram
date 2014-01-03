///<reference path="WebGL.d.ts" />
import Shader = require("./Shader");

export = ShaderProgram;

class ShaderProgram {

    public fragment : Shader;
    public vertex   : Shader;
    public program  : WebGLProgram;

    public uniforms   : Map<string, WebGLUniformLocation>;
    public attributes : Map<string, number>;

    public uniformNames   : Array<string>;
    public attributeNames : Array<string>;

    private gl : WebGLRenderingContext;

    constructor (gl : WebGLRenderingContext, fragment : Shader, vertex : Shader, uniforms : Array<string>, attributes : Array<string>) {
        var program = this.program = gl.createProgram();

        this.gl         = gl;
        this.uniforms   = <Map<string, WebGLUniformLocation>>{};
        this.attributes = <Map<string, number>>{};

        this.uniformNames   = uniforms;
        this.attributeNames = attributes;

        this.fragment = fragment;
        this.vertex   = vertex;

        gl.attachShader(program, vertex.shader);
        gl.attachShader(program, fragment.shader);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Could not initialize shaders");
    }

    public use() : void {
        this.gl.useProgram(this.program);
    }

    public initUniform(name : string) : void {
        var uniform = this.gl.getUniformLocation(this.program, name);
        if(!uniform) throw new Error("Couldn't get uniform: " + name);

        this.uniforms[name] = uniform;
    }

    public initUniforms(names : Array<string>) : void {
        names.forEach(this.initUniform.bind(this));
    }

    public initAllUniforms() : void {
        this.initUniforms(this.uniformNames);
    }

    public initAttribute(name : string) : void {
        this.attributes[name] = this.gl.getAttribLocation(this.program, name);
        this.gl.enableVertexAttribArray(this.attributes[name]);
    }

    public initAttributes(names : Array<string>) : void {
        names.forEach(this.initAttribute.bind(this));
    }

    public initAllAttributes() : void {
        this.initAttributes(this.attributeNames);
    }

    public setAttribute(name : string, buffer : WebGLBuffer, count : number, stride? : number, offset? : number) : void {
        var gl = this.gl;

        stride = stride || 0;
        offset = offset || 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(this.attributes[name], count, gl.FLOAT, false, stride, offset);
    }

    public deleteAttribute(name : string) : void {
        this.gl.disableVertexAttribArray(this.attributes[name]);
    }

    public deleteAttributes(names : Array<string>) : void {
        names.forEach(this.deleteAttribute.bind(this));
    }

    public deleteAllAttributes() : void {
        this.deleteAttributes(this.attributeNames);
    }
}