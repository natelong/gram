import Game         = require("./Game");
import Graphics     = require("./Graphics");
import Matrix4      = require("./Matrix4");
import Entity       = require("./Entity");
import Component    = require("./Component");
import MeshRenderer = require("./Components/MeshRenderer");
import IRenderableComponent = require("./IRenderableComponent");

export = Scene;

class Scene {
    public name        : string;
    public game        : Game;
    public modelView   : Matrix4;
    public perspective : Matrix4;

    private entities : Entity[];

    constructor(name : string, game : Game) {
        this.name = name;
        this.game = game;

        this.modelView = new Matrix4();
        this.perspective = new Matrix4();
        this.entities = [];
    }

    public update(delta : number) : void {
        this.getEntities().forEach(function(e : Entity) {
            e.components.forEach(function(c : Component) {
                c.update(delta);
            });
        });
    }

    public draw() : void {
        this.drawEntities();
    }

    private drawEntities() : void {
        this.getEntities().forEach(function(e : Entity) {
            e.components.forEach(function(c : Component) {
                if("draw" in c) (<IRenderableComponent>c).draw();
            });
        });
    }

    public addEntity(entity : Entity) : void {
        this.entities.push(entity);
    }

    public getEntities() : Entity[] {
        return this.entities;
    }
}