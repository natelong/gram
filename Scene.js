define([
    "gram/Matrix",
    "gram/Utils"
],function(Matrix, Utils) {

    function Scene(name, game) {
        this.name     = name || "untitled";
        this.game     = game;
        this.graphics = game.graphics;
        this.rCube    = 0;

        this.mvMatrix = Matrix.mat4.create();
        this.pMatrix  = Matrix.mat4.create();

        this.gameObjects = [];

        var gl = this.graphics.gl;

        cubeVertexPositionBuffer = this.cubeVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        var vertices = [
            // Front face
            -1.0, -1.0, 1.0,
             1.0, -1.0, 1.0,
             1.0,  1.0, 1.0,
            -1.0,  1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,

            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        cubeVertexPositionBuffer.itemSize = 3;
        cubeVertexPositionBuffer.numItems = 24;

        cubeVertexColorBuffer = this.cubeVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
        var colors = [
            [1.0, 0.0, 0.0, 1.0], // Front face
            [1.0, 1.0, 0.0, 1.0], // Back face
            [0.0, 1.0, 0.0, 1.0], // Top face
            [1.0, 0.5, 0.5, 1.0], // Bottom face
            [1.0, 0.0, 1.0, 1.0], // Right face
            [0.0, 0.0, 1.0, 1.0]  // Left face
        ];
        var unpackedColors = [];
        for(var i in colors) {
            var color = colors[i];
            for (var j = 0; j < 4; j++) {
                unpackedColors = unpackedColors.concat(color);
            }
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
        cubeVertexColorBuffer.itemSize = 4;
        cubeVertexColorBuffer.numItems = 24;

        cubeVertexIndexBuffer = this.cubeVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
        var cubeVertexIndices = [
             0,  1,  2,    0,  2,  3, // Front face
             4,  5,  6,    4,  6,  7, // Back face
             8,  9, 10,    8, 10, 11, // Top face
            12, 13, 14,   12, 14, 15, // Bottom face
            16, 17, 18,   16, 18, 19, // Right face
            20, 21, 22,   20, 22, 23  // Left face
        ];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
        cubeVertexIndexBuffer.itemSize = 1;
        cubeVertexIndexBuffer.numItems = 36;
    }

    Scene.prototype.update = function update(delta) {
        this.rCube -= (75 * delta) / 1000.0;
    };

    Scene.prototype.draw = function draw() {
        var graphics = this.graphics,
            gl       = graphics.gl;

        Matrix.mat4.perspective(
            this.pMatrix,
            Utils.degToRad(45),
            graphics.viewportWidth / graphics.viewportHeight,
            0.1,
            100
        );

        Matrix.mat4.identity(this.mvMatrix);
        Matrix.mat4.translate(this.mvMatrix, this.mvMatrix, [0.0, 0.0, -10.0]);
        Matrix.mat4.rotate(this.mvMatrix, this.mvMatrix, Utils.degToRad(this.rCube), [1, 1, 1]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
        gl.vertexAttribPointer(graphics.shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        gl.vertexAttribPointer(graphics.shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        graphics.setMatrixUniforms(this.pMatrix, this.mvMatrix);
        gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    };

    Scene.prototype.addGameObject = function addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
    };

    Scene.prototype.getGameObjects = function getGameObjects() {
        return this.gameObjects;
    }

    return Scene;
});