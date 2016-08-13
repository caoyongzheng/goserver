webpackJsonp([29],{

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

/***/ 255:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAUABQAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+t+KKPxo/GgA70Yo/Gj8aADFH4VesdC1HUl3WtjcXCf344yV/PGKW+0HUtNXddWNzbp/fkjIX88YoAofhR+FH40fjQAfhR+FH40fjQAUUUUAFepeAPh5D9li1LVYhK8g3Q27j5VXszDuT6f5HA+FtOXVvEWn2rjMcko3j1UckfkDX0MBgYHAoARVCKFUBVHAA6ClZQwKkZBGCDS0UAec+Pvh3BJay6lpUQimjBeW3QYVx3Kjsfbv/PyqvpuvnvxfpqaT4l1C1QbY0lJUDsrfMB+RoAyKKKKACiiigDa8GXq6f4p02eQgIJQpJ7Bvlz+tfQP4V8yDg17P4A8cw65ZxWV5IE1KMbfmP+uA7j39R+NAHaUfhSUUAL+FeA+OL1NQ8WalNGQU83YCO+0Bf6V6b498cQ6BZyWlrIJNSkXaApz5QP8AEff0FeKk5OTyTQAUUUUAH40fjRU1naTX93DbQIXmlYIijuTQBc0Dw/eeI74W1mm49XkbhUHqTXsHhz4eaXoCpI8YvbscmaYZAP8Asr0H8/etHwv4cg8M6XHaxANIfmllxy7dz9PStigA/Gk/GlooA5bxJ8PdL19XkWMWd43PnwjGT/tL0P8AP3rx/X/D954cvjbXibT1SReVceoNfRFZHijw5B4m0uS1lAWQfNFLjlG7H6etAHz5+NH41NeWk1hdzW06FJonKMp7EGoaACvQfhBowudTudRkXK2y7I8j+Nup/Afzrz6vafhRaCDwmkgHM8zufwO3/wBloA7Kiij8KACkpaSgBaSj8KKAPJvi/owttTttRjXC3K7JMf3l6H8R/KvPq9p+K1qJ/CbyEcwTI4P1O3/2avFqAP/Z"

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

/***/ 539:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _superagent = __webpack_require__(241);
	
	var _superagent2 = _interopRequireDefault(_superagent);
	
	var _Home = __webpack_require__(540);
	
	var _Home2 = _interopRequireDefault(_Home);
	
	var _BlogContainer = __webpack_require__(542);
	
	var _BlogContainer2 = _interopRequireDefault(_BlogContainer);
	
	var _BlogBox = __webpack_require__(543);
	
	var _BlogBox2 = _interopRequireDefault(_BlogBox);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Home = function (_React$Component) {
	  _inherits(Home, _React$Component);
	
	  function Home() {
	    var _Object$getPrototypeO;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Home);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Home)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      blogs: []
	    }, _this.getBlogPage = function (page, pagesize) {
	      _superagent2.default.get('/api/blog/page').query({ page: page, pagesize: pagesize }).then(function (res) {
	        var result = JSON.parse(res.text);
	        if (result.success) {
	          _this.setState({
	            blogs: result.data.elements
	          });
	        } else {
	          $.notify(result.desc);
	        }
	      }, function (err) {
	        $.notify(err);
	      });
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(Home, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.getBlogPage(1, 10);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var blogs = this.state.blogs;
	
	      return _react2.default.createElement(
	        'div',
	        { name: 'homeStage', className: _Home2.default.homeStage },
	        _react2.default.createElement(
	          _BlogContainer2.default,
	          null,
	          blogs.map(function (blog, i) {
	            return _react2.default.createElement(_BlogBox2.default, { key: i, blog: blog });
	          })
	        )
	      );
	    }
	  }]);
	
	  return Home;
	}(_react2.default.Component);
	
	module.exports = Home;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(239)))

/***/ },

/***/ 540:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(541);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../node_modules/postcss-loader/index.js!./../../../../../../node_modules/sass-loader/index.js!./Home.scss", function() {
				var newContent = require("!!./../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../node_modules/postcss-loader/index.js!./../../../../../../node_modules/sass-loader/index.js!./Home.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 541:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".Home__homeStage___2DNSl {\n  max-width: 980px;\n  margin: 0 auto;\n  padding: 0 10px;\n  position: relative;\n  height: 100%; }\n", ""]);
	
	// exports
	exports.locals = {
		"homeStage": "Home__homeStage___2DNSl"
	};

/***/ },

/***/ 542:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var styles = {
	  timeLine: {
	    width: '1px',
	    position: 'absolute',
	    top: 0,
	    left: '60px',
	    bottom: 0,
	    borderLeft: '2px solid #cfdbe4'
	  }
	};
	
	function BlogContainer(_ref) {
	  var children = _ref.children;
	
	  return _react2.default.createElement(
	    'div',
	    { name: 'container' },
	    _react2.default.createElement('div', { style: styles.timeLine }),
	    _react2.default.createElement(
	      'div',
	      { style: { position: 'relative' } },
	      children
	    )
	  );
	}
	exports.default = BlogContainer;

/***/ },

/***/ 543:
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
	
	var _SvgIcon = __webpack_require__(265);
	
	var _SvgIcon2 = _interopRequireDefault(_SvgIcon);
	
	var _icons = __webpack_require__(544);
	
	var _icons2 = _interopRequireDefault(_icons);
	
	var _reactRouter = __webpack_require__(172);
	
	var _SideInfo = __webpack_require__(545);
	
	var _SideInfo2 = _interopRequireDefault(_SideInfo);
	
	var _Clamp = __webpack_require__(548);
	
	var _Clamp2 = _interopRequireDefault(_Clamp);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var styles = {
	  blogBox: {
	    position: 'relative',
	    padding: '20px 0 40px'
	  },
	  blogConciseBox: {
	    paddingLeft: '120px',
	    marginTop: '20px'
	  },
	  blogConcise: {
	    boxShadow: '1px 1px 2px rgba(0,0,0,.08)',
	    border: '1px solid #dee8ef',
	    background: '#fff',
	    padding: '25px 40px',
	    position: 'relative'
	  },
	  arrow: {
	    position: 'absolute',
	    left: '-0.6em',
	    top: '28px',
	    width: '1.2em',
	    height: '1.2em',
	    transform: 'rotate(45deg)',
	    transition: 'background 0.1s linear',
	    backgroundColor: '#fff',
	    borderLeft: '1px solid #dee8ef',
	    borderBottom: '1px solid #dee8ef',
	    zIndex: 2
	  },
	  title: {
	    fontSize: '24px',
	    paddingBottom: '20px',
	    lineHeight: '30px'
	  },
	  titleLink: {
	    color: '#0078c9',
	    textDecoration: 'none',
	    cursor: 'pointer'
	  },
	  blogCover: {
	    overflow: 'hidden',
	    maxHeight: '200px',
	    marginBottom: '32px',
	    borderRadius: '8px',
	    textAlign: 'center'
	  },
	  blogCoverImg: {
	    maxWidth: '100%',
	    height: 'auto',
	    verticalAlign: 'top'
	  },
	  blogText: {
	    fontSize: '14px',
	    fontWeight: 300,
	    color: '#464b52',
	    lineHeight: '28px'
	  },
	  blogStatistics: {
	    paddingTop: '20px',
	    fontSize: '14px',
	    color: '#999'
	  },
	  blogStatisticsItem: {
	    marginRight: '20px'
	  },
	  blogStatisticsItemLink: {
	    color: 'rgba(41,46,53,0.6)',
	    textDecoration: 'none',
	    cursor: 'pointer'
	  }
	};
	
	var BlogBox = function (_React$Component) {
	  _inherits(BlogBox, _React$Component);
	
	  function BlogBox() {
	    var _Object$getPrototypeO;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, BlogBox);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(BlogBox)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.toBlog = function () {
	      var _this$props = _this.props;
	      var router = _this$props.router;
	      var blog = _this$props.blog;
	
	      router.push({
	        pathname: '/blog/view',
	        query: {
	          blogId: blog.id
	        }
	      });
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(BlogBox, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      (0, _Clamp2.default)(_reactDom2.default.findDOMNode(this.refs.text), { clamp: 3 });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props$blog = this.props.blog;
	      var title = _props$blog.title;
	      var cover = _props$blog.cover;
	      var content = _props$blog.content;
	      var updateDate = _props$blog.updateDate;
	      var views = _props$blog.views;
	      var authorName = _props$blog.authorName;
	      var headerIcon = _props$blog.headerIcon;
	      var commentSize = _props$blog.commentSize;
	
	      return _react2.default.createElement(
	        'section',
	        { style: styles.blogBox },
	        _react2.default.createElement(_SideInfo2.default, {
	          category: _icons2.default.golang,
	          time: updateDate,
	          headerIcon: headerIcon,
	          name: authorName
	        }),
	        _react2.default.createElement(
	          'div',
	          { style: styles.blogConciseBox },
	          _react2.default.createElement(
	            'div',
	            { style: styles.blogConcise },
	            _react2.default.createElement('div', { style: styles.arrow }),
	            _react2.default.createElement(
	              'div',
	              { name: 'blog-title', style: styles.title },
	              _react2.default.createElement(
	                'a',
	                { onClick: this.toBlog, style: styles.titleLink },
	                title
	              )
	            ),
	            cover ? _react2.default.createElement(
	              'div',
	              { style: styles.blogCover },
	              _react2.default.createElement('img', { src: cover, alt: 'blogCover', style: styles.blogCoverImg })
	            ) : null,
	            _react2.default.createElement(
	              'div',
	              { ref: 'text', name: 'blog-text', style: styles.blogText },
	              content
	            ),
	            _react2.default.createElement(
	              'div',
	              { style: styles.blogStatistics },
	              _react2.default.createElement(
	                'span',
	                { style: styles.blogStatisticsItem },
	                _react2.default.createElement(
	                  'a',
	                  { onClick: this.toBlog, style: styles.blogStatisticsItemLink },
	                  _react2.default.createElement(
	                    'span',
	                    null,
	                    _react2.default.createElement(_SvgIcon2.default, _icons2.default.view)
	                  ),
	                  _react2.default.createElement(
	                    'span',
	                    { style: { marginRight: '20px' } },
	                    views
	                  )
	                )
	              ),
	              _react2.default.createElement(
	                'span',
	                { style: styles.blogStatisticsItem },
	                _react2.default.createElement(
	                  'a',
	                  { onClick: this.toBlog, style: styles.blogStatisticsItemLink },
	                  _react2.default.createElement(
	                    'span',
	                    null,
	                    _react2.default.createElement(_SvgIcon2.default, _icons2.default.comment)
	                  ),
	                  _react2.default.createElement(
	                    'span',
	                    { style: { marginRight: '20px' } },
	                    commentSize
	                  )
	                )
	              )
	            )
	          )
	        )
	      );
	    }
	  }]);
	
	  return BlogBox;
	}(_react2.default.Component);
	
	BlogBox.propTypes = {
	  blog: _react.PropTypes.object.isRequired
	};
	exports.default = (0, _reactRouter.withRouter)(BlogBox);

/***/ },

