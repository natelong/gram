define(function() {
    function Shader(gl, id) {
        if(!gl) return console.error("Need GL instance to create shader");
        this.gl = gl;

        if(!id) return console.error("Need an element to extract shader source");

        this.get(id);

        if(!this.source || !this.type) return console.error("Couldn't get shader from element: " + id);
            
        this.shader = this.compile(this.source, this.type);
    }

    Shader.prototype.compile = function compile(src, type) {
        var gl     = this.gl,
            shader = gl.createShader(type);

        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            return;
        }

        return shader;
    };

    Shader.prototype.get = function get(id) {
        var gl           = this.gl,
            shaderScript = document.getElementById(id),
            shader,
            type;

        if(!shaderScript) return console.error("Shader source " + id + " doesn't exist");

        if(shaderScript.type === "x-shader/x-fragment") {
            type = gl.FRAGMENT_SHADER;
        } else if (shaderScript.type === "x-shader/x-vertex") {
            type = gl.VERTEX_SHADER;
        } else {
            return;
        }

        this.source = shaderScript.textContent;
        this.type   = type;
    };

    return Shader;
});