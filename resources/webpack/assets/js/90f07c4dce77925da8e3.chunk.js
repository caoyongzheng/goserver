webpackJsonp([33],{

/***/ 600:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _Viewer = __webpack_require__(601);\n\nvar _Viewer2 = _interopRequireDefault(_Viewer);\n\nvar _lodash = __webpack_require__(241);\n\nvar _lodash2 = _interopRequireDefault(_lodash);\n\nvar _DataStores = __webpack_require__(603);\n\nvar _DataStores2 = _interopRequireDefault(_DataStores);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar Viewer = function (_React$Component) {\n  _inherits(Viewer, _React$Component);\n\n  function Viewer() {\n    var _Object$getPrototypeO;\n\n    var _temp, _this, _ret;\n\n    _classCallCheck(this, Viewer);\n\n    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Viewer)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {}, _temp), _possibleConstructorReturn(_this, _ret);\n  }\n\n  _createClass(Viewer, [{\n    key: 'render',\n    value: function render() {\n      var params = this.props.params;\n\n      var novel = _DataStores2.default.get('novelreader').get('novel');\n      console.log(novel);\n      var section = _lodash2.default.find(novel.sections, { id: params.sectionID });\n      return _react2.default.createElement(\n        'section',\n        { className: _Viewer2.default.textBox },\n        _react2.default.createElement(\n          'div',\n          { className: _Viewer2.default.titleBox },\n          _react2.default.createElement(\n            'h1',\n            { className: _Viewer2.default.textTitle },\n            section.name\n          ),\n          _react2.default.createElement(\n            'p',\n            { className: _Viewer2.default.textInfo },\n            '小说：',\n            _react2.default.createElement(\n              'a',\n              { style: { marginRight: '10px' } },\n              novel.name\n            ),\n            '作者：',\n            _react2.default.createElement(\n              'a',\n              { style: { marginRight: '10px' } },\n              novel.author\n            ),\n            '字数：',\n            _react2.default.createElement(\n              'a',\n              { style: { marginRight: '10px' } },\n              3009\n            ),\n            '时间：',\n            _react2.default.createElement(\n              'a',\n              { style: { marginRight: '10px' } },\n              section.time\n            )\n          )\n        ),\n        _react2.default.createElement(\n          'section',\n          { className: _Viewer2.default.text },\n          _lodash2.default.map(section.paragraphs, function (p, i) {\n            return _react2.default.createElement(\n              'p',\n              { key: i },\n              _react2.default.createElement('span', { style: { paddingLeft: '2em', height: '1em' } }),\n              p\n            );\n          })\n        )\n      );\n    }\n  }]);\n\n  return Viewer;\n}(_react2.default.Component);\n\nViewer.propTypes = {\n  params: _react.PropTypes.object\n};\nmodule.exports = Viewer;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/novel/reader/routes/viewer/Viewer.jsx\n ** module id = 600\n ** module chunks = 33\n **/\n//# sourceURL=webpack:///./src/entry/routes/novel/reader/routes/viewer/Viewer.jsx?");

/***/ },

/***/ 601:
/***/ function(module, exports, __webpack_require__) {

	eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(602);\nif(typeof content === 'string') content = [[module.id, content, '']];\n// add the styles to the DOM\nvar update = __webpack_require__(260)(content, {});\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {\n\t// When the styles change, update the <style> tags\n\tif(!content.locals) {\n\t\tmodule.hot.accept(\"!!./../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../node_modules/sass-loader/index.js!./Viewer.scss\", function() {\n\t\t\tvar newContent = require(\"!!./../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../node_modules/sass-loader/index.js!./Viewer.scss\");\n\t\t\tif(typeof newContent === 'string') newContent = [[module.id, newContent, '']];\n\t\t\tupdate(newContent);\n\t\t});\n\t}\n\t// When the module is disposed, remove the <style> tags\n\tmodule.hot.dispose(function() { update(); });\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/novel/reader/routes/viewer/Viewer.scss\n ** module id = 601\n ** module chunks = 33\n **/\n//# sourceURL=webpack:///./src/entry/routes/novel/reader/routes/viewer/Viewer.scss?");

/***/ },

