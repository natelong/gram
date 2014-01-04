import Graphics     = require("./Graphics");
import Scene        = require("./Scene");
import InputManager = require("./InputManager");

export = Game;

class Game {
    public graphics    : Graphics;
    public scenes      : Scene[];
    public activeScene : string;
    public input       : InputManager;

    private lastUpdate : number;

    constructor (canvas : HTMLCanvasElement) {
        this.graphics = new Graphics(canvas);
        this.lastUpdate = Date.now();
        this.scenes = [];
        this.activeScene = "";

        this.input = new InputManager(256);

        this.loop();
    }

    public loop() : void {
        var graphics   = this.graphics,
            active     = this.activeScene,
            thisUpdate = Date.now(),
            curScene : Scene;

        if(active && this.hasScene(active)) {
            curScene = this.getScene(active);
            curScene.update((thisUpdate - this.lastUpdate) / 1000);
            graphics.clear();
            curScene.draw();
        }

        this.input.update();

        this.lastUpdate = thisUpdate;
        requestAnimationFrame(this.loop.bind(this));
    }

    public addScene(scene : Scene) : void {
        if(this.hasScene(scene.name)) {
            console.error("Scene already added to game");
            return;
        }

        this.scenes.push(scene);

        if(this.scenes.length === 1) {
            this.activeScene = scene.name;
        }
    }

    public changeScene(name : string) : void {
        if(!this.hasScene(name)) {
            console.error("Scene %s doesn't exist", name);
            return;
        }

        this.activeScene = name;
    }

    public hasScene(name : string) : boolean {
        return this.scenes.some(function(el : Scene) {
            return el.name === name;
        });
    }

    public getScene(name : string) : Scene {
        var scenes = this.scenes.filter(function(s : Scene) {
            return s.name === name;
        });

        if(scenes.length > 0) {
            return scenes[0];
        } else {
            throw new Error("Scene \"" + name + "\" doesn't exist");
        }
    }
}