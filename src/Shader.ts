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
        }

        this.source = shaderScript.textContent;
        this.type   = type;
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

    public static lightFragment = "" +
        "precision mediump float;" +

        "void main(){" +
            "gl_FragColor = vec4(gl_FragCoord.z);" +
        "}";

    public static lightVertex = "" +
        "uniform mat4 mvp;" +

        "attribute vec3 aVertexPosition;" +

        "void main(){" +
            "gl_Position = mvp * vec4(aVertexPosition, 1);" +
        "}";

    public static defaultFragment = "" +
        "precision mediump float;" +

        "varying vec4 vColor;" +
        "varying vec3 vLightWeighting;" +

        "void main(void) {" +
            "gl_FragColor = vec4(vColor.rgb * vLightWeighting, vColor.a);" +
        "}";

    public static defaultVertex = "" +
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
}