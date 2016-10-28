export class Canvas {
    constructor(domSelector) {
        this._canvas = document.querySelector(domSelector);
        
        if (!this._canvas || !this._canvas.tagName || this._canvas.tagName.toLowerCase() != 'canvas') {
            throw new Error('Element should be a canvas tag');
        }

        this._context = this.canvas.getContext('2d');
        this.layers = [];

        this.start();
    }

    setSize(w, h) {
        this.width = w;
        this.height = h;
    }

    get width() {
        return this._canvas.width;
    }
    set width(w) {
        this._canvas.width = w;
    }

    get height() {
        return this._canvas.height;
    }
    set height(h) {
        this._canvas.height = h;
    }

    render() {
        this._context.clearRect(0, 0, this.width, this.height);
        if (!this.Layers.length) {
            return;
        }

        this.layers
            .filter(layer => layer.isVisible())
            .forEach(layer => layer.render(this._context));
    }

    start() {
    }
}