webpackJsonp([39],{

/***/ 275:
/***/ function(module, exports, __webpack_require__) {

	eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!\n  Copyright (c) 2016 Jed Watson.\n  Licensed under the MIT License (MIT), see\n  http://jedwatson.github.io/classnames\n*/\n/* global define */\n\n(function () {\n\t'use strict';\n\n\tvar hasOwn = {}.hasOwnProperty;\n\n\tfunction classNames () {\n\t\tvar classes = [];\n\n\t\tfor (var i = 0; i < arguments.length; i++) {\n\t\t\tvar arg = arguments[i];\n\t\t\tif (!arg) continue;\n\n\t\t\tvar argType = typeof arg;\n\n\t\t\tif (argType === 'string' || argType === 'number') {\n\t\t\t\tclasses.push(arg);\n\t\t\t} else if (Array.isArray(arg)) {\n\t\t\t\tclasses.push(classNames.apply(null, arg));\n\t\t\t} else if (argType === 'object') {\n\t\t\t\tfor (var key in arg) {\n\t\t\t\t\tif (hasOwn.call(arg, key) && arg[key]) {\n\t\t\t\t\t\tclasses.push(key);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn classes.join(' ');\n\t}\n\n\tif (typeof module !== 'undefined' && module.exports) {\n\t\tmodule.exports = classNames;\n\t} else if (true) {\n\t\t// register as 'classnames', consistent with npm package name\n\t\t!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {\n\t\t\treturn classNames;\n\t\t}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\t} else {\n\t\twindow.classNames = classNames;\n\t}\n}());\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/classnames/index.js\n ** module id = 275\n ** module chunks = 1 19 24 26 32 37 38 39 41 42\n **/\n//# sourceURL=webpack:///./~/classnames/index.js?");

/***/ },

/***/ 620:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _Button = __webpack_require__(621);\n\nvar _Button2 = _interopRequireDefault(_Button);\n\nvar _classnames = __webpack_require__(275);\n\nvar _classnames2 = _interopRequireDefault(_classnames);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar Button = function (_Component) {\n  _inherits(Button, _Component);\n\n  function Button() {\n    var _Object$getPrototypeO;\n\n    var _temp, _this, _ret;\n\n    _classCallCheck(this, Button);\n\n    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Button)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {}, _temp), _possibleConstructorReturn(_this, _ret);\n  }\n\n  _createClass(Button, [{\n    key: 'render',\n    value: function render() {\n      var _props = this.props;\n      var children = _props.children;\n\n      var others = _objectWithoutProperties(_props, ['children']);\n\n      return _react2.default.createElement(\n        'button',\n        _extends({}, others, { className: (0, _classnames2.default)(_Button2.default.button, _Button2.default.defaults) }),\n        children\n      );\n    }\n  }]);\n\n  return Button;\n}(_react.Component);\n\nexports.default = Button;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/components/button/Button.jsx\n ** module id = 620\n ** module chunks = 37 38 39 41\n **/\n//# sourceURL=webpack:///./src/components/button/Button.jsx?");

/***/ },

/***/ 621:
/***/ function(module, exports, __webpack_require__) {

	eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(622);\nif(typeof content === 'string') content = [[module.id, content, '']];\n// add the styles to the DOM\nvar update = __webpack_require__(260)(content, {});\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {\n\t// When the styles change, update the <style> tags\n\tif(!content.locals) {\n\t\tmodule.hot.accept(\"!!./../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./Button.scss\", function() {\n\t\t\tvar newContent = require(\"!!./../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./Button.scss\");\n\t\t\tif(typeof newContent === 'string') newContent = [[module.id, newContent, '']];\n\t\t\tupdate(newContent);\n\t\t});\n\t}\n\t// When the module is disposed, remove the <style> tags\n\tmodule.hot.dispose(function() { update(); });\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/components/button/Button.scss\n ** module id = 621\n ** module chunks = 37 38 39 41\n **/\n//# sourceURL=webpack:///./src/components/button/Button.scss?");

/***/ },

