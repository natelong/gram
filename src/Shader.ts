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

    public static light2Fragment = [
        "varying vec3 vWorldNormal;",
        "varying vec4 vWorldPosition;",

        "uniform mat4 lightProj;",
        "uniform mat4 lightView;",
        "uniform mat3 lightRot;",
        "uniform mat4 model;",

        "void main(){",
        "    vec3 worldNormal = normalize(vWorldNormal);",
        "    vec3 lightPos = (lightView * vWorldPosition).xyz;",
        "    float depth = clamp(length(lightPos)/40.0, 0.0, 1.0);",
        "    gl_FragColor = vec4(vec3(depth), 1.0);",
        "}"].join("\n");

    public static light2Vertex = [
        "varying vec3 vWorldNormal;",
        "varying vec4 vWorldPosition;",

        "uniform mat4 lightProj;",
        "uniform mat4 lightView;",
        "uniform mat3 lightRot;",
        "uniform mat4 model;",

        "attribute vec3 position;",
        "attribute vec3 normal;",

        "void main(){",
        "    vWorldNormal = normal;",
        "    vWorldPosition = model * vec4(position, 1.0);",
        "    gl_Position = lightProj * lightView * vWorldPosition;",
        "}"].join("\n");
}