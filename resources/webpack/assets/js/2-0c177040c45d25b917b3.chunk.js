webpackJsonp([2],{

/***/ 252:
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },

/***/ 253:
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(true) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },

/***/ 273:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _digit = __webpack_require__(274);
	
	var _digit2 = _interopRequireDefault(_digit);
	
	var _CountDown = __webpack_require__(275);
	
	var _CountDown2 = _interopRequireDefault(_CountDown);
	
	var _lodash = __webpack_require__(236);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _Models = __webpack_require__(277);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Colors = ['#000000', '003333', '#006666', '#009999', '#00CCCC', '#00FFFF', '#3300CC', '#333399', '#336666', '#339933', '#33CC00', '#33FF33', '#660066', '#663399', '#6666CC', '#6699FF', '#66CCCC', '#66FF99', '#9900CC', '#9933FF', '#9966CC', '#999999', '#99CC66', '#99FF33', '#CC0000', '#CC3333', '#CC6666', '#CC9999'];
	
	var randomUitl = new _Models.RandomUitl(Colors.length, 80, -300);
	
	var CountDown = function (_React$Component) {
	    _inherits(CountDown, _React$Component);
	
	    function CountDown(props) {
	        _classCallCheck(this, CountDown);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CountDown).call(this, props));
	
	        _this.updateMotionBalls = function (motionBalls) {
	            _lodash2.default.forOwn(motionBalls, function (motionBall, key) {
	                motionBall.vY += motionBall.g / _this.Frequency;
	                motionBall.x += motionBall.vX / _this.Frequency;
	                motionBall.y += motionBall.vY / _this.Frequency;
	
	                if (motionBall.y + _this.Radius > _this.height && motionBall.vY > 0) {
	                    motionBall.vY = -motionBall.vY * 0.75;
	                    motionBall.y = _this.height - _this.Radius;
	                }
	
	                if (motionBall.isOut(_this.width, _this.height)) {
	                    _lodash2.default.unset(motionBalls, key);
	                }
	            });
	        };
	
	        _this.getTime = function () {
	            var seconds = Math.round((_this.endTime.getTime() - new Date().getTime()) / 1000);
	            var totalSeconds = Math.max(seconds, 0);
	            var hour = Math.floor(totalSeconds / 3600 % 99);
	            var minute = Math.floor(totalSeconds % 3600 / 60);
	            var second = totalSeconds % 60;
	            return [parseInt(hour / 10), parseInt(hour % 10), 10, parseInt(minute / 10), parseInt(minute % 10), 10, parseInt(second / 10), parseInt(second % 10)];
	        };
	
	        _this.getTimeDigits = function (timeItems) {
	            var digits = [];
	
	            var currentTop = _this.Top;
	            var currentLeft = _this.Left;
	
	            for (var i = 0; i < timeItems.length; i++) {
	                digits.push(_this.getDigitBalls(_digit2.default[timeItems[i]], currentLeft, currentTop, _this.Radius, _this.color));
	                currentLeft += digits[i].width + _this.DigitBlank;
	            }
	            return digits;
	        };
	
	        _this.getDigitBalls = function (d, x, y, radius, color) {
	            var balls = [];
	            for (var i = 0; i < d.length; i++) {
	                for (var j = 0; j < d[i].length; j++) {
	                    if (d[i][j] == 1) {
	                        balls.push(new _Models.Ball(x + (2 * j + 1) * (radius + 1), y + (2 * i + 1) * (radius + 1), radius, color));
	                    }
	                }
	            }
	            return new _Models.Balls(x, y, balls, d[0].length * 2 * (_this.Radius + _this.RadiusBlank));
	        };
	
	        _this.renderMotionBalls = function (motionBalls, context) {
	            _lodash2.default.forOwn(motionBalls, function (motionBall) {
	                motionBall.render(context);
	            });
	        };
	
	        _this.width = 1024;
	        _this.height = 600;
	        _this.Top = 200;
	        _this.Left = 200;
	        _this.Radius = 5;
	        _this.RadiusBlank = 1;
	        _this.DigitBlank = 8;
	        _this.Frequency = 20;
	        _this.color = '#228855';
	
	        _this.endTime = new Date();
	        _this.endTime.setTime(_this.endTime.getTime() + 3600 * 1000);
	        return _this;
	    }
	
	    _createClass(CountDown, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var _this2 = this;
	
	            var canvas = document.getElementById('canvas');
	            canvas.width = this.width;
	            canvas.height = this.height;
	
	            var context = canvas.getContext('2d');
	
	            this.lastTime = this.getTime();
	            var digitsBalls = this.getTimeDigits(this.lastTime);
	            var motionBalls = new Object();
	            this.setI = setInterval(function () {
	                //update
	                var lastTime = _this2.getTime();
	
	                if (_this2.lastTime[7] != lastTime[7]) {
	                    digitsBalls = _this2.getTimeDigits(lastTime);
	                    _this2.setNewMotionBalls(motionBalls, digitsBalls, _this2.lastTime, lastTime);
	                    _this2.lastTime = lastTime;
	                }
	                _this2.updateMotionBalls(motionBalls, context);
	                //init
	                context.clearRect(0, 0, _this2.width, _this2.height);
	
	                //render
	                //render digists
	                for (var i = 0; i < digitsBalls.length; i++) {
	                    digitsBalls[i].render(context);
	                }
	                //render MotionBalls
	                _this2.renderMotionBalls(motionBalls, context);
	            }, 1000 / this.Frequency);
	        }
	    }, {
	        key: 'componentWillUnmount',
	        value: function componentWillUnmount() {
	            clearInterval(this.setI);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                'canvas',
	                { id: 'canvas', className: _CountDown2.default.canvas },
	                '该浏览器不支持canvas,请切换浏览器！'
	            );
	        }
	    }, {
	        key: 'setNewMotionBalls',
	        value: function setNewMotionBalls(motionBalls, digitsBalls, lastTime1, lastTime2) {
	            for (var i = 0; i < lastTime1.length; i++) {
	                if (lastTime1[i] != lastTime2[i]) {
	                    var balls = digitsBalls[i].elems;
	                    var len = balls.length;
	                    for (var j = 0; j < len; j++) {
	                        motionBalls[_lodash2.default.uniqueId()] = new _Models.MotionBall(randomUitl.getV(), randomUitl.getY(), 1000, balls[j].x, balls[j].y, balls[j].radius, Colors[randomUitl.getLen()]);
	                    }
	                }
	            }
	        }
	    }]);
	
	    return CountDown;
	}(_react2.default.Component);
	
	module.exports = CountDown;

/***/ },

