webpackJsonp([1],{

/***/ 247:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Nav = __webpack_require__(248);
	
	var _Nav2 = _interopRequireDefault(_Nav);
	
	var _LayoutStyle = __webpack_require__(270);
	
	var _LayoutStyle2 = _interopRequireDefault(_LayoutStyle);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function Home() {
	  return _react2.default.createElement(
	    'div',
	    { name: 'home', style: _LayoutStyle2.default.stageCol },
	    _react2.default.createElement(_Nav2.default, null),
	    _react2.default.createElement(
	      'div',
	      { name: 'body', style: _LayoutStyle2.default.body },
	      _react2.default.createElement(
	        'h1',
	        null,
	        'this is the home page'
	      )
	    )
	  );
	}
	module.exports = Home;

/***/ },

/***/ 248:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(172);
	
	var _LoginControl = __webpack_require__(249);
	
	var _LoginControl2 = _interopRequireDefault(_LoginControl);
	
	var _navStyles = __webpack_require__(269);
	
	var _navStyles2 = _interopRequireDefault(_navStyles);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function Nav() {
	  return _react2.default.createElement(
	    'nav',
	    { style: _navStyles2.default.nav },
	    _react2.default.createElement(
	      _reactRouter.Link,
	      { to: '/home', activeStyle: _navStyles.ACTIVE, style: _navStyles2.default.link },
	      'home'
	    ),
	    _react2.default.createElement(
	      _reactRouter.Link,
	      { to: '/demos', activeStyle: _navStyles.ACTIVE, style: _navStyles2.default.link },
	      'demo'
	    ),
	    _react2.default.createElement(
	      _reactRouter.Link,
	      { to: '/video/view', activeStyle: _navStyles.ACTIVE, style: _navStyles2.default.link },
	      'video'
	    ),
	    _react2.default.createElement(
	      _reactRouter.Link,
	      { to: '/blog', activeStyle: _navStyles.ACTIVE, style: _navStyles2.default.link },
	      'blog'
	    ),
	    _react2.default.createElement(_LoginControl2.default, { style: { float: 'right' } })
	  );
	}
	
	exports.default = Nav;

/***/ },

/***/ 249:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(172);
	
	var _lodash = __webpack_require__(236);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _LoginControl = __webpack_require__(250);
	
	var _LoginControl2 = _interopRequireDefault(_LoginControl);
	
	var _classnames = __webpack_require__(254);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _DefaultHeaderIcon = __webpack_require__(255);
	
	var _DefaultHeaderIcon2 = _interopRequireDefault(_DefaultHeaderIcon);
	
	var _icons = __webpack_require__(256);
	
	var _icons2 = _interopRequireDefault(_icons);
	
	var _Login = __webpack_require__(257);
	
	var _Login2 = _interopRequireDefault(_Login);
	
	var _SvgIcon = __webpack_require__(265);
	
	var _SvgIcon2 = _interopRequireDefault(_SvgIcon);
	
	var _LoginAction = __webpack_require__(240);
	
	var _Stores = __webpack_require__(235);
	
	var _ImageAction = __webpack_require__(266);
	
	var _PathUtil = __webpack_require__(267);
	
	var _UserAction = __webpack_require__(268);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// LoginControl 登录控制
	
	var LoginControl = function (_React$Component) {
	  _inherits(LoginControl, _React$Component);
	
	  function LoginControl() {
	    var _Object$getPrototypeO;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, LoginControl);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(LoginControl)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      hide: true
	    }, _this.setHide = function (hide) {
	      _this.setState({
	        hide: hide
	      });
	    }, _this.clickSignIn = function (e) {
	      e.preventDefault();
	      e.stopPropagation();
	      _Login2.default.showSignIn();
	    }, _this.clickSignUp = function (e) {
	      e.preventDefault();
	      e.stopPropagation();
	      _Login2.default.showSignUp();
	    }, _this.clickMyBlog = function (userId) {
	      _this.props.router.push({ pathname: '/blog/user', query: { userId: userId } });
	    }, _this.handleFile = function (e) {
	      var file = e.target.files[0];
	      var successHandle = function successHandle(result) {
	        return (0, _UserAction.setHeaderIcon)(result.data, {
	          successHandle: function successHandle() {
	            return (0, _LoginAction.getUser)();
	          },
	          failHandle: function failHandle(r) {
	            return $.notify(r.desc);
	          }
	        });
	      };
	      var failHandle = function failHandle(result) {
	        return $.notify(result.desc);
	      };
	      var errHandle = function errHandle(err) {
	        return $.notify(err);
	      };
	      (0, _ImageAction.uploadImage)(file, { successHandle: successHandle, failHandle: failHandle, errHandle: errHandle });
	    }, _this.renderLoginBars = function (user) {
	      if (_lodash2.default.isUndefined(user) || !_lodash2.default.isEmpty(user)) {
	        return null;
	      }
	      return _react2.default.createElement(
	        'div',
	        { className: _LoginControl2.default.item },
	        _react2.default.createElement(
	          'a',
	          { className: _LoginControl2.default.item, onClick: _this.clickSignIn },
	          '登录'
	        ),
	        _react2.default.createElement(
	          'a',
	          { className: _LoginControl2.default.item, onClick: _this.clickSignUp },
	          '注册'
	        )
	      );
	    }, _this.renderUserInfo = function (user, hide) {
	      if (_lodash2.default.isEmpty(user)) {
	        return null;
	      }
	      return _react2.default.createElement(
	        'ul',
	        null,
	        _react2.default.createElement(
	          'li',
	          { className: _LoginControl2.default.item, onMouseLeave: function onMouseLeave() {
	              return _this.setHide(true);
	            } },
	          _react2.default.createElement(
	            'a',
	            { className: _LoginControl2.default.item },
	            _react2.default.createElement('img', {
	              src: (0, _PathUtil.imageURL)(user.headerIcon) || _DefaultHeaderIcon2.default,
	              className: _LoginControl2.default.headerImg,
	              alt: 'userIcon'
	            }),
	            _react2.default.createElement('input', {
	              type: 'file',
	              name: 'image',
	              className: _LoginControl2.default.upload,
	              accept: 'image/*',
	              onChange: _this.handleFile
	            })
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: _LoginControl2.default.item, onClick: function onClick() {
	                return _this.setHide(false);
	              } },
	            _react2.default.createElement(
	              'a',
	              { className: _LoginControl2.default.item },
	              user.name
	            ),
	            _react2.default.createElement(
	              'a',
	              { className: _LoginControl2.default.item, style: { padding: '5px' } },
	              _react2.default.createElement(_SvgIcon2.default, _icons2.default.arrowDown)
	            )
	          ),
	          _react2.default.createElement(
	            'ul',
	            { className: (0, _classnames2.default)(_LoginControl2.default.dropdown, _defineProperty({}, _LoginControl2.default.hide, hide)) },
	            _react2.default.createElement(
	              'li',
	              { onClick: function onClick() {
	                  return _this.clickMyBlog(user.id);
	                } },
	              '我的博客'
	            ),
	            _react2.default.createElement(
	              'li',
	              { onClick: _LoginAction.signOut },
	              '登出'
	            )
	          )
	        )
	      );
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(LoginControl, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var style = _props.style;
	      var user = _props.user;
	      var hide = this.state.hide;
	
	      return _react2.default.createElement(
	        'div',
	        { style: style },
	        this.renderLoginBars(user),
	        this.renderUserInfo(user, hide)
	      );
	    }
	  }]);
	
	  return LoginControl;
	}(_react2.default.Component);
	
	LoginControl.propTypes = {
	  user: _react.PropTypes.object
	};
	var propsFn = function propsFn(state) {
	  return {
	    user: state.user
	  };
	};
	exports.default = (0, _reactRouter.withRouter)((0, _Stores.connect)('app', { propsFn: propsFn }, LoginControl));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(239)))

/***/ },

/***/ 250:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(251);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./LoginControl.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./LoginControl.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 251:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".LoginControl__item___19ECg {\n  position: relative;\n  height: 60px;\n  line-height: 60px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  cursor: pointer;\n  font-size: 1.2rem;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  margin: 0 3px; }\n\n.LoginControl__headerImg___2s6Z9 {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  margin: 10px 0; }\n\n.LoginControl__upload___2Qkkn {\n  position: absolute;\n  opacity: 0;\n  left: 0;\n  cursor: pointer;\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  margin: 10px; }\n\n.LoginControl__dropdown___XT10X {\n  position: absolute;\n  background-color: #d5d5d5;\n  color: #191919;\n  z-index: 2;\n  width: 120px;\n  list-style: none;\n  right: 0;\n  top: 60px; }\n\n.LoginControl__dropdown___XT10X li {\n  height: 40px;\n  line-height: 40px;\n  padding-left: 15px; }\n\n.LoginControl__hide___159sX {\n  display: none; }\n", ""]);
	
	// exports
	exports.locals = {
		"item": "LoginControl__item___19ECg",
		"headerImg": "LoginControl__headerImg___2s6Z9",
		"upload": "LoginControl__upload___2Qkkn",
		"dropdown": "LoginControl__dropdown___XT10X",
		"hide": "LoginControl__hide___159sX"
	};

/***/ },

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

/***/ 254:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */
	
	(function () {
		'use strict';
	
		var hasOwn = {}.hasOwnProperty;
	
		function classNames () {
			var classes = [];
	
			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;
	
				var argType = typeof arg;
	
				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					classes.push(classNames.apply(null, arg));
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}
	
			return classes.join(' ');
		}
	
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ },

/***/ 255:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAUABQAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+t+KKPxo/GgA70Yo/Gj8aADFH4VesdC1HUl3WtjcXCf344yV/PGKW+0HUtNXddWNzbp/fkjIX88YoAofhR+FH40fjQAfhR+FH40fjQAUUUUAFepeAPh5D9li1LVYhK8g3Q27j5VXszDuT6f5HA+FtOXVvEWn2rjMcko3j1UckfkDX0MBgYHAoARVCKFUBVHAA6ClZQwKkZBGCDS0UAec+Pvh3BJay6lpUQimjBeW3QYVx3Kjsfbv/PyqvpuvnvxfpqaT4l1C1QbY0lJUDsrfMB+RoAyKKKKACiiigDa8GXq6f4p02eQgIJQpJ7Bvlz+tfQP4V8yDg17P4A8cw65ZxWV5IE1KMbfmP+uA7j39R+NAHaUfhSUUAL+FeA+OL1NQ8WalNGQU83YCO+0Bf6V6b498cQ6BZyWlrIJNSkXaApz5QP8AEff0FeKk5OTyTQAUUUUAH40fjRU1naTX93DbQIXmlYIijuTQBc0Dw/eeI74W1mm49XkbhUHqTXsHhz4eaXoCpI8YvbscmaYZAP8Asr0H8/etHwv4cg8M6XHaxANIfmllxy7dz9PStigA/Gk/GlooA5bxJ8PdL19XkWMWd43PnwjGT/tL0P8AP3rx/X/D954cvjbXibT1SReVceoNfRFZHijw5B4m0uS1lAWQfNFLjlG7H6etAHz5+NH41NeWk1hdzW06FJonKMp7EGoaACvQfhBowudTudRkXK2y7I8j+Nup/Afzrz6vafhRaCDwmkgHM8zufwO3/wBloA7Kiij8KACkpaSgBaSj8KKAPJvi/owttTttRjXC3K7JMf3l6H8R/KvPq9p+K1qJ/CbyEcwTI4P1O3/2avFqAP/Z"

