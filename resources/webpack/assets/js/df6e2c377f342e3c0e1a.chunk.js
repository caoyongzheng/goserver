webpackJsonp([7],{

/***/ 323:
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.initShaders = initShaders;\n/**\n * Create a program object and make current\n * @param gl GL context\n * @param vshader a vertex shader program (string)\n * @param fshader a fragment shader program (string)\n * @return true, if the program object was created and successfully made current\n */\nfunction initShaders(gl, vshader, fshader) {\n  var program = createProgram(gl, vshader, fshader);\n  if (!program) {\n    console.log('Failed to create program');\n    return false;\n  }\n\n  gl.useProgram(program);\n  gl.program = program;\n\n  return true;\n}\n\n/**\n * Create the linked program object\n * @param gl GL context\n * @param vshader a vertex shader program (string)\n * @param fshader a fragment shader program (string)\n * @return created program object, or null if the creation has failed\n */\nfunction createProgram(gl, vshader, fshader) {\n  // Create shader object\n  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);\n  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);\n  if (!vertexShader || !fragmentShader) {\n    return null;\n  }\n\n  // Create a program object\n  var program = gl.createProgram();\n  if (!program) {\n    return null;\n  }\n\n  // Attach the shader objects\n  gl.attachShader(program, vertexShader);\n  gl.attachShader(program, fragmentShader);\n\n  // Link the program object\n  gl.linkProgram(program);\n\n  // Check the result of linking\n  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);\n  if (!linked) {\n    var error = gl.getProgramInfoLog(program);\n    console.log('Failed to link program: ' + error);\n    gl.deleteProgram(program);\n    gl.deleteShader(fragmentShader);\n    gl.deleteShader(vertexShader);\n    return null;\n  }\n  return program;\n}\n\n/**\n * Create a shader object\n * @param gl GL context\n * @param type the type of the shader object to be created\n * @param source shader program (string)\n * @return created shader object, or null if the creation has failed.\n */\nfunction loadShader(gl, type, source) {\n  // Create shader object\n  var shader = gl.createShader(type);\n  if (shader == null) {\n    console.log('unable to create shader');\n    return null;\n  }\n\n  // Set the shader program\n  gl.shaderSource(shader, source);\n\n  // Compile the shader\n  gl.compileShader(shader);\n\n  // Check the result of compilation\n  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);\n  if (!compiled) {\n    var error = gl.getShaderInfoLog(shader);\n    console.log('Failed to compile shader: ' + error);\n    gl.deleteShader(shader);\n    return null;\n  }\n\n  return shader;\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/lib/webgl/utils.js\n ** module id = 323\n ** module chunks = 6 7 8 9 10 11 12 13 14 15 16 17\n **/\n//# sourceURL=webpack:///./src/lib/webgl/utils.js?");

/***/ },

/***/ 325:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactDom = __webpack_require__(35);\n\nvar _reactDom2 = _interopRequireDefault(_reactDom);\n\nvar _BaseShapes = __webpack_require__(326);\n\nvar _BaseShapes2 = _interopRequireDefault(_BaseShapes);\n\nvar _WeBGLUtils = __webpack_require__(323);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar BaseShapes = function (_React$Component) {\n  _inherits(BaseShapes, _React$Component);\n\n  function BaseShapes(props) {\n    _classCallCheck(this, BaseShapes);\n\n    // 定点着色器程序with size\n    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BaseShapes).call(this, props));\n\n    _this.drawCanvas = function (canvas, VSHADER_SOURCE, vertexs) {\n      var gl = canvas.getContext('webgl');\n      if (!gl) {\n        return null;\n      }\n      if (!(0, _WeBGLUtils.initShaders)(gl, VSHADER_SOURCE, _this.FSHADER_SOURCE)) {\n        return null;\n      }\n\n      // 设置顶点位置\n      _this.initVertexBuffers(gl, vertexs);\n\n      gl.clearColor(0.0, 0.0, 0.0, 1.0);\n      gl.clear(gl.COLOR_BUFFER_BIT);\n      return gl;\n    };\n\n    _this.initVertexBuffers = function (gl, vertexs) {\n      var vertexBuffer = gl.createBuffer();\n      if (!vertexBuffer) {\n        console.log('Failed to create Buffer object');\n        return -1;\n      }\n\n      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);\n\n      gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW);\n\n      var aPosition = gl.getAttribLocation(gl.program, 'a_Position');\n      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);\n\n      gl.enableVertexAttribArray(aPosition);\n\n      return 3;\n    };\n\n    _this.VSHADER_SOURCE1 = '\\n        attribute vec4 a_Position;\\n        void main(){\\n            gl_Position = a_Position;\\n            gl_PointSize = 10.0;\\n        }\\n    ';\n    // 定点着色器程序with size\n    _this.VSHADER_SOURCE2 = '\\n        attribute vec4 a_Position;\\n        void main(){\\n            gl_Position = a_Position;\\n        }\\n    ';\n    // 片元着色器程序\n    _this.FSHADER_SOURCE = '\\n        void main(){\\n            gl_FragColor = vec4(1.0,  0.0,  0.0,  1.0);\\n        }\\n    ';\n    return _this;\n  }\n\n  _createClass(BaseShapes, [{\n    key: 'componentDidMount',\n    value: function componentDidMount() {\n      // Triangle\n      var vertexs1 = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);\n      var canvas1 = _reactDom2.default.findDOMNode(this.refs.canvas1);\n      var gl1 = this.drawCanvas(canvas1, this.VSHADER_SOURCE1, vertexs1);\n      gl1.drawArrays(gl1.POINTS, 0, 3);\n\n      var canvas2 = _reactDom2.default.findDOMNode(this.refs.canvas2);\n      var gl2 = this.drawCanvas(canvas2, this.VSHADER_SOURCE2, vertexs1);\n      gl2.drawArrays(gl2.LINE_LOOP, 0, 3);\n\n      var canvas3 = _reactDom2.default.findDOMNode(this.refs.canvas3);\n      var gl3 = this.drawCanvas(canvas3, this.VSHADER_SOURCE2, vertexs1);\n      gl3.drawArrays(gl3.TRIANGLES, 0, 3);\n\n      // Rectangle\n      var vertexs2 = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5]);\n\n      var canvas4 = _reactDom2.default.findDOMNode(this.refs.canvas4);\n      var gl4 = this.drawCanvas(canvas4, this.VSHADER_SOURCE2, vertexs2);\n      gl4.drawArrays(gl4.TRIANGLE_STRIP, 0, 4);\n\n      var canvas5 = _reactDom2.default.findDOMNode(this.refs.canvas5);\n      var gl5 = this.drawCanvas(canvas5, this.VSHADER_SOURCE2, vertexs2);\n      gl5.drawArrays(gl5.TRIANGLE_FAN, 0, 4);\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      return _react2.default.createElement(\n        'div',\n        null,\n        _react2.default.createElement(\n          'canvas',\n          { ref: 'canvas1', className: _BaseShapes2.default.canvas },\n          'the brower don`t support canvas, please change another brower'\n        ),\n        _react2.default.createElement(\n          'canvas',\n          { ref: 'canvas2', className: _BaseShapes2.default.canvas },\n          'the brower don`t support canvas, please change another brower'\n        ),\n        _react2.default.createElement(\n          'canvas',\n          { ref: 'canvas3', className: _BaseShapes2.default.canvas },\n          'the brower don`t support canvas, please change another brower'\n        ),\n        _react2.default.createElement(\n          'canvas',\n          { ref: 'canvas4', className: _BaseShapes2.default.canvas },\n          'the brower don`t support canvas, please change another brower'\n        ),\n        _react2.default.createElement(\n          'canvas',\n          { ref: 'canvas5', className: _BaseShapes2.default.canvas },\n          'the brower don`t support canvas, please change another brower'\n        )\n      );\n    }\n  }]);\n\n  return BaseShapes;\n}(_react2.default.Component);\n\nmodule.exports = BaseShapes;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/demos/routes/canvas/webgl/baseShapes/BaseShapes.jsx\n ** module id = 325\n ** module chunks = 7\n **/\n//# sourceURL=webpack:///./src/entry/routes/demos/routes/canvas/webgl/baseShapes/BaseShapes.jsx?");

/***/ },

/***/ 326:
/***/ function(module, exports, __webpack_require__) {

	eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(327);\nif(typeof content === 'string') content = [[module.id, content, '']];\n// add the styles to the DOM\nvar update = __webpack_require__(261)(content, {});\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {\n\t// When the styles change, update the <style> tags\n\tif(!content.locals) {\n\t\tmodule.hot.accept(\"!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./BaseShapes.scss\", function() {\n\t\t\tvar newContent = require(\"!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./BaseShapes.scss\");\n\t\t\tif(typeof newContent === 'string') newContent = [[module.id, newContent, '']];\n\t\t\tupdate(newContent);\n\t\t});\n\t}\n\t// When the module is disposed, remove the <style> tags\n\tmodule.hot.dispose(function() { update(); });\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/demos/routes/canvas/webgl/baseShapes/BaseShapes.scss\n ** module id = 326\n ** module chunks = 7\n **/\n//# sourceURL=webpack:///./src/entry/routes/demos/routes/canvas/webgl/baseShapes/BaseShapes.scss?");

/***/ },

/***/ 327:
/***/ function(module, exports, __webpack_require__) {

	eval("exports = module.exports = __webpack_require__(260)();\n// imports\n\n\n// module\nexports.push([module.id, \".BaseShapes__canvas___O-JVn {\\n  display: block;\\n  margin: 50px 5%;\\n  float: left;\\n  width: 40%;\\n  height: 40%; }\\n\", \"\"]);\n\n// exports\nexports.locals = {\n\t\"canvas\": \"BaseShapes__canvas___O-JVn\"\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./~/postcss-loader!./~/sass-loader!./src/entry/routes/demos/routes/canvas/webgl/baseShapes/BaseShapes.scss\n ** module id = 327\n ** module chunks = 7\n **/\n//# sourceURL=webpack:///./src/entry/routes/demos/routes/canvas/webgl/baseShapes/BaseShapes.scss?./~/css-loader?modules&importLoaders=1&localIdentName=%5Bname%5D__%5Blocal%5D___%5Bhash:base64:5%5D!./~/postcss-loader!./~/sass-loader");

/***/ }

});