(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Canvas = exports.Canvas = function () {
    function Canvas(domSelector) {
        _classCallCheck(this, Canvas);

        this.canvas = document.querySelector(domSelector);

        if (!this.canvas || !this.canvas.tagName || this.canvas.tagName.toLowerCase() != 'canvas') {
            throw new Error('Element should be a canvas tag');
        }

        this.context = this.canvas.getContext('2d');
        this.layers = [];
    }

    _createClass(Canvas, [{
        key: 'setSize',
        value: function setSize(w, h) {
            this.width = w;
            this.height = h;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            this.context.clearRect(0, 0, this.width, this.height);

            this.layers.filter(function (layer) {
                return layer.isVisible();
            }).forEach(function (layer) {
                return layer.render(_this.context);
            });
        }
    }, {
        key: 'width',
        get: function get() {
            return this.canvas.width;
        },
        set: function set(w) {
            this.canvas.width = w;
        }
    }, {
        key: 'height',
        get: function get() {
            return this.canvas.height;
        },
        set: function set(h) {
            this.canvas.height = h;
        }
    }]);

    return Canvas;
}();

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uid = 0;

var DEFAULT_OPTIONS = {
    visible: true,
    zIndex: 100
};

var Layer = exports.Layer = function () {
    function Layer(name, options) {
        _classCallCheck(this, Layer);

        if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) == 'object') {
            options = name;
            name = undefined;
        }

        this._options = Object.assign({}, DEFAULT_OPTIONS, options || {});
        this._name = name || 'UserLayer_' + ++uid;

        this.shapes = [];
    }

    _createClass(Layer, [{
        key: 'render',
        value: function render(context) {
            this.shapes.filter(function (shape) {
                return shape.isVisible();
            }).forEach(function (shape) {
                return shape.render(context);
            });
        }
    }, {
        key: 'isVisible',
        value: function isVisible() {
            return !!this._options.visible;
        }
    }]);

    return Layer;
}();

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_OPTIONS = {
    visible: true
};

var Shape = exports.Shape = function () {
    function Shape(points, options) {
        _classCallCheck(this, Shape);

        this._points = points;
        this._options = Object.assign({}, DEFAULT_OPTIONS, options || {});
    }

    _createClass(Shape, [{
        key: "render",
        value: function render(context) {
            var lastPoint = this._points[this._points.length - 1];

            context.beginPath();
            context.moveTo(lastPoint.x, lastPoint.y);

            this._points.forEach(function (point) {
                context.lineTo(point.x, point.y);
            });

            context.stroke();
        }
    }, {
        key: "isVisible",
        value: function isVisible() {
            return !!this._options.visible;
        }
    }]);

    return Shape;
}();

},{}],4:[function(require,module,exports){
'use strict';

var _canvas = require('./core/canvas');

var _layer = require('./core/layer');

var _shape = require('./core/shape');

var Kookie = { Canvas: _canvas.Canvas, Layer: _layer.Layer, Shape: _shape.Shape };

window.Kookie = Kookie;

},{"./core/canvas":1,"./core/layer":2,"./core/shape":3}]},{},[4]);