/***/ 544:
/***/ function(module, exports) {

	module.exports = {
		"view": {
			"paths": [
				"M512 192c-223.318 0-416.882 130.042-512 320 95.118 189.958 288.682 320 512 320 223.312 0 416.876-130.042 512-320-95.116-189.958-288.688-320-512-320zM764.45 361.704c60.162 38.374 111.142 89.774 149.434 150.296-38.292 60.522-89.274 111.922-149.436 150.296-75.594 48.218-162.89 73.704-252.448 73.704-89.56 0-176.858-25.486-252.452-73.704-60.158-38.372-111.138-89.772-149.432-150.296 38.292-60.524 89.274-111.924 149.434-150.296 3.918-2.5 7.876-4.922 11.86-7.3-9.96 27.328-15.41 56.822-15.41 87.596 0 141.382 114.616 256 256 256 141.382 0 256-114.618 256-256 0-30.774-5.452-60.268-15.408-87.598 3.978 2.378 7.938 4.802 11.858 7.302v0zM512 416c0 53.020-42.98 96-96 96s-96-42.98-96-96 42.98-96 96-96 96 42.982 96 96z"
			],
			"size": [
				14,
				14
			],
			"style": {
				"fill": "#777",
				"marginRight": "8px",
				"padding": "2px 0"
			}
		},
		"comment": {
			"paths": [
				"M960 300q0-87-60-160.75t-163-116.5-225-42.75q-35 0-72.5 4-99-87.5-230-121-24.5-7-57-11-8.5-1-15.25 4.5t-8.75 14.5l0 0.5q-1.5 2 2.5 6t1 5 2.25 4.75l3 4.5 3.5 4.25 4 4.5q3.5 4 15.5 17.25t17.25 19 15.5 19.75 16.25 25.5 13.5 29.5 13 38q-78.5 44.5-123.75 110t-45.25 140.5q0 65 35.5 124.25t95.5 102.25 143 68.25 174 25.25q122 0 225-42.75t163-116.5 60-160.75z"
			],
			"size": [
				14,
				14
			],
			"direction": [
				1,
				-1
			],
			"position": [
				0,
				10
			],
			"style": {
				"fill": "#777",
				"marginRight": "8px",
				"padding": "2px 0"
			}
		},
		"edit": {
			"paths": [
				"M864 0c88.364 0 160 71.634 160 160 0 36.020-11.91 69.258-32 96l-64 64-224-224 64-64c26.742-20.090 59.978-32 96-32zM64 736l-64 288 288-64 592-592-224-224-592 592zM715.578 363.578l-448 448-55.156-55.156 448-448 55.156 55.156z"
			],
			"style": {
				"fill": "#777"
			}
		}
	};

/***/ },

/***/ 545:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _SideInfo = __webpack_require__(546);
	
	var _SideInfo2 = _interopRequireDefault(_SideInfo);
	
	var _DefaultHeaderIcon = __webpack_require__(255);
	
	var _DefaultHeaderIcon2 = _interopRequireDefault(_DefaultHeaderIcon);
	
	var _PathUtil = __webpack_require__(267);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function SideInfo(_ref) {
	  var time = _ref.time;
	  var headerIcon = _ref.headerIcon;
	  var name = _ref.name;
	
	  var date = new Date(time);
	  var timeFormat = date.getMonth() + 1 + '月' + date.getDate() + '日';
	  return _react2.default.createElement(
	    'div',
	    { className: _SideInfo2.default.sideInfo },
	    _react2.default.createElement(
	      'a',
	      { className: _SideInfo2.default.headerIconLink },
	      _react2.default.createElement('img', {
	        src: (0, _PathUtil.imageURL)(headerIcon) || _DefaultHeaderIcon2.default,
	        className: _SideInfo2.default.headerIcon,
	        alt: 'authorIcon'
	      })
	    ),
	    _react2.default.createElement(
	      'div',
	      { className: _SideInfo2.default.time },
	      timeFormat
	    ),
	    _react2.default.createElement(
	      'div',
	      { className: _SideInfo2.default.author },
	      _react2.default.createElement(
	        'a',
	        { className: _SideInfo2.default.authorLink },
	        name || 'anonymous'
	      )
	    )
	  );
	}
	
	SideInfo.propTypes = {
	  time: _react.PropTypes.string,
	  headerIcon: _react.PropTypes.string,
	  name: _react.PropTypes.string
	};
	
	exports.default = SideInfo;

/***/ },

