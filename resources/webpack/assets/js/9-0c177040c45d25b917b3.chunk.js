webpackJsonp([9],{

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

/***/ 326:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _ColoredAndTexture = __webpack_require__(327);
	
	var _ColoredAndTexture2 = _interopRequireDefault(_ColoredAndTexture);
	
	var _ColoredTriangle = __webpack_require__(329);
	
	var _ColoredTriangle2 = _interopRequireDefault(_ColoredTriangle);
	
	var _TextureQuad = __webpack_require__(330);
	
	var _TextureQuad2 = _interopRequireDefault(_TextureQuad);
	
	var _MultiTexture = __webpack_require__(332);
	
	var _MultiTexture2 = _interopRequireDefault(_MultiTexture);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function Transform() {
	  return _react2.default.createElement(
	    'div',
	    { className: _ColoredAndTexture2.default.transform },
	    _react2.default.createElement(_ColoredTriangle2.default, null),
	    _react2.default.createElement(_TextureQuad2.default, null),
	    _react2.default.createElement(_MultiTexture2.default, null)
	  );
	}
	module.exports = Transform;

/***/ },

/***/ 327:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(328);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./ColoredAndTexture.scss", function() {
				var newContent = require("!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./ColoredAndTexture.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 328:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".ColoredAndTexture__transform___GfnSX {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: distribute;\n      justify-content: space-around;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap; }\n\n.ColoredAndTexture__transform___GfnSX > div {\n  margin: 0 50px; }\n\n.ColoredAndTexture__transform___GfnSX canvas {\n  width: 300px;\n  height: 300px; }\n", ""]);
	
	// exports
	exports.locals = {
		"transform": "ColoredAndTexture__transform___GfnSX"
	};

/***/ },

/***/ 329:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _WeBGLUtils = __webpack_require__(310);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// 顶点着色器
	var VSHADER_SOURCE = '\n    precision mediump float;\n    attribute vec4 a_Position;\n    attribute vec4 a_Color;\n    varying vec4 v_Color;\n    void main(){\n        gl_Position = a_Position;\n        v_Color = a_Color;\n    }\n';
	
	// 片元着色器
	var FSHADER_SOURCE = '\n    precision mediump float;\n    varying vec4 v_Color;\n    void main(){\n        gl_FragColor = v_Color;\n    }\n';
	
	var ColoredTriangle = function (_React$Component) {
	  _inherits(ColoredTriangle, _React$Component);
	
	  function ColoredTriangle() {
	    var _Object$getPrototypeO;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, ColoredTriangle);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(ColoredTriangle)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.initVertexBuffers = function (gl) {
	      var vertexsColors = new Float32Array([0.0, 0.5, 1.0, 0.0, 0.0, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, 0.0, 0.0, 1.0]);
	      var vertexColorBuffer = gl.createBuffer();
	      if (!vertexColorBuffer) {
	        console.log('Failed to create the buffer object');
	        return -1;
	      }
	
	      gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
	
	      gl.bufferData(gl.ARRAY_BUFFER, vertexsColors, gl.STATIC_DRAW);
	
	      var FSIZE = vertexsColors.BYTES_PER_ELEMENT;
	
	      // a_Position
	      var aPosition = gl.getAttribLocation(gl.program, 'a_Position');
	      if (aPosition < 0) {
	        console.log('Failed to get the storage location of a_Position');
	        return -1;
	      }
	
	      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 5, 0);
	
	      gl.enableVertexAttribArray(aPosition);
	
	      // a_Color
	      var aColor = gl.getAttribLocation(gl.program, 'a_Color');
	      if (aColor < 0) {
	        console.log('Failed to get the storage location of a_Color');
	        return -1;
	      }
	
	      gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
	
	      gl.enableVertexAttribArray(aColor);
	      return 3;
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(ColoredTriangle, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var canvas = _reactDom2.default.findDOMNode(this.refs.canvas);
	
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
	          '彩色三角形'
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'canvas',
	            { ref: 'canvas' },
	            'the brower don`t support canvas, please change another brower'
	          )
	        )
	      );
	    }
	  }]);
	
	  return ColoredTriangle;
	}(_react2.default.Component);
	
	module.exports = ColoredTriangle;

/***/ },

/***/ 330:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _WeBGLUtils = __webpack_require__(310);
	
	var _sky = __webpack_require__(331);
	
	var _sky2 = _interopRequireDefault(_sky);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var TextureQuad = function (_React$Component) {
	  _inherits(TextureQuad, _React$Component);
	
	  function TextureQuad(props) {
	    _classCallCheck(this, TextureQuad);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TextureQuad).call(this, props));
	
	    _this.initVertexBuffers = function (gl) {
	      var vertexs = new Float32Array([-0.5, 0.5, 0.0, 2.0, -0.5, -0.5, 0.0, 0.0, 0.5, 0.5, 2.0, 2.0, 0.5, -0.5, 2.0, 0.0]);
	
	      var vertexBuffer = gl.createBuffer();
	      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	      gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW);
	
	      var FSIZE = vertexs.BYTES_PER_ELEMENT;
	
	      // aPosition
	      var aPosition = gl.getAttribLocation(gl.program, 'a_Position');
	      if (aPosition < 0) {
	        console.log('Failed to get the storage location of a_Position');
	        return -1;
	      }
	      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 4, 0);
	      gl.enableVertexAttribArray(aPosition);
	
	      // aTexCoord
	      var aTexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
	      if (aTexCoord < 0) {
	        console.log('Failed to get the storage location of a_TexCoord');
	        return -1;
	      }
	      gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
	      gl.enableVertexAttribArray(aTexCoord);
	      return 4;
	    };
	
	    _this.initTextures = function (gl, n) {
	      var texture = gl.createTexture();
	
	      // u_Sampler
	      var uSampler = gl.getUniformLocation(gl.program, 'u_Sampler');
	      if (!uSampler) {
	        console.log('Failed to get the storage location of u_Sampler');
	        return;
	      }
	
	      var image = new Image();
	      image.onload = function () {
	        _this.loadTexture(gl, n, texture, uSampler, image);
	      };
	      image.src = _sky2.default;
	    };
	
	    _this.loadTexture = function (gl, n, texture, uSampler, image) {
	      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	      gl.activeTexture(gl.TEXTURE0);
	      gl.bindTexture(gl.TEXTURE_2D, texture);
	      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	      gl.uniform1i(uSampler, 0);
	      gl.clear(gl.COLOR_BUFFER_BIT);
	      gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
	    };
	
	    _this.VSHADER_SOURCE = '\n      precision mediump float;\n      attribute vec4 a_Position;\n      attribute vec2 a_TexCoord;\n      varying vec2 v_TexCoord;\n      void main(){\n          gl_Position = a_Position;\n          v_TexCoord = a_TexCoord;\n      }\n    ';
	
	    _this.FSHADER_SOURCE = '\n      precision mediump float;\n      uniform sampler2D u_Sampler;\n      varying vec2 v_TexCoord;\n      void main(){\n          gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n      }\n    ';
	    return _this;
	  }
	
	  _createClass(TextureQuad, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      try {
	        var canvas = _reactDom2.default.findDOMNode(this.refs.canvas);
	        var gl = canvas.getContext('webgl');
	        if (!gl) {
	          console.log('Failed to get the rendering context for WebGL');
	          return;
	        }
	
	        if (!(0, _WeBGLUtils.initShaders)(gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE)) {
	          console.log('Failed to intialize shaders');
	          return;
	        }
	
	        var n = this.initVertexBuffers(gl);
	
	        gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	        this.initTextures(gl, n);
	      } catch (e) {
	        console.log(e);
	      }
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
	          '四边形纹理'
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'canvas',
	            { ref: 'canvas' },
	            'the brower don`t support canvas, please change another brower'
	          )
	        )
	      );
	    }
	  }]);
	
	  return TextureQuad;
	}(_react2.default.Component);
	
	module.exports = TextureQuad;