/***/ 274:
/***/ function(module, exports) {

	"use strict";
	
	module.exports = [[[0, 0, 1, 1, 1, 0, 0], [0, 1, 1, 0, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 0, 1, 1, 0], [0, 0, 1, 1, 1, 0, 0]], //0
	[[0, 0, 0, 1, 1, 0, 0], [0, 1, 1, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [1, 1, 1, 1, 1, 1, 1]], //1
	[[0, 1, 1, 1, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 1, 1, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 1, 1, 1, 1, 1]], //2
	[[1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0]], //3
	[[0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1, 0], [0, 0, 1, 1, 1, 1, 0], [0, 1, 1, 0, 1, 1, 0], [1, 1, 0, 0, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1, 1]], //4
	[[1, 1, 1, 1, 1, 1, 1], [1, 1, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0]], //5
	[[0, 0, 0, 0, 1, 1, 0], [0, 0, 1, 1, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0], [1, 1, 0, 1, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0]], //6
	[[1, 1, 1, 1, 1, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 1, 1, 0, 0, 0], [0, 0, 1, 1, 0, 0, 0], [0, 0, 1, 1, 0, 0, 0], [0, 0, 1, 1, 0, 0, 0]], //7
	[[0, 1, 1, 1, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0]], //8
	[[0, 1, 1, 1, 1, 1, 0], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1], [0, 1, 1, 1, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 0, 0], [0, 1, 1, 0, 0, 0, 0]], //9
	[[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]] //:
	];

/***/ },

/***/ 275:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(276);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./CountDown.scss", function() {
				var newContent = require("!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./CountDown.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 276:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".CountDown__canvas___6ON7C {\n  position: relative;\n  display: block;\n  margin: 50px auto;\n  border: 1px solid #c3c3c3; }\n", ""]);
	
	// exports
	exports.locals = {
		"canvas": "CountDown__canvas___6ON7C"
	};

/***/ },

/***/ 277:
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var RandomUitl = exports.RandomUitl = function () {
	    function RandomUitl(len, v, y) {
	        _classCallCheck(this, RandomUitl);
	
	        this.len = len;
	        this.v = v;
	        this.y = y;
	    }
	
	    _createClass(RandomUitl, [{
	        key: "getLen",
	        value: function getLen() {
	            return Math.floor(Math.random() * this.len);
	        }
	    }, {
	        key: "getV",
	        value: function getV() {
	            return Math.pow(-1, Math.round(Math.random() * 1000)) * (this.v + this.v * (Math.random() - 0.5) * 0.5);
	        }
	    }, {
	        key: "getY",
	        value: function getY() {
	            return this.y + this.y * (Math.random() - 0.5) * 0.3;
	        }
	    }]);
	
	    return RandomUitl;
	}();
	
	//Ball 球（静态）
	
	
	var Ball = exports.Ball = function Ball(x, y, radius, color) {
	    var _this = this;
	
	    _classCallCheck(this, Ball);
	
	    this.render = function (context) {
	        context.fillStyle = _this.color;
	        context.beginPath();
	        context.arc(_this.x, _this.y, _this.radius, 0, 2 * Math.PI);
	        context.closePath();
	        context.fill();
	    };
	
	    this.x = x;
	    this.y = y;
	    this.radius = radius;
	    this.color = color;
	};
	
	//MotionBall 球（动态）
	
	
	var MotionBall = exports.MotionBall = function (_Ball) {
	    _inherits(MotionBall, _Ball);
	
	    function MotionBall(vX, vY, g) {
	        var _Object$getPrototypeO;
	
	        _classCallCheck(this, MotionBall);
	
	        for (var _len = arguments.length, ball = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
	            ball[_key - 3] = arguments[_key];
	        }
	
	        var _this2 = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(MotionBall)).call.apply(_Object$getPrototypeO, [this].concat(ball)));
	
	        _this2.isOut = function (width, height) {
	            return _this2.x + _this2.radius < 0 || _this2.x - _this2.radius > width || _this2.y + _this2.radius < 0 || _this2.y - _this2.radius > height;
	        };
	
	        _this2.vX = vX;
	        _this2.vY = vY;
	        _this2.g = g;
	        return _this2;
	    }
	
	    return MotionBall;
	}(Ball);
	
	//Balls 球组成的多球对象（可能是数字或其他）
	
	
	var Balls = exports.Balls = function Balls(x, y, elems, width, height) {
	    var _this3 = this;
	
	    _classCallCheck(this, Balls);
	
	    this.render = function (context) {
	        var len = _this3.elems.length;
	        for (var i = 0; i < len; i++) {
	            _this3.elems[i].render(context);
	        }
	    };
	
	    this.x = x;
	    this.y = y;
	    this.width = width;
	    this.height = height;
	    this.elems = elems;
	};

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzP2RhMDQqIiwid2VicGFjazovLy8uL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qcz9iOTgwKiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvMmQvY291bnRkb3duL0NvdW50ZG93bi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvMmQvY291bnRkb3duL2RpZ2l0LmpzIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy8yZC9jb3VudGRvd24vQ291bnREb3duLnNjc3M/M2M5ZSIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvMmQvY291bnRkb3duL0NvdW50RG93bi5zY3NzIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy8yZC9jb3VudGRvd24vTW9kZWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0EseUNBQXdDLGdCQUFnQjtBQUN4RCxLQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQVksb0JBQW9CO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBb0I7QUFDcEI7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RUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixDQUxKLEVBTUksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLENBTkosRUFPSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLENBQWIsQ0FQSixFQVFJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixDQVJKLEVBU0ksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLENBVEosRUFVSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLENBQWIsQ0FWSixDQWJXLEVBd0JUO0FBQ0YsRUFDSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLENBQWIsQ0FESixFQUVJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixDQUZKLEVBR0ksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLENBSEosRUFJSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLENBQWIsQ0FKSixFQUtJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixDQUxKLEVBTUksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFL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RUFBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLENBUkosRUFTSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLENBQWIsQ0FUSixFQVVJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixDQVZKLENBakRXLEVBNERUO0FBQ0YsRUFDSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLENBQWIsQ0FESixFQUVJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixDQUZKLEVBR0ksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLENBSEosRUFJSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLENBQWIsQ0FKSixFQUtJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixDQUxKLEVBTUksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLENBTkosRUFPSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLENBQWIsQ0FQSixFQVFJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixDQVJKLEVBU0ksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFB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QUssQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLENBQWIsQ0FESixFQUVJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixDQUZKLEVBR0ksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLENBSEosRUFJSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLENBQWIsQ0FKSixFQUtJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixDQUxKLEVBTUksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLENBTkosRUFPSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLENBQWIsQ0FQSixFQVFJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixDQVJKLEVBU0ksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLENBVEosRUFVSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLENBQWIsQ0FWSixDQWpHVyxFQTRHVDtBQUNGLEVBQ0ksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLENBREosRUFFSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLENBQWIsQ0FGSixFQUdJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixDQUhKLEVBSUksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLENBSkosRUFLSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLENBQWIsQ0FMSixFQU1JLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixDQU5KLEVBT0ksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLENBUEosRUFRSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLENBQWIsQ0FSSixFQVNJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixDQVRKLEVBVUksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLENBVkosQ0E3R1csRUF3SFQ7QUFDRixFQUNJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxDQURKLEVBRUksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLENBRkosRUFHSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsQ0FISixFQUlJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxDQUpKLEVBS0ksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLENBTEosRUFNSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsQ0FOSixFQU9JLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxDQVBKLEVBUUksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLENBUkosRUFTSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsQ0FUSixFQVVJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxDQVZKLENBV0M7QUFwSVUsRUFBZixDOzs7Ozs7O0FDQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBcUc7QUFDckc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxpQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEU7Ozs7Ozs7QUNwQkE7QUFDQTs7O0FBR0E7QUFDQSx1REFBc0QsdUJBQXVCLG1CQUFtQixzQkFBc0IsOEJBQThCLEVBQUU7O0FBRXRKO0FBQ0E7QUFDQTtBQUNBLEc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQ1ZhLFUsV0FBQSxVO0FBQ1QseUJBQVksR0FBWixFQUFnQixDQUFoQixFQUFrQixDQUFsQixFQUFxQjtBQUFBOztBQUNqQixjQUFLLEdBQUwsR0FBVyxHQUFYO0FBQ0EsY0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNBLGNBQUssQ0FBTCxHQUFTLENBQVQ7QUFDSDs7OztrQ0FDTztBQUNKLG9CQUFRLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFjLEtBQUssR0FBOUIsQ0FBUjtBQUNIOzs7Z0NBQ0s7QUFDRixvQkFBTyxLQUFLLEdBQUwsQ0FBUyxDQUFDLENBQVYsRUFBWSxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsS0FBYyxJQUF6QixDQUFaLEtBQTZDLEtBQUssQ0FBTCxHQUFPLEtBQUssQ0FBTCxJQUFRLEtBQUssTUFBTCxLQUFjLEdBQXRCLElBQTJCLEdBQS9FLENBQVA7QUFDSDs7O2dDQUNLO0FBQ0Ysb0JBQU8sS0FBSyxDQUFMLEdBQU8sS0FBSyxDQUFMLElBQVEsS0FBSyxNQUFMLEtBQWMsR0FBdEIsSUFBMkIsR0FBekM7QUFDSDs7Ozs7O0FBR0w7OztLQUNhLEksV0FBQSxJLEdBQ1QsY0FBWSxDQUFaLEVBQWMsQ0FBZCxFQUFnQixNQUFoQixFQUF1QixLQUF2QixFQUE4QjtBQUFBOztBQUFBOztBQUFBLFVBTTlCLE1BTjhCLEdBTXZCLFVBQUMsT0FBRCxFQUFXO0FBQ2QsaUJBQVEsU0FBUixHQUFvQixNQUFLLEtBQXpCO0FBQ0EsaUJBQVEsU0FBUjtBQUNBLGlCQUFRLEdBQVIsQ0FBWSxNQUFLLENBQWpCLEVBQW1CLE1BQUssQ0FBeEIsRUFBMEIsTUFBSyxNQUEvQixFQUFzQyxDQUF0QyxFQUF3QyxJQUFFLEtBQUssRUFBL0M7QUFDQSxpQkFBUSxTQUFSO0FBQ0EsaUJBQVEsSUFBUjtBQUNILE1BWjZCOztBQUMxQixVQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsVUFBSyxDQUFMLEdBQVMsQ0FBVDtBQUNBLFVBQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxVQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0gsRTs7QUFVTDs7O0tBQ2EsVSxXQUFBLFU7OztBQUNULHlCQUFZLEVBQVosRUFBZSxFQUFmLEVBQWtCLENBQWxCLEVBQTZCO0FBQUE7O0FBQUE7O0FBQUEsMkNBQU4sSUFBTTtBQUFOLGlCQUFNO0FBQUE7O0FBQUEsbUtBQ2hCLElBRGdCOztBQUFBLGdCQU03QixLQU42QixHQU12QixVQUFDLEtBQUQsRUFBTyxNQUFQLEVBQWdCO0FBQ2xCLG9CQUFRLE9BQUssQ0FBTCxHQUFPLE9BQUssTUFBYixHQUF1QixDQUF2QixJQUE2QixPQUFLLENBQUwsR0FBTyxPQUFLLE1BQWIsR0FBdUIsS0FBbkQsSUFDRixPQUFLLENBQUwsR0FBTyxPQUFLLE1BQWIsR0FBdUIsQ0FEcEIsSUFDMEIsT0FBSyxDQUFMLEdBQU8sT0FBSyxNQUFiLEdBQXVCLE1BRHZEO0FBRUgsVUFUNEI7O0FBRXpCLGdCQUFLLEVBQUwsR0FBVSxFQUFWO0FBQ0EsZ0JBQUssRUFBTCxHQUFVLEVBQVY7QUFDQSxnQkFBSyxDQUFMLEdBQVMsQ0FBVDtBQUp5QjtBQUs1Qjs7O0dBTjJCLEk7O0FBYWhDOzs7S0FDYSxLLFdBQUEsSyxHQUNULGVBQVksQ0FBWixFQUFjLENBQWQsRUFBZ0IsS0FBaEIsRUFBc0IsS0FBdEIsRUFBNEIsTUFBNUIsRUFBb0M7QUFBQTs7QUFBQTs7QUFBQSxVQU9wQyxNQVBvQyxHQU83QixVQUFDLE9BQUQsRUFBVztBQUNkLGFBQU0sTUFBTSxPQUFLLEtBQUwsQ0FBVyxNQUF2QjtBQUNBLGNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxHQUFwQixFQUF5QixHQUF6QixFQUE4QjtBQUMxQixvQkFBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLE1BQWQsQ0FBcUIsT0FBckI7QUFDSDtBQUNKLE1BWm1DOztBQUNoQyxVQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsVUFBSyxDQUFMLEdBQVMsQ0FBVDtBQUNBLFVBQUssS0FBTCxHQUFhLEtBQWI7QUFDQSxVQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0EsVUFBSyxLQUFMLEdBQWEsS0FBYjtBQUNILEUiLCJmaWxlIjoianMvMi0wYzE3NzA0MGM0NWQyNWI5MTdiMy5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXHJcbiovXHJcbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGxpc3QgPSBbXTtcclxuXHJcblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xyXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcclxuXHRcdHZhciByZXN1bHQgPSBbXTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gdGhpc1tpXTtcclxuXHRcdFx0aWYoaXRlbVsyXSkge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgaXRlbVsxXSArIFwifVwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChpdGVtWzFdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdC5qb2luKFwiXCIpO1xyXG5cdH07XHJcblxyXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XHJcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xyXG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXHJcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcclxuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xyXG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXHJcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XHJcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcclxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcclxuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cclxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcclxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcclxuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcclxuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cdHJldHVybiBsaXN0O1xyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuICoqIG1vZHVsZSBpZCA9IDI1MlxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDUgNiA3IDggOSAxOCAxOSAyMCAyMyAyNCAyNSAyNiAyNyAyOCAyOSAzMCAzMSAzMlxuICoqLyIsIi8qXHJcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXHJcbiovXHJcbnZhciBzdHlsZXNJbkRvbSA9IHt9LFxyXG5cdG1lbW9pemUgPSBmdW5jdGlvbihmbikge1xyXG5cdFx0dmFyIG1lbW87XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0XHRyZXR1cm4gbWVtbztcclxuXHRcdH07XHJcblx0fSxcclxuXHRpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAvbXNpZSBbNi05XVxcYi8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcclxuXHR9KSxcclxuXHRnZXRIZWFkRWxlbWVudCA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xyXG5cdH0pLFxyXG5cdHNpbmdsZXRvbkVsZW1lbnQgPSBudWxsLFxyXG5cdHNpbmdsZXRvbkNvdW50ZXIgPSAwLFxyXG5cdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wID0gW107XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcclxuXHRpZih0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcclxuXHRcdGlmKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xyXG5cdH1cclxuXHJcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XHJcblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xyXG5cclxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgPGhlYWQ+LlxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XHJcblxyXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCk7XHJcblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XHJcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xyXG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcclxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xyXG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XHJcblx0XHR9XHJcblx0XHRpZihuZXdMaXN0KSB7XHJcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCk7XHJcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XHJcblx0XHR9XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcclxuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xyXG5cdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKylcclxuXHRcdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKCk7XHJcblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucykge1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xyXG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XHJcblx0XHRpZihkb21TdHlsZSkge1xyXG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XHJcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzKGxpc3QpIHtcclxuXHR2YXIgc3R5bGVzID0gW107XHJcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XHJcblx0XHR2YXIgaWQgPSBpdGVtWzBdO1xyXG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XHJcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xyXG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XHJcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XHJcblx0XHRpZighbmV3U3R5bGVzW2lkXSlcclxuXHRcdFx0c3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcclxuXHRcdGVsc2VcclxuXHRcdFx0bmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xyXG5cdH1cclxuXHRyZXR1cm4gc3R5bGVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KSB7XHJcblx0dmFyIGhlYWQgPSBnZXRIZWFkRWxlbWVudCgpO1xyXG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wW3N0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xyXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XHJcblx0XHRpZighbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcclxuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBoZWFkLmZpcnN0Q2hpbGQpO1xyXG5cdFx0fSBlbHNlIGlmKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XHJcblx0XHRcdGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AucHVzaChzdHlsZUVsZW1lbnQpO1xyXG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xyXG5cdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XHJcblx0c3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHR2YXIgaWR4ID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZUVsZW1lbnQpO1xyXG5cdGlmKGlkeCA+PSAwKSB7XHJcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSB7XHJcblx0dmFyIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcclxuXHRzdHlsZUVsZW1lbnQudHlwZSA9IFwidGV4dC9jc3NcIjtcclxuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KTtcclxuXHRyZXR1cm4gc3R5bGVFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKSB7XHJcblx0dmFyIGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XHJcblx0bGlua0VsZW1lbnQucmVsID0gXCJzdHlsZXNoZWV0XCI7XHJcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmtFbGVtZW50KTtcclxuXHRyZXR1cm4gbGlua0VsZW1lbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFN0eWxlKG9iaiwgb3B0aW9ucykge1xyXG5cdHZhciBzdHlsZUVsZW1lbnQsIHVwZGF0ZSwgcmVtb3ZlO1xyXG5cclxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcclxuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gc2luZ2xldG9uRWxlbWVudCB8fCAoc2luZ2xldG9uRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XHJcblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCBmYWxzZSk7XHJcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCB0cnVlKTtcclxuXHR9IGVsc2UgaWYob2JqLnNvdXJjZU1hcCAmJlxyXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcclxuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xyXG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0XHRpZihzdHlsZUVsZW1lbnQuaHJlZilcclxuXHRcdFx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlRWxlbWVudC5ocmVmKTtcclxuXHRcdH07XHJcblx0fSBlbHNlIHtcclxuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcclxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xyXG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShvYmopO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUobmV3T2JqKSB7XHJcblx0XHRpZihuZXdPYmopIHtcclxuXHRcdFx0aWYobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZW1vdmUoKTtcclxuXHRcdH1cclxuXHR9O1xyXG59XHJcblxyXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xyXG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcclxuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcclxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xyXG5cdH07XHJcbn0pKCk7XHJcblxyXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnKHN0eWxlRWxlbWVudCwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xyXG5cclxuXHRpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xyXG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZUVsZW1lbnQuY2hpbGROb2RlcztcclxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChjc3NOb2RlKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGVFbGVtZW50LCBvYmopIHtcclxuXHR2YXIgY3NzID0gb2JqLmNzcztcclxuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XHJcblxyXG5cdGlmKG1lZGlhKSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXHJcblx0fVxyXG5cclxuXHRpZihzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcclxuXHR9IGVsc2Uge1xyXG5cdFx0d2hpbGUoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcclxuXHRcdH1cclxuXHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxpbmsobGlua0VsZW1lbnQsIG9iaikge1xyXG5cdHZhciBjc3MgPSBvYmouY3NzO1xyXG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xyXG5cclxuXHRpZihzb3VyY2VNYXApIHtcclxuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XHJcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XHJcblx0fVxyXG5cclxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcclxuXHJcblx0dmFyIG9sZFNyYyA9IGxpbmtFbGVtZW50LmhyZWY7XHJcblxyXG5cdGxpbmtFbGVtZW50LmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xyXG5cclxuXHRpZihvbGRTcmMpXHJcblx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XHJcbn1cclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1xuICoqIG1vZHVsZSBpZCA9IDI1M1xuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDUgNiA3IDggOSAxOCAxOSAyMCAyMyAyNCAyNSAyNiAyNyAyOCAyOSAzMCAzMSAzMlxuICoqLyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcblxuaW1wb3J0IGRpZ2l0IGZyb20gJy4vZGlnaXQnXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vQ291bnREb3duLnNjc3MnXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5cbmltcG9ydCB7UmFuZG9tVWl0bCxCYWxsLE1vdGlvbkJhbGwsQmFsbHN9IGZyb20gJy4vTW9kZWxzJ1xuXG5jb25zdCBDb2xvcnMgPSBbJyMwMDAwMDAnLCcwMDMzMzMnLCcjMDA2NjY2JywnIzAwOTk5OScsJyMwMENDQ0MnLCcjMDBGRkZGJywnIzMzMDBDQycsJyMzMzMzOTknLFxuJyMzMzY2NjYnLCcjMzM5OTMzJywnIzMzQ0MwMCcsJyMzM0ZGMzMnLCcjNjYwMDY2JywnIzY2MzM5OScsJyM2NjY2Q0MnLCcjNjY5OUZGJywnIzY2Q0NDQycsJyM2NkZGOTknLFxuJyM5OTAwQ0MnLCcjOTkzM0ZGJywnIzk5NjZDQycsJyM5OTk5OTknLCcjOTlDQzY2JywnIzk5RkYzMycsJyNDQzAwMDAnLCcjQ0MzMzMzJywnI0NDNjY2NicsJyNDQzk5OTknXVxuXG5jb25zdCByYW5kb21VaXRsID0gbmV3IFJhbmRvbVVpdGwoQ29sb3JzLmxlbmd0aCw4MCwtMzAwKVxuXG5jbGFzcyBDb3VudERvd24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKVxuICAgICAgICB0aGlzLndpZHRoID0gMTAyNFxuICAgICAgICB0aGlzLmhlaWdodCA9IDYwMFxuICAgICAgICB0aGlzLlRvcCA9IDIwMFxuICAgICAgICB0aGlzLkxlZnQgPSAyMDBcbiAgICAgICAgdGhpcy5SYWRpdXMgPSA1XG4gICAgICAgIHRoaXMuUmFkaXVzQmxhbmsgPSAxXG4gICAgICAgIHRoaXMuRGlnaXRCbGFuayA9IDhcbiAgICAgICAgdGhpcy5GcmVxdWVuY3kgPSAyMFxuICAgICAgICB0aGlzLmNvbG9yID0gJyMyMjg4NTUnXG5cbiAgICAgICAgdGhpcy5lbmRUaW1lID0gbmV3IERhdGUoKVxuICAgICAgICB0aGlzLmVuZFRpbWUuc2V0VGltZSh0aGlzLmVuZFRpbWUuZ2V0VGltZSgpKzM2MDAqMTAwMClcbiAgICB9XG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKVxuICAgICAgICBjYW52YXMud2lkdGggPSB0aGlzLndpZHRoXG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodFxuXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuXG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSB0aGlzLmdldFRpbWUoKVxuICAgICAgICBsZXQgZGlnaXRzQmFsbHMgPSB0aGlzLmdldFRpbWVEaWdpdHModGhpcy5sYXN0VGltZSlcbiAgICAgICAgbGV0IG1vdGlvbkJhbGxzID0gbmV3IE9iamVjdCgpXG4gICAgICAgIHRoaXMuc2V0SSA9IHNldEludGVydmFsKFxuICAgICAgICAgICAgKCk9PntcbiAgICAgICAgICAgICAgICAvL3VwZGF0ZVxuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RUaW1lID0gdGhpcy5nZXRUaW1lKClcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxhc3RUaW1lWzddICE9IGxhc3RUaW1lWzddKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpZ2l0c0JhbGxzID0gdGhpcy5nZXRUaW1lRGlnaXRzKGxhc3RUaW1lKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE5ld01vdGlvbkJhbGxzKG1vdGlvbkJhbGxzLGRpZ2l0c0JhbGxzLHRoaXMubGFzdFRpbWUsbGFzdFRpbWUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFRpbWUgPSBsYXN0VGltZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU1vdGlvbkJhbGxzKG1vdGlvbkJhbGxzLGNvbnRleHQpXG4gICAgICAgICAgICAgICAgLy9pbml0XG4gICAgICAgICAgICAgICAgY29udGV4dC5jbGVhclJlY3QoMCwwLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpXG5cbiAgICAgICAgICAgICAgICAvL3JlbmRlclxuICAgICAgICAgICAgICAgIC8vcmVuZGVyIGRpZ2lzdHNcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZ2l0c0JhbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpZ2l0c0JhbGxzW2ldLnJlbmRlcihjb250ZXh0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL3JlbmRlciBNb3Rpb25CYWxsc1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyTW90aW9uQmFsbHMobW90aW9uQmFsbHMsY29udGV4dClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAxMDAwL3RoaXMuRnJlcXVlbmN5XG4gICAgICAgIClcbiAgICB9XG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5zZXRJKVxuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Y2FudmFzIGlkPVwiY2FudmFzXCIgY2xhc3NOYW1lPXtzdHlsZXMuY2FudmFzfT5cbiAgICAgICAgICAgICAgICDor6XmtY/op4jlmajkuI3mlK/mjIFjYW52YXMs6K+35YiH5o2i5rWP6KeI5Zmo77yBXG4gICAgICAgICAgICA8L2NhbnZhcz5cbiAgICAgICAgKVxuICAgIH1cbiAgICBzZXROZXdNb3Rpb25CYWxscyhtb3Rpb25CYWxscyxkaWdpdHNCYWxscyxsYXN0VGltZTEsbGFzdFRpbWUyKXtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsYXN0VGltZTEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChsYXN0VGltZTFbaV0hPWxhc3RUaW1lMltpXSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhbGxzID0gZGlnaXRzQmFsbHNbaV0uZWxlbXNcbiAgICAgICAgICAgICAgICBjb25zdCBsZW4gPSBiYWxscy5sZW5ndGhcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdGlvbkJhbGxzW18udW5pcXVlSWQoKV09bmV3IE1vdGlvbkJhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5kb21VaXRsLmdldFYoKSxyYW5kb21VaXRsLmdldFkoKSwxMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFsbHNbal0ueCxiYWxsc1tqXS55LGJhbGxzW2pdLnJhZGl1cyxDb2xvcnNbcmFuZG9tVWl0bC5nZXRMZW4oKV1cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB1cGRhdGVNb3Rpb25CYWxscyA9IChtb3Rpb25CYWxscyk9PntcbiAgICAgICAgXy5mb3JPd24obW90aW9uQmFsbHMsIChtb3Rpb25CYWxsLCBrZXkpID0+IHtcbiAgICAgICAgICAgIG1vdGlvbkJhbGwudlkgKz0gbW90aW9uQmFsbC5nL3RoaXMuRnJlcXVlbmN5XG4gICAgICAgICAgICBtb3Rpb25CYWxsLnggKz0gbW90aW9uQmFsbC52WC90aGlzLkZyZXF1ZW5jeVxuICAgICAgICAgICAgbW90aW9uQmFsbC55ICs9IG1vdGlvbkJhbGwudlkvdGhpcy5GcmVxdWVuY3lcblxuICAgICAgICAgICAgaWYgKChtb3Rpb25CYWxsLnkrdGhpcy5SYWRpdXMpID4gdGhpcy5oZWlnaHQgJiYgbW90aW9uQmFsbC52WSA+IDAgKSB7XG4gICAgICAgICAgICAgICAgbW90aW9uQmFsbC52WSA9IC1tb3Rpb25CYWxsLnZZKjAuNzVcbiAgICAgICAgICAgICAgICBtb3Rpb25CYWxsLnkgPSB0aGlzLmhlaWdodCAtIHRoaXMuUmFkaXVzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtb3Rpb25CYWxsLmlzT3V0KHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpKSB7XG4gICAgICAgICAgICAgICAgXy51bnNldChtb3Rpb25CYWxscyxrZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGdldFRpbWU9KCk9PntcbiAgICAgICAgY29uc3Qgc2Vjb25kcyA9IE1hdGgucm91bmQoKHRoaXMuZW5kVGltZS5nZXRUaW1lKCkgLSBuZXcgRGF0ZSgpLmdldFRpbWUoKSkvMTAwMClcbiAgICAgICAgY29uc3QgdG90YWxTZWNvbmRzID0gTWF0aC5tYXgoc2Vjb25kcywwKVxuICAgICAgICBjb25zdCBob3VyID0gTWF0aC5mbG9vcih0b3RhbFNlY29uZHMvMzYwMCU5OSlcbiAgICAgICAgY29uc3QgbWludXRlID0gTWF0aC5mbG9vcigodG90YWxTZWNvbmRzJTM2MDApLzYwKVxuICAgICAgICBjb25zdCBzZWNvbmQgPSB0b3RhbFNlY29uZHMlNjBcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHBhcnNlSW50KGhvdXIvMTApLHBhcnNlSW50KGhvdXIlMTApLFxuICAgICAgICAgICAgMTAsXG4gICAgICAgICAgICBwYXJzZUludChtaW51dGUvMTApLHBhcnNlSW50KG1pbnV0ZSUxMCksXG4gICAgICAgICAgICAxMCxcbiAgICAgICAgICAgIHBhcnNlSW50KHNlY29uZC8xMCkscGFyc2VJbnQoc2Vjb25kJTEwKVxuICAgICAgICBdXG4gICAgfVxuICAgIGdldFRpbWVEaWdpdHM9KHRpbWVJdGVtcyk9PntcbiAgICAgICAgbGV0IGRpZ2l0cyA9IFtdXG5cbiAgICAgICAgbGV0IGN1cnJlbnRUb3AgPSB0aGlzLlRvcFxuICAgICAgICBsZXQgY3VycmVudExlZnQgPSB0aGlzLkxlZnRcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbWVJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZGlnaXRzLnB1c2godGhpcy5nZXREaWdpdEJhbGxzKFxuICAgICAgICAgICAgICAgIGRpZ2l0W3RpbWVJdGVtc1tpXV0sXG4gICAgICAgICAgICAgICAgY3VycmVudExlZnQsXG4gICAgICAgICAgICAgICAgY3VycmVudFRvcCxcbiAgICAgICAgICAgICAgICB0aGlzLlJhZGl1cyxcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yXG4gICAgICAgICAgICApKVxuICAgICAgICAgICAgY3VycmVudExlZnQgKz0gZGlnaXRzW2ldLndpZHRoICsgdGhpcy5EaWdpdEJsYW5rXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpZ2l0c1xuICAgIH1cbiAgICBnZXREaWdpdEJhbGxzPShkLHgseSxyYWRpdXMsY29sb3IpPT57XG4gICAgICAgIGNvbnN0IGJhbGxzID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZFtpXVtqXT09MSkge1xuICAgICAgICAgICAgICAgICAgICBiYWxscy5wdXNoKG5ldyBCYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgeCsoMipqKzEpKihyYWRpdXMrMSksXG4gICAgICAgICAgICAgICAgICAgICAgICB5KygyKmkrMSkqKHJhZGl1cysxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhZGl1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yXG4gICAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQmFsbHMoeCx5LGJhbGxzLGRbMF0ubGVuZ3RoICogMiAqICh0aGlzLlJhZGl1cyArIHRoaXMuUmFkaXVzQmxhbmspKVxuICAgIH1cbiAgICByZW5kZXJNb3Rpb25CYWxscz0obW90aW9uQmFsbHMsY29udGV4dCk9PntcbiAgICAgICAgXy5mb3JPd24obW90aW9uQmFsbHMsKG1vdGlvbkJhbGwpPT57XG4gICAgICAgICAgICBtb3Rpb25CYWxsLnJlbmRlcihjb250ZXh0KVxuICAgICAgICB9KVxuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gQ291bnREb3duXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy8yZC9jb3VudGRvd24vQ291bnRkb3duLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9W1xuICAgIFtcbiAgICAgICAgWzAsMCwxLDEsMSwwLDBdLFxuICAgICAgICBbMCwxLDEsMCwxLDEsMF0sXG4gICAgICAgIFsxLDEsMCwwLDAsMSwxXSxcbiAgICAgICAgWzEsMSwwLDAsMCwxLDFdLFxuICAgICAgICBbMSwxLDAsMCwwLDEsMV0sXG4gICAgICAgIFsxLDEsMCwwLDAsMSwxXSxcbiAgICAgICAgWzEsMSwwLDAsMCwxLDFdLFxuICAgICAgICBbMSwxLDAsMCwwLDEsMV0sXG4gICAgICAgIFswLDEsMSwwLDEsMSwwXSxcbiAgICAgICAgWzAsMCwxLDEsMSwwLDBdXG4gICAgXSwvLzBcbiAgICBbXG4gICAgICAgIFswLDAsMCwxLDEsMCwwXSxcbiAgICAgICAgWzAsMSwxLDEsMSwwLDBdLFxuICAgICAgICBbMCwwLDAsMSwxLDAsMF0sXG4gICAgICAgIFswLDAsMCwxLDEsMCwwXSxcbiAgICAgICAgWzAsMCwwLDEsMSwwLDBdLFxuICAgICAgICBbMCwwLDAsMSwxLDAsMF0sXG4gICAgICAgIFswLDAsMCwxLDEsMCwwXSxcbiAgICAgICAgWzAsMCwwLDEsMSwwLDBdLFxuICAgICAgICBbMCwwLDAsMSwxLDAsMF0sXG4gICAgICAgIFsxLDEsMSwxLDEsMSwxXVxuICAgIF0sLy8xXG4gICAgW1xuICAgICAgICBbMCwxLDEsMSwxLDEsMF0sXG4gICAgICAgIFsxLDEsMCwwLDAsMSwxXSxcbiAgICAgICAgWzAsMCwwLDAsMCwxLDFdLFxuICAgICAgICBbMCwwLDAsMCwxLDEsMF0sXG4gICAgICAgIFswLDAsMCwxLDEsMCwwXSxcbiAgICAgICAgWzAsMCwxLDEsMCwwLDBdLFxuICAgICAgICBbMCwxLDEsMCwwLDAsMF0sXG4gICAgICAgIFsxLDEsMCwwLDAsMCwwXSxcbiAgICAgICAgWzEsMSwwLDAsMCwxLDFdLFxuICAgICAgICBbMSwxLDEsMSwxLDEsMV1cbiAgICBdLC8vMlxuICAgIFtcbiAgICAgICAgWzEsMSwxLDEsMSwxLDFdLFxuICAgICAgICBbMCwwLDAsMCwwLDEsMV0sXG4gICAgICAgIFswLDAsMCwwLDEsMSwwXSxcbiAgICAgICAgWzAsMCwwLDEsMSwwLDBdLFxuICAgICAgICBbMCwwLDEsMSwxLDAsMF0sXG4gICAgICAgIFswLDAsMCwwLDEsMSwwXSxcbiAgICAgICAgWzAsMCwwLDAsMCwxLDFdLFxuICAgICAgICBbMCwwLDAsMCwwLDEsMV0sXG4gICAgICAgIFsxLDEsMCwwLDAsMSwxXSxcbiAgICAgICAgWzAsMSwxLDEsMSwxLDBdXG4gICAgXSwvLzNcbiAgICBbXG4gICAgICAgIFswLDAsMCwwLDEsMSwwXSxcbiAgICAgICAgWzAsMCwwLDEsMSwxLDBdLFxuICAgICAgICBbMCwwLDEsMSwxLDEsMF0sXG4gICAgICAgIFswLDEsMSwwLDEsMSwwXSxcbiAgICAgICAgWzEsMSwwLDAsMSwxLDBdLFxuICAgICAgICBbMSwxLDEsMSwxLDEsMV0sXG4gICAgICAgIFswLDAsMCwwLDEsMSwwXSxcbiAgICAgICAgWzAsMCwwLDAsMSwxLDBdLFxuICAgICAgICBbMCwwLDAsMCwxLDEsMF0sXG4gICAgICAgIFswLDAsMCwxLDEsMSwxXVxuICAgIF0sLy80XG4gICAgW1xuICAgICAgICBbMSwxLDEsMSwxLDEsMV0sXG4gICAgICAgIFsxLDEsMCwwLDAsMCwwXSxcbiAgICAgICAgWzEsMSwwLDAsMCwwLDBdLFxuICAgICAgICBbMSwxLDEsMSwxLDEsMF0sXG4gICAgICAgIFswLDAsMCwwLDAsMSwxXSxcbiAgICAgICAgWzAsMCwwLDAsMCwxLDFdLFxuICAgICAgICBbMCwwLDAsMCwwLDEsMV0sXG4gICAgICAgIFswLDAsMCwwLDAsMSwxXSxcbiAgICAgICAgWzEsMSwwLDAsMCwxLDFdLFxuICAgICAgICBbMCwxLDEsMSwxLDEsMF1cbiAgICBdLC8vNVxuICAgIFtcbiAgICAgICAgWzAsMCwwLDAsMSwxLDBdLFxuICAgICAgICBbMCwwLDEsMSwwLDAsMF0sXG4gICAgICAgIFswLDEsMSwwLDAsMCwwXSxcbiAgICAgICAgWzEsMSwwLDAsMCwwLDBdLFxuICAgICAgICBbMSwxLDAsMSwxLDEsMF0sXG4gICAgICAgIFsxLDEsMCwwLDAsMSwxXSxcbiAgICAgICAgWzEsMSwwLDAsMCwxLDFdLFxuICAgICAgICBbMSwxLDAsMCwwLDEsMV0sXG4gICAgICAgIFsxLDEsMCwwLDAsMSwxXSxcbiAgICAgICAgWzAsMSwxLDEsMSwxLDBdXG4gICAgXSwvLzZcbiAgICBbXG4gICAgICAgIFsxLDEsMSwxLDEsMSwxXSxcbiAgICAgICAgWzEsMSwwLDAsMCwxLDFdLFxuICAgICAgICBbMCwwLDAsMCwxLDEsMF0sXG4gICAgICAgIFswLDAsMCwwLDEsMSwwXSxcbiAgICAgICAgWzAsMCwwLDEsMSwwLDBdLFxuICAgICAgICBbMCwwLDAsMSwxLDAsMF0sXG4gICAgICAgIFswLDAsMSwxLDAsMCwwXSxcbiAgICAgICAgWzAsMCwxLDEsMCwwLDBdLFxuICAgICAgICBbMCwwLDEsMSwwLDAsMF0sXG4gICAgICAgIFswLDAsMSwxLDAsMCwwXVxuICAgIF0sLy83XG4gICAgW1xuICAgICAgICBbMCwxLDEsMSwxLDEsMF0sXG4gICAgICAgIFsxLDEsMCwwLDAsMSwxXSxcbiAgICAgICAgWzEsMSwwLDAsMCwxLDFdLFxuICAgICAgICBbMSwxLDAsMCwwLDEsMV0sXG4gICAgICAgIFswLDEsMSwxLDEsMSwwXSxcbiAgICAgICAgWzEsMSwwLDAsMCwxLDFdLFxuICAgICAgICBbMSwxLDAsMCwwLDEsMV0sXG4gICAgICAgIFsxLDEsMCwwLDAsMSwxXSxcbiAgICAgICAgWzEsMSwwLDAsMCwxLDFdLFxuICAgICAgICBbMCwxLDEsMSwxLDEsMF1cbiAgICBdLC8vOFxuICAgIFtcbiAgICAgICAgWzAsMSwxLDEsMSwxLDBdLFxuICAgICAgICBbMSwxLDAsMCwwLDEsMV0sXG4gICAgICAgIFsxLDEsMCwwLDAsMSwxXSxcbiAgICAgICAgWzEsMSwwLDAsMCwxLDFdLFxuICAgICAgICBbMCwxLDEsMSwwLDEsMV0sXG4gICAgICAgIFswLDAsMCwwLDAsMSwxXSxcbiAgICAgICAgWzAsMCwwLDAsMCwxLDFdLFxuICAgICAgICBbMCwwLDAsMCwxLDEsMF0sXG4gICAgICAgIFswLDAsMCwxLDEsMCwwXSxcbiAgICAgICAgWzAsMSwxLDAsMCwwLDBdXG4gICAgXSwvLzlcbiAgICBbXG4gICAgICAgIFswLDAsMCwwXSxcbiAgICAgICAgWzAsMCwwLDBdLFxuICAgICAgICBbMCwxLDEsMF0sXG4gICAgICAgIFswLDEsMSwwXSxcbiAgICAgICAgWzAsMCwwLDBdLFxuICAgICAgICBbMCwwLDAsMF0sXG4gICAgICAgIFswLDEsMSwwXSxcbiAgICAgICAgWzAsMSwxLDBdLFxuICAgICAgICBbMCwwLDAsMF0sXG4gICAgICAgIFswLDAsMCwwXVxuICAgIF0vLzpcbl1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2FudmFzLzJkL2NvdW50ZG93bi9kaWdpdC5qc1xuICoqLyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL0NvdW50RG93bi5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9Db3VudERvd24uc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9Db3VudERvd24uc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy8yZC9jb3VudGRvd24vQ291bnREb3duLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSAyNzVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMlxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLkNvdW50RG93bl9fY2FudmFzX19fNk9ON0Mge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBtYXJnaW46IDUwcHggYXV0bztcXG4gIGJvcmRlcjogMXB4IHNvbGlkICNjM2MzYzM7IH1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5leHBvcnRzLmxvY2FscyA9IHtcblx0XCJjYW52YXNcIjogXCJDb3VudERvd25fX2NhbnZhc19fXzZPTjdDXCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlcj9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi9+L3Bvc3Rjc3MtbG9hZGVyIS4vfi9zYXNzLWxvYWRlciEuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy8yZC9jb3VudGRvd24vQ291bnREb3duLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSAyNzZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMlxuICoqLyIsImV4cG9ydCBjbGFzcyBSYW5kb21VaXRsIHtcbiAgICBjb25zdHJ1Y3RvcihsZW4sdix5KSB7XG4gICAgICAgIHRoaXMubGVuID0gbGVuXG4gICAgICAgIHRoaXMudiA9IHZcbiAgICAgICAgdGhpcy55ID0geVxuICAgIH1cbiAgICBnZXRMZW4oKXtcbiAgICAgICAgcmV0dXJuICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqdGhpcy5sZW4pXG4gICAgfVxuICAgIGdldFYoKXtcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KC0xLE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoxMDAwKSkqKHRoaXMudit0aGlzLnYqKE1hdGgucmFuZG9tKCktMC41KSowLjUpXG4gICAgfVxuICAgIGdldFkoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMueSt0aGlzLnkqKE1hdGgucmFuZG9tKCktMC41KSowLjNcbiAgICB9XG59XG5cbi8vQmFsbCDnkIPvvIjpnZnmgIHvvIlcbmV4cG9ydCBjbGFzcyBCYWxsIHtcbiAgICBjb25zdHJ1Y3Rvcih4LHkscmFkaXVzLGNvbG9yKSB7XG4gICAgICAgIHRoaXMueCA9IHhcbiAgICAgICAgdGhpcy55ID0geVxuICAgICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1c1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3JcbiAgICB9XG4gICAgcmVuZGVyPShjb250ZXh0KT0+e1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuY29sb3JcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKVxuICAgICAgICBjb250ZXh0LmFyYyh0aGlzLngsdGhpcy55LHRoaXMucmFkaXVzLDAsMipNYXRoLlBJKVxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpXG4gICAgICAgIGNvbnRleHQuZmlsbCgpXG4gICAgfVxufVxuXG4vL01vdGlvbkJhbGwg55CD77yI5Yqo5oCB77yJXG5leHBvcnQgY2xhc3MgTW90aW9uQmFsbCBleHRlbmRzIEJhbGwge1xuICAgIGNvbnN0cnVjdG9yKHZYLHZZLGcsLi4uYmFsbCkge1xuICAgICAgICBzdXBlciguLi5iYWxsKVxuICAgICAgICB0aGlzLnZYID0gdlhcbiAgICAgICAgdGhpcy52WSA9IHZZXG4gICAgICAgIHRoaXMuZyA9IGdcbiAgICB9XG4gICAgaXNPdXQ9KHdpZHRoLGhlaWdodCk9PntcbiAgICAgICAgcmV0dXJuICh0aGlzLngrdGhpcy5yYWRpdXMpIDwgMCB8fCAodGhpcy54LXRoaXMucmFkaXVzKSA+IHdpZHRoIHx8XG4gICAgICAgICAgICAodGhpcy55K3RoaXMucmFkaXVzKSA8IDAgfHwgKHRoaXMueS10aGlzLnJhZGl1cykgPiBoZWlnaHRcbiAgICB9XG59XG5cbi8vQmFsbHMg55CD57uE5oiQ55qE5aSa55CD5a+56LGh77yI5Y+v6IO95piv5pWw5a2X5oiW5YW25LuW77yJXG5leHBvcnQgY2xhc3MgQmFsbHMge1xuICAgIGNvbnN0cnVjdG9yKHgseSxlbGVtcyx3aWR0aCxoZWlnaHQpIHtcbiAgICAgICAgdGhpcy54ID0geFxuICAgICAgICB0aGlzLnkgPSB5XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aFxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICAgICAgICB0aGlzLmVsZW1zID0gZWxlbXNcbiAgICB9XG4gICAgcmVuZGVyPShjb250ZXh0KT0+e1xuICAgICAgICBjb25zdCBsZW4gPSB0aGlzLmVsZW1zLmxlbmd0aFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1zW2ldLnJlbmRlcihjb250ZXh0KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvMmQvY291bnRkb3duL01vZGVscy5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=