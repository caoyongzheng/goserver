webpackJsonp([6],{

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

/***/ 307:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _Point = __webpack_require__(308);
	
	var _Point2 = _interopRequireDefault(_Point);
	
	var _WeBGLUtils = __webpack_require__(310);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Test = function (_React$Component) {
	    _inherits(Test, _React$Component);
	
	    function Test(props) {
	        _classCallCheck(this, Test);
	
	        //定点着色器程序
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Test).call(this, props));
	
	        _this.onClick = function (e, gl, canvas, a_Position, u_FragColor) {
	            var x = e.clientX;
	            var y = e.clientY;
	            var rect = e.target.getBoundingClientRect();
	            x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
	            y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
	
	            _this.g_points.push({ x: x, y: y });
	            if (x >= 0.0 && y >= 0.0) {
	                _this.g_colors.push([1.0, 0.0, 0.0, 1.0]);
	            } else if (x < 0.0 && y < 0.0) {
	                _this.g_colors.push([0.0, 1.0, 0.0, 1.0]);
	            } else {
	                _this.g_colors.push([1.0, 1.0, 1.0, 1.0]);
	            }
	
	            gl.clear(gl.COLOR_BUFFER_BIT);
	
	            var len = _this.g_points.length;
	            for (var i = 0; i < len; i++) {
	                gl.vertexAttrib2f(a_Position, _this.g_points[i].x, _this.g_points[i].y);
	                gl.uniform4f(u_FragColor, _this.g_colors[i][0], _this.g_colors[i][1], _this.g_colors[i][2], _this.g_colors[i][3]);
	                gl.drawArrays(gl.POINTS, 0, 1);
	            }
	        };
	
	        _this.VSHADER_SOURCE = '\n            attribute vec4 a_Position;\n            void main(){\n                gl_Position = a_Position;\n                gl_PointSize = 10.0;\n            }\n        ';
	        //片元着色器程序
	        _this.FSHADER_SOURCE = '\n            precision mediump float;\n            uniform vec4 u_FragColor;\n            void main(){\n                gl_FragColor = u_FragColor;\n            }\n        ';
	        _this.g_points = [];
	        _this.g_colors = [];
	        return _this;
	    }
	
	    _createClass(Test, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var _this2 = this;
	
	            var canvas = _reactDom2.default.findDOMNode(this.refs['canvas']);
	            canvas.width = 400;
	            canvas.height = 400;
	
	            var gl = canvas.getContext('experimental-webgl') || canvas.getContext('webgl');
	            if (!gl) {
	                return;
	            }
	
	            if (!(0, _WeBGLUtils.initShaders)(gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE)) {
	                return;
	            }
	
	            //获取a_Position变量的储存位置
	            var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	            if (a_Position < 0) {
	                console.log('Failed to get the storage Location of a_Position');
	                return;
	            }
	            //获取u_FragColor变量的存储位置
	            var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
	            if (!u_FragColor) {
	                console.log('Failed to get the storage Location of u_FragColor');
	                return;
	            }
	
	            //注册鼠标点击事件响应函数
	            canvas.onmousedown = function (e) {
	                _this2.onClick(e, gl, canvas, a_Position, u_FragColor);
	            };
	
	            gl.clearColor(0.0, 0.0, 0.0, 1.0);
	            gl.clear(gl.COLOR_BUFFER_BIT);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                'canvas',
	                { ref: 'canvas', className: _Point2.default.canvas },
	                'the brower don`t support canvas,please change another brower'
	            );
	        }
	    }]);
	
	    return Test;
	}(_react2.default.Component);
	
	module.exports = Test;

/***/ },

/***/ 308:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(309);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./Point.scss", function() {
				var newContent = require("!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./Point.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 309:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".Point__canvas___ozVEU {\n  display: block;\n  margin: 50px auto; }\n", ""]);
	
	// exports
	exports.locals = {
		"canvas": "Point__canvas___ozVEU"
	};

/***/ },

