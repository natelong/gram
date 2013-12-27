///<reference path="WebGL.d.ts" />
export = Shader;

var defaultFragment = "" +
    "precision mediump float;" +

    "varying vec4 vColor;" +
    "varying vec3 vLightWeighting;" +

    "void main(void) {" +
        "gl_FragColor = vec4(vColor.rgb * vLightWeighting, vColor.a);" +
    "}";

var defaultVertex = "" +
    "attribute vec3 aVertexPosition;" +
    "attribute vec3 aVertexNormal;" +
    "attribute vec4 aVertexColor;" +

    "uniform mat4 uMVMatrix;" +
    "uniform mat4 uPMatrix;" +
    "uniform mat3 uNMatrix;" +

    "uniform vec3 uAmbientColor;" +
    "uniform vec3 uLightDirection;" +
    "uniform vec3 uLightColor;" +

    "varying vec3 vLightWeighting;" +
    "varying vec4 vColor;" +

    "void main(void) {" +
        "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);" +
        "vColor      = aVertexColor;" +

        "vec3 transformedNormal = uNMatrix * aVertexNormal;" +
        "float lightWeighting   = max(dot(transformedNormal, uLightDirection), 0.0);" +
        "vLightWeighting        = uAmbientColor + uLightColor * lightWeighting;" +
    "}";

class Shader {
    public shader  : WebGLShader;

    private gl     : WebGLRenderingContext;
    private source : string;
    private type   : number;

    constructor (gl : WebGLRenderingContext, id? : string) {
        this.gl = gl;
        if(id) {
            this.get(id);
            this.shader = this.compile(this.source, this.type);
        }
    }

    public get(id : string) : void {
        var gl = this.gl,
            shaderScript = document.getElementById(id),
            type : number;

        if (shaderScript.getAttribute("type") === "x-shader/x-fragment") {
            type = gl.FRAGMENT_SHADER;
        } else if (shaderScript.getAttribute("type") === "x-shader/x-vertex") {
            type = gl.VERTEX_SHADER;
        } else {
            throw new Error("Shader is not a valid type. Are you missing type attributes?");
            return;
        }

        this.source = shaderScript.textContent;
        this.type   = type;
    }

    public compile(src : string, type : number) : WebGLShader {
        var gl = this.gl,
            shader = gl.createShader(type);

        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    public static defaultFragment(gl : WebGLRenderingContext) : Shader {
        var s = new Shader(gl);

        s.shader = s.compile(defaultFragment, gl.FRAGMENT_SHADER);
        return s;
    }

    public static defaultVertex(gl : WebGLRenderingContext) : Shader {
        var s = new Shader(gl);

        s.shader = s.compile(defaultVertex, gl.VERTEX_SHADER);
        return s;
    }
}