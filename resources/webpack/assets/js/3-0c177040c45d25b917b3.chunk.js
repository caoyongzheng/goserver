webpackJsonp([3],{

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

/***/ 279:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _Icons = __webpack_require__(280);
	
	var _Icons2 = _interopRequireDefault(_Icons);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Icons = function (_React$Component) {
	    _inherits(Icons, _React$Component);
	
	    function Icons(props) {
	        _classCallCheck(this, Icons);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Icons).call(this, props));
	
	        _this.componentDidMount = function () {
	            var canvas = _reactDom2.default.findDOMNode(_this.refs['canvas']);
	            canvas.width = 1024;
	            canvas.height = 600;
	
	            var context = canvas.getContext('2d');
	            if (!context) {
	                return;
	            }
	            //arrow
	            _this.drarArrow(context, 1, 0, 0, 1, 0, 0);
	
	            //star
	            _this.drawStar(context, 250, 60, 20, 0);
	
	            //RoundRect
	            _this.drawRoundRect(context, 350, 20, 120, 80, 10);
	
	            //Moon
	            _this.drawMoon(context, 500, 70, 40, 20, 0);
	        };
	
	        _this.setPaths = function (context, points) {
	            var len = points.length;
	            context.beginPath();
	            for (var i = 0; i < len; i++) {
	                context.lineTo(points[i].x, points[i].y);
	            }
	            context.closePath();
	        };
	
	        _this.drawStar = function (context, x, y, R, rot) {
	            context.save();
	            context.transform(R, 0, 0, R, x, y);
	            context.rotate(rot / 180 * Math.PI);
	            _this.starPath(context);
	            context.fillStyle = '#fb3';
	            context.strokeStyle = '#fb5';
	            context.fill();
	            context.stroke();
	            context.restore();
	        };
	
	        _this.starPath = function (context) {
	            context.beginPath();
	            for (var i = 0; i < 5; i++) {
	                context.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI), -Math.sin((18 + i * 72) / 180 * Math.PI));
	                context.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * 0.5, -Math.sin((54 + i * 72) / 180 * Math.PI) * 0.5);
	            }
	            context.closePath();
	        };
	
	        return _this;
	    }
	
	    _createClass(Icons, [{
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                'canvas',
	                { ref: 'canvas', className: _Icons2.default.canvas },
	                '该浏览器不支持canvas,请切换浏览器！'
	            );
	        }
	    }, {
	        key: 'drarArrow',
	        value: function drarArrow(context) {
	            context.save();
	
	            for (var _len = arguments.length, transform = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                transform[_key - 1] = arguments[_key];
	            }
	
	            context.transform.apply(context, transform);
	            this.arrowPath(context);
	
	            context.fillStyle = '#008888';
	            context.fill();
	            context.stroke();
	
	            context.restore();
	        }
	    }, {
	        key: 'arrowPath',
	        value: function arrowPath(context) {
	            context.beginPath();
	            context.lineTo(50, 50);
	            context.lineTo(125, 50);
	            context.lineTo(125, 20);
	            context.lineTo(150, 60);
	            context.lineTo(125, 100);
	            context.lineTo(125, 70);
	            context.lineTo(50, 70);
	            context.closePath();
	        }
	    }, {
	        key: 'drawRoundRect',
	        value: function drawRoundRect(context, x, y, width, height, radius) {
	            if (2 * radius > width || 2 * radius > height) {
	                return;
	            }
	            context.save();
	            context.translate(x, y);
	            this.roundRectPath(context, width, height, radius);
	            context.strokeStyle = '#000';
	            context.stroke();
	            context.restore();
	        }
	    }, {
	        key: 'roundRectPath',
	        value: function roundRectPath(context, width, height, radius) {
	            context.beginPath();
	            context.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
	            context.lineTo(radius, height);
	            context.arc(radius, height - radius, radius, 0.5 * Math.PI, Math.PI);
	            context.lineTo(0, height - radius);
	            context.arc(radius, radius, radius, Math.PI, 1.5 * Math.PI);
	            context.lineTo(width - radius, 0);
	            context.arc(width - radius, radius, radius, 1.5 * Math.PI, 2 * Math.PI);
	            context.closePath();
	        }
	    }, {
	        key: 'drawMoon',
	        value: function drawMoon(context, x, y, R, d, rotate, color) {
	            context.save();
	            context.rotate(rotate / 180 * Math.PI);
	            context.translate(x, y);
	            this.moonPath(context, R, d);
	            context.fillStyle = color || 'yellow';
	            context.fill();
	            context.restore();
	        }
	    }, {
	        key: 'moonPath',
	        value: function moonPath(context, R, d) {
	            context.beginPath();
	            context.arc(0, 0, R, Math.PI * 0.5, Math.PI * 1.5, true);
	            context.arc(-d, 0, Math.sqrt(Math.pow(R, 2) + Math.pow(d, 2)), -Math.atan(R / d), Math.atan(R / d));
	            context.closePath();
	        }
	    }]);
	
	    return Icons;
	}(_react2.default.Component);
	
	module.exports = Icons;