/***/ },

/***/ 331:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "2b11efd69a0706609e35dd0f1f46eaba.jpg";

/***/ },

/***/ 332:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _WeBGLUtils = __webpack_require__(310);
	
	var _sky = __webpack_require__(331);
	
	var _sky2 = _interopRequireDefault(_sky);
	
	var _circle = __webpack_require__(333);
	
	var _circle2 = _interopRequireDefault(_circle);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var MultiTexture = function (_React$Component) {
	  _inherits(MultiTexture, _React$Component);
	
	  function MultiTexture(props) {
	    _classCallCheck(this, MultiTexture);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultiTexture).call(this, props));
	
	    _this.initVertexBuffers = function (gl) {
	      var vertexs = new Float32Array([-0.5, 0.5, 0.0, 1.0, -0.5, -0.5, 0.0, 0.0, 0.5, 0.5, 1.0, 1.0, 0.5, -0.5, 1.0, 0.0]);
	
	      var vertexBuffer = gl.createBuffer();
	      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	      gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW);
	
	      var FSIZE = vertexs.BYTES_PER_ELEMENT;
	
	      // aPosition
	      var aPosition = gl.getAttribLocation(gl.program, 'a_Position');
	      if (aPosition < 0) {
	        console.log('Failed to get the storage location of a_Position');
	        return -1;
	      }
	      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 4, 0);
	      gl.enableVertexAttribArray(aPosition);
	
	      // a_TexCoord
	      var aTexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
	      if (aTexCoord < 0) {
	        console.log('Failed to get the storage location of a_TexCoord');
	        return -1;
	      }
	      gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
	      gl.enableVertexAttribArray(aTexCoord);
	      return 4;
	    };
	
	    _this.initTextures = function (gl, n) {
	      var texture0 = gl.createTexture();
	      var texture1 = gl.createTexture();
	
	      // u_Sampler
	      var uSampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
	      if (!uSampler0) {
	        console.log('Failed to get the storage location of u_Sampler0');
	        return;
	      }
	      var uSampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
	      if (!uSampler1) {
	        console.log('Failed to get the storage location of u_Sampler1');
	        return;
	      }
	
	      var image0 = new Image();
	      var image1 = new Image();
	      image0.onload = function () {
	        _this.loadTexture(gl, n, texture0, uSampler0, image0, 0);
	      };
	      image1.onload = function () {
	        _this.loadTexture(gl, n, texture1, uSampler1, image1, 1);
	      };
	      image0.src = _sky2.default;
	      image1.src = _circle2.default;
	    };
	
	    _this.loadTexture = function (gl, n, texture, uSampler, image, index) {
	      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	      gl.activeTexture(gl['TEXTURE' + index]);
	      _this['TEXTURE' + index] = true;
	      gl.bindTexture(gl.TEXTURE_2D, texture);
	      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	      gl.uniform1i(uSampler, index);
	      if (_this.TEXTURE0 && _this.TEXTURE1) {
	        gl.clear(gl.COLOR_BUFFER_BIT);
	        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
	      }
	    };
	
	    _this.VSHADER_SOURCE = '\n      precision mediump float;\n      attribute vec4 a_Position;\n      attribute vec2 a_TexCoord;\n      varying vec2 v_TexCoord;\n      void main(){\n          gl_Position = a_Position;\n          v_TexCoord = a_TexCoord;\n      }\n    ';
	
	    _this.FSHADER_SOURCE = '\n      precision mediump float;\n      uniform sampler2D u_Sampler0;\n      uniform sampler2D u_Sampler1;\n      varying vec2 v_TexCoord;\n      void main(){\n          vec4 color0 = texture2D(u_Sampler0, v_TexCoord);\n          vec4 color1 = texture2D(u_Sampler1, v_TexCoord);\n          gl_FragColor = color0*color1;\n      }\n    ';
	    return _this;
	  }
	
	  _createClass(MultiTexture, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      try {
	        var canvas = _reactDom2.default.findDOMNode(this.refs.canvas);
	        var gl = canvas.getContext('webgl');
	        if (!gl) {
	          console.log('Failed to get the rendering context for WebGL');
	          return;
	        }
	
	        if (!(0, _WeBGLUtils.initShaders)(gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE)) {
	          console.log('Failed to intialize shaders');
	          return;
	        }
	
	        var n = this.initVertexBuffers(gl);
	
	        gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	        this.initTextures(gl, n);
	      } catch (e) {
	        console.log(e);
	      }
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
	          '多纹理纹理叠加'
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'canvas',
	            { ref: 'canvas' },
	            'the brower don`t support canvas, please change another brower'
	          )
	        )
	      );
	    }
	  }]);
	
	  return MultiTexture;
	}(_react2.default.Component);
	
	module.exports = MultiTexture;

/***/ },

