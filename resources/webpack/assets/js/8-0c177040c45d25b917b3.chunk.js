webpackJsonp([8],{

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

/***/ },

/***/ 316:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Transform = __webpack_require__(317);
	
	var _Transform2 = _interopRequireDefault(_Transform);
	
	var _Translate = __webpack_require__(319);
	
	var _Translate2 = _interopRequireDefault(_Translate);
	
	var _Rotate = __webpack_require__(321);
	
	var _Rotate2 = _interopRequireDefault(_Rotate);
	
	var _Scale = __webpack_require__(322);
	
	var _Scale2 = _interopRequireDefault(_Scale);
	
	var _RotateTranslate = __webpack_require__(323);
	
	var _RotateTranslate2 = _interopRequireDefault(_RotateTranslate);
	
	var _Rotating = __webpack_require__(324);
	
	var _Rotating2 = _interopRequireDefault(_Rotating);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Transform = function (_React$Component) {
	    _inherits(Transform, _React$Component);
	
	    function Transform(props) {
	        _classCallCheck(this, Transform);
	
	        return _possibleConstructorReturn(this, Object.getPrototypeOf(Transform).call(this, props));
	    }
	
	    _createClass(Transform, [{
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                'div',
	                { className: _Transform2.default.transform },
	                _react2.default.createElement(_Translate2.default, null),
	                _react2.default.createElement(_Rotate2.default, null),
	                _react2.default.createElement(_Scale2.default, null),
	                _react2.default.createElement(_RotateTranslate2.default, null),
	                _react2.default.createElement(_Rotating2.default, null)
	            );
	        }
	    }]);
	
	    return Transform;
	}(_react2.default.Component);
	
	module.exports = Transform;

/***/ },

/***/ 317:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(318);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./Transform.scss", function() {
				var newContent = require("!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./Transform.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 318:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".Transform__transform___2Tra3 {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: distribute;\n      justify-content: space-around;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap; }\n\n.Transform__transform___2Tra3 > div {\n  margin: 0 50px; }\n\n.Transform__transform___2Tra3 canvas {\n  width: 300px;\n  height: 300px; }\n", ""]);
	
	// exports
	exports.locals = {
		"transform": "Transform__transform___2Tra3"
	};

/***/ },

/***/ 319:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _WeBGLUtils = __webpack_require__(310);
	
	var _Matrix = __webpack_require__(320);
	
	var _Matrix2 = _interopRequireDefault(_Matrix);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	//顶点着色器
	var VSHADER_SOURCE = '\n    attribute vec4 a_Position;\n    uniform mat4 u_xformMatrix;\n    void main(){\n        gl_Position = u_xformMatrix*a_Position;\n    }\n';
	
	//片元着色器
	var FSHADER_SOURCE = '\n    void main(){\n        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n    }\n';
	
	var TranslateMatrix = function (_React$Component) {
	    _inherits(TranslateMatrix, _React$Component);
	
	    function TranslateMatrix(props) {
	        _classCallCheck(this, TranslateMatrix);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TranslateMatrix).call(this, props));
	
	        _this.initVertexBuffers = function (gl) {
	            var vertexs = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
	
	            var vertexBuffer = gl.createBuffer();
	            if (!vertexBuffer) {
	                console.log('Failed to create the buffer object');
	                return -1;
	            }
	
	            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	
	            gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW);
	
	            var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	            if (a_Position < 0) {
	                console.log('Failed to get the storage location of a_Position');
	                return -1;
	            }
	
	            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
	
	            gl.enableVertexAttribArray(a_Position);
	
	            return 3;
	        };
	
	        return _this;
	    }
	
	    _createClass(TranslateMatrix, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var canvas = _reactDom2.default.findDOMNode(this.refs['canvas']);
	
	            var gl = canvas.getContext('webgl');
	
	            if (!gl) {
	                console.log('Failed to get the rendering context for WebGL');
	                return;
	            }
	
	            if (!(0, _WeBGLUtils.initShaders)(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	                console.log('Failed to intialize shaders.');
	                return;
	            }
	
	            var n = this.initVertexBuffers(gl);
	            if (n < 0) {
	                console.log('Failed to set the positions of the vertices');
	                return;
	            }
	
	            var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
	            if (!u_xformMatrix) {
	                console.log('Failed to get the storage location of u_xformMatrix');
	                return;
	            }
	
	            var matrix4 = new _Matrix2.default();
	            matrix4.translate(0.5, 0.5, 0);
	            var xformMatrix = matrix4.matrix;
	
	            gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
	
	            gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	            gl.clear(gl.COLOR_BUFFER_BIT);
	
	            gl.drawArrays(gl.TRIANGLES, 0, n);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                'div',
	                null,
	                _react2.default.createElement(
	                    'div',
	                    { style: { fontSize: '28px', margin: '40px 0' } },
	                    'Translate'
	                ),
	                _react2.default.createElement(
	                    'div',
	                    null,
	                    _react2.default.createElement(
	                        'canvas',
	                        { ref: 'canvas' },
	                        'the brower don`t support canvas,please change another brower'
	                    )
	                )
	            );
	        }
	    }]);
	
	    return TranslateMatrix;
	}(_react2.default.Component);
	
	module.exports = TranslateMatrix;

/***/ },

/***/ 320:
/***/ function(module, exports) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Matrix4 = function Matrix4(matrix) {
	    _classCallCheck(this, Matrix4);
	
	    _initialiseProps.call(this);
	
	    this.matrix = matrix || Matrix4.unitMatrix4();
	}
	/**
	 * 求一个矩阵的逆矩阵
	 * @param  {Matrix4} matrix 矩阵
	 * @return {Float32Array}   矩阵数组
	 */
	
	/**
	 * 获取透视投影矩阵
	 * @param  fov    指定垂直视角，即可视空间顶面和底面间的夹角，必须大于0
	 * @param  aspect 指定近剪裁面的宽高比（宽度／高度）
	 * @param  near   指定近剪裁面的位置，即可视空间的近边界
	 * @param  far    指定远剪裁面的位置，即可视空间的远边界
	 * @return matrix 透视投影矩阵
	 */
	;
	
	Matrix4.inverseOf = function (matrix) {
	    var i = void 0,
	        s = void 0,
	        d = void 0,
	        inv = void 0,
	        det = void 0;
	
	    s = matrix.matrix;
	    d = new Float32Array(16);
	    inv = new Float32Array(16);
	
	    inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15] + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
	    inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15] - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
	    inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15] + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
	    inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14] - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];
	
	    inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15] - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
	    inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15] + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
	    inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15] - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
	    inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14] + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];
	
	    inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15] + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
	    inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15] - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
	    inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15] + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
	    inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14] - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];
	
	    inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11] - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
	    inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11] + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
	    inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11] - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
	    inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10] + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];
	
	    det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
	    if (det === 0) {
	        return;
	    }
	
	    det = 1 / det;
	    for (i = 0; i < 16; i++) {
	        d[i] = inv[i] * det;
	    }
	
	    return d;
	};
	
	Matrix4.perspectiveMatrix = function (fov, aspect, near, far) {
	    var matrix = void 0,
	        rd = void 0,
	        s = void 0,
	        ct = void 0;
	
	    if (near === far || aspect === 0) {
	        throw 'null frustum';
	    }
	    if (near <= 0) {
	        throw 'near <= 0';
	    }
	    if (far <= 0) {
	        throw 'far <= 0';
	    }
	
	    fov = Math.PI * fov / 180 / 2;
	    s = Math.sin(fov);
	    if (s === 0) {
	        throw 'null frustum';
	    }
	    rd = 1 / (far - near);
	    ct = Math.cos(fov) / s;
	
	    matrix = new Float32Array(16);
	
	    matrix[0] = ct / aspect;
	    matrix[1] = 0;
	    matrix[2] = 0;
	    matrix[3] = 0;
	
	    matrix[4] = 0;
	    matrix[5] = ct;
	    matrix[6] = 0;
	    matrix[7] = 0;
	
	    matrix[8] = 0;
	    matrix[9] = 0;
	    matrix[10] = -(far + near) * rd;
	    matrix[11] = -1;
	
	    matrix[12] = 0;
	    matrix[13] = 0;
	    matrix[14] = -2 * near * far * rd;
	    matrix[15] = 0;
	    return matrix;
	};
	
	Matrix4.orthoMatrix = function (left, right, bottom, top, near, far) {
	    var matrix = void 0,
	        rw = void 0,
	        rh = void 0,
	        rd = void 0;
	
	    if (left === right || bottom === top || near === far) {
	        throw 'null frustum';
	    }
	
	    rw = 1 / (right - left);
	    rh = 1 / (top - bottom);
	    rd = 1 / (far - near);
	
	    matrix = new Float32Array(16);
	
	    matrix[0] = 2 * rw;
	    matrix[1] = 0;
	    matrix[2] = 0;
	    matrix[3] = 0;
	
	    matrix[4] = 0;
	    matrix[5] = 2 * rh;
	    matrix[6] = 0;
	    matrix[7] = 0;
	
	    matrix[8] = 0;
	    matrix[9] = 0;
	    matrix[10] = -2 * rd;
	    matrix[11] = 0;
	
	    matrix[12] = -(right + left) * rw;
	    matrix[13] = -(top + bottom) * rh;
	    matrix[14] = -(far + near) * rd;
	    matrix[15] = 1;
	
	    return matrix;
	};
	
	Matrix4.viewMatrix = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
	    var e = void 0,
	        fx = void 0,
	        fy = void 0,
	        fz = void 0,
	        rlf = void 0,
	        sx = void 0,
	        sy = void 0,
	        sz = void 0,
	        rls = void 0,
	        ux = void 0,
	        uy = void 0,
	        uz = void 0;
	
	    fx = centerX - eyeX;
	    fy = centerY - eyeY;
	    fz = centerZ - eyeZ;
	
	    // Normalize f.
	    rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
	    fx *= rlf;
	    fy *= rlf;
	    fz *= rlf;
	
	    // Calculate cross product of f and up.
	    sx = fy * upZ - fz * upY;
	    sy = fz * upX - fx * upZ;
	    sz = fx * upY - fy * upX;
	
	    // Normalize s.
	    rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
	    sx *= rls;
	    sy *= rls;
	    sz *= rls;
	
	    // Calculate cross product of s and f.
	    ux = sy * fz - sz * fy;
	    uy = sz * fx - sx * fz;
	    uz = sx * fy - sy * fx;
	
	    var matrix = new Float32Array(16);
	    matrix[0] = sx;
	    matrix[1] = ux;
	    matrix[2] = -fx;
	    matrix[3] = 0;
	
	    matrix[4] = sy;
	    matrix[5] = uy;
	    matrix[6] = -fy;
	    matrix[7] = 0;
	
	    matrix[8] = sz;
	    matrix[9] = uz;
	    matrix[10] = -fz;
	    matrix[11] = 0;
	
	    matrix[12] = 0;
	    matrix[13] = 0;
	    matrix[14] = 0;
	    matrix[15] = 1;
	
	    return Matrix4.multiply(matrix, Matrix4.translateMatrix(-eyeX, -eyeY, -eyeZ));
	};
	
	Matrix4.rotateMatrix = function (angel, x, y, z) {
	    var radian = Math.PI * angel / 180.0;
	    var s = Math.sin(radian);
	    var c = Math.cos(radian);
	
	    if (x !== 0 && y === 0 && z === 0) {
	        if (x < 0) {
	            s = -s;
	        }
	        return Matrix4.rotateXMatrix(s, c);
	    }
	    if (x === 0 && y !== 0 && z === 0) {
	        if (y < 0) {
	            s = -s;
	        }
	        return Matrix4.rotateYMatrix(s, c);
	    }
	    if (x === 0 && y === 0 && z !== 0) {
	        if (z < 0) {
	            s = -s;
	        }
	        return Matrix4.rotateZMatrix(s, c);
	    }
	    var matrix = new Float32Array(16);
	    len = Math.sqrt(x * x + y * y + z * z);
	    if (len !== 1) {
	        rlen = 1 / len;
	        x *= rlen;
	        y *= rlen;
	        z *= rlen;
	    }
	    nc = 1 - c;
	    xy = x * y;
	    yz = y * z;
	    zx = z * x;
	    xs = x * s;
	    ys = y * s;
	    zs = z * s;
	
	    matrix[0] = x * x * nc + c;
	    matrix[1] = xy * nc + zs;
	    matrix[2] = zx * nc - ys;
	    matrix[3] = 0;
	
	    matrix[4] = xy * nc - zs;
	    matrix[5] = y * y * nc + c;
	    matrix[6] = yz * nc + xs;
	    matrix[7] = 0;
	
	    matrix[8] = zx * nc + ys;
	    matrix[9] = yz * nc - xs;
	    matrix[10] = z * z * nc + c;
	    matrix[11] = 0;
	
	    matrix[12] = 0;
	    matrix[13] = 0;
	    matrix[14] = 0;
	    matrix[15] = 1;
	
	    return matrix;
	};
	
	Matrix4.translateMatrix = function (x, y, z) {
	    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
	};
	
	Matrix4.scaleMatrix = function (Sx, Sy, Sz) {
	    return new Float32Array([Sx, 0, 0, 0, 0, Sy, 0, 0, 0, 0, Sz, 0, 0, 0, 0, 1]);
	};
	
	Matrix4.unitMatrix4 = function () {
	    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	};
	
	Matrix4.rotateXMatrix = function (s, c) {
	    return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
	};
	
	Matrix4.rotateYMatrix = function (s, c) {
	    return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
	};
	
	Matrix4.rotateZMatrix = function (s, c) {
	    return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	};
	
	Matrix4.add = function (matrix1, matrix2) {
	    var len1 = matrix1.length,
	        len2 = matrix2.length;
	    if (len1 != len2) {
	        throw '矩阵1和矩阵2长度不一致';
	    }
	    var matrix = new Float32Array(len1);
	    for (var i = 0; i < len1; i++) {
	        matrix[i] = matrix1[i] + matrix2[i];
	    }
	    return matrix;
	};
	
	Matrix4.subtract = function (matrix1, matrix2) {
	    var matrix = new Float32Array(16);
	    for (var i = 0; i < 16; i++) {
	        matrix[i] = matrix1[i] - matrix2[i];
	    }
	    return matrix;
	};
	
	Matrix4.multiply = function (matrix1, matrix2) {
	    var matrix = new Float32Array(16);
	
	    matrix[0] = matrix1[0] * matrix2[0] + matrix1[4] * matrix2[1] + matrix1[8] * matrix2[2] + matrix1[12] * matrix2[3];
	    matrix[4] = matrix1[0] * matrix2[4] + matrix1[4] * matrix2[5] + matrix1[8] * matrix2[6] + matrix1[12] * matrix2[7];
	    matrix[8] = matrix1[0] * matrix2[8] + matrix1[4] * matrix2[9] + matrix1[8] * matrix2[10] + matrix1[12] * matrix2[11];
	    matrix[12] = matrix1[0] * matrix2[12] + matrix1[4] * matrix2[13] + matrix1[8] * matrix2[14] + matrix1[12] * matrix2[15];
	
	    matrix[1] = matrix1[1] * matrix2[0] + matrix1[5] * matrix2[1] + matrix1[9] * matrix2[2] + matrix1[13] * matrix2[3];
	    matrix[5] = matrix1[1] * matrix2[4] + matrix1[5] * matrix2[5] + matrix1[9] * matrix2[6] + matrix1[13] * matrix2[7];
	    matrix[9] = matrix1[1] * matrix2[8] + matrix1[5] * matrix2[9] + matrix1[9] * matrix2[10] + matrix1[13] * matrix2[11];
	    matrix[13] = matrix1[1] * matrix2[12] + matrix1[5] * matrix2[13] + matrix1[9] * matrix2[14] + matrix1[13] * matrix2[15];
	
	    matrix[2] = matrix1[2] * matrix2[0] + matrix1[6] * matrix2[1] + matrix1[10] * matrix2[2] + matrix1[14] * matrix2[3];
	    matrix[6] = matrix1[2] * matrix2[4] + matrix1[6] * matrix2[5] + matrix1[10] * matrix2[6] + matrix1[14] * matrix2[7];
	    matrix[10] = matrix1[2] * matrix2[8] + matrix1[6] * matrix2[9] + matrix1[10] * matrix2[10] + matrix1[14] * matrix2[11];
	    matrix[14] = matrix1[2] * matrix2[12] + matrix1[6] * matrix2[13] + matrix1[10] * matrix2[14] + matrix1[14] * matrix2[15];
	
	    matrix[3] = matrix1[3] * matrix2[0] + matrix1[7] * matrix2[1] + matrix1[11] * matrix2[2] + matrix1[15] * matrix2[3];
	    matrix[7] = matrix1[3] * matrix2[4] + matrix1[7] * matrix2[5] + matrix1[11] * matrix2[6] + matrix1[15] * matrix2[7];
	    matrix[11] = matrix1[3] * matrix2[8] + matrix1[7] * matrix2[9] + matrix1[11] * matrix2[10] + matrix1[15] * matrix2[11];
	    matrix[15] = matrix1[3] * matrix2[12] + matrix1[7] * matrix2[13] + matrix1[11] * matrix2[14] + matrix1[15] * matrix2[15];
	
	    return matrix;
	};
	
	var _initialiseProps = function _initialiseProps() {
	    var _this = this;
	
	    this.init = function (matrix) {
	        _this.matrix = matrix || Matrix4.unitMatrix4();
	        return _this;
	    };
	
	    this.multiply = function (matrix) {
	        _this.matrix = Matrix4.multiply(_this.matrix, matrix);
	    };
	
	    this.rotate = function (angel, x, y, z) {
	        _this.matrix = Matrix4.multiply(Matrix4.rotateMatrix(angel, x, y, z), _this.matrix);
	        return _this;
	    };
	
	    this.rotate4 = function (angel, vector, dot) {
	        _this.translate(-dot.x, -dot.y, -dot.z);
	        _this.rotate(angel, vector.x, vector.y, vector.z);
	        _this.translate(dot.x, dot.y, dot.z);
	        return _this;
	    };
	
	    this.translate = function (x, y, z) {
	        _this.matrix = Matrix4.multiply(Matrix4.translateMatrix(x, y, z), _this.matrix);
	        return _this;
	    };
	
	    this.scale = function (Sx, Sy, Sz) {
	        _this.matrix = Matrix4.multiply(Matrix4.scaleMatrix(Sx, Sy, Sz), _this.matrix);
	        return _this;
	    };
	
	    this.view = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
	        _this.matrix = Matrix4.multiply(Matrix4.viewMatrix(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ), _this.matrix);
	        return _this;
	    };
	
	    this.ortho = function (left, right, bottom, top, near, far) {
	        _this.matrix = Matrix4.multiply(Matrix4.orthoMatrix(left, right, bottom, top, near, far), _this.matrix);
	        return _this;
	    };
	
	    this.perspective = function (fov, aspect, near, far) {
	        _this.matrix = Matrix4.multiply(Matrix4.perspectiveMatrix(fov, aspect, near, far), _this.matrix);
	        return _this;
	    };
	
	    this.transpose = function () {
	        var e = void 0,
	            t = void 0;
	
	        e = _this.matrix;
	
	        t = e[1];e[1] = e[4];e[4] = t;
	        t = e[2];e[2] = e[8];e[8] = t;
	        t = e[3];e[3] = e[12];e[12] = t;
	        t = e[6];e[6] = e[9];e[9] = t;
	        t = e[7];e[7] = e[13];e[13] = t;
	        t = e[11];e[11] = e[14];e[14] = t;
	
	        return _this;
	    };
	
	    this.setOrtho = function (left, right, bottom, top, near, far) {
	        _this.matrix = Matrix4.orthoMatrix(left, right, bottom, top, near, far);
	        return _this;
	    };
	
	    this.setRotate = function (angel, x, y, z) {
	        _this.matrix = Matrix4.rotateMatrix(angel, x, y, z);
	        return _this;
	    };
	
	    this.setTranslate = function (x, y, z) {
	        _this.matrix = Matrix4.translateMatrix(x, y, z);
	        return _this;
	    };
	
	    this.setScale = function (Sx, Sy, Sz) {
	        _this.matrix = Matrix4.scaleMatrix(Sx, Sy, Sz);
	        return _this;
	    };
	
	    this.setView = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
	        _this.matrix = Matrix4.viewMatrix(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
	        return _this;
	    };
	
	    this.setPerspective = function (fov, aspect, near, far) {
	        _this.matrix = Matrix4.perspectiveMatrix(fov, aspect, near, far);
	        return _this;
	    };
	
	    this.setInverseOf = function (matrix) {
	        var inverseMatrix = Matrix4.inverseOf(matrix);
	        if (inverseMatrix) {
	            _this.matrix = inverseMatrix;
	        }
	        return _this;
	    };
	};
	
	module.exports = Matrix4;

/***/ },

/***/ 321:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _WeBGLUtils = __webpack_require__(310);
	
	var _Matrix = __webpack_require__(320);
	
	var _Matrix2 = _interopRequireDefault(_Matrix);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	//顶点着色器
	var VSHADER_SOURCE = '\n    attribute vec4 a_Position;\n    uniform mat4 u_xformMatrix;\n    void main(){\n        gl_Position = u_xformMatrix*a_Position;\n    }\n';
	
	//片元着色器
	var FSHADER_SOURCE = '\n    void main(){\n        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n    }\n';
	
	var ANGLE = 90.0;
	
	var RotateMatrix = function (_React$Component) {
	    _inherits(RotateMatrix, _React$Component);
	
	    function RotateMatrix(props) {
	        _classCallCheck(this, RotateMatrix);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RotateMatrix).call(this, props));
	
	        _this.initVertexBuffers = function (gl) {
	            var vertexs = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
	
	            var vertexBuffer = gl.createBuffer();
	            if (!vertexBuffer) {
	                console.log('Failed to create the buffer object');
	                return -1;
	            }
	
	            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	
	            gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW);
	
	            var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	            if (a_Position < 0) {
	                console.log('Failed to get the storage location of a_Position');
	                return -1;
	            }
	
	            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
	
	            gl.enableVertexAttribArray(a_Position);
	
	            return 3;
	        };
	
	        return _this;
	    }
	
	    _createClass(RotateMatrix, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var canvas = _reactDom2.default.findDOMNode(this.refs['canvas']);
	
	            var gl = canvas.getContext('webgl');
	
	            if (!gl) {
	                console.log('Failed to get the rendering context for WebGL');
	                return;
	            }
	
	            if (!(0, _WeBGLUtils.initShaders)(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	                console.log('Failed to intialize shaders.');
	                return;
	            }
	
	            var n = this.initVertexBuffers(gl);
	            if (n < 0) {
	                console.log('Failed to set the positions of the vertices');
	                return;
	            }
	            var matrix4 = new _Matrix2.default();
	            matrix4.rotate(ANGLE, 0, 0, 1);
	            var xformMatrix = matrix4.matrix;
	
	            var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
	            if (!u_xformMatrix) {
	                return;
	            }
	            gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
	
	            gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	            gl.clear(gl.COLOR_BUFFER_BIT);
	
	            gl.drawArrays(gl.TRIANGLES, 0, n);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                'div',
	                null,
	                _react2.default.createElement(
	                    'div',
	                    { style: { fontSize: '28px', margin: '40px 0' } },
	                    'Rotate'
	                ),
	                _react2.default.createElement(
	                    'div',
	                    null,
	                    _react2.default.createElement(
	                        'canvas',
	                        { ref: 'canvas' },
	                        'the brower don`t support canvas,please change another brower'
	                    )
	                )
	            );
	        }
	    }]);
	
	    return RotateMatrix;
	}(_react2.default.Component);
	
	module.exports = RotateMatrix;

/***/ },

