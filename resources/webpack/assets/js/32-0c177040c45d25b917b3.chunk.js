webpackJsonp([32],{

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

/***/ 564:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Header = __webpack_require__(565);
	
	var _Header2 = _interopRequireDefault(_Header);
	
	var _blog = __webpack_require__(570);
	
	var _blog2 = _interopRequireDefault(_blog);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function Blog(_ref) {
	  var children = _ref.children;
	
	  return _react2.default.createElement(
	    'div',
	    { name: 'blog-router', className: _blog2.default.blogState },
	    _react2.default.createElement(_Header2.default, null),
	    _react2.default.createElement(
	      'div',
	      { name: 'blog-body', className: _blog2.default.body },
	      children
	    )
	  );
	}
	
	module.exports = Blog;

/***/ },

/***/ 565:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Header = __webpack_require__(566);
	
	var _Header2 = _interopRequireDefault(_Header);
	
	var _blog = __webpack_require__(568);
	
	var _blog2 = _interopRequireDefault(_blog);
	
	var _home = __webpack_require__(569);
	
	var _home2 = _interopRequireDefault(_home);
	
	var _LoginControl = __webpack_require__(249);
	
	var _LoginControl2 = _interopRequireDefault(_LoginControl);
	
	var _reactRouter = __webpack_require__(172);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function Header() {
	  return _react2.default.createElement(
	    'header',
	    { className: _Header2.default.header },
	    _react2.default.createElement(
	      'div',
	      { className: _Header2.default.wrap },
	      _react2.default.createElement(
	        'section',
	        { className: _Header2.default.item },
	        _react2.default.createElement(
	          _reactRouter.Link,
	          { to: '/', className: _Header2.default.item },
	          _react2.default.createElement('img', { src: _home2.default, alt: 'home', className: _Header2.default.img })
	        )
	      ),
	      _react2.default.createElement(
	        'section',
	        { className: _Header2.default.item },
	        _react2.default.createElement(
	          _reactRouter.Link,
	          { to: '/blog', className: _Header2.default.item },
	          _react2.default.createElement('img', { src: _blog2.default, alt: 'blog', className: _Header2.default.img })
	        )
	      ),
	      _react2.default.createElement('section', { style: { flex: 1 }, className: _Header2.default.item }),
	      _react2.default.createElement(
	        'section',
	        { className: _Header2.default.item },
	        _react2.default.createElement(_LoginControl2.default, null)
	      )
	    )
	  );
	}
	
	exports.default = Header;

/***/ },

/***/ 566:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(567);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../node_modules/postcss-loader/index.js!./../../../../../../node_modules/sass-loader/index.js!./Header.scss", function() {
				var newContent = require("!!./../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../node_modules/postcss-loader/index.js!./../../../../../../node_modules/sass-loader/index.js!./Header.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 567:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".Header__header___10k4u {\n  border-bottom: 1px solid #eee;\n  background-color: #fff; }\n\n.Header__wrap___2aZuM {\n  max-width: 980px;\n  margin: 0 auto;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex; }\n\n.Header__item___ZVSLY {\n  height: 60px;\n  line-height: 60px;\n  display: inline-block; }\n\n.Header__img___1JRNP {\n  height: 60px;\n  padding: 10px 0; }\n\n.Header__menus___2KYTa {\n  height: 50px;\n  line-height: 50px; }\n\n.Header__menuList___31UO4 {\n  display: inline-block;\n  float: left;\n  padding-left: 20px;\n  list-style: none; }\n\n.Header__menuItem___i2i42 {\n  float: left; }\n\n.Header__link___3haB_ {\n  display: block;\n  font-size: 14px;\n  color: #333;\n  text-decoration: none;\n  cursor: pointer; }\n\n.Header__link___3haB_:hover {\n  color: #333;\n  font-weight: 700; }\n", ""]);
	
	// exports
	exports.locals = {
		"header": "Header__header___10k4u",
		"wrap": "Header__wrap___2aZuM",
		"item": "Header__item___ZVSLY",
		"img": "Header__img___1JRNP",
		"menus": "Header__menus___2KYTa",
		"menuList": "Header__menuList___31UO4",
		"menuItem": "Header__menuItem___i2i42",
		"link": "Header__link___3haB_"
	};

/***/ },

/***/ 568:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "0d56414c9d8f1b410109b12022f8d7a1.png";

/***/ },

/***/ 569:
/***/ function(module, exports) {

	module.exports = "data:image/jpeg;base64,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"

/***/ },

