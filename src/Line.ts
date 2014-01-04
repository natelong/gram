import Vector3 = require("./Vector3");
import Color = require("./Color");

export = Line;

class Line {
    public points : Vector3[];
    public color  : Color;

    constructor(points : Vector3[], color? : Color) {
        this.points = points;
        this.color  = color || Color.White;
    }

    public static fromStrip(points : Vector3[], color? : Color) : Line {
        var newPoints = <Vector3[]>[];

        for(var i = 0; i < points.length - 1; i++) {
            newPoints.push(points[i]);
            newPoints.push(points[i+1]);
        }

        return new Line(newPoints, color);
    }

    public static fromLoop(points : Vector3[], color? : Color) : Line {
        points.push(points[0]);
        return Line.fromStrip(points, color);
    }
}