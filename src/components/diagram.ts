export type Intersect = {
  type?: number | undefined
  ua: number | undefined,
  ub?: number | undefined,
  intersect: Point | undefined
}

const linePointIntersect = (lineFrom: Point, lineTo: Point, p0: Point, radius: number): Intersect | undefined => {
  let v = new Point(lineTo.y - lineFrom.y, -(lineTo.x - lineFrom.x)); // perpendicular Point
  let d = Math.abs((lineTo.x - lineFrom.x) * (lineFrom.y - p0.y) - (lineFrom.x - p0.x) * (lineTo.y - lineFrom.y));
  d = d / v.length();
  if (d > radius) {
    return undefined;
  }
  v.normalize();
  v.scale(d);
  let p1 = p0.add(v);
  let ua: number | undefined;
  if (Math.abs(lineTo.x - lineFrom.x) > Math.abs(lineTo.y - lineFrom.y)) {
    ua = (p1.x - lineFrom.x) / (lineTo.x - lineFrom.x);
  } else {
    ua = (p1.y - lineFrom.y) / (lineTo.y - lineFrom.y);
  }
  if (ua > 0.0 && ua < 1.0) {
    return {
      ua: ua,
      intersect: p1
    };
  }
  return undefined;
}

export interface Drawable {
  id: string;
  draw: Function;
  intersect?: Function;
  isOn: Function;
  color: Function;
  backgroundColor: Function;
  move: Function;
}
export class Point {
  x: number;
  y: number;
  z: number;
  constructor(x: number, y: number, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  distFrom = (v: Point) => { return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2)); }
  length = () => { return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)); }
  dotProd = (v: Point) => {
    return this.x * v.x + this.y * v.y;
  }

  add = (v: Point) => { return new Point(this.x + v.x, this.y + v.y); }
  sub = (v: Point) => { return new Point(this.x - v.x, this.y - v.y); }
  rotate = (a: number) => {  // CLOCKWISE
    return new Point(this.x * Math.cos(a) + this.y * Math.sin(a),
      -this.x * Math.sin(a) + this.y * Math.cos(a));
  }
  scale = (s: number) => { this.x *= s; this.y *= s; }
  normalize = () => { let d = this.length(); this.scale(1.0 / d); }

  handle = (shape: Shape, idx: number): Handle => {
    let h = new Handle(this.x, this.y, 10, {});
    h.shape = shape;
    h.idx = idx;
    return h;
  }
}

export class Shape implements Drawable {
  opt: any;
  id: string;
  constructor(opt: any) {
    this.opt = opt;
    this.id = crypto.randomUUID();
    this.fillStyle = opt?.fillStyle || "rgb(255, 255, 255)";
    this.strokeStyle = opt?.strokeStyle || "rgb(150, 150, 150)";
  }

  fillStyle?: string;
  strokeStyle?: string;

  move = (v: Point) => { }
  draw = (ctx: any) => { }
  color = (color: string) => this.strokeStyle = color;
  backgroundColor = (color: string) => this.fillStyle = color;
  isOn = (x: number, y: number, z: number = 0) => false;

  connectors = (): Array<Shape> => [];
  handlers = (): Array<Shape> => [];

  drawConnectors = (ctx: any) => {
    this.connectors().forEach((p) => {
      p.draw(ctx);
    });
  }

  drawHandlers = (ctx: any) => {
    this.handlers().forEach((p) => {
      p.draw(ctx);
    });
  }

  resizeByHandle = (handle: Handle) => {
    console.log(handle.idx);
  }
  grabHandle = (x: number, y: number) => {
    return this.handlers().find(h => h.isOn(x, y))
  }
}

export class Curve extends Shape {
  points: Array<Point> = [];
  constructor(points: Array<Point>, opt: any = {}) {
    super(opt);
    this.points = [...points];
  }

  add = (x: number, y: number, z: number = 0) => {
    this.points.push(new Point(x, y, z));
  }

  intersect = (pos: Point, r: number) => {
    return undefined;
  }

  lines = (): Array<Line> => {
    return this.points.slice(0, this.points.length - 1).map((p, idx) => {
      return new Line(p, this.points[idx + 1]);
    });
  }

  handlers = (): Array<Handle> => this.points.map((p, idx: number) => p.handle(this, idx));
  connectors = () => this.handlers();

  isOn = (x: number, y: number, z: number = 0) => {
    return this.lines().find((l) => l.isOn(x, y, z)) !== undefined;
  }

  move = (v: Point) => {
    this.points = this.points.map((p, idx) => p.add(v));
  }

  draw = (ctx: any) => {
    ctx.beginPath();
    ctx.strokeStyle = this.strokeStyle;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.stroke();
    ctx.closePath();
  }
}

export class Line extends Shape {
  from: Point;
  to: Point;
  constructor(from: any, to: any, opt: any = {}) {
    super(opt);
    this.from = new Point(from.x, from.y);
    this.to = new Point(to.x, to.y);
  }
  handlers = (): Array<Handle> => [this.from.handle(this, 0), this.to.handle(this, 1)];
  connectors = () => this.handlers();

