webpackJsonp([20],{

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

/***/ 393:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Paging = __webpack_require__(394);
	
	var _Paging2 = _interopRequireDefault(_Paging);
	
	var _Pagination = __webpack_require__(396);
	
	var _Pagination2 = _interopRequireDefault(_Pagination);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Paging = function (_React$Component) {
	  _inherits(Paging, _React$Component);
	
	  function Paging(props) {
	    _classCallCheck(this, Paging);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Paging).call(this, props));
	
	    _this.onChange = function (page) {
	      _this.setState({
	        currentPage: page
	      });
	    };
	
	    _this.state = {
	      pages: 20,
	      currentPage: 1
	    };
	    return _this;
	  }
	
	  _createClass(Paging, [{
	    key: 'render',
	    value: function render() {
	      var _state = this.state;
	      var pages = _state.pages;
	      var currentPage = _state.currentPage;
	
	      return _react2.default.createElement(
	        'div',
	        { className: _Paging2.default.stage },
	        _react2.default.createElement(_Pagination2.default, { pages: pages, currentPage: currentPage, onChange: this.onChange })
	      );
	    }
	  }]);
	
	  return Paging;
	}(_react2.default.Component);
	
	module.exports = Paging;

/***/ },

/***/ 394:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(395);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../node_modules/postcss-loader/index.js!./../../../../../../node_modules/sass-loader/index.js!./Paging.scss", function() {
				var newContent = require("!!./../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../node_modules/postcss-loader/index.js!./../../../../../../node_modules/sass-loader/index.js!./Paging.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 395:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".Paging__stage___2Zinu {\n  position: relative;\n  overflow: auto;\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center; }\n", ""]);
	
	// exports
	exports.locals = {
		"stage": "Paging__stage___2Zinu"
	};

/***/ },

/***/ 396:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _PageLink = __webpack_require__(397);
	
	var _PageLink2 = _interopRequireDefault(_PageLink);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Pagination = function (_React$Component) {
	  _inherits(Pagination, _React$Component);
	
	  function Pagination() {
	    var _Object$getPrototypeO;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Pagination);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Pagination)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.onClick = function (page) {
	      if (page > 0) {
	        _this.props.onChange(page);
	      }
	    }, _this.getInterval = function () {
	      var _this$props = _this.props;
	      var currentPage = _this$props.currentPage;
	      var displayedPages = _this$props.displayedPages;
	      var pages = _this$props.pages;
	
	      var halfDisplayed = Math.floor(displayedPages / 2);
	      return {
	        start: Math.ceil(currentPage > halfDisplayed ? Math.max(Math.min(currentPage - halfDisplayed, pages - displayedPages), 1) : 1),
	        end: Math.ceil(currentPage > halfDisplayed ? Math.min(currentPage + halfDisplayed, pages) : Math.min(displayedPages, pages))
	      };
	    }, _this.renderStart = function (edges, start, currentPage) {
	      var end = Math.min(edges, start);
	      var starts = [];
	      if (start > edges) {
	        for (var i = 1; i <= end; i++) {
	          starts.push(_react2.default.createElement(_PageLink2.default, { key: i, onClick: _this.onClick, page: i, currentPage: currentPage }));
	        }
	      }
	      if (start - end === 2) {
	        starts.push(_react2.default.createElement(_PageLink2.default, {
	          key: end + 1,
	          onClick: _this.onClick,
	          page: end + 1,
	          currentPage: currentPage
	        }));
	      }
	      if (start - end > 2) {
	        starts.push(_react2.default.createElement(_PageLink2.default, { key: 'a', onClick: _this.onClick, page: 0, currentPage: currentPage }));
	      }
	      return starts;
	    }, _this.renderInterval = function (start, end, currentPage) {
	      var intervals = [];
	      for (var i = start; i <= end; i++) {
	        intervals.push(_react2.default.createElement(_PageLink2.default, { key: i, onClick: _this.onClick, page: i, currentPage: currentPage }));
	      }
	      return intervals;
	    }, _this.renderEnd = function (edges, end, pages, currentPage) {
	      var ends = [];
	      var begin = Math.max(end + 1, pages - edges + 1);
	      if (begin - end === 2) {
	        ends.push(_react2.default.createElement(_PageLink2.default, {
	          key: begin - 1,
	          onClick: _this.onClick,
	          page: begin - 1,
	          currentPage: currentPage
	        }));
	      }
	      if (begin - end > 2) {
	        ends.push(_react2.default.createElement(_PageLink2.default, { key: 'b', onClick: _this.onClick, page: 0, currentPage: currentPage }));
	      }
	      for (var i = begin; i <= pages; i++) {
	        ends.push(_react2.default.createElement(_PageLink2.default, { key: i, onClick: _this.onClick, page: i, currentPage: currentPage }));
	      }
	      return ends;
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(Pagination, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var pages = _props.pages;
	      var edges = _props.edges;
	      var currentPage = _props.currentPage;
	      var style = _props.style;
	      var className = _props.className;
	
	      var _getInterval = this.getInterval();
	
	      var start = _getInterval.start;
	      var end = _getInterval.end;
	
	      return _react2.default.createElement(
	        'ul',
	        { style: style, className: className },
	        this.renderStart(edges, start, currentPage),
	        this.renderInterval(start, end, currentPage),
	        this.renderEnd(edges, end, pages, currentPage)
	      );
	    }
	  }]);
	
	  return Pagination;
	}(_react2.default.Component);
	
	Pagination.defaultProps = {
	  pages: 1,
	  edges: 1,
	  displayedPages: 6,
	  currentPage: 1,
	  onChange: function onChange() {}
	};
	Pagination.propTypes = {
	  pages: _react.PropTypes.number,
	  edges: _react.PropTypes.number,
	  displayedPages: _react.PropTypes.number,
	  currentPage: _react.PropTypes.number,
	  onChange: _react.PropTypes.func
	};
	exports.default = Pagination;

