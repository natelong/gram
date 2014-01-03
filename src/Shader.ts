///<reference path="WebGL.d.ts" />
export = Shader;

class Shader {
    public shader  : WebGLShader;

    private gl     : WebGLRenderingContext;
    private source : string;
    private type   : number;

    constructor (gl : WebGLRenderingContext, type : number, source : string) {
        this.gl = gl;

        this.source = source;
        this.type   = type;
        this.shader = this.compile();
    }

    public compile() : WebGLShader {
        var gl = this.gl,
            shader = gl.createShader(this.type);

        gl.shaderSource(shader, this.source);
        gl.compileShader(shader);

        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
}