webpackJsonp([3],{

/***/ 292:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactDom = __webpack_require__(35);\n\nvar _reactDom2 = _interopRequireDefault(_reactDom);\n\nvar _Icons = __webpack_require__(293);\n\nvar _Icons2 = _interopRequireDefault(_Icons);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar Icons = function (_React$Component) {\n    _inherits(Icons, _React$Component);\n\n    function Icons(props) {\n        _classCallCheck(this, Icons);\n\n        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Icons).call(this, props));\n\n        _this.componentDidMount = function () {\n            var canvas = _reactDom2.default.findDOMNode(_this.refs['canvas']);\n            canvas.width = 1024;\n            canvas.height = 600;\n\n            var context = canvas.getContext('2d');\n            if (!context) {\n                return;\n            }\n            //arrow\n            _this.drarArrow(context, 1, 0, 0, 1, 0, 0);\n\n            //star\n            _this.drawStar(context, 250, 60, 20, 0);\n\n            //RoundRect\n            _this.drawRoundRect(context, 350, 20, 120, 80, 10);\n\n            //Moon\n            _this.drawMoon(context, 500, 70, 40, 20, 0);\n        };\n\n        _this.setPaths = function (context, points) {\n            var len = points.length;\n            context.beginPath();\n            for (var i = 0; i < len; i++) {\n                context.lineTo(points[i].x, points[i].y);\n            }\n            context.closePath();\n        };\n\n        _this.drawStar = function (context, x, y, R, rot) {\n            context.save();\n            context.transform(R, 0, 0, R, x, y);\n            context.rotate(rot / 180 * Math.PI);\n            _this.starPath(context);\n            context.fillStyle = '#fb3';\n            context.strokeStyle = '#fb5';\n            context.fill();\n            context.stroke();\n            context.restore();\n        };\n\n        _this.starPath = function (context) {\n            context.beginPath();\n            for (var i = 0; i < 5; i++) {\n                context.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI), -Math.sin((18 + i * 72) / 180 * Math.PI));\n                context.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * 0.5, -Math.sin((54 + i * 72) / 180 * Math.PI) * 0.5);\n            }\n            context.closePath();\n        };\n\n        return _this;\n    }\n\n    _createClass(Icons, [{\n        key: 'render',\n        value: function render() {\n            return _react2.default.createElement(\n                'canvas',\n                { ref: 'canvas', className: _Icons2.default.canvas },\n                '该浏览器不支持canvas,请切换浏览器！'\n            );\n        }\n    }, {\n        key: 'drarArrow',\n        value: function drarArrow(context) {\n            context.save();\n\n            for (var _len = arguments.length, transform = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n                transform[_key - 1] = arguments[_key];\n            }\n\n            context.transform.apply(context, transform);\n            this.arrowPath(context);\n\n            context.fillStyle = '#008888';\n            context.fill();\n            context.stroke();\n\n            context.restore();\n        }\n    }, {\n        key: 'arrowPath',\n        value: function arrowPath(context) {\n            context.beginPath();\n            context.lineTo(50, 50);\n            context.lineTo(125, 50);\n            context.lineTo(125, 20);\n            context.lineTo(150, 60);\n            context.lineTo(125, 100);\n            context.lineTo(125, 70);\n            context.lineTo(50, 70);\n            context.closePath();\n        }\n    }, {\n        key: 'drawRoundRect',\n        value: function drawRoundRect(context, x, y, width, height, radius) {\n            if (2 * radius > width || 2 * radius > height) {\n                return;\n            }\n            context.save();\n            context.translate(x, y);\n            this.roundRectPath(context, width, height, radius);\n            context.strokeStyle = '#000';\n            context.stroke();\n            context.restore();\n        }\n    }, {\n        key: 'roundRectPath',\n        value: function roundRectPath(context, width, height, radius) {\n            context.beginPath();\n            context.arc(width - radius, height - radius, radius, 0, Math.PI / 2);\n            context.lineTo(radius, height);\n            context.arc(radius, height - radius, radius, 0.5 * Math.PI, Math.PI);\n            context.lineTo(0, height - radius);\n            context.arc(radius, radius, radius, Math.PI, 1.5 * Math.PI);\n            context.lineTo(width - radius, 0);\n            context.arc(width - radius, radius, radius, 1.5 * Math.PI, 2 * Math.PI);\n            context.closePath();\n        }\n    }, {\n        key: 'drawMoon',\n        value: function drawMoon(context, x, y, R, d, rotate, color) {\n            context.save();\n            context.rotate(rotate / 180 * Math.PI);\n            context.translate(x, y);\n            this.moonPath(context, R, d);\n            context.fillStyle = color || 'yellow';\n            context.fill();\n            context.restore();\n        }\n    }, {\n        key: 'moonPath',\n        value: function moonPath(context, R, d) {\n            context.beginPath();\n            context.arc(0, 0, R, Math.PI * 0.5, Math.PI * 1.5, true);\n            context.arc(-d, 0, Math.sqrt(Math.pow(R, 2) + Math.pow(d, 2)), -Math.atan(R / d), Math.atan(R / d));\n            context.closePath();\n        }\n    }]);\n\n    return Icons;\n}(_react2.default.Component);\n\nmodule.exports = Icons;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/demos/routes/canvas/2d/icons/Icons.js\n ** module id = 292\n ** module chunks = 3\n **/\n//# sourceURL=webpack:///./src/entry/routes/demos/routes/canvas/2d/icons/Icons.js?");

/***/ },

/***/ 293:
/***/ function(module, exports, __webpack_require__) {

	eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(294);\nif(typeof content === 'string') content = [[module.id, content, '']];\n// add the styles to the DOM\nvar update = __webpack_require__(261)(content, {});\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {\n\t// When the styles change, update the <style> tags\n\tif(!content.locals) {\n\t\tmodule.hot.accept(\"!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./Icons.scss\", function() {\n\t\t\tvar newContent = require(\"!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./Icons.scss\");\n\t\t\tif(typeof newContent === 'string') newContent = [[module.id, newContent, '']];\n\t\t\tupdate(newContent);\n\t\t});\n\t}\n\t// When the module is disposed, remove the <style> tags\n\tmodule.hot.dispose(function() { update(); });\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/demos/routes/canvas/2d/icons/Icons.scss\n ** module id = 293\n ** module chunks = 3\n **/\n//# sourceURL=webpack:///./src/entry/routes/demos/routes/canvas/2d/icons/Icons.scss?");

/***/ },

/***/ 294:
/***/ function(module, exports, __webpack_require__) {

	eval("exports = module.exports = __webpack_require__(260)();\n// imports\n\n\n// module\nexports.push([module.id, \"canvas {\\n  position: relative;\\n  display: block;\\n  margin: 50px auto;\\n  border: 1px solid #c3c3c3; }\\n\", \"\"]);\n\n// exports\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./~/postcss-loader!./~/sass-loader!./src/entry/routes/demos/routes/canvas/2d/icons/Icons.scss\n ** module id = 294\n ** module chunks = 3\n **/\n//# sourceURL=webpack:///./src/entry/routes/demos/routes/canvas/2d/icons/Icons.scss?./~/css-loader?modules&importLoaders=1&localIdentName=%5Bname%5D__%5Blocal%5D___%5Bhash:base64:5%5D!./~/postcss-loader!./~/sass-loader");

/***/ }

});