/***/ 322:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _WeBGLUtils = __webpack_require__(310);
	
	var _Matrix = __webpack_require__(320);
	
	var _Matrix2 = _interopRequireDefault(_Matrix);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	//顶点着色器
	var VSHADER_SOURCE = '\n    attribute vec4 a_Position;\n    uniform mat4 u_xformMatrix;\n    void main(){\n        gl_Position = u_xformMatrix*a_Position;\n    }\n';
	
	//片元着色器
	var FSHADER_SOURCE = '\n    void main(){\n        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n    }\n';
	
	var ScaleMatrix = function (_React$Component) {
	    _inherits(ScaleMatrix, _React$Component);
	
	    function ScaleMatrix(props) {
	        _classCallCheck(this, ScaleMatrix);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ScaleMatrix).call(this, props));
	
	        _this.initVertexBuffers = function (gl) {
	            var vertexs = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
	
	            var vertexBuffer = gl.createBuffer();
	            if (!vertexBuffer) {
	                console.log('Failed to create the buffer object');
	                return -1;
	            }
	
	            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	
	            gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW);
	
	            var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	            if (a_Position < 0) {
	                console.log('Failed to get the storage location of a_Position');
	                return -1;
	            }
	
	            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
	
	            gl.enableVertexAttribArray(a_Position);
	
	            return 3;
	        };
	
	        return _this;
	    }
	
	    _createClass(ScaleMatrix, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var canvas = _reactDom2.default.findDOMNode(this.refs['canvas']);
	
	            var gl = canvas.getContext('webgl');
	
	            if (!gl) {
	                console.log('Failed to get the rendering context for WebGL');
	                return;
	            }
	
	            if (!(0, _WeBGLUtils.initShaders)(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	                console.log('Failed to intialize shaders.');
	                return;
	            }
	
	            var n = this.initVertexBuffers(gl);
	            if (n < 0) {
	                console.log('Failed to set the positions of the vertices');
	                return;
	            }
	
	            var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
	            if (!u_xformMatrix) {
	                console.log('Failed to get the storage location of u_xformMatrix');
	                return;
	            }
	            var matrix4 = new _Matrix2.default();
	            matrix4.scale(1.0, 1.5, 1.0);
	            var xformMatrix = matrix4.matrix;
	
	            gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
	
	            gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	            gl.clear(gl.COLOR_BUFFER_BIT);
	
	            gl.drawArrays(gl.TRIANGLES, 0, n);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                'div',
	                null,
	                _react2.default.createElement(
	                    'div',
	                    { style: { fontSize: '28px', margin: '40px 0' } },
	                    'Scale'
	                ),
	                _react2.default.createElement(
	                    'div',
	                    null,
	                    _react2.default.createElement(
	                        'canvas',
	                        { ref: 'canvas' },
	                        'the brower don`t support canvas,please change another brower'
	                    )
	                )
	            );
	        }
	    }]);
	
	    return ScaleMatrix;
	}(_react2.default.Component);
	
	module.exports = ScaleMatrix;

/***/ },

/***/ 323:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _WeBGLUtils = __webpack_require__(310);
	
	var _Matrix = __webpack_require__(320);
	
	var _Matrix2 = _interopRequireDefault(_Matrix);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	//顶点着色器
	var VSHADER_SOURCE = '\n    attribute vec4 a_Position;\n    uniform mat4 u_xformMatrix;\n    void main(){\n        gl_Position = u_xformMatrix*a_Position;\n    }\n';
	
	//片元着色器
	var FSHADER_SOURCE = '\n    void main(){\n        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n    }\n';
	
	var RotateTranslate = function (_React$Component) {
	    _inherits(RotateTranslate, _React$Component);
	
	    function RotateTranslate(props) {
	        _classCallCheck(this, RotateTranslate);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RotateTranslate).call(this, props));
	
	        _this.initVertexBuffers = function (gl) {
	            var vertexs = new Float32Array([0.0, 0.3, -0.3, -0.3, 0.3, -0.3]);
	
	            var vertexBuffer = gl.createBuffer();
	            if (!vertexBuffer) {
	                console.log('Failed to create the buffer object');
	                return -1;
	            }
	
	            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	
	            gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW);
	
	            var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	            if (a_Position < 0) {
	                console.log('Failed to get the storage location of a_Position');
	                return -1;
	            }
	
	            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
	
	            gl.enableVertexAttribArray(a_Position);
	
	            return 3;
	        };
	
	        return _this;
	    }
	
	    _createClass(RotateTranslate, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var canvas = _reactDom2.default.findDOMNode(this.refs['canvas']);
	
	            var gl = canvas.getContext('webgl');
	
	            if (!gl) {
	                console.log('Failed to get the rendering context for WebGL');
	                return;
	            }
	
	            if (!(0, _WeBGLUtils.initShaders)(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	                console.log('Failed to intialize shaders.');
	                return;
	            }
	
	            var n = this.initVertexBuffers(gl);
	            if (n < 0) {
	                console.log('Failed to set the positions of the vertices');
	                return;
	            }
	            var matrix4 = new _Matrix2.default();
	            matrix4.translate(0.5, 0, 0);
	            matrix4.rotate(60, 0, 0, 1);
	            var xformMatrix = matrix4.matrix;
	
	            var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
	            if (!u_xformMatrix) {
	                return;
	            }
	            gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
	
	            gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	            gl.clear(gl.COLOR_BUFFER_BIT);
	
	            gl.drawArrays(gl.TRIANGLES, 0, n);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                'div',
	                null,
	                _react2.default.createElement(
	                    'div',
	                    { style: { fontSize: '28px', margin: '40px 0' } },
	                    'RotateAndTranslate'
	                ),
	                _react2.default.createElement(
	                    'div',
	                    null,
	                    _react2.default.createElement(
	                        'canvas',
	                        { ref: 'canvas' },
	                        'the brower don`t support canvas,please change another brower'
	                    )
	                )
	            );
	        }
	    }]);
	
	    return RotateTranslate;
	}(_react2.default.Component);
	
	module.exports = RotateTranslate;

/***/ },

