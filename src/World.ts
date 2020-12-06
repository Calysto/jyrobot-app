import {Point, Color, Canvas, Line} from "./utils";
import {Robot} from "./Robot";

export class Wall {
    public color: Color;
    public lines: Line[];

    constructor(color: Color, ...lines: Line[]) {
	this.color = color;
	this.lines = lines;
    }
}

export class World {
    public time: number = 0;
    public at_x: number = 0;
    public at_y: number = 0;
    public w: number;
    public h: number;
    public robots: Robot[] = [];
    public walls: Wall[] = [];
    public boundary_wall_color: Color;
    public ground_color: Color;

    constructor(w: number, h: number) {
        this.time = 0;
        this.w = w;
        this.h = h;
	this.boundary_wall_color = new Color(128, 0, 128);
	this.ground_color = new Color(0, 128, 0)
	// Put a wall around boundary:
	const p1 = new Point(0, 0);
        const p2 = new Point(0, this.h);
        const p3 = new Point(this.w, this.h);
        const p4 = new Point(this.w, 0);
	// Not a box, but four walls:
        this.addWall(this.boundary_wall_color, new Line(p1, p2));
        this.addWall(this.boundary_wall_color, new Line(p2, p3));
        this.addWall(this.boundary_wall_color, new Line(p3, p4));
        this.addWall(this.boundary_wall_color, new Line(p4, p1));
    }

    addBox(color: Color, x1: number, y1: number, x2: number, y2: number) {
	const p1 = new Point(x1, y1);
        const p2 = new Point(x2, y1);
        const p3 = new Point(x2, y2);
        const p4 = new Point(x1, y2);
	// Pairs of points make Line:
	this.addWall(color,
		     new Line(p1, p2),
		     new Line(p2, p3),
		     new Line(p3, p4),
		     new Line(p4, p1));
    }

    addWall(c: Color, ...lines: Line[]) {
        this.walls.push(new Wall(c, ...lines));
    }

    addRobot(robot: Robot) {
      this.robots.push(robot);
      robot.world = this;
    }

    update(canvas: Canvas) {
	canvas.clear();
        canvas.noStroke();
        canvas.fill(this.ground_color);
        canvas.rect(this.at_x, this.at_y, this.w, this.h);
        for (let wall of this.walls) {
            const c: Color = wall.color;
            canvas.fill(c);
            canvas.stroke(c);
	    canvas.beginShape();
	    for (let line of wall.lines) {
		canvas.vertex(line.p1.x, line.p1.y);
		canvas.vertex(line.p2.x, line.p2.y);
	    }
            canvas.endShape();
        }
        for (let robot of this.robots) {
            robot.update(canvas);
            robot.draw(canvas);
        }
        this.time = this.time + 0.05;
    }
}
