webpackJsonp([31],{

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

/***/ },

/***/ 561:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _superagent = __webpack_require__(241);
	
	var _superagent2 = _interopRequireDefault(_superagent);
	
	var _MyBlog = __webpack_require__(562);
	
	var _MyBlog2 = _interopRequireDefault(_MyBlog);
	
	var _BlogContainer = __webpack_require__(542);
	
	var _BlogContainer2 = _interopRequireDefault(_BlogContainer);
	
	var _BlogBox = __webpack_require__(543);
	
	var _BlogBox2 = _interopRequireDefault(_BlogBox);
	
	var _reactRouter = __webpack_require__(172);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var MyBlog = function (_React$Component) {
	  _inherits(MyBlog, _React$Component);
	
	  function MyBlog() {
	    var _Object$getPrototypeO;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, MyBlog);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(MyBlog)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
	      blogs: []
	    }, _this.getBlogPage = function (page, pagesize, userId) {
	      _superagent2.default.get('/api/blog/page').query({ page: page, pagesize: pagesize, userId: userId }).then(function (res) {
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
	    }, _this.toAdd = function () {
	      _this.props.router.push('/blog/add');
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(MyBlog, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var location = this.props.location;
	
	      var userId = location.query.userId;
	      this.getBlogPage(1, 10, userId);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var blogs = this.state.blogs;
	
	      return _react2.default.createElement(
	        'div',
	        { className: _MyBlog2.default.stage },
	        _react2.default.createElement(
	          _BlogContainer2.default,
	          null,
	          _react2.default.createElement(
	            'div',
	            { className: _MyBlog2.default.ops },
	            _react2.default.createElement(
	              'div',
	              { className: _MyBlog2.default.add, onClick: this.toAdd },
	              '新增'
	            )
	          ),
	          blogs.map(function (blog, i) {
	            return _react2.default.createElement(_BlogBox2.default, { key: i, blog: blog });
	          })
	        )
	      );
	    }
	  }]);
	
	  return MyBlog;
	}(_react2.default.Component);
	
	MyBlog.propTypes = {
	  location: _react.PropTypes.object
	};
	module.exports = (0, _reactRouter.withRouter)(MyBlog);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(239)))

/***/ },