/***/ 622:
/***/ function(module, exports, __webpack_require__) {

	eval("exports = module.exports = __webpack_require__(259)();\n// imports\n\n\n// module\nexports.push([module.id, \".Button__button___3B9Ox {\\n  display: inline-block;\\n  padding: 6px 12px;\\n  margin-bottom: 0;\\n  font-size: 14px;\\n  font-weight: 400;\\n  line-height: 1.42857143;\\n  text-align: center;\\n  white-space: nowrap;\\n  vertical-align: middle;\\n  -ms-touch-action: manipulation;\\n      touch-action: manipulation;\\n  cursor: pointer;\\n  -webkit-user-select: none;\\n     -moz-user-select: none;\\n      -ms-user-select: none;\\n          user-select: none;\\n  background-image: none;\\n  border: 1px solid transparent;\\n  border-radius: 4px;\\n  outline: none; }\\n\\n.Button__defaults___k0czm {\\n  color: #333;\\n  background-color: #fff;\\n  border-color: #ccc; }\\n\\n.Button__defaults___k0czm:hover {\\n  color: #333;\\n  background-color: #e6e6e6;\\n  border-color: #adadad; }\\n\", \"\"]);\n\n// exports\nexports.locals = {\n\t\"button\": \"Button__button___3B9Ox\",\n\t\"defaults\": \"Button__defaults___k0czm\"\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./~/postcss-loader!./~/sass-loader!./src/components/button/Button.scss\n ** module id = 622\n ** module chunks = 37 38 39 41\n **/\n//# sourceURL=webpack:///./src/components/button/Button.scss?./~/css-loader?modules&importLoaders=1&localIdentName=%5Bname%5D__%5Blocal%5D___%5Bhash:base64:5%5D!./~/postcss-loader!./~/sass-loader");

/***/ },

/***/ 632:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _lodash = __webpack_require__(241);\n\nvar _lodash2 = _interopRequireDefault(_lodash);\n\nvar _Button = __webpack_require__(620);\n\nvar _Button2 = _interopRequireDefault(_Button);\n\nvar _reactRouter = __webpack_require__(175);\n\nvar _R = __webpack_require__(268);\n\nvar _R2 = _interopRequireDefault(_R);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar NovelEdit = function (_React$Component) {\n  _inherits(NovelEdit, _React$Component);\n\n  function NovelEdit(props) {\n    _classCallCheck(this, NovelEdit);\n\n    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NovelEdit).call(this, props));\n\n    _initialiseProps.call(_this);\n\n    var location = props.location;\n    var store = props.store;\n    var novelId = location.query.novelId;\n\n    if (_lodash2.default.isEmpty(novelId)) {\n      return _possibleConstructorReturn(_this);\n    }\n    store.actions.getNovelCatalog(novelId);\n    return _this;\n  }\n\n  _createClass(NovelEdit, [{\n    key: 'render',\n    value: function render() {\n      var _this2 = this;\n\n      var _props = this.props;\n      var location = _props.location;\n      var store = _props.store;\n      var novelId = location.query.novelId;\n\n      var novel = store.data.novels[novelId] || {};\n      return _react2.default.createElement(\n        'div',\n        null,\n        _react2.default.createElement(\n          'div',\n          null,\n          _react2.default.createElement(\n            'label',\n            null,\n            '名字：'\n          ),\n          _react2.default.createElement(\n            'span',\n            null,\n            novel.name\n          )\n        ),\n        _react2.default.createElement(\n          'div',\n          null,\n          _react2.default.createElement(\n            'label',\n            null,\n            '作者：'\n          ),\n          _react2.default.createElement(\n            'span',\n            null,\n            novel.author\n          )\n        ),\n        _react2.default.createElement(\n          'div',\n          null,\n          _react2.default.createElement(\n            'label',\n            null,\n            '章节'\n          ),\n          _lodash2.default.map(novel.sections, function (s) {\n            return _react2.default.createElement(\n              'div',\n              { key: s.id },\n              s.name\n            );\n          }),\n          _react2.default.createElement(\n            'div',\n            null,\n            _react2.default.createElement(\n              _Button2.default,\n              { onClick: function onClick() {\n                  return _this2.onAddSection(novelId);\n                } },\n              '新增'\n            )\n          )\n        )\n      );\n    }\n  }]);\n\n  return NovelEdit;\n}(_react2.default.Component);\n\nvar _initialiseProps = function _initialiseProps() {\n  var _this3 = this;\n\n  this.onAddSection = function (novelId) {\n    _this3.props.router.push({\n      pathname: _R2.default.MyNovelSectionAdd,\n      query: { novelId: novelId }\n    });\n  };\n};\n\nNovelEdit.propTypes = {\n  location: _react.PropTypes.object,\n  store: _react.PropTypes.object\n};\nmodule.exports = (0, _reactRouter.withRouter)(NovelEdit);\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/my/routes/NovelEdit/NovelEdit.jsx\n ** module id = 632\n ** module chunks = 39\n **/\n//# sourceURL=webpack:///./src/entry/routes/my/routes/NovelEdit/NovelEdit.jsx?");

/***/ }

});