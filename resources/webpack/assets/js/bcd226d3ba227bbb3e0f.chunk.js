webpackJsonp([41],{

/***/ 272:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = Nav;\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRouter = __webpack_require__(175);\n\nvar _LoginControl = __webpack_require__(273);\n\nvar _LoginControl2 = _interopRequireDefault(_LoginControl);\n\nvar _reactAppStore = __webpack_require__(238);\n\nvar _R = __webpack_require__(269);\n\nvar _R2 = _interopRequireDefault(_R);\n\nvar _navStyles = __webpack_require__(282);\n\nvar _navStyles2 = _interopRequireDefault(_navStyles);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction myLink() {\n  // if (logStatus === 'LOGIN') {\n  //   return (\n  //     <Link to={R.My} activeStyle={ACTIVE} style={styles.link}>\n  //       My\n  //     </Link>\n  //   )\n  // }\n  return null;\n}\n\nfunction Nav() {\n  return _react2.default.createElement(\n    'nav',\n    { style: _navStyles2.default.nav },\n    _react2.default.createElement(\n      'div',\n      { name: 'navItems', style: { overflow: 'auto', display: 'flex' } },\n      _react2.default.createElement(\n        _reactRouter.Link,\n        { to: _R2.default.Blog, activeStyle: _navStyles.ACTIVE, style: _navStyles2.default.link },\n        'blog'\n      ),\n      _react2.default.createElement(_reactAppStore.Provider, {\n        Component: myLink,\n        connects: [{\n          store: _reactAppStore.GlobalStores.get('App'),\n          propsFn: function propsFn(_ref) {\n            var logStatus = _ref.logStatus;\n            return { logStatus: logStatus };\n          },\n          linkStates: ['logStatus']\n        }]\n      })\n    ),\n    _react2.default.createElement('div', { style: { flex: 1 } }),\n    _react2.default.createElement(_reactAppStore.Provider, {\n      Component: _LoginControl2.default,\n      props: { store: _reactAppStore.GlobalStores.get('App') },\n      connects: [{\n        store: _reactAppStore.GlobalStores.get('App'),\n        propsFn: function propsFn(_ref2) {\n          var logStatus = _ref2.logStatus;\n          var _ref2$user = _ref2.user;\n          var headerIcon = _ref2$user.headerIcon;\n          var username = _ref2$user.username;\n          var id = _ref2$user.id;\n          return { logStatus: logStatus, headerIcon: headerIcon, username: username, userId: id };\n        },\n        linkStates: ['logStatus', 'user'],\n        actionsFn: function actionsFn(actions) {\n          return {\n            onLogin: actions.onLogin,\n            onLogout: actions.onLogout,\n            onSignModalDisplay: actions.onSignModalDisplay\n          };\n        }\n      }]\n    })\n  );\n}\n\n/*\n<Link to={R.home} activeStyle={ACTIVE} style={styles.link}>\n  home\n</Link>\n<Link to={R.demos} activeStyle={ACTIVE} style={styles.link}>\n  demo\n</Link>\n<Link to={R.videoView} activeStyle={ACTIVE} style={styles.link}>\n  video\n</Link>\n */\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/components/nav/nav.jsx\n ** module id = 272\n ** module chunks = 1 24 26 31 41\n **/\n//# sourceURL=webpack:///./src/entry/components/nav/nav.jsx?");

/***/ },

/***/ 273:
/***/ function(module, exports, __webpack_require__) {

	eval("/* WEBPACK VAR INJECTION */(function($) {'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRouter = __webpack_require__(175);\n\nvar _LoginControl = __webpack_require__(274);\n\nvar _LoginControl2 = _interopRequireDefault(_LoginControl);\n\nvar _classnames = __webpack_require__(276);\n\nvar _classnames2 = _interopRequireDefault(_classnames);\n\nvar _DefaultHeaderIcon = __webpack_require__(277);\n\nvar _DefaultHeaderIcon2 = _interopRequireDefault(_DefaultHeaderIcon);\n\nvar _icons = __webpack_require__(278);\n\nvar _icons2 = _interopRequireDefault(_icons);\n\nvar _SvgIcon = __webpack_require__(279);\n\nvar _SvgIcon2 = _interopRequireDefault(_SvgIcon);\n\nvar _ImageAction = __webpack_require__(280);\n\nvar _PathUtil = __webpack_require__(257);\n\nvar _UserAction = __webpack_require__(281);\n\nvar _R = __webpack_require__(269);\n\nvar _R2 = _interopRequireDefault(_R);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\n// LoginControl 登录控制\nvar LoginControl = function (_Component) {\n  _inherits(LoginControl, _Component);\n\n  function LoginControl() {\n    var _Object$getPrototypeO;\n\n    var _temp, _this, _ret;\n\n    _classCallCheck(this, LoginControl);\n\n    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(LoginControl)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {\n      hide: true\n    }, _this.setHide = function (hide) {\n      _this.setState({\n        hide: hide\n      });\n    }, _this.clickSignIn = function (e) {\n      e.preventDefault();\n      e.stopPropagation();\n      _this.props.onSignModalDisplay('SignIn');\n    }, _this.clickSignUp = function (e) {\n      e.preventDefault();\n      e.stopPropagation();\n      _this.props.onSignModalDisplay('SignUp');\n    }, _this.handleFile = function (e) {\n      var file = e.target.files[0];\n      var successHandle = function successHandle(result) {\n        return (0, _UserAction.setHeaderIcon)(result.data, {\n          successHandle: function successHandle() {\n            return _this.props.onLogin();\n          },\n          failHandle: function failHandle(r) {\n            return $.notify(r.desc);\n          }\n        });\n      };\n      var failHandle = function failHandle(result) {\n        return $.notify(result.desc);\n      };\n      var errHandle = function errHandle(err) {\n        return $.notify(err);\n      };\n      (0, _ImageAction.uploadImage)(file, { successHandle: successHandle, failHandle: failHandle, errHandle: errHandle });\n    }, _this.renderLoginBars = function (logStatus) {\n      if (logStatus !== 'LOGOUT') {\n        return null;\n      }\n      return _react2.default.createElement(\n        'div',\n        { className: _LoginControl2.default.item },\n        _react2.default.createElement(\n          'a',\n          { className: _LoginControl2.default.item, onClick: _this.clickSignIn },\n          '登录'\n        ),\n        _react2.default.createElement(\n          'a',\n          { className: _LoginControl2.default.item, onClick: _this.clickSignUp },\n          '注册'\n        )\n      );\n    }, _this.renderUserInfo = function (_ref) {\n      var headerIcon = _ref.headerIcon;\n      var username = _ref.username;\n      var userId = _ref.userId;\n      var logStatus = _ref.logStatus;\n      var hide = _ref.hide;\n\n      if (logStatus !== 'LOGIN') {\n        return null;\n      }\n      return _react2.default.createElement(\n        'ul',\n        null,\n        _react2.default.createElement(\n          'li',\n          { ref: 'userInfo', className: _LoginControl2.default.item, onMouseLeave: function onMouseLeave() {\n              return _this.setHide(true);\n            } },\n          _react2.default.createElement(\n            'a',\n            { className: _LoginControl2.default.item },\n            _react2.default.createElement('img', {\n              src: (0, _PathUtil.imageURL)(headerIcon) || _DefaultHeaderIcon2.default,\n              className: _LoginControl2.default.headerImg,\n              alt: 'userIcon'\n            }),\n            _react2.default.createElement('input', {\n              type: 'file',\n              name: 'image',\n              className: _LoginControl2.default.upload,\n              accept: 'image/*',\n              onChange: _this.handleFile\n            })\n          ),\n          _react2.default.createElement(\n            'div',\n            { className: _LoginControl2.default.item, onClick: function onClick() {\n                return _this.setHide(false);\n              } },\n            _react2.default.createElement(\n              'a',\n              { className: _LoginControl2.default.item },\n              username\n            ),\n            _react2.default.createElement(\n              'a',\n              { className: _LoginControl2.default.item },\n              _react2.default.createElement(_SvgIcon2.default, _icons2.default.arrowDown)\n            )\n          ),\n          _react2.default.createElement(\n            'ul',\n            { className: (0, _classnames2.default)(_LoginControl2.default.dropdown, _defineProperty({}, _LoginControl2.default.hide, hide)) },\n            _react2.default.createElement(\n              'li',\n              {\n                onClick: function onClick() {\n                  _this.setHide(true);\n                  _this.props.router.push({ pathname: _R2.default.BlogIndex, query: { userId: userId } });\n                }\n              },\n              '我的博文'\n            ),\n            _react2.default.createElement(\n              'li',\n              {\n                onClick: function onClick() {\n                  _this.setHide(true);\n                  _this.props.onLogout();\n                }\n              },\n              '登出'\n            )\n          )\n        )\n      );\n    }, _temp), _possibleConstructorReturn(_this, _ret);\n  }\n\n  _createClass(LoginControl, [{\n    key: 'render',\n    value: function render() {\n      var _props = this.props;\n      var style = _props.style;\n      var logStatus = _props.logStatus;\n      var headerIcon = _props.headerIcon;\n      var username = _props.username;\n      var userId = _props.userId;\n      var hide = this.state.hide;\n\n      return _react2.default.createElement(\n        'div',\n        { style: style },\n        this.renderLoginBars(logStatus),\n        this.renderUserInfo({ headerIcon: headerIcon, username: username, userId: userId, logStatus: logStatus, hide: hide })\n      );\n    }\n  }]);\n\n  return LoginControl;\n}(_react.Component);\n\nLoginControl.propTypes = {\n  userId: _react.PropTypes.string,\n  headerIcon: _react.PropTypes.string,\n  username: _react.PropTypes.string,\n  logStatus: _react.PropTypes.string,\n  onLogin: _react.PropTypes.func.isRequired,\n  onLogout: _react.PropTypes.func.isRequired,\n  store: _react.PropTypes.object.isRequired,\n  onSignModalDisplay: _react.PropTypes.func.isRequired\n};\n\nexports.default = (0, _reactRouter.withRouter)(LoginControl);\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(246)))\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/components/loginControl/LoginControl.jsx\n ** module id = 273\n ** module chunks = 1 24 26 31 41\n **/\n//# sourceURL=webpack:///./src/entry/components/loginControl/LoginControl.jsx?");

/***/ },

/***/ 274:
/***/ function(module, exports, __webpack_require__) {

	eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(275);\nif(typeof content === 'string') content = [[module.id, content, '']];\n// add the styles to the DOM\nvar update = __webpack_require__(261)(content, {});\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {\n\t// When the styles change, update the <style> tags\n\tif(!content.locals) {\n\t\tmodule.hot.accept(\"!!./../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./LoginControl.scss\", function() {\n\t\t\tvar newContent = require(\"!!./../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./LoginControl.scss\");\n\t\t\tif(typeof newContent === 'string') newContent = [[module.id, newContent, '']];\n\t\t\tupdate(newContent);\n\t\t});\n\t}\n\t// When the module is disposed, remove the <style> tags\n\tmodule.hot.dispose(function() { update(); });\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/components/loginControl/LoginControl.scss\n ** module id = 274\n ** module chunks = 1 24 26 31 41\n **/\n//# sourceURL=webpack:///./src/entry/components/loginControl/LoginControl.scss?");

/***/ },

/***/ 275:
/***/ function(module, exports, __webpack_require__) {

	eval("exports = module.exports = __webpack_require__(260)();\n// imports\n\n\n// module\nexports.push([module.id, \".LoginControl__item___19ECg {\\n  position: relative;\\n  height: 60px;\\n  line-height: 60px;\\n  display: -webkit-box;\\n  display: -ms-flexbox;\\n  display: flex;\\n  cursor: pointer;\\n  font-size: 1.2rem;\\n  -webkit-box-align: center;\\n      -ms-flex-align: center;\\n          align-items: center;\\n  margin: 0 3px; }\\n\\n.LoginControl__headerImg___2s6Z9 {\\n  width: 40px;\\n  height: 40px;\\n  border-radius: 50%;\\n  margin: 10px 0; }\\n\\n.LoginControl__upload___2Qkkn {\\n  position: absolute;\\n  opacity: 0;\\n  left: 0;\\n  cursor: pointer;\\n  width: 40px;\\n  height: 40px;\\n  border-radius: 50%;\\n  z-index: 1; }\\n\\n.LoginControl__dropdown___XT10X {\\n  position: absolute;\\n  background-color: #d5d5d5;\\n  color: #191919;\\n  z-index: 2;\\n  width: 120px;\\n  list-style: none;\\n  right: 0;\\n  top: 60px; }\\n\\n.LoginControl__dropdown___XT10X li {\\n  height: 40px;\\n  line-height: 40px;\\n  padding-left: 15px; }\\n\\n.LoginControl__hide___159sX {\\n  display: none; }\\n\", \"\"]);\n\n// exports\nexports.locals = {\n\t\"item\": \"LoginControl__item___19ECg\",\n\t\"headerImg\": \"LoginControl__headerImg___2s6Z9\",\n\t\"upload\": \"LoginControl__upload___2Qkkn\",\n\t\"dropdown\": \"LoginControl__dropdown___XT10X\",\n\t\"hide\": \"LoginControl__hide___159sX\"\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./~/postcss-loader!./~/sass-loader!./src/entry/components/loginControl/LoginControl.scss\n ** module id = 275\n ** module chunks = 1 24 26 31 41\n **/\n//# sourceURL=webpack:///./src/entry/components/loginControl/LoginControl.scss?./~/css-loader?modules&importLoaders=1&localIdentName=%5Bname%5D__%5Blocal%5D___%5Bhash:base64:5%5D!./~/postcss-loader!./~/sass-loader");

/***/ },

/***/ 276:
/***/ function(module, exports, __webpack_require__) {

	eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!\n  Copyright (c) 2016 Jed Watson.\n  Licensed under the MIT License (MIT), see\n  http://jedwatson.github.io/classnames\n*/\n/* global define */\n\n(function () {\n\t'use strict';\n\n\tvar hasOwn = {}.hasOwnProperty;\n\n\tfunction classNames () {\n\t\tvar classes = [];\n\n\t\tfor (var i = 0; i < arguments.length; i++) {\n\t\t\tvar arg = arguments[i];\n\t\t\tif (!arg) continue;\n\n\t\t\tvar argType = typeof arg;\n\n\t\t\tif (argType === 'string' || argType === 'number') {\n\t\t\t\tclasses.push(arg);\n\t\t\t} else if (Array.isArray(arg)) {\n\t\t\t\tclasses.push(classNames.apply(null, arg));\n\t\t\t} else if (argType === 'object') {\n\t\t\t\tfor (var key in arg) {\n\t\t\t\t\tif (hasOwn.call(arg, key) && arg[key]) {\n\t\t\t\t\t\tclasses.push(key);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn classes.join(' ');\n\t}\n\n\tif (typeof module !== 'undefined' && module.exports) {\n\t\tmodule.exports = classNames;\n\t} else if (true) {\n\t\t// register as 'classnames', consistent with npm package name\n\t\t!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {\n\t\t\treturn classNames;\n\t\t}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\t} else {\n\t\twindow.classNames = classNames;\n\t}\n}());\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/classnames/index.js\n ** module id = 276\n ** module chunks = 1 19 24 26 31 36 37 38 40 41\n **/\n//# sourceURL=webpack:///./~/classnames/index.js?");

/***/ },

/***/ 277:
/***/ function(module, exports) {

	eval("module.exports = \"data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAUABQAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+t+KKPxo/GgA70Yo/Gj8aADFH4VesdC1HUl3WtjcXCf344yV/PGKW+0HUtNXddWNzbp/fkjIX88YoAofhR+FH40fjQAfhR+FH40fjQAUUUUAFepeAPh5D9li1LVYhK8g3Q27j5VXszDuT6f5HA+FtOXVvEWn2rjMcko3j1UckfkDX0MBgYHAoARVCKFUBVHAA6ClZQwKkZBGCDS0UAec+Pvh3BJay6lpUQimjBeW3QYVx3Kjsfbv/PyqvpuvnvxfpqaT4l1C1QbY0lJUDsrfMB+RoAyKKKKACiiigDa8GXq6f4p02eQgIJQpJ7Bvlz+tfQP4V8yDg17P4A8cw65ZxWV5IE1KMbfmP+uA7j39R+NAHaUfhSUUAL+FeA+OL1NQ8WalNGQU83YCO+0Bf6V6b498cQ6BZyWlrIJNSkXaApz5QP8AEff0FeKk5OTyTQAUUUUAH40fjRU1naTX93DbQIXmlYIijuTQBc0Dw/eeI74W1mm49XkbhUHqTXsHhz4eaXoCpI8YvbscmaYZAP8Asr0H8/etHwv4cg8M6XHaxANIfmllxy7dz9PStigA/Gk/GlooA5bxJ8PdL19XkWMWd43PnwjGT/tL0P8AP3rx/X/D954cvjbXibT1SReVceoNfRFZHijw5B4m0uS1lAWQfNFLjlG7H6etAHz5+NH41NeWk1hdzW06FJonKMp7EGoaACvQfhBowudTudRkXK2y7I8j+Nup/Afzrz6vafhRaCDwmkgHM8zufwO3/wBloA7Kiij8KACkpaSgBaSj8KKAPJvi/owttTttRjXC3K7JMf3l6H8R/KvPq9p+K1qJ/CbyEcwTI4P1O3/2avFqAP/Z\"\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/images/defaultHeaderIcon.png\n ** module id = 277\n ** module chunks = 1 24 26 28 30 31 41\n **/\n//# sourceURL=webpack:///./src/entry/images/defaultHeaderIcon.png?");

/***/ },

/***/ 278:
/***/ function(module, exports) {

	eval("module.exports = {\n\t\"arrowDown\": {\n\t\t\"paths\": [\n\t\t\t\"M0 384l383.75 383.75 383.75-383.75h-767.5z\"\n\t\t],\n\t\t\"transform\": \"scale(0.015625 0.015625)\",\n\t\t\"style\": {\n\t\t\t\"width\": \"16px\",\n\t\t\t\"height\": \"16px\"\n\t\t}\n\t}\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/components/loginControl/icons.json\n ** module id = 278\n ** module chunks = 1 24 26 31 41\n **/\n//# sourceURL=webpack:///./src/entry/components/loginControl/icons.json?");

/***/ },

/***/ 279:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _lodash = __webpack_require__(241);\n\nvar _lodash2 = _interopRequireDefault(_lodash);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }\n\nfunction SvgIcon(_ref) {\n  var transform = _ref.transform;\n  var paths = _ref.paths;\n\n  var others = _objectWithoutProperties(_ref, ['transform', 'paths']);\n\n  return _react2.default.createElement(\n    'svg',\n    others,\n    _react2.default.createElement(\n      'g',\n      { transform: transform },\n      _lodash2.default.map(paths, function (p, i) {\n        return _react2.default.createElement('path', { key: i, d: p });\n      })\n    )\n  );\n}\n\nSvgIcon.propTypes = {\n  transform: _react.PropTypes.string,\n  paths: _react.PropTypes.arrayOf(_react.PropTypes.string).isRequired\n};\nexports.default = SvgIcon;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/components/SvgIcon/index.jsx\n ** module id = 279\n ** module chunks = 1 24 26 28 30 31 41\n **/\n//# sourceURL=webpack:///./src/components/SvgIcon/index.jsx?");

/***/ },