/***/ 562:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(563);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../node_modules/postcss-loader/index.js!./../../../../../../node_modules/sass-loader/index.js!./MyBlog.scss", function() {
				var newContent = require("!!./../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../node_modules/postcss-loader/index.js!./../../../../../../node_modules/sass-loader/index.js!./MyBlog.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 563:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".MyBlog__stage___2qb_X {\n  max-width: 980px;\n  margin: 0 auto;\n  padding: 0 10px;\n  position: relative;\n  height: 100%; }\n\n.MyBlog__ops___10-2A {\n  margin-top: 10px;\n  position: absolute;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: reverse;\n      -ms-flex-direction: row-reverse;\n          flex-direction: row-reverse;\n  width: 100%;\n  z-index: 1; }\n\n.MyBlog__add___1V1kI {\n  cursor: pointer; }\n", ""]);
	
	// exports
	exports.locals = {
		"stage": "MyBlog__stage___2qb_X",
		"ops": "MyBlog__ops___10-2A",
		"add": "MyBlog__add___1V1kI"
	};

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzP2RhMDQqKioqKioqKioqKioqKioqKioqIiwid2VicGFjazovLy8uL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qcz9iOTgwKioqKioqKioqKioqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvaW1hZ2VzL2RlZmF1bHRIZWFkZXJJY29uLnBuZz9iOTU5KioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9zdmdJY29uL1N2Z0ljb24uanN4P2FjMTkqKioqIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS91dGlscy9wYXRodXRpbC5qc3g/MTI5YioqKioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9ibG9nQ29udGFpbmVyL0Jsb2dDb250YWluZXIuanN4P2RmZDEqIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvYmxvZy9jb21wb25lbnRzL2Jsb2dDb250YWluZXIvYmxvZy9CbG9nQm94LmpzeD8zZTZlIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvYmxvZy9jb21wb25lbnRzL2Jsb2dDb250YWluZXIvYmxvZy9pY29ucy5qc29uP2I3YmIqIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvYmxvZy9jb21wb25lbnRzL2Jsb2dDb250YWluZXIvYmxvZy9jb21wb25lbnRzL1NpZGVJbmZvLmpzeD81NThkKiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9ibG9nQ29udGFpbmVyL2Jsb2cvY29tcG9uZW50cy9TaWRlSW5mby5zY3NzPzZlN2QqKiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9ibG9nQ29udGFpbmVyL2Jsb2cvY29tcG9uZW50cy9TaWRlSW5mby5zY3NzPzYzMDQqIiwid2VicGFjazovLy8uL3NyYy9saWIvQ2xhbXAuanM/N2I0YSIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvcm91dGVzL215YmxvZy9NeUJsb2cuanN4Iiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvYmxvZy9yb3V0ZXMvbXlibG9nL015QmxvZy5zY3NzPzVkZjMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL3JvdXRlcy9teWJsb2cvTXlCbG9nLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQSx5Q0FBd0MsZ0JBQWdCO0FBQ3hELEtBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBWSxvQkFBb0I7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFnQixtQkFBbUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCLHNCQUFzQjtBQUN0QztBQUNBO0FBQ0EsbUJBQWtCLDJCQUEyQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZSxtQkFBbUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUIsMkJBQTJCO0FBQzVDO0FBQ0E7QUFDQSxTQUFRLHVCQUF1QjtBQUMvQjtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0Esa0JBQWlCLHVCQUF1QjtBQUN4QztBQUNBO0FBQ0EsNEJBQTJCO0FBQzNCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZSxpQkFBaUI7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBLGlDQUFnQyxzQkFBc0I7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdEQUF1RDtBQUN2RDs7QUFFQSw4QkFBNkIsbUJBQW1COztBQUVoRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDclBBLGtDQUFpQyw0dUQ7Ozs7Ozs7Ozs7Ozs7OztBQ0FqQzs7Ozs7Ozs7Ozs7O0tBRU0sTzs7Ozs7Ozs7Ozs7Ozs7c01BQ0osWSxHQUFlLFVBQUMsUUFBRCxFQUFXLFNBQVgsRUFBc0IsSUFBdEIsRUFBNEIsWUFBNUIsRUFBNkM7QUFDMUQsV0FBTSxTQUFTLEtBQUssQ0FBTCxJQUFVLGFBQWEsQ0FBYixDQUF6QjtBQUNBLFdBQU0sU0FBUyxLQUFLLENBQUwsSUFBVSxhQUFhLENBQWIsQ0FBekI7QUFDQSw2QkFBb0IsU0FBUyxJQUFULENBQWMsSUFBZCxDQUFwQixxQkFDUSxVQUFVLElBQVYsQ0FBZSxJQUFmLENBRFIsaUJBQ3dDLE1BRHhDLFNBQ2tELE1BRGxEO0FBRUQsTTs7Ozs7OEJBQ1E7QUFBQSxvQkFFeUIsS0FBSyxLQUY5QjtBQUFBLFdBQ0MsS0FERCxVQUNDLEtBREQ7QUFBQSxXQUNRLElBRFIsVUFDUSxJQURSO0FBQUEsV0FDYyxRQURkLFVBQ2MsUUFEZDtBQUFBLFdBQ3dCLFNBRHhCLFVBQ3dCLFNBRHhCO0FBQUEsV0FDbUMsWUFEbkMsVUFDbUMsWUFEbkM7QUFBQSxXQUVMLEtBRkssVUFFTCxLQUZLO0FBQUEsV0FFRSxTQUZGLFVBRUUsU0FGRjtBQUFBLFdBRWEsT0FGYixVQUVhLE9BRmI7O0FBR1AsY0FDRTtBQUFBO0FBQUE7QUFDRSxrQkFBTyxLQURUO0FBRUUsc0JBQVcsU0FGYjtBQUdFLGtCQUFPLEtBQUssQ0FBTCxDQUhUO0FBSUUsbUJBQVEsS0FBSyxDQUFMLENBSlY7QUFLRSxvQkFBUztBQUxYO0FBT0U7QUFBQTtBQUFBLGFBQUcsV0FBVyxLQUFLLFlBQUwsQ0FBa0IsUUFBbEIsRUFBNEIsU0FBNUIsRUFBdUMsSUFBdkMsRUFBNkMsWUFBN0MsQ0FBZDtBQUNHLGlCQUFNLEdBQU4sQ0FBVSxVQUFDLElBQUQsRUFBTyxDQUFQO0FBQUEsb0JBQWEsd0NBQU0sS0FBSyxDQUFYLEVBQWMsR0FBRyxJQUFqQixHQUFiO0FBQUEsWUFBVjtBQURIO0FBUEYsUUFERjtBQWFEOzs7O0dBdkJtQixnQkFBTSxTOztBQXlCNUIsU0FBUSxZQUFSLEdBQXVCO0FBQ3JCLFNBQU0sQ0FBQyxFQUFELEVBQUssRUFBTCxDQURlO0FBRXJCLGFBQVUsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUZXO0FBR3JCLGNBQVcsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUhVO0FBSXJCLGlCQUFjLENBQUMsSUFBRCxFQUFPLElBQVA7QUFKTyxFQUF2QjtBQU1BLFNBQVEsU0FBUixHQUFvQjtBQUNsQixZQUFTLGlCQUFVLElBREQ7QUFFbEIsVUFBTyxpQkFBVSxPQUFWLENBQWtCLGlCQUFVLE1BQTVCLEVBQW9DLFVBRnpCO0FBR2xCLFNBQU0saUJBQVUsT0FBVixDQUFrQixpQkFBVSxNQUE1QixDQUhZO0FBSWxCLGFBQVUsaUJBQVUsT0FBVixDQUFrQixpQkFBVSxNQUE1QixDQUpRO0FBS2xCLGNBQVcsaUJBQVUsT0FBVixDQUFrQixpQkFBVSxNQUE1QixDQUxPO0FBTWxCLGlCQUFjLGlCQUFVLE9BQVYsQ0FBa0IsaUJBQVUsTUFBNUI7QUFOSSxFQUFwQjttQkFRZSxPOzs7Ozs7Ozs7Ozs7U0N6Q0MsUSxHQUFBLFE7QUFBVCxVQUFTLFFBQVQsQ0FBa0IsUUFBbEIsRUFBNEI7QUFDakMsT0FBSSxDQUFDLFFBQUwsRUFBZTtBQUNiLFlBQU8sUUFBUDtBQUNEO0FBQ0QsK0JBQTBCLFNBQVMsTUFBVCxDQUFnQixDQUFoQixFQUFtQixDQUFuQixDQUExQixTQUFtRCxRQUFuRDtBQUNELEU7Ozs7Ozs7Ozs7Ozs7QUNMRDs7Ozs7O0FBRUEsS0FBTSxTQUFTO0FBQ2IsYUFBVTtBQUNSLFlBQU8sS0FEQztBQUVSLGVBQVUsVUFGRjtBQUdSLFVBQUssQ0FIRztBQUlSLFdBQU0sTUFKRTtBQUtSLGFBQVEsQ0FMQTtBQU1SLGlCQUFZO0FBTko7QUFERyxFQUFmOztBQVdBLFVBQVMsYUFBVCxPQUFxQztBQUFBLE9BQVosUUFBWSxRQUFaLFFBQVk7O0FBQ25DLFVBQ0U7QUFBQTtBQUFBLE9BQUssTUFBSyxXQUFWO0FBQ0UsNENBQUssT0FBTyxPQUFPLFFBQW5CLEdBREY7QUFFRTtBQUFBO0FBQUEsU0FBSyxPQUFPLEVBQUUsVUFBVSxVQUFaLEVBQVo7QUFDRztBQURIO0FBRkYsSUFERjtBQVFEO21CQUNjLGE7Ozs7Ozs7Ozs7Ozs7OztBQ3ZCZjs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUVBOztBQUVBOzs7O0FBRUE7Ozs7Ozs7Ozs7OztBQUVBLEtBQU0sU0FBUztBQUNiLFlBQVM7QUFDUCxlQUFVLFVBREg7QUFFUCxjQUFTO0FBRkYsSUFESTtBQUtiLG1CQUFnQjtBQUNkLGtCQUFhLE9BREM7QUFFZCxnQkFBVztBQUZHLElBTEg7QUFTYixnQkFBYTtBQUNYLGdCQUFXLDZCQURBO0FBRVgsYUFBUSxtQkFGRztBQUdYLGlCQUFZLE1BSEQ7QUFJWCxjQUFTLFdBSkU7QUFLWCxlQUFVO0FBTEMsSUFUQTtBQWdCYixVQUFPO0FBQ0wsZUFBVSxVQURMO0FBRUwsV0FBTSxRQUZEO0FBR0wsVUFBSyxNQUhBO0FBSUwsWUFBTyxPQUpGO0FBS0wsYUFBUSxPQUxIO0FBTUwsZ0JBQVcsZUFOTjtBQU9MLGlCQUFZLHdCQVBQO0FBUUwsc0JBQWlCLE1BUlo7QUFTTCxpQkFBWSxtQkFUUDtBQVVMLG1CQUFjLG1CQVZUO0FBV0wsYUFBUTtBQVhILElBaEJNO0FBNkJiLFVBQU87QUFDTCxlQUFVLE1BREw7QUFFTCxvQkFBZSxNQUZWO0FBR0wsaUJBQVk7QUFIUCxJQTdCTTtBQWtDYixjQUFXO0FBQ1QsWUFBTyxTQURFO0FBRVQscUJBQWdCLE1BRlA7QUFHVCxhQUFRO0FBSEMsSUFsQ0U7QUF1Q2IsY0FBVztBQUNULGVBQVUsUUFERDtBQUVULGdCQUFXLE9BRkY7QUFHVCxtQkFBYyxNQUhMO0FBSVQsbUJBQWMsS0FKTDtBQUtULGdCQUFXO0FBTEYsSUF2Q0U7QUE4Q2IsaUJBQWM7QUFDWixlQUFVLE1BREU7QUFFWixhQUFRLE1BRkk7QUFHWixvQkFBZTtBQUhILElBOUNEO0FBbURiLGFBQVU7QUFDUixlQUFVLE1BREY7QUFFUixpQkFBWSxHQUZKO0FBR1IsWUFBTyxTQUhDO0FBSVIsaUJBQVk7QUFKSixJQW5ERztBQXlEYixtQkFBZ0I7QUFDZCxpQkFBWSxNQURFO0FBRWQsZUFBVSxNQUZJO0FBR2QsWUFBTztBQUhPLElBekRIO0FBOERiLHVCQUFvQjtBQUNsQixrQkFBYTtBQURLLElBOURQO0FBaUViLDJCQUF3QjtBQUN0QixZQUFPLG9CQURlO0FBRXRCLHFCQUFnQixNQUZNO0FBR3RCLGFBQVE7QUFIYztBQWpFWCxFQUFmOztLQXdFTSxPOzs7Ozs7Ozs7Ozs7OztzTUFJSixNLEdBQVMsWUFBTTtBQUFBLHlCQUNZLE1BQUssS0FEakI7QUFBQSxXQUNMLE1BREssZUFDTCxNQURLO0FBQUEsV0FDRyxJQURILGVBQ0csSUFESDs7QUFFYixjQUFPLElBQVAsQ0FBWTtBQUNWLG1CQUFVLFlBREE7QUFFVixnQkFBTztBQUNMLG1CQUFRLEtBQUs7QUFEUjtBQUZHLFFBQVo7QUFNRCxNOzs7Ozt5Q0FYbUI7QUFDbEIsNEJBQU0sbUJBQVMsV0FBVCxDQUFxQixLQUFLLElBQUwsQ0FBVSxJQUEvQixDQUFOLEVBQTRDLEVBQUUsT0FBTyxDQUFULEVBQTVDO0FBQ0Q7Ozs4QkFVUTtBQUFBLHlCQUVtQyxLQUFLLEtBQUwsQ0FBVyxJQUY5QztBQUFBLFdBQ0MsS0FERCxlQUNDLEtBREQ7QUFBQSxXQUNRLEtBRFIsZUFDUSxLQURSO0FBQUEsV0FDZSxPQURmLGVBQ2UsT0FEZjtBQUFBLFdBQ3dCLFVBRHhCLGVBQ3dCLFVBRHhCO0FBQUEsV0FDb0MsS0FEcEMsZUFDb0MsS0FEcEM7QUFBQSxXQUVMLFVBRkssZUFFTCxVQUZLO0FBQUEsV0FFTyxVQUZQLGVBRU8sVUFGUDtBQUFBLFdBRW1CLFdBRm5CLGVBRW1CLFdBRm5COztBQUdQLGNBQ0U7QUFBQTtBQUFBLFdBQVMsT0FBTyxPQUFPLE9BQXZCO0FBQ0U7QUFDRSxxQkFBVSxnQkFBTSxNQURsQjtBQUVFLGlCQUFNLFVBRlI7QUFHRSx1QkFBWSxVQUhkO0FBSUUsaUJBQU07QUFKUixXQURGO0FBT0U7QUFBQTtBQUFBLGFBQUssT0FBTyxPQUFPLGNBQW5CO0FBQ0U7QUFBQTtBQUFBLGVBQUssT0FBTyxPQUFPLFdBQW5CO0FBQ0Usb0RBQUssT0FBTyxPQUFPLEtBQW5CLEdBREY7QUFFRTtBQUFBO0FBQUEsaUJBQUssTUFBSyxZQUFWLEVBQXVCLE9BQU8sT0FBTyxLQUFyQztBQUNFO0FBQUE7QUFBQSxtQkFBRyxTQUFTLEtBQUssTUFBakIsRUFBeUIsT0FBTyxPQUFPLFNBQXZDO0FBQW1EO0FBQW5EO0FBREYsY0FGRjtBQU1JLHFCQUNFO0FBQUE7QUFBQSxpQkFBSyxPQUFPLE9BQU8sU0FBbkI7QUFDRSxzREFBSyxLQUFLLEtBQVYsRUFBaUIsS0FBSSxXQUFyQixFQUFpQyxPQUFPLE9BQU8sWUFBL0M7QUFERixjQURGLEdBSUksSUFWUjtBQVlFO0FBQUE7QUFBQSxpQkFBSyxLQUFJLE1BQVQsRUFBZ0IsTUFBSyxXQUFyQixFQUFpQyxPQUFPLE9BQU8sUUFBL0M7QUFDRztBQURILGNBWkY7QUFlRTtBQUFBO0FBQUEsaUJBQUssT0FBTyxPQUFPLGNBQW5CO0FBQ0U7QUFBQTtBQUFBLG1CQUFNLE9BQU8sT0FBTyxrQkFBcEI7QUFDRTtBQUFBO0FBQUEscUJBQUcsU0FBUyxLQUFLLE1BQWpCLEVBQXlCLE9BQU8sT0FBTyxzQkFBdkM7QUFDRTtBQUFBO0FBQUE7QUFBTSxzRUFBYSxnQkFBTSxJQUFuQjtBQUFOLG9CQURGO0FBRUU7QUFBQTtBQUFBLHVCQUFNLE9BQU8sRUFBRSxhQUFhLE1BQWYsRUFBYjtBQUF1QztBQUF2QztBQUZGO0FBREYsZ0JBREY7QUFPRTtBQUFBO0FBQUEsbUJBQU0sT0FBTyxPQUFPLGtCQUFwQjtBQUNFO0FBQUE7QUFBQSxxQkFBRyxTQUFTLEtBQUssTUFBakIsRUFBeUIsT0FBTyxPQUFPLHNCQUF2QztBQUNFO0FBQUE7QUFBQTtBQUFNLHNFQUFhLGdCQUFNLE9BQW5CO0FBQU4sb0JBREY7QUFFRTtBQUFBO0FBQUEsdUJBQU0sT0FBTyxFQUFFLGFBQWEsTUFBZixFQUFiO0FBQXVDO0FBQXZDO0FBRkY7QUFERjtBQVBGO0FBZkY7QUFERjtBQVBGLFFBREY7QUEwQ0Q7Ozs7R0ExRG1CLGdCQUFNLFM7O0FBNEQ1QixTQUFRLFNBQVIsR0FBb0I7QUFDbEIsU0FBTSxpQkFBVSxNQUFWLENBQWlCO0FBREwsRUFBcEI7bUJBR2UsNkJBQVcsT0FBWCxDOzs7Ozs7O0FDbkpmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHOzs7Ozs7Ozs7Ozs7O0FDN0NBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsVUFBUyxRQUFULE9BQThDO0FBQUEsT0FBMUIsSUFBMEIsUUFBMUIsSUFBMEI7QUFBQSxPQUFwQixVQUFvQixRQUFwQixVQUFvQjtBQUFBLE9BQVIsSUFBUSxRQUFSLElBQVE7O0FBQzVDLE9BQU0sT0FBTyxJQUFJLElBQUosQ0FBUyxJQUFULENBQWI7QUFDQSxPQUFNLGFBQWdCLEtBQUssUUFBTCxLQUFrQixDQUFsQyxTQUF1QyxLQUFLLE9BQUwsRUFBdkMsTUFBTjtBQUNBLFVBQ0U7QUFBQTtBQUFBLE9BQUssV0FBVyxtQkFBSSxRQUFwQjtBQUNFO0FBQUE7QUFBQSxTQUFHLFdBQVcsbUJBQUksY0FBbEI7QUFDRTtBQUNFLGNBQUssd0JBQVMsVUFBVCxnQ0FEUDtBQUVFLG9CQUFXLG1CQUFJLFVBRmpCO0FBR0UsY0FBSTtBQUhOO0FBREYsTUFERjtBQVFFO0FBQUE7QUFBQSxTQUFLLFdBQVcsbUJBQUksSUFBcEI7QUFBMkI7QUFBM0IsTUFSRjtBQVNFO0FBQUE7QUFBQSxTQUFLLFdBQVcsbUJBQUksTUFBcEI7QUFDRTtBQUFBO0FBQUEsV0FBRyxXQUFXLG1CQUFJLFVBQWxCO0FBQStCLGlCQUFRO0FBQXZDO0FBREY7QUFURixJQURGO0FBZUQ7O0FBRUQsVUFBUyxTQUFULEdBQXFCO0FBQ25CLFNBQU0saUJBQVUsTUFERztBQUVuQixlQUFZLGlCQUFVLE1BRkg7QUFHbkIsU0FBTSxpQkFBVTtBQUhHLEVBQXJCOzttQkFNZSxROzs7Ozs7O0FDaENmOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQXFHO0FBQ3JHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsaUNBQWdDLFVBQVUsRUFBRTtBQUM1QyxFOzs7Ozs7O0FDcEJBO0FBQ0E7OztBQUdBO0FBQ0Esd0RBQXVELHVCQUF1QixZQUFZLFdBQVcsaUJBQWlCLG9CQUFvQix1QkFBdUIsRUFBRSx1Q0FBdUMsMEJBQTBCLEVBQUUsbUNBQW1DLGdCQUFnQixpQkFBaUIsd0JBQXdCLHdCQUF3QixzQkFBc0IsdUJBQXVCLG1CQUFtQixFQUFFLDZCQUE2Qix1QkFBdUIsb0JBQW9CLG1CQUFtQixnQkFBZ0IsaUJBQWlCLHNCQUFzQixzQkFBc0Isd0JBQXdCLHVCQUF1Qiw4QkFBOEIsRUFBRSwrQkFBK0Isd0JBQXdCLGlCQUFpQix3QkFBd0IscUJBQXFCLDRCQUE0QixvQkFBb0IsbUJBQW1CLGlCQUFpQixzQkFBc0Isc0JBQXNCLHdCQUF3Qix1QkFBdUIsOEJBQThCLEVBQUUsbUNBQW1DLGdCQUFnQixpQkFBaUIsd0JBQXdCLGdCQUFnQixFQUFFLG1DQUFtQywwQkFBMEIsbUJBQW1CLEVBQUU7O0FBRXZwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHOzs7Ozs7Ozs7Ozs7bUJDVndCLEs7QUFOeEI7Ozs7OztBQU1lLFVBQVMsS0FBVCxDQUFlLE9BQWYsRUFBd0IsT0FBeEIsRUFBaUM7QUFDN0MsZUFBVSxXQUFXLEVBQXJCOztBQUVBLFNBQUksT0FBTyxJQUFYO0FBQUEsU0FDSSxNQUFNLE1BRFY7QUFBQSxTQUVJLE1BQU07QUFDRixnQkFBb0IsUUFBUSxLQUFSLElBQWlCLENBRG5DO0FBRUYseUJBQW9CLE9BQU8sUUFBUSxjQUFmLElBQWtDLFdBQWxDLEdBQWdELFFBQVEsY0FBeEQsR0FBeUUsSUFGM0Y7QUFHRix1QkFBb0IsUUFBUSxZQUFSLElBQXdCLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLENBSDFDLEVBR3FFO0FBQ3ZFLGtCQUFvQixRQUFRLE9BQVIsSUFBbUIsS0FKckM7QUFLRix5QkFBb0IsUUFBUSxjQUFSLElBQTBCLEdBTDVDO0FBTUYseUJBQW9CLFFBQVE7QUFOMUIsTUFGVjtBQUFBLFNBV0ksTUFBTSxRQUFRLEtBWGxCO0FBQUEsU0FZSSxlQUFlLFFBQVEsU0FaM0I7QUFBQSxTQWNJLHNCQUFzQixPQUFPLFFBQVEsS0FBUixDQUFjLGVBQXJCLElBQXlDLFdBZG5FO0FBQUEsU0FlSSxhQUFhLElBQUksS0FmckI7QUFBQSxTQWdCSSxhQUFhLFdBQVcsT0FBWCxLQUF1QixXQUFXLE9BQVgsQ0FBbUIsSUFBbkIsSUFBMkIsQ0FBQyxDQUE1QixJQUFpQyxXQUFXLE9BQVgsQ0FBbUIsSUFBbkIsSUFBMkIsQ0FBQyxDQUFwRixDQWhCakI7QUFBQSxTQWlCSSx1QkFqQko7O0FBbUJBLFNBQUksSUFBSSxjQUFSLEVBQXdCO0FBQ3BCLG1DQUEwQixTQUFTLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBMUI7QUFDQSxpQ0FBd0IsU0FBeEIsR0FBb0MsSUFBSSxjQUF4QztBQUNIOztBQUdKOztBQUVHOzs7Ozs7QUFNQSxjQUFTLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEIsSUFBNUIsRUFBa0M7QUFDOUIsYUFBSSxDQUFDLElBQUksZ0JBQVQsRUFBMkI7QUFDdkIsaUJBQUksZ0JBQUosR0FBdUIsVUFBUyxFQUFULEVBQWEsTUFBYixFQUFxQjtBQUN4QyxzQkFBSyxFQUFMLEdBQVUsRUFBVjtBQUNBLHNCQUFLLGdCQUFMLEdBQXdCLFVBQVMsSUFBVCxFQUFlO0FBQ25DLHlCQUFJLEtBQUssaUJBQVQ7QUFDQSx5QkFBSSxRQUFRLE9BQVosRUFBcUIsT0FBTyxZQUFQO0FBQ3JCLHlCQUFJLEdBQUcsSUFBSCxDQUFRLElBQVIsQ0FBSixFQUFtQjtBQUNmLGdDQUFPLEtBQUssT0FBTCxDQUFhLEVBQWIsRUFBaUIsWUFBWTtBQUNoQyxvQ0FBTyxVQUFVLENBQVYsRUFBYSxXQUFiLEVBQVA7QUFDSCwwQkFGTSxDQUFQO0FBR0g7QUFDRCw0QkFBTyxHQUFHLFlBQUgsSUFBbUIsR0FBRyxZQUFILENBQWdCLElBQWhCLENBQW5CLEdBQTJDLEdBQUcsWUFBSCxDQUFnQixJQUFoQixDQUEzQyxHQUFtRSxJQUExRTtBQUNILGtCQVREO0FBVUEsd0JBQU8sSUFBUDtBQUNILGNBYkQ7QUFjSDs7QUFFRCxnQkFBTyxJQUFJLGdCQUFKLENBQXFCLElBQXJCLEVBQTJCLElBQTNCLEVBQWlDLGdCQUFqQyxDQUFrRCxJQUFsRCxDQUFQO0FBQ0g7O0FBRUQ7Ozs7QUFJQSxjQUFTLFdBQVQsQ0FBcUIsTUFBckIsRUFBNkI7QUFDekIsYUFBSSxjQUFjLFVBQVUsUUFBUSxZQUFwQztBQUFBLGFBQ0ksYUFBYSxjQUFjLE9BQWQsQ0FEakI7O0FBR0EsZ0JBQU8sS0FBSyxHQUFMLENBQVMsS0FBSyxLQUFMLENBQVcsY0FBWSxVQUF2QixDQUFULEVBQTZDLENBQTdDLENBQVA7QUFDSDs7QUFFRDs7OztBQUlBLGNBQVMsWUFBVCxDQUFzQixJQUF0QixFQUE0QjtBQUN4QixhQUFJLGFBQWEsY0FBYyxPQUFkLENBQWpCO0FBQ0EsZ0JBQU8sYUFBYSxJQUFwQjtBQUNIOztBQUVEOzs7QUFHQSxjQUFTLGFBQVQsQ0FBdUIsSUFBdkIsRUFBNkI7QUFDekIsYUFBSSxLQUFLLGFBQWEsSUFBYixFQUFtQixhQUFuQixDQUFUO0FBQ0EsYUFBSSxNQUFNLFFBQVYsRUFBb0I7QUFDaEI7QUFDQTtBQUNBLGtCQUFLLFNBQVMsYUFBYSxJQUFiLEVBQW1CLFdBQW5CLENBQVQsSUFBNEMsR0FBakQ7QUFDSDtBQUNELGdCQUFPLFNBQVMsRUFBVCxDQUFQO0FBQ0g7O0FBR0o7QUFDRyxTQUFJLGVBQWUsSUFBSSxZQUFKLENBQWlCLEtBQWpCLENBQXVCLENBQXZCLENBQW5CO0FBQUEsU0FDSSxZQUFZLGFBQWEsQ0FBYixDQURoQjtBQUFBLFNBRUksTUFGSjtBQUFBLFNBR0ksU0FISjs7QUFLQTs7O0FBR0EsY0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTRCO0FBQ3hCO0FBQ0EsYUFBSSxLQUFLLFNBQUwsQ0FBZSxRQUFmLElBQTJCLEtBQUssU0FBTCxDQUFlLFFBQWYsQ0FBd0IsTUFBeEIsR0FBaUMsQ0FBaEUsRUFBbUU7QUFDL0Qsb0JBQU8sYUFBYSxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsS0FBSyxRQUFoQyxFQUEwQyxHQUExQyxFQUFiLENBQVA7QUFDSDtBQUNEO0FBSEEsY0FJSyxJQUFJLENBQUMsS0FBSyxTQUFOLElBQW1CLENBQUMsS0FBSyxTQUFMLENBQWUsU0FBbkMsSUFBZ0QsS0FBSyxTQUFMLENBQWUsU0FBZixJQUE0QixFQUE1RSxJQUFrRixLQUFLLFNBQUwsQ0FBZSxTQUFmLElBQTRCLElBQUksY0FBdEgsRUFBc0k7QUFDdkksc0JBQUssU0FBTCxDQUFlLFVBQWYsQ0FBMEIsV0FBMUIsQ0FBc0MsS0FBSyxTQUEzQztBQUNBLHdCQUFPLGFBQWEsT0FBYixDQUFQO0FBQ0g7QUFDRDtBQUpLLGtCQUtBO0FBQ0QsNEJBQU8sS0FBSyxTQUFaO0FBQ0g7QUFDSjs7QUFFRDs7OztBQUlBLGNBQVMsUUFBVCxDQUFrQixNQUFsQixFQUEwQixTQUExQixFQUFxQztBQUNqQyxhQUFJLENBQUMsU0FBTCxFQUFnQjtBQUFDO0FBQVE7O0FBRXpCOzs7QUFHQSxrQkFBUyxLQUFULEdBQWlCO0FBQ2IsNEJBQWUsSUFBSSxZQUFKLENBQWlCLEtBQWpCLENBQXVCLENBQXZCLENBQWY7QUFDQSx5QkFBWSxhQUFhLENBQWIsQ0FBWjtBQUNBLHNCQUFTLElBQVQ7QUFDQSx5QkFBWSxJQUFaO0FBQ0g7O0FBRUQsYUFBSSxZQUFZLE9BQU8sU0FBUCxDQUFpQixPQUFqQixDQUF5QixJQUFJLGNBQTdCLEVBQTZDLEVBQTdDLENBQWhCOztBQUVBO0FBQ0EsYUFBSSxDQUFDLE1BQUwsRUFBYTtBQUNUO0FBQ0EsaUJBQUksYUFBYSxNQUFiLEdBQXNCLENBQTFCLEVBQTZCO0FBQ3pCLDZCQUFZLGFBQWEsS0FBYixFQUFaO0FBQ0g7QUFDRDtBQUhBLGtCQUlLO0FBQ0QsaUNBQVksRUFBWjtBQUNIOztBQUVELHNCQUFTLFVBQVUsS0FBVixDQUFnQixTQUFoQixDQUFUO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBLGFBQUksT0FBTyxNQUFQLEdBQWdCLENBQXBCLEVBQXVCO0FBQ25CO0FBQ0EseUJBQVksT0FBTyxHQUFQLEVBQVo7QUFDQTtBQUNBLDJCQUFjLE1BQWQsRUFBc0IsT0FBTyxJQUFQLENBQVksU0FBWixDQUF0QjtBQUNIO0FBQ0Q7QUFOQSxjQU9LO0FBQ0QsMEJBQVMsSUFBVDtBQUNIOztBQUVEO0FBQ0EsYUFBSSx1QkFBSixFQUE2QjtBQUN6QixvQkFBTyxTQUFQLEdBQW1CLE9BQU8sU0FBUCxDQUFpQixPQUFqQixDQUF5QixJQUFJLGNBQTdCLEVBQTZDLEVBQTdDLENBQW5CO0FBQ0EscUJBQVEsU0FBUixHQUFvQixPQUFPLFNBQVAsR0FBbUIsR0FBbkIsR0FBeUIsd0JBQXdCLFNBQWpELEdBQTZELElBQUksY0FBckY7QUFDSDs7QUFFRDtBQUNBLGFBQUksTUFBSixFQUFZO0FBQ1I7QUFDQSxpQkFBSSxRQUFRLFlBQVIsSUFBd0IsU0FBNUIsRUFBdUM7QUFDbkM7QUFDQSxxQkFBSSxhQUFhLE1BQWIsSUFBdUIsQ0FBdkIsSUFBNEIsYUFBYSxFQUE3QyxFQUFpRDtBQUM3QyxtQ0FBYyxNQUFkLEVBQXNCLE9BQU8sSUFBUCxDQUFZLFNBQVosSUFBeUIsU0FBekIsR0FBcUMsU0FBM0Q7QUFDQSw4QkFBUyxJQUFUO0FBQ0g7QUFDRDtBQUpBLHNCQUtLO0FBQ0QsZ0NBQU8sUUFBUSxTQUFmO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFkQSxjQWVLO0FBQ0Q7QUFDQTtBQUNBLHFCQUFJLGFBQWEsRUFBakIsRUFBcUI7QUFDakIsbUNBQWMsTUFBZCxFQUFzQixFQUF0QjtBQUNBLDhCQUFTLGFBQWEsT0FBYixDQUFUOztBQUVBO0FBQ0g7QUFDSjs7QUFFRDtBQUNBLGFBQUksSUFBSSxPQUFSLEVBQWlCO0FBQ2Isd0JBQVcsWUFBVztBQUNsQiwwQkFBUyxNQUFULEVBQWlCLFNBQWpCO0FBQ0gsY0FGRCxFQUVHLElBQUksT0FBSixLQUFnQixJQUFoQixHQUF1QixFQUF2QixHQUE0QixJQUFJLE9BRm5DO0FBR0gsVUFKRCxNQUtLO0FBQ0Qsb0JBQU8sU0FBUyxNQUFULEVBQWlCLFNBQWpCLENBQVA7QUFDSDtBQUNKOztBQUVELGNBQVMsYUFBVCxDQUF1QixJQUF2QixFQUE2QixHQUE3QixFQUFrQztBQUM5QixjQUFLLFNBQUwsR0FBaUIsTUFBTSxJQUFJLGNBQTNCO0FBQ0g7O0FBR0o7O0FBRUcsU0FBSSxjQUFjLE1BQWxCLEVBQTBCO0FBQ3RCLHNCQUFhLGFBQWI7QUFDSCxNQUZELE1BR0ssSUFBSSxVQUFKLEVBQWdCO0FBQ2pCLHNCQUFhLFlBQVksU0FBUyxVQUFULENBQVosQ0FBYjtBQUNIOztBQUVELFNBQUksV0FBSjtBQUNBLFNBQUksdUJBQXVCLElBQUksY0FBL0IsRUFBK0M7QUFDM0MsYUFBSSxRQUFKLEdBQWUsUUFBZjtBQUNBLGFBQUksWUFBSixHQUFtQixVQUFuQjtBQUNBLGFBQUksZUFBSixHQUFzQixVQUF0QjtBQUNBLGFBQUksT0FBSixHQUFjLGFBQWQ7QUFDQSxhQUFJLGVBQUosR0FBc0IsVUFBdEI7O0FBRUEsYUFBSSxVQUFKLEVBQWdCO0FBQ1osaUJBQUksTUFBSixHQUFhLElBQUksS0FBSixHQUFZLElBQXpCO0FBQ0g7QUFDSixNQVZELE1BV0s7QUFDRCxhQUFJLFNBQVMsYUFBYSxVQUFiLENBQWI7QUFDQSxhQUFJLFVBQVUsUUFBUSxZQUF0QixFQUFvQztBQUNoQywyQkFBYyxTQUFTLGFBQWEsT0FBYixDQUFULEVBQWdDLE1BQWhDLENBQWQ7QUFDSDtBQUNKOztBQUVELFlBQU87QUFDSCxxQkFBWSxZQURUO0FBRUgsb0JBQVc7QUFGUixNQUFQO0FBSUYsRTs7Ozs7Ozs7Ozs7QUN6UEQ7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0tBRU0sTTs7Ozs7Ozs7Ozs7Ozs7cU1BQ0osSyxHQUFRO0FBQ04sY0FBTztBQURELE0sUUFRUixXLEdBQWMsVUFBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixNQUFqQixFQUE0QjtBQUN4Qyw0QkFDRyxHQURILENBQ08sZ0JBRFAsRUFFRyxLQUZILENBRVMsRUFBRSxVQUFGLEVBQVEsa0JBQVIsRUFBa0IsY0FBbEIsRUFGVCxFQUdHLElBSEgsQ0FHUSxVQUFDLEdBQUQsRUFBUztBQUNiLGFBQU0sU0FBUyxLQUFLLEtBQUwsQ0FBVyxJQUFJLElBQWYsQ0FBZjtBQUNBLGFBQUksT0FBTyxPQUFYLEVBQW9CO0FBQ2xCLGlCQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFPLE9BQU8sSUFBUCxDQUFZO0FBRFAsWUFBZDtBQUdELFVBSkQsTUFJTztBQUNMLGFBQUUsTUFBRixDQUFTLE9BQU8sSUFBaEI7QUFDRDtBQUNGLFFBWkgsRUFZSyxVQUFDLEdBQUQsRUFBUztBQUNWLFdBQUUsTUFBRixDQUFTLEdBQVQ7QUFDRCxRQWRIO0FBZUQsTSxRQUNELEssR0FBUSxZQUFNO0FBQ1osYUFBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixJQUFsQixDQUF1QixXQUF2QjtBQUNELE07Ozs7O3lDQXhCbUI7QUFBQSxXQUNWLFFBRFUsR0FDRyxLQUFLLEtBRFIsQ0FDVixRQURVOztBQUVsQixXQUFNLFNBQVMsU0FBUyxLQUFULENBQWUsTUFBOUI7QUFDQSxZQUFLLFdBQUwsQ0FBaUIsQ0FBakIsRUFBb0IsRUFBcEIsRUFBd0IsTUFBeEI7QUFDRDs7OzhCQXFCUTtBQUFBLFdBQ0MsS0FERCxHQUNXLEtBQUssS0FEaEIsQ0FDQyxLQUREOztBQUVQLGNBQ0U7QUFBQTtBQUFBLFdBQUssV0FBVyxpQkFBSSxLQUFwQjtBQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxlQUFLLFdBQVcsaUJBQUksR0FBcEI7QUFDRTtBQUFBO0FBQUEsaUJBQUssV0FBVyxpQkFBSSxHQUFwQixFQUF5QixTQUFTLEtBQUssS0FBdkM7QUFBQTtBQUFBO0FBREYsWUFERjtBQU9JLGlCQUFNLEdBQU4sQ0FBVSxVQUFDLElBQUQsRUFBTyxDQUFQO0FBQUEsb0JBQWEsbURBQVMsS0FBSyxDQUFkLEVBQWlCLE1BQU0sSUFBdkIsR0FBYjtBQUFBLFlBQVY7QUFQSjtBQURGLFFBREY7QUFjRDs7OztHQTdDa0IsZ0JBQU0sUzs7QUErQzNCLFFBQU8sU0FBUCxHQUFtQjtBQUNqQixhQUFVLGlCQUFVO0FBREgsRUFBbkI7QUFHQSxRQUFPLE9BQVAsR0FBaUIsNkJBQVcsTUFBWCxDQUFqQixDOzs7Ozs7OztBQzFEQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUErRjtBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLGlDQUFnQyxVQUFVLEVBQUU7QUFDNUMsRTs7Ozs7OztBQ3BCQTtBQUNBOzs7QUFHQTtBQUNBLG1EQUFrRCxxQkFBcUIsbUJBQW1CLG9CQUFvQix1QkFBdUIsaUJBQWlCLEVBQUUsMEJBQTBCLHFCQUFxQix1QkFBdUIseUJBQXlCLHlCQUF5QixrQkFBa0IsbUNBQW1DLG1DQUFtQyx3Q0FBd0Msd0NBQXdDLGdCQUFnQixlQUFlLEVBQUUsMEJBQTBCLG9CQUFvQixFQUFFOztBQUV6Z0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEciLCJmaWxlIjoianMvMzEtMGMxNzcwNDBjNDVkMjViOTE3YjMuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBsaXN0ID0gW107XHJcblxyXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcclxuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXNbaV07XHJcblx0XHRcdGlmKGl0ZW1bMl0pIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGl0ZW1bMV0gKyBcIn1cIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goaXRlbVsxXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQuam9pbihcIlwiKTtcclxuXHR9O1xyXG5cclxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxyXG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcclxuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxyXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XHJcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcclxuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxyXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xyXG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXHJcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXHJcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXHJcblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXHJcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XHJcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRyZXR1cm4gbGlzdDtcclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbiAqKiBtb2R1bGUgaWQgPSAyNTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYgNyA4IDkgMTggMTkgMjAgMjMgMjQgMjUgMjYgMjcgMjggMjkgMzAgMzEgMzJcbiAqKi8iLCIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG52YXIgc3R5bGVzSW5Eb20gPSB7fSxcclxuXHRtZW1vaXplID0gZnVuY3Rpb24oZm4pIHtcclxuXHRcdHZhciBtZW1vO1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHRcdFx0cmV0dXJuIG1lbW87XHJcblx0XHR9O1xyXG5cdH0sXHJcblx0aXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gL21zaWUgWzYtOV1cXGIvLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XHJcblx0fSksXHJcblx0Z2V0SGVhZEVsZW1lbnQgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuXHR9KSxcclxuXHRzaW5nbGV0b25FbGVtZW50ID0gbnVsbCxcclxuXHRzaW5nbGV0b25Db3VudGVyID0gMCxcclxuXHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XHJcblx0aWYodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XHJcblx0XHRpZih0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcclxuXHR9XHJcblxyXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxyXG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2VcclxuXHRpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcclxuXHJcblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIDxoZWFkPi5cclxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xyXG5cclxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QpO1xyXG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xyXG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcclxuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XHJcblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcclxuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xyXG5cdFx0fVxyXG5cdFx0aWYobmV3TGlzdCkge1xyXG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QpO1xyXG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XHJcblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcclxuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspXHJcblx0XHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXSgpO1xyXG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpIHtcclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcclxuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xyXG5cdFx0aWYoZG9tU3R5bGUpIHtcclxuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyhsaXN0KSB7XHJcblx0dmFyIHN0eWxlcyA9IFtdO1xyXG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xyXG5cdFx0dmFyIGlkID0gaXRlbVswXTtcclxuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xyXG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcclxuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xyXG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xyXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pXHJcblx0XHRcdHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XHJcblx0XHRlbHNlXHJcblx0XHRcdG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcclxuXHR9XHJcblx0cmV0dXJuIHN0eWxlcztcclxufVxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCkge1xyXG5cdHZhciBoZWFkID0gZ2V0SGVhZEVsZW1lbnQoKTtcclxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcFtzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcclxuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xyXG5cdFx0aWYoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XHJcblx0XHRcdGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgaGVhZC5maXJzdENoaWxkKTtcclxuXHRcdH0gZWxzZSBpZihsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xyXG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHRcdH1cclxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGVFbGVtZW50KTtcclxuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcclxuXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcuIE11c3QgYmUgJ3RvcCcgb3IgJ2JvdHRvbScuXCIpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xyXG5cdHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0dmFyIGlkeCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGVFbGVtZW50KTtcclxuXHRpZihpZHggPj0gMCkge1xyXG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykge1xyXG5cdHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XHJcblx0c3R5bGVFbGVtZW50LnR5cGUgPSBcInRleHQvY3NzXCI7XHJcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCk7XHJcblx0cmV0dXJuIHN0eWxlRWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucykge1xyXG5cdHZhciBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xyXG5cdGxpbmtFbGVtZW50LnJlbCA9IFwic3R5bGVzaGVldFwiO1xyXG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rRWxlbWVudCk7XHJcblx0cmV0dXJuIGxpbmtFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTdHlsZShvYmosIG9wdGlvbnMpIHtcclxuXHR2YXIgc3R5bGVFbGVtZW50LCB1cGRhdGUsIHJlbW92ZTtcclxuXHJcblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XHJcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcclxuXHRcdHN0eWxlRWxlbWVudCA9IHNpbmdsZXRvbkVsZW1lbnQgfHwgKHNpbmdsZXRvbkVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xyXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgZmFsc2UpO1xyXG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgdHJ1ZSk7XHJcblx0fSBlbHNlIGlmKG9iai5zb3VyY2VNYXAgJiZcclxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XHJcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcclxuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcclxuXHRcdFx0aWYoc3R5bGVFbGVtZW50LmhyZWYpXHJcblx0XHRcdFx0VVJMLnJldm9rZU9iamVjdFVSTChzdHlsZUVsZW1lbnQuaHJlZik7XHJcblx0XHR9O1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XHJcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcclxuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHR1cGRhdGUob2JqKTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xyXG5cdFx0aWYobmV3T2JqKSB7XHJcblx0XHRcdGlmKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcClcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0fTtcclxufVxyXG5cclxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgdGV4dFN0b3JlID0gW107XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XHJcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XHJcblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcclxuXHR9O1xyXG59KSgpO1xyXG5cclxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZUVsZW1lbnQsIGluZGV4LCByZW1vdmUsIG9iaikge1xyXG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcclxuXHJcblx0aWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcclxuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGVFbGVtZW50LmNoaWxkTm9kZXM7XHJcblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50Lmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBhcHBseVRvVGFnKHN0eWxlRWxlbWVudCwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IG9iai5jc3M7XHJcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xyXG5cclxuXHRpZihtZWRpYSkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxyXG5cdH1cclxuXHJcblx0aWYoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XHJcblx0fSBlbHNlIHtcclxuXHRcdHdoaWxlKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XHJcblx0XHR9XHJcblx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVMaW5rKGxpbmtFbGVtZW50LCBvYmopIHtcclxuXHR2YXIgY3NzID0gb2JqLmNzcztcclxuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcclxuXHJcblx0aWYoc291cmNlTWFwKSB7XHJcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxyXG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xyXG5cdH1cclxuXHJcblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XHJcblxyXG5cdHZhciBvbGRTcmMgPSBsaW5rRWxlbWVudC5ocmVmO1xyXG5cclxuXHRsaW5rRWxlbWVudC5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcclxuXHJcblx0aWYob2xkU3JjKVxyXG5cdFx0VVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xyXG59XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcbiAqKiBtb2R1bGUgaWQgPSAyNTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYgNyA4IDkgMTggMTkgMjAgMjMgMjQgMjUgMjYgMjcgMjggMjkgMzAgMzEgMzJcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LC85ai80QUFRU2taSlJnQUJBUUFBQVFBQkFBRC8vZ0E3UTFKRlFWUlBVam9nWjJRdGFuQmxaeUIyTVM0d0lDaDFjMmx1WnlCSlNrY2dTbEJGUnlCMk9EQXBMQ0J4ZFdGc2FYUjVJRDBnT1RBSy85c0FRd0FEQWdJREFnSURBd01EQkFNREJBVUlCUVVFQkFVS0J3Y0dDQXdLREF3TENnc0xEUTRTRUEwT0VRNExDeEFXRUJFVEZCVVZGUXdQRnhnV0ZCZ1NGQlVVLzlzQVF3RURCQVFGQkFVSkJRVUpGQTBMRFJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVUvOEFBRVFnQVVBQlFBd0VpQUFJUkFRTVJBZi9FQUI4QUFBRUZBUUVCQVFFQkFBQUFBQUFBQUFBQkFnTUVCUVlIQ0FrS0MvL0VBTFVRQUFJQkF3TUNCQU1GQlFRRUFBQUJmUUVDQXdBRUVRVVNJVEZCQmhOUllRY2ljUlF5Z1pHaENDTkNzY0VWVXRId0pETmljb0lKQ2hZWEdCa2FKU1luS0NrcU5EVTJOemc1T2tORVJVWkhTRWxLVTFSVlZsZFlXVnBqWkdWbVoyaHBhbk4wZFhaM2VIbDZnNFNGaG9lSWlZcVNrNVNWbHBlWW1acWlvNlNscHFlb3FhcXlzN1MxdHJlNHVickN3OFRGeHNmSXljclMwOVRWMXRmWTJkcmg0dVBrNWVibjZPbnE4Zkx6OVBYMjkvajUrdi9FQUI4QkFBTUJBUUVCQVFFQkFRRUFBQUFBQUFBQkFnTUVCUVlIQ0FrS0MvL0VBTFVSQUFJQkFnUUVBd1FIQlFRRUFBRUNkd0FCQWdNUkJBVWhNUVlTUVZFSFlYRVRJaktCQ0JSQ2thR3h3UWtqTTFMd0ZXSnkwUW9XSkRUaEpmRVhHQmthSmljb0tTbzFOamM0T1RwRFJFVkdSMGhKU2xOVVZWWlhXRmxhWTJSbFptZG9hV3B6ZEhWMmQzaDVlb0tEaElXR2g0aUppcEtUbEpXV2w1aVptcUtqcEtXbXA2aXBxckt6dExXMnQ3aTV1c0xEeE1YR3g4akp5dExUMU5YVzE5aloydUxqNU9YbTUranA2dkx6OVBYMjkvajUrdi9hQUF3REFRQUNFUU1SQUQ4QSt0K0tLUHhvL0dnQTcwWW8vR2o4YUFERkg0VmVzZEMxSFVsM1d0amNYQ2YzNDR5Vi9QR0tXKzBIVXROWGRkV056YnAvZmtqSVg4OFlvQW9maFIrRkg0MGZqUUFmaFIrRkg0MGZqUUFVVVVVQUZlcGVBUGg1RDlsaTFMVlloSzhnM1EyN2o1VlhzekR1VDZmNUhBK0Z0T1hWdkVXbjJyak1ja28zajFVY2tma0RYME1CZ1lIQW9BUlZDS0ZVQlZIQUE2Q2xaUXdLa1pCR0NEUzBVQWVjK1B2aDNCSmF5NmxwVVFpbWpCZVczUVlWeDNLanNmYnYvUHlxdnB1dm52eGZwcWFUNGwxQzFRYlkwbEpVRHNyZk1CK1JvQXlLS0tLQUNpaWlnRGE4R1hxNmY0cDAyZVFnSUpRcEo3QnZseit0ZlFQNFY4eURnMTdQNEE4Y3c2NVp4V1Y1SUUxS01iZm1QK3VBN2ozOVIrTkFIYVVmaFNVVUFMK0ZlQStPTDFOUThXYWxOR1FVODNZQ08rMEJmNlY2YjQ5OGNRNkJaeVdscklKTlNrWGFBcHo1UVA4QUVmZjBGZUtrNU9UeVRRQVVVVVVBSDQwZmpSVTFuYVRYOTNEYlFJWG1sWUlpanVUUUJjMER3L2VlSTc0VzFtbTQ5WGtiaFVIcVRYc0hoejRlYVhvQ3BJOFl2YnNjbWFZWkFQOEFzcjBIOC9ldEh3djRjZzhNNlhIYXhBTklmbWxseHk3ZHo5UFN0aWdBL0drL0dsb29BNWJ4SjhQZEwxOVhrV01XZDQzUG53akdUL3RMMFA4QVAzcngvWC9EOTU0Y3ZqYlhpYlQxU1JlVmNlb05mUkZaSGlqdzVCNG0wdVMxbEFXUWZORkxqbEc3SDZldEFIejUrTkg0MU5lV2sxaGR6VzA2RkpvbktNcDdFR29hQUN2UWZoQm93dWRUdWRSa1hLMnk3SThqK051cC9BZnpyejZ2YWZoUmFDRHdta2dITTh6dWZ3TzMvd0Jsb0E3S2lpajhLQUNrcGFTZ0JhU2o4S0tBUEp2aS9vd3R0VHR0UmpYQzNLN0pNZjNsNkg4Ui9LdlBxOXArSzFxSi9DYnlFY3dUSTRQMU8zLzJhdkZxQVAvWlwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9pbWFnZXMvZGVmYXVsdEhlYWRlckljb24ucG5nXG4gKiogbW9kdWxlIGlkID0gMjU1XG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMjQgMjYgMjkgMzAgMzEgMzJcbiAqKi8iLCJpbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnXG5cbmNsYXNzIFN2Z0ljb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBnZXRUcmFuc2Zvcm0gPSAocG9zaXRpb24sIGRpcmVjdGlvbiwgc2l6ZSwgcmVhbEljb25TaXplKSA9PiB7XG4gICAgY29uc3Qgc2NhbGVXID0gc2l6ZVswXSAvIHJlYWxJY29uU2l6ZVswXVxuICAgIGNvbnN0IHNjYWxlSCA9IHNpemVbMV0gLyByZWFsSWNvblNpemVbMV1cbiAgICByZXR1cm4gYHRyYW5zbGF0ZSgke3Bvc2l0aW9uLmpvaW4oJywgJyl9KVxuICAgIHNjYWxlKCR7ZGlyZWN0aW9uLmpvaW4oJywgJyl9ICkgc2NhbGUoJHtzY2FsZVd9LCR7c2NhbGVIfSlgXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgcGF0aHMsIHNpemUsIHBvc2l0aW9uLCBkaXJlY3Rpb24sIHJlYWxJY29uU2l6ZSxcbiAgICAgIHN0eWxlLCBjbGFzc05hbWUsIG9uQ2xpY2sgfSA9IHRoaXMucHJvcHNcbiAgICByZXR1cm4gKFxuICAgICAgPHN2Z1xuICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgICB3aWR0aD17c2l6ZVswXX1cbiAgICAgICAgaGVpZ2h0PXtzaXplWzFdfVxuICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgPlxuICAgICAgICA8ZyB0cmFuc2Zvcm09e3RoaXMuZ2V0VHJhbnNmb3JtKHBvc2l0aW9uLCBkaXJlY3Rpb24sIHNpemUsIHJlYWxJY29uU2l6ZSl9PlxuICAgICAgICAgIHtwYXRocy5tYXAoKHBhdGgsIGkpID0+IDxwYXRoIGtleT17aX0gZD17cGF0aH0gLz4pfVxuICAgICAgICA8L2c+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cbn1cblN2Z0ljb24uZGVmYXVsdFByb3BzID0ge1xuICBzaXplOiBbMTYsIDE2XSxcbiAgcG9zaXRpb246IFswLCAwXSxcbiAgZGlyZWN0aW9uOiBbMSwgMV0sXG4gIHJlYWxJY29uU2l6ZTogWzEwMjQsIDEwMjRdLFxufVxuU3ZnSWNvbi5wcm9wVHlwZXMgPSB7XG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICBwYXRoczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZykuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm51bWJlciksXG4gIHBvc2l0aW9uOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubnVtYmVyKSxcbiAgZGlyZWN0aW9uOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubnVtYmVyKSxcbiAgcmVhbEljb25TaXplOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubnVtYmVyKSxcbn1cbmV4cG9ydCBkZWZhdWx0IFN2Z0ljb25cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbXBvbmVudHMvc3ZnSWNvbi9TdmdJY29uLmpzeFxuICoqLyIsImV4cG9ydCBmdW5jdGlvbiBpbWFnZVVSTChmaWxlbmFtZSkge1xuICBpZiAoIWZpbGVuYW1lKSB7XG4gICAgcmV0dXJuIGZpbGVuYW1lXG4gIH1cbiAgcmV0dXJuIGAvcmVzb3VyY2VzL2ltZ3MvJHtmaWxlbmFtZS5zdWJzdHIoMCwgMyl9LyR7ZmlsZW5hbWV9YFxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvdXRpbHMvcGF0aHV0aWwuanN4XG4gKiovIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuXG5jb25zdCBzdHlsZXMgPSB7XG4gIHRpbWVMaW5lOiB7XG4gICAgd2lkdGg6ICcxcHgnLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogMCxcbiAgICBsZWZ0OiAnNjBweCcsXG4gICAgYm90dG9tOiAwLFxuICAgIGJvcmRlckxlZnQ6ICcycHggc29saWQgI2NmZGJlNCcsXG4gIH0sXG59XG5cbmZ1bmN0aW9uIEJsb2dDb250YWluZXIoeyBjaGlsZHJlbiB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBuYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMudGltZUxpbmV9IC8+XG4gICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnIH19PlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgQmxvZ0NvbnRhaW5lclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9ibG9nQ29udGFpbmVyL0Jsb2dDb250YWluZXIuanN4XG4gKiovIiwiaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcblxuaW1wb3J0IFN2Z0ljb24gZnJvbSAnU3ZnSWNvbidcbmltcG9ydCBpY29ucyBmcm9tICcuL2ljb25zLmpzb24nXG5cbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXInXG5cbmltcG9ydCBTaWRlSW5mbyBmcm9tICcuL2NvbXBvbmVudHMvU2lkZUluZm8uanN4J1xuXG5pbXBvcnQgY2xhbXAgZnJvbSAnQ2xhbXAnXG5cbmNvbnN0IHN0eWxlcyA9IHtcbiAgYmxvZ0JveDoge1xuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHBhZGRpbmc6ICcyMHB4IDAgNDBweCcsXG4gIH0sXG4gIGJsb2dDb25jaXNlQm94OiB7XG4gICAgcGFkZGluZ0xlZnQ6ICcxMjBweCcsXG4gICAgbWFyZ2luVG9wOiAnMjBweCcsXG4gIH0sXG4gIGJsb2dDb25jaXNlOiB7XG4gICAgYm94U2hhZG93OiAnMXB4IDFweCAycHggcmdiYSgwLDAsMCwuMDgpJyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgI2RlZThlZicsXG4gICAgYmFja2dyb3VuZDogJyNmZmYnLFxuICAgIHBhZGRpbmc6ICcyNXB4IDQwcHgnLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICB9LFxuICBhcnJvdzoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGxlZnQ6ICctMC42ZW0nLFxuICAgIHRvcDogJzI4cHgnLFxuICAgIHdpZHRoOiAnMS4yZW0nLFxuICAgIGhlaWdodDogJzEuMmVtJyxcbiAgICB0cmFuc2Zvcm06ICdyb3RhdGUoNDVkZWcpJyxcbiAgICB0cmFuc2l0aW9uOiAnYmFja2dyb3VuZCAwLjFzIGxpbmVhcicsXG4gICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4gICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAjZGVlOGVmJyxcbiAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgI2RlZThlZicsXG4gICAgekluZGV4OiAyLFxuICB9LFxuICB0aXRsZToge1xuICAgIGZvbnRTaXplOiAnMjRweCcsXG4gICAgcGFkZGluZ0JvdHRvbTogJzIwcHgnLFxuICAgIGxpbmVIZWlnaHQ6ICczMHB4JyxcbiAgfSxcbiAgdGl0bGVMaW5rOiB7XG4gICAgY29sb3I6ICcjMDA3OGM5JyxcbiAgICB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICB9LFxuICBibG9nQ292ZXI6IHtcbiAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgbWF4SGVpZ2h0OiAnMjAwcHgnLFxuICAgIG1hcmdpbkJvdHRvbTogJzMycHgnLFxuICAgIGJvcmRlclJhZGl1czogJzhweCcsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgfSxcbiAgYmxvZ0NvdmVySW1nOiB7XG4gICAgbWF4V2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICdhdXRvJyxcbiAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgfSxcbiAgYmxvZ1RleHQ6IHtcbiAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgIGZvbnRXZWlnaHQ6IDMwMCxcbiAgICBjb2xvcjogJyM0NjRiNTInLFxuICAgIGxpbmVIZWlnaHQ6ICcyOHB4JyxcbiAgfSxcbiAgYmxvZ1N0YXRpc3RpY3M6IHtcbiAgICBwYWRkaW5nVG9wOiAnMjBweCcsXG4gICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICBjb2xvcjogJyM5OTknLFxuICB9LFxuICBibG9nU3RhdGlzdGljc0l0ZW06IHtcbiAgICBtYXJnaW5SaWdodDogJzIwcHgnLFxuICB9LFxuICBibG9nU3RhdGlzdGljc0l0ZW1MaW5rOiB7XG4gICAgY29sb3I6ICdyZ2JhKDQxLDQ2LDUzLDAuNiknLFxuICAgIHRleHREZWNvcmF0aW9uOiAnbm9uZScsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gIH0sXG59XG5cbmNsYXNzIEJsb2dCb3ggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjbGFtcChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMudGV4dCksIHsgY2xhbXA6IDMgfSlcbiAgfVxuICB0b0Jsb2cgPSAoKSA9PiB7XG4gICAgY29uc3QgeyByb3V0ZXIsIGJsb2cgfSA9IHRoaXMucHJvcHNcbiAgICByb3V0ZXIucHVzaCh7XG4gICAgICBwYXRobmFtZTogJy9ibG9nL3ZpZXcnLFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgYmxvZ0lkOiBibG9nLmlkLFxuICAgICAgfSxcbiAgICB9KVxuICB9XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHRpdGxlLCBjb3ZlciwgY29udGVudCwgdXBkYXRlRGF0ZSwgdmlld3MsXG4gICAgICBhdXRob3JOYW1lLCBoZWFkZXJJY29uLCBjb21tZW50U2l6ZSB9ID0gdGhpcy5wcm9wcy5ibG9nXG4gICAgcmV0dXJuIChcbiAgICAgIDxzZWN0aW9uIHN0eWxlPXtzdHlsZXMuYmxvZ0JveH0+XG4gICAgICAgIDxTaWRlSW5mb1xuICAgICAgICAgIGNhdGVnb3J5PXtpY29ucy5nb2xhbmd9XG4gICAgICAgICAgdGltZT17dXBkYXRlRGF0ZX1cbiAgICAgICAgICBoZWFkZXJJY29uPXtoZWFkZXJJY29ufVxuICAgICAgICAgIG5hbWU9e2F1dGhvck5hbWV9XG4gICAgICAgIC8+XG4gICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5ibG9nQ29uY2lzZUJveH0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLmJsb2dDb25jaXNlfT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5hcnJvd30gLz5cbiAgICAgICAgICAgIDxkaXYgbmFtZT1cImJsb2ctdGl0bGVcIiBzdHlsZT17c3R5bGVzLnRpdGxlfT5cbiAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy50b0Jsb2d9IHN0eWxlPXtzdHlsZXMudGl0bGVMaW5rfT57dGl0bGV9PC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNvdmVyID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5ibG9nQ292ZXJ9PlxuICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e2NvdmVyfSBhbHQ9XCJibG9nQ292ZXJcIiBzdHlsZT17c3R5bGVzLmJsb2dDb3ZlckltZ30gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDxkaXYgcmVmPVwidGV4dFwiIG5hbWU9XCJibG9nLXRleHRcIiBzdHlsZT17c3R5bGVzLmJsb2dUZXh0fT5cbiAgICAgICAgICAgICAge2NvbnRlbnR9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5ibG9nU3RhdGlzdGljc30+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtzdHlsZXMuYmxvZ1N0YXRpc3RpY3NJdGVtfT5cbiAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLnRvQmxvZ30gc3R5bGU9e3N0eWxlcy5ibG9nU3RhdGlzdGljc0l0ZW1MaW5rfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPjxTdmdJY29uIHsuLi5pY29ucy52aWV3fSAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IG1hcmdpblJpZ2h0OiAnMjBweCcgfX0+e3ZpZXdzfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0eWxlcy5ibG9nU3RhdGlzdGljc0l0ZW19PlxuICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMudG9CbG9nfSBzdHlsZT17c3R5bGVzLmJsb2dTdGF0aXN0aWNzSXRlbUxpbmt9PlxuICAgICAgICAgICAgICAgICAgPHNwYW4+PFN2Z0ljb24gey4uLmljb25zLmNvbW1lbnR9IC8+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgbWFyZ2luUmlnaHQ6ICcyMHB4JyB9fT57Y29tbWVudFNpemV9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuICAgIClcbiAgfVxufVxuQmxvZ0JveC5wcm9wVHlwZXMgPSB7XG4gIGJsb2c6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbn1cbmV4cG9ydCBkZWZhdWx0IHdpdGhSb3V0ZXIoQmxvZ0JveClcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL2NvbXBvbmVudHMvYmxvZ0NvbnRhaW5lci9ibG9nL0Jsb2dCb3guanN4XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwidmlld1wiOiB7XG5cdFx0XCJwYXRoc1wiOiBbXG5cdFx0XHRcIk01MTIgMTkyYy0yMjMuMzE4IDAtNDE2Ljg4MiAxMzAuMDQyLTUxMiAzMjAgOTUuMTE4IDE4OS45NTggMjg4LjY4MiAzMjAgNTEyIDMyMCAyMjMuMzEyIDAgNDE2Ljg3Ni0xMzAuMDQyIDUxMi0zMjAtOTUuMTE2LTE4OS45NTgtMjg4LjY4OC0zMjAtNTEyLTMyMHpNNzY0LjQ1IDM2MS43MDRjNjAuMTYyIDM4LjM3NCAxMTEuMTQyIDg5Ljc3NCAxNDkuNDM0IDE1MC4yOTYtMzguMjkyIDYwLjUyMi04OS4yNzQgMTExLjkyMi0xNDkuNDM2IDE1MC4yOTYtNzUuNTk0IDQ4LjIxOC0xNjIuODkgNzMuNzA0LTI1Mi40NDggNzMuNzA0LTg5LjU2IDAtMTc2Ljg1OC0yNS40ODYtMjUyLjQ1Mi03My43MDQtNjAuMTU4LTM4LjM3Mi0xMTEuMTM4LTg5Ljc3Mi0xNDkuNDMyLTE1MC4yOTYgMzguMjkyLTYwLjUyNCA4OS4yNzQtMTExLjkyNCAxNDkuNDM0LTE1MC4yOTYgMy45MTgtMi41IDcuODc2LTQuOTIyIDExLjg2LTcuMy05Ljk2IDI3LjMyOC0xNS40MSA1Ni44MjItMTUuNDEgODcuNTk2IDAgMTQxLjM4MiAxMTQuNjE2IDI1NiAyNTYgMjU2IDE0MS4zODIgMCAyNTYtMTE0LjYxOCAyNTYtMjU2IDAtMzAuNzc0LTUuNDUyLTYwLjI2OC0xNS40MDgtODcuNTk4IDMuOTc4IDIuMzc4IDcuOTM4IDQuODAyIDExLjg1OCA3LjMwMnYwek01MTIgNDE2YzAgNTMuMDIwLTQyLjk4IDk2LTk2IDk2cy05Ni00Mi45OC05Ni05NiA0Mi45OC05NiA5Ni05NiA5NiA0Mi45ODIgOTYgOTZ6XCJcblx0XHRdLFxuXHRcdFwic2l6ZVwiOiBbXG5cdFx0XHQxNCxcblx0XHRcdDE0XG5cdFx0XSxcblx0XHRcInN0eWxlXCI6IHtcblx0XHRcdFwiZmlsbFwiOiBcIiM3NzdcIixcblx0XHRcdFwibWFyZ2luUmlnaHRcIjogXCI4cHhcIixcblx0XHRcdFwicGFkZGluZ1wiOiBcIjJweCAwXCJcblx0XHR9XG5cdH0sXG5cdFwiY29tbWVudFwiOiB7XG5cdFx0XCJwYXRoc1wiOiBbXG5cdFx0XHRcIk05NjAgMzAwcTAtODctNjAtMTYwLjc1dC0xNjMtMTE2LjUtMjI1LTQyLjc1cS0zNSAwLTcyLjUgNC05OS04Ny41LTIzMC0xMjEtMjQuNS03LTU3LTExLTguNS0xLTE1LjI1IDQuNXQtOC43NSAxNC41bDAgMC41cS0xLjUgMiAyLjUgNnQxIDUgMi4yNSA0Ljc1bDMgNC41IDMuNSA0LjI1IDQgNC41cTMuNSA0IDE1LjUgMTcuMjV0MTcuMjUgMTkgMTUuNSAxOS43NSAxNi4yNSAyNS41IDEzLjUgMjkuNSAxMyAzOHEtNzguNSA0NC41LTEyMy43NSAxMTB0LTQ1LjI1IDE0MC41cTAgNjUgMzUuNSAxMjQuMjV0OTUuNSAxMDIuMjUgMTQzIDY4LjI1IDE3NCAyNS4yNXExMjIgMCAyMjUtNDIuNzV0MTYzLTExNi41IDYwLTE2MC43NXpcIlxuXHRcdF0sXG5cdFx0XCJzaXplXCI6IFtcblx0XHRcdDE0LFxuXHRcdFx0MTRcblx0XHRdLFxuXHRcdFwiZGlyZWN0aW9uXCI6IFtcblx0XHRcdDEsXG5cdFx0XHQtMVxuXHRcdF0sXG5cdFx0XCJwb3NpdGlvblwiOiBbXG5cdFx0XHQwLFxuXHRcdFx0MTBcblx0XHRdLFxuXHRcdFwic3R5bGVcIjoge1xuXHRcdFx0XCJmaWxsXCI6IFwiIzc3N1wiLFxuXHRcdFx0XCJtYXJnaW5SaWdodFwiOiBcIjhweFwiLFxuXHRcdFx0XCJwYWRkaW5nXCI6IFwiMnB4IDBcIlxuXHRcdH1cblx0fSxcblx0XCJlZGl0XCI6IHtcblx0XHRcInBhdGhzXCI6IFtcblx0XHRcdFwiTTg2NCAwYzg4LjM2NCAwIDE2MCA3MS42MzQgMTYwIDE2MCAwIDM2LjAyMC0xMS45MSA2OS4yNTgtMzIgOTZsLTY0IDY0LTIyNC0yMjQgNjQtNjRjMjYuNzQyLTIwLjA5MCA1OS45NzgtMzIgOTYtMzJ6TTY0IDczNmwtNjQgMjg4IDI4OC02NCA1OTItNTkyLTIyNC0yMjQtNTkyIDU5MnpNNzE1LjU3OCAzNjMuNTc4bC00NDggNDQ4LTU1LjE1Ni01NS4xNTYgNDQ4LTQ0OCA1NS4xNTYgNTUuMTU2elwiXG5cdFx0XSxcblx0XHRcInN0eWxlXCI6IHtcblx0XHRcdFwiZmlsbFwiOiBcIiM3NzdcIlxuXHRcdH1cblx0fVxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL2NvbXBvbmVudHMvYmxvZ0NvbnRhaW5lci9ibG9nL2ljb25zLmpzb25cbiAqKiBtb2R1bGUgaWQgPSA1NDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjkgMzAgMzFcbiAqKi8iLCJpbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnXG5cbmltcG9ydCBjc3MgZnJvbSAnLi9TaWRlSW5mby5zY3NzJ1xuaW1wb3J0IERlZmF1bHRIZWFkZXJJY29uIGZyb20gJ0RlZmF1bHRIZWFkZXJJY29uJ1xuaW1wb3J0IHsgaW1hZ2VVUkwgfSBmcm9tICdQYXRoVXRpbCdcblxuZnVuY3Rpb24gU2lkZUluZm8oeyB0aW1lLCBoZWFkZXJJY29uLCBuYW1lIH0pIHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRpbWUpXG4gIGNvbnN0IHRpbWVGb3JtYXQgPSBgJHtkYXRlLmdldE1vbnRoKCkgKyAxfeaciCR7ZGF0ZS5nZXREYXRlKCl95pelYFxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjc3Muc2lkZUluZm99PlxuICAgICAgPGEgY2xhc3NOYW1lPXtjc3MuaGVhZGVySWNvbkxpbmt9PlxuICAgICAgICA8aW1nXG4gICAgICAgICAgc3JjPXtpbWFnZVVSTChoZWFkZXJJY29uKSB8fCBEZWZhdWx0SGVhZGVySWNvbn1cbiAgICAgICAgICBjbGFzc05hbWU9e2Nzcy5oZWFkZXJJY29ufVxuICAgICAgICAgIGFsdD1cImF1dGhvckljb25cIlxuICAgICAgICAvPlxuICAgICAgPC9hPlxuICAgICAgPGRpdiBjbGFzc05hbWU9e2Nzcy50aW1lfT57dGltZUZvcm1hdH08L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjc3MuYXV0aG9yfT5cbiAgICAgICAgPGEgY2xhc3NOYW1lPXtjc3MuYXV0aG9yTGlua30+e25hbWUgfHwgJ2Fub255bW91cyd9PC9hPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuU2lkZUluZm8ucHJvcFR5cGVzID0ge1xuICB0aW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBoZWFkZXJJY29uOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxufVxuXG5leHBvcnQgZGVmYXVsdCBTaWRlSW5mb1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9ibG9nQ29udGFpbmVyL2Jsb2cvY29tcG9uZW50cy9TaWRlSW5mby5qc3hcbiAqKi8iLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9TaWRlSW5mby5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9TaWRlSW5mby5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL1NpZGVJbmZvLnNjc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9ibG9nQ29udGFpbmVyL2Jsb2cvY29tcG9uZW50cy9TaWRlSW5mby5zY3NzXG4gKiogbW9kdWxlIGlkID0gNTQ2XG4gKiogbW9kdWxlIGNodW5rcyA9IDI5IDMwIDMxXG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuU2lkZUluZm9fX3NpZGVJbmZvX19fMktxOXUge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgbGVmdDogMDtcXG4gIHRvcDogMDtcXG4gIHdpZHRoOiAxMDBweDtcXG4gIHBhZGRpbmc6IDQwcHggMDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjsgfVxcblxcbi5TaWRlSW5mb19faGVhZGVySWNvbkxpbmtfX18zQXQ1VSB7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7IH1cXG5cXG4uU2lkZUluZm9fX2hlYWRlckljb25fX19tRW5xeCB7XFxuICB3aWR0aDogNjBweDtcXG4gIGhlaWdodDogNjBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDYwcHg7XFxuICBiYWNrZ3JvdW5kOiAjOTBhMWFjO1xcbiAgbGluZS1oZWlnaHQ6IDYwcHg7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBtYXJnaW46IDAgYXV0bzsgfVxcblxcbi5TaWRlSW5mb19fdGltZV9fXzM2Vk5nIHtcXG4gIGJvcmRlci1yYWRpdXM6IDNweDtcXG4gIGZvbnQtc2l6ZTogMTJweDtcXG4gIGNvbG9yOiAjNmU3Yzg2O1xcbiAgd2lkdGg6IDYwcHg7XFxuICBoZWlnaHQ6IDI0cHg7XFxuICBsaW5lLWhlaWdodDogMjRweDtcXG4gIG1hcmdpbjogMjBweCBhdXRvO1xcbiAgYmFja2dyb3VuZDogI2RlZThlZjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICNjZmRiZTQ7IH1cXG5cXG4uU2lkZUluZm9fX2F1dGhvcl9fXzE1WnltIHtcXG4gIGJvcmRlci1yYWRpdXM6IDI0cHg7XFxuICB3aWR0aDogMTAwcHg7XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbiAgY29sb3I6ICM2ZTdjODY7XFxuICBoZWlnaHQ6IDI0cHg7XFxuICBsaW5lLWhlaWdodDogMjRweDtcXG4gIG1hcmdpbjogMjBweCBhdXRvO1xcbiAgYmFja2dyb3VuZDogI2RlZThlZjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICNjZmRiZTQ7IH1cXG5cXG4uU2lkZUluZm9fX2F1dGhvckljb25fX18zdDd2UiB7XFxuICB3aWR0aDogMjRweDtcXG4gIGhlaWdodDogMjRweDtcXG4gIGJvcmRlci1yYWRpdXM6IDI0cHg7XFxuICBmbG9hdDogbGVmdDsgfVxcblxcbi5TaWRlSW5mb19fYXV0aG9yTGlua19fXzF1dHRxIHtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIGNvbG9yOiAjNmU3Yzg2OyB9XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuZXhwb3J0cy5sb2NhbHMgPSB7XG5cdFwic2lkZUluZm9cIjogXCJTaWRlSW5mb19fc2lkZUluZm9fX18yS3E5dVwiLFxuXHRcImhlYWRlckljb25MaW5rXCI6IFwiU2lkZUluZm9fX2hlYWRlckljb25MaW5rX19fM0F0NVVcIixcblx0XCJoZWFkZXJJY29uXCI6IFwiU2lkZUluZm9fX2hlYWRlckljb25fX19tRW5xeFwiLFxuXHRcInRpbWVcIjogXCJTaWRlSW5mb19fdGltZV9fXzM2Vk5nXCIsXG5cdFwiYXV0aG9yXCI6IFwiU2lkZUluZm9fX2F1dGhvcl9fXzE1WnltXCIsXG5cdFwiYXV0aG9ySWNvblwiOiBcIlNpZGVJbmZvX19hdXRob3JJY29uX19fM3Q3dlJcIixcblx0XCJhdXRob3JMaW5rXCI6IFwiU2lkZUluZm9fX2F1dGhvckxpbmtfX18xdXR0cVwiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXI/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vfi9wb3N0Y3NzLWxvYWRlciEuL34vc2Fzcy1sb2FkZXIhLi9zcmMvZW50cnkvcm91dGVzL2Jsb2cvY29tcG9uZW50cy9ibG9nQ29udGFpbmVyL2Jsb2cvY29tcG9uZW50cy9TaWRlSW5mby5zY3NzXG4gKiogbW9kdWxlIGlkID0gNTQ3XG4gKiogbW9kdWxlIGNodW5rcyA9IDI5IDMwIDMxXG4gKiovIiwiLyoqXG4qIENsYW1wcyBhIHRleHQgbm9kZS5cbiogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudC4gRWxlbWVudCBjb250YWluaW5nIHRoZSB0ZXh0IG5vZGUgdG8gY2xhbXAuXG4qIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLiBPcHRpb25zIHRvIHBhc3MgdG8gdGhlIGNsYW1wZXIuXG4qIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2pvc2VwaHNjaG1pdHQvQ2xhbXAuanNcbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjbGFtcChlbGVtZW50LCBvcHRpb25zKSB7XG4gICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgIHdpbiA9IHdpbmRvdyxcbiAgICAgICBvcHQgPSB7XG4gICAgICAgICAgIGNsYW1wOiAgICAgICAgICAgICAgb3B0aW9ucy5jbGFtcCB8fCAyLFxuICAgICAgICAgICB1c2VOYXRpdmVDbGFtcDogICAgIHR5cGVvZihvcHRpb25zLnVzZU5hdGl2ZUNsYW1wKSAhPSAndW5kZWZpbmVkJyA/IG9wdGlvbnMudXNlTmF0aXZlQ2xhbXAgOiB0cnVlLFxuICAgICAgICAgICBzcGxpdE9uQ2hhcnM6ICAgICAgIG9wdGlvbnMuc3BsaXRPbkNoYXJzIHx8IFsnLicsICctJywgJ+KAkycsICfigJQnLCAnICddLCAvL1NwbGl0IG9uIHNlbnRlbmNlcyAocGVyaW9kcyksIGh5cGVucywgZW4tZGFzaGVzLCBlbS1kYXNoZXMsIGFuZCB3b3JkcyAoc3BhY2VzKS5cbiAgICAgICAgICAgYW5pbWF0ZTogICAgICAgICAgICBvcHRpb25zLmFuaW1hdGUgfHwgZmFsc2UsXG4gICAgICAgICAgIHRydW5jYXRpb25DaGFyOiAgICAgb3B0aW9ucy50cnVuY2F0aW9uQ2hhciB8fCAn4oCmJyxcbiAgICAgICAgICAgdHJ1bmNhdGlvbkhUTUw6ICAgICBvcHRpb25zLnRydW5jYXRpb25IVE1MXG4gICAgICAgfSxcblxuICAgICAgIHN0eSA9IGVsZW1lbnQuc3R5bGUsXG4gICAgICAgb3JpZ2luYWxUZXh0ID0gZWxlbWVudC5pbm5lckhUTUwsXG5cbiAgICAgICBzdXBwb3J0c05hdGl2ZUNsYW1wID0gdHlwZW9mKGVsZW1lbnQuc3R5bGUud2Via2l0TGluZUNsYW1wKSAhPSAndW5kZWZpbmVkJyxcbiAgICAgICBjbGFtcFZhbHVlID0gb3B0LmNsYW1wLFxuICAgICAgIGlzQ1NTVmFsdWUgPSBjbGFtcFZhbHVlLmluZGV4T2YgJiYgKGNsYW1wVmFsdWUuaW5kZXhPZigncHgnKSA+IC0xIHx8IGNsYW1wVmFsdWUuaW5kZXhPZignZW0nKSA+IC0xKSxcbiAgICAgICB0cnVuY2F0aW9uSFRNTENvbnRhaW5lcjtcblxuICAgaWYgKG9wdC50cnVuY2F0aW9uSFRNTCkge1xuICAgICAgIHRydW5jYXRpb25IVE1MQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgIHRydW5jYXRpb25IVE1MQ29udGFpbmVyLmlubmVySFRNTCA9IG9wdC50cnVuY2F0aW9uSFRNTDtcbiAgIH1cblxuXG4vLyBVVElMSVRZIEZVTkNUSU9OUyBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG5cbiAgIC8qKlxuICAgICogUmV0dXJuIHRoZSBjdXJyZW50IHN0eWxlIGZvciBhbiBlbGVtZW50LlxuICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbSBUaGUgZWxlbWVudCB0byBjb21wdXRlLlxuICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3AgVGhlIHN0eWxlIHByb3BlcnR5LlxuICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAqL1xuICAgZnVuY3Rpb24gY29tcHV0ZVN0eWxlKGVsZW0sIHByb3ApIHtcbiAgICAgICBpZiAoIXdpbi5nZXRDb21wdXRlZFN0eWxlKSB7XG4gICAgICAgICAgIHdpbi5nZXRDb21wdXRlZFN0eWxlID0gZnVuY3Rpb24oZWwsIHBzZXVkbykge1xuICAgICAgICAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICAgICAgICAgdGhpcy5nZXRQcm9wZXJ0eVZhbHVlID0gZnVuY3Rpb24ocHJvcCkge1xuICAgICAgICAgICAgICAgICAgIHZhciByZSA9IC8oXFwtKFthLXpdKXsxfSkvZztcbiAgICAgICAgICAgICAgICAgICBpZiAocHJvcCA9PSAnZmxvYXQnKSBwcm9wID0gJ3N0eWxlRmxvYXQnO1xuICAgICAgICAgICAgICAgICAgIGlmIChyZS50ZXN0KHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgIHByb3AgPSBwcm9wLnJlcGxhY2UocmUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmd1bWVudHNbMl0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIHJldHVybiBlbC5jdXJyZW50U3R5bGUgJiYgZWwuY3VycmVudFN0eWxlW3Byb3BdID8gZWwuY3VycmVudFN0eWxlW3Byb3BdIDogbnVsbDtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICB9XG4gICAgICAgfVxuXG4gICAgICAgcmV0dXJuIHdpbi5nZXRDb21wdXRlZFN0eWxlKGVsZW0sIG51bGwpLmdldFByb3BlcnR5VmFsdWUocHJvcCk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogUmV0dXJucyB0aGUgbWF4aW11bSBudW1iZXIgb2YgbGluZXMgb2YgdGV4dCB0aGF0IHNob3VsZCBiZSByZW5kZXJlZCBiYXNlZFxuICAgICogb24gdGhlIGN1cnJlbnQgaGVpZ2h0IG9mIHRoZSBlbGVtZW50IGFuZCB0aGUgbGluZS1oZWlnaHQgb2YgdGhlIHRleHQuXG4gICAgKi9cbiAgIGZ1bmN0aW9uIGdldE1heExpbmVzKGhlaWdodCkge1xuICAgICAgIHZhciBhdmFpbEhlaWdodCA9IGhlaWdodCB8fCBlbGVtZW50LmNsaWVudEhlaWdodCxcbiAgICAgICAgICAgbGluZUhlaWdodCA9IGdldExpbmVIZWlnaHQoZWxlbWVudCk7XG5cbiAgICAgICByZXR1cm4gTWF0aC5tYXgoTWF0aC5mbG9vcihhdmFpbEhlaWdodC9saW5lSGVpZ2h0KSwgMCk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogUmV0dXJucyB0aGUgbWF4aW11bSBoZWlnaHQgYSBnaXZlbiBlbGVtZW50IHNob3VsZCBoYXZlIGJhc2VkIG9uIHRoZSBsaW5lLVxuICAgICogaGVpZ2h0IG9mIHRoZSB0ZXh0IGFuZCB0aGUgZ2l2ZW4gY2xhbXAgdmFsdWUuXG4gICAgKi9cbiAgIGZ1bmN0aW9uIGdldE1heEhlaWdodChjbG1wKSB7XG4gICAgICAgdmFyIGxpbmVIZWlnaHQgPSBnZXRMaW5lSGVpZ2h0KGVsZW1lbnQpO1xuICAgICAgIHJldHVybiBsaW5lSGVpZ2h0ICogY2xtcDtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBSZXR1cm5zIHRoZSBsaW5lLWhlaWdodCBvZiBhbiBlbGVtZW50IGFzIGFuIGludGVnZXIuXG4gICAgKi9cbiAgIGZ1bmN0aW9uIGdldExpbmVIZWlnaHQoZWxlbSkge1xuICAgICAgIHZhciBsaCA9IGNvbXB1dGVTdHlsZShlbGVtLCAnbGluZS1oZWlnaHQnKTtcbiAgICAgICBpZiAobGggPT0gJ25vcm1hbCcpIHtcbiAgICAgICAgICAgLy8gTm9ybWFsIGxpbmUgaGVpZ2h0cyB2YXJ5IGZyb20gYnJvd3NlciB0byBicm93c2VyLiBUaGUgc3BlYyByZWNvbW1lbmRzXG4gICAgICAgICAgIC8vIGEgdmFsdWUgYmV0d2VlbiAxLjAgYW5kIDEuMiBvZiB0aGUgZm9udCBzaXplLiBVc2luZyAxLjEgdG8gc3BsaXQgdGhlIGRpZmYuXG4gICAgICAgICAgIGxoID0gcGFyc2VJbnQoY29tcHV0ZVN0eWxlKGVsZW0sICdmb250LXNpemUnKSkgKiAxLjI7XG4gICAgICAgfVxuICAgICAgIHJldHVybiBwYXJzZUludChsaCk7XG4gICB9XG5cblxuLy8gTUVBVCBBTkQgUE9UQVRPRVMgKE1NTU0sIFBPVEFUT0VTLi4uKSBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuICAgdmFyIHNwbGl0T25DaGFycyA9IG9wdC5zcGxpdE9uQ2hhcnMuc2xpY2UoMCksXG4gICAgICAgc3BsaXRDaGFyID0gc3BsaXRPbkNoYXJzWzBdLFxuICAgICAgIGNodW5rcyxcbiAgICAgICBsYXN0Q2h1bms7XG5cbiAgIC8qKlxuICAgICogR2V0cyBhbiBlbGVtZW50J3MgbGFzdCBjaGlsZC4gVGhhdCBtYXkgYmUgYW5vdGhlciBub2RlIG9yIGEgbm9kZSdzIGNvbnRlbnRzLlxuICAgICovXG4gICBmdW5jdGlvbiBnZXRMYXN0Q2hpbGQoZWxlbSkge1xuICAgICAgIC8vQ3VycmVudCBlbGVtZW50IGhhcyBjaGlsZHJlbiwgbmVlZCB0byBnbyBkZWVwZXIgYW5kIGdldCBsYXN0IGNoaWxkIGFzIGEgdGV4dCBub2RlXG4gICAgICAgaWYgKGVsZW0ubGFzdENoaWxkLmNoaWxkcmVuICYmIGVsZW0ubGFzdENoaWxkLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgcmV0dXJuIGdldExhc3RDaGlsZChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlbGVtLmNoaWxkcmVuKS5wb3AoKSk7XG4gICAgICAgfVxuICAgICAgIC8vVGhpcyBpcyB0aGUgYWJzb2x1dGUgbGFzdCBjaGlsZCwgYSB0ZXh0IG5vZGUsIGJ1dCBzb21ldGhpbmcncyB3cm9uZyB3aXRoIGl0LiBSZW1vdmUgaXQgYW5kIGtlZXAgdHJ5aW5nXG4gICAgICAgZWxzZSBpZiAoIWVsZW0ubGFzdENoaWxkIHx8ICFlbGVtLmxhc3RDaGlsZC5ub2RlVmFsdWUgfHwgZWxlbS5sYXN0Q2hpbGQubm9kZVZhbHVlID09ICcnIHx8IGVsZW0ubGFzdENoaWxkLm5vZGVWYWx1ZSA9PSBvcHQudHJ1bmNhdGlvbkNoYXIpIHtcbiAgICAgICAgICAgZWxlbS5sYXN0Q2hpbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtLmxhc3RDaGlsZCk7XG4gICAgICAgICAgIHJldHVybiBnZXRMYXN0Q2hpbGQoZWxlbWVudCk7XG4gICAgICAgfVxuICAgICAgIC8vVGhpcyBpcyB0aGUgbGFzdCBjaGlsZCB3ZSB3YW50LCByZXR1cm4gaXRcbiAgICAgICBlbHNlIHtcbiAgICAgICAgICAgcmV0dXJuIGVsZW0ubGFzdENoaWxkO1xuICAgICAgIH1cbiAgIH1cblxuICAgLyoqXG4gICAgKiBSZW1vdmVzIG9uZSBjaGFyYWN0ZXIgYXQgYSB0aW1lIGZyb20gdGhlIHRleHQgdW50aWwgaXRzIHdpZHRoIG9yXG4gICAgKiBoZWlnaHQgaXMgYmVuZWF0aCB0aGUgcGFzc2VkLWluIG1heCBwYXJhbS5cbiAgICAqL1xuICAgZnVuY3Rpb24gdHJ1bmNhdGUodGFyZ2V0LCBtYXhIZWlnaHQpIHtcbiAgICAgICBpZiAoIW1heEhlaWdodCkge3JldHVybjt9XG5cbiAgICAgICAvKipcbiAgICAgICAgKiBSZXNldHMgZ2xvYmFsIHZhcmlhYmxlcy5cbiAgICAgICAgKi9cbiAgICAgICBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgICAgICAgc3BsaXRPbkNoYXJzID0gb3B0LnNwbGl0T25DaGFycy5zbGljZSgwKTtcbiAgICAgICAgICAgc3BsaXRDaGFyID0gc3BsaXRPbkNoYXJzWzBdO1xuICAgICAgICAgICBjaHVua3MgPSBudWxsO1xuICAgICAgICAgICBsYXN0Q2h1bmsgPSBudWxsO1xuICAgICAgIH1cblxuICAgICAgIHZhciBub2RlVmFsdWUgPSB0YXJnZXQubm9kZVZhbHVlLnJlcGxhY2Uob3B0LnRydW5jYXRpb25DaGFyLCAnJyk7XG5cbiAgICAgICAvL0dyYWIgdGhlIG5leHQgY2h1bmtzXG4gICAgICAgaWYgKCFjaHVua3MpIHtcbiAgICAgICAgICAgLy9JZiB0aGVyZSBhcmUgbW9yZSBjaGFyYWN0ZXJzIHRvIHRyeSwgZ3JhYiB0aGUgbmV4dCBvbmVcbiAgICAgICAgICAgaWYgKHNwbGl0T25DaGFycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICBzcGxpdENoYXIgPSBzcGxpdE9uQ2hhcnMuc2hpZnQoKTtcbiAgICAgICAgICAgfVxuICAgICAgICAgICAvL05vIGNoYXJhY3RlcnMgdG8gY2h1bmsgYnkuIEdvIGNoYXJhY3Rlci1ieS1jaGFyYWN0ZXJcbiAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICBzcGxpdENoYXIgPSAnJztcbiAgICAgICAgICAgfVxuXG4gICAgICAgICAgIGNodW5rcyA9IG5vZGVWYWx1ZS5zcGxpdChzcGxpdENoYXIpO1xuICAgICAgIH1cblxuICAgICAgIC8vSWYgdGhlcmUgYXJlIGNodW5rcyBsZWZ0IHRvIHJlbW92ZSwgcmVtb3ZlIHRoZSBsYXN0IG9uZSBhbmQgc2VlIGlmXG4gICAgICAgLy8gdGhlIG5vZGVWYWx1ZSBmaXRzLlxuICAgICAgIGlmIChjaHVua3MubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnY2h1bmtzJywgY2h1bmtzKTtcbiAgICAgICAgICAgbGFzdENodW5rID0gY2h1bmtzLnBvcCgpO1xuICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbGFzdENodW5rJywgbGFzdENodW5rKTtcbiAgICAgICAgICAgYXBwbHlFbGxpcHNpcyh0YXJnZXQsIGNodW5rcy5qb2luKHNwbGl0Q2hhcikpO1xuICAgICAgIH1cbiAgICAgICAvL05vIG1vcmUgY2h1bmtzIGNhbiBiZSByZW1vdmVkIHVzaW5nIHRoaXMgY2hhcmFjdGVyXG4gICAgICAgZWxzZSB7XG4gICAgICAgICAgIGNodW5rcyA9IG51bGw7XG4gICAgICAgfVxuXG4gICAgICAgLy9JbnNlcnQgdGhlIGN1c3RvbSBIVE1MIGJlZm9yZSB0aGUgdHJ1bmNhdGlvbiBjaGFyYWN0ZXJcbiAgICAgICBpZiAodHJ1bmNhdGlvbkhUTUxDb250YWluZXIpIHtcbiAgICAgICAgICAgdGFyZ2V0Lm5vZGVWYWx1ZSA9IHRhcmdldC5ub2RlVmFsdWUucmVwbGFjZShvcHQudHJ1bmNhdGlvbkNoYXIsICcnKTtcbiAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0YXJnZXQubm9kZVZhbHVlICsgJyAnICsgdHJ1bmNhdGlvbkhUTUxDb250YWluZXIuaW5uZXJIVE1MICsgb3B0LnRydW5jYXRpb25DaGFyO1xuICAgICAgIH1cblxuICAgICAgIC8vU2VhcmNoIHByb2R1Y2VkIHZhbGlkIGNodW5rc1xuICAgICAgIGlmIChjaHVua3MpIHtcbiAgICAgICAgICAgLy9JdCBmaXRzXG4gICAgICAgICAgIGlmIChlbGVtZW50LmNsaWVudEhlaWdodCA8PSBtYXhIZWlnaHQpIHtcbiAgICAgICAgICAgICAgIC8vVGhlcmUncyBzdGlsbCBtb3JlIGNoYXJhY3RlcnMgdG8gdHJ5IHNwbGl0dGluZyBvbiwgbm90IHF1aXRlIGRvbmUgeWV0XG4gICAgICAgICAgICAgICBpZiAoc3BsaXRPbkNoYXJzLmxlbmd0aCA+PSAwICYmIHNwbGl0Q2hhciAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgIGFwcGx5RWxsaXBzaXModGFyZ2V0LCBjaHVua3Muam9pbihzcGxpdENoYXIpICsgc3BsaXRDaGFyICsgbGFzdENodW5rKTtcbiAgICAgICAgICAgICAgICAgICBjaHVua3MgPSBudWxsO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgLy9GaW5pc2hlZCFcbiAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmlubmVySFRNTDtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfVxuICAgICAgIH1cbiAgICAgICAvL05vIHZhbGlkIGNodW5rcyBwcm9kdWNlZFxuICAgICAgIGVsc2Uge1xuICAgICAgICAgICAvL05vIHZhbGlkIGNodW5rcyBldmVuIHdoZW4gc3BsaXR0aW5nIGJ5IGxldHRlciwgdGltZSB0byBtb3ZlXG4gICAgICAgICAgIC8vb24gdG8gdGhlIG5leHQgbm9kZVxuICAgICAgICAgICBpZiAoc3BsaXRDaGFyID09ICcnKSB7XG4gICAgICAgICAgICAgICBhcHBseUVsbGlwc2lzKHRhcmdldCwgJycpO1xuICAgICAgICAgICAgICAgdGFyZ2V0ID0gZ2V0TGFzdENoaWxkKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICB9XG4gICAgICAgfVxuXG4gICAgICAgLy9JZiB5b3UgZ2V0IGhlcmUgaXQgbWVhbnMgc3RpbGwgdG9vIGJpZywgbGV0J3Mga2VlcCB0cnVuY2F0aW5nXG4gICAgICAgaWYgKG9wdC5hbmltYXRlKSB7XG4gICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICB0cnVuY2F0ZSh0YXJnZXQsIG1heEhlaWdodCk7XG4gICAgICAgICAgIH0sIG9wdC5hbmltYXRlID09PSB0cnVlID8gMTAgOiBvcHQuYW5pbWF0ZSk7XG4gICAgICAgfVxuICAgICAgIGVsc2Uge1xuICAgICAgICAgICByZXR1cm4gdHJ1bmNhdGUodGFyZ2V0LCBtYXhIZWlnaHQpO1xuICAgICAgIH1cbiAgIH1cblxuICAgZnVuY3Rpb24gYXBwbHlFbGxpcHNpcyhlbGVtLCBzdHIpIHtcbiAgICAgICBlbGVtLm5vZGVWYWx1ZSA9IHN0ciArIG9wdC50cnVuY2F0aW9uQ2hhcjtcbiAgIH1cblxuXG4vLyBDT05TVFJVQ1RPUiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG5cbiAgIGlmIChjbGFtcFZhbHVlID09ICdhdXRvJykge1xuICAgICAgIGNsYW1wVmFsdWUgPSBnZXRNYXhMaW5lcygpO1xuICAgfVxuICAgZWxzZSBpZiAoaXNDU1NWYWx1ZSkge1xuICAgICAgIGNsYW1wVmFsdWUgPSBnZXRNYXhMaW5lcyhwYXJzZUludChjbGFtcFZhbHVlKSk7XG4gICB9XG5cbiAgIHZhciBjbGFtcGVkVGV4dDtcbiAgIGlmIChzdXBwb3J0c05hdGl2ZUNsYW1wICYmIG9wdC51c2VOYXRpdmVDbGFtcCkge1xuICAgICAgIHN0eS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgIHN0eS50ZXh0T3ZlcmZsb3cgPSAnZWxsaXBzaXMnO1xuICAgICAgIHN0eS53ZWJraXRCb3hPcmllbnQgPSAndmVydGljYWwnO1xuICAgICAgIHN0eS5kaXNwbGF5ID0gJy13ZWJraXQtYm94JztcbiAgICAgICBzdHkud2Via2l0TGluZUNsYW1wID0gY2xhbXBWYWx1ZTtcblxuICAgICAgIGlmIChpc0NTU1ZhbHVlKSB7XG4gICAgICAgICAgIHN0eS5oZWlnaHQgPSBvcHQuY2xhbXAgKyAncHgnO1xuICAgICAgIH1cbiAgIH1cbiAgIGVsc2Uge1xuICAgICAgIHZhciBoZWlnaHQgPSBnZXRNYXhIZWlnaHQoY2xhbXBWYWx1ZSk7XG4gICAgICAgaWYgKGhlaWdodCA8PSBlbGVtZW50LmNsaWVudEhlaWdodCkge1xuICAgICAgICAgICBjbGFtcGVkVGV4dCA9IHRydW5jYXRlKGdldExhc3RDaGlsZChlbGVtZW50KSwgaGVpZ2h0KTtcbiAgICAgICB9XG4gICB9XG5cbiAgIHJldHVybiB7XG4gICAgICAgJ29yaWdpbmFsJzogb3JpZ2luYWxUZXh0LFxuICAgICAgICdjbGFtcGVkJzogY2xhbXBlZFRleHRcbiAgIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xpYi9DbGFtcC5qc1xuICoqLyIsImltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCdcblxuaW1wb3J0IHJlcXVlc3QgZnJvbSAnc3VwZXJhZ2VudCdcbmltcG9ydCBjc3MgZnJvbSAnLi9NeUJsb2cuc2NzcydcbmltcG9ydCBCbG9nQ29udGFpbmVyIGZyb20gJ0Jsb2dDb250YWluZXInXG5pbXBvcnQgQmxvZ0JveCBmcm9tICdCbG9nQm94J1xuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlcidcblxuY2xhc3MgTXlCbG9nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGUgPSB7XG4gICAgYmxvZ3M6IFtdLFxuICB9XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnN0IHsgbG9jYXRpb24gfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCB1c2VySWQgPSBsb2NhdGlvbi5xdWVyeS51c2VySWRcbiAgICB0aGlzLmdldEJsb2dQYWdlKDEsIDEwLCB1c2VySWQpXG4gIH1cbiAgZ2V0QmxvZ1BhZ2UgPSAocGFnZSwgcGFnZXNpemUsIHVzZXJJZCkgPT4ge1xuICAgIHJlcXVlc3RcbiAgICAgIC5nZXQoJy9hcGkvYmxvZy9wYWdlJylcbiAgICAgIC5xdWVyeSh7IHBhZ2UsIHBhZ2VzaXplLCB1c2VySWQgfSlcbiAgICAgIC50aGVuKChyZXMpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXMudGV4dClcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBibG9nczogcmVzdWx0LmRhdGEuZWxlbWVudHMsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkLm5vdGlmeShyZXN1bHQuZGVzYylcbiAgICAgICAgfVxuICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAkLm5vdGlmeShlcnIpXG4gICAgICB9KVxuICB9XG4gIHRvQWRkID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMucm91dGVyLnB1c2goJy9ibG9nL2FkZCcpXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgYmxvZ3MgfSA9IHRoaXMuc3RhdGVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2Nzcy5zdGFnZX0+XG4gICAgICAgIDxCbG9nQ29udGFpbmVyPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjc3Mub3BzfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjc3MuYWRkfSBvbkNsaWNrPXt0aGlzLnRvQWRkfT5cbiAgICAgICAgICAgICAg5paw5aKeXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7XG4gICAgICAgICAgICBibG9ncy5tYXAoKGJsb2csIGkpID0+IDxCbG9nQm94IGtleT17aX0gYmxvZz17YmxvZ30gLz4pXG4gICAgICAgICAgfVxuICAgICAgICA8L0Jsb2dDb250YWluZXI+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbk15QmxvZy5wcm9wVHlwZXMgPSB7XG4gIGxvY2F0aW9uOiBQcm9wVHlwZXMub2JqZWN0LFxufVxubW9kdWxlLmV4cG9ydHMgPSB3aXRoUm91dGVyKE15QmxvZylcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9ibG9nL3JvdXRlcy9teWJsb2cvTXlCbG9nLmpzeFxuICoqLyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL015QmxvZy5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9NeUJsb2cuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9NeUJsb2cuc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvYmxvZy9yb3V0ZXMvbXlibG9nL015QmxvZy5zY3NzXG4gKiogbW9kdWxlIGlkID0gNTYyXG4gKiogbW9kdWxlIGNodW5rcyA9IDMxXG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuTXlCbG9nX19zdGFnZV9fXzJxYl9YIHtcXG4gIG1heC13aWR0aDogOTgwcHg7XFxuICBtYXJnaW46IDAgYXV0bztcXG4gIHBhZGRpbmc6IDAgMTBweDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGhlaWdodDogMTAwJTsgfVxcblxcbi5NeUJsb2dfX29wc19fXzEwLTJBIHtcXG4gIG1hcmdpbi10b3A6IDEwcHg7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIC13ZWJraXQtYm94LW9yaWVudDogaG9yaXpvbnRhbDtcXG4gIC13ZWJraXQtYm94LWRpcmVjdGlvbjogcmV2ZXJzZTtcXG4gICAgICAtbXMtZmxleC1kaXJlY3Rpb246IHJvdy1yZXZlcnNlO1xcbiAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93LXJldmVyc2U7XFxuICB3aWR0aDogMTAwJTtcXG4gIHotaW5kZXg6IDE7IH1cXG5cXG4uTXlCbG9nX19hZGRfX18xVjFrSSB7XFxuICBjdXJzb3I6IHBvaW50ZXI7IH1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5leHBvcnRzLmxvY2FscyA9IHtcblx0XCJzdGFnZVwiOiBcIk15QmxvZ19fc3RhZ2VfX18ycWJfWFwiLFxuXHRcIm9wc1wiOiBcIk15QmxvZ19fb3BzX19fMTAtMkFcIixcblx0XCJhZGRcIjogXCJNeUJsb2dfX2FkZF9fXzFWMWtJXCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlcj9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi9+L3Bvc3Rjc3MtbG9hZGVyIS4vfi9zYXNzLWxvYWRlciEuL3NyYy9lbnRyeS9yb3V0ZXMvYmxvZy9yb3V0ZXMvbXlibG9nL015QmxvZy5zY3NzXG4gKiogbW9kdWxlIGlkID0gNTYzXG4gKiogbW9kdWxlIGNodW5rcyA9IDMxXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==