/***/ 570:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(571);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./blog.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./blog.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 571:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".blog__blogState___1Afow {\n  height: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column; }\n\n.blog__body___lffX8 {\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1; }\n", ""]);
	
	// exports
	exports.locals = {
		"blogState": "blog__blogState___1Afow",
		"body": "blog__body___lffX8"
	};

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvY29tcG9uZW50cy9sb2dpbkNvbnRyb2wvTG9naW5Db250cm9sLmpzeD9iODljKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW5Db250cm9sL0xvZ2luQ29udHJvbC5zY3NzPzQyZTQqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW5Db250cm9sL0xvZ2luQ29udHJvbC5zY3NzPzJjNTAqKiIsIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzP2RhMDQqKioqKioqKioqKioqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanM/Yjk4MCoqKioqKioqKioqKioqKioqKioqIiwid2VicGFjazovLy8uL34vY2xhc3NuYW1lcy9pbmRleC5qcz84ZTQzKioqIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9pbWFnZXMvZGVmYXVsdEhlYWRlckljb24ucG5nP2I5NTkqKioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvY29tcG9uZW50cy9sb2dpbkNvbnRyb2wvaWNvbnMuanNvbj9hMTJjKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW4vTG9naW4uanN4PzQwNDYqKiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvY29tcG9uZW50cy9sb2dpbi9TaWduSW4uanN4P2I2NTMqKiIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jb21tb24vZm9ybXMvaW5wdXQuc3R5bGUuanM/ZGMwOCoqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW4vU2lnbkluLnNjc3M/NTI0NCoqKiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvY29tcG9uZW50cy9sb2dpbi9TaWduSW4uc2Nzcz82NDdhKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW4vU2lnblVwLmpzeD82OGVlKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW4vU2lnblVwLnNjc3M/NWMzNioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvY29tcG9uZW50cy9sb2dpbi9TaWduVXAuc2Nzcz85ODYwKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvc3ZnSWNvbi9TdmdJY29uLmpzeD9hYzE5KioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2FjdGlvbnMvaW1hZ2VBY3Rpb24uanN4P2RmOTEqKioqIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS91dGlscy9wYXRodXRpbC5qc3g/MTI5YioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L2FjdGlvbnMvdXNlckFjdGlvbi5qc3g/NGJlMSoqIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvYmxvZy9ibG9nLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9oZWFkZXIvSGVhZGVyLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9oZWFkZXIvSGVhZGVyLnNjc3M/ZWYwNSIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9oZWFkZXIvSGVhZGVyLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL2NvbXBvbmVudHMvaGVhZGVyL2ltYWdlcy9ibG9nLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9oZWFkZXIvaW1hZ2VzL2hvbWUuanBlZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvYmxvZy5zY3NzPzcxMjEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL2Jsb2cuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7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QkFBc0IsRUFBRSwrQkFBK0IsMEJBQTBCLGdCQUFnQix1QkFBdUIscUJBQXFCLEVBQUUsK0JBQStCLGdCQUFnQixFQUFFLDJCQUEyQixtQkFBbUIsb0JBQW9CLGdCQUFnQiwwQkFBMEIsb0JBQW9CLEVBQUUsaUNBQWlDLGdCQUFnQixxQkFBcUIsRUFBRTs7QUFFajFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7OztBQ2pCQSxpRjs7Ozs7OztBQ0FBLG1DQUFrQyxnb007Ozs7Ozs7QUNBbEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBeUY7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxpQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEU7Ozs7Ozs7QUNwQkE7QUFDQTs7O0FBR0E7QUFDQSxxREFBb0QsaUJBQWlCLHlCQUF5Qix5QkFBeUIsa0JBQWtCLGlDQUFpQyxrQ0FBa0MsbUNBQW1DLG1DQUFtQyxFQUFFLHlCQUF5Qix3QkFBd0Isb0JBQW9CLG9CQUFvQixFQUFFOztBQUUvVztBQUNBO0FBQ0E7QUFDQTtBQUNBLEciLCJmaWxlIjoianMvMzItMGMxNzcwNDBjNDVkMjViOTE3YjMuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgY3NzIGZyb20gJy4vTG9naW5Db250cm9sLnNjc3MnXG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcydcbmltcG9ydCBEZWZhdWx0SGVhZGVySWNvbiBmcm9tICdEZWZhdWx0SGVhZGVySWNvbidcbmltcG9ydCBpY29ucyBmcm9tICcuL2ljb25zLmpzb24nXG5pbXBvcnQgTG9naW4gZnJvbSAnTG9naW4nXG5pbXBvcnQgU3ZnSWNvbiBmcm9tICdTdmdJY29uJ1xuaW1wb3J0IHsgc2lnbk91dCwgZ2V0VXNlciB9IGZyb20gJ0xvZ2luQWN0aW9uJ1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ1N0b3JlcydcbmltcG9ydCB7IHVwbG9hZEltYWdlIH0gZnJvbSAnSW1hZ2VBY3Rpb24nXG5pbXBvcnQgeyBpbWFnZVVSTCB9IGZyb20gJ1BhdGhVdGlsJ1xuaW1wb3J0IHsgc2V0SGVhZGVySWNvbiB9IGZyb20gJ1VzZXJBY3Rpb24nXG5cbi8vIExvZ2luQ29udHJvbCDnmbvlvZXmjqfliLZcbmNsYXNzIExvZ2luQ29udHJvbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRlID0ge1xuICAgIGhpZGU6IHRydWUsXG4gIH1cbiAgc2V0SGlkZSA9IChoaWRlKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBoaWRlLFxuICAgIH0pXG4gIH1cbiAgY2xpY2tTaWduSW4gPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICBMb2dpbi5zaG93U2lnbkluKClcbiAgfVxuICBjbGlja1NpZ25VcCA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIExvZ2luLnNob3dTaWduVXAoKVxuICB9XG4gIGNsaWNrTXlCbG9nID0gKHVzZXJJZCkgPT4ge1xuICAgIHRoaXMucHJvcHMucm91dGVyLnB1c2goeyBwYXRobmFtZTogJy9ibG9nL3VzZXInLCBxdWVyeTogeyB1c2VySWQgfSB9KVxuICB9XG4gIGhhbmRsZUZpbGUgPSAoZSkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBlLnRhcmdldC5maWxlc1swXVxuICAgIGNvbnN0IHN1Y2Nlc3NIYW5kbGUgPSAocmVzdWx0KSA9PiBzZXRIZWFkZXJJY29uKHJlc3VsdC5kYXRhLCB7XG4gICAgICBzdWNjZXNzSGFuZGxlOiAoKSA9PiBnZXRVc2VyKCksXG4gICAgICBmYWlsSGFuZGxlOiAocikgPT4gJC5ub3RpZnkoci5kZXNjKSxcbiAgICB9KVxuICAgIGNvbnN0IGZhaWxIYW5kbGUgPSAocmVzdWx0KSA9PiAkLm5vdGlmeShyZXN1bHQuZGVzYylcbiAgICBjb25zdCBlcnJIYW5kbGUgPSAoZXJyKSA9PiAkLm5vdGlmeShlcnIpXG4gICAgdXBsb2FkSW1hZ2UoZmlsZSwgeyBzdWNjZXNzSGFuZGxlLCBmYWlsSGFuZGxlLCBlcnJIYW5kbGUgfSlcbiAgfVxuICByZW5kZXJMb2dpbkJhcnMgPSAodXNlcikgPT4ge1xuICAgIGlmIChfLmlzVW5kZWZpbmVkKHVzZXIpIHx8ICFfLmlzRW1wdHkodXNlcikpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y3NzLml0ZW19PlxuICAgICAgICA8YSBjbGFzc05hbWU9e2Nzcy5pdGVtfSBvbkNsaWNrPXt0aGlzLmNsaWNrU2lnbklufT57J+eZu+W9lSd9PC9hPlxuICAgICAgICA8YSBjbGFzc05hbWU9e2Nzcy5pdGVtfSBvbkNsaWNrPXt0aGlzLmNsaWNrU2lnblVwfT57J+azqOWGjCd9PC9hPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG4gIHJlbmRlclVzZXJJbmZvID0gKHVzZXIsIGhpZGUpID0+IHtcbiAgICBpZiAoXy5pc0VtcHR5KHVzZXIpKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPHVsPlxuICAgICAgICA8bGkgY2xhc3NOYW1lPXtjc3MuaXRlbX0gb25Nb3VzZUxlYXZlPXsoKSA9PiB0aGlzLnNldEhpZGUodHJ1ZSl9PlxuICAgICAgICAgIDxhIGNsYXNzTmFtZT17Y3NzLml0ZW19PlxuICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICBzcmM9e2ltYWdlVVJMKHVzZXIuaGVhZGVySWNvbikgfHwgRGVmYXVsdEhlYWRlckljb259XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17Y3NzLmhlYWRlckltZ31cbiAgICAgICAgICAgICAgYWx0PVwidXNlckljb25cIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgICAgIG5hbWU9XCJpbWFnZVwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17Y3NzLnVwbG9hZH1cbiAgICAgICAgICAgICAgYWNjZXB0PVwiaW1hZ2UvKlwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUZpbGV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvYT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y3NzLml0ZW19IG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0SGlkZShmYWxzZSl9PlxuICAgICAgICAgICAgPGEgY2xhc3NOYW1lPXtjc3MuaXRlbX0+XG4gICAgICAgICAgICAgIHt1c2VyLm5hbWV9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9e2Nzcy5pdGVtfSBzdHlsZT17eyBwYWRkaW5nOiAnNXB4JyB9fT5cbiAgICAgICAgICAgICAgPFN2Z0ljb24gey4uLmljb25zLmFycm93RG93bn0gLz5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8dWwgY2xhc3NOYW1lPXtjeChjc3MuZHJvcGRvd24sIHsgW2Nzcy5oaWRlXTogaGlkZSB9KX0+XG4gICAgICAgICAgICA8bGkgb25DbGljaz17KCkgPT4gdGhpcy5jbGlja015QmxvZyh1c2VyLmlkKX0+eyfmiJHnmoTljZrlrqInfTwvbGk+XG4gICAgICAgICAgICA8bGkgb25DbGljaz17c2lnbk91dH0+eyfnmbvlh7onfTwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9saT5cbiAgICAgIDwvdWw+XG4gICAgKVxuICB9XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHN0eWxlLCB1c2VyIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgeyBoaWRlIH0gPSB0aGlzLnN0YXRlXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlfT5cbiAgICAgICAge3RoaXMucmVuZGVyTG9naW5CYXJzKHVzZXIpfVxuICAgICAgICB7dGhpcy5yZW5kZXJVc2VySW5mbyh1c2VyLCBoaWRlKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5Mb2dpbkNvbnRyb2wucHJvcFR5cGVzID0ge1xuICB1c2VyOiBQcm9wVHlwZXMub2JqZWN0LFxufVxuY29uc3QgcHJvcHNGbiA9IChzdGF0ZSkgPT4gKHtcbiAgdXNlcjogc3RhdGUudXNlcixcbn0pXG5leHBvcnQgZGVmYXVsdCB3aXRoUm91dGVyKGNvbm5lY3QoJ2FwcCcsIHsgcHJvcHNGbiB9LCBMb2dpbkNvbnRyb2wpKVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvY29tcG9uZW50cy9sb2dpbkNvbnRyb2wvTG9naW5Db250cm9sLmpzeFxuICoqLyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL0xvZ2luQ29udHJvbC5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9Mb2dpbkNvbnRyb2wuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9Mb2dpbkNvbnRyb2wuc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9jb21wb25lbnRzL2xvZ2luQ29udHJvbC9Mb2dpbkNvbnRyb2wuc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDI1MFxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDI0IDI2IDMyXG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuTG9naW5Db250cm9sX19pdGVtX19fMTlFQ2cge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgaGVpZ2h0OiA2MHB4O1xcbiAgbGluZS1oZWlnaHQ6IDYwcHg7XFxuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGZvbnQtc2l6ZTogMS4ycmVtO1xcbiAgLXdlYmtpdC1ib3gtYWxpZ246IGNlbnRlcjtcXG4gICAgICAtbXMtZmxleC1hbGlnbjogY2VudGVyO1xcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgbWFyZ2luOiAwIDNweDsgfVxcblxcbi5Mb2dpbkNvbnRyb2xfX2hlYWRlckltZ19fXzJzNlo5IHtcXG4gIHdpZHRoOiA0MHB4O1xcbiAgaGVpZ2h0OiA0MHB4O1xcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgbWFyZ2luOiAxMHB4IDA7IH1cXG5cXG4uTG9naW5Db250cm9sX191cGxvYWRfX18yUWtrbiB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBvcGFjaXR5OiAwO1xcbiAgbGVmdDogMDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIHdpZHRoOiA0MHB4O1xcbiAgaGVpZ2h0OiA0MHB4O1xcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgbWFyZ2luOiAxMHB4OyB9XFxuXFxuLkxvZ2luQ29udHJvbF9fZHJvcGRvd25fX19YVDEwWCB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZDVkNWQ1O1xcbiAgY29sb3I6ICMxOTE5MTk7XFxuICB6LWluZGV4OiAyO1xcbiAgd2lkdGg6IDEyMHB4O1xcbiAgbGlzdC1zdHlsZTogbm9uZTtcXG4gIHJpZ2h0OiAwO1xcbiAgdG9wOiA2MHB4OyB9XFxuXFxuLkxvZ2luQ29udHJvbF9fZHJvcGRvd25fX19YVDEwWCBsaSB7XFxuICBoZWlnaHQ6IDQwcHg7XFxuICBsaW5lLWhlaWdodDogNDBweDtcXG4gIHBhZGRpbmctbGVmdDogMTVweDsgfVxcblxcbi5Mb2dpbkNvbnRyb2xfX2hpZGVfX18xNTlzWCB7XFxuICBkaXNwbGF5OiBub25lOyB9XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuZXhwb3J0cy5sb2NhbHMgPSB7XG5cdFwiaXRlbVwiOiBcIkxvZ2luQ29udHJvbF9faXRlbV9fXzE5RUNnXCIsXG5cdFwiaGVhZGVySW1nXCI6IFwiTG9naW5Db250cm9sX19oZWFkZXJJbWdfX18yczZaOVwiLFxuXHRcInVwbG9hZFwiOiBcIkxvZ2luQ29udHJvbF9fdXBsb2FkX19fMlFra25cIixcblx0XCJkcm9wZG93blwiOiBcIkxvZ2luQ29udHJvbF9fZHJvcGRvd25fX19YVDEwWFwiLFxuXHRcImhpZGVcIjogXCJMb2dpbkNvbnRyb2xfX2hpZGVfX18xNTlzWFwiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXI/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vfi9wb3N0Y3NzLWxvYWRlciEuL34vc2Fzcy1sb2FkZXIhLi9zcmMvZW50cnkvY29tcG9uZW50cy9sb2dpbkNvbnRyb2wvTG9naW5Db250cm9sLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSAyNTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyNCAyNiAzMlxuICoqLyIsIi8qXHJcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXHJcbiovXHJcbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGxpc3QgPSBbXTtcclxuXHJcblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xyXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcclxuXHRcdHZhciByZXN1bHQgPSBbXTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gdGhpc1tpXTtcclxuXHRcdFx0aWYoaXRlbVsyXSkge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgaXRlbVsxXSArIFwifVwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChpdGVtWzFdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdC5qb2luKFwiXCIpO1xyXG5cdH07XHJcblxyXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XHJcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xyXG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXHJcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcclxuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xyXG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXHJcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XHJcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcclxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcclxuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cclxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcclxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcclxuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcclxuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cdHJldHVybiBsaXN0O1xyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuICoqIG1vZHVsZSBpZCA9IDI1MlxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDUgNiA3IDggOSAxOCAxOSAyMCAyMyAyNCAyNSAyNiAyNyAyOCAyOSAzMCAzMSAzMlxuICoqLyIsIi8qXHJcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXHJcbiovXHJcbnZhciBzdHlsZXNJbkRvbSA9IHt9LFxyXG5cdG1lbW9pemUgPSBmdW5jdGlvbihmbikge1xyXG5cdFx0dmFyIG1lbW87XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0XHRyZXR1cm4gbWVtbztcclxuXHRcdH07XHJcblx0fSxcclxuXHRpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAvbXNpZSBbNi05XVxcYi8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcclxuXHR9KSxcclxuXHRnZXRIZWFkRWxlbWVudCA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xyXG5cdH0pLFxyXG5cdHNpbmdsZXRvbkVsZW1lbnQgPSBudWxsLFxyXG5cdHNpbmdsZXRvbkNvdW50ZXIgPSAwLFxyXG5cdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wID0gW107XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcclxuXHRpZih0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcclxuXHRcdGlmKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xyXG5cdH1cclxuXHJcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XHJcblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xyXG5cclxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgPGhlYWQ+LlxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XHJcblxyXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCk7XHJcblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XHJcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xyXG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcclxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xyXG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XHJcblx0XHR9XHJcblx0XHRpZihuZXdMaXN0KSB7XHJcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCk7XHJcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XHJcblx0XHR9XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcclxuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xyXG5cdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKylcclxuXHRcdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKCk7XHJcblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucykge1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xyXG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XHJcblx0XHRpZihkb21TdHlsZSkge1xyXG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XHJcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzKGxpc3QpIHtcclxuXHR2YXIgc3R5bGVzID0gW107XHJcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XHJcblx0XHR2YXIgaWQgPSBpdGVtWzBdO1xyXG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XHJcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xyXG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XHJcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XHJcblx0XHRpZighbmV3U3R5bGVzW2lkXSlcclxuXHRcdFx0c3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcclxuXHRcdGVsc2VcclxuXHRcdFx0bmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xyXG5cdH1cclxuXHRyZXR1cm4gc3R5bGVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KSB7XHJcblx0dmFyIGhlYWQgPSBnZXRIZWFkRWxlbWVudCgpO1xyXG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wW3N0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xyXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XHJcblx0XHRpZighbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcclxuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBoZWFkLmZpcnN0Q2hpbGQpO1xyXG5cdFx0fSBlbHNlIGlmKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XHJcblx0XHRcdGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AucHVzaChzdHlsZUVsZW1lbnQpO1xyXG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xyXG5cdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XHJcblx0c3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHR2YXIgaWR4ID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZUVsZW1lbnQpO1xyXG5cdGlmKGlkeCA+PSAwKSB7XHJcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSB7XHJcblx0dmFyIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcclxuXHRzdHlsZUVsZW1lbnQudHlwZSA9IFwidGV4dC9jc3NcIjtcclxuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KTtcclxuXHRyZXR1cm4gc3R5bGVFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKSB7XHJcblx0dmFyIGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XHJcblx0bGlua0VsZW1lbnQucmVsID0gXCJzdHlsZXNoZWV0XCI7XHJcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmtFbGVtZW50KTtcclxuXHRyZXR1cm4gbGlua0VsZW1lbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFN0eWxlKG9iaiwgb3B0aW9ucykge1xyXG5cdHZhciBzdHlsZUVsZW1lbnQsIHVwZGF0ZSwgcmVtb3ZlO1xyXG5cclxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcclxuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gc2luZ2xldG9uRWxlbWVudCB8fCAoc2luZ2xldG9uRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XHJcblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCBmYWxzZSk7XHJcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCB0cnVlKTtcclxuXHR9IGVsc2UgaWYob2JqLnNvdXJjZU1hcCAmJlxyXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcclxuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xyXG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0XHRpZihzdHlsZUVsZW1lbnQuaHJlZilcclxuXHRcdFx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlRWxlbWVudC5ocmVmKTtcclxuXHRcdH07XHJcblx0fSBlbHNlIHtcclxuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcclxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xyXG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShvYmopO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUobmV3T2JqKSB7XHJcblx0XHRpZihuZXdPYmopIHtcclxuXHRcdFx0aWYobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZW1vdmUoKTtcclxuXHRcdH1cclxuXHR9O1xyXG59XHJcblxyXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xyXG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcclxuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcclxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xyXG5cdH07XHJcbn0pKCk7XHJcblxyXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnKHN0eWxlRWxlbWVudCwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xyXG5cclxuXHRpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xyXG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZUVsZW1lbnQuY2hpbGROb2RlcztcclxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChjc3NOb2RlKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGVFbGVtZW50LCBvYmopIHtcclxuXHR2YXIgY3NzID0gb2JqLmNzcztcclxuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XHJcblxyXG5cdGlmKG1lZGlhKSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXHJcblx0fVxyXG5cclxuXHRpZihzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcclxuXHR9IGVsc2Uge1xyXG5cdFx0d2hpbGUoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcclxuXHRcdH1cclxuXHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxpbmsobGlua0VsZW1lbnQsIG9iaikge1xyXG5cdHZhciBjc3MgPSBvYmouY3NzO1xyXG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xyXG5cclxuXHRpZihzb3VyY2VNYXApIHtcclxuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XHJcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XHJcblx0fVxyXG5cclxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcclxuXHJcblx0dmFyIG9sZFNyYyA9IGxpbmtFbGVtZW50LmhyZWY7XHJcblxyXG5cdGxpbmtFbGVtZW50LmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xyXG5cclxuXHRpZihvbGRTcmMpXHJcblx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XHJcbn1cclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1xuICoqIG1vZHVsZSBpZCA9IDI1M1xuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDUgNiA3IDggOSAxOCAxOSAyMCAyMyAyNCAyNSAyNiAyNyAyOCAyOSAzMCAzMSAzMlxuICoqLyIsIi8qIVxuICBDb3B5cmlnaHQgKGMpIDIwMTYgSmVkIFdhdHNvbi5cbiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChNSVQpLCBzZWVcbiAgaHR0cDovL2plZHdhdHNvbi5naXRodWIuaW8vY2xhc3NuYW1lc1xuKi9cbi8qIGdsb2JhbCBkZWZpbmUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuXHRmdW5jdGlvbiBjbGFzc05hbWVzICgpIHtcblx0XHR2YXIgY2xhc3NlcyA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykgY29udGludWU7XG5cblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0aWYgKGFyZ1R5cGUgPT09ICdzdHJpbmcnIHx8IGFyZ1R5cGUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdGNsYXNzZXMucHVzaChhcmcpO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcblx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKSk7XG5cdFx0XHR9IGVsc2UgaWYgKGFyZ1R5cGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAodmFyIGtleSBpbiBhcmcpIHtcblx0XHRcdFx0XHRpZiAoaGFzT3duLmNhbGwoYXJnLCBrZXkpICYmIGFyZ1trZXldKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2goa2V5KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY2xhc3Nlcy5qb2luKCcgJyk7XG5cdH1cblxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIHJlZ2lzdGVyIGFzICdjbGFzc25hbWVzJywgY29uc2lzdGVudCB3aXRoIG5wbSBwYWNrYWdlIG5hbWVcblx0XHRkZWZpbmUoJ2NsYXNzbmFtZXMnLCBbXSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNsYXNzTmFtZXM7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LmNsYXNzTmFtZXMgPSBjbGFzc05hbWVzO1xuXHR9XG59KCkpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY2xhc3NuYW1lcy9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDI1NFxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDE5IDI0IDI2IDMyXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwvOWovNEFBUVNrWkpSZ0FCQVFBQUFRQUJBQUQvL2dBN1ExSkZRVlJQVWpvZ1oyUXRhbkJsWnlCMk1TNHdJQ2gxYzJsdVp5QkpTa2NnU2xCRlJ5QjJPREFwTENCeGRXRnNhWFI1SUQwZ09UQUsvOXNBUXdBREFnSURBZ0lEQXdNREJBTURCQVVJQlFVRUJBVUtCd2NHQ0F3S0RBd0xDZ3NMRFE0U0VBME9FUTRMQ3hBV0VCRVRGQlVWRlF3UEZ4Z1dGQmdTRkJVVS85c0FRd0VEQkFRRkJBVUpCUVVKRkEwTERSUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVLzhBQUVRZ0FVQUJRQXdFaUFBSVJBUU1SQWYvRUFCOEFBQUVGQVFFQkFRRUJBQUFBQUFBQUFBQUJBZ01FQlFZSENBa0tDLy9FQUxVUUFBSUJBd01DQkFNRkJRUUVBQUFCZlFFQ0F3QUVFUVVTSVRGQkJoTlJZUWNpY1JReWdaR2hDQ05Dc2NFVlV0SHdKRE5pY29JSkNoWVhHQmthSlNZbktDa3FORFUyTnpnNU9rTkVSVVpIU0VsS1UxUlZWbGRZV1ZwalpHVm1aMmhwYW5OMGRYWjNlSGw2ZzRTRmhvZUlpWXFTazVTVmxwZVltWnFpbzZTbHBxZW9xYXF5czdTMXRyZTR1YnJDdzhURnhzZkl5Y3JTMDlUVjF0ZlkyZHJoNHVQazVlYm42T25xOGZMejlQWDI5L2o1K3YvRUFCOEJBQU1CQVFFQkFRRUJBUUVBQUFBQUFBQUJBZ01FQlFZSENBa0tDLy9FQUxVUkFBSUJBZ1FFQXdRSEJRUUVBQUVDZHdBQkFnTVJCQVVoTVFZU1FWRUhZWEVUSWpLQkNCUkNrYUd4d1Frak0xTHdGV0p5MFFvV0pEVGhKZkVYR0JrYUppY29LU28xTmpjNE9UcERSRVZHUjBoSlNsTlVWVlpYV0ZsYVkyUmxabWRvYVdwemRIVjJkM2g1ZW9LRGhJV0doNGlKaXBLVGxKV1dsNWlabXFLanBLV21wNmlwcXJLenRMVzJ0N2k1dXNMRHhNWEd4OGpKeXRMVDFOWFcxOWpaMnVMajVPWG01K2pwNnZMejlQWDI5L2o1K3YvYUFBd0RBUUFDRVFNUkFEOEErdCtLS1B4by9HZ0E3MFlvL0dqOGFBREZINFZlc2RDMUhVbDNXdGpjWENmMzQ0eVYvUEdLVyswSFV0TlhkZFdOemJwL2ZraklYODhZb0FvZmhSK0ZINDBmalFBZmhSK0ZINDBmalFBVVVVVUFGZXBlQVBoNUQ5bGkxTFZZaEs4ZzNRMjdqNVZYc3pEdVQ2ZjVIQStGdE9YVnZFV24ycmpNY2tvM2oxVWNrZmtEWDBNQmdZSEFvQVJWQ0tGVUJWSEFBNkNsWlF3S2taQkdDRFMwVUFlYytQdmgzQkpheTZscFVRaW1qQmVXM1FZVngzS2pzZmJ2L1B5cXZwdXZudnhmcHFhVDRsMUMxUWJZMGxKVURzcmZNQitSb0F5S0tLS0FDaWlpZ0RhOEdYcTZmNHAwMmVRZ0lKUXBKN0J2bHordGZRUDRWOHlEZzE3UDRBOGN3NjVaeFdWNUlFMUtNYmZtUCt1QTdqMzlSK05BSGFVZmhTVVVBTCtGZUErT0wxTlE4V2FsTkdRVTgzWUNPKzBCZjZWNmI0OThjUTZCWnlXbHJJSk5Ta1hhQXB6NVFQOEFFZmYwRmVLazVPVHlUUUFVVVVVQUg0MGZqUlUxbmFUWDkzRGJRSVhtbFlJaWp1VFFCYzBEdy9lZUk3NFcxbW00OVhrYmhVSHFUWHNIaHo0ZWFYb0NwSThZdmJzY21hWVpBUDhBc3IwSDgvZXRId3Y0Y2c4TTZYSGF4QU5JZm1sbHh5N2R6OVBTdGlnQS9Hay9HbG9vQTVieEo4UGRMMTlYa1dNV2Q0M1Bud2pHVC90TDBQOEFQM3J4L1gvRDk1NGN2amJYaWJUMVNSZVZjZW9OZlJGWkhpanc1QjRtMHVTMWxBV1FmTkZMamxHN0g2ZXRBSHo1K05INDFOZVdrMWhkelcwNkZKb25LTXA3RUdvYUFDdlFmaEJvd3VkVHVkUmtYSzJ5N0k4aitOdXAvQWZ6cno2dmFmaFJhQ0R3bWtnSE04enVmd08zL3dCbG9BN0tpaWo4S0FDa3BhU2dCYVNqOEtLQVBKdmkvb3d0dFR0dFJqWEMzSzdKTWYzbDZIOFIvS3ZQcTlwK0sxcUovQ2J5RWN3VEk0UDFPMy8yYXZGcUFQL1pcIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvaW1hZ2VzL2RlZmF1bHRIZWFkZXJJY29uLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDI1NVxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDI0IDI2IDI5IDMwIDMxIDMyXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwiYXJyb3dEb3duXCI6IHtcblx0XHRcInBhdGhzXCI6IFtcblx0XHRcdFwiTTAgMzg0bDM4My43NSAzODMuNzUgMzgzLjc1LTM4My43NWgtNzY3LjV6XCJcblx0XHRdLFxuXHRcdFwicG9zaXRpb25cIjogW1xuXHRcdFx0MSxcblx0XHRcdDBcblx0XHRdXG5cdH1cbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9jb21wb25lbnRzL2xvZ2luQ29udHJvbC9pY29ucy5qc29uXG4gKiogbW9kdWxlIGlkID0gMjU2XG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMjQgMjYgMzJcbiAqKi8iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xuXG5pbXBvcnQgU2lnbkluIGZyb20gJy4vU2lnbkluJ1xuaW1wb3J0IFNpZ25VcCBmcm9tICcuL1NpZ25VcCdcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuXG5jb25zdCBzdHlsZXMgPSB7XG4gIGNvdmVyOiB7XG4gICAgbGVmdDogMCxcbiAgICB0b3A6IDAsXG4gICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgd2lkdGg6ICcxMDB2dycsXG4gICAgaGVpZ2h0OiAnMTAwdmgnLFxuICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC4yKScsXG4gICAgekluZGV4OiAxMCxcbiAgfSxcbiAgc3RhZ2U6IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcbiAgICBtYXJnaW46ICcyMDBweCBhdXRvIDAnLFxuICAgIHdpZHRoOiAnMzYwcHgnLFxuICAgIGhlaWdodDogJ2F1dG8nLFxuICB9LFxuICBoZWFkZXI6IHtcbiAgICBtYXJnaW5MZWZ0OiAnMjBweCcsXG4gICAgbWFyZ2luUmlnaHQ6ICcyMHB4JyxcbiAgfSxcbiAgdGFiOiB7XG4gICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgcGFkZGluZzogJzBweCAxNXB4JyxcbiAgICBoZWlnaHQ6ICc1MHB4JyxcbiAgICBsaW5lSGVpZ2h0OiAnNTBweCcsXG4gICAgZm9udFdlaWdodDogJzUwMCcsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgfSxcbiAgYWN0aXZlVGFiOiB7XG4gICAgYm9yZGVyQm90dG9tOiAnMnB4IHNvbGlkIHJlZCcsXG4gIH0sXG4gIGJvZHk6IHtcbiAgICBtYXJnaW5Ub3A6ICctMXB4JyxcbiAgICBtYXJnaW5MZWZ0OiAnMjBweCcsXG4gICAgbWFyZ2luUmlnaHQ6ICcyMHB4JyxcbiAgICBwYWRkaW5nVG9wOiAnMjBweCcsXG4gICAgYm9yZGVyVG9wOiAnMXB4IHNvbGlkICNkZGQnLFxuICB9LFxuICBoaWRlOiB7XG4gICAgZGlzcGxheTogJ25vbmUnLFxuICB9LFxufVxuXG5jbGFzcyBMb2dpbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRlID0ge1xuICAgIHN0YXR1czogJ05vbmUnLFxuICB9XG4gIHNob3dTaWduSW4gPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzdGF0dXM6ICdTaWduSW4nLFxuICAgIH0pXG4gIH1cbiAgc2hvd1NpZ25VcCA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHN0YXR1czogJ1NpZ25VcCcsXG4gICAgfSlcbiAgfVxuICBoYW5kbGVDbGljayA9IChlKSA9PiB7XG4gICAgaWYgKGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQpIHtcbiAgICAgIHRoaXMuaGlkZSgpXG4gICAgfVxuICB9XG4gIGhpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzdGF0dXM6ICdOb25lJyxcbiAgICB9KVxuICB9XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHN0YXR1cyB9ID0gdGhpcy5zdGF0ZVxuICAgIGNvbnN0IGxvZ2luU3R5bGUgPSBfLm1lcmdlKHt9LCBzdHlsZXMuY292ZXIsIHN0YXR1cyA9PT0gJ05vbmUnID8gc3R5bGVzLmhpZGUgOiB7fSlcbiAgICBjb25zdCBpblRhYlN0eWxlID0gXy5tZXJnZSh7fSwgc3R5bGVzLnRhYiwgc3RhdHVzID09PSAnU2lnbkluJyA/IHN0eWxlcy5hY3RpdmVUYWIgOiB7fSlcbiAgICBjb25zdCB1cFRhYlN0eWxlID0gXy5tZXJnZSh7fSwgc3R5bGVzLnRhYiwgc3RhdHVzID09PSAnU2lnblVwJyA/IHN0eWxlcy5hY3RpdmVUYWIgOiB7fSlcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBuYW1lPVwibG9naW5cIlxuICAgICAgICBzdHlsZT17bG9naW5TdHlsZX1cbiAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja31cbiAgICAgID5cbiAgICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLnN0YWdlfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMuaGVhZGVyfT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luVGFiU3R5bGV9IG9uQ2xpY2s9e3RoaXMuc2hvd1NpZ25Jbn0+XG4gICAgICAgICAgICAgIHsn55m7IOW9lSd9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3VwVGFiU3R5bGV9IG9uQ2xpY2s9e3RoaXMuc2hvd1NpZ25VcH0+XG4gICAgICAgICAgICAgIHsn5rOoIOWGjCd9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMuYm9keX0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN0YXR1cyA9PT0gJ1NpZ25JbicgPyA8U2lnbkluIC8+IDogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzdGF0dXMgPT09ICdTaWduVXAnID8gPFNpZ25VcCAvPiA6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuY29uc3QgYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbmFuY2hvci5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnbG9naW4tYW5jaG9yJylcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYW5jaG9yKVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdERPTS5yZW5kZXIoXG4gIDxMb2dpbiAvPixcbiAgYW5jaG9yXG4pXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9jb21wb25lbnRzL2xvZ2luL0xvZ2luLmpzeFxuICoqLyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcblxuaW1wb3J0IElucHV0U3R5bGUgZnJvbSAnSW5wdXRTdHlsZSdcblxuaW1wb3J0IHsgc2lnbkluIH0gZnJvbSAnTG9naW5BY3Rpb24nXG5pbXBvcnQgY3NzIGZyb20gJy4vU2lnbkluLnNjc3MnXG5cbmNsYXNzIFNpZ25JbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRlID0ge1xuICAgIHVzZXJuYW1lOiAnJyxcbiAgICBwYXNzd29yZDogJycsXG4gIH1cbiAgaGFuZGxlVXNlcm5hbWUgPSAoZSkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdXNlcm5hbWU6IGUudGFyZ2V0LnZhbHVlLFxuICAgIH0pXG4gIH1cbiAgaGFuZGxlUGFzc3dvcmQgPSAoZSkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGFzc3dvcmQ6IGUudGFyZ2V0LnZhbHVlLFxuICAgIH0pXG4gIH1cbiAgaGFuZGxlU2lnbmluID0gKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgY29uc3QgdXNlciA9IHtcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQ6IHRoaXMuc3RhdGUucGFzc3dvcmQsXG4gICAgfVxuICAgIGNvbnN0IHN1Y2Nlc3NIYW5kbGUgPSAoKSA9PiBsb2NhdGlvbi5yZWxvYWQoKVxuICAgIGNvbnN0IGZhaWxIYW5kbGUgPSAocmVzdWx0KSA9PiBjb25zb2xlLmxvZyhyZXN1bHQuZGVzYylcbiAgICBjb25zdCBlcnJIYW5kbGUgPSAoZXJyKSA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgc2lnbkluKHVzZXIsIHsgc3VjY2Vzc0hhbmRsZSwgZmFpbEhhbmRsZSwgZXJySGFuZGxlIH0pXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0gPSB0aGlzLnN0YXRlXG4gICAgcmV0dXJuIChcbiAgICAgIDxmb3JtPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y3NzLmZvcm1Hcm91cH0+XG4gICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJmb3JtLXVzZXJuYW1lXCIgLz5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGtleT17J3VzZXJuYW1lJ31cbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXsnVXNlcm5hbWUuLi4nfVxuICAgICAgICAgICAgc3R5bGU9e0lucHV0U3R5bGUubm9ybWFsfVxuICAgICAgICAgICAgdmFsdWU9e3VzZXJuYW1lfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlVXNlcm5hbWV9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjc3MuZm9ybUdyb3VwfT5cbiAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImZvcm0tcGFzc3dvcmRcIiAvPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAga2V5PXsncGFzc3dvcmQnfVxuICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgIG5hbWU9XCJmb3JtLXBhc3N3b3JkXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXsnUGFzc3dvcmQuLi4nfVxuICAgICAgICAgICAgc3R5bGU9e0lucHV0U3R5bGUubm9ybWFsfVxuICAgICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlUGFzc3dvcmR9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjc3MuZm9ybUdyb3VwfT5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17Y3NzLmJ1dHRvbn0gb25DbGljaz17dGhpcy5oYW5kbGVTaWduaW59PlxuICAgICAgICAgICAgeyfnmbsg5b2VJ31cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Zvcm0+XG4gICAgKVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBTaWduSW5cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW4vU2lnbkluLmpzeFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBub3JtYWw6IHtcbiAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgaGVpZ2h0OiAnMzZweCcsXG4gICAgcGFkZGluZzogJzZweCAxMnB4JyxcbiAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgIGxpbmVIZWlnaHQ6ICcxLjQyODU3MTQzJyxcbiAgICBjb2xvcjogJyM1NTU1NTUnLFxuICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmZmZmYhaW1wb3J0YW50JyxcbiAgICBiYWNrZ3JvdW5kSW1hZ2U6ICdub25lJyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgI2U0ZTRlNCcsXG4gICAgYm9yZGVyUmFkaXVzOiAnMHB4JyxcbiAgICB0cmFuc2l0aW9uOiAnYm9yZGVyLWNvbG9yIGVhc2UtaW4tb3V0IC4xNXMsIGJveC1zaGFkb3cgZWFzZS1pbi1vdXQgLjE1cycsXG4gICAgb3V0bGluZTogJ25vbmUnLFxuICAgICc6Zm9jdXMnOiB7XG4gICAgICBvdXRsaW5lOiAnbm9uZScsXG4gICAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgxMDQsIDE4NCwgNDAsIDAuNSknLFxuICAgIH0sXG4gIH0sXG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb21wb25lbnRzL2NvbW1vbi9mb3Jtcy9pbnB1dC5zdHlsZS5qc1xuICoqLyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL1NpZ25Jbi5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9TaWduSW4uc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9TaWduSW4uc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9jb21wb25lbnRzL2xvZ2luL1NpZ25Jbi5zY3NzXG4gKiogbW9kdWxlIGlkID0gMjYwXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMjQgMjYgMzJcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5TaWduSW5fX2Zvcm1Hcm91cF9fXzNaWU1UIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHBhZGRpbmctYm90dG9tOiAyMHB4OyB9XFxuXFxuLlNpZ25Jbl9fYnV0dG9uX19fX1BmRmUge1xcbiAgaGVpZ2h0OiA0MHB4O1xcbiAgd2lkdGg6IDEwMCU7XFxuICBmb250LXNpemU6IDE2cHg7XFxuICBtYXJnaW4tYm90dG9tOiAxMHB4O1xcbiAgYm9yZGVyOiAxcHggc29saWQgIzUwNzEwMDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHllbGxvd2dyZWVuOyB9XFxuXFxuLlNpZ25Jbl9fYnV0dG9uX19fX1BmRmU6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzlhZDQyNTsgfVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcbmV4cG9ydHMubG9jYWxzID0ge1xuXHRcImZvcm1Hcm91cFwiOiBcIlNpZ25Jbl9fZm9ybUdyb3VwX19fM1pZTVRcIixcblx0XCJidXR0b25cIjogXCJTaWduSW5fX2J1dHRvbl9fX19QZkZlXCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlcj9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi9+L3Bvc3Rjc3MtbG9hZGVyIS4vfi9zYXNzLWxvYWRlciEuL3NyYy9lbnRyeS9jb21wb25lbnRzL2xvZ2luL1NpZ25Jbi5zY3NzXG4gKiogbW9kdWxlIGlkID0gMjYxXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMjQgMjYgMzJcbiAqKi8iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5cbmltcG9ydCBJbnB1dFN0eWxlIGZyb20gJ0lucHV0U3R5bGUnXG5pbXBvcnQgY3NzIGZyb20gJy4vU2lnblVwLnNjc3MnXG5pbXBvcnQgeyBzaWduVXAgfSBmcm9tICdMb2dpbkFjdGlvbidcblxuY2xhc3MgU2lnblVwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGUgPSB7XG4gICAgdXNlcm5hbWU6ICcnLFxuICAgIHBhc3N3b3JkOiAnJyxcbiAgICBuYW1lOiAnJyxcbiAgfVxuICBoYW5kbGVVc2VybmFtZSA9IChlKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB1c2VybmFtZTogZS50YXJnZXQudmFsdWUsXG4gICAgfSlcbiAgfVxuICBoYW5kbGVQYXNzd29yZCA9IChlKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwYXNzd29yZDogZS50YXJnZXQudmFsdWUsXG4gICAgfSlcbiAgfVxuICBoYW5kbGVOYW1lID0gKGUpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG5hbWU6IGUudGFyZ2V0LnZhbHVlLFxuICAgIH0pXG4gIH1cbiAgaGFuZGxlU2lnblVwID0gKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgY29uc3QgdXNlciA9IHtcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQ6IHRoaXMuc3RhdGUucGFzc3dvcmQsXG4gICAgICBuYW1lOiB0aGlzLnN0YXRlLm5hbWUsXG4gICAgfVxuICAgIGNvbnN0IHN1Y2Nlc3NIYW5kbGUgPSAoKSA9PiBsb2NhdGlvbi5yZWxvYWQoKVxuICAgIGNvbnN0IGZhaWxIYW5kbGUgPSAocmVzdWx0KSA9PiBjb25zb2xlLmxvZyhyZXN1bHQuZGVzYylcbiAgICBjb25zdCBlcnJIYW5kbGUgPSAoZXJyKSA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgc2lnblVwKHVzZXIsIHsgc3VjY2Vzc0hhbmRsZSwgZmFpbEhhbmRsZSwgZXJySGFuZGxlIH0pXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgdXNlcm5hbWUsIHBhc3N3b3JkLCBuYW1lIH0gPSB0aGlzLnN0YXRlXG4gICAgcmV0dXJuIChcbiAgICAgIDxmb3JtPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y3NzLmZvcm1Hcm91cH0+XG4gICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJmb3JtLXVzZXJuYW1lXCIgLz5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGtleT17J3VzZXJuYW1lJ31cbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXsnVXNlcm5hbWUuLi4nfVxuICAgICAgICAgICAgc3R5bGU9e0lucHV0U3R5bGUubm9ybWFsfVxuICAgICAgICAgICAgdmFsdWU9e3VzZXJuYW1lfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlVXNlcm5hbWV9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjc3MuZm9ybUdyb3VwfT5cbiAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImZvcm0tcGFzc3dvcmRcIiAvPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAga2V5PXsncGFzc3dvcmQnfVxuICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgIG5hbWU9XCJmb3JtLXBhc3N3b3JkXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXsnUGFzc3dvcmQuLi4nfVxuICAgICAgICAgICAgc3R5bGU9e0lucHV0U3R5bGUubm9ybWFsfVxuICAgICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlUGFzc3dvcmR9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjc3MuZm9ybUdyb3VwfT5cbiAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImZvcm0tbmFtZVwiIC8+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBrZXk9eyduYW1lJ31cbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIG5hbWU9XCJmb3JtLW5hbWVcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9eyduYW1lLi4uJ31cbiAgICAgICAgICAgIHN0eWxlPXtJbnB1dFN0eWxlLm5vcm1hbH1cbiAgICAgICAgICAgIHZhbHVlPXtuYW1lfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlTmFtZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Nzcy5mb3JtR3JvdXB9PlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtjc3MuYnV0dG9ufSBvbkNsaWNrPXt0aGlzLmhhbmRsZVNpZ25VcH0+XG4gICAgICAgICAgICB7J+azqCDlhownfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZm9ybT5cbiAgICApXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFNpZ25VcFxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvY29tcG9uZW50cy9sb2dpbi9TaWduVXAuanN4XG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vU2lnblVwLnNjc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL1NpZ25VcC5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL1NpZ25VcC5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW4vU2lnblVwLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSAyNjNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyNCAyNiAzMlxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLlNpZ25VcF9fZm9ybUdyb3VwX19fMjZrMGwge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgcGFkZGluZy1ib3R0b206IDIwcHg7IH1cXG5cXG4uU2lnblVwX19idXR0b25fX18zWjQwdCB7XFxuICBoZWlnaHQ6IDQwcHg7XFxuICB3aWR0aDogMTAwJTtcXG4gIGZvbnQtc2l6ZTogMTZweDtcXG4gIG1hcmdpbi1ib3R0b206IDEwcHg7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjNTA3MTAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogeWVsbG93Z3JlZW47IH1cXG5cXG4uU2lnblVwX19idXR0b25fX18zWjQwdDpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjOWFkNDI1OyB9XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuZXhwb3J0cy5sb2NhbHMgPSB7XG5cdFwiZm9ybUdyb3VwXCI6IFwiU2lnblVwX19mb3JtR3JvdXBfX18yNmswbFwiLFxuXHRcImJ1dHRvblwiOiBcIlNpZ25VcF9fYnV0dG9uX19fM1o0MHRcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuL34vcG9zdGNzcy1sb2FkZXIhLi9+L3Nhc3MtbG9hZGVyIS4vc3JjL2VudHJ5L2NvbXBvbmVudHMvbG9naW4vU2lnblVwLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSAyNjRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyNCAyNiAzMlxuICoqLyIsImltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCdcblxuY2xhc3MgU3ZnSWNvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGdldFRyYW5zZm9ybSA9IChwb3NpdGlvbiwgZGlyZWN0aW9uLCBzaXplLCByZWFsSWNvblNpemUpID0+IHtcbiAgICBjb25zdCBzY2FsZVcgPSBzaXplWzBdIC8gcmVhbEljb25TaXplWzBdXG4gICAgY29uc3Qgc2NhbGVIID0gc2l6ZVsxXSAvIHJlYWxJY29uU2l6ZVsxXVxuICAgIHJldHVybiBgdHJhbnNsYXRlKCR7cG9zaXRpb24uam9pbignLCAnKX0pXG4gICAgc2NhbGUoJHtkaXJlY3Rpb24uam9pbignLCAnKX0gKSBzY2FsZSgke3NjYWxlV30sJHtzY2FsZUh9KWBcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBwYXRocywgc2l6ZSwgcG9zaXRpb24sIGRpcmVjdGlvbiwgcmVhbEljb25TaXplLFxuICAgICAgc3R5bGUsIGNsYXNzTmFtZSwgb25DbGljayB9ID0gdGhpcy5wcm9wc1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnXG4gICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgIHdpZHRoPXtzaXplWzBdfVxuICAgICAgICBoZWlnaHQ9e3NpemVbMV19XG4gICAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICA+XG4gICAgICAgIDxnIHRyYW5zZm9ybT17dGhpcy5nZXRUcmFuc2Zvcm0ocG9zaXRpb24sIGRpcmVjdGlvbiwgc2l6ZSwgcmVhbEljb25TaXplKX0+XG4gICAgICAgICAge3BhdGhzLm1hcCgocGF0aCwgaSkgPT4gPHBhdGgga2V5PXtpfSBkPXtwYXRofSAvPil9XG4gICAgICAgIDwvZz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxufVxuU3ZnSWNvbi5kZWZhdWx0UHJvcHMgPSB7XG4gIHNpemU6IFsxNiwgMTZdLFxuICBwb3NpdGlvbjogWzAsIDBdLFxuICBkaXJlY3Rpb246IFsxLCAxXSxcbiAgcmVhbEljb25TaXplOiBbMTAyNCwgMTAyNF0sXG59XG5TdmdJY29uLnByb3BUeXBlcyA9IHtcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmMsXG4gIHBhdGhzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKS5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubnVtYmVyKSxcbiAgcG9zaXRpb246IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5udW1iZXIpLFxuICBkaXJlY3Rpb246IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5udW1iZXIpLFxuICByZWFsSWNvblNpemU6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5udW1iZXIpLFxufVxuZXhwb3J0IGRlZmF1bHQgU3ZnSWNvblxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29tcG9uZW50cy9zdmdJY29uL1N2Z0ljb24uanN4XG4gKiovIiwiaW1wb3J0IHJlcXVlc3QgZnJvbSAnc3VwZXJhZ2VudCdcblxuZXhwb3J0IGZ1bmN0aW9uIHVwbG9hZEltYWdlKGltYWdlLCB7IHN1Y2Nlc3NIYW5kbGUsIGZhaWxIYW5kbGUsIGVyckhhbmRsZSB9KSB7XG4gIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgZm9ybURhdGEuYXBwZW5kKCdmaWxlVHlwZScsIGltYWdlLnR5cGUpXG4gIGZvcm1EYXRhLmFwcGVuZCgnaW1hZ2UnLCBpbWFnZSlcbiAgcmVxdWVzdC5wb3N0KCcvYXBpL2ltYWdlL2FkZCcpXG4gICAgLnNlbmQoZm9ybURhdGEpXG4gICAgLnRoZW4oKHJlcykgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXMudGV4dClcbiAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAmJiBzdWNjZXNzSGFuZGxlKSB7XG4gICAgICAgIHN1Y2Nlc3NIYW5kbGUocmVzdWx0KVxuICAgICAgfSBlbHNlIGlmICghcmVzdWx0LnN1Y2Nlc3MgJiYgZmFpbEhhbmRsZSkge1xuICAgICAgICBmYWlsSGFuZGxlKHJlc3VsdClcbiAgICAgIH1cbiAgICB9LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJySGFuZGxlKSB7XG4gICAgICAgIGVyckhhbmRsZShlcnIpXG4gICAgICB9XG4gICAgfSlcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L2FjdGlvbnMvaW1hZ2VBY3Rpb24uanN4XG4gKiovIiwiZXhwb3J0IGZ1bmN0aW9uIGltYWdlVVJMKGZpbGVuYW1lKSB7XG4gIGlmICghZmlsZW5hbWUpIHtcbiAgICByZXR1cm4gZmlsZW5hbWVcbiAgfVxuICByZXR1cm4gYC9yZXNvdXJjZXMvaW1ncy8ke2ZpbGVuYW1lLnN1YnN0cigwLCAzKX0vJHtmaWxlbmFtZX1gXG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS91dGlscy9wYXRodXRpbC5qc3hcbiAqKi8iLCJpbXBvcnQgcmVxdWVzdCBmcm9tICdzdXBlcmFnZW50J1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0SGVhZGVySWNvbihmaWxlbmFtZSwgeyBzdWNjZXNzSGFuZGxlLCBmYWlsSGFuZGxlLCBlcnJIYW5kbGUgfSkge1xuICByZXF1ZXN0LnB1dCgnL2FwaS91c2VyL2hlYWRlckljb24nKVxuICAgIC5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKVxuICAgIC5zZW5kKHsgZmlsZW5hbWUgfSlcbiAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBKU09OLnBhcnNlKHJlcy50ZXh0KVxuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzICYmIHN1Y2Nlc3NIYW5kbGUpIHtcbiAgICAgICAgc3VjY2Vzc0hhbmRsZShyZXN1bHQpXG4gICAgICB9IGVsc2UgaWYgKCFyZXN1bHQuc3VjY2VzcyAmJiBmYWlsSGFuZGxlKSB7XG4gICAgICAgIGZhaWxIYW5kbGUocmVzdWx0KVxuICAgICAgfVxuICAgIH0sIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnJIYW5kbGUpIHtcbiAgICAgICAgZXJySGFuZGxlKGVycilcbiAgICAgIH1cbiAgICB9KVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvYWN0aW9ucy91c2VyQWN0aW9uLmpzeFxuICoqLyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcblxuaW1wb3J0IEhlYWRlciBmcm9tICcuL2NvbXBvbmVudHMvaGVhZGVyL0hlYWRlci5qc3gnXG5pbXBvcnQgY3NzIGZyb20gJy4vYmxvZy5zY3NzJ1xuXG5mdW5jdGlvbiBCbG9nKHsgY2hpbGRyZW4gfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgbmFtZT1cImJsb2ctcm91dGVyXCIgY2xhc3NOYW1lPXtjc3MuYmxvZ1N0YXRlfT5cbiAgICAgIDxIZWFkZXIgLz5cbiAgICAgIDxkaXYgbmFtZT1cImJsb2ctYm9keVwiIGNsYXNzTmFtZT17Y3NzLmJvZHl9PlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2dcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL2Jsb2cuanN4XG4gKiovIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuXG5pbXBvcnQgY3NzIGZyb20gJy4vSGVhZGVyLnNjc3MnXG5pbXBvcnQgYmxvZ0ltYWdlIGZyb20gJy4vaW1hZ2VzL2Jsb2cucG5nJ1xuaW1wb3J0IGhvbWVJbWFnZSBmcm9tICcuL2ltYWdlcy9ob21lLmpwZWcnXG5pbXBvcnQgTG9naW5Db250cm9sIGZyb20gJ0xvZ2luQ29udHJvbCdcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXG5cbmZ1bmN0aW9uIEhlYWRlcigpIHtcbiAgcmV0dXJuIChcbiAgICA8aGVhZGVyIGNsYXNzTmFtZT17Y3NzLmhlYWRlcn0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y3NzLndyYXB9PlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9e2Nzcy5pdGVtfT5cbiAgICAgICAgICA8TGluayB0bz1cIi9cIiBjbGFzc05hbWU9e2Nzcy5pdGVtfT5cbiAgICAgICAgICAgIDxpbWcgc3JjPXtob21lSW1hZ2V9IGFsdD1cImhvbWVcIiBjbGFzc05hbWU9e2Nzcy5pbWd9IC8+XG4gICAgICAgICAgPC9MaW5rPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT17Y3NzLml0ZW19PlxuICAgICAgICAgIDxMaW5rIHRvPVwiL2Jsb2dcIiBjbGFzc05hbWU9e2Nzcy5pdGVtfT5cbiAgICAgICAgICAgIDxpbWcgc3JjPXtibG9nSW1hZ2V9IGFsdD1cImJsb2dcIiBjbGFzc05hbWU9e2Nzcy5pbWd9IC8+XG4gICAgICAgICAgPC9MaW5rPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIDxzZWN0aW9uIHN0eWxlPXt7IGZsZXg6IDEgfX0gY2xhc3NOYW1lPXtjc3MuaXRlbX0gLz5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPXtjc3MuaXRlbX0+XG4gICAgICAgICAgPExvZ2luQ29udHJvbCAvPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2hlYWRlcj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBIZWFkZXJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL2NvbXBvbmVudHMvaGVhZGVyL0hlYWRlci5qc3hcbiAqKi8iLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9IZWFkZXIuc2Nzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vSGVhZGVyLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vSGVhZGVyLnNjc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9oZWFkZXIvSGVhZGVyLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSA1NjZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMzJcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5IZWFkZXJfX2hlYWRlcl9fXzEwazR1IHtcXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZWVlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjsgfVxcblxcbi5IZWFkZXJfX3dyYXBfX18yYVp1TSB7XFxuICBtYXgtd2lkdGg6IDk4MHB4O1xcbiAgbWFyZ2luOiAwIGF1dG87XFxuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcbiAgZGlzcGxheTogZmxleDsgfVxcblxcbi5IZWFkZXJfX2l0ZW1fX19aVlNMWSB7XFxuICBoZWlnaHQ6IDYwcHg7XFxuICBsaW5lLWhlaWdodDogNjBweDtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jazsgfVxcblxcbi5IZWFkZXJfX2ltZ19fXzFKUk5QIHtcXG4gIGhlaWdodDogNjBweDtcXG4gIHBhZGRpbmc6IDEwcHggMDsgfVxcblxcbi5IZWFkZXJfX21lbnVzX19fMktZVGEge1xcbiAgaGVpZ2h0OiA1MHB4O1xcbiAgbGluZS1oZWlnaHQ6IDUwcHg7IH1cXG5cXG4uSGVhZGVyX19tZW51TGlzdF9fXzMxVU80IHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIGZsb2F0OiBsZWZ0O1xcbiAgcGFkZGluZy1sZWZ0OiAyMHB4O1xcbiAgbGlzdC1zdHlsZTogbm9uZTsgfVxcblxcbi5IZWFkZXJfX21lbnVJdGVtX19faTJpNDIge1xcbiAgZmxvYXQ6IGxlZnQ7IH1cXG5cXG4uSGVhZGVyX19saW5rX19fM2hhQl8ge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICBjb2xvcjogIzMzMztcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjsgfVxcblxcbi5IZWFkZXJfX2xpbmtfX18zaGFCXzpob3ZlciB7XFxuICBjb2xvcjogIzMzMztcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7IH1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5leHBvcnRzLmxvY2FscyA9IHtcblx0XCJoZWFkZXJcIjogXCJIZWFkZXJfX2hlYWRlcl9fXzEwazR1XCIsXG5cdFwid3JhcFwiOiBcIkhlYWRlcl9fd3JhcF9fXzJhWnVNXCIsXG5cdFwiaXRlbVwiOiBcIkhlYWRlcl9faXRlbV9fX1pWU0xZXCIsXG5cdFwiaW1nXCI6IFwiSGVhZGVyX19pbWdfX18xSlJOUFwiLFxuXHRcIm1lbnVzXCI6IFwiSGVhZGVyX19tZW51c19fXzJLWVRhXCIsXG5cdFwibWVudUxpc3RcIjogXCJIZWFkZXJfX21lbnVMaXN0X19fMzFVTzRcIixcblx0XCJtZW51SXRlbVwiOiBcIkhlYWRlcl9fbWVudUl0ZW1fX19pMmk0MlwiLFxuXHRcImxpbmtcIjogXCJIZWFkZXJfX2xpbmtfX18zaGFCX1wiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXI/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vfi9wb3N0Y3NzLWxvYWRlciEuL34vc2Fzcy1sb2FkZXIhLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9oZWFkZXIvSGVhZGVyLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSA1NjdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMzJcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCIwZDU2NDE0YzlkOGYxYjQxMDEwOWIxMjAyMmY4ZDdhMS5wbmdcIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL2NvbXBvbmVudHMvaGVhZGVyL2ltYWdlcy9ibG9nLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDU2OFxuICoqIG1vZHVsZSBjaHVua3MgPSAzMlxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL2pwZWc7YmFzZTY0LC85ai80QUFRU2taSlJnQUJBUUVBWUFCZ0FBRC8yd0JEQUFvSEJ3a0hCZ29KQ0FrTEN3b01EeGtRRHc0T0R4NFdGeElaSkNBbUpTTWdJeUlvTFRrd0tDbzJLeUlqTWtReU5qczlRRUJBSmpCR1MwVStTamsvUUQzLzJ3QkRBUXNMQ3c4TkR4MFFFQjA5S1NNcFBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDMvd0FBUkNBRHRBTzBEQVNJQUFoRUJBeEVCLzhRQUh3QUFBUVVCQVFFQkFRRUFBQUFBQUFBQUFBRUNBd1FGQmdjSUNRb0wvOFFBdFJBQUFnRURBd0lFQXdVRkJBUUFBQUY5QVFJREFBUVJCUkloTVVFR0UxRmhCeUp4RkRLQmthRUlJMEt4d1JWUzBmQWtNMkp5Z2drS0ZoY1lHUm9sSmljb0tTbzBOVFkzT0RrNlEwUkZSa2RJU1VwVFZGVldWMWhaV21Oa1pXWm5hR2xxYzNSMWRuZDRlWHFEaElXR2g0aUppcEtUbEpXV2w1aVptcUtqcEtXbXA2aXBxckt6dExXMnQ3aTV1c0xEeE1YR3g4akp5dExUMU5YVzE5aloydUhpNCtUbDV1Zm82ZXJ4OHZQMDlmYjMrUG42LzhRQUh3RUFBd0VCQVFFQkFRRUJBUUFBQUFBQUFBRUNBd1FGQmdjSUNRb0wvOFFBdFJFQUFnRUNCQVFEQkFjRkJBUUFBUUozQUFFQ0F4RUVCU0V4QmhKQlVRZGhjUk1pTW9FSUZFS1JvYkhCQ1NNelV2QVZZbkxSQ2hZa05PRWw4UmNZR1JvbUp5Z3BLalUyTnpnNU9rTkVSVVpIU0VsS1UxUlZWbGRZV1ZwalpHVm1aMmhwYW5OMGRYWjNlSGw2Z29PRWhZYUhpSW1La3BPVWxaYVhtSm1hb3FPa3BhYW5xS21xc3JPMHRiYTN1TG02d3NQRXhjYkh5TW5LMHRQVTFkYlgyTm5hNHVQazVlYm42T25xOHZQMDlmYjMrUG42LzlvQURBTUJBQUlSQXhFQVB3RDJhaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWtvQVdpa29vQVdpaWlnQW9vb29BS0tUTkxRQVVVbEZBQzBVbExRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZKbkZBQzFrNjk0ajA3dzVhK2RxRSswdC9xNGw1ZVErdy9yWE1lTGZpWmE2VVhzOUgyWFY0T0drNnh4SC8yWS9wWGsxOWYzV3AzYjNWOU84ODc5WGM1L0FlZzlxQU4veEw0ODFYeEJPUkhLOW5hS2NwREU1QityRWRUVzU0VCtKMDFuNWRucnBlZUFjTGNnWmRQOTRmeEQzNi9XdlBlb3BLWUgwdmEzY0Y3YkpjV3NxVFF5REt1aHlEVTFmUGZoM3hWcVBobTUzMlVtNkJqKzh0MzVSLzhBQSs0cjJYd3o0eDA3eFBBUHM3K1ZkS1BudG5QekQzSHFQY1VnT2dvcEtLQVBLL2k5ZTNDYWpwOXFrMGlRK1NaTnFzUmx0Mk1tdk92dEUzL1BhWC92NGE3NzR3LzhoM1QvQVByMlAvb1JyejZtQS83Uk4vejNsLzcrR3Rmd25lM1VIaXZTekhjekx1dVVSdm5PQ3BPQ0QrRll0YWZobi9rYXRKLzYrNHYvQUVJVUFmUk5MU0dscEFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGSm11VDhXZkVDeDhPQjdlMzIzZW9kUEtVL0toLzJ6MituV2dEb05VMWV6MFd6YTYxQ2RJWVY3dDFKOUFPNXJ5RHhiOFJMM1hkOXJZYjdTd1BCQVB6eWovYVBZZXdybk5ZMXUvMTY4TnpxVTVsZitGZWlvUFJSMnFqUUFuSHBTMFVsTUJhS1Nsb0FLZEROTGJUSk5CSzhVcUhjam9jTXA5alRhS0FQVXZDWHhRV1FKWitJU0VmN3EzWUh5bi9BSHgyK3Rla1J1c2lLNk1HVmhsV1U1QkgxcjVscnBQQzNqalVmRE1peEEvYWJIUHpXN25wN3FleC9Ta0IxSHhkMHU2a3VMUFVvNFdlMWlpTWNqcU03RG5JejdIUFd2TWoxcjZJMFR4QnB2aWF5TXRsS3NneGlTRng4eVo3TXY4QWtWeG5pMzRYeDNKa3ZOQTJ4U25sclVuQ04vdW5zZmJwOUtBUEtzMXFlR2YrUnEwbi9yN2kvd0RRaFZDNHQ1YlM0ZUM0amVLYU00WkhHQ0RWL3dBTS93REkxYVQvQU5mY1gvb1FwZ2ZSSnBhU2xwQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlNVQUxVRjNlVzloYlNYRjFNa01NWXl6dWNBVmplSi9HV25lR0ljWEQrYmRNTXBieG41ajduMEh1YThhOFJlS2RSOFRYUG1Yc3UyRlRtTzNUaEUvRHVmYzBBZFQ0cytKMDk4WHM5Q0xRVzU0YTRQRHVQOW4rNlBmcjlLOCtPV0pMRWtrNUpQZWp0UlRBS0tLU2dCYWZERExjVEpEYnh2TEs1MnFpREpKK2xhdmgzd3RxUGlhNE1kakZ0aVZzU1R2a0luNDl6N0N2WmZESGc3VGZERUgranA1dDB3K2U1Y2ZNZlllZzloU0E1SHd2OEtrTVl1UEVKSlpsK1cxUnNiZmRtSGYyRllQaXo0ZFh1Zzc3cXczM2RnT1NRUG5pSCswTzQ5eFhxT3UrTHRKOE9GRXY3ajk4L1NLTWJueDZrZGhWN1ROVXN0WnNsdXJDZEo0VzdxZWg5Q094OWpRQjgzQWcwdGV3ZUxmaHBhNnB2dk5IRWRyZUhsbytrY24veEovU3ZKcit3dWRNdlh0YjJCNFowNm80eCtQdVBlbUJCU2MwQ2xvQXNXR29YV21YYVhWak84RTZkSFEvejlSN1Y2ejRTK0pkcnF1eTAxalphWHB3Rmt6aU9VLzhBc3A5cThlbyt0QUh2L2lUd2pwdmllREYxR0V1Rkg3dTRRZk92K0k5alhuMmxmRGpXOU84VzJiUEhHOXBienJLYmtPQUNvT2Z1OWMrMVUvQ1h4RnZkQ0NXbW9iN3l3SEF5Y3lSRDJQY2V4cjE3UzlWc3Rac2t1dFBuU2FGaDFYcUQ2RWRqU0F1MFVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGWld2ZUk5UDhBRGxvWjlRbTJrL2NpWGwzUHNLQU5PU1JJa1o1R1ZFVVpMTWNBRDNOZWErTFBpaXNmbVdmaDRoMys2MTJSOG8vM0IzK3Bya2ZGUGpqVWZFMGpSc3h0ckVINWJkRzYrN0h1ZjBybktBSHpUUzNFN3pUeU5KSzV5enVja24zTk1vb3BnRkZKVi9SOUZ2dGZ2UHN1blFOTEovRWVpb1BWajJvQXBBRWtLb0pKNkFEazE2RDRTK0dNOTlzdk5lVm9MYzhyYkE0ZC93RGUvdWoyNi9TdXQ4Si9EK3g4T2JiaWJGM2Y0LzFyRDVVLzNSL1hyV3pydmlMVC9EbGw5bzFDWUtUOXlNY3ZJZlFDa0JjdDdlMTB5eldHQ09LM3Q0VjRWUUZWUlhubmkzNG9wRnZzL0R4RHVQbGE3SXlvL3dCd2QvcjByay9GUGpqVWZFenRFVDltc00vTGJvZnZlN0h2L0t1YW9BZlBOTGN6dlBQSzhzcm5MTzV5V1B1YXU2TnJ0LzRmdXhjNmRPMGJmeEllVmNlakR2V2ZSVEE5eDhLZVB0UDhSaGJlWEZyZjk0V1BEKzZudjlPdGEyditHOU84U1duazZoQ0dLLzZ1VmVIalBzZjZWODhLU3BCVWtFSElJT0NEWG9uaFA0bnpXZmwyZXZGcG9PRlc1QXk2Zjd3N2ozNi9Xa0J6M2lyd1JxWGhtUXlNdjJpeEorVzRRY0QyWWRqK2xjM25nVjlMUXpXMnBXYXlSTkZjVzB5OEVZWlhGZWRlTFBoYXJlWmVlSGdGYjd6V2hQQi8zRDIraG9BOHZvcDAwVWtFenhUSTBjcUhheU9NRlQ3aW1Vd0ZxL28rdVgrZ1hvdXRPbk1iZnhMMVZ4Nk1POVo5TFFCN2g0VThmMkhpTUxiemJiVFVNZjZwajhyKzZIdjlPdGRaWHpHR0tzR0JJSU9RUndSWG9YaEw0bnpXV3l6MTB2UGJqaGJrY3VuKzkvZUh2MSt0SUQxcWxxRzF1NEw2MlM0dFpVbWhrR1ZkRGtHcHFBQ2lpaWdBb29vb0FqdURJTGVYeUFETHNPelBUZGppdm5EVkxtK3U5U25rMVNTUjd3TVZrOHpxcEhiSFlEMHI2VHJ6VDRvK0UvTmpPdVdNZVhRQVhTcU9vN1ArSGYyb0E4dG9wTTVwYVlCU0UxWnNOUHV0VHZFdGJHQjU1MzZJby9VK2dyMWp3bDhOTFhTL0x2TllDWFY0T1ZqeG1PSS8rekdnRGtQQ253NnZkZDJYVjhYczdBOGdrWWtrSCt5T3c5elhyK2w2VFphTFpMYTZmQWtNSzloMVkrcFBjMHVwNnBaYU5adGMzODZRUXIzWTlUNkFkelhrSGl6NGkzbXVlWmE2ZDVscFlIZzRPSkpSN25zUFlVZ093OFcvRXUwMGt2YWFUc3VyMGNGK3NjWit2Yyt3cnlXLzFDNzFTOGU2dnAzbm5mcTduUDREMEhzS3JZOUtBS1lDMFVVVUFGRkZGQUJSUlJRQnRlSFBGV3BlR3JuZlp5Ym9HUDd5M2MvSS93RGdmY1Y3SjRhOFg2YjRuZy8wWnpIY3FNdmJ5ZmVYNmVvOXhYZ09hZkJQTGF6cE5CSThVcUhjcm9jTXArdEFIdlBpZndicDNpZUxNNitUZHFNSmNSajVoN0gxRmVOZUl2QytvZUdybnk3NlBNVEg5M09uS1A4QWoyUHNhN3p3bDhVVW5LV2ZpQWlPVG90MkJoVy8zaDJQdjByMEc0dHJYVTdOb2JpT0s0dDVWNVZzTXJDa0I4MTBsZWcrTGZoaGNXQmU3MEVOY1cvSmEzUExvUDhBWi92RDlmclhuK0NNZ2dnanFEMnBnSUJSUzA2S0dTNG5qaGhScEpaR0NvaWpKWW5vS0FPeStGdDFxUThUTGJXanViSXF6WE1mVkFNY0gyT2NWN1JYUCtEUERFZmhqUlVnWUsxM0xoN2h4M2IwSHNPbGRCU0FXaWlpZ0Fvb29vQUtiSkdzc2JKSW9aR0dHQjZFZWxPb29BOEY4Y2VGWDhNYXd3aVUvWUxqTFFONmVxSDNIOHFQQzNnalVmRXpySW8rejJJUHpYRGpyN0tPNS9TdmNyeXd0ZFFpOHE4dDRyaU1ITzJWQXd6K05Fc3R2cDltMGtyUndXOEtaSlB5cWlqK1ZBRkhRUERlbmVITFB5TlBoMmsvZmxibDVEN24rbFpQaXp4OVkrRzFhM2gyM1dvZG9WYmhQZGoyK25XdVE4Vy9FK2E5MzJlZ2xvSU9qWEpHSGY4QTNSL0NQZnI5Szg5SkxFbGlTU2NrazlUUUJvYXpydC9yOTRiblVaMmtiK0ZPaUlQUlIyck9GTFJUQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQkFhNmJ3dDQ1MUR3eXl4Wk4xWTU1dDNiN3YrNmUzMDZWek9LV2dENkowUHhEcC9pS3pGeHA4d2ZIMzR6dzZIMElyRThXZkQrdzhSQjdtM3hhYWdSL3JWSHl2L3ZEK3ZXdkdkUDFHNzBxOVM2c1ozZ25UbzZuOUQ2ajJyMXZ3ZjhBRWUzMXQ0N0RVMVcydjIrVldIK3JsUHQ2SDJwQWVWYXhvbC9vVjZiYlViY3d2L0MzVlhIcXA3MTZGOEx2Q1d4UnJ0OUg4ekFpMVZoMEhkL3g3VjZKZDZmYWFoRUk3eTJodUl3Y2haVURBSDE1cWRFV05GUkZDcW93QUJnQVVBT29vb29BS0tLS0FDaWlpZ0Fvb29vQVN1WStKQi80b1RVZnBILzZHdGRSWEwvRWova1JOUitrZi9veGFBUENjYzB0RkZNQW9vb29BS0tLS0FDa3JyUEFYaGF6OFUzdDVGZlNUSXNNYXN2bE1BY2s0N2cxMi84QXdxTFEvd0RuNHY4QS92NFA4S0FQSEtLOWovNFZGb2YvQUQ4WC93RDM4SCtGSC9Db3RELzUrTC8vQUwrRC9DZ0R4Mmt6WHNmL0FBcUxRLzhBbjR2L0FQdjRQOEs4cTF5eGowelhyNnloTEdLM21hTlMzVWdldEFGS2lqRkZBQlJSUlFBVmMwWGpYYkFqL241ai93RFFoVkkxYzBiL0FKRGRoLzE4Ui84QW9Rb0Era2FXa0ZMU0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDdVgrSkgvSWlhajlJLy9SaTExRmN2OFNQK1JFMUg2Ui8rakZvQThLb29vcGdGRkZGQUJSUlJRQjZKOEhQK1FycWYvWEZQL1FqWHJOZVRmQnovQUpDdXAvOEFYRlAvQUVJMTZ6U0FLS0tLQUN2bm54Yi9BTWpocTMvWDAvOEFPdm9hdm5ueGIveU9HcmY5ZlQvem9BeUtLS0tZQlJSUlFBaHE1bzMvQUNHN0QvcjRqLzhBUWhWTTFjMGIva04ySC9YekgvNkVLQVBwRVV0SUtXa0FVVVVVQUZGRkZBQlJSUlFBVVVVVUFGY3Y4U1ArUkUxSDZSLytqRnJxSzVmNGtmOEFJaWFqOUkvL0FFWXRBSGhWRkZGTUFvb29vQUtLS0tBUFJQZzUvd0FoWFUvK3VLZitoR3ZXYThtK0RuL0lWMVAvQUs0cC93Q2hHdldhUUJSUlJRQVY4OCtMZitSdzFiL3I2ZjhBblgwTlh6ejR0LzVIRFZ2K3ZwLzUwQVpGRkZGTUFvb29vQVExYzBiL0FKRGRoLzE4eC84QW9RcW1hdWFOL3dBaHV3LzYrSS8vQUVJVUFmU0lwYVFVdElBb29vb0FLS0tLQUNpaWlnQW9vb29BSzVmNGtmOEFJaWFqOUkvL0FFWXRkUlhML0VqL0FKRVRVZnBIL3dDakZvQThLb29vcGdGRkZGQUJSUlJRQjZKOEhQOEFrSzZuL3dCY1UvOEFRalhyTmVUZkJ6L2tLNm4vQU5jVS93RFFqWHJOSUFvb29vQUsrZWZGdi9JNGF0LzE5UDhBenI2R3I1NThXLzhBSTRhdC93QmZUL3pvQXlLS0tLWUJSUlJRQWhxNW8zL0lic1ArdmlQL0FOQ0ZVelZ6UnY4QWtOMkgvWHhIL3dDaENnRDZSRkxTQ2xwQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJYTC9Fai9BSkVUVWZwSC93Q2pGcnFLNTd4M1pYR28rRHRRdDdPSXl6TXFsVVhxY01DY2ZnS0FQQXU5R2F1LzJOcWYvUU92UCsvTGY0VW45amFsL3dCQSs4Lzc4dC9oVEFwNW96VnoreHRTL3dDZ2ZlZjkrVy93by9zYlV2OEFvSFhuL2ZsdjhLQUtlYU0xYy9zYlV2OEFvSDNuL2ZsdjhLUDdHMUwvQUtCOTUvMzViL0NnRHVmZzUveUZkVC82NHAvNkVhOVpyekg0U2FWZTJkM3FOeGRXczBNVG9xSzBpRmR4eVR4bXZUcVFCUlJSUUFWODhlTGYrUncxZi9yNmYrZGZRMWVFZU1ORDFNZUxOU2NXRnl5U3pOSWpKR1dWbFBRZ2lnRG1jMFpxNy9ZMnBmOEFRT3ZQKy9MZjRVbjlqYWwvMEQ3ei92eTMrRk1Dbm1qTlhQN0cxTC9vSDNuL0FINWIvQ2oreHRTLzZCMTUvd0IrVy93b0FxZGF1YU4veUc3RC9yNWovd0RRaFFORzFML29IM24vQUg1Yi9DdERRZEExV2Z4QllLdW4zS2dUb3haNGlvQUJCSkpJb0ErZ0tXa3BhUUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVbExSUUFsR0tXaWdCTVVZcGFLQUV4Umlsb29BU2xvb29BS0tLS0FDa3BhS0FFb3hTMFVBSmlqRkxSUUFsRkxSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQi8vMlE9PVwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvYmxvZy9jb21wb25lbnRzL2hlYWRlci9pbWFnZXMvaG9tZS5qcGVnXG4gKiogbW9kdWxlIGlkID0gNTY5XG4gKiogbW9kdWxlIGNodW5rcyA9IDMyXG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vYmxvZy5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9ibG9nLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vYmxvZy5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL2Jsb2cuc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDU3MFxuICoqIG1vZHVsZSBjaHVua3MgPSAzMlxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLmJsb2dfX2Jsb2dTdGF0ZV9fXzFBZm93IHtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcXG4gIC13ZWJraXQtYm94LWRpcmVjdGlvbjogbm9ybWFsO1xcbiAgICAgIC1tcy1mbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyB9XFxuXFxuLmJsb2dfX2JvZHlfX19sZmZYOCB7XFxuICAtd2Via2l0LWJveC1mbGV4OiAxO1xcbiAgICAgIC1tcy1mbGV4OiAxO1xcbiAgICAgICAgICBmbGV4OiAxOyB9XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuZXhwb3J0cy5sb2NhbHMgPSB7XG5cdFwiYmxvZ1N0YXRlXCI6IFwiYmxvZ19fYmxvZ1N0YXRlX19fMUFmb3dcIixcblx0XCJib2R5XCI6IFwiYmxvZ19fYm9keV9fX2xmZlg4XCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlcj9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi9+L3Bvc3Rjc3MtbG9hZGVyIS4vfi9zYXNzLWxvYWRlciEuL3NyYy9lbnRyeS9yb3V0ZXMvYmxvZy9ibG9nLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSA1NzFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMzJcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9