/***/ 280:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.uploadImage = uploadImage;\n\nvar _superagent = __webpack_require__(252);\n\nvar _superagent2 = _interopRequireDefault(_superagent);\n\nvar _PathUtil = __webpack_require__(257);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction uploadImage(image, _ref) {\n  var successHandle = _ref.successHandle;\n  var failHandle = _ref.failHandle;\n  var errHandle = _ref.errHandle;\n\n  var formData = new FormData();\n  formData.append('fileType', image.type);\n  formData.append('image', image);\n  _superagent2.default.post(_PathUtil.ImgHost + '/api/image/add').send(formData).then(function (res) {\n    var result = JSON.parse(res.text);\n    if (result.success && successHandle) {\n      successHandle(result);\n    } else if (!result.success && failHandle) {\n      failHandle(result);\n    }\n  }, function (err) {\n    if (errHandle) {\n      errHandle(err);\n    }\n  });\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/actions/imageAction.jsx\n ** module id = 280\n ** module chunks = 1 24 26 27 29 31 41\n **/\n//# sourceURL=webpack:///./src/entry/actions/imageAction.jsx?");

/***/ },

/***/ 281:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.setHeaderIcon = setHeaderIcon;\n\nvar _superagent = __webpack_require__(252);\n\nvar _superagent2 = _interopRequireDefault(_superagent);\n\nvar _PathUtil = __webpack_require__(257);\n\nvar _PathUtil2 = _interopRequireDefault(_PathUtil);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction setHeaderIcon(filename, _ref) {\n  var successHandle = _ref.successHandle;\n  var failHandle = _ref.failHandle;\n  var errHandle = _ref.errHandle;\n\n  _superagent2.default.put(_PathUtil2.default + '/api/user/headerIcon').set('Content-Type', 'application/x-www-form-urlencoded').send({ filename: filename }).then(function (res) {\n    var result = JSON.parse(res.text);\n    if (result.success && successHandle) {\n      successHandle(result);\n    } else if (!result.success && failHandle) {\n      failHandle(result);\n    }\n  }, function (err) {\n    if (errHandle) {\n      errHandle(err);\n    }\n  });\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/actions/userAction.jsx\n ** module id = 281\n ** module chunks = 1 24 26 31 41\n **/\n//# sourceURL=webpack:///./src/entry/actions/userAction.jsx?");

/***/ },