/***/ },

/***/ 280:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(281);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./Icons.scss", function() {
				var newContent = require("!!./../../../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../../../node_modules/postcss-loader/index.js!./../../../../../../../../node_modules/sass-loader/index.js!./Icons.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 281:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, "canvas {\n  position: relative;\n  display: block;\n  margin: 50px auto;\n  border: 1px solid #c3c3c3; }\n", ""]);
	
	// exports


/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzP2RhMDQqKiIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanM/Yjk4MCoqIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy8yZC9pY29ucy9JY29ucy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvMmQvaWNvbnMvSWNvbnMuc2Nzcz80OTk3Iiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy8yZC9pY29ucy9JY29ucy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0EseUNBQXdDLGdCQUFnQjtBQUN4RCxLQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQVksb0JBQW9CO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxp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QkE7QUFDQTs7O0FBR0E7QUFDQSxtQ0FBa0MsdUJBQXVCLG1CQUFtQixzQkFBc0IsOEJBQThCLEVBQUU7O0FBRWxJIiwiZmlsZSI6ImpzLzMtMGMxNzcwNDBjNDVkMjViOTE3YjMuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBsaXN0ID0gW107XHJcblxyXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcclxuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXNbaV07XHJcblx0XHRcdGlmKGl0ZW1bMl0pIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGl0ZW1bMV0gKyBcIn1cIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goaXRlbVsxXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQuam9pbihcIlwiKTtcclxuXHR9O1xyXG5cclxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxyXG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcclxuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxyXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XHJcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcclxuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxyXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xyXG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXHJcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXHJcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXHJcblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXHJcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XHJcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRyZXR1cm4gbGlzdDtcclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbiAqKiBtb2R1bGUgaWQgPSAyNTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYgNyA4IDkgMTggMTkgMjAgMjMgMjQgMjUgMjYgMjcgMjggMjkgMzAgMzEgMzJcbiAqKi8iLCIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG52YXIgc3R5bGVzSW5Eb20gPSB7fSxcclxuXHRtZW1vaXplID0gZnVuY3Rpb24oZm4pIHtcclxuXHRcdHZhciBtZW1vO1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHRcdFx0cmV0dXJuIG1lbW87XHJcblx0XHR9O1xyXG5cdH0sXHJcblx0aXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gL21zaWUgWzYtOV1cXGIvLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XHJcblx0fSksXHJcblx0Z2V0SGVhZEVsZW1lbnQgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuXHR9KSxcclxuXHRzaW5nbGV0b25FbGVtZW50ID0gbnVsbCxcclxuXHRzaW5nbGV0b25Db3VudGVyID0gMCxcclxuXHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XHJcblx0aWYodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XHJcblx0XHRpZih0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcclxuXHR9XHJcblxyXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxyXG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2VcclxuXHRpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcclxuXHJcblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIDxoZWFkPi5cclxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xyXG5cclxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QpO1xyXG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xyXG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcclxuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XHJcblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcclxuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xyXG5cdFx0fVxyXG5cdFx0aWYobmV3TGlzdCkge1xyXG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QpO1xyXG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XHJcblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcclxuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspXHJcblx0XHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXSgpO1xyXG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpIHtcclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcclxuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xyXG5cdFx0aWYoZG9tU3R5bGUpIHtcclxuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyhsaXN0KSB7XHJcblx0dmFyIHN0eWxlcyA9IFtdO1xyXG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xyXG5cdFx0dmFyIGlkID0gaXRlbVswXTtcclxuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xyXG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcclxuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xyXG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xyXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pXHJcblx0XHRcdHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XHJcblx0XHRlbHNlXHJcblx0XHRcdG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcclxuXHR9XHJcblx0cmV0dXJuIHN0eWxlcztcclxufVxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCkge1xyXG5cdHZhciBoZWFkID0gZ2V0SGVhZEVsZW1lbnQoKTtcclxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcFtzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcclxuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xyXG5cdFx0aWYoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XHJcblx0XHRcdGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgaGVhZC5maXJzdENoaWxkKTtcclxuXHRcdH0gZWxzZSBpZihsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xyXG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHRcdH1cclxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGVFbGVtZW50KTtcclxuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcclxuXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcuIE11c3QgYmUgJ3RvcCcgb3IgJ2JvdHRvbScuXCIpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xyXG5cdHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0dmFyIGlkeCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGVFbGVtZW50KTtcclxuXHRpZihpZHggPj0gMCkge1xyXG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykge1xyXG5cdHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XHJcblx0c3R5bGVFbGVtZW50LnR5cGUgPSBcInRleHQvY3NzXCI7XHJcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCk7XHJcblx0cmV0dXJuIHN0eWxlRWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucykge1xyXG5cdHZhciBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xyXG5cdGxpbmtFbGVtZW50LnJlbCA9IFwic3R5bGVzaGVldFwiO1xyXG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rRWxlbWVudCk7XHJcblx0cmV0dXJuIGxpbmtFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTdHlsZShvYmosIG9wdGlvbnMpIHtcclxuXHR2YXIgc3R5bGVFbGVtZW50LCB1cGRhdGUsIHJlbW92ZTtcclxuXHJcblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XHJcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcclxuXHRcdHN0eWxlRWxlbWVudCA9IHNpbmdsZXRvbkVsZW1lbnQgfHwgKHNpbmdsZXRvbkVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xyXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgZmFsc2UpO1xyXG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgdHJ1ZSk7XHJcblx0fSBlbHNlIGlmKG9iai5zb3VyY2VNYXAgJiZcclxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XHJcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcclxuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcclxuXHRcdFx0aWYoc3R5bGVFbGVtZW50LmhyZWYpXHJcblx0XHRcdFx0VVJMLnJldm9rZU9iamVjdFVSTChzdHlsZUVsZW1lbnQuaHJlZik7XHJcblx0XHR9O1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XHJcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcclxuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHR1cGRhdGUob2JqKTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xyXG5cdFx0aWYobmV3T2JqKSB7XHJcblx0XHRcdGlmKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcClcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0fTtcclxufVxyXG5cclxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgdGV4dFN0b3JlID0gW107XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XHJcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XHJcblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcclxuXHR9O1xyXG59KSgpO1xyXG5cclxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZUVsZW1lbnQsIGluZGV4LCByZW1vdmUsIG9iaikge1xyXG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcclxuXHJcblx0aWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcclxuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGVFbGVtZW50LmNoaWxkTm9kZXM7XHJcblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50Lmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBhcHBseVRvVGFnKHN0eWxlRWxlbWVudCwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IG9iai5jc3M7XHJcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xyXG5cclxuXHRpZihtZWRpYSkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxyXG5cdH1cclxuXHJcblx0aWYoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XHJcblx0fSBlbHNlIHtcclxuXHRcdHdoaWxlKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XHJcblx0XHR9XHJcblx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVMaW5rKGxpbmtFbGVtZW50LCBvYmopIHtcclxuXHR2YXIgY3NzID0gb2JqLmNzcztcclxuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcclxuXHJcblx0aWYoc291cmNlTWFwKSB7XHJcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxyXG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xyXG5cdH1cclxuXHJcblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XHJcblxyXG5cdHZhciBvbGRTcmMgPSBsaW5rRWxlbWVudC5ocmVmO1xyXG5cclxuXHRsaW5rRWxlbWVudC5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcclxuXHJcblx0aWYob2xkU3JjKVxyXG5cdFx0VVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xyXG59XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcbiAqKiBtb2R1bGUgaWQgPSAyNTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYgNyA4IDkgMTggMTkgMjAgMjMgMjQgMjUgMjYgMjcgMjggMjkgMzAgMzEgMzJcbiAqKi8iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xuXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vSWNvbnMuc2NzcydcblxuY2xhc3MgSWNvbnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKVxuICAgIH1cbiAgICBjb21wb25lbnREaWRNb3VudD0oKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmc1snY2FudmFzJ10pXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IDEwMjRcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IDYwMFxuXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuICAgICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIC8vYXJyb3dcbiAgICAgICAgdGhpcy5kcmFyQXJyb3coY29udGV4dCwxLDAsMCwxLDAsMClcblxuICAgICAgICAvL3N0YXJcbiAgICAgICAgdGhpcy5kcmF3U3Rhcihjb250ZXh0LDI1MCw2MCwyMCwwKVxuXG4gICAgICAgIC8vUm91bmRSZWN0XG4gICAgICAgIHRoaXMuZHJhd1JvdW5kUmVjdChjb250ZXh0LDM1MCwyMCwxMjAsODAsMTApXG5cbiAgICAgICAgLy9Nb29uXG4gICAgICAgIHRoaXMuZHJhd01vb24oY29udGV4dCw1MDAsNzAsNDAsMjAsMClcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIiBjbGFzc05hbWU9e3N0eWxlcy5jYW52YXN9PlxuICAgICAgICAgICAgICAgIOivpea1j+iniOWZqOS4jeaUr+aMgWNhbnZhcyzor7fliIfmjaLmtY/op4jlmajvvIFcbiAgICAgICAgICAgIDwvY2FudmFzPlxuICAgICAgICApXG4gICAgfVxuICAgIHNldFBhdGhzID0gKGNvbnRleHQscG9pbnRzKSA9PiB7XG4gICAgICAgIGNvbnN0IGxlbiA9IHBvaW50cy5sZW5ndGhcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhwb2ludHNbaV0ueCxwb2ludHNbaV0ueSlcbiAgICAgICAgfVxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpXG4gICAgfVxuICAgIGRyYXJBcnJvdyhjb250ZXh0LC4uLnRyYW5zZm9ybSl7XG4gICAgICAgIGNvbnRleHQuc2F2ZSgpXG5cbiAgICAgICAgY29udGV4dC50cmFuc2Zvcm0oLi4udHJhbnNmb3JtKVxuICAgICAgICB0aGlzLmFycm93UGF0aChjb250ZXh0KVxuXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlPScjMDA4ODg4J1xuICAgICAgICBjb250ZXh0LmZpbGwoKVxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpXG5cbiAgICAgICAgY29udGV4dC5yZXN0b3JlKClcbiAgICB9XG4gICAgYXJyb3dQYXRoKGNvbnRleHQpe1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpXG4gICAgICAgIGNvbnRleHQubGluZVRvKDUwLDUwKVxuICAgICAgICBjb250ZXh0LmxpbmVUbygxMjUsNTApXG4gICAgICAgIGNvbnRleHQubGluZVRvKDEyNSwyMClcbiAgICAgICAgY29udGV4dC5saW5lVG8oMTUwLDYwKVxuICAgICAgICBjb250ZXh0LmxpbmVUbygxMjUsMTAwKVxuICAgICAgICBjb250ZXh0LmxpbmVUbygxMjUsNzApXG4gICAgICAgIGNvbnRleHQubGluZVRvKDUwLDcwKVxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpXG4gICAgfVxuICAgIGRyYXdTdGFyPShjb250ZXh0LHgseSxSLHJvdCk9PntcbiAgICAgICAgY29udGV4dC5zYXZlKClcbiAgICAgICAgY29udGV4dC50cmFuc2Zvcm0oUiwwLDAsUix4LHkpXG4gICAgICAgIGNvbnRleHQucm90YXRlKHJvdC8xODAqTWF0aC5QSSlcbiAgICAgICAgdGhpcy5zdGFyUGF0aChjb250ZXh0KVxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjZmIzJ1xuICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJyNmYjUnXG4gICAgICAgIGNvbnRleHQuZmlsbCgpXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKClcbiAgICAgICAgY29udGV4dC5yZXN0b3JlKClcbiAgICB9XG4gICAgc3RhclBhdGg9KGNvbnRleHQpPT57XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKClcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKE1hdGguY29zKCAoMTgraSo3MikvMTgwKk1hdGguUEkgKSxcbiAgICAgICAgICAgICAgICAtTWF0aC5zaW4oICgxOCtpKjcyKS8xODAqTWF0aC5QSSApKVxuICAgICAgICAgICAgY29udGV4dC5saW5lVG8oTWF0aC5jb3MoICg1NCtpKjcyKS8xODAqTWF0aC5QSSApKjAuNSAsXG4gICAgICAgICAgICAgICAgLU1hdGguc2luKCAoNTQraSo3MikvMTgwKk1hdGguUEkgKSowLjUgKVxuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKClcbiAgICB9XG4gICAgZHJhd1JvdW5kUmVjdChjb250ZXh0LHgseSx3aWR0aCxoZWlnaHQscmFkaXVzKXtcbiAgICAgICAgaWYgKDIqcmFkaXVzPndpZHRofHwyKnJhZGl1cz5oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQuc2F2ZSgpXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKHgseSlcbiAgICAgICAgdGhpcy5yb3VuZFJlY3RQYXRoKGNvbnRleHQsd2lkdGgsaGVpZ2h0LHJhZGl1cylcbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICcjMDAwJ1xuICAgICAgICBjb250ZXh0LnN0cm9rZSgpXG4gICAgICAgIGNvbnRleHQucmVzdG9yZSgpXG4gICAgfVxuICAgIHJvdW5kUmVjdFBhdGgoY29udGV4dCx3aWR0aCxoZWlnaHQscmFkaXVzKXtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKVxuICAgICAgICBjb250ZXh0LmFyYyh3aWR0aC1yYWRpdXMsaGVpZ2h0LXJhZGl1cyxyYWRpdXMsMCxNYXRoLlBJLzIpXG4gICAgICAgIGNvbnRleHQubGluZVRvKHJhZGl1cyxoZWlnaHQpXG4gICAgICAgIGNvbnRleHQuYXJjKHJhZGl1cyxoZWlnaHQtcmFkaXVzLHJhZGl1cywwLjUqTWF0aC5QSSxNYXRoLlBJKVxuICAgICAgICBjb250ZXh0LmxpbmVUbygwLGhlaWdodC1yYWRpdXMpXG4gICAgICAgIGNvbnRleHQuYXJjKHJhZGl1cyxyYWRpdXMscmFkaXVzLE1hdGguUEksMS41Kk1hdGguUEkpXG4gICAgICAgIGNvbnRleHQubGluZVRvKHdpZHRoLXJhZGl1cywwKVxuICAgICAgICBjb250ZXh0LmFyYyh3aWR0aC1yYWRpdXMscmFkaXVzLHJhZGl1cywxLjUqTWF0aC5QSSwyKk1hdGguUEkpXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKClcbiAgICB9XG4gICAgZHJhd01vb24oY29udGV4dCx4LHksUixkLHJvdGF0ZSxjb2xvcil7XG4gICAgICAgIGNvbnRleHQuc2F2ZSgpXG4gICAgICAgIGNvbnRleHQucm90YXRlKHJvdGF0ZS8xODAqTWF0aC5QSSlcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoeCx5KVxuICAgICAgICB0aGlzLm1vb25QYXRoKGNvbnRleHQsUixkKVxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yIHx8ICd5ZWxsb3cnXG4gICAgICAgIGNvbnRleHQuZmlsbCgpXG4gICAgICAgIGNvbnRleHQucmVzdG9yZSgpXG4gICAgfVxuICAgIG1vb25QYXRoKGNvbnRleHQsUixkKXtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKVxuICAgICAgICBjb250ZXh0LmFyYygwLDAsUixNYXRoLlBJKjAuNSxNYXRoLlBJKjEuNSx0cnVlKVxuICAgICAgICBjb250ZXh0LmFyYygtZCwwLE1hdGguc3FydChNYXRoLnBvdyhSLDIpK01hdGgucG93KGQsMikpLC1NYXRoLmF0YW4oUi9kKSxNYXRoLmF0YW4oUi9kKSlcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKVxuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gSWNvbnNcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2FudmFzLzJkL2ljb25zL0ljb25zLmpzXG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vSWNvbnMuc2Nzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZpbXBvcnRMb2FkZXJzPTEmbG9jYWxJZGVudE5hbWU9W25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzIS4vSWNvbnMuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9JY29ucy5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2FudmFzLzJkL2ljb25zL0ljb25zLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSAyODBcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiY2FudmFzIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgbWFyZ2luOiA1MHB4IGF1dG87XFxuICBib3JkZXI6IDFweCBzb2xpZCAjYzNjM2MzOyB9XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlcj9tb2R1bGVzJmltcG9ydExvYWRlcnM9MSZsb2NhbElkZW50TmFtZT1bbmFtZV1fX1tsb2NhbF1fX19baGFzaDpiYXNlNjQ6NV0hLi9+L3Bvc3Rjc3MtbG9hZGVyIS4vfi9zYXNzLWxvYWRlciEuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy8yZC9pY29ucy9JY29ucy5zY3NzXG4gKiogbW9kdWxlIGlkID0gMjgxXG4gKiogbW9kdWxlIGNodW5rcyA9IDNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9