/***/ 602:
/***/ function(module, exports, __webpack_require__) {

	eval("exports = module.exports = __webpack_require__(259)();\n// imports\n\n\n// module\nexports.push([module.id, \".Viewer__textBox___2iGRI {\\n  width: 100%;\\n  margin: 0 auto 30px;\\n  border-radius: 3px;\\n  padding-bottom: 40px;\\n  box-shadow: 0 0 15px 0 #CCC;\\n  background: #F6F4EC; }\\n\\n.Viewer__titleBox___1RZA7 {\\n  width: 88%;\\n  margin: 0 auto;\\n  padding: 0 0 10px 10px;\\n  border-bottom: 1px solid #E3E1D9;\\n  position: relative; }\\n\\n.Viewer__textTitle___1XDgb {\\n  padding-top: 24px;\\n  font: 26px/1 \\\"Microsoft YaHei\\\";\\n  margin-bottom: 10px;\\n  color: #000; }\\n\\n.Viewer__textInfo___3UyDZ {\\n  color: #999;\\n  font: 12px/1.8 \\\"Microsoft YaHei\\\";\\n  position: relative; }\\n\\n.Viewer__text___1CvGG {\\n  width: 88%;\\n  margin: 0 auto;\\n  font-size: 22px; }\\n\\n.Viewer__text___1CvGG p {\\n  margin: 0.8em 0;\\n  line-height: 1.8; }\\n\", \"\"]);\n\n// exports\nexports.locals = {\n\t\"textBox\": \"Viewer__textBox___2iGRI\",\n\t\"titleBox\": \"Viewer__titleBox___1RZA7\",\n\t\"textTitle\": \"Viewer__textTitle___1XDgb\",\n\t\"textInfo\": \"Viewer__textInfo___3UyDZ\",\n\t\"text\": \"Viewer__text___1CvGG\"\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./~/postcss-loader!./~/sass-loader!./src/entry/routes/novel/reader/routes/viewer/Viewer.scss\n ** module id = 602\n ** module chunks = 33\n **/\n//# sourceURL=webpack:///./src/entry/routes/novel/reader/routes/viewer/Viewer.scss?./~/css-loader?modules&importLoaders=1&localIdentName=%5Bname%5D__%5Blocal%5D___%5Bhash:base64:5%5D!./~/postcss-loader!./~/sass-loader");

/***/ },

/***/ 603:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _lodash = __webpack_require__(241);\n\nvar _lodash2 = _interopRequireDefault(_lodash);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar DataStore = function DataStore(data) {\n  var _this = this;\n\n  _classCallCheck(this, DataStore);\n\n  this.get = function (key) {\n    return _this.data[key];\n  };\n\n  this.set = function (key, value) {\n    _this.data[key] = value;\n  };\n\n  this.del = function (key) {\n    if (!_lodash2.default.isEmpty(_this.data[key])) {\n      delete _this.data[key];\n    }\n  };\n\n  this.data = data || {};\n};\n\nvar DataStores = function DataStores() {\n  var _this2 = this;\n\n  _classCallCheck(this, DataStores);\n\n  this.add = function (key) {\n    var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];\n\n    if (_lodash2.default.isEmpty(_this2.datastores[key])) {\n      _this2.datastores[key] = new DataStore(data);\n    }\n    return _this2.datastores[key];\n  };\n\n  this.get = function (key) {\n    return _this2.datastores[key];\n  };\n\n  this.del = function (key) {\n    if (!_lodash2.default.isEmpty(_this2.datastores[key])) {\n      delete _this2.datastores[key];\n    }\n  };\n\n  this.datastores = {};\n};\n\nexports.default = new DataStores();\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/utils/stores/datastores.jsx\n ** module id = 603\n ** module chunks = 33 34 35\n **/\n//# sourceURL=webpack:///./src/entry/utils/stores/datastores.jsx?");

/***/ }

});