webpackJsonp([19],{

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

/***/ 371:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Gallery = __webpack_require__(372);
	
	var _Gallery2 = _interopRequireDefault(_Gallery);
	
	var _images = __webpack_require__(374);
	
	var _images2 = _interopRequireDefault(_images);
	
	var _classnames = __webpack_require__(254);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	//加载图片
	_images2.default.forEach(function (value, k) {
	    value.imageUrl = __webpack_require__(375)("./" + value.fileName);
	    value.id = k;
	});
	
	var ImgFigure = function (_React$Component) {
	    _inherits(ImgFigure, _React$Component);
	
	    function ImgFigure(props) {
	        _classCallCheck(this, ImgFigure);
	
	        return _possibleConstructorReturn(this, Object.getPrototypeOf(ImgFigure).call(this, props));
	    }
	
	    _createClass(ImgFigure, [{
	        key: 'render',
	        value: function render() {
	            var _props = this.props;
	            var imageUrl = _props.imageUrl;
	            var title = _props.title;
	            var style = _props.style;
	            var className = _props.className;
	            var desc = _props.desc;
	            var id = _props.id;
	            var _onClick = _props.onClick;
	            var inverse = _props.inverse;
	
	            return _react2.default.createElement(
	                'figure',
	                { className: (0, _classnames2.default)(_Gallery2.default['img-figure'], className),
	                    style: style,
	                    onClick: function onClick(e) {
	                        _onClick(e, id);
	                    } },
	                _react2.default.createElement('img', { src: imageUrl, alt: title, className: (0, _classnames2.default)(_Gallery2.default.img, _defineProperty({}, _Gallery2.default.hide, inverse)) }),
	                _react2.default.createElement(
	                    'figcaption',
	                    { className: (0, _classnames2.default)(_Gallery2.default.title, _defineProperty({}, _Gallery2.default.hide, inverse)) },
	                    title
	                ),
	                _react2.default.createElement(
	                    'div',
	                    { className: (0, _classnames2.default)(_Gallery2.default['img-back'], _defineProperty({}, _Gallery2.default.hide, !inverse)) },
	                    desc
	                )
	            );
	        }
	    }]);
	
	    return ImgFigure;
	}(_react2.default.Component);
	
	ImgFigure.propTypes = {
	    id: _react.PropTypes.number.isRequired,
	    imageUrl: _react.PropTypes.string.isRequired,
	    title: _react.PropTypes.string.isRequired,
	    desc: _react.PropTypes.string,
	    onClick: _react.PropTypes.func.isRequired,
	    inverse: _react.PropTypes.bool
	};
	
	//Gallery Component
	
	var Gallery = function (_React$Component2) {
	    _inherits(Gallery, _React$Component2);
	
	    function Gallery(props) {
	        _classCallCheck(this, Gallery);
	
	        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Gallery).call(this, props));
	
	        _this2.Constant = {
	            imgFigure: {
	                width: 260,
	                height: 300
	            }
	        };
	
	        _this2.handleClick = function (e, id) {
	            e.preventDefault();
	            e.stopPropagation();
	            var cursor = _this2.state.cursor;
	            if (cursor == id) {
	                _this2.setState({
	                    inverse: !_this2.state.inverse
	                });
	            } else {
	                _this2.setState({
	                    cursor: id,
	                    inverse: false
	                });
	            }
	        };
	
	        _this2.renderCenterImage = function (centerImage, inverse) {
	            var style = {
	                left: '50%',
	                top: '50%',
	                transform: 'translate(-50%,-50%)',
	                zIndex: 2
	            };
	            return _react2.default.createElement(ImgFigure, _extends({}, centerImage, {
	                inverse: inverse,
	                style: style,
	                onClick: _this2.handleClick }));
	        };
	
	        _this2.renderLeftImages = function (leftImages) {
	            return leftImages.map(function (image, k) {
	                var style = {
	                    left: _this2.getRandomNum(0, 100) + '%',
	                    top: _this2.getRandomNum(0, 100) + '%',
	                    transform: 'translate(0,-50%) rotate(' + _this2.getRandomNum(-30, 30) + 'deg)'
	                };
	                return _react2.default.createElement(ImgFigure, _extends({ key: k
	                }, image, {
	                    style: style,
	                    onClick: _this2.handleClick,
	                    className: _Gallery2.default.left }));
	            });
	        };
	
	        _this2.renderRightImages = function (rightImages) {
	            return rightImages.map(function (image, k) {
	                var style = {
	                    left: _this2.getRandomNum(0, 100) + '%',
	                    top: _this2.getRandomNum(0, 100) + '%',
	                    transform: 'translate(-100%,-50%) rotate(' + _this2.getRandomNum(-30, 30) + 'deg)'
	                };
	                return _react2.default.createElement(ImgFigure, _extends({ key: k
	                }, image, {
	                    style: style,
	                    onClick: _this2.handleClick,
	                    className: _Gallery2.default.right }));
	            });
	        };
	
	        _this2.state = {
	            cursor: 0,
	            inverse: false
	        };
	        return _this2;
	    }
	
	    _createClass(Gallery, [{
	        key: 'render',
	        value: function render() {
	            var _state = this.state;
	            var cursor = _state.cursor;
	            var inverse = _state.inverse;
	
	            var _getImageGroups = this.getImageGroups(_images2.default, cursor);
	
	            var leftImages = _getImageGroups.leftImages;
	            var centerImage = _getImageGroups.centerImage;
	            var rightImages = _getImageGroups.rightImages;
	
	            return _react2.default.createElement(
	                'section',
	                { className: _Gallery2.default.gallery, ref: 'stage' },
	                _react2.default.createElement(
	                    'section',
	                    { className: _Gallery2.default.imgs },
	                    _react2.default.createElement(
	                        'div',
	                        { className: _Gallery2.default.left },
	                        _react2.default.createElement(
	                            'div',
	                            { style: { position: 'absolute', bottom: '150px', top: '0px', width: '100%' } },
	                            this.renderLeftImages(leftImages)
	                        )
	                    ),
	                    _react2.default.createElement(
	                        'div',
	                        { className: _Gallery2.default.center },
	                        this.renderCenterImage(centerImage, inverse)
	                    ),
	                    _react2.default.createElement(
	                        'div',
	                        { className: _Gallery2.default.right },
	                        _react2.default.createElement(
	                            'div',
	                            { style: { position: 'absolute', bottom: '150px', top: '0px', width: '100%' } },
	                            this.renderRightImages(rightImages)
	                        )
	                    )
	                ),
	                _react2.default.createElement(
	                    'nav',
	                    { className: _Gallery2.default.nav },
	                    'nav'
	                )
	            );
	        }
	    }, {
	        key: 'getImageGroups',
	        value: function getImageGroups(imagesMeta, cursor) {
	            var leftImages = [],
	                centerImage = void 0,
	                rightImages = [];
	            centerImage = imagesMeta[cursor];
	            var len = imagesMeta.length;
	            var middle = Math.ceil(len / 2);
	            for (var i = 0; i < middle; i++) {
	                if (i !== cursor) {
	                    leftImages.push(imagesMeta[i]);
	                }
	            }
	            for (var j = middle; j < len; j++) {
	                if (j !== cursor) {
	                    rightImages.push(imagesMeta[j]);
	                }
	            }
	            return { leftImages: leftImages, centerImage: centerImage, rightImages: rightImages };
	        }
	    }, {
	        key: 'getRandomNum',
	        value: function getRandomNum() {
	            var begin = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	            var end = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
	            return Math.random() * (end - begin) + begin;
	        }
	    }]);
	
	    return Gallery;
	}(_react2.default.Component);
	
	module.exports = Gallery;