/***/ 282:
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar HEIGHT = '60px';\n\nvar styles = {\n  nav: {\n    position: 'relative',\n    width: '100%',\n    height: HEIGHT,\n    lineHeight: HEIGHT,\n    backgroundColor: '#ffffff',\n    padding: '0 45px',\n    color: '#000000',\n    display: 'flex'\n  },\n  link: {\n    textDecoration: 'initial',\n    textAlign: 'center',\n    height: HEIGHT,\n    width: '65px',\n    color: '#000000',\n    lineHeight: HEIGHT,\n    fontSize: '1.2rem',\n    fontWeight: 'bold',\n    display: 'inline-block',\n    margin: '0 10px',\n    cursor: 'pointer'\n  }\n};\nexports.default = styles;\nvar ACTIVE = exports.ACTIVE = {\n  borderBottom: 'solid 2px #ff9f1f'\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/components/nav/nav.styles.js\n ** module id = 282\n ** module chunks = 1 24 26 31 41\n **/\n//# sourceURL=webpack:///./src/entry/components/nav/nav.styles.js?");

/***/ },

/***/ 283:
/***/ function(module, exports) {

	eval("'use strict';\n\nmodule.exports = {\n  stageRow: {\n    position: 'relative',\n    height: '100%',\n    width: '100%',\n    display: 'flex'\n  },\n  stageCol: {\n    position: 'relative',\n    height: '100%',\n    width: '100%',\n    display: 'flex',\n    flexDirection: 'column'\n  },\n  body: {\n    flex: 1,\n    overflow: 'auto',\n    position: 'relative'\n  }\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/layout.style.js\n ** module id = 283\n ** module chunks = 1 24 26 41\n **/\n//# sourceURL=webpack:///./src/entry/layout.style.js?");

/***/ },

