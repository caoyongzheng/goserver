webpackJsonp([2],{

/***/ 286:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _digit = __webpack_require__(287);\n\nvar _digit2 = _interopRequireDefault(_digit);\n\nvar _CountDown = __webpack_require__(288);\n\nvar _CountDown2 = _interopRequireDefault(_CountDown);\n\nvar _lodash = __webpack_require__(241);\n\nvar _lodash2 = _interopRequireDefault(_lodash);\n\nvar _Models = __webpack_require__(290);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar Colors = ['#000000', '003333', '#006666', '#009999', '#00CCCC', '#00FFFF', '#3300CC', '#333399', '#336666', '#339933', '#33CC00', '#33FF33', '#660066', '#663399', '#6666CC', '#6699FF', '#66CCCC', '#66FF99', '#9900CC', '#9933FF', '#9966CC', '#999999', '#99CC66', '#99FF33', '#CC0000', '#CC3333', '#CC6666', '#CC9999'];\n\nvar randomUitl = new _Models.RandomUitl(Colors.length, 80, -300);\n\nvar CountDown = function (_React$Component) {\n    _inherits(CountDown, _React$Component);\n\n    function CountDown(props) {\n        _classCallCheck(this, CountDown);\n\n        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CountDown).call(this, props));\n\n        _this.updateMotionBalls = function (motionBalls) {\n            _lodash2.default.forOwn(motionBalls, function (motionBall, key) {\n                motionBall.vY += motionBall.g / _this.Frequency;\n                motionBall.x += motionBall.vX / _this.Frequency;\n                motionBall.y += motionBall.vY / _this.Frequency;\n\n                if (motionBall.y + _this.Radius > _this.height && motionBall.vY > 0) {\n                    motionBall.vY = -motionBall.vY * 0.75;\n                    motionBall.y = _this.height - _this.Radius;\n                }\n\n                if (motionBall.isOut(_this.width, _this.height)) {\n                    _lodash2.default.unset(motionBalls, key);\n                }\n            });\n        };\n\n        _this.getTime = function () {\n            var seconds = Math.round((_this.endTime.getTime() - new Date().getTime()) / 1000);\n            var totalSeconds = Math.max(seconds, 0);\n            var hour = Math.floor(totalSeconds / 3600 % 99);\n            var minute = Math.floor(totalSeconds % 3600 / 60);\n            var second = totalSeconds % 60;\n            return [parseInt(hour / 10), parseInt(hour % 10), 10, parseInt(minute / 10), parseInt(minute % 10), 10, parseInt(second / 10), parseInt(second % 10)];\n        };\n\n        _this.getTimeDigits = function (timeItems) {\n            var digits = [];\n\n            var currentTop = _this.Top;\n            var currentLeft = _this.Left;\n\n            for (var i = 0; i < timeItems.length; i++) {\n                digits.push(_this.getDigitBalls(_digit2.default[timeItems[i]], currentLeft, currentTop, _this.Radius, _this.color));\n                currentLeft += digits[i].width + _this.DigitBlank;\n            }\n            return digits;\n        };\n\n        _this.getDigitBalls = function (d, x, y, radius, color) {\n            var balls = [];\n            for (var i = 0; i < d.length; i++) {\n                for (var j = 0; j < d[i].length; j++) {\n                    if (d[i][j] == 1) {\n                        balls.push(new _Models.Ball(x + (2 * j + 1) * (radius + 1), y + (2 * i + 1) * (radius + 1), radius, color));\n                    }\n                }\n            }\n            return new _Models.Balls(x, y, balls, d[0].length * 2 * (_this.Radius + _this.RadiusBlank));\n        };\n\n        _this.renderMotionBalls = function (motionBalls, context) {\n            _lodash2.default.forOwn(motionBalls, function (motionBall) {\n                motionBall.render(context);\n            });\n        };\n\n        _this.width = 1024;\n        _this.height = 600;\n        _this.Top = 200;\n        _this.Left = 200;\n        _this.Radius = 5;\n        _this.RadiusBlank = 1;\n        _this.DigitBlank = 8;\n        _this.Frequency = 20;\n        _this.color = '#228855';\n\n        _this.endTime = new Date();\n        _this.endTime.setTime(_this.endTime.getTime() + 3600 * 1000);\n        return _this;\n    }\n\n    _createClass(CountDown, [{\n        key: 'componentDidMount',\n        value: function componentDidMount() {\n            var _this2 = this;\n\n            var canvas = document.getElementById('canvas');\n            canvas.width = this.width;\n            canvas.height = this.height;\n\n            var context = canvas.getContext('2d');\n\n            this.lastTime = this.getTime();\n            var digitsBalls = this.getTimeDigits(this.lastTime);\n            var motionBalls = new Object();\n            this.setI = setInterval(function () {\n                //update\n                var lastTime = _this2.getTime();\n\n                if (_this2.lastTime[7] != lastTime[7]) {\n                    digitsBalls = _this2.getTimeDigits(lastTime);\n                    _this2.setNewMotionBalls(motionBalls, digitsBalls, _this2.lastTime, lastTime);\n                    _this2.lastTime = lastTime;\n                }\n                _this2.updateMotionBalls(motionBalls, context);\n                //init\n                context.clearRect(0, 0, _this2.width, _this2.height);\n\n                //render\n                //render digists\n                for (var i = 0; i < digitsBalls.length; i++) {\n                    digitsBalls[i].render(context);\n                }\n                //render MotionBalls\n                _this2.renderMotionBalls(motionBalls, context);\n            }, 1000 / this.Frequency);\n        }\n    }, {\n        key: 'componentWillUnmount',\n        value: function componentWillUnmount() {\n            clearInterval(this.setI);\n        }\n    }, {\n        key: 'render',\n        value: function render() {\n            return _react2.default.createElement(\n                'canvas',\n                { id: 'canvas', className: _CountDown2.default.canvas },\n                '该浏览器不支持canvas,请切换浏览器！'\n            );\n        }\n    }, {\n        key: 'setNewMotionBalls',\n        value: function setNewMotionBalls(motionBalls, digitsBalls, lastTime1, lastTime2) {\n            for (var i = 0; i < lastTime1.length; i++) {\n                if (lastTime1[i] != lastTime2[i]) {\n                    var balls = digitsBalls[i].elems;\n                    var len = balls.length;\n                    for (var j = 0; j < len; j++) {\n                        motionBalls[_lodash2.default.uniqueId()] = new _Models.MotionBall(randomUitl.getV(), randomUitl.getY(), 1000, balls[j].x, balls[j].y, balls[j].radius, Colors[randomUitl.getLen()]);\n                    }\n                }\n            }\n        }\n    }]);\n\n    return CountDown;\n}(_react2.default.Component);\n\nmodule.exports = CountDown;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/demos/routes/canvas/2d/countdown/Countdown.js\n ** module id = 286\n ** module chunks = 2\n **/\n//# sourceURL=webpack:///./src/entry/routes/demos/routes/canvas/2d/countdown/Countdown.js?");

/***/ },

/***/ 287:
/***/ function(module, exports) {

	eval("\"use strict\";\n\nmodule.exports = [[[0, 0, 1, 1, 1, 0, 0], [0, 1, 1, 0, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 0, 1, 1, 0], [0, 0, 1, 1, 1, 0, 0]], //0\n[[0, 0, 0, 1, 1, 0, 0], [0, 1, 1, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [1, 1, 1, 1, 1, 1, 1]], //1\n[[0, 1, 1, 1, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 1, 1, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 1, 1, 1, 1, 1]], //2\n[[1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0]], //3\n[[0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1, 0], [0, 0, 1, 1, 1, 1, 0], [0, 1, 1, 0, 1, 1, 0], [1, 1, 0, 0, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1, 1]], //4\n[[1, 1, 1, 1, 1, 1, 1], [1, 1, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0]], //5\n[[0, 0, 0, 0, 1, 1, 0], [0, 0, 1, 1, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0], [1, 1, 0, 1, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0]], //6\n[[1, 1, 1, 1, 1, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 1, 1, 0, 0, 0], [0, 0, 1, 1, 0, 0, 0], [0, 0, 1, 1, 0, 0, 0], [0, 0, 1, 1, 0, 0, 0]], //7\n[[0, 1, 1, 1, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0]], //8\n[[0, 1, 1, 1, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 0, 0], [0, 1, 1, 0, 0, 0, 0]], //9\n[[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]] //:\n];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/demos/routes/canvas/2d/countdown/digit.js\n ** module id = 287\n ** module chunks = 2\n **/\n//# sourceURL=webpack:///./src/entry/routes/demos/routes/canvas/2d/countdown/digit.js?");

/***/ },

/***/ 288:
/***/ function(module, exports, __webpack_require__) {

	eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(289);\nif(typeof content === 'string') content = [[module.id, content, '']];\n// add the styles to the DOM\nvar update = __webpack_require__(261)(content, {});\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {\n\t// When the styles change, update the <style> tags\n\tif(!content.locals) {\n\t\tmodule.hot.accept(\"!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./CountDown.scss\", function() {\n\t\t\tvar newContent = require(\"!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./CountDown.scss\");\n\t\t\tif(typeof newContent === 'string') newContent = [[module.id, newContent, '']];\n\t\t\tupdate(newContent);\n\t\t});\n\t}\n\t// When the module is disposed, remove the <style> tags\n\tmodule.hot.dispose(function() { update(); });\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/demos/routes/canvas/2d/countdown/CountDown.scss\n ** module id = 288\n ** module chunks = 2\n **/\n//# sourceURL=webpack:///./src/entry/routes/demos/routes/canvas/2d/countdown/CountDown.scss?");

/***/ },

/***/ 289:
/***/ function(module, exports, __webpack_require__) {

	eval("exports = module.exports = __webpack_require__(260)();\n// imports\n\n\n// module\nexports.push([module.id, \".CountDown__canvas___6ON7C {\\n  position: relative;\\n  display: block;\\n  margin: 50px auto;\\n  border: 1px solid #c3c3c3; }\\n\", \"\"]);\n\n// exports\nexports.locals = {\n\t\"canvas\": \"CountDown__canvas___6ON7C\"\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./~/postcss-loader!./~/sass-loader!./src/entry/routes/demos/routes/canvas/2d/countdown/CountDown.scss\n ** module id = 289\n ** module chunks = 2\n **/\n//# sourceURL=webpack:///./src/entry/routes/demos/routes/canvas/2d/countdown/CountDown.scss?./~/css-loader?modules&importLoaders=1&localIdentName=%5Bname%5D__%5Blocal%5D___%5Bhash:base64:5%5D!./~/postcss-loader!./~/sass-loader");

/***/ },

/***/ 290:
/***/ function(module, exports) {

	eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar RandomUitl = exports.RandomUitl = function () {\n    function RandomUitl(len, v, y) {\n        _classCallCheck(this, RandomUitl);\n\n        this.len = len;\n        this.v = v;\n        this.y = y;\n    }\n\n    _createClass(RandomUitl, [{\n        key: \"getLen\",\n        value: function getLen() {\n            return Math.floor(Math.random() * this.len);\n        }\n    }, {\n        key: \"getV\",\n        value: function getV() {\n            return Math.pow(-1, Math.round(Math.random() * 1000)) * (this.v + this.v * (Math.random() - 0.5) * 0.5);\n        }\n    }, {\n        key: \"getY\",\n        value: function getY() {\n            return this.y + this.y * (Math.random() - 0.5) * 0.3;\n        }\n    }]);\n\n    return RandomUitl;\n}();\n\n//Ball 球（静态）\n\n\nvar Ball = exports.Ball = function Ball(x, y, radius, color) {\n    var _this = this;\n\n    _classCallCheck(this, Ball);\n\n    this.render = function (context) {\n        context.fillStyle = _this.color;\n        context.beginPath();\n        context.arc(_this.x, _this.y, _this.radius, 0, 2 * Math.PI);\n        context.closePath();\n        context.fill();\n    };\n\n    this.x = x;\n    this.y = y;\n    this.radius = radius;\n    this.color = color;\n};\n\n//MotionBall 球（动态）\n\n\nvar MotionBall = exports.MotionBall = function (_Ball) {\n    _inherits(MotionBall, _Ball);\n\n    function MotionBall(vX, vY, g) {\n        var _Object$getPrototypeO;\n\n        _classCallCheck(this, MotionBall);\n\n        for (var _len = arguments.length, ball = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {\n            ball[_key - 3] = arguments[_key];\n        }\n\n        var _this2 = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(MotionBall)).call.apply(_Object$getPrototypeO, [this].concat(ball)));\n\n        _this2.isOut = function (width, height) {\n            return _this2.x + _this2.radius < 0 || _this2.x - _this2.radius > width || _this2.y + _this2.radius < 0 || _this2.y - _this2.radius > height;\n        };\n\n        _this2.vX = vX;\n        _this2.vY = vY;\n        _this2.g = g;\n        return _this2;\n    }\n\n    return MotionBall;\n}(Ball);\n\n//Balls 球组成的多球对象（可能是数字或其他）\n\n\nvar Balls = exports.Balls = function Balls(x, y, elems, width, height) {\n    var _this3 = this;\n\n    _classCallCheck(this, Balls);\n\n    this.render = function (context) {\n        var len = _this3.elems.length;\n        for (var i = 0; i < len; i++) {\n            _this3.elems[i].render(context);\n        }\n    };\n\n    this.x = x;\n    this.y = y;\n    this.width = width;\n    this.height = height;\n    this.elems = elems;\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/demos/routes/canvas/2d/countdown/Models.js\n ** module id = 290\n ** module chunks = 2\n **/\n//# sourceURL=webpack:///./src/entry/routes/demos/routes/canvas/2d/countdown/Models.js?");

/***/ }

});