/***/ },

/***/ 372:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(373);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../node_modules/postcss-loader/index.js!./../../../../../../node_modules/sass-loader/index.js!./Gallery.scss", function() {
				var newContent = require("!!./../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../node_modules/postcss-loader/index.js!./../../../../../../node_modules/sass-loader/index.js!./Gallery.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 373:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".Gallery__gallery___1PoTF {\n  height: 100%;\n  width: 100%;\n  position: relative;\n  background-color: #ddd;\n  overflow: hidden; }\n\n.Gallery__imgs___mngE9 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-perspective: 1800px;\n          perspective: 1800px; }\n\n.Gallery__left___21RRa {\n  height: 100%;\n  position: relative;\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  margin-bottom: 150px; }\n\n.Gallery__center___2QK1z {\n  position: relative;\n  height: 100%;\n  width: 780px; }\n\n.Gallery__right___3eWcx {\n  position: relative;\n  height: 100%;\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  margin-bottom: 150px; }\n\n.Gallery__img-figure___1YtAI {\n  position: absolute;\n  width: 320px;\n  height: 360px;\n  padding-top: 40px;\n  background-color: #fff;\n  cursor: pointer;\n  color: #ddd;\n  -webkit-transition: all 0.6s ease-in-out;\n  transition: all 0.6s ease-in-out;\n  -webkit-transform-origin: 0 50% 0;\n          transform-origin: 0 50% 0; }\n\n.Gallery__img-figure___1YtAI.Gallery__left___21RRa {\n  -webkit-transform: translate(0, -50%);\n          transform: translate(0, -50%); }\n\n.Gallery__img-figure___1YtAI.Gallery__right___3eWcx {\n  -webkit-transform: translate(-100%, -50%);\n          transform: translate(-100%, -50%); }\n\n.Gallery__title___1MveP {\n  text-align: center;\n  margin-top: 25px; }\n\n.Gallery__img___1yrL6 {\n  margin: auto;\n  display: block; }\n\n.Gallery__img-back___TRbxI {\n  width: 240px;\n  height: 240px;\n  display: block;\n  margin: auto;\n  font-size: 1.2em; }\n\n.Gallery__hide___yOcLd {\n  display: none; }\n", ""]);
	
	// exports
	exports.locals = {
		"gallery": "Gallery__gallery___1PoTF",
		"imgs": "Gallery__imgs___mngE9",
		"left": "Gallery__left___21RRa",
		"center": "Gallery__center___2QK1z",
		"right": "Gallery__right___3eWcx",
		"img-figure": "Gallery__img-figure___1YtAI",
		"title": "Gallery__title___1MveP",
		"img": "Gallery__img___1yrL6",
		"img-back": "Gallery__img-back___TRbxI",
		"hide": "Gallery__hide___yOcLd"
	};

/***/ },

/***/ 374:
/***/ function(module, exports) {

	module.exports = [
		{
			"fileName": "1.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer."
		},
		{
			"fileName": "2.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer."
		},
		{
			"fileName": "3.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer."
		},
		{
			"fileName": "4.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer. "
		},
		{
			"fileName": "5.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer. "
		},
		{
			"fileName": "6.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer. "
		},
		{
			"fileName": "7.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer. "
		},
		{
			"fileName": "8.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer. "
		},
		{
			"fileName": "9.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer. "
		},
		{
			"fileName": "10.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer. "
		},
		{
			"fileName": "11.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer. "
		},
		{
			"fileName": "12.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer.  "
		},
		{
			"fileName": "13.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer.  "
		},
		{
			"fileName": "14.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer.  "
		},
		{
			"fileName": "15.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer.  "
		},
		{
			"fileName": "16.jpg",
			"title": "Heaven of time",
			"desc": "Here he comes Here comes Speed Racer.  "
		}
	];

/***/ },

/***/ 375:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./1.jpg": 376,
		"./10.jpg": 377,
		"./11.jpg": 378,
		"./12.jpg": 379,
		"./13.jpg": 380,
		"./14.jpg": 381,
		"./15.jpg": 382,
		"./16.jpg": 383,
		"./2.jpg": 384,
		"./3.jpg": 385,
		"./4.jpg": 386,
		"./5.jpg": 387,
		"./6.jpg": 388,
		"./7.jpg": 389,
		"./8.jpg": 390,
		"./9.jpg": 391,
		"./images.json": 374
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 375;


/***/ },

/***/ 376:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "bd63d00550899d17d96eab0e523e191a.jpg";

/***/ },

/***/ 377:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "d751435c79f8947a09d2247b694c9f38.jpg";

/***/ },

/***/ 378:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "751053009988ada921063b9c976a0231.jpg";

/***/ },

/***/ 379:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "851d60748c878027e7a52c42c441b138.jpg";

/***/ },

/***/ 380:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "4f0b2bbd13d80bb56db798dffb9bf438.jpg";

/***/ },

/***/ 381:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "707f3ac5e9fc103169b34fe0b01f59d3.jpg";

/***/ },

/***/ 382:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "a3b5eb2fd4be679210afd738fcf8edb8.jpg";

/***/ },

/***/ 383:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "ffa5badd054f465bf879543954816c29.jpg";

/***/ },

/***/ 384:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "6fd1361a03f7cf3438b3aab6bc409c7e.jpg";

/***/ },

/***/ 385:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c88397eabc61b0cd856c63dba9af15f6.jpg";

/***/ },

/***/ 386:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "ace3d5b785f01689d46740d26b55d68a.jpg";

/***/ },

