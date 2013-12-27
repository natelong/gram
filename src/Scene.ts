import Game     = require("./Game");
import Graphics = require("./Graphics");
import Matrix4  = require("./Matrix4");
import Entity   = require("./Entity");

export = Scene;

class Scene {
    public name        : string;
    public game        : Game;
    public modelView   : Matrix4;
    public perspective : Matrix4;

    private entities : Array<Entity>;

    constructor(name : string, game : Game) {
        this.name = name;
        this.game = game;

        this.modelView = new Matrix4();
        this.perspective = new Matrix4();
        this.entities = [];
    }

    public update(delta : number) : void {}
    public draw() : void {}

    public addEntity(entity : Entity) : void {
        this.entities.push(entity);
    }

    public getEntities() : Array<Entity> {
        return this.entities;
    }
}