/***/ },

/***/ 256:
/***/ function(module, exports) {

	module.exports = {
		"arrowDown": {
			"paths": [
				"M0 384l383.75 383.75 383.75-383.75h-767.5z"
			],
			"position": [
				1,
				0
			]
		}
	};

/***/ },

/***/ 257:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _SignIn = __webpack_require__(258);
	
	var _SignIn2 = _interopRequireDefault(_SignIn);
	
	var _SignUp = __webpack_require__(262);
	
	var _SignUp2 = _interopRequireDefault(_SignUp);
	
	var _lodash = __webpack_require__(236);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var styles = {
	  cover: {
	    left: 0,
	    top: 0,
	    position: 'fixed',
	    width: '100vw',
	    height: '100vh',
	    backgroundColor: 'rgba(0, 0, 0, 0.2)',
	    zIndex: 10
	  },
	  stage: {
	    position: 'relative',
	    backgroundColor: '#fff',
	    margin: '200px auto 0',
	    width: '360px',
	    height: 'auto'
	  },
	  header: {
	    marginLeft: '20px',
	    marginRight: '20px'
	  },
	  tab: {
	    display: 'inline-block',
	    padding: '0px 15px',
	    height: '50px',
	    lineHeight: '50px',
	    fontWeight: '500',
	    textAlign: 'center',
	    cursor: 'pointer'
	  },
	  activeTab: {
	    borderBottom: '2px solid red'
	  },
	  body: {
	    marginTop: '-1px',
	    marginLeft: '20px',
	    marginRight: '20px',
	    paddingTop: '20px',
	    borderTop: '1px solid #ddd'
	  },
	  hide: {
	    display: 'none'
	  }
	};
	
	var Login = function (_React$Component) {
	  _inherits(Login, _React$Component);
	
	  function Login() {
	    var _Object$getPrototypeO;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Login);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Login)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      status: 'None'
	    }, _this.showSignIn = function () {
	      _this.setState({
	        status: 'SignIn'
	      });
	    }, _this.showSignUp = function () {
	      _this.setState({
	        status: 'SignUp'
	      });
	    }, _this.handleClick = function (e) {
	      if (e.target === e.currentTarget) {
	        _this.hide();
	      }
	    }, _this.hide = function () {
	      _this.setState({
	        status: 'None'
	      });
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(Login, [{
	    key: 'render',
	    value: function render() {
	      var status = this.state.status;
	
	      var loginStyle = _lodash2.default.merge({}, styles.cover, status === 'None' ? styles.hide : {});
	      var inTabStyle = _lodash2.default.merge({}, styles.tab, status === 'SignIn' ? styles.activeTab : {});
	      var upTabStyle = _lodash2.default.merge({}, styles.tab, status === 'SignUp' ? styles.activeTab : {});
	      return _react2.default.createElement(
	        'div',
	        {
	          name: 'login',
	          style: loginStyle,
	          onClick: this.handleClick
	        },
	        _react2.default.createElement(
	          'div',
	          { style: styles.stage },
	          _react2.default.createElement(
	            'div',
	            { style: styles.header },
	            _react2.default.createElement(
	              'div',
	              { style: inTabStyle, onClick: this.showSignIn },
	              '登 录'
	            ),
	            _react2.default.createElement(
	              'div',
	              { style: upTabStyle, onClick: this.showSignUp },
	              '注 册'
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { style: styles.body },
	            status === 'SignIn' ? _react2.default.createElement(_SignIn2.default, null) : null,
	            status === 'SignUp' ? _react2.default.createElement(_SignUp2.default, null) : null
	          )
	        )
	      );
	    }
	  }]);
	
	  return Login;
	}(_react2.default.Component);
	
	var anchor = document.createElement('div');
	anchor.setAttribute('name', 'login-anchor');
	document.body.appendChild(anchor);
	
	exports.default = _reactDom2.default.render(_react2.default.createElement(Login, null), anchor);

/***/ },

/***/ 258:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _InputStyle = __webpack_require__(259);
	
	var _InputStyle2 = _interopRequireDefault(_InputStyle);
	
	var _LoginAction = __webpack_require__(240);
	
	var _SignIn = __webpack_require__(260);
	
	var _SignIn2 = _interopRequireDefault(_SignIn);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SignIn = function (_React$Component) {
	  _inherits(SignIn, _React$Component);
	
	  function SignIn() {
	    var _Object$getPrototypeO;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, SignIn);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(SignIn)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      username: '',
	      password: ''
	    }, _this.handleUsername = function (e) {
	      _this.setState({
	        username: e.target.value
	      });
	    }, _this.handlePassword = function (e) {
	      _this.setState({
	        password: e.target.value
	      });
	    }, _this.handleSignin = function (e) {
	      e.preventDefault();
	      e.stopPropagation();
	      var user = {
	        username: _this.state.username,
	        password: _this.state.password
	      };
	      var successHandle = function successHandle() {
	        return location.reload();
	      };
	      var failHandle = function failHandle(result) {
	        return console.log(result.desc);
	      };
	      var errHandle = function errHandle(err) {
	        return console.log(err);
	      };
	      (0, _LoginAction.signIn)(user, { successHandle: successHandle, failHandle: failHandle, errHandle: errHandle });
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(SignIn, [{
	    key: 'render',
	    value: function render() {
	      var _state = this.state;
	      var username = _state.username;
	      var password = _state.password;
	
	      return _react2.default.createElement(
	        'form',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: _SignIn2.default.formGroup },
	          _react2.default.createElement('label', { htmlFor: 'form-username' }),
	          _react2.default.createElement('input', {
	            key: 'username',
	            type: 'text',
	            placeholder: 'Username...',
	            style: _InputStyle2.default.normal,
	            value: username,
	            onChange: this.handleUsername
	          })
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: _SignIn2.default.formGroup },
	          _react2.default.createElement('label', { htmlFor: 'form-password' }),
	          _react2.default.createElement('input', {
	            key: 'password',
	            type: 'password',
	            name: 'form-password',
	            placeholder: 'Password...',
	            style: _InputStyle2.default.normal,
	            value: password,
	            onChange: this.handlePassword
	          })
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: _SignIn2.default.formGroup },
	          _react2.default.createElement(
	            'button',
	            { className: _SignIn2.default.button, onClick: this.handleSignin },
	            '登 录'
	          )
	        )
	      );
	    }
	  }]);
	
	  return SignIn;
	}(_react2.default.Component);
	
	exports.default = SignIn;

/***/ },

/***/ 259:
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  normal: {
	    display: 'block',
	    width: '100%',
	    height: '36px',
	    padding: '6px 12px',
	    fontSize: '14px',
	    lineHeight: '1.42857143',
	    color: '#555555',
	    backgroundColor: '#ffffff!important',
	    backgroundImage: 'none',
	    border: '1px solid #e4e4e4',
	    borderRadius: '0px',
	    transition: 'border-color ease-in-out .15s, box-shadow ease-in-out .15s',
	    outline: 'none',
	    ':focus': {
	      outline: 'none',
	      border: '1px solid rgba(104, 184, 40, 0.5)'
	    }
	  }
	};

/***/ },

/***/ 260:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(261);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./SignIn.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./SignIn.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 261:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".SignIn__formGroup___3ZYMT {\n  position: relative;\n  padding-bottom: 20px; }\n\n.SignIn__button____PfFe {\n  height: 40px;\n  width: 100%;\n  font-size: 16px;\n  margin-bottom: 10px;\n  border: 1px solid #507100;\n  background-color: yellowgreen; }\n\n.SignIn__button____PfFe:hover {\n  background-color: #9ad425; }\n", ""]);
	
	// exports
	exports.locals = {
		"formGroup": "SignIn__formGroup___3ZYMT",
		"button": "SignIn__button____PfFe"
	};

/***/ },

/***/ 262:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _InputStyle = __webpack_require__(259);
	
	var _InputStyle2 = _interopRequireDefault(_InputStyle);
	
	var _SignUp = __webpack_require__(263);
	
	var _SignUp2 = _interopRequireDefault(_SignUp);
	
	var _LoginAction = __webpack_require__(240);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SignUp = function (_React$Component) {
	  _inherits(SignUp, _React$Component);
	
	  function SignUp() {
	    var _Object$getPrototypeO;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, SignUp);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(SignUp)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      username: '',
	      password: '',
	      name: ''
	    }, _this.handleUsername = function (e) {
	      _this.setState({
	        username: e.target.value
	      });
	    }, _this.handlePassword = function (e) {
	      _this.setState({
	        password: e.target.value
	      });
	    }, _this.handleName = function (e) {
	      _this.setState({
	        name: e.target.value
	      });
	    }, _this.handleSignUp = function (e) {
	      e.preventDefault();
	      e.stopPropagation();
	      var user = {
	        username: _this.state.username,
	        password: _this.state.password,
	        name: _this.state.name
	      };
	      var successHandle = function successHandle() {
	        return location.reload();
	      };
	      var failHandle = function failHandle(result) {
	        return console.log(result.desc);
	      };
	      var errHandle = function errHandle(err) {
	        return console.log(err);
	      };
	      (0, _LoginAction.signUp)(user, { successHandle: successHandle, failHandle: failHandle, errHandle: errHandle });
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(SignUp, [{
	    key: 'render',
	    value: function render() {
	      var _state = this.state;
	      var username = _state.username;
	      var password = _state.password;
	      var name = _state.name;
	
	      return _react2.default.createElement(
	        'form',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: _SignUp2.default.formGroup },
	          _react2.default.createElement('label', { htmlFor: 'form-username' }),
	          _react2.default.createElement('input', {
	            key: 'username',
	            type: 'text',
	            placeholder: 'Username...',
	            style: _InputStyle2.default.normal,
	            value: username,
	            onChange: this.handleUsername
	          })
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: _SignUp2.default.formGroup },
	          _react2.default.createElement('label', { htmlFor: 'form-password' }),
	          _react2.default.createElement('input', {
	            key: 'password',
	            type: 'password',
	            name: 'form-password',
	            placeholder: 'Password...',
	            style: _InputStyle2.default.normal,
	            value: password,
	            onChange: this.handlePassword
	          })
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: _SignUp2.default.formGroup },
	          _react2.default.createElement('label', { htmlFor: 'form-name' }),
	          _react2.default.createElement('input', {
	            key: 'name',
	            type: 'text',
	            name: 'form-name',
	            placeholder: 'name...',
	            style: _InputStyle2.default.normal,
	            value: name,
	            onChange: this.handleName
	          })
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: _SignUp2.default.formGroup },
	          _react2.default.createElement(
	            'button',
	            { className: _SignUp2.default.button, onClick: this.handleSignUp },
	            '注 册'
	          )
	        )
	      );
	    }
	  }]);
	
	  return SignUp;
	}(_react2.default.Component);
	
	exports.default = SignUp;