  intersect = (pos: Point, r: number) => {
    return linePointIntersect(this.from, this.to, pos, r)
  }
  move = (v: Point) => {
    this.from = this.from.add(v);
    this.to = this.to.add(v);
  }
  draw = (ctx: any) => {
    ctx.beginPath();
    ctx.strokeStyle = this.strokeStyle;
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
    ctx.stroke();
    ctx.closePath();
  }
  isOn = (x: number, y: number, z: number = 0) => {
    let intersect = linePointIntersect(this.from, this.to, new Point(x, y), 2);
    return intersect !== undefined;
  }
}

export class Rectangle extends Shape {
  pos: Point = new Point(0, 0);
  width: number = 0;
  height: number = 0;
  constructor(x: number, y: number, width: number, height: number, opt: any) {
    super(opt);
    this.pos = new Point(x, y);
    this.width = Math.abs(width);
    this.height = Math.abs(height);
    if (width < 0) {
      this.pos.x = this.pos.x + width;
    }
    if (height < 0) {
      this.pos.y = this.pos.y + height;
    }
  }

  move = (v: Point) => {
    this.pos = this.pos.add(v);
  }

  lines = (): Array<Line> => {
    let upLeft = this.pos;
    let upRight = this.pos.add(new Point(this.width, 0));
    let lowerLeft = this.pos.add(new Point(0, this.height));
    let lowerRight = this.pos.add(new Point(this.width, this.height));
    return [
      new Line(upLeft, upRight),
      new Line(upRight, lowerRight),
      new Line(lowerRight, lowerLeft),
      new Line(lowerLeft, upLeft),
    ]
  }

  draw = (ctx: any) => {
    let upLeft = this.pos;
    ctx.beginPath();
    ctx.fillStyle = this.fillStyle;
    ctx.strokeStyle = this.strokeStyle;
    ctx.rect(upLeft.x, upLeft.y, this.width, this.height, true);

    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  intersect = (s: Shape) => {
    return true
  }

  isOn = (x: number, y: number) => {
    return x > this.pos.x && x < this.pos.x + this.width
      && y > this.pos.y && y < this.pos.y + this.height;
  }

  handlers = (): Array<Handle> => {
    let p1 = this.pos.add(new Point(this.width, 0));
    let p2 = this.pos.add(new Point(0, this.height));
    let p3 = this.pos.add(new Point(this.width, this.height));
    return [this.pos.handle(this, 0), p1.handle(this, 1), p2.handle(this, 2), p3.handle(this, 3)];
  };
  connectors = () => {
    return this.handlers()
  };
}

export class Circle extends Shape {
  pos: Point = new Point(0, 0);
  radius: number;

  constructor(x: number, y: number, radius: number, opt: any) {
    super(opt);
    this.pos = new Point(x, y);
    this.radius = radius;
  }

  move = (v: Point) => {
    this.pos = this.pos.add(v);
  }

  distFrom = (c: Circle) => {
    return this.pos.distFrom(c.pos);
  }

  moveTo = (x: number, y: number, z?: number) => {
    this.pos = new Point(x, y, z);
  }

  isOn = (x: number, y: number) => {
    return x > this.pos.x - this.radius && x < this.pos.x + this.radius
      && y > this.pos.y - this.radius && y < this.pos.y + this.radius;
  }

  draw = (ctx: any) => {
    ctx.beginPath();
    ctx.fillStyle = this.fillStyle;
    ctx.strokeStyle = this.strokeStyle;
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  handlers = (): Array<Handle> => {
    let p1 = this.pos.add(new Point(this.radius, 0));
    let p2 = this.pos.add(new Point(0, -this.radius));
    let p3 = this.pos.add(new Point(0, this.radius));
    let p4 = this.pos.add(new Point(-this.radius, 0));
    return [p1.handle(this, 0), p2.handle(this, 1), p3.handle(this, 2), p4.handle(this, 3)];
  };

  connectors = () => {
    return this.handlers();
  };
}

export class Handle extends Shape {
  pos: Point = new Point(0, 0);
  radius: number;

  shape?: Shape;
  idx: number = -1;

  constructor(x: number, y: number, radius: number, opt: any) {
    super(opt);
    this.pos = new Point(x, y);
    this.radius = radius;
  }

  move = (v: Point) => {
    this.pos = this.pos.add(v);
  }

  distFrom = (c: Circle) => {
    return this.pos.distFrom(c.pos);
  }

  moveTo = (x: number, y: number, z?: number) => {
    this.pos = new Point(x, y, z);
  }

  isOn = (x: number, y: number) => {
    return x > this.pos.x - this.radius && x < this.pos.x + this.radius
      && y > this.pos.y - this.radius && y < this.pos.y + this.radius;
  }

  draw = (ctx: any) => {
    ctx.beginPath();
    ctx.fillStyle = this.fillStyle;
    ctx.strokeStyle = this.strokeStyle;
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
}
// Wall is made up of two Points
export class Wall {
  p1: Point;
  p2: Point;
  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }
  draw(ctx: any) {
    ctx.beginPath();
    ctx.strokeStyle = "rgb(0,0,0)"; // nothing
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
    ctx.closePath();
  }

  reset(world: any) {

  }
}

export class Diagram {
  mousePoints: Array<Point> = [];
  mode: string = "1";//selected mode
  canvas: any;
  selectedShape?: Shape;
  defaultOption = {
    strokeStyle: "blue",
    fillStyle: "lightgray"
  }
  shapes: Array<Shape> = [];
  currentShape?: Shape;
  selectedAt?: Point;

  options: any = {};
  constructor(opt = {}) {
    this.options = opt || {};
  }

  checkSelected = (x: number, y: number) => {
    this.selectedShape = this.shapes.find((s) => s.isOn(x, y));
    if (this.selectedShape) {
      this.selectedShape.color("red");
      this.draw();
    }
    return this.selectedShape !== undefined;
  }
  handler: any;
  observe = (canvasId: string) => {
    if (!this.canvas) {
      this.canvas = document.getElementById(canvasId);
      let elemLeft = this.canvas.offsetLeft + this.canvas.clientLeft;
      let elemTop = this.canvas.offsetTop + this.canvas.clientTop;
      this.canvas.addEventListener('mousedown', (event: any) => {
        this.selectedAt = undefined;
        let x = event.pageX - elemLeft, y = event.pageY - elemTop;
        this.mousePoints = [];
        let handles = this.shapes.filter(s => s.grabHandle(x, y) !== undefined).map(s => {
          return {
            shape: s,
            handle: s.grabHandle(x, y)
          }
        });

        if (handles.length > 0) {
          this.selectedAt = new Point(x, y);
          this.handler = handles[0];
          console.log(this.handler.handle.idx);
          return;
        } else {
          this.handler = undefined;
        }
        this.shapes.forEach((s) => {
          s.color(this.defaultOption.strokeStyle);
        });
        if (this.checkSelected(x, y)) {
          this.selectedAt = new Point(x, y);
          return;
        } else {
          this.mousePoints.push(new Point(x, y));
          this.mousePoints.push(new Point(x, y));
        }
      }, false);

      this.canvas.addEventListener('mousemove', (event: any) => {
        let x = event.pageX - elemLeft,
          y = event.pageY - elemTop;
        let point = new Point(x, y);

        if (this.selectedAt && this.handler) {
          let dist = point.sub(this.selectedAt);
          this.handler.handle.move(dist);
          this.handler.shape.resizeByHandle(this.handler.handle);
          this.selectedAt = this.selectedAt.add(dist);
          this.draw();
          return;
        }

        if (this.mousePoints.length > 0) {
          this.mousePoints[1] = point;
          this.currentShape = this.createDrawable();
          this.draw();
        } else {
          if (this.selectedAt && this.selectedShape) {
            let dist = point.sub(this.selectedAt);
            this.selectedShape.move(dist);
            this.selectedAt = this.selectedAt.add(dist);
            this.draw();
          }
        }
      }, false);

      this.canvas.addEventListener('mouseup', (event: any) => {
        let x = event.pageX - elemLeft,
          y = event.pageY - elemTop;
        if (this.mousePoints.length > 0) {
          this.mousePoints.push(new Point(x, y));
          this.shapes.push(this.createDrawable()!);
        }
        this.mousePoints = [];
        this.currentShape = undefined;
        this.selectedAt = undefined;
        this.draw();
      }, false);
    }
    return this;
  }

  draw = () => {
    let ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.shapes.forEach((d) => {
      d.draw(ctx);
    });
    if (this.handler) {
      this.handler.handle.draw(ctx);
    }
    if (this.selectedShape) {
      this.selectedShape.drawHandlers(ctx);
    }
    if (this.currentShape) {
      this.currentShape.draw(ctx);
    }
    ctx.lineWidth = 1;
  }

  createDrawable = () => {
    let p1 = this.mousePoints[0];
    let p2 = this.mousePoints[1];
    let shape;
    switch (this.mode) {
      case "1":
        shape = new Rectangle(p1.x, p1.y, (p2.x - p1.x), (p2.y - p1.y), this.defaultOption);
        break;
      case "2":
        shape = new Circle(p1.x, p1.y, p1.distFrom(p2), this.defaultOption);
        break;
      case "3":
        shape = new Curve([...this.mousePoints], this.defaultOption);
        break;
      case "4":
        shape = new Line(p1, p2, this.defaultOption);
        break;
    }
    return shape;
  }

  clear = (evt: any) => {
    this.shapes = [];
    this.selectedShape = undefined;
    this.currentShape = undefined;
    this.draw();
  }

  delete = (evt: any) => {
    if (this.selectedShape) {
      this.shapes = this.shapes.filter((d: any) => d !== this.selectedShape);
      this.selectedShape = undefined;
      this.draw();
    }
  }
}