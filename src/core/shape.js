const DEFAULT_OPTIONS = {
    visible: true
};

export class Shape {
    constructor(points, options) {
        this._points = points;
        this._options = Object.assign({}, DEFAULT_OPTIONS, options || {});
    }

    render(context) {
        let lastPoint = this._points[this._points.length - 1];

        context.beginPath();
        context.moveTo(lastPoint.x, lastPoint.y);

        this._points.forEach(point => {
            context.lineTo(point.x, point.y);
        });
        
        context.stroke();
    }

    isVisible() {
        return !!this._options.visible;
    }
}