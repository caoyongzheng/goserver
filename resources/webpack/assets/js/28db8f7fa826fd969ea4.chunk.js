webpackJsonp([40],{

/***/ 634:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactAppStore = __webpack_require__(238);\n\nvar _actions = __webpack_require__(635);\n\nvar _actions2 = _interopRequireDefault(_actions);\n\nvar _SectionEdit = __webpack_require__(637);\n\nvar _SectionEdit2 = _interopRequireDefault(_SectionEdit);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar NovelSectionAddApp = function (_React$Component) {\n  _inherits(NovelSectionAddApp, _React$Component);\n\n  function NovelSectionAddApp(props) {\n    _classCallCheck(this, NovelSectionAddApp);\n\n    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NovelSectionAddApp).call(this, props));\n\n    _this.store = new _reactAppStore.Store({\n      state: {\n        editName: '',\n        editContent: ''\n      },\n      actionFactorys: _actions2.default\n    });\n    return _this;\n  }\n\n  _createClass(NovelSectionAddApp, [{\n    key: 'render',\n    value: function render() {\n      return _react2.default.createElement(\n        'div',\n        null,\n        _react2.default.createElement(_reactAppStore.Provider, {\n          Component: _SectionEdit2.default,\n          connects: [{\n            store: this.store,\n            propsFn: function propsFn(_ref) {\n              var editName = _ref.editName;\n              var editContent = _ref.editContent;\n              return { editName: editName, editContent: editContent };\n            },\n            actionsFn: function actionsFn(_ref2) {\n              var onEditName = _ref2.onEditName;\n              var onEditContent = _ref2.onEditContent;\n              return { onEditName: onEditName, onEditContent: onEditContent };\n            }\n          }]\n        })\n      );\n    }\n  }]);\n\n  return NovelSectionAddApp;\n}(_react2.default.Component);\n\nNovelSectionAddApp.propTypes = {\n  className: _react.PropTypes.string\n};\nmodule.exports = NovelSectionAddApp;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/my/routes/NovelSectionAdd/apps/NovelSectionAddApp.jsx\n ** module id = 634\n ** module chunks = 40\n **/\n//# sourceURL=webpack:///./src/entry/routes/my/routes/NovelSectionAdd/apps/NovelSectionAddApp.jsx?");

/***/ },

/***/ 635:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _actions = __webpack_require__(636);\n\nvar _actions2 = _interopRequireDefault(_actions);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = [_actions2.default];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/my/routes/NovelSectionAdd/actions/index.js\n ** module id = 635\n ** module chunks = 40\n **/\n//# sourceURL=webpack:///./src/entry/routes/my/routes/NovelSectionAdd/actions/index.js?");

/***/ },

/***/ 636:
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = Actions;\nfunction Actions(_ref) {\n  var dispatch = _ref.dispatch;\n\n\n  function onEditName(editName) {\n    dispatch({\n      type: 'OnEditName',\n      state: { editName: editName }\n    });\n  }\n\n  function onEditContent(editContent) {\n    dispatch({\n      type: 'OnEditContent',\n      state: { editContent: editContent }\n    });\n  }\n\n  return { onEditName: onEditName, onEditContent: onEditContent };\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/my/routes/NovelSectionAdd/actions/actions.js\n ** module id = 636\n ** module chunks = 40\n **/\n//# sourceURL=webpack:///./src/entry/routes/my/routes/NovelSectionAdd/actions/actions.js?");

/***/ },

/***/ 637:
/***/ function(module, exports, __webpack_require__) {

	eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar SectionEdit = function (_React$Component) {\n  _inherits(SectionEdit, _React$Component);\n\n  function SectionEdit() {\n    var _Object$getPrototypeO;\n\n    var _temp, _this, _ret;\n\n    _classCallCheck(this, SectionEdit);\n\n    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(SectionEdit)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {}, _temp), _possibleConstructorReturn(_this, _ret);\n  }\n\n  _createClass(SectionEdit, [{\n    key: \"render\",\n    value: function render() {\n      var _props = this.props;\n      var editName = _props.editName;\n      var editContent = _props.editContent;\n      var onEditName = _props.onEditName;\n      var onEditContent = _props.onEditContent;\n\n      return _react2.default.createElement(\n        \"div\",\n        null,\n        _react2.default.createElement(\n          \"div\",\n          null,\n          _react2.default.createElement(\"input\", {\n            placeholder: \"章节名\",\n            value: editName,\n            onChange: function onChange(e) {\n              return onEditName(e.target.value);\n            }\n          })\n        ),\n        _react2.default.createElement(\n          \"div\",\n          null,\n          _react2.default.createElement(\"textarea\", {\n            placeholder: \"内容\",\n            value: editContent,\n            onChange: function onChange(e) {\n              return onEditContent(e.target.value);\n            }\n          })\n        )\n      );\n    }\n  }]);\n\n  return SectionEdit;\n}(_react2.default.Component);\n\nSectionEdit.propTypes = {\n  editName: _react.PropTypes.string.isRequired,\n  editContent: _react.PropTypes.string.isRequired,\n  onEditName: _react.PropTypes.func.isRequired,\n  onEditContent: _react.PropTypes.func.isRequired\n};\nexports.default = SectionEdit;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/my/routes/NovelSectionAdd/components/SectionEdit.jsx\n ** module id = 637\n ** module chunks = 40\n **/\n//# sourceURL=webpack:///./src/entry/routes/my/routes/NovelSectionAdd/components/SectionEdit.jsx?");

/***/ }

});