/***/ 324:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _WeBGLUtils = __webpack_require__(310);
	
	var _Matrix = __webpack_require__(320);
	
	var _Matrix2 = _interopRequireDefault(_Matrix);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// 顶点着色器
	var VSHADER_SOURCE = '\n    attribute vec4 a_Position;\n    uniform mat4 u_xformMatrix;\n    void main(){\n        gl_Position = u_xformMatrix*a_Position;\n    }\n';
	
	// 片元着色器
	var FSHADER_SOURCE = '\n    void main(){\n        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n    }\n';
	
	var Rotating = function (_React$Component) {
	  _inherits(Rotating, _React$Component);
	
	  function Rotating(props) {
	    _classCallCheck(this, Rotating);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Rotating).call(this, props));
	
	    _this.draw = function (gl, u_xformMatrix, matrix, n) {
	      gl.uniformMatrix4fv(u_xformMatrix, false, matrix);
	
	      gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	      gl.clear(gl.COLOR_BUFFER_BIT);
	
	      gl.drawArrays(gl.TRIANGLES, 0, n);
	    };
	
	    _this.initVertexBuffers = function (gl) {
	      var vertexs = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
	
	      var vertexBuffer = gl.createBuffer();
	      if (!vertexBuffer) {
	        console.log('Failed to create the buffer object');
	        return -1;
	      }
	
	      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	
	      gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW);
	
	      var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	      if (a_Position < 0) {
	        console.log('Failed to get the storage location of a_Position');
	        return -1;
	      }
	
	      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
	
	      gl.enableVertexAttribArray(a_Position);
	
	      return 3;
	    };
	
	    _this.up = function () {
	      _this.SPEED = _this.SPEED + 10;
	      console.log(_this.SPEED);
	    };
	
	    _this.down = function () {
	      _this.SPEED = Math.max(_this.SPEED - 10, 0);
	      console.log(_this.SPEED);
	    };
	
	    return _this;
	  }
	
	  _createClass(Rotating, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;
	
	      var canvas = _reactDom2.default.findDOMNode(this.refs['canvas']);
	
	      var gl = canvas.getContext('webgl');
	
	      if (!gl) {
	        console.log('Failed to get the rendering context for WebGL');
	        return;
	      }
	
	      if (!(0, _WeBGLUtils.initShaders)(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	        console.log('Failed to intialize shaders.');
	        return;
	      }
	
	      var n = this.initVertexBuffers(gl);
	      if (n < 0) {
	        console.log('Failed to set the positions of the vertices');
	        return;
	      }
	
	      var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
	      if (!u_xformMatrix) {
	        return;
	      }
	      var matrix4 = new _Matrix2.default();
	      this.ANGLE = 0.0;
	      this.SPEED = 45.0;
	      var tick = function tick() {
	        var now = Date.now();
	        var elapsed = now - _this2.last;
	        _this2.last = now;
	        _this2.ANGLE = elapsed * _this2.SPEED / 1000.0;
	        matrix4.rotate(_this2.ANGLE, 0, 0, 1);
	        _this2.draw(gl, u_xformMatrix, matrix4.matrix, 3);
	        requestAnimationFrame(tick);
	      };
	      this.last = Date.now();
	      tick();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { style: { fontSize: '28px', margin: '40px 0' } },
	          'Rotating'
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'canvas',
	            { ref: 'canvas' },
	            'the brower don`t support canvas,please change another brower'
	          ),
	          _react2.default.createElement(
	            'button',
	            { type: 'button', onClick: this.up },
	            'UP'
	          ),
	          _react2.default.createElement(
	            'button',
	            { type: 'button', onClick: this.down },
	            'DOWN'
	          )
	        )
	      );
	    }
	  }]);
	
	  return Rotating;
	}(_react2.default.Component);
	
	module.exports = Rotating;

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzP2RhMDQqKioqKioqIiwid2VicGFjazovLy8uL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qcz9iOTgwKioqKioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL3dlYmdsL3V0aWxzLmpzPzVkMDcqKiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvdHJhbnNmb3JtL1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvdHJhbnNmb3JtL1RyYW5zZm9ybS5zY3NzP2FjNDQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2FudmFzL3dlYmdsL3RyYW5zZm9ybS9UcmFuc2Zvcm0uc2NzcyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvdHJhbnNmb3JtL2NvbXBvbmVudHMvVHJhbnNsYXRlL1RyYW5zbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL3dlYmdsL21hdHJpeDQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2FudmFzL3dlYmdsL3RyYW5zZm9ybS9jb21wb25lbnRzL1JvdGF0ZS9Sb3RhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2FudmFzL3dlYmdsL3RyYW5zZm9ybS9jb21wb25lbnRzL1NjYWxlL1NjYWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC90cmFuc2Zvcm0vY29tcG9uZW50cy9Sb3RhdGVUcmFuc2xhdGUvUm90YXRlVHJhbnNsYXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC90cmFuc2Zvcm0vY29tcG9uZW50cy9Sb3RhdGluZy9Sb3RhdGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBLHlDQUF3QyxnQkFBZ0I7QUFDeEQsS0FBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLG9CQUFvQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWdCLG1CQUFtQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0Isc0JBQXNCO0FBQ3RDO0FBQ0E7QUFDQSxtQkFBa0IsMkJBQTJCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFlLG1CQUFtQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQiwyQkFBMkI7QUFDNUM7QUFDQTtBQUNBLFNBQVEsdUJBQXVCO0FBQy9CO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQSxrQkFBaUIsdUJBQXVCO0FBQ3hDO0FBQ0E7QUFDQSw0QkFBMkI7QUFDM0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFlLGlCQUFpQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0EsaUNBQWdDLHNCQUFzQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0RBQXVEO0FBQ3ZEOztBQUVBLDhCQUE2QixtQkFBbUI7O0FBRWhEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztTQzlPZ0IsVyxHQUFBLFc7QUFQaEI7Ozs7Ozs7QUFPTyxVQUFTLFdBQVQsQ0FBcUIsRUFBckIsRUFBeUIsT0FBekIsRUFBa0MsT0FBbEMsRUFBMkM7QUFDaEQsT0FBSSxVQUFVLGNBQWMsRUFBZCxFQUFrQixPQUFsQixFQUEyQixPQUEzQixDQUFkO0FBQ0EsT0FBSSxDQUFDLE9BQUwsRUFBYztBQUNaLGFBQVEsR0FBUixDQUFZLDBCQUFaO0FBQ0EsWUFBTyxLQUFQO0FBQ0Q7O0FBRUQsTUFBRyxVQUFILENBQWMsT0FBZDtBQUNBLE1BQUcsT0FBSCxHQUFhLE9BQWI7O0FBRUEsVUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxVQUFTLGFBQVQsQ0FBdUIsRUFBdkIsRUFBMkIsT0FBM0IsRUFBb0MsT0FBcEMsRUFBNkM7QUFDM0M7QUFDQSxPQUFJLGVBQWUsV0FBVyxFQUFYLEVBQWUsR0FBRyxhQUFsQixFQUFpQyxPQUFqQyxDQUFuQjtBQUNBLE9BQUksaUJBQWlCLFdBQVcsRUFBWCxFQUFlLEdBQUcsZUFBbEIsRUFBbUMsT0FBbkMsQ0FBckI7QUFDQSxPQUFJLENBQUMsWUFBRCxJQUFpQixDQUFDLGNBQXRCLEVBQXNDO0FBQ3BDLFlBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0EsT0FBSSxVQUFVLEdBQUcsYUFBSCxFQUFkO0FBQ0EsT0FBSSxDQUFDLE9BQUwsRUFBYztBQUNaLFlBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0EsTUFBRyxZQUFILENBQWdCLE9BQWhCLEVBQXlCLFlBQXpCO0FBQ0EsTUFBRyxZQUFILENBQWdCLE9BQWhCLEVBQXlCLGNBQXpCOztBQUVBO0FBQ0EsTUFBRyxXQUFILENBQWUsT0FBZjs7QUFFQTtBQUNBLE9BQUksU0FBUyxHQUFHLG1CQUFILENBQXVCLE9BQXZCLEVBQWdDLEdBQUcsV0FBbkMsQ0FBYjtBQUNBLE9BQUksQ0FBQyxNQUFMLEVBQWE7QUFDWCxTQUFJLFFBQVEsR0FBRyxpQkFBSCxDQUFxQixPQUFyQixDQUFaO0FBQ0EsYUFBUSxHQUFSLENBQVksNkJBQTZCLEtBQXpDO0FBQ0EsUUFBRyxhQUFILENBQWlCLE9BQWpCO0FBQ0EsUUFBRyxZQUFILENBQWdCLGNBQWhCO0FBQ0EsUUFBRyxZQUFILENBQWdCLFlBQWhCO0FBQ0EsWUFBTyxJQUFQO0FBQ0Q7QUFDRCxVQUFPLE9BQVA7QUFDRDs7QUFHRDs7Ozs7OztBQU9BLFVBQVMsVUFBVCxDQUFvQixFQUFwQixFQUF3QixJQUF4QixFQUE4QixNQUE5QixFQUFzQztBQUNwQztBQUNBLE9BQUksU0FBUyxHQUFHLFlBQUgsQ0FBZ0IsSUFBaEIsQ0FBYjtBQUNBLE9BQUksVUFBVSxJQUFkLEVBQW9CO0FBQ2xCLGFBQVEsR0FBUixDQUFZLHlCQUFaO0FBQ0EsWUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFHLFlBQUgsQ0FBZ0IsTUFBaEIsRUFBd0IsTUFBeEI7O0FBRUE7QUFDQSxNQUFHLGFBQUgsQ0FBaUIsTUFBakI7O0FBRUE7QUFDQSxPQUFJLFdBQVcsR0FBRyxrQkFBSCxDQUFzQixNQUF0QixFQUE4QixHQUFHLGNBQWpDLENBQWY7QUFDQSxPQUFJLENBQUMsUUFBTCxFQUFlO0FBQ2IsU0FBSSxRQUFRLEdBQUcsZ0JBQUgsQ0FBb0IsTUFBcEIsQ0FBWjtBQUNBLGFBQVEsR0FBUixDQUFZLCtCQUErQixLQUEzQztBQUNBLFFBQUcsWUFBSCxDQUFnQixNQUFoQjtBQUNBLFlBQU8sSUFBUDtBQUNEOztBQUVELFVBQU8sTUFBUDtBQUNELEU7Ozs7Ozs7Ozs7O0FDN0ZEOzs7O0FBRUE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7S0FFTSxTOzs7QUFDRix3QkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsNkZBQ1QsS0FEUztBQUVsQjs7OztrQ0FDUTtBQUNMLG9CQUNJO0FBQUE7QUFBQSxtQkFBSyxXQUFXLG9CQUFPLFNBQXZCO0FBQ0kseUVBREo7QUFFSSxzRUFGSjtBQUdJLHFFQUhKO0FBSUksK0VBSko7QUFLSTtBQUxKLGNBREo7QUFTSDs7OztHQWRtQixnQkFBTSxTOztBQWdCOUIsUUFBTyxPQUFQLEdBQWlCLFNBQWpCLEM7Ozs7Ozs7QUMxQkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBcUc7QUFDckc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxpQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEU7Ozs7Ozs7QUNwQkE7QUFDQTs7O0FBR0E7QUFDQSwwREFBeUQsZ0JBQWdCLGlCQUFpQix5QkFBeUIseUJBQXlCLGtCQUFrQiw4QkFBOEIsc0NBQXNDLHdCQUF3Qix3QkFBd0IsRUFBRSx5Q0FBeUMsbUJBQW1CLEVBQUUsMENBQTBDLGlCQUFpQixrQkFBa0IsRUFBRTs7QUFFamE7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7Ozs7Ozs7QUNWQTs7OztBQUNBOzs7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0EsS0FBTSxnS0FBTjs7QUFRQTtBQUNBLEtBQU0sZ0dBQU47O0tBTU0sZTs7O0FBQ0YsOEJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHdHQUNULEtBRFM7O0FBQUEsZUEyQ25CLGlCQTNDbUIsR0EyQ0QsVUFBQyxFQUFELEVBQU07QUFDcEIsaUJBQU0sVUFBVSxJQUFJLFlBQUosQ0FBaUIsQ0FDN0IsR0FENkIsRUFDekIsR0FEeUIsRUFDcEIsQ0FBQyxHQURtQixFQUNmLENBQUMsR0FEYyxFQUNULEdBRFMsRUFDTCxDQUFDLEdBREksQ0FBakIsQ0FBaEI7O0FBSUEsaUJBQU0sZUFBZSxHQUFHLFlBQUgsRUFBckI7QUFDQSxpQkFBSSxDQUFDLFlBQUwsRUFBbUI7QUFDZix5QkFBUSxHQUFSLENBQVksb0NBQVo7QUFDQSx3QkFBTyxDQUFDLENBQVI7QUFDSDs7QUFFRCxnQkFBRyxVQUFILENBQWMsR0FBRyxZQUFqQixFQUE4QixZQUE5Qjs7QUFFQSxnQkFBRyxVQUFILENBQWMsR0FBRyxZQUFqQixFQUE4QixPQUE5QixFQUFzQyxHQUFHLFdBQXpDOztBQUVBLGlCQUFNLGFBQWEsR0FBRyxpQkFBSCxDQUFxQixHQUFHLE9BQXhCLEVBQWdDLFlBQWhDLENBQW5CO0FBQ0EsaUJBQUksYUFBYSxDQUFqQixFQUFvQjtBQUNoQix5QkFBUSxHQUFSLENBQVksa0RBQVo7QUFDQSx3QkFBTyxDQUFDLENBQVI7QUFDSDs7QUFFRCxnQkFBRyxtQkFBSCxDQUF1QixVQUF2QixFQUFrQyxDQUFsQyxFQUFvQyxHQUFHLEtBQXZDLEVBQTZDLEtBQTdDLEVBQW1ELENBQW5ELEVBQXFELENBQXJEOztBQUVBLGdCQUFHLHVCQUFILENBQTJCLFVBQTNCOztBQUVBLG9CQUFPLENBQVA7QUFDSCxVQXJFa0I7O0FBQUE7QUFFbEI7Ozs7NkNBQ21CO0FBQ2hCLGlCQUFNLFNBQVMsbUJBQVMsV0FBVCxDQUFxQixLQUFLLElBQUwsQ0FBVSxRQUFWLENBQXJCLENBQWY7O0FBRUEsaUJBQU0sS0FBSyxPQUFPLFVBQVAsQ0FBa0IsT0FBbEIsQ0FBWDs7QUFFQSxpQkFBSSxDQUFDLEVBQUwsRUFBUztBQUNMLHlCQUFRLEdBQVIsQ0FBWSwrQ0FBWjtBQUNBO0FBQ0g7O0FBRUQsaUJBQUksQ0FBQyw2QkFBWSxFQUFaLEVBQWUsY0FBZixFQUE4QixjQUE5QixDQUFMLEVBQW9EO0FBQ2hELHlCQUFRLEdBQVIsQ0FBWSw4QkFBWjtBQUNBO0FBQ0g7O0FBRUQsaUJBQU0sSUFBSSxLQUFLLGlCQUFMLENBQXVCLEVBQXZCLENBQVY7QUFDQSxpQkFBSSxJQUFFLENBQU4sRUFBUztBQUNMLHlCQUFRLEdBQVIsQ0FBWSw2Q0FBWjtBQUNBO0FBQ0g7O0FBRUQsaUJBQU0sZ0JBQWdCLEdBQUcsa0JBQUgsQ0FBc0IsR0FBRyxPQUF6QixFQUFpQyxlQUFqQyxDQUF0QjtBQUNBLGlCQUFJLENBQUMsYUFBTCxFQUFvQjtBQUNoQix5QkFBUSxHQUFSLENBQVkscURBQVo7QUFDQTtBQUNIOztBQUVELGlCQUFNLFVBQVUsc0JBQWhCO0FBQ0EscUJBQVEsU0FBUixDQUFrQixHQUFsQixFQUFzQixHQUF0QixFQUEwQixDQUExQjtBQUNBLGlCQUFNLGNBQWMsUUFBUSxNQUE1Qjs7QUFHQSxnQkFBRyxnQkFBSCxDQUFvQixhQUFwQixFQUFrQyxLQUFsQyxFQUF5QyxXQUF6Qzs7QUFFQSxnQkFBRyxVQUFILENBQWMsR0FBZCxFQUFtQixHQUFuQixFQUF3QixHQUF4QixFQUE2QixHQUE3Qjs7QUFFQSxnQkFBRyxLQUFILENBQVMsR0FBRyxnQkFBWjs7QUFFQSxnQkFBRyxVQUFILENBQWMsR0FBRyxTQUFqQixFQUEyQixDQUEzQixFQUE2QixDQUE3QjtBQUNIOzs7a0NBNEJRO0FBQ0wsb0JBQ0k7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBLHVCQUFLLE9BQU8sRUFBQyxVQUFTLE1BQVYsRUFBaUIsUUFBTyxRQUF4QixFQUFaO0FBQWdEO0FBQWhELGtCQURKO0FBRUk7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBLDJCQUFRLEtBQUksUUFBWjtBQUNLO0FBREw7QUFESjtBQUZKLGNBREo7QUFVSDs7OztHQWxGeUIsZ0JBQU0sUzs7QUFvRnBDLFFBQU8sT0FBUCxHQUFpQixlQUFqQixDOzs7Ozs7Ozs7OztLQzFHTSxPLEdBQ0YsaUJBQVksTUFBWixFQUFvQjtBQUFBOztBQUFBOztBQUNoQixVQUFLLE1BQUwsR0FBYyxVQUFVLFFBQVEsV0FBUixFQUF4QjtBQUNIO0FBb0ZEOzs7Ozs7QUE0REE7Ozs7Ozs7Ozs7QUFuSkUsUSxDQTRGSyxTLEdBQVksVUFBQyxNQUFELEVBQVk7QUFDN0IsU0FBSSxVQUFKO0FBQUEsU0FBTyxVQUFQO0FBQUEsU0FBVSxVQUFWO0FBQUEsU0FBYSxZQUFiO0FBQUEsU0FBa0IsWUFBbEI7O0FBRUEsU0FBSSxPQUFPLE1BQVg7QUFDQSxTQUFJLElBQUksWUFBSixDQUFpQixFQUFqQixDQUFKO0FBQ0EsV0FBTSxJQUFJLFlBQUosQ0FBaUIsRUFBakIsQ0FBTjs7QUFFQSxTQUFJLENBQUosSUFBWSxFQUFFLENBQUYsSUFBSyxFQUFFLEVBQUYsQ0FBTCxHQUFXLEVBQUUsRUFBRixDQUFYLEdBQW1CLEVBQUUsQ0FBRixJQUFNLEVBQUUsRUFBRixDQUFOLEdBQVksRUFBRSxFQUFGLENBQS9CLEdBQXVDLEVBQUUsQ0FBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBQWxELEdBQ0EsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVyxFQUFFLEVBQUYsQ0FEWCxHQUNtQixFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFZLEVBQUUsRUFBRixDQUQvQixHQUN1QyxFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUQ5RDtBQUVBLFNBQUksQ0FBSixJQUFVLENBQUUsRUFBRSxDQUFGLENBQUYsR0FBTyxFQUFFLEVBQUYsQ0FBUCxHQUFhLEVBQUUsRUFBRixDQUFiLEdBQXFCLEVBQUUsQ0FBRixJQUFNLEVBQUUsRUFBRixDQUFOLEdBQVksRUFBRSxFQUFGLENBQWpDLEdBQXlDLEVBQUUsQ0FBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBQXBELEdBQ0UsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVyxFQUFFLEVBQUYsQ0FEYixHQUNxQixFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFZLEVBQUUsRUFBRixDQURqQyxHQUN5QyxFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUQ5RDtBQUVBLFNBQUksQ0FBSixJQUFZLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVcsRUFBRSxFQUFGLENBQVgsR0FBbUIsRUFBRSxDQUFGLElBQU0sRUFBRSxFQUFGLENBQU4sR0FBWSxFQUFFLEVBQUYsQ0FBL0IsR0FBdUMsRUFBRSxDQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLEVBQUYsQ0FBbEQsR0FDQSxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFXLEVBQUUsRUFBRixDQURYLEdBQ21CLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVksRUFBRSxFQUFGLENBRC9CLEdBQ3VDLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxDQUFGLENBRDlEO0FBRUEsU0FBSSxFQUFKLElBQVUsQ0FBRSxFQUFFLENBQUYsQ0FBRixHQUFPLEVBQUUsQ0FBRixDQUFQLEdBQWEsRUFBRSxFQUFGLENBQWIsR0FBcUIsRUFBRSxDQUFGLElBQU0sRUFBRSxFQUFGLENBQU4sR0FBWSxFQUFFLEVBQUYsQ0FBakMsR0FBeUMsRUFBRSxDQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLEVBQUYsQ0FBcEQsR0FDRSxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFXLEVBQUUsRUFBRixDQURiLEdBQ3FCLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVksRUFBRSxFQUFGLENBRGpDLEdBQ3lDLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxDQUFGLENBRDlEOztBQUdBLFNBQUksQ0FBSixJQUFVLENBQUUsRUFBRSxDQUFGLENBQUYsR0FBTyxFQUFFLEVBQUYsQ0FBUCxHQUFhLEVBQUUsRUFBRixDQUFiLEdBQXFCLEVBQUUsQ0FBRixJQUFNLEVBQUUsRUFBRixDQUFOLEdBQVksRUFBRSxFQUFGLENBQWpDLEdBQXlDLEVBQUUsQ0FBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBQXBELEdBQ0UsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVyxFQUFFLEVBQUYsQ0FEYixHQUNxQixFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFZLEVBQUUsRUFBRixDQURqQyxHQUN5QyxFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUQ5RDtBQUVBLFNBQUksQ0FBSixJQUFZLEVBQUUsQ0FBRixJQUFLLEVBQUUsRUFBRixDQUFMLEdBQVcsRUFBRSxFQUFGLENBQVgsR0FBbUIsRUFBRSxDQUFGLElBQU0sRUFBRSxFQUFGLENBQU4sR0FBWSxFQUFFLEVBQUYsQ0FBL0IsR0FBdUMsRUFBRSxDQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLEVBQUYsQ0FBbEQsR0FDQSxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFXLEVBQUUsRUFBRixDQURYLEdBQ21CLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVksRUFBRSxFQUFGLENBRC9CLEdBQ3VDLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBRDlEO0FBRUEsU0FBSSxDQUFKLElBQVUsQ0FBRSxFQUFFLENBQUYsQ0FBRixHQUFPLEVBQUUsQ0FBRixDQUFQLEdBQWEsRUFBRSxFQUFGLENBQWIsR0FBcUIsRUFBRSxDQUFGLElBQU0sRUFBRSxFQUFGLENBQU4sR0FBWSxFQUFFLEVBQUYsQ0FBakMsR0FBeUMsRUFBRSxDQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLEVBQUYsQ0FBcEQsR0FDRSxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFXLEVBQUUsRUFBRixDQURiLEdBQ3FCLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVksRUFBRSxFQUFGLENBRGpDLEdBQ3lDLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxDQUFGLENBRDlEO0FBRUEsU0FBSSxFQUFKLElBQVksRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVyxFQUFFLEVBQUYsQ0FBWCxHQUFtQixFQUFFLENBQUYsSUFBTSxFQUFFLEVBQUYsQ0FBTixHQUFZLEVBQUUsRUFBRixDQUEvQixHQUF1QyxFQUFFLENBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUFsRCxHQUNBLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVcsRUFBRSxFQUFGLENBRFgsR0FDbUIsRUFBRSxFQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBWSxFQUFFLEVBQUYsQ0FEL0IsR0FDdUMsRUFBRSxFQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLENBQUYsQ0FEOUQ7O0FBR0EsU0FBSSxDQUFKLElBQVksRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLEVBQUYsQ0FBVixHQUFrQixFQUFFLENBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUE3QixHQUFxQyxFQUFFLENBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUFoRCxHQUNBLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxFQUFGLENBRFYsR0FDa0IsRUFBRSxFQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLENBQUYsQ0FEN0IsR0FDcUMsRUFBRSxFQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLENBQUYsQ0FENUQ7QUFFQSxTQUFJLENBQUosSUFBVSxDQUFFLEVBQUUsQ0FBRixDQUFGLEdBQU8sRUFBRSxDQUFGLENBQVAsR0FBWSxFQUFFLEVBQUYsQ0FBWixHQUFvQixFQUFFLENBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUEvQixHQUF1QyxFQUFFLENBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUFsRCxHQUNFLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxFQUFGLENBRFosR0FDb0IsRUFBRSxFQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLENBQUYsQ0FEL0IsR0FDdUMsRUFBRSxFQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLENBQUYsQ0FENUQ7QUFFQSxTQUFJLEVBQUosSUFBWSxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsRUFBRixDQUFWLEdBQWtCLEVBQUUsQ0FBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBQTdCLEdBQXFDLEVBQUUsQ0FBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBQWhELEdBQ0EsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLEVBQUYsQ0FEVixHQUNrQixFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsQ0FBRixDQUQ3QixHQUNxQyxFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsQ0FBRixDQUQ1RDtBQUVBLFNBQUksRUFBSixJQUFVLENBQUUsRUFBRSxDQUFGLENBQUYsR0FBTyxFQUFFLENBQUYsQ0FBUCxHQUFZLEVBQUUsRUFBRixDQUFaLEdBQW9CLEVBQUUsQ0FBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBQS9CLEdBQXVDLEVBQUUsQ0FBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBQWxELEdBQ0UsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLEVBQUYsQ0FEWixHQUNvQixFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsQ0FBRixDQUQvQixHQUN1QyxFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsQ0FBRixDQUQ1RDs7QUFHQSxTQUFJLENBQUosSUFBVSxDQUFFLEVBQUUsQ0FBRixDQUFGLEdBQU8sRUFBRSxDQUFGLENBQVAsR0FBWSxFQUFFLEVBQUYsQ0FBWixHQUFvQixFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsRUFBRixDQUE5QixHQUFzQyxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsRUFBRixDQUFoRCxHQUNFLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxFQUFGLENBRFosR0FDb0IsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLENBQUYsQ0FEOUIsR0FDc0MsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLENBQUYsQ0FEMUQ7QUFFQSxTQUFJLENBQUosSUFBWSxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsRUFBRixDQUFWLEdBQWtCLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxFQUFGLENBQTVCLEdBQW9DLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxFQUFGLENBQTlDLEdBQ0EsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLEVBQUYsQ0FEVixHQUNrQixFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsQ0FBRixDQUQ1QixHQUNvQyxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsQ0FBRixDQUQxRDtBQUVBLFNBQUksRUFBSixJQUFVLENBQUUsRUFBRSxDQUFGLENBQUYsR0FBTyxFQUFFLENBQUYsQ0FBUCxHQUFZLEVBQUUsRUFBRixDQUFaLEdBQW9CLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxDQUFGLENBQTlCLEdBQXNDLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxFQUFGLENBQWhELEdBQ0UsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLENBQUYsQ0FEWixHQUNvQixFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsQ0FBRixDQUQ5QixHQUNzQyxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsQ0FBRixDQUQxRDtBQUVBLFNBQUksRUFBSixJQUFZLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxFQUFGLENBQVYsR0FBa0IsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLENBQUYsQ0FBNUIsR0FBb0MsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLEVBQUYsQ0FBOUMsR0FDQSxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsQ0FBRixDQURWLEdBQ2tCLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxDQUFGLENBRDVCLEdBQ29DLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxDQUFGLENBRDFEOztBQUdBLFdBQU0sRUFBRSxDQUFGLElBQUssSUFBSSxDQUFKLENBQUwsR0FBYyxFQUFFLENBQUYsSUFBSyxJQUFJLENBQUosQ0FBbkIsR0FBNEIsRUFBRSxDQUFGLElBQUssSUFBSSxDQUFKLENBQWpDLEdBQTBDLEVBQUUsQ0FBRixJQUFLLElBQUksRUFBSixDQUFyRDtBQUNBLFNBQUksUUFBUSxDQUFaLEVBQWU7QUFDYjtBQUNEOztBQUVELFdBQU0sSUFBSSxHQUFWO0FBQ0EsVUFBSyxJQUFJLENBQVQsRUFBWSxJQUFJLEVBQWhCLEVBQW9CLEdBQXBCLEVBQXlCO0FBQ3ZCLFdBQUUsQ0FBRixJQUFPLElBQUksQ0FBSixJQUFTLEdBQWhCO0FBQ0Q7O0FBRUQsWUFBTyxDQUFQO0FBQ0QsRTs7QUFsSkMsUSxDQTJKSyxpQixHQUFvQixVQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsSUFBZCxFQUFvQixHQUFwQixFQUE0QjtBQUNuRCxTQUFJLGVBQUo7QUFBQSxTQUFZLFdBQVo7QUFBQSxTQUFnQixVQUFoQjtBQUFBLFNBQW1CLFdBQW5COztBQUVBLFNBQUksU0FBUyxHQUFULElBQWdCLFdBQVcsQ0FBL0IsRUFBa0M7QUFDaEMsZUFBTSxjQUFOO0FBQ0Q7QUFDRCxTQUFJLFFBQVEsQ0FBWixFQUFlO0FBQ2IsZUFBTSxXQUFOO0FBQ0Q7QUFDRCxTQUFJLE9BQU8sQ0FBWCxFQUFjO0FBQ1osZUFBTSxVQUFOO0FBQ0Q7O0FBRUQsV0FBTSxLQUFLLEVBQUwsR0FBVSxHQUFWLEdBQWdCLEdBQWhCLEdBQXNCLENBQTVCO0FBQ0EsU0FBSSxLQUFLLEdBQUwsQ0FBUyxHQUFULENBQUo7QUFDQSxTQUFJLE1BQU0sQ0FBVixFQUFhO0FBQ1gsZUFBTSxjQUFOO0FBQ0Q7QUFDRCxVQUFLLEtBQUssTUFBTSxJQUFYLENBQUw7QUFDQSxVQUFLLEtBQUssR0FBTCxDQUFTLEdBQVQsSUFBZ0IsQ0FBckI7O0FBRUEsY0FBUyxJQUFJLFlBQUosQ0FBaUIsRUFBakIsQ0FBVDs7QUFFQSxZQUFPLENBQVAsSUFBYSxLQUFLLE1BQWxCO0FBQ0EsWUFBTyxDQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sQ0FBUCxJQUFhLENBQWI7QUFDQSxZQUFPLENBQVAsSUFBYSxDQUFiOztBQUVBLFlBQU8sQ0FBUCxJQUFhLENBQWI7QUFDQSxZQUFPLENBQVAsSUFBYSxFQUFiO0FBQ0EsWUFBTyxDQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sQ0FBUCxJQUFhLENBQWI7O0FBRUEsWUFBTyxDQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sQ0FBUCxJQUFhLENBQWI7QUFDQSxZQUFPLEVBQVAsSUFBYSxFQUFFLE1BQU0sSUFBUixJQUFnQixFQUE3QjtBQUNBLFlBQU8sRUFBUCxJQUFhLENBQUMsQ0FBZDs7QUFFQSxZQUFPLEVBQVAsSUFBYSxDQUFiO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sRUFBUCxJQUFhLENBQUMsQ0FBRCxHQUFLLElBQUwsR0FBWSxHQUFaLEdBQWtCLEVBQS9CO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sTUFBUDtBQUNILEU7O0FBdE1DLFEsQ0F1TUssVyxHQUFjLFVBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxNQUFkLEVBQXNCLEdBQXRCLEVBQTJCLElBQTNCLEVBQWlDLEdBQWpDLEVBQXlDO0FBQzFELFNBQUksZUFBSjtBQUFBLFNBQVksV0FBWjtBQUFBLFNBQWdCLFdBQWhCO0FBQUEsU0FBb0IsV0FBcEI7O0FBRUEsU0FBSSxTQUFTLEtBQVQsSUFBa0IsV0FBVyxHQUE3QixJQUFvQyxTQUFTLEdBQWpELEVBQXNEO0FBQ3BELGVBQU0sY0FBTjtBQUNEOztBQUVELFVBQUssS0FBSyxRQUFRLElBQWIsQ0FBTDtBQUNBLFVBQUssS0FBSyxNQUFNLE1BQVgsQ0FBTDtBQUNBLFVBQUssS0FBSyxNQUFNLElBQVgsQ0FBTDs7QUFFQSxjQUFTLElBQUksWUFBSixDQUFpQixFQUFqQixDQUFUOztBQUVBLFlBQU8sQ0FBUCxJQUFhLElBQUksRUFBakI7QUFDQSxZQUFPLENBQVAsSUFBYSxDQUFiO0FBQ0EsWUFBTyxDQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sQ0FBUCxJQUFhLENBQWI7O0FBRUEsWUFBTyxDQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sQ0FBUCxJQUFhLElBQUksRUFBakI7QUFDQSxZQUFPLENBQVAsSUFBYSxDQUFiO0FBQ0EsWUFBTyxDQUFQLElBQWEsQ0FBYjs7QUFFQSxZQUFPLENBQVAsSUFBYSxDQUFiO0FBQ0EsWUFBTyxDQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sRUFBUCxJQUFhLENBQUMsQ0FBRCxHQUFLLEVBQWxCO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBYjs7QUFFQSxZQUFPLEVBQVAsSUFBYSxFQUFFLFFBQVEsSUFBVixJQUFrQixFQUEvQjtBQUNBLFlBQU8sRUFBUCxJQUFhLEVBQUUsTUFBTSxNQUFSLElBQWtCLEVBQS9CO0FBQ0EsWUFBTyxFQUFQLElBQWEsRUFBRSxNQUFNLElBQVIsSUFBZ0IsRUFBN0I7QUFDQSxZQUFPLEVBQVAsSUFBYSxDQUFiOztBQUVBLFlBQU8sTUFBUDtBQUNILEU7O0FBek9DLFEsQ0EwT0ssVSxHQUFhLFVBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLE9BQW5CLEVBQTRCLE9BQTVCLEVBQXFDLE9BQXJDLEVBQThDLEdBQTlDLEVBQW1ELEdBQW5ELEVBQXdELEdBQXhELEVBQThEO0FBQzlFLFNBQUksVUFBSjtBQUFBLFNBQU8sV0FBUDtBQUFBLFNBQVcsV0FBWDtBQUFBLFNBQWUsV0FBZjtBQUFBLFNBQW1CLFlBQW5CO0FBQUEsU0FBd0IsV0FBeEI7QUFBQSxTQUE0QixXQUE1QjtBQUFBLFNBQWdDLFdBQWhDO0FBQUEsU0FBb0MsWUFBcEM7QUFBQSxTQUF5QyxXQUF6QztBQUFBLFNBQTZDLFdBQTdDO0FBQUEsU0FBaUQsV0FBakQ7O0FBRUEsVUFBSyxVQUFVLElBQWY7QUFDQSxVQUFLLFVBQVUsSUFBZjtBQUNBLFVBQUssVUFBVSxJQUFmOztBQUVBO0FBQ0EsV0FBTSxJQUFJLEtBQUssSUFBTCxDQUFVLEtBQUcsRUFBSCxHQUFRLEtBQUcsRUFBWCxHQUFnQixLQUFHLEVBQTdCLENBQVY7QUFDQSxXQUFNLEdBQU47QUFDQSxXQUFNLEdBQU47QUFDQSxXQUFNLEdBQU47O0FBRUE7QUFDQSxVQUFLLEtBQUssR0FBTCxHQUFXLEtBQUssR0FBckI7QUFDQSxVQUFLLEtBQUssR0FBTCxHQUFXLEtBQUssR0FBckI7QUFDQSxVQUFLLEtBQUssR0FBTCxHQUFXLEtBQUssR0FBckI7O0FBRUE7QUFDQSxXQUFNLElBQUksS0FBSyxJQUFMLENBQVUsS0FBRyxFQUFILEdBQVEsS0FBRyxFQUFYLEdBQWdCLEtBQUcsRUFBN0IsQ0FBVjtBQUNBLFdBQU0sR0FBTjtBQUNBLFdBQU0sR0FBTjtBQUNBLFdBQU0sR0FBTjs7QUFFQTtBQUNBLFVBQUssS0FBSyxFQUFMLEdBQVUsS0FBSyxFQUFwQjtBQUNBLFVBQUssS0FBSyxFQUFMLEdBQVUsS0FBSyxFQUFwQjtBQUNBLFVBQUssS0FBSyxFQUFMLEdBQVUsS0FBSyxFQUFwQjs7QUFFQSxTQUFJLFNBQVMsSUFBSSxZQUFKLENBQWlCLEVBQWpCLENBQWI7QUFDQSxZQUFPLENBQVAsSUFBWSxFQUFaO0FBQ0EsWUFBTyxDQUFQLElBQVksRUFBWjtBQUNBLFlBQU8sQ0FBUCxJQUFZLENBQUMsRUFBYjtBQUNBLFlBQU8sQ0FBUCxJQUFZLENBQVo7O0FBRUEsWUFBTyxDQUFQLElBQVksRUFBWjtBQUNBLFlBQU8sQ0FBUCxJQUFZLEVBQVo7QUFDQSxZQUFPLENBQVAsSUFBWSxDQUFDLEVBQWI7QUFDQSxZQUFPLENBQVAsSUFBWSxDQUFaOztBQUVBLFlBQU8sQ0FBUCxJQUFZLEVBQVo7QUFDQSxZQUFPLENBQVAsSUFBWSxFQUFaO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBQyxFQUFkO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBYjs7QUFFQSxZQUFPLEVBQVAsSUFBYSxDQUFiO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sRUFBUCxJQUFhLENBQWI7QUFDQSxZQUFPLEVBQVAsSUFBYSxDQUFiOztBQUVBLFlBQU8sUUFBUSxRQUFSLENBQWlCLE1BQWpCLEVBQXdCLFFBQVEsZUFBUixDQUF3QixDQUFDLElBQXpCLEVBQStCLENBQUMsSUFBaEMsRUFBc0MsQ0FBQyxJQUF2QyxDQUF4QixDQUFQO0FBQ0gsRTs7QUE3UkMsUSxDQThSSyxZLEdBQWUsVUFBQyxLQUFELEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWlCO0FBQ25DLFNBQUksU0FBUyxLQUFLLEVBQUwsR0FBVSxLQUFWLEdBQWtCLEtBQS9CO0FBQ0EsU0FBSSxJQUFJLEtBQUssR0FBTCxDQUFTLE1BQVQsQ0FBUjtBQUNBLFNBQUksSUFBSSxLQUFLLEdBQUwsQ0FBUyxNQUFULENBQVI7O0FBRUEsU0FBSSxNQUFJLENBQUosSUFBTyxNQUFJLENBQVgsSUFBYyxNQUFJLENBQXRCLEVBQXlCO0FBQ3JCLGFBQUksSUFBSSxDQUFSLEVBQVc7QUFDVCxpQkFBSSxDQUFDLENBQUw7QUFDRDtBQUNELGdCQUFPLFFBQVEsYUFBUixDQUFzQixDQUF0QixFQUF3QixDQUF4QixDQUFQO0FBQ0g7QUFDRCxTQUFJLE1BQUksQ0FBSixJQUFPLE1BQUksQ0FBWCxJQUFjLE1BQUksQ0FBdEIsRUFBeUI7QUFDckIsYUFBSSxJQUFJLENBQVIsRUFBVztBQUNULGlCQUFJLENBQUMsQ0FBTDtBQUNEO0FBQ0QsZ0JBQU8sUUFBUSxhQUFSLENBQXNCLENBQXRCLEVBQXdCLENBQXhCLENBQVA7QUFDSDtBQUNELFNBQUksTUFBSSxDQUFKLElBQU8sTUFBSSxDQUFYLElBQWMsTUFBSSxDQUF0QixFQUF5QjtBQUNyQixhQUFJLElBQUUsQ0FBTixFQUFTO0FBQ0wsaUJBQUksQ0FBQyxDQUFMO0FBQ0g7QUFDRCxnQkFBTyxRQUFRLGFBQVIsQ0FBc0IsQ0FBdEIsRUFBd0IsQ0FBeEIsQ0FBUDtBQUNIO0FBQ0QsU0FBSSxTQUFTLElBQUksWUFBSixDQUFpQixFQUFqQixDQUFiO0FBQ0EsV0FBTSxLQUFLLElBQUwsQ0FBVSxJQUFFLENBQUYsR0FBTSxJQUFFLENBQVIsR0FBWSxJQUFFLENBQXhCLENBQU47QUFDQSxTQUFJLFFBQVEsQ0FBWixFQUFlO0FBQ2IsZ0JBQU8sSUFBSSxHQUFYO0FBQ0EsY0FBSyxJQUFMO0FBQ0EsY0FBSyxJQUFMO0FBQ0EsY0FBSyxJQUFMO0FBQ0Q7QUFDRCxVQUFLLElBQUksQ0FBVDtBQUNBLFVBQUssSUFBSSxDQUFUO0FBQ0EsVUFBSyxJQUFJLENBQVQ7QUFDQSxVQUFLLElBQUksQ0FBVDtBQUNBLFVBQUssSUFBSSxDQUFUO0FBQ0EsVUFBSyxJQUFJLENBQVQ7QUFDQSxVQUFLLElBQUksQ0FBVDs7QUFFQSxZQUFRLENBQVIsSUFBYSxJQUFFLENBQUYsR0FBSSxFQUFKLEdBQVUsQ0FBdkI7QUFDQSxZQUFRLENBQVIsSUFBYSxLQUFJLEVBQUosR0FBUyxFQUF0QjtBQUNBLFlBQVEsQ0FBUixJQUFhLEtBQUksRUFBSixHQUFTLEVBQXRCO0FBQ0EsWUFBUSxDQUFSLElBQWEsQ0FBYjs7QUFFQSxZQUFRLENBQVIsSUFBYSxLQUFJLEVBQUosR0FBUyxFQUF0QjtBQUNBLFlBQVEsQ0FBUixJQUFhLElBQUUsQ0FBRixHQUFJLEVBQUosR0FBVSxDQUF2QjtBQUNBLFlBQVEsQ0FBUixJQUFhLEtBQUksRUFBSixHQUFTLEVBQXRCO0FBQ0EsWUFBUSxDQUFSLElBQWEsQ0FBYjs7QUFFQSxZQUFRLENBQVIsSUFBYSxLQUFJLEVBQUosR0FBUyxFQUF0QjtBQUNBLFlBQVEsQ0FBUixJQUFhLEtBQUksRUFBSixHQUFTLEVBQXRCO0FBQ0EsWUFBTyxFQUFQLElBQWEsSUFBRSxDQUFGLEdBQUksRUFBSixHQUFVLENBQXZCO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBYjs7QUFFQSxZQUFPLEVBQVAsSUFBYSxDQUFiO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sRUFBUCxJQUFhLENBQWI7QUFDQSxZQUFPLEVBQVAsSUFBYSxDQUFiOztBQUVBLFlBQU8sTUFBUDtBQUNILEU7O0FBMVZDLFEsQ0EyVkssZSxHQUFrQixVQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFTO0FBQzlCLFlBQU8sSUFBSSxZQUFKLENBQWlCLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBWSxDQUFaLEVBQWMsQ0FBZCxFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFxQixDQUFyQixFQUF1QixDQUF2QixFQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUE4QixDQUE5QixFQUFnQyxDQUFoQyxFQUFrQyxDQUFsQyxDQUFqQixDQUFQO0FBQ0gsRTs7QUE3VkMsUSxDQThWSyxXLEdBQWMsVUFBQyxFQUFELEVBQUksRUFBSixFQUFPLEVBQVAsRUFBWTtBQUM3QixZQUFPLElBQUksWUFBSixDQUFpQixDQUFDLEVBQUQsRUFBSSxDQUFKLEVBQU0sQ0FBTixFQUFRLENBQVIsRUFBVyxDQUFYLEVBQWEsRUFBYixFQUFnQixDQUFoQixFQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF1QixDQUF2QixFQUF5QixFQUF6QixFQUE0QixDQUE1QixFQUErQixDQUEvQixFQUFpQyxDQUFqQyxFQUFtQyxDQUFuQyxFQUFxQyxDQUFyQyxDQUFqQixDQUFQO0FBQ0gsRTs7QUFoV0MsUSxDQWlXSyxXLEdBQWMsWUFBSTtBQUNyQixZQUFPLElBQUksWUFBSixDQUFpQixDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBVSxDQUFWLEVBQVksQ0FBWixFQUFjLENBQWQsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBcUIsQ0FBckIsRUFBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBOEIsQ0FBOUIsRUFBZ0MsQ0FBaEMsRUFBa0MsQ0FBbEMsQ0FBakIsQ0FBUDtBQUNILEU7O0FBbldDLFEsQ0FvV0ssYSxHQUFnQixVQUFDLENBQUQsRUFBRyxDQUFILEVBQU87QUFDMUIsWUFBTyxJQUFJLFlBQUosQ0FBaUIsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFZLENBQVosRUFBYyxDQUFkLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXFCLENBQUMsQ0FBdEIsRUFBd0IsQ0FBeEIsRUFBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsRUFBK0IsQ0FBL0IsRUFBaUMsQ0FBakMsRUFBbUMsQ0FBbkMsQ0FBakIsQ0FBUDtBQUNILEU7O0FBdFdDLFEsQ0F1V0ssYSxHQUFnQixVQUFDLENBQUQsRUFBRyxDQUFILEVBQU87QUFDMUIsWUFBTyxJQUFJLFlBQUosQ0FBaUIsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUMsQ0FBTixFQUFRLENBQVIsRUFBVyxDQUFYLEVBQWEsQ0FBYixFQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsRUFBc0IsQ0FBdEIsRUFBd0IsQ0FBeEIsRUFBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsRUFBK0IsQ0FBL0IsRUFBaUMsQ0FBakMsRUFBbUMsQ0FBbkMsQ0FBakIsQ0FBUDtBQUNILEU7O0FBeldDLFEsQ0EwV0ssYSxHQUFnQixVQUFDLENBQUQsRUFBRyxDQUFILEVBQU87QUFDMUIsWUFBTyxJQUFJLFlBQUosQ0FBaUIsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVUsQ0FBQyxDQUFYLEVBQWEsQ0FBYixFQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsRUFBc0IsQ0FBdEIsRUFBd0IsQ0FBeEIsRUFBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsRUFBK0IsQ0FBL0IsRUFBaUMsQ0FBakMsRUFBbUMsQ0FBbkMsQ0FBakIsQ0FBUDtBQUNILEU7O0FBNVdDLFEsQ0E2V0ssRyxHQUFNLFVBQUMsT0FBRCxFQUFTLE9BQVQsRUFBbUI7QUFDNUIsU0FBTSxPQUFPLFFBQVEsTUFBckI7QUFBQSxTQUE2QixPQUFPLFFBQVEsTUFBNUM7QUFDQSxTQUFJLFFBQVEsSUFBWixFQUFrQjtBQUNkLGVBQU0sY0FBTjtBQUNIO0FBQ0QsU0FBSSxTQUFTLElBQUksWUFBSixDQUFpQixJQUFqQixDQUFiO0FBQ0EsVUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLElBQXBCLEVBQTBCLEdBQTFCLEVBQStCO0FBQzNCLGdCQUFPLENBQVAsSUFBWSxRQUFRLENBQVIsSUFBYSxRQUFRLENBQVIsQ0FBekI7QUFDSDtBQUNELFlBQU8sTUFBUDtBQUNILEU7O0FBdlhDLFEsQ0F3WEssUSxHQUFXLFVBQUMsT0FBRCxFQUFTLE9BQVQsRUFBbUI7QUFDakMsU0FBSSxTQUFTLElBQUksWUFBSixDQUFpQixFQUFqQixDQUFiO0FBQ0EsVUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEVBQXBCLEVBQXdCLEdBQXhCLEVBQTZCO0FBQ3pCLGdCQUFPLENBQVAsSUFBWSxRQUFRLENBQVIsSUFBYSxRQUFRLENBQVIsQ0FBekI7QUFDSDtBQUNELFlBQU8sTUFBUDtBQUNILEU7O0FBOVhDLFEsQ0ErWEssUSxHQUFXLFVBQUMsT0FBRCxFQUFTLE9BQVQsRUFBbUI7QUFDakMsU0FBSSxTQUFTLElBQUksWUFBSixDQUFpQixFQUFqQixDQUFiOztBQUVBLFlBQU8sQ0FBUCxJQUFZLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFYLEdBQXdCLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFuQyxHQUFnRCxRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBM0QsR0FBd0UsUUFBUSxFQUFSLElBQVksUUFBUSxDQUFSLENBQWhHO0FBQ0EsWUFBTyxDQUFQLElBQVksUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQVgsR0FBd0IsUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQW5DLEdBQWdELFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUEzRCxHQUF3RSxRQUFRLEVBQVIsSUFBWSxRQUFRLENBQVIsQ0FBaEc7QUFDQSxZQUFPLENBQVAsSUFBWSxRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBWCxHQUF3QixRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBbkMsR0FBZ0QsUUFBUSxDQUFSLElBQVcsUUFBUSxFQUFSLENBQTNELEdBQXlFLFFBQVEsRUFBUixJQUFZLFFBQVEsRUFBUixDQUFqRztBQUNBLFlBQU8sRUFBUCxJQUFhLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFYLEdBQXlCLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFwQyxHQUFrRCxRQUFRLENBQVIsSUFBVyxRQUFRLEVBQVIsQ0FBN0QsR0FBMkUsUUFBUSxFQUFSLElBQVksUUFBUSxFQUFSLENBQXBHOztBQUVBLFlBQU8sQ0FBUCxJQUFZLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFYLEdBQXdCLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFuQyxHQUFnRCxRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBM0QsR0FBd0UsUUFBUSxFQUFSLElBQVksUUFBUSxDQUFSLENBQWhHO0FBQ0EsWUFBTyxDQUFQLElBQVksUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQVgsR0FBd0IsUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQW5DLEdBQWdELFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUEzRCxHQUF3RSxRQUFRLEVBQVIsSUFBWSxRQUFRLENBQVIsQ0FBaEc7QUFDQSxZQUFPLENBQVAsSUFBWSxRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBWCxHQUF3QixRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBbkMsR0FBZ0QsUUFBUSxDQUFSLElBQVcsUUFBUSxFQUFSLENBQTNELEdBQXlFLFFBQVEsRUFBUixJQUFZLFFBQVEsRUFBUixDQUFqRztBQUNBLFlBQU8sRUFBUCxJQUFhLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFYLEdBQXlCLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFwQyxHQUFrRCxRQUFRLENBQVIsSUFBVyxRQUFRLEVBQVIsQ0FBN0QsR0FBMkUsUUFBUSxFQUFSLElBQVksUUFBUSxFQUFSLENBQXBHOztBQUVBLFlBQU8sQ0FBUCxJQUFZLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFYLEdBQXdCLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFuQyxHQUFnRCxRQUFRLEVBQVIsSUFBWSxRQUFRLENBQVIsQ0FBNUQsR0FBeUUsUUFBUSxFQUFSLElBQVksUUFBUSxDQUFSLENBQWpHO0FBQ0EsWUFBTyxDQUFQLElBQVksUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQVgsR0FBd0IsUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQW5DLEdBQWdELFFBQVEsRUFBUixJQUFZLFFBQVEsQ0FBUixDQUE1RCxHQUF5RSxRQUFRLEVBQVIsSUFBWSxRQUFRLENBQVIsQ0FBakc7QUFDQSxZQUFPLEVBQVAsSUFBYSxRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBWCxHQUF3QixRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBbkMsR0FBZ0QsUUFBUSxFQUFSLElBQVksUUFBUSxFQUFSLENBQTVELEdBQTBFLFFBQVEsRUFBUixJQUFZLFFBQVEsRUFBUixDQUFuRztBQUNBLFlBQU8sRUFBUCxJQUFhLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFYLEdBQXlCLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFwQyxHQUFrRCxRQUFRLEVBQVIsSUFBWSxRQUFRLEVBQVIsQ0FBOUQsR0FBNEUsUUFBUSxFQUFSLElBQVksUUFBUSxFQUFSLENBQXJHOztBQUVBLFlBQU8sQ0FBUCxJQUFZLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFYLEdBQXdCLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFuQyxHQUFnRCxRQUFRLEVBQVIsSUFBWSxRQUFRLENBQVIsQ0FBNUQsR0FBeUUsUUFBUSxFQUFSLElBQVksUUFBUSxDQUFSLENBQWpHO0FBQ0EsWUFBTyxDQUFQLElBQVksUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQVgsR0FBd0IsUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQW5DLEdBQWdELFFBQVEsRUFBUixJQUFZLFFBQVEsQ0FBUixDQUE1RCxHQUF5RSxRQUFRLEVBQVIsSUFBWSxRQUFRLENBQVIsQ0FBakc7QUFDQSxZQUFPLEVBQVAsSUFBYSxRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBWCxHQUF3QixRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBbkMsR0FBZ0QsUUFBUSxFQUFSLElBQVksUUFBUSxFQUFSLENBQTVELEdBQTBFLFFBQVEsRUFBUixJQUFZLFFBQVEsRUFBUixDQUFuRztBQUNBLFlBQU8sRUFBUCxJQUFhLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFYLEdBQXlCLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFwQyxHQUFrRCxRQUFRLEVBQVIsSUFBWSxRQUFRLEVBQVIsQ0FBOUQsR0FBNEUsUUFBUSxFQUFSLElBQVksUUFBUSxFQUFSLENBQXJHOztBQUVBLFlBQU8sTUFBUDtBQUNILEU7Ozs7O1VBblpELEksR0FBTyxVQUFDLE1BQUQsRUFBVTtBQUNiLGVBQUssTUFBTCxHQUFjLFVBQVUsUUFBUSxXQUFSLEVBQXhCO0FBQ0E7QUFDSCxNOztVQUNELFEsR0FBVyxVQUFDLE1BQUQsRUFBWTtBQUNyQixlQUFLLE1BQUwsR0FBYyxRQUFRLFFBQVIsQ0FBaUIsTUFBSyxNQUF0QixFQUE4QixNQUE5QixDQUFkO0FBQ0QsTTs7VUFDRCxNLEdBQVMsVUFBQyxLQUFELEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWU7QUFDcEIsZUFBSyxNQUFMLEdBQWMsUUFBUSxRQUFSLENBQWlCLFFBQVEsWUFBUixDQUFxQixLQUFyQixFQUEyQixDQUEzQixFQUE2QixDQUE3QixFQUErQixDQUEvQixDQUFqQixFQUFtRCxNQUFLLE1BQXhELENBQWQ7QUFDQTtBQUNILE07O1VBQ0QsTyxHQUFVLFVBQUMsS0FBRCxFQUFPLE1BQVAsRUFBYyxHQUFkLEVBQW9CO0FBQzFCLGVBQUssU0FBTCxDQUFlLENBQUMsSUFBSSxDQUFwQixFQUFzQixDQUFDLElBQUksQ0FBM0IsRUFBNkIsQ0FBQyxJQUFJLENBQWxDO0FBQ0EsZUFBSyxNQUFMLENBQVksS0FBWixFQUFrQixPQUFPLENBQXpCLEVBQTJCLE9BQU8sQ0FBbEMsRUFBb0MsT0FBTyxDQUEzQztBQUNBLGVBQUssU0FBTCxDQUFlLElBQUksQ0FBbkIsRUFBcUIsSUFBSSxDQUF6QixFQUEyQixJQUFJLENBQS9CO0FBQ0E7QUFDSCxNOztVQUNELFMsR0FBWSxVQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFTO0FBQ2pCLGVBQUssTUFBTCxHQUFjLFFBQVEsUUFBUixDQUFpQixRQUFRLGVBQVIsQ0FBd0IsQ0FBeEIsRUFBMEIsQ0FBMUIsRUFBNEIsQ0FBNUIsQ0FBakIsRUFBZ0QsTUFBSyxNQUFyRCxDQUFkO0FBQ0E7QUFDSCxNOztVQUNELEssR0FBUSxVQUFDLEVBQUQsRUFBSSxFQUFKLEVBQU8sRUFBUCxFQUFZO0FBQ2hCLGVBQUssTUFBTCxHQUFjLFFBQVEsUUFBUixDQUFpQixRQUFRLFdBQVIsQ0FBb0IsRUFBcEIsRUFBdUIsRUFBdkIsRUFBMEIsRUFBMUIsQ0FBakIsRUFBK0MsTUFBSyxNQUFwRCxDQUFkO0FBQ0E7QUFDSCxNOztVQUNELEksR0FBTyxVQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixPQUFuQixFQUE0QixPQUE1QixFQUFxQyxPQUFyQyxFQUE4QyxHQUE5QyxFQUFtRCxHQUFuRCxFQUF3RCxHQUF4RCxFQUErRDtBQUNsRSxlQUFLLE1BQUwsR0FBYyxRQUFRLFFBQVIsQ0FBaUIsUUFBUSxVQUFSLENBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLElBQS9CLEVBQXFDLE9BQXJDLEVBQThDLE9BQTlDLEVBQXVELE9BQXZELEVBQWdFLEdBQWhFLEVBQXFFLEdBQXJFLEVBQTBFLEdBQTFFLENBQWpCLEVBQWdHLE1BQUssTUFBckcsQ0FBZDtBQUNBO0FBQ0gsTTs7VUFDRCxLLEdBQVEsVUFBQyxJQUFELEVBQU8sS0FBUCxFQUFjLE1BQWQsRUFBc0IsR0FBdEIsRUFBMkIsSUFBM0IsRUFBaUMsR0FBakMsRUFBd0M7QUFDNUMsZUFBSyxNQUFMLEdBQWMsUUFBUSxRQUFSLENBQWlCLFFBQVEsV0FBUixDQUFvQixJQUFwQixFQUEwQixLQUExQixFQUFpQyxNQUFqQyxFQUF5QyxHQUF6QyxFQUE4QyxJQUE5QyxFQUFvRCxHQUFwRCxDQUFqQixFQUEwRSxNQUFLLE1BQS9FLENBQWQ7QUFDQTtBQUNILE07O1VBQ0QsVyxHQUFjLFVBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxJQUFkLEVBQW9CLEdBQXBCLEVBQTRCO0FBQ3RDLGVBQUssTUFBTCxHQUFjLFFBQVEsUUFBUixDQUFpQixRQUFRLGlCQUFSLENBQTBCLEdBQTFCLEVBQStCLE1BQS9CLEVBQXVDLElBQXZDLEVBQTZDLEdBQTdDLENBQWpCLEVBQW1FLE1BQUssTUFBeEUsQ0FBZDtBQUNBO0FBQ0gsTTs7VUFDRCxTLEdBQVksWUFBTTtBQUNoQixhQUFJLFVBQUo7QUFBQSxhQUFPLFVBQVA7O0FBRUEsYUFBSSxNQUFLLE1BQVQ7O0FBRUEsYUFBSSxFQUFHLENBQUgsQ0FBSixDQUFZLEVBQUcsQ0FBSCxJQUFRLEVBQUcsQ0FBSCxDQUFSLENBQWdCLEVBQUcsQ0FBSCxJQUFRLENBQVI7QUFDNUIsYUFBSSxFQUFHLENBQUgsQ0FBSixDQUFZLEVBQUcsQ0FBSCxJQUFRLEVBQUcsQ0FBSCxDQUFSLENBQWdCLEVBQUcsQ0FBSCxJQUFRLENBQVI7QUFDNUIsYUFBSSxFQUFHLENBQUgsQ0FBSixDQUFZLEVBQUcsQ0FBSCxJQUFRLEVBQUUsRUFBRixDQUFSLENBQWdCLEVBQUUsRUFBRixJQUFRLENBQVI7QUFDNUIsYUFBSSxFQUFHLENBQUgsQ0FBSixDQUFZLEVBQUcsQ0FBSCxJQUFRLEVBQUcsQ0FBSCxDQUFSLENBQWdCLEVBQUcsQ0FBSCxJQUFRLENBQVI7QUFDNUIsYUFBSSxFQUFHLENBQUgsQ0FBSixDQUFZLEVBQUcsQ0FBSCxJQUFRLEVBQUUsRUFBRixDQUFSLENBQWdCLEVBQUUsRUFBRixJQUFRLENBQVI7QUFDNUIsYUFBSSxFQUFFLEVBQUYsQ0FBSixDQUFZLEVBQUUsRUFBRixJQUFRLEVBQUUsRUFBRixDQUFSLENBQWdCLEVBQUUsRUFBRixJQUFRLENBQVI7O0FBRTVCO0FBQ0QsTTs7VUFDRCxRLEdBQVcsVUFBQyxJQUFELEVBQU8sS0FBUCxFQUFjLE1BQWQsRUFBc0IsR0FBdEIsRUFBMkIsSUFBM0IsRUFBaUMsR0FBakMsRUFBd0M7QUFDL0MsZUFBSyxNQUFMLEdBQWMsUUFBUSxXQUFSLENBQW9CLElBQXBCLEVBQTBCLEtBQTFCLEVBQWlDLE1BQWpDLEVBQXlDLEdBQXpDLEVBQThDLElBQTlDLEVBQW9ELEdBQXBELENBQWQ7QUFDQTtBQUNILE07O1VBQ0QsUyxHQUFZLFVBQUMsS0FBRCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFlO0FBQ3ZCLGVBQUssTUFBTCxHQUFjLFFBQVEsWUFBUixDQUFxQixLQUFyQixFQUEyQixDQUEzQixFQUE2QixDQUE3QixFQUErQixDQUEvQixDQUFkO0FBQ0E7QUFDSCxNOztVQUNELFksR0FBZSxVQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFTO0FBQ3BCLGVBQUssTUFBTCxHQUFjLFFBQVEsZUFBUixDQUF3QixDQUF4QixFQUEwQixDQUExQixFQUE0QixDQUE1QixDQUFkO0FBQ0E7QUFDSCxNOztVQUNELFEsR0FBVyxVQUFDLEVBQUQsRUFBSSxFQUFKLEVBQU8sRUFBUCxFQUFZO0FBQ25CLGVBQUssTUFBTCxHQUFjLFFBQVEsV0FBUixDQUFvQixFQUFwQixFQUF1QixFQUF2QixFQUEwQixFQUExQixDQUFkO0FBQ0E7QUFDSCxNOztVQUNELE8sR0FBVSxVQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixPQUFuQixFQUE0QixPQUE1QixFQUFxQyxPQUFyQyxFQUE4QyxHQUE5QyxFQUFtRCxHQUFuRCxFQUF3RCxHQUF4RCxFQUE4RDtBQUNwRSxlQUFLLE1BQUwsR0FBYyxRQUFRLFVBQVIsQ0FBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0IsSUFBL0IsRUFBcUMsT0FBckMsRUFBOEMsT0FBOUMsRUFBdUQsT0FBdkQsRUFBZ0UsR0FBaEUsRUFBcUUsR0FBckUsRUFBMEUsR0FBMUUsQ0FBZDtBQUNBO0FBQ0gsTTs7VUFFRCxjLEdBQWlCLFVBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxJQUFkLEVBQW9CLEdBQXBCLEVBQTRCO0FBQ3pDLGVBQUssTUFBTCxHQUFjLFFBQVEsaUJBQVIsQ0FBMEIsR0FBMUIsRUFBK0IsTUFBL0IsRUFBdUMsSUFBdkMsRUFBNkMsR0FBN0MsQ0FBZDtBQUNBO0FBQ0gsTTs7VUFDRCxZLEdBQWUsVUFBQyxNQUFELEVBQVk7QUFDekIsYUFBTSxnQkFBZ0IsUUFBUSxTQUFSLENBQWtCLE1BQWxCLENBQXRCO0FBQ0EsYUFBSSxhQUFKLEVBQW1CO0FBQ2pCLG1CQUFLLE1BQUwsR0FBYyxhQUFkO0FBQ0Q7QUFDRDtBQUNELE07OztBQW1VTCxRQUFPLE9BQVAsR0FBaUIsT0FBakIsQzs7Ozs7Ozs7Ozs7QUN6WkE7Ozs7QUFDQTs7OztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTtBQUNBLEtBQU0sZ0tBQU47O0FBUUE7QUFDQSxLQUFNLGdHQUFOOztBQU1BLEtBQU0sUUFBUSxJQUFkOztLQUVNLFk7OztBQUNGLDJCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxxR0FDVCxLQURTOztBQUFBLGVBdUNuQixpQkF2Q21CLEdBdUNELFVBQUMsRUFBRCxFQUFNO0FBQ3BCLGlCQUFNLFVBQVUsSUFBSSxZQUFKLENBQWlCLENBQzdCLEdBRDZCLEVBQ3pCLEdBRHlCLEVBQ3BCLENBQUMsR0FEbUIsRUFDZixDQUFDLEdBRGMsRUFDVCxHQURTLEVBQ0wsQ0FBQyxHQURJLENBQWpCLENBQWhCOztBQUlBLGlCQUFNLGVBQWUsR0FBRyxZQUFILEVBQXJCO0FBQ0EsaUJBQUksQ0FBQyxZQUFMLEVBQW1CO0FBQ2YseUJBQVEsR0FBUixDQUFZLG9DQUFaO0FBQ0Esd0JBQU8sQ0FBQyxDQUFSO0FBQ0g7O0FBRUQsZ0JBQUcsVUFBSCxDQUFjLEdBQUcsWUFBakIsRUFBOEIsWUFBOUI7O0FBRUEsZ0JBQUcsVUFBSCxDQUFjLEdBQUcsWUFBakIsRUFBOEIsT0FBOUIsRUFBc0MsR0FBRyxXQUF6Qzs7QUFFQSxpQkFBTSxhQUFhLEdBQUcsaUJBQUgsQ0FBcUIsR0FBRyxPQUF4QixFQUFnQyxZQUFoQyxDQUFuQjtBQUNBLGlCQUFJLGFBQWEsQ0FBakIsRUFBb0I7QUFDaEIseUJBQVEsR0FBUixDQUFZLGtEQUFaO0FBQ0Esd0JBQU8sQ0FBQyxDQUFSO0FBQ0g7O0FBRUQsZ0JBQUcsbUJBQUgsQ0FBdUIsVUFBdkIsRUFBa0MsQ0FBbEMsRUFBb0MsR0FBRyxLQUF2QyxFQUE2QyxLQUE3QyxFQUFtRCxDQUFuRCxFQUFxRCxDQUFyRDs7QUFFQSxnQkFBRyx1QkFBSCxDQUEyQixVQUEzQjs7QUFFQSxvQkFBTyxDQUFQO0FBQ0gsVUFqRWtCOztBQUFBO0FBRWxCOzs7OzZDQUNtQjtBQUNoQixpQkFBTSxTQUFTLG1CQUFTLFdBQVQsQ0FBcUIsS0FBSyxJQUFMLENBQVUsUUFBVixDQUFyQixDQUFmOztBQUVBLGlCQUFNLEtBQUssT0FBTyxVQUFQLENBQWtCLE9BQWxCLENBQVg7O0FBRUEsaUJBQUksQ0FBQyxFQUFMLEVBQVM7QUFDTCx5QkFBUSxHQUFSLENBQVksK0NBQVo7QUFDQTtBQUNIOztBQUVELGlCQUFJLENBQUMsNkJBQVksRUFBWixFQUFlLGNBQWYsRUFBOEIsY0FBOUIsQ0FBTCxFQUFvRDtBQUNoRCx5QkFBUSxHQUFSLENBQVksOEJBQVo7QUFDQTtBQUNIOztBQUVELGlCQUFNLElBQUksS0FBSyxpQkFBTCxDQUF1QixFQUF2QixDQUFWO0FBQ0EsaUJBQUksSUFBRSxDQUFOLEVBQVM7QUFDTCx5QkFBUSxHQUFSLENBQVksNkNBQVo7QUFDQTtBQUNIO0FBQ0QsaUJBQU0sVUFBVSxzQkFBaEI7QUFDQSxxQkFBUSxNQUFSLENBQWUsS0FBZixFQUFxQixDQUFyQixFQUF1QixDQUF2QixFQUF5QixDQUF6QjtBQUNBLGlCQUFNLGNBQWMsUUFBUSxNQUE1Qjs7QUFFQSxpQkFBTSxnQkFBZ0IsR0FBRyxrQkFBSCxDQUFzQixHQUFHLE9BQXpCLEVBQWlDLGVBQWpDLENBQXRCO0FBQ0EsaUJBQUksQ0FBQyxhQUFMLEVBQW9CO0FBQ2hCO0FBQ0g7QUFDRCxnQkFBRyxnQkFBSCxDQUFvQixhQUFwQixFQUFrQyxLQUFsQyxFQUF3QyxXQUF4Qzs7QUFFQSxnQkFBRyxVQUFILENBQWMsR0FBZCxFQUFtQixHQUFuQixFQUF3QixHQUF4QixFQUE2QixHQUE3Qjs7QUFFQSxnQkFBRyxLQUFILENBQVMsR0FBRyxnQkFBWjs7QUFFQSxnQkFBRyxVQUFILENBQWMsR0FBRyxTQUFqQixFQUEyQixDQUEzQixFQUE2QixDQUE3QjtBQUNIOzs7a0NBNEJRO0FBQ0wsb0JBQ0k7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBLHVCQUFLLE9BQU8sRUFBQyxVQUFTLE1BQVYsRUFBaUIsUUFBTyxRQUF4QixFQUFaO0FBQWdEO0FBQWhELGtCQURKO0FBRUk7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBLDJCQUFRLEtBQUksUUFBWjtBQUNLO0FBREw7QUFESjtBQUZKLGNBREo7QUFVSDs7OztHQTlFc0IsZ0JBQU0sUzs7QUFnRmpDLFFBQU8sT0FBUCxHQUFpQixZQUFqQixDOzs7Ozs7Ozs7OztBQ3hHQTs7OztBQUNBOzs7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0EsS0FBTSxnS0FBTjs7QUFRQTtBQUNBLEtBQU0sZ0dBQU47O0tBTU0sVzs7O0FBQ0YsMEJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLG9HQUNULEtBRFM7O0FBQUEsZUF5Q25CLGlCQXpDbUIsR0F5Q0QsVUFBQyxFQUFELEVBQU07QUFDcEIsaUJBQU0sVUFBVSxJQUFJLFlBQUosQ0FBaUIsQ0FDN0IsR0FENkIsRUFDekIsR0FEeUIsRUFDcEIsQ0FBQyxHQURtQixFQUNmLENBQUMsR0FEYyxFQUNULEdBRFMsRUFDTCxDQUFDLEdBREksQ0FBakIsQ0FBaEI7O0FBSUEsaUJBQU0sZUFBZSxHQUFHLFlBQUgsRUFBckI7QUFDQSxpQkFBSSxDQUFDLFlBQUwsRUFBbUI7QUFDZix5QkFBUSxHQUFSLENBQVksb0NBQVo7QUFDQSx3QkFBTyxDQUFDLENBQVI7QUFDSDs7QUFFRCxnQkFBRyxVQUFILENBQWMsR0FBRyxZQUFqQixFQUE4QixZQUE5Qjs7QUFFQSxnQkFBRyxVQUFILENBQWMsR0FBRyxZQUFqQixFQUE4QixPQUE5QixFQUFzQyxHQUFHLFdBQXpDOztBQUVBLGlCQUFNLGFBQWEsR0FBRyxpQkFBSCxDQUFxQixHQUFHLE9BQXhCLEVBQWdDLFlBQWhDLENBQW5CO0FBQ0EsaUJBQUksYUFBYSxDQUFqQixFQUFvQjtBQUNoQix5QkFBUSxHQUFSLENBQVksa0RBQVo7QUFDQSx3QkFBTyxDQUFDLENBQVI7QUFDSDs7QUFFRCxnQkFBRyxtQkFBSCxDQUF1QixVQUF2QixFQUFrQyxDQUFsQyxFQUFvQyxHQUFHLEtBQXZDLEVBQTZDLEtBQTdDLEVBQW1ELENBQW5ELEVBQXFELENBQXJEOztBQUVBLGdCQUFHLHVCQUFILENBQTJCLFVBQTNCOztBQUVBLG9CQUFPLENBQVA7QUFDSCxVQW5Fa0I7O0FBQUE7QUFFbEI7Ozs7NkNBQ21CO0FBQ2hCLGlCQUFNLFNBQVMsbUJBQVMsV0FBVCxDQUFxQixLQUFLLElBQUwsQ0FBVSxRQUFWLENBQXJCLENBQWY7O0FBRUEsaUJBQU0sS0FBSyxPQUFPLFVBQVAsQ0FBa0IsT0FBbEIsQ0FBWDs7QUFFQSxpQkFBSSxDQUFDLEVBQUwsRUFBUztBQUNMLHlCQUFRLEdBQVIsQ0FBWSwrQ0FBWjtBQUNBO0FBQ0g7O0FBRUQsaUJBQUksQ0FBQyw2QkFBWSxFQUFaLEVBQWUsY0FBZixFQUE4QixjQUE5QixDQUFMLEVBQW9EO0FBQ2hELHlCQUFRLEdBQVIsQ0FBWSw4QkFBWjtBQUNBO0FBQ0g7O0FBRUQsaUJBQU0sSUFBSSxLQUFLLGlCQUFMLENBQXVCLEVBQXZCLENBQVY7QUFDQSxpQkFBSSxJQUFFLENBQU4sRUFBUztBQUNMLHlCQUFRLEdBQVIsQ0FBWSw2Q0FBWjtBQUNBO0FBQ0g7O0FBRUQsaUJBQU0sZ0JBQWdCLEdBQUcsa0JBQUgsQ0FBc0IsR0FBRyxPQUF6QixFQUFpQyxlQUFqQyxDQUF0QjtBQUNBLGlCQUFJLENBQUMsYUFBTCxFQUFvQjtBQUNoQix5QkFBUSxHQUFSLENBQVkscURBQVo7QUFDQTtBQUNIO0FBQ0QsaUJBQU0sVUFBVSxzQkFBaEI7QUFDQSxxQkFBUSxLQUFSLENBQWMsR0FBZCxFQUFrQixHQUFsQixFQUFzQixHQUF0QjtBQUNBLGlCQUFNLGNBQWMsUUFBUSxNQUE1Qjs7QUFFQSxnQkFBRyxnQkFBSCxDQUFvQixhQUFwQixFQUFrQyxLQUFsQyxFQUF5QyxXQUF6Qzs7QUFFQSxnQkFBRyxVQUFILENBQWMsR0FBZCxFQUFtQixHQUFuQixFQUF3QixHQUF4QixFQUE2QixHQUE3Qjs7QUFFQSxnQkFBRyxLQUFILENBQVMsR0FBRyxnQkFBWjs7QUFFQSxnQkFBRyxVQUFILENBQWMsR0FBRyxTQUFqQixFQUEyQixDQUEzQixFQUE2QixDQUE3QjtBQUNIOzs7a0NBNEJRO0FBQ0wsb0JBQ0k7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBLHVCQUFLLE9BQU8sRUFBQyxVQUFTLE1BQVYsRUFBaUIsUUFBTyxRQUF4QixFQUFaO0FBQWdEO0FBQWhELGtCQURKO0FBRUk7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBLDJCQUFRLEtBQUksUUFBWjtBQUNLO0FBREw7QUFESjtBQUZKLGNBREo7QUFVSDs7OztHQWhGcUIsZ0JBQU0sUzs7QUFrRmhDLFFBQU8sT0FBUCxHQUFpQixXQUFqQixDOzs7Ozs7Ozs7OztBQ3hHQTs7OztBQUNBOzs7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0EsS0FBTSxnS0FBTjs7QUFRQTtBQUNBLEtBQU0sZ0dBQU47O0tBTU0sZTs7O0FBQ0YsOEJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHdHQUNULEtBRFM7O0FBQUEsZUF3Q25CLGlCQXhDbUIsR0F3Q0QsVUFBQyxFQUFELEVBQU07QUFDcEIsaUJBQU0sVUFBVSxJQUFJLFlBQUosQ0FBaUIsQ0FDN0IsR0FENkIsRUFDekIsR0FEeUIsRUFDcEIsQ0FBQyxHQURtQixFQUNmLENBQUMsR0FEYyxFQUNULEdBRFMsRUFDTCxDQUFDLEdBREksQ0FBakIsQ0FBaEI7O0FBSUEsaUJBQU0sZUFBZSxHQUFHLFlBQUgsRUFBckI7QUFDQSxpQkFBSSxDQUFDLFlBQUwsRUFBbUI7QUFDZix5QkFBUSxHQUFSLENBQVksb0NBQVo7QUFDQSx3QkFBTyxDQUFDLENBQVI7QUFDSDs7QUFFRCxnQkFBRyxVQUFILENBQWMsR0FBRyxZQUFqQixFQUE4QixZQUE5Qjs7QUFFQSxnQkFBRyxVQUFILENBQWMsR0FBRyxZQUFqQixFQUE4QixPQUE5QixFQUFzQyxHQUFHLFdBQXpDOztBQUVBLGlCQUFNLGFBQWEsR0FBRyxpQkFBSCxDQUFxQixHQUFHLE9BQXhCLEVBQWdDLFlBQWhDLENBQW5CO0FBQ0EsaUJBQUksYUFBYSxDQUFqQixFQUFvQjtBQUNoQix5QkFBUSxHQUFSLENBQVksa0RBQVo7QUFDQSx3QkFBTyxDQUFDLENBQVI7QUFDSDs7QUFFRCxnQkFBRyxtQkFBSCxDQUF1QixVQUF2QixFQUFrQyxDQUFsQyxFQUFvQyxHQUFHLEtBQXZDLEVBQTZDLEtBQTdDLEVBQW1ELENBQW5ELEVBQXFELENBQXJEOztBQUVBLGdCQUFHLHVCQUFILENBQTJCLFVBQTNCOztBQUVBLG9CQUFPLENBQVA7QUFDSCxVQWxFa0I7O0FBQUE7QUFFbEI7Ozs7NkNBQ21CO0FBQ2hCLGlCQUFNLFNBQVMsbUJBQVMsV0FBVCxDQUFxQixLQUFLLElBQUwsQ0FBVSxRQUFWLENBQXJCLENBQWY7O0FBRUEsaUJBQU0sS0FBSyxPQUFPLFVBQVAsQ0FBa0IsT0FBbEIsQ0FBWDs7QUFFQSxpQkFBSSxDQUFDLEVBQUwsRUFBUztBQUNMLHlCQUFRLEdBQVIsQ0FBWSwrQ0FBWjtBQUNBO0FBQ0g7O0FBRUQsaUJBQUksQ0FBQyw2QkFBWSxFQUFaLEVBQWUsY0FBZixFQUE4QixjQUE5QixDQUFMLEVBQW9EO0FBQ2hELHlCQUFRLEdBQVIsQ0FBWSw4QkFBWjtBQUNBO0FBQ0g7O0FBRUQsaUJBQU0sSUFBSSxLQUFLLGlCQUFMLENBQXVCLEVBQXZCLENBQVY7QUFDQSxpQkFBSSxJQUFFLENBQU4sRUFBUztBQUNMLHlCQUFRLEdBQVIsQ0FBWSw2Q0FBWjtBQUNBO0FBQ0g7QUFDRCxpQkFBTSxVQUFVLHNCQUFoQjtBQUNBLHFCQUFRLFNBQVIsQ0FBa0IsR0FBbEIsRUFBc0IsQ0FBdEIsRUFBd0IsQ0FBeEI7QUFDQSxxQkFBUSxNQUFSLENBQWUsRUFBZixFQUFrQixDQUFsQixFQUFvQixDQUFwQixFQUFzQixDQUF0QjtBQUNBLGlCQUFJLGNBQWMsUUFBUSxNQUExQjs7QUFFQSxpQkFBTSxnQkFBZ0IsR0FBRyxrQkFBSCxDQUFzQixHQUFHLE9BQXpCLEVBQWlDLGVBQWpDLENBQXRCO0FBQ0EsaUJBQUksQ0FBQyxhQUFMLEVBQW9CO0FBQ2hCO0FBQ0g7QUFDRCxnQkFBRyxnQkFBSCxDQUFvQixhQUFwQixFQUFrQyxLQUFsQyxFQUF3QyxXQUF4Qzs7QUFFQSxnQkFBRyxVQUFILENBQWMsR0FBZCxFQUFtQixHQUFuQixFQUF3QixHQUF4QixFQUE2QixHQUE3Qjs7QUFFQSxnQkFBRyxLQUFILENBQVMsR0FBRyxnQkFBWjs7QUFFQSxnQkFBRyxVQUFILENBQWMsR0FBRyxTQUFqQixFQUEyQixDQUEzQixFQUE2QixDQUE3QjtBQUNIOzs7a0NBNEJRO0FBQ0wsb0JBQ0k7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBLHVCQUFLLE9BQU8sRUFBQyxVQUFTLE1BQVYsRUFBaUIsUUFBTyxRQUF4QixFQUFaO0FBQWdEO0FBQWhELGtCQURKO0FBRUk7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBLDJCQUFRLEtBQUksUUFBWjtBQUNLO0FBREw7QUFESjtBQUZKLGNBREo7QUFVSDs7OztHQS9FeUIsZ0JBQU0sUzs7QUFpRnBDLFFBQU8sT0FBUCxHQUFpQixlQUFqQixDOzs7Ozs7Ozs7OztBQ3ZHQTs7OztBQUNBOzs7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0EsS0FBTSxnS0FBTjs7QUFRQTtBQUNBLEtBQU0sZ0dBQU47O0tBTU0sUTs7O0FBQ0oscUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDZGQUNYLEtBRFc7O0FBQUEsV0E0Q25CLElBNUNtQixHQTRDWixVQUFDLEVBQUQsRUFBSSxhQUFKLEVBQWtCLE1BQWxCLEVBQXlCLENBQXpCLEVBQStCO0FBQ3BDLFVBQUcsZ0JBQUgsQ0FBb0IsYUFBcEIsRUFBa0MsS0FBbEMsRUFBd0MsTUFBeEM7O0FBRUEsVUFBRyxVQUFILENBQWMsR0FBZCxFQUFtQixHQUFuQixFQUF3QixHQUF4QixFQUE2QixHQUE3Qjs7QUFFQSxVQUFHLEtBQUgsQ0FBUyxHQUFHLGdCQUFaOztBQUVBLFVBQUcsVUFBSCxDQUFjLEdBQUcsU0FBakIsRUFBMkIsQ0FBM0IsRUFBNkIsQ0FBN0I7QUFDRCxNQXBEa0I7O0FBQUEsV0FxRG5CLGlCQXJEbUIsR0FxREMsVUFBQyxFQUFELEVBQVE7QUFDMUIsV0FBTSxVQUFVLElBQUksWUFBSixDQUFpQixDQUMvQixHQUQrQixFQUMzQixHQUQyQixFQUN0QixDQUFDLEdBRHFCLEVBQ2pCLENBQUMsR0FEZ0IsRUFDWCxHQURXLEVBQ1AsQ0FBQyxHQURNLENBQWpCLENBQWhCOztBQUlBLFdBQU0sZUFBZSxHQUFHLFlBQUgsRUFBckI7QUFDQSxXQUFJLENBQUMsWUFBTCxFQUFtQjtBQUNqQixpQkFBUSxHQUFSLENBQVksb0NBQVo7QUFDQSxnQkFBTyxDQUFDLENBQVI7QUFDRDs7QUFFRCxVQUFHLFVBQUgsQ0FBYyxHQUFHLFlBQWpCLEVBQThCLFlBQTlCOztBQUVBLFVBQUcsVUFBSCxDQUFjLEdBQUcsWUFBakIsRUFBOEIsT0FBOUIsRUFBc0MsR0FBRyxXQUF6Qzs7QUFFQSxXQUFNLGFBQWEsR0FBRyxpQkFBSCxDQUFxQixHQUFHLE9BQXhCLEVBQWdDLFlBQWhDLENBQW5CO0FBQ0EsV0FBSSxhQUFhLENBQWpCLEVBQW9CO0FBQ2xCLGlCQUFRLEdBQVIsQ0FBWSxrREFBWjtBQUNBLGdCQUFPLENBQUMsQ0FBUjtBQUNEOztBQUVELFVBQUcsbUJBQUgsQ0FBdUIsVUFBdkIsRUFBa0MsQ0FBbEMsRUFBb0MsR0FBRyxLQUF2QyxFQUE2QyxLQUE3QyxFQUFtRCxDQUFuRCxFQUFxRCxDQUFyRDs7QUFFQSxVQUFHLHVCQUFILENBQTJCLFVBQTNCOztBQUVBLGNBQU8sQ0FBUDtBQUNELE1BL0VrQjs7QUFBQSxXQThGbkIsRUE5Rm1CLEdBOEZkLFlBQU07QUFDVCxhQUFLLEtBQUwsR0FBYSxNQUFLLEtBQUwsR0FBVyxFQUF4QjtBQUNBLGVBQVEsR0FBUixDQUFZLE1BQUssS0FBakI7QUFDRCxNQWpHa0I7O0FBQUEsV0FrR25CLElBbEdtQixHQWtHWixZQUFNO0FBQ1gsYUFBSyxLQUFMLEdBQWEsS0FBSyxHQUFMLENBQVMsTUFBSyxLQUFMLEdBQWEsRUFBdEIsRUFBMEIsQ0FBMUIsQ0FBYjtBQUNBLGVBQVEsR0FBUixDQUFZLE1BQUssS0FBakI7QUFDRCxNQXJHa0I7O0FBQUE7QUFFbEI7Ozs7eUNBQ21CO0FBQUE7O0FBQ2xCLFdBQU0sU0FBUyxtQkFBUyxXQUFULENBQXFCLEtBQUssSUFBTCxDQUFVLFFBQVYsQ0FBckIsQ0FBZjs7QUFFQSxXQUFNLEtBQUssT0FBTyxVQUFQLENBQWtCLE9BQWxCLENBQVg7O0FBRUEsV0FBSSxDQUFDLEVBQUwsRUFBUztBQUNQLGlCQUFRLEdBQVIsQ0FBWSwrQ0FBWjtBQUNBO0FBQ0Q7O0FBRUQsV0FBSSxDQUFDLDZCQUFZLEVBQVosRUFBZSxjQUFmLEVBQThCLGNBQTlCLENBQUwsRUFBb0Q7QUFDbEQsaUJBQVEsR0FBUixDQUFZLDhCQUFaO0FBQ0E7QUFDRDs7QUFFRCxXQUFNLElBQUksS0FBSyxpQkFBTCxDQUF1QixFQUF2QixDQUFWO0FBQ0EsV0FBSSxJQUFJLENBQVIsRUFBVztBQUNULGlCQUFRLEdBQVIsQ0FBWSw2Q0FBWjtBQUNBO0FBQ0Q7O0FBR0QsV0FBTSxnQkFBZ0IsR0FBRyxrQkFBSCxDQUFzQixHQUFHLE9BQXpCLEVBQWlDLGVBQWpDLENBQXRCO0FBQ0EsV0FBSSxDQUFDLGFBQUwsRUFBb0I7QUFDbEI7QUFDRDtBQUNELFdBQU0sVUFBVSxzQkFBaEI7QUFDQSxZQUFLLEtBQUwsR0FBYSxHQUFiO0FBQ0EsWUFBSyxLQUFMLEdBQWEsSUFBYjtBQUNBLFdBQUksT0FBTyxTQUFQLElBQU8sR0FBTTtBQUNmLGFBQUksTUFBTSxLQUFLLEdBQUwsRUFBVjtBQUNBLGFBQUksVUFBVSxNQUFNLE9BQUssSUFBekI7QUFDQSxnQkFBSyxJQUFMLEdBQVksR0FBWjtBQUNBLGdCQUFLLEtBQUwsR0FBYSxVQUFRLE9BQUssS0FBYixHQUFtQixNQUFoQztBQUNBLGlCQUFRLE1BQVIsQ0FBZSxPQUFLLEtBQXBCLEVBQTBCLENBQTFCLEVBQTRCLENBQTVCLEVBQThCLENBQTlCO0FBQ0EsZ0JBQUssSUFBTCxDQUFVLEVBQVYsRUFBYSxhQUFiLEVBQTJCLFFBQVEsTUFBbkMsRUFBMEMsQ0FBMUM7QUFDQSwrQkFBc0IsSUFBdEI7QUFDRCxRQVJEO0FBU0EsWUFBSyxJQUFMLEdBQVksS0FBSyxHQUFMLEVBQVo7QUFDQTtBQUNEOzs7OEJBcUNRO0FBQ1AsY0FDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsYUFBSyxPQUFPLEVBQUMsVUFBUyxNQUFWLEVBQWlCLFFBQU8sUUFBeEIsRUFBWjtBQUFnRDtBQUFoRCxVQURGO0FBRUU7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGVBQVEsS0FBSSxRQUFaO0FBQ0c7QUFESCxZQURGO0FBSUU7QUFBQTtBQUFBLGVBQVEsTUFBSyxRQUFiLEVBQXNCLFNBQVMsS0FBSyxFQUFwQztBQUFBO0FBQUEsWUFKRjtBQUtFO0FBQUE7QUFBQSxlQUFRLE1BQUssUUFBYixFQUFzQixTQUFTLEtBQUssSUFBcEM7QUFBQTtBQUFBO0FBTEY7QUFGRixRQURGO0FBWUQ7Ozs7R0E5Rm9CLGdCQUFNLFM7O0FBd0c3QixRQUFPLE9BQVAsR0FBaUIsUUFBakIsQyIsImZpbGUiOiJqcy84LTBjMTc3MDQwYzQ1ZDI1YjkxN2IzLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgbGlzdCA9IFtdO1xyXG5cclxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXHJcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzW2ldO1xyXG5cdFx0XHRpZihpdGVtWzJdKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBpdGVtWzFdICsgXCJ9XCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKGl0ZW1bMV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0LmpvaW4oXCJcIik7XHJcblx0fTtcclxuXHJcblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcclxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XHJcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcclxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xyXG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XHJcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcclxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcclxuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxyXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xyXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxyXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxyXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xyXG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xyXG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblx0cmV0dXJuIGxpc3Q7XHJcbn07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4gKiogbW9kdWxlIGlkID0gMjUyXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSA2IDcgOCA5IDE4IDE5IDIwIDIzIDI0IDI1IDI2IDI3IDI4IDI5IDMwIDMxIDMyXG4gKiovIiwiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxudmFyIHN0eWxlc0luRG9tID0ge30sXHJcblx0bWVtb2l6ZSA9IGZ1bmN0aW9uKGZuKSB7XHJcblx0XHR2YXIgbWVtbztcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRcdHJldHVybiBtZW1vO1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cdGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIC9tc2llIFs2LTldXFxiLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpO1xyXG5cdH0pLFxyXG5cdGdldEhlYWRFbGVtZW50ID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcblx0fSksXHJcblx0c2luZ2xldG9uRWxlbWVudCA9IG51bGwsXHJcblx0c2luZ2xldG9uQ291bnRlciA9IDAsXHJcblx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AgPSBbXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xyXG5cdGlmKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xyXG5cdFx0aWYodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XHJcblx0fVxyXG5cclxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cclxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XHJcblxyXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiA8aGVhZD4uXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcclxuXHJcblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0KTtcclxuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcclxuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XHJcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xyXG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XHJcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcclxuXHRcdH1cclxuXHRcdGlmKG5ld0xpc3QpIHtcclxuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0KTtcclxuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcclxuXHRcdH1cclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xyXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XHJcblx0XHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKVxyXG5cdFx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oKTtcclxuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKSB7XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XHJcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcclxuXHRcdGlmKGRvbVN0eWxlKSB7XHJcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHBhcnRzID0gW107XHJcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMobGlzdCkge1xyXG5cdHZhciBzdHlsZXMgPSBbXTtcclxuXHR2YXIgbmV3U3R5bGVzID0ge307XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcclxuXHRcdHZhciBpZCA9IGl0ZW1bMF07XHJcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcclxuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XHJcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcclxuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcclxuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKVxyXG5cdFx0XHRzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XHJcblx0fVxyXG5cdHJldHVybiBzdHlsZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpIHtcclxuXHR2YXIgaGVhZCA9IGdldEhlYWRFbGVtZW50KCk7XHJcblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Bbc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XHJcblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcclxuXHRcdGlmKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xyXG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGhlYWQuZmlyc3RDaGlsZCk7XHJcblx0XHR9IGVsc2UgaWYobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcclxuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0XHR9XHJcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlRWxlbWVudCk7XHJcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XHJcblx0XHRoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnLiBNdXN0IGJlICd0b3AnIG9yICdib3R0b20nLlwiKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcclxuXHRzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdHZhciBpZHggPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlRWxlbWVudCk7XHJcblx0aWYoaWR4ID49IDApIHtcclxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcclxuXHR2YXIgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xyXG5cdHN0eWxlRWxlbWVudC50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xyXG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpO1xyXG5cdHJldHVybiBzdHlsZUVsZW1lbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpIHtcclxuXHR2YXIgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcclxuXHRsaW5rRWxlbWVudC5yZWwgPSBcInN0eWxlc2hlZXRcIjtcclxuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGlua0VsZW1lbnQpO1xyXG5cdHJldHVybiBsaW5rRWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU3R5bGUob2JqLCBvcHRpb25zKSB7XHJcblx0dmFyIHN0eWxlRWxlbWVudCwgdXBkYXRlLCByZW1vdmU7XHJcblxyXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xyXG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBzaW5nbGV0b25FbGVtZW50IHx8IChzaW5nbGV0b25FbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcclxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIGZhbHNlKTtcclxuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIHRydWUpO1xyXG5cdH0gZWxzZSBpZihvYmouc291cmNlTWFwICYmXHJcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xyXG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XHJcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XHJcblx0XHRcdGlmKHN0eWxlRWxlbWVudC5ocmVmKVxyXG5cdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGVFbGVtZW50LmhyZWYpO1xyXG5cdFx0fTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xyXG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XHJcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKG9iaik7XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZShuZXdPYmopIHtcclxuXHRcdGlmKG5ld09iaikge1xyXG5cdFx0XHRpZihuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXApXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cdH07XHJcbn1cclxuXHJcbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xyXG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xyXG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XHJcblx0fTtcclxufSkoKTtcclxuXHJcbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcoc3R5bGVFbGVtZW50LCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcclxuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XHJcblxyXG5cdGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XHJcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlRWxlbWVudC5jaGlsZE5vZGVzO1xyXG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xyXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGNzc05vZGUpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZUVsZW1lbnQsIG9iaikge1xyXG5cdHZhciBjc3MgPSBvYmouY3NzO1xyXG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcclxuXHJcblx0aWYobWVkaWEpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcclxuXHR9XHJcblxyXG5cdGlmKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR3aGlsZShzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xyXG5cdFx0fVxyXG5cdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlTGluayhsaW5rRWxlbWVudCwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IG9iai5jc3M7XHJcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XHJcblxyXG5cdGlmKHNvdXJjZU1hcCkge1xyXG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcclxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcclxuXHR9XHJcblxyXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xyXG5cclxuXHR2YXIgb2xkU3JjID0gbGlua0VsZW1lbnQuaHJlZjtcclxuXHJcblx0bGlua0VsZW1lbnQuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XHJcblxyXG5cdGlmKG9sZFNyYylcclxuXHRcdFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcclxufVxyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXG4gKiogbW9kdWxlIGlkID0gMjUzXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSA2IDcgOCA5IDE4IDE5IDIwIDIzIDI0IDI1IDI2IDI3IDI4IDI5IDMwIDMxIDMyXG4gKiovIiwiLyoqXG4gKiBDcmVhdGUgYSBwcm9ncmFtIG9iamVjdCBhbmQgbWFrZSBjdXJyZW50XG4gKiBAcGFyYW0gZ2wgR0wgY29udGV4dFxuICogQHBhcmFtIHZzaGFkZXIgYSB2ZXJ0ZXggc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEBwYXJhbSBmc2hhZGVyIGEgZnJhZ21lbnQgc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEByZXR1cm4gdHJ1ZSwgaWYgdGhlIHByb2dyYW0gb2JqZWN0IHdhcyBjcmVhdGVkIGFuZCBzdWNjZXNzZnVsbHkgbWFkZSBjdXJyZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0U2hhZGVycyhnbCwgdnNoYWRlciwgZnNoYWRlcikge1xuICB2YXIgcHJvZ3JhbSA9IGNyZWF0ZVByb2dyYW0oZ2wsIHZzaGFkZXIsIGZzaGFkZXIpO1xuICBpZiAoIXByb2dyYW0pIHtcbiAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGNyZWF0ZSBwcm9ncmFtJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcbiAgZ2wucHJvZ3JhbSA9IHByb2dyYW07XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBsaW5rZWQgcHJvZ3JhbSBvYmplY3RcbiAqIEBwYXJhbSBnbCBHTCBjb250ZXh0XG4gKiBAcGFyYW0gdnNoYWRlciBhIHZlcnRleCBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHBhcmFtIGZzaGFkZXIgYSBmcmFnbWVudCBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHJldHVybiBjcmVhdGVkIHByb2dyYW0gb2JqZWN0LCBvciBudWxsIGlmIHRoZSBjcmVhdGlvbiBoYXMgZmFpbGVkXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVByb2dyYW0oZ2wsIHZzaGFkZXIsIGZzaGFkZXIpIHtcbiAgLy8gQ3JlYXRlIHNoYWRlciBvYmplY3RcbiAgdmFyIHZlcnRleFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wsIGdsLlZFUlRFWF9TSEFERVIsIHZzaGFkZXIpO1xuICB2YXIgZnJhZ21lbnRTaGFkZXIgPSBsb2FkU2hhZGVyKGdsLCBnbC5GUkFHTUVOVF9TSEFERVIsIGZzaGFkZXIpO1xuICBpZiAoIXZlcnRleFNoYWRlciB8fCAhZnJhZ21lbnRTaGFkZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIHByb2dyYW0gb2JqZWN0XG4gIHZhciBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICBpZiAoIXByb2dyYW0pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEF0dGFjaCB0aGUgc2hhZGVyIG9iamVjdHNcbiAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRleFNoYWRlcik7XG4gIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmFnbWVudFNoYWRlcik7XG5cbiAgLy8gTGluayB0aGUgcHJvZ3JhbSBvYmplY3RcbiAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XG5cbiAgLy8gQ2hlY2sgdGhlIHJlc3VsdCBvZiBsaW5raW5nXG4gIHZhciBsaW5rZWQgPSBnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIGdsLkxJTktfU1RBVFVTKTtcbiAgaWYgKCFsaW5rZWQpIHtcbiAgICB2YXIgZXJyb3IgPSBnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKTtcbiAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGxpbmsgcHJvZ3JhbTogJyArIGVycm9yKTtcbiAgICBnbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xuICAgIGdsLmRlbGV0ZVNoYWRlcihmcmFnbWVudFNoYWRlcik7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKHZlcnRleFNoYWRlcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHByb2dyYW07XG59XG5cblxuLyoqXG4gKiBDcmVhdGUgYSBzaGFkZXIgb2JqZWN0XG4gKiBAcGFyYW0gZ2wgR0wgY29udGV4dFxuICogQHBhcmFtIHR5cGUgdGhlIHR5cGUgb2YgdGhlIHNoYWRlciBvYmplY3QgdG8gYmUgY3JlYXRlZFxuICogQHBhcmFtIHNvdXJjZSBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHJldHVybiBjcmVhdGVkIHNoYWRlciBvYmplY3QsIG9yIG51bGwgaWYgdGhlIGNyZWF0aW9uIGhhcyBmYWlsZWQuXG4gKi9cbmZ1bmN0aW9uIGxvYWRTaGFkZXIoZ2wsIHR5cGUsIHNvdXJjZSkge1xuICAvLyBDcmVhdGUgc2hhZGVyIG9iamVjdFxuICB2YXIgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUpO1xuICBpZiAoc2hhZGVyID09IG51bGwpIHtcbiAgICBjb25zb2xlLmxvZygndW5hYmxlIHRvIGNyZWF0ZSBzaGFkZXInKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFNldCB0aGUgc2hhZGVyIHByb2dyYW1cbiAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcblxuICAvLyBDb21waWxlIHRoZSBzaGFkZXJcbiAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xuXG4gIC8vIENoZWNrIHRoZSByZXN1bHQgb2YgY29tcGlsYXRpb25cbiAgdmFyIGNvbXBpbGVkID0gZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpO1xuICBpZiAoIWNvbXBpbGVkKSB7XG4gICAgdmFyIGVycm9yID0gZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpO1xuICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gY29tcGlsZSBzaGFkZXI6ICcgKyBlcnJvcik7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gc2hhZGVyO1xufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbGliL3dlYmdsL3V0aWxzLmpzXG4gKiovIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vVHJhbnNmb3JtLnNjc3MnXG5cbmltcG9ydCBUcmFuc2xhdGUgZnJvbSAnLi9jb21wb25lbnRzL1RyYW5zbGF0ZS9UcmFuc2xhdGUnXG5pbXBvcnQgUm90YXRlIGZyb20gJy4vY29tcG9uZW50cy9Sb3RhdGUvUm90YXRlJ1xuaW1wb3J0IFNjYWxlIGZyb20gJy4vY29tcG9uZW50cy9TY2FsZS9TY2FsZSdcbmltcG9ydCBSb3RhdGVUcmFuc2xhdGUgZnJvbSAnLi9jb21wb25lbnRzL1JvdGF0ZVRyYW5zbGF0ZS9Sb3RhdGVUcmFuc2xhdGUnXG5pbXBvcnQgUm90YXRpbmcgZnJvbSAnLi9jb21wb25lbnRzL1JvdGF0aW5nL1JvdGF0aW5nJ1xuXG5jbGFzcyBUcmFuc2Zvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKVxuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLnRyYW5zZm9ybX0+XG4gICAgICAgICAgICAgICAgPFRyYW5zbGF0ZS8+XG4gICAgICAgICAgICAgICAgPFJvdGF0ZS8+XG4gICAgICAgICAgICAgICAgPFNjYWxlLz5cbiAgICAgICAgICAgICAgICA8Um90YXRlVHJhbnNsYXRlLz5cbiAgICAgICAgICAgICAgICA8Um90YXRpbmcvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zZm9ybVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvdHJhbnNmb3JtL1RyYW5zZm9ybS5qc1xuICoqLyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL1RyYW5zZm9ybS5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9UcmFuc2Zvcm0uc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9UcmFuc2Zvcm0uc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC90cmFuc2Zvcm0vVHJhbnNmb3JtLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSAzMTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gOFxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLlRyYW5zZm9ybV9fdHJhbnNmb3JtX19fMlRyYTMge1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIC1tcy1mbGV4LXBhY2s6IGRpc3RyaWJ1dGU7XFxuICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICAtbXMtZmxleC13cmFwOiB3cmFwO1xcbiAgICAgIGZsZXgtd3JhcDogd3JhcDsgfVxcblxcbi5UcmFuc2Zvcm1fX3RyYW5zZm9ybV9fXzJUcmEzID4gZGl2IHtcXG4gIG1hcmdpbjogMCA1MHB4OyB9XFxuXFxuLlRyYW5zZm9ybV9fdHJhbnNmb3JtX19fMlRyYTMgY2FudmFzIHtcXG4gIHdpZHRoOiAzMDBweDtcXG4gIGhlaWdodDogMzAwcHg7IH1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5leHBvcnRzLmxvY2FscyA9IHtcblx0XCJ0cmFuc2Zvcm1cIjogXCJUcmFuc2Zvcm1fX3RyYW5zZm9ybV9fXzJUcmEzXCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlcj9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi9+L3Bvc3Rjc3MtbG9hZGVyIS4vfi9zYXNzLWxvYWRlciEuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC90cmFuc2Zvcm0vVHJhbnNmb3JtLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSAzMThcbiAqKiBtb2R1bGUgY2h1bmtzID0gOFxuICoqLyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5cbmltcG9ydCB7aW5pdFNoYWRlcnN9IGZyb20gJ1dlQkdMVXRpbHMnXG5pbXBvcnQgTWF0cml4NCBmcm9tICdNYXRyaXg0J1xuXG4vL+mhtueCueedgOiJsuWZqFxuY29uc3QgVlNIQURFUl9TT1VSQ0UgPSBgXG4gICAgYXR0cmlidXRlIHZlYzQgYV9Qb3NpdGlvbjtcbiAgICB1bmlmb3JtIG1hdDQgdV94Zm9ybU1hdHJpeDtcbiAgICB2b2lkIG1haW4oKXtcbiAgICAgICAgZ2xfUG9zaXRpb24gPSB1X3hmb3JtTWF0cml4KmFfUG9zaXRpb247XG4gICAgfVxuYFxuXG4vL+eJh+WFg+edgOiJsuWZqFxuY29uc3QgRlNIQURFUl9TT1VSQ0UgPSBgXG4gICAgdm9pZCBtYWluKCl7XG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMS4wLCAwLjAsIDAuMCwgMS4wKTtcbiAgICB9XG5gXG5cbmNsYXNzIFRyYW5zbGF0ZU1hdHJpeCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpXG4gICAgfVxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBjb25zdCBjYW52YXMgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnNbJ2NhbnZhcyddKVxuXG4gICAgICAgIGNvbnN0IGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJylcblxuICAgICAgICBpZiAoIWdsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGdldCB0aGUgcmVuZGVyaW5nIGNvbnRleHQgZm9yIFdlYkdMJylcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpbml0U2hhZGVycyhnbCxWU0hBREVSX1NPVVJDRSxGU0hBREVSX1NPVVJDRSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gaW50aWFsaXplIHNoYWRlcnMuJylcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbiA9IHRoaXMuaW5pdFZlcnRleEJ1ZmZlcnMoZ2wpXG4gICAgICAgIGlmIChuPDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgdGhlIHZlcnRpY2VzJylcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdV94Zm9ybU1hdHJpeCA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihnbC5wcm9ncmFtLCd1X3hmb3JtTWF0cml4JylcbiAgICAgICAgaWYgKCF1X3hmb3JtTWF0cml4KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGdldCB0aGUgc3RvcmFnZSBsb2NhdGlvbiBvZiB1X3hmb3JtTWF0cml4JylcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWF0cml4NCA9IG5ldyBNYXRyaXg0KClcbiAgICAgICAgbWF0cml4NC50cmFuc2xhdGUoMC41LDAuNSwwKVxuICAgICAgICBjb25zdCB4Zm9ybU1hdHJpeCA9IG1hdHJpeDQubWF0cml4XG5cblxuICAgICAgICBnbC51bmlmb3JtTWF0cml4NGZ2KHVfeGZvcm1NYXRyaXgsZmFsc2UsIHhmb3JtTWF0cml4KVxuXG4gICAgICAgIGdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKVxuXG4gICAgICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpXG5cbiAgICAgICAgZ2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRVMsMCxuKVxuICAgIH1cbiAgICBpbml0VmVydGV4QnVmZmVycz0oZ2wpPT57XG4gICAgICAgIGNvbnN0IHZlcnRleHMgPSBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICAgICAgIDAuMCwwLjUsIC0wLjUsLTAuNSwgMC41LC0wLjVcbiAgICAgICAgXSlcblxuICAgICAgICBjb25zdCB2ZXJ0ZXhCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKVxuICAgICAgICBpZiAoIXZlcnRleEJ1ZmZlcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBjcmVhdGUgdGhlIGJ1ZmZlciBvYmplY3QnKVxuICAgICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgIH1cblxuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUix2ZXJ0ZXhCdWZmZXIpXG5cbiAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsdmVydGV4cyxnbC5TVEFUSUNfRFJBVylcblxuICAgICAgICBjb25zdCBhX1Bvc2l0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oZ2wucHJvZ3JhbSwnYV9Qb3NpdGlvbicpXG4gICAgICAgIGlmIChhX1Bvc2l0aW9uIDwgMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBnZXQgdGhlIHN0b3JhZ2UgbG9jYXRpb24gb2YgYV9Qb3NpdGlvbicpXG4gICAgICAgICAgICByZXR1cm4gLTFcbiAgICAgICAgfVxuXG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYV9Qb3NpdGlvbiwyLGdsLkZMT0FULGZhbHNlLDAsMClcblxuICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhX1Bvc2l0aW9uKVxuXG4gICAgICAgIHJldHVybiAzXG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRTaXplOicyOHB4JyxtYXJnaW46JzQwcHggMCd9fT57J1RyYW5zbGF0ZSd9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsndGhlIGJyb3dlciBkb25gdCBzdXBwb3J0IGNhbnZhcyxwbGVhc2UgY2hhbmdlIGFub3RoZXIgYnJvd2VyJ31cbiAgICAgICAgICAgICAgICAgICAgPC9jYW52YXM+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNsYXRlTWF0cml4XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC90cmFuc2Zvcm0vY29tcG9uZW50cy9UcmFuc2xhdGUvVHJhbnNsYXRlLmpzXG4gKiovIiwiY2xhc3MgTWF0cml4NCB7XG4gICAgY29uc3RydWN0b3IobWF0cml4KSB7XG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0cml4IHx8IE1hdHJpeDQudW5pdE1hdHJpeDQoKVxuICAgIH1cbiAgICBpbml0ID0gKG1hdHJpeCk9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXRyaXggfHwgTWF0cml4NC51bml0TWF0cml4NCgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIG11bHRpcGx5ID0gKG1hdHJpeCkgPT4ge1xuICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0Lm11bHRpcGx5KHRoaXMubWF0cml4LCBtYXRyaXgpXG4gICAgfVxuICAgIHJvdGF0ZSA9IChhbmdlbCx4LHkseik9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0Lm11bHRpcGx5KE1hdHJpeDQucm90YXRlTWF0cml4KGFuZ2VsLHgseSx6KSx0aGlzLm1hdHJpeClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgcm90YXRlNCA9IChhbmdlbCx2ZWN0b3IsZG90KT0+e1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZSgtZG90LngsLWRvdC55LC1kb3QueilcbiAgICAgICAgdGhpcy5yb3RhdGUoYW5nZWwsdmVjdG9yLngsdmVjdG9yLnksdmVjdG9yLnopXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKGRvdC54LGRvdC55LGRvdC56KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICB0cmFuc2xhdGUgPSAoeCx5LHopPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseShNYXRyaXg0LnRyYW5zbGF0ZU1hdHJpeCh4LHkseiksdGhpcy5tYXRyaXgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHNjYWxlID0gKFN4LFN5LFN6KT0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQubXVsdGlwbHkoTWF0cml4NC5zY2FsZU1hdHJpeChTeCxTeSxTeiksdGhpcy5tYXRyaXgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHZpZXcgPSAoZXllWCwgZXllWSwgZXllWiwgY2VudGVyWCwgY2VudGVyWSwgY2VudGVyWiwgdXBYLCB1cFksIHVwWikgPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseShNYXRyaXg0LnZpZXdNYXRyaXgoZXllWCwgZXllWSwgZXllWiwgY2VudGVyWCwgY2VudGVyWSwgY2VudGVyWiwgdXBYLCB1cFksIHVwWiksdGhpcy5tYXRyaXgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIG9ydGhvID0gKGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSA9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0Lm11bHRpcGx5KE1hdHJpeDQub3J0aG9NYXRyaXgobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpLHRoaXMubWF0cml4KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBwZXJzcGVjdGl2ZSA9IChmb3YsIGFzcGVjdCwgbmVhciwgZmFyKSA9PiB7XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseShNYXRyaXg0LnBlcnNwZWN0aXZlTWF0cml4KGZvdiwgYXNwZWN0LCBuZWFyLCBmYXIpLHRoaXMubWF0cml4KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICB0cmFuc3Bvc2UgPSAoKSA9PiB7XG4gICAgICBsZXQgZSwgdFxuXG4gICAgICBlID0gdGhpcy5tYXRyaXhcblxuICAgICAgdCA9IGVbIDFdOyAgZVsgMV0gPSBlWyA0XTsgIGVbIDRdID0gdDtcbiAgICAgIHQgPSBlWyAyXTsgIGVbIDJdID0gZVsgOF07ICBlWyA4XSA9IHQ7XG4gICAgICB0ID0gZVsgM107ICBlWyAzXSA9IGVbMTJdOyAgZVsxMl0gPSB0O1xuICAgICAgdCA9IGVbIDZdOyAgZVsgNl0gPSBlWyA5XTsgIGVbIDldID0gdDtcbiAgICAgIHQgPSBlWyA3XTsgIGVbIDddID0gZVsxM107ICBlWzEzXSA9IHQ7XG4gICAgICB0ID0gZVsxMV07ICBlWzExXSA9IGVbMTRdOyAgZVsxNF0gPSB0O1xuXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBzZXRPcnRobyA9IChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhcikgPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5vcnRob01hdHJpeChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhcilcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNldFJvdGF0ZSA9IChhbmdlbCx4LHkseik9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0LnJvdGF0ZU1hdHJpeChhbmdlbCx4LHkseilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgc2V0VHJhbnNsYXRlID0gKHgseSx6KT0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQudHJhbnNsYXRlTWF0cml4KHgseSx6KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBzZXRTY2FsZSA9IChTeCxTeSxTeik9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0LnNjYWxlTWF0cml4KFN4LFN5LFN6KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBzZXRWaWV3ID0gKGV5ZVgsIGV5ZVksIGV5ZVosIGNlbnRlclgsIGNlbnRlclksIGNlbnRlclosIHVwWCwgdXBZLCB1cFopPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC52aWV3TWF0cml4KGV5ZVgsIGV5ZVksIGV5ZVosIGNlbnRlclgsIGNlbnRlclksIGNlbnRlclosIHVwWCwgdXBZLCB1cFopXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgc2V0UGVyc3BlY3RpdmUgPSAoZm92LCBhc3BlY3QsIG5lYXIsIGZhcikgPT4ge1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQucGVyc3BlY3RpdmVNYXRyaXgoZm92LCBhc3BlY3QsIG5lYXIsIGZhcilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgc2V0SW52ZXJzZU9mID0gKG1hdHJpeCkgPT4ge1xuICAgICAgY29uc3QgaW52ZXJzZU1hdHJpeCA9IE1hdHJpeDQuaW52ZXJzZU9mKG1hdHJpeClcbiAgICAgIGlmIChpbnZlcnNlTWF0cml4KSB7XG4gICAgICAgIHRoaXMubWF0cml4ID0gaW52ZXJzZU1hdHJpeFxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgLyoqXG4gICAgICog5rGC5LiA5Liq55+p6Zi155qE6YCG55+p6Zi1XG4gICAgICogQHBhcmFtICB7TWF0cml4NH0gbWF0cml4IOefqemYtVxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheX0gICDnn6npmLXmlbDnu4RcbiAgICAgKi9cbiAgICBzdGF0aWMgaW52ZXJzZU9mID0gKG1hdHJpeCkgPT4ge1xuICAgICAgbGV0IGksIHMsIGQsIGludiwgZGV0XG5cbiAgICAgIHMgPSBtYXRyaXgubWF0cml4O1xuICAgICAgZCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xuICAgICAgaW52ID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XG5cbiAgICAgIGludlswXSAgPSAgIHNbNV0qc1sxMF0qc1sxNV0gLSBzWzVdICpzWzExXSpzWzE0XSAtIHNbOV0gKnNbNl0qc1sxNV1cbiAgICAgICAgICAgICAgICArIHNbOV0qc1s3XSAqc1sxNF0gKyBzWzEzXSpzWzZdICpzWzExXSAtIHNbMTNdKnNbN10qc1sxMF07XG4gICAgICBpbnZbNF0gID0gLSBzWzRdKnNbMTBdKnNbMTVdICsgc1s0XSAqc1sxMV0qc1sxNF0gKyBzWzhdICpzWzZdKnNbMTVdXG4gICAgICAgICAgICAgICAgLSBzWzhdKnNbN10gKnNbMTRdIC0gc1sxMl0qc1s2XSAqc1sxMV0gKyBzWzEyXSpzWzddKnNbMTBdO1xuICAgICAgaW52WzhdICA9ICAgc1s0XSpzWzldICpzWzE1XSAtIHNbNF0gKnNbMTFdKnNbMTNdIC0gc1s4XSAqc1s1XSpzWzE1XVxuICAgICAgICAgICAgICAgICsgc1s4XSpzWzddICpzWzEzXSArIHNbMTJdKnNbNV0gKnNbMTFdIC0gc1sxMl0qc1s3XSpzWzldO1xuICAgICAgaW52WzEyXSA9IC0gc1s0XSpzWzldICpzWzE0XSArIHNbNF0gKnNbMTBdKnNbMTNdICsgc1s4XSAqc1s1XSpzWzE0XVxuICAgICAgICAgICAgICAgIC0gc1s4XSpzWzZdICpzWzEzXSAtIHNbMTJdKnNbNV0gKnNbMTBdICsgc1sxMl0qc1s2XSpzWzldO1xuXG4gICAgICBpbnZbMV0gID0gLSBzWzFdKnNbMTBdKnNbMTVdICsgc1sxXSAqc1sxMV0qc1sxNF0gKyBzWzldICpzWzJdKnNbMTVdXG4gICAgICAgICAgICAgICAgLSBzWzldKnNbM10gKnNbMTRdIC0gc1sxM10qc1syXSAqc1sxMV0gKyBzWzEzXSpzWzNdKnNbMTBdO1xuICAgICAgaW52WzVdICA9ICAgc1swXSpzWzEwXSpzWzE1XSAtIHNbMF0gKnNbMTFdKnNbMTRdIC0gc1s4XSAqc1syXSpzWzE1XVxuICAgICAgICAgICAgICAgICsgc1s4XSpzWzNdICpzWzE0XSArIHNbMTJdKnNbMl0gKnNbMTFdIC0gc1sxMl0qc1szXSpzWzEwXTtcbiAgICAgIGludls5XSAgPSAtIHNbMF0qc1s5XSAqc1sxNV0gKyBzWzBdICpzWzExXSpzWzEzXSArIHNbOF0gKnNbMV0qc1sxNV1cbiAgICAgICAgICAgICAgICAtIHNbOF0qc1szXSAqc1sxM10gLSBzWzEyXSpzWzFdICpzWzExXSArIHNbMTJdKnNbM10qc1s5XTtcbiAgICAgIGludlsxM10gPSAgIHNbMF0qc1s5XSAqc1sxNF0gLSBzWzBdICpzWzEwXSpzWzEzXSAtIHNbOF0gKnNbMV0qc1sxNF1cbiAgICAgICAgICAgICAgICArIHNbOF0qc1syXSAqc1sxM10gKyBzWzEyXSpzWzFdICpzWzEwXSAtIHNbMTJdKnNbMl0qc1s5XTtcblxuICAgICAgaW52WzJdICA9ICAgc1sxXSpzWzZdKnNbMTVdIC0gc1sxXSAqc1s3XSpzWzE0XSAtIHNbNV0gKnNbMl0qc1sxNV1cbiAgICAgICAgICAgICAgICArIHNbNV0qc1szXSpzWzE0XSArIHNbMTNdKnNbMl0qc1s3XSAgLSBzWzEzXSpzWzNdKnNbNl07XG4gICAgICBpbnZbNl0gID0gLSBzWzBdKnNbNl0qc1sxNV0gKyBzWzBdICpzWzddKnNbMTRdICsgc1s0XSAqc1syXSpzWzE1XVxuICAgICAgICAgICAgICAgIC0gc1s0XSpzWzNdKnNbMTRdIC0gc1sxMl0qc1syXSpzWzddICArIHNbMTJdKnNbM10qc1s2XTtcbiAgICAgIGludlsxMF0gPSAgIHNbMF0qc1s1XSpzWzE1XSAtIHNbMF0gKnNbN10qc1sxM10gLSBzWzRdICpzWzFdKnNbMTVdXG4gICAgICAgICAgICAgICAgKyBzWzRdKnNbM10qc1sxM10gKyBzWzEyXSpzWzFdKnNbN10gIC0gc1sxMl0qc1szXSpzWzVdO1xuICAgICAgaW52WzE0XSA9IC0gc1swXSpzWzVdKnNbMTRdICsgc1swXSAqc1s2XSpzWzEzXSArIHNbNF0gKnNbMV0qc1sxNF1cbiAgICAgICAgICAgICAgICAtIHNbNF0qc1syXSpzWzEzXSAtIHNbMTJdKnNbMV0qc1s2XSAgKyBzWzEyXSpzWzJdKnNbNV07XG5cbiAgICAgIGludlszXSAgPSAtIHNbMV0qc1s2XSpzWzExXSArIHNbMV0qc1s3XSpzWzEwXSArIHNbNV0qc1syXSpzWzExXVxuICAgICAgICAgICAgICAgIC0gc1s1XSpzWzNdKnNbMTBdIC0gc1s5XSpzWzJdKnNbN10gICsgc1s5XSpzWzNdKnNbNl07XG4gICAgICBpbnZbN10gID0gICBzWzBdKnNbNl0qc1sxMV0gLSBzWzBdKnNbN10qc1sxMF0gLSBzWzRdKnNbMl0qc1sxMV1cbiAgICAgICAgICAgICAgICArIHNbNF0qc1szXSpzWzEwXSArIHNbOF0qc1syXSpzWzddICAtIHNbOF0qc1szXSpzWzZdO1xuICAgICAgaW52WzExXSA9IC0gc1swXSpzWzVdKnNbMTFdICsgc1swXSpzWzddKnNbOV0gICsgc1s0XSpzWzFdKnNbMTFdXG4gICAgICAgICAgICAgICAgLSBzWzRdKnNbM10qc1s5XSAgLSBzWzhdKnNbMV0qc1s3XSAgKyBzWzhdKnNbM10qc1s1XTtcbiAgICAgIGludlsxNV0gPSAgIHNbMF0qc1s1XSpzWzEwXSAtIHNbMF0qc1s2XSpzWzldICAtIHNbNF0qc1sxXSpzWzEwXVxuICAgICAgICAgICAgICAgICsgc1s0XSpzWzJdKnNbOV0gICsgc1s4XSpzWzFdKnNbNl0gIC0gc1s4XSpzWzJdKnNbNV07XG5cbiAgICAgIGRldCA9IHNbMF0qaW52WzBdICsgc1sxXSppbnZbNF0gKyBzWzJdKmludls4XSArIHNbM10qaW52WzEyXTtcbiAgICAgIGlmIChkZXQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGRldCA9IDEgLyBkZXQ7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkrKykge1xuICAgICAgICBkW2ldID0gaW52W2ldICogZGV0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZFxuICAgIH1cbiAgICAvKipcbiAgICAgKiDojrflj5bpgI/op4bmipXlvbHnn6npmLVcbiAgICAgKiBAcGFyYW0gIGZvdiAgICDmjIflrprlnoLnm7Top4bop5LvvIzljbPlj6/op4bnqbrpl7TpobbpnaLlkozlupXpnaLpl7TnmoTlpLnop5LvvIzlv4XpobvlpKfkuo4wXG4gICAgICogQHBhcmFtICBhc3BlY3Qg5oyH5a6a6L+R5Ymq6KOB6Z2i55qE5a696auY5q+U77yI5a695bqm77yP6auY5bqm77yJXG4gICAgICogQHBhcmFtICBuZWFyICAg5oyH5a6a6L+R5Ymq6KOB6Z2i55qE5L2N572u77yM5Y2z5Y+v6KeG56m66Ze055qE6L+R6L6555WMXG4gICAgICogQHBhcmFtICBmYXIgICAg5oyH5a6a6L+c5Ymq6KOB6Z2i55qE5L2N572u77yM5Y2z5Y+v6KeG56m66Ze055qE6L+c6L6555WMXG4gICAgICogQHJldHVybiBtYXRyaXgg6YCP6KeG5oqV5b2x55+p6Zi1XG4gICAgICovXG4gICAgc3RhdGljIHBlcnNwZWN0aXZlTWF0cml4ID0gKGZvdiwgYXNwZWN0LCBuZWFyLCBmYXIpID0+IHtcbiAgICAgICAgbGV0IG1hdHJpeCwgcmQsIHMsIGN0XG5cbiAgICAgICAgaWYgKG5lYXIgPT09IGZhciB8fCBhc3BlY3QgPT09IDApIHtcbiAgICAgICAgICB0aHJvdyAnbnVsbCBmcnVzdHVtJ1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZWFyIDw9IDApIHtcbiAgICAgICAgICB0aHJvdyAnbmVhciA8PSAwJ1xuICAgICAgICB9XG4gICAgICAgIGlmIChmYXIgPD0gMCkge1xuICAgICAgICAgIHRocm93ICdmYXIgPD0gMCdcbiAgICAgICAgfVxuXG4gICAgICAgIGZvdiA9IE1hdGguUEkgKiBmb3YgLyAxODAgLyAyXG4gICAgICAgIHMgPSBNYXRoLnNpbihmb3YpXG4gICAgICAgIGlmIChzID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgJ251bGwgZnJ1c3R1bSdcbiAgICAgICAgfVxuICAgICAgICByZCA9IDEgLyAoZmFyIC0gbmVhcilcbiAgICAgICAgY3QgPSBNYXRoLmNvcyhmb3YpIC8gc1xuXG4gICAgICAgIG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpXG5cbiAgICAgICAgbWF0cml4WzBdICA9IGN0IC8gYXNwZWN0XG4gICAgICAgIG1hdHJpeFsxXSAgPSAwXG4gICAgICAgIG1hdHJpeFsyXSAgPSAwXG4gICAgICAgIG1hdHJpeFszXSAgPSAwXG5cbiAgICAgICAgbWF0cml4WzRdICA9IDBcbiAgICAgICAgbWF0cml4WzVdICA9IGN0XG4gICAgICAgIG1hdHJpeFs2XSAgPSAwXG4gICAgICAgIG1hdHJpeFs3XSAgPSAwXG5cbiAgICAgICAgbWF0cml4WzhdICA9IDBcbiAgICAgICAgbWF0cml4WzldICA9IDBcbiAgICAgICAgbWF0cml4WzEwXSA9IC0oZmFyICsgbmVhcikgKiByZFxuICAgICAgICBtYXRyaXhbMTFdID0gLTFcblxuICAgICAgICBtYXRyaXhbMTJdID0gMFxuICAgICAgICBtYXRyaXhbMTNdID0gMFxuICAgICAgICBtYXRyaXhbMTRdID0gLTIgKiBuZWFyICogZmFyICogcmRcbiAgICAgICAgbWF0cml4WzE1XSA9IDBcbiAgICAgICAgcmV0dXJuIG1hdHJpeFxuICAgIH1cbiAgICBzdGF0aWMgb3J0aG9NYXRyaXggPSAobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpID0+IHtcbiAgICAgICAgbGV0IG1hdHJpeCwgcncsIHJoLCByZDtcblxuICAgICAgICBpZiAobGVmdCA9PT0gcmlnaHQgfHwgYm90dG9tID09PSB0b3AgfHwgbmVhciA9PT0gZmFyKSB7XG4gICAgICAgICAgdGhyb3cgJ251bGwgZnJ1c3R1bSc7XG4gICAgICAgIH1cblxuICAgICAgICBydyA9IDEgLyAocmlnaHQgLSBsZWZ0KTtcbiAgICAgICAgcmggPSAxIC8gKHRvcCAtIGJvdHRvbSk7XG4gICAgICAgIHJkID0gMSAvIChmYXIgLSBuZWFyKTtcblxuICAgICAgICBtYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KDE2KVxuXG4gICAgICAgIG1hdHJpeFswXSAgPSAyICogcnc7XG4gICAgICAgIG1hdHJpeFsxXSAgPSAwO1xuICAgICAgICBtYXRyaXhbMl0gID0gMDtcbiAgICAgICAgbWF0cml4WzNdICA9IDA7XG5cbiAgICAgICAgbWF0cml4WzRdICA9IDA7XG4gICAgICAgIG1hdHJpeFs1XSAgPSAyICogcmg7XG4gICAgICAgIG1hdHJpeFs2XSAgPSAwO1xuICAgICAgICBtYXRyaXhbN10gID0gMDtcblxuICAgICAgICBtYXRyaXhbOF0gID0gMDtcbiAgICAgICAgbWF0cml4WzldICA9IDA7XG4gICAgICAgIG1hdHJpeFsxMF0gPSAtMiAqIHJkO1xuICAgICAgICBtYXRyaXhbMTFdID0gMDtcblxuICAgICAgICBtYXRyaXhbMTJdID0gLShyaWdodCArIGxlZnQpICogcnc7XG4gICAgICAgIG1hdHJpeFsxM10gPSAtKHRvcCArIGJvdHRvbSkgKiByaDtcbiAgICAgICAgbWF0cml4WzE0XSA9IC0oZmFyICsgbmVhcikgKiByZDtcbiAgICAgICAgbWF0cml4WzE1XSA9IDE7XG5cbiAgICAgICAgcmV0dXJuIG1hdHJpeFxuICAgIH1cbiAgICBzdGF0aWMgdmlld01hdHJpeCA9IChleWVYLCBleWVZLCBleWVaLCBjZW50ZXJYLCBjZW50ZXJZLCBjZW50ZXJaLCB1cFgsIHVwWSwgdXBaKT0+e1xuICAgICAgICBsZXQgZSwgZngsIGZ5LCBmeiwgcmxmLCBzeCwgc3ksIHN6LCBybHMsIHV4LCB1eSwgdXpcblxuICAgICAgICBmeCA9IGNlbnRlclggLSBleWVYXG4gICAgICAgIGZ5ID0gY2VudGVyWSAtIGV5ZVlcbiAgICAgICAgZnogPSBjZW50ZXJaIC0gZXllWlxuXG4gICAgICAgIC8vIE5vcm1hbGl6ZSBmLlxuICAgICAgICBybGYgPSAxIC8gTWF0aC5zcXJ0KGZ4KmZ4ICsgZnkqZnkgKyBmeipmeilcbiAgICAgICAgZnggKj0gcmxmXG4gICAgICAgIGZ5ICo9IHJsZlxuICAgICAgICBmeiAqPSBybGZcblxuICAgICAgICAvLyBDYWxjdWxhdGUgY3Jvc3MgcHJvZHVjdCBvZiBmIGFuZCB1cC5cbiAgICAgICAgc3ggPSBmeSAqIHVwWiAtIGZ6ICogdXBZXG4gICAgICAgIHN5ID0gZnogKiB1cFggLSBmeCAqIHVwWlxuICAgICAgICBzeiA9IGZ4ICogdXBZIC0gZnkgKiB1cFhcblxuICAgICAgICAvLyBOb3JtYWxpemUgcy5cbiAgICAgICAgcmxzID0gMSAvIE1hdGguc3FydChzeCpzeCArIHN5KnN5ICsgc3oqc3opXG4gICAgICAgIHN4ICo9IHJsc1xuICAgICAgICBzeSAqPSBybHNcbiAgICAgICAgc3ogKj0gcmxzXG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGNyb3NzIHByb2R1Y3Qgb2YgcyBhbmQgZi5cbiAgICAgICAgdXggPSBzeSAqIGZ6IC0gc3ogKiBmeVxuICAgICAgICB1eSA9IHN6ICogZnggLSBzeCAqIGZ6XG4gICAgICAgIHV6ID0gc3ggKiBmeSAtIHN5ICogZnhcblxuICAgICAgICBsZXQgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheSgxNilcbiAgICAgICAgbWF0cml4WzBdID0gc3hcbiAgICAgICAgbWF0cml4WzFdID0gdXhcbiAgICAgICAgbWF0cml4WzJdID0gLWZ4XG4gICAgICAgIG1hdHJpeFszXSA9IDBcblxuICAgICAgICBtYXRyaXhbNF0gPSBzeVxuICAgICAgICBtYXRyaXhbNV0gPSB1eVxuICAgICAgICBtYXRyaXhbNl0gPSAtZnlcbiAgICAgICAgbWF0cml4WzddID0gMFxuXG4gICAgICAgIG1hdHJpeFs4XSA9IHN6XG4gICAgICAgIG1hdHJpeFs5XSA9IHV6XG4gICAgICAgIG1hdHJpeFsxMF0gPSAtZnpcbiAgICAgICAgbWF0cml4WzExXSA9IDBcblxuICAgICAgICBtYXRyaXhbMTJdID0gMFxuICAgICAgICBtYXRyaXhbMTNdID0gMFxuICAgICAgICBtYXRyaXhbMTRdID0gMFxuICAgICAgICBtYXRyaXhbMTVdID0gMVxuXG4gICAgICAgIHJldHVybiBNYXRyaXg0Lm11bHRpcGx5KG1hdHJpeCxNYXRyaXg0LnRyYW5zbGF0ZU1hdHJpeCgtZXllWCwgLWV5ZVksIC1leWVaKSlcbiAgICB9XG4gICAgc3RhdGljIHJvdGF0ZU1hdHJpeCA9IChhbmdlbCx4LHkseikgPT4ge1xuICAgICAgICBsZXQgcmFkaWFuID0gTWF0aC5QSSAqIGFuZ2VsIC8gMTgwLjBcbiAgICAgICAgbGV0IHMgPSBNYXRoLnNpbihyYWRpYW4pXG4gICAgICAgIGxldCBjID0gTWF0aC5jb3MocmFkaWFuKVxuXG4gICAgICAgIGlmICh4IT09MCYmeT09PTAmJno9PT0wKSB7XG4gICAgICAgICAgICBpZiAoeCA8IDApIHtcbiAgICAgICAgICAgICAgcyA9IC1zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTWF0cml4NC5yb3RhdGVYTWF0cml4KHMsYylcbiAgICAgICAgfVxuICAgICAgICBpZiAoeD09PTAmJnkhPT0wJiZ6PT09MCkge1xuICAgICAgICAgICAgaWYgKHkgPCAwKSB7XG4gICAgICAgICAgICAgIHMgPSAtc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE1hdHJpeDQucm90YXRlWU1hdHJpeChzLGMpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHg9PT0wJiZ5PT09MCYmeiE9PTApIHtcbiAgICAgICAgICAgIGlmICh6PDApIHtcbiAgICAgICAgICAgICAgICBzID0gLXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBNYXRyaXg0LnJvdGF0ZVpNYXRyaXgocyxjKVxuICAgICAgICB9XG4gICAgICAgIGxldCBtYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KDE2KVxuICAgICAgICBsZW4gPSBNYXRoLnNxcnQoeCp4ICsgeSp5ICsgeip6KVxuICAgICAgICBpZiAobGVuICE9PSAxKSB7XG4gICAgICAgICAgcmxlbiA9IDEgLyBsZW5cbiAgICAgICAgICB4ICo9IHJsZW5cbiAgICAgICAgICB5ICo9IHJsZW5cbiAgICAgICAgICB6ICo9IHJsZW5cbiAgICAgICAgfVxuICAgICAgICBuYyA9IDEgLSBjXG4gICAgICAgIHh5ID0geCAqIHlcbiAgICAgICAgeXogPSB5ICogelxuICAgICAgICB6eCA9IHogKiB4XG4gICAgICAgIHhzID0geCAqIHNcbiAgICAgICAgeXMgPSB5ICogc1xuICAgICAgICB6cyA9IHogKiBzXG5cbiAgICAgICAgbWF0cml4WyAwXSA9IHgqeCpuYyArICBjXG4gICAgICAgIG1hdHJpeFsgMV0gPSB4eSAqbmMgKyB6c1xuICAgICAgICBtYXRyaXhbIDJdID0genggKm5jIC0geXNcbiAgICAgICAgbWF0cml4WyAzXSA9IDBcblxuICAgICAgICBtYXRyaXhbIDRdID0geHkgKm5jIC0genNcbiAgICAgICAgbWF0cml4WyA1XSA9IHkqeSpuYyArICBjXG4gICAgICAgIG1hdHJpeFsgNl0gPSB5eiAqbmMgKyB4c1xuICAgICAgICBtYXRyaXhbIDddID0gMFxuXG4gICAgICAgIG1hdHJpeFsgOF0gPSB6eCAqbmMgKyB5c1xuICAgICAgICBtYXRyaXhbIDldID0geXogKm5jIC0geHNcbiAgICAgICAgbWF0cml4WzEwXSA9IHoqeipuYyArICBjXG4gICAgICAgIG1hdHJpeFsxMV0gPSAwXG5cbiAgICAgICAgbWF0cml4WzEyXSA9IDBcbiAgICAgICAgbWF0cml4WzEzXSA9IDBcbiAgICAgICAgbWF0cml4WzE0XSA9IDBcbiAgICAgICAgbWF0cml4WzE1XSA9IDFcblxuICAgICAgICByZXR1cm4gbWF0cml4XG4gICAgfVxuICAgIHN0YXRpYyB0cmFuc2xhdGVNYXRyaXggPSAoeCx5LHopPT57XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLDAsMCwwLCAwLDEsMCwwLCAwLDAsMSwwLCB4LHkseiwxXSlcbiAgICB9XG4gICAgc3RhdGljIHNjYWxlTWF0cml4ID0gKFN4LFN5LFN6KT0+e1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbU3gsMCwwLDAsIDAsU3ksMCwwLCAwLDAsU3osMCwgMCwwLDAsMV0pXG4gICAgfVxuICAgIHN0YXRpYyB1bml0TWF0cml4NCA9ICgpPT57XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLDAsMCwwLCAwLDEsMCwwLCAwLDAsMSwwLCAwLDAsMCwxXSlcbiAgICB9XG4gICAgc3RhdGljIHJvdGF0ZVhNYXRyaXggPSAocyxjKT0+e1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwwLDAsMCwgMCxjLHMsMCwgMCwtcyxjLDAsIDAsMCwwLDFdKVxuICAgIH1cbiAgICBzdGF0aWMgcm90YXRlWU1hdHJpeCA9IChzLGMpPT57XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtjLDAsLXMsMCwgMCwxLDAsMCwgcywwLGMsMCwgMCwwLDAsMV0pXG4gICAgfVxuICAgIHN0YXRpYyByb3RhdGVaTWF0cml4ID0gKHMsYyk9PntcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2MscywwLDAsIC1zLGMsMCwwLCAwLDAsMSwwLCAwLDAsMCwxXSlcbiAgICB9XG4gICAgc3RhdGljIGFkZCA9IChtYXRyaXgxLG1hdHJpeDIpPT57XG4gICAgICAgIGNvbnN0IGxlbjEgPSBtYXRyaXgxLmxlbmd0aCwgbGVuMiA9IG1hdHJpeDIubGVuZ3RoXG4gICAgICAgIGlmIChsZW4xICE9IGxlbjIpIHtcbiAgICAgICAgICAgIHRocm93ICfnn6npmLUx5ZKM55+p6Zi1MumVv+W6puS4jeS4gOiHtCdcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheShsZW4xKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjE7IGkrKykge1xuICAgICAgICAgICAgbWF0cml4W2ldID0gbWF0cml4MVtpXSArIG1hdHJpeDJbaV1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF0cml4XG4gICAgfVxuICAgIHN0YXRpYyBzdWJ0cmFjdCA9IChtYXRyaXgxLG1hdHJpeDIpPT57XG4gICAgICAgIGxldCBtYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KDE2KVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICAgICAgICAgIG1hdHJpeFtpXSA9IG1hdHJpeDFbaV0gLSBtYXRyaXgyW2ldXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdHJpeFxuICAgIH1cbiAgICBzdGF0aWMgbXVsdGlwbHkgPSAobWF0cml4MSxtYXRyaXgyKT0+e1xuICAgICAgICBsZXQgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheSgxNilcblxuICAgICAgICBtYXRyaXhbMF0gPSBtYXRyaXgxWzBdKm1hdHJpeDJbMF0gKyBtYXRyaXgxWzRdKm1hdHJpeDJbMV0gKyBtYXRyaXgxWzhdKm1hdHJpeDJbMl0gKyBtYXRyaXgxWzEyXSptYXRyaXgyWzNdXG4gICAgICAgIG1hdHJpeFs0XSA9IG1hdHJpeDFbMF0qbWF0cml4Mls0XSArIG1hdHJpeDFbNF0qbWF0cml4Mls1XSArIG1hdHJpeDFbOF0qbWF0cml4Mls2XSArIG1hdHJpeDFbMTJdKm1hdHJpeDJbN11cbiAgICAgICAgbWF0cml4WzhdID0gbWF0cml4MVswXSptYXRyaXgyWzhdICsgbWF0cml4MVs0XSptYXRyaXgyWzldICsgbWF0cml4MVs4XSptYXRyaXgyWzEwXSArIG1hdHJpeDFbMTJdKm1hdHJpeDJbMTFdXG4gICAgICAgIG1hdHJpeFsxMl0gPSBtYXRyaXgxWzBdKm1hdHJpeDJbMTJdICsgbWF0cml4MVs0XSptYXRyaXgyWzEzXSArIG1hdHJpeDFbOF0qbWF0cml4MlsxNF0gKyBtYXRyaXgxWzEyXSptYXRyaXgyWzE1XVxuXG4gICAgICAgIG1hdHJpeFsxXSA9IG1hdHJpeDFbMV0qbWF0cml4MlswXSArIG1hdHJpeDFbNV0qbWF0cml4MlsxXSArIG1hdHJpeDFbOV0qbWF0cml4MlsyXSArIG1hdHJpeDFbMTNdKm1hdHJpeDJbM11cbiAgICAgICAgbWF0cml4WzVdID0gbWF0cml4MVsxXSptYXRyaXgyWzRdICsgbWF0cml4MVs1XSptYXRyaXgyWzVdICsgbWF0cml4MVs5XSptYXRyaXgyWzZdICsgbWF0cml4MVsxM10qbWF0cml4Mls3XVxuICAgICAgICBtYXRyaXhbOV0gPSBtYXRyaXgxWzFdKm1hdHJpeDJbOF0gKyBtYXRyaXgxWzVdKm1hdHJpeDJbOV0gKyBtYXRyaXgxWzldKm1hdHJpeDJbMTBdICsgbWF0cml4MVsxM10qbWF0cml4MlsxMV1cbiAgICAgICAgbWF0cml4WzEzXSA9IG1hdHJpeDFbMV0qbWF0cml4MlsxMl0gKyBtYXRyaXgxWzVdKm1hdHJpeDJbMTNdICsgbWF0cml4MVs5XSptYXRyaXgyWzE0XSArIG1hdHJpeDFbMTNdKm1hdHJpeDJbMTVdXG5cbiAgICAgICAgbWF0cml4WzJdID0gbWF0cml4MVsyXSptYXRyaXgyWzBdICsgbWF0cml4MVs2XSptYXRyaXgyWzFdICsgbWF0cml4MVsxMF0qbWF0cml4MlsyXSArIG1hdHJpeDFbMTRdKm1hdHJpeDJbM11cbiAgICAgICAgbWF0cml4WzZdID0gbWF0cml4MVsyXSptYXRyaXgyWzRdICsgbWF0cml4MVs2XSptYXRyaXgyWzVdICsgbWF0cml4MVsxMF0qbWF0cml4Mls2XSArIG1hdHJpeDFbMTRdKm1hdHJpeDJbN11cbiAgICAgICAgbWF0cml4WzEwXSA9IG1hdHJpeDFbMl0qbWF0cml4Mls4XSArIG1hdHJpeDFbNl0qbWF0cml4Mls5XSArIG1hdHJpeDFbMTBdKm1hdHJpeDJbMTBdICsgbWF0cml4MVsxNF0qbWF0cml4MlsxMV1cbiAgICAgICAgbWF0cml4WzE0XSA9IG1hdHJpeDFbMl0qbWF0cml4MlsxMl0gKyBtYXRyaXgxWzZdKm1hdHJpeDJbMTNdICsgbWF0cml4MVsxMF0qbWF0cml4MlsxNF0gKyBtYXRyaXgxWzE0XSptYXRyaXgyWzE1XVxuXG4gICAgICAgIG1hdHJpeFszXSA9IG1hdHJpeDFbM10qbWF0cml4MlswXSArIG1hdHJpeDFbN10qbWF0cml4MlsxXSArIG1hdHJpeDFbMTFdKm1hdHJpeDJbMl0gKyBtYXRyaXgxWzE1XSptYXRyaXgyWzNdXG4gICAgICAgIG1hdHJpeFs3XSA9IG1hdHJpeDFbM10qbWF0cml4Mls0XSArIG1hdHJpeDFbN10qbWF0cml4Mls1XSArIG1hdHJpeDFbMTFdKm1hdHJpeDJbNl0gKyBtYXRyaXgxWzE1XSptYXRyaXgyWzddXG4gICAgICAgIG1hdHJpeFsxMV0gPSBtYXRyaXgxWzNdKm1hdHJpeDJbOF0gKyBtYXRyaXgxWzddKm1hdHJpeDJbOV0gKyBtYXRyaXgxWzExXSptYXRyaXgyWzEwXSArIG1hdHJpeDFbMTVdKm1hdHJpeDJbMTFdXG4gICAgICAgIG1hdHJpeFsxNV0gPSBtYXRyaXgxWzNdKm1hdHJpeDJbMTJdICsgbWF0cml4MVs3XSptYXRyaXgyWzEzXSArIG1hdHJpeDFbMTFdKm1hdHJpeDJbMTRdICsgbWF0cml4MVsxNV0qbWF0cml4MlsxNV1cblxuICAgICAgICByZXR1cm4gbWF0cml4XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBNYXRyaXg0XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9saWIvd2ViZ2wvbWF0cml4NC5qc1xuICoqLyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5cbmltcG9ydCB7aW5pdFNoYWRlcnN9IGZyb20gJ1dlQkdMVXRpbHMnXG5pbXBvcnQgTWF0cml4NCBmcm9tICdNYXRyaXg0J1xuXG4vL+mhtueCueedgOiJsuWZqFxuY29uc3QgVlNIQURFUl9TT1VSQ0UgPSBgXG4gICAgYXR0cmlidXRlIHZlYzQgYV9Qb3NpdGlvbjtcbiAgICB1bmlmb3JtIG1hdDQgdV94Zm9ybU1hdHJpeDtcbiAgICB2b2lkIG1haW4oKXtcbiAgICAgICAgZ2xfUG9zaXRpb24gPSB1X3hmb3JtTWF0cml4KmFfUG9zaXRpb247XG4gICAgfVxuYFxuXG4vL+eJh+WFg+edgOiJsuWZqFxuY29uc3QgRlNIQURFUl9TT1VSQ0UgPSBgXG4gICAgdm9pZCBtYWluKCl7XG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMS4wLCAwLjAsIDAuMCwgMS4wKTtcbiAgICB9XG5gXG5cbmNvbnN0IEFOR0xFID0gOTAuMFxuXG5jbGFzcyBSb3RhdGVNYXRyaXggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKVxuICAgIH1cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgY29uc3QgY2FudmFzID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzWydjYW52YXMnXSlcblxuICAgICAgICBjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpXG5cbiAgICAgICAgaWYgKCFnbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBnZXQgdGhlIHJlbmRlcmluZyBjb250ZXh0IGZvciBXZWJHTCcpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaW5pdFNoYWRlcnMoZ2wsVlNIQURFUl9TT1VSQ0UsRlNIQURFUl9TT1VSQ0UpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGludGlhbGl6ZSBzaGFkZXJzLicpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG4gPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXJzKGdsKVxuICAgICAgICBpZiAobjwwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIHNldCB0aGUgcG9zaXRpb25zIG9mIHRoZSB2ZXJ0aWNlcycpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtYXRyaXg0ID0gbmV3IE1hdHJpeDQoKVxuICAgICAgICBtYXRyaXg0LnJvdGF0ZShBTkdMRSwwLDAsMSlcbiAgICAgICAgY29uc3QgeGZvcm1NYXRyaXggPSBtYXRyaXg0Lm1hdHJpeFxuXG4gICAgICAgIGNvbnN0IHVfeGZvcm1NYXRyaXggPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oZ2wucHJvZ3JhbSwndV94Zm9ybU1hdHJpeCcpXG4gICAgICAgIGlmICghdV94Zm9ybU1hdHJpeCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDRmdih1X3hmb3JtTWF0cml4LGZhbHNlLHhmb3JtTWF0cml4KVxuXG4gICAgICAgIGdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKVxuXG4gICAgICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpXG5cbiAgICAgICAgZ2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRVMsMCxuKVxuICAgIH1cbiAgICBpbml0VmVydGV4QnVmZmVycz0oZ2wpPT57XG4gICAgICAgIGNvbnN0IHZlcnRleHMgPSBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICAgICAgIDAuMCwwLjUsIC0wLjUsLTAuNSwgMC41LC0wLjVcbiAgICAgICAgXSlcblxuICAgICAgICBjb25zdCB2ZXJ0ZXhCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKVxuICAgICAgICBpZiAoIXZlcnRleEJ1ZmZlcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBjcmVhdGUgdGhlIGJ1ZmZlciBvYmplY3QnKVxuICAgICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgIH1cblxuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUix2ZXJ0ZXhCdWZmZXIpXG5cbiAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsdmVydGV4cyxnbC5TVEFUSUNfRFJBVylcblxuICAgICAgICBjb25zdCBhX1Bvc2l0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oZ2wucHJvZ3JhbSwnYV9Qb3NpdGlvbicpXG4gICAgICAgIGlmIChhX1Bvc2l0aW9uIDwgMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBnZXQgdGhlIHN0b3JhZ2UgbG9jYXRpb24gb2YgYV9Qb3NpdGlvbicpXG4gICAgICAgICAgICByZXR1cm4gLTFcbiAgICAgICAgfVxuXG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYV9Qb3NpdGlvbiwyLGdsLkZMT0FULGZhbHNlLDAsMClcblxuICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhX1Bvc2l0aW9uKVxuXG4gICAgICAgIHJldHVybiAzXG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRTaXplOicyOHB4JyxtYXJnaW46JzQwcHggMCd9fT57J1JvdGF0ZSd9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsndGhlIGJyb3dlciBkb25gdCBzdXBwb3J0IGNhbnZhcyxwbGVhc2UgY2hhbmdlIGFub3RoZXIgYnJvd2VyJ31cbiAgICAgICAgICAgICAgICAgICAgPC9jYW52YXM+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gUm90YXRlTWF0cml4XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC90cmFuc2Zvcm0vY29tcG9uZW50cy9Sb3RhdGUvUm90YXRlLmpzXG4gKiovIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcblxuaW1wb3J0IHtpbml0U2hhZGVyc30gZnJvbSAnV2VCR0xVdGlscydcbmltcG9ydCBNYXRyaXg0IGZyb20gJ01hdHJpeDQnXG5cbi8v6aG254K5552A6Imy5ZmoXG5jb25zdCBWU0hBREVSX1NPVVJDRSA9IGBcbiAgICBhdHRyaWJ1dGUgdmVjNCBhX1Bvc2l0aW9uO1xuICAgIHVuaWZvcm0gbWF0NCB1X3hmb3JtTWF0cml4O1xuICAgIHZvaWQgbWFpbigpe1xuICAgICAgICBnbF9Qb3NpdGlvbiA9IHVfeGZvcm1NYXRyaXgqYV9Qb3NpdGlvbjtcbiAgICB9XG5gXG5cbi8v54mH5YWD552A6Imy5ZmoXG5jb25zdCBGU0hBREVSX1NPVVJDRSA9IGBcbiAgICB2b2lkIG1haW4oKXtcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgxLjAsIDAuMCwgMC4wLCAxLjApO1xuICAgIH1cbmBcblxuY2xhc3MgU2NhbGVNYXRyaXggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKVxuICAgIH1cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgY29uc3QgY2FudmFzID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzWydjYW52YXMnXSlcblxuICAgICAgICBjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpXG5cbiAgICAgICAgaWYgKCFnbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBnZXQgdGhlIHJlbmRlcmluZyBjb250ZXh0IGZvciBXZWJHTCcpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaW5pdFNoYWRlcnMoZ2wsVlNIQURFUl9TT1VSQ0UsRlNIQURFUl9TT1VSQ0UpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGludGlhbGl6ZSBzaGFkZXJzLicpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG4gPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXJzKGdsKVxuICAgICAgICBpZiAobjwwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIHNldCB0aGUgcG9zaXRpb25zIG9mIHRoZSB2ZXJ0aWNlcycpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVfeGZvcm1NYXRyaXggPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oZ2wucHJvZ3JhbSwndV94Zm9ybU1hdHJpeCcpXG4gICAgICAgIGlmICghdV94Zm9ybU1hdHJpeCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBnZXQgdGhlIHN0b3JhZ2UgbG9jYXRpb24gb2YgdV94Zm9ybU1hdHJpeCcpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtYXRyaXg0ID0gbmV3IE1hdHJpeDQoKVxuICAgICAgICBtYXRyaXg0LnNjYWxlKDEuMCwxLjUsMS4wKVxuICAgICAgICBjb25zdCB4Zm9ybU1hdHJpeCA9IG1hdHJpeDQubWF0cml4XG5cbiAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDRmdih1X3hmb3JtTWF0cml4LGZhbHNlLCB4Zm9ybU1hdHJpeClcblxuICAgICAgICBnbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMClcblxuICAgICAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKVxuXG4gICAgICAgIGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVTLDAsbilcbiAgICB9XG4gICAgaW5pdFZlcnRleEJ1ZmZlcnM9KGdsKT0+e1xuICAgICAgICBjb25zdCB2ZXJ0ZXhzID0gbmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAgICAgICAwLjAsMC41LCAtMC41LC0wLjUsIDAuNSwtMC41XG4gICAgICAgIF0pXG5cbiAgICAgICAgY29uc3QgdmVydGV4QnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKClcbiAgICAgICAgaWYgKCF2ZXJ0ZXhCdWZmZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gY3JlYXRlIHRoZSBidWZmZXIgb2JqZWN0JylcbiAgICAgICAgICAgIHJldHVybiAtMVxuICAgICAgICB9XG5cbiAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsdmVydGV4QnVmZmVyKVxuXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLHZlcnRleHMsZ2wuU1RBVElDX0RSQVcpXG5cbiAgICAgICAgY29uc3QgYV9Qb3NpdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKGdsLnByb2dyYW0sJ2FfUG9zaXRpb24nKVxuICAgICAgICBpZiAoYV9Qb3NpdGlvbiA8IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gZ2V0IHRoZSBzdG9yYWdlIGxvY2F0aW9uIG9mIGFfUG9zaXRpb24nKVxuICAgICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgIH1cblxuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGFfUG9zaXRpb24sMixnbC5GTE9BVCxmYWxzZSwwLDApXG5cbiAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYV9Qb3NpdGlvbilcblxuICAgICAgICByZXR1cm4gM1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmb250U2l6ZTonMjhweCcsbWFyZ2luOic0MHB4IDAnfX0+eydTY2FsZSd9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsndGhlIGJyb3dlciBkb25gdCBzdXBwb3J0IGNhbnZhcyxwbGVhc2UgY2hhbmdlIGFub3RoZXIgYnJvd2VyJ31cbiAgICAgICAgICAgICAgICAgICAgPC9jYW52YXM+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gU2NhbGVNYXRyaXhcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2FudmFzL3dlYmdsL3RyYW5zZm9ybS9jb21wb25lbnRzL1NjYWxlL1NjYWxlLmpzXG4gKiovIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcblxuaW1wb3J0IHtpbml0U2hhZGVyc30gZnJvbSAnV2VCR0xVdGlscydcbmltcG9ydCBNYXRyaXg0IGZyb20gJ01hdHJpeDQnXG5cbi8v6aG254K5552A6Imy5ZmoXG5jb25zdCBWU0hBREVSX1NPVVJDRSA9IGBcbiAgICBhdHRyaWJ1dGUgdmVjNCBhX1Bvc2l0aW9uO1xuICAgIHVuaWZvcm0gbWF0NCB1X3hmb3JtTWF0cml4O1xuICAgIHZvaWQgbWFpbigpe1xuICAgICAgICBnbF9Qb3NpdGlvbiA9IHVfeGZvcm1NYXRyaXgqYV9Qb3NpdGlvbjtcbiAgICB9XG5gXG5cbi8v54mH5YWD552A6Imy5ZmoXG5jb25zdCBGU0hBREVSX1NPVVJDRSA9IGBcbiAgICB2b2lkIG1haW4oKXtcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgxLjAsIDAuMCwgMC4wLCAxLjApO1xuICAgIH1cbmBcblxuY2xhc3MgUm90YXRlVHJhbnNsYXRlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcylcbiAgICB9XG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmc1snY2FudmFzJ10pXG5cbiAgICAgICAgY29uc3QgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnKVxuXG4gICAgICAgIGlmICghZ2wpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gZ2V0IHRoZSByZW5kZXJpbmcgY29udGV4dCBmb3IgV2ViR0wnKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWluaXRTaGFkZXJzKGdsLFZTSEFERVJfU09VUkNFLEZTSEFERVJfU09VUkNFKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBpbnRpYWxpemUgc2hhZGVycy4nKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuID0gdGhpcy5pbml0VmVydGV4QnVmZmVycyhnbClcbiAgICAgICAgaWYgKG48MCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBzZXQgdGhlIHBvc2l0aW9ucyBvZiB0aGUgdmVydGljZXMnKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWF0cml4NCA9IG5ldyBNYXRyaXg0KClcbiAgICAgICAgbWF0cml4NC50cmFuc2xhdGUoMC41LDAsMClcbiAgICAgICAgbWF0cml4NC5yb3RhdGUoNjAsMCwwLDEpXG4gICAgICAgIGxldCB4Zm9ybU1hdHJpeCA9IG1hdHJpeDQubWF0cml4XG5cbiAgICAgICAgY29uc3QgdV94Zm9ybU1hdHJpeCA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihnbC5wcm9ncmFtLCd1X3hmb3JtTWF0cml4JylcbiAgICAgICAgaWYgKCF1X3hmb3JtTWF0cml4KSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBnbC51bmlmb3JtTWF0cml4NGZ2KHVfeGZvcm1NYXRyaXgsZmFsc2UseGZvcm1NYXRyaXgpXG5cbiAgICAgICAgZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApXG5cbiAgICAgICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVClcblxuICAgICAgICBnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFUywwLG4pXG4gICAgfVxuICAgIGluaXRWZXJ0ZXhCdWZmZXJzPShnbCk9PntcbiAgICAgICAgY29uc3QgdmVydGV4cyA9IG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgICAgICAgMC4wLDAuMywgLTAuMywtMC4zLCAwLjMsLTAuM1xuICAgICAgICBdKVxuXG4gICAgICAgIGNvbnN0IHZlcnRleEJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpXG4gICAgICAgIGlmICghdmVydGV4QnVmZmVyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGNyZWF0ZSB0aGUgYnVmZmVyIG9iamVjdCcpXG4gICAgICAgICAgICByZXR1cm4gLTFcbiAgICAgICAgfVxuXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLHZlcnRleEJ1ZmZlcilcblxuICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUix2ZXJ0ZXhzLGdsLlNUQVRJQ19EUkFXKVxuXG4gICAgICAgIGNvbnN0IGFfUG9zaXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihnbC5wcm9ncmFtLCdhX1Bvc2l0aW9uJylcbiAgICAgICAgaWYgKGFfUG9zaXRpb24gPCAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGdldCB0aGUgc3RvcmFnZSBsb2NhdGlvbiBvZiBhX1Bvc2l0aW9uJylcbiAgICAgICAgICAgIHJldHVybiAtMVxuICAgICAgICB9XG5cbiAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihhX1Bvc2l0aW9uLDIsZ2wuRkxPQVQsZmFsc2UsMCwwKVxuXG4gICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGFfUG9zaXRpb24pXG5cbiAgICAgICAgcmV0dXJuIDNcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udFNpemU6JzI4cHgnLG1hcmdpbjonNDBweCAwJ319PnsnUm90YXRlQW5kVHJhbnNsYXRlJ308L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8Y2FudmFzIHJlZj1cImNhbnZhc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgeyd0aGUgYnJvd2VyIGRvbmB0IHN1cHBvcnQgY2FudmFzLHBsZWFzZSBjaGFuZ2UgYW5vdGhlciBicm93ZXInfVxuICAgICAgICAgICAgICAgICAgICA8L2NhbnZhcz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBSb3RhdGVUcmFuc2xhdGVcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2FudmFzL3dlYmdsL3RyYW5zZm9ybS9jb21wb25lbnRzL1JvdGF0ZVRyYW5zbGF0ZS9Sb3RhdGVUcmFuc2xhdGUuanNcbiAqKi8iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xuXG5pbXBvcnQgeyBpbml0U2hhZGVycyB9IGZyb20gJ1dlQkdMVXRpbHMnXG5pbXBvcnQgTWF0cml4NCBmcm9tICdNYXRyaXg0J1xuXG4vLyDpobbngrnnnYDoibLlmahcbmNvbnN0IFZTSEFERVJfU09VUkNFID0gYFxuICAgIGF0dHJpYnV0ZSB2ZWM0IGFfUG9zaXRpb247XG4gICAgdW5pZm9ybSBtYXQ0IHVfeGZvcm1NYXRyaXg7XG4gICAgdm9pZCBtYWluKCl7XG4gICAgICAgIGdsX1Bvc2l0aW9uID0gdV94Zm9ybU1hdHJpeCphX1Bvc2l0aW9uO1xuICAgIH1cbmBcblxuLy8g54mH5YWD552A6Imy5ZmoXG5jb25zdCBGU0hBREVSX1NPVVJDRSA9IGBcbiAgICB2b2lkIG1haW4oKXtcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgxLjAsIDAuMCwgMC4wLCAxLjApO1xuICAgIH1cbmBcblxuY2xhc3MgUm90YXRpbmcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICB9XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnN0IGNhbnZhcyA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmc1snY2FudmFzJ10pXG5cbiAgICBjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpXG5cbiAgICBpZiAoIWdsKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGdldCB0aGUgcmVuZGVyaW5nIGNvbnRleHQgZm9yIFdlYkdMJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICghaW5pdFNoYWRlcnMoZ2wsVlNIQURFUl9TT1VSQ0UsRlNIQURFUl9TT1VSQ0UpKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGludGlhbGl6ZSBzaGFkZXJzLicpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBuID0gdGhpcy5pbml0VmVydGV4QnVmZmVycyhnbClcbiAgICBpZiAobiA8IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgdGhlIHZlcnRpY2VzJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuXG4gICAgY29uc3QgdV94Zm9ybU1hdHJpeCA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihnbC5wcm9ncmFtLCd1X3hmb3JtTWF0cml4JylcbiAgICBpZiAoIXVfeGZvcm1NYXRyaXgpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBtYXRyaXg0ID0gbmV3IE1hdHJpeDQoKVxuICAgIHRoaXMuQU5HTEUgPSAwLjBcbiAgICB0aGlzLlNQRUVEID0gNDUuMFxuICAgIGxldCB0aWNrID0gKCkgPT4ge1xuICAgICAgbGV0IG5vdyA9IERhdGUubm93KClcbiAgICAgIGxldCBlbGFwc2VkID0gbm93IC0gdGhpcy5sYXN0XG4gICAgICB0aGlzLmxhc3QgPSBub3dcbiAgICAgIHRoaXMuQU5HTEUgPSBlbGFwc2VkKnRoaXMuU1BFRUQvMTAwMC4wXG4gICAgICBtYXRyaXg0LnJvdGF0ZSh0aGlzLkFOR0xFLDAsMCwxKVxuICAgICAgdGhpcy5kcmF3KGdsLHVfeGZvcm1NYXRyaXgsbWF0cml4NC5tYXRyaXgsMylcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKVxuICAgIH1cbiAgICB0aGlzLmxhc3QgPSBEYXRlLm5vdygpXG4gICAgdGljaygpXG4gIH1cbiAgZHJhdyA9IChnbCx1X3hmb3JtTWF0cml4LG1hdHJpeCxuKSA9PiB7XG4gICAgZ2wudW5pZm9ybU1hdHJpeDRmdih1X3hmb3JtTWF0cml4LGZhbHNlLG1hdHJpeClcblxuICAgIGdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKVxuXG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVClcblxuICAgIGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVTLDAsbilcbiAgfVxuICBpbml0VmVydGV4QnVmZmVycyA9IChnbCkgPT4ge1xuICAgIGNvbnN0IHZlcnRleHMgPSBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgIDAuMCwwLjUsIC0wLjUsLTAuNSwgMC41LC0wLjVcbiAgICBdKVxuXG4gICAgY29uc3QgdmVydGV4QnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKClcbiAgICBpZiAoIXZlcnRleEJ1ZmZlcikge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBjcmVhdGUgdGhlIGJ1ZmZlciBvYmplY3QnKVxuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsdmVydGV4QnVmZmVyKVxuXG4gICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsdmVydGV4cyxnbC5TVEFUSUNfRFJBVylcblxuICAgIGNvbnN0IGFfUG9zaXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihnbC5wcm9ncmFtLCdhX1Bvc2l0aW9uJylcbiAgICBpZiAoYV9Qb3NpdGlvbiA8IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gZ2V0IHRoZSBzdG9yYWdlIGxvY2F0aW9uIG9mIGFfUG9zaXRpb24nKVxuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihhX1Bvc2l0aW9uLDIsZ2wuRkxPQVQsZmFsc2UsMCwwKVxuXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYV9Qb3NpdGlvbilcblxuICAgIHJldHVybiAzXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udFNpemU6JzI4cHgnLG1hcmdpbjonNDBweCAwJ319PnsnUm90YXRpbmcnfTwvZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCI+XG4gICAgICAgICAgICB7J3RoZSBicm93ZXIgZG9uYHQgc3VwcG9ydCBjYW52YXMscGxlYXNlIGNoYW5nZSBhbm90aGVyIGJyb3dlcid9XG4gICAgICAgICAgPC9jYW52YXM+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy51cH0+VVA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmRvd259PkRPV048L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbiAgdXAgPSAoKSA9PiB7XG4gICAgdGhpcy5TUEVFRCA9IHRoaXMuU1BFRUQrMTBcbiAgICBjb25zb2xlLmxvZyh0aGlzLlNQRUVEKVxuICB9XG4gIGRvd24gPSAoKSA9PiB7XG4gICAgdGhpcy5TUEVFRCA9IE1hdGgubWF4KHRoaXMuU1BFRUQgLSAxMCwgMClcbiAgICBjb25zb2xlLmxvZyh0aGlzLlNQRUVEKVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFJvdGF0aW5nXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC90cmFuc2Zvcm0vY29tcG9uZW50cy9Sb3RhdGluZy9Sb3RhdGluZy5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=