/***/ },

/***/ 397:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _PageLink = __webpack_require__(398);
	
	var _PageLink2 = _interopRequireDefault(_PageLink);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var PageLink = function PageLink(_ref) {
	  var _onClick = _ref.onClick;
	  var page = _ref.page;
	  var currentPage = _ref.currentPage;
	
	  var kind = 'common';
	  if (page === 0) {
	    kind = 'disable';
	  } else if (page === currentPage) {
	    kind = 'active';
	  }
	  return _react2.default.createElement(
	    'li',
	    { onClick: function onClick() {
	        return _onClick(page);
	      }, className: _PageLink2.default.pagelink },
	    _react2.default.createElement(
	      'span',
	      { key: page, className: _PageLink2.default[kind] },
	      page || '...'
	    )
	  );
	};
	
	PageLink.propTypes = {
	  currentPage: _react.PropTypes.number.isRequired,
	  onClick: _react.PropTypes.func.isRequired,
	  page: _react.PropTypes.number.isRequired
	};
	exports.default = PageLink;

/***/ },

/***/ 398:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(399);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./PageLink.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./PageLink.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 399:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".PageLink__pagelink___2YYG- {\n  display: inline-block;\n  font-size: 1rem;\n  vertical-align: top; }\n\n.PageLink__pagelink___2YYG-:nth-child(n+2) {\n  margin-left: 5px; }\n\n.PageLink__pagelink___2YYG- span {\n  display: inline-block;\n  min-width: 16px;\n  padding: 3px 5px;\n  line-height: 20px;\n  background: #f7f7f7;\n  color: #666;\n  text-align: center;\n  box-sizing: content-box; }\n\n.PageLink__pagelink___2YYG- .PageLink__common___2agXM {\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 4px;\n  border-bottom-color: rgba(0, 0, 0, 0.3);\n  text-shadow: 0 1px 0 #fff;\n  background-origin: border-box;\n  background-image: -webkit-linear-gradient(top, #fff, #eee);\n  background-image: linear-gradient(to bottom, #fff, #eee);\n  cursor: pointer; }\n\n.PageLink__pagelink___2YYG- .PageLink__common___2agXM:hover {\n  background-color: #fafafa;\n  color: #666;\n  outline: 0;\n  background-image: none; }\n\n.PageLink__pagelink___2YYG- .PageLink__active___j_4hN {\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 4px;\n  border-bottom-color: rgba(0, 0, 0, 0.4);\n  background: #009dd8;\n  color: #fff;\n  box-sizing: content-box;\n  background-image: -webkit-linear-gradient(top, #00b4f5, #008dc5);\n  background-image: linear-gradient(to bottom, #00b4f5, #008dc5);\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.2); }\n", ""]);
	
	// exports
	exports.locals = {
		"pagelink": "PageLink__pagelink___2YYG-",
		"common": "PageLink__common___2agXM",
		"active": "PageLink__active___j_4hN"
	};

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9wYWdpbmcvUGFnaW5nLmpzIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3BhZ2luZy9QYWdpbmcuc2Nzcz9hMGU3Iiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3BhZ2luZy9QYWdpbmcuc2NzcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9wYWdpbmF0aW9uL1BhZ2luYXRpb24uanN4Iiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3BhZ2luYXRpb24vY29tcG9uZW50cy9QYWdlTGluay5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvcGFnaW5hdGlvbi9jb21wb25lbnRzL1BhZ2VMaW5rLnNjc3M/OGU0MiIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9wYWdpbmF0aW9uL2NvbXBvbmVudHMvUGFnZUxpbmsuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBLHlDQUF3QyxnQkFBZ0I7QUFDeEQsS0FBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLG9CQUFvQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QVM7QUFBQSxnQkFBTSxTQUFRLElBQVIsQ0FBTjtBQUFBLFFBQWIsRUFBa0MsV0FBVyxtQkFBTyxRQUFwRDtBQUNFO0FBQUE7QUFBQSxTQUFNLEtBQUssSUFBWCxFQUFpQixXQUFXLG1CQUFPLElBQVAsQ0FBNUI7QUFBMkMsZUFBUTtBQUFuRDtBQURGLElBREY7QUFLRCxFQVpEOztBQWNBLFVBQVMsU0FBVCxHQUFxQjtBQUNuQixnQkFBYSxpQkFBVSxNQUFWLENBQWlCLFVBRFg7QUFFbkIsWUFBUyxpQkFBVSxJQUFWLENBQWUsVUFGTDtBQUduQixTQUFNLGlCQUFVLE1BQVYsQ0FBaUI7QUFISixFQUFyQjttQkFLZSxROzs7Ozs7O0FDdEJmOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQXlGO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsaUNBQWdDLFVBQVUsRUFBRTtBQUM1QyxFOzs7Ozs7O0FDcEJBO0FBQ0E7OztBQUdBO0FBQ0Esd0RBQXVELDBCQUEwQixvQkFBb0Isd0JBQXdCLEVBQUUsZ0RBQWdELHFCQUFxQixFQUFFLHNDQUFzQywwQkFBMEIsb0JBQW9CLHFCQUFxQixzQkFBc0Isd0JBQXdCLGdCQUFnQix1QkFBdUIsNEJBQTRCLEVBQUUsMkRBQTJELHlDQUF5Qyx1QkFBdUIsNENBQTRDLDhCQUE4QixrQ0FBa0MsK0RBQStELDZEQUE2RCxvQkFBb0IsRUFBRSxpRUFBaUUsOEJBQThCLGdCQUFnQixlQUFlLDJCQUEyQixFQUFFLDJEQUEyRCx5Q0FBeUMsdUJBQXVCLDRDQUE0Qyx3QkFBd0IsZ0JBQWdCLDRCQUE0QixxRUFBcUUsbUVBQW1FLDZDQUE2QyxFQUFFOztBQUV4MUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEciLCJmaWxlIjoianMvMjAtMGMxNzcwNDBjNDVkMjViOTE3YjMuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBsaXN0ID0gW107XHJcblxyXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcclxuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXNbaV07XHJcblx0XHRcdGlmKGl0ZW1bMl0pIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGl0ZW1bMV0gKyBcIn1cIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goaXRlbVsxXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQuam9pbihcIlwiKTtcclxuXHR9O1xyXG5cclxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxyXG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcclxuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxyXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XHJcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcclxuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxyXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xyXG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXHJcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXHJcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXHJcblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXHJcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XHJcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRyZXR1cm4gbGlzdDtcclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbiAqKiBtb2R1bGUgaWQgPSAyNTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYgNyA4IDkgMTggMTkgMjAgMjMgMjQgMjUgMjYgMjcgMjggMjkgMzAgMzEgMzJcbiAqKi8iLCIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG52YXIgc3R5bGVzSW5Eb20gPSB7fSxcclxuXHRtZW1vaXplID0gZnVuY3Rpb24oZm4pIHtcclxuXHRcdHZhciBtZW1vO1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHRcdFx0cmV0dXJuIG1lbW87XHJcblx0XHR9O1xyXG5cdH0sXHJcblx0aXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gL21zaWUgWzYtOV1cXGIvLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XHJcblx0fSksXHJcblx0Z2V0SGVhZEVsZW1lbnQgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuXHR9KSxcclxuXHRzaW5nbGV0b25FbGVtZW50ID0gbnVsbCxcclxuXHRzaW5nbGV0b25Db3VudGVyID0gMCxcclxuXHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XHJcblx0aWYodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XHJcblx0XHRpZih0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcclxuXHR9XHJcblxyXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxyXG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2VcclxuXHRpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcclxuXHJcblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIDxoZWFkPi5cclxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xyXG5cclxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QpO1xyXG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xyXG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcclxuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XHJcblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcclxuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xyXG5cdFx0fVxyXG5cdFx0aWYobmV3TGlzdCkge1xyXG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QpO1xyXG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XHJcblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcclxuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspXHJcblx0XHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXSgpO1xyXG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpIHtcclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcclxuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xyXG5cdFx0aWYoZG9tU3R5bGUpIHtcclxuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyhsaXN0KSB7XHJcblx0dmFyIHN0eWxlcyA9IFtdO1xyXG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xyXG5cdFx0dmFyIGlkID0gaXRlbVswXTtcclxuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xyXG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcclxuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xyXG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xyXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pXHJcblx0XHRcdHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XHJcblx0XHRlbHNlXHJcblx0XHRcdG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcclxuXHR9XHJcblx0cmV0dXJuIHN0eWxlcztcclxufVxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCkge1xyXG5cdHZhciBoZWFkID0gZ2V0SGVhZEVsZW1lbnQoKTtcclxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcFtzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcclxuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xyXG5cdFx0aWYoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XHJcblx0XHRcdGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgaGVhZC5maXJzdENoaWxkKTtcclxuXHRcdH0gZWxzZSBpZihsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xyXG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHRcdH1cclxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGVFbGVtZW50KTtcclxuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcclxuXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcuIE11c3QgYmUgJ3RvcCcgb3IgJ2JvdHRvbScuXCIpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xyXG5cdHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0dmFyIGlkeCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGVFbGVtZW50KTtcclxuXHRpZihpZHggPj0gMCkge1xyXG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykge1xyXG5cdHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XHJcblx0c3R5bGVFbGVtZW50LnR5cGUgPSBcInRleHQvY3NzXCI7XHJcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCk7XHJcblx0cmV0dXJuIHN0eWxlRWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucykge1xyXG5cdHZhciBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xyXG5cdGxpbmtFbGVtZW50LnJlbCA9IFwic3R5bGVzaGVldFwiO1xyXG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rRWxlbWVudCk7XHJcblx0cmV0dXJuIGxpbmtFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTdHlsZShvYmosIG9wdGlvbnMpIHtcclxuXHR2YXIgc3R5bGVFbGVtZW50LCB1cGRhdGUsIHJlbW92ZTtcclxuXHJcblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XHJcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcclxuXHRcdHN0eWxlRWxlbWVudCA9IHNpbmdsZXRvbkVsZW1lbnQgfHwgKHNpbmdsZXRvbkVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xyXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgZmFsc2UpO1xyXG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgdHJ1ZSk7XHJcblx0fSBlbHNlIGlmKG9iai5zb3VyY2VNYXAgJiZcclxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XHJcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcclxuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcclxuXHRcdFx0aWYoc3R5bGVFbGVtZW50LmhyZWYpXHJcblx0XHRcdFx0VVJMLnJldm9rZU9iamVjdFVSTChzdHlsZUVsZW1lbnQuaHJlZik7XHJcblx0XHR9O1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XHJcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcclxuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHR1cGRhdGUob2JqKTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xyXG5cdFx0aWYobmV3T2JqKSB7XHJcblx0XHRcdGlmKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcClcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0fTtcclxufVxyXG5cclxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgdGV4dFN0b3JlID0gW107XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XHJcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XHJcblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcclxuXHR9O1xyXG59KSgpO1xyXG5cclxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZUVsZW1lbnQsIGluZGV4LCByZW1vdmUsIG9iaikge1xyXG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcclxuXHJcblx0aWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcclxuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGVFbGVtZW50LmNoaWxkTm9kZXM7XHJcblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50Lmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBhcHBseVRvVGFnKHN0eWxlRWxlbWVudCwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IG9iai5jc3M7XHJcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xyXG5cclxuXHRpZihtZWRpYSkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxyXG5cdH1cclxuXHJcblx0aWYoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XHJcblx0fSBlbHNlIHtcclxuXHRcdHdoaWxlKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XHJcblx0XHR9XHJcblx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVMaW5rKGxpbmtFbGVtZW50LCBvYmopIHtcclxuXHR2YXIgY3NzID0gb2JqLmNzcztcclxuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcclxuXHJcblx0aWYoc291cmNlTWFwKSB7XHJcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxyXG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xyXG5cdH1cclxuXHJcblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XHJcblxyXG5cdHZhciBvbGRTcmMgPSBsaW5rRWxlbWVudC5ocmVmO1xyXG5cclxuXHRsaW5rRWxlbWVudC5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcclxuXHJcblx0aWYob2xkU3JjKVxyXG5cdFx0VVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xyXG59XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcbiAqKiBtb2R1bGUgaWQgPSAyNTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYgNyA4IDkgMTggMTkgMjAgMjMgMjQgMjUgMjYgMjcgMjggMjkgMzAgMzEgMzJcbiAqKi8iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5cbmltcG9ydCBzdHlsZXMgZnJvbSAnLi9QYWdpbmcuc2NzcydcblxuaW1wb3J0IFBhZ2luYXRpb24gZnJvbSAnUGFnaW5hdGlvbidcblxuY2xhc3MgUGFnaW5nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgIHN1cGVyKHByb3BzKVxuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgcGFnZXM6IDIwLFxuICAgICAgICBjdXJyZW50UGFnZTogMSxcbiAgICAgIH1cbiAgfVxuICBvbkNoYW5nZSA9IChwYWdlKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50UGFnZTogcGFnZSxcbiAgICB9KVxuICB9XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHBhZ2VzLCBjdXJyZW50UGFnZSB9ID0gdGhpcy5zdGF0ZVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLnN0YWdlfT5cbiAgICAgICAgPFBhZ2luYXRpb24gcGFnZXM9e3BhZ2VzfSBjdXJyZW50UGFnZT17Y3VycmVudFBhZ2V9IG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2luZ1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9wYWdpbmcvUGFnaW5nLmpzXG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vUGFnaW5nLnNjc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL1BhZ2luZy5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL1BhZ2luZy5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvcGFnaW5nL1BhZ2luZy5zY3NzXG4gKiogbW9kdWxlIGlkID0gMzk0XG4gKiogbW9kdWxlIGNodW5rcyA9IDIwXG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuUGFnaW5nX19zdGFnZV9fXzJaaW51IHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIG92ZXJmbG93OiBhdXRvO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIC13ZWJraXQtYm94LWFsaWduOiBjZW50ZXI7XFxuICAgICAgLW1zLWZsZXgtYWxpZ246IGNlbnRlcjtcXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIC13ZWJraXQtYm94LXBhY2s6IGNlbnRlcjtcXG4gICAgICAtbXMtZmxleC1wYWNrOiBjZW50ZXI7XFxuICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyOyB9XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuZXhwb3J0cy5sb2NhbHMgPSB7XG5cdFwic3RhZ2VcIjogXCJQYWdpbmdfX3N0YWdlX19fMlppbnVcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuL34vcG9zdGNzcy1sb2FkZXIhLi9+L3Nhc3MtbG9hZGVyIS4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvcGFnaW5nL1BhZ2luZy5zY3NzXG4gKiogbW9kdWxlIGlkID0gMzk1XG4gKiogbW9kdWxlIGNodW5rcyA9IDIwXG4gKiovIiwiaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuXG5pbXBvcnQgUGFnZUxpbmsgZnJvbSAnLi9jb21wb25lbnRzL1BhZ2VMaW5rLmpzeCdcblxuY2xhc3MgUGFnaW5hdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIG9uQ2xpY2sgPSAocGFnZSkgPT4ge1xuICAgIGlmIChwYWdlID4gMCkge1xuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShwYWdlKVxuICAgIH1cbiAgfVxuICBnZXRJbnRlcnZhbCA9ICgpID0+IHtcbiAgICBjb25zdCB7IGN1cnJlbnRQYWdlLCBkaXNwbGF5ZWRQYWdlcywgcGFnZXMgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCBoYWxmRGlzcGxheWVkID0gTWF0aC5mbG9vcihkaXNwbGF5ZWRQYWdlcyAvIDIpXG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXJ0OiBNYXRoLmNlaWwoY3VycmVudFBhZ2UgPiBoYWxmRGlzcGxheWVkID9cbiAgICAgICAgTWF0aC5tYXgoTWF0aC5taW4oY3VycmVudFBhZ2UgLSBoYWxmRGlzcGxheWVkLCAocGFnZXMgLSBkaXNwbGF5ZWRQYWdlcykpLCAxKSA6IDEpLFxuICAgICAgZW5kOiBNYXRoLmNlaWwoY3VycmVudFBhZ2UgPiBoYWxmRGlzcGxheWVkID9cbiAgICAgICAgTWF0aC5taW4oY3VycmVudFBhZ2UgKyBoYWxmRGlzcGxheWVkLCBwYWdlcykgOiBNYXRoLm1pbihkaXNwbGF5ZWRQYWdlcywgcGFnZXMpKSxcbiAgICB9XG4gIH1cbiAgcmVuZGVyU3RhcnQgPSAoZWRnZXMsIHN0YXJ0LCBjdXJyZW50UGFnZSkgPT4ge1xuICAgIGNvbnN0IGVuZCA9IE1hdGgubWluKGVkZ2VzLCBzdGFydClcbiAgICBjb25zdCBzdGFydHMgPSBbXVxuICAgIGlmIChzdGFydCA+IGVkZ2VzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICBzdGFydHMucHVzaCg8UGFnZUxpbmsga2V5PXtpfSBvbkNsaWNrPXt0aGlzLm9uQ2xpY2t9IHBhZ2U9e2l9IGN1cnJlbnRQYWdlPXtjdXJyZW50UGFnZX0gLz4pXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzdGFydCAtIGVuZCA9PT0gMikge1xuICAgICAgc3RhcnRzLnB1c2goPFBhZ2VMaW5rXG4gICAgICAgIGtleT17ZW5kICsgMX1cbiAgICAgICAgb25DbGljaz17dGhpcy5vbkNsaWNrfVxuICAgICAgICBwYWdlPXtlbmQgKyAxfVxuICAgICAgICBjdXJyZW50UGFnZT17Y3VycmVudFBhZ2V9XG4gICAgICAvPilcbiAgICB9XG4gICAgaWYgKHN0YXJ0IC0gZW5kID4gMikge1xuICAgICAgc3RhcnRzLnB1c2goPFBhZ2VMaW5rIGtleT1cImFcIiBvbkNsaWNrPXt0aGlzLm9uQ2xpY2t9IHBhZ2U9ezB9IGN1cnJlbnRQYWdlPXtjdXJyZW50UGFnZX0gLz4pXG4gICAgfVxuICAgIHJldHVybiBzdGFydHNcbiAgfVxuICByZW5kZXJJbnRlcnZhbCA9IChzdGFydCwgZW5kLCBjdXJyZW50UGFnZSkgPT4ge1xuICAgIGNvbnN0IGludGVydmFscyA9IFtdXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICBpbnRlcnZhbHMucHVzaCg8UGFnZUxpbmsga2V5PXtpfSBvbkNsaWNrPXt0aGlzLm9uQ2xpY2t9IHBhZ2U9e2l9IGN1cnJlbnRQYWdlPXtjdXJyZW50UGFnZX0gLz4pXG4gICAgfVxuICAgIHJldHVybiBpbnRlcnZhbHNcbiAgfVxuICByZW5kZXJFbmQgPSAoZWRnZXMsIGVuZCwgcGFnZXMsIGN1cnJlbnRQYWdlKSA9PiB7XG4gICAgY29uc3QgZW5kcyA9IFtdXG4gICAgY29uc3QgYmVnaW4gPSBNYXRoLm1heChlbmQgKyAxLCBwYWdlcyAtIGVkZ2VzICsgMSlcbiAgICBpZiAoYmVnaW4gLSBlbmQgPT09IDIpIHtcbiAgICAgIGVuZHMucHVzaChcbiAgICAgICAgPFBhZ2VMaW5rXG4gICAgICAgICAga2V5PXtiZWdpbiAtIDF9XG4gICAgICAgICAgb25DbGljaz17dGhpcy5vbkNsaWNrfVxuICAgICAgICAgIHBhZ2U9e2JlZ2luIC0gMX1cbiAgICAgICAgICBjdXJyZW50UGFnZT17Y3VycmVudFBhZ2V9XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuICAgIGlmIChiZWdpbiAtIGVuZCA+IDIpIHtcbiAgICAgIGVuZHMucHVzaCg8UGFnZUxpbmsga2V5PVwiYlwiIG9uQ2xpY2s9e3RoaXMub25DbGlja30gcGFnZT17MH0gY3VycmVudFBhZ2U9e2N1cnJlbnRQYWdlfSAvPilcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IGJlZ2luOyBpIDw9IHBhZ2VzOyBpKyspIHtcbiAgICAgIGVuZHMucHVzaCg8UGFnZUxpbmsga2V5PXtpfSBvbkNsaWNrPXt0aGlzLm9uQ2xpY2t9IHBhZ2U9e2l9IGN1cnJlbnRQYWdlPXtjdXJyZW50UGFnZX0gLz4pXG4gICAgfVxuICAgIHJldHVybiBlbmRzXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgcGFnZXMsIGVkZ2VzLCBjdXJyZW50UGFnZSwgc3R5bGUsIGNsYXNzTmFtZSB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gdGhpcy5nZXRJbnRlcnZhbCgpXG4gICAgcmV0dXJuIChcbiAgICAgIDx1bCBzdHlsZT17c3R5bGV9IGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICAgICAge3RoaXMucmVuZGVyU3RhcnQoZWRnZXMsIHN0YXJ0LCBjdXJyZW50UGFnZSl9XG4gICAgICAgIHt0aGlzLnJlbmRlckludGVydmFsKHN0YXJ0LCBlbmQsIGN1cnJlbnRQYWdlKX1cbiAgICAgICAge3RoaXMucmVuZGVyRW5kKGVkZ2VzLCBlbmQsIHBhZ2VzLCBjdXJyZW50UGFnZSl9XG4gICAgICA8L3VsPlxuICAgIClcbiAgfVxufVxuUGFnaW5hdGlvbi5kZWZhdWx0UHJvcHMgPSB7XG4gIHBhZ2VzOiAxLFxuICBlZGdlczogMSxcbiAgZGlzcGxheWVkUGFnZXM6IDYsXG4gIGN1cnJlbnRQYWdlOiAxLFxuICBvbkNoYW5nZTogKCkgPT4ge30sXG59XG5QYWdpbmF0aW9uLnByb3BUeXBlcyA9IHtcbiAgcGFnZXM6IFByb3BUeXBlcy5udW1iZXIsXG4gIGVkZ2VzOiBQcm9wVHlwZXMubnVtYmVyLFxuICBkaXNwbGF5ZWRQYWdlczogUHJvcFR5cGVzLm51bWJlcixcbiAgY3VycmVudFBhZ2U6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbn1cbmV4cG9ydCBkZWZhdWx0IFBhZ2luYXRpb25cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbXBvbmVudHMvcGFnaW5hdGlvbi9QYWdpbmF0aW9uLmpzeFxuICoqLyIsImltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBzdHlsZXMgZnJvbSAnLi9QYWdlTGluay5zY3NzJ1xuXG5jb25zdCBQYWdlTGluayA9ICh7IG9uQ2xpY2ssIHBhZ2UsIGN1cnJlbnRQYWdlIH0pID0+IHtcbiAgbGV0IGtpbmQgPSAnY29tbW9uJ1xuICBpZiAocGFnZSA9PT0gMCkge1xuICAgIGtpbmQgPSAnZGlzYWJsZSdcbiAgfSBlbHNlIGlmIChwYWdlID09PSBjdXJyZW50UGFnZSkge1xuICAgIGtpbmQgPSAnYWN0aXZlJ1xuICB9XG4gIHJldHVybiAoXG4gICAgPGxpIG9uQ2xpY2s9eygpID0+IG9uQ2xpY2socGFnZSl9IGNsYXNzTmFtZT17c3R5bGVzLnBhZ2VsaW5rfT5cbiAgICAgIDxzcGFuIGtleT17cGFnZX0gY2xhc3NOYW1lPXtzdHlsZXNba2luZF19PntwYWdlIHx8ICcuLi4nfTwvc3Bhbj5cbiAgICA8L2xpPlxuICApXG59XG5cblBhZ2VMaW5rLnByb3BUeXBlcyA9IHtcbiAgY3VycmVudFBhZ2U6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcGFnZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxufVxuZXhwb3J0IGRlZmF1bHQgUGFnZUxpbmtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbXBvbmVudHMvcGFnaW5hdGlvbi9jb21wb25lbnRzL1BhZ2VMaW5rLmpzeFxuICoqLyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL1BhZ2VMaW5rLnNjc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL1BhZ2VMaW5rLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vUGFnZUxpbmsuc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL3BhZ2luYXRpb24vY29tcG9uZW50cy9QYWdlTGluay5zY3NzXG4gKiogbW9kdWxlIGlkID0gMzk4XG4gKiogbW9kdWxlIGNodW5rcyA9IDIwIDMwXG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuUGFnZUxpbmtfX3BhZ2VsaW5rX19fMllZRy0ge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbiAgdmVydGljYWwtYWxpZ246IHRvcDsgfVxcblxcbi5QYWdlTGlua19fcGFnZWxpbmtfX18yWVlHLTpudGgtY2hpbGQobisyKSB7XFxuICBtYXJnaW4tbGVmdDogNXB4OyB9XFxuXFxuLlBhZ2VMaW5rX19wYWdlbGlua19fXzJZWUctIHNwYW4ge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgbWluLXdpZHRoOiAxNnB4O1xcbiAgcGFkZGluZzogM3B4IDVweDtcXG4gIGxpbmUtaGVpZ2h0OiAyMHB4O1xcbiAgYmFja2dyb3VuZDogI2Y3ZjdmNztcXG4gIGNvbG9yOiAjNjY2O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgYm94LXNpemluZzogY29udGVudC1ib3g7IH1cXG5cXG4uUGFnZUxpbmtfX3BhZ2VsaW5rX19fMllZRy0gLlBhZ2VMaW5rX19jb21tb25fX18yYWdYTSB7XFxuICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMik7XFxuICBib3JkZXItcmFkaXVzOiA0cHg7XFxuICBib3JkZXItYm90dG9tLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMyk7XFxuICB0ZXh0LXNoYWRvdzogMCAxcHggMCAjZmZmO1xcbiAgYmFja2dyb3VuZC1vcmlnaW46IGJvcmRlci1ib3g7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudCh0b3AsICNmZmYsICNlZWUpO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgI2ZmZiwgI2VlZSk7XFxuICBjdXJzb3I6IHBvaW50ZXI7IH1cXG5cXG4uUGFnZUxpbmtfX3BhZ2VsaW5rX19fMllZRy0gLlBhZ2VMaW5rX19jb21tb25fX18yYWdYTTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmFmYWZhO1xcbiAgY29sb3I6ICM2NjY7XFxuICBvdXRsaW5lOiAwO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogbm9uZTsgfVxcblxcbi5QYWdlTGlua19fcGFnZWxpbmtfX18yWVlHLSAuUGFnZUxpbmtfX2FjdGl2ZV9fX2pfNGhOIHtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4yKTtcXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcXG4gIGJvcmRlci1ib3R0b20tY29sb3I6IHJnYmEoMCwgMCwgMCwgMC40KTtcXG4gIGJhY2tncm91bmQ6ICMwMDlkZDg7XFxuICBjb2xvcjogI2ZmZjtcXG4gIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xcbiAgYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG9wLCAjMDBiNGY1LCAjMDA4ZGM1KTtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sICMwMGI0ZjUsICMwMDhkYzUpO1xcbiAgdGV4dC1zaGFkb3c6IDAgLTFweCAwIHJnYmEoMCwgMCwgMCwgMC4yKTsgfVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcbmV4cG9ydHMubG9jYWxzID0ge1xuXHRcInBhZ2VsaW5rXCI6IFwiUGFnZUxpbmtfX3BhZ2VsaW5rX19fMllZRy1cIixcblx0XCJjb21tb25cIjogXCJQYWdlTGlua19fY29tbW9uX19fMmFnWE1cIixcblx0XCJhY3RpdmVcIjogXCJQYWdlTGlua19fYWN0aXZlX19fal80aE5cIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyP21vZHVsZXMmaW1wb3J0TG9hZGVycz0xJmxvY2FsSWRlbnROYW1lPVtuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSEuL34vcG9zdGNzcy1sb2FkZXIhLi9+L3Nhc3MtbG9hZGVyIS4vc3JjL2NvbXBvbmVudHMvcGFnaW5hdGlvbi9jb21wb25lbnRzL1BhZ2VMaW5rLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSAzOTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjAgMzBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9