import Game    = require("./Game");
import Scene   = require("./Scene");
import Matrix4 = require("./Matrix4");
import Vector3 = require("./Vector3");
import Utils   = require("./Utils");
import Mesh    = require("./Mesh");

class TestScene extends Scene {
    public name        : string;
    public game        : Game;
    public modelView   : Matrix4;
    public perspective : Matrix4;

    private mesh : Mesh;

    constructor(game : Game) {
        super("Test Scene", game);

        // position x 3, color x 4, normal x 3
        var vertices = [
            -1,-1, 1,1,1,1,1, 0, 0, 1,
             1,-1, 1,1,1,1,1, 0, 0, 1,
             1, 1, 1,1,1,1,1, 0, 0, 1,
            -1, 1, 1,1,1,1,1, 0, 0, 1,
            -1,-1,-1,1,1,1,1, 0, 0,-1,
            -1, 1,-1,1,1,1,1, 0, 0,-1,
             1, 1,-1,1,1,1,1, 0, 0,-1,
             1,-1,-1,1,1,1,1, 0, 0,-1,
            -1, 1,-1,1,1,1,1, 0, 1, 0,
            -1, 1, 1,1,1,1,1, 0, 1, 0,
             1, 1, 1,1,1,1,1, 0, 1, 0,
             1, 1,-1,1,1,1,1, 0, 1, 0,
            -1,-1,-1,1,1,1,1, 0,-1, 0,
             1,-1,-1,1,1,1,1, 0,-1, 0,
             1,-1, 1,1,1,1,1, 0,-1, 0,
            -1,-1, 1,1,1,1,1, 0,-1, 0,
             1,-1,-1,1,1,1,1, 1, 0, 0,
             1, 1,-1,1,1,1,1, 1, 0, 0,
             1, 1, 1,1,1,1,1, 1, 0, 0,
             1,-1, 1,1,1,1,1, 1, 0, 0,
            -1,-1,-1,1,1,1,1,-1, 0, 0,
            -1,-1, 1,1,1,1,1,-1, 0, 0,
            -1, 1, 1,1,1,1,1,-1, 0, 0,
            -1, 1,-1,1,1,1,1,-1, 0, 0
        ];


        var indices = [
            0,  1,  2,    0,  2,  3,  // Front face
            4,  5,  6,    4,  6,  7,  // Back face
            8,  9, 10,    8, 10, 11,  // Top face
            12, 13, 14,   12, 14, 15, // Bottom face
            16, 17, 18,   16, 18, 19, // Right face
            20, 21, 22,   20, 22, 23  // Left face
        ];

        this.mesh = new Mesh(game.graphics, vertices, indices);
        this.mesh.translate(new Vector3(0, 0, -10));
    }

    public update(delta : number) : void {
        var rotation = Utils.degToRad((75 * delta) / 1000.0);
        this.mesh.rotate(rotation, Vector3.One);
    }

    public draw() : void {
        var graphics = this.game.graphics;

        this.perspective.perspective(
            Utils.degToRad(45),
            graphics.viewportWidth / graphics.viewportHeight,
            0.1,
            100
        );

        this.mesh.draw(graphics, this.perspective);
    }
}

var stage : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("stage"),
    game : Game               = new Game(stage),
    testScene : TestScene     = new TestScene(game);

game.addScene(<Scene> testScene);