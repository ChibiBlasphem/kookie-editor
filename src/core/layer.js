let uid = 0;

const DEFAULT_OPTIONS = {
    visible: true,
    zIndex: 100
};

export class Layer {
    constructor(name, options) {
        if (typeof name == 'object') {
            options = name;
            name = undefined;
        }

        this._options = Object.assign({}, DEFAULT_OPTIONS, options || {});
        this._name = name || `UserLayer_${++uid}`;

        this.shapes = [];
    }

    render(context) {
        this.shapes
            .filter(shape => shape.isVisible())
            .forEach(shape => shape.render(context));
    }

    isVisible() {
        return !!this._options.visible;
    }
}