/***/ 640:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _lodash = __webpack_require__(241);\n\nvar _lodash2 = _interopRequireDefault(_lodash);\n\nvar _Nav = __webpack_require__(272);\n\nvar _Nav2 = _interopRequireDefault(_Nav);\n\nvar _reactAppStore = __webpack_require__(238);\n\nvar _LayoutStyle = __webpack_require__(283);\n\nvar _LayoutStyle2 = _interopRequireDefault(_LayoutStyle);\n\nvar _LeftNav = __webpack_require__(641);\n\nvar _LeftNav2 = _interopRequireDefault(_LeftNav);\n\nvar _actions = __webpack_require__(642);\n\nvar _actions2 = _interopRequireDefault(_actions);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar My = function (_React$Component) {\n  _inherits(My, _React$Component);\n\n  function My(props) {\n    _classCallCheck(this, My);\n\n    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(My).call(this, props));\n\n    _reactAppStore.GlobalStores.add('My', new _reactAppStore.Store({\n      data: {\n        novels: {}\n      },\n      actionFactorys: _actions2.default\n    }));\n    return _this;\n  }\n\n  _createClass(My, [{\n    key: 'render',\n    value: function render() {\n      var children = this.props.children;\n\n      return _react2.default.createElement(\n        'div',\n        { name: 'my', style: _LayoutStyle2.default.stageCol },\n        _react2.default.createElement(_Nav2.default, null),\n        _react2.default.createElement(\n          'div',\n          { name: 'body', style: _lodash2.default.merge({}, _LayoutStyle2.default.body, { display: 'flex' }) },\n          _react2.default.createElement(\n            'div',\n            { name: \"left\" },\n            _react2.default.createElement(_LeftNav2.default, null)\n          ),\n          _react2.default.createElement(\n            'div',\n            { name: \"right\", style: { flex: 1 } },\n            _react2.default.createElement(\n              _reactAppStore.Provider,\n              {\n                props: { store: _reactAppStore.GlobalStores.get('My'), appStore: _reactAppStore.GlobalStores.get('App') },\n                connects: [{ store: _reactAppStore.GlobalStores.get('App') }, { store: _reactAppStore.GlobalStores.get('My') }]\n              },\n              children\n            )\n          )\n        )\n      );\n    }\n  }]);\n\n  return My;\n}(_react2.default.Component);\n\nmodule.exports = My;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/my/My.jsx\n ** module id = 640\n ** module chunks = 41\n **/\n//# sourceURL=webpack:///./src/entry/routes/my/My.jsx?");

/***/ },

/***/ 641:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _R = __webpack_require__(269);\n\nvar _R2 = _interopRequireDefault(_R);\n\nvar _reactRouter = __webpack_require__(175);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar styles = {\n  stage: {\n    width: '200px',\n    height: '100%',\n    backgroundColor: '#efefef'\n  },\n  item: {\n    padding: '10px 16px',\n    cursor: 'pointer'\n  }\n};\n\nvar LeftNav = function (_Component) {\n  _inherits(LeftNav, _Component);\n\n  function LeftNav() {\n    var _Object$getPrototypeO;\n\n    var _temp, _this, _ret;\n\n    _classCallCheck(this, LeftNav);\n\n    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(LeftNav)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.linkTo = function (route) {\n      _this.props.router.push(route);\n    }, _temp), _possibleConstructorReturn(_this, _ret);\n  }\n\n  _createClass(LeftNav, [{\n    key: 'render',\n    value: function render() {\n      var _this2 = this;\n\n      return _react2.default.createElement(\n        'div',\n        { style: styles.stage },\n        _react2.default.createElement(\n          'div',\n          { style: styles.item, onClick: function onClick() {\n              return _this2.linkTo(_R2.default.MyNovelList);\n            } },\n          '我的小说'\n        )\n      );\n    }\n  }]);\n\n  return LeftNav;\n}(_react.Component);\n\nexports.default = (0, _reactRouter.withRouter)(LeftNav);\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/my/components/LeftNav.jsx\n ** module id = 641\n ** module chunks = 41\n **/\n//# sourceURL=webpack:///./src/entry/routes/my/components/LeftNav.jsx?");

/***/ },

/***/ 642:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _NovelActionFactory = __webpack_require__(643);\n\nvar _NovelActionFactory2 = _interopRequireDefault(_NovelActionFactory);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = [_NovelActionFactory2.default];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/my/actions/index.js\n ** module id = 642\n ** module chunks = 41\n **/\n//# sourceURL=webpack:///./src/entry/routes/my/actions/index.js?");

/***/ },

/***/ 643:
/***/ function(module, exports, __webpack_require__) {

	eval("/* WEBPACK VAR INJECTION */(function($) {'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _lodash = __webpack_require__(241);\n\nvar _lodash2 = _interopRequireDefault(_lodash);\n\nvar _Consants = __webpack_require__(644);\n\nvar _Consants2 = _interopRequireDefault(_Consants);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction NovelActionFactory(_ref) {\n  var dispatch = _ref.dispatch;\n\n  function getMyNovels(userId) {\n    $.ajax({\n      url: '/api/novel/userId/' + userId,\n      success: function success(novels) {\n        var novelObj = {};\n        _lodash2.default.forEach(novels, function (novel) {\n          novelObj[novel.id] = novel;\n        });\n        dispatch({\n          type: _Consants2.default.GetMyNovels,\n          data: { novels: novelObj }\n        });\n      }\n    });\n  }\n  function getNovelCatalog(novelId) {\n    $.ajax({\n      url: '/api/novel/catalog/' + novelId,\n      success: function success(result) {\n        var success = result.success;\n        var data = result.data;\n        var desc = result.desc;\n\n        if (success) {\n          dispatch({\n            type: _Consants2.default.GetNovelCatalog,\n            data: { novels: _defineProperty({}, data.id, data) }\n          });\n        } else {\n          $.notify(desc);\n        }\n      }\n    });\n  }\n  return { getMyNovels: getMyNovels, getNovelCatalog: getNovelCatalog };\n}\n\nexports.default = NovelActionFactory;\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(246)))\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/my/actions/NovelActionFactory.js\n ** module id = 643\n ** module chunks = 41\n **/\n//# sourceURL=webpack:///./src/entry/routes/my/actions/NovelActionFactory.js?");

/***/ },

/***/ 644:
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = {\n  GetMyNovels: 'GetMyNovels'\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/my/actions/Consants.js\n ** module id = 644\n ** module chunks = 41\n **/\n//# sourceURL=webpack:///./src/entry/routes/my/actions/Consants.js?");

/***/ }

});