/***/ 387:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "cdb0062838530082085a0dd3e2f0b1d1.jpg";

/***/ },

/***/ 388:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "1555904a3ed0f25d93fafb91d409d99e.jpg";

/***/ },

/***/ 389:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "ed3b6061163c390a6c6a9aea559e6d06.jpg";

/***/ },

/***/ 390:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "be1a90b6fc3184f6a923cb3720b92ec4.jpg";

/***/ },

/***/ 391:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "120c52ed00e61c10a538b35b498020e4.jpg";

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzP2RhMDQqKioqKioqKioqIiwid2VicGFjazovLy8uL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qcz9iOTgwKioqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9+L2NsYXNzbmFtZXMvaW5kZXguanM/OGU0MyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L0dhbGxlcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvZ2FsbGVyeS9HYWxsZXJ5LnNjc3M/NDk0MCIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L0dhbGxlcnkuc2NzcyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L2ltYWdlcy9pbWFnZXMuanNvbiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L2ltYWdlcyBeXFwuXFwvLiokIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzLzEuanBnIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzLzEwLmpwZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L2ltYWdlcy8xMS5qcGciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvZ2FsbGVyeS9pbWFnZXMvMTIuanBnIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzLzEzLmpwZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L2ltYWdlcy8xNC5qcGciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvZ2FsbGVyeS9pbWFnZXMvMTUuanBnIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzLzE2LmpwZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L2ltYWdlcy8yLmpwZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L2ltYWdlcy8zLmpwZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L2ltYWdlcy80LmpwZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L2ltYWdlcy81LmpwZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L2ltYWdlcy82LmpwZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L2ltYWdlcy83LmpwZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L2ltYWdlcy84LmpwZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L2ltYWdlcy85LmpwZyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBLHlDQUF3QyxnQkFBZ0I7QUFDeEQsS0FBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7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Q0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEc7Ozs7Ozs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFpQyx1REFBdUQ7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDOUJBLGlGOzs7Ozs7O0FDQUEsaUY7Ozs7Ozs7QUNBQSxpRjs7Ozs7OztBQ0FBLGlGOzs7Ozs7O0FDQUEsaUY7Ozs7Ozs7QUNBQSxpRjs7Ozs7OztBQ0FBLGlGOzs7Ozs7O0FDQUEsaUY7Ozs7Ozs7QUNBQSxpRjs7Ozs7OztBQ0FBLGlGOzs7Ozs7O0FDQUEsaUY7Ozs7Ozs7QUNBQSxpRjs7Ozs7OztBQ0FBLGlGOzs7Ozs7O0FDQUEsaUY7Ozs7Ozs7QUNBQSxpRjs7Ozs7OztBQ0FBLGlGIiwiZmlsZSI6ImpzLzE5LTBjMTc3MDQwYzQ1ZDI1YjkxN2IzLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgbGlzdCA9IFtdO1xyXG5cclxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXHJcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzW2ldO1xyXG5cdFx0XHRpZihpdGVtWzJdKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBpdGVtWzFdICsgXCJ9XCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKGl0ZW1bMV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0LmpvaW4oXCJcIik7XHJcblx0fTtcclxuXHJcblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcclxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XHJcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcclxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xyXG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XHJcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcclxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcclxuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxyXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xyXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxyXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxyXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xyXG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xyXG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblx0cmV0dXJuIGxpc3Q7XHJcbn07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4gKiogbW9kdWxlIGlkID0gMjUyXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSA2IDcgOCA5IDE4IDE5IDIwIDIzIDI0IDI1IDI2IDI3IDI4IDI5IDMwIDMxIDMyXG4gKiovIiwiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxudmFyIHN0eWxlc0luRG9tID0ge30sXHJcblx0bWVtb2l6ZSA9IGZ1bmN0aW9uKGZuKSB7XHJcblx0XHR2YXIgbWVtbztcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRcdHJldHVybiBtZW1vO1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cdGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIC9tc2llIFs2LTldXFxiLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpO1xyXG5cdH0pLFxyXG5cdGdldEhlYWRFbGVtZW50ID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcblx0fSksXHJcblx0c2luZ2xldG9uRWxlbWVudCA9IG51bGwsXHJcblx0c2luZ2xldG9uQ291bnRlciA9IDAsXHJcblx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AgPSBbXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xyXG5cdGlmKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xyXG5cdFx0aWYodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XHJcblx0fVxyXG5cclxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cclxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XHJcblxyXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiA8aGVhZD4uXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcclxuXHJcblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0KTtcclxuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcclxuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XHJcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xyXG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XHJcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcclxuXHRcdH1cclxuXHRcdGlmKG5ld0xpc3QpIHtcclxuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0KTtcclxuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcclxuXHRcdH1cclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xyXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XHJcblx0XHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKVxyXG5cdFx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oKTtcclxuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKSB7XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XHJcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcclxuXHRcdGlmKGRvbVN0eWxlKSB7XHJcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHBhcnRzID0gW107XHJcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMobGlzdCkge1xyXG5cdHZhciBzdHlsZXMgPSBbXTtcclxuXHR2YXIgbmV3U3R5bGVzID0ge307XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcclxuXHRcdHZhciBpZCA9IGl0ZW1bMF07XHJcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcclxuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XHJcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcclxuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcclxuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKVxyXG5cdFx0XHRzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XHJcblx0fVxyXG5cdHJldHVybiBzdHlsZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpIHtcclxuXHR2YXIgaGVhZCA9IGdldEhlYWRFbGVtZW50KCk7XHJcblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Bbc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XHJcblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcclxuXHRcdGlmKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xyXG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGhlYWQuZmlyc3RDaGlsZCk7XHJcblx0XHR9IGVsc2UgaWYobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcclxuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0XHR9XHJcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlRWxlbWVudCk7XHJcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XHJcblx0XHRoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnLiBNdXN0IGJlICd0b3AnIG9yICdib3R0b20nLlwiKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcclxuXHRzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdHZhciBpZHggPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlRWxlbWVudCk7XHJcblx0aWYoaWR4ID49IDApIHtcclxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcclxuXHR2YXIgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xyXG5cdHN0eWxlRWxlbWVudC50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xyXG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpO1xyXG5cdHJldHVybiBzdHlsZUVsZW1lbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpIHtcclxuXHR2YXIgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcclxuXHRsaW5rRWxlbWVudC5yZWwgPSBcInN0eWxlc2hlZXRcIjtcclxuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGlua0VsZW1lbnQpO1xyXG5cdHJldHVybiBsaW5rRWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU3R5bGUob2JqLCBvcHRpb25zKSB7XHJcblx0dmFyIHN0eWxlRWxlbWVudCwgdXBkYXRlLCByZW1vdmU7XHJcblxyXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xyXG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBzaW5nbGV0b25FbGVtZW50IHx8IChzaW5nbGV0b25FbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcclxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIGZhbHNlKTtcclxuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIHRydWUpO1xyXG5cdH0gZWxzZSBpZihvYmouc291cmNlTWFwICYmXHJcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xyXG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XHJcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XHJcblx0XHRcdGlmKHN0eWxlRWxlbWVudC5ocmVmKVxyXG5cdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGVFbGVtZW50LmhyZWYpO1xyXG5cdFx0fTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xyXG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XHJcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKG9iaik7XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZShuZXdPYmopIHtcclxuXHRcdGlmKG5ld09iaikge1xyXG5cdFx0XHRpZihuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXApXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cdH07XHJcbn1cclxuXHJcbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xyXG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xyXG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XHJcblx0fTtcclxufSkoKTtcclxuXHJcbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcoc3R5bGVFbGVtZW50LCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcclxuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XHJcblxyXG5cdGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XHJcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlRWxlbWVudC5jaGlsZE5vZGVzO1xyXG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xyXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGNzc05vZGUpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZUVsZW1lbnQsIG9iaikge1xyXG5cdHZhciBjc3MgPSBvYmouY3NzO1xyXG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcclxuXHJcblx0aWYobWVkaWEpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcclxuXHR9XHJcblxyXG5cdGlmKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR3aGlsZShzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xyXG5cdFx0fVxyXG5cdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlTGluayhsaW5rRWxlbWVudCwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IG9iai5jc3M7XHJcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XHJcblxyXG5cdGlmKHNvdXJjZU1hcCkge1xyXG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcclxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcclxuXHR9XHJcblxyXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xyXG5cclxuXHR2YXIgb2xkU3JjID0gbGlua0VsZW1lbnQuaHJlZjtcclxuXHJcblx0bGlua0VsZW1lbnQuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XHJcblxyXG5cdGlmKG9sZFNyYylcclxuXHRcdFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcclxufVxyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXG4gKiogbW9kdWxlIGlkID0gMjUzXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSA2IDcgOCA5IDE4IDE5IDIwIDIzIDI0IDI1IDI2IDI3IDI4IDI5IDMwIDMxIDMyXG4gKiovIiwiLyohXG4gIENvcHlyaWdodCAoYykgMjAxNiBKZWQgV2F0c29uLlxuICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKE1JVCksIHNlZVxuICBodHRwOi8vamVkd2F0c29uLmdpdGh1Yi5pby9jbGFzc25hbWVzXG4qL1xuLyogZ2xvYmFsIGRlZmluZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGhhc093biA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5cdGZ1bmN0aW9uIGNsYXNzTmFtZXMgKCkge1xuXHRcdHZhciBjbGFzc2VzID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmICghYXJnKSBjb250aW51ZTtcblxuXHRcdFx0dmFyIGFyZ1R5cGUgPSB0eXBlb2YgYXJnO1xuXG5cdFx0XHRpZiAoYXJnVHlwZSA9PT0gJ3N0cmluZycgfHwgYXJnVHlwZSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGFyZyk7XG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0XHRjbGFzc2VzLnB1c2goY2xhc3NOYW1lcy5hcHBseShudWxsLCBhcmcpKTtcblx0XHRcdH0gZWxzZSBpZiAoYXJnVHlwZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdGlmIChoYXNPd24uY2FsbChhcmcsIGtleSkgJiYgYXJnW2tleV0pIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMucHVzaChrZXkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gY2xhc3NOYW1lcztcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0Ly8gcmVnaXN0ZXIgYXMgJ2NsYXNzbmFtZXMnLCBjb25zaXN0ZW50IHdpdGggbnBtIHBhY2thZ2UgbmFtZVxuXHRcdGRlZmluZSgnY2xhc3NuYW1lcycsIFtdLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gY2xhc3NOYW1lcztcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHR3aW5kb3cuY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXM7XG5cdH1cbn0oKSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jbGFzc25hbWVzL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMjU0XG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMTkgMjQgMjYgMzJcbiAqKi8iLCJpbXBvcnQgUmVhY3Qse1Byb3BUeXBlc30gZnJvbSAncmVhY3QnXG5cbmltcG9ydCBzdHlsZXMgZnJvbSAnLi9HYWxsZXJ5LnNjc3MnXG5cbmltcG9ydCBpbWFnZU1ldGFBcnJheSBmcm9tICcuL2ltYWdlcy9pbWFnZXMuanNvbidcblxuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnXG5cbi8v5Yqg6L295Zu+54mHXG5pbWFnZU1ldGFBcnJheS5mb3JFYWNoKCh2YWx1ZSxrKT0+e1xuICAgIHZhbHVlLmltYWdlVXJsPXJlcXVpcmUoYC4vaW1hZ2VzLyR7dmFsdWUuZmlsZU5hbWV9YClcbiAgICB2YWx1ZS5pZD1rXG59KVxuXG5jbGFzcyBJbWdGaWd1cmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKVxuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHtpbWFnZVVybCx0aXRsZSxzdHlsZSxjbGFzc05hbWUsZGVzYyxpZCxvbkNsaWNrLGludmVyc2V9ID0gdGhpcy5wcm9wc1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGZpZ3VyZSBjbGFzc05hbWU9e2N4KHN0eWxlc1snaW1nLWZpZ3VyZSddLGNsYXNzTmFtZSl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKT0+e29uQ2xpY2soZSxpZCl9fT5cbiAgICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2VVcmx9IGFsdD17dGl0bGV9IGNsYXNzTmFtZT17Y3goc3R5bGVzLmltZyx7W3N0eWxlcy5oaWRlXTppbnZlcnNlfSl9Lz5cbiAgICAgICAgICAgICAgICA8ZmlnY2FwdGlvbiBjbGFzc05hbWU9e2N4KHN0eWxlcy50aXRsZSx7W3N0eWxlcy5oaWRlXTppbnZlcnNlfSl9PlxuICAgICAgICAgICAgICAgICAgICB7dGl0bGV9XG4gICAgICAgICAgICAgICAgPC9maWdjYXB0aW9uPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjeChzdHlsZXNbJ2ltZy1iYWNrJ10se1tzdHlsZXMuaGlkZV06IWludmVyc2V9KX0+XG4gICAgICAgICAgICAgICAgICAgIHtkZXNjfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9maWd1cmU+XG4gICAgICAgIClcbiAgICB9XG59XG5JbWdGaWd1cmUucHJvcFR5cGVzPXtcbiAgICBpZDpQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgaW1hZ2VVcmw6UHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHRpdGxlOlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBkZXNjOlByb3BUeXBlcy5zdHJpbmcsXG4gICAgb25DbGljazpQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGludmVyc2U6UHJvcFR5cGVzLmJvb2xcbn1cblxuLy9HYWxsZXJ5IENvbXBvbmVudFxuY2xhc3MgR2FsbGVyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpXG4gICAgICAgIHRoaXMuc3RhdGU9e1xuICAgICAgICAgICAgY3Vyc29yOjAsXG4gICAgICAgICAgICBpbnZlcnNlOmZhbHNlXG4gICAgICAgIH1cbiAgICB9XG4gICAgQ29uc3RhbnQgPSB7XG4gICAgICAgIGltZ0ZpZ3VyZTp7XG4gICAgICAgICAgICB3aWR0aDoyNjAsXG4gICAgICAgICAgICBoZWlnaHQ6MzAwXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7Y3Vyc29yLGludmVyc2V9ID0gdGhpcy5zdGF0ZVxuICAgICAgICBjb25zdCB7bGVmdEltYWdlcyxjZW50ZXJJbWFnZSxyaWdodEltYWdlc30gPVxuICAgICAgICB0aGlzLmdldEltYWdlR3JvdXBzKGltYWdlTWV0YUFycmF5LGN1cnNvcilcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT17c3R5bGVzLmdhbGxlcnl9IHJlZj1cInN0YWdlXCI+XG4gICAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPXtzdHlsZXMuaW1nc30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMubGVmdH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246J2Fic29sdXRlJyxib3R0b206JzE1MHB4Jyx0b3A6JzBweCcsd2lkdGg6JzEwMCUnfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyTGVmdEltYWdlcyhsZWZ0SW1hZ2VzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy5jZW50ZXJ9PlxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyQ2VudGVySW1hZ2UoY2VudGVySW1hZ2UsaW52ZXJzZSl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLnJpZ2h0fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjonYWJzb2x1dGUnLGJvdHRvbTonMTUwcHgnLHRvcDonMHB4Jyx3aWR0aDonMTAwJSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJSaWdodEltYWdlcyhyaWdodEltYWdlcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPXtzdHlsZXMubmF2fT5cbiAgICAgICAgICAgICAgICAgICAgbmF2XG4gICAgICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIClcbiAgICB9XG4gICAgaGFuZGxlQ2xpY2s9KGUsaWQpPT57XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIGNvbnN0IGN1cnNvciA9IHRoaXMuc3RhdGUuY3Vyc29yXG4gICAgICAgIGlmIChjdXJzb3IgPT0gaWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGludmVyc2U6IXRoaXMuc3RhdGUuaW52ZXJzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGN1cnNvcjogaWQsXG4gICAgICAgICAgICAgICAgaW52ZXJzZTogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyQ2VudGVySW1hZ2U9KGNlbnRlckltYWdlLGludmVyc2UpPT57XG4gICAgICAgIGNvbnN0IHN0eWxlPXtcbiAgICAgICAgICAgIGxlZnQ6JzUwJScsXG4gICAgICAgICAgICB0b3A6JzUwJScsXG4gICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTUwJSwtNTAlKScsXG4gICAgICAgICAgICB6SW5kZXg6MlxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8SW1nRmlndXJlIHsuLi5jZW50ZXJJbWFnZX1cbiAgICAgICAgICAgICAgICBpbnZlcnNlPXtpbnZlcnNlfVxuICAgICAgICAgICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfS8+XG4gICAgICAgIClcbiAgICB9XG4gICAgcmVuZGVyTGVmdEltYWdlcz0obGVmdEltYWdlcyk9PntcbiAgICAgICAgcmV0dXJuIGxlZnRJbWFnZXMubWFwKChpbWFnZSxrKT0+e1xuICAgICAgICAgICAgY29uc3Qgc3R5bGU9e1xuICAgICAgICAgICAgICAgIGxlZnQ6YCR7dGhpcy5nZXRSYW5kb21OdW0oMCwxMDApfSVgLFxuICAgICAgICAgICAgICAgIHRvcDpgJHt0aGlzLmdldFJhbmRvbU51bSgwLDEwMCl9JWAsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOmB0cmFuc2xhdGUoMCwtNTAlKSByb3RhdGUoJHt0aGlzLmdldFJhbmRvbU51bSgtMzAsMzApfWRlZylgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxJbWdGaWd1cmUga2V5PXtrfVxuICAgICAgICAgICAgICAgICAgICB7Li4uaW1hZ2V9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja31cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtzdHlsZXMubGVmdH0gLz4pXG4gICAgICAgIH0pXG4gICAgfVxuICAgIHJlbmRlclJpZ2h0SW1hZ2VzPShyaWdodEltYWdlcyk9PntcbiAgICAgICAgcmV0dXJuIHJpZ2h0SW1hZ2VzLm1hcCgoaW1hZ2Usayk9PntcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlPXtcbiAgICAgICAgICAgICAgICBsZWZ0OmAke3RoaXMuZ2V0UmFuZG9tTnVtKDAsMTAwKX0lYCxcbiAgICAgICAgICAgICAgICB0b3A6YCR7dGhpcy5nZXRSYW5kb21OdW0oMCwxMDApfSVgLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTpgdHJhbnNsYXRlKC0xMDAlLC01MCUpIHJvdGF0ZSgke3RoaXMuZ2V0UmFuZG9tTnVtKC0zMCwzMCl9ZGVnKWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPEltZ0ZpZ3VyZSBrZXk9e2t9XG4gICAgICAgICAgICAgICAgICAgIHsuLi5pbWFnZX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e3N0eWxlcy5yaWdodH0vPlxuICAgICAgICAgICAgKVxuICAgICAgICB9KVxuICAgIH1cbiAgICBnZXRJbWFnZUdyb3VwcyhpbWFnZXNNZXRhLGN1cnNvcil7XG4gICAgICAgIGxldCBsZWZ0SW1hZ2VzPVtdLGNlbnRlckltYWdlLHJpZ2h0SW1hZ2VzPVtdXG4gICAgICAgIGNlbnRlckltYWdlID0gaW1hZ2VzTWV0YVtjdXJzb3JdXG4gICAgICAgIGNvbnN0IGxlbiA9IGltYWdlc01ldGEubGVuZ3RoXG4gICAgICAgIGNvbnN0IG1pZGRsZSA9IE1hdGguY2VpbChsZW4gLyAyKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pZGRsZTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSAhPT0gY3Vyc29yKSB7XG4gICAgICAgICAgICAgICAgbGVmdEltYWdlcy5wdXNoKGltYWdlc01ldGFbaV0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaiA9IG1pZGRsZTsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICBpZiAoaiAhPT0gY3Vyc29yKSB7XG4gICAgICAgICAgICAgICAgcmlnaHRJbWFnZXMucHVzaChpbWFnZXNNZXRhW2pdKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7bGVmdEltYWdlcyxjZW50ZXJJbWFnZSxyaWdodEltYWdlc31cbiAgICB9XG4gICAgZ2V0UmFuZG9tTnVtKGJlZ2luPTAsZW5kPTApe1xuICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChlbmQtYmVnaW4pICsgYmVnaW5cbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IEdhbGxlcnlcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvZ2FsbGVyeS9HYWxsZXJ5LmpzXG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vR2FsbGVyeS5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9HYWxsZXJ5LnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vR2FsbGVyeS5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvZ2FsbGVyeS9HYWxsZXJ5LnNjc3NcbiAqKiBtb2R1bGUgaWQgPSAzNzJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTlcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5HYWxsZXJ5X19nYWxsZXJ5X19fMVBvVEYge1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkO1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjsgfVxcblxcbi5HYWxsZXJ5X19pbWdzX19fbW5nRTkge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIC13ZWJraXQtcGVyc3BlY3RpdmU6IDE4MDBweDtcXG4gICAgICAgICAgcGVyc3BlY3RpdmU6IDE4MDBweDsgfVxcblxcbi5HYWxsZXJ5X19sZWZ0X19fMjFSUmEge1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgLXdlYmtpdC1ib3gtZmxleDogMTtcXG4gICAgICAtbXMtZmxleDogMTtcXG4gICAgICAgICAgZmxleDogMTtcXG4gIG1hcmdpbi1ib3R0b206IDE1MHB4OyB9XFxuXFxuLkdhbGxlcnlfX2NlbnRlcl9fXzJRSzF6IHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiA3ODBweDsgfVxcblxcbi5HYWxsZXJ5X19yaWdodF9fXzNlV2N4IHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIC13ZWJraXQtYm94LWZsZXg6IDE7XFxuICAgICAgLW1zLWZsZXg6IDE7XFxuICAgICAgICAgIGZsZXg6IDE7XFxuICBtYXJnaW4tYm90dG9tOiAxNTBweDsgfVxcblxcbi5HYWxsZXJ5X19pbWctZmlndXJlX19fMVl0QUkge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgd2lkdGg6IDMyMHB4O1xcbiAgaGVpZ2h0OiAzNjBweDtcXG4gIHBhZGRpbmctdG9wOiA0MHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGNvbG9yOiAjZGRkO1xcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiBhbGwgMC42cyBlYXNlLWluLW91dDtcXG4gIHRyYW5zaXRpb246IGFsbCAwLjZzIGVhc2UtaW4tb3V0O1xcbiAgLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luOiAwIDUwJSAwO1xcbiAgICAgICAgICB0cmFuc2Zvcm0tb3JpZ2luOiAwIDUwJSAwOyB9XFxuXFxuLkdhbGxlcnlfX2ltZy1maWd1cmVfX18xWXRBSS5HYWxsZXJ5X19sZWZ0X19fMjFSUmEge1xcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAtNTAlKTtcXG4gICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgLTUwJSk7IH1cXG5cXG4uR2FsbGVyeV9faW1nLWZpZ3VyZV9fXzFZdEFJLkdhbGxlcnlfX3JpZ2h0X19fM2VXY3gge1xcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgLTUwJSk7XFxuICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAtNTAlKTsgfVxcblxcbi5HYWxsZXJ5X190aXRsZV9fXzFNdmVQIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1hcmdpbi10b3A6IDI1cHg7IH1cXG5cXG4uR2FsbGVyeV9faW1nX19fMXlyTDYge1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgZGlzcGxheTogYmxvY2s7IH1cXG5cXG4uR2FsbGVyeV9faW1nLWJhY2tfX19UUmJ4SSB7XFxuICB3aWR0aDogMjQwcHg7XFxuICBoZWlnaHQ6IDI0MHB4O1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBtYXJnaW46IGF1dG87XFxuICBmb250LXNpemU6IDEuMmVtOyB9XFxuXFxuLkdhbGxlcnlfX2hpZGVfX195T2NMZCB7XFxuICBkaXNwbGF5OiBub25lOyB9XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuZXhwb3J0cy5sb2NhbHMgPSB7XG5cdFwiZ2FsbGVyeVwiOiBcIkdhbGxlcnlfX2dhbGxlcnlfX18xUG9URlwiLFxuXHRcImltZ3NcIjogXCJHYWxsZXJ5X19pbWdzX19fbW5nRTlcIixcblx0XCJsZWZ0XCI6IFwiR2FsbGVyeV9fbGVmdF9fXzIxUlJhXCIsXG5cdFwiY2VudGVyXCI6IFwiR2FsbGVyeV9fY2VudGVyX19fMlFLMXpcIixcblx0XCJyaWdodFwiOiBcIkdhbGxlcnlfX3JpZ2h0X19fM2VXY3hcIixcblx0XCJpbWctZmlndXJlXCI6IFwiR2FsbGVyeV9faW1nLWZpZ3VyZV9fXzFZdEFJXCIsXG5cdFwidGl0bGVcIjogXCJHYWxsZXJ5X190aXRsZV9fXzFNdmVQXCIsXG5cdFwiaW1nXCI6IFwiR2FsbGVyeV9faW1nX19fMXlyTDZcIixcblx0XCJpbWctYmFja1wiOiBcIkdhbGxlcnlfX2ltZy1iYWNrX19fVFJieElcIixcblx0XCJoaWRlXCI6IFwiR2FsbGVyeV9faGlkZV9fX3lPY0xkXCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlcj9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi9+L3Bvc3Rjc3MtbG9hZGVyIS4vfi9zYXNzLWxvYWRlciEuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvR2FsbGVyeS5zY3NzXG4gKiogbW9kdWxlIGlkID0gMzczXG4gKiogbW9kdWxlIGNodW5rcyA9IDE5XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBbXG5cdHtcblx0XHRcImZpbGVOYW1lXCI6IFwiMS5qcGdcIixcblx0XHRcInRpdGxlXCI6IFwiSGVhdmVuIG9mIHRpbWVcIixcblx0XHRcImRlc2NcIjogXCJIZXJlIGhlIGNvbWVzIEhlcmUgY29tZXMgU3BlZWQgUmFjZXIuXCJcblx0fSxcblx0e1xuXHRcdFwiZmlsZU5hbWVcIjogXCIyLmpwZ1wiLFxuXHRcdFwidGl0bGVcIjogXCJIZWF2ZW4gb2YgdGltZVwiLFxuXHRcdFwiZGVzY1wiOiBcIkhlcmUgaGUgY29tZXMgSGVyZSBjb21lcyBTcGVlZCBSYWNlci5cIlxuXHR9LFxuXHR7XG5cdFx0XCJmaWxlTmFtZVwiOiBcIjMuanBnXCIsXG5cdFx0XCJ0aXRsZVwiOiBcIkhlYXZlbiBvZiB0aW1lXCIsXG5cdFx0XCJkZXNjXCI6IFwiSGVyZSBoZSBjb21lcyBIZXJlIGNvbWVzIFNwZWVkIFJhY2VyLlwiXG5cdH0sXG5cdHtcblx0XHRcImZpbGVOYW1lXCI6IFwiNC5qcGdcIixcblx0XHRcInRpdGxlXCI6IFwiSGVhdmVuIG9mIHRpbWVcIixcblx0XHRcImRlc2NcIjogXCJIZXJlIGhlIGNvbWVzIEhlcmUgY29tZXMgU3BlZWQgUmFjZXIuIFwiXG5cdH0sXG5cdHtcblx0XHRcImZpbGVOYW1lXCI6IFwiNS5qcGdcIixcblx0XHRcInRpdGxlXCI6IFwiSGVhdmVuIG9mIHRpbWVcIixcblx0XHRcImRlc2NcIjogXCJIZXJlIGhlIGNvbWVzIEhlcmUgY29tZXMgU3BlZWQgUmFjZXIuIFwiXG5cdH0sXG5cdHtcblx0XHRcImZpbGVOYW1lXCI6IFwiNi5qcGdcIixcblx0XHRcInRpdGxlXCI6IFwiSGVhdmVuIG9mIHRpbWVcIixcblx0XHRcImRlc2NcIjogXCJIZXJlIGhlIGNvbWVzIEhlcmUgY29tZXMgU3BlZWQgUmFjZXIuIFwiXG5cdH0sXG5cdHtcblx0XHRcImZpbGVOYW1lXCI6IFwiNy5qcGdcIixcblx0XHRcInRpdGxlXCI6IFwiSGVhdmVuIG9mIHRpbWVcIixcblx0XHRcImRlc2NcIjogXCJIZXJlIGhlIGNvbWVzIEhlcmUgY29tZXMgU3BlZWQgUmFjZXIuIFwiXG5cdH0sXG5cdHtcblx0XHRcImZpbGVOYW1lXCI6IFwiOC5qcGdcIixcblx0XHRcInRpdGxlXCI6IFwiSGVhdmVuIG9mIHRpbWVcIixcblx0XHRcImRlc2NcIjogXCJIZXJlIGhlIGNvbWVzIEhlcmUgY29tZXMgU3BlZWQgUmFjZXIuIFwiXG5cdH0sXG5cdHtcblx0XHRcImZpbGVOYW1lXCI6IFwiOS5qcGdcIixcblx0XHRcInRpdGxlXCI6IFwiSGVhdmVuIG9mIHRpbWVcIixcblx0XHRcImRlc2NcIjogXCJIZXJlIGhlIGNvbWVzIEhlcmUgY29tZXMgU3BlZWQgUmFjZXIuIFwiXG5cdH0sXG5cdHtcblx0XHRcImZpbGVOYW1lXCI6IFwiMTAuanBnXCIsXG5cdFx0XCJ0aXRsZVwiOiBcIkhlYXZlbiBvZiB0aW1lXCIsXG5cdFx0XCJkZXNjXCI6IFwiSGVyZSBoZSBjb21lcyBIZXJlIGNvbWVzIFNwZWVkIFJhY2VyLiBcIlxuXHR9LFxuXHR7XG5cdFx0XCJmaWxlTmFtZVwiOiBcIjExLmpwZ1wiLFxuXHRcdFwidGl0bGVcIjogXCJIZWF2ZW4gb2YgdGltZVwiLFxuXHRcdFwiZGVzY1wiOiBcIkhlcmUgaGUgY29tZXMgSGVyZSBjb21lcyBTcGVlZCBSYWNlci4gXCJcblx0fSxcblx0e1xuXHRcdFwiZmlsZU5hbWVcIjogXCIxMi5qcGdcIixcblx0XHRcInRpdGxlXCI6IFwiSGVhdmVuIG9mIHRpbWVcIixcblx0XHRcImRlc2NcIjogXCJIZXJlIGhlIGNvbWVzIEhlcmUgY29tZXMgU3BlZWQgUmFjZXIuICBcIlxuXHR9LFxuXHR7XG5cdFx0XCJmaWxlTmFtZVwiOiBcIjEzLmpwZ1wiLFxuXHRcdFwidGl0bGVcIjogXCJIZWF2ZW4gb2YgdGltZVwiLFxuXHRcdFwiZGVzY1wiOiBcIkhlcmUgaGUgY29tZXMgSGVyZSBjb21lcyBTcGVlZCBSYWNlci4gIFwiXG5cdH0sXG5cdHtcblx0XHRcImZpbGVOYW1lXCI6IFwiMTQuanBnXCIsXG5cdFx0XCJ0aXRsZVwiOiBcIkhlYXZlbiBvZiB0aW1lXCIsXG5cdFx0XCJkZXNjXCI6IFwiSGVyZSBoZSBjb21lcyBIZXJlIGNvbWVzIFNwZWVkIFJhY2VyLiAgXCJcblx0fSxcblx0e1xuXHRcdFwiZmlsZU5hbWVcIjogXCIxNS5qcGdcIixcblx0XHRcInRpdGxlXCI6IFwiSGVhdmVuIG9mIHRpbWVcIixcblx0XHRcImRlc2NcIjogXCJIZXJlIGhlIGNvbWVzIEhlcmUgY29tZXMgU3BlZWQgUmFjZXIuICBcIlxuXHR9LFxuXHR7XG5cdFx0XCJmaWxlTmFtZVwiOiBcIjE2LmpwZ1wiLFxuXHRcdFwidGl0bGVcIjogXCJIZWF2ZW4gb2YgdGltZVwiLFxuXHRcdFwiZGVzY1wiOiBcIkhlcmUgaGUgY29tZXMgSGVyZSBjb21lcyBTcGVlZCBSYWNlci4gIFwiXG5cdH1cbl07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzL2ltYWdlcy5qc29uXG4gKiogbW9kdWxlIGlkID0gMzc0XG4gKiogbW9kdWxlIGNodW5rcyA9IDE5XG4gKiovIiwidmFyIG1hcCA9IHtcblx0XCIuLzEuanBnXCI6IDM3Nixcblx0XCIuLzEwLmpwZ1wiOiAzNzcsXG5cdFwiLi8xMS5qcGdcIjogMzc4LFxuXHRcIi4vMTIuanBnXCI6IDM3OSxcblx0XCIuLzEzLmpwZ1wiOiAzODAsXG5cdFwiLi8xNC5qcGdcIjogMzgxLFxuXHRcIi4vMTUuanBnXCI6IDM4Mixcblx0XCIuLzE2LmpwZ1wiOiAzODMsXG5cdFwiLi8yLmpwZ1wiOiAzODQsXG5cdFwiLi8zLmpwZ1wiOiAzODUsXG5cdFwiLi80LmpwZ1wiOiAzODYsXG5cdFwiLi81LmpwZ1wiOiAzODcsXG5cdFwiLi82LmpwZ1wiOiAzODgsXG5cdFwiLi83LmpwZ1wiOiAzODksXG5cdFwiLi84LmpwZ1wiOiAzOTAsXG5cdFwiLi85LmpwZ1wiOiAzOTEsXG5cdFwiLi9pbWFnZXMuanNvblwiOiAzNzRcbn07XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18od2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkpO1xufTtcbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0cmV0dXJuIG1hcFtyZXFdIHx8IChmdW5jdGlvbigpIHsgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJy5cIikgfSgpKTtcbn07XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gMzc1O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzIF5cXC5cXC8uKiRcbiAqKiBtb2R1bGUgaWQgPSAzNzVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTlcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJiZDYzZDAwNTUwODk5ZDE3ZDk2ZWFiMGU1MjNlMTkxYS5qcGdcIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvZ2FsbGVyeS9pbWFnZXMvMS5qcGdcbiAqKiBtb2R1bGUgaWQgPSAzNzZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTlcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJkNzUxNDM1Yzc5Zjg5NDdhMDlkMjI0N2I2OTRjOWYzOC5qcGdcIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvZ2FsbGVyeS9pbWFnZXMvMTAuanBnXG4gKiogbW9kdWxlIGlkID0gMzc3XG4gKiogbW9kdWxlIGNodW5rcyA9IDE5XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiNzUxMDUzMDA5OTg4YWRhOTIxMDYzYjljOTc2YTAyMzEuanBnXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzLzExLmpwZ1xuICoqIG1vZHVsZSBpZCA9IDM3OFxuICoqIG1vZHVsZSBjaHVua3MgPSAxOVxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjg1MWQ2MDc0OGM4NzgwMjdlN2E1MmM0MmM0NDFiMTM4LmpwZ1wiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L2ltYWdlcy8xMi5qcGdcbiAqKiBtb2R1bGUgaWQgPSAzNzlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTlcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCI0ZjBiMmJiZDEzZDgwYmI1NmRiNzk4ZGZmYjliZjQzOC5qcGdcIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvZ2FsbGVyeS9pbWFnZXMvMTMuanBnXG4gKiogbW9kdWxlIGlkID0gMzgwXG4gKiogbW9kdWxlIGNodW5rcyA9IDE5XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiNzA3ZjNhYzVlOWZjMTAzMTY5YjM0ZmUwYjAxZjU5ZDMuanBnXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzLzE0LmpwZ1xuICoqIG1vZHVsZSBpZCA9IDM4MVxuICoqIG1vZHVsZSBjaHVua3MgPSAxOVxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImEzYjVlYjJmZDRiZTY3OTIxMGFmZDczOGZjZjhlZGI4LmpwZ1wiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9nYWxsZXJ5L2ltYWdlcy8xNS5qcGdcbiAqKiBtb2R1bGUgaWQgPSAzODJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTlcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJmZmE1YmFkZDA1NGY0NjViZjg3OTU0Mzk1NDgxNmMyOS5qcGdcIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvZ2FsbGVyeS9pbWFnZXMvMTYuanBnXG4gKiogbW9kdWxlIGlkID0gMzgzXG4gKiogbW9kdWxlIGNodW5rcyA9IDE5XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiNmZkMTM2MWEwM2Y3Y2YzNDM4YjNhYWI2YmM0MDljN2UuanBnXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzLzIuanBnXG4gKiogbW9kdWxlIGlkID0gMzg0XG4gKiogbW9kdWxlIGNodW5rcyA9IDE5XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiYzg4Mzk3ZWFiYzYxYjBjZDg1NmM2M2RiYTlhZjE1ZjYuanBnXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzLzMuanBnXG4gKiogbW9kdWxlIGlkID0gMzg1XG4gKiogbW9kdWxlIGNodW5rcyA9IDE5XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiYWNlM2Q1Yjc4NWYwMTY4OWQ0Njc0MGQyNmI1NWQ2OGEuanBnXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzLzQuanBnXG4gKiogbW9kdWxlIGlkID0gMzg2XG4gKiogbW9kdWxlIGNodW5rcyA9IDE5XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiY2RiMDA2MjgzODUzMDA4MjA4NWEwZGQzZTJmMGIxZDEuanBnXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzLzUuanBnXG4gKiogbW9kdWxlIGlkID0gMzg3XG4gKiogbW9kdWxlIGNodW5rcyA9IDE5XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiMTU1NTkwNGEzZWQwZjI1ZDkzZmFmYjkxZDQwOWQ5OWUuanBnXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzLzYuanBnXG4gKiogbW9kdWxlIGlkID0gMzg4XG4gKiogbW9kdWxlIGNodW5rcyA9IDE5XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiZWQzYjYwNjExNjNjMzkwYTZjNmE5YWVhNTU5ZTZkMDYuanBnXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzLzcuanBnXG4gKiogbW9kdWxlIGlkID0gMzg5XG4gKiogbW9kdWxlIGNodW5rcyA9IDE5XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiYmUxYTkwYjZmYzMxODRmNmE5MjNjYjM3MjBiOTJlYzQuanBnXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzLzguanBnXG4gKiogbW9kdWxlIGlkID0gMzkwXG4gKiogbW9kdWxlIGNodW5rcyA9IDE5XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiMTIwYzUyZWQwMGU2MWMxMGE1MzhiMzViNDk4MDIwZTQuanBnXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2dhbGxlcnkvaW1hZ2VzLzkuanBnXG4gKiogbW9kdWxlIGlkID0gMzkxXG4gKiogbW9kdWxlIGNodW5rcyA9IDE5XG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==