/***/ },

/***/ 263:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(264);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./SignUp.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./SignUp.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 264:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".SignUp__formGroup___26k0l {\n  position: relative;\n  padding-bottom: 20px; }\n\n.SignUp__button___3Z40t {\n  height: 40px;\n  width: 100%;\n  font-size: 16px;\n  margin-bottom: 10px;\n  border: 1px solid #507100;\n  background-color: yellowgreen; }\n\n.SignUp__button___3Z40t:hover {\n  background-color: #9ad425; }\n", ""]);
	
	// exports
	exports.locals = {
		"formGroup": "SignUp__formGroup___26k0l",
		"button": "SignUp__button___3Z40t"
	};

/***/ },

/***/ 265:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SvgIcon = function (_React$Component) {
	  _inherits(SvgIcon, _React$Component);
	
	  function SvgIcon() {
	    var _Object$getPrototypeO;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, SvgIcon);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(SvgIcon)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.getTransform = function (position, direction, size, realIconSize) {
	      var scaleW = size[0] / realIconSize[0];
	      var scaleH = size[1] / realIconSize[1];
	      return 'translate(' + position.join(', ') + ')\n    scale(' + direction.join(', ') + ' ) scale(' + scaleW + ',' + scaleH + ')';
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(SvgIcon, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var paths = _props.paths;
	      var size = _props.size;
	      var position = _props.position;
	      var direction = _props.direction;
	      var realIconSize = _props.realIconSize;
	      var style = _props.style;
	      var className = _props.className;
	      var onClick = _props.onClick;
	
	      return _react2.default.createElement(
	        'svg',
	        {
	          style: style,
	          className: className,
	          width: size[0],
	          height: size[1],
	          onClick: onClick
	        },
	        _react2.default.createElement(
	          'g',
	          { transform: this.getTransform(position, direction, size, realIconSize) },
	          paths.map(function (path, i) {
	            return _react2.default.createElement('path', { key: i, d: path });
	          })
	        )
	      );
	    }
	  }]);
	
	  return SvgIcon;
	}(_react2.default.Component);
	
	SvgIcon.defaultProps = {
	  size: [16, 16],
	  position: [0, 0],
	  direction: [1, 1],
	  realIconSize: [1024, 1024]
	};
	SvgIcon.propTypes = {
	  onClick: _react.PropTypes.func,
	  paths: _react.PropTypes.arrayOf(_react.PropTypes.string).isRequired,
	  size: _react.PropTypes.arrayOf(_react.PropTypes.number),
	  position: _react.PropTypes.arrayOf(_react.PropTypes.number),
	  direction: _react.PropTypes.arrayOf(_react.PropTypes.number),
	  realIconSize: _react.PropTypes.arrayOf(_react.PropTypes.number)
	};
	exports.default = SvgIcon;

/***/ },

/***/ 266:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.uploadImage = uploadImage;
	
	var _superagent = __webpack_require__(241);
	
	var _superagent2 = _interopRequireDefault(_superagent);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function uploadImage(image, _ref) {
	  var successHandle = _ref.successHandle;
	  var failHandle = _ref.failHandle;
	  var errHandle = _ref.errHandle;
	
	  var formData = new FormData();
	  formData.append('fileType', image.type);
	  formData.append('image', image);
	  _superagent2.default.post('/api/image/add').send(formData).then(function (res) {
	    var result = JSON.parse(res.text);
	    if (result.success && successHandle) {
	      successHandle(result);
	    } else if (!result.success && failHandle) {
	      failHandle(result);
	    }
	  }, function (err) {
	    if (errHandle) {
	      errHandle(err);
	    }
	  });
	}

/***/ },

/***/ 267:
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.imageURL = imageURL;
	function imageURL(filename) {
	  if (!filename) {
	    return filename;
	  }
	  return "/resources/imgs/" + filename.substr(0, 3) + "/" + filename;
	}

/***/ },

/***/ 268:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setHeaderIcon = setHeaderIcon;
	
	var _superagent = __webpack_require__(241);
	
	var _superagent2 = _interopRequireDefault(_superagent);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function setHeaderIcon(filename, _ref) {
	  var successHandle = _ref.successHandle;
	  var failHandle = _ref.failHandle;
	  var errHandle = _ref.errHandle;
	
	  _superagent2.default.put('/api/user/headerIcon').set('Content-Type', 'application/x-www-form-urlencoded').send({ filename: filename }).then(function (res) {
	    var result = JSON.parse(res.text);
	    if (result.success && successHandle) {
	      successHandle(result);
	    } else if (!result.success && failHandle) {
	      failHandle(result);
	    }
	  }, function (err) {
	    if (errHandle) {
	      errHandle(err);
	    }
	  });
	}

/***/ },

/***/ 269:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var HEIGHT = '60px';
	
	var styles = {
	  nav: {
	    position: 'relative',
	    width: '100%',
	    height: HEIGHT,
	    lineHeight: HEIGHT,
	    backgroundColor: '#ffffff',
	    padding: '0 45px',
	    color: '#000000'
	  },
	  link: {
	    textDecoration: 'initial',
	    textAlign: 'center',
	    height: HEIGHT,
	    width: '65px',
	    color: '#000000',
	    lineHeight: HEIGHT,
	    fontSize: '1.2rem',
	    fontWeight: 'bold',
	    display: 'inline-block',
	    margin: '0 10px',
	    cursor: 'pointer'
	  }
	};
	exports.default = styles;
	var ACTIVE = exports.ACTIVE = {
	  borderBottom: 'solid 2px #ff9f1f'
	};

/***/ },