/***/ 310:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.initShaders = initShaders;
	/**
	 * Create a program object and make current
	 * @param gl GL context
	 * @param vshader a vertex shader program (string)
	 * @param fshader a fragment shader program (string)
	 * @return true, if the program object was created and successfully made current
	 */
	function initShaders(gl, vshader, fshader) {
	  var program = createProgram(gl, vshader, fshader);
	  if (!program) {
	    console.log('Failed to create program');
	    return false;
	  }
	
	  gl.useProgram(program);
	  gl.program = program;
	
	  return true;
	}
	
	/**
	 * Create the linked program object
	 * @param gl GL context
	 * @param vshader a vertex shader program (string)
	 * @param fshader a fragment shader program (string)
	 * @return created program object, or null if the creation has failed
	 */
	function createProgram(gl, vshader, fshader) {
	  // Create shader object
	  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
	  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
	  if (!vertexShader || !fragmentShader) {
	    return null;
	  }
	
	  // Create a program object
	  var program = gl.createProgram();
	  if (!program) {
	    return null;
	  }
	
	  // Attach the shader objects
	  gl.attachShader(program, vertexShader);
	  gl.attachShader(program, fragmentShader);
	
	  // Link the program object
	  gl.linkProgram(program);
	
	  // Check the result of linking
	  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	  if (!linked) {
	    var error = gl.getProgramInfoLog(program);
	    console.log('Failed to link program: ' + error);
	    gl.deleteProgram(program);
	    gl.deleteShader(fragmentShader);
	    gl.deleteShader(vertexShader);
	    return null;
	  }
	  return program;
	}
	
	/**
	 * Create a shader object
	 * @param gl GL context
	 * @param type the type of the shader object to be created
	 * @param source shader program (string)
	 * @return created shader object, or null if the creation has failed.
	 */
	function loadShader(gl, type, source) {
	  // Create shader object
	  var shader = gl.createShader(type);
	  if (shader == null) {
	    console.log('unable to create shader');
	    return null;
	  }
	
	  // Set the shader program
	  gl.shaderSource(shader, source);
	
	  // Compile the shader
	  gl.compileShader(shader);
	
	  // Check the result of compilation
	  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	  if (!compiled) {
	    var error = gl.getShaderInfoLog(shader);
	    console.log('Failed to compile shader: ' + error);
	    gl.deleteShader(shader);
	    return null;
	  }
	
	  return shader;
	}

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzP2RhMDQqKioqKiIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanM/Yjk4MCoqKioqIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC9wb2ludC9Qb2ludC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvcG9pbnQvUG9pbnQuc2Nzcz9iYzE1Iiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC9wb2ludC9Qb2ludC5zY3NzIiwid2VicGFjazovLy8uL3NyYy9saWIvd2ViZ2wvdXRpbHMuanM/NWQwNyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBLHlDQUF3QyxnQkFBZ0I7QUFDeEQsS0FBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLG9CQUFvQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztB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QU8sSUFBUDtBQUNEOztBQUVELFVBQU8sTUFBUDtBQUNELEUiLCJmaWxlIjoianMvNi0wYzE3NzA0MGM0NWQyNWI5MTdiMy5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXHJcbiovXHJcbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGxpc3QgPSBbXTtcclxuXHJcblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xyXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcclxuXHRcdHZhciByZXN1bHQgPSBbXTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gdGhpc1tpXTtcclxuXHRcdFx0aWYoaXRlbVsyXSkge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgaXRlbVsxXSArIFwifVwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChpdGVtWzFdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdC5qb2luKFwiXCIpO1xyXG5cdH07XHJcblxyXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XHJcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xyXG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXHJcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcclxuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xyXG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXHJcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XHJcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcclxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcclxuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cclxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcclxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcclxuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcclxuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cdHJldHVybiBsaXN0O1xyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuICoqIG1vZHVsZSBpZCA9IDI1MlxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDUgNiA3IDggOSAxOCAxOSAyMCAyMyAyNCAyNSAyNiAyNyAyOCAyOSAzMCAzMSAzMlxuICoqLyIsIi8qXHJcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXHJcbiovXHJcbnZhciBzdHlsZXNJbkRvbSA9IHt9LFxyXG5cdG1lbW9pemUgPSBmdW5jdGlvbihmbikge1xyXG5cdFx0dmFyIG1lbW87XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0XHRyZXR1cm4gbWVtbztcclxuXHRcdH07XHJcblx0fSxcclxuXHRpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAvbXNpZSBbNi05XVxcYi8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcclxuXHR9KSxcclxuXHRnZXRIZWFkRWxlbWVudCA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xyXG5cdH0pLFxyXG5cdHNpbmdsZXRvbkVsZW1lbnQgPSBudWxsLFxyXG5cdHNpbmdsZXRvbkNvdW50ZXIgPSAwLFxyXG5cdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wID0gW107XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcclxuXHRpZih0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcclxuXHRcdGlmKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xyXG5cdH1cclxuXHJcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XHJcblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xyXG5cclxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgPGhlYWQ+LlxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XHJcblxyXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCk7XHJcblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XHJcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xyXG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcclxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xyXG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XHJcblx0XHR9XHJcblx0XHRpZihuZXdMaXN0KSB7XHJcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCk7XHJcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XHJcblx0XHR9XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcclxuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xyXG5cdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKylcclxuXHRcdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKCk7XHJcblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucykge1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xyXG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XHJcblx0XHRpZihkb21TdHlsZSkge1xyXG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XHJcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzKGxpc3QpIHtcclxuXHR2YXIgc3R5bGVzID0gW107XHJcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XHJcblx0XHR2YXIgaWQgPSBpdGVtWzBdO1xyXG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XHJcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xyXG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XHJcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XHJcblx0XHRpZighbmV3U3R5bGVzW2lkXSlcclxuXHRcdFx0c3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcclxuXHRcdGVsc2VcclxuXHRcdFx0bmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xyXG5cdH1cclxuXHRyZXR1cm4gc3R5bGVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KSB7XHJcblx0dmFyIGhlYWQgPSBnZXRIZWFkRWxlbWVudCgpO1xyXG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wW3N0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xyXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XHJcblx0XHRpZighbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcclxuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBoZWFkLmZpcnN0Q2hpbGQpO1xyXG5cdFx0fSBlbHNlIGlmKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XHJcblx0XHRcdGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AucHVzaChzdHlsZUVsZW1lbnQpO1xyXG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xyXG5cdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XHJcblx0c3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHR2YXIgaWR4ID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZUVsZW1lbnQpO1xyXG5cdGlmKGlkeCA+PSAwKSB7XHJcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSB7XHJcblx0dmFyIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcclxuXHRzdHlsZUVsZW1lbnQudHlwZSA9IFwidGV4dC9jc3NcIjtcclxuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KTtcclxuXHRyZXR1cm4gc3R5bGVFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKSB7XHJcblx0dmFyIGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XHJcblx0bGlua0VsZW1lbnQucmVsID0gXCJzdHlsZXNoZWV0XCI7XHJcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmtFbGVtZW50KTtcclxuXHRyZXR1cm4gbGlua0VsZW1lbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFN0eWxlKG9iaiwgb3B0aW9ucykge1xyXG5cdHZhciBzdHlsZUVsZW1lbnQsIHVwZGF0ZSwgcmVtb3ZlO1xyXG5cclxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcclxuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gc2luZ2xldG9uRWxlbWVudCB8fCAoc2luZ2xldG9uRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XHJcblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCBmYWxzZSk7XHJcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCB0cnVlKTtcclxuXHR9IGVsc2UgaWYob2JqLnNvdXJjZU1hcCAmJlxyXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcclxuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xyXG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0XHRpZihzdHlsZUVsZW1lbnQuaHJlZilcclxuXHRcdFx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlRWxlbWVudC5ocmVmKTtcclxuXHRcdH07XHJcblx0fSBlbHNlIHtcclxuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcclxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xyXG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShvYmopO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUobmV3T2JqKSB7XHJcblx0XHRpZihuZXdPYmopIHtcclxuXHRcdFx0aWYobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZW1vdmUoKTtcclxuXHRcdH1cclxuXHR9O1xyXG59XHJcblxyXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xyXG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcclxuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcclxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xyXG5cdH07XHJcbn0pKCk7XHJcblxyXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnKHN0eWxlRWxlbWVudCwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xyXG5cclxuXHRpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xyXG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZUVsZW1lbnQuY2hpbGROb2RlcztcclxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChjc3NOb2RlKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGVFbGVtZW50LCBvYmopIHtcclxuXHR2YXIgY3NzID0gb2JqLmNzcztcclxuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XHJcblxyXG5cdGlmKG1lZGlhKSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXHJcblx0fVxyXG5cclxuXHRpZihzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcclxuXHR9IGVsc2Uge1xyXG5cdFx0d2hpbGUoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcclxuXHRcdH1cclxuXHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxpbmsobGlua0VsZW1lbnQsIG9iaikge1xyXG5cdHZhciBjc3MgPSBvYmouY3NzO1xyXG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xyXG5cclxuXHRpZihzb3VyY2VNYXApIHtcclxuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XHJcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XHJcblx0fVxyXG5cclxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcclxuXHJcblx0dmFyIG9sZFNyYyA9IGxpbmtFbGVtZW50LmhyZWY7XHJcblxyXG5cdGxpbmtFbGVtZW50LmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xyXG5cclxuXHRpZihvbGRTcmMpXHJcblx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XHJcbn1cclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1xuICoqIG1vZHVsZSBpZCA9IDI1M1xuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDUgNiA3IDggOSAxOCAxOSAyMCAyMyAyNCAyNSAyNiAyNyAyOCAyOSAzMCAzMSAzMlxuICoqLyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5cbmltcG9ydCBzdHlsZXMgZnJvbSAnLi9Qb2ludC5zY3NzJ1xuaW1wb3J0IHtpbml0U2hhZGVyc30gZnJvbSAnV2VCR0xVdGlscydcblxuY2xhc3MgVGVzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpXG4gICAgICAgIC8v5a6a54K5552A6Imy5Zmo56iL5bqPXG4gICAgICAgIHRoaXMuVlNIQURFUl9TT1VSQ0UgPSBgXG4gICAgICAgICAgICBhdHRyaWJ1dGUgdmVjNCBhX1Bvc2l0aW9uO1xuICAgICAgICAgICAgdm9pZCBtYWluKCl7XG4gICAgICAgICAgICAgICAgZ2xfUG9zaXRpb24gPSBhX1Bvc2l0aW9uO1xuICAgICAgICAgICAgICAgIGdsX1BvaW50U2l6ZSA9IDEwLjA7XG4gICAgICAgICAgICB9XG4gICAgICAgIGBcbiAgICAgICAgLy/niYflhYPnnYDoibLlmajnqIvluo9cbiAgICAgICAgdGhpcy5GU0hBREVSX1NPVVJDRSA9IGBcbiAgICAgICAgICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICAgICAgICAgICAgdW5pZm9ybSB2ZWM0IHVfRnJhZ0NvbG9yO1xuICAgICAgICAgICAgdm9pZCBtYWluKCl7XG4gICAgICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdV9GcmFnQ29sb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIGBcbiAgICAgICAgdGhpcy5nX3BvaW50cz1bXVxuICAgICAgICB0aGlzLmdfY29sb3JzPVtdXG4gICAgfVxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBjb25zdCBjYW52YXMgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnNbJ2NhbnZhcyddKVxuICAgICAgICBjYW52YXMud2lkdGggPSA0MDBcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IDQwMFxuXG4gICAgICAgIGNvbnN0IGdsID0gY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpIHx8IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpXG4gICAgICAgIGlmICghZ2wpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYoIWluaXRTaGFkZXJzKGdsLHRoaXMuVlNIQURFUl9TT1VSQ0UsdGhpcy5GU0hBREVSX1NPVVJDRSkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy/ojrflj5ZhX1Bvc2l0aW9u5Y+Y6YeP55qE5YKo5a2Y5L2N572uXG4gICAgICAgIGxldCBhX1Bvc2l0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oZ2wucHJvZ3JhbSwnYV9Qb3NpdGlvbicpXG4gICAgICAgIGlmIChhX1Bvc2l0aW9uIDwgMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBnZXQgdGhlIHN0b3JhZ2UgTG9jYXRpb24gb2YgYV9Qb3NpdGlvbicpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICAvL+iOt+WPlnVfRnJhZ0NvbG9y5Y+Y6YeP55qE5a2Y5YKo5L2N572uXG4gICAgICAgIGxldCB1X0ZyYWdDb2xvciA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihnbC5wcm9ncmFtLCd1X0ZyYWdDb2xvcicpXG4gICAgICAgIGlmICghdV9GcmFnQ29sb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gZ2V0IHRoZSBzdG9yYWdlIExvY2F0aW9uIG9mIHVfRnJhZ0NvbG9yJylcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy/ms6jlhozpvKDmoIfngrnlh7vkuovku7blk43lupTlh73mlbBcbiAgICAgICAgY2FudmFzLm9ubW91c2Vkb3duPShlKT0+e3RoaXMub25DbGljayhlLGdsLGNhbnZhcyxhX1Bvc2l0aW9uLHVfRnJhZ0NvbG9yKX1cblxuICAgICAgICBnbC5jbGVhckNvbG9yKDAuMCwwLjAsMC4wLDEuMClcbiAgICAgICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVClcbiAgICB9XG4gICAgb25DbGljaz0oZSxnbCxjYW52YXMsYV9Qb3NpdGlvbix1X0ZyYWdDb2xvcik9PntcbiAgICAgICAgbGV0IHggPSBlLmNsaWVudFhcbiAgICAgICAgbGV0IHkgPSBlLmNsaWVudFlcbiAgICAgICAgbGV0IHJlY3QgPSBlLnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICB4ID0gKHgtcmVjdC5sZWZ0LWNhbnZhcy53aWR0aC8yKS8oY2FudmFzLndpZHRoLzIpXG4gICAgICAgIHkgPSAoY2FudmFzLmhlaWdodC8yLSh5LXJlY3QudG9wKSkvKGNhbnZhcy5oZWlnaHQvMilcblxuICAgICAgICB0aGlzLmdfcG9pbnRzLnB1c2goe3g6eCx5Onl9KVxuICAgICAgICBpZiAoeD49MC4wJiZ5Pj0wLjApIHtcbiAgICAgICAgICAgIHRoaXMuZ19jb2xvcnMucHVzaChbMS4wLDAuMCwwLjAsMS4wXSlcbiAgICAgICAgfWVsc2UgaWYoeCA8IDAuMCAmJiB5IDwgMC4wKXtcbiAgICAgICAgICAgIHRoaXMuZ19jb2xvcnMucHVzaChbMC4wLDEuMCwwLjAsMS4wXSlcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nX2NvbG9ycy5wdXNoKFsxLjAsMS4wLDEuMCwxLjBdKVxuICAgICAgICB9XG5cbiAgICAgICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVClcblxuICAgICAgICBjb25zdCBsZW4gPSB0aGlzLmdfcG9pbnRzLmxlbmd0aFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBnbC52ZXJ0ZXhBdHRyaWIyZihhX1Bvc2l0aW9uLHRoaXMuZ19wb2ludHNbaV0ueCx0aGlzLmdfcG9pbnRzW2ldLnkpXG4gICAgICAgICAgICBnbC51bmlmb3JtNGYodV9GcmFnQ29sb3IsdGhpcy5nX2NvbG9yc1tpXVswXSx0aGlzLmdfY29sb3JzW2ldWzFdLFxuICAgICAgICAgICAgdGhpcy5nX2NvbG9yc1tpXVsyXSx0aGlzLmdfY29sb3JzW2ldWzNdKVxuICAgICAgICAgICAgZ2wuZHJhd0FycmF5cyhnbC5QT0lOVFMsIDAsIDEpXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIiBjbGFzc05hbWU9e3N0eWxlcy5jYW52YXN9PlxuICAgICAgICAgICAgICAgIHsndGhlIGJyb3dlciBkb25gdCBzdXBwb3J0IGNhbnZhcyxwbGVhc2UgY2hhbmdlIGFub3RoZXIgYnJvd2VyJ31cbiAgICAgICAgICAgIDwvY2FudmFzPlxuICAgICAgICApXG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBUZXN0XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC9wb2ludC9Qb2ludC5qc1xuICoqLyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL1BvaW50LnNjc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL1BvaW50LnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vUG9pbnQuc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC9wb2ludC9Qb2ludC5zY3NzXG4gKiogbW9kdWxlIGlkID0gMzA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDZcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5Qb2ludF9fY2FudmFzX19fb3pWRVUge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBtYXJnaW46IDUwcHggYXV0bzsgfVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcbmV4cG9ydHMubG9jYWxzID0ge1xuXHRcImNhbnZhc1wiOiBcIlBvaW50X19jYW52YXNfX19velZFVVwiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXI/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vfi9wb3N0Y3NzLWxvYWRlciEuL34vc2Fzcy1sb2FkZXIhLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvcG9pbnQvUG9pbnQuc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDMwOVxuICoqIG1vZHVsZSBjaHVua3MgPSA2XG4gKiovIiwiLyoqXG4gKiBDcmVhdGUgYSBwcm9ncmFtIG9iamVjdCBhbmQgbWFrZSBjdXJyZW50XG4gKiBAcGFyYW0gZ2wgR0wgY29udGV4dFxuICogQHBhcmFtIHZzaGFkZXIgYSB2ZXJ0ZXggc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEBwYXJhbSBmc2hhZGVyIGEgZnJhZ21lbnQgc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEByZXR1cm4gdHJ1ZSwgaWYgdGhlIHByb2dyYW0gb2JqZWN0IHdhcyBjcmVhdGVkIGFuZCBzdWNjZXNzZnVsbHkgbWFkZSBjdXJyZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0U2hhZGVycyhnbCwgdnNoYWRlciwgZnNoYWRlcikge1xuICB2YXIgcHJvZ3JhbSA9IGNyZWF0ZVByb2dyYW0oZ2wsIHZzaGFkZXIsIGZzaGFkZXIpO1xuICBpZiAoIXByb2dyYW0pIHtcbiAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGNyZWF0ZSBwcm9ncmFtJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcbiAgZ2wucHJvZ3JhbSA9IHByb2dyYW07XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBsaW5rZWQgcHJvZ3JhbSBvYmplY3RcbiAqIEBwYXJhbSBnbCBHTCBjb250ZXh0XG4gKiBAcGFyYW0gdnNoYWRlciBhIHZlcnRleCBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHBhcmFtIGZzaGFkZXIgYSBmcmFnbWVudCBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHJldHVybiBjcmVhdGVkIHByb2dyYW0gb2JqZWN0LCBvciBudWxsIGlmIHRoZSBjcmVhdGlvbiBoYXMgZmFpbGVkXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVByb2dyYW0oZ2wsIHZzaGFkZXIsIGZzaGFkZXIpIHtcbiAgLy8gQ3JlYXRlIHNoYWRlciBvYmplY3RcbiAgdmFyIHZlcnRleFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wsIGdsLlZFUlRFWF9TSEFERVIsIHZzaGFkZXIpO1xuICB2YXIgZnJhZ21lbnRTaGFkZXIgPSBsb2FkU2hhZGVyKGdsLCBnbC5GUkFHTUVOVF9TSEFERVIsIGZzaGFkZXIpO1xuICBpZiAoIXZlcnRleFNoYWRlciB8fCAhZnJhZ21lbnRTaGFkZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIHByb2dyYW0gb2JqZWN0XG4gIHZhciBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICBpZiAoIXByb2dyYW0pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEF0dGFjaCB0aGUgc2hhZGVyIG9iamVjdHNcbiAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRleFNoYWRlcik7XG4gIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmFnbWVudFNoYWRlcik7XG5cbiAgLy8gTGluayB0aGUgcHJvZ3JhbSBvYmplY3RcbiAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XG5cbiAgLy8gQ2hlY2sgdGhlIHJlc3VsdCBvZiBsaW5raW5nXG4gIHZhciBsaW5rZWQgPSBnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIGdsLkxJTktfU1RBVFVTKTtcbiAgaWYgKCFsaW5rZWQpIHtcbiAgICB2YXIgZXJyb3IgPSBnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKTtcbiAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGxpbmsgcHJvZ3JhbTogJyArIGVycm9yKTtcbiAgICBnbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xuICAgIGdsLmRlbGV0ZVNoYWRlcihmcmFnbWVudFNoYWRlcik7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKHZlcnRleFNoYWRlcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHByb2dyYW07XG59XG5cblxuLyoqXG4gKiBDcmVhdGUgYSBzaGFkZXIgb2JqZWN0XG4gKiBAcGFyYW0gZ2wgR0wgY29udGV4dFxuICogQHBhcmFtIHR5cGUgdGhlIHR5cGUgb2YgdGhlIHNoYWRlciBvYmplY3QgdG8gYmUgY3JlYXRlZFxuICogQHBhcmFtIHNvdXJjZSBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHJldHVybiBjcmVhdGVkIHNoYWRlciBvYmplY3QsIG9yIG51bGwgaWYgdGhlIGNyZWF0aW9uIGhhcyBmYWlsZWQuXG4gKi9cbmZ1bmN0aW9uIGxvYWRTaGFkZXIoZ2wsIHR5cGUsIHNvdXJjZSkge1xuICAvLyBDcmVhdGUgc2hhZGVyIG9iamVjdFxuICB2YXIgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUpO1xuICBpZiAoc2hhZGVyID09IG51bGwpIHtcbiAgICBjb25zb2xlLmxvZygndW5hYmxlIHRvIGNyZWF0ZSBzaGFkZXInKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFNldCB0aGUgc2hhZGVyIHByb2dyYW1cbiAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcblxuICAvLyBDb21waWxlIHRoZSBzaGFkZXJcbiAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xuXG4gIC8vIENoZWNrIHRoZSByZXN1bHQgb2YgY29tcGlsYXRpb25cbiAgdmFyIGNvbXBpbGVkID0gZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpO1xuICBpZiAoIWNvbXBpbGVkKSB7XG4gICAgdmFyIGVycm9yID0gZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpO1xuICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gY29tcGlsZSBzaGFkZXI6ICcgKyBlcnJvcik7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gc2hhZGVyO1xufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbGliL3dlYmdsL3V0aWxzLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==