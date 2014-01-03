import Game         = require("./Game");
import Scene        = require("./Scene");
import Matrix4      = require("./Matrix4");
import Vector3      = require("./Vector3");
import Utils        = require("./Utils");
import Mesh         = require("./Mesh");
import Color        = require("./Color");
import Entity       = require("./Entity");
import MeshRenderer = require("./Components/MeshRenderer");
import Component    = require("./Component");

import Shader = require("./Shader");
import Shaders = require("./Shaders");
import ShaderProgram = require("./ShaderProgram");

class TestScene extends Scene {
    public name        : string;
    public game        : Game;
    public modelView   : Matrix4;
    public perspective : Matrix4;

    private terrain     : Entity;
    private terrainMesh : Mesh;

    constructor(game : Game) {
        super("Test Scene", game);

        var vertices = Mesh.fromMap([
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                0, 1, 1, 2, 1, 0, 0, 0, 1, 0,
                0, 1, 0, 1, 0, 0, 0, 0, 1, 0,
                0, 1, 0, 0, 1, 0, 0, 0, 1, 0,
                0, 1, 0, 1, 2, 1, 0, 0, 1, 0,
                0, 1, 2, 3, 2, 2, 1, 0, 1, 0,
                0, 1, 1, 2, 1, 0, 0, 0, 1, 0,
                0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ]);

        var m = this.terrainMesh = new Mesh(game.graphics, vertices, Color.White);
        m.rotate(Utils.degToRad(-45), Vector3.X);

        var t = this.terrain = new Entity();
        t.addComponent(new MeshRenderer(m));

        this.addEntity(t);
    }

    public update(delta : number) : void {
        var rotation = Utils.degToRad((25 * delta) / 1000.0);

        this.terrain.getComponent<MeshRenderer>(MeshRenderer.type).mesh.rotate(rotation, Vector3.Z);
    }
}

var stage     = <HTMLCanvasElement> document.getElementById("stage");
var game      = new Game(stage);
var testScene = new TestScene(game);

game.addScene(<Scene> testScene);