/***/ 270:
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  stageRow: {
	    position: 'relative',
	    height: '100%',
	    width: '100%',
	    display: 'flex'
	  },
	  stageCol: {
	    position: 'relative',
	    height: '100%',
	    width: '100%',
	    display: 'flex',
	    flexDirection: 'column'
	  },
	  body: {
	    flex: 1,
	    overflow: 'auto',
	    position: 'relative'
	  }
	};

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2hvbWUvSG9tZS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbmF2L25hdi5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW5Db250cm9sL0xvZ2luQ29udHJvbC5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW5Db250cm9sL0xvZ2luQ29udHJvbC5zY3NzPzQyZTQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW5Db250cm9sL0xvZ2luQ29udHJvbC5zY3NzIiwid2VicGFjazovLy8uL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanM/ZGEwNCIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanM/Yjk4MCIsIndlYnBhY2s6Ly8vLi9+L2NsYXNzbmFtZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2ltYWdlcy9kZWZhdWx0SGVhZGVySWNvbi5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW5Db250cm9sL2ljb25zLmpzb24iLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW4vTG9naW4uanN4Iiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9jb21wb25lbnRzL2xvZ2luL1NpZ25Jbi5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2Zvcm1zL2lucHV0LnN0eWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9jb21wb25lbnRzL2xvZ2luL1NpZ25Jbi5zY3NzPzUyNDQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW4vU2lnbkluLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW4vU2lnblVwLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvY29tcG9uZW50cy9sb2dpbi9TaWduVXAuc2Nzcz81YzM2Iiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9jb21wb25lbnRzL2xvZ2luL1NpZ25VcC5zY3NzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3N2Z0ljb24vU3ZnSWNvbi5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2FjdGlvbnMvaW1hZ2VBY3Rpb24uanN4Iiwid2VicGFjazovLy8uL3NyYy9lbnRyeS91dGlscy9wYXRodXRpbC5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2FjdGlvbnMvdXNlckFjdGlvbi5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbmF2L25hdi5zdHlsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2xheW91dC5zdHlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFFQTs7OztBQUVBOzs7Ozs7QUFFQSxVQUFTLElBQVQsR0FBZ0I7QUFDZCxVQUNFO0FBQUE7QUFBQSxPQUFLLE1BQUssTUFBVixFQUFpQixPQUFPLHNCQUFZLFFBQXBDO0FBQ0UsdURBREY7QUFFRTtBQUFBO0FBQUEsU0FBSyxNQUFLLE1BQVYsRUFBaUIsT0FBTyxzQkFBWSxJQUFwQztBQUNFO0FBQUE7QUFBQTtBQUFLO0FBQUw7QUFERjtBQUZGLElBREY7QUFRRDtBQUNELFFBQU8sT0FBUCxHQUFpQixJQUFqQixDOzs7Ozs7Ozs7Ozs7O0FDaEJBOzs7O0FBRUE7O0FBRUE7Ozs7QUFFQTs7Ozs7O0FBRUEsVUFBUyxHQUFULEdBQWU7QUFDYixVQUNFO0FBQUE7QUFBQSxPQUFLLE9BQU8sb0JBQU8sR0FBbkI7QUFDRTtBQUFBO0FBQUEsU0FBTSxJQUFHLE9BQVQsRUFBaUIsOEJBQWpCLEVBQXNDLE9BQU8sb0JBQU8sSUFBcEQ7QUFBQTtBQUFBLE1BREY7QUFJRTtBQUFBO0FBQUEsU0FBTSxJQUFHLFFBQVQsRUFBa0IsOEJB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OztBQUVBLEtBQU0sU0FBUztBQUNiLFFBQUs7QUFDSCxlQUFVLFVBRFA7QUFFSCxZQUFPLE1BRko7QUFHSCxhQUFRLE1BSEw7QUFJSCxpQkFBWSxNQUpUO0FBS0gsc0JBQWlCLFNBTGQ7QUFNSCxjQUFTLFFBTk47QUFPSCxZQUFPO0FBUEosSUFEUTtBQVViLFNBQU07QUFDSixxQkFBZ0IsU0FEWjtBQUVKLGdCQUFXLFFBRlA7QUFHSixhQUFRLE1BSEo7QUFJSixZQUFPLE1BSkg7QUFLSixZQUFPLFNBTEg7QUFNSixpQkFBWSxNQU5SO0FBT0osZUFBVSxRQVBOO0FBUUosaUJBQVksTUFSUjtBQVNKLGNBQVMsY0FUTDtBQVVKLGFBQVEsUUFWSjtBQVdKLGFBQVE7QUFYSjtBQVZPLEVBQWY7bUJBd0JlLE07QUFDUixLQUFNLDBCQUFTO0FBQ3BCLGlCQUFjO0FBRE0sRUFBZixDOzs7Ozs7Ozs7QUMzQlAsUUFBTyxPQUFQLEdBQWlCO0FBQ2YsYUFBVTtBQUNSLGVBQVUsVUFERjtBQUVSLGFBQVEsTUFGQTtBQUdSLFlBQU8sTUFIQztBQUlSLGNBQVM7QUFKRCxJQURLO0FBT2YsYUFBVTtBQUNSLGVBQVUsVUFERjtBQUVSLGFBQVEsTUFGQTtBQUdSLFlBQU8sTUFIQztBQUlSLGNBQVMsTUFKRDtBQUtSLG9CQUFlO0FBTFAsSUFQSztBQWNmLFNBQU07QUFDSixXQUFNLENBREY7QUFFSixlQUFVLE1BRk47QUFHSixlQUFVO0FBSE47QUFkUyxFQUFqQixDIiwiZmlsZSI6ImpzLzEtMGMxNzcwNDBjNDVkMjViOTE3YjMuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5cbmltcG9ydCBOYXYgZnJvbSAnTmF2J1xuXG5pbXBvcnQgTGF5b3V0U3R5bGUgZnJvbSAnTGF5b3V0U3R5bGUnXG5cbmZ1bmN0aW9uIEhvbWUoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBuYW1lPVwiaG9tZVwiIHN0eWxlPXtMYXlvdXRTdHlsZS5zdGFnZUNvbH0+XG4gICAgICA8TmF2IC8+XG4gICAgICA8ZGl2IG5hbWU9XCJib2R5XCIgc3R5bGU9e0xheW91dFN0eWxlLmJvZHl9PlxuICAgICAgICA8aDE+eyd0aGlzIGlzIHRoZSBob21lIHBhZ2UnfTwvaDE+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxubW9kdWxlLmV4cG9ydHMgPSBIb21lXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvaG9tZS9Ib21lLmpzeFxuICoqLyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcblxuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcidcblxuaW1wb3J0IExvZ2luQ29udHJvbCBmcm9tICdMb2dpbkNvbnRyb2wnXG5cbmltcG9ydCBzdHlsZXMsIHsgQUNUSVZFIH0gZnJvbSAnLi9uYXYuc3R5bGVzLmpzJ1xuXG5mdW5jdGlvbiBOYXYoKSB7XG4gIHJldHVybiAoXG4gICAgPG5hdiBzdHlsZT17c3R5bGVzLm5hdn0+XG4gICAgICA8TGluayB0bz1cIi9ob21lXCIgYWN0aXZlU3R5bGU9e0FDVElWRX0gc3R5bGU9e3N0eWxlcy5saW5rfT5cbiAgICAgICAgaG9tZVxuICAgICAgPC9MaW5rPlxuICAgICAgPExpbmsgdG89XCIvZGVtb3NcIiBhY3RpdmVTdHlsZT17QUNUSVZFfSBzdHlsZT17c3R5bGVzLmxpbmt9PlxuICAgICAgICBkZW1vXG4gICAgICA8L0xpbms+XG4gICAgICA8TGluayB0bz1cIi92aWRlby92aWV3XCIgYWN0aXZlU3R5bGU9e0FDVElWRX0gc3R5bGU9e3N0eWxlcy5saW5rfT5cbiAgICAgICAgdmlkZW9cbiAgICAgIDwvTGluaz5cbiAgICAgIDxMaW5rIHRvPVwiL2Jsb2dcIiBhY3RpdmVTdHlsZT17QUNUSVZFfSBzdHlsZT17c3R5bGVzLmxpbmt9PlxuICAgICAgICBibG9nXG4gICAgICA8L0xpbms+XG4gICAgICA8TG9naW5Db250cm9sIHN0eWxlPXt7IGZsb2F0OiAncmlnaHQnIH19IC8+XG4gICAgPC9uYXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTmF2XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9jb21wb25lbnRzL25hdi9uYXYuanN4XG4gKiovIiwiaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlcidcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGNzcyBmcm9tICcuL0xvZ2luQ29udHJvbC5zY3NzJ1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnXG5pbXBvcnQgRGVmYXVsdEhlYWRlckljb24gZnJvbSAnRGVmYXVsdEhlYWRlckljb24nXG5pbXBvcnQgaWNvbnMgZnJvbSAnLi9pY29ucy5qc29uJ1xuaW1wb3J0IExvZ2luIGZyb20gJ0xvZ2luJ1xuaW1wb3J0IFN2Z0ljb24gZnJvbSAnU3ZnSWNvbidcbmltcG9ydCB7IHNpZ25PdXQsIGdldFVzZXIgfSBmcm9tICdMb2dpbkFjdGlvbidcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdTdG9yZXMnXG5pbXBvcnQgeyB1cGxvYWRJbWFnZSB9IGZyb20gJ0ltYWdlQWN0aW9uJ1xuaW1wb3J0IHsgaW1hZ2VVUkwgfSBmcm9tICdQYXRoVXRpbCdcbmltcG9ydCB7IHNldEhlYWRlckljb24gfSBmcm9tICdVc2VyQWN0aW9uJ1xuXG4vLyBMb2dpbkNvbnRyb2wg55m75b2V5o6n5Yi2XG5jbGFzcyBMb2dpbkNvbnRyb2wgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0ZSA9IHtcbiAgICBoaWRlOiB0cnVlLFxuICB9XG4gIHNldEhpZGUgPSAoaGlkZSkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaGlkZSxcbiAgICB9KVxuICB9XG4gIGNsaWNrU2lnbkluID0gKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgTG9naW4uc2hvd1NpZ25JbigpXG4gIH1cbiAgY2xpY2tTaWduVXAgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICBMb2dpbi5zaG93U2lnblVwKClcbiAgfVxuICBjbGlja015QmxvZyA9ICh1c2VySWQpID0+IHtcbiAgICB0aGlzLnByb3BzLnJvdXRlci5wdXNoKHsgcGF0aG5hbWU6ICcvYmxvZy91c2VyJywgcXVlcnk6IHsgdXNlcklkIH0gfSlcbiAgfVxuICBoYW5kbGVGaWxlID0gKGUpID0+IHtcbiAgICBjb25zdCBmaWxlID0gZS50YXJnZXQuZmlsZXNbMF1cbiAgICBjb25zdCBzdWNjZXNzSGFuZGxlID0gKHJlc3VsdCkgPT4gc2V0SGVhZGVySWNvbihyZXN1bHQuZGF0YSwge1xuICAgICAgc3VjY2Vzc0hhbmRsZTogKCkgPT4gZ2V0VXNlcigpLFxuICAgICAgZmFpbEhhbmRsZTogKHIpID0+ICQubm90aWZ5KHIuZGVzYyksXG4gICAgfSlcbiAgICBjb25zdCBmYWlsSGFuZGxlID0gKHJlc3VsdCkgPT4gJC5ub3RpZnkocmVzdWx0LmRlc2MpXG4gICAgY29uc3QgZXJySGFuZGxlID0gKGVycikgPT4gJC5ub3RpZnkoZXJyKVxuICAgIHVwbG9hZEltYWdlKGZpbGUsIHsgc3VjY2Vzc0hhbmRsZSwgZmFpbEhhbmRsZSwgZXJySGFuZGxlIH0pXG4gIH1cbiAgcmVuZGVyTG9naW5CYXJzID0gKHVzZXIpID0+IHtcbiAgICBpZiAoXy5pc1VuZGVmaW5lZCh1c2VyKSB8fCAhXy5pc0VtcHR5KHVzZXIpKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2Nzcy5pdGVtfT5cbiAgICAgICAgPGEgY2xhc3NOYW1lPXtjc3MuaXRlbX0gb25DbGljaz17dGhpcy5jbGlja1NpZ25Jbn0+eyfnmbvlvZUnfTwvYT5cbiAgICAgICAgPGEgY2xhc3NOYW1lPXtjc3MuaXRlbX0gb25DbGljaz17dGhpcy5jbGlja1NpZ25VcH0+eyfms6jlhownfTwvYT5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuICByZW5kZXJVc2VySW5mbyA9ICh1c2VyLCBoaWRlKSA9PiB7XG4gICAgaWYgKF8uaXNFbXB0eSh1c2VyKSkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDx1bD5cbiAgICAgICAgPGxpIGNsYXNzTmFtZT17Y3NzLml0ZW19IG9uTW91c2VMZWF2ZT17KCkgPT4gdGhpcy5zZXRIaWRlKHRydWUpfT5cbiAgICAgICAgICA8YSBjbGFzc05hbWU9e2Nzcy5pdGVtfT5cbiAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgc3JjPXtpbWFnZVVSTCh1c2VyLmhlYWRlckljb24pIHx8IERlZmF1bHRIZWFkZXJJY29ufVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2Nzcy5oZWFkZXJJbWd9XG4gICAgICAgICAgICAgIGFsdD1cInVzZXJJY29uXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgICAgICBuYW1lPVwiaW1hZ2VcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2Nzcy51cGxvYWR9XG4gICAgICAgICAgICAgIGFjY2VwdD1cImltYWdlLypcIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVGaWxlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2E+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Nzcy5pdGVtfSBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldEhpZGUoZmFsc2UpfT5cbiAgICAgICAgICAgIDxhIGNsYXNzTmFtZT17Y3NzLml0ZW19PlxuICAgICAgICAgICAgICB7dXNlci5uYW1lfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPGEgY2xhc3NOYW1lPXtjc3MuaXRlbX0gc3R5bGU9e3sgcGFkZGluZzogJzVweCcgfX0+XG4gICAgICAgICAgICAgIDxTdmdJY29uIHsuLi5pY29ucy5hcnJvd0Rvd259IC8+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHVsIGNsYXNzTmFtZT17Y3goY3NzLmRyb3Bkb3duLCB7IFtjc3MuaGlkZV06IGhpZGUgfSl9PlxuICAgICAgICAgICAgPGxpIG9uQ2xpY2s9eygpID0+IHRoaXMuY2xpY2tNeUJsb2codXNlci5pZCl9Pnsn5oiR55qE5Y2a5a6iJ308L2xpPlxuICAgICAgICAgICAgPGxpIG9uQ2xpY2s9e3NpZ25PdXR9Pnsn55m75Ye6J308L2xpPlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvbGk+XG4gICAgICA8L3VsPlxuICAgIClcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBzdHlsZSwgdXNlciB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IHsgaGlkZSB9ID0gdGhpcy5zdGF0ZVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZX0+XG4gICAgICAgIHt0aGlzLnJlbmRlckxvZ2luQmFycyh1c2VyKX1cbiAgICAgICAge3RoaXMucmVuZGVyVXNlckluZm8odXNlciwgaGlkZSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuTG9naW5Db250cm9sLnByb3BUeXBlcyA9IHtcbiAgdXNlcjogUHJvcFR5cGVzLm9iamVjdCxcbn1cbmNvbnN0IHByb3BzRm4gPSAoc3RhdGUpID0+ICh7XG4gIHVzZXI6IHN0YXRlLnVzZXIsXG59KVxuZXhwb3J0IGRlZmF1bHQgd2l0aFJvdXRlcihjb25uZWN0KCdhcHAnLCB7IHByb3BzRm4gfSwgTG9naW5Db250cm9sKSlcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW5Db250cm9sL0xvZ2luQ29udHJvbC5qc3hcbiAqKi8iLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9Mb2dpbkNvbnRyb2wuc2Nzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vTG9naW5Db250cm9sLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vTG9naW5Db250cm9sLnNjc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvY29tcG9uZW50cy9sb2dpbkNvbnRyb2wvTG9naW5Db250cm9sLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSAyNTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyNCAyNiAzMlxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLkxvZ2luQ29udHJvbF9faXRlbV9fXzE5RUNnIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGhlaWdodDogNjBweDtcXG4gIGxpbmUtaGVpZ2h0OiA2MHB4O1xcbiAgZGlzcGxheTogLXdlYmtpdC1ib3g7XFxuICBkaXNwbGF5OiAtbXMtZmxleGJveDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBmb250LXNpemU6IDEuMnJlbTtcXG4gIC13ZWJraXQtYm94LWFsaWduOiBjZW50ZXI7XFxuICAgICAgLW1zLWZsZXgtYWxpZ246IGNlbnRlcjtcXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIG1hcmdpbjogMCAzcHg7IH1cXG5cXG4uTG9naW5Db250cm9sX19oZWFkZXJJbWdfX18yczZaOSB7XFxuICB3aWR0aDogNDBweDtcXG4gIGhlaWdodDogNDBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gIG1hcmdpbjogMTBweCAwOyB9XFxuXFxuLkxvZ2luQ29udHJvbF9fdXBsb2FkX19fMlFra24ge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgb3BhY2l0eTogMDtcXG4gIGxlZnQ6IDA7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICB3aWR0aDogNDBweDtcXG4gIGhlaWdodDogNDBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gIG1hcmdpbjogMTBweDsgfVxcblxcbi5Mb2dpbkNvbnRyb2xfX2Ryb3Bkb3duX19fWFQxMFgge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Q1ZDVkNTtcXG4gIGNvbG9yOiAjMTkxOTE5O1xcbiAgei1pbmRleDogMjtcXG4gIHdpZHRoOiAxMjBweDtcXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XFxuICByaWdodDogMDtcXG4gIHRvcDogNjBweDsgfVxcblxcbi5Mb2dpbkNvbnRyb2xfX2Ryb3Bkb3duX19fWFQxMFggbGkge1xcbiAgaGVpZ2h0OiA0MHB4O1xcbiAgbGluZS1oZWlnaHQ6IDQwcHg7XFxuICBwYWRkaW5nLWxlZnQ6IDE1cHg7IH1cXG5cXG4uTG9naW5Db250cm9sX19oaWRlX19fMTU5c1gge1xcbiAgZGlzcGxheTogbm9uZTsgfVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcbmV4cG9ydHMubG9jYWxzID0ge1xuXHRcIml0ZW1cIjogXCJMb2dpbkNvbnRyb2xfX2l0ZW1fX18xOUVDZ1wiLFxuXHRcImhlYWRlckltZ1wiOiBcIkxvZ2luQ29udHJvbF9faGVhZGVySW1nX19fMnM2WjlcIixcblx0XCJ1cGxvYWRcIjogXCJMb2dpbkNvbnRyb2xfX3VwbG9hZF9fXzJRa2tuXCIsXG5cdFwiZHJvcGRvd25cIjogXCJMb2dpbkNvbnRyb2xfX2Ryb3Bkb3duX19fWFQxMFhcIixcblx0XCJoaWRlXCI6IFwiTG9naW5Db250cm9sX19oaWRlX19fMTU5c1hcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuL34vcG9zdGNzcy1sb2FkZXIhLi9+L3Nhc3MtbG9hZGVyIS4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW5Db250cm9sL0xvZ2luQ29udHJvbC5zY3NzXG4gKiogbW9kdWxlIGlkID0gMjUxXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMjQgMjYgMzJcbiAqKi8iLCIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBsaXN0ID0gW107XHJcblxyXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcclxuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXNbaV07XHJcblx0XHRcdGlmKGl0ZW1bMl0pIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGl0ZW1bMV0gKyBcIn1cIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goaXRlbVsxXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQuam9pbihcIlwiKTtcclxuXHR9O1xyXG5cclxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxyXG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcclxuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxyXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XHJcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcclxuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxyXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xyXG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXHJcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXHJcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXHJcblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXHJcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XHJcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRyZXR1cm4gbGlzdDtcclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbiAqKiBtb2R1bGUgaWQgPSAyNTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYgNyA4IDkgMTggMTkgMjAgMjMgMjQgMjUgMjYgMjcgMjggMjkgMzAgMzEgMzJcbiAqKi8iLCIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG52YXIgc3R5bGVzSW5Eb20gPSB7fSxcclxuXHRtZW1vaXplID0gZnVuY3Rpb24oZm4pIHtcclxuXHRcdHZhciBtZW1vO1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHRcdFx0cmV0dXJuIG1lbW87XHJcblx0XHR9O1xyXG5cdH0sXHJcblx0aXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gL21zaWUgWzYtOV1cXGIvLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XHJcblx0fSksXHJcblx0Z2V0SGVhZEVsZW1lbnQgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuXHR9KSxcclxuXHRzaW5nbGV0b25FbGVtZW50ID0gbnVsbCxcclxuXHRzaW5nbGV0b25Db3VudGVyID0gMCxcclxuXHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XHJcblx0aWYodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XHJcblx0XHRpZih0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcclxuXHR9XHJcblxyXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxyXG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2VcclxuXHRpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcclxuXHJcblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIDxoZWFkPi5cclxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xyXG5cclxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QpO1xyXG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xyXG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcclxuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XHJcblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcclxuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xyXG5cdFx0fVxyXG5cdFx0aWYobmV3TGlzdCkge1xyXG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QpO1xyXG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XHJcblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcclxuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspXHJcblx0XHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXSgpO1xyXG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpIHtcclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcclxuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xyXG5cdFx0aWYoZG9tU3R5bGUpIHtcclxuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyhsaXN0KSB7XHJcblx0dmFyIHN0eWxlcyA9IFtdO1xyXG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xyXG5cdFx0dmFyIGlkID0gaXRlbVswXTtcclxuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xyXG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcclxuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xyXG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xyXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pXHJcblx0XHRcdHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XHJcblx0XHRlbHNlXHJcblx0XHRcdG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcclxuXHR9XHJcblx0cmV0dXJuIHN0eWxlcztcclxufVxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCkge1xyXG5cdHZhciBoZWFkID0gZ2V0SGVhZEVsZW1lbnQoKTtcclxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcFtzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcclxuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xyXG5cdFx0aWYoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XHJcblx0XHRcdGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgaGVhZC5maXJzdENoaWxkKTtcclxuXHRcdH0gZWxzZSBpZihsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xyXG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHRcdH1cclxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGVFbGVtZW50KTtcclxuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcclxuXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcuIE11c3QgYmUgJ3RvcCcgb3IgJ2JvdHRvbScuXCIpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xyXG5cdHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0dmFyIGlkeCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGVFbGVtZW50KTtcclxuXHRpZihpZHggPj0gMCkge1xyXG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykge1xyXG5cdHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XHJcblx0c3R5bGVFbGVtZW50LnR5cGUgPSBcInRleHQvY3NzXCI7XHJcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCk7XHJcblx0cmV0dXJuIHN0eWxlRWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucykge1xyXG5cdHZhciBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xyXG5cdGxpbmtFbGVtZW50LnJlbCA9IFwic3R5bGVzaGVldFwiO1xyXG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rRWxlbWVudCk7XHJcblx0cmV0dXJuIGxpbmtFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTdHlsZShvYmosIG9wdGlvbnMpIHtcclxuXHR2YXIgc3R5bGVFbGVtZW50LCB1cGRhdGUsIHJlbW92ZTtcclxuXHJcblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XHJcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcclxuXHRcdHN0eWxlRWxlbWVudCA9IHNpbmdsZXRvbkVsZW1lbnQgfHwgKHNpbmdsZXRvbkVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xyXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgZmFsc2UpO1xyXG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgdHJ1ZSk7XHJcblx0fSBlbHNlIGlmKG9iai5zb3VyY2VNYXAgJiZcclxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XHJcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcclxuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcclxuXHRcdFx0aWYoc3R5bGVFbGVtZW50LmhyZWYpXHJcblx0XHRcdFx0VVJMLnJldm9rZU9iamVjdFVSTChzdHlsZUVsZW1lbnQuaHJlZik7XHJcblx0XHR9O1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XHJcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcclxuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHR1cGRhdGUob2JqKTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xyXG5cdFx0aWYobmV3T2JqKSB7XHJcblx0XHRcdGlmKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcClcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0fTtcclxufVxyXG5cclxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgdGV4dFN0b3JlID0gW107XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XHJcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XHJcblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcclxuXHR9O1xyXG59KSgpO1xyXG5cclxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZUVsZW1lbnQsIGluZGV4LCByZW1vdmUsIG9iaikge1xyXG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcclxuXHJcblx0aWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcclxuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGVFbGVtZW50LmNoaWxkTm9kZXM7XHJcblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50Lmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBhcHBseVRvVGFnKHN0eWxlRWxlbWVudCwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IG9iai5jc3M7XHJcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xyXG5cclxuXHRpZihtZWRpYSkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxyXG5cdH1cclxuXHJcblx0aWYoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XHJcblx0fSBlbHNlIHtcclxuXHRcdHdoaWxlKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XHJcblx0XHR9XHJcblx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVMaW5rKGxpbmtFbGVtZW50LCBvYmopIHtcclxuXHR2YXIgY3NzID0gb2JqLmNzcztcclxuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcclxuXHJcblx0aWYoc291cmNlTWFwKSB7XHJcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxyXG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xyXG5cdH1cclxuXHJcblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XHJcblxyXG5cdHZhciBvbGRTcmMgPSBsaW5rRWxlbWVudC5ocmVmO1xyXG5cclxuXHRsaW5rRWxlbWVudC5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcclxuXHJcblx0aWYob2xkU3JjKVxyXG5cdFx0VVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xyXG59XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcbiAqKiBtb2R1bGUgaWQgPSAyNTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYgNyA4IDkgMTggMTkgMjAgMjMgMjQgMjUgMjYgMjcgMjggMjkgMzAgMzEgMzJcbiAqKi8iLCIvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE2IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcyAoKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXJnID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0aWYgKCFhcmcpIGNvbnRpbnVlO1xuXG5cdFx0XHR2YXIgYXJnVHlwZSA9IHR5cGVvZiBhcmc7XG5cblx0XHRcdGlmIChhcmdUeXBlID09PSAnc3RyaW5nJyB8fCBhcmdUeXBlID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRjbGFzc2VzLnB1c2goYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG5cdFx0XHRcdGNsYXNzZXMucHVzaChjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZykpO1xuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZywga2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGtleSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NsYXNzbmFtZXMvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAyNTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAxOSAyNCAyNiAzMlxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsLzlqLzRBQVFTa1pKUmdBQkFRQUFBUUFCQUFELy9nQTdRMUpGUVZSUFVqb2daMlF0YW5CbFp5QjJNUzR3SUNoMWMybHVaeUJKU2tjZ1NsQkZSeUIyT0RBcExDQnhkV0ZzYVhSNUlEMGdPVEFLLzlzQVF3QURBZ0lEQWdJREF3TURCQU1EQkFVSUJRVUVCQVVLQndjR0NBd0tEQXdMQ2dzTERRNFNFQTBPRVE0TEN4QVdFQkVURkJVVkZRd1BGeGdXRkJnU0ZCVVUvOXNBUXdFREJBUUZCQVVKQlFVSkZBMExEUlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVS84QUFFUWdBVUFCUUF3RWlBQUlSQVFNUkFmL0VBQjhBQUFFRkFRRUJBUUVCQUFBQUFBQUFBQUFCQWdNRUJRWUhDQWtLQy8vRUFMVVFBQUlCQXdNQ0JBTUZCUVFFQUFBQmZRRUNBd0FFRVFVU0lURkJCaE5SWVFjaWNSUXlnWkdoQ0NOQ3NjRVZVdEh3SkROaWNvSUpDaFlYR0JrYUpTWW5LQ2txTkRVMk56ZzVPa05FUlVaSFNFbEtVMVJWVmxkWVdWcGpaR1ZtWjJocGFuTjBkWFozZUhsNmc0U0Zob2VJaVlxU2s1U1ZscGVZbVpxaW82U2xwcWVvcWFxeXM3UzF0cmU0dWJyQ3c4VEZ4c2ZJeWNyUzA5VFYxdGZZMmRyaDR1UGs1ZWJuNk9ucThmTHo5UFgyOS9qNSt2L0VBQjhCQUFNQkFRRUJBUUVCQVFFQUFBQUFBQUFCQWdNRUJRWUhDQWtLQy8vRUFMVVJBQUlCQWdRRUF3UUhCUVFFQUFFQ2R3QUJBZ01SQkFVaE1RWVNRVkVIWVhFVElqS0JDQlJDa2FHeHdRa2pNMUx3RldKeTBRb1dKRFRoSmZFWEdCa2FKaWNvS1NvMU5qYzRPVHBEUkVWR1IwaEpTbE5VVlZaWFdGbGFZMlJsWm1kb2FXcHpkSFYyZDNoNWVvS0RoSVdHaDRpSmlwS1RsSldXbDVpWm1xS2pwS1dtcDZpcHFyS3p0TFcydDdpNXVzTER4TVhHeDhqSnl0TFQxTlhXMTlqWjJ1TGo1T1htNStqcDZ2THo5UFgyOS9qNSt2L2FBQXdEQVFBQ0VRTVJBRDhBK3QrS0tQeG8vR2dBNzBZby9HajhhQURGSDRWZXNkQzFIVWwzV3RqY1hDZjM0NHlWL1BHS1crMEhVdE5YZGRXTnpicC9ma2pJWDg4WW9Bb2ZoUitGSDQwZmpRQWZoUitGSDQwZmpRQVVVVVVBRmVwZUFQaDVEOWxpMUxWWWhLOGczUTI3ajVWWHN6RHVUNmY1SEErRnRPWFZ2RVduMnJqTWNrbzNqMVVja2ZrRFgwTUJnWUhBb0FSVkNLRlVCVkhBQTZDbFpRd0trWkJHQ0RTMFVBZWMrUHZoM0JKYXk2bHBVUWltakJlVzNRWVZ4M0tqc2Zidi9QeXF2cHV2bnZ4ZnBxYVQ0bDFDMVFiWTBsSlVEc3JmTUIrUm9BeUtLS0tBQ2lpaWdEYThHWHE2ZjRwMDJlUWdJSlFwSjdCdmx6K3RmUVA0Vjh5RGcxN1A0QThjdzY1WnhXVjVJRTFLTWJmbVArdUE3ajM5UitOQUhhVWZoU1VVQUwrRmVBK09MMU5ROFdhbE5HUVU4M1lDTyswQmY2VjZiNDk4Y1E2Qlp5V2xySUpOU2tYYUFwejVRUDhBRWZmMEZlS2s1T1R5VFFBVVVVVUFINDBmalJVMW5hVFg5M0RiUUlYbWxZSWlqdVRRQmMwRHcvZWVJNzRXMW1tNDlYa2JoVUhxVFhzSGh6NGVhWG9DcEk4WXZic2NtYVlaQVA4QXNyMEg4L2V0SHd2NGNnOE02WEhheEFOSWZtbGx4eTdkejlQU3RpZ0EvR2svR2xvb0E1YnhKOFBkTDE5WGtXTVdkNDNQbndqR1QvdEwwUDhBUDNyeC9YL0Q5NTRjdmpiWGliVDFTUmVWY2VvTmZSRlpIaWp3NUI0bTB1UzFsQVdRZk5GTGpsRzdINmV0QUh6NStOSDQxTmVXazFoZHpXMDZGSm9uS01wN0VHb2FBQ3ZRZmhCb3d1ZFR1ZFJrWEsyeTdJOGorTnVwL0FmenJ6NnZhZmhSYUNEd21rZ0hNOHp1ZndPMy93QmxvQTdLaWlqOEtBQ2twYVNnQmFTajhLS0FQSnZpL293dHRUdHRSalhDM0s3Sk1mM2w2SDhSL0t2UHE5cCtLMXFKL0NieUVjd1RJNFAxTzMvMmF2RnFBUC9aXCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L2ltYWdlcy9kZWZhdWx0SGVhZGVySWNvbi5wbmdcbiAqKiBtb2R1bGUgaWQgPSAyNTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyNCAyNiAyOSAzMCAzMSAzMlxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcImFycm93RG93blwiOiB7XG5cdFx0XCJwYXRoc1wiOiBbXG5cdFx0XHRcIk0wIDM4NGwzODMuNzUgMzgzLjc1IDM4My43NS0zODMuNzVoLTc2Ny41elwiXG5cdFx0XSxcblx0XHRcInBvc2l0aW9uXCI6IFtcblx0XHRcdDEsXG5cdFx0XHQwXG5cdFx0XVxuXHR9XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvY29tcG9uZW50cy9sb2dpbkNvbnRyb2wvaWNvbnMuanNvblxuICoqIG1vZHVsZSBpZCA9IDI1NlxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDI0IDI2IDMyXG4gKiovIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcblxuaW1wb3J0IFNpZ25JbiBmcm9tICcuL1NpZ25JbidcbmltcG9ydCBTaWduVXAgZnJvbSAnLi9TaWduVXAnXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcblxuY29uc3Qgc3R5bGVzID0ge1xuICBjb3Zlcjoge1xuICAgIGxlZnQ6IDAsXG4gICAgdG9wOiAwLFxuICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgIHdpZHRoOiAnMTAwdncnLFxuICAgIGhlaWdodDogJzEwMHZoJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuMiknLFxuICAgIHpJbmRleDogMTAsXG4gIH0sXG4gIHN0YWdlOiB7XG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4gICAgbWFyZ2luOiAnMjAwcHggYXV0byAwJyxcbiAgICB3aWR0aDogJzM2MHB4JyxcbiAgICBoZWlnaHQ6ICdhdXRvJyxcbiAgfSxcbiAgaGVhZGVyOiB7XG4gICAgbWFyZ2luTGVmdDogJzIwcHgnLFxuICAgIG1hcmdpblJpZ2h0OiAnMjBweCcsXG4gIH0sXG4gIHRhYjoge1xuICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgIHBhZGRpbmc6ICcwcHggMTVweCcsXG4gICAgaGVpZ2h0OiAnNTBweCcsXG4gICAgbGluZUhlaWdodDogJzUwcHgnLFxuICAgIGZvbnRXZWlnaHQ6ICc1MDAnLFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gIH0sXG4gIGFjdGl2ZVRhYjoge1xuICAgIGJvcmRlckJvdHRvbTogJzJweCBzb2xpZCByZWQnLFxuICB9LFxuICBib2R5OiB7XG4gICAgbWFyZ2luVG9wOiAnLTFweCcsXG4gICAgbWFyZ2luTGVmdDogJzIwcHgnLFxuICAgIG1hcmdpblJpZ2h0OiAnMjBweCcsXG4gICAgcGFkZGluZ1RvcDogJzIwcHgnLFxuICAgIGJvcmRlclRvcDogJzFweCBzb2xpZCAjZGRkJyxcbiAgfSxcbiAgaGlkZToge1xuICAgIGRpc3BsYXk6ICdub25lJyxcbiAgfSxcbn1cblxuY2xhc3MgTG9naW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0ZSA9IHtcbiAgICBzdGF0dXM6ICdOb25lJyxcbiAgfVxuICBzaG93U2lnbkluID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc3RhdHVzOiAnU2lnbkluJyxcbiAgICB9KVxuICB9XG4gIHNob3dTaWduVXAgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzdGF0dXM6ICdTaWduVXAnLFxuICAgIH0pXG4gIH1cbiAgaGFuZGxlQ2xpY2sgPSAoZSkgPT4ge1xuICAgIGlmIChlLnRhcmdldCA9PT0gZS5jdXJyZW50VGFyZ2V0KSB7XG4gICAgICB0aGlzLmhpZGUoKVxuICAgIH1cbiAgfVxuICBoaWRlID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc3RhdHVzOiAnTm9uZScsXG4gICAgfSlcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBzdGF0dXMgfSA9IHRoaXMuc3RhdGVcbiAgICBjb25zdCBsb2dpblN0eWxlID0gXy5tZXJnZSh7fSwgc3R5bGVzLmNvdmVyLCBzdGF0dXMgPT09ICdOb25lJyA/IHN0eWxlcy5oaWRlIDoge30pXG4gICAgY29uc3QgaW5UYWJTdHlsZSA9IF8ubWVyZ2Uoe30sIHN0eWxlcy50YWIsIHN0YXR1cyA9PT0gJ1NpZ25JbicgPyBzdHlsZXMuYWN0aXZlVGFiIDoge30pXG4gICAgY29uc3QgdXBUYWJTdHlsZSA9IF8ubWVyZ2Uoe30sIHN0eWxlcy50YWIsIHN0YXR1cyA9PT0gJ1NpZ25VcCcgPyBzdHlsZXMuYWN0aXZlVGFiIDoge30pXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgbmFtZT1cImxvZ2luXCJcbiAgICAgICAgc3R5bGU9e2xvZ2luU3R5bGV9XG4gICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICA+XG4gICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5zdGFnZX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLmhlYWRlcn0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpblRhYlN0eWxlfSBvbkNsaWNrPXt0aGlzLnNob3dTaWduSW59PlxuICAgICAgICAgICAgICB7J+eZuyDlvZUnfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt1cFRhYlN0eWxlfSBvbkNsaWNrPXt0aGlzLnNob3dTaWduVXB9PlxuICAgICAgICAgICAgICB7J+azqCDlhownfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLmJvZHl9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzdGF0dXMgPT09ICdTaWduSW4nID8gPFNpZ25JbiAvPiA6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3RhdHVzID09PSAnU2lnblVwJyA/IDxTaWduVXAgLz4gOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmNvbnN0IGFuY2hvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5hbmNob3Iuc2V0QXR0cmlidXRlKCduYW1lJywgJ2xvZ2luLWFuY2hvcicpXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGFuY2hvcilcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3RET00ucmVuZGVyKFxuICA8TG9naW4gLz4sXG4gIGFuY2hvclxuKVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvY29tcG9uZW50cy9sb2dpbi9Mb2dpbi5qc3hcbiAqKi8iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5cbmltcG9ydCBJbnB1dFN0eWxlIGZyb20gJ0lucHV0U3R5bGUnXG5cbmltcG9ydCB7IHNpZ25JbiB9IGZyb20gJ0xvZ2luQWN0aW9uJ1xuaW1wb3J0IGNzcyBmcm9tICcuL1NpZ25Jbi5zY3NzJ1xuXG5jbGFzcyBTaWduSW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0ZSA9IHtcbiAgICB1c2VybmFtZTogJycsXG4gICAgcGFzc3dvcmQ6ICcnLFxuICB9XG4gIGhhbmRsZVVzZXJuYW1lID0gKGUpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHVzZXJuYW1lOiBlLnRhcmdldC52YWx1ZSxcbiAgICB9KVxuICB9XG4gIGhhbmRsZVBhc3N3b3JkID0gKGUpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHBhc3N3b3JkOiBlLnRhcmdldC52YWx1ZSxcbiAgICB9KVxuICB9XG4gIGhhbmRsZVNpZ25pbiA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGNvbnN0IHVzZXIgPSB7XG4gICAgICB1c2VybmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgIHBhc3N3b3JkOiB0aGlzLnN0YXRlLnBhc3N3b3JkLFxuICAgIH1cbiAgICBjb25zdCBzdWNjZXNzSGFuZGxlID0gKCkgPT4gbG9jYXRpb24ucmVsb2FkKClcbiAgICBjb25zdCBmYWlsSGFuZGxlID0gKHJlc3VsdCkgPT4gY29uc29sZS5sb2cocmVzdWx0LmRlc2MpXG4gICAgY29uc3QgZXJySGFuZGxlID0gKGVycikgPT4gY29uc29sZS5sb2coZXJyKVxuICAgIHNpZ25Jbih1c2VyLCB7IHN1Y2Nlc3NIYW5kbGUsIGZhaWxIYW5kbGUsIGVyckhhbmRsZSB9KVxuICB9XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHVzZXJuYW1lLCBwYXNzd29yZCB9ID0gdGhpcy5zdGF0ZVxuICAgIHJldHVybiAoXG4gICAgICA8Zm9ybT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Nzcy5mb3JtR3JvdXB9PlxuICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZm9ybS11c2VybmFtZVwiIC8+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBrZXk9eyd1c2VybmFtZSd9XG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17J1VzZXJuYW1lLi4uJ31cbiAgICAgICAgICAgIHN0eWxlPXtJbnB1dFN0eWxlLm5vcm1hbH1cbiAgICAgICAgICAgIHZhbHVlPXt1c2VybmFtZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVVzZXJuYW1lfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y3NzLmZvcm1Hcm91cH0+XG4gICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJmb3JtLXBhc3N3b3JkXCIgLz5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGtleT17J3Bhc3N3b3JkJ31cbiAgICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICBuYW1lPVwiZm9ybS1wYXNzd29yZFwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17J1Bhc3N3b3JkLi4uJ31cbiAgICAgICAgICAgIHN0eWxlPXtJbnB1dFN0eWxlLm5vcm1hbH1cbiAgICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVBhc3N3b3JkfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y3NzLmZvcm1Hcm91cH0+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e2Nzcy5idXR0b259IG9uQ2xpY2s9e3RoaXMuaGFuZGxlU2lnbmlufT5cbiAgICAgICAgICAgIHsn55m7IOW9lSd9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9mb3JtPlxuICAgIClcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgU2lnbkluXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9jb21wb25lbnRzL2xvZ2luL1NpZ25Jbi5qc3hcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgbm9ybWFsOiB7XG4gICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGhlaWdodDogJzM2cHgnLFxuICAgIHBhZGRpbmc6ICc2cHggMTJweCcsXG4gICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICBsaW5lSGVpZ2h0OiAnMS40Mjg1NzE0MycsXG4gICAgY29sb3I6ICcjNTU1NTU1JyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmZmZmIWltcG9ydGFudCcsXG4gICAgYmFja2dyb3VuZEltYWdlOiAnbm9uZScsXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkICNlNGU0ZTQnLFxuICAgIGJvcmRlclJhZGl1czogJzBweCcsXG4gICAgdHJhbnNpdGlvbjogJ2JvcmRlci1jb2xvciBlYXNlLWluLW91dCAuMTVzLCBib3gtc2hhZG93IGVhc2UtaW4tb3V0IC4xNXMnLFxuICAgIG91dGxpbmU6ICdub25lJyxcbiAgICAnOmZvY3VzJzoge1xuICAgICAgb3V0bGluZTogJ25vbmUnLFxuICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoMTA0LCAxODQsIDQwLCAwLjUpJyxcbiAgICB9LFxuICB9LFxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29tcG9uZW50cy9jb21tb24vZm9ybXMvaW5wdXQuc3R5bGUuanNcbiAqKi8iLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9TaWduSW4uc2Nzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vU2lnbkluLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vU2lnbkluLnNjc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvY29tcG9uZW50cy9sb2dpbi9TaWduSW4uc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDI2MFxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDI0IDI2IDMyXG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuU2lnbkluX19mb3JtR3JvdXBfX18zWllNVCB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBwYWRkaW5nLWJvdHRvbTogMjBweDsgfVxcblxcbi5TaWduSW5fX2J1dHRvbl9fX19QZkZlIHtcXG4gIGhlaWdodDogNDBweDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICM1MDcxMDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB5ZWxsb3dncmVlbjsgfVxcblxcbi5TaWduSW5fX2J1dHRvbl9fX19QZkZlOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM5YWQ0MjU7IH1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5leHBvcnRzLmxvY2FscyA9IHtcblx0XCJmb3JtR3JvdXBcIjogXCJTaWduSW5fX2Zvcm1Hcm91cF9fXzNaWU1UXCIsXG5cdFwiYnV0dG9uXCI6IFwiU2lnbkluX19idXR0b25fX19fUGZGZVwiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXI/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vfi9wb3N0Y3NzLWxvYWRlciEuL34vc2Fzcy1sb2FkZXIhLi9zcmMvZW50cnkvY29tcG9uZW50cy9sb2dpbi9TaWduSW4uc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDI2MVxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDI0IDI2IDMyXG4gKiovIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuXG5pbXBvcnQgSW5wdXRTdHlsZSBmcm9tICdJbnB1dFN0eWxlJ1xuaW1wb3J0IGNzcyBmcm9tICcuL1NpZ25VcC5zY3NzJ1xuaW1wb3J0IHsgc2lnblVwIH0gZnJvbSAnTG9naW5BY3Rpb24nXG5cbmNsYXNzIFNpZ25VcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRlID0ge1xuICAgIHVzZXJuYW1lOiAnJyxcbiAgICBwYXNzd29yZDogJycsXG4gICAgbmFtZTogJycsXG4gIH1cbiAgaGFuZGxlVXNlcm5hbWUgPSAoZSkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdXNlcm5hbWU6IGUudGFyZ2V0LnZhbHVlLFxuICAgIH0pXG4gIH1cbiAgaGFuZGxlUGFzc3dvcmQgPSAoZSkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGFzc3dvcmQ6IGUudGFyZ2V0LnZhbHVlLFxuICAgIH0pXG4gIH1cbiAgaGFuZGxlTmFtZSA9IChlKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBuYW1lOiBlLnRhcmdldC52YWx1ZSxcbiAgICB9KVxuICB9XG4gIGhhbmRsZVNpZ25VcCA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGNvbnN0IHVzZXIgPSB7XG4gICAgICB1c2VybmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgIHBhc3N3b3JkOiB0aGlzLnN0YXRlLnBhc3N3b3JkLFxuICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lLFxuICAgIH1cbiAgICBjb25zdCBzdWNjZXNzSGFuZGxlID0gKCkgPT4gbG9jYXRpb24ucmVsb2FkKClcbiAgICBjb25zdCBmYWlsSGFuZGxlID0gKHJlc3VsdCkgPT4gY29uc29sZS5sb2cocmVzdWx0LmRlc2MpXG4gICAgY29uc3QgZXJySGFuZGxlID0gKGVycikgPT4gY29uc29sZS5sb2coZXJyKVxuICAgIHNpZ25VcCh1c2VyLCB7IHN1Y2Nlc3NIYW5kbGUsIGZhaWxIYW5kbGUsIGVyckhhbmRsZSB9KVxuICB9XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHVzZXJuYW1lLCBwYXNzd29yZCwgbmFtZSB9ID0gdGhpcy5zdGF0ZVxuICAgIHJldHVybiAoXG4gICAgICA8Zm9ybT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Nzcy5mb3JtR3JvdXB9PlxuICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZm9ybS11c2VybmFtZVwiIC8+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBrZXk9eyd1c2VybmFtZSd9XG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17J1VzZXJuYW1lLi4uJ31cbiAgICAgICAgICAgIHN0eWxlPXtJbnB1dFN0eWxlLm5vcm1hbH1cbiAgICAgICAgICAgIHZhbHVlPXt1c2VybmFtZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVVzZXJuYW1lfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y3NzLmZvcm1Hcm91cH0+XG4gICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJmb3JtLXBhc3N3b3JkXCIgLz5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGtleT17J3Bhc3N3b3JkJ31cbiAgICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICBuYW1lPVwiZm9ybS1wYXNzd29yZFwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17J1Bhc3N3b3JkLi4uJ31cbiAgICAgICAgICAgIHN0eWxlPXtJbnB1dFN0eWxlLm5vcm1hbH1cbiAgICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVBhc3N3b3JkfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y3NzLmZvcm1Hcm91cH0+XG4gICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJmb3JtLW5hbWVcIiAvPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAga2V5PXsnbmFtZSd9XG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICBuYW1lPVwiZm9ybS1uYW1lXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXsnbmFtZS4uLid9XG4gICAgICAgICAgICBzdHlsZT17SW5wdXRTdHlsZS5ub3JtYWx9XG4gICAgICAgICAgICB2YWx1ZT17bmFtZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU5hbWV9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjc3MuZm9ybUdyb3VwfT5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17Y3NzLmJ1dHRvbn0gb25DbGljaz17dGhpcy5oYW5kbGVTaWduVXB9PlxuICAgICAgICAgICAgeyfms6gg5YaMJ31cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Zvcm0+XG4gICAgKVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBTaWduVXBcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW4vU2lnblVwLmpzeFxuICoqLyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL1NpZ25VcC5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9TaWduVXAuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9TaWduVXAuc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9jb21wb25lbnRzL2xvZ2luL1NpZ25VcC5zY3NzXG4gKiogbW9kdWxlIGlkID0gMjYzXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMjQgMjYgMzJcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5TaWduVXBfX2Zvcm1Hcm91cF9fXzI2azBsIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHBhZGRpbmctYm90dG9tOiAyMHB4OyB9XFxuXFxuLlNpZ25VcF9fYnV0dG9uX19fM1o0MHQge1xcbiAgaGVpZ2h0OiA0MHB4O1xcbiAgd2lkdGg6IDEwMCU7XFxuICBmb250LXNpemU6IDE2cHg7XFxuICBtYXJnaW4tYm90dG9tOiAxMHB4O1xcbiAgYm9yZGVyOiAxcHggc29saWQgIzUwNzEwMDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHllbGxvd2dyZWVuOyB9XFxuXFxuLlNpZ25VcF9fYnV0dG9uX19fM1o0MHQ6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzlhZDQyNTsgfVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcbmV4cG9ydHMubG9jYWxzID0ge1xuXHRcImZvcm1Hcm91cFwiOiBcIlNpZ25VcF9fZm9ybUdyb3VwX19fMjZrMGxcIixcblx0XCJidXR0b25cIjogXCJTaWduVXBfX2J1dHRvbl9fXzNaNDB0XCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlcj9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi9+L3Bvc3Rjc3MtbG9hZGVyIS4vfi9zYXNzLWxvYWRlciEuL3NyYy9lbnRyeS9jb21wb25lbnRzL2xvZ2luL1NpZ25VcC5zY3NzXG4gKiogbW9kdWxlIGlkID0gMjY0XG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMjQgMjYgMzJcbiAqKi8iLCJpbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnXG5cbmNsYXNzIFN2Z0ljb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBnZXRUcmFuc2Zvcm0gPSAocG9zaXRpb24sIGRpcmVjdGlvbiwgc2l6ZSwgcmVhbEljb25TaXplKSA9PiB7XG4gICAgY29uc3Qgc2NhbGVXID0gc2l6ZVswXSAvIHJlYWxJY29uU2l6ZVswXVxuICAgIGNvbnN0IHNjYWxlSCA9IHNpemVbMV0gLyByZWFsSWNvblNpemVbMV1cbiAgICByZXR1cm4gYHRyYW5zbGF0ZSgke3Bvc2l0aW9uLmpvaW4oJywgJyl9KVxuICAgIHNjYWxlKCR7ZGlyZWN0aW9uLmpvaW4oJywgJyl9ICkgc2NhbGUoJHtzY2FsZVd9LCR7c2NhbGVIfSlgXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgcGF0aHMsIHNpemUsIHBvc2l0aW9uLCBkaXJlY3Rpb24sIHJlYWxJY29uU2l6ZSxcbiAgICAgIHN0eWxlLCBjbGFzc05hbWUsIG9uQ2xpY2sgfSA9IHRoaXMucHJvcHNcbiAgICByZXR1cm4gKFxuICAgICAgPHN2Z1xuICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgICB3aWR0aD17c2l6ZVswXX1cbiAgICAgICAgaGVpZ2h0PXtzaXplWzFdfVxuICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgPlxuICAgICAgICA8ZyB0cmFuc2Zvcm09e3RoaXMuZ2V0VHJhbnNmb3JtKHBvc2l0aW9uLCBkaXJlY3Rpb24sIHNpemUsIHJlYWxJY29uU2l6ZSl9PlxuICAgICAgICAgIHtwYXRocy5tYXAoKHBhdGgsIGkpID0+IDxwYXRoIGtleT17aX0gZD17cGF0aH0gLz4pfVxuICAgICAgICA8L2c+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cbn1cblN2Z0ljb24uZGVmYXVsdFByb3BzID0ge1xuICBzaXplOiBbMTYsIDE2XSxcbiAgcG9zaXRpb246IFswLCAwXSxcbiAgZGlyZWN0aW9uOiBbMSwgMV0sXG4gIHJlYWxJY29uU2l6ZTogWzEwMjQsIDEwMjRdLFxufVxuU3ZnSWNvbi5wcm9wVHlwZXMgPSB7XG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICBwYXRoczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZykuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm51bWJlciksXG4gIHBvc2l0aW9uOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubnVtYmVyKSxcbiAgZGlyZWN0aW9uOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubnVtYmVyKSxcbiAgcmVhbEljb25TaXplOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubnVtYmVyKSxcbn1cbmV4cG9ydCBkZWZhdWx0IFN2Z0ljb25cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbXBvbmVudHMvc3ZnSWNvbi9TdmdJY29uLmpzeFxuICoqLyIsImltcG9ydCByZXF1ZXN0IGZyb20gJ3N1cGVyYWdlbnQnXG5cbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWRJbWFnZShpbWFnZSwgeyBzdWNjZXNzSGFuZGxlLCBmYWlsSGFuZGxlLCBlcnJIYW5kbGUgfSkge1xuICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gIGZvcm1EYXRhLmFwcGVuZCgnZmlsZVR5cGUnLCBpbWFnZS50eXBlKVxuICBmb3JtRGF0YS5hcHBlbmQoJ2ltYWdlJywgaW1hZ2UpXG4gIHJlcXVlc3QucG9zdCgnL2FwaS9pbWFnZS9hZGQnKVxuICAgIC5zZW5kKGZvcm1EYXRhKVxuICAgIC50aGVuKChyZXMpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IEpTT04ucGFyc2UocmVzLnRleHQpXG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgJiYgc3VjY2Vzc0hhbmRsZSkge1xuICAgICAgICBzdWNjZXNzSGFuZGxlKHJlc3VsdClcbiAgICAgIH0gZWxzZSBpZiAoIXJlc3VsdC5zdWNjZXNzICYmIGZhaWxIYW5kbGUpIHtcbiAgICAgICAgZmFpbEhhbmRsZShyZXN1bHQpXG4gICAgICB9XG4gICAgfSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVyckhhbmRsZSkge1xuICAgICAgICBlcnJIYW5kbGUoZXJyKVxuICAgICAgfVxuICAgIH0pXG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9hY3Rpb25zL2ltYWdlQWN0aW9uLmpzeFxuICoqLyIsImV4cG9ydCBmdW5jdGlvbiBpbWFnZVVSTChmaWxlbmFtZSkge1xuICBpZiAoIWZpbGVuYW1lKSB7XG4gICAgcmV0dXJuIGZpbGVuYW1lXG4gIH1cbiAgcmV0dXJuIGAvcmVzb3VyY2VzL2ltZ3MvJHtmaWxlbmFtZS5zdWJzdHIoMCwgMyl9LyR7ZmlsZW5hbWV9YFxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvdXRpbHMvcGF0aHV0aWwuanN4XG4gKiovIiwiaW1wb3J0IHJlcXVlc3QgZnJvbSAnc3VwZXJhZ2VudCdcblxuZXhwb3J0IGZ1bmN0aW9uIHNldEhlYWRlckljb24oZmlsZW5hbWUsIHsgc3VjY2Vzc0hhbmRsZSwgZmFpbEhhbmRsZSwgZXJySGFuZGxlIH0pIHtcbiAgcmVxdWVzdC5wdXQoJy9hcGkvdXNlci9oZWFkZXJJY29uJylcbiAgICAuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJylcbiAgICAuc2VuZCh7IGZpbGVuYW1lIH0pXG4gICAgLnRoZW4oKHJlcykgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXMudGV4dClcbiAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAmJiBzdWNjZXNzSGFuZGxlKSB7XG4gICAgICAgIHN1Y2Nlc3NIYW5kbGUocmVzdWx0KVxuICAgICAgfSBlbHNlIGlmICghcmVzdWx0LnN1Y2Nlc3MgJiYgZmFpbEhhbmRsZSkge1xuICAgICAgICBmYWlsSGFuZGxlKHJlc3VsdClcbiAgICAgIH1cbiAgICB9LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJySGFuZGxlKSB7XG4gICAgICAgIGVyckhhbmRsZShlcnIpXG4gICAgICB9XG4gICAgfSlcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L2FjdGlvbnMvdXNlckFjdGlvbi5qc3hcbiAqKi8iLCJjb25zdCBIRUlHSFQgPSAnNjBweCdcblxuY29uc3Qgc3R5bGVzID0ge1xuICBuYXY6IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGhlaWdodDogSEVJR0hULFxuICAgIGxpbmVIZWlnaHQ6IEhFSUdIVCxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmZmZmJyxcbiAgICBwYWRkaW5nOiAnMCA0NXB4JyxcbiAgICBjb2xvcjogJyMwMDAwMDAnLFxuICB9LFxuICBsaW5rOiB7XG4gICAgdGV4dERlY29yYXRpb246ICdpbml0aWFsJyxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIGhlaWdodDogSEVJR0hULFxuICAgIHdpZHRoOiAnNjVweCcsXG4gICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICBsaW5lSGVpZ2h0OiBIRUlHSFQsXG4gICAgZm9udFNpemU6ICcxLjJyZW0nLFxuICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICBtYXJnaW46ICcwIDEwcHgnLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICB9LFxufVxuZXhwb3J0IGRlZmF1bHQgc3R5bGVzXG5leHBvcnQgY29uc3QgQUNUSVZFID0ge1xuICBib3JkZXJCb3R0b206ICdzb2xpZCAycHggI2ZmOWYxZicsXG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9jb21wb25lbnRzL25hdi9uYXYuc3R5bGVzLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHN0YWdlUm93OiB7XG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gIH0sXG4gIHN0YWdlQ29sOiB7XG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gIH0sXG4gIGJvZHk6IHtcbiAgICBmbGV4OiAxLFxuICAgIG92ZXJmbG93OiAnYXV0bycsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L2xheW91dC5zdHlsZS5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=