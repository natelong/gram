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
import InputManager = require("./InputManager");

import LineManager  = require("./LineManager");
import Line         = require("./Line");

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

    private width  = 10;
    private height = 10;
    private size   = 1;
    private lineman : LineManager;

    constructor(game : Game) {
        super("Test Scene", game);

        game.graphics.setColor(Color.White);

//        var vertices = Mesh.fromMap([
//                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
//                0, 1, 1, 2, 1, 0, 0, 0, 1, 0,
//                0, 1, 0, 1, 0, 0, 0, 0, 1, 0,
//                0, 1, 0, 0, 1, 0, 0, 0, 1, 0,
//                0, 1, 0, 1, 2, 1, 0, 0, 1, 0,
//                0, 1, 2, 3, 2, 2, 1, 0, 1, 0,
//                0, 1, 1, 2, 1, 0, 0, 0, 1, 0,
//                0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
//                0, 0, 0, 0, 0, 0, 0, 0, 0, 0
//            ]);

//        var m = this.terrainMesh = new Mesh(game.graphics, vertices, Color.White);
//        var m = Mesh.Cube(game.graphics, Color.Gray);
//        m.rotate(Utils.degToRad(-45), Vector3.X);

        var t = this.terrain = new Entity();
//        t.addComponent(new MeshRenderer(m));
        this.addEntity(t);

        var s = this.size;
        this.lineman = new LineManager(game.graphics);
        for(var y = 0; y < this.height; y++) {
            for(var x = 0; x < this.width; x++) {
                var xo = x * s,
                    yo = y * (s * 0.75);

                if(y % 2 !== 0) xo += s/2;

                this.lineman.add(Line.fromLoop([
                    new Vector3(xo,     0, yo-s/2),
                    new Vector3(xo+s/2, 0, yo-s/4),
                    new Vector3(xo+s/2, 0, yo+s/4),
                    new Vector3(xo,     0, yo+s/2),
                    new Vector3(xo-s/2, 0, yo+s/4),
                    new Vector3(xo-s/2, 0, yo-s/4)
                ], Color.Gray));
            }
        }

        t.addComponent(this.lineman);
    }

    public update(delta : number) : void {
        super.update(delta);

        var rotation    = Utils.degToRad((50 * delta) / 1000.0),
            g           = this.game.graphics,
            mov         = g.camera.speed * delta;

//            this.terrain.getComponent<MeshRenderer>(MeshRenderer.type).mesh.rotate(rotation, Vector3.One);

        if(game.input.isDown(InputManager.keys.LEFT)) {
            g.camera.translate(new Vector3(-mov, 0, 0));
        }

        if(game.input.isDown(InputManager.keys.RIGHT)) {
            g.camera.translate(new Vector3(mov, 0, 0));
        }

        if(game.input.isDown(InputManager.keys.UP)) {
            g.camera.translate(new Vector3(0, 0, -mov));
        }

        if(game.input.isDown(InputManager.keys.DOWN)) {
            g.camera.translate(new Vector3(0, 0, mov));
        }
    }
}

var stage     = <HTMLCanvasElement> document.getElementById("stage");
var game      = new Game(stage);
var testScene = new TestScene(game);

game.addScene(<Scene> testScene);