/***/ 333:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "def06678ed2158414e1ba6fccd09ffe8.gif";

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzP2RhMDQqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanM/Yjk4MCoqKioqKioqIiwid2VicGFjazovLy8uL3NyYy9saWIvd2ViZ2wvdXRpbHMuanM/NWQwNyoqKiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvY29sb3JlZEFuZFRleHR1cmUvQ29sb3JlZEFuZFRleHR1cmUuanN4Iiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC9jb2xvcmVkQW5kVGV4dHVyZS9Db2xvcmVkQW5kVGV4dHVyZS5zY3NzPzdjNGQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2FudmFzL3dlYmdsL2NvbG9yZWRBbmRUZXh0dXJlL0NvbG9yZWRBbmRUZXh0dXJlLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2FudmFzL3dlYmdsL2NvbG9yZWRBbmRUZXh0dXJlL2NvbXBvbmVudHMvQ29sb3JlZFRyaWFuZ2xlL0NvbG9yZWRUcmlhbmdsZS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2FudmFzL3dlYmdsL2NvbG9yZWRBbmRUZXh0dXJlL2NvbXBvbmVudHMvVGV4dHVyZVF1YWQvVGV4dHVyZVF1YWQuanN4Iiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC9jb2xvcmVkQW5kVGV4dHVyZS9pbWFnZXMvc2t5LmpwZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvY29sb3JlZEFuZFRleHR1cmUvY29tcG9uZW50cy9NdWx0aVRleHR1cmUvTXVsdGlUZXh0dXJlLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvY29sb3JlZEFuZFRleHR1cmUvaW1hZ2VzL2NpcmNsZS5naWYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQSx5Q0FBd0MsZ0JBQWdCO0FBQ3hELEtBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBWSxvQkFBb0I7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFnQixtQkFBbUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCLHNCQUFzQjtBQUN0QztBQUNBO0FBQ0EsbUJBQWtCLDJCQUEyQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZSxtQkFBbUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUIsMkJBQTJCO0FBQzVDO0FBQ0E7QUFDQSxT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Q0Q7QUFDRjs7OzhCQTBFUTtBQUNQLGNBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGFBQUssT0FBTyxFQUFFLFVBQVUsTUFBWixFQUFvQixRQUFRLFFBQTVCLEVBQVo7QUFBcUQ7QUFBckQsVUFERjtBQUVFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxlQUFRLEtBQUksUUFBWjtBQUNHO0FBREg7QUFERjtBQUZGLFFBREY7QUFVRDs7OztHQXJJd0IsZ0JBQU0sUzs7QUF3SWpDLFFBQU8sT0FBUCxHQUFpQixZQUFqQixDOzs7Ozs7O0FDaEpBLGlGIiwiZmlsZSI6ImpzLzktMGMxNzcwNDBjNDVkMjViOTE3YjMuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBsaXN0ID0gW107XHJcblxyXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcclxuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXNbaV07XHJcblx0XHRcdGlmKGl0ZW1bMl0pIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGl0ZW1bMV0gKyBcIn1cIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goaXRlbVsxXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQuam9pbihcIlwiKTtcclxuXHR9O1xyXG5cclxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxyXG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcclxuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxyXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XHJcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcclxuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxyXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xyXG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXHJcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXHJcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXHJcblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXHJcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XHJcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRyZXR1cm4gbGlzdDtcclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbiAqKiBtb2R1bGUgaWQgPSAyNTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYgNyA4IDkgMTggMTkgMjAgMjMgMjQgMjUgMjYgMjcgMjggMjkgMzAgMzEgMzJcbiAqKi8iLCIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG52YXIgc3R5bGVzSW5Eb20gPSB7fSxcclxuXHRtZW1vaXplID0gZnVuY3Rpb24oZm4pIHtcclxuXHRcdHZhciBtZW1vO1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHRcdFx0cmV0dXJuIG1lbW87XHJcblx0XHR9O1xyXG5cdH0sXHJcblx0aXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gL21zaWUgWzYtOV1cXGIvLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XHJcblx0fSksXHJcblx0Z2V0SGVhZEVsZW1lbnQgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuXHR9KSxcclxuXHRzaW5nbGV0b25FbGVtZW50ID0gbnVsbCxcclxuXHRzaW5nbGV0b25Db3VudGVyID0gMCxcclxuXHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XHJcblx0aWYodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XHJcblx0XHRpZih0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcclxuXHR9XHJcblxyXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxyXG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2VcclxuXHRpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcclxuXHJcblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIDxoZWFkPi5cclxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xyXG5cclxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QpO1xyXG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xyXG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcclxuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XHJcblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcclxuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xyXG5cdFx0fVxyXG5cdFx0aWYobmV3TGlzdCkge1xyXG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QpO1xyXG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XHJcblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcclxuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspXHJcblx0XHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXSgpO1xyXG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpIHtcclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcclxuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xyXG5cdFx0aWYoZG9tU3R5bGUpIHtcclxuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyhsaXN0KSB7XHJcblx0dmFyIHN0eWxlcyA9IFtdO1xyXG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xyXG5cdFx0dmFyIGlkID0gaXRlbVswXTtcclxuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xyXG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcclxuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xyXG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xyXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pXHJcblx0XHRcdHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XHJcblx0XHRlbHNlXHJcblx0XHRcdG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcclxuXHR9XHJcblx0cmV0dXJuIHN0eWxlcztcclxufVxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCkge1xyXG5cdHZhciBoZWFkID0gZ2V0SGVhZEVsZW1lbnQoKTtcclxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcFtzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcclxuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xyXG5cdFx0aWYoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XHJcblx0XHRcdGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgaGVhZC5maXJzdENoaWxkKTtcclxuXHRcdH0gZWxzZSBpZihsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xyXG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHRcdH1cclxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGVFbGVtZW50KTtcclxuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcclxuXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcuIE11c3QgYmUgJ3RvcCcgb3IgJ2JvdHRvbScuXCIpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xyXG5cdHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0dmFyIGlkeCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGVFbGVtZW50KTtcclxuXHRpZihpZHggPj0gMCkge1xyXG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykge1xyXG5cdHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XHJcblx0c3R5bGVFbGVtZW50LnR5cGUgPSBcInRleHQvY3NzXCI7XHJcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCk7XHJcblx0cmV0dXJuIHN0eWxlRWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucykge1xyXG5cdHZhciBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xyXG5cdGxpbmtFbGVtZW50LnJlbCA9IFwic3R5bGVzaGVldFwiO1xyXG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rRWxlbWVudCk7XHJcblx0cmV0dXJuIGxpbmtFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTdHlsZShvYmosIG9wdGlvbnMpIHtcclxuXHR2YXIgc3R5bGVFbGVtZW50LCB1cGRhdGUsIHJlbW92ZTtcclxuXHJcblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XHJcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcclxuXHRcdHN0eWxlRWxlbWVudCA9IHNpbmdsZXRvbkVsZW1lbnQgfHwgKHNpbmdsZXRvbkVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xyXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgZmFsc2UpO1xyXG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgdHJ1ZSk7XHJcblx0fSBlbHNlIGlmKG9iai5zb3VyY2VNYXAgJiZcclxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XHJcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcclxuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcclxuXHRcdFx0aWYoc3R5bGVFbGVtZW50LmhyZWYpXHJcblx0XHRcdFx0VVJMLnJldm9rZU9iamVjdFVSTChzdHlsZUVsZW1lbnQuaHJlZik7XHJcblx0XHR9O1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XHJcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcclxuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHR1cGRhdGUob2JqKTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xyXG5cdFx0aWYobmV3T2JqKSB7XHJcblx0XHRcdGlmKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcClcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0fTtcclxufVxyXG5cclxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgdGV4dFN0b3JlID0gW107XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XHJcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XHJcblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcclxuXHR9O1xyXG59KSgpO1xyXG5cclxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZUVsZW1lbnQsIGluZGV4LCByZW1vdmUsIG9iaikge1xyXG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcclxuXHJcblx0aWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcclxuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGVFbGVtZW50LmNoaWxkTm9kZXM7XHJcblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50Lmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBhcHBseVRvVGFnKHN0eWxlRWxlbWVudCwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IG9iai5jc3M7XHJcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xyXG5cclxuXHRpZihtZWRpYSkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxyXG5cdH1cclxuXHJcblx0aWYoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XHJcblx0fSBlbHNlIHtcclxuXHRcdHdoaWxlKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XHJcblx0XHR9XHJcblx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVMaW5rKGxpbmtFbGVtZW50LCBvYmopIHtcclxuXHR2YXIgY3NzID0gb2JqLmNzcztcclxuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcclxuXHJcblx0aWYoc291cmNlTWFwKSB7XHJcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxyXG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xyXG5cdH1cclxuXHJcblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XHJcblxyXG5cdHZhciBvbGRTcmMgPSBsaW5rRWxlbWVudC5ocmVmO1xyXG5cclxuXHRsaW5rRWxlbWVudC5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcclxuXHJcblx0aWYob2xkU3JjKVxyXG5cdFx0VVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xyXG59XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcbiAqKiBtb2R1bGUgaWQgPSAyNTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYgNyA4IDkgMTggMTkgMjAgMjMgMjQgMjUgMjYgMjcgMjggMjkgMzAgMzEgMzJcbiAqKi8iLCIvKipcbiAqIENyZWF0ZSBhIHByb2dyYW0gb2JqZWN0IGFuZCBtYWtlIGN1cnJlbnRcbiAqIEBwYXJhbSBnbCBHTCBjb250ZXh0XG4gKiBAcGFyYW0gdnNoYWRlciBhIHZlcnRleCBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHBhcmFtIGZzaGFkZXIgYSBmcmFnbWVudCBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHJldHVybiB0cnVlLCBpZiB0aGUgcHJvZ3JhbSBvYmplY3Qgd2FzIGNyZWF0ZWQgYW5kIHN1Y2Nlc3NmdWxseSBtYWRlIGN1cnJlbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRTaGFkZXJzKGdsLCB2c2hhZGVyLCBmc2hhZGVyKSB7XG4gIHZhciBwcm9ncmFtID0gY3JlYXRlUHJvZ3JhbShnbCwgdnNoYWRlciwgZnNoYWRlcik7XG4gIGlmICghcHJvZ3JhbSkge1xuICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gY3JlYXRlIHByb2dyYW0nKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xuICBnbC5wcm9ncmFtID0gcHJvZ3JhbTtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgdGhlIGxpbmtlZCBwcm9ncmFtIG9iamVjdFxuICogQHBhcmFtIGdsIEdMIGNvbnRleHRcbiAqIEBwYXJhbSB2c2hhZGVyIGEgdmVydGV4IHNoYWRlciBwcm9ncmFtIChzdHJpbmcpXG4gKiBAcGFyYW0gZnNoYWRlciBhIGZyYWdtZW50IHNoYWRlciBwcm9ncmFtIChzdHJpbmcpXG4gKiBAcmV0dXJuIGNyZWF0ZWQgcHJvZ3JhbSBvYmplY3QsIG9yIG51bGwgaWYgdGhlIGNyZWF0aW9uIGhhcyBmYWlsZWRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlUHJvZ3JhbShnbCwgdnNoYWRlciwgZnNoYWRlcikge1xuICAvLyBDcmVhdGUgc2hhZGVyIG9iamVjdFxuICB2YXIgdmVydGV4U2hhZGVyID0gbG9hZFNoYWRlcihnbCwgZ2wuVkVSVEVYX1NIQURFUiwgdnNoYWRlcik7XG4gIHZhciBmcmFnbWVudFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wsIGdsLkZSQUdNRU5UX1NIQURFUiwgZnNoYWRlcik7XG4gIGlmICghdmVydGV4U2hhZGVyIHx8ICFmcmFnbWVudFNoYWRlcikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gQ3JlYXRlIGEgcHJvZ3JhbSBvYmplY3RcbiAgdmFyIHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gIGlmICghcHJvZ3JhbSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gQXR0YWNoIHRoZSBzaGFkZXIgb2JqZWN0c1xuICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdmVydGV4U2hhZGVyKTtcbiAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZyYWdtZW50U2hhZGVyKTtcblxuICAvLyBMaW5rIHRoZSBwcm9ncmFtIG9iamVjdFxuICBnbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcblxuICAvLyBDaGVjayB0aGUgcmVzdWx0IG9mIGxpbmtpbmdcbiAgdmFyIGxpbmtlZCA9IGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpO1xuICBpZiAoIWxpbmtlZCkge1xuICAgIHZhciBlcnJvciA9IGdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pO1xuICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gbGluayBwcm9ncmFtOiAnICsgZXJyb3IpO1xuICAgIGdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSk7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKGZyYWdtZW50U2hhZGVyKTtcbiAgICBnbC5kZWxldGVTaGFkZXIodmVydGV4U2hhZGVyKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gcHJvZ3JhbTtcbn1cblxuXG4vKipcbiAqIENyZWF0ZSBhIHNoYWRlciBvYmplY3RcbiAqIEBwYXJhbSBnbCBHTCBjb250ZXh0XG4gKiBAcGFyYW0gdHlwZSB0aGUgdHlwZSBvZiB0aGUgc2hhZGVyIG9iamVjdCB0byBiZSBjcmVhdGVkXG4gKiBAcGFyYW0gc291cmNlIHNoYWRlciBwcm9ncmFtIChzdHJpbmcpXG4gKiBAcmV0dXJuIGNyZWF0ZWQgc2hhZGVyIG9iamVjdCwgb3IgbnVsbCBpZiB0aGUgY3JlYXRpb24gaGFzIGZhaWxlZC5cbiAqL1xuZnVuY3Rpb24gbG9hZFNoYWRlcihnbCwgdHlwZSwgc291cmNlKSB7XG4gIC8vIENyZWF0ZSBzaGFkZXIgb2JqZWN0XG4gIHZhciBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodHlwZSk7XG4gIGlmIChzaGFkZXIgPT0gbnVsbCkge1xuICAgIGNvbnNvbGUubG9nKCd1bmFibGUgdG8gY3JlYXRlIHNoYWRlcicpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gU2V0IHRoZSBzaGFkZXIgcHJvZ3JhbVxuICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzb3VyY2UpO1xuXG4gIC8vIENvbXBpbGUgdGhlIHNoYWRlclxuICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XG5cbiAgLy8gQ2hlY2sgdGhlIHJlc3VsdCBvZiBjb21waWxhdGlvblxuICB2YXIgY29tcGlsZWQgPSBnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUyk7XG4gIGlmICghY29tcGlsZWQpIHtcbiAgICB2YXIgZXJyb3IgPSBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcik7XG4gICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBjb21waWxlIHNoYWRlcjogJyArIGVycm9yKTtcbiAgICBnbC5kZWxldGVTaGFkZXIoc2hhZGVyKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBzaGFkZXI7XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9saWIvd2ViZ2wvdXRpbHMuanNcbiAqKi8iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5cbmltcG9ydCBzdHlsZXMgZnJvbSAnLi9Db2xvcmVkQW5kVGV4dHVyZS5zY3NzJ1xuXG5pbXBvcnQgQ29sb3JlZFRyaWFuZ2xlIGZyb20gJy4vY29tcG9uZW50cy9Db2xvcmVkVHJpYW5nbGUvQ29sb3JlZFRyaWFuZ2xlLmpzeCdcbmltcG9ydCBUZXh0dXJlUXVhZCBmcm9tICcuL2NvbXBvbmVudHMvVGV4dHVyZVF1YWQvVGV4dHVyZVF1YWQuanN4J1xuaW1wb3J0IE11bHRpVGV4dHVyZSBmcm9tICcuL2NvbXBvbmVudHMvTXVsdGlUZXh0dXJlL011bHRpVGV4dHVyZS5qc3gnXG5cbmZ1bmN0aW9uIFRyYW5zZm9ybSgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLnRyYW5zZm9ybX0+XG4gICAgICA8Q29sb3JlZFRyaWFuZ2xlIC8+XG4gICAgICA8VGV4dHVyZVF1YWQgLz5cbiAgICAgIDxNdWx0aVRleHR1cmUgLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc2Zvcm1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2FudmFzL3dlYmdsL2NvbG9yZWRBbmRUZXh0dXJlL0NvbG9yZWRBbmRUZXh0dXJlLmpzeFxuICoqLyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL0NvbG9yZWRBbmRUZXh0dXJlLnNjc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL0NvbG9yZWRBbmRUZXh0dXJlLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vQ29sb3JlZEFuZFRleHR1cmUuc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC9jb2xvcmVkQW5kVGV4dHVyZS9Db2xvcmVkQW5kVGV4dHVyZS5zY3NzXG4gKiogbW9kdWxlIGlkID0gMzI3XG4gKiogbW9kdWxlIGNodW5rcyA9IDlcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5Db2xvcmVkQW5kVGV4dHVyZV9fdHJhbnNmb3JtX19fR2ZuU1gge1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIC1tcy1mbGV4LXBhY2s6IGRpc3RyaWJ1dGU7XFxuICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICAtbXMtZmxleC13cmFwOiB3cmFwO1xcbiAgICAgIGZsZXgtd3JhcDogd3JhcDsgfVxcblxcbi5Db2xvcmVkQW5kVGV4dHVyZV9fdHJhbnNmb3JtX19fR2ZuU1ggPiBkaXYge1xcbiAgbWFyZ2luOiAwIDUwcHg7IH1cXG5cXG4uQ29sb3JlZEFuZFRleHR1cmVfX3RyYW5zZm9ybV9fX0dmblNYIGNhbnZhcyB7XFxuICB3aWR0aDogMzAwcHg7XFxuICBoZWlnaHQ6IDMwMHB4OyB9XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuZXhwb3J0cy5sb2NhbHMgPSB7XG5cdFwidHJhbnNmb3JtXCI6IFwiQ29sb3JlZEFuZFRleHR1cmVfX3RyYW5zZm9ybV9fX0dmblNYXCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlcj9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi9+L3Bvc3Rjc3MtbG9hZGVyIS4vfi9zYXNzLWxvYWRlciEuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC9jb2xvcmVkQW5kVGV4dHVyZS9Db2xvcmVkQW5kVGV4dHVyZS5zY3NzXG4gKiogbW9kdWxlIGlkID0gMzI4XG4gKiogbW9kdWxlIGNodW5rcyA9IDlcbiAqKi8iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xuXG5pbXBvcnQgeyBpbml0U2hhZGVycyB9IGZyb20gJ1dlQkdMVXRpbHMnXG5cbi8vIOmhtueCueedgOiJsuWZqFxuY29uc3QgVlNIQURFUl9TT1VSQ0UgPSBgXG4gICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gICAgYXR0cmlidXRlIHZlYzQgYV9Qb3NpdGlvbjtcbiAgICBhdHRyaWJ1dGUgdmVjNCBhX0NvbG9yO1xuICAgIHZhcnlpbmcgdmVjNCB2X0NvbG9yO1xuICAgIHZvaWQgbWFpbigpe1xuICAgICAgICBnbF9Qb3NpdGlvbiA9IGFfUG9zaXRpb247XG4gICAgICAgIHZfQ29sb3IgPSBhX0NvbG9yO1xuICAgIH1cbmBcblxuLy8g54mH5YWD552A6Imy5ZmoXG5jb25zdCBGU0hBREVSX1NPVVJDRSA9IGBcbiAgICBwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcbiAgICB2YXJ5aW5nIHZlYzQgdl9Db2xvcjtcbiAgICB2b2lkIG1haW4oKXtcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdl9Db2xvcjtcbiAgICB9XG5gXG5cbmNsYXNzIENvbG9yZWRUcmlhbmdsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnN0IGNhbnZhcyA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmcy5jYW52YXMpXG5cbiAgICBjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpXG5cbiAgICBpZiAoIWdsKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGdldCB0aGUgcmVuZGVyaW5nIGNvbnRleHQgZm9yIFdlYkdMJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICghaW5pdFNoYWRlcnMoZ2wsIFZTSEFERVJfU09VUkNFLCBGU0hBREVSX1NPVVJDRSkpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gaW50aWFsaXplIHNoYWRlcnMuJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IG4gPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXJzKGdsKVxuICAgIGlmIChuIDwgMCkge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBzZXQgdGhlIHBvc2l0aW9ucyBvZiB0aGUgdmVydGljZXMnKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApXG5cbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKVxuXG4gICAgZ2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRVMsIDAsIG4pXG4gIH1cbiAgaW5pdFZlcnRleEJ1ZmZlcnMgPSAoZ2wpID0+IHtcbiAgICBjb25zdCB2ZXJ0ZXhzQ29sb3JzID0gbmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAwLjAsIDAuNSwgMS4wLCAwLjAsIDAuMCxcbiAgICAgIC0wLjUsIC0wLjUsIDAuMCwgMS4wLCAwLjAsXG4gICAgICAwLjUsIC0wLjUsIDAuMCwgMC4wLCAxLjAsXG4gICAgXSlcbiAgICBjb25zdCB2ZXJ0ZXhDb2xvckJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpXG4gICAgaWYgKCF2ZXJ0ZXhDb2xvckJ1ZmZlcikge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBjcmVhdGUgdGhlIGJ1ZmZlciBvYmplY3QnKVxuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHZlcnRleENvbG9yQnVmZmVyKVxuXG4gICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIHZlcnRleHNDb2xvcnMsIGdsLlNUQVRJQ19EUkFXKVxuXG4gICAgY29uc3QgRlNJWkUgPSB2ZXJ0ZXhzQ29sb3JzLkJZVEVTX1BFUl9FTEVNRU5UXG5cbiAgICAvLyBhX1Bvc2l0aW9uXG4gICAgY29uc3QgYVBvc2l0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oZ2wucHJvZ3JhbSwgJ2FfUG9zaXRpb24nKVxuICAgIGlmIChhUG9zaXRpb24gPCAwKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGdldCB0aGUgc3RvcmFnZSBsb2NhdGlvbiBvZiBhX1Bvc2l0aW9uJylcbiAgICAgIHJldHVybiAtMVxuICAgIH1cblxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYVBvc2l0aW9uLCAyLCBnbC5GTE9BVCwgZmFsc2UsIEZTSVpFICogNSwgMClcblxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGFQb3NpdGlvbilcblxuICAgIC8vIGFfQ29sb3JcbiAgICBjb25zdCBhQ29sb3IgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihnbC5wcm9ncmFtLCAnYV9Db2xvcicpXG4gICAgaWYgKGFDb2xvciA8IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gZ2V0IHRoZSBzdG9yYWdlIGxvY2F0aW9uIG9mIGFfQ29sb3InKVxuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihhQ29sb3IsIDMsIGdsLkZMT0FULCBmYWxzZSwgRlNJWkUgKiA1LCBGU0laRSAqIDIpXG5cbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhQ29sb3IpXG4gICAgcmV0dXJuIDNcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcyOHB4JywgbWFyZ2luOiAnNDBweCAwJyB9fT57J+W9qeiJsuS4ieinkuW9oid9PC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIj5cbiAgICAgICAgICAgIHsndGhlIGJyb3dlciBkb25gdCBzdXBwb3J0IGNhbnZhcywgcGxlYXNlIGNoYW5nZSBhbm90aGVyIGJyb3dlcid9XG4gICAgICAgICAgPC9jYW52YXM+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yZWRUcmlhbmdsZVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvY29sb3JlZEFuZFRleHR1cmUvY29tcG9uZW50cy9Db2xvcmVkVHJpYW5nbGUvQ29sb3JlZFRyaWFuZ2xlLmpzeFxuICoqLyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5cbmltcG9ydCB7IGluaXRTaGFkZXJzIH0gZnJvbSAnV2VCR0xVdGlscydcblxuaW1wb3J0IHNreSBmcm9tICcuLi8uLi9pbWFnZXMvc2t5LmpwZydcblxuY2xhc3MgVGV4dHVyZVF1YWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuVlNIQURFUl9TT1VSQ0UgPSBgXG4gICAgICBwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcbiAgICAgIGF0dHJpYnV0ZSB2ZWM0IGFfUG9zaXRpb247XG4gICAgICBhdHRyaWJ1dGUgdmVjMiBhX1RleENvb3JkO1xuICAgICAgdmFyeWluZyB2ZWMyIHZfVGV4Q29vcmQ7XG4gICAgICB2b2lkIG1haW4oKXtcbiAgICAgICAgICBnbF9Qb3NpdGlvbiA9IGFfUG9zaXRpb247XG4gICAgICAgICAgdl9UZXhDb29yZCA9IGFfVGV4Q29vcmQ7XG4gICAgICB9XG4gICAgYFxuXG4gICAgdGhpcy5GU0hBREVSX1NPVVJDRSA9IGBcbiAgICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICAgICAgdW5pZm9ybSBzYW1wbGVyMkQgdV9TYW1wbGVyO1xuICAgICAgdmFyeWluZyB2ZWMyIHZfVGV4Q29vcmQ7XG4gICAgICB2b2lkIG1haW4oKXtcbiAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodV9TYW1wbGVyLCB2X1RleENvb3JkKTtcbiAgICAgIH1cbiAgICBgXG4gIH1cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNhbnZhcyA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmcy5jYW52YXMpXG4gICAgICBjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpXG4gICAgICBpZiAoIWdsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gZ2V0IHRoZSByZW5kZXJpbmcgY29udGV4dCBmb3IgV2ViR0wnKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKCFpbml0U2hhZGVycyhnbCwgdGhpcy5WU0hBREVSX1NPVVJDRSwgdGhpcy5GU0hBREVSX1NPVVJDRSkpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBpbnRpYWxpemUgc2hhZGVycycpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBuID0gdGhpcy5pbml0VmVydGV4QnVmZmVycyhnbClcblxuICAgICAgZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApXG5cbiAgICAgIHRoaXMuaW5pdFRleHR1cmVzKGdsLCBuKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfVxuICB9XG4gIGluaXRWZXJ0ZXhCdWZmZXJzID0gKGdsKSA9PiB7XG4gICAgY29uc3QgdmVydGV4cyA9IG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgLTAuNSwgMC41LCAwLjAsIDIuMCxcbiAgICAgIC0wLjUsIC0wLjUsIDAuMCwgMC4wLFxuICAgICAgMC41LCAwLjUsIDIuMCwgMi4wLFxuICAgICAgMC41LCAtMC41LCAyLjAsIDAuMCxcbiAgICBdKVxuXG4gICAgY29uc3QgdmVydGV4QnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKClcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdmVydGV4QnVmZmVyKVxuICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0ZXhzLCBnbC5TVEFUSUNfRFJBVylcblxuICAgIGNvbnN0IEZTSVpFID0gdmVydGV4cy5CWVRFU19QRVJfRUxFTUVOVFxuXG4gICAgLy8gYVBvc2l0aW9uXG4gICAgY29uc3QgYVBvc2l0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oZ2wucHJvZ3JhbSwgJ2FfUG9zaXRpb24nKVxuICAgIGlmIChhUG9zaXRpb24gPCAwKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGdldCB0aGUgc3RvcmFnZSBsb2NhdGlvbiBvZiBhX1Bvc2l0aW9uJylcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGFQb3NpdGlvbiwgMiwgZ2wuRkxPQVQsIGZhbHNlLCBGU0laRSAqIDQsIDApXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYVBvc2l0aW9uKVxuXG4gICAgLy8gYVRleENvb3JkXG4gICAgY29uc3QgYVRleENvb3JkID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oZ2wucHJvZ3JhbSwgJ2FfVGV4Q29vcmQnKVxuICAgIGlmIChhVGV4Q29vcmQgPCAwKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGdldCB0aGUgc3RvcmFnZSBsb2NhdGlvbiBvZiBhX1RleENvb3JkJylcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGFUZXhDb29yZCwgMiwgZ2wuRkxPQVQsIGZhbHNlLCBGU0laRSAqIDQsIEZTSVpFICogMilcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhVGV4Q29vcmQpXG4gICAgcmV0dXJuIDRcbiAgfVxuICBpbml0VGV4dHVyZXMgPSAoZ2wsIG4pID0+IHtcbiAgICBjb25zdCB0ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpXG5cbiAgICAvLyB1X1NhbXBsZXJcbiAgICBjb25zdCB1U2FtcGxlciA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihnbC5wcm9ncmFtLCAndV9TYW1wbGVyJylcbiAgICBpZiAoIXVTYW1wbGVyKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGdldCB0aGUgc3RvcmFnZSBsb2NhdGlvbiBvZiB1X1NhbXBsZXInKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIHRoaXMubG9hZFRleHR1cmUoZ2wsIG4sIHRleHR1cmUsIHVTYW1wbGVyLCBpbWFnZSlcbiAgICB9XG4gICAgaW1hZ2Uuc3JjID0gc2t5XG4gIH1cbiAgbG9hZFRleHR1cmUgPSAoZ2wsIG4sIHRleHR1cmUsIHVTYW1wbGVyLCBpbWFnZSkgPT4ge1xuICAgIGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19GTElQX1lfV0VCR0wsIDEpXG4gICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMClcbiAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXh0dXJlKVxuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpXG4gICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0IsIGdsLlJHQiwgZ2wuVU5TSUdORURfQllURSwgaW1hZ2UpXG4gICAgZ2wudW5pZm9ybTFpKHVTYW1wbGVyLCAwKVxuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpXG4gICAgZ2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9TVFJJUCwgMCwgbilcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcyOHB4JywgbWFyZ2luOiAnNDBweCAwJyB9fT57J+Wbm+i+ueW9oue6ueeQhid9PC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIj5cbiAgICAgICAgICAgIHsndGhlIGJyb3dlciBkb25gdCBzdXBwb3J0IGNhbnZhcywgcGxlYXNlIGNoYW5nZSBhbm90aGVyIGJyb3dlcid9XG4gICAgICAgICAgPC9jYW52YXM+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGV4dHVyZVF1YWRcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2FudmFzL3dlYmdsL2NvbG9yZWRBbmRUZXh0dXJlL2NvbXBvbmVudHMvVGV4dHVyZVF1YWQvVGV4dHVyZVF1YWQuanN4XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiMmIxMWVmZDY5YTA3MDY2MDllMzVkZDBmMWY0NmVhYmEuanBnXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC9jb2xvcmVkQW5kVGV4dHVyZS9pbWFnZXMvc2t5LmpwZ1xuICoqIG1vZHVsZSBpZCA9IDMzMVxuICoqIG1vZHVsZSBjaHVua3MgPSA5XG4gKiovIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcblxuaW1wb3J0IHsgaW5pdFNoYWRlcnMgfSBmcm9tICdXZUJHTFV0aWxzJ1xuXG5pbXBvcnQgc2t5IGZyb20gJy4uLy4uL2ltYWdlcy9za3kuanBnJ1xuaW1wb3J0IGNpcmNsZSBmcm9tICcuLi8uLi9pbWFnZXMvY2lyY2xlLmdpZidcblxuY2xhc3MgTXVsdGlUZXh0dXJlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLlZTSEFERVJfU09VUkNFID0gYFxuICAgICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gICAgICBhdHRyaWJ1dGUgdmVjNCBhX1Bvc2l0aW9uO1xuICAgICAgYXR0cmlidXRlIHZlYzIgYV9UZXhDb29yZDtcbiAgICAgIHZhcnlpbmcgdmVjMiB2X1RleENvb3JkO1xuICAgICAgdm9pZCBtYWluKCl7XG4gICAgICAgICAgZ2xfUG9zaXRpb24gPSBhX1Bvc2l0aW9uO1xuICAgICAgICAgIHZfVGV4Q29vcmQgPSBhX1RleENvb3JkO1xuICAgICAgfVxuICAgIGBcblxuICAgIHRoaXMuRlNIQURFUl9TT1VSQ0UgPSBgXG4gICAgICBwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcbiAgICAgIHVuaWZvcm0gc2FtcGxlcjJEIHVfU2FtcGxlcjA7XG4gICAgICB1bmlmb3JtIHNhbXBsZXIyRCB1X1NhbXBsZXIxO1xuICAgICAgdmFyeWluZyB2ZWMyIHZfVGV4Q29vcmQ7XG4gICAgICB2b2lkIG1haW4oKXtcbiAgICAgICAgICB2ZWM0IGNvbG9yMCA9IHRleHR1cmUyRCh1X1NhbXBsZXIwLCB2X1RleENvb3JkKTtcbiAgICAgICAgICB2ZWM0IGNvbG9yMSA9IHRleHR1cmUyRCh1X1NhbXBsZXIxLCB2X1RleENvb3JkKTtcbiAgICAgICAgICBnbF9GcmFnQ29sb3IgPSBjb2xvcjAqY29sb3IxO1xuICAgICAgfVxuICAgIGBcbiAgfVxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY2FudmFzID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLmNhbnZhcylcbiAgICAgIGNvbnN0IGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJylcbiAgICAgIGlmICghZ2wpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBnZXQgdGhlIHJlbmRlcmluZyBjb250ZXh0IGZvciBXZWJHTCcpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoIWluaXRTaGFkZXJzKGdsLCB0aGlzLlZTSEFERVJfU09VUkNFLCB0aGlzLkZTSEFERVJfU09VUkNFKSkge1xuICAgICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGludGlhbGl6ZSBzaGFkZXJzJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG4gPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXJzKGdsKVxuXG4gICAgICBnbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMClcblxuICAgICAgdGhpcy5pbml0VGV4dHVyZXMoZ2wsIG4pXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9XG4gIH1cbiAgaW5pdFZlcnRleEJ1ZmZlcnMgPSAoZ2wpID0+IHtcbiAgICBjb25zdCB2ZXJ0ZXhzID0gbmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAtMC41LCAwLjUsIDAuMCwgMS4wLFxuICAgICAgLTAuNSwgLTAuNSwgMC4wLCAwLjAsXG4gICAgICAwLjUsIDAuNSwgMS4wLCAxLjAsXG4gICAgICAwLjUsIC0wLjUsIDEuMCwgMC4wLFxuICAgIF0pXG5cbiAgICBjb25zdCB2ZXJ0ZXhCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKVxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0ZXhCdWZmZXIpXG4gICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIHZlcnRleHMsIGdsLlNUQVRJQ19EUkFXKVxuXG4gICAgY29uc3QgRlNJWkUgPSB2ZXJ0ZXhzLkJZVEVTX1BFUl9FTEVNRU5UXG5cbiAgICAvLyBhUG9zaXRpb25cbiAgICBjb25zdCBhUG9zaXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihnbC5wcm9ncmFtLCAnYV9Qb3NpdGlvbicpXG4gICAgaWYgKGFQb3NpdGlvbiA8IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gZ2V0IHRoZSBzdG9yYWdlIGxvY2F0aW9uIG9mIGFfUG9zaXRpb24nKVxuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYVBvc2l0aW9uLCAyLCBnbC5GTE9BVCwgZmFsc2UsIEZTSVpFICogNCwgMClcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhUG9zaXRpb24pXG5cbiAgICAvLyBhX1RleENvb3JkXG4gICAgY29uc3QgYVRleENvb3JkID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oZ2wucHJvZ3JhbSwgJ2FfVGV4Q29vcmQnKVxuICAgIGlmIChhVGV4Q29vcmQgPCAwKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGdldCB0aGUgc3RvcmFnZSBsb2NhdGlvbiBvZiBhX1RleENvb3JkJylcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGFUZXhDb29yZCwgMiwgZ2wuRkxPQVQsIGZhbHNlLCBGU0laRSAqIDQsIEZTSVpFICogMilcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhVGV4Q29vcmQpXG4gICAgcmV0dXJuIDRcbiAgfVxuICBpbml0VGV4dHVyZXMgPSAoZ2wsIG4pID0+IHtcbiAgICBjb25zdCB0ZXh0dXJlMCA9IGdsLmNyZWF0ZVRleHR1cmUoKVxuICAgIGNvbnN0IHRleHR1cmUxID0gZ2wuY3JlYXRlVGV4dHVyZSgpXG5cbiAgICAvLyB1X1NhbXBsZXJcbiAgICBjb25zdCB1U2FtcGxlcjAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oZ2wucHJvZ3JhbSwgJ3VfU2FtcGxlcjAnKVxuICAgIGlmICghdVNhbXBsZXIwKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGdldCB0aGUgc3RvcmFnZSBsb2NhdGlvbiBvZiB1X1NhbXBsZXIwJylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCB1U2FtcGxlcjEgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oZ2wucHJvZ3JhbSwgJ3VfU2FtcGxlcjEnKVxuICAgIGlmICghdVNhbXBsZXIxKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGdldCB0aGUgc3RvcmFnZSBsb2NhdGlvbiBvZiB1X1NhbXBsZXIxJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGltYWdlMCA9IG5ldyBJbWFnZSgpXG4gICAgY29uc3QgaW1hZ2UxID0gbmV3IEltYWdlKClcbiAgICBpbWFnZTAub25sb2FkID0gKCkgPT4ge1xuICAgICAgdGhpcy5sb2FkVGV4dHVyZShnbCwgbiwgdGV4dHVyZTAsIHVTYW1wbGVyMCwgaW1hZ2UwLCAwKVxuICAgIH1cbiAgICBpbWFnZTEub25sb2FkID0gKCkgPT4ge1xuICAgICAgdGhpcy5sb2FkVGV4dHVyZShnbCwgbiwgdGV4dHVyZTEsIHVTYW1wbGVyMSwgaW1hZ2UxLCAxKVxuICAgIH1cbiAgICBpbWFnZTAuc3JjID0gc2t5XG4gICAgaW1hZ2UxLnNyYyA9IGNpcmNsZVxuICB9XG4gIGxvYWRUZXh0dXJlID0gKGdsLCBuLCB0ZXh0dXJlLCB1U2FtcGxlciwgaW1hZ2UsIGluZGV4KSA9PiB7XG4gICAgZ2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgMSlcbiAgICBnbC5hY3RpdmVUZXh0dXJlKGdsW2BURVhUVVJFJHtpbmRleH1gXSlcbiAgICB0aGlzW2BURVhUVVJFJHtpbmRleH1gXSA9IHRydWVcbiAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXh0dXJlKVxuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpXG4gICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0IsIGdsLlJHQiwgZ2wuVU5TSUdORURfQllURSwgaW1hZ2UpXG4gICAgZ2wudW5pZm9ybTFpKHVTYW1wbGVyLCBpbmRleClcbiAgICBpZiAodGhpcy5URVhUVVJFMCAmJiB0aGlzLlRFWFRVUkUxKSB7XG4gICAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKVxuICAgICAgZ2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9TVFJJUCwgMCwgbilcbiAgICB9XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAnMjhweCcsIG1hcmdpbjogJzQwcHggMCcgfX0+eyflpJrnurnnkIbnurnnkIblj6DliqAnfTwvZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCI+XG4gICAgICAgICAgICB7J3RoZSBicm93ZXIgZG9uYHQgc3VwcG9ydCBjYW52YXMsIHBsZWFzZSBjaGFuZ2UgYW5vdGhlciBicm93ZXInfVxuICAgICAgICAgIDwvY2FudmFzPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE11bHRpVGV4dHVyZVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvY29sb3JlZEFuZFRleHR1cmUvY29tcG9uZW50cy9NdWx0aVRleHR1cmUvTXVsdGlUZXh0dXJlLmpzeFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImRlZjA2Njc4ZWQyMTU4NDE0ZTFiYTZmY2NkMDlmZmU4LmdpZlwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvY29sb3JlZEFuZFRleHR1cmUvaW1hZ2VzL2NpcmNsZS5naWZcbiAqKiBtb2R1bGUgaWQgPSAzMzNcbiAqKiBtb2R1bGUgY2h1bmtzID0gOVxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=