define([
    "gram/Graphics"
],function(Graphics) {
    function Game(canvas) {
        this.graphics    = new Graphics(canvas, "shader-fs", "shader-vs");
        this.lastUpdate  = Date.now();
        this.scenes      = {};
        this.activeScene = "";

        this.loop();
    }

    Game.prototype.loop = function loop() {
        var graphics   = this.graphics,
            thisUpdate = Date.now();

        graphics.clear();
        if(this.activeScene) {
            this.scenes[this.activeScene].update(thisUpdate - this.lastUpdate);
            this.scenes[this.activeScene].draw();
        }

        this.lastUpdate = thisUpdate;
        requestAnimationFrame(this.loop.bind(this));
    };

    Game.prototype.addScene = function addScene(scene) {
        var name = scene.name;

        if(this.scenes[name]) {
            console.error("Scene already exists: " + name);
            return;
        }

        this.scenes[name] = scene;

        if(Object.keys(this.scenes).length === 1) {
            this.activeScene = name;
        }
    };

    Game.prototype.changeScene = function changeScene(name) {
        if(!this.scenes[name]) {
            console.error("Scene doesn't exist: " + name);
            return;
        }

        this.activeScene = name;
    };

    return Game;
});