/***/ 546:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(547);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./SideInfo.scss", function() {
				var newContent = require("!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./SideInfo.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 547:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".SideInfo__sideInfo___2Kq9u {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100px;\n  padding: 40px 0;\n  text-align: center; }\n\n.SideInfo__headerIconLink___3At5U {\n  text-decoration: none; }\n\n.SideInfo__headerIcon___mEnqx {\n  width: 60px;\n  height: 60px;\n  border-radius: 60px;\n  background: #90a1ac;\n  line-height: 60px;\n  text-align: center;\n  margin: 0 auto; }\n\n.SideInfo__time___36VNg {\n  border-radius: 3px;\n  font-size: 12px;\n  color: #6e7c86;\n  width: 60px;\n  height: 24px;\n  line-height: 24px;\n  margin: 20px auto;\n  background: #dee8ef;\n  text-align: center;\n  border: 1px solid #cfdbe4; }\n\n.SideInfo__author___15Zym {\n  border-radius: 24px;\n  width: 100px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  font-size: 12px;\n  color: #6e7c86;\n  height: 24px;\n  line-height: 24px;\n  margin: 20px auto;\n  background: #dee8ef;\n  text-align: center;\n  border: 1px solid #cfdbe4; }\n\n.SideInfo__authorIcon___3t7vR {\n  width: 24px;\n  height: 24px;\n  border-radius: 24px;\n  float: left; }\n\n.SideInfo__authorLink___1uttq {\n  text-decoration: none;\n  color: #6e7c86; }\n", ""]);
	
	// exports
	exports.locals = {
		"sideInfo": "SideInfo__sideInfo___2Kq9u",
		"headerIconLink": "SideInfo__headerIconLink___3At5U",
		"headerIcon": "SideInfo__headerIcon___mEnqx",
		"time": "SideInfo__time___36VNg",
		"author": "SideInfo__author___15Zym",
		"authorIcon": "SideInfo__authorIcon___3t7vR",
		"authorLink": "SideInfo__authorLink___1uttq"
	};

/***/ },

/***/ 548:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = clamp;
	/**
	* Clamps a text node.
	* @param {HTMLElement} element. Element containing the text node to clamp.
	* @param {Object} options. Options to pass to the clamper.
	* from https://github.com/josephschmitt/Clamp.js
	*/
	function clamp(element, options) {
	    options = options || {};
	
	    var self = this,
	        win = window,
	        opt = {
	        clamp: options.clamp || 2,
	        useNativeClamp: typeof options.useNativeClamp != 'undefined' ? options.useNativeClamp : true,
	        splitOnChars: options.splitOnChars || ['.', '-', '–', '—', ' '], //Split on sentences (periods), hypens, en-dashes, em-dashes, and words (spaces).
	        animate: options.animate || false,
	        truncationChar: options.truncationChar || '…',
	        truncationHTML: options.truncationHTML
	    },
	        sty = element.style,
	        originalText = element.innerHTML,
	        supportsNativeClamp = typeof element.style.webkitLineClamp != 'undefined',
	        clampValue = opt.clamp,
	        isCSSValue = clampValue.indexOf && (clampValue.indexOf('px') > -1 || clampValue.indexOf('em') > -1),
	        truncationHTMLContainer;
	
	    if (opt.truncationHTML) {
	        truncationHTMLContainer = document.createElement('span');
	        truncationHTMLContainer.innerHTML = opt.truncationHTML;
	    }
	
	    // UTILITY FUNCTIONS __________________________________________________________
	
	    /**
	     * Return the current style for an element.
	     * @param {HTMLElement} elem The element to compute.
	     * @param {string} prop The style property.
	     * @returns {number}
	     */
	    function computeStyle(elem, prop) {
	        if (!win.getComputedStyle) {
	            win.getComputedStyle = function (el, pseudo) {
	                this.el = el;
	                this.getPropertyValue = function (prop) {
	                    var re = /(\-([a-z]){1})/g;
	                    if (prop == 'float') prop = 'styleFloat';
	                    if (re.test(prop)) {
	                        prop = prop.replace(re, function () {
	                            return arguments[2].toUpperCase();
	                        });
	                    }
	                    return el.currentStyle && el.currentStyle[prop] ? el.currentStyle[prop] : null;
	                };
	                return this;
	            };
	        }
	
	        return win.getComputedStyle(elem, null).getPropertyValue(prop);
	    }
	
	    /**
	     * Returns the maximum number of lines of text that should be rendered based
	     * on the current height of the element and the line-height of the text.
	     */
	    function getMaxLines(height) {
	        var availHeight = height || element.clientHeight,
	            lineHeight = getLineHeight(element);
	
	        return Math.max(Math.floor(availHeight / lineHeight), 0);
	    }
	
	    /**
	     * Returns the maximum height a given element should have based on the line-
	     * height of the text and the given clamp value.
	     */
	    function getMaxHeight(clmp) {
	        var lineHeight = getLineHeight(element);
	        return lineHeight * clmp;
	    }
	
	    /**
	     * Returns the line-height of an element as an integer.
	     */
	    function getLineHeight(elem) {
	        var lh = computeStyle(elem, 'line-height');
	        if (lh == 'normal') {
	            // Normal line heights vary from browser to browser. The spec recommends
	            // a value between 1.0 and 1.2 of the font size. Using 1.1 to split the diff.
	            lh = parseInt(computeStyle(elem, 'font-size')) * 1.2;
	        }
	        return parseInt(lh);
	    }
	
	    // MEAT AND POTATOES (MMMM, POTATOES...) ______________________________________
	    var splitOnChars = opt.splitOnChars.slice(0),
	        splitChar = splitOnChars[0],
	        chunks,
	        lastChunk;
	
	    /**
	     * Gets an element's last child. That may be another node or a node's contents.
	     */
	    function getLastChild(elem) {
	        //Current element has children, need to go deeper and get last child as a text node
	        if (elem.lastChild.children && elem.lastChild.children.length > 0) {
	            return getLastChild(Array.prototype.slice.call(elem.children).pop());
	        }
	        //This is the absolute last child, a text node, but something's wrong with it. Remove it and keep trying
	        else if (!elem.lastChild || !elem.lastChild.nodeValue || elem.lastChild.nodeValue == '' || elem.lastChild.nodeValue == opt.truncationChar) {
	                elem.lastChild.parentNode.removeChild(elem.lastChild);
	                return getLastChild(element);
	            }
	            //This is the last child we want, return it
	            else {
	                    return elem.lastChild;
	                }
	    }
	
	    /**
	     * Removes one character at a time from the text until its width or
	     * height is beneath the passed-in max param.
	     */
	    function truncate(target, maxHeight) {
	        if (!maxHeight) {
	            return;
	        }
	
	        /**
	         * Resets global variables.
	         */
	        function reset() {
	            splitOnChars = opt.splitOnChars.slice(0);
	            splitChar = splitOnChars[0];
	            chunks = null;
	            lastChunk = null;
	        }
	
	        var nodeValue = target.nodeValue.replace(opt.truncationChar, '');
	
	        //Grab the next chunks
	        if (!chunks) {
	            //If there are more characters to try, grab the next one
	            if (splitOnChars.length > 0) {
	                splitChar = splitOnChars.shift();
	            }
	            //No characters to chunk by. Go character-by-character
	            else {
	                    splitChar = '';
	                }
	
	            chunks = nodeValue.split(splitChar);
	        }
	
	        //If there are chunks left to remove, remove the last one and see if
	        // the nodeValue fits.
	        if (chunks.length > 1) {
	            // console.log('chunks', chunks);
	            lastChunk = chunks.pop();
	            // console.log('lastChunk', lastChunk);
	            applyEllipsis(target, chunks.join(splitChar));
	        }
	        //No more chunks can be removed using this character
	        else {
	                chunks = null;
	            }
	
	        //Insert the custom HTML before the truncation character
	        if (truncationHTMLContainer) {
	            target.nodeValue = target.nodeValue.replace(opt.truncationChar, '');
	            element.innerHTML = target.nodeValue + ' ' + truncationHTMLContainer.innerHTML + opt.truncationChar;
	        }
	
	        //Search produced valid chunks
	        if (chunks) {
	            //It fits
	            if (element.clientHeight <= maxHeight) {
	                //There's still more characters to try splitting on, not quite done yet
	                if (splitOnChars.length >= 0 && splitChar != '') {
	                    applyEllipsis(target, chunks.join(splitChar) + splitChar + lastChunk);
	                    chunks = null;
	                }
	                //Finished!
	                else {
	                        return element.innerHTML;
	                    }
	            }
	        }
	        //No valid chunks produced
	        else {
	                //No valid chunks even when splitting by letter, time to move
	                //on to the next node
	                if (splitChar == '') {
	                    applyEllipsis(target, '');
	                    target = getLastChild(element);
	
	                    reset();
	                }
	            }
	
	        //If you get here it means still too big, let's keep truncating
	        if (opt.animate) {
	            setTimeout(function () {
	                truncate(target, maxHeight);
	            }, opt.animate === true ? 10 : opt.animate);
	        } else {
	            return truncate(target, maxHeight);
	        }
	    }
	
	    function applyEllipsis(elem, str) {
	        elem.nodeValue = str + opt.truncationChar;
	    }
	
	    // CONSTRUCTOR ________________________________________________________________
	
	    if (clampValue == 'auto') {
	        clampValue = getMaxLines();
	    } else if (isCSSValue) {
	        clampValue = getMaxLines(parseInt(clampValue));
	    }
	
	    var clampedText;
	    if (supportsNativeClamp && opt.useNativeClamp) {
	        sty.overflow = 'hidden';
	        sty.textOverflow = 'ellipsis';
	        sty.webkitBoxOrient = 'vertical';
	        sty.display = '-webkit-box';
	        sty.webkitLineClamp = clampValue;
	
	        if (isCSSValue) {
	            sty.height = opt.clamp + 'px';
	        }
	    } else {
	        var height = getMaxHeight(clampValue);
	        if (height <= element.clientHeight) {
	            clampedText = truncate(getLastChild(element), height);
	        }
	    }
	
	    return {
	        'original': originalText,
	        'clamped': clampedText
	    };
	}

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzP2RhMDQqKioqKioqKioqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanM/Yjk4MCoqKioqKioqKioqKioqKioqIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9pbWFnZXMvZGVmYXVsdEhlYWRlckljb24ucG5nP2I5NTkqKiIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9zdmdJY29uL1N2Z0ljb24uanN4P2FjMTkqKiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvdXRpbHMvcGF0aHV0aWwuanN4PzEyOWIqKioqIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvYmxvZy9yb3V0ZXMvaG9tZS9Ib21lLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvcm91dGVzL2hvbWUvSG9tZS5zY3NzPzFlZTMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL3JvdXRlcy9ob21lL0hvbWUuc2NzcyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9ibG9nQ29udGFpbmVyL0Jsb2dDb250YWluZXIuanN4Iiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvYmxvZy9jb21wb25lbnRzL2Jsb2dDb250YWluZXIvYmxvZy9CbG9nQm94LmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9ibG9nQ29udGFpbmVyL2Jsb2cvaWNvbnMuanNvbiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9ibG9nQ29udGFpbmVyL2Jsb2cvY29tcG9uZW50cy9TaWRlSW5mby5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL2NvbXBvbmVudHMvYmxvZ0NvbnRhaW5lci9ibG9nL2NvbXBvbmVudHMvU2lkZUluZm8uc2Nzcz82ZTdkIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvYmxvZy9jb21wb25lbnRzL2Jsb2dDb250YWluZXIvYmxvZy9jb21wb25lbnRzL1NpZGVJbmZvLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9DbGFtcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBLHlDQUF3QyxnQkFBZ0I7QUFDeEQsS0FBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLG9CQUFvQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWdCLG1CQUFtQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0Isc0JBQXNCO0FBQ3RDO0FBQ0E7QUFDQSxtQkFBa0IsMkJBQTJCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFlLG1CQUFtQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNB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YUFBSSxZQUFKLEdBQW1CLFVBQW5CO0FBQ0EsYUFBSSxlQUFKLEdBQXNCLFVBQXRCO0FBQ0EsYUFBSSxPQUFKLEdBQWMsYUFBZDtBQUNBLGFBQUksZUFBSixHQUFzQixVQUF0Qjs7QUFFQSxhQUFJLFVBQUosRUFBZ0I7QUFDWixpQkFBSSxNQUFKLEdBQWEsSUFBSSxLQUFKLEdBQVksSUFBekI7QUFDSDtBQUNKLE1BVkQsTUFXSztBQUNELGFBQUksU0FBUyxhQUFhLFVBQWIsQ0FBYjtBQUNBLGFBQUksVUFBVSxRQUFRLFlBQXRCLEVBQW9DO0FBQ2hDLDJCQUFjLFNBQVMsYUFBYSxPQUFiLENBQVQsRUFBZ0MsTUFBaEMsQ0FBZDtBQUNIO0FBQ0o7O0FBRUQsWUFBTztBQUNILHFCQUFZLFlBRFQ7QUFFSCxvQkFBVztBQUZSLE1BQVA7QUFJRixFIiwiZmlsZSI6ImpzLzI5LTBjMTc3MDQwYzQ1ZDI1YjkxN2IzLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgbGlzdCA9IFtdO1xyXG5cclxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXHJcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzW2ldO1xyXG5cdFx0XHRpZihpdGVtWzJdKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBpdGVtWzFdICsgXCJ9XCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKGl0ZW1bMV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0LmpvaW4oXCJcIik7XHJcblx0fTtcclxuXHJcblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcclxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XHJcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcclxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xyXG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XHJcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcclxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcclxuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxyXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xyXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxyXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxyXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xyXG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xyXG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblx0cmV0dXJuIGxpc3Q7XHJcbn07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4gKiogbW9kdWxlIGlkID0gMjUyXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSA2IDcgOCA5IDE4IDE5IDIwIDIzIDI0IDI1IDI2IDI3IDI4IDI5IDMwIDMxIDMyXG4gKiovIiwiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxudmFyIHN0eWxlc0luRG9tID0ge30sXHJcblx0bWVtb2l6ZSA9IGZ1bmN0aW9uKGZuKSB7XHJcblx0XHR2YXIgbWVtbztcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRcdHJldHVybiBtZW1vO1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cdGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIC9tc2llIFs2LTldXFxiLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpO1xyXG5cdH0pLFxyXG5cdGdldEhlYWRFbGVtZW50ID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcblx0fSksXHJcblx0c2luZ2xldG9uRWxlbWVudCA9IG51bGwsXHJcblx0c2luZ2xldG9uQ291bnRlciA9IDAsXHJcblx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AgPSBbXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xyXG5cdGlmKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xyXG5cdFx0aWYodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XHJcblx0fVxyXG5cclxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cclxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XHJcblxyXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiA8aGVhZD4uXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcclxuXHJcblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0KTtcclxuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcclxuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XHJcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xyXG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XHJcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcclxuXHRcdH1cclxuXHRcdGlmKG5ld0xpc3QpIHtcclxuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0KTtcclxuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcclxuXHRcdH1cclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xyXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XHJcblx0XHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKVxyXG5cdFx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oKTtcclxuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKSB7XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XHJcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcclxuXHRcdGlmKGRvbVN0eWxlKSB7XHJcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHBhcnRzID0gW107XHJcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMobGlzdCkge1xyXG5cdHZhciBzdHlsZXMgPSBbXTtcclxuXHR2YXIgbmV3U3R5bGVzID0ge307XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcclxuXHRcdHZhciBpZCA9IGl0ZW1bMF07XHJcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcclxuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XHJcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcclxuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcclxuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKVxyXG5cdFx0XHRzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XHJcblx0fVxyXG5cdHJldHVybiBzdHlsZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpIHtcclxuXHR2YXIgaGVhZCA9IGdldEhlYWRFbGVtZW50KCk7XHJcblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Bbc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XHJcblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcclxuXHRcdGlmKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xyXG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGhlYWQuZmlyc3RDaGlsZCk7XHJcblx0XHR9IGVsc2UgaWYobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcclxuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0XHR9XHJcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlRWxlbWVudCk7XHJcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XHJcblx0XHRoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnLiBNdXN0IGJlICd0b3AnIG9yICdib3R0b20nLlwiKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcclxuXHRzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdHZhciBpZHggPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlRWxlbWVudCk7XHJcblx0aWYoaWR4ID49IDApIHtcclxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcclxuXHR2YXIgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xyXG5cdHN0eWxlRWxlbWVudC50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xyXG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpO1xyXG5cdHJldHVybiBzdHlsZUVsZW1lbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpIHtcclxuXHR2YXIgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcclxuXHRsaW5rRWxlbWVudC5yZWwgPSBcInN0eWxlc2hlZXRcIjtcclxuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGlua0VsZW1lbnQpO1xyXG5cdHJldHVybiBsaW5rRWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU3R5bGUob2JqLCBvcHRpb25zKSB7XHJcblx0dmFyIHN0eWxlRWxlbWVudCwgdXBkYXRlLCByZW1vdmU7XHJcblxyXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xyXG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBzaW5nbGV0b25FbGVtZW50IHx8IChzaW5nbGV0b25FbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcclxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIGZhbHNlKTtcclxuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIHRydWUpO1xyXG5cdH0gZWxzZSBpZihvYmouc291cmNlTWFwICYmXHJcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xyXG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XHJcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XHJcblx0XHRcdGlmKHN0eWxlRWxlbWVudC5ocmVmKVxyXG5cdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGVFbGVtZW50LmhyZWYpO1xyXG5cdFx0fTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xyXG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XHJcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKG9iaik7XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZShuZXdPYmopIHtcclxuXHRcdGlmKG5ld09iaikge1xyXG5cdFx0XHRpZihuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXApXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cdH07XHJcbn1cclxuXHJcbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xyXG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xyXG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XHJcblx0fTtcclxufSkoKTtcclxuXHJcbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcoc3R5bGVFbGVtZW50LCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcclxuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XHJcblxyXG5cdGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XHJcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlRWxlbWVudC5jaGlsZE5vZGVzO1xyXG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xyXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGNzc05vZGUpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZUVsZW1lbnQsIG9iaikge1xyXG5cdHZhciBjc3MgPSBvYmouY3NzO1xyXG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcclxuXHJcblx0aWYobWVkaWEpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcclxuXHR9XHJcblxyXG5cdGlmKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR3aGlsZShzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xyXG5cdFx0fVxyXG5cdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlTGluayhsaW5rRWxlbWVudCwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IG9iai5jc3M7XHJcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XHJcblxyXG5cdGlmKHNvdXJjZU1hcCkge1xyXG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcclxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcclxuXHR9XHJcblxyXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xyXG5cclxuXHR2YXIgb2xkU3JjID0gbGlua0VsZW1lbnQuaHJlZjtcclxuXHJcblx0bGlua0VsZW1lbnQuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XHJcblxyXG5cdGlmKG9sZFNyYylcclxuXHRcdFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcclxufVxyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXG4gKiogbW9kdWxlIGlkID0gMjUzXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSA2IDcgOCA5IDE4IDE5IDIwIDIzIDI0IDI1IDI2IDI3IDI4IDI5IDMwIDMxIDMyXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwvOWovNEFBUVNrWkpSZ0FCQVFBQUFRQUJBQUQvL2dBN1ExSkZRVlJQVWpvZ1oyUXRhbkJsWnlCMk1TNHdJQ2gxYzJsdVp5QkpTa2NnU2xCRlJ5QjJPREFwTENCeGRXRnNhWFI1SUQwZ09UQUsvOXNBUXdBREFnSURBZ0lEQXdNREJBTURCQVVJQlFVRUJBVUtCd2NHQ0F3S0RBd0xDZ3NMRFE0U0VBME9FUTRMQ3hBV0VCRVRGQlVWRlF3UEZ4Z1dGQmdTRkJVVS85c0FRd0VEQkFRRkJBVUpCUVVKRkEwTERSUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVLzhBQUVRZ0FVQUJRQXdFaUFBSVJBUU1SQWYvRUFCOEFBQUVGQVFFQkFRRUJBQUFBQUFBQUFBQUJBZ01FQlFZSENBa0tDLy9FQUxVUUFBSUJBd01DQkFNRkJRUUVBQUFCZlFFQ0F3QUVFUVVTSVRGQkJoTlJZUWNpY1JReWdaR2hDQ05Dc2NFVlV0SHdKRE5pY29JSkNoWVhHQmthSlNZbktDa3FORFUyTnpnNU9rTkVSVVpIU0VsS1UxUlZWbGRZV1ZwalpHVm1aMmhwYW5OMGRYWjNlSGw2ZzRTRmhvZUlpWXFTazVTVmxwZVltWnFpbzZTbHBxZW9xYXF5czdTMXRyZTR1YnJDdzhURnhzZkl5Y3JTMDlUVjF0ZlkyZHJoNHVQazVlYm42T25xOGZMejlQWDI5L2o1K3YvRUFCOEJBQU1CQVFFQkFRRUJBUUVBQUFBQUFBQUJBZ01FQlFZSENBa0tDLy9FQUxVUkFBSUJBZ1FFQXdRSEJRUUVBQUVDZHdBQkFnTVJCQVVoTVFZU1FWRUhZWEVUSWpLQkNCUkNrYUd4d1Frak0xTHdGV0p5MFFvV0pEVGhKZkVYR0JrYUppY29LU28xTmpjNE9UcERSRVZHUjBoSlNsTlVWVlpYV0ZsYVkyUmxabWRvYVdwemRIVjJkM2g1ZW9LRGhJV0doNGlKaXBLVGxKV1dsNWlabXFLanBLV21wNmlwcXJLenRMVzJ0N2k1dXNMRHhNWEd4OGpKeXRMVDFOWFcxOWpaMnVMajVPWG01K2pwNnZMejlQWDI5L2o1K3YvYUFBd0RBUUFDRVFNUkFEOEErdCtLS1B4by9HZ0E3MFlvL0dqOGFBREZINFZlc2RDMUhVbDNXdGpjWENmMzQ0eVYvUEdLVyswSFV0TlhkZFdOemJwL2ZraklYODhZb0FvZmhSK0ZINDBmalFBZmhSK0ZINDBmalFBVVVVVUFGZXBlQVBoNUQ5bGkxTFZZaEs4ZzNRMjdqNVZYc3pEdVQ2ZjVIQStGdE9YVnZFV24ycmpNY2tvM2oxVWNrZmtEWDBNQmdZSEFvQVJWQ0tGVUJWSEFBNkNsWlF3S2taQkdDRFMwVUFlYytQdmgzQkpheTZscFVRaW1qQmVXM1FZVngzS2pzZmJ2L1B5cXZwdXZudnhmcHFhVDRsMUMxUWJZMGxKVURzcmZNQitSb0F5S0tLS0FDaWlpZ0RhOEdYcTZmNHAwMmVRZ0lKUXBKN0J2bHordGZRUDRWOHlEZzE3UDRBOGN3NjVaeFdWNUlFMUtNYmZtUCt1QTdqMzlSK05BSGFVZmhTVVVBTCtGZUErT0wxTlE4V2FsTkdRVTgzWUNPKzBCZjZWNmI0OThjUTZCWnlXbHJJSk5Ta1hhQXB6NVFQOEFFZmYwRmVLazVPVHlUUUFVVVVVQUg0MGZqUlUxbmFUWDkzRGJRSVhtbFlJaWp1VFFCYzBEdy9lZUk3NFcxbW00OVhrYmhVSHFUWHNIaHo0ZWFYb0NwSThZdmJzY21hWVpBUDhBc3IwSDgvZXRId3Y0Y2c4TTZYSGF4QU5JZm1sbHh5N2R6OVBTdGlnQS9Hay9HbG9vQTVieEo4UGRMMTlYa1dNV2Q0M1Bud2pHVC90TDBQOEFQM3J4L1gvRDk1NGN2amJYaWJUMVNSZVZjZW9OZlJGWkhpanc1QjRtMHVTMWxBV1FmTkZMamxHN0g2ZXRBSHo1K05INDFOZVdrMWhkelcwNkZKb25LTXA3RUdvYUFDdlFmaEJvd3VkVHVkUmtYSzJ5N0k4aitOdXAvQWZ6cno2dmFmaFJhQ0R3bWtnSE04enVmd08zL3dCbG9BN0tpaWo4S0FDa3BhU2dCYVNqOEtLQVBKdmkvb3d0dFR0dFJqWEMzSzdKTWYzbDZIOFIvS3ZQcTlwK0sxcUovQ2J5RWN3VEk0UDFPMy8yYXZGcUFQL1pcIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvaW1hZ2VzL2RlZmF1bHRIZWFkZXJJY29uLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDI1NVxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDI0IDI2IDI5IDMwIDMxIDMyXG4gKiovIiwiaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuXG5jbGFzcyBTdmdJY29uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgZ2V0VHJhbnNmb3JtID0gKHBvc2l0aW9uLCBkaXJlY3Rpb24sIHNpemUsIHJlYWxJY29uU2l6ZSkgPT4ge1xuICAgIGNvbnN0IHNjYWxlVyA9IHNpemVbMF0gLyByZWFsSWNvblNpemVbMF1cbiAgICBjb25zdCBzY2FsZUggPSBzaXplWzFdIC8gcmVhbEljb25TaXplWzFdXG4gICAgcmV0dXJuIGB0cmFuc2xhdGUoJHtwb3NpdGlvbi5qb2luKCcsICcpfSlcbiAgICBzY2FsZSgke2RpcmVjdGlvbi5qb2luKCcsICcpfSApIHNjYWxlKCR7c2NhbGVXfSwke3NjYWxlSH0pYFxuICB9XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHBhdGhzLCBzaXplLCBwb3NpdGlvbiwgZGlyZWN0aW9uLCByZWFsSWNvblNpemUsXG4gICAgICBzdHlsZSwgY2xhc3NOYW1lLCBvbkNsaWNrIH0gPSB0aGlzLnByb3BzXG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmdcbiAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICAgd2lkdGg9e3NpemVbMF19XG4gICAgICAgIGhlaWdodD17c2l6ZVsxXX1cbiAgICAgICAgb25DbGljaz17b25DbGlja31cbiAgICAgID5cbiAgICAgICAgPGcgdHJhbnNmb3JtPXt0aGlzLmdldFRyYW5zZm9ybShwb3NpdGlvbiwgZGlyZWN0aW9uLCBzaXplLCByZWFsSWNvblNpemUpfT5cbiAgICAgICAgICB7cGF0aHMubWFwKChwYXRoLCBpKSA9PiA8cGF0aCBrZXk9e2l9IGQ9e3BhdGh9IC8+KX1cbiAgICAgICAgPC9nPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG59XG5TdmdJY29uLmRlZmF1bHRQcm9wcyA9IHtcbiAgc2l6ZTogWzE2LCAxNl0sXG4gIHBvc2l0aW9uOiBbMCwgMF0sXG4gIGRpcmVjdGlvbjogWzEsIDFdLFxuICByZWFsSWNvblNpemU6IFsxMDI0LCAxMDI0XSxcbn1cblN2Z0ljb24ucHJvcFR5cGVzID0ge1xuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYyxcbiAgcGF0aHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLmlzUmVxdWlyZWQsXG4gIHNpemU6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5udW1iZXIpLFxuICBwb3NpdGlvbjogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm51bWJlciksXG4gIGRpcmVjdGlvbjogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm51bWJlciksXG4gIHJlYWxJY29uU2l6ZTogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm51bWJlciksXG59XG5leHBvcnQgZGVmYXVsdCBTdmdJY29uXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb21wb25lbnRzL3N2Z0ljb24vU3ZnSWNvbi5qc3hcbiAqKi8iLCJleHBvcnQgZnVuY3Rpb24gaW1hZ2VVUkwoZmlsZW5hbWUpIHtcbiAgaWYgKCFmaWxlbmFtZSkge1xuICAgIHJldHVybiBmaWxlbmFtZVxuICB9XG4gIHJldHVybiBgL3Jlc291cmNlcy9pbWdzLyR7ZmlsZW5hbWUuc3Vic3RyKDAsIDMpfS8ke2ZpbGVuYW1lfWBcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3V0aWxzL3BhdGh1dGlsLmpzeFxuICoqLyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcblxuaW1wb3J0IHJlcXVlc3QgZnJvbSAnc3VwZXJhZ2VudCdcblxuaW1wb3J0IGNzcyBmcm9tICcuL0hvbWUuc2NzcydcbmltcG9ydCBCbG9nQ29udGFpbmVyIGZyb20gJ0Jsb2dDb250YWluZXInXG5pbXBvcnQgQmxvZ0JveCBmcm9tICdCbG9nQm94J1xuXG5jbGFzcyBIb21lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGUgPSB7XG4gICAgYmxvZ3M6IFtdLFxuICB9XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZ2V0QmxvZ1BhZ2UoMSwgMTApXG4gIH1cbiAgZ2V0QmxvZ1BhZ2UgPSAocGFnZSwgcGFnZXNpemUpID0+IHtcbiAgICByZXF1ZXN0XG4gICAgICAuZ2V0KCcvYXBpL2Jsb2cvcGFnZScpXG4gICAgICAucXVlcnkoeyBwYWdlLCBwYWdlc2l6ZSB9KVxuICAgICAgLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBKU09OLnBhcnNlKHJlcy50ZXh0KVxuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGJsb2dzOiByZXN1bHQuZGF0YS5lbGVtZW50cyxcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQubm90aWZ5KHJlc3VsdC5kZXNjKVxuICAgICAgICB9XG4gICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICQubm90aWZ5KGVycilcbiAgICAgIH0pXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgYmxvZ3MgfSA9IHRoaXMuc3RhdGVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBuYW1lPVwiaG9tZVN0YWdlXCIgY2xhc3NOYW1lPXtjc3MuaG9tZVN0YWdlfT5cbiAgICAgICAgPEJsb2dDb250YWluZXI+XG4gICAgICAgICAge1xuICAgICAgICAgICAgYmxvZ3MubWFwKChibG9nLCBpKSA9PiA8QmxvZ0JveCBrZXk9e2l9IGJsb2c9e2Jsb2d9IC8+KVxuICAgICAgICAgIH1cbiAgICAgICAgPC9CbG9nQ29udGFpbmVyPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSG9tZVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvcm91dGVzL2hvbWUvSG9tZS5qc3hcbiAqKi8iLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9Ib21lLnNjc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL0hvbWUuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9Ib21lLnNjc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvcm91dGVzL2hvbWUvSG9tZS5zY3NzXG4gKiogbW9kdWxlIGlkID0gNTQwXG4gKiogbW9kdWxlIGNodW5rcyA9IDI5XG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuSG9tZV9faG9tZVN0YWdlX19fMkROU2wge1xcbiAgbWF4LXdpZHRoOiA5ODBweDtcXG4gIG1hcmdpbjogMCBhdXRvO1xcbiAgcGFkZGluZzogMCAxMHB4O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgaGVpZ2h0OiAxMDAlOyB9XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuZXhwb3J0cy5sb2NhbHMgPSB7XG5cdFwiaG9tZVN0YWdlXCI6IFwiSG9tZV9faG9tZVN0YWdlX19fMkROU2xcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuL34vcG9zdGNzcy1sb2FkZXIhLi9+L3Nhc3MtbG9hZGVyIS4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL3JvdXRlcy9ob21lL0hvbWUuc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDU0MVxuICoqIG1vZHVsZSBjaHVua3MgPSAyOVxuICoqLyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcblxuY29uc3Qgc3R5bGVzID0ge1xuICB0aW1lTGluZToge1xuICAgIHdpZHRoOiAnMXB4JyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDAsXG4gICAgbGVmdDogJzYwcHgnLFxuICAgIGJvdHRvbTogMCxcbiAgICBib3JkZXJMZWZ0OiAnMnB4IHNvbGlkICNjZmRiZTQnLFxuICB9LFxufVxuXG5mdW5jdGlvbiBCbG9nQ29udGFpbmVyKHsgY2hpbGRyZW4gfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgbmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLnRpbWVMaW5lfSAvPlxuICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9fT5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cbmV4cG9ydCBkZWZhdWx0IEJsb2dDb250YWluZXJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL2NvbXBvbmVudHMvYmxvZ0NvbnRhaW5lci9CbG9nQ29udGFpbmVyLmpzeFxuICoqLyIsImltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5cbmltcG9ydCBTdmdJY29uIGZyb20gJ1N2Z0ljb24nXG5pbXBvcnQgaWNvbnMgZnJvbSAnLi9pY29ucy5qc29uJ1xuXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xuXG5pbXBvcnQgU2lkZUluZm8gZnJvbSAnLi9jb21wb25lbnRzL1NpZGVJbmZvLmpzeCdcblxuaW1wb3J0IGNsYW1wIGZyb20gJ0NsYW1wJ1xuXG5jb25zdCBzdHlsZXMgPSB7XG4gIGJsb2dCb3g6IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBwYWRkaW5nOiAnMjBweCAwIDQwcHgnLFxuICB9LFxuICBibG9nQ29uY2lzZUJveDoge1xuICAgIHBhZGRpbmdMZWZ0OiAnMTIwcHgnLFxuICAgIG1hcmdpblRvcDogJzIwcHgnLFxuICB9LFxuICBibG9nQ29uY2lzZToge1xuICAgIGJveFNoYWRvdzogJzFweCAxcHggMnB4IHJnYmEoMCwwLDAsLjA4KScsXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkICNkZWU4ZWYnLFxuICAgIGJhY2tncm91bmQ6ICcjZmZmJyxcbiAgICBwYWRkaW5nOiAnMjVweCA0MHB4JyxcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgfSxcbiAgYXJyb3c6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBsZWZ0OiAnLTAuNmVtJyxcbiAgICB0b3A6ICcyOHB4JyxcbiAgICB3aWR0aDogJzEuMmVtJyxcbiAgICBoZWlnaHQ6ICcxLjJlbScsXG4gICAgdHJhbnNmb3JtOiAncm90YXRlKDQ1ZGVnKScsXG4gICAgdHJhbnNpdGlvbjogJ2JhY2tncm91bmQgMC4xcyBsaW5lYXInLFxuICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuICAgIGJvcmRlckxlZnQ6ICcxcHggc29saWQgI2RlZThlZicsXG4gICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICNkZWU4ZWYnLFxuICAgIHpJbmRleDogMixcbiAgfSxcbiAgdGl0bGU6IHtcbiAgICBmb250U2l6ZTogJzI0cHgnLFxuICAgIHBhZGRpbmdCb3R0b206ICcyMHB4JyxcbiAgICBsaW5lSGVpZ2h0OiAnMzBweCcsXG4gIH0sXG4gIHRpdGxlTGluazoge1xuICAgIGNvbG9yOiAnIzAwNzhjOScsXG4gICAgdGV4dERlY29yYXRpb246ICdub25lJyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgfSxcbiAgYmxvZ0NvdmVyOiB7XG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgIG1heEhlaWdodDogJzIwMHB4JyxcbiAgICBtYXJnaW5Cb3R0b206ICczMnB4JyxcbiAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gIH0sXG4gIGJsb2dDb3ZlckltZzoge1xuICAgIG1heFdpZHRoOiAnMTAwJScsXG4gICAgaGVpZ2h0OiAnYXV0bycsXG4gICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gIH0sXG4gIGJsb2dUZXh0OiB7XG4gICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICBmb250V2VpZ2h0OiAzMDAsXG4gICAgY29sb3I6ICcjNDY0YjUyJyxcbiAgICBsaW5lSGVpZ2h0OiAnMjhweCcsXG4gIH0sXG4gIGJsb2dTdGF0aXN0aWNzOiB7XG4gICAgcGFkZGluZ1RvcDogJzIwcHgnLFxuICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgY29sb3I6ICcjOTk5JyxcbiAgfSxcbiAgYmxvZ1N0YXRpc3RpY3NJdGVtOiB7XG4gICAgbWFyZ2luUmlnaHQ6ICcyMHB4JyxcbiAgfSxcbiAgYmxvZ1N0YXRpc3RpY3NJdGVtTGluazoge1xuICAgIGNvbG9yOiAncmdiYSg0MSw0Niw1MywwLjYpJyxcbiAgICB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICB9LFxufVxuXG5jbGFzcyBCbG9nQm94IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY2xhbXAoUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLnRleHQpLCB7IGNsYW1wOiAzIH0pXG4gIH1cbiAgdG9CbG9nID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgcm91dGVyLCBibG9nIH0gPSB0aGlzLnByb3BzXG4gICAgcm91dGVyLnB1c2goe1xuICAgICAgcGF0aG5hbWU6ICcvYmxvZy92aWV3JyxcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIGJsb2dJZDogYmxvZy5pZCxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB0aXRsZSwgY292ZXIsIGNvbnRlbnQsIHVwZGF0ZURhdGUsIHZpZXdzLFxuICAgICAgYXV0aG9yTmFtZSwgaGVhZGVySWNvbiwgY29tbWVudFNpemUgfSA9IHRoaXMucHJvcHMuYmxvZ1xuICAgIHJldHVybiAoXG4gICAgICA8c2VjdGlvbiBzdHlsZT17c3R5bGVzLmJsb2dCb3h9PlxuICAgICAgICA8U2lkZUluZm9cbiAgICAgICAgICBjYXRlZ29yeT17aWNvbnMuZ29sYW5nfVxuICAgICAgICAgIHRpbWU9e3VwZGF0ZURhdGV9XG4gICAgICAgICAgaGVhZGVySWNvbj17aGVhZGVySWNvbn1cbiAgICAgICAgICBuYW1lPXthdXRob3JOYW1lfVxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMuYmxvZ0NvbmNpc2VCb3h9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5ibG9nQ29uY2lzZX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMuYXJyb3d9IC8+XG4gICAgICAgICAgICA8ZGl2IG5hbWU9XCJibG9nLXRpdGxlXCIgc3R5bGU9e3N0eWxlcy50aXRsZX0+XG4gICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMudG9CbG9nfSBzdHlsZT17c3R5bGVzLnRpdGxlTGlua30+e3RpdGxlfTwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjb3ZlciA/IChcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMuYmxvZ0NvdmVyfT5cbiAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtjb3Zlcn0gYWx0PVwiYmxvZ0NvdmVyXCIgc3R5bGU9e3N0eWxlcy5ibG9nQ292ZXJJbWd9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkgOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA8ZGl2IHJlZj1cInRleHRcIiBuYW1lPVwiYmxvZy10ZXh0XCIgc3R5bGU9e3N0eWxlcy5ibG9nVGV4dH0+XG4gICAgICAgICAgICAgIHtjb250ZW50fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMuYmxvZ1N0YXRpc3RpY3N9PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17c3R5bGVzLmJsb2dTdGF0aXN0aWNzSXRlbX0+XG4gICAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy50b0Jsb2d9IHN0eWxlPXtzdHlsZXMuYmxvZ1N0YXRpc3RpY3NJdGVtTGlua30+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj48U3ZnSWNvbiB7Li4uaWNvbnMudmlld30gLz48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBtYXJnaW5SaWdodDogJzIwcHgnIH19Pnt2aWV3c308L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtzdHlsZXMuYmxvZ1N0YXRpc3RpY3NJdGVtfT5cbiAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLnRvQmxvZ30gc3R5bGU9e3N0eWxlcy5ibG9nU3RhdGlzdGljc0l0ZW1MaW5rfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPjxTdmdJY29uIHsuLi5pY29ucy5jb21tZW50fSAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IG1hcmdpblJpZ2h0OiAnMjBweCcgfX0+e2NvbW1lbnRTaXplfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cbiAgICApXG4gIH1cbn1cbkJsb2dCb3gucHJvcFR5cGVzID0ge1xuICBibG9nOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59XG5leHBvcnQgZGVmYXVsdCB3aXRoUm91dGVyKEJsb2dCb3gpXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvYmxvZy9jb21wb25lbnRzL2Jsb2dDb250YWluZXIvYmxvZy9CbG9nQm94LmpzeFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcInZpZXdcIjoge1xuXHRcdFwicGF0aHNcIjogW1xuXHRcdFx0XCJNNTEyIDE5MmMtMjIzLjMxOCAwLTQxNi44ODIgMTMwLjA0Mi01MTIgMzIwIDk1LjExOCAxODkuOTU4IDI4OC42ODIgMzIwIDUxMiAzMjAgMjIzLjMxMiAwIDQxNi44NzYtMTMwLjA0MiA1MTItMzIwLTk1LjExNi0xODkuOTU4LTI4OC42ODgtMzIwLTUxMi0zMjB6TTc2NC40NSAzNjEuNzA0YzYwLjE2MiAzOC4zNzQgMTExLjE0MiA4OS43NzQgMTQ5LjQzNCAxNTAuMjk2LTM4LjI5MiA2MC41MjItODkuMjc0IDExMS45MjItMTQ5LjQzNiAxNTAuMjk2LTc1LjU5NCA0OC4yMTgtMTYyLjg5IDczLjcwNC0yNTIuNDQ4IDczLjcwNC04OS41NiAwLTE3Ni44NTgtMjUuNDg2LTI1Mi40NTItNzMuNzA0LTYwLjE1OC0zOC4zNzItMTExLjEzOC04OS43NzItMTQ5LjQzMi0xNTAuMjk2IDM4LjI5Mi02MC41MjQgODkuMjc0LTExMS45MjQgMTQ5LjQzNC0xNTAuMjk2IDMuOTE4LTIuNSA3Ljg3Ni00LjkyMiAxMS44Ni03LjMtOS45NiAyNy4zMjgtMTUuNDEgNTYuODIyLTE1LjQxIDg3LjU5NiAwIDE0MS4zODIgMTE0LjYxNiAyNTYgMjU2IDI1NiAxNDEuMzgyIDAgMjU2LTExNC42MTggMjU2LTI1NiAwLTMwLjc3NC01LjQ1Mi02MC4yNjgtMTUuNDA4LTg3LjU5OCAzLjk3OCAyLjM3OCA3LjkzOCA0LjgwMiAxMS44NTggNy4zMDJ2MHpNNTEyIDQxNmMwIDUzLjAyMC00Mi45OCA5Ni05NiA5NnMtOTYtNDIuOTgtOTYtOTYgNDIuOTgtOTYgOTYtOTYgOTYgNDIuOTgyIDk2IDk2elwiXG5cdFx0XSxcblx0XHRcInNpemVcIjogW1xuXHRcdFx0MTQsXG5cdFx0XHQxNFxuXHRcdF0sXG5cdFx0XCJzdHlsZVwiOiB7XG5cdFx0XHRcImZpbGxcIjogXCIjNzc3XCIsXG5cdFx0XHRcIm1hcmdpblJpZ2h0XCI6IFwiOHB4XCIsXG5cdFx0XHRcInBhZGRpbmdcIjogXCIycHggMFwiXG5cdFx0fVxuXHR9LFxuXHRcImNvbW1lbnRcIjoge1xuXHRcdFwicGF0aHNcIjogW1xuXHRcdFx0XCJNOTYwIDMwMHEwLTg3LTYwLTE2MC43NXQtMTYzLTExNi41LTIyNS00Mi43NXEtMzUgMC03Mi41IDQtOTktODcuNS0yMzAtMTIxLTI0LjUtNy01Ny0xMS04LjUtMS0xNS4yNSA0LjV0LTguNzUgMTQuNWwwIDAuNXEtMS41IDIgMi41IDZ0MSA1IDIuMjUgNC43NWwzIDQuNSAzLjUgNC4yNSA0IDQuNXEzLjUgNCAxNS41IDE3LjI1dDE3LjI1IDE5IDE1LjUgMTkuNzUgMTYuMjUgMjUuNSAxMy41IDI5LjUgMTMgMzhxLTc4LjUgNDQuNS0xMjMuNzUgMTEwdC00NS4yNSAxNDAuNXEwIDY1IDM1LjUgMTI0LjI1dDk1LjUgMTAyLjI1IDE0MyA2OC4yNSAxNzQgMjUuMjVxMTIyIDAgMjI1LTQyLjc1dDE2My0xMTYuNSA2MC0xNjAuNzV6XCJcblx0XHRdLFxuXHRcdFwic2l6ZVwiOiBbXG5cdFx0XHQxNCxcblx0XHRcdDE0XG5cdFx0XSxcblx0XHRcImRpcmVjdGlvblwiOiBbXG5cdFx0XHQxLFxuXHRcdFx0LTFcblx0XHRdLFxuXHRcdFwicG9zaXRpb25cIjogW1xuXHRcdFx0MCxcblx0XHRcdDEwXG5cdFx0XSxcblx0XHRcInN0eWxlXCI6IHtcblx0XHRcdFwiZmlsbFwiOiBcIiM3NzdcIixcblx0XHRcdFwibWFyZ2luUmlnaHRcIjogXCI4cHhcIixcblx0XHRcdFwicGFkZGluZ1wiOiBcIjJweCAwXCJcblx0XHR9XG5cdH0sXG5cdFwiZWRpdFwiOiB7XG5cdFx0XCJwYXRoc1wiOiBbXG5cdFx0XHRcIk04NjQgMGM4OC4zNjQgMCAxNjAgNzEuNjM0IDE2MCAxNjAgMCAzNi4wMjAtMTEuOTEgNjkuMjU4LTMyIDk2bC02NCA2NC0yMjQtMjI0IDY0LTY0YzI2Ljc0Mi0yMC4wOTAgNTkuOTc4LTMyIDk2LTMyek02NCA3MzZsLTY0IDI4OCAyODgtNjQgNTkyLTU5Mi0yMjQtMjI0LTU5MiA1OTJ6TTcxNS41NzggMzYzLjU3OGwtNDQ4IDQ0OC01NS4xNTYtNTUuMTU2IDQ0OC00NDggNTUuMTU2IDU1LjE1NnpcIlxuXHRcdF0sXG5cdFx0XCJzdHlsZVwiOiB7XG5cdFx0XHRcImZpbGxcIjogXCIjNzc3XCJcblx0XHR9XG5cdH1cbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvYmxvZy9jb21wb25lbnRzL2Jsb2dDb250YWluZXIvYmxvZy9pY29ucy5qc29uXG4gKiogbW9kdWxlIGlkID0gNTQ0XG4gKiogbW9kdWxlIGNodW5rcyA9IDI5IDMwIDMxXG4gKiovIiwiaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuXG5pbXBvcnQgY3NzIGZyb20gJy4vU2lkZUluZm8uc2NzcydcbmltcG9ydCBEZWZhdWx0SGVhZGVySWNvbiBmcm9tICdEZWZhdWx0SGVhZGVySWNvbidcbmltcG9ydCB7IGltYWdlVVJMIH0gZnJvbSAnUGF0aFV0aWwnXG5cbmZ1bmN0aW9uIFNpZGVJbmZvKHsgdGltZSwgaGVhZGVySWNvbiwgbmFtZSB9KSB7XG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh0aW1lKVxuICBjb25zdCB0aW1lRm9ybWF0ID0gYCR7ZGF0ZS5nZXRNb250aCgpICsgMX3mnIgke2RhdGUuZ2V0RGF0ZSgpfeaXpWBcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y3NzLnNpZGVJbmZvfT5cbiAgICAgIDxhIGNsYXNzTmFtZT17Y3NzLmhlYWRlckljb25MaW5rfT5cbiAgICAgICAgPGltZ1xuICAgICAgICAgIHNyYz17aW1hZ2VVUkwoaGVhZGVySWNvbikgfHwgRGVmYXVsdEhlYWRlckljb259XG4gICAgICAgICAgY2xhc3NOYW1lPXtjc3MuaGVhZGVySWNvbn1cbiAgICAgICAgICBhbHQ9XCJhdXRob3JJY29uXCJcbiAgICAgICAgLz5cbiAgICAgIDwvYT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjc3MudGltZX0+e3RpbWVGb3JtYXR9PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y3NzLmF1dGhvcn0+XG4gICAgICAgIDxhIGNsYXNzTmFtZT17Y3NzLmF1dGhvckxpbmt9PntuYW1lIHx8ICdhbm9ueW1vdXMnfTwvYT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cblNpZGVJbmZvLnByb3BUeXBlcyA9IHtcbiAgdGltZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaGVhZGVySWNvbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2lkZUluZm9cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL2NvbXBvbmVudHMvYmxvZ0NvbnRhaW5lci9ibG9nL2NvbXBvbmVudHMvU2lkZUluZm8uanN4XG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vU2lkZUluZm8uc2Nzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vU2lkZUluZm8uc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9TaWRlSW5mby5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL2NvbXBvbmVudHMvYmxvZ0NvbnRhaW5lci9ibG9nL2NvbXBvbmVudHMvU2lkZUluZm8uc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDU0NlxuICoqIG1vZHVsZSBjaHVua3MgPSAyOSAzMCAzMVxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLlNpZGVJbmZvX19zaWRlSW5mb19fXzJLcTl1IHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGxlZnQ6IDA7XFxuICB0b3A6IDA7XFxuICB3aWR0aDogMTAwcHg7XFxuICBwYWRkaW5nOiA0MHB4IDA7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7IH1cXG5cXG4uU2lkZUluZm9fX2hlYWRlckljb25MaW5rX19fM0F0NVUge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lOyB9XFxuXFxuLlNpZGVJbmZvX19oZWFkZXJJY29uX19fbUVucXgge1xcbiAgd2lkdGg6IDYwcHg7XFxuICBoZWlnaHQ6IDYwcHg7XFxuICBib3JkZXItcmFkaXVzOiA2MHB4O1xcbiAgYmFja2dyb3VuZDogIzkwYTFhYztcXG4gIGxpbmUtaGVpZ2h0OiA2MHB4O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbWFyZ2luOiAwIGF1dG87IH1cXG5cXG4uU2lkZUluZm9fX3RpbWVfX18zNlZOZyB7XFxuICBib3JkZXItcmFkaXVzOiAzcHg7XFxuICBmb250LXNpemU6IDEycHg7XFxuICBjb2xvcjogIzZlN2M4NjtcXG4gIHdpZHRoOiA2MHB4O1xcbiAgaGVpZ2h0OiAyNHB4O1xcbiAgbGluZS1oZWlnaHQ6IDI0cHg7XFxuICBtYXJnaW46IDIwcHggYXV0bztcXG4gIGJhY2tncm91bmQ6ICNkZWU4ZWY7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjY2ZkYmU0OyB9XFxuXFxuLlNpZGVJbmZvX19hdXRob3JfX18xNVp5bSB7XFxuICBib3JkZXItcmFkaXVzOiAyNHB4O1xcbiAgd2lkdGg6IDEwMHB4O1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcXG4gIGZvbnQtc2l6ZTogMTJweDtcXG4gIGNvbG9yOiAjNmU3Yzg2O1xcbiAgaGVpZ2h0OiAyNHB4O1xcbiAgbGluZS1oZWlnaHQ6IDI0cHg7XFxuICBtYXJnaW46IDIwcHggYXV0bztcXG4gIGJhY2tncm91bmQ6ICNkZWU4ZWY7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjY2ZkYmU0OyB9XFxuXFxuLlNpZGVJbmZvX19hdXRob3JJY29uX19fM3Q3dlIge1xcbiAgd2lkdGg6IDI0cHg7XFxuICBoZWlnaHQ6IDI0cHg7XFxuICBib3JkZXItcmFkaXVzOiAyNHB4O1xcbiAgZmxvYXQ6IGxlZnQ7IH1cXG5cXG4uU2lkZUluZm9fX2F1dGhvckxpbmtfX18xdXR0cSB7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICBjb2xvcjogIzZlN2M4NjsgfVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcbmV4cG9ydHMubG9jYWxzID0ge1xuXHRcInNpZGVJbmZvXCI6IFwiU2lkZUluZm9fX3NpZGVJbmZvX19fMktxOXVcIixcblx0XCJoZWFkZXJJY29uTGlua1wiOiBcIlNpZGVJbmZvX19oZWFkZXJJY29uTGlua19fXzNBdDVVXCIsXG5cdFwiaGVhZGVySWNvblwiOiBcIlNpZGVJbmZvX19oZWFkZXJJY29uX19fbUVucXhcIixcblx0XCJ0aW1lXCI6IFwiU2lkZUluZm9fX3RpbWVfX18zNlZOZ1wiLFxuXHRcImF1dGhvclwiOiBcIlNpZGVJbmZvX19hdXRob3JfX18xNVp5bVwiLFxuXHRcImF1dGhvckljb25cIjogXCJTaWRlSW5mb19fYXV0aG9ySWNvbl9fXzN0N3ZSXCIsXG5cdFwiYXV0aG9yTGlua1wiOiBcIlNpZGVJbmZvX19hdXRob3JMaW5rX19fMXV0dHFcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuL34vcG9zdGNzcy1sb2FkZXIhLi9+L3Nhc3MtbG9hZGVyIS4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL2NvbXBvbmVudHMvYmxvZ0NvbnRhaW5lci9ibG9nL2NvbXBvbmVudHMvU2lkZUluZm8uc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDU0N1xuICoqIG1vZHVsZSBjaHVua3MgPSAyOSAzMCAzMVxuICoqLyIsIi8qKlxuKiBDbGFtcHMgYSB0ZXh0IG5vZGUuXG4qIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuIEVsZW1lbnQgY29udGFpbmluZyB0aGUgdGV4dCBub2RlIHRvIGNsYW1wLlxuKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy4gT3B0aW9ucyB0byBwYXNzIHRvIHRoZSBjbGFtcGVyLlxuKiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9qb3NlcGhzY2htaXR0L0NsYW1wLmpzXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2xhbXAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICB3aW4gPSB3aW5kb3csXG4gICAgICAgb3B0ID0ge1xuICAgICAgICAgICBjbGFtcDogICAgICAgICAgICAgIG9wdGlvbnMuY2xhbXAgfHwgMixcbiAgICAgICAgICAgdXNlTmF0aXZlQ2xhbXA6ICAgICB0eXBlb2Yob3B0aW9ucy51c2VOYXRpdmVDbGFtcCkgIT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnVzZU5hdGl2ZUNsYW1wIDogdHJ1ZSxcbiAgICAgICAgICAgc3BsaXRPbkNoYXJzOiAgICAgICBvcHRpb25zLnNwbGl0T25DaGFycyB8fCBbJy4nLCAnLScsICfigJMnLCAn4oCUJywgJyAnXSwgLy9TcGxpdCBvbiBzZW50ZW5jZXMgKHBlcmlvZHMpLCBoeXBlbnMsIGVuLWRhc2hlcywgZW0tZGFzaGVzLCBhbmQgd29yZHMgKHNwYWNlcykuXG4gICAgICAgICAgIGFuaW1hdGU6ICAgICAgICAgICAgb3B0aW9ucy5hbmltYXRlIHx8IGZhbHNlLFxuICAgICAgICAgICB0cnVuY2F0aW9uQ2hhcjogICAgIG9wdGlvbnMudHJ1bmNhdGlvbkNoYXIgfHwgJ+KApicsXG4gICAgICAgICAgIHRydW5jYXRpb25IVE1MOiAgICAgb3B0aW9ucy50cnVuY2F0aW9uSFRNTFxuICAgICAgIH0sXG5cbiAgICAgICBzdHkgPSBlbGVtZW50LnN0eWxlLFxuICAgICAgIG9yaWdpbmFsVGV4dCA9IGVsZW1lbnQuaW5uZXJIVE1MLFxuXG4gICAgICAgc3VwcG9ydHNOYXRpdmVDbGFtcCA9IHR5cGVvZihlbGVtZW50LnN0eWxlLndlYmtpdExpbmVDbGFtcCkgIT0gJ3VuZGVmaW5lZCcsXG4gICAgICAgY2xhbXBWYWx1ZSA9IG9wdC5jbGFtcCxcbiAgICAgICBpc0NTU1ZhbHVlID0gY2xhbXBWYWx1ZS5pbmRleE9mICYmIChjbGFtcFZhbHVlLmluZGV4T2YoJ3B4JykgPiAtMSB8fCBjbGFtcFZhbHVlLmluZGV4T2YoJ2VtJykgPiAtMSksXG4gICAgICAgdHJ1bmNhdGlvbkhUTUxDb250YWluZXI7XG5cbiAgIGlmIChvcHQudHJ1bmNhdGlvbkhUTUwpIHtcbiAgICAgICB0cnVuY2F0aW9uSFRNTENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICB0cnVuY2F0aW9uSFRNTENvbnRhaW5lci5pbm5lckhUTUwgPSBvcHQudHJ1bmNhdGlvbkhUTUw7XG4gICB9XG5cblxuLy8gVVRJTElUWSBGVU5DVElPTlMgX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuXG4gICAvKipcbiAgICAqIFJldHVybiB0aGUgY3VycmVudCBzdHlsZSBmb3IgYW4gZWxlbWVudC5cbiAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW0gVGhlIGVsZW1lbnQgdG8gY29tcHV0ZS5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wIFRoZSBzdHlsZSBwcm9wZXJ0eS5cbiAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgKi9cbiAgIGZ1bmN0aW9uIGNvbXB1dGVTdHlsZShlbGVtLCBwcm9wKSB7XG4gICAgICAgaWYgKCF3aW4uZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICAgICB3aW4uZ2V0Q29tcHV0ZWRTdHlsZSA9IGZ1bmN0aW9uKGVsLCBwc2V1ZG8pIHtcbiAgICAgICAgICAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgICAgICAgICAgIHRoaXMuZ2V0UHJvcGVydHlWYWx1ZSA9IGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgICAgICAgICAgICAgICB2YXIgcmUgPSAvKFxcLShbYS16XSl7MX0pL2c7XG4gICAgICAgICAgICAgICAgICAgaWYgKHByb3AgPT0gJ2Zsb2F0JykgcHJvcCA9ICdzdHlsZUZsb2F0JztcbiAgICAgICAgICAgICAgICAgICBpZiAocmUudGVzdChwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICBwcm9wID0gcHJvcC5yZXBsYWNlKHJlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzWzJdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwuY3VycmVudFN0eWxlICYmIGVsLmN1cnJlbnRTdHlsZVtwcm9wXSA/IGVsLmN1cnJlbnRTdHlsZVtwcm9wXSA6IG51bGw7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgfVxuICAgICAgIH1cblxuICAgICAgIHJldHVybiB3aW4uZ2V0Q29tcHV0ZWRTdHlsZShlbGVtLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3ApO1xuICAgfVxuXG4gICAvKipcbiAgICAqIFJldHVybnMgdGhlIG1heGltdW0gbnVtYmVyIG9mIGxpbmVzIG9mIHRleHQgdGhhdCBzaG91bGQgYmUgcmVuZGVyZWQgYmFzZWRcbiAgICAqIG9uIHRoZSBjdXJyZW50IGhlaWdodCBvZiB0aGUgZWxlbWVudCBhbmQgdGhlIGxpbmUtaGVpZ2h0IG9mIHRoZSB0ZXh0LlxuICAgICovXG4gICBmdW5jdGlvbiBnZXRNYXhMaW5lcyhoZWlnaHQpIHtcbiAgICAgICB2YXIgYXZhaWxIZWlnaHQgPSBoZWlnaHQgfHwgZWxlbWVudC5jbGllbnRIZWlnaHQsXG4gICAgICAgICAgIGxpbmVIZWlnaHQgPSBnZXRMaW5lSGVpZ2h0KGVsZW1lbnQpO1xuXG4gICAgICAgcmV0dXJuIE1hdGgubWF4KE1hdGguZmxvb3IoYXZhaWxIZWlnaHQvbGluZUhlaWdodCksIDApO1xuICAgfVxuXG4gICAvKipcbiAgICAqIFJldHVybnMgdGhlIG1heGltdW0gaGVpZ2h0IGEgZ2l2ZW4gZWxlbWVudCBzaG91bGQgaGF2ZSBiYXNlZCBvbiB0aGUgbGluZS1cbiAgICAqIGhlaWdodCBvZiB0aGUgdGV4dCBhbmQgdGhlIGdpdmVuIGNsYW1wIHZhbHVlLlxuICAgICovXG4gICBmdW5jdGlvbiBnZXRNYXhIZWlnaHQoY2xtcCkge1xuICAgICAgIHZhciBsaW5lSGVpZ2h0ID0gZ2V0TGluZUhlaWdodChlbGVtZW50KTtcbiAgICAgICByZXR1cm4gbGluZUhlaWdodCAqIGNsbXA7XG4gICB9XG5cbiAgIC8qKlxuICAgICogUmV0dXJucyB0aGUgbGluZS1oZWlnaHQgb2YgYW4gZWxlbWVudCBhcyBhbiBpbnRlZ2VyLlxuICAgICovXG4gICBmdW5jdGlvbiBnZXRMaW5lSGVpZ2h0KGVsZW0pIHtcbiAgICAgICB2YXIgbGggPSBjb21wdXRlU3R5bGUoZWxlbSwgJ2xpbmUtaGVpZ2h0Jyk7XG4gICAgICAgaWYgKGxoID09ICdub3JtYWwnKSB7XG4gICAgICAgICAgIC8vIE5vcm1hbCBsaW5lIGhlaWdodHMgdmFyeSBmcm9tIGJyb3dzZXIgdG8gYnJvd3Nlci4gVGhlIHNwZWMgcmVjb21tZW5kc1xuICAgICAgICAgICAvLyBhIHZhbHVlIGJldHdlZW4gMS4wIGFuZCAxLjIgb2YgdGhlIGZvbnQgc2l6ZS4gVXNpbmcgMS4xIHRvIHNwbGl0IHRoZSBkaWZmLlxuICAgICAgICAgICBsaCA9IHBhcnNlSW50KGNvbXB1dGVTdHlsZShlbGVtLCAnZm9udC1zaXplJykpICogMS4yO1xuICAgICAgIH1cbiAgICAgICByZXR1cm4gcGFyc2VJbnQobGgpO1xuICAgfVxuXG5cbi8vIE1FQVQgQU5EIFBPVEFUT0VTIChNTU1NLCBQT1RBVE9FUy4uLikgX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiAgIHZhciBzcGxpdE9uQ2hhcnMgPSBvcHQuc3BsaXRPbkNoYXJzLnNsaWNlKDApLFxuICAgICAgIHNwbGl0Q2hhciA9IHNwbGl0T25DaGFyc1swXSxcbiAgICAgICBjaHVua3MsXG4gICAgICAgbGFzdENodW5rO1xuXG4gICAvKipcbiAgICAqIEdldHMgYW4gZWxlbWVudCdzIGxhc3QgY2hpbGQuIFRoYXQgbWF5IGJlIGFub3RoZXIgbm9kZSBvciBhIG5vZGUncyBjb250ZW50cy5cbiAgICAqL1xuICAgZnVuY3Rpb24gZ2V0TGFzdENoaWxkKGVsZW0pIHtcbiAgICAgICAvL0N1cnJlbnQgZWxlbWVudCBoYXMgY2hpbGRyZW4sIG5lZWQgdG8gZ28gZGVlcGVyIGFuZCBnZXQgbGFzdCBjaGlsZCBhcyBhIHRleHQgbm9kZVxuICAgICAgIGlmIChlbGVtLmxhc3RDaGlsZC5jaGlsZHJlbiAmJiBlbGVtLmxhc3RDaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgIHJldHVybiBnZXRMYXN0Q2hpbGQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZWxlbS5jaGlsZHJlbikucG9wKCkpO1xuICAgICAgIH1cbiAgICAgICAvL1RoaXMgaXMgdGhlIGFic29sdXRlIGxhc3QgY2hpbGQsIGEgdGV4dCBub2RlLCBidXQgc29tZXRoaW5nJ3Mgd3Jvbmcgd2l0aCBpdC4gUmVtb3ZlIGl0IGFuZCBrZWVwIHRyeWluZ1xuICAgICAgIGVsc2UgaWYgKCFlbGVtLmxhc3RDaGlsZCB8fCAhZWxlbS5sYXN0Q2hpbGQubm9kZVZhbHVlIHx8IGVsZW0ubGFzdENoaWxkLm5vZGVWYWx1ZSA9PSAnJyB8fCBlbGVtLmxhc3RDaGlsZC5ub2RlVmFsdWUgPT0gb3B0LnRydW5jYXRpb25DaGFyKSB7XG4gICAgICAgICAgIGVsZW0ubGFzdENoaWxkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbS5sYXN0Q2hpbGQpO1xuICAgICAgICAgICByZXR1cm4gZ2V0TGFzdENoaWxkKGVsZW1lbnQpO1xuICAgICAgIH1cbiAgICAgICAvL1RoaXMgaXMgdGhlIGxhc3QgY2hpbGQgd2Ugd2FudCwgcmV0dXJuIGl0XG4gICAgICAgZWxzZSB7XG4gICAgICAgICAgIHJldHVybiBlbGVtLmxhc3RDaGlsZDtcbiAgICAgICB9XG4gICB9XG5cbiAgIC8qKlxuICAgICogUmVtb3ZlcyBvbmUgY2hhcmFjdGVyIGF0IGEgdGltZSBmcm9tIHRoZSB0ZXh0IHVudGlsIGl0cyB3aWR0aCBvclxuICAgICogaGVpZ2h0IGlzIGJlbmVhdGggdGhlIHBhc3NlZC1pbiBtYXggcGFyYW0uXG4gICAgKi9cbiAgIGZ1bmN0aW9uIHRydW5jYXRlKHRhcmdldCwgbWF4SGVpZ2h0KSB7XG4gICAgICAgaWYgKCFtYXhIZWlnaHQpIHtyZXR1cm47fVxuXG4gICAgICAgLyoqXG4gICAgICAgICogUmVzZXRzIGdsb2JhbCB2YXJpYWJsZXMuXG4gICAgICAgICovXG4gICAgICAgZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgICAgIHNwbGl0T25DaGFycyA9IG9wdC5zcGxpdE9uQ2hhcnMuc2xpY2UoMCk7XG4gICAgICAgICAgIHNwbGl0Q2hhciA9IHNwbGl0T25DaGFyc1swXTtcbiAgICAgICAgICAgY2h1bmtzID0gbnVsbDtcbiAgICAgICAgICAgbGFzdENodW5rID0gbnVsbDtcbiAgICAgICB9XG5cbiAgICAgICB2YXIgbm9kZVZhbHVlID0gdGFyZ2V0Lm5vZGVWYWx1ZS5yZXBsYWNlKG9wdC50cnVuY2F0aW9uQ2hhciwgJycpO1xuXG4gICAgICAgLy9HcmFiIHRoZSBuZXh0IGNodW5rc1xuICAgICAgIGlmICghY2h1bmtzKSB7XG4gICAgICAgICAgIC8vSWYgdGhlcmUgYXJlIG1vcmUgY2hhcmFjdGVycyB0byB0cnksIGdyYWIgdGhlIG5leHQgb25lXG4gICAgICAgICAgIGlmIChzcGxpdE9uQ2hhcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgc3BsaXRDaGFyID0gc3BsaXRPbkNoYXJzLnNoaWZ0KCk7XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgLy9ObyBjaGFyYWN0ZXJzIHRvIGNodW5rIGJ5LiBHbyBjaGFyYWN0ZXItYnktY2hhcmFjdGVyXG4gICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgc3BsaXRDaGFyID0gJyc7XG4gICAgICAgICAgIH1cblxuICAgICAgICAgICBjaHVua3MgPSBub2RlVmFsdWUuc3BsaXQoc3BsaXRDaGFyKTtcbiAgICAgICB9XG5cbiAgICAgICAvL0lmIHRoZXJlIGFyZSBjaHVua3MgbGVmdCB0byByZW1vdmUsIHJlbW92ZSB0aGUgbGFzdCBvbmUgYW5kIHNlZSBpZlxuICAgICAgIC8vIHRoZSBub2RlVmFsdWUgZml0cy5cbiAgICAgICBpZiAoY2h1bmtzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2NodW5rcycsIGNodW5rcyk7XG4gICAgICAgICAgIGxhc3RDaHVuayA9IGNodW5rcy5wb3AoKTtcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2xhc3RDaHVuaycsIGxhc3RDaHVuayk7XG4gICAgICAgICAgIGFwcGx5RWxsaXBzaXModGFyZ2V0LCBjaHVua3Muam9pbihzcGxpdENoYXIpKTtcbiAgICAgICB9XG4gICAgICAgLy9ObyBtb3JlIGNodW5rcyBjYW4gYmUgcmVtb3ZlZCB1c2luZyB0aGlzIGNoYXJhY3RlclxuICAgICAgIGVsc2Uge1xuICAgICAgICAgICBjaHVua3MgPSBudWxsO1xuICAgICAgIH1cblxuICAgICAgIC8vSW5zZXJ0IHRoZSBjdXN0b20gSFRNTCBiZWZvcmUgdGhlIHRydW5jYXRpb24gY2hhcmFjdGVyXG4gICAgICAgaWYgKHRydW5jYXRpb25IVE1MQ29udGFpbmVyKSB7XG4gICAgICAgICAgIHRhcmdldC5ub2RlVmFsdWUgPSB0YXJnZXQubm9kZVZhbHVlLnJlcGxhY2Uob3B0LnRydW5jYXRpb25DaGFyLCAnJyk7XG4gICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGFyZ2V0Lm5vZGVWYWx1ZSArICcgJyArIHRydW5jYXRpb25IVE1MQ29udGFpbmVyLmlubmVySFRNTCArIG9wdC50cnVuY2F0aW9uQ2hhcjtcbiAgICAgICB9XG5cbiAgICAgICAvL1NlYXJjaCBwcm9kdWNlZCB2YWxpZCBjaHVua3NcbiAgICAgICBpZiAoY2h1bmtzKSB7XG4gICAgICAgICAgIC8vSXQgZml0c1xuICAgICAgICAgICBpZiAoZWxlbWVudC5jbGllbnRIZWlnaHQgPD0gbWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAvL1RoZXJlJ3Mgc3RpbGwgbW9yZSBjaGFyYWN0ZXJzIHRvIHRyeSBzcGxpdHRpbmcgb24sIG5vdCBxdWl0ZSBkb25lIHlldFxuICAgICAgICAgICAgICAgaWYgKHNwbGl0T25DaGFycy5sZW5ndGggPj0gMCAmJiBzcGxpdENoYXIgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICBhcHBseUVsbGlwc2lzKHRhcmdldCwgY2h1bmtzLmpvaW4oc3BsaXRDaGFyKSArIHNwbGl0Q2hhciArIGxhc3RDaHVuayk7XG4gICAgICAgICAgICAgICAgICAgY2h1bmtzID0gbnVsbDtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIC8vRmluaXNoZWQhXG4gICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgIH1cbiAgICAgICB9XG4gICAgICAgLy9ObyB2YWxpZCBjaHVua3MgcHJvZHVjZWRcbiAgICAgICBlbHNlIHtcbiAgICAgICAgICAgLy9ObyB2YWxpZCBjaHVua3MgZXZlbiB3aGVuIHNwbGl0dGluZyBieSBsZXR0ZXIsIHRpbWUgdG8gbW92ZVxuICAgICAgICAgICAvL29uIHRvIHRoZSBuZXh0IG5vZGVcbiAgICAgICAgICAgaWYgKHNwbGl0Q2hhciA9PSAnJykge1xuICAgICAgICAgICAgICAgYXBwbHlFbGxpcHNpcyh0YXJnZXQsICcnKTtcbiAgICAgICAgICAgICAgIHRhcmdldCA9IGdldExhc3RDaGlsZChlbGVtZW50KTtcblxuICAgICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgfVxuICAgICAgIH1cblxuICAgICAgIC8vSWYgeW91IGdldCBoZXJlIGl0IG1lYW5zIHN0aWxsIHRvbyBiaWcsIGxldCdzIGtlZXAgdHJ1bmNhdGluZ1xuICAgICAgIGlmIChvcHQuYW5pbWF0ZSkge1xuICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgdHJ1bmNhdGUodGFyZ2V0LCBtYXhIZWlnaHQpO1xuICAgICAgICAgICB9LCBvcHQuYW5pbWF0ZSA9PT0gdHJ1ZSA/IDEwIDogb3B0LmFuaW1hdGUpO1xuICAgICAgIH1cbiAgICAgICBlbHNlIHtcbiAgICAgICAgICAgcmV0dXJuIHRydW5jYXRlKHRhcmdldCwgbWF4SGVpZ2h0KTtcbiAgICAgICB9XG4gICB9XG5cbiAgIGZ1bmN0aW9uIGFwcGx5RWxsaXBzaXMoZWxlbSwgc3RyKSB7XG4gICAgICAgZWxlbS5ub2RlVmFsdWUgPSBzdHIgKyBvcHQudHJ1bmNhdGlvbkNoYXI7XG4gICB9XG5cblxuLy8gQ09OU1RSVUNUT1IgX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuXG4gICBpZiAoY2xhbXBWYWx1ZSA9PSAnYXV0bycpIHtcbiAgICAgICBjbGFtcFZhbHVlID0gZ2V0TWF4TGluZXMoKTtcbiAgIH1cbiAgIGVsc2UgaWYgKGlzQ1NTVmFsdWUpIHtcbiAgICAgICBjbGFtcFZhbHVlID0gZ2V0TWF4TGluZXMocGFyc2VJbnQoY2xhbXBWYWx1ZSkpO1xuICAgfVxuXG4gICB2YXIgY2xhbXBlZFRleHQ7XG4gICBpZiAoc3VwcG9ydHNOYXRpdmVDbGFtcCAmJiBvcHQudXNlTmF0aXZlQ2xhbXApIHtcbiAgICAgICBzdHkub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICBzdHkudGV4dE92ZXJmbG93ID0gJ2VsbGlwc2lzJztcbiAgICAgICBzdHkud2Via2l0Qm94T3JpZW50ID0gJ3ZlcnRpY2FsJztcbiAgICAgICBzdHkuZGlzcGxheSA9ICctd2Via2l0LWJveCc7XG4gICAgICAgc3R5LndlYmtpdExpbmVDbGFtcCA9IGNsYW1wVmFsdWU7XG5cbiAgICAgICBpZiAoaXNDU1NWYWx1ZSkge1xuICAgICAgICAgICBzdHkuaGVpZ2h0ID0gb3B0LmNsYW1wICsgJ3B4JztcbiAgICAgICB9XG4gICB9XG4gICBlbHNlIHtcbiAgICAgICB2YXIgaGVpZ2h0ID0gZ2V0TWF4SGVpZ2h0KGNsYW1wVmFsdWUpO1xuICAgICAgIGlmIChoZWlnaHQgPD0gZWxlbWVudC5jbGllbnRIZWlnaHQpIHtcbiAgICAgICAgICAgY2xhbXBlZFRleHQgPSB0cnVuY2F0ZShnZXRMYXN0Q2hpbGQoZWxlbWVudCksIGhlaWdodCk7XG4gICAgICAgfVxuICAgfVxuXG4gICByZXR1cm4ge1xuICAgICAgICdvcmlnaW5hbCc6IG9yaWdpbmFsVGV4dCxcbiAgICAgICAnY2xhbXBlZCc6IGNsYW1wZWRUZXh0XG4gICB9XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9saWIvQ2xhbXAuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9