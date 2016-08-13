webpackJsonp([7],{

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

/***/ 312:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _BaseShapes = __webpack_require__(313);
	
	var _BaseShapes2 = _interopRequireDefault(_BaseShapes);
	
	var _WeBGLUtils = __webpack_require__(310);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var BaseShapes = function (_React$Component) {
	  _inherits(BaseShapes, _React$Component);
	
	  function BaseShapes(props) {
	    _classCallCheck(this, BaseShapes);
	
	    // 定点着色器程序with size
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BaseShapes).call(this, props));
	
	    _this.drawCanvas = function (canvas, VSHADER_SOURCE, vertexs) {
	      var gl = canvas.getContext('webgl');
	      if (!gl) {
	        return null;
	      }
	      if (!(0, _WeBGLUtils.initShaders)(gl, VSHADER_SOURCE, _this.FSHADER_SOURCE)) {
	        return null;
	      }
	
	      // 设置顶点位置
	      _this.initVertexBuffers(gl, vertexs);
	
	      gl.clearColor(0.0, 0.0, 0.0, 1.0);
	      gl.clear(gl.COLOR_BUFFER_BIT);
	      return gl;
	    };
	
	    _this.initVertexBuffers = function (gl, vertexs) {
	      var vertexBuffer = gl.createBuffer();
	      if (!vertexBuffer) {
	        console.log('Failed to create Buffer object');
	        return -1;
	      }
	
	      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	
	      gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW);
	
	      var aPosition = gl.getAttribLocation(gl.program, 'a_Position');
	      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
	
	      gl.enableVertexAttribArray(aPosition);
	
	      return 3;
	    };
	
	    _this.VSHADER_SOURCE1 = '\n        attribute vec4 a_Position;\n        void main(){\n            gl_Position = a_Position;\n            gl_PointSize = 10.0;\n        }\n    ';
	    // 定点着色器程序with size
	    _this.VSHADER_SOURCE2 = '\n        attribute vec4 a_Position;\n        void main(){\n            gl_Position = a_Position;\n        }\n    ';
	    // 片元着色器程序
	    _this.FSHADER_SOURCE = '\n        void main(){\n            gl_FragColor = vec4(1.0,  0.0,  0.0,  1.0);\n        }\n    ';
	    return _this;
	  }
	
	  _createClass(BaseShapes, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      // Triangle
	      var vertexs1 = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
	      var canvas1 = _reactDom2.default.findDOMNode(this.refs.canvas1);
	      var gl1 = this.drawCanvas(canvas1, this.VSHADER_SOURCE1, vertexs1);
	      gl1.drawArrays(gl1.POINTS, 0, 3);
	
	      var canvas2 = _reactDom2.default.findDOMNode(this.refs.canvas2);
	      var gl2 = this.drawCanvas(canvas2, this.VSHADER_SOURCE2, vertexs1);
	      gl2.drawArrays(gl2.LINE_LOOP, 0, 3);
	
	      var canvas3 = _reactDom2.default.findDOMNode(this.refs.canvas3);
	      var gl3 = this.drawCanvas(canvas3, this.VSHADER_SOURCE2, vertexs1);
	      gl3.drawArrays(gl3.TRIANGLES, 0, 3);
	
	      // Rectangle
	      var vertexs2 = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5]);
	
	      var canvas4 = _reactDom2.default.findDOMNode(this.refs.canvas4);
	      var gl4 = this.drawCanvas(canvas4, this.VSHADER_SOURCE2, vertexs2);
	      gl4.drawArrays(gl4.TRIANGLE_STRIP, 0, 4);
	
	      var canvas5 = _reactDom2.default.findDOMNode(this.refs.canvas5);
	      var gl5 = this.drawCanvas(canvas5, this.VSHADER_SOURCE2, vertexs2);
	      gl5.drawArrays(gl5.TRIANGLE_FAN, 0, 4);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'canvas',
	          { ref: 'canvas1', className: _BaseShapes2.default.canvas },
	          'the brower don`t support canvas, please change another brower'
	        ),
	        _react2.default.createElement(
	          'canvas',
	          { ref: 'canvas2', className: _BaseShapes2.default.canvas },
	          'the brower don`t support canvas, please change another brower'
	        ),
	        _react2.default.createElement(
	          'canvas',
	          { ref: 'canvas3', className: _BaseShapes2.default.canvas },
	          'the brower don`t support canvas, please change another brower'
	        ),
	        _react2.default.createElement(
	          'canvas',
	          { ref: 'canvas4', className: _BaseShapes2.default.canvas },
	          'the brower don`t support canvas, please change another brower'
	        ),
	        _react2.default.createElement(
	          'canvas',
	          { ref: 'canvas5', className: _BaseShapes2.default.canvas },
	          'the brower don`t support canvas, please change another brower'
	        )
	      );
	    }
	  }]);
	
	  return BaseShapes;
	}(_react2.default.Component);
	
	module.exports = BaseShapes;

/***/ },

/***/ 313:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(314);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./BaseShapes.scss", function() {
				var newContent = require("!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./BaseShapes.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 314:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".BaseShapes__canvas___O-JVn {\n  display: block;\n  margin: 50px 5%;\n  float: left;\n  width: 40%;\n  height: 40%; }\n", ""]);
	
	// exports
	exports.locals = {
		"canvas": "BaseShapes__canvas___O-JVn"
	};

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzP2RhMDQqKioqKioiLCJ3ZWJwYWNrOi8vLy4vfi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzP2I5ODAqKioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi93ZWJnbC91dGlscy5qcz81ZDA3KiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvYmFzZVNoYXBlcy9CYXNlU2hhcGVzLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvYmFzZVNoYXBlcy9CYXNlU2hhcGVzLnNjc3M/ZTI5MiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvYmFzZVNoYXBlcy9CYXNlU2hhcGVzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQSx5Q0FBd0MsZ0JBQWdCO0FBQ3hELEtBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBWSxvQkFBb0I7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0EsR0FBRTtBQUNG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QUFBQTtBQUFBLGFBQVEsS0FBSSxTQUFaLEVBQXNCLFdBQVcscUJBQU8sTUFBeEM7QUFDRztBQURIO0FBYkYsUUFERjtBQW1CRDs7OztHQTdHc0IsZ0JBQU0sUzs7QUFnSC9CLFFBQU8sT0FBUCxHQUFpQixVQUFqQixDOzs7Ozs7O0FDdkhBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQXFHO0FBQ3JHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsaUNBQWdDLFVBQVUsRUFBRTtBQUM1QyxFOzs7Ozs7O0FDcEJBO0FBQ0E7OztBQUdBO0FBQ0Esd0RBQXVELG1CQUFtQixvQkFBb0IsZ0JBQWdCLGVBQWUsZ0JBQWdCLEVBQUU7O0FBRS9JO0FBQ0E7QUFDQTtBQUNBLEciLCJmaWxlIjoianMvNy0wYzE3NzA0MGM0NWQyNWI5MTdiMy5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXHJcbiovXHJcbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGxpc3QgPSBbXTtcclxuXHJcblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xyXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcclxuXHRcdHZhciByZXN1bHQgPSBbXTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gdGhpc1tpXTtcclxuXHRcdFx0aWYoaXRlbVsyXSkge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgaXRlbVsxXSArIFwifVwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChpdGVtWzFdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdC5qb2luKFwiXCIpO1xyXG5cdH07XHJcblxyXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XHJcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xyXG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXHJcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcclxuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xyXG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXHJcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XHJcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcclxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcclxuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cclxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcclxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcclxuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcclxuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cdHJldHVybiBsaXN0O1xyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuICoqIG1vZHVsZSBpZCA9IDI1MlxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDUgNiA3IDggOSAxOCAxOSAyMCAyMyAyNCAyNSAyNiAyNyAyOCAyOSAzMCAzMSAzMlxuICoqLyIsIi8qXHJcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXHJcbiovXHJcbnZhciBzdHlsZXNJbkRvbSA9IHt9LFxyXG5cdG1lbW9pemUgPSBmdW5jdGlvbihmbikge1xyXG5cdFx0dmFyIG1lbW87XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0XHRyZXR1cm4gbWVtbztcclxuXHRcdH07XHJcblx0fSxcclxuXHRpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAvbXNpZSBbNi05XVxcYi8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcclxuXHR9KSxcclxuXHRnZXRIZWFkRWxlbWVudCA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xyXG5cdH0pLFxyXG5cdHNpbmdsZXRvbkVsZW1lbnQgPSBudWxsLFxyXG5cdHNpbmdsZXRvbkNvdW50ZXIgPSAwLFxyXG5cdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wID0gW107XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcclxuXHRpZih0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcclxuXHRcdGlmKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xyXG5cdH1cclxuXHJcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XHJcblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xyXG5cclxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgPGhlYWQ+LlxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XHJcblxyXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCk7XHJcblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XHJcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xyXG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcclxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xyXG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XHJcblx0XHR9XHJcblx0XHRpZihuZXdMaXN0KSB7XHJcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCk7XHJcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XHJcblx0XHR9XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcclxuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xyXG5cdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKylcclxuXHRcdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKCk7XHJcblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucykge1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xyXG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XHJcblx0XHRpZihkb21TdHlsZSkge1xyXG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XHJcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzKGxpc3QpIHtcclxuXHR2YXIgc3R5bGVzID0gW107XHJcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XHJcblx0XHR2YXIgaWQgPSBpdGVtWzBdO1xyXG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XHJcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xyXG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XHJcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XHJcblx0XHRpZighbmV3U3R5bGVzW2lkXSlcclxuXHRcdFx0c3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcclxuXHRcdGVsc2VcclxuXHRcdFx0bmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xyXG5cdH1cclxuXHRyZXR1cm4gc3R5bGVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KSB7XHJcblx0dmFyIGhlYWQgPSBnZXRIZWFkRWxlbWVudCgpO1xyXG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wW3N0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xyXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XHJcblx0XHRpZighbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcclxuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBoZWFkLmZpcnN0Q2hpbGQpO1xyXG5cdFx0fSBlbHNlIGlmKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XHJcblx0XHRcdGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AucHVzaChzdHlsZUVsZW1lbnQpO1xyXG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xyXG5cdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XHJcblx0c3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHR2YXIgaWR4ID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZUVsZW1lbnQpO1xyXG5cdGlmKGlkeCA+PSAwKSB7XHJcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSB7XHJcblx0dmFyIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcclxuXHRzdHlsZUVsZW1lbnQudHlwZSA9IFwidGV4dC9jc3NcIjtcclxuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KTtcclxuXHRyZXR1cm4gc3R5bGVFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKSB7XHJcblx0dmFyIGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XHJcblx0bGlua0VsZW1lbnQucmVsID0gXCJzdHlsZXNoZWV0XCI7XHJcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmtFbGVtZW50KTtcclxuXHRyZXR1cm4gbGlua0VsZW1lbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFN0eWxlKG9iaiwgb3B0aW9ucykge1xyXG5cdHZhciBzdHlsZUVsZW1lbnQsIHVwZGF0ZSwgcmVtb3ZlO1xyXG5cclxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcclxuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gc2luZ2xldG9uRWxlbWVudCB8fCAoc2luZ2xldG9uRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XHJcblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCBmYWxzZSk7XHJcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCB0cnVlKTtcclxuXHR9IGVsc2UgaWYob2JqLnNvdXJjZU1hcCAmJlxyXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcclxuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xyXG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0XHRpZihzdHlsZUVsZW1lbnQuaHJlZilcclxuXHRcdFx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlRWxlbWVudC5ocmVmKTtcclxuXHRcdH07XHJcblx0fSBlbHNlIHtcclxuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcclxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xyXG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShvYmopO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUobmV3T2JqKSB7XHJcblx0XHRpZihuZXdPYmopIHtcclxuXHRcdFx0aWYobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZW1vdmUoKTtcclxuXHRcdH1cclxuXHR9O1xyXG59XHJcblxyXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xyXG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcclxuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcclxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xyXG5cdH07XHJcbn0pKCk7XHJcblxyXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnKHN0eWxlRWxlbWVudCwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xyXG5cclxuXHRpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xyXG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZUVsZW1lbnQuY2hpbGROb2RlcztcclxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChjc3NOb2RlKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGVFbGVtZW50LCBvYmopIHtcclxuXHR2YXIgY3NzID0gb2JqLmNzcztcclxuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XHJcblxyXG5cdGlmKG1lZGlhKSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXHJcblx0fVxyXG5cclxuXHRpZihzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcclxuXHR9IGVsc2Uge1xyXG5cdFx0d2hpbGUoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcclxuXHRcdH1cclxuXHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxpbmsobGlua0VsZW1lbnQsIG9iaikge1xyXG5cdHZhciBjc3MgPSBvYmouY3NzO1xyXG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xyXG5cclxuXHRpZihzb3VyY2VNYXApIHtcclxuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XHJcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XHJcblx0fVxyXG5cclxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcclxuXHJcblx0dmFyIG9sZFNyYyA9IGxpbmtFbGVtZW50LmhyZWY7XHJcblxyXG5cdGxpbmtFbGVtZW50LmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xyXG5cclxuXHRpZihvbGRTcmMpXHJcblx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XHJcbn1cclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1xuICoqIG1vZHVsZSBpZCA9IDI1M1xuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDUgNiA3IDggOSAxOCAxOSAyMCAyMyAyNCAyNSAyNiAyNyAyOCAyOSAzMCAzMSAzMlxuICoqLyIsIi8qKlxuICogQ3JlYXRlIGEgcHJvZ3JhbSBvYmplY3QgYW5kIG1ha2UgY3VycmVudFxuICogQHBhcmFtIGdsIEdMIGNvbnRleHRcbiAqIEBwYXJhbSB2c2hhZGVyIGEgdmVydGV4IHNoYWRlciBwcm9ncmFtIChzdHJpbmcpXG4gKiBAcGFyYW0gZnNoYWRlciBhIGZyYWdtZW50IHNoYWRlciBwcm9ncmFtIChzdHJpbmcpXG4gKiBAcmV0dXJuIHRydWUsIGlmIHRoZSBwcm9ncmFtIG9iamVjdCB3YXMgY3JlYXRlZCBhbmQgc3VjY2Vzc2Z1bGx5IG1hZGUgY3VycmVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdFNoYWRlcnMoZ2wsIHZzaGFkZXIsIGZzaGFkZXIpIHtcbiAgdmFyIHByb2dyYW0gPSBjcmVhdGVQcm9ncmFtKGdsLCB2c2hhZGVyLCBmc2hhZGVyKTtcbiAgaWYgKCFwcm9ncmFtKSB7XG4gICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBjcmVhdGUgcHJvZ3JhbScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XG4gIGdsLnByb2dyYW0gPSBwcm9ncmFtO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIENyZWF0ZSB0aGUgbGlua2VkIHByb2dyYW0gb2JqZWN0XG4gKiBAcGFyYW0gZ2wgR0wgY29udGV4dFxuICogQHBhcmFtIHZzaGFkZXIgYSB2ZXJ0ZXggc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEBwYXJhbSBmc2hhZGVyIGEgZnJhZ21lbnQgc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEByZXR1cm4gY3JlYXRlZCBwcm9ncmFtIG9iamVjdCwgb3IgbnVsbCBpZiB0aGUgY3JlYXRpb24gaGFzIGZhaWxlZFxuICovXG5mdW5jdGlvbiBjcmVhdGVQcm9ncmFtKGdsLCB2c2hhZGVyLCBmc2hhZGVyKSB7XG4gIC8vIENyZWF0ZSBzaGFkZXIgb2JqZWN0XG4gIHZhciB2ZXJ0ZXhTaGFkZXIgPSBsb2FkU2hhZGVyKGdsLCBnbC5WRVJURVhfU0hBREVSLCB2c2hhZGVyKTtcbiAgdmFyIGZyYWdtZW50U2hhZGVyID0gbG9hZFNoYWRlcihnbCwgZ2wuRlJBR01FTlRfU0hBREVSLCBmc2hhZGVyKTtcbiAgaWYgKCF2ZXJ0ZXhTaGFkZXIgfHwgIWZyYWdtZW50U2hhZGVyKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBDcmVhdGUgYSBwcm9ncmFtIG9iamVjdFxuICB2YXIgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcbiAgaWYgKCFwcm9ncmFtKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBBdHRhY2ggdGhlIHNoYWRlciBvYmplY3RzXG4gIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpO1xuICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xuXG4gIC8vIExpbmsgdGhlIHByb2dyYW0gb2JqZWN0XG4gIGdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xuXG4gIC8vIENoZWNrIHRoZSByZXN1bHQgb2YgbGlua2luZ1xuICB2YXIgbGlua2VkID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5MSU5LX1NUQVRVUyk7XG4gIGlmICghbGlua2VkKSB7XG4gICAgdmFyIGVycm9yID0gZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSk7XG4gICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBsaW5rIHByb2dyYW06ICcgKyBlcnJvcik7XG4gICAgZ2wuZGVsZXRlUHJvZ3JhbShwcm9ncmFtKTtcbiAgICBnbC5kZWxldGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpO1xuICAgIGdsLmRlbGV0ZVNoYWRlcih2ZXJ0ZXhTaGFkZXIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBwcm9ncmFtO1xufVxuXG5cbi8qKlxuICogQ3JlYXRlIGEgc2hhZGVyIG9iamVjdFxuICogQHBhcmFtIGdsIEdMIGNvbnRleHRcbiAqIEBwYXJhbSB0eXBlIHRoZSB0eXBlIG9mIHRoZSBzaGFkZXIgb2JqZWN0IHRvIGJlIGNyZWF0ZWRcbiAqIEBwYXJhbSBzb3VyY2Ugc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEByZXR1cm4gY3JlYXRlZCBzaGFkZXIgb2JqZWN0LCBvciBudWxsIGlmIHRoZSBjcmVhdGlvbiBoYXMgZmFpbGVkLlxuICovXG5mdW5jdGlvbiBsb2FkU2hhZGVyKGdsLCB0eXBlLCBzb3VyY2UpIHtcbiAgLy8gQ3JlYXRlIHNoYWRlciBvYmplY3RcbiAgdmFyIHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcbiAgaWYgKHNoYWRlciA9PSBudWxsKSB7XG4gICAgY29uc29sZS5sb2coJ3VuYWJsZSB0byBjcmVhdGUgc2hhZGVyJyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBTZXQgdGhlIHNoYWRlciBwcm9ncmFtXG4gIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XG5cbiAgLy8gQ29tcGlsZSB0aGUgc2hhZGVyXG4gIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcblxuICAvLyBDaGVjayB0aGUgcmVzdWx0IG9mIGNvbXBpbGF0aW9uXG4gIHZhciBjb21waWxlZCA9IGdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKTtcbiAgaWYgKCFjb21waWxlZCkge1xuICAgIHZhciBlcnJvciA9IGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKTtcbiAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGNvbXBpbGUgc2hhZGVyOiAnICsgZXJyb3IpO1xuICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHNoYWRlcjtcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xpYi93ZWJnbC91dGlscy5qc1xuICoqLyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5cbmltcG9ydCBzdHlsZXMgZnJvbSAnLi9CYXNlU2hhcGVzLnNjc3MnXG5cbmltcG9ydCB7IGluaXRTaGFkZXJzIH0gZnJvbSAnV2VCR0xVdGlscydcblxuY2xhc3MgQmFzZVNoYXBlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgLy8g5a6a54K5552A6Imy5Zmo56iL5bqPd2l0aCBzaXplXG4gICAgdGhpcy5WU0hBREVSX1NPVVJDRTEgPSBgXG4gICAgICAgIGF0dHJpYnV0ZSB2ZWM0IGFfUG9zaXRpb247XG4gICAgICAgIHZvaWQgbWFpbigpe1xuICAgICAgICAgICAgZ2xfUG9zaXRpb24gPSBhX1Bvc2l0aW9uO1xuICAgICAgICAgICAgZ2xfUG9pbnRTaXplID0gMTAuMDtcbiAgICAgICAgfVxuICAgIGBcbiAgICAvLyDlrprngrnnnYDoibLlmajnqIvluo93aXRoIHNpemVcbiAgICB0aGlzLlZTSEFERVJfU09VUkNFMiA9IGBcbiAgICAgICAgYXR0cmlidXRlIHZlYzQgYV9Qb3NpdGlvbjtcbiAgICAgICAgdm9pZCBtYWluKCl7XG4gICAgICAgICAgICBnbF9Qb3NpdGlvbiA9IGFfUG9zaXRpb247XG4gICAgICAgIH1cbiAgICBgXG4gICAgLy8g54mH5YWD552A6Imy5Zmo56iL5bqPXG4gICAgdGhpcy5GU0hBREVSX1NPVVJDRSA9IGBcbiAgICAgICAgdm9pZCBtYWluKCl7XG4gICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDEuMCwgIDAuMCwgIDAuMCwgIDEuMCk7XG4gICAgICAgIH1cbiAgICBgXG4gIH1cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gVHJpYW5nbGVcbiAgICBjb25zdCB2ZXJ0ZXhzMSA9IG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgMC4wLCAwLjUsIC0wLjUsIC0wLjUsIDAuNSwgLTAuNSxcbiAgICBdKVxuICAgIGNvbnN0IGNhbnZhczEgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMuY2FudmFzMSlcbiAgICBjb25zdCBnbDEgPSB0aGlzLmRyYXdDYW52YXMoY2FudmFzMSwgdGhpcy5WU0hBREVSX1NPVVJDRTEsIHZlcnRleHMxKVxuICAgIGdsMS5kcmF3QXJyYXlzKGdsMS5QT0lOVFMsIDAsIDMpXG5cbiAgICBjb25zdCBjYW52YXMyID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLmNhbnZhczIpXG4gICAgY29uc3QgZ2wyID0gdGhpcy5kcmF3Q2FudmFzKGNhbnZhczIsIHRoaXMuVlNIQURFUl9TT1VSQ0UyLCB2ZXJ0ZXhzMSlcbiAgICBnbDIuZHJhd0FycmF5cyhnbDIuTElORV9MT09QLCAwLCAzKVxuXG4gICAgY29uc3QgY2FudmFzMyA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmcy5jYW52YXMzKVxuICAgIGNvbnN0IGdsMyA9IHRoaXMuZHJhd0NhbnZhcyhjYW52YXMzLCB0aGlzLlZTSEFERVJfU09VUkNFMiwgdmVydGV4czEpXG4gICAgZ2wzLmRyYXdBcnJheXMoZ2wzLlRSSUFOR0xFUywgMCwgMylcblxuICAgIC8vIFJlY3RhbmdsZVxuICAgIGNvbnN0IHZlcnRleHMyID0gbmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAtMC41LCAwLjUsIC0wLjUsIC0wLjUsIDAuNSwgMC41LCAwLjUsIC0wLjUsXG4gICAgXSlcblxuICAgIGNvbnN0IGNhbnZhczQgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMuY2FudmFzNClcbiAgICBjb25zdCBnbDQgPSB0aGlzLmRyYXdDYW52YXMoY2FudmFzNCwgdGhpcy5WU0hBREVSX1NPVVJDRTIsIHZlcnRleHMyKVxuICAgIGdsNC5kcmF3QXJyYXlzKGdsNC5UUklBTkdMRV9TVFJJUCwgMCwgNClcblxuICAgIGNvbnN0IGNhbnZhczUgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMuY2FudmFzNSlcbiAgICBjb25zdCBnbDUgPSB0aGlzLmRyYXdDYW52YXMoY2FudmFzNSwgdGhpcy5WU0hBREVSX1NPVVJDRTIsIHZlcnRleHMyKVxuICAgIGdsNS5kcmF3QXJyYXlzKGdsNS5UUklBTkdMRV9GQU4sIDAsIDQpXG4gIH1cbiAgZHJhd0NhbnZhcz0oY2FudmFzLCBWU0hBREVSX1NPVVJDRSwgdmVydGV4cykgPT4ge1xuICAgIGNvbnN0IGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJylcbiAgICBpZiAoIWdsKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICBpZiAoIWluaXRTaGFkZXJzKGdsLCBWU0hBREVSX1NPVVJDRSwgdGhpcy5GU0hBREVSX1NPVVJDRSkpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgLy8g6K6+572u6aG254K55L2N572uXG4gICAgdGhpcy5pbml0VmVydGV4QnVmZmVycyhnbCwgdmVydGV4cylcblxuICAgIGdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKVxuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpXG4gICAgcmV0dXJuIGdsXG4gIH1cbiAgaW5pdFZlcnRleEJ1ZmZlcnMgPSAoZ2wsIHZlcnRleHMpID0+IHtcbiAgICBjb25zdCB2ZXJ0ZXhCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKVxuICAgIGlmICghdmVydGV4QnVmZmVyKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGNyZWF0ZSBCdWZmZXIgb2JqZWN0JylcbiAgICAgIHJldHVybiAtMVxuICAgIH1cblxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0ZXhCdWZmZXIpXG5cbiAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgdmVydGV4cywgZ2wuU1RBVElDX0RSQVcpXG5cbiAgICBjb25zdCBhUG9zaXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihnbC5wcm9ncmFtLCAnYV9Qb3NpdGlvbicpXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihhUG9zaXRpb24sIDIsIGdsLkZMT0FULCBmYWxzZSwgMCwgMClcblxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGFQb3NpdGlvbilcblxuICAgIHJldHVybiAzXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8Y2FudmFzIHJlZj1cImNhbnZhczFcIiBjbGFzc05hbWU9e3N0eWxlcy5jYW52YXN9PlxuICAgICAgICAgIHsndGhlIGJyb3dlciBkb25gdCBzdXBwb3J0IGNhbnZhcywgcGxlYXNlIGNoYW5nZSBhbm90aGVyIGJyb3dlcid9XG4gICAgICAgIDwvY2FudmFzPlxuICAgICAgICA8Y2FudmFzIHJlZj1cImNhbnZhczJcIiBjbGFzc05hbWU9e3N0eWxlcy5jYW52YXN9PlxuICAgICAgICAgIHsndGhlIGJyb3dlciBkb25gdCBzdXBwb3J0IGNhbnZhcywgcGxlYXNlIGNoYW5nZSBhbm90aGVyIGJyb3dlcid9XG4gICAgICAgIDwvY2FudmFzPlxuICAgICAgICA8Y2FudmFzIHJlZj1cImNhbnZhczNcIiBjbGFzc05hbWU9e3N0eWxlcy5jYW52YXN9PlxuICAgICAgICAgIHsndGhlIGJyb3dlciBkb25gdCBzdXBwb3J0IGNhbnZhcywgcGxlYXNlIGNoYW5nZSBhbm90aGVyIGJyb3dlcid9XG4gICAgICAgIDwvY2FudmFzPlxuICAgICAgICA8Y2FudmFzIHJlZj1cImNhbnZhczRcIiBjbGFzc05hbWU9e3N0eWxlcy5jYW52YXN9PlxuICAgICAgICAgIHsndGhlIGJyb3dlciBkb25gdCBzdXBwb3J0IGNhbnZhcywgcGxlYXNlIGNoYW5nZSBhbm90aGVyIGJyb3dlcid9XG4gICAgICAgIDwvY2FudmFzPlxuICAgICAgICA8Y2FudmFzIHJlZj1cImNhbnZhczVcIiBjbGFzc05hbWU9e3N0eWxlcy5jYW52YXN9PlxuICAgICAgICAgIHsndGhlIGJyb3dlciBkb25gdCBzdXBwb3J0IGNhbnZhcywgcGxlYXNlIGNoYW5nZSBhbm90aGVyIGJyb3dlcid9XG4gICAgICAgIDwvY2FudmFzPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZVNoYXBlc1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvYmFzZVNoYXBlcy9CYXNlU2hhcGVzLmpzeFxuICoqLyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL0Jhc2VTaGFwZXMuc2Nzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vQmFzZVNoYXBlcy5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL0Jhc2VTaGFwZXMuc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC9iYXNlU2hhcGVzL0Jhc2VTaGFwZXMuc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDMxM1xuICoqIG1vZHVsZSBjaHVua3MgPSA3XG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuQmFzZVNoYXBlc19fY2FudmFzX19fTy1KVm4ge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBtYXJnaW46IDUwcHggNSU7XFxuICBmbG9hdDogbGVmdDtcXG4gIHdpZHRoOiA0MCU7XFxuICBoZWlnaHQ6IDQwJTsgfVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcbmV4cG9ydHMubG9jYWxzID0ge1xuXHRcImNhbnZhc1wiOiBcIkJhc2VTaGFwZXNfX2NhbnZhc19fX08tSlZuXCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlcj9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi9+L3Bvc3Rjc3MtbG9hZGVyIS4vfi9zYXNzLWxvYWRlciEuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC9iYXNlU2hhcGVzL0Jhc2VTaGFwZXMuc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDMxNFxuICoqIG1vZHVsZSBjaHVua3MgPSA3XG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==