define([
    "gram/Matrix",
    "gram/Shader"
],function(Matrix, Shader) {

    function Graphics(canvas, fragmentId, vertexId) {
        var gl;

        try {
            this.gl = gl = canvas.getContext("experimental-webgl");
            this.viewportWidth = canvas.width;
            this.viewportHeight = canvas.height;
        } catch(e) {}

        if(!gl) {
            return alert("Could not initialize WebGL, sorry!");
        }

        this.initShaders(fragmentId, vertexId);

        this.matrixStack = [];

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
    }

    Graphics.prototype.clear = function clear() {
        var gl = this.gl;

        gl.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };

    Graphics.prototype.initCamera = function initCamera(fov, near, far, pMatrix) {
        Matrix.mat4.perspective(
            fov || 45,
            this.gl.viewportWidth / this.gl.viewportHeight,
            near || 0.1,
            far || 100.0,
            pMatrix
        );
    }

    Graphics.prototype.pushMatrix = function pushMatrix(matrix) {
        var copy = Matrix.mat4.create();
        Matrix.mat4.set(matrix, copy);
        this.matrixStack.push(copy);
    };

    Graphics.prototype.popMatrix = function popMatrix() {
        if(matrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }

        return matrixStack.pop();
    };

    Graphics.prototype.initShaders = function initShaders(fid, vid) {
        var gl             = this.gl,
            fragmentShader = new Shader(gl, fid),
            vertexShader   = new Shader(gl, vid),
            shaderProgram  = this.shaderProgram = gl.createProgram();

        gl.attachShader(shaderProgram, vertexShader.shader);
        gl.attachShader(shaderProgram, fragmentShader.shader);
        gl.linkProgram(shaderProgram);

        if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialize shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    };

    Graphics.prototype.setMatrixUniforms = function setMatrixUniforms(pMatrix, mvMatrix) {
        var gl = this.gl;

        gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, mvMatrix);
    };

    return Graphics;
});