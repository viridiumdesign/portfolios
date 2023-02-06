import { Circle } from "../v-flow/diagram";

export class DataPoint {
    x: number = 0;
    y: number = 0;
    z?: number;
    t?: number;
    opt?: any = {}
    constructor(x: number, y:number, opt : any = {}) {
        this.x = x;
        this.y = y;
        this.opt = opt;
    }
}

export class DataSet {
    setData(arg0: Array<DataPoint>) {
        this.data = [...arg0];
    }
    private data: Array<DataPoint> = [];
    private opt?: any;

    getData = (): Array<DataPoint> => {
        return this.data;
    }
    maxX = () => {
        let xValues = this.data.map(d => d.x);
        return Math.max(...xValues);
    }
    minX = () => {
        let xValues = this.data.map(d => d.x);
        return Math.min(...xValues);
    }
    maxY = () => {
        return Math.max(...this.data.map(d => d.y));
    }
    minY = () => {
        let xValues = this.data.map(d => d.x);
        return Math.min(...this.data.map(d => d.y));
    }
    shift = (d: DataPoint, axis: string = "x"): DataSet => {
        let first = this.data.shift()?.x;
        this.data.forEach((dp) => {
            let x = dp.x;
            dp.x = first!;
            first = x;
        });
        this.data.push(d);
        return this;
    }

    push = (d: DataPoint): DataSet => {
        this.data.push(d);
        return this;
    }
}
export class Series {
    private datasets: Array<DataSet> = [];
    private opt?: any;
    constructor(dim: number = 1, opt: any = {}) {
        for (let i = 0; i < dim; i++) {
            this.datasets.push(new DataSet());
        }
        this.opt = opt;
    }

    getDateset = (i: number) => {
        return this.datasets[i];
    }

    getDatasets = (): Array<DataSet> => {
        return this.datasets;
    }

    shift = (set: DataPoint[]): Series => {
        for (let i = 0; i < set.length; i++) {
            this.datasets[i].shift(set[i]);
        }
        return this;
    }
    push = (set: DataPoint[]): Series => {
        for (let i = 0; i < set.length; i++) {
            this.datasets[i].push(set[i]);
        }
        return this;
    }

    size = () => {
        return this.datasets.length;
    }
    maxX = () => {
        return Math.max(...this.datasets.map((d) => d.maxX()));
    }
    minX = () => {
        return Math.max(...this.datasets.map((d) => d.minX()));
    }
    maxY = () => {
        return Math.max(...this.datasets.map((d) => d.maxY()));
    }
    minY = () => {
        return Math.max(...this.datasets.map((d) => d.minY()));
    }
}

export class Chart {
    maxY: number;
    minY: number;
    minX: number;
    maxX: number;
    series: Series = new Series();
    styles: Array<string>;
    transform?: Function;
    title?: string;
    padding: {
        left: number,
        right: number,
        top: number,
        bottom: number;
    }
    constructor(dim: number, opt: any) {
        this.series = new Series(dim, opt);
        this.maxY = opt.maxY === undefined ? -9999 : opt.maxY;
        this.minY = opt.minY === undefined ? 9999 : opt.minY;
        this.maxX = opt.maxX === undefined ? -9999 : opt.maxX;
        this.minX = opt.minX === undefined ? 9999 : opt.minX;

        this.padding = opt.padding || {
            left: 40,
            right: 10,
            top: 10,
            bottom: 20
        };
        this.styles = ["red", "blue", "green", "black", "magenta", "cyan", "purple", "aqua", "olive", "lime", "navy"];
    }
    f2t = (x: number, d = 3) => {
        let dd = 1.0 * Math.pow(10, d);
        return '' + Math.floor(x * dd) / dd;
    }
    drawingRect = (ctx: any) => {
        return {
            w: ctx.width - this.padding.right - this.padding.left,
            h: ctx.height - this.padding.top - this.padding.bottom,
            l: this.padding.left,
            b: ctx.height - this.padding.bottom
        }
    }

    drawGrid = (ctx: any) => {
        ctx.font = "10px Georgia"
        let padding = this.padding;
        let h = ctx.canvas.height;
        let w = ctx.canvas.width;;
        ctx.strokeStyle = "#aaa";
        ctx.beginPath();
        ctx.lineWidth = 1;
        let ng = 5;
        for (let i = 0; i <= ng; i++) {
            let x = i / ng * (w - padding.left - padding.right) + padding.left + .5;
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, h - padding.bottom);
            ctx.fillText(i, x - 4, h - padding.bottom + 12);
        }
        for (let i = 0; i <= ng; i++) {
            let y = i / ng * (h - padding.top - padding.bottom) + padding.top + .5;
            ctx.moveTo(padding.left, y);
            ctx.lineTo(w - padding.right, y);
            ctx.fillText(this.f2t((ng - i) / ng * (this.maxY - this.minY) + this.minY), 10, y + 2);
        }
        ctx.stroke();
        ctx.closePath();
    }
    drawLegend = (ctx: any) => {

    }

    draw = (canvas: any) => {
        let padding = this.padding;
        let h = canvas.height;
        let w = canvas.width;
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);
        this.drawGrid(ctx);
        this.transform = (x: number, y: number) => {
            let tx = x / (this.maxX - this.minX) * (w - padding.left - padding.right) + padding.left;
            let ty = h - ((y - this.minY) / (this.maxY - this.minY) * (h - padding.top - padding.bottom) + padding.bottom);
            return {
                tx: tx,
                ty: ty
            }
        }
        this.drawChart(ctx);
        this.drawLegend(ctx);
    }
    drawChart = (ctx: any) => {
    }

    scale = (pts: Array<DataPoint>) => {
        for (const p of pts) {
            let y = p.y;
            if (y > this.maxY * 0.99) this.maxY = y * 1.05;
            if (y < this.minY * 1.01) this.minY = y * 0.95;

            let x = p.x;
            if (x > this.maxX * 0.99) this.maxX = x * 1.05;
            if (x < this.minX * 1.01) this.minX = x * 0.95;
        }
    }

    push = (pts: Array<DataPoint>) => {
        this.series.push(pts);
        return this;
    }

    steps: number = 0;
    shift = (pts: Array<DataPoint>, bufferSize: number = 100) => {
        this.steps++;
        if (this.steps >= bufferSize) {
            this.series.shift(pts);
        } else {
            this.push(pts);
        }
        return this;
    }

    autoScale = () => {
        let maxY = this.series.maxY();
        let minY = this.series.minY();

        if (maxY > this.maxY) this.maxY = Math.ceil(maxY * 1.05);
        if (minY < this.minY) this.minY = Math.floor(minY * .95);

        let minX = this.series.minX();
        let maxX = this.series.maxX();
        if (maxX > this.maxX) this.maxX = Math.ceil(maxX * 1.05);
        if (minX < this.minX) this.minX = Math.floor(minX * 0.95);

        return this;
    }
}

export class LineChart extends Chart {
    constructor(dim: number, options: any = {}) {
        super(dim, options);
    }

    drawChart = (ctx: any) => {
        let j = 0;

        for (const dataset of this.series.getDatasets()) {
            let data = dataset.getData();
            let pts = data.length;
            if (pts < 2) return;
            ctx.beginPath();
            ctx.strokeStyle = this.styles[j++ % this.styles.length];
            for (let i = 0; i < pts; i++) {
                let p = data[i];
                let transformedPos = this.transform ? this.transform(p.x, p.y, this) : { tx: 0, ty: 0 };
                if (i === 0) ctx.moveTo(transformedPos.tx, transformedPos.ty);
                else ctx.lineTo(transformedPos.tx, transformedPos.ty);
            }
            ctx.stroke();
            ctx.closePath();
        }

    }
}

export class TimeSeriesChart extends LineChart {
    constructor(dim: number, options: any = {}) {
        super(dim, options);
    }
}

export class BarChart extends Chart {
    constructor(dim: number, options: any = {}) {
        super(dim, options);
    }

    drawChart = (ctx: any) => {
        let data = this.series.getDatasets()[0].getData();
        let pts = data.length;
        ctx.strokeStyle = "red";
        for (let i = 0; i < pts; i++) {
            let p = data[i];
            if (p.opt?.color) {
                ctx.strokeStyle = p.opt.color;
            } else {
                ctx.strokeStyle = "red";
            }
            if (p.opt?.width) {
                ctx.lineWidth = p.opt.width;
            } else {
                ctx.lineWidth = 20;
            }
            ctx.beginPath()
            let transformedPos = this.transform ? this.transform(p.x, p.y) : { tx: 0, ty: 0 };
            let rect = this.drawingRect(ctx.canvas);
            ctx.moveTo(transformedPos.tx, rect.b);
            ctx.lineTo(transformedPos.tx, transformedPos.ty);
            ctx.stroke();
            ctx.closePath();
        }

    }
}
export class ScatterChart extends Chart {
    constructor(dim: number, options: any = {}) {
        super(dim, options);
    }
    drawChart = (ctx: any) => {
        this.series.getDatasets().forEach((dataset, idx: number) => {
            let data = dataset.getData();
            let pts = data.length;
            if (pts < 2) return;
            ctx.strokeStyle = "red";
            ctx.beginPath()
            for (let i = 0; i < pts; i++) {
                let p = data[i];
                let transformedPos = this.transform ? this.transform(p.x, p.y, this) : { tx: 0, ty: 0 };
                let c = new Circle(transformedPos.tx, transformedPos.ty, 5, {});
                c.draw(ctx);
            }
            ctx.stroke();
            ctx.closePath();
        });
    }
}
export class PieChart extends Chart {
    constructor(dim: number, options: any = {}) {
        super(dim, options);
    }
    drawGrid = (ctx: any) => {
        //does nothing
    }
    drawChart = (ctx: any) => {
        let dataset = this.series.getDatasets()[0].getData();
        let total = 0;
        let canvas = ctx.canvas;
        let data = dataset.map((d) => d.y);
        for (let e = 0; e < dataset.length; e++) {
            total += dataset[e].y;
        }
        var lastEnd = 0;
        for (var i = 0; i < data.length; i++) {
            ctx.fillStyle = dataset[i].opt?.color ? dataset[i].opt.color :
                this.styles[i % this.styles.length];
            ;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.arc(
                canvas.width / 2,  // x
                canvas.height / 2, // y
                canvas.height / 2, // radius
                lastEnd,           // startingAngle (radians)
                lastEnd + Math.PI * 2 * (data[i] / total), // endingAngle (radians)
                false // antiClockwise (boolean)
            );
            ctx.lineTo(canvas.width / 2, canvas.height / 2);
            ctx.fill();
            lastEnd += Math.PI * 2 * (data[i] / total);
        }
    }
}
