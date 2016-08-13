webpackJsonp([23],{

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

/***/ 408:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(409);
	
	__webpack_require__(411);
	
	__webpack_require__(413);
	
	__webpack_require__(414);
	
	var _index = __webpack_require__(415);
	
	var _index2 = _interopRequireDefault(_index);
	
	var _lodash = __webpack_require__(236);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Wysiwyg = function (_Component) {
	  _inherits(Wysiwyg, _Component);
	
	  function Wysiwyg() {
	    var _Object$getPrototypeO;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Wysiwyg);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Wysiwyg)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.getContent = function () {
	      return $('#editor').wysiwyg('shell').getHTML();
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(Wysiwyg, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var elem = '#editor';
	      $(elem).wysiwyg({
	        class: 'fake-bootstrap',
	        toolbar: 'top-selection',
	        buttons: {
	          dummybutton1: false,
	          dummybutton2: false,
	          smilies: {
	            title: 'Smilies',
	            image: '',
	            popup: function popup($popup, $button) {
	              var listSmilies = _lodash2.default.map(_index2.default, function (s) {
	                return '<img src=' + s + ' width="16" height="16" alt="" />';
	              });
	              var $smilies = $('<div/>').addClass('wysiwyg-plugin-smilies').attr('unselectable', 'on');
	              $.each(listSmilies, function (i, smiley) {
	                var $image = $(smiley).attr('unselectable', 'on');
	                // Append smiley
	                var imagehtml = ' ' + $('<div/>').append($image.clone()).html() + ' ';
	                $image.css({ cursor: 'pointer' }).click(function (e) {
	                  e.preventDefault();
	                  e.stopPropagation();
	                  $(elem).wysiwyg('shell').insertHTML(imagehtml);
	                }).appendTo($smilies);
	              });
	              var $container = $(elem).wysiwyg('container');
	              $smilies.css({ maxWidth: parseInt($container.width() * 0.95, 10) + 'px' });
	              $popup.append($smilies);
	              var $toolbar = $button.parents('.wysiwyg-toolbar');
	              if (!$toolbar.length) {
	                return null;
	              }
	              return {
	                left: parseInt(($toolbar.outerWidth() - $popup.outerWidth()) / 2, 10),
	                top: parseInt($button.outerHeight() / 4, 10) - $popup.height()
	              };
	            },
	
	            showselection: false
	          },
	          insertimage: {
	            title: 'Insert image',
	            image: '',
	            showselection: false
	          },
	          insertlink: {
	            title: 'Insert link',
	            image: ''
	          },
	          fontname: {
	            title: 'Font',
	            image: '',
	            popup: function popup($popup) {
	              var listFontnames = {
	                'Arial, Helvetica': 'Arial,Helvetica',
	                Verdana: 'Verdana,Geneva',
	                Georgia: 'Georgia',
	                'Courier New': 'Courier New,Courier',
	                'Times New Roman': 'Times New Roman,Times'
	              };
	              var $list = $('<div/>').addClass('wysiwyg-plugin-list').attr('unselectable', 'on');
	              $.each(listFontnames, function (name, font) {
	                var $link = $('<a/>').attr('href', '#').css('font-family', font).html(name).click(function (event) {
	                  $(elem).wysiwyg('shell').fontName(font).closePopup();
	                  event.stopPropagation();
	                  event.preventDefault();
	                  return false;
	                });
	                $list.append($link);
	              });
	              $popup.append($list);
	            },
	
	            showselection: true
	          },
	          // Fontsize plugin
	          fontsize: {
	            title: 'Size',
	            image: '',
	            popup: function popup($popup) {
	              var listFontsizes = [];
	              for (var i = 8; i <= 11; ++i) {
	                listFontsizes.push();
	              }
	              for (var _i = 12; _i <= 28; _i += 2) {
	                listFontsizes.push(_i + 'px');
	                listFontsizes.push('36px');
	                listFontsizes.push('48px');
	                listFontsizes.push('72px');
	              }
	
	              var $list = $('<div/>').addClass('wysiwyg-plugin-list').attr('unselectable', 'on');
	              $.each(listFontsizes, function (index, size) {
	                var $link = $('<a/>').attr('href', '#').html(size).click(function (event) {
	                  $(elem).wysiwyg('shell').fontSize(7).closePopup();
	                  $(elem).wysiwyg('container').find('font[size=7]').removeAttr('size').css('font-size', size);
	                  event.stopPropagation();
	                  event.preventDefault();
	                  return false;
	                });
	                $list.append($link);
	              });
	              $popup.append($list);
	            }
	          },
	          header: {
	            title: 'Header',
	            image: '',
	            popup: function popup($popup) {
	              var listHeaders = {
	                // Name : Font
	                'Header 1': '<h1>',
	                'Header 2': '<h2>',
	                'Header 3': '<h3>',
	                'Header 4': '<h4>',
	                'Header 5': '<h5>',
	                'Header 6': '<h6>',
	                Code: '<pre>'
	              };
	              var $list = $('<div/>').addClass('wysiwyg-plugin-list').attr('unselectable', 'on');
	              $.each(listHeaders, function (name, format) {
	                var $link = $('<a/>').attr('href', '#').css('font-family', format).html(name).click(function (event) {
	                  $(elem).wysiwyg('shell').format(format).closePopup();
	                  event.stopPropagation();
	                  event.preventDefault();
	                  return false;
	                });
	                $list.append($link);
	              });
	              $popup.append($list);
	            }
	          },
	          bold: {
	            title: 'Bold (Ctrl+B)',
	            image: '',
	            hotkey: 'b'
	          },
	          italic: {
	            title: 'Italic (Ctrl+I)',
	            image: '',
	            hotkey: 'i'
	          },
	          underline: {
	            title: 'Underline (Ctrl+U)',
	            image: '',
	            hotkey: 'u'
	          },
	          strikethrough: {
	            title: 'Strikethrough (Ctrl+S)',
	            image: '',
	            hotkey: 's'
	          },
	          forecolor: {
	            title: 'Text color',
	            image: ''
	          },
	          highlight: {
	            title: 'Background color',
	            image: ''
	          },
	          alignleft: {
	            title: 'Left',
	            image: '',
	            showselection: false
	          },
	          aligncenter: {
	            title: 'Center',
	            image: '',
	            showselection: false
	          },
	          alignright: {
	            title: 'Right',
	            image: '',
	            showselection: false
	          },
	          alignjustify: {
	            title: 'Justify',
	            image: '',
	            showselection: false
	          },
	          subscript: {
	            title: 'Subscript',
	            image: '',
	            showselection: true
	          },
	          superscript: {
	            title: 'Superscript',
	            image: '',
	            showselection: true
	          },
	          indent: {
	            title: 'Indent',
	            image: '',
	            showselection: false
	          },
	          outdent: {
	            title: 'Outdent',
	            image: '',
	            showselection: false
	          },
	          orderedList: {
	            title: 'Ordered list',
	            image: '',
	            showselection: false
	          },
	          unorderedList: {
	            title: 'Unordered list',
	            image: '',
	            showselection: false
	          },
	          removeformat: {
	            title: 'Remove format',
	            image: ''
	          }
	        },
	        selectImage: 'Click or drop image',
	        placeholderUrl: 'www.example.com',
	        placeholderEmbed: '<embed/>'
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { style: { width: '900px', margin: '100px auto' } },
	        _react2.default.createElement('textarea', {
	          id: 'editor',
	          name: 'editor',
	          placeholder: 'Type your text here...',
	          style: { display: 'none' }
	        })
	      );
	    }
	  }]);
	
	  return Wysiwyg;
	}(_react.Component);
	
	module.exports = Wysiwyg;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(239)))

/***/ },

/***/ 409:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(410);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../../../node_modules/css-loader/index.js!./../../../../../../../node_modules/postcss-loader/index.js!./wysiwyg-editor.css", function() {
				var newContent = require("!!./../../../../../../../node_modules/css-loader/index.js!./../../../../../../../node_modules/postcss-loader/index.js!./wysiwyg-editor.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 410:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, "/*\n * If you prefer to host 'FontAwesome' on your server\n@font-face {\n    font-family: 'FontAwesome';\n    src: url('fonts/fontawesome-webfont.eot?v=4.2.0');\n    src: url('fonts/fontawesome-webfont.eot?#iefix&v=4.2.0') format('embedded-opentype'), url('fonts/fontawesome-webfont.woff?v=4.2.0') format('woff'), url('fonts/fontawesome-webfont.ttf?v=4.2.0') format('truetype'), url('fonts/fontawesome-webfont.svg?v=4.2.0#fontawesomeregular') format('svg');\n    font-weight: normal;\n    font-style: normal;\n}\n*/\n\n.wysiwyg-container {\n    overflow: visible;\n    color: black;\n    background: none white;\n    border: 1px solid #dddddd;\n    border-radius: 4px;\n}\n.wysiwyg-textarea {\n    display: block;\n    width: 100%;\n    min-height: 1.5em;\n    /* should be equal to line-height */\n    padding: 0;\n    resize: none;\n}\n.wysiwyg-wrapper {\n    position: relative;\n}\n.wysiwyg-editor {\n    position: relative;\n    min-height: 1.5em;\n    /* should be equal to line-height */\n    padding: 4px 6px;\n    overflow: auto;\n    outline: none;\n    color: #141824;\n    -ms-word-wrap: break-word;\n    word-wrap: break-word;\n}\n.wysiwyg-toolbar {\n    overflow: hidden;\n    white-space: nowrap;\n    padding: 0;\n}\n.wysiwyg-toolbar-top {\n    border-bottom: 1px solid #dddddd;\n}\n.wysiwyg-toolbar-bottom {\n    border-top: 1px solid #dddddd;\n}\n.wysiwyg-toolbar a {\n    vertical-align: top;\n}\n.wysiwyg-placeholder {\n    position: absolute;\n    top: 4px;\n    /* same as padding in .wysiwyg-editor */\n    left: 6px;\n    opacity: 0.54;\n    /* https://developer.mozilla.org/de/docs/Web/CSS/%3A%3A-moz-placeholder */\n}\n.wysiwyg-popup {\n    position: absolute;\n    z-index: 9999;\n    color: black;\n    background: white;\n    background: rgba(255, 255, 255, 0.9);\n    left: -50%;\n    white-space: nowrap;\n    border: 1px solid #dddddd;\n    border-radius: 4px;\n    -moz-user-select: none;\n    -webkit-touch-callout: none;\n    -webkit-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n.wysiwyg-popup.wysiwyg-popuphover {\n    margin-top: 9px;\n    /*-moz-box-shadow: 0 3px 10px rgba(50,50,50,0.3);\n    -webkit-box-shadow: 0 3px 10px rgba(50,50,50,0.3);\n    box-shadow: 0 3px 10px rgba(50,50,50,0.3);*/\n}\n.wysiwyg-popup.wysiwyg-popuphover:after {\n    position: absolute;\n    left: 50%;\n    bottom: 100%;\n    border: solid transparent;\n    content: '';\n    width: 0;\n    height: 0;\n    margin-left: -8px;\n    border-left: 9px solid transparent;\n    border-right: 9px solid transparent;\n    border-bottom: 8px solid #dddddd;\n}\n.wysiwyg-toolbar-icon {\n    display: -moz-inline-stack;\n    display: inline-block;\n    *display: inline;\n    margin: 0;\n    padding: 0;\n    color: #999999;\n    text-decoration: none;\n    *zoom: 1;\n    vertical-align: top;\n    cursor: pointer;\n    -moz-user-select: none;\n    -webkit-touch-callout: none;\n    -webkit-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    /*width: 16px;\n    height: 16px;*/\n    padding: 8px 12px;\n    font: 16px FontAwesome;\n    -webkit-transition: color 0.2s, background 0.2s;\n    transition: color 0.2s, background 0.2s;\n}\n.wysiwyg-toolbar-icon:hover {\n    color: HighlightText;\n    background-color: Highlight;\n    text-decoration: none;\n    -webkit-transition: color 0.2s, background 0.2s;\n    transition: color 0.2s, background 0.2s;\n}\n.wysiwyg-toolbar-form {\n    padding: 10px;\n    white-space: nowrap;\n}\n.wysiwyg-toolbar-form .wysiwyg-toolbar-icon {\n    margin-left: 5px;\n    border-radius: 5px;\n}\n.wysiwyg-toolbar-color {\n    width: 12px;\n    height: 12px;\n    cursor: pointer;\n}\n.wysiwyg-input {\n    display: -moz-inline-stack;\n    display: inline-block;\n    *display: inline;\n    color: #141824;\n    background: none white;\n    border: 1px solid #dddddd;\n    width: 20em;\n    height: 20px;\n    padding: 5px 6px;\n    /* 8 - extraheight(2) - border(1) = 5 */\n    border-radius: 4px;\n    outline: none;\n}\n.wysiwyg-input.wysiwyg-inputtextarea {\n    width: 100%;\n    height: 5em;\n    box-sizing: border-box;\n    resize: none;\n}\n.wysiwyg-input:hover, .wysiwyg-input:active, .wysiwyg-input:focus {\n    border-color: #dddddd;\n}\n.wysiwyg-browse {\n    position: relative;\n    left: 0;\n    top: 0;\n    height: 3em;\n    /*line-height: 3em;*/\n    color: #666666;\n    border: 2px dashed #dddddd;\n    background-color: #f5f5f5;\n    padding: 10px;\n    text-align: center;\n    font-weight: bold;\n    margin-bottom: 10px;\n    cursor: pointer;\n}\n.wysiwyg-browse:hover, .wysiwyg-browse:active, .wysiwyg-browse:focus {\n    color: #141824;\n    border-color: #dddddd;\n}\n.wysiwyg-embedcode {\n    margin-bottom: 10px;\n}\n", ""]);
	
	// exports


/***/ },

/***/ 411:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(412);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../../node_modules/css-loader/index.js!./../../../../../../node_modules/postcss-loader/index.js!./Wysiwyg.css", function() {
				var newContent = require("!!./../../../../../../node_modules/css-loader/index.js!./../../../../../../node_modules/postcss-loader/index.js!./Wysiwyg.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 412:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, "/* CSS for the font-name + font-size plugin */\n\n.wysiwyg-plugin-list {\n    max-height: 16em;\n    overflow: auto;\n    overflow-x: hidden;\n    overflow-y: scroll;\n}\n.wysiwyg-plugin-list a, .wysiwyg-plugin-list a:link, .wysiwyg-plugin-list a:visited {\n    display: block;\n    color: black;\n    padding: 5px 10px;\n    text-decoration: none;\n    cursor: pointer;\n}\n.wysiwyg-plugin-list a:hover {\n    color: HighlightText;\n    background-color: Highlight;\n}\n\n/* CSS for the smiley plugin */\n\n.wysiwyg-plugin-smilies {\n    padding: 10px;\n    text-align: center;\n    white-space: normal;\n}\n.wysiwyg-plugin-smilies img {\n    display: -moz-inline-stack;\n    display: inline-block;\n    *display: inline;\n    padding-left: 2px;\n}\n.fake-bootstrap.wysiwyg-container.wysiwyg-active {\n    border-color: #66afe9;\n    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(102, 175, 233, 0.6);\n}\n.fake-uikit.wysiwyg-container.wysiwyg-active {\n    border-color: #99baca !important;\n    background: #f5fbfe !important;\n}\n", ""]);
	
	// exports


/***/ },

/***/ 413:
/***/ function(module, exports) {

	'use strict';
	
	(function (factory) {
	    'use strict';
	
	    window.wysiwyg = factory(window, document);
	})(function (window, document) {
	    'use strict';
	
	    // http://stackoverflow.com/questions/97962/debounce-clicks-when-submitting-a-web-form
	
	    var debounce = function debounce(callback, wait, cancelprevious) {
	        var timeout;
	        return function () {
	            if (timeout) {
	                if (!cancelprevious) return;
	                clearTimeout(timeout);
	            }
	            var context = this,
	                args = arguments;
	            timeout = setTimeout(function () {
	                timeout = null;
	                callback.apply(context, args);
	            }, wait);
	        };
	    };
	
	    // http://stackoverflow.com/questions/12949590/how-to-detach-event-in-ie-6-7-8-9-using-javascript
	    var addEvent = function addEvent(element, type, handler, useCapture) {
	        if (element.addEventListener) {
	            element.addEventListener(type, handler, useCapture ? true : false);
	        } else if (element.attachEvent) {
	            element.attachEvent('on' + type, handler);
	        } else if (element != window) element['on' + type] = handler;
	    };
	    var removeEvent = function removeEvent(element, type, handler, useCapture) {
	        if (element.removeEventListener) {
	            element.removeEventListener(type, handler, useCapture ? true : false);
	        } else if (element.detachEvent) {
	            element.detachEvent('on' + type, handler);
	        } else if (element != window) element['on' + type] = null;
	    };
	    // http://www.cristinawithout.com/content/function-trigger-events-javascript
	    var fireEvent = function fireEvent(element, type, bubbles, cancelable) {
	        if (document.createEvent) {
	            var event = document.createEvent('Event');
	            event.initEvent(type, bubbles !== undefined ? bubbles : true, cancelable !== undefined ? cancelable : false);
	            element.dispatchEvent(event);
	        } else if (document.createEventObject) {
	            //IE
	            var event = document.createEventObject();
	            element.fireEvent('on' + type, event);
	        } else if (typeof element['on' + type] == 'function') element['on' + type]();
	    };
	    // prevent default
	    var cancelEvent = function cancelEvent(e) {
	        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
	        if (e.stopPropagation) e.stopPropagation();else e.cancelBubble = true;
	        return false;
	    };
	
	    // http://stackoverflow.com/questions/13377887/javascript-node-undefined-in-ie8-and-under
	    var Node_ELEMENT_NODE = typeof Node != 'undefined' ? Node.ELEMENT_NODE : 1;
	    var Node_TEXT_NODE = typeof Node != 'undefined' ? Node.TEXT_NODE : 3;
	
	    // http://stackoverflow.com/questions/2234979/how-to-check-in-javascript-if-one-element-is-a-child-of-another
	    var isOrContainsNode = function isOrContainsNode(ancestor, descendant) {
	        var node = descendant;
	        while (node) {
	            if (node === ancestor) return true;
	            node = node.parentNode;
	        }
	        return false;
	    };
	
	    // http://stackoverflow.com/questions/667951/how-to-get-nodes-lying-inside-a-range-with-javascript
	    var nextNode = function nextNode(node, container) {
	        if (node.firstChild) return node.firstChild;
	        while (node) {
	            if (node == container) // do not walk out of the container
	                return null;
	            if (node.nextSibling) return node.nextSibling;
	            node = node.parentNode;
	        }
	        return null;
	    };
	
	    // save/restore selection
	    // http://stackoverflow.com/questions/13949059/persisting-the-changes-of-range-objects-after-selection-in-html/13950376#13950376
	    var saveSelection = function saveSelection(containerNode) {
	        if (window.getSelection) {
	            var sel = window.getSelection();
	            if (sel.rangeCount > 0) return sel.getRangeAt(0);
	        } else if (document.selection) {
	            var sel = document.selection;
	            return sel.createRange();
	        }
	        return null;
	    };
	    var restoreSelection = function restoreSelection(containerNode, savedSel) {
	        if (!savedSel) return;
	        if (window.getSelection) {
	            var sel = window.getSelection();
	            sel.removeAllRanges();
	            sel.addRange(savedSel);
	        } else if (document.selection) {
	            savedSel.select();
	        }
	    };
	
	    // http://stackoverflow.com/questions/12603397/calculate-width-height-of-the-selected-text-javascript
	    // http://stackoverflow.com/questions/6846230/coordinates-of-selected-text-in-browser-page
	    var getSelectionRect = function getSelectionRect() {
	        if (window.getSelection) {
	            var sel = window.getSelection();
	            if (!sel.rangeCount) return false;
	            var range = sel.getRangeAt(0).cloneRange();
	            if (range.getBoundingClientRect) // Missing for Firefox 3.5+3.6
	                {
	                    var rect = range.getBoundingClientRect();
	                    // Safari 5.1 returns null, IE9 returns 0/0/0/0 if image selected
	                    if (rect && rect.left && rect.top && rect.right && rect.bottom) return {
	                        // Modern browsers return floating-point numbers
	                        left: parseInt(rect.left),
	                        top: parseInt(rect.top),
	                        width: parseInt(rect.right - rect.left),
	                        height: parseInt(rect.bottom - rect.top)
	                    };
	                    // on Webkit 'range.getBoundingClientRect()' sometimes return 0/0/0/0 - but 'range.getClientRects()' works
	                    var rects = range.getClientRects ? range.getClientRects() : [];
	                    for (var i = 0; i < rects.length; ++i) {
	                        var rect = rects[i];
	                        if (rect.left && rect.top && rect.right && rect.bottom) return {
	                            // Modern browsers return floating-point numbers
	                            left: parseInt(rect.left),
	                            top: parseInt(rect.top),
	                            width: parseInt(rect.right - rect.left),
	                            height: parseInt(rect.bottom - rect.top)
	                        };
	                    }
	                }
	            /*
	            // Fall back to inserting a temporary element (only for Firefox 3.5 and 3.6)
	            var span = document.createElement('span');
	            if( span.getBoundingClientRect )
	            {
	                // Ensure span has dimensions and position by
	                // adding a zero-width space character
	                span.appendChild( document.createTextNode('\u200b') );
	                range.insertNode( span );
	                var rect = span.getBoundingClientRect();
	                var spanParent = span.parentNode;
	                spanParent.removeChild( span );
	                // Glue any broken text nodes back together
	                spanParent.normalize();
	                return {
	                    left: parseInt(rect.left),
	                    top: parseInt(rect.top),
	                    width: parseInt(rect.right - rect.left),
	                    height: parseInt(rect.bottom - rect.top)
	                };
	            }
	            */
	        } else if (document.selection) {
	            var sel = document.selection;
	            if (sel.type != 'Control') {
	                var range = sel.createRange();
	                // IE8 return 0/0/0/0 if caret right before newline
	                if (range.boundingLeft || range.boundingTop || range.boundingWidth || range.boundingHeight) return {
	                    left: range.boundingLeft,
	                    top: range.boundingTop,
	                    width: range.boundingWidth,
	                    height: range.boundingHeight
	                };
	            }
	        }
	        return false;
	    };
	
	    var getSelectionCollapsed = function getSelectionCollapsed(containerNode) {
	        if (window.getSelection) {
	            var sel = window.getSelection();
	            if (sel.isCollapsed) return true;
	            return false;
	        } else if (document.selection) {
	            var sel = document.selection;
	            if (sel.type == 'Text') {
	                var range = document.selection.createRange();
	                var textrange = document.body.createTextRange();
	                textrange.moveToElementText(containerNode);
	                textrange.setEndPoint('EndToStart', range);
	                return range.htmlText.length == 0;
	            }
	            if (sel.type == 'Control') // e.g. an image selected
	                return false;
	            // sel.type == 'None' -> collapsed selection
	        }
	        return true;
	    };
	
	    // http://stackoverflow.com/questions/7781963/js-get-array-of-all-selected-nodes-in-contenteditable-div
	    var getSelectedNodes = function getSelectedNodes(containerNode) {
	        if (window.getSelection) {
	            var sel = window.getSelection();
	            if (!sel.rangeCount) return [];
	            var nodes = [];
	            for (var i = 0; i < sel.rangeCount; ++i) {
	                var range = sel.getRangeAt(i),
	                    node = range.startContainer,
	                    endNode = range.endContainer;
	                while (node) {
	                    // add this node?
	                    if (node != containerNode) {
	                        var node_inside_selection = false;
	                        if (sel.containsNode) node_inside_selection = sel.containsNode(node, true);else // IE11
	                            {
	                                // http://stackoverflow.com/questions/5884210/how-to-find-if-a-htmlelement-is-enclosed-in-selected-text
	                                var noderange = document.createRange();
	                                noderange.selectNodeContents(node);
	                                for (var i = 0; i < sel.rangeCount; ++i) {
	                                    var range = sel.getRangeAt(i);
	                                    // start after or end before -> skip node
	                                    if (range.compareBoundaryPoints(range.END_TO_START, noderange) >= 0 && range.compareBoundaryPoints(range.START_TO_END, noderange) <= 0) {
	                                        node_inside_selection = true;
	                                        break;
	                                    }
	                                }
	                            }
	                        if (node_inside_selection) nodes.push(node);
	                    }
	                    node = nextNode(node, node == endNode ? endNode : containerNode);
	                }
	            }
	            // Fallback
	            if (nodes.length == 0 && isOrContainsNode(containerNode, sel.focusNode) && sel.focusNode != containerNode) nodes.push(sel.focusNode);
	            return nodes;
	        } else if (document.selection) {
	            var sel = document.selection;
	            if (sel.type == 'Text') {
	                var nodes = [];
	                var ranges = sel.createRangeCollection();
	                for (var i = 0; i < ranges.length; ++i) {
	                    var range = ranges[i],
	                        parentNode = range.parentElement(),
	                        node = parentNode;
	                    while (node) {
	                        // No clue how to detect whether a TextNode is within the selection...
	                        // ElementNode is easy: http://stackoverflow.com/questions/5884210/how-to-find-if-a-htmlelement-is-enclosed-in-selected-text
	                        var noderange = range.duplicate();
	                        noderange.moveToElementText(node.nodeType != Node_ELEMENT_NODE ? node.parentNode : node);
	                        // start after or end before -> skip node
	                        if (noderange.compareEndPoints('EndToStart', range) >= 0 && noderange.compareEndPoints('StartToEnd', range) <= 0) {
	                            // no "Array.indexOf()" in IE8
	                            var in_array = false;
	                            for (var j = 0; j < nodes.length; ++j) {
	                                if (nodes[j] !== node) continue;
	                                in_array = true;
	                                break;
	                            }
	                            if (!in_array) nodes.push(node);
	                        }
	                        node = nextNode(node, parentNode);
	                    }
	                }
	                // Fallback
	                if (nodes.length == 0 && isOrContainsNode(containerNode, document.activeElement) && document.activeElement != containerNode) nodes.push(document.activeElement);
	                return nodes;
	            }
	            if (sel.type == 'Control') // e.g. an image selected
	                {
	                    var nodes = [];
	                    // http://msdn.microsoft.com/en-us/library/ie/hh826021%28v=vs.85%29.aspx
	                    var range = sel.createRange();
	                    for (var i = 0; i < range.length; ++i) {
	                        nodes.push(range(i));
	                    }return nodes;
	                }
	        }
	        return [];
	    };
	
	    // http://stackoverflow.com/questions/8513368/collapse-selection-to-start-of-selection-not-div
	    var collapseSelectionEnd = function collapseSelectionEnd() {
	        if (window.getSelection) {
	            var sel = window.getSelection();
	            if (!sel.isCollapsed) {
	                // Form-submits via Enter throw 'NS_ERROR_FAILURE' on Firefox 34
	                try {
	                    sel.collapseToEnd();
	                } catch (e) {}
	            }
	        } else if (document.selection) {
	            var sel = document.selection;
	            if (sel.type != 'Control') {
	                var range = sel.createRange();
	                range.collapse(false);
	                range.select();
	            }
	        }
	    };
	
	    // http://stackoverflow.com/questions/15157435/get-last-character-before-caret-position-in-javascript
	    // http://stackoverflow.com/questions/11247737/how-can-i-get-the-word-that-the-caret-is-upon-inside-a-contenteditable-div
	    var expandSelectionCaret = function expandSelectionCaret(containerNode, preceding, following) {
	        if (window.getSelection) {
	            var sel = window.getSelection();
	            if (sel.modify) {
	                for (var i = 0; i < preceding; ++i) {
	                    sel.modify('extend', 'backward', 'character');
	                }for (var i = 0; i < following; ++i) {
	                    sel.modify('extend', 'forward', 'character');
	                }
	            } else {
	                // not so easy if the steps would cover multiple nodes ...
	                var range = sel.getRangeAt(0);
	                range.setStart(range.startContainer, range.startOffset - preceding);
	                range.setEnd(range.endContainer, range.endOffset + following);
	                sel.removeAllRanges();
	                sel.addRange(range);
	            }
	        } else if (document.selection) {
	            var sel = document.selection;
	            if (sel.type != 'Control') {
	                var range = sel.createRange();
	                range.collapse(true);
	                range.moveStart('character', -preceding);
	                range.moveEnd('character', following);
	                range.select();
	            }
	        }
	    };
	
	    // http://stackoverflow.com/questions/4652734/return-html-from-a-user-selected-text/4652824#4652824
	    var getSelectionHtml = function getSelectionHtml(containerNode) {
	        if (getSelectionCollapsed(containerNode)) return null;
	        if (window.getSelection) {
	            var sel = window.getSelection();
	            if (sel.rangeCount) {
	                var container = document.createElement('div'),
	                    len = sel.rangeCount;
	                for (var i = 0; i < len; ++i) {
	                    var contents = sel.getRangeAt(i).cloneContents();
	                    container.appendChild(contents);
	                }
	                return container.innerHTML;
	            }
	        } else if (document.selection) {
	            var sel = document.selection;
	            if (sel.type == 'Text') {
	                var range = sel.createRange();
	                return range.htmlText;
	            }
	        }
	        return null;
	    };
	
	    var selectionInside = function selectionInside(containerNode, force) {
	        // selection inside editor?
	        if (window.getSelection) {
	            var sel = window.getSelection();
	            if (isOrContainsNode(containerNode, sel.anchorNode) && isOrContainsNode(containerNode, sel.focusNode)) return true;
	            // selection at least partly outside editor
	            if (!force) return false;
	            // force selection to editor
	            var range = document.createRange();
	            range.selectNodeContents(containerNode);
	            range.collapse(false);
	            sel.removeAllRanges();
	            sel.addRange(range);
	        } else if (document.selection) {
	            var sel = document.selection;
	            if (sel.type == 'Control') // e.g. an image selected
	                {
	                    // http://msdn.microsoft.com/en-us/library/ie/hh826021%28v=vs.85%29.aspx
	                    var range = sel.createRange();
	                    if (range.length != 0 && isOrContainsNode(containerNode, range(0))) // test only the first element
	                        return true;
	                } else //if( sel.type == 'Text' || sel.type == 'None' )
	                {
	                    // Range of container
	                    // http://stackoverflow.com/questions/12243898/how-to-select-all-text-in-contenteditable-div
	                    var rangeContainer = document.body.createTextRange();
	                    rangeContainer.moveToElementText(containerNode);
	                    // Compare with selection range
	                    var range = sel.createRange();
	                    if (rangeContainer.inRange(range)) return true;
	                }
	            // selection at least partly outside editor
	            if (!force) return false;
	            // force selection to editor
	            // http://stackoverflow.com/questions/12243898/how-to-select-all-text-in-contenteditable-div
	            var range = document.body.createTextRange();
	            range.moveToElementText(containerNode);
	            range.setEndPoint('StartToEnd', range); // collapse
	            range.select();
	        }
	        return true;
	    };
	
	    /*
	    var clipSelectionTo = function( containerNode )
	    {
	        if( window.getSelection && containerNode.compareDocumentPosition )
	        {
	            var sel = window.getSelection();
	            var left_node = sel.anchorNode,
	                left_offset = sel.anchorOffset,
	                right_node = sel.focusNode,
	                right_offset = sel.focusOffset;
	            // http://stackoverflow.com/questions/10710733/dom-determine-if-the-anchornode-or-focusnode-is-on-the-left-side
	            if( (left_node == right_node && left_offset > right_offset) ||
	                (left_node.compareDocumentPosition(right_node) & Node.DOCUMENT_POSITION_PRECEDING) )
	            {
	                // Right-to-left selection
	                left_node = sel.focusNode;
	                left_offset = sel.focusOffset;
	                right_node = sel.anchorNode,
	                right_offset = sel.anchorOffset;
	            }
	            // Speed up: selection inside editor
	            var left_inside = isOrContainsNode(containerNode,left_node),
	                right_inside = isOrContainsNode(containerNode,right_node);
	            if( left_inside && right_inside )
	                return true;
	            // Selection before/after container?
	            if( ! left_inside && containerNode.compareDocumentPosition(left_node) & Node.DOCUMENT_POSITION_FOLLOWING )
	                return false; // selection after
	            if( ! right_inside && containerNode.compareDocumentPosition(right_node) & Node.DOCUMENT_POSITION_PRECEDING )
	                return false; // selection before
	            // Selection partly before/after container
	            // http://stackoverflow.com/questions/12243898/how-to-select-all-text-in-contenteditable-div
	            var range = document.createRange();
	            range.selectNodeContents( containerNode );
	            if( left_inside )
	                range.setStart( left_node, left_offset );
	            if( right_inside )
	                range.setEnd( right_node, right_offset );
	            sel.removeAllRanges();
	            sel.addRange(range);
	            return true;
	        }
	        else if( document.selection )
	        {
	            var sel = document.selection;
	            if( sel.type == 'Text' )
	            {
	                // Range of container
	                // http://stackoverflow.com/questions/12243898/how-to-select-all-text-in-contenteditable-div
	                var rangeContainer = document.body.createTextRange();
	                rangeContainer.moveToElementText(containerNode);
	                // Compare with selection range
	                var range = sel.createRange();
	                if( rangeContainer.inRange(range) )
	                    return true;
	                // Selection before/after container?
	                if( rangeContainer.compareEndPoints('StartToEnd',range) > 0 )
	                    return false;
	                if( rangeContainer.compareEndPoints('EndToStart',range) < 0 )
	                    return false;
	                // Selection partly before/after container
	                if( rangeContainer.compareEndPoints('StartToStart',range) > 0 )
	                    range.setEndPoint('StartToStart',rangeContainer);
	                if( rangeContainer.compareEndPoints('EndToEnd',range) < 0 )
	                    range.setEndPoint('EndToEnd',rangeContainer);
	                // select range
	                range.select();
	                return true;
	            }
	        }
	        return true;
	    };
	    */
	
	    // http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div/6691294#6691294
	    // http://stackoverflow.com/questions/4823691/insert-an-html-element-in-a-contenteditable-element
	    // http://stackoverflow.com/questions/6139107/programatically-select-text-in-a-contenteditable-html-element
	    var pasteHtmlAtCaret = function pasteHtmlAtCaret(containerNode, html) {
	        if (window.getSelection) {
	            // IE9 and non-IE
	            var sel = window.getSelection();
	            if (sel.getRangeAt && sel.rangeCount) {
	                var range = sel.getRangeAt(0);
	                // Range.createContextualFragment() would be useful here but is
	                // only relatively recently standardized and is not supported in
	                // some browsers (IE9, for one)
	                var el = document.createElement('div');
	                el.innerHTML = html;
	                var frag = document.createDocumentFragment(),
	                    node,
	                    lastNode;
	                while (node = el.firstChild) {
	                    lastNode = frag.appendChild(node);
	                }
	                if (isOrContainsNode(containerNode, range.commonAncestorContainer)) {
	                    range.deleteContents();
	                    range.insertNode(frag);
	                } else {
	                    containerNode.appendChild(frag);
	                }
	                // Preserve the selection
	                if (lastNode) {
	                    range = range.cloneRange();
	                    range.setStartAfter(lastNode);
	                    range.collapse(true);
	                    sel.removeAllRanges();
	                    sel.addRange(range);
	                }
	            }
	        } else if (document.selection) {
	            // IE <= 8
	            var sel = document.selection;
	            if (sel.type != 'Control') {
	                var originalRange = sel.createRange();
	                originalRange.collapse(true);
	                var range = sel.createRange();
	                if (isOrContainsNode(containerNode, range.parentElement())) range.pasteHTML(html);else // simply append to Editor
	                    {
	                        var textRange = document.body.createTextRange();
	                        textRange.moveToElementText(containerNode);
	                        textRange.collapse(false);
	                        textRange.select();
	                        textRange.pasteHTML(html);
	                    }
	                // Preserve the selection
	                range = sel.createRange();
	                range.setEndPoint('StartToEnd', originalRange);
	                range.select();
	            }
	        }
	    };
	
	    // Interface: Create wysiwyg
	    var wysiwyg = function wysiwyg(option) {
	        // Options
	        option = option || {};
	        var option_element = option.element || null;
	        if (typeof option_element == 'string') option_element = document.getElementById(option_element);
	        var option_contenteditable = option.contenteditable || null;
	        if (typeof option_contenteditable == 'string') option_contenteditable = document.getElementById(option_contenteditable);
	        var option_onkeydown = option.onKeyDown || null;
	        var option_onkeypress = option.onKeyPress || null;
	        var option_onkeyup = option.onKeyUp || null;
	        var option_onselection = option.onSelection || null;
	        var option_onplaceholder = option.onPlaceholder || null;
	        var option_onopenpopup = option.onOpenpopup || null;
	        var option_onclosepopup = option.onClosepopup || null;
	        var option_hijackcontextmenu = option.hijackContextmenu || false;
	        var option_readonly = option.readOnly || false;
	
	        // Keep textarea if browser can't handle content-editable
	        var is_textarea = option_element.nodeName == 'TEXTAREA' || option_element.nodeName == 'INPUT';
	        if (is_textarea) {
	            // http://stackoverflow.com/questions/1882205/how-do-i-detect-support-for-contenteditable-via-javascript
	            var canContentEditable = 'contentEditable' in document.body;
	            if (canContentEditable) {
	                // Sniffer useragent...
	                var webkit = navigator.userAgent.match(/(?:iPad|iPhone|Android).* AppleWebKit\/([^ ]+)/);
	                if (webkit && 420 <= parseInt(webkit[1]) && parseInt(webkit[1]) < 534) // iPhone 1 was Webkit/420
	                    canContentEditable = false;
	            }
	            if (!canContentEditable) {
	                // Keep textarea
	                var node_textarea = option_element;
	                // Add a 'newline' after each '<br>'
	                var newlineAfterBR = function newlineAfterBR(html) {
	                    return html.replace(/<br[ \/]*>\n?/gi, '<br>\n');
	                };
	                node_textarea.value = newlineAfterBR(node_textarea.value);
	                // Command structure
	                var dummy_this = function dummy_this() {
	                    return this;
	                };
	                var dummy_null = function dummy_null() {
	                    return null;
	                };
	                return {
	                    legacy: true,
	                    // properties
	                    getElement: function getElement() {
	                        return node_textarea;
	                    },
	                    getHTML: function getHTML() {
	                        return node_textarea.value;
	                    },
	                    setHTML: function setHTML(html) {
	                        node_textarea.value = newlineAfterBR(html);
	                        return this;
	                    },
	                    getSelectedHTML: dummy_null,
	                    sync: dummy_this,
	                    readOnly: function readOnly(readonly) {
	                        // query read-only
	                        if (readonly === undefined) return node_textarea.hasAttribute ? node_textarea.hasAttribute('readonly') : !!node_textarea.getAttribute('readonly'); // IE7
	                        // set read-only
	                        if (readonly) node_textarea.setAttribute('readonly', 'readonly');else node_textarea.removeAttribute('readonly');
	                        return this;
	                    },
	                    // selection and popup
	                    collapseSelection: dummy_this,
	                    expandSelection: dummy_this,
	                    openPopup: dummy_null,
	                    closePopup: dummy_this,
	                    // exec commands
	                    removeFormat: dummy_this,
	                    bold: dummy_this,
	                    italic: dummy_this,
	                    underline: dummy_this,
	                    strikethrough: dummy_this,
	                    forecolor: dummy_this,
	                    highlight: dummy_this,
	                    fontName: dummy_this,
	                    fontSize: dummy_this,
	                    subscript: dummy_this,
	                    superscript: dummy_this,
	                    align: dummy_this,
	                    format: dummy_this,
	                    indent: dummy_this,
	                    insertLink: dummy_this,
	                    insertImage: dummy_this,
	                    insertHTML: dummy_this,
	                    insertList: dummy_this
	                };
	            }
	        }
	
	        // create content-editable
	        var node_textarea = null,
	            node_wysiwyg = null;
	        if (is_textarea) {
	            // Textarea
	            node_textarea = option_element;
	            node_textarea.style.display = 'none';
	
	            // Contenteditable
	            if (option_contenteditable) node_wysiwyg = option_contenteditable;else {
	                node_wysiwyg = document.createElement('DIV');
	                node_wysiwyg.innerHTML = node_textarea.value || '';
	                var parent = node_textarea.parentNode,
	                    next = node_textarea.nextSibling;
	                if (next) parent.insertBefore(node_wysiwyg, next);else parent.appendChild(node_wysiwyg);
	            }
	        } else node_wysiwyg = option_element;
	        // If not read-only
	        if (!option_readonly) node_wysiwyg.setAttribute('contentEditable', 'true'); // IE7 is case sensitive
	
	        // IE8 uses 'document' instead of 'window'
	        // http://tanalin.com/en/articles/ie-version-js/ - http://stackoverflow.com/questions/10964966/detect-ie-version-prior-to-v9-in-javascript
	        var window_ie8 = document.all && (!document.documentMode || document.documentMode <= 8) ? document : window;
	
	        // Sync Editor with Textarea
	        var syncTextarea = null,
	            callUpdates;
	        if (is_textarea) {
	            var previous_html = node_wysiwyg.innerHTML;
	            syncTextarea = function syncTextarea() {
	                var new_html = node_wysiwyg.innerHTML;
	                if (new_html == previous_html) return;
	                // HTML changed
	                node_textarea.value = new_html;
	                previous_html = new_html;
	                // Event Handler
	                fireEvent(node_textarea, 'change', false);
	            };
	
	            // handle reset event
	            var form = node_textarea.form;
	            if (form) {
	                addEvent(form, 'reset', function () {
	                    node_wysiwyg.innerHTML = '';
	                    syncTextarea();
	                    callUpdates(true);
	                });
	            }
	        }
	
	        // Show placeholder
	        var showPlaceholder;
	        if (option_onplaceholder) {
	            var placeholder_visible = false;
	            showPlaceholder = function showPlaceholder() {
	                // Test if wysiwyg has content
	                var wysiwyg_empty = true;
	                var node = node_wysiwyg;
	                while (node) {
	                    node = nextNode(node, node_wysiwyg);
	                    // Test if node contains something visible
	                    if (!node) ;else if (node.nodeType == Node_ELEMENT_NODE) {
	                        if (node.nodeName == 'IMG') {
	                            wysiwyg_empty = false;
	                            break;
	                        }
	                    } else if (node.nodeType == Node_TEXT_NODE) {
	                        var text = node.nodeValue;
	                        if (text && text.search(/[^\s]/) != -1) {
	                            wysiwyg_empty = false;
	                            break;
	                        }
	                    }
	                }
	                if (placeholder_visible != wysiwyg_empty) {
	                    option_onplaceholder(wysiwyg_empty);
	                    placeholder_visible = wysiwyg_empty;
	                }
	            };
	            showPlaceholder();
	        }
	
	        // Handle selection
	        var popup_saved_selection = null,
	            // preserve selection during popup
	        handleSelection = null,
	            debounced_handleSelection = null;
	        if (option_onselection) {
	            handleSelection = function handleSelection(clientX, clientY, rightclick) {
	                // Detect collapsed selection
	                var collapsed = getSelectionCollapsed(node_wysiwyg);
	                // List of all selected nodes
	                var nodes = getSelectedNodes(node_wysiwyg);
	                // Rectangle of the selection
	                var rect = clientX === null || clientY === null ? null : {
	                    left: clientX,
	                    top: clientY,
	                    width: 0,
	                    height: 0
	                };
	                var selectionRect = getSelectionRect();
	                if (selectionRect) rect = selectionRect;
	                if (rect) {
	                    // So far 'rect' is relative to viewport
	                    if (node_wysiwyg.getBoundingClientRect) {
	                        // Make it relative to the editor via 'getBoundingClientRect()'
	                        var boundingrect = node_wysiwyg.getBoundingClientRect();
	                        rect.left -= parseInt(boundingrect.left);
	                        rect.top -= parseInt(boundingrect.top);
	                    } else {
	                        var node = node_wysiwyg,
	                            offsetLeft = 0,
	                            offsetTop = 0,
	                            fixed = false;
	                        do {
	                            offsetLeft += node.offsetLeft ? parseInt(node.offsetLeft) : 0;
	                            offsetTop += node.offsetTop ? parseInt(node.offsetTop) : 0;
	                            if (node.style.position == 'fixed') fixed = true;
	                        } while (node = node.offsetParent);
	                        rect.left -= offsetLeft - (fixed ? 0 : window.pageXOffset);
	                        rect.top -= offsetTop - (fixed ? 0 : window.pageYOffset);
	                    }
	                    // Trim rectangle to the editor
	                    if (rect.left < 0) rect.left = 0;
	                    if (rect.top < 0) rect.top = 0;
	                    if (rect.width > node_wysiwyg.offsetWidth) rect.width = node_wysiwyg.offsetWidth;
	                    if (rect.height > node_wysiwyg.offsetHeight) rect.height = node_wysiwyg.offsetHeight;
	                } else if (nodes.length) {
	                    // What else could we do? Offset of first element...
	                    for (var i = 0; i < nodes.length; ++i) {
	                        var node = nodes[i];
	                        if (node.nodeType != Node_ELEMENT_NODE) continue;
	                        rect = {
	                            left: node.offsetLeft,
	                            top: node.offsetTop,
	                            width: node.offsetWidth,
	                            height: node.offsetHeight
	                        };
	                        break;
	                    }
	                }
	                // Callback
	                option_onselection(collapsed, rect, nodes, rightclick);
	            };
	            debounced_handleSelection = debounce(handleSelection, 1);
	        }
	
	        // Open popup
	        var node_popup = null;
	        var popupClickClose = function popupClickClose(e) {
	            // http://www.quirksmode.org/js/events_properties.html
	            if (!e) var e = window.event;
	            var target = e.target || e.srcElement;
	            if (target.nodeType == Node_TEXT_NODE) // defeat Safari bug
	                target = target.parentNode;
	            // Click within popup?
	            if (isOrContainsNode(node_popup, target)) return;
	            // close popup
	            popupClose();
	        };
	        var popupOpen = function popupOpen() {
	            // Already open?
	            if (node_popup) return node_popup;
	
	            // Global click closes popup
	            addEvent(window_ie8, 'mousedown', popupClickClose, true);
	
	            // Create popup element
	            node_popup = document.createElement('DIV');
	            var parent = node_wysiwyg.parentNode,
	                next = node_wysiwyg.nextSibling;
	            if (next) parent.insertBefore(node_popup, next);else parent.appendChild(node_popup);
	            if (option_onopenpopup) option_onopenpopup();
	            return node_popup;
	        };
	        var popupClose = function popupClose() {
	            if (!node_popup) return;
	            node_popup.parentNode.removeChild(node_popup);
	            node_popup = null;
	            removeEvent(window_ie8, 'mousedown', popupClickClose, true);
	            if (option_onclosepopup) option_onclosepopup();
	        };
	
	        // Focus/Blur events
	        addEvent(node_wysiwyg, 'focus', function () {
	            // forward focus/blur to the textarea
	            if (node_textarea) fireEvent(node_textarea, 'focus', false);
	        });
	        addEvent(node_wysiwyg, 'blur', function () {
	            // sync textarea immediately
	            if (syncTextarea) syncTextarea();
	            // forward focus/blur to the textarea
	            if (node_textarea) fireEvent(node_textarea, 'blur', false);
	        });
	
	        // Change events
	        var debounced_changeHandler = null;
	        if (showPlaceholder || syncTextarea) {
	            // debounce 'syncTextarea' a second time, because 'innerHTML' is quite burdensome
	            var debounced_syncTextarea = syncTextarea ? debounce(syncTextarea, 250, true) : null; // high timeout is save, because of "onblur" fires immediately
	            var changeHandler = function changeHandler(e) {
	                if (showPlaceholder) showPlaceholder();
	                if (debounced_syncTextarea) debounced_syncTextarea();
	            };
	            debounced_changeHandler = debounce(changeHandler, 1);
	
	            // Catch change events
	            // http://stackoverflow.com/questions/1391278/contenteditable-change-events/1411296#1411296
	            // http://stackoverflow.com/questions/8694054/onchange-event-with-contenteditable/8694125#8694125
	            // https://github.com/mindmup/bootstrap-wysiwyg/pull/50/files
	            // http://codebits.glennjones.net/editing/events-contenteditable.htm
	            addEvent(node_wysiwyg, 'input', debounced_changeHandler);
	            addEvent(node_wysiwyg, 'DOMNodeInserted', debounced_changeHandler);
	            addEvent(node_wysiwyg, 'DOMNodeRemoved', debounced_changeHandler);
	            addEvent(node_wysiwyg, 'DOMSubtreeModified', debounced_changeHandler);
	            addEvent(node_wysiwyg, 'DOMCharacterDataModified', debounced_changeHandler); // polyfill input in IE 9-10
	            addEvent(node_wysiwyg, 'propertychange', debounced_changeHandler);
	            addEvent(node_wysiwyg, 'textInput', debounced_changeHandler);
	            addEvent(node_wysiwyg, 'paste', debounced_changeHandler);
	            addEvent(node_wysiwyg, 'cut', debounced_changeHandler);
	            addEvent(node_wysiwyg, 'drop', debounced_changeHandler);
	        }
	
	        // Key events
	        // http://sandbox.thewikies.com/html5-experiments/key-events.html
	        var keyHandler = function keyHandler(e, phase) {
	            // http://www.quirksmode.org/js/events_properties.html
	            if (!e) var e = window.event;
	            // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
	            // http://stackoverflow.com/questions/1444477/keycode-and-charcode
	            // http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
	            // http://unixpapa.com/js/key.html
	            var key = e.which || e.keyCode,
	                character = String.fromCharCode(key || e.charCode),
	                shiftKey = e.shiftKey || false,
	                altKey = e.altKey || false,
	                ctrlKey = e.ctrlKey || false,
	                metaKey = e.metaKey || false;
	            if (phase == 1) {
	                // Callback
	                if (option_onkeydown && option_onkeydown(key, character, shiftKey, altKey, ctrlKey, metaKey) === false) return cancelEvent(e); // dismiss key
	            } else if (phase == 2) {
	                // Callback
	                if (option_onkeypress && option_onkeypress(key, character, shiftKey, altKey, ctrlKey, metaKey) === false) return cancelEvent(e); // dismiss key
	            } else if (phase == 3) {
	                // Callback
	                if (option_onkeyup && option_onkeyup(key, character, shiftKey, altKey, ctrlKey, metaKey) === false) return cancelEvent(e); // dismiss key
	            }
	
	            // Keys can change the selection
	            if (phase == 2 || phase == 3) {
	                popup_saved_selection = null;
	                if (debounced_handleSelection) debounced_handleSelection(null, null, false);
	            }
	            // Most keys can cause text-changes
	            if (phase == 2 && debounced_changeHandler) {
	                switch (key) {
	                    case 33: // pageUp
	                    case 34: // pageDown
	                    case 35: // end
	                    case 36: // home
	                    case 37: // left
	                    case 38: // up
	                    case 39: // right
	                    case 40:
	                        // down
	                        // cursors do not
	                        break;
	                    default:
	                        // call change handler
	                        debounced_changeHandler();
	                        break;
	                }
	            }
	        };
	        addEvent(node_wysiwyg, 'keydown', function (e) {
	            return keyHandler(e, 1);
	        });
	        addEvent(node_wysiwyg, 'keypress', function (e) {
	            return keyHandler(e, 2);
	        });
	        addEvent(node_wysiwyg, 'keyup', function (e) {
	            return keyHandler(e, 3);
	        });
	
	        // Mouse events
	        var mouseHandler = function mouseHandler(e, rightclick) {
	            // http://www.quirksmode.org/js/events_properties.html
	            if (!e) var e = window.event;
	            // mouse position
	            var clientX = null,
	                clientY = null;
	            if (e.clientX && e.clientY) {
	                clientX = e.clientX;
	                clientY = e.clientY;
	            } else if (e.pageX && e.pageY) {
	                clientX = e.pageX - window.pageXOffset;
	                clientY = e.pageY - window.pageYOffset;
	            }
	            // mouse button
	            if (e.which && e.which == 3) rightclick = true;else if (e.button && e.button == 2) rightclick = true;
	
	            // remove event handler
	            removeEvent(window_ie8, 'mouseup', mouseHandler);
	            // Callback selection
	            popup_saved_selection = null;
	            if (!option_hijackcontextmenu && rightclick) return;
	            if (debounced_handleSelection) debounced_handleSelection(clientX, clientY, rightclick);
	        };
	        addEvent(node_wysiwyg, 'mousedown', function (e) {
	            // catch event if 'mouseup' outside 'node_wysiwyg'
	            removeEvent(window_ie8, 'mouseup', mouseHandler);
	            addEvent(window_ie8, 'mouseup', mouseHandler);
	        });
	        addEvent(node_wysiwyg, 'mouseup', function (e) {
	            mouseHandler(e);
	            // Trigger change
	            if (debounced_changeHandler) debounced_changeHandler();
	        });
	        addEvent(node_wysiwyg, 'dblclick', function (e) {
	            mouseHandler(e);
	        });
	        addEvent(node_wysiwyg, 'selectionchange', function (e) {
	            mouseHandler(e);
	        });
	        if (option_hijackcontextmenu) {
	            addEvent(node_wysiwyg, 'contextmenu', function (e) {
	                mouseHandler(e, true);
	                return cancelEvent(e);
	            });
	        }
	
	        // exec command
	        // https://developer.mozilla.org/en-US/docs/Web/API/document.execCommand
	        // http://www.quirksmode.org/dom/execCommand.html
	        var execCommand = function execCommand(command, param, force_selection) {
	            // give selection to contenteditable element
	            restoreSelection(node_wysiwyg, popup_saved_selection);
	            // tried to avoid forcing focus(), but ... - https://github.com/wysiwygjs/wysiwyg.js/issues/51
	            node_wysiwyg.focus();
	            if (!selectionInside(node_wysiwyg, force_selection)) // returns 'selection inside editor'
	                return false;
	
	            // for webkit, mozilla, opera
	            if (window.getSelection) {
	                // Buggy, call within 'try/catch'
	                try {
	                    if (document.queryCommandSupported && !document.queryCommandSupported(command)) return false;
	                    return document.execCommand(command, false, param);
	                } catch (e) {}
	            }
	            // for IE
	            else if (document.selection) {
	                    var sel = document.selection;
	                    if (sel.type != 'None') {
	                        var range = sel.createRange();
	                        // Buggy, call within 'try/catch'
	                        try {
	                            if (!range.queryCommandEnabled(command)) return false;
	                            return range.execCommand(command, false, param);
	                        } catch (e) {}
	                    }
	                }
	            return false;
	        };
	
	        // Workaround IE11 - https://github.com/wysiwygjs/wysiwyg.js/issues/14
	        var trailingDiv = null;
	        var IEtrailingDIV = function IEtrailingDIV() {
	            // Detect IE - http://stackoverflow.com/questions/17907445/how-to-detect-ie11
	            if (document.all || !!window.MSInputMethodContext) {
	                trailingDiv = document.createElement('DIV');
	                node_wysiwyg.appendChild(trailingDiv);
	            }
	        };
	        // Command structure
	        callUpdates = function callUpdates(selection_destroyed) {
	            // Remove IE11 workaround
	            if (trailingDiv) {
	                node_wysiwyg.removeChild(trailingDiv);
	                trailingDiv = null;
	            }
	            // change-handler
	            if (debounced_changeHandler) debounced_changeHandler();
	            // handle saved selection
	            if (selection_destroyed) {
	                collapseSelectionEnd();
	                popup_saved_selection = null; // selection destroyed
	            } else if (popup_saved_selection) popup_saved_selection = saveSelection(node_wysiwyg);
	        };
	        return {
	            // properties
	            getElement: function getElement() {
	                return node_wysiwyg;
	            },
	            getHTML: function getHTML() {
	                return node_wysiwyg.innerHTML;
	            },
	            setHTML: function setHTML(html) {
	                node_wysiwyg.innerHTML = html || '<br>';
	                callUpdates(true); // selection destroyed
	                return this;
	            },
	            getSelectedHTML: function getSelectedHTML() {
	                restoreSelection(node_wysiwyg, popup_saved_selection);
	                if (!selectionInside(node_wysiwyg)) return null;
	                return getSelectionHtml(node_wysiwyg);
	            },
	            sync: function sync() {
	                if (syncTextarea) syncTextarea();
	                return this;
	            },
	            readOnly: function readOnly(readonly) {
	                // query read-only
	                if (readonly === undefined) return node_wysiwyg.hasAttribute ? !node_wysiwyg.hasAttribute('contentEditable') : !node_wysiwyg.getAttribute('contentEditable'); // IE7
	                // set read-only
	                if (readonly) node_wysiwyg.removeAttribute('contentEditable');else node_wysiwyg.setAttribute('contentEditable', 'true'); // IE7 is case sensitive
	                return this;
	            },
	            // selection and popup
	            collapseSelection: function collapseSelection() {
	                collapseSelectionEnd();
	                popup_saved_selection = null; // selection destroyed
	                return this;
	            },
	            expandSelection: function expandSelection(preceding, following) {
	                restoreSelection(node_wysiwyg, popup_saved_selection);
	                if (!selectionInside(node_wysiwyg)) return this;
	                expandSelectionCaret(node_wysiwyg, preceding, following);
	                popup_saved_selection = saveSelection(node_wysiwyg); // save new selection
	                return this;
	            },
	            openPopup: function openPopup() {
	                if (!popup_saved_selection) popup_saved_selection = saveSelection(node_wysiwyg); // save current selection
	                return popupOpen();
	            },
	            closePopup: function closePopup() {
	                popupClose();
	                return this;
	            },
	            removeFormat: function removeFormat() {
	                execCommand('removeFormat');
	                execCommand('unlink');
	                callUpdates();
	                return this;
	            },
	            bold: function bold() {
	                execCommand('bold');
	                callUpdates();
	                return this;
	            },
	            italic: function italic() {
	                execCommand('italic');
	                callUpdates();
	                return this;
	            },
	            underline: function underline() {
	                execCommand('underline');
	                callUpdates();
	                return this;
	            },
	            strikethrough: function strikethrough() {
	                execCommand('strikeThrough');
	                callUpdates();
	                return this;
	            },
	            forecolor: function forecolor(color) {
	                execCommand('foreColor', color);
	                callUpdates();
	                return this;
	            },
	            highlight: function highlight(color) {
	                // http://stackoverflow.com/questions/2756931/highlight-the-text-of-the-dom-range-element
	                if (!execCommand('hiliteColor', color)) // some browsers apply 'backColor' to the whole block
	                    execCommand('backColor', color);
	                callUpdates();
	                return this;
	            },
	            fontName: function fontName(name) {
	                execCommand('fontName', name);
	                callUpdates();
	                return this;
	            },
	            fontSize: function fontSize(size) {
	                execCommand('fontSize', size);
	                callUpdates();
	                return this;
	            },
	            subscript: function subscript() {
	                execCommand('subscript');
	                callUpdates();
	                return this;
	            },
	            superscript: function superscript() {
	                execCommand('superscript');
	                callUpdates();
	                return this;
	            },
	            align: function align(_align) {
	                IEtrailingDIV();
	                if (_align == 'left') execCommand('justifyLeft');else if (_align == 'center') execCommand('justifyCenter');else if (_align == 'right') execCommand('justifyRight');else if (_align == 'justify') execCommand('justifyFull');
	                callUpdates();
	                return this;
	            },
	            format: function format(tagname) {
	                IEtrailingDIV();
	                execCommand('formatBlock', tagname);
	                callUpdates();
	                return this;
	            },
	            indent: function indent(outdent) {
	                IEtrailingDIV();
	                execCommand(outdent ? 'outdent' : 'indent');
	                callUpdates();
	                return this;
	            },
	            insertLink: function insertLink(url) {
	                execCommand('createLink', url);
	                callUpdates(true); // selection destroyed
	                return this;
	            },
	            insertImage: function insertImage(url) {
	                execCommand('insertImage', url, true);
	                callUpdates(true); // selection destroyed
	                return this;
	            },
	            insertHTML: function insertHTML(html) {
	                if (!execCommand('insertHTML', html, true)) {
	                    // IE 11 still does not support 'insertHTML'
	                    restoreSelection(node_wysiwyg, popup_saved_selection);
	                    selectionInside(node_wysiwyg, true);
	                    pasteHtmlAtCaret(node_wysiwyg, html);
	                }
	                callUpdates(true); // selection destroyed
	                return this;
	            },
	            insertList: function insertList(ordered) {
	                IEtrailingDIV();
	                execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList');
	                callUpdates();
	                return this;
	            }
	        };
	    };
	
	    return wysiwyg;
	});

/***/ },

/***/ 414:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	(function (factory) {
	    'use strict';
	
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(239)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($) {
	            return factory(window, document, $);
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== 'undefined') {
	        module.exports = factory(window, document, require('jquery'));
	    } else {
	        return factory(window, document, jQuery);
	    }
	})(function (window, document, $) {
	    'use strict';
	
	    // http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
	
	    var HSVtoRGB = function HSVtoRGB(h, s, v) {
	        var r, g, b, i, f, p, q, t;
	        i = Math.floor(h * 6);
	        f = h * 6 - i;
	        p = v * (1 - s);
	        q = v * (1 - f * s);
	        t = v * (1 - (1 - f) * s);
	        switch (i % 6) {
	            case 0:
	                r = v, g = t, b = p;break;
	            case 1:
	                r = q, g = v, b = p;break;
	            case 2:
	                r = p, g = v, b = t;break;
	            case 3:
	                r = p, g = q, b = v;break;
	            case 4:
	                r = t, g = p, b = v;break;
	            case 5:
	                r = v, g = p, b = q;break;
	        }
	        var hr = Math.floor(r * 255).toString(16);
	        var hg = Math.floor(g * 255).toString(16);
	        var hb = Math.floor(b * 255).toString(16);
	        return '#' + (hr.length < 2 ? '0' : '') + hr + (hg.length < 2 ? '0' : '') + hg + (hb.length < 2 ? '0' : '') + hb;
	    };
	
	    // Encode htmlentities() - http://stackoverflow.com/questions/5499078/fastest-method-to-escape-html-tags-as-html-entities
	    var html_encode = function html_encode(string) {
	        return string.replace(/[&<>"]/g, function (tag) {
	            var charsToReplace = {
	                '&': '&amp;',
	                '<': '&lt;',
	                '>': '&gt;',
	                '"': '&quot;'
	            };
	            return charsToReplace[tag] || tag;
	        });
	    };
	
	    // Create the Editor
	    var create_editor = function create_editor($textarea, classes, placeholder, toolbar_position, toolbar_buttons, toolbar_submit, label_selectImage, placeholder_url, placeholder_embed, max_imagesize, filter_imageType, on_imageupload, force_imageupload, video_from_url, on_keydown, on_keypress, on_keyup, on_autocomplete) {
	        // Content: Insert link
	        var wysiwygeditor_insertLink = function wysiwygeditor_insertLink(wysiwygeditor, url) {
	            if (!url) ;else if (wysiwygeditor.getSelectedHTML()) wysiwygeditor.insertLink(url);else wysiwygeditor.insertHTML('<a href="' + html_encode(url) + '">' + html_encode(url) + '</a>');
	            wysiwygeditor.closePopup().collapseSelection();
	        };
	        var content_insertlink = function content_insertlink(wysiwygeditor, $modify_link) {
	            var $inputurl = $('<input type="text" value="">').val($modify_link ? $modify_link.attr('href') : '') // prop('href') does not reflect real value
	            .addClass('wysiwyg-input').keypress(function (event) {
	                if (event.which != 10 && event.which != 13) return;
	                if ($modify_link) {
	                    $modify_link.prop('href', $inputurl.val());
	                    wysiwygeditor.closePopup().collapseSelection();
	                } else wysiwygeditor_insertLink(wysiwygeditor, $inputurl.val());
	            });
	            if (placeholder_url) $inputurl.prop('placeholder', placeholder_url);
	            var $okaybutton = $();
	            if (toolbar_submit) $okaybutton = toolbar_button(toolbar_submit).click(function (event) {
	                if ($modify_link) {
	                    $modify_link.prop('href', $inputurl.val());
	                    wysiwygeditor.closePopup().collapseSelection();
	                } else wysiwygeditor_insertLink(wysiwygeditor, $inputurl.val());
	                event.stopPropagation();
	                event.preventDefault();
	                return false;
	            });
	            var $content = $('<div/>').addClass('wysiwyg-toolbar-form').prop('unselectable', 'on');
	            $content.append($inputurl).append($okaybutton);
	            return $content;
	        };
	
	        // Content: Insert image
	        var content_insertimage = function content_insertimage(wysiwygeditor) {
	            // Add image to editor
	            var insert_image_wysiwyg = function insert_image_wysiwyg(url, filename) {
	                var html = '<img id="wysiwyg-insert-image" src="" alt=""' + (filename ? ' title="' + html_encode(filename) + '"' : '') + '>';
	                wysiwygeditor.insertHTML(html).closePopup().collapseSelection();
	                var $image = $('#wysiwyg-insert-image').removeAttr('id');
	                if (max_imagesize) {
	                    $image.css({ maxWidth: max_imagesize[0] + 'px',
	                        maxHeight: max_imagesize[1] + 'px' }).load(function () {
	                        $image.css({ maxWidth: '',
	                            maxHeight: '' });
	                        // Resize $image to fit "clip-image"
	                        var image_width = $image.width(),
	                            image_height = $image.height();
	                        if (image_width > max_imagesize[0] || image_height > max_imagesize[1]) {
	                            if (image_width / image_height > max_imagesize[0] / max_imagesize[1]) {
	                                image_height = parseInt(image_height / image_width * max_imagesize[0]);
	                                image_width = max_imagesize[0];
	                            } else {
	                                image_width = parseInt(image_width / image_height * max_imagesize[1]);
	                                image_height = max_imagesize[1];
	                            }
	                            $image.prop('width', image_width).prop('height', image_height);
	                        }
	                    });
	                }
	                $image.prop('src', url);
	            };
	            // Create popup
	            var $content = $('<div/>').addClass('wysiwyg-toolbar-form').prop('unselectable', 'on');
	            // Add image via 'Browse...'
	            var $fileuploader = null,
	                $fileuploader_input = $('<input type="file">').css({ position: 'absolute',
	                left: 0,
	                top: 0,
	                width: '100%',
	                height: '100%',
	                opacity: 0,
	                cursor: 'pointer' });
	            if (!force_imageupload && window.File && window.FileReader && window.FileList) {
	                // File-API
	                var loadImageFromFile = function loadImageFromFile(file) {
	                    // Only process image files
	                    if (typeof filter_imageType === 'function' && !filter_imageType(file)) return;else if (!file.type.match(filter_imageType)) return;
	                    var reader = new FileReader();
	                    reader.onload = function (event) {
	                        var dataurl = event.target.result;
	                        insert_image_wysiwyg(dataurl, file.name);
	                    };
	                    // Read in the image file as a data URL
	                    reader.readAsDataURL(file);
	                };
	                $fileuploader = $fileuploader_input.prop('draggable', 'true').change(function (event) {
	                    var files = event.target.files; // FileList object
	                    for (var i = 0; i < files.length; ++i) {
	                        loadImageFromFile(files[i]);
	                    }
	                }).on('dragover', function (event) {
	                    event.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	                    event.stopPropagation();
	                    event.preventDefault();
	                    return false;
	                }).on('drop', function (event) {
	                    var files = event.originalEvent.dataTransfer.files; // FileList object.
	                    for (var i = 0; i < files.length; ++i) {
	                        loadImageFromFile(files[i]);
	                    }event.stopPropagation();
	                    event.preventDefault();
	                    return false;
	                });
	            } else if (on_imageupload) {
	                // Upload image to a server
	                var $input = $fileuploader_input.change(function (event) {
	                    on_imageupload.call(this, insert_image_wysiwyg);
	                });
	                $fileuploader = $('<form/>').append($input);
	            }
	            if ($fileuploader) $('<div/>').addClass('wysiwyg-browse').html(label_selectImage).append($fileuploader).appendTo($content);
	            // Add image via 'URL'
	            var $inputurl = $('<input type="text" value="">').addClass('wysiwyg-input').keypress(function (event) {
	                if (event.which == 10 || event.which == 13) insert_image_wysiwyg($inputurl.val());
	            });
	            if (placeholder_url) $inputurl.prop('placeholder', placeholder_url);
	            var $okaybutton = $();
	            if (toolbar_submit) $okaybutton = toolbar_button(toolbar_submit).click(function (event) {
	                insert_image_wysiwyg($inputurl.val());
	                event.stopPropagation();
	                event.preventDefault();
	                return false;
	            });
	            $content.append($('<div/>').append($inputurl).append($okaybutton));
	            return $content;
	        };
	
	        // Content: Insert video
	        var content_insertvideo = function content_insertvideo(wysiwygeditor) {
	            // Add video to editor
	            var insert_video_wysiwyg = function insert_video_wysiwyg(url, html) {
	                url = $.trim(url || '');
	                html = $.trim(html || '');
	                var website_url = false;
	                if (url.length && !html.length) website_url = url;else if (html.indexOf('<') == -1 && html.indexOf('>') == -1 && html.match(/^(?:https?:\/)?\/?(?:[^:\/\s]+)(?:(?:\/\w+)*\/)(?:[\w\-\.]+[^#?\s]+)(?:.*)?(?:#[\w\-]+)?$/)) website_url = html;
	                if (website_url && video_from_url) html = video_from_url(website_url) || '';
	                if (!html.length && website_url) html = '<video src="' + html_encode(website_url) + '">';
	                wysiwygeditor.insertHTML(html).closePopup().collapseSelection();
	            };
	            // Create popup
	            var $content = $('<div/>').addClass('wysiwyg-toolbar-form').prop('unselectable', 'on');
	            // Add video via '<embed/>'
	            var $textareaembed = $('<textarea>').addClass('wysiwyg-input wysiwyg-inputtextarea');
	            if (placeholder_embed) $textareaembed.prop('placeholder', placeholder_embed);
	            $('<div/>').addClass('wysiwyg-embedcode').append($textareaembed).appendTo($content);
	            // Add video via 'URL'
	            var $inputurl = $('<input type="text" value="">').addClass('wysiwyg-input').keypress(function (event) {
	                if (event.which == 10 || event.which == 13) insert_video_wysiwyg($inputurl.val());
	            });
	            if (placeholder_url) $inputurl.prop('placeholder', placeholder_url);
	            var $okaybutton = $();
	            if (toolbar_submit) $okaybutton = toolbar_button(toolbar_submit).click(function (event) {
	                insert_video_wysiwyg($inputurl.val(), $textareaembed.val());
	                event.stopPropagation();
	                event.preventDefault();
	                return false;
	            });
	            $content.append($('<div/>').append($inputurl).append($okaybutton));
	            return $content;
	        };
	
	        // Content: Color palette
	        var content_colorpalette = function content_colorpalette(wysiwygeditor, forecolor) {
	            var $content = $('<table/>').prop('cellpadding', '0').prop('cellspacing', '0').prop('unselectable', 'on');
	            for (var row = 1; row < 15; ++row) // should be '16' - but last line looks so dark
	            {
	                var $rows = $('<tr/>');
	                for (var col = 0; col < 25; ++col) // last column is grayscale
	                {
	                    var color;
	                    if (col == 24) {
	                        var gray = Math.floor(255 / 13 * (14 - row)).toString(16);
	                        var hexg = (gray.length < 2 ? '0' : '') + gray;
	                        color = '#' + hexg + hexg + hexg;
	                    } else {
	                        var hue = col / 24;
	                        var saturation = row <= 8 ? row / 8 : 1;
	                        var value = row > 8 ? (16 - row) / 8 : 1;
	                        color = HSVtoRGB(hue, saturation, value);
	                    }
	                    $('<td/>').addClass('wysiwyg-toolbar-color').prop('title', color).prop('unselectable', 'on').css({ backgroundColor: color }).click(function () {
	                        var color = this.title;
	                        if (forecolor) wysiwygeditor.forecolor(color).closePopup().collapseSelection();else wysiwygeditor.highlight(color).closePopup().collapseSelection();
	                        return false;
	                    }).appendTo($rows);
	                }
	                $content.append($rows);
	            }
	            return $content;
	        };
	
	        // Handlers
	        var get_toolbar_handler = function get_toolbar_handler(name, popup_callback) {
	            switch (name) {
	                case 'insertimage':
	                    if (!popup_callback) return null;
	                    return function (target) {
	                        popup_callback(content_insertimage(wysiwygeditor), target);
	                    };
	                case 'insertvideo':
	                    if (!popup_callback) return null;
	                    return function (target) {
	                        popup_callback(content_insertvideo(wysiwygeditor), target);
	                    };
	                case 'insertlink':
	                    if (!popup_callback) return null;
	                    return function (target) {
	                        popup_callback(content_insertlink(wysiwygeditor), target);
	                    };
	                case 'bold':
	                    return function () {
	                        wysiwygeditor.bold(); // .closePopup().collapseSelection()
	                    };
	                case 'italic':
	                    return function () {
	                        wysiwygeditor.italic(); // .closePopup().collapseSelection()
	                    };
	                case 'underline':
	                    return function () {
	                        wysiwygeditor.underline(); // .closePopup().collapseSelection()
	                    };
	                case 'strikethrough':
	                    return function () {
	                        wysiwygeditor.strikethrough(); // .closePopup().collapseSelection()
	                    };
	                case 'forecolor':
	                    if (!popup_callback) return null;
	                    return function (target) {
	                        popup_callback(content_colorpalette(wysiwygeditor, true), target);
	                    };
	                case 'highlight':
	                    if (!popup_callback) return null;
	                    return function (target) {
	                        popup_callback(content_colorpalette(wysiwygeditor, false), target);
	                    };
	                case 'alignleft':
	                    return function () {
	                        wysiwygeditor.align('left'); // .closePopup().collapseSelection()
	                    };
	                case 'aligncenter':
	                    return function () {
	                        wysiwygeditor.align('center'); // .closePopup().collapseSelection()
	                    };
	                case 'alignright':
	                    return function () {
	                        wysiwygeditor.align('right'); // .closePopup().collapseSelection()
	                    };
	                case 'alignjustify':
	                    return function () {
	                        wysiwygeditor.align('justify'); // .closePopup().collapseSelection()
	                    };
	                case 'subscript':
	                    return function () {
	                        wysiwygeditor.subscript(); // .closePopup().collapseSelection()
	                    };
	                case 'superscript':
	                    return function () {
	                        wysiwygeditor.superscript(); // .closePopup().collapseSelection()
	                    };
	                case 'indent':
	                    return function () {
	                        wysiwygeditor.indent(); // .closePopup().collapseSelection()
	                    };
	                case 'outdent':
	                    return function () {
	                        wysiwygeditor.indent(true); // .closePopup().collapseSelection()
	                    };
	                case 'orderedList':
	                    return function () {
	                        wysiwygeditor.insertList(true); // .closePopup().collapseSelection()
	                    };
	                case 'unorderedList':
	                    return function () {
	                        wysiwygeditor.insertList(); // .closePopup().collapseSelection()
	                    };
	                case 'removeformat':
	                    return function () {
	                        wysiwygeditor.removeFormat().closePopup().collapseSelection();
	                    };
	            }
	            return null;
	        };
	
	        // Create the toolbar
	        var toolbar_button = function toolbar_button(button) {
	            var $element = $('<a/>').addClass('wysiwyg-toolbar-icon').prop('href', '#').prop('unselectable', 'on').append(button.image);
	            // pass other properties as "prop()"
	            $.each(button, function (name, value) {
	                switch (name) {
	                    // classes
	                    case 'class':
	                        $element.addClass(value);
	                        break;
	                    // special meaning
	                    case 'image':
	                    case 'html':
	                    case 'popup':
	                    case 'click':
	                    case 'showstatic':
	                    case 'showselection':
	                        break;
	                    default:
	                        // button.title, ...
	                        $element.attr(name, value);
	                        break;
	                }
	            });
	            return $element;
	        };
	        var add_buttons_to_toolbar = function add_buttons_to_toolbar($toolbar, selection, popup_open_callback, popup_position_callback) {
	            $.each(toolbar_buttons, function (key, value) {
	                if (!value) return;
	                // Skip buttons on the toolbar
	                if (selection === false && 'showstatic' in value && !value.showstatic) return;
	                // Skip buttons on selection
	                if (selection === true && 'showselection' in value && !value.showselection) return;
	                // Click handler
	                var toolbar_handler;
	                if ('click' in value) toolbar_handler = function toolbar_handler(target) {
	                    value.click($(target));
	                };else if ('popup' in value) toolbar_handler = function toolbar_handler(target) {
	                    var $popup = popup_open_callback();
	                    var overwrite_offset = value.popup($popup, $(target));
	                    popup_position_callback($popup, target, overwrite_offset);
	                };else toolbar_handler = get_toolbar_handler(key, function ($content, target) {
	                    var $popup = popup_open_callback();
	                    $popup.append($content);
	                    popup_position_callback($popup, target);
	                    $popup.find('input[type=text]:first').focus();
	                });
	                // Create the toolbar button
	                var $button;
	                if (toolbar_handler) $button = toolbar_button(value).click(function (event) {
	                    toolbar_handler(event.currentTarget);
	                    // Give the focus back to the editor. Technically not necessary
	                    if (get_toolbar_handler(key)) // only if not a popup-handler
	                        wysiwygeditor.getElement().focus();
	                    event.stopPropagation();
	                    event.preventDefault();
	                    return false;
	                });else if (value.html) $button = $(value.html);
	                if ($button) $toolbar.append($button);
	            });
	        };
	        var popup_position = function popup_position($popup, $container, left, top) // left+top relative to $container
	        {
	            // Test parents
	            var container_node = $container.get(0),
	                offsetparent = container_node.offsetParent,
	                offsetparent_left = 0,
	                offsetparent_top = 0,
	                offsetparent_break = false,
	                offsetparent_window_left = 0,
	                //$.offset() does not work with Safari 3 and 'position:fixed'
	            offsetparent_window_top = 0,
	                offsetparent_fixed = false,
	                offsetparent_overflow = false,
	                popup_width = $popup.width(),
	                node = offsetparent;
	            while (node) {
	                offsetparent_window_left += node.offsetLeft;
	                offsetparent_window_top += node.offsetTop;
	                var $node = $(node),
	                    node_position = $node.css('position');
	                if (node_position != 'static') offsetparent_break = true;else if (!offsetparent_break) {
	                    offsetparent_left += node.offsetLeft;
	                    offsetparent_top += node.offsetTop;
	                }
	                if (node_position == 'fixed') offsetparent_fixed = true;
	                if ($node.css('overflow') != 'visible') offsetparent_overflow = true;
	                node = node.offsetParent;
	            }
	            // Move $popup as high as possible in the DOM tree: offsetParent of $container
	            var $offsetparent = $(offsetparent || document.body);
	            $offsetparent.append($popup);
	            left += offsetparent_left + container_node.offsetLeft; // $container.position() does not work with Safari 3
	            top += offsetparent_top + container_node.offsetTop;
	            // Trim to offset-parent
	            if (offsetparent_fixed || offsetparent_overflow) {
	                if (left + popup_width > $offsetparent.width() - 1) left = $offsetparent.width() - popup_width - 1;
	                if (left < 1) left = 1;
	            }
	            // Trim to viewport
	            var viewport_width = $(window).width();
	            if (offsetparent_window_left + left + popup_width > viewport_width - 1) left = viewport_width - offsetparent_window_left - popup_width - 1;
	            var scroll_left = offsetparent_fixed ? 0 : $(window).scrollLeft();
	            if (offsetparent_window_left + left < scroll_left + 1) left = scroll_left - offsetparent_window_left + 1;
	            // Set offset
	            $popup.css({ left: parseInt(left) + 'px',
	                top: parseInt(top) + 'px' });
	        };
	
	        // Transform the textarea to contenteditable
	        var hotkeys = {},
	            autocomplete = null;
	        var create_wysiwyg = function create_wysiwyg($textarea, $editor, $container, $placeholder) {
	            var handle_autocomplete = function handle_autocomplete(keypress, key, character, shiftKey, altKey, ctrlKey, metaKey) {
	                if (!on_autocomplete) return;
	                var typed = autocomplete || '';
	                switch (key) {
	                    case 8:
	                        // backspace
	                        typed = typed.substring(0, typed.length - 1);
	                    // fall through
	                    case 13: // enter
	                    case 27: // escape
	                    case 33: // pageUp
	                    case 34: // pageDown
	                    case 35: // end
	                    case 36: // home
	                    case 37: // left
	                    case 38: // up
	                    case 39: // right
	                    case 40:
	                        // down
	                        if (keypress) return;
	                        character = false;
	                        break;
	                    default:
	                        if (!keypress) return;
	                        typed += character;
	                        break;
	                }
	                var rc = on_autocomplete(typed, key, character, shiftKey, altKey, ctrlKey, metaKey);
	                if ((typeof rc === 'undefined' ? 'undefined' : _typeof(rc)) == 'object' && rc.length) {
	                    // Show autocomplete
	                    var $popup = $(wysiwygeditor.openPopup());
	                    $popup.hide().addClass('wysiwyg-popup wysiwyg-popuphover') // show later
	                    .empty().append(rc);
	                    autocomplete = typed;
	                } else {
	                    // Hide autocomplete
	                    wysiwygeditor.closePopup();
	                    autocomplete = null;
	                    return rc; // swallow key if 'false'
	                }
	            };
	
	            // Options to wysiwyg.js
	            var option = {
	                element: $textarea.get(0),
	                contenteditable: $editor ? $editor.get(0) : null,
	                onKeyDown: function onKeyDown(key, character, shiftKey, altKey, ctrlKey, metaKey) {
	                    // Ask master
	                    if (on_keydown && on_keydown(key, character, shiftKey, altKey, ctrlKey, metaKey) === false) return false; // swallow key
	                    // Exec hotkey (onkeydown because e.g. CTRL+B would oben the bookmarks)
	                    if (character && !shiftKey && !altKey && ctrlKey && !metaKey) {
	                        var hotkey = character.toLowerCase();
	                        if (!hotkeys[hotkey]) return;
	                        hotkeys[hotkey]();
	                        return false; // prevent default
	                    }
	                    // Handle autocomplete
	                    return handle_autocomplete(false, key, character, shiftKey, altKey, ctrlKey, metaKey);
	                },
	                onKeyPress: function onKeyPress(key, character, shiftKey, altKey, ctrlKey, metaKey) {
	                    // Ask master
	                    if (on_keypress && on_keypress(key, character, shiftKey, altKey, ctrlKey, metaKey) === false) return false; // swallow key
	                    // Handle autocomplete
	                    return handle_autocomplete(true, key, character, shiftKey, altKey, ctrlKey, metaKey);
	                },
	                onKeyUp: function onKeyUp(key, character, shiftKey, altKey, ctrlKey, metaKey) {
	                    // Ask master
	                    if (on_keyup && on_keyup(key, character, shiftKey, altKey, ctrlKey, metaKey) === false) return false; // swallow key
	                },
	                onSelection: function onSelection(collapsed, rect, nodes, rightclick) {
	                    var show_popup = true,
	                        $special_popup = null;
	                    // Click on a link opens the link-popup
	                    if (collapsed) $.each(nodes, function (index, node) {
	                        var $link = $(node).closest('a');
	                        if ($link.length != 0) {
	                            // only clicks on text-nodes
	                            $special_popup = content_insertlink(wysiwygeditor, $link);
	                            return false; // break
	                        }
	                    });
	                    // Read-Only?
	                    if (wysiwygeditor.readOnly()) show_popup = false;
	                    // Fix type error - https://github.com/wysiwygjs/wysiwyg.js/issues/4
	                    else if (!rect) show_popup = false;
	                        // Force a special popup?
	                        else if ($special_popup) ;
	                            // A right-click always opens the popup
	                            else if (rightclick) ;
	                                // Autocomplete popup?
	                                else if (autocomplete) ;
	                                    // No selection-popup wanted?
	                                    else if ($.inArray('selection', toolbar_position.split('-')) == -1) show_popup = false;
	                                        // Selected popup wanted, but nothing selected (=selection collapsed)
	                                        else if (collapsed) show_popup = false;
	                                            // Only one image? Better: Display a special image-popup
	                                            else if (nodes.length == 1 && nodes[0].nodeName == 'IMG') // nodes is not a sparse array
	                                                    show_popup = false;
	                    if (!show_popup) {
	                        wysiwygeditor.closePopup();
	                        return;
	                    }
	                    // Popup position
	                    var $popup;
	                    var apply_popup_position = function apply_popup_position() {
	                        var popup_width = $popup.outerWidth();
	                        // Point is the center of the selection - relative to $parent not the element
	                        var $parent = $textarea.parent(),
	                            container_offset = $parent.offset(),
	                            editor_offset = $(wysiwygeditor.getElement()).offset();
	                        var left = rect.left + parseInt(rect.width / 2) - parseInt(popup_width / 2) + editor_offset.left - container_offset.left;
	                        var top = rect.top + rect.height + editor_offset.top - container_offset.top;
	                        popup_position($popup, $parent, left, top);
	                    };
	                    // Open popup
	                    $popup = $(wysiwygeditor.openPopup());
	                    // if wrong popup -> close and open a new one
	                    if (!$popup.hasClass('wysiwyg-popuphover') || !$popup.data('wysiwygjs-special') != !$special_popup) $popup = $(wysiwygeditor.closePopup().openPopup());
	                    if (autocomplete) $popup.show();else if (!$popup.hasClass('wysiwyg-popup')) {
	                        // add classes + buttons
	                        $popup.addClass('wysiwyg-popup wysiwyg-popuphover');
	                        if ($special_popup) $popup.empty().append($special_popup).data('wysiwygjs-special', true);else add_buttons_to_toolbar($popup, true, function () {
	                            return $popup.empty();
	                        }, apply_popup_position);
	                    }
	                    // Apply position
	                    apply_popup_position();
	                },
	                onOpenpopup: function onOpenpopup() {
	                    add_class_active();
	                },
	                onClosepopup: function onClosepopup() {
	                    autocomplete = null;
	                    remove_class_active();
	                },
	                hijackContextmenu: toolbar_position == 'selection',
	                readOnly: !!$textarea.prop('readonly')
	            };
	            if ($placeholder) {
	                option.onPlaceholder = function (visible) {
	                    if (visible) $placeholder.show();else $placeholder.hide();
	                };
	            }
	
	            var wysiwygeditor = wysiwyg(option);
	            return wysiwygeditor;
	        };
	
	        // Create a container if it does not exist yet
	        var $container = $textarea.closest('.wysiwyg-container');
	        if ($container.length == 0) {
	            $container = $('<div/>').addClass('wysiwyg-container');
	            if (classes) $container.addClass(classes);
	            $textarea.wrap($container);
	            $container = $textarea.closest('.wysiwyg-container');
	        }
	
	        // Create the placeholder if it does not exist yet and we want one
	        var $wrapper = $textarea.closest('.wysiwyg-wrapper');
	        if (placeholder && $wrapper.length == 0) {
	            $wrapper = $('<div/>').addClass('wysiwyg-wrapper');
	            $textarea.wrap($wrapper);
	            $wrapper = $textarea.closest('.wysiwyg-wrapper');
	        }
	        var $placeholder = null;
	        if ($wrapper.length != 0) $placeholder = $wrapper.find('.wysiwyg-placeholder');
	        if (placeholder && (!$placeholder || $placeholder.length == 0)) {
	            $placeholder = $('<div/>').addClass('wysiwyg-placeholder').html(placeholder).hide();
	            $wrapper.prepend($placeholder);
	        }
	
	        // Create the WYSIWYG Editor
	        var $editor = $container.find('.wysiwyg-editor');
	        if ($editor.length == 0) $editor = null;
	        var wysiwygeditor = create_wysiwyg($textarea, $editor, $container, $placeholder);
	        if (wysiwygeditor.legacy) {
	            if ($editor) $editor.hide();
	            if ($placeholder) $placeholder.hide();
	            var $textarea = $(wysiwygeditor.getElement());
	            $textarea.show().addClass('wysiwyg-textarea');
	            if ($textarea.is(':visible')) // inside the DOM
	                $textarea.width($container.width() - ($textarea.outerWidth() - $textarea.width()));
	        } else {
	            if (!$editor) $(wysiwygeditor.getElement()).addClass('wysiwyg-editor');
	
	            // Clicking the placeholder -> focus editor - fixes IE6-IE8
	            $wrapper.click(function () {
	                wysiwygeditor.getElement().focus();
	            });
	
	            // Support ':active'-class
	            var remove_active_timeout = null,
	                initialize_toolbar = null;
	            var add_class_active = function add_class_active() {
	                if (remove_active_timeout) clearTimeout(remove_active_timeout);
	                remove_active_timeout = null;
	                if (initialize_toolbar) {
	                    initialize_toolbar();
	                    initialize_toolbar = null;
	                }
	                $container.addClass('wysiwyg-active');
	                $container.find('.wysiwyg-toolbar-focus').slideDown(200);
	            };
	            var remove_class_active = function remove_class_active() {
	                if (remove_active_timeout || document.activeElement == wysiwygeditor.getElement()) return;
	                remove_active_timeout = setTimeout(function () {
	                    remove_active_timeout = null;
	                    $container.removeClass('wysiwyg-active');
	                    if ($.trim(wysiwygeditor.getHTML().replace(/<br\s*[\/]?>/gi, '')).length == 0) $container.find('.wysiwyg-toolbar-focus').slideUp(200);
	                }, 100);
	            };
	            $(wysiwygeditor.getElement()).focus(add_class_active).blur(remove_class_active);
	            $textarea.closest('form').on('reset', remove_class_active);
	
	            // Hotkey+Commands-List
	            var commands = {};
	            $.each(toolbar_buttons, function (key, value) {
	                if (!value || !value.hotkey) return;
	                var toolbar_handler = get_toolbar_handler(key);
	                if (!toolbar_handler) return;
	                hotkeys[value.hotkey.toLowerCase()] = toolbar_handler;
	                commands[key] = toolbar_handler;
	            });
	
	            // Toolbar on top or bottom
	            if (!$.isEmptyObject(toolbar_buttons) && toolbar_position != 'selection') {
	                var toolbar_top = $.inArray('top', toolbar_position.split('-')) != -1;
	                var toolbar_focus = $.inArray('focus', toolbar_position.split('-')) != -1;
	                // Callback to create toolbar on demand
	                var create_toolbar = function create_toolbar() {
	                    var $toolbar = $('<div/>').addClass('wysiwyg-toolbar').addClass(toolbar_top ? 'wysiwyg-toolbar-top' : 'wysiwyg-toolbar-bottom');
	                    if (toolbar_focus) $toolbar.hide().addClass('wysiwyg-toolbar-focus');
	                    // Add buttons to the toolbar
	                    add_buttons_to_toolbar($toolbar, false, function () {
	                        // Open a popup from the toolbar
	                        var $popup = $(wysiwygeditor.openPopup());
	                        // if wrong popup -> create a new one
	                        if ($popup.hasClass('wysiwyg-popup') && $popup.hasClass('wysiwyg-popuphover')) $popup = $(wysiwygeditor.closePopup().openPopup());
	                        if (!$popup.hasClass('wysiwyg-popup'))
	                            // add classes + content
	                            $popup.addClass('wysiwyg-popup');
	                        return $popup;
	                    }, function ($popup, target, overwrite_offset) {
	                        // Popup position
	                        var $button = $(target);
	                        var popup_width = $popup.outerWidth();
	                        // Point is the top/bottom-center of the button
	                        var left = $button.offset().left - $container.offset().left + parseInt($button.width() / 2) - parseInt(popup_width / 2);
	                        var top = $button.offset().top - $container.offset().top;
	                        if (toolbar_top) top += $button.outerHeight();else top -= $popup.outerHeight();
	                        if (overwrite_offset) {
	                            left = overwrite_offset.left;
	                            top = overwrite_offset.top;
	                        }
	                        popup_position($popup, $container, left, top);
	                    });
	                    if (toolbar_top) $container.prepend($toolbar);else $container.append($toolbar);
	                };
	                if (!toolbar_focus) create_toolbar();else initialize_toolbar = create_toolbar;
	            }
	        }
	
	        // Export userdata
	        return {
	            wysiwygeditor: wysiwygeditor,
	            $container: $container
	        };
	    };
	
	    // jQuery Interface
	    $.fn.wysiwyg = function (option, param) {
	        if (!option || (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object') {
	            option = $.extend({}, option);
	            return this.each(function () {
	                var $that = $(this);
	                // Already an editor
	                if ($that.data('wysiwygjs')) return;
	
	                // Two modes: toolbar on top and on bottom
	                var classes = option['class'],
	                    placeholder = option.placeholder || $that.prop('placeholder'),
	                    toolbar_position = option.toolbar || 'top',
	                    toolbar_buttons = option.buttons || {},
	                    toolbar_submit = option.submit,
	                    label_selectImage = option.selectImage,
	                    placeholder_url = option.placeholderUrl || null,
	                    placeholder_embed = option.placeholderEmbed || null,
	                    max_imagesize = option.maxImageSize || null,
	                    filter_imageType = option.filterImageType || '^image/',
	                    on_imageupload = option.onImageUpload || null,
	                    force_imageupload = option.forceImageUpload && on_imageupload,
	                    video_from_url = option.videoFromUrl || null,
	                    on_keydown = option.onKeyDown || null,
	                    on_keypress = option.onKeyPress || null,
	                    on_keyup = option.onKeyUp || null,
	                    on_autocomplete = option.onAutocomplete || null;
	
	                // Create the WYSIWYG Editor
	                var data = create_editor($that, classes, placeholder, toolbar_position, toolbar_buttons, toolbar_submit, label_selectImage, placeholder_url, placeholder_embed, max_imagesize, filter_imageType, on_imageupload, force_imageupload, video_from_url, on_keydown, on_keypress, on_keyup, on_autocomplete);
	                $that.data('wysiwygjs', data);
	            });
	        } else if (this.length == 1) {
	            var data = this.data('wysiwygjs');
	            if (!data) return this;
	            if (option == 'container') return data.$container;
	            if (option == 'shell') return data.wysiwygeditor;
	        }
	        return this;
	    };
	});

/***/ },

/***/ 415:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _afraid = __webpack_require__(416);
	
	var _afraid2 = _interopRequireDefault(_afraid);
	
	var _amorous = __webpack_require__(417);
	
	var _amorous2 = _interopRequireDefault(_amorous);
	
	var _angel = __webpack_require__(418);
	
	var _angel2 = _interopRequireDefault(_angel);
	
	var _angry = __webpack_require__(419);
	
	var _angry2 = _interopRequireDefault(_angry);
	
	var _bathing = __webpack_require__(420);
	
	var _bathing2 = _interopRequireDefault(_bathing);
	
	var _beer = __webpack_require__(421);
	
	var _beer2 = _interopRequireDefault(_beer);
	
	var _bored = __webpack_require__(422);
	
	var _bored2 = _interopRequireDefault(_bored);
	
	var _boy = __webpack_require__(423);
	
	var _boy2 = _interopRequireDefault(_boy);
	
	var _camera = __webpack_require__(424);
	
	var _camera2 = _interopRequireDefault(_camera);
	
	var _chilli = __webpack_require__(425);
	
	var _chilli2 = _interopRequireDefault(_chilli);
	
	var _cigarette = __webpack_require__(426);
	
	var _cigarette2 = _interopRequireDefault(_cigarette);
	
	var _cinema = __webpack_require__(427);
	
	var _cinema2 = _interopRequireDefault(_cinema);
	
	var _coffee = __webpack_require__(428);
	
	var _coffee2 = _interopRequireDefault(_coffee);
	
	var _cold = __webpack_require__(429);
	
	var _cold2 = _interopRequireDefault(_cold);
	
	var _confused = __webpack_require__(430);
	
	var _confused2 = _interopRequireDefault(_confused);
	
	var _console = __webpack_require__(431);
	
	var _console2 = _interopRequireDefault(_console);
	
	var _cross = __webpack_require__(432);
	
	var _cross2 = _interopRequireDefault(_cross);
	
	var _crying = __webpack_require__(433);
	
	var _crying2 = _interopRequireDefault(_crying);
	
	var _devil = __webpack_require__(434);
	
	var _devil2 = _interopRequireDefault(_devil);
	
	var _disappointed = __webpack_require__(435);
	
	var _disappointed2 = _interopRequireDefault(_disappointed);
	
	var _dontKnow = __webpack_require__(436);
	
	var _dontKnow2 = _interopRequireDefault(_dontKnow);
	
	var _drool = __webpack_require__(437);
	
	var _drool2 = _interopRequireDefault(_drool);
	
	var _embarrassed = __webpack_require__(438);
	
	var _embarrassed2 = _interopRequireDefault(_embarrassed);
	
	var _excited = __webpack_require__(439);
	
	var _excited2 = _interopRequireDefault(_excited);
	
	var _excruciating = __webpack_require__(440);
	
	var _excruciating2 = _interopRequireDefault(_excruciating);
	
	var _eyeroll = __webpack_require__(441);
	
	var _eyeroll2 = _interopRequireDefault(_eyeroll);
	
	var _girl = __webpack_require__(442);
	
	var _girl2 = _interopRequireDefault(_girl);
	
	var _grumpy = __webpack_require__(443);
	
	var _grumpy2 = _interopRequireDefault(_grumpy);
	
	var _happy = __webpack_require__(444);
	
	var _happy2 = _interopRequireDefault(_happy);
	
	var _hot = __webpack_require__(445);
	
	var _hot2 = _interopRequireDefault(_hot);
	
	var _hugLeft = __webpack_require__(446);
	
	var _hugLeft2 = _interopRequireDefault(_hugLeft);
	
	var _hugRight = __webpack_require__(447);
	
	var _hugRight2 = _interopRequireDefault(_hugRight);
	
	var _hungry = __webpack_require__(448);
	
	var _hungry2 = _interopRequireDefault(_hungry);
	
	var _in_love = __webpack_require__(449);
	
	var _in_love2 = _interopRequireDefault(_in_love);
	
	var _internet = __webpack_require__(450);
	
	var _internet2 = _interopRequireDefault(_internet);
	
	var _invincible = __webpack_require__(451);
	
	var _invincible2 = _interopRequireDefault(_invincible);
	
	var _kiss = __webpack_require__(452);
	
	var _kiss2 = _interopRequireDefault(_kiss);
	
	var _lamp = __webpack_require__(453);
	
	var _lamp2 = _interopRequireDefault(_lamp);
	
	var _lying = __webpack_require__(454);
	
	var _lying2 = _interopRequireDefault(_lying);
	
	var _meeting = __webpack_require__(455);
	
	var _meeting2 = _interopRequireDefault(_meeting);
	
	var _mobile = __webpack_require__(456);
	
	var _mobile2 = _interopRequireDefault(_mobile);
	
	var _mrgreen = __webpack_require__(457);
	
	var _mrgreen2 = _interopRequireDefault(_mrgreen);
	
	var _music = __webpack_require__(458);
	
	var _music2 = _interopRequireDefault(_music);
	
	var _musicalNote = __webpack_require__(459);
	
	var _musicalNote2 = _interopRequireDefault(_musicalNote);
	
	var _nerdy = __webpack_require__(460);
	
	var _nerdy2 = _interopRequireDefault(_nerdy);
	
	var _neutral = __webpack_require__(461);
	
	var _neutral2 = _interopRequireDefault(_neutral);
	
	var _party = __webpack_require__(462);
	
	var _party2 = _interopRequireDefault(_party);
	
	var _phone = __webpack_require__(463);
	
	var _phone2 = _interopRequireDefault(_phone);
	
	var _pirate = __webpack_require__(464);
	
	var _pirate2 = _interopRequireDefault(_pirate);
	
	var _pissedOff = __webpack_require__(465);
	
	var _pissedOff2 = _interopRequireDefault(_pissedOff);
	
	var _plate = __webpack_require__(466);
	
	var _plate2 = _interopRequireDefault(_plate);
	
	var _question = __webpack_require__(467);
	
	var _question2 = _interopRequireDefault(_question);
	
	var _restroom = __webpack_require__(468);
	
	var _restroom2 = _interopRequireDefault(_restroom);
	
	var _rose = __webpack_require__(469);
	
	var _rose2 = _interopRequireDefault(_rose);
	
	var _sad = __webpack_require__(470);
	
	var _sad2 = _interopRequireDefault(_sad);
	
	var _search = __webpack_require__(471);
	
	var _search2 = _interopRequireDefault(_search);
	
	var _shame = __webpack_require__(472);
	
	var _shame2 = _interopRequireDefault(_shame);
	
	var _shocked = __webpack_require__(473);
	
	var _shocked2 = _interopRequireDefault(_shocked);
	
	var _shopping = __webpack_require__(474);
	
	var _shopping2 = _interopRequireDefault(_shopping);
	
	var _shutMouth = __webpack_require__(475);
	
	var _shutMouth2 = _interopRequireDefault(_shutMouth);
	
	var _sick = __webpack_require__(476);
	
	var _sick2 = _interopRequireDefault(_sick);
	
	var _silent = __webpack_require__(477);
	
	var _silent2 = _interopRequireDefault(_silent);
	
	var _sleepy = __webpack_require__(478);
	
	var _sleepy2 = _interopRequireDefault(_sleepy);
	
	var _sleeping = __webpack_require__(479);
	
	var _sleeping2 = _interopRequireDefault(_sleeping);
	
	var _star = __webpack_require__(480);
	
	var _star2 = _interopRequireDefault(_star);
	
	var _stressed = __webpack_require__(481);
	
	var _stressed2 = _interopRequireDefault(_stressed);
	
	var _studying = __webpack_require__(482);
	
	var _studying2 = _interopRequireDefault(_studying);
	
	var _suit = __webpack_require__(483);
	
	var _suit2 = _interopRequireDefault(_suit);
	
	var _surfing = __webpack_require__(484);
	
	var _surfing2 = _interopRequireDefault(_surfing);
	
	var _thinking = __webpack_require__(485);
	
	var _thinking2 = _interopRequireDefault(_thinking);
	
	var _thunder = __webpack_require__(486);
	
	var _thunder2 = _interopRequireDefault(_thunder);
	
	var _tongue = __webpack_require__(487);
	
	var _tongue2 = _interopRequireDefault(_tongue);
	
	var _tv = __webpack_require__(488);
	
	var _tv2 = _interopRequireDefault(_tv);
	
	var _typing = __webpack_require__(489);
	
	var _typing2 = _interopRequireDefault(_typing);
	
	var _uhmYeah = __webpack_require__(490);
	
	var _uhmYeah2 = _interopRequireDefault(_uhmYeah);
	
	var _wink = __webpack_require__(491);
	
	var _wink2 = _interopRequireDefault(_wink);
	
	var _working = __webpack_require__(492);
	
	var _working2 = _interopRequireDefault(_working);
	
	var _writing = __webpack_require__(493);
	
	var _writing2 = _interopRequireDefault(_writing);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  afraid: _afraid2.default,
	  amorous: _amorous2.default,
	  angel: _angel2.default,
	  angry: _angry2.default,
	  bathing: _bathing2.default,
	  beer: _beer2.default,
	  bored: _bored2.default,
	  boy: _boy2.default,
	  camera: _camera2.default,
	  chilli: _chilli2.default,
	  cigarette: _cigarette2.default,
	  cinema: _cinema2.default,
	  coffee: _coffee2.default,
	  cold: _cold2.default,
	  confused: _confused2.default,
	  consolePng: _console2.default,
	  cross: _cross2.default,
	  crying: _crying2.default,
	  devil: _devil2.default,
	  disappointed: _disappointed2.default,
	  dontKnow: _dontKnow2.default,
	  drool: _drool2.default,
	  embarrassed: _embarrassed2.default,
	  excited: _excited2.default,
	  excruciating: _excruciating2.default,
	  eyeroll: _eyeroll2.default,
	  girl: _girl2.default,
	  grumpy: _grumpy2.default,
	  happy: _happy2.default,
	  hot: _hot2.default,
	  hugLeft: _hugLeft2.default,
	  hugRight: _hugRight2.default,
	  hungry: _hungry2.default,
	  inLove: _in_love2.default,
	  internet: _internet2.default,
	  invincible: _invincible2.default,
	  kiss: _kiss2.default,
	  lamp: _lamp2.default,
	  lying: _lying2.default,
	  meeting: _meeting2.default,
	  mobile: _mobile2.default,
	  mrgreen: _mrgreen2.default,
	  music: _music2.default,
	  musicalNote: _musicalNote2.default,
	  nerdy: _nerdy2.default,
	  neutral: _neutral2.default,
	  party: _party2.default,
	  phone: _phone2.default,
	  pirate: _pirate2.default,
	  pissedOff: _pissedOff2.default,
	  plate: _plate2.default,
	  question: _question2.default,
	  restroom: _restroom2.default,
	  rose: _rose2.default,
	  sad: _sad2.default,
	  search: _search2.default,
	  shame: _shame2.default,
	  shocked: _shocked2.default,
	  shopping: _shopping2.default,
	  shutMouth: _shutMouth2.default,
	  sick: _sick2.default,
	  silent: _silent2.default,
	  sleepy: _sleepy2.default,
	  sleeping: _sleeping2.default,
	  star: _star2.default,
	  stressed: _stressed2.default,
	  studying: _studying2.default,
	  suit: _suit2.default,
	  surfing: _surfing2.default,
	  thinking: _thinking2.default,
	  thunder: _thunder2.default,
	  tongue: _tongue2.default,
	  tv: _tv2.default,
	  typing: _typing2.default,
	  uhmYeah: _uhmYeah2.default,
	  wink: _wink2.default,
	  working: _working2.default,
	  writing: _writing2.default
	};

/***/ },

/***/ 416:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9gLEQMCCeRgUXYAAAMNSURBVDjLpZNNTBx1GMZ/Mzv/GdjtLsjS3RalfDTbDwggNBpN2mqaYNrGm60H68HEW9V40kQTs0uJjaQHD3rUaPxojFRSU9FIq6aVGD8IpYWhWLrsIiuUst1tYb+G2Zm/B+PGiPHie3uew+998r554H+O8ncxGO3laN95Bp7bK8LV7h6B3QP4pKKZZaFPPHPy4uKZ2GMciY1sBESjMfr6YpyJ9u7yeasutTa3BsM7u1TNGyA984tMJBL5zO2VN5448d3rGxL8tXmo/+DLu7fWDjRv05G6gxLplIq/VpGJGZTVO6STa1xZyJ2/lS896Rf6nSOxETwAgxfnGIz27ors7jnb0uyiz42DlDihsIIiUW+mEOY4RlOILa0PbP89njCOnvjma+BPwMDxvaJxs3+quz3sq5oZI3fgbfS6LozJIdxiDiMfZvWh19BTcbTydRxj88OPRmo/+uyH+awKEPbJPS3bmoNa+iqFnuNoDZ1EP/6Rb6ckYvIyzw9buIFGCvc/iz43RV29jkPpaQAVQFecnvrGFrUgStKT+QmtnGfaNFkUgmJHBxMTV1DsElp2ilzzffirJYpdOAagAUjX9WnCwMZRHH5FvdbP+68GUBSJraoMv9mCu/IB9to4rqHhwcEqWfUVwPq6Zabnr8lgcU3BsMjFL2DmNtF/ziAU2spT+w0OeN6BYAOZ31JoWwSObZ2rAFbz5Yn47I18cIdvE90ZAuoOxKmvGD55GNcpYc9cRuw7jCtGqGs7yOhbQ5SK2qeVG7z4rrm4kEqcSiXTeNQIq0sOZa8faRWRpRLrHsHt6euIqg5504yTWsldfeH0g19W3ghw19cx2qikDy1dmrw3HV+mZ18EKV1cp4zu95K9scDPn4wp8el0eSxT81KgyWsmk0lZAczPJ/EEQxeE7gtu39nWKfQg1dX34BE1rGVVslaAuWVr9vsF45X3lrqGkmMj1oYytbdHVNsOeR9pSnU3GLljNYb9OFLWWI42ulys/uLzlZazIs9dIW4VTHPW/Y+Snv4X70Nlf3eb+k/3D4xySi0bA9FDAAAAAElFTkSuQmCC"

/***/ },

/***/ 417:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAA7FJREFUOMsly09MW3UAB/Dv772+/nvvFWhLy592tGkLY8iGIEMQDmagCcxkM0vQuGQaD948GBMl0Q0OejDxYuLN4BbnaepcMEaEjc2BG1HZonSd/Gmh5RUoLf1L29fX934e/Nw/ZHJyEj1kFq9ceYCrV86AV2iTnjed1xE6DIYdBACo6qJCMV8tyjcLesTfnLyNmal+/EVfBpmZ6v8/fzhQY2D1F9zuY184Wnxmm7MWQoMLIAT53RhSe0kkIutFKZ54V6bKd5c+vZ+dmeoHAYCrEy/UWM3C563tJ99uNqbB6YqgjQ2Au4UShgN2JYKdKOQSg3jehLXNza8ycuX9S5/cy7Jff/QiTAQXOwdGJt21EjQmATjrKKMnBAYToVQlRMlAEw0UWppYa1joRE93Kr63MTYceES+/3ikyWYR17mluHnvQRieN7xIruWx+08KfZ+Nwgzg0Xs/w3q6EaaABavTq3AMecE9Zy9mC5UAw/HG8zSSMdu8Azh3/Vt6sMLDxndi7OI7+PXyLJ5M3cbo9Dew+0Yg3Slj/IMJaiw7kYukzUSnvapjqTZsEQQwrAHFa9dI36lOkEQCzE4UJbkKjaHA9jZc6UM4e3ugzM0RljDgTXoUVXmYASGDjb1tCC/9SNHRASwsQL+fwP3gE5wY86D+rBd/z82DLRRAFhdRtdvx70GQ+ns8UBVlkNFUFbU+EQZ/CQu3boAMDmJDxyJcjuL511vhfc2H9chD7LAsSNezmHm8jObTZjT4BCgVmbDjQ64BW6143NPLkcj2FpbuhCAhiZcmTkK06sEwFHXPWPDbT3/g8dNN2Ic4nHmrgyRjZWyHpTn2XF9zvWipGxWMFbR0GalMSqTnghf2YwJoVQU0FXwtB+cJEYxYwuC4j2qyjsS2i4jF9r9kyvnCD9JWuKQyTVDLKnF6OMi5QxBVAVVkUEUGqcooZ1JwevSoFhUil3nEwlE5n8vdZP1+sVDNHiYtYsPZOnsNzLyM8EqUSkGJ6I06lLJHCC6EUEwXqK/bRRjWhrXVA9z7M3J5IeWfZ39fPURLs2OvmIoGBJOjzepwwdVqJVSjkJ5KNLOfQ6OvkRzvbyeKYsPaagKzS6Hl5XT9dFwWdth2l4BfQm0lmCrrsfAmaDbZU1UF2BwNCHSfIk2tfqJpeoQ3clhZDuLGw8StlUz9dUm2rpCjZI4AQKDFzRCnmzdUq24PX+gMWI7GHGalS+AUHyhIXtGF9464YCgr3t2X+bUKZSJ6ju5uhULl/wDuNqfJ8/7N/gAAAABJRU5ErkJggg=="

/***/ },

/***/ 418:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANXSURBVDiNTdNLaFxVAIDh/9zX3MlkJjPJTDKTJk1bWq0FixgQ28b4QsUufICrWqFLQV24ETdS3BUXoqJYEKGrQMEi2IqgGJJQaAvW0NRWpYlpHpPXTGYymeTO3HvuOceV2H/9bz9hjAFg7Jywkp2l0YSff8f1ks/Zjp8Wtu8KITBaSaOjpoxaE1G49VWzfm/i1IdGAwhjDJc+z7+YSpfGsoX9naXB/Ylsvojnd+F6HYBFLCOicJfteoX15cWosXl/d2e7/OYrb8/9JL77LHcm073v6+HjT/nZwhCtdoIw9DGkMCQRlodtKQQtPC8ikWizvbnMzG/Xw0Z19j379Kv5y8MjJ7ozuRJLCztUNySu14eX3EMyvQ8/vQ+ETxQpqusbBDtNcj0ddGV9Z2O1POxorRyMBCQ6bqGkQsld4mgby3ZQchspA+KwQRw1cUQbjIfREq2kY792vDBSq60czvfm6B/sJZVOYHRAHNVp7awSBmVQ69hWne4e6MlbbNeXmb52nfJsbdyh2Z/be/gQN379mXR3H/1DB+guFEmlM3h+ErCQYZuw3WJjucLq4iLNxhoF9nNroZJz2rE6OjD0JMVMla2gSnXuDvN/3kQpQSQ1Qgg8z8F1bDqTHZTSOQ73HEG29tIO7zzqSCkxOgalySXTdGd7EZ6PcD2wHISwMGhQChNHmKgNSoOKkTIWjpbR7cbawmgmlaXdXGLy0h888cIRKqtNhGMjI4VlC/r2ZLl7Y45jzx/EcrNUVlbQSt62gkhPri0tKStZwnUMXTmfKxeu8fvEX+R7U/TtyTAz9Tc/fDNFImGBjhGik4X7ZbXbiifEubcePui5zvTpU2902moGLTcRjouwHbBsEAKMAa0xKkbYKYJ6hi++/TEI2tFj9i+3qrXxsU+i6tr6yCNHT7hGNZidmQdj8FyBkjH19Qblf6r0FPsQpsTYxfGgUts6++Xk7hVhjOGj1wctR6iJwf7i8MmXn+1A1Ji6PM7qQgVhwcCBIsdeOobatbj4/VSwuFqZDmNGz18NtPhP4wcney2Bft+23Y9HHn/IHxjotQvFAkYr1ssrzM+X1dTN2TCO47Ox5tPzV4P/NT7Yu89kDmH0GdfST0vFUQDX5nYYM6ENF85fDe49+P8LPpuo3vX+5ywAAAAASUVORK5CYII="

/***/ },

/***/ 419:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM9SURBVDiNbZNdSJ11AMZ///d9j8f07Kjp0ePHmnN+jVLaFrKazW1BmUG0uuiiRkFdFAxjFIOKkgnRTSyoGFIMtoJGlKygUQ5WKm5YZNFOrPDbo9Pj8Wsuz/G87/v/6CLaFHqun+fhgYefMMawUd2drdUCc8RGthisBgCBjimcPoP47Km3vx/d6Bf/FXR3tloWut0JBE7UVlXnFpTdZedGtwOGtdlRFqfH1fDYZMr13A6p+eDZd3v1rYLuzlbLQV6KREqbinLtnLLmZpyQRgSAQBB0FmrVY7rnAvGVTDqRTP7sKeuhF05e0RaAhW6PRKJNuw615ayMX2ay52PcG2NofxXjruCtjDBx8TQ3Zq/yQOvDOYV5+U3K914BsBuswWrHsc81HXwsZNYHyTd/k/z9L+K9l6ksysGam+GnU6cRy0vU3FuDFQlSEtkR+PPa8L6B86e+tJT0j1RXVuUKK4kzGSPslFB/9Bv2HO9BLCv8cDO73+ynrv0CYQpwJv4gmK+5u6rsDim95yzjZVryioptvTZGcHGF9H2vISP38MTLnXyX/QyXFqo4/OLrqMJ6UnvfIJhYQLtJIiWFNso7YGWkbgzdWYJKz5PaXoMOFd/+yM7edLHaUkGqdic6s0ReYQEZVzY4vu9jtMQohW9lEIvfQtEhvvr8fcTNQYSwePDcR+AnYflHfHsdlAAl8X0pHO17sdXE1P5wbj7am4P5i4jlfoQTANvGCAuWfgAtMdLH+B7CzmNhdhat/JiT9nRfYnp6X/6uclutx8meShCMj4LyN83HDuBW1pEpjWI5IaYmYyq1Lnsd15OfXvk1dqyqvi5kZ0XImhnCfukXRLRxU94krhL8ZC9uxQ7Wki59QyOu6/lnhTGGd56ufHVbeWnn408+kmMPf00wfu3/F2zbiVd+P2fO9qTHZ+Y7PuxLvyeMMbx1eKvlCNW7tSy6p+3RgznZoTTGX0TLm/8CE9iCsMKkFny+ON+fjs8t/OZK9ncNpPUtmI63FVsCfcy2Ayead9dmV1QU25FoBKMV89dnmZi4rvqHRl0pZYfUnOwaSN+GaaOOHgjXYPTzAUu3+IpGgIBNzJX0asOZroH0yEb/Pxu8jds1T02xAAAAAElFTkSuQmCC"

/***/ },

/***/ 420:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKtSURBVDiNnZNPaFx1EMc/83u/93azm00NW5ptNUu1LaWBIEZbhQUVvAqCf6gXk4uCQhGlgjQVvYj1oCjiVWgMWEGkN0FJ04NJLlrxYHLRaGIT0o0N7Xb7ui9v35vxkFZy0BwcmNt8PgzDd8TMAJidEO8C/wHijptqxQXBQt7dPNUYswvsVGaGmTE3Gbz/6/dPdZLWRUvjH+zGlXP241f7OjNneeLOzL+1uyMScaP3DL9cPPPRF5w89S7FUsB9x04XAh+N7rSAX9u/fwh4bm+ttjd8usra2iqIQLZEb/UxMePJHQVXLl+eB5BmxKAIn55p4FwRpAzOA4T/Bc9OSME/kOcyOyFh4EnAnIhHXAHxg8SteZwLftoGjIi4Z50PjpnqEDDgAZwL3ojKd+dmiTNNUcCFfWysnEuyLPnmNvyIjypT9eHRUlSqSlgo88uFcdzcpH+l1H/wraHHPwzz5Gc0j9GsDRRY//07h9lfs5+713zUO3Xk0ffKu/bUJfTL+EIFELyIe+fA0ddLdBfIsmVEQsAh3RUOPjzum4vnP4l6qr526JkiukLankY1JugZ2TqiqQ2EhV2kN6a3YPEAaPtbesqH3L0jL/Zq3qYbz9D8Y4rqvhqqCWi2JQBQTcjzm4h4QEg7tzBVxC3iI4/mm6wv/0aedtC8jyCqkybXQCz2Ipbm3XYEZTS7CuIIAiXtdui0WsTXN+gmHcJixMCBYaLKQ2QpLF367JZp/qrMTbqPK9UjL9Xvf6EktMjTJSzbQPXmVkJdH+L78YXDqEZs/Hkxay5OJ5rnJxpjNiEzZ3Ei8rYE4Zu7B4/qXbUHS1FpD0HUD6aknSab8SrXVi/F19fnRUy/VLXxxpg1AWTbNw4Ax513z2PUTdkNqDiWwRY0t/PA140x62xP4z+C/1t/A8usQWprrWoOAAAAAElFTkSuQmCC"

/***/ },

/***/ 421:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAANsAAADbABfWVZ+gAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKNSURBVDiNbZI/jFRVFMZ/98/M7Oz4B4ZlcV2jMYvJNiZksiF29jZbLAVuZywsTHQLu00sLIyFkS2oCDaQYMFuS0u/CQUkQ8QCFAOLAw7I7OO9++6951i8xSwTv+bm5ub87jnfd4yqsrOz84H3/rKInHLO/ZZS2lLVF977s6r6kYgccc7dSil9tra2NuSQzPb2dt97f29lZeX1+fl5k1JiOBwWIQSWl5d7s7OzWGsZj8fs7u7eXF1dPXUY4K21Xy0tLXXm5uZMVVW0220Gg0FPVYkxUpYlKSX6/T4icpIpeWvtmYWFhU5VVcQYyTkTQgAg50yMsWnVGFTVTwPM+c/ncnwxttMP/6dW9yhf/vzEvAI496nVL364jkhCUo3kujlTjeSAxEBOgRxLdi5sHq7dA77xAKpKNbpNrgtc7wTl6DapLmi/8S6TBzfIqeK1xdPNj8r3CjXWtFH9sQFIRiWiksA4JEc0J3AezRGJNZIbL77+JW8CbK27TWDBvgSI5Aakgvx3F0QSOUxI5XjKPSyAB4j7D6n/eYDkGtM5QpzskaoJrtunfHofiTUzsXoVIFhME2MIk1EnFSNSmGC7x6j3H5NjRScFNNeAEkOBMYSX9WqwBvDO+Sfl/rNFMEg+GENSk4pkJCdwbariOdYY2Vp354AaxWHY88aYu8+f7i2+OdNCJDVz53QAarxw7Q7F/jMAB2w0i3UQY12HS/fu3BwMTn/cM/5vJFaICiJCjiW21aXVO86jO78WWXRj40q+eNgKD1z98+7wp5mZ2fjOe++3TDWh99aHSKoJ1QS6b/P7H/fj6NFDAa5Ob6dRVbbW3Qnv3LfGmk9yluMi0gOw1hTW8FiVa1n0u40r+a9pwL9E4YvjtcqDVQAAAABJRU5ErkJggg=="

/***/ },

/***/ 422:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAA4FJREFUOMsFwVloHHUcB/Dv7z+zuzOzs2cON5E19ohtorFSpUEKKk0xKWLxpQ/xgOKb+qIPiihURaWID0WxvvkSVIyiohWrJLUHLUlpPZqyjZrDbI5uNsfex8zO/P8/Px8aO3kId0VtPPbSjxh//yHTMtv3GXbkFY0wIjREAAXp+VVf8i/NRuNU3a3feObNqebkx0NYqQjQxU+fxKMvnsHnJw7sTqXv/qS7Z+dw6s4IIrYHgRoDCr4foEZdYS1bxHI2N7mR337h+LvT85MfDYEA4Iu3Bnf27O4/m+yM3xOJW9ys3oZlMtriASIQiJgdVyJkxlAuOXQrszmX/W915Ph704va2IkBszOVHmtLtQ9GwoJ1IUnXDBRKTLqmENAIyzmm7bKGzS2HdF1yR3u4rVJ29z4+GP9WT8S79nV0dY0EDWJfSWrVffhSETNjLe/BNDRYVhR2RJDvKxRLDWpLBrin545h13UHdMOyXk92xJBfv41AwGAAJJWC7yu0WhKKA9B1D40mw/clpFRcKNTQ3R3Fyqrxsq4JDIUCTTQdH4BPui7gNF1IBjxPwZAK5aoLZgWlAN+XFAoymwYQCIonhKaLcDwe5h0PjNLbp6/i1GeXUWnZkBIQQqBWb8B1mgCAVstDy5MQBAqGwIGAiOpQCmAXyfZOPP38G5iavoaDT72D0sJX4HoGif7XMHpsGLah8Nyxw4gZDdiWhEYE6UnQxOkj1UcO9drrmx4bqWEKJ3ahmJ+B5U6BuIZm9Fn4xl5cungBBx9+EPrWl0gGVzkQitDkRKamuy35W71BRzuTLipb41zZMMkMKlimDhJBOFtfA8E+HN6fABe/QdTKcRA6SiUPzbozoTcbzsns4ubRewc6EYvppASDpA4AABMSUYbiW4AkUBgQEEQweXEui2qt/qEoVMo35udXJ9ZzNYIkJkVgASadAB0gEDQhoGnEQgKQxMvZIt2cXbv01xIy2k9X8v6elPmH78oj8UQkEYvbTOzBKVdx9fIMfffrEqavr+C+HTGYEQtrKxU6d34hd/Za6dUfMol/tf29CYxfSG9r+tbNcqF8v/D9LjuSoCCBYsEg96Vs7OmKkCds+juzQt+fW/vn5+u1DzLFtitxbFcIAHp70sJJpK102NvVn5KDfV0YbY+JA7YpLDBQc1QjX1C//7mKMwsb2kzZ1eaMEOeWZmed/wF8Hqu43BERxgAAAABJRU5ErkJggg=="

/***/ },

/***/ 423:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAylJREFUOMt100uIFFcUBuD/1q2u6i67e7rm0Z3umTgYBuMoBAYMKsEECYSJEtREsjBENEOyCMEhqywTVyGu3AWFURghESGLPBbiYqIkRoghiY9xYg+j6Xn0+1H9qKpbj3tvFnFERO/qwOV8nMM5h+AZb+uxy4ASmIQQNQgEAi5AQAACqAohEVVpz8/s9dRnAQTQJcgXgwOJ40/7L5bbRwCcfyqwbeoS5mfe8ABMv/bZL8e3ZLS1t3dncy5jhPkcX1+uw2Y8AABlPWnzRz8+AuZnJh/F/9xv0z+XrN8X17qk1HBQbdoAAIUQAIA6/sElLJydRP7MW3jh2A+jmUTsU42Sw6GQQ5TiL+aL/K5x82CuX0WlJcH4wxbXgYWzkwCuYNP7vQM7xswLk9vTerZfA4FEselOVFv+xGhaR37VxoWrlWt9qfgrAKBr/xevAsDgO82db748cm7/rrTesBz0HAGFEAgewvMcFCo+rs330HXklON2GwoV32lURAFA2fTeT9EdL/ZP795mppbLbZiJGH5b6ODU98vi7rINMxGVpUYPg0mCDTo/nJ/dW5ecHeWhNwcAaiQio4N9kdc934emUszdrLFvr5S/VBV6erXmzux5KbkvrktEVQ7C3aMAPr83e+gBAGw+chFKyKXKhRyymY+oRnH1VqtSbHZPFr7ZV4HPPv57sRF6AYfNfASevfHxcedn34VCqcJDLnsd20fNcjFsKv1Zw5sa3/NhNmDN6ZQhac1yUbdccN9ZeXJnlND3vHqrd90PgVtLdUyMxeNbRxNf8aHtf4w9n/pkoE8jpYaDTsdG4FpzTwLUun0x8NOvukZUPZSM6+TecpPk0nFtJNOXCISgqzUbhqagWlyBWr1+Imdq9eHhYVYqlyUAUGqADCRZdbUeGVIj+sSGmIZS00GtzcC8ELrCUVtbEUH5xs9aWFziSmxtZMDoLN4vSABQ0yNbZIoVnMBzT9+1H/QMc+N+LZYcFYRC+Ex43eoK6S7eiIXVO5CkRDljVi+Ujx0dkMlkaC77XEJE1IxHEjkQmiKgBpECRLpuRPotSdAinFeshtH8t/Crtw78B3q+fOJsUxpnAAAAAElFTkSuQmCC"

/***/ },

/***/ 424:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIYSURBVDiNpZNLS5RxFMZ/78w7M24yy8GFzpiQE4RG2i7aBNHSjYgg+CGEjKAPIIlGtIjaJkpu2lS7WrTKUUFHzFSMCHNwxLwy4cz/ck4LrwUV4YGzfC7nOecEqsppKnIqNBA+ejz4wFrbq6rR/wEGQeBjsdgg/QN9TkR0fCKrT5890ez4mIqI/l4i8ks7Z7V/oM9FDpUnJydIpVNks2MUCgWcs1hrsNZgTBljDJ8WPlIul5ibnwUCVDUaAogITU3N5HLTZDKX2N7eZmPjO9FolERFgkQ8TjyeIF2XxjpLfeoCIn4/A4CyKZNpbKS2to5vy8u8fvOKzs4OCPbntd7gSpYfe4qqoijJoOaYoFgssvR5iY3NDfIreXZ2dyBQVEFV2dza4vnQKFPTOa61XqW7u5OqyvPHa7TG4MThvcOLR0SwzmGdxXnL8PAwC1/mWIm28H5qhaGhUZw3xwTGGrxzOOcR2W93ALbOMZOboe3WKjdbltkN0+Rys3h/IgNz6EAc3u878AchAbS0NrO+8pYbF+dY/7pFQ+oKXuTYQdmUURH+dNbtHZ0U5TYvXtaQabhMV1c7ctKBtZYwDInFYlRXJ0mn6qmqPIcCqFJ55iw9Pb2AHonslfYIgsCHkUikVCisViSTSeLxCtYKa+TzeTMyMhL/1ymHYTgYikjb4uLCnfl5uQ4EkUjkg/fu4b2799/9jeCI6LTv/BPIAFmpJNyYvwAAAABJRU5ErkJggg=="

/***/ },

/***/ 425:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAApxJREFUOMuNkk+IlHUYxz/P7/fOO/OuMWOxsslmOX8IVrdxZrdL2cESHcWQFIuiQ4SHZb1IXTsUCOWh6OJF6eCh8GSQuO4M4l72oikOCHrRScT1IJq267rzzszv/T1dGppkqb6n7+H58nx5ng/8ixrVIgD1yRL1yVIAcOjrHTJ9dKfpzwj/Q/VK4U1xvraQz56/vPXFeYE9wHXAB4Pbas0WADOVwrCIvCBgBd4xy/ExAOv1MwAvJMbrcUTuSL9mrdnibDn/ujVyOBR5VVSH1KsxLhnrASrU27nMmUfroqFf3xj5Drgr8GHQD8+U8/uej8ITXnW44xIUITHgwkCBw2rMcLTU/eqlB09HuqG9Mv/2+qmfDs1cFYDZSuGttUOZ+ScPFvFr0lPAZUARWdjVbD2sT5QmpNM7w9LKqAfMutzJ2tVbnwIEjWpxLbD/j5V4++6b9+b6Nzm1aaPkQpOdrRbHrUt+MJ3uaGINkg56onoJYProTiuNanEDoLVma+GX8Vey1phxEQopI2MWxpPlzt50aHFecdbc1HTqZGPPy6faQ8Fv/3jj2XJ+ak0YvBel7GsWRlGFxON7CSve0zXmtFpzBNXd5kn8zc8HNwNslnNb8lEUBucyqdQ2QREFQVGvtF1Cz/tFVY54kUnxWpZOb8xZ6S6PPPfuB3M3LgRG5Fgmldq21O5MA33Ccn/5WY9ct+j36Z77KAFcFGJVf8w96lzsAyT/QeHHc5WCXqgU4nq1+MlqqP9tnvEzW/Lb5yZKfn6i5M9XCtOrzchqKDeqRZuN0q7nXJwkPuOVbx+75IsD1253n21oBsONanF9o1r8PBul3eJKrPHjp5k48e+3E//lgWu3u4ObV20AlIEIuA/87lWdEYlrzZYONhzUnylWHdGb20GZAAAAAElFTkSuQmCC"

/***/ },

/***/ 426:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAI9SURBVDiNxZE7aFNhFMf/33dvHuZVYmNTm0GxdIhtMcRqoEbFIUJQRBAcqvW1qWBx7FCSTcRBB12LJUVwcLBDEgiSSAsOvgqNSqNNxCbV5MZozM3N43rv52JDLK0FF89yOHB+Pzj/AwCIx+P6cDiswz8UBYCmWhumWrp/s+WXZ3FwfhRLL87B2xIwxggYG6FMPREIBOhG8KtRHNZsMUd7L93ZpeG0kVUJBQBFURy5XNaazWZtwWDQtBaeH8ERTm8KO8fDBm3xNTqNTRPPMNUS1KoSSSTm3BxPrugNmouMMbIKx2IRr2bQd9c5HjEoTyZQeTaFYhlVheFCS6DT69KEkK2EkAFFUfXtMK/jo73XZ3bLyUfPK+8SWBYgqcCxvdOYBQBKCAEhZAEApYR2cjzNExDEYhEvp+WjQ26PUZKqKO65tu+zZThJFBx3h/C0/Qss/WEpkUlnkg252WAqY5PTk16pUYsOOAeNKys5CF8FvE+nxPyBicuuB4i358MBAMdpIQhCv9lsXrHb7XWNRnvfM+QxLmc/QZZlFIQvIhT4fT7/3NqAOQBIpVL1Wq2W7+5x0C67/fYhr9f4MZNBU26g9L0k6njdujAA8L+7urOvr7+7Z/s9t8tleJNcAOUoKlVJNJlN/lMnT68Ltwtg6egIdtls+sXFt2CM4Fv5h2ixmPxjV8c2hFsnAADh+VlRlDz1ZnNbvlCUVJX5b924+Vf4D0G5VCoYrNbHiqwc/cnYmYeh0Kbw/6mZ844d7fMvmsvppRvtSjMAAAAASUVORK5CYII="

/***/ },

/***/ 427:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIQSURBVDiNdZJNSFRRFIC/++bllGKmkUMGUlKQSRGFIxKB0CJoEwntGpIWPaP9rNuquQx5mzazjH5WbSKQws2L6A9UIpJhzBxLkXnPV+q8c1r4JsdxPHC5l497vnPuj7nVe9c2xjh2IpEFKEfRqKq6APV4znPLVIVtjHFOnTkxfnVwIKmqvHzyenzuawGAPfijHYKEZWX7r/QmP01+JhLh9NmTyfy3+azBUI/vEogqhbkf/Fz6RTmKWA5KiCoG6vLasEVk1Hvz4eGR9rb96+sbFPKLf1V0VFHq8UpiJu3cNJa5b273DS9GIiljDABaU6WaW5ZVFJEOY8xYS1vz8OpyqdGORFJDdwYREUQVEUFFERVEdGvoFnvx9FXKWGbyaGfq4vWha40TDx5jAwRrISsLK7GkkrgtFBEOpVoB6Ow61neuv6fBX/W37gAgCEL8MIw3V6pXrxUraACgpa25YfrdLF09x7cFfhAQrIU11Xd2YvkJAL5P59fbOw4ni4WlbUEpCEkcsCESDEqi+jLjKSpHAKyFf7z5/OKFVr+lqfITi1/ez6Z2PXCdMMYUVXRgc6M89ntpxQGaTPWzZdLODeAZ4MeoGRjMee7zWtn/f1ARZNLOQWAG6ADuxfsmgAWgO+e5pXpdWVXrkTh5CnDjMRWzkT2Ppapk0s4l4C2wCZzPee5M3FU38BHYB1zOee5UreAfb35gIP0c1DwAAAAASUVORK5CYII="

/***/ },

/***/ 428:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJTSURBVDiNlZPPS1RRFMe/97573xtHJxqjXNnCFhFRG8MolCKoINu4mAgX4aJs7batf0ALV0lU9JNq4SJoMGhSiCDCTQsRCrSN1gzhc5zRed57zmkx45QpWAe+HLhcPnz5fu9VIoK/J5/PR1rrViIKOcXB4tfF4vDwsNt2EYDe6dDusR0morMm1Fcibc53dnUenZmZsf8EGMuPRX7NdzNJH0A3mHDYKOTiuHQEgNoV0JXpSgdGHVNKX4LSWaUlpyAHodXlqampYFdAf2//siJXgMKsAh4rpd4y0CvgQ5lMZpsDJSIYHx9Pp1rDZWuD0BoLYy2sNbDWgojgnGvIwzsH5z3FLauZkdzIutps4dmLRx/O9J07lc22QysFrTVEBMwMFq5vJpTLZbybLiDVEv4EcMtsWnEbG8+//1jqTremw6RW+wNA8EQg8ojCCCvlFZCjB2jBbQCFZgbs/euFb/PeBAbMBCICM4GZIcIQEQTGolQqrjlKpnMDg58BtDUBQ0M3v1Sr1dUkqQFKgdg3IAxmgYjAGIOlpUU4xseXE0+PA6hsaYG9f1UsFSUIAhARiOtiJiit4JxDpVJN79+3dxZAYUsGAFBbTyYW5uevdhzoaCMiAIBAIMwITYQ4XgYJf8oNDPY0a3z45P4kgAvGGPxWAGMMtNbw3m+X8/CeIMJvTFJLRlOp6HTPiZNt7dn2phsRgScPonoWvrGJPeKVGHOzc5Uk2RhVIoK79+70hqGdVFqnjQkQBAZBoKG1hoKCoP4eiLgB5DXv3MWha9ffq52+8//ML+/tW7KOhBksAAAAAElFTkSuQmCC"

/***/ },

/***/ 429:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAA6VJREFUOMsly31M1HUcwPH353fHPZ933PEghPIU8zBNBVPzoZah6wGctnKxNkpc5T/V4r82rdZsNfujLNembWxtNWus5VBLtC2ZihjyNJ4JBEFg4PFwD9x5P+5+3/7o9f9L8t7bx54j1zhfBjm1W+yefNlgtsrbZmvikMW66APQE+kLyYT192RC/RC6r3pn6jvj1T1w4+zzSHUHnC+DvHc2FWSWms86CtmP10TUFidBCgArJpyPbLCUIj4mVx8OJN99cK57vLoHBP7POVttjSvrwhsfWRSaMimXOMWm2dBEQzd0YiquDGWIrOiYh9w9c3cTBybPdY8LP9WkbQ72XrKUqf2ISWWv2EWPJVRwJiShuTDJmI7D78Kf61XpfpcspxkqoSUl0p662u0LVMrxLc5v7nxU+oGyKLUquFZGB58gy17KS2WlOEyZ+H1WDBWldWiMyx29PLZmGEd+j4oRkp1fjZyWs7maan1lt5rMq2FL5lMce7FYinKcoMd4o+Empyp34CGFy5MOQP3lGdXQ2Uf+vdOUX/lDNEtK4erPkvKSKjlV+6QU5Thpb29n394Kfmm+zsrMFC8fOMj09DQAleU5UrmzXFyTDrEYCs1sKFxLc1yZGOLG2AwAhYWF1NQexZeRxf2kcOTNGjIyMjAMxZn2bmIIzD3AZCg0JZCwWnncn8UX19swlMLn87Ht0GtsLSqhfmCCt2qPYrFYaL43yW/DI8wnTUq321ECpkq36dORwD5VUnFYUvoyf438S+SRztd/d3By115+7e1jaH6Bgdl5jl+7y+vbqxgMp8QY6VJrpjrEtN3vPXZ7w2F3oHyrsrjXyHjUSldQI89fQkjcrM4o5vasomfJytqcjUQ1DylN1ODohORNtS1IceWXzwSe3d0ceHoXdZsVqyzwMBIh17OK2UgUAbLdLqZCYdKdbqIrUHtLmO3tYOpm8wnzaEtnS8H6wLf60tL7KcOlmobuy2I8QbbTznw8gQA+u5WJcJRXNxRj4FA2PS4SjZyZv1D3uYl4nzE24W0rKM4KTKa8gYp1uXhtPpXr8eG1p0umy89qj095HRkEdav83BWW0d7+xn/qf/yQxY6YKfDxZYIX6+J9I/ZrIsr2MJzaludwi12lSbpZw45GNKJkLhiTS3eG1a0b7d+1NFysY/j7+cAnTQh7TrL+uU30f1YF/tq0/Bd2FHq8roNuu+2AprEJwDDoDsUTjdHw8oXxP1vGCNavBE40MdjazX9CiZp5v7KWPwAAAABJRU5ErkJggg=="

/***/ },

/***/ 430:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANPSURBVDiNVZNLTFxVAIa/c+8dnsMwdRiYUiCW8ChCMfggpqVAq6mUlU3tSms1ujExNSbGRBMlsDExWqNpDEurBm0CupBEowGBIG1Uasw0RimUV8tjZhgLzuvee+45Lowtfus/3+bPJ7TW7GZkoKdOoM+YyC6NcRBAoKIe1qRGfHrqrW/nd+/Ff4KRgR7DQJ2zfL7+htq64j2VNWZxZD+gSa3Nk1i94c0tLKVtx+6Tig+ffntC3RGMDPQYFnIsHN7bvq+irOjmz19jb29Rd+o0lmWxPPIFeaUhwi3d/LmymdmIxX5yPOPR58/PKAPAQJ0LhyPtbcd6i7LbUaoO3UfzM6cpCBaSHyyk/rmzRLoexpU3OdRzvChUGmz3XOdlADHc/3idzzJmu088GRDyF3xrc+TFb4MQeDU1gIG5sgga3MoIblU9uWSAL4dHU1lbthmedM/U3VtbLIwY1lIUK1tCuvM90kfeRSQ93EAHqWMfker+AGsnD2vxGvlBRXNtZaGUzllDO7mu0rJyU6UWyE/8ReahV5HhFp54cYBvCp5iLF7LyRdexwsdIP3IG+RvxFF2jHBFyMRzuo2cVK3+eyrwMpuk99ej/OV3PzIL/nexV1JFuqEJlduiNLSHnC0PWq7ropVEex6ukUMkRqHsGMND7yN2riCEwZHPL4Abg+QPuGYWPAGexHWlsJTrRLc3ljsDxUGUsw6b3yGSUwjLB6aJFgZsjYOSaOmiXQdhlhJfW0N5btTKOGpyY3X1cLBtn+llV0AagACtwDP5O7bD1eErIODA0SbCNUEMy8/yUtRLZ+WEYTvyk5mr0ayT9WPkhdHS5fJnP7Lx+wpbN9a5fHGCxq5GWo43szAzhzCLScVsJmev27bjXjS//y2RHB96x0lsbHY0tR72aW+bQMji2tgfxOc3aXmsifLaEIV+H9X3NyL0XoYujWfiydt9FybTo0JrzZsnqw1LeBPVlZEHe08cLSrwZ9BuAiV3/g3GV4IwAqTjLpe+msqsrMd/tSWdg9MZdSem13rLDYF6xTR9/R0PNBRUVZWb4UgYrTw2b62xuHjLm5qdt6WUfVJxfnA6czem3bzUHahHq2d9hupyPVoBfCZRWzKhNB8PTmeu797/A+DBl7ZAZA+PAAAAAElFTkSuQmCC"

/***/ },

/***/ 431:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIxSURBVDiNjZNNSFRRFIC/++57vfwZFy4qZMQSQ3qO9IsRRrNonZugcuFGaBEIIoghgmA0EKS0yoF+9hW4qH0MStQiV9kPKSSUI1phpjTvPX333RYz82amZuHZ3MPhnO/83SO01lSTmR4RlwZprUkWTLOh5sblF3ql3E9UA8z0iLhhiIXW1nh9U2u7GZp1rC5/Ucuf32/rUHeWQ4xq2Q1BuqUlXt/SdtSs31pArr0lfuykPNLRFTME6QrfagANycbmdtNd+cD2j3V2NlbJLc5xoDMpNVFLAJg3R4fv+L4/rLWWReN5YRGadXiBBA/CEKiVWPtqUcKKDQ4NaCGEsm17UgwODQRTd+9JKc2I+ub2JcytbxxsO463NIcWkoauXr4vzpNTkrNjz/H9HUbHRpSptZZSmmxs/IwAh6+lmB9PIqwaDp26gmHXsv7pNSsf5zk9kWFz8xexWANa67K0ZWI3NnHm1iwvU1fJLk0Dmu26Zi5OZLAbm/JzKmyv6hCLkKzTx7n7S5yYekfW6YuCAcLwH4DKpNkZ70RlSlsyDInnefi+j2FU5tI6zG+hBJiG32uozDT6wnUAEokOnj57AkBHIkGggghQ1CNA0N2PfPUY1d2P8nIAOI6D4zhRkFuw56szSoDdYJd4bwp6U/lqQkWoFEopVFh4VVCmK3LunxLga3YZ1y3R9yL77Zo8QAihPNeVRQNUHtd/p6aL7bgIIZRpWdbkwwePKr7yXkQIoSzLmvwLHC/yPFCx14AAAAAASUVORK5CYII="

/***/ },

/***/ 432:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANHSURBVDiNVZNdTJV1AMZ////7Hj4OcIDgwJGQJQP68GPZh2tOgbQVcpVTb0qyVje0Zqv1sdqUoIu6KFuOMW/aWm1ZE6otrWizkFhrlXPrdFGKoSAIHMCkc95zzvv/6sJSerbn7rfn5tlPOOdYmaG+jiaB6/LQbQ65HkBgkwb/lEN8uOvg1+MrefHfwFBfh5TY/X4k0tvS2FRSWdfglSTWAI70zDgLU3+as+cvZPJhvkdbDu99Y8ReHxjq65A++mQ8vmrTzbXV0Us/f0H+6iJNu/bg+z4Xhz6moLyK+Lp2/picC2bn538Kjdz+5KEfrASQ2P3xeGLTxm2d0ezVJPWb72DtY3soqiimsKKY5if2kWi7F6UvsbnjwWhVecUmo8JnAcRg70NNEV+ebt+xOyb0L0RmzlKQ+guEwDQ0ABJvcgIcqLoEqr6Z3FKMTwePp7N5vVEarbqabmksEXIe/0ISP1tGpvVtMlvfQiwZVGwL6W0DpNvfxV8uwJ/4jcIKy9rGumKtw33Shbm28uoaz6bPU7hwheCeF9DxdTzc3cdXRY9yMtXIzqdewVTdRua+VymcTWHz88RrqzxM2C5z2m4ovakWE8yRWdOMLa258ZFX9L+LTVk9mZbbsblFyqsqyeX1el8phbMaZwxK5hALx6F6G4MfvYNY/hEhJFuP9oOah6XvUF4WjACjUUoL36oweXX2YmuspAIbXoa5bxBLowg/Ap6HExIWvwWrcVrhVIjwyknNzGCNSsogtKdmp6aMLF6FM+pfKE//i8dwYR4X5uh//ihOhdeqFUKUcvHCtMlk9Yh4s+vWpoKIf2bvI7tLPfMrVi0i/AjC8xnoGQbg6dc7wVqc0QivhOBKjMPvnQiCXHinfPmD38eDdPq14RPDgR/dgPQrcSpkoGeY7oPb6T74AAMHvsTpPEJGETbBsc+/D7LZbE//yN/nhHOOAztXS1+YkdV1ibs7d9wfLSoNcGoBq5evCRMpQ8gYmZTik89Gg8nLqTN5TeuRscBel+mlzhopsM95XqR3y10tRfX1NV48EcdZw9z0DBMT02b09Hhea92jLYeOjAU3ZFqZZ9pjzTj7eETaNmXYABDxSOY1I9bx/pGx4NxK/h/W552VFllSlwAAAABJRU5ErkJggg=="

/***/ },

/***/ 433:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANhSURBVDiNVZNvSNx1AIef7++Pnv9u7s7TU1RU7tSVCq6wVqbOxVJfBGNGBI0Ge1GLWI2iF0GJvhlRDYoW0psNBsLGXMEMVqOh5mJrf2rcWuLOafO/d95E7s67+31/318vos2e1x+eNx8e4TgOWxke6AoInAM6st1BawQQqJCNMeYgTu//5GJ46178Jxge6NI01BHDNPtrawJ528sq9Tx/NeAQXwwTnbtvT03PJtKZdJ9UfPX6sVH1SDA80KUZyJ99vtKW6kBtru6GTHKFzbVlTMPAVVxBlstDemmNO3enksurq79lbG3PoeO/Kg1AQx3x+fwtzZ09uamNW4ROfsrsj9/j8hSQ7cln4eJZJk8dQ6p5nuvam+vdVthiW5l3AcS5/pcCpqHd7OjudQt5A3NxiqzIOgiBXVkJaOgPZsABq8yPVR4kFXNz/txIfDMtmzVbWgcCVTV5QlvFmA1hbBaQaPuCxAufI2I2lruVeOc3xDu+xNjIwpi5Q3ah4smashwpM29oTibVvq2oWFfxabKjD0k+/QHS18CbJ+e4VPg2Y/Fm3vp2CttbT/yZj8hejqDSq/hKvDp2psNISdWU7ynBfniDRHUQlV/8+CPD9b+Luz+7R47xPns3ZzlYHyOVlo2GZVk4SuLYNhmRRouOQFEnJ95rQmxcRQiNXUefB2sVTx407qjj/DWN12qiWJYUhrIyoRNjdtvYwqsk0oILvUOI2DjCMEHXcYQGa5dBSV4OBBi6JekJLrGxMo+yrZCxnsm6ciHsbet8Nsjt0J840mJ+Osb9yVXmwhGEplH9RCmBhlJ6gwn2V11Hd1Vx5acFO7EpR/UXG9x/Z7KKDt9d0fV9gSmy568Ruj5HdZ2Plj111O8sx85Y/PHLNLpQeP0lJNYMzv5wNZVKW4f1S7ejscnTh5Kd2/9qfaWz1lyaDbNrdzneknxMU2AaAo8vh2CDj6W5FCWlOxg6czkZia33fT2WGBGO4/DxvgrNEPZoRZn/qZ7u3bmu/CSOFUXJjX+DMQsQmptExOLMd+PJB0uR39OStsGJpHoU04c9xZpAHdV1s791Z62rvLxY9/l9OMpmZWGRmZkFe/xmOC2l7JOK44MTyccxbeWdDncQRx00NdVu2TQBmDqhtGRUOZwanEje27r/B5TSjoXJ4DAzAAAAAElFTkSuQmCC"

/***/ },

/***/ 434:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANoSURBVDiNTZFLTFxlAIW//z6GV4fHMDMMUEbbECcEKFGaVCMQYtqdsdG0utEEE9emmpioG9LIipqq6VKNY2KMDbKrJqZoCbRBStNSpoWGWhgHLo/ADFOY171z7/+7aNr47U5y8i3OEVc7O08Bf528d88DUGfPtqPUkJJyEE07BoCUCaFpkwgRF2NjDwEmuroM4KS42tVV1gyjIIT4uScSSdfX1X3ktrdX0NSkEw6DlCjLQm1ted7Kip3JZi/9s7fXqKR8R0lpij97evLdQ0PV6cVF5bdtt7avz8wuLRKorESl0wCIhgbS+Ty1bVF2bt1yZSBgBDo6SMTjOf39w4dfKedyRyO9vXrgxAm9NDPD4rVJan0FjOoCytgnl1lnefY+TWEfob7XNN1fh3Xjhms/fvyH0RkKDeM4p2ojEaM0N8H2xjyiUiexkMIfMRDA/paLXmmyvf6A1voy1Q0v4liWZ7jueaPG53uLjg5DFi2s1TmyvijtFz8EYPu7S0Refxn9aD+e47L29VeIB8tEB5oJRaPGSiJxRiuUSgOEg7pXWGQr6dJ27mMOdXbywRcjbJx+m/mqGO9+8hk1sRhHPv+UrVUPWbSobm7UbccZ1IrlcrcWCSHzm3S956fmuSBPEWYFKPksV7S20n0mjMrtUxUOkLPtbiPvOITKEvKV+NQu6v73qBfe5JdvzyPWxsEzefWHLxH7a7DwG2a2BF49ICmUyxgl206Ukql+030etVFEHNxE3bwOhgsCkBpiahphm2CbiOIhtKowmdUNnHI5oeXK5am9VMrTGloQO/UkJnKI1TDavxG0VBhtLYRmBWGzgbtTGcj4Eb4ga8mkly2VJrWc4/y4PDtre4aBFgrh0338euVvluZ3yVsG+Q2dpYUdxn+focqsRNTVUSqWmJ6bs3O2Hdd/2tnJzF+44GQtq6+tf8AM+iqoQZHc3OL63QUWk0kqTJOXYjGOxGKIYJCxy5cL27u7wyOue0UopYi3tGhCqWuNbW3H+0+/UW1KiUqnUQcHT+avqUHz+ykVioyNjxfWLeuOLeXAqFJSKKUA+CYQEFLKc5phjBzv7a1oiUb1huYIeJLdVIqVR4+86du3bc9xhl2lLo6qJ/8+Ezxl2Odrl0oNGTBoe94xAFPTEraUk1Kp+KhSD//f/w/+Aqe93gPoUQAAAABJRU5ErkJggg=="

/***/ },

/***/ 435:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9gLEQIZMv2fGf8AAAMKSURBVDjLpdNNaFxlFMbx/3s/5uvOJJlMQqI4bTKpSa1oIRE0GIoF062grRtduBPUlaAgCDMRLQYEVy7cCIorUylYhZgSQoTGSluNzcektumYRGZMZtqZzMede2fee19XRiVLz+5sfueBwwP/c8S/l5n0JOemLjP9+oTZF/bHTNqjgKWEsSbNwPIr5xfzFzJnOJuZOwyk0xmmpjLMpCePRyOhH1IDqUTfyEnNiHRQ2rimcrlc4/694ocvvLfwwaEEf1++OPXs26kTY9MPP55EdPoQ0JQwTAEBqLYo3Nxiffnny3sN58WYGaiczcz9k2AmPXl8+NHR7MCwQmkVdKsbLRwD3UR5EuXWUU4LWepi/vv5j8+9v/AmgA4w/dqEmeyNrZ58YtCSzQ2EGUKYJvg+4KPaDqrt4jv7aIYLreD4M8NdX369tFXWAPosNTZ4ZCDhOXfB98CuIjZuwt11VLOOuLYAlRKq2cBzCiQSJh7OywAaQEB4oz3JQU3au0qv1Qiu7RHRHyHk+4h7f2JFUhg5QfD2LZRsE7UEom2/dAAo37cMM4gvm8LaLqGe/5x3lzpZvK4IrmZ5Y64XZ/IjtO5TqHYLTXi4jttzALRa7lppK6t0owM3GsCUNdazv1GwbWRXlOWVdYR08Yw2eJLq/Tpe270EYABUG3J58/adxlNPJ6N2V5nmxjSfvTMEtTq2ZvDN+X68rU+wRRbhKUpFB6fZ/urgC7O/FGunRwwj3p08bQXrKHcX5eS5czXH7q08QlYIG3sIXyndOCYW567eePWLnbcOAIA//KNL/TJ3ZuTEqYc03QVZJ/5gJz3JOOGoifBBN46Jby/Mt+Y3/bTRPbRaKBT8AyAej5Nv8OvvKzeOxsyOoUAwQSQcRzc6qFd0tnfg0ndLhdnNwKdXKgMX9dZ+uVgsqv+U6bHxJyO+I44Mx8oTKav6XH/IHhfKsyoyvLbTiF65vt83iyKnhdT2yo8/2YfaOPhAXEht0KA3Fio0QyEpNQMCmhWoYZm+7A86Tjnfsg0/J3OFsgL4C24rZOYHwXRSAAAAAElFTkSuQmCC"

/***/ },

/***/ 436:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM7SURBVDiNVZNNTFxVGIafc+4dpjAwTAvDn4S0dCBWLEmNEtNCwZoo7UpTu2utxoUxMTUmxoWLEtiYGMXUNKYrf2PFBFgoUaORQEO6qGKjowspCBQYGRhoqfN37zn3HBdtLX2Tb/fkeRdvPmGtZXtGBnoTAnvKQXdb5H4AgUkGuJMW8fnxs9/PbufFXcHIQK+UmDNuKNTf2pyI7GxociJ1ewBLNjVLZunvYGZuIef5Xp82fHDy7Qnzv2BkoFe66J/i8fqOB2qry5Z//gZva4PE8RO4rsviyBAllVXEH+7hr+vp/Ora2hU/kE++NHjZSACJOROP13UcOHKsrLCVpPHgQ7Q9f4IdsVLCsVJaXjxNXfdjKL3Mwd6nyqoqYx2B8l8DEMP9TydCrpzuOfpcVOhfCKVmKFm/CUIQNDUBEuf6PFhQDXWoxhaKm1FGh8eyBU8fkIFWpxK7myNCruEuJHELFeQOv0eu613EZoCKdpI98iHZnnO4t0pw5/8gHDO0NTeUau2fltYvdldW1zgmO0c4c4P8o2/wzCsDTMzc4t8nzuG1nmTyzzTPvnyW3ONvEV5dx3hrxGurHAK/Rxa1aS/fVUuQT5Pb04Ipr7m3USgC3Js5qGgk17oPU9ygsmonRU/vd5VSWKOxQYCSRURmjOEvBkEIRGYUISRdHYfo+vI8rI+inAIEAgKNUlq4RvnJrdXFw9FIDOP/A+kfEJuXEG4IHAcrJGyMg9FYrbDKRziVrKdSmEAlZd43k6tLS4EsrccG6g7kYZVH+srvzAx9S3Y5hVX+7dMKIcpZXFgJcgU9IT1ff3b512TBL5QjS+K3BdrHKo/qB5uoad9Lauoq1vfutEfIrnlMTl/zPF996vz4W2Zz/OI7fmY13bmv/VDIBltYlQVrAUu4opRdiQYwGuGUI2w9F78az69v3uw7P5kbkwBFP3h/bmFxenjo67yv9+JWtCFDVWAdsBLhxpDh3eRvRPno4+/yCyvpqypg8L5nevNYjRSY1x0n1N/5SOuOxsYaJ14Xx5qA9EqK+fmV4NL0rKe17tOGwQtTeXOf4G5e7Ym2YM0LIWm6VUA7QMgh6WkmjOWTC1P5a9v5/wD4/KncQBambgAAAABJRU5ErkJggg=="

/***/ },

/***/ 437:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAA5NJREFUOMsFwVtoW3UcB/Dv739OTpOcpJlN0qZpSsK0pl1xyIYPnRUnVn3QChvog3h5mA8FZSr4sCKsLTJQQWF7EMEiQ/egjDmliBYmTqhdK7aTXmzNXJpec2vS5nZOzuV//n4+ND4+jpM0jeGxO7g89iKivBlVvMoZGWIIjA0CABw+Ywm6Zen2zV3Ft/fuxRuYmhjAgngONDUxgOGxO5i88EQg6MJLkVb35WAw7A0efQi+h48DxFD992+U76+jtF/U8jX7nbKQr5+79FtlamIABABXRx8PtPkCnx6Lhc91dkhAKwe5faB4j4CkANktQuMQvGQiu1HC6r4xWdH199+49HtFujr2NNyOeLX/xOB4pDcAWDtwZ9JCKAo5wTDBsUnay0BO/SN4SCVv8hhctvdEKV/8b/jZ5F2mWojGumJXIjEPaO9PeNc30ewdISkPSMsLYOtLYPeKaPaNkDu1C3l7EZGEH5GQ74qn1owyRXWfCUdjXvA0WnZ2hXZqFKXEWaT6L4A2d0CZTdyNvIJi7AXUT38EZSstJFcZoY6QF7I4y2SIoYCfgTdLEIwRKV7Uc2m8fv4D1AyOusFx/uNvoBU2QVILhCQRt2sIqALMMYZkMDao+lUYB4dCi4bIVV1GpSGQ7PTB6m0FSTJ6OzXks9uI8z1o8S4IvSr8rd3EuTUoOw6HcDgEt8EVBWZjFv3BPCZH22BaTYARPh/tgC3moFXSkBQFwjThkAXbNIlxU5+pH5RBzE0StzA2+xpKuQyElgcsHTB1CL2IYi6Di7dfBuMGGMlUKR7AMY0Z1tStX8tlHZLkBbdt8WbyO7z18zP4YbUb9YaDesPBjaU43v7pSYz0fwtu2YIgoVisQdPNW3KzVv9+N5P+JBLp8winQB2eKgDg2nI/vl46DkYcAPDZU9MIt1QhLE6mpWI7nTJq1epNeeWgka1q1fdC7V1fJBIJkJYDAMRDYXz42JfwSDpsh2BxIcAFMSmE1FIWC+vFiblqT0GaXSkj3tWe00pbPT5Pe/JIuAunjpZxuvMvuJyK4NwBqIVkyUum1YbUSgHTf6zNzx+Ev9ozfDtSX8yHX9aSOjzmve30faBSOKk4hAdkDtXXSURHqFKwsJGuYXF+FdfnCj8uHoav7Rpti9TYrxIA9MS7GXV0qy223Z1Q64/0tDaeb/daj/pc1oMQoJolp3MN1+paxX87b6gpU7ANxSWymbW15v969cCl57J6CwAAAABJRU5ErkJggg=="

/***/ },

/***/ 438:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAA4BJREFUOMsl0c1vFGUcB/Dv75mXnZ2X7rZl2y3bZRVaa6tilXCoYoKh0YOSAEFPJpiYcPSiB7zY9qAHEy8NFxJjSuJNgzENUUhJIALaCC00hcXtG21323XY9+3uzuwzM48H/oDP6UOTk5M4QtdwcuIvzEycgMHFftUIn5ZJjINJxwAAvn+bC8x5TffXPRU7n07ewOzUGO6L90GzU2PP8YW3IiFJPZtMHpjuSR3Su3ujMOP9ABHqu9so5guwN1aauR37c1fwX859+2d1dmoMBAAzX70d6dLN718aPvxZQitDkZsQfXEgmRLEFGA3R8huwW0x7NTDyKyt/VBx21+e++ZWVZqZOAEtEJ+8cvTdyYS+jUB5Bj8WFSBBpIVJBB4FjTJ8SxMIyhTVBGTzwJvFvL168r2hRdng2N+X6J+Ox2X43EHIdqBuPqFgXwdcMwIiBnUlA1aoEO+NwEmYiBth2Flz2s7XfmeqoZ2OJfp1BBtQN58KCh1F9vglPCiOQHq4CPZwEQ+KLyN7/BIgH0ZoNSOkUBn7ert1yOIMkyHGIzqDX61ArdTIHf4IS2t5nL/8GK1sAa1tG+cvP8bSWh7u8MdQSiXyK01EVUAO3HEZjI6ZkgH/qgw39iLk8iKioSRGU53gIxYAhtF7DFE1gFxegNs4COmqj8iIBeLBO3Lg+0DDe96djkFk5/D6mVdx8YtOcL8BMMLFCxZ48A/43TTYkwgYZ4J2OQknYLLPndt1XjqlDbmghIOaqMNbvQ6LuqBaYSAgNGs51HeWoCk69Dd0EJeoAQ4v17ojOy1+o9h0TvUnCV6rKMKKQvbuHkr3i2i7PgBA1RToEQ1WSoPn1IQs6ZTLOKi6zeuyU9+7kttc/y7eNxwWPE8kCfSkOhEEgAgAEIEIkGQGBD4E88gVOrY2/3Ur1eoVaWDA2vOqpUKHFf+wMxaBaJcBBIIYEWMEiQFEAvA9QYFHTOpGZvkZbt3b+PpmcWBOurtcQirRk28WtwbNcM9QZywBRfaJEEAEXED4YEwlWQpTm3chs2zj2p30/Hw59uOOa2al4X4Tf6SHWgi3V7bX1yCqhSOeZ0FhBgyzj4iiVLU5NtbrWJh/hJ//tn9bqMR+yrldC9Qo1AgABlNJRr1JI+R5yReMvdcGOxof9Oh81FT4IQhQncvr+YbyKF21bv7nGpm2YBuqInafptPO/0nfqAFQUH7WAAAAAElFTkSuQmCC"

/***/ },

/***/ 439:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAA49JREFUOMsly01Mm3UcB/Dv7/+89Gmfpy/AsB1QiiEMwckIigmOxJmhO5iZbZkezJKZqDsumnjQi0CiJh68kOywxBh2dpFNDotxJOpQh5symFBCYcAotBQe2lL6PH1e/x783D80MjKCF+knnB3+E+PDp6E6vElWg+dF4kNgwiAAwPOmHY67rmFNHMrYfm9kCpOjA/ibnwFNjg78nz99JRoQ5IvJZOvYM6n2UEM8Bi3RAhChktuEnt9DYS1jbG0XrlrcuXn5q3vlydEBEACMf3YyWh/SvjnW1fN+s1KEJBrgRxNAMsWJSUBui5B9Cstk2K4Esby6+m3Jsj+5/OWvZWF8+DQUn196vv+1kebQJnxpF15jjIM4kRIk7rvkV4vwwgqHX6SYwiFqrX16vrBy9o3OWVF10HS0uWUskRDhOTUECjXIG0vkH4nA0qIgYpAzy2B7JXLiUdSaNSTUIApZbayQP7jDZFU539jUEoK/BnljnVOgH9lT1/FI74YwNws2N4tH+nPInroOiD0IrCxzIVDEkXhDCCK/wETwoWiYwbWKkIsHZHW9jfnVPK7cWISZ3YO5WcCVG4uYX83D6noH0v4+eV4VURVgvjUkgrFBNazCKhV5tTVOgj6LmJxEb6oOTncYAEPvQ4aY7EPYn4XR1gJulHk4kiTPcwZF3/cA1waMKlxZhqffRE/9CVy7qsB2qgAB1z5S4bDf4JQfgzMCqofgkgXXtkn07Nq0kX54TtvNE2/sxn6piIbYHEqVCtSQBgAoGVlEw1nopRLqYvVg+grpUhm+Y0+LtZo7tXvonAsdfwveq1/wpbl/aKD/JDYW5/FsWzsAYGN9Fce7e7D04He8fKKP073PaefBzzBM+y4zK4c/5Mum6advA6V1UiUCt6tQBB/MNcFcE4rgg9tVqBIBlS1yHn+PraJpHZQrE2xRL+cWnuofP/HikCbeRUxTwbnP1ZAGIgIRQQ1p4NxHTAtz8dYlZCoKZjLG6J18e0H4Y6GItkRdvupSRxgHnanyfbCASghEuRSMEAEQantcyc2Q+tfXlMks4ceMMHN/L/JdzgpnqatFQ3r/JfFM325fR9T+4PWU8WFHvYjmtmNQAkEAHJZpILuWRrpgYXJdu71SidzasWNTgrG7TQDQkUoyiifVgOsm29TqC53RyptxxewNkdkODqr6ypN8Lbjwbznyy05NXbY5W5MlnltPp2v/ATmTscA42Z4xAAAAAElFTkSuQmCC"

/***/ },

/***/ 440:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAA4pJREFUOMtNzVtMm2Ucx/Hf/3nfvj287RpLx7EdLBzKNnEcYgiOYCJEExcSQS8XZzSZ7sbEaEzwBrjYnWYJN3rhRS/UxMTEOGbmEkY2RwS3QVehFjmNMSmlpWfat+/x8WI3fu8/+dLU1BT66DZGJxcRnhyGrPNGSXaOicRHwIRBAIBpLugcc0ZF/flYQuK9qTuYnR7AMn8DNDs98BxPXPA6SHgnEAjO1Da3umrqfXA3BAEilBJ7yCQOkdrdquwfpD9Wif90+dq9wuz0AAgAwhMXvD6X/FXH+Vc+aGrzQ/AoIAGAw85JsAEGJxiAeqRhP/YUm/G/vs1rxmeXr90rCOHJYTgsfulc39BU42kCV/4Gr2Q5X10k+OsJpkHW8hwsXuFgBTrh98LGPb2Zw/TW6OuhiCjraGxoCszUNzlglSOwLy2CGSJRSws0vQoYGiTFhDU/T5ZNh9rbj/rmVqQS7plUsniLSbJj7GRjwAVzB9LuLqez7+Jw/CaipV4I0QhYNILHhS4cjt0AnbkEe/KAC1IW/roaF0Q+zkTwEa+HwVBzkHJFUkPjiG4lcCUcg/LvEZRnKVwJxxDdSkDteBu2TIZMswyvDDBLHRHB2KDskaHmc7x8qo6ETARDoR50N78A/awHAEP3I4ahkA9CNoJKSwC8UuCeE0EyTX1QtCwT3DLBDQO63Q7jeBaM7eH6hy6o1RJAwPWrbliFmzDVGLjTAa5psEiHoWkkmpqycJzLviUxBxEMlLazSC/fQjm8gf/nfv9F1LxkgzfkBJFIhXQOlqYusKqi38lmFYiSjOJ2nq988QDl8AZah4fQE5tHT2wercNDUH7YwMrEH8itZbggiEinS6go2hyFr55vbGjyb/W/1uV88On3OLcvQ3bawTnHcWfn8/v6OogIVVXDY18RL395EXdvPFSf7CXbxLVc+aBYKX5Sdyr4jXIA/J5PgOcMTgRCcgcAQARwzjkJIjnhwkY0geV/0tNLhfYUAcBHb3Y0dfqtr18d7h893eaBjaVhWVVYpsY5OJjoIIFJqCoubK4l8evt1T8XMzWf76u+JeFMwI3f4iEFTm3z6fomjFSqT6u4wHQnHLZasnQPZZ9VsR3P49H9Vfx4P/nLSv7kd/uqb4XKR0UCgPbmIKO6oGw3jGCLfNzVfqJ8sdald7tteis4qKSLO8myLRYveO4eqvKGxtkTycYPduPx6n/rbbgEEpKXNwAAAABJRU5ErkJggg=="

/***/ },

/***/ 441:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAA3dJREFUOMsly09sk2UcwPHv73nflrZvS/mzjW7tVgybYyKBADFZmCYGjAdcBIJe1GDi3XgwRmJw24GLCRfOYjh400iUg0JAIYAKAQSy2TikW4CN0W0t/d/3fZ/3fTz4uX9kcnKS3XKe8Yk/ODOxD8c3fVEnfsgWsx9ljQEQBNd8w0Xdcs82oix+OHmJc1Oj3DZvIuemRv/Px/amY2IdyQ3kT/XkBxMbN60jmcmBCPXFR6wurVCaf9haeFr62DXe90dPXK2emxpFAM4c25veEE+cHNr16ke5ZI1I+wlhLotk80asKLieMPs37tIqi500s3NPvn7eaX569MTVqnVmYh+x0Ly/7ZV9k/3BXaj/g+7PGuM4IrYthFrCoE1gayNRV9LlInaie9dq1f93/I2hv2zHp683mzuVydgEjQCKyySuPBM2b8HdvhNEEbl/F5l/IMHgIJ2hPL26l1K1eaq0VPtZRZ3Yoe6+XIKgCMUCqYF3aX9wGW/jAaLT94lO30P1vU3zvV/B3oHM3ETFanT1bExgm8PKxuxPpxTarZCohowdP89nX0wQbh1HrdbwFlZ47ZPTfH58CnfrOySqIUHQIJ0EFbr7FUqNOSkH2hUTbBsAYHjrS0QrM3RezFPfshmAI4cPYlXu0h55AdOqmtTaBEHgj9lhGGDCAKM1jWiUCycHMOuatBo/QSJCLBnl0ulRPO7hPb+PiccwnkcoPtrzRAVe+1qjUkZUTNAat93EW76J+BUs46NCH7fxjKB8C+O7GO2hxJbqcoXQc6/ZnbZ/qVxuH8z2JNBey6AtUZbi9oXrrBSWAOgaybDr9T2E2sP42oi9RpaX67Ta3kW7U2/8sDBf/CqTGYkTlgTtEQIv7xkh2DEMIlgRRei6oAPQWjzt8Lg469ZrtbPW4GCqoavllbWpzFvru9IYrwImNKJELEth24KIwWhtJNSirC5mp5e5cmvuy99WBy9av0+XyWd7llqrj4aS8Z7h9d1ZInYgQogJfYMJUCoqthUXz9/A7HSJ89cLN25Uur9ZdJNPrJFckl8Kw23i3oPHxYeY6spurVNElIOT7BWRdVIt+cwV69y5McN3f5Z+vPO8+9sFd8Mdaa7UBGAo369kU7+zRuv+zU5j+9Da5oGehL8zGfG3YJC6bxeXmpGZQjV1+ZnrzHpGzUUj5ul8odD5D5+Eub9JHbqxAAAAAElFTkSuQmCC"

/***/ },

/***/ 442:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAzZJREFUOMtlkF1sU3UYh3//87XTtevanek+UjPSjUWyaTAD3KpBwIRkFxQCQjTeaWJMjDGKiZgIUwhcLJkaoiOQmPi9CJEQxV1o4nBAB5SxwbAFByij69i6c8521tPz2fP3Qrow994/T573R/DgfnzmI+w434UTq/fyQsgf4yvEN005vwMAxLC/z8pbvY6mX9g1csA99ex+bDu3DwBAAOB4x8fYNfQOflj7nugLhg9FNra+XbNuJXzhADyniEJOw/3kOKaGbvaQeeX9+OVup8RwAFDNpQAAPF9hrHplI4J1j8CYzoMXRcDzAJcgEmtBeW3l7j+/GPABeEPyJQEALAB8NXEF30XfjUXjbVsf29Rart9RaKAxRFLfnIGSzhSllgjjyAatjD5KHN1a8bwWHdyaPDoJAExpA9YnbKjfsCqkjk5RpoIn1478OplN3Fw9mUh3pr4cyJJyliz8rdKaNdEQV1a2vsQtCiilUVEKcLZqEscwsHBP6Xnp2qGrL44c/G0hIx82FQ2uZhMh5Od5v9hd4rhFE2FUSy14DMcwLMdDCPhe+L5lz88gBGJVYBvLCyiyLpw5g5r5wifLCorwzmTP3tACKyW4io3mnbGOqub6wXBj3WBTfN3T1PDgqwkgOzw+r1PjbIkjeOiOt3UNtXftbHdyFqhH4W+oBHUp9LsqqOuhKFAkjpwafnW0e82Sgv7Ow/8NySI+8unpc2ZhAYQH5AsZKl/KUEooNE1F8uv+hG7rWwDgaNuHSwtOxg5ge2Iv+lr3hHxS5ZZgQ/UH0c61zUXHw43+xK25iZmDs7nZn94a71WOPbUbr430LH/hZGw/AKaqof1x2VJ11G1+Ep7rYfr36ygL+3F+4A9JgKC8/gBeMiIAbE/sg2vZbF7Lo/Hl9bBzJnVmTLoi3o6/Mncxr+vsL9LVh5GlAgCwqUvysoZ7F9OglIIyFLeSY5iTZ3GHnw1mTVOMSNJiOft/QU2knjNVfWYimap9YnNHLcMxpO/zY2O3rfu9ab8yZXl2WaC62gsKgi2rKl0mYBoquG+F4dvPeU2b/hlNN12/fAV5WGMngqnPBLA8QyllOM5gXLcwncvRfwF0A3E6WU30IQAAAABJRU5ErkJggg=="

/***/ },

/***/ 443:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9oFDRIdHcYztZ8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAC+UlEQVQ4y31Rz2sTaRh+vpnvy8w3mWRsasbajO5gl65iQetBqq5WRVQ8KZ5WUdgi/QeUxcMeFg+erIgHD0WKZ0Hwtwi7CruItbuIaKFqm8Y0qan50c6kzSSZyWT2IBXR6HN7H16e93mel+AzDA4OioQG2+Nx/WyxUDik6/pf+WJhqOkGfw4PD3toATIwMCBQSexFgANAoBmGcXBL75YeWZYFx3GC8fHxZDqdvggSRIOAeABuN1w/OTIyEgAAlWS2J67HL3d3d3dRkbJIJEpCIUZ834dt24Qxto4I5IphrK1HoxE/m80ety37KIB3AEB+O3vm7107+3eEQlTIzs6iXC4jHA6DUYbRZ6PY3b8HsVgbqtUqkskkavW6n8lkrjeb/u9e3U9Re7G6U1XDcBwHY2Njn7KZpon+Xf1w3ToWFxeh6zoYY3ifey9qmnYkk5lpL5VKZ6hTqaSXlipr7967Q0zThGmaoKKIcFhFdjYDz/XAOYfjOKjWqgiCAEYiIRuJxN6no0//EFeu6lAFQejjskzXr/+JLCwsQFEUUCoiX8jD8zwQQuB5LmzbQq1Wg6qq6OjoECZev1kjaivjE8VSCVxim03TlGq1KkIhCQBg2RZc10WlUoFdtuF5Hz+phlVwzjH233NHnJvNOqmpqUd927YWGGP74nGdNv0maTQaIASQJBmcc3DOIUkSQiwEzsOYeD1Zf/7i5VWyXNrJkyeiRdu2l698D11dPy6k0zO35j7kz9Fl0rLsMggiAiGdG9tSPbs7395o7zvkl0bvi/9kVp96ONn57/Jucd7yCBHmHCpY5Ev1m6fRLohisWf/3kYh9a5SSKWPNeru/cNDrd0IrUiuRR4DAT5MTmtBMxABkG/F+UqAxWSHyuxVM2hWf/71l1qbsfq2qrcdfXBeYa0ExM+HB0OKHI3r+4yNG/okVZnOTU0+MXs35QkTYp5fz167uzT3pcCnEm9eAFFiGo8lOjPKiuilXGrKKuZmSvIK9QclpnFrPjffysH/XJs96BPLGEYAAAAASUVORK5CYII="

/***/ },

/***/ 444:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANKSURBVDiNVZNdSJ5lAIav53nf7/P/b/r5N5VNVFrbhPUjsZyaQTmPGmtHtVbUSRCLIIKCEj0JohbFCI+iFlgDrQOFotBUTMpmI746mNP579RPv6b4/bzv87zP08Fos/voPri5Tm4uYa1lfwZ6OuoE9ryDbrXI4wACEw1wxyziq7Pv/TC7fy/+Awz0dEiJueiGQt0NtXU5RZU1Tk75YcCytzbL1vKtYGZuIeH5Xpc2fPr8+6PmHmCgp0O66OFIpKLpYFlJ9srvg3g729SdPYfruiwOfEO4oJjIsTZuLG0k1zc3p/xAPvnypUkjASTmYiRS3nSivTM7tROl6uSDHH3hHJmFWWQUZlH/0gXKWx9F6RVOdjyVXVxQ2BQo/3UA0d/9dF3IldNtp5/NF/oaobUZwrE7IARBTQ0gcZbmwYKqLEdV1ZOO5/Nt/9BeytMnZKDV+bpDtTlCbuIuRHFTeSRaPiJx6kNEPEDlN7PX/hl7bZ/g7oZx5/8io9BwtLYyS2v/grR+urWgpNQxe3NkbP1D8pE30ZFjPPNqD99nPsdwrJYzr7xNUPwAicfeIWM9hvE2iZQVOwR+m0xr05h7oIwguUHicD0mt/T+R07m/y4O8qpINBzBpLcpKC4i7enjrlIKazQ2CFAyjdgagpJ2+vs+Ruz+ihCSU19fBrUJ8Z9RTgoCAYFGKS1co/zozvpiS35OIca/DRs/IuLjCDcEjoMVErZHwGisVljlI5wCYmtrmEBFZdI3Y+vLy4HMqsAGir+nFjBeGqs8rO9h/bvdeB7RX2axWiFELosLq0EipUel5+srk39EU34qFxmOEHJg8MoUM9MLJOK7JOK7zFy7xeDnk2RmCISTw96mx9j0Tc/z1ZfOT39uxUf6PvC31jeajzQ+Hio6oMnKCliei/Pb8Aw3rq8QDksamw5SXVeDsBX0XR1JxuJ3ui6PJYaEtZZ3z1RLVwSj1ZXlD3eefiI7MzeJVVsYvXtXmFAeQuaTiCmufjeeXLodu+5pWnonkuaeTG91lkqBecNxQt3NDzVkVlWVOpHyCNYEbKyuMT+/GoxPz3pa6y5tuNQ7kbwv0/681pZfjzUvhqRpVQGNACGHqKcZNZYveieSN/fv/wX026fsRs+xYAAAAABJRU5ErkJggg=="

/***/ },

/***/ 445:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAPAA5ADTAEYQMAAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9oFDRIPLZge9eAAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADa0lEQVQ4y03STUwcZQCA4febb2bZYf9YfiJLxbYgUKGJLdi0lNT2YElNNOmBxMS7By8m9eiJKImpMTGNSRsTvXj0gvHShpp4aIQDQm1pKVRTpCzuD7DL7s7O7Px+HtqDz/29vQJgcHpOi2Ly1NFEvfjpyT+PtpnmZUOXk0h9HEAF3qofhEteq3XXC6OVmdkFj5cEwOvvXx/o6Up92ysLe59dKE535o50p7vThtnVA0LD3i9T3zvwK/md/UKxPOeHwS+P1FR+dnYW/fiV60ZbTH/n0pmhqd8W7YyVTTE6LBBxELEaQhqkku0kX9GNrlwq1/4kPbf7/J/hk87vXwN5OfzmVM9Af88n5yZGTjtexEeJ72DnMUqLEIkEKvRgex21cgdZXid1bNCMInOkfljbnbk48ECeP3fmrY0SXx157VUCYbDwVDF9VqLpOlHchDBAOE1ERxeqvR3l1zCz3abbcMbtRvOePpbdv+SlR/AxWHv8iH4MZC2LpqqEoghCQ5ZsFBlkcEjUqWMYFh2dqe69cuWyNtbVnDybO2B+foGcUeW9s314g1fZCMeR+QPkzh4bwSncwavsmVMYpTIqtEjEI0PDP69lE5z+cKLBjx/8wecnbvPGsU6u3Zin4GfAU+ApCn6GazfmqcWPojkeyrcxTR0VReM6UUgq5pHsaCAzIFN5vr91k8baD7iNDhCCyZRkeuYmjZVvcHJZVOAThT6B7wk99JxVp9G8EtdjhIREzXtUl7cQkQXSfbGKs8jhykOUU0BpgNJo1iwCt7WqOba71Ki7vhAmKgzAa6KsZ0RuBeW5KN9FtSpE1hbKt1BBAJGkWrF9x2kt6o5Vv1suFD/uzPb1SirY1Qbr97Yo/l3i/3qHehl9ewgzEcd1dVXaLVWsRvNXvVy3V+3W9pdxM/HF8eNH0mYiz8S7J0AbA7SXswMqBCUJgxSbj0vO/c29W0+qmUfyMDYYdcWcWrNezUnig5lst6EbEoF6EUWAMBCYtJx21teK7tLD3cUH++ZPT63MljRNUzxvJu2W5xdLhVKE0zwRBHFdqDZh6B2EkUn9IGBnpxmtr23bd+4f3F6rJH7etjOrgesdCoDR0VEpk+l0SnjHxrLWxb5keKE7oUaTsahfKSUsV+TLlvhru64vbzbSy06oPxOSf2ulovUfHJK1gQw2bmUAAAAASUVORK5CYII="

/***/ },

/***/ 446:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANGSURBVDiNTZNfbFNlAMV/33fvbdeVdazQsslgGxYkyIaIqwmbbhLUyRMG32TBhBdNCMYHfTBR2HwwaoLBxIRHjckSEhf/xKhR/g0mimaJcwgyxsYo67aubGy0XXvvd7/PB3TsPJ+c5JyTnzDGsFy93R0Jgem0UG0G2Qgg0EM+dp9BfLHv3R9HlvvF/wG93R1Sog/bjtO1aUMiXPXQeitc3QAYcukRsqlRf/jGzXzJLR1Rmk/2v39OLwX0dndIG3U6FqtJNrY+V25XwZ3h3xg//QOlu3Mk9nViK8HNrz/H1ULPOquuzDnxbQePXdQ2gEQfjsWqk9t37SlX+jIqnyc/eZ263W0Eq1ZhfIVQi2zc/zJuxpdXLpx9JOu6rwMfiy+7nk84thxof+GlCOZPjJnHCqwgMD2NPZEGwKutRSiFffsWIChW1HPywo38QtF/TPrK60zUbwgLmcHPpcBonPFRZMYlnzxKPnkUmVlERVrJtR8n/9RHBDyXXYlQSCn3gDRusa1yddzSuVGM9jHKI3B7gsXmN1HVO9h76AN+Ku+ktPkAfVdn2fvaexR2vs1aJyfx3XZZVLppRXQNfmEKfAW+YnFzI35FfOkqbYWAB3f7kXXk6ndSLKlG2/M8jFYY30cYhVEebtCChbNQ2UJvz3G4dxGy39KabKG151OY/IaSsfE8JWztuUPzU+NPR8Ir0e4kKBeERGTPIOb6QEgwBrSCqe8wbglhRZhJu2jfG7ILru6bSqVaCmvKrIFL8yAE27dVMpe+w5ZkA8KS//W4v4/2SvwzkGJ+QaG0TFnPbI2m0pnswfm5fGDrliDxmMNfl3PEKn1++f5vpNGUBSVeocjY1Ul+PTVGNBrn9O/D1NTEqqyfB7OzZ3o+dINB59m1NQEBkJlxebK5inBFkFsjM1w6Ncy1wQmCoRBNyWb6/7jG+rowhtCsMMbwzovrZDhkD0ajKx8NhULiiR11VK9WaLVwHxinAiEj5Gc8Tn51vjRz9x4ND9dNKmVeXYLprT1xKdBvWJbT1fr4prLa2rgVq45htM/0RJqxsQn//MBISSl1RGmOnegvPIBpuQ61RzZi9CuO1G2eTxOAYzFUUpzThs9O9BeuL/f/CzC7nZgX/q6NAAAAAElFTkSuQmCC"

/***/ },

/***/ 447:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANASURBVDiNVZNNTFxlGIWf77v3ztCBoi0wBWeACgi2gSqCqZBWqLUpqSzQpgsTm5DowiZNGxdq4kICLowbYkyN7DQxulCIPytjYgRDq5FKYhFoM1MZ/mYQHMfKzJ2Z+/N9LpoSenYnOXly8r45QmvNbk2M9DUJ9HkDr0cj2wAEas7HnNKIT8++/V18d17cA0yM9EmJumSa5nBjfW1pReSgUfZQE0JaZDeWSK8n/Ju3buWKxcKQp/jgpXcn1Q5gYqRPhrZXfy/NbRw28WR9/4v4piL+9ZcE91fw8OkBKlq6cP4qMPPDN/b6+sqvji9Pvjx6TUkAibpUasnmxpPPy6ZzL2CWZgk+IGh9ZZD6UyfIJm/iFW4gy1bo6j8XOhCuOeq7zmUAMT58uqlEqtkTzeV7S/5LoNH4NdXoQBAruQGAV1eHG61HuXnQIZTTwhcff5S188V24+zx+stPVXnPlluWsLuHcBr60crCTP5JvuNN3EgvgdhVRCGNVxZCF9KYe/ZhOsJYWk5sS+0UesJkpN39FgMX3mFq8R+cRwf5PnSegYvv4VV3kH/ydQKJJfActOfi2QnCkaiB7/TKgqeOZA924ZfX7nqORhl7dpy/N0z+cDvad8H3UPYG5VURCkWvzXRdl6I2MVbHGf/sCggBm19xvNnn2OfvI5wUbF/DDSm0e7cBSqOVh+t6wlSuM/fv1ubTlVYStfEtwgoiAgEwLUTmp7tArdC+j/ZctOcgAxX8vXYb5btzZt7Ra6lUms1UjpZWCykECEBrkD5aaRZmEuyPVDI7mwE0nV1R1uNxP5f3JsWHFx5bcx0n0tlQRXxxgea2SqKNVQhpsr6cYXF2jUNPRIklDVoPhQD4Y9Fnbj5m53L5x01DCrc6EiSeusPRZ45xe/4Gv01fRymobaygvauOaMM+YsnMzlFzOVvb2ezQlSk7ZnqefnUrLcbSW5nqqZ8d8dyp7mD3GRPt30H7OQCk9SAdnQe4PrNEzrb12mpqwfUZvW9Mb5wJS4F6TUpjuLutrqS2tsYIR2oQ0mAztcXyStL/8Zf5ous4Q55idGzaVvcB7ulib/kjaDVoSdXj+hwBsAzmih6TSvPJ2LQd253/H+8umpNGm6YYAAAAAElFTkSuQmCC"

/***/ },

/***/ 448:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAA5tJREFUOMtNwVtMW2UAB/D/d6709PRwp91KuV8LYhbRTGAXFu+Ccfpi9uSDJsZoYoyRkCwOH4iJ0fhAovFhaowafSA8bLqbcYywTTddHBuXAeUW2o620J720J6ey/f56u9HxsbG8Bi5hOEzN/HTyHFO9shhURReFgh7nvF8Dyjdoi67YDN20Uxkr52auG7jf8i5j5/E8Jmb+H60v8YrK2/UNjSP+0NBVBzwQ4xeg9v0LDLRLSSiCcQ3Ij8a+5nxZPBUyLVN1ZHYBQIA340OVFervrOdXT3DfmEHnGwDjS0MNQFCCibD6iKhmTzSBQ/+fFi6pHU8U+9TVc/q6vJnwtnTJyBT+82e/ueGygqzcBTKiFcDV8wSrugDy2eJq4qAqrKqVILoe+0dLx0bhCAIyBnGB4JGWX19Y8tHmrZPXN6GJ6YTwdiB23AARa0UYjIGeWEFlAdxW6shiAIAwgAQABBk1XuyKlgru/t3oWwlQZtex7zYAXLjC3QXbmBjm0ey9T2EQ+VQ/h1HpbSLtfUIqayowO3bf93hRIJBtcQCdU2Ihg10vIiRsU/x4WUbSMXx9nkBo59/C6muFw4fwqM1S7g6PQMAiEajIxzjuT6Phwcr5tl+qAIkNYenjh9DOFgCPBLGycdLEG6uBzJrsMoAzWMitptjBT2Lze3oMvn1k6HkkaNdVUX9FiOSTIhSA6m8FVxxBZbLQ+ApiKcVVj4Dth8BvziHTDSNFb0MK7qnm3/taO1AdXV5O+cmCRiDs2dA3NyBSwmY7IK5FLQQA4q7sOeXwbxVKH3lMKr8Krzrdxq4Qt66mstREHCgloXcZAwlE3FIX29CUBlowYS5mYPx8zaMpTik3l445ixTWhTorjjA5XV9KraxbhGlDYQVoYQAc24B7Mp9nOubwq1Xr2Dj3X/ACRRcOIClX35jnPgCicykkUgVv+LrG7Ssnd4hwYNtg14fD76JIldXwgoP0iSliihv0FD3ViM8Ayq85QHkUhy5PDGpb9xfm9QL7vsEAN4ZamvurMEPR/qfOBwM8eCFPVDJYZxjEQaBweUJsz3Yidr4Y/pu+vdN+fTUzPKXAMB3B2Wcv3cox3uNtfj6qkry+U7mKJCYRmTRDzMrkMSWgfl7D3Fp9sHi9LbyzZwRuNjmr8wm03GHAEBXSxNnVQR8PtdqbNeyfXU+8+mAYh2SOOegQ7lMIi/NbxvS3wu5sut5R1qDjC2aTGYXIxH6H4faqHm8SvJaAAAAAElFTkSuQmCC"

/***/ },

/***/ 449:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAALMSURBVDiNbdLPa5RHHMfx98w8WZN91g0J0a2giVRtNAppCHhorEmwwXupIN2D5C/oSfsniEfpyXvtQbBHEVlJY6VEhCy70W5KNTbJUpX83myeZJ+ZZ749uCu19fC5fT6vGYZRIsJtpb40cNNDPxBopeYTkRt5kZ8Abiv1rVHqey9yEnAa/kjgu7zIr+pHOJYKw9LQlSth9/AwJgxZn5qicu9eVKtWCwDZw4e/6p+YSHeNjOBqNdZLJebu3NmJo2jQfAM/nL58+fPcyIi25TLuxQsyJ07w6aVLbW51tberr+/Y8LVr6Tbn2Hv8GFutkjl1ilQmY9YqlQOBgrM9Q0Mmfv4c2djAKIUrl6Fa5czkZId4z96jR9jXr5E4xjca7M7O0j0wYBScDQQOtmWz2JcvUcaglMJojarXcdPTeGuh0UAFAcp7lHP4KKItk0HgoPaQke1tGsUisruLMga0BmNQWiPN0IpS2JUV2NvDQyYwUN0ulfpMKkVUKJDq6SHo7CRIp6G9HREhiSJsrYat14lXV9HHj7M1N4eBaiDw4M3Tp5NHR0eDuFTCrq3hNzexWgMg3pMkCUmS4KzFOcf+/n4WnzxxAg+0h+uLlUosYYg+dAjnHNZabBy/i7XvhtaSOIfO5ZB0mr8XFmIP13Ve5JV4f+vZ3btRx8QEft++94MW1DrZt7cTjo8zf//+jnh/Ky/ySgN4uLq2sDC7ODNjOy5cwCXJ+xu0oMR70mNjVItFu7G8XPRwFUCJCM3v2qXh99MXL+ZCY1T94UPEOUQEMYbM+fNE3ktlauqth4G8yMYHQBM5o7X+7bNz58LObFZvFwoA7B8fZ3Nry/85M7Pjvf8iL/KstfkAaCInNUz3Dg5253p7A0R4u7TklsrldQ+jeZH5f/f/BzSRTzT8cuDIkaMAK8vLf3kYy4u8+W/3o0ATyWj4ufnIX+dF6h/r/QO0G5P10apnIQAAAABJRU5ErkJggg=="

/***/ },

/***/ 450:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9gJBA4RNb8/C/0AAANnSURBVDjLVdNdaFtlAMbx/3lzzkmaNP1I+rV+0nZTsq3ObqNrh1urjro5FIa4G5UW0TuFIjgqOMS7IVoogigqdmiH4AcyrB84y1w7t+nWrWu7QaxpWdc0rTRtWpvk5Jzzvl6MjfncP7+bh0dTSnFfxKMvfxTZyNjdhulp1xRbpVQoTZvKZK2zXl0fuPTFKzfvL2h3gf7BUf3UT+PHgvm+N194ard3V6RK5PlMlFLcSqSYnE64Xw5dsVbX029nLPvdmaFeeQ/oHxzVT34/NrK3uX7n0QPbzYDfRzgUJLGSIWdL0pkci4l/qCwN8unpsdyVqbk/HcfZPzPUKwXAyR/GXm95qK75SHvEHP5jGitrkd7I0lgRpLLYy/x8gsnpBb4dnuSlp5vN1h21uzVNew1Aa3nu/YjXa1x+48UO/3g0TkNVmGcONKGUwrIlH3/yISkZJucJI6WkuryAhx+s4vgHP2dmbid3iIzldD2254G89Y0sZaF86ipDaBrYrmJ+KUX8doygWqA+nCXSUM72zZUYhsHRzmYfmtYthBDt5aGAdv2vBFWbyqgoK0JKQIHX1AHoebUH3U6SnLuK1zRYyzoUBgOa0LQO4Sp3W1VFEY0NNVSU5GPqAldKsraD8NwBhBB0Pd/Fltoyfjx9il9HJrBzFkqpJiGlQjdMSov9+L06puHBdiSW7RJbSN3bW0rJk4cO0753F1biAqnU6h1cok1FZxcRmsDUPYSDXgDyTB2P0O4BjmOTy1m07Wnl4OP7SESHCQfsmO7mnOGJaLzFbwhheCBt5djIuvh9HhZXMgC4rovruoDCdV1qq2soKgjwSP16qW677sCFa3/3bK4u9kfP36SkLEx8OU3jpkLiyX8BsCwL27aZnY2xkEgwMnqOG4s+eyVtHPGsRM8k3/t8JJdcy7Q3VhbrN+Jpbi2tsZa2KSnw4SxPIZXiq2++ZmY2xhOdB7k2fpWpuN5/bvCtzwSAUqpvNr5y+bexWDZSHWRrTQjbsTE8Gq5RyC8Xo6QCO1l3/ExMXqettY222tU6AAEwM9QrlZT75xKrxwe/O5+en190w3mCUL5JeeQQueA24su2e2bCyl689LuqrakD2Pe/N95N/eETW0Dr1oTWkWfqTQrI5pwJJdVZUAPPNi11AseAvndO9PX/B68Glh3JCjj7AAAAAElFTkSuQmCC"

/***/ },

/***/ 451:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9oFDRIWLHQZbG4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADVElEQVQ4y53LvW8bZQDH8d9zz3N3Pp99folfYsdp3DptGqcoKqEDFAhQJSCQutCFCYEYWSohpgwe+Af4E1irDqgSAlGEKqANqiGh2ArpC0nc2PXZsY19Pvve75hAzHzGr/Ql+I+blU1BoHRNlKQNntEXQdnzABC49o7jetu2ad62Pf/Xa5Vv7X8eAgCVSgUXyN0CT9nVfKGwlczNpZSUwkszaYBwmPa60E76zqB53Gur3c8cz71VDy43K5UKKAB8/DpfUCLRT04Xi9eLCTcdF0dUiPrgkjyo6ECwe4haXRrj/SgToy9Zli3H3cP6jTsHGr1Z2RR4xt4rnlu5XkgYCY52EIQ5gAYgoRAC30Gg9xBQGxyZQAmLks8SS9pw1Lq2fuYBEyhdy+VzW7mcmIA3AhsZEJ+24GXm4fISCOHAGi3QTgPWbBJ+WsJsSEnow8iWqg52mSCFNuKpZIoLVPDtJgz5NfySWUSRtjB7WAVAoNIXcJS5ihXyBFLrLoIcj3gymjrpDjbIpx9cuf/ngLuE/+GUrFe5tZJy9sN3lpCNGeCCMQBAHTkwXWB5HlieJ/82AOCgI5sw8f4bKazmyTk2Eyb26lkJo76AH/7woRkmSvkQkgrw7pspgABffNWHHBHgOiZiEsPLZRGXFnn8rDoO82xjx5pM3lq/EMbpjI/aoYNkhsP5hTBmkwFAgI/ejuLhkYF+D3iuFMJCOgRjqMO1zB1mTK3tsWZdycxI/GJ2jJg9gZTgoMRFEM8CCEE+FkDOTmGIU2SyIgihaA+mjmGY9zhD125322rf9eMgYJAVAft39vD4p31oah+a2sejH/ew/30NsiICHmBNWNBpdQb6ePIdfXUlfqJrmiEIyuV4MimKgon0qRiOfmviyf0DNOtNwPWwurkMSZbguQr2612jWm99vnui3KJDoeTPCMZoov2VowiVYokUL0oC5payOHOxgNLFBcwtz4PxMkwjjL2aam3/3rr3oCfdeKTHDqkkSeTpJDI1bUfttDs+jMl51w0xEoiEZ3F4vgSt7+L4eOLv1RrTb3b7X9cG8peNaWzHtewhAYByuUxpRFGixC6uJPT1fMR7JSUH5YjgzwdBQHSLNLs6edzQWPXhWKkaHjsgFM9GHVX/G5i+eQS8KyW5AAAAAElFTkSuQmCC"

/***/ },

/***/ 452:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAN2SURBVDiNVZNJTFwFAEDf36YwwMA4zDAUsClrE2QptpgqFGqNBeLFVtQYi0QPTYW09mL0oAQujR7axHjgYtKK0SYtNlaMjYaWQUKwhKUdtbGlwLA5MMMms/Dnb57a4Du/vNsTLMtiJ71dDYUC1kkJvc5CLAMQMP0Gss9C6Dnx6c2pnb7wONDb1SCKmGdkRekszi9Mce5+Wkrx7gUsIktThOenjQePZqNqQu3QTb54+/yA+STQ29Ugyuj9bnd2dVnNy3bZCYItjqAAyi4wbRAXiAeWGfX1x4IrK3cShnj0vQvDpgwgYp5xu73V+4802v3XL7I08Qf2TCflrc0YmsG9S1cxEgm8FaU83/Cm3fdDX/XCcvgscFG41nmsUJHFsfrG1xzR0G3u/3SL0uaX2JhfZfXRApKs4H6miLQsJ5OXr1Pe3Ihk5fL9tb5IXNX3Sydq95zdV1h8ND1LEkVjhpwDJUhJSdgcGeQ9V46nophUTzqyTSS3sgBJVFHsDqyNqDQXDG3JVmK7Lj3TI5mRabRtDd9nwwR+DxLfSlDxehmKXWH8m0mS7Aq5VV5e/LgKW/IK7iyXxORf9eK2bpanPpWFEQvSf36C5E0Pre+20Xa6jcjNWbQ/BU61f8A7LaeQ7v3Lzx8NYW6vku5ysq3qZbKmaVimjmUYTI+s8H77W4gjI1jr6zS5vSgv1KENDkI0yqG0DL6amAbTAENH03RBNrWEfzMYOOxIycDuUOi78h1roTCGZXHQ5cLs6eFOOIwiiqTtUkh12EBIIrS0hGlofjGWMH3B+XlDTM6m9nQ+DxYWOehycSw7m4m1Nfzr67ySk0Ol08lcJMqBlr0IQiqB2UUjGtcHZDWhfz087j+Xv68kdU91IcnJf1Ny/Di2mRlaXC4EAEEgOxbjfmKLNE8GkRUV39hDVU1ol6Vf74bXbn37eSIcXK4praxRtMgSw79Mkl1WQXJpKUJBAWsbG4wHpplT4xw6WcvVG7/FQmsbHV/6on2CZVl88mqeKAvGQN5u77NNjUfsgVE/d6+MEwpsYgEZbjuZRW6q3qjkx9ujsbl/QhOqzuHuoZj5ZKYPmzyigHlOkpTOmqripNxcj+T2urFMg+XFJWZmFo3BsSlV1/UO3eRC91DM/N+Nj2mvdxRhma2KaNZpBuUAioRf1RkwLS51D8Ue7vT/A0afmNr8sO4lAAAAAElFTkSuQmCC"

/***/ },

/***/ 453:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAw1JREFUOMt1kltoVGcUhdf/n7k6JmOcCQRNSaAES9H6IvZiaZOAVSgt9iGh9KUvSsUoLZUS2kIJaZFWig9NCwYUlVBLJw9FWq2RUmtvmjShQhmRXMjNSeJkZpLJnDnn/Oe/bB/qhKjt97TZrLVYsDfDfdpSKfS3t+Otk8ORSMDaWZ+MHDWE5zkAA7o6v2j3ztvlX799t0W0daXQ39UOAGCVgI/OjWKykN24rTFx5rktiVefqI8jwAFlCL40mLxbwuXhme/Tk7n9m2prsl8eegarvHPmbwDAx6n0lUzeoaWyoDt5h0bnVszIeN4Mjubo1p0iZfI2dZ764yIAvN59EQBgAcCNC704cnpkx9NNiU+3N25AyVOQ0kAaw1zfMNvTsD2JWDgEQDehYfdgquuVcQDglRZB4LPWbUmUhYIxBKkJviQ4vkTJ9eF4GpmCg5anHgPn5v2KbzVACPF4VTQMXxnyfA2pNIqOj+WShO0quL6C42taFwkhm8u9UPEFKoMyaqrsyQbOAGkIc0seZnNllIVG0OIIBi0EOYMrFday2sBxnWOX/ppCLBpknAPZoodr6UUMjxcgtUE0aCFRHWY//nkbjLGXHwh48/MB9L2398rw7bnfiiUXVZEAhDJUEfnKUDIeRl2VhctDY7j6xf5LrW+fwiPs7Ojb1Nn7c/p6epYcoc0/08tmZCJvCiWfhm7N0pETFyY27/ukHv9FW9e/d8UAYd8H3xzrG7hJc3mXphfL1PvdDXqju5+ebD1tAcCuwz34X17rPA8A6Dh+fqhQcmlx2aED3Wd/AICalj2P6NnDi4MHD+GlWCqqa7ZO/xLsqAU3eLb0VS43dbPhxE8xEU9UUXPzHurp6aH16+9/YoV4vDkgxMS6JTdW277DfLh3i6KWuhmwlbHYucHqr51QTTTAqiMLCzNc66QpFEIUWNumrkmHpAokM7Zu9FwHmcwMY2AoLNvIi9hWC9wx3F/xfT6/cXM4uyKUvTYAlrQIgLKlVR6bzV4T4u6LAGihaH73TLUNwGccAhqKSTJcc9wDn1mVd5FDf/wAAAAASUVORK5CYII="

/***/ },

/***/ 454:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAA3hJREFUOMs1z11sU2UAgOH3+3rO6c9p6Rhsa9eVEnHOYSQokjAkIQaiFwYdZlyYmGDivYmJiXq17cKfGEwM18Zw4QXJVGKWqCSQgEWUEEDNyHCDbrB1K2drz9auP+f384L43r8Xj5iYmOCAuMiJ8T84N34M01P9hhk/qQl1HBk5AkAQXPMUl/yWc2HLYOXdictMT45wS72GmJ4ceTJ/fDgdjRhj+fyus72FPYkdfV0kMwMgBI3VJaqVdayF+VZ5xXrfUd73pz8rbk5PjiAAzn3ycro7kfzqmeF97+ViNrrWQmUzkC8oIXVYLQuWH+G0JSuNOHMPHnyz4bgfnv706mbk3PgxYqF657mDr0zkEkuE+hpBT5dCKCFicaFCX4RNmyAVU4S26IoptOSuF6sV6/6JV4fuaKZHfzY3cDaT0Qi8DlGrg7F4TwQ7t+Em0wgh0efniKxtCC+TppNLkjHjWMvJs1al/os0zNjJnv6BBOECxsNFJYyDNEbPI/tHic78gzHzNzL7Bo03z4O2j+j9ORWJ2uzs25FAU29JDXU8nZL4jo1h14WzdwzRtDhTrOOuVHHL65wp1hEtC+fZU+i1mgiCJmkTZOgcl0h5xEyZ0LZVc1cfkepfABSvFGk8XaAx+BTF364DEKnP0NpTQLXrKrUtQRB4R7QwDFBhgPJ9vGgUvzGNFi0z9fkArl1h7eYlvj4K1g9XAcg229TMuNix/xS+6wotcNvXtuzaqCFjAt8FKQmqNwm0KEJKdr50FDwX4XbA9fBrj8FeY3PdJnSda1qn7V2u1dqjud4EvttS+BEBAqUcTA0EPuHyE1a56gDQs/cQc/N1Wm33ktZpbP1YXix9mckMxwktge+iUCR0jbEvDEBn6qMXaDsh27NPqE7QxVLpjtOo1y/IGbu5+u986YOHpToythvlByjPVaHn8n/KcwldR+G7SNnN/bur3Lq3NvlzZdCKXJ+pUcj1VlrVR4PJeO/Q9p4cuhYIzw95+3BLjR1y6Pi60CNx4XrdzM1YXPx99sYNu+fbFSe5HBkeSPLr7FCbuDu/VHqA2lw/4PspdGlixLPCD9Ni0/JYKDW4feMuU39aP93e6Pmu7HTfFs31ugAYLOSl6MubUd/P7za3nh/c1ny9N+HtT+reHhSi4WmlSlO/O7uZuvLYMedcJRcMXa0uzs52/gMLl7/f/7tMuAAAAABJRU5ErkJggg=="

/***/ },

/***/ 455:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9gLEAIHCFdumPcAAALySURBVDjLpZM9bFtlGIWf7/74Xrt2HMfXTYgrklQKqZuFKAUqmtAIWBigI0KwVOrSBVWwMDGBhJiQWPgRqhTShQ5QwdYOBTVNRWlxkeqEBJTWSRM7xI7/r+/1d+/HEioEZeKZ3uUcvTo6B/4nAkD9dTyCb989eXpi+tg7dqb/cCjDXutB+Vr++tK5Nz7+ucDfdSGIy++/+IUzPPac16l3Kn+UP1chlZOnXr4gYkWM1GOgRwiaDTZvliq5Vz91HhpceGt6cnpmdvFQLp00h9IIzaa1vkll01WZ/oJY/D3C83PjXL1ZYWbSIqhLfvju9ievvHfjrAEw9dSzHw0OlpKy14W6BF3HtPdIj6bFyg2fWNNn6esCqYSiWU0S1xUH7OgcgAFgGo0TQbfB9UKXuRMm1+40GDvgEXghuWdewM4MIOwYcq9G8Zd1qo1V2vVqB0ADEEoayveYyRkE7TpHMx7CG2I0F0WYm0i5hfQ3CK0q2SOS1PATuBj3AXSAMy9Nvp6I1pxauU57t0G91sfIxCA9dw0RiaKEBipA+S6h38aOeODFDx8bDhZ0gOND3fb40eOnbKtKLGHRVWPY8jaaGUXoBiiFCHqEPQ/luwSdXRLxx/XfVgp5HeCbW9V8Tn9QjEQO5jqtMIHt6HGrjNB0hCYAhQolSB/luSi/gy5iYuXuxqKx3wG0+e3zzG+fB8jPj9dUz08qwyf0XLQwRAkNodT+F118v6fc6k5Fe5jkPl+ee5JKqfS9GZ9AeU2lPJew20F5bcJuG7wOhhZj5c5yWNxzl/R/Vlc/NIsq39pxkgdfSzm2EfotlApBSlTQQ/V89nYsLl6+e+mDn85+9i8Dy7JYuPLm/bRxsT8i+qaGMgOGbcXQNBukydqvHpeurOW/Ws9+OOqsbjxyQ0dGRoSZzToZWk/POqW3nWg4pRmGUWv52z/uOgur3YGrhqUty62t3f8aIbnRUdGOZa1iJ2Pi+hGkrtMnw+xAM0hJ3w3qO97yvXvqT/URYgLvGr8lAAAAAElFTkSuQmCC"

/***/ },

/***/ 456:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGpSURBVDiNpZO7S1xREMZ/51zXx+L6IBoILmQNFlE7OyXEYJqwCrbBJvoXCFZabdLoikQLKyvtBBvFqI0gkYBYmQfRNYiuoCQLPhYNG9mN90wa7/VGXV3wg2HgOzMf3wxzEBGcCIUH6kLhAZ+XuyvyuEB1a/Q58AjYdLjZuemTWCxWQhbUPq09VSJCdWu0CBgDurWhpiiQ/vp9KpIZHOqXzs6ubP1MTIy7DjqADYVdIspqX6duzVvYM7z0X6MgjPS8BEBfcK+BRUH3o/Tyk9/bDY/bouXeptKKSgIPKvij/KzFfrm8IxACfoJutMT+IpqInS/OG2fpv+wfpvi2c8zeQYpz27gCzghB4AikKniWSe76C2p8yUwKfAB8/pEAEm6TZalrAsdAAEjsllFMhqQOFD4EG4AP719lWePlCOtAUCk+mXR+vUbeGIzfKfq4tHxj9gqsAE1Gm2FLqaadhb6t+Gyfew8vWppvzF6BUeCZsvWW0tYMb99dDpmLg/h87xEwCYSNseMSiRivQC4OiM/3zgGrQMHVRd3mQInI1XoXuZzyrQI5f6b74B/uG9Ys6g7FuwAAAABJRU5ErkJggg=="

/***/ },

/***/ 457:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAA15JREFUOMs9kktoXGUcxX/ffczceSeTyUzakdqmtGoaGipRY0vqrioWQzbWROnSLhQ3uhBdKKIiuimCoBVEIjitIlSJKCpok0oIiK/UahpNbJImmZk770nmce/9Phdp818dzjmcxTl/ERlLUMvYRMYSBnBCKTUI/I1isn6hsAUQPtVlITgJ9AkhfgW+rmVsNzKWQHDzImOJ15VSL6KYcpXcK11vQYsZC0KBrMoDuqEd0IT4D8FxIcQbtYz9ErAdEH68qxvIPTI+zFefTHNs5IiMxyKa3zJxcCjVymQLRTn/7ap2yyOESNYydl4DcJQXMAPmpfmlVfqG7iKW6xL51RbLrRWqVon1YplINiHGHz3FlYVlADwpLQDNfDJmdO/tePrE6NADaw2b7s+KbH46J84efYvc9QauJynOFAhNrosb7/7IhQcnCB7y0bkn/Ix/LG7owfuiB3enk5m+e/Zg1wpUWw79Zg8/aFdopyqEQgaVeouBeg+t3gg/BecI3N5mq+Aca262M3psuPPs4aO9h6W/rQIJTdS7XP5I2azrKwRDJo2tNlpU42q6RC5dQSWqxONR5bN0UVjd7DQE2kg4avHX5SWRLCUYNA9xm5mkQ48iqjsjUfKqrLl5Vq9nWercEOmBOAJGDV9QD7t1qT4Y+Ujcve8IzUYTK2DRarfx+3wAO/iWdvnPaV6ee075AkZQc5oubbdJIZ/bbhcFgOu6KKWQUuI6zjYnPQBWFxcRSuC2PfTgvZGTgYSeXvp4hvXpOVaWFlGeh6brWJaFYZpUSiXstTWuzs4y+d77fDf7Jfa+lrBX6j8bUspz5XJjMBjfUr9c+kKoKYPvJ3xE/CF8pgUIPOlSbdVx3RZCtSkM+VSlLISS8pzOnf5/NMTDvv7wrqBKq/7OPmEEg8i2i3bz04WmE032sDu9n7X9fnVjoCHs5dpvtXzzeaMxUajaT6gzuq5d1IbZpeopXh19W92ROig85e2sML9xTb1y8TWxEtgQuWuV9eJy/UzjfLEqIqdT1CayGI913N/TG3szkvQfd3EIYmFIQwF4whObsoGOQT3fmsr+W33B+bw8ExuPIWJPpcCFyodZrPF4yPTrA4GI71kED+mGFgOF56gKUn3TqDvvOE339+b50mbsdBxMk/8Br/+RrGtDB9IAAAAASUVORK5CYII="

/***/ },

/***/ 458:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAG4SURBVDiNpZK/axRBFIC/2Z27NU20srEIYVF2chKI0cKkCQgp0hxBsbdYsPdQohAbiRC0UlQIYiNYSIpLkcaTC/kDBBHdg2NdwxEj3EHwB95ubm/Gwg34IzF3+OAxzfu+mffmCWMM/xOyn2LXU3kgASLgIXC/LwGQZucwsAjkRL8tuJ4ywFHgLjD21wuKS84oUAQcoJ3lWtlPXu3WhLWg6XrqBrAmfwFHgAXgCPAAqGdwDLT+vCisBQ3XUxWZwSeAZeA28LTsJ7rHjtZlcckZBB4BV8p+snrxucjPPnZmtBYzgAX685ePnWvVmybdUwBMAdUMHoi3808E5CxL3EtTUR/IJe19YMJa0JDAWeAZQLztXBZCb674nZKht++R/Jx2BCCEOYOdKxl2jOspCZSkbZ/val2wLett2u0u7yV4DxwGvgKNjvjeAbCEuDo5OTE/fW7KMVpTD8PTler6ya2tT78JLKAKfAM45e/MrV4yTddTtpRy7sJs0YmiiBcvK7RaTYaHjh0CcD1l7wr23cTjauR6oaDmx8dGnSRJ+LCxwes3QTtux7fqwbuFAwX/mMGdsBakBwp6jR9RiLZfPVByawAAAABJRU5ErkJggg=="

/***/ },

/***/ 459:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHNSURBVDiNpdFNaxNRFAbg95w7ZkakfraG7EIXlhTFLkQspejefX5CcRssXbgoRBEkFLr3J7gRFIu6EEWI6Kali/4AIZ1kktZmpjbzce89biS1dmIVz/Kc9zxwzyURwf+U83vj3v3rbWup+DfLzNI5BlhLxfqDx2AqgFiBoABiQAQCCxENazMYe4CHTx4VjwEAkGbf4AcvwcqDo05DqTNQ7EHrfaS6D20ilMbv5j8BAJIkQKt1AHAKpgGYQwAEsQZGYlgb4/yY/wcg28Gnz0EcRomXNz87Vogny1+9kYDWEcIo8Z6ublDefKE2I0m2CwDgvACRymsfrZ+/nwv0o80T9zu9N6OB3l7zRMBKNhr4l3IWajMOEWqOY6rG8DXXVWnh1MXCr6H8zIUCADjMsnS1Mr18e/6Oe3l8CiIa3d13ANaGALMsVaauLM/PzboTlyYB0ejtfQTwAQ4zL87N3nAHSRNfNusQMQjDGETl9BCgxVs3K26cNrG+1YCIQRSlICqnbK1debH2PN5ud0E0Ab9tsLFeGhChPjyYlZVXr9/GLT8A5BzaHRlmHGupse3vZ0G3XzWGp5UqbWmtnolg9RCgRieIs53336vGeEcyPwDi29ybs1PL5QAAAABJRU5ErkJggg=="

/***/ },

/***/ 460:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANtSURBVDiNVZNrTJV1AIef//89LxxeEQo43AQJPNwKMXGjlVwstgRtbSW0PuTmliuzhrm1auviZGut2kQbbXxxsywaBrMx2IyAOI6oVVh0FgriEEI8cBC5eeic9/LvU0q/z8+eL89+QinF+rU3VHsFar+GVamQWwEEjt/G5VOIs/vevzC+nhf/CdobqqXEqdfXbn1grMzEOJGQ8NYcRJOKqQunQXerRXf62ooe/47l8OkLH/Y7dwXtDdXShdXr8aSVJuiWEZuVRnSigdAUUo8CpROZW2RlbJTryyoUmJv7JWLLqhdPDDouAIlT7/GklmaW1hhN/Ytc6jIwohU7C02QksERnTvhTZRkeTlcbhlmT0fp9Oz8EaBRtB3f7dVdcqioojbucJugbrOfJ6OGCako+lUJINglhjBEhG57B99MPMip3X/j6/p2dS1sbdf2lWcdKfDmVZ0eSZblccMcyJjEVfYWG71llK50UFT0EBu278e9pZLS5S5MGaYnkEl5YkCbCgRXxN5XGm/PWp77XFJxrqCZ+Kc+wk4soLb2OV6vPwSam5ONJ2lrO4e2NMFyxxvUjRzEcgQJzsySrDNaVc9Lq8TqYdYyH8CJTb7XSHP/L7G9MYO17C3ERkXofPY3KlaacJmmiXIstnlu0TuTwvPznZD0BG0tjYjlnxFCUv51E5hzsPADvdMeHk6ZA9vCNC3hcsyIfykwWXGoZJ5Xux8FMUpl9if8g5vB6XRA8NjmU8RoYXzXUjl/2ctnNT8SnF7GsU2/VrXNk3O/4S7LykmR5Qk+eqZyOfNnMYOTaSQbISKW4Ks/cum4kk20NHn3kT48cRvxD43bY5PBL13hiPXF4CX/0ZyC/FhPnMHT8ixv781EunSQGgjBy8UKZdn89eskSbH5rM6F8Q1dDYcj5ufa98PzC30tH0fmA7NlhcU79duzkwx+N4JA4Y6RmGsRrl8J8FP3KOlZKSQm5dHS2hcKLiwea/Ld6RRKKd57JlO6hN2fmZ66Y0/N40YwMMY1/2Wmxm8ipSC7cBPerflsiIqn9fzF0NTN4O9hi4rmgZBz90xv7kmWAueopunHy0ry3BkZyZon1YNybGZvzDAxccO+ODQetizrmOVwonkgdO9M6/farrhclHNAl06laVMMoGv4wxb9juJM80Do6nr+X/dgh07w9XdnAAAAAElFTkSuQmCC"

/***/ },

/***/ 461:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMsSURBVDiNbZNLaFxlGIaf/z9ncs9k4mRya2jTmMRq2kJFg5Q2CRFs7EKqtbjQWm8bQSpFEXRhSEDc1BQvSFe2VdAuEhEtVIXWpJQialQYN7ZJcx8zk0tNyUzmnP/moq0m4APv4oOHd/PyCecc6xnq72kWuMMeutMhdwAIbNLgjzjEZwff/nZsvS/uFAz190iJPepHIn2tTc2llfWbvdLarYBjNTXG4sx1c3V8MhuEQa+2fPDMu8P234Kh/h7poy8kEnXtm2qqSmZ//oZgZYnmg4fwfZ+pobMUVMRJbO/iz+l0bj6T+Sk08uEXB65YCSCxRxOJ2vZd3ftL1laSNOy+j7ZnD1EUK6YwVkzL80eo7XwQpWfZ3fNISbwi1m5U+CqAGOzb1xzx5WjXo09Ghf6FSOoqBQt/gxCYzZsBiTc9AQ5UfS2qoYX8cpQvB8+trgV6lzRaHW5ubCoVMoM/mcRfKyfb8R7ZvccRywYV3cNq98esdr2Pf7MAf+IPCmOWtqb6Yq3DI9KF+c6KqmrPro5TuHiD3AOvoxPbOfByP+eLnubCQhOPv/QmJr6N7ENvUTi/gA0yJGriHibsknltd5bdVYPJpclubcGWVf+3kVe0YWJT3kC29V5sfomKeCX5QO/wlVI4q3HGoGQesXgOqroZ/PwE4uaPCCHZ+8VHoDKw/APKWwMjwGiU0sK3KkyuzE91REtj2PAvSH+PWL6E8CPgeTghYekiWI3TCqdChFfBQiqFNSopc6EdmZ+ZMbK4DmfUbSm4lTDAhfnbd3grWiFEGVOTcya7pof9INSfXvk1eaxp2z1lXkGCr05dJDW9wv9Rv6WSAy90sJoJGBm9FgShOiOcc7zzVONrWzbV9T/2xL4Snf0dq5YRng9SAgJw4CzCK0e4Ok6f+S53fTbd++FI7rgEyIfmxPjk1Ojg2a9zob4bv7wNGYmD88BJhB9DFjaSuxHlk1Pnc5Nz6d+UYWDDM72xv1oK7DHPi/Ttub+1qKGh2kvUJnDWkJ5LMTExZy6NjgVa615tGTh5OWc3FNzhla5oC84+F5G2Uxl2AkQ8koFm2DpOn7ycu7be/wdhQ5RWn+UlkAAAAABJRU5ErkJggg=="

/***/ },

/***/ 462:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAuVJREFUOI11kl9I1WcYxz/v+/OcHZWUmjsxKsozFXQ5cTD2xwLDC2GDVTKIgbVOF7toNbqYk3Vssg3HYATaTSBkJXYTsXlRrAYNi/SwkXOVua1jFscU9Sia53hO/n7n9z670PQw7Ll8n+f5PO/3+zwKoGFPqAIY+rG7xeEF0QVVllLtBko0PHBFPq2HXr2c/8vS+mLDnpB+QXNxls937c26urL329qy3g0Gy7y5ude6oFgDaEuztXhLraV1+1oABQeKamq8GwIB3L4+/KWllO/b59VKHdBLBYqaD3dmb9zs/7ix7sQPawAOFQQCHntkBGdmhoXr18lft86j4JAGEITFpE3VrrdyvF7P0ca9TV/8H/I0HCbe20uiv5/E8DCL09MALGkWSM4tMHYvSmlhYY629Ldf7m0KPm8W6IhFo7bJy8PRGlNQwPjgoG1EOpZ+IEJqPomddpiLz7PJ78/WWs60HdndtAzonIrFnJlYDGf9eiZHR4nev+8IdK4AbvbclKGHw+Rvy8f1CcYoNT7++nfdJ4va6yFiRGpHZ2eH7kQiPB4bG3LT6dp6iKhb56iejVdfLa9pfWlToQ9tWSidTzLuELn3BPX0cDIx0//BjoP0rCpCrZgT7tI34pOXxE70yInjQXHtiBh3Vpq//kpMelJSc39I+ILnRoafkmluljFS6cl+ldT0aVxnDLP4D9qzBTEJJD1BljcPcU0lQO95Wp7ZCp9PtVTtN6GVLbjOOMadp/GzV3CSf+Kk+gk17MR59jeu8wRZHXossP1tlKhjzx+0UgzEp34D62V++eky0QdXGP33Z7rPHsY4E8xP/YrWemC5vnVk8HeUUq2rElxpjt7pulL0TjCnpKyE2+G7KKC0ohw79YhHtzsW3HS6GaDqE0IgH0F6OONKoa+T7y2P7/ONr1XkZuf6Qbmk4jEmHt5dMK596r39cjzDtzeA80DlCgDg1jmqtcU3IssJpQaMK80Z61sz/gM3t0wzyu1Z/gAAAABJRU5ErkJggg=="

/***/ },

/***/ 463:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIhSURBVDiNxZPNS1RhFMaf8973zsxNGW8ayvVjHMa+iyRrsokCIRCXLiICQQjRaNU/0LJ/IBCCqEWk0KKgvUQtzA8E+7DlXGamhlKZnMiPce593/e0SAeCamPQ2Tyr5/fAOechZsZeRuzJ/S8AEgDSY5Ot0hK3mTECcOTvFgpAeKi1ubNwf+gznR2dGHCi9tNLPclIzxHPjkUlpCAIAgwD2jCUMVCaoQwjDDWWsivhzNtCUKmGVyg9NlkZvHwyZtk21isK2dwy+4VV+l12KtHMqWQLuXU2dBji+YsP25KZY5osbG4pFJfLyBdLuDpwGtGIhLR+rkhpg2qg8GzqHRri++BEXBBZYOYYnbsxuWwMtxBBCyFEX/ogJbz9uN7X+kv64+kvyH1aw8uFLBvDhpktIWiFdv8gc/PJdO+pzt5U4oBsdW0cbfqGZHsX8kUfyfYuTC2tobgWwP9YUvPvC/Oz965dBHbOmB6dGHbjTvexVLMsbwTwGmx0eEnki35NPddGeTPA8a5m6cZj3T0jj4ZrADZ6vP/CofqvG1UEysBzJYzRaGvpqKnXIBGEBqX1Kvozh+sF83jtD1SonKa4g9zqJoxhPHi1AiEIu6dgAIYZYCDUBm2NdQhD5dQARDT3etE/f+ZEQjbGHVgWgUCgHcKOF0oblL9vYWYxq4h4rgbYXq8Mzi76d+fe+BmtTSczW3+omLalVWDm2bCibwEA/fc2/gD3QvvbU8F1FAAAAABJRU5ErkJggg=="

/***/ },

/***/ 464:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAA69JREFUOMsFwVtMW2UAB/D/953TC71QYEChUAqDwZjBVNgIyFjCSqaZa8AshhnRxfjgJSbqZkj2AqjR+OILWeKLMcTszegyiXGLzK0ZDjBQNuXarQXHrTdaevP09HznfP5+ZHx8HB3kDrxjs/BdP4uHjzSXpqOX3U6jG1ToBQBo6ozCybQisZs7esveJ6M/YeqzbizylyBc7ZPhHZvF5LUem5zFsMPpuP2D76Df4znZ6rnoNTU87zaVG3HcoqTOiyzzvl7KRvt7G4Ovf/5AvtongwDA5LUeW5nJ/E2zu+ed2goNYcL421fuka+/8vDuU7WQg08IsodQUwx7/2awGst+l5Lyn17+0pcSJsc8MGp8+LmOM+OOBgoenoU1v4+BSyfJu1d8pLnJQo6esINYTVwzU2KuckCnWtoPIrGn3nMtS6JZgaO6pnaiqsYALb0EQ4FB3I4Q/coyfp24gEuj86g2EwR2FTLYacAbQy5Uu6oQ3bNMRMPp34Thl0+85TraNGCxhKHf2uDUcppEur9AMM5RrwawEqEQ7F3o6j6FhS2GyMY695wpIUwy6LKpREgUwfttVgomJ2FJpkmu+zU83tjH6Pd/4+FQFDP/GNB7Fni0tIhSmw03Hshkyv8YbfVFCO3nPxRB6Wmz1Qz5MMlzdXYiHCyhRO+E21UKqdUKb28aU3/ch93pwFpwBx8N2nCus4hrrIbc/X3BIWqaCq6p4IxBMRjAslNoK38B10dKoSg5vPmqCapA4fPH8IHXhIEuHVS5ACpyGFBQRbUgzWSTiUE9NRIwBXkpDZOwCJnoASrCSAk+vliCkaFiHEbS0FgBlIgkFUtCK8gzNC8pdxMJCYJgAjjj8VAUiWcHEAUNhBUApQBFYdha3cPO+i7AVE4gIBbL4D+pME3zmezPu1shSaUOcKaSyrpiBBaC8P+yiGwsiWw8Cf+teQT+CqCyrhSawkghb8Z26JmcSadvCk1N1ixLJeLF1qoLpeU2EC2FKlcZ3w7GSGguiJ3lHdAiEe19LVwUQSg9gsByDL6FzdF7B03TBADeO99cc7xC+/bFznZvQ2MxdDQKQhVwKBwAQPQEmoC8ZMbT1X3c+XN9fjZ+ZGRXLpsTWmstuL3WIqGo8GQ7FARPxTsYs0KACUajnWialSTDMjZDGfjnV/DjXPSW/7Dixq5c5ie5eJoAwDGXkxK702xgzFlvzrYdK869UmlS3Bad0ggOklHEUDinW1lLWe9HZHOgwOmmXsf3t9bW8v8DmWPCtfKXgHQAAAAASUVORK5CYII="

/***/ },

/***/ 465:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAA2dJREFUOMtVzEtsVHUYQPHz3de8Lsx0OlNgpsVKWyQYM60QIaSiIEoidWPSjdGFS4MLdeNO3bpp3BgTonGDBkQTTXgIbVADNkZINZSCnbbTUujUPmc67zv3zv27caFn/zvyEfCSpnHE97kGtCBlBQLDhmmdUKhBAIGbTdcdKznOhTrkXwe+0jRmfB8Z/xdfgpjAcNi2z3Q+P4jdnSTckwaglsuztbDKyvS8O5udPl2HC6eh+LmmIQCXIBYOh0eSJ0++GW8TjIM2ymog2zUluoY4ItIM4vxWZnlqlamJW19uVKvvvQtF/RrgwxupoaEP2tIef45OEkt5Sk+GxOqwRY8EpD69QuWPOXV3LCc9z6WJJPcNzPx1P/cETGgtSEVs+0xiV5iGXeXAqQz3vs2Lf3kLcQRDtwguRZm+XpRnXjtEa0eLVFeY7r69n3ZBSrMCweHOZ49QM9eIFG0VzgxxeHSMxcOvoCbA/cUhmz7E4dExrMdeILgaUq5dpLP3cdMLBIc1wzRPBJMxnOI6QccW99gxxnOznP7xCrW8UFuCt69eZTw3i3f8OIFKUBrlDTp2xjBM84SmUEPWzgROraFKsoZ1/hzRpkcmZONFS3ixEpmQTbTpYZ0/R8Uq0KzWVduuDhzUoAFAS0HNoxRYhdzP9OfuMbIHtiJFRBNG+qLo33/NlrlBWW3g1zxUy8cDDBG56ORXh6SpiVd2WSk/YL54FxRoug4Iihai60Tat2MaOlpDZP3RCprITcNz3bHGZmlIN7fhVDbV4lRBut95H/voUf5b9cYN5j/5mN6DSRUw47K4XqLWdMfkCqRCtr3Uc+pFlhdus7FWp1w18F33fwMxDGJRSKRtEul+Lt+adG9ns3uMB5HIcrxSectaKXwWD6fwtz8knhClByxB1xEBpQCvpXwXsa0O5hyNX7OzHz7sP7CqX3RdeqKxZcnn9+7cn9nbnkjTqjfE26rRLNVUq+qieZqEwu3Slt7PohXjm+vXf8+mO78oxNse6ZmQwXcvv1r3NzdnHk7eEbPRfDqcSNOW6mbHkwMS794nKhgj75qMz8xx9s7kD3M7dp0ttHdM+OtrJQHo292l0bU7Eqq6Xd3lwlO95dKpds8bMNxmTxMoWdb837o5tRCL/VSKbMu6ujFv6v7ywv37jX8AUIx9admfhWEAAAAASUVORK5CYII="

/***/ },

/***/ 466:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKHSURBVDiNnZPLS1tBFMa/mTsx995KKJQktRsVN6mYUAUX1V3Ahbti14qtBKFLQQT/AEEEl4U2u+zrUkExm4qbRkPTaEtBrY/4WjWP+5w7M10k1j6gYD84zGLO/Dgfcz6ilMJdtbi0QABgbnZekbsCFpcWOhlj7wAgCILn7OZiI79GCCEZSumElDIFAJTSkpQyp5TKjqRHFQCEQqHloaHhgVq9qsqfysus9fgRpXQlHnuY7OrsMU3DAADYjj387fiw/+r68uVGfm1sJD16LqVMP0kNkK8H+6T0sZSm65urhBCy0ptIDvYm+kxCAMtuoGE3AACPE31mb6JvkBCysr65SppgC0JKAAATQmRi0XgyFo3TWr2GhmWhXq8DoIi0t8PzPUSjcfrg+iJ5eXmRoZTmd4uFZ5bdAKU0T5VUE91dPabtWrBtB9VqDYyFoGkUdasBz3VhWXV0d/aYSqoJzvlMsVi8Yoxdcc5nKA94StcNBAGH47rQwzraQm0ItzXL5xw+92HoBnjAU3Oz88dSyo5oLNoxNzt/zIJAQEoJKSUYowAINKoBREFTBCAEUkgIKREE4ud3OrYDAKBKylK9VgUBQTgcBtM0aIw2z1DTCqEUtdp3SClKNwDbaQE838/tfd6zwmEdQglojEKjBBqjIJAIAg7TMLH/Zd/yfZ77awLOefasclo+PDoQkXsRgAA+9+G5LpQCIpH7ODw6EJXKWZlznr0F2E3A5PiU8j1vbGfnQ2Fr+73l2A4M3YBumHAdF9vbW9bubqHge97Y5PiU+tMCA4CpF9Pnb7Kvn56enGTOK5XfVlkIkVNKZaczr25DQ9C4sfAzC62Gt636p5RG+23uNVn/E+df9QNkKldD1RNUhAAAAABJRU5ErkJggg=="

/***/ },

/***/ 467:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9gLEAIKLanEMv0AAANDSURBVDjLpZPbT1sFAMZ/5/Sc9qyHW9fiQEm5DqZmDiQ6gS1jQREx0SVzcfGSzMTERLOHPahxPsh0LmaL88UXY0yM82WGhWRoRNici1KHg10C6ERZgTJKKdCW3k57bj7ZzGe/P+CX78v3ffA/JQB0vz3Qsb3a+3GT39MSS2aT1/5cOX/QPPlFJpvdAai2IE0bsvPGoROXl/r7unmub/i/gCOfXgqdfqOzKq3lcbucXLgW4rcfB+wjPapgK2Ws3rpqB4PB9Ppa9KP971/68G4HIkBLQ3mVaRh88GWAlViKruZKe3ylVHCrM7ZUsUZFR73Q/qi/qNVfenzkRNfI5+8+Xtbf1w2AAyDt2+2fj2y0XJ8Jc6j3IYLhpLCyOMruulVBlxXsVBRTX0fxOblXVuvuRDOuA8eGfygAZq+cO9/RVHL4yd5n3A33lXH09Fn2CAHud2iYTp2lW4vMjMWpd9pY9yjYtruts7Hs63OB+ZgIMHq8+bG/crXeA52NPH/0LFujZzg1soyx5ySusQA/XZjjnaEkVtcnKL9fZ7PPhYn2EoAEkDZdD5eoMme+nySbmOfV3i207nuB/EYEyeejs6MSf88+8okIYqmbIhUEPfMicEwCyBmoNWUmJarMjgebuan9wSNNk+jxX9CrKyk3DbzKFPnlISxvMQ7bIKflfIUWVCE5/fN0gqfaG+2DPa3cjgDxcezUPKKRQxQsiF3FSs2DZbKxnsLUc4OFCH8vmzdeqR1P73/9lLrNM8dbe1ew8jKWqXN7coE7U4vserkdW9cRTIPVqIaW1b8ptDA4sZZ8+gEch59w7+1pmsU0NEAgGUlgZHNs3VmLKFoIpmE75Abh8vCVide+Cr1ZAACEzJqANzfXXb+ts0p0aKAncakyxV43kmQjWDYOuUH4tv9i/uKs9Z60uX4qHA5bBYDH42Epzc25yYnqYrmk3uny4t7kQZJLScUdLIRg8LtAeGjW+dlovGbAkU/EotGoLdy96+1tO92WJvgbi2O76tSNZyuUTJtgm2rc2DQdSheNjie2DGETFBV7YfLXsUzhTP+qttIjGGKtRHmxEs4qimGIEjhF1ZlElS2jwqVpsaV8RrKCRjAcswH+AaAOcZVqNcknAAAAAElFTkSuQmCC"

/***/ },

/***/ 468:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJJSURBVDiNpZO7axRRFMa/OzuTfcwKbhLjA41BVpAU2gWRrQSxsfAPsPQPiEiMaCEWFhFjYm9lZdBoGhELu1SCMSCKAQs3m42JbshjNnNn5j4+i+yTaOXpLofvd77zHa4gif8pt/MxPX3/YKTcyz2eN+KmvJLSyTAAeK73NVF6Xhv1IePpd6Oj97aaGtF0MDHxoORleuYunC/5gycGM4VCL9LpNEhid7eO2kaN5eVy9GnxY6ii5Or4+N15AABJkBSPpx79CIIdaq2pVMLP75/y2dhZvpm4yJXFV5QypJQhq9UVTj+ZrJAUJOEAgBAC2VzmpO/nIeUulFLYXPuOqL6BONyG3F6HUgmkDBEnMfx87rgQop0BSU5OPYQxBsuVMvL+AZy5NIpzV26DJKQMUav9RnV1FZXqMrQxYGP3rhAdx0Gh0IswChFtSwhHgCSCYAebW5uIowRDQ0NYWFjYf4W9LCyEEEg5DhIamEQjCOoQAAYGDsMRAnEUw2jTHtrpoBEoSAvSAgC0VujvPwTXdRFKCUPCmDbA3Q+wsA0QABhtQBLGaAAETTegy4G1tsNFA2BMyw0JWPwD0BR1Tm8Cmn2AoG2LuwBuyiuvrf9ELptDuicNz/UghANtDCwJEAAEojiGEKI1oZVBEkfXZl+/nCueKmb7+vuyft4Xvu+3Mtg7qcXStyUK4HlTJzrtNj+Tm3JHUo5TMtYMF08X80eOHsOvtXVTWaloGYYzxtjr42N31D7A32p2biaO42Qx2Ale1Ov1tzdv3PrS2f8DxCaB+yceGIsAAAAASUVORK5CYII="

/***/ },

/***/ 469:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAi1JREFUOMuVkj9oE1Ecxz93vbskDWlNTGP/mAxKh+IqloIuTqWbQzFiLSIodChUoZulAZcORhdxEBFTBzOJo0uhLgoK7aRihsZE2pwhNm1Ce9fc5T2nlBhygt/p+97vfb/v90+hA3mIu4lEMWDbjiLEWrNSuSdg7xCsMdhTOt7/dS6A1kgknMFkEmdgAN0wMNNpZDCI3mx++ZXL3dbg4/k2jdpuICEQHhuTZjaLPxyWZjoNQO/UFK5tn/OPji7ugp5q02idJeC6AJjZrDK0sIBTrVLJZABoRiJXatCbgv2uGWiGcVm3bWVkeppmLse35WU2VlYouy6ByUkqhcI7CVbKqwTHMJ765uchHGZwYoJENMqp/n5O6Dq2lBy4brAGiqfBoZTDqmEgdnak1HWaQuAIgV2r0djYQI3FLu2DHy8DW4j3B5ubYNuKzOcxfD58wSBqJIJ6Oo5lWfkGOHg10eyx5/oyma+xeJyeC+ME/H5pVKtKsVRiffMzhR7zSRgOuxrMzfh5ZYjt8YuSk2s/sDOfcOsCEdKlOSyVkaWzfF8vVd/k/7FIj1/EZXHLAuBD1DqT7ItsFbcsyvWDpVgo+KBcqt8M/A5mnr/dpStuzIR8Lb6Y8il370dl6lFUtu6St4zA9aseGczOhlhdrQNw7Y7B8JCijcRjjqLC9s+y/nD5yO326fEUWmKA188aKKpEUduW3AOaZ0RqCKFaLQ6N/zMQIiAaR+rLFu+Y3jH+AJae5GP+7kaHAAAAAElFTkSuQmCC"

/***/ },

/***/ 470:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANRSURBVDiNVZNLaFxVAIa/c+69eT+mmdxkkk6DCUnaNGkwVYO2aV4FTbOy1K60VqmbglQEERQ0JBtBtKIUyVIQopVEF0YUpTGJQYq1aBkX2uY9aR4zk7EJ877nnutCbOO3/vk2P5/wPI+9TIwMNAq8cwaqx0MeARDokIs54yE+PfP2d/N79+I/wcTIgJToS6ZlDTc3NBbvq60zigP1gEdifZ5YeNG9vbCczOayQ0rz0XPvTOv7gomRAWmirtl2Tef+6sqitRtfk93ZpvHMWUzTZGXic/LK/dhtvfy1upXajER+ybny5IXLP2sJINGXbDvQ2dE/WJTeCRE8dpjW589S4Csk31dI04vnCfQ8hqPWODbwZJG/3NfpOrlXAMT48FONlilv9p56pkyoX7HWb5MXvQdC4NbVARJjdQk8cGoDOMEmMvEyvhyfTKSzqkO6yjnX+FBDsZARzOUQZrqUZPf7JE+8h4i7OGVdJPo/JtH7IeZuHubSH+T7NK0NtYVK5c5LL5fpKa+sMnRigfzY36QefQ1lt/H0xRG+LXiWa9EGTr/0Bq7/EMnH3yR/M4rORrCr/QZurldmlG4vqajGTW2RrG9Cl1Q9+Mgo+N/FbmmQZHMLOrNNuX8fmaw6YjqOg6cVnuviyAwiNgmV/YyPfYDYvY4QkhOfXQEnAvEfcYw0uAJcheMoYWonF9rZXOkuK/ahcxuw9T0iPoswLTAMPCFhewq0wlMOnpNDGOVE19fRrhMyUzk9sxkOH/d17Dfc9CooydpCnMU/I4TnowgpqT9cQ2NbDXagGE85SLOEleWQm0yraaOvrSK8HoldaG15OM+QCe7cWiR0I0z9QZvOkwc5dDSIm3P4/acFDKHxB6pJbpt88c31TCbrXDR+uBWLT429m4ttbnW1tB+3NpbneaIviL+6BMsSWKagwi6kqc1mI5yhuqaFsatTqWj83tCVmeSk8DyPt04fkKZwpw/UBh4ZPNVXVFCSwnNiaLX7bzBWKUKWkYw6XP1qNrW6Ef0tq+genUvp+zG9PlglBfpVw7CGu442FwSDVYYdsPG0y9bddZaW7rqzN+ezSqkhpbk8Opd6ENNeXu4ta8LTL1hS9zgu7QCWQSirmNYen4zOpe7s3f8D2H+PpsUSQaIAAAAASUVORK5CYII="

/***/ },

/***/ 471:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9gLEAQVHt/DIccAAAKJSURBVDjLpVJZSJRhFD3f8s/iaDqOoRJppZJihWluoPggpBEUYYFolguYQkEPQUTSIiRB9NBCJSiBLRD1pg9CEmVipg2VMipCaU32UE6ONuo///J9PVlkYwTdp8vl3MM5hwP855CVh4j8plzGaY4QwkEJ9fj7mjv/RsCXl4TSFphCtu4ryawpzktVHHYL3KNe0eYMn1FVbev046YvSaVn8a77fGgF63ZeaD1eW1IfFxcNVdNluJWSqHArNB241tEz0XOjdjOkBMjvotmy7PI9uVe3p29gDosAJSBWThGmEETYCKKiIl3jgY3SX1n4bKUFCgCM05zivFRFSl1SQhATzqGbEropoOoCyYkx4IxWh8qAAoAQwuGwW7AQFMQwBZY0AVUzMa8KzAYMMMZhCuFaNURKqMc96hUOp5N+VzVIU4JzBs00QAiwoPrBKOtaVYG/r7mz7UHvTOwaK6Z9QcwumphfMjC3aMBus+L54ASkFmgAgMrsuj9DBICwxKIO72ff3uzUOFf82kjERNpBTAO9A6OYHOxaTPs6x7bEZon77vapqpxGDE+/Cl2kjbsvnuGMVptCuBhlXVILNOzwfTxZd6Ly9Jt+D972jx24O3TrUVVWI+64b/56TN51DpAyZNvKM2qKWuovydHeYXH52BVZlna4ZtkO+dfOH8xs2J+ekfQwJ38bXr4YhmdkvPDeUHsfXwlMKShQbIuGFVRXpCAckhJCJJ6wru75gaKjakC9nrIpARN8shOA8ydBVmYmdJstTASDLk6I0xQsBkREgyIaUvpcRvy3KfvYU/3DUtl776fbROBUyBDXV1RQu2dScRBqCXLVokhQE9ygCjS2wPTXI/3aMvZQ7hH8AHuSB2zvDy1oAAAAAElFTkSuQmCC"

/***/ },

/***/ 472:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANKSURBVDiNVZNLaFxVAIa/cx8zec4kTibvljZMgn0FWzVKmyaxQk2zMtSutFbRjSAVQQQFDclGEK1UimTpA6KFpC4sKJTGpIQq1vroiCXpxLyadDKTpEmYuTN37rnnuCi28V9//Pzw8wmtNVszMtAdE+iTJrJTY+wDEKi4jzWuEV8df/+HxFZe/FcwMtBtGKjTlm33tzTFSivrt5ultTsBTWYpwcrCP/7U9GzWLbh9UvHpCx+MqfsFIwPdhoW8HI3WtTXUVJXcvvYd7sYqseMnsCyLuZFvCIQjRPd2MTm/7CRTqV8KvvH0K2euKgPAQJ2ORmvb9h/pKcltxGk8uJs9L56gqKKYYEUxzS+forbzcTx5m4PdR0si4Yo23yu8ASCG+5+J2ZZxvevYcyEhf8VemiKQXgch8LdvBwzM+RnQ4NXX4jU2k18LcWH4Yibnyv2GL72TsR1NpcJIYc3GsXLlZDs+Jnv4I8SajxdqJ3PkMzJdZ7E2A1gzfxGsUOxpqi+WsnDK0IV8Z7iq2lSZaYIrd3EeewsZ3cuzrw3wfdHzXE430fvqO/iRh8k++S7BZBrlpojWREz8QpeRl6q17KEafGeZ7M5mVFn1g4/Mov9d7Jc3km3ZhcqvEo5UknflPsvzPLSSsJRHJnOI+bPwRC/DQ58gNn9GCIPDX58DLwU3LiBvpBBKIOoq8TwpLOUV4hvJuY7wegA9tYY2riECCWgJgWmihQGro6AkTN5F38yACLDhLKJ8L245BTWeXFg4FI7tMHUuDZVBdJ1AeC74Jghxb7/y0XUG5GyMSAOJyRk/m5NjhluQX179LZ7ziqrgQAOqUTA/vYzM5dCei/ZcpOMwf3MJXargkSoyZQF+/CPhugXvC/PSnytro0MfFlaSy+27Wg/Z2t/AtvL8dCnBrfgSs38nuTO3Smx3BDsYQug6hs6POum19b5z49mLQmvNe73bDEv4Y9vqax/tOfZUSVGZg/ZWUHLznjB2OcIIkU17nP/2ijN/J/27K+kYnHDUfZne7qk2BOpN07T72w+0FDU2VpvR2iha+SwvLjEzs+hfuZ5wpZR9UnFmcMJ5INPWvN4Vakarl2xDdXo+rQC2SdyVjCnN54MTzq2t/L+jDppdrR2RUwAAAABJRU5ErkJggg=="

/***/ },

/***/ 473:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM1SURBVDiNTZNfSJ11GMc/v/c9rx6PJ4/OHT06LVq24WqGG3mzNR1dpLvYimTdNArqMowIIogaChG1WBC78CaoFgtDS2qDRTSOQ2TUrNWJ9Wcy/2zqOf5L5/E9vu/vXxcu5xeeiwc+fB/4PnyFtZatGuhpbxDYEy6q1eLsBRCYjCYyZBFnn33n4thWXvxvMNDT7jiYLq+w+G5sdabEhL5o6HgZ17FMXfwEvKhdjtYWVr3EW8rw8fPvpc2mwUBPuxNB/ZhM1rRs81Qs/kCK4spShGtxvCKwHuHcMqv//M3EHetn5+Z+CrXz5EunR0wEwMF0JZOplubD7TExfYGiyWG47aAaH0WEEdy/rmONpmLPbmoT+2JD315ouZ1beBX4SPR3P9XgRZzRto7OMm/2O4pySxQefx2A2NVTyJom5I4OAEp+PoW8v5q828jX/efzhUA1R7SSJxobGkuFM4eXm6aw/03kjgMArMUqUeW7QDgbiekuotc+pPix3Tyys7bkSmbsBceG662J7VWuyd8ErdHb9wDQ2Xmc9PUlhkeu0Nl5HACVasYWRzHBHMnqShcdtjnryjTFt1Wj/Sz5B+sw0YotT9KA2tysV4JfX4VZXyRRWcF6oPZGpJRYo7BaY6xETJyB1FH6v3gfsXIJYSVPnO0G/09Y/B6jAzACtEJKJSJGhpmV7OShstJyTDgL/15F5P9gfGKFwa9+BwFPP5dm50MVWCWxMkS4CeZnZjBaZhw/NEPZW7e0U1KD1fIuFDDYd42p8UWmbi4y+OUoVoYboyRCxJmcmNZrBZV2glB9PvJLphAW4jhFyQ0DFYI196KwFhsGd6+Xkp8LGBq9EQSh/Mz94beFpUvnPggXsrmDjU0HPKtXsDJPdXWcbG6NRKKYo8caKC+LINw4wtZwru+SP7+0fPLM0Np5Ya3l7WfqnYjQ6fra1P4jHYdj0biPlQsYdWejMN59CKeMtXlJ3zeX/anZ+V8DxaHeYd9slumNI1WOwLzmul73wX27onV1VW4ylcQaTW56hvHxaX15dCxQSp1UhtO9w/69Mm3VK21lD2PNi55jWqWmCcBzyQSKtLF82jvs39jK/wfwgaiCX8mXYwAAAABJRU5ErkJggg=="

/***/ },

/***/ 474:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAICSURBVDiNfZJPaxRBEMVfz86Mm2R3wYsgHnKV4KcQES+eBBVEyEm8JYYEQxZCIqjRREIuKnhKBPEfgorgp/BrrH8O6s7OdE9XVZeHnexuYrINRR2K9+tXjzKqinFve2drlYjaqpoaY3ySJPfvzC3e25/HY9UAiKh97er1TqvZ4m7Wjd+8fd0GMACY4xxs72yuE/GKqv73iTGG4zh5sjC/uAxVPbIebz0ss6yrZenUOauFLTTPM+1mf/Xnr+/6aPMBqepwhWezE6t+dNczF9IkmUdR5GBmSGCwCEIQNKaa2Hc2AHii9uUrNzuNRot7vW78+cOraVWFVCKRUHWBBBmsEz+dnVwnohVVjT+935se3fXFrZOYOX8bM5eWDohFRgDMtHxjbidOJ1tQVYi3YF9AyKL48wNf3j3H2YsLkCAIYehiAAghpOlEA67zDexzkOuByhxcFqifOocgdEisYOEhAAA0MIQd2NuqCpC3qPkcAIbiEKDaz+QgQAhCDuJt1R2ELMT1AAD1E3VwECRVBtYWMMbwAMC+AHsHpsoFObB3oDIDAOzu7R4+JF+rRRsDgFShCY1AvEXk+oC7SyvmyHMFEAEAlzmYSrB3ECr7xQ6B7HG6YQZRFPne704aT52GJk3A5UDagylzOJvBGPBYQC2qrX39+HJNVdPDQ2PgI2M2xgH+AQ+sk50oo3AJAAAAAElFTkSuQmCC"

/***/ },

/***/ 475:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAA5JJREFUOMsFwU1Mm3UcB/Dv73mnT5+2FFb6Kggy6BYV2TRB0RAlmYmbCUaNMR44mB29GD1ozCAe9OCJ7LKDLyQeTNRsEY0ZYUbFjW3OdTDHmAzapgUKLQVa2j59Xv5/Px+amJjACbqMM+cW8M3ES/BaiEoedUwmjEIUhwEAzP3L4TRn1RoXazJtjk9ewczkEP7hp0Azk0M4c24B0x8971dJfj0WDU2Furo9wY42+KKdIEFCtbCB8nYZ2+mH9Vwu+17TtX4Y//zawczkEAgApj9+wR9Q1S96e3rejelVqJoLFo2B4l0cggTazBE2NuBYKjbMAB4sL35Zrh++P/7Z1QNx+tNTUB3+TvLY8YlEoAS0HIIdaeMgTqRpBGYTq5XhGArnbpH8Cofc/sRgKZ9+ePrFx1JSS9WMdoT9U5GYAiYJULdNKJllYm1+NHUDRAKUtVUIxX2yQz6YMQPRoIZSPD61ld/+VYDEX2s70uohcQdqNs1JPYn8yAXcKSchLqYgLKZwp9SP/MgFQH4S6toqB/IIRRMeRdfGBIE1R306B3NqkMsVaibfwNJaAWenl9HIl9DI7eDs9DKW1gpoJt+EvFsmx9qDzydBAh+VXMceNgwNrrnFa4+ESNxNIaAkMNDZCvuYAUDAwC0BAYVBLKdQfzQGVtvjutFPEIRhybEtAnMA14WtanBqPyNpHMf5DwKwnTpAhPMfetGwr8IyV8BVDbCbAHPBmAtxbND/XKjd36d5bAIYXNvBta8vwa5X0WJocOom0jfu4t+fLiOW7ABxB0Qq1Wsa8tn8rNQwrbli6fDVQFCG4xxyUVZp6K1nsPDdTeSWsgDnABGefXsIIjFw2+aCGqByoY5Gw/5NsOvVH/PpnGk1vYDLiFs2qjv74Jwh3h9GLBkBZy4qhTK4bQPMJcbDyGfWzb1S5aL4VLTjsFotFg3dd7o93ArHrCA1+wAnXk4i1N2OYMSH9ngQi3MriHYHIepdyKw18Mf1u5/8kvXPifPr+0hEgoVaqdCry0ZfeySOvqejkBQRzLE4Zwya10u9J4+CiV1YX61h9s9bN+c3PV/lqkpePBpWcWV3pCHK9dVsJkdsrzhomRok0uHxRkgU2qhS5sikG7j99z18P5+5dKOgf5utem+LZrlCANDbmRCEcEJXbCfR2VJ9vNdfe6VDtwe8stMDDqra8nqhLt9bOTB+L5ie/ywupBWZb2Xu3zf/B0cXsXceD5sDAAAAAElFTkSuQmCC"

/***/ },

/***/ 476:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMwSURBVDiNVZNLaJxVHMV/9353HpmZTKYxT2urranvRFNtqFKSoguDIAiJXQgBi/ssBMFVSoMroVUsgiDYhzs1C4tIEIx9qUlEpxhqKglR0kyTTJLJZCbzzXyPe6+L0pqezZ8Dhx/8ORxhrWWnxkb7OwR2yCHss8hOAIGZ0ajLFvHlwMj4/M68uAsYG+2XEjOsHDm6O6mSESXk3t43EQJyV76i5gcmV6ESGDtikJ8MjIybe4Cx0X6pCH9sbm7viW0uJAJ/i2g6RaKthYhS1FZWCUplhFWUGx51N4qb0yHqlYGRcaMAJGa4ubmtp/vl1xJeeZJ4aQkRqcPsfwohFc4/s9jAo5bZjSMfTvwx8dOh9a3yMPCx+Obkqx3RiPN7X/9A2ilOkJjNErY+BwhUPoupy2AyT4CwqKVJqs/2UNOPcO3aVCnQ9nklsEMH9u1PCpknujiPe+g9/I7XAVDLv6FbnsY6CQBic98Svfk5umsP+1ozybnbhSHpEPY1NLU6ZnsBHEXYdhCAwcFjXFoIuDp5ncHBYwD4e3sx8RSmtkoqk3K2w+0+aZGdyV0taHeF8oO7MOr/WrUpok3pnjeOxd3ThPEKJNNp8n61S4XWYE2I1RphA4rz7+NlHufUmWfY8M9hpOTDz15gKX8KW/6Teq3JmDjGBGwErlTFYHumuLbYl45lKOlbFDFsutNsqYAfpnNoLEcOr1FvIjToCNo6xGSS/NptSmFlRq4E3pXFlUUt69qpWY+q8anYKkVcOl6s46GXIqyJMkVcKrZG1XjUnCg3lnM657mXZd53L1ycvV71vBQy0njnHaPBaLAWsHeuMVijETKOWwi5sHDDWw0q552pXzcK5y9+4N9aXz7S89jhiG8KhLoKApSVJLWiXivqQ4cGmyIdtnNm4mf333LxxNQX/ncKYNWvfLSZ+/uNwveVg+8c7U00JxuJmzXq9TZaWJSMU0casaX49Oov1b/W89nAcvq+MXUfVzIieDemoifferIr1tHe5DQ+kMbakPz6BnMref31zXnPD4MTgeV09mxo7gPcVfdxdcARvJ0QHPUsnQAxwYxruaQt57Jnw7md+f8AnbyinbdJvB0AAAAASUVORK5CYII="

/***/ },

/***/ 477:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANOSURBVDiNXZJLTFxlHMV/9zE8CzN0ZmBmpFgQGrWlDYliU6VQ1EqNCw12U1sbUxe6qQsfiS4kZeOmYnzEdOcr8ZEA0VDTLmyEpiXVFmoyRiOPGV6ZGWYAgc7r3vvd73OhrejZnM0/v+T8z9GUUmzVUH9Ps4Y6YSA6FXorgIaMuphjCu2L3rcvzmy9124Dhvp7dB152vR4zuxqaq6siTQYlaFGQJFNzLCyGHOnZudylm31CckHx98ZlXcAQ/09uom4FAyG2++qC1QsXR/B2lilufcopmkyP/Q1JV4/wT1d/LGwnE+l0z/brv7oqYFxqQPoyNPBYKi9rfvJisJGlPoD97P7+aOU+cop9ZXT8sJJQp0P4oglDvQcrvB7fe2uY78CoA2eeaLZY+oTXUeerdbEDTyJKUoy66BpuA0NgI6xEAcFTiSEU99Cca2a4cHz2YIl2nRXOCeadzZVanoacy6KWagid/Bdch1n0dZcnOpHyHZ/TLbrfczNEsz4r5T6JLubIuVC2Cd1ZRc7vYFaQ2ZnKV35k/wDryGCe3j65X4ulD3HpUwTz7z4Jq7/XnL736I0lUFaaYJ1fgPX7tKLQu7dtr0ON79MrrEFua32346Msv9U7FbVk9t1H7K4itdfQ9ESrabjOCgpUK6LoxfRVs5DoJvBL99D27yGpul0fPUROGlY+xHHKICrgStwHKGZ0rGjG6n5g9WVPuZXba7P3GKj8P3tmfzj3wIKb4XLQ6FKdtRIMokE0nWiZt6WY6nFxYdHVdi4GbPZ0VDGvrZWwpEwAMlEEoBwJEwqmeKn3yQN25eYn4u6uYIY1S1bfH4xuioS2SqOHT9GoVhgfX2dZCJJMpEkHAkTjoRJJpIopUDTyaYtxiamLct2PtOUUrzx6ktzHY/13N3YuJN4fI7xq+P4a3z8X95yl/11q/ww/F0+trTc9+FY/qwJYOOpDQQCDA2PcPjxQzhWnlP74kix+fcnPFVoejW5jMM3g5fzC8nMTcdlAMAEMAxjZHJysrf7UIcxOXGDoHlLLcbRgqF7UNJlOZYgHv/FvTwxYwkh+oRk4NyVvLwDsG379dhsjOmp6ad0Jcbs30dnP7mWaXNc9gJ4DKKWYFQqPj13JT+9NdZfsnaYXsIMGj4AAAAASUVORK5CYII="

/***/ },

/***/ 478:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMkSURBVDiNZZNNTFxVHEfPu29mmIHhc/pmgIBag9hqQAHDQqlgmwCliYmp7jRp6ta0MTHulMDGxEVNjAt2VkyaEIvEBD8SU8IgdMFHqxltbKFQQBAYrK3O13v3vntdEJHIWZ+c/JN/fpYxhoOMDvY2WJg3bFSnQTQBWOiUTyBpsD4/+/53Swd969/A6GCvEOgLgWBwoPHxhpLK2kfskuqjgCGzucTu+rJ/5+69rOu5/Urz8esfTOr9wOhgrwigrjlOTXtTR3dxoBKsUB4rCASLQIcgb5Ff3WYueS23tbMz6/ni1JuXrusAgEBfcJzq9paTfcXLM8OszcyiPMUz517DyxX49YuvsWxBQ08Xz/d2Fye/Gm//bXv3IvCRdXWgpyEYEAtdp18ty2xPMPfpKG3nX8b3BdKV2KEiwlXlqGyG+aERTrxzHgpxvrw6nsm7qsU+e+LRi8caGk+VJ2xBYRHnqccor09QHK+irDZBSXWMomgR4dIwlfVHCEcModIKzIOsvbaV/jtgvEJn+ZG4rTPLiIBFqVMKSjLxzSzJb1MAdJ55lpNnmqioi6HdHNrdwUnEbH681RUoKN0crUrg/zkPQoGv+OXGCmPDM/uvGrs8RSIe4fjTcfAlWv5BeayegquahJQSoxXG98FXGCWZn7nL/5n74Q5GeRglQe+5UipLaOmlHm6tIoIVGF9hlMftW9uHArd/3sRIFyM9sMKkNzfRvkyJnKeTW+vrvojUYHyJUZLGJ2OHAo3HHIzcu8Cyoqze2/CzeTUpXE8NX7+Rynv5KCLkYJSktSV+KNDWmsBID8suIbPjklxYdF1PfmZ//9Pu/YkrH3q7W9sdx5tfCBr/IbEKTTgSYiedIxIJ0N1zlOdaHSw7imVquDIykUvff9D/STI7bhljeO+VehGw/Mn62uq2vtMvFYejOYzcRau/9gYTLMUSZWTTkpGxqdza7+mbruLFoemc3h/Tu31xYaHftu3gQEdrY7iuLm471Q5G+2xvbLKysuFPLSy5Sql+pbk0NJ37b0wHeaur7AmMPhcUulP6NAMEbVKuYlIbLg9N5xYP+v8AYKGQEKKW1wQAAAAASUVORK5CYII="

/***/ },

/***/ 479:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAA4FJREFUOMstwUtsVFUcB+Df/9w7d14dZqa1LagdgUKl+EihGIsCFpBHRAwmGnaGpQZtNLoyRsaNcauJxkRD1BQ3dkGKBSsxfWhBFrRIsCm1WO20nTKddh535j7OueccN34f4X8D2aN4JfszPus7gnTMj4e0iIJgQSMIKOQudH3SNHptbsi17Z0agJIKiVT6c8pms+imYZw8dx3fvre3oSEW6XugsXl/PJnuZtENzcqv173S6tSsk1opbjlz4tCeHdFEyENxzcZH39ywzb00iGPnJvH9B8/1xqzwF3uePdyZeKQVobiGETWhlBkXNb6vY7mkz49fFz+UneCNk48Z5y9Pu6Wyc9zoH83jwvv7n3qoZePAgZde3RJJr2uwHMgQpI0AQB2EdSzVJQ3NbDPePb2bfX3pDk3cWghxn5dYf19PpCmZyj7xTO8mXh/Xov43QSpSikNzB5q7UIKjXqsAAIpuGKee78aXH56GZeCEGW9JH2xr3/mCEdyGUmViLAEVcBjcg1YagAYCgY5mD2d7RlGeugLPexDjEzOX4HW8bVqGeTSV0FDuCmAxkBRgwociBqYkAEAHAkxxbE07kNEalIrAyq2lt0WGVk3GcCwWNyBdT1MQJpgCWpkwFEPAJQwGQEow6UMEAlABmCzDili7GXeiTIPaTAPQwidIgauTHPmCiytjBVjk46eRZdgVB8PXyjA0B4QApAsNxLjvm0xy547nuIAmjUAgl/fx+sd3kcv7MAIXubyPl9+5iVzeB0kOrQIoaUDUq0UdcG76rhi2K37PBotIyQBnehnOvpgBVwbmb+fw2qEU3jy1A67D4XscEFwHCFOpWJqsedxl9VptcGW5CIq0AcKF5ALVigev7mJm1oFbtlEtO+CeD3APhtVI67mSXims/rq0ZDvGgUcThcpaIZ3Z3PW0Zbla8wqBCKSBTCYKM8QAKaElB2OWJt5KFy+OzP++GH/rq4mibQz/saY721KL5eV7vQ9ndjVHGqIgWQegtJYBQWvNiIgoDsdupB8Hx5wby+an/Uu7xo5sDwvj4JOtuDDWs24l78/n7v7ZEpK01TAbYYWSFIk1QfgRWl+V+Gu2gsu/TM2PLIS/+62yeaDTKhbn7v8TEAA8vr2duamNiZTy2juT1X2ZBD/cGhddYSY3CUWVghOaXrRDN6eryQk7CM9RGP/q4mp1eu6e+g92meNW5kJLzwAAAABJRU5ErkJggg=="

/***/ },

/***/ 480:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAArJJREFUOMuVk1lIVGEYht9zfmdGnc6kTiNpJlaaGSWRlhGFkRQWEhRBZJQlkjcVCGFFEFnRRdpCErRAN3UXCW2i0b6IS5kkQ7lVgo4ZOjbjzJw5y/9/XZiJF4q91y/P973fAkwjqkpMoarElOk8EdMCJH4eEgjAnv8CUFUiMOp1mMlpWSCATvscZlSM33LsJ2YsUWFbbXRWk95xlXiFddVUPnlKwLzU41yxwFRkhOYsPDZlBFGVsEuCdAJ62IAZBieCoZumEbsox5AGAVJhxqRs/37kawMnMIMDJqwkLDYL53RhrFpl7FntfWlAN9pIMz6JsN4oQv4HNNS5jrzfdgvVd4c09SHp2lMyjRby1BUFm0vlSgCQxlsJnJ2dbWesRTt8F+HRLjINjySLEUB4IfgwGGMU7SqSOqorfYFed/7am7xxEgAAekqjoqzJcV+dJZeSQ+pHyOSDMNwAgMhZe/H54inPuxbv0vI3hi8+fyO22pSJIX4pc2DRDVUNM1uPECYAgjDckGTn390GEZRtg+UDW5zLs9csjvsVTPowPKSwccC1Rg3N+7HAnr7ySlTGEjDGYJHXQWZpYNYwBPVCHbAlqD/aP/ebsbrETXCQf1KEn/UHKTZnG5jdid4n1Witff3C4ITMvDUbM3YWg2vA9YKCpsrghh2K4R1OSJqvMQB4VBiBojQx15ZkL7TGZShvzxT31da3Xz7Tsfz2037XM+F+1TX06v6SuUtzZjtcIYW3Ndx73urxdHZ2TQzxcSErsTljbnFiONcUn+fRHcP2SOEXJPkHR8FXKF7n0dUj3aNhHT/6tWvlfbknKdAxEaHuUDxdaHaldIechjIrHJC9XrV9WaaJmhr6lzG9TI7W2iJrCtzB/LosV47rtw8A8PJAxNhVR6RKmzflzuhX9q1PkuGMxx9/rERwo95XaAAAAABJRU5ErkJggg=="

/***/ },

/***/ 481:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAA5tJREFUOMs10s9P23Ucx/HX+/vpt+233y/9PTqQdhRoKL8kClIDaky2zHCQuHlgiwd1Bz148aBGoxcPhqkH4tTEuBkvhOoSTQxz8cDUmIEUhoA4cWxQfq7pbCmF9dt++/3x8aA+T48/4EnfjPTB5W7E4CuX8dV7vZIsBbtVe+i1d6X+Zy9Yk1xkFgzdODRM/kNZVUdLmrr03NvTZfwX/Y+xdx5qCR2LfRJubH7q9FYjACD15B3uYiYMQ6RSycLdrQI2N7OTl8tPf0i+4OLW/MQ9AoDPPjjT0x32Jpua3bHaesYt/RACM2FVDOKcwOwWB3FAcGN3W6OTf3UDAPqskIfOXbgYmZGtzU9DafRE9vhPc5xWtmXusFnU33EAAJi+6YZmCLwtXKITfcQzeZF+XcjP7JXUE7aT1e8bZuRB9ETLSF5ldOrFEQwFPAQAfywtAwBefaYLAOjvfBFjX75FL51mXC3YH129le1iL5+Kf3z+cRafmVvj8YE3KRoNo1qtIpfLobEpCl/Ah3w+D6fTCUWW4FAa+fLsd+hoDdHuTqFWEBiOiw4dG3dNtMSi4JwjNZvCmbPDmJq6jmQyiRfOPY/19DoAoCUWpa2MjpoaAhOs4wKzCTIY521+RvMLiyAiOOx2OCUJiqxAURRIkguiTQQAzC8sos3HCIxzgbhLgGnBMi0kIgpWx0eRXl9DW7wD42PjMCv7iNT5cOnzLxAIBpFeX8Pq+CgSEQWWCVimBZte1UqGTgpvkPhwQqcbF9/ANHng8DN0dmoAgGuXktD2TIRRxHBCRPUBiZPGSdeNkk2rmj+W7ltDLglwJnz8iS6DUDYAN6ALEgAgHraAAw5IfliyjesVE8V9HZqmX7OV1crI5npuqLOrFqnUJmVzBmRJwMBjtWD831HLnHB9qYCSaiF0xEa9vRGevrOF+2r5PDvxiDevVfQ+vSo0hxsU3t5RQ9tbKvYLFbi9IqoVE6nZHGRZ5AP9QZIkO7+9kqPllZ1fljbMj9iVqazRGpJ+E23CYH293+fx1fAjAQHpDZUyO2VksmUcDTl5R3sN7HYR+3tVmk5tZK6kiq9P3PSusodjPnz9c0Oeifnl/XzxQcEw6vwBP8VbA2hu8fCmqBeBgEIHh0TLc2v07eT2ras3Su//WfBPeZE/IACIHQsLFV/YFZb15vajZqKtDmeDHqFPcQoucOCwYqnZPXN+cZcm1u6x34sau+108MzGykrlH2pNnfrgCjrQAAAAAElFTkSuQmCC"

/***/ },

/***/ 482:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJLSURBVDiNtZLfS5NhFMc/z95X3eaPuemcMksXIl5IkDGIoKIIpIgIIYgY4YUNjLroF/4N3dRdwpAg2V2BSKGJZWaR4kgt6qJErbRSM2nzdVp7n+fpJoXQ6soD5+bL+X4PnPOBraxIOOqMhKPOf82IvxgNIUSTYRjXAKSULVrrtngiJv8bEAlHj5qmcbOqJuQ/fHyfG6C3cyA98fb9V9uW5+KJWNemAZFwdFeWabYWBXy1RxoO5hZ68pkd/wJAaVUpi99T9HT0Ly/ML762bdkcT8RGAUQkHC03TfO6y+08Vn/igLMiFBTzk3OkFlIopdY715ePP1TCx6lPuv/B4Opq+sd9KeUl0binedDjzQ+fOX/SsFcyTI1NIm2JUhqpFEqvhWg0msqdIYwck472LrmUXE4YtWV1PUKoyyNDb1Y8voKs8uogaWsFK7VMxrb5mbHJZGxcHhfBmm3MfJilp6N/JW2tdiqlmgTA7Su3dO+ToTrDcIx4i73sPbSbXLeL6fEZlFKU7SjDstIMPx0j+S2FUqpu7QYOgHefx4knYqNSKnwlHrrv9jHwcBhvsAhvsIjnj1/Qd+8ZxSVelFKsmQFMgEp/aP0tBYV5+AM+rKRF951HAOTmufEHfHh8+RuYMQFeTrz6Q8zJzsLtdxII+ADQGpSSCLGROxOgtCD4mwphKVvlVVRvJ9s0MRwOAKTW2LZNMrmEEML6A6QL9Ve1s0iQlXEzMz13Vmt1Qyudt2EVIBzCEsJxsX2otW1dbAif0rGWNn16f6PezLTl9Qv9RAGlYGkEWQAAAABJRU5ErkJggg=="

/***/ },

/***/ 483:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKhSURBVDiNfdFdSJNRGAfw/3Ped25u6jJTU1tsS52ILlNL8CKkj5sMwj4UsYtldxZ4FxpYFF0YXVdkF1oEESJCIWTSFxGFaNqHXhi66bsUl5qbr77b2M7pohQ3yv/VeeDw48/zkBACm9PrsumYRJeJMReP8F1MZl4R5fc5FzdrutxRxIU2A70um06S2WCGw+nIO1ybaMoqgPrjKyZedq8tfB//Fo3wyniExQyMrmTmF+bvrWtOlBGA5hmAjq2i5MwF4w57XhGTqGXLBtdPFfp6ZpLT4z+t5+TulbmrPePZ/23gTNFS33U2b8yvbh3deL++68JeczA1HpVjNIl5V2ZGrAM3ysFDfkRW59Dflg+WYIKqfIEk0Uw8ENNAcPFoavCjJhkzAJIRXfMBIDC9GVPDIxrn4uGWQKvPNTzmCelHnw8gGGSQ05wIhmSMDLzHmIKES/ONn+KBjSXaqtsbkk2GjiOVhUY28gAVieOQgn5EDGZ80IqwnHsag6OTq2vB8Dl3X0t3TANbdXsqY+zOsUP7jJNzK6CSBiyUNuHaWDoWS5sgl9RjdknDgdICE2PUYatuT4kBiKityGHRC6bDckBFVbkdiuIFACiKF1XldgQCKgRjsFp2GoioNXYHRMcd9iy9Zz6AtRUVFcUWTCsKAGBaUVBRbEFI0+D1qbBkpxlAdCIWEMKabNRjcVkDkxiW/BqUv4CiKFjyayAiqFoYyUkGQAhbfAP34rIKa6YJKWYzup4Nob6uFgBQX1eLzqdD0BuTsCdnG375VwGiiXVA/nN/3tz/9nNPnj0nIWN7kvxm2IMXtxuxv6wMxcVOHDx/D7m5Fvz0LYTd0/NhwfnFf52xgIjOgqgGQmQAMCXomJ5zhCJRroJoVnDxBBCP3X0tnnXgN5rRFcwMy/glAAAAAElFTkSuQmCC"

/***/ },

/***/ 484:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9gHEAsxGX7j//4AAAMXSURBVDjLdZNfaFtlAMV/33dvbpKbJkvSpn/S1DaN2A07B8XNMccEN/9gNgRl+FoRBgU38a170RcfIigKQ32Q4cMEhfoiWAYqc4o4HTpkurluqWHt2to1MUmT3D+5yf18cOrQeZ4Ph/M7cIRSituVzReiwJNCyiMotR2Eh6CmfP8E8F5pfrZ5u1/8O2D84KsLvcnYyOTESHigN4YQ0LIcfimu2YvXf3OVUo+V5mfP/+WX/FdzZihAKhnjq4srfP7dNX6+ep3xdE/4wZ0TcSHEF9l84dH/DVBKvbK8Wmm6bhszGAA9iKfFuFBqoPkOD++9z5RSzmXzhcE7ItzCeHvHvdkZGQgxEzoORoLjxRlSIYv+3gSWS+f7i7+eU8p/6E4ICCEyISPgBw2Nid2HyQylmExZnHp6iUq1Sm50QI/HzCmEOPZ3g2y+YAD7dV2bjUZC9x88MGVeKlU4PL7II+O/A1A4v5UvizCUjJBJ9XD6zA+Wns0X8kFDP6Jp8kC6P9HZPpGJDg0kxczoJ5D7p9VLZ8e4WtXxuy7rVYuRgRh35zKG2DP9zub+PduiY8N92O0uizeqrNdaeJ5PuW6zb7jMi6mPOLMe4cRPk5jDO2naHgrFA9sGkS8fPRTNjaVZqzpcWapQbjhYTpem7fHCVJGju1Y5+e0K+3bvILf6JrJ2mZbjYTkdljeayPJmm5bbplHbQHRdwkYAKcGsnmPvqMUH77/LZHwNgKGoR6L0FtzarbhURioU4YBg9K4R0oP9RE0Dc+00mY1TAExtTeMLyWtvvM5SawsL8WnaVhXld/GcJvpGpYaQOq6naNgezUsfkm58Sv6pZyiWVtiwgnz2o08tPMXi2DQdFUB6NsrvIDQdvV5v4XkOwZ4knl2le/kkTzx3DITG2a+/4drCArXRZ1k2dhEL6+hSYXsh6vUaUgugd6SBFg5iux5tXwehM//xHJv1KjcTj3PznuexXY9Oo4Lb0jDCW4hFAsSjYZptDX2z6RI1gwQ0iRk26ebnWL6xwPpAHKcNrtNGAUYk+edXgHK5TF9fH1qnwx9ZAlEMN6nVUgAAAABJRU5ErkJggg=="

/***/ },

/***/ 485:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANBSURBVDiNVZNLTFxlAIW//793hsLAMDIMDDACRcAqfQSjxEBTCEaKXbiwEjfWaty4MDWNxoULCSTGjWLUTVdK66Yx4EKb+Eq1kKY1WtRkurHlMbyfw6NhHvfe//6/C6yhZ33ynZOcHGGMYb9GB3sbBeaMheo0yCMAAp30sccM4qvT7/8wud8v7gNGB3ulRJ+zA4GB5obG0EPVtVYofhAw7C5NsjE/7d+ZSmUc1+lXms9e/vCa/h8wOtgrbdTVWKyqraayvGjhj+9wdtI0nu7Dtm1mRy8TLI0SO9zFP3Or2ZW1td9dXz7z+tANLQEk+lwsFm9r7T5VlNtJkmh/nJZX+jgQKaQgUkjTa2eJdz6FpxZo7+0pipZG2nzPfQtAjAycbAzYcqLruRfDQt0isHSH4Po2CIFfWwtIrLkZMOBVx/ESTeQ3w3wzcmU356hW6SvvTGN9Q0jINexUEjtXQubEx/QMC8ZvbnN1OkHPpQC7XZ9i3wtiz9ymIKJpaaguVMo9K42b7ywtr7D07hQFG1tkn3wHFTuMCZaQPfYGXk03xi7Cjx4i8/R7FKyso501YpVRC9/tsvNKHy0uq8TfukXmYBO6uAKAkZGvgb2Fjne0A+CXJMg0P4bOpymNPkzeUUdsz/MwWmF8H0/mERtXoLwbhEDc+w0hJCbcsTf65q94Vg58Ab7C85Swtecmd1ZmT4RDEbS7DKs/ITbHEXYALAsjJKR/Aa0wysN4LsIqZX1pCe17STvr6rGV+fmOSGuN5efmQElAkNnJsjy3zfJsmuVUmkg0xLN9xzDKQ9rFzKaSfianrtmOqy7d+DN5vuHQo8VWMIb20vw8epudzRzxujKq6spoba8jVBz8Lz3E7prD2MRdx3G9i8IYwwcv1b9dV1M1+PwLJ4tU5m+0t4mwbJB7bcCA0QirBGGqGL74Y3Z6YbX/87HsRxIg7/qfTKVmJ0Yuf5t11SPYJS3IQBSMBUYi7AiyoJ7sVpgvvvw+m1pc/cvzGXrgTO+eqpACfd6yAgPHn2g+kEhUWLF4DKN9VheXmJlZ9McnJh2lVL/SDF24ntUPAO7rza5wE0a/GpC60/M5ChCwSDqKa9owfOF69u5+/781No3Odte8pwAAAABJRU5ErkJggg=="

/***/ },

/***/ 486:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9oFDRIdHcYztZ8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAC+UlEQVQ4y31Rz2sTaRh+vpnvy8w3mWRsasbajO5gl65iQetBqq5WRVQ8KZ5WUdgi/QeUxcMeFg+erIgHD0WKZ0Hwtwi7CruItbuIaKFqm8Y0qan50c6kzSSZyWT2IBXR6HN7H16e93mel+AzDA4OioQG2+Nx/WyxUDik6/pf+WJhqOkGfw4PD3toATIwMCBQSexFgANAoBmGcXBL75YeWZYFx3GC8fHxZDqdvggSRIOAeABuN1w/OTIyEgAAlWS2J67HL3d3d3dRkbJIJEpCIUZ834dt24Qxto4I5IphrK1HoxE/m80ety37KIB3AEB+O3vm7107+3eEQlTIzs6iXC4jHA6DUYbRZ6PY3b8HsVgbqtUqkskkavW6n8lkrjeb/u9e3U9Re7G6U1XDcBwHY2Njn7KZpon+Xf1w3ToWFxeh6zoYY3ifey9qmnYkk5lpL5VKZ6hTqaSXlipr7967Q0zThGmaoKKIcFhFdjYDz/XAOYfjOKjWqgiCAEYiIRuJxN6no0//EFeu6lAFQejjskzXr/+JLCwsQFEUUCoiX8jD8zwQQuB5LmzbQq1Wg6qq6OjoECZev1kjaivjE8VSCVxim03TlGq1KkIhCQBg2RZc10WlUoFdtuF5Hz+phlVwzjH233NHnJvNOqmpqUd927YWGGP74nGdNv0maTQaIASQJBmcc3DOIUkSQiwEzsOYeD1Zf/7i5VWyXNrJkyeiRdu2l698D11dPy6k0zO35j7kz9Fl0rLsMggiAiGdG9tSPbs7395o7zvkl0bvi/9kVp96ONn57/Jucd7yCBHmHCpY5Ev1m6fRLohisWf/3kYh9a5SSKWPNeru/cNDrd0IrUiuRR4DAT5MTmtBMxABkG/F+UqAxWSHyuxVM2hWf/71l1qbsfq2qrcdfXBeYa0ExM+HB0OKHI3r+4yNG/okVZnOTU0+MXs35QkTYp5fz167uzT3pcCnEm9eAFFiGo8lOjPKiuilXGrKKuZmSvIK9QclpnFrPjffysH/XJs96BPLGEYAAAAASUVORK5CYII="

/***/ },

/***/ 487:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANdSURBVDiNVZNLaFxlAEbPfUxmMkkmk07vZMxLM0xepolEbZA2TWIFm2ajpWaltYpuBKkUpGBFQ+JCEK1USg2ufECrkLQLCxWlJSmhQjWKnYp9JCaZNM9J0qbM6869//+7ENt41h9n83E0pRSbGRnsiWmoAwZul0JvAdCQcYE5ptC+2f/+D5Ob99p/gpHBHl1HHjI9noH6aKyorKLGKIrUAorUwiSrc3+Lm1MzaTtv97uSz176cFTeF4wM9ugm7gXLeqi9snyr//Yv32NvrBHb34dpmsyOfEtBaQhrWzc3EsuZpZWVK3mhP/PasctSB9CRhywr0t62u9ef3YhTteNRml/uwxcsxBsspO7Vg0S6tuO4t9nR86w/VBpsF07+LQBteGBPzGPqE917Xwho7q94Fm5SkLwLmoaoqQF0jMQ0KHAqIjhVdeTWA5wZPpfK2m6bLlznQOyRaJGmr2DOxDGzJaQ7PyG962O0dYET6CC1+ySp7uOY9wowp6/hDUqaoxWFrps/qKt8rqt0a9iQqSm8q3fIPPk2rrWN598Y5LzvRS4ko+x7/R1EqJH0U0fxLiWR9gpWechA5Lv1nCtbi7eUIzLLpGvrkMXhBx8Zvv9dLEqqSNc3IXNrlIbKyNlui+44Dkq6KCFw9DTXzryLyiUYPvUpuxoW6WxcZuT0CXCWWbzyBY6RBSlAuDiOq5nSycc3lmY7A0VBZH4RPXOdc0d7aNoepbI+glIwO/E5f/54ncZwCKuvHjNkkVxYQAonbmbycmxpbm5nsK3SENkEDS1h/MVepm8s8vP5qxiazpa/MjxWVEvZmo/kB1epOP4cszNxkc66o6add7++/Fv8cLSxodgosJDOGtW1pdTEQqA3g6aRvjjPnZNTaA/Xovu9pFZsxiZu2Xbe+cr46Y/V9YunPsqvLi13NLXu9CixgXJSoBQoCULgqSlEL9GwE2uEj+zh9NmxTHL9bv+JsfQ5TSnFe/uqdVMTo9UVkSd69z7t9xVnUM4q0r33bzCeEjQ9QDrp8N3ZS5nEYvJ326VzaDwj78d0pDesa8jDhuEZ6Hi83ldVFTasiIWSguX5Baan58WliUnbdd1+V3JsaDzzIKbNvNkdqEPJVzy67HIErQAeg7jtMioVXw6NZ25t3v8Dd4GY7H3IznoAAAAASUVORK5CYII="

/***/ },

/***/ 488:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9gLEAIMNezyDS0AAAHMSURBVDjLxZO/axRBGIaf2b0fUfBiEkFJjBy5SDDYCyISlcQ/wkosRGsRsRErkaCNgk0SC7UWEeythWAUwSTeQVCI7N3t7OWy7s7s7ozF4XmSMwoWfjDV8LzfvPO9H/zvEgDz9+5iTIYx5u8gIXAcl+vXbpADUEpdmJo6+nTPwF4cR/wW1FpjjAUsn6rV18BMrnOhJqePHefmrdvUaht94UIhz5XLFxk/PMrI8AFW19ZOA50XdMoyMjTE1TuX0FoRyBYy8PF9SdCSlEqDrLz7wGSlTM51u1Sut0s+X8DzPJIkwZc+sunT8Jv4vk+pNMhAscjDR0vMnTvbZZxegSRJaDYbSCkJw5BIxWidkGUZAGmWcurkCY6Mj/UXiJXC8+rUG3UCKWm324Thds8/FFh8/Izlt+/7W1BxTL1RxxqL0gqt9C+jTZOUudkZKhNlatX1/haCIKC11SKOY4w1CPFzrEmacn72DJWJ8k4LQgjC6BsqsTtOah3eLK8wNnqI5y9e8XF13f4IYa4DO5nSMQ/uz++aQGttp6sjxJfPG6orsLn59cnCwtLBKIr2CyF2zbM1xrWQlzJ4CRR7c1sChoHtP6zCPsAFPGDrn7fxO5UB4Cpa/kb1AAAAAElFTkSuQmCC"

/***/ },

/***/ 489:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJSSURBVDiNnZLda81xHMdf39/vp5Npik0ZZzix1cSVOedgD1yNw0z5D5S1WaJ5ulLupg0pD7lBu5OSG7mWh+1CyoUSSR5KMZuHw84539/38/m6sP3IFuV9++396vXp/TXeewDOnB3qU9UhEZnLXxIEYSk0HOnvP3YBAO893nuGTp+cjOPY/yvWWj94amByuhdNk0VkbhRFjE+MISKICqqCqqLeg/cYY1iWzqCqiWX0p6Kqcv/BA1QE9Yqq4vkJyOVzM06aFZDLZRFxv5no1JvMBGS2n/QAPZunAF4ZHRlNThAVVJT1uWYgTIrTvcTg0p2A2oaHFPJ15PJZnDhEHE4EEcfUWJy/NsKlO0ECMisKA2lgA7BvXlWqzVoXxG6mKkAUBcyJIi2V7V3gIjBqpv/Bys7Bu8d7t7V+tfDoxQSpVEQUhYgo5UpMqWRpqp9PpDFXb4zce3nraBtAANBQOJfy3mebMot48mqC4cPtBGHIxd48JggYPtSOes+zt5+pr1sA+GxD4VwqAVhfbFm+tCb+XnZ8/FJmXWcfcSxs2H0Aax3rOvsQUT4VyxRLjpoF1db6YksCCMJwx9rGdNXjF2PY2JHJdnH5wCYy2V1cOdjC8uad3DyxlTgWnr8Zp35J7bwgDHckAGNMVyZdEzx9PY6LHZWyZW1HN6XJMms6uqlULI1b9mDjmDfvi9QurA6MMV2/zxh9mPjGxtWL8RhEPZLfj3NK65peKtbRvGov1gk2Ft6+G0+6EYAiPddvPxxUr014fo08WwwamOCpIkcBkhn/Nz8AudBio6+EbiYAAAAASUVORK5CYII="

/***/ },

/***/ 490:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVDiNVZNNTFxVGIafc+4dYBgKbWH4jwWkaEvbhMZgUrWQmljsQo3VNP5UTVyZmJqqcacEEuNCA2pddKOWmqgLMKmSiCZVpjaksVJMZmULdCbAyAx/bWUu9+fcc1xQGniTd/Elb57F936fMMawWUO9Xc0Cc9JCdRjkfgCBTobYCYP45vgHI5Ob82IDMNTbJSX6lB2J9LQ0Ncd21N5nxaobAcNqZpLFmenw+lQq7/let9J8/vJHo/oeYKi3S9qoi/F4TXtdVUXx7NWf8G4v0Xz8eaoefgR0AawJ1tJZriYuOvO53J9+KB9/vW9M2wASfSoer25vO3KsOD32JfWH9lIUr0ZEohhvhYnPznBrapqyxkYOnXi7OHFhuH02u/gW0C8Ge442R2w53vnkc6VC/UUkc52ChVsgBGFDI6qlFSMtTOCi3f8gjOAtxPhhcHh1zVNtdqiCk3ua98SEzGGnkthhBfnD7wMQnfgU2/0HuZjCurOELizG3VVHYVUbrU210SvJyVel8d2OsopKS69OUbi4gvPQu6j4Pp55o5eR6IuMmBd44nwRKy/9Qb7jY6KpGbSXI15VbhH6ndJV+kDJzipCJ0u+cTe6pPJeRUYWbZQFwkJV7CPfshftLlFWvgPXU/vtIAgwWmHCkEC6iMVhqDjC4Lf9iDtXEELy2HdfQJCD5d8JrDUIBYSKIFDC1oGfvD2fPlwa2472/4Xsr4jlSwg7ApaFERKWfgOtMCrABD7CKmMhk0GHQVI6vk7Mz8yEMlqDCYO7IW/dvofx3buzv24VIEQJ6dRcmF9To7bnq/Nj15Knmx58oMQqiKODJS4MXCOTXtly4rUNO3n6lYMIK8ZqziMxfsPz/GBAGGP48ETDO7vqanqfevZoscr/jQ6WEZYNUq4vEANGI6xtCFPDuYFfnOnZbPeZhPOJBHD9sH8qlR4f/P5Hx1f3Y29rRUbKwVhgJMLejixswFkp5auvf3ZSc9mJIKRvyzO9d6xSCvRpy4r0PHqwpai+vtKKV8cxOiQ7l+Hmzbnw0vikp5TqVpq+s5cdvQWwoTc7S3dj9GsRqTuCkAMAEYukpxjVhnNnLzs3Nuf/BxA7oNbInLY7AAAAAElFTkSuQmCC"

/***/ },

/***/ 491:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANGSURBVDiNVZNdSJ11AMZ////7nqPH4zw6O07tuJaoa5jCikmUTVuwnHejLhsr6jIW3QQFJXoz6EIoRngVtdFqMIvYLoqY0+EWyWyrsyA/5secTs/R05Tz9b7v/6OLMbHn6rl4+N08/IS1lp0ZHuhpEtgTDqrLItsABCapcccs4tzrn/48u3MvHgOGB3qkxJxyQ6H+lsamaFX9Xida+zRgya7Msr40p6fvLuQ83+tThi/ePD1qtgHDAz3SRV2Jx+s62jqPlrlVIMIFRAg2/rrN4vD3hGPVxJ/tZureWn41lZrwtXz1ncEbRgJIzKl4vLbj4JHeMtx/ULlJdHEZE2xSUhmh+e2T1HYdIlD3ebHnaFl1rLJDB/77AOJi/2tNIVdOdh97owJ7G2s3kZEYsrQc4TiEZmdwFmbBQlBfS5Boppip4IeLl7MFTx2UWgUnmvY1RoVMobNLYA1W+xhVhGIBP9ZJ9siXZLs/x90K487foaTS0NpYH1HKPymtX+yKPVHjmOwc1mimrt/hp9Pn+GXwW9LrZYysPsXxdz9CVz9D7oWPKVlNY7wU8T3VDtrvdovKtJfv3oP+9yZIRcP+ehKt+9hYfsha8jdIHNq+TO9KkGs5gCluEKtuoOipNjcIAqxRWK0RVlEaiSDCYaKtCZAu+yvWePm7MxCkIHOVwCmAFqAVQaCEawI/ubm6eLgiWonxH4DyQUiwFhwFmauwMQJGYVWADXyEEyO9soLRQVLmfTO2urSkZaQOqwP+nljAeEVs4GF9D+s/6sbzSF6fxaoAIcpZXFjWuYIalZ6vzt74I1nwC+XIcJyQA5fOTjA9uUAus0Uus8X0zTkufXWD0hKBcKJkUx5jkzOe5wffOL/+uZ4ZOf+Zv7661nmg/aVQ1W5FJKJZupvh9yvTTN26Tzgsae94koamvQhbx/kLI/l05mHfmbHcZWGt5ZPjDdIVerShvvb53mOvlJWW57HBOkZtPRImtAshK8ilAy78eC1/70H6lqc4PDSeN9syfdhbIwXmA8cJ9Xc+11KaSNQ48do41mjWlleYn1/W1yZnPaVUnzIMDo3nzf9sfJz3uiuaseatkDRdgaYdIOSQ9BSjxvL10Hh+Zuf+P9lQtrSrc6KHAAAAAElFTkSuQmCC"

/***/ },

/***/ 492:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMZSURBVDiNZdPPa1xVHIbx55x77szcmWkzbceYRhNbotFWbUMWutCFodVWVKRVUAqKiATEfenGrbiqgrhRKQSELgyiFBGLv2gN1RaxyUK0TWhNk2nNTNLJZGbu3HvPOV83Uoo+f8Bn8/IqEeH2ZqZUFXg9MLlnvHOPoFSMCn7zNvvi8dfcB/wndTswM6X6dJD7ZXjs6EhlcMIUyvch3pJ0FlicfS+pL57+1Fn71sQbkvwPODulDwQ6d3LXxInNfdufDCRbBDwKEAKyJKB2+ZNkce7jtrXJ4f2TcuYWcOaE6tMmf3X82S8ruWgAZTYh6TxaF0CBTdeJNxqUt42Txg1mpp9uOJuNHHhTWhoAbY4PPzxZCsIcSecnJLuOdxvYrIFNGyTxDXTQIev+jMmVGdp9eBM6OA6gvvuIvArCm48eOhVl8QUUgg4idJDD2xaCI745TxiByQ/gsh4meoyz0690nLVbjRf2be0fc87WSbsLKB3i0r8I84O4bAWALG2DihDfJYkbFMNRKnc+5OtLF/cZUM9Vtu8txa3zZL0a4tsgKd4leEkR8SCeNI1JkjriHb32LNW795TrS7PPGy/qYLFvWLXXPkOkgxJP/86jmNxdeN/G9i6xvjZHc+0KpcI64h3ez1Lqe0p5Yb9xzkfedcnSNbxtopTB9q6xfOltFOrftYXaUo8dQyEiDi+GUBKck4r2nm9aqwuSL+5CBxXQRbL0b5xNydIWWdrC2pRuXEBUhAq2EEajdJrLiHDBWMdXzca1F4dHx4rOrhOYLTgfsrn/EErlQCnwlnvDmKjUwtkm+WiExo0/kszyrfGe71eX/zQje1/AZquA4LzHhFWULgAKkYxt1Q7eGlCGXOl+6rWvUxHOKRHh8/fVqZ27nzh4z4MvG5vUULqA0nmU0kCASIL4HuItJj/I6vU5+fWHD2e9Y9wA2IzJ+bkfz2c2X60O7ilE5TsolIfIRwPoIMK7FJs26W5c5crvp7PLF6dXvOOlI8dEbp3p5LuqKPCq0oxqzQPADvFqUClTFrEtpWUFWBLPOe9558gxiQH+AS4LreC8BwfvAAAAAElFTkSuQmCC"

/***/ },

/***/ 493:
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJHSURBVDiNjZJLSNRRGMV/995/U5M4ao4PcmGI9m5hJanRMlwUGEIrldoIgosgFB9Q0KKwpKiWbSMIQ6FdoNELGawICgQxNdPGR2+acLD53/u10JkxE+qDA+deOIdzz3eViBC5bc6KSLdSqgPgX7yq0V5jZUwoO6OlaNPgjb1VR8zCzHSNCDX/4vceBT9XVx1+AaCdcz1KKQCUUvwPFyc9yQTaWhvcdrCHkeEI4V3nyd15jpHhCDnbu8gp62RkOEJWaQdZZR2MDEcoLr9M8Omz4B2lagFU95WL0t7WxafPH3HOYlfgnMU5h4ggIssJrCN6phXv1xKx6ZnFL6Ojt3QyipOkyOKsxa7Atz7W+vi/lhhraiYzEGDH/gMU5+VtFmjxkgYighPBOYcTh3MuncS3vG9uIT8jRFE4zHx/P2/HxhYVPPzDQEQQJM1FsIkEE6caKcwMU5QZYravj3exH8ThsYO61BPSk24bEcabGsgPhNhqAkR7e5mKfedbSQkOautFfJ2WqdS6tNJorVl4eRcv8RMTnWVhcJDoBk2w+hAfTzdQL+IDpA3WiBOJBK8iA+xtP0bw+G7mQhuRfaUcHXgCOh08xbTWKRhjGBp6zrzZw5uZ70zmxQi0nqDi/gOUl6oNAG+1QfqnaT7MzvF64iuel8fJuk4KS8pRWv3V2CoDs9yEKManJgl4HlcuXaCwoACUQqHQ6xkYY+K+7wdzsrekLsO5+VRWVP69IMD3fYwx8ZSB1rrt+s2rPdba4LqKNWOMiWut25Ln3330JZed4PkvAAAAAElFTkSuQmCC"

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzP2RhMDQqKioqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanM/Yjk4MCoqKioqKioqKioqIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvV3lzaXd5Zy5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9saWIvd3lzaXd5Zy1lZGl0b3IuY3NzPzhmM2YiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9saWIvd3lzaXd5Zy1lZGl0b3IuY3NzIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvV3lzaXd5Zy5jc3M/MjMxNSIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL1d5c2l3eWcuY3NzIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvbGliL3d5c2l3eWcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9saWIvd3lzaXd5Zy1lZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvaW5kZXguanN4Iiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2FmcmFpZC5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvYW1vcm91cy5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvYW5nZWwucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2FuZ3J5LnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9iYXRoaW5nLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9iZWVyLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9ib3JlZC5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvYm95LnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9jYW1lcmEucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2NoaWxsaS5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvY2lnYXJldHRlLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9jaW5lbWEucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2NvZmZlZS5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvY29sZC5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvY29uZnVzZWQucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2NvbnNvbGUucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2Nyb3NzLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9jcnlpbmcucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2RldmlsLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9kaXNhcHBvaW50ZWQucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2RvbnQta25vdy5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvZHJvb2wucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2VtYmFycmFzc2VkLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9leGNpdGVkLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9leGNydWNpYXRpbmcucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2V5ZXJvbGwucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2dpcmwucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2dydW1weS5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvaGFwcHkucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2hvdC5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvaHVnLWxlZnQucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2h1Zy1yaWdodC5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvaHVuZ3J5LnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9pbl9sb3ZlLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9pbnRlcm5ldC5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvaW52aW5jaWJsZS5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkva2lzcy5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvbGFtcC5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvbHlpbmcucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L21lZXRpbmcucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L21vYmlsZS5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvbXJncmVlbi5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvbXVzaWMucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L211c2ljYWwtbm90ZS5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvbmVyZHkucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L25ldXRyYWwucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3BhcnR5LnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9waG9uZS5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvcGlyYXRlLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9waXNzZWQtb2ZmLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9wbGF0ZS5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvcXVlc3Rpb24ucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3Jlc3Ryb29tLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9yb3NlLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9zYWQucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3NlYXJjaC5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvc2hhbWUucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3Nob2NrZWQucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3Nob3BwaW5nLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9zaHV0LW1vdXRoLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9zaWNrLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9zaWxlbnQucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3NsZWVweS5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvc2xlZXBpbmcucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3N0YXIucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3N0cmVzc2VkLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9zdHVkeWluZy5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvc3VpdC5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvc3VyZmluZy5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvdGhpbmtpbmcucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3RodW5kZXIucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3Rvbmd1ZS5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvdHYucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3R5cGluZy5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvdWhtLXllYWgucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3dpbmsucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3dvcmtpbmcucG5nIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3dyaXRpbmcucG5nIl0sIm5hbWVzIjpbXSwibWFw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Ozs7Ozs7QUNBakMsa0NBQWlDLGd0Qzs7Ozs7OztBQ0FqQyxrQ0FBaUMsbzRCOzs7Ozs7O0FDQWpDLGtDQUFpQyxvaEM7Ozs7Ozs7QUNBakMsa0NBQWlDLG83Qjs7Ozs7OztBQ0FqQyxrQ0FBaUMsdzNCOzs7Ozs7O0FDQWpDLGtDQUFpQyxnOUI7Ozs7Ozs7QUNBakMsa0NBQWlDLHczQzs7Ozs7OztBQ0FqQyxrQ0FBaUMsZ3lDOzs7Ozs7O0FDQWpDLGtDQUFpQyxvNkI7Ozs7Ozs7QUNBakMsa0NBQWlDLHd4Qzs7Ozs7OztBQ0FqQyxrQ0FBaUMsd3pDOzs7Ozs7O0FDQWpDLGtDQUFpQyxvMEM7Ozs7Ozs7QUNBakMsa0NBQWlDLGdzQzs7Ozs7OztBQ0FqQyxrQ0FBaUMsd3dDOzs7Ozs7O0FDQWpDLGtDQUFpQyxnMkM7Ozs7Ozs7QUNBakMsa0NBQWlDLG8wQzs7Ozs7OztBQ0FqQyxrQ0FBaUMsdzFDOzs7Ozs7O0FDQWpDLGtDQUFpQyxvMUM7Ozs7Ozs7QUNBakMsa0NBQWlDLHd6Qzs7Ozs7OztBQ0FqQyxrQ0FBaUMsb3VDOzs7Ozs7O0FDQWpDLGtDQUFpQyw0dEM7Ozs7Ozs7QUNBakMsa0NBQWlDLDR4Qzs7Ozs7OztBQ0FqQyxrQ0FBaUMsbzNDOzs7Ozs7O0FDQWpDLGtDQUFpQyxveEM7Ozs7Ozs7QUNBakMsa0NBQWlDLDR3Qzs7Ozs7OztBQ0FqQyxrQ0FBaUMsdzJDOzs7Ozs7O0FDQWpDLGtDQUFpQyxvbkM7Ozs7Ozs7QUNBakMsa0NBQWlDLDR6Qzs7Ozs7OztBQ0FqQyxrQ0FBaUMsbzFDOzs7Ozs7O0FDQWpDLGtDQUFpQyxvMUM7Ozs7Ozs7QUNBakMsa0NBQWlDLDRxQzs7Ozs7OztBQ0FqQyxrQ0FBaUMsNHpDOzs7Ozs7O0FDQWpDLGtDQUFpQyxncUM7Ozs7Ozs7QUNBakMsa0NBQWlDLG90Qjs7Ozs7OztBQ0FqQyxrQ0FBaUMsd3hDOzs7Ozs7O0FDQWpDLGtDQUFpQyxvd0I7Ozs7Ozs7QUNBakMsa0NBQWlDLGd5Qjs7Ozs7OztBQ0FqQyxrQ0FBaUMsdzBDOzs7Ozs7O0FDQWpDLGtDQUFpQyxvdkM7Ozs7Ozs7QUNBakMsa0NBQWlDLHdrQzs7Ozs7OztBQ0FqQyxrQ0FBaUMsZzVCOzs7Ozs7O0FDQWpDLGtDQUFpQyxvNEM7Ozs7Ozs7QUNBakMsa0NBQWlDLG95Qzs7Ozs7OztBQ0FqQyxrQ0FBaUMsd2hDOzs7Ozs7O0FDQWpDLGtDQUFpQyw0d0M7Ozs7Ozs7QUNBakMsa0NBQWlDLG84Qjs7Ozs7OztBQ0FqQyxrQ0FBaUMsZzRCOzs7Ozs7O0FDQWpDLGtDQUFpQyxveUM7Ozs7Ozs7QUNBakMsa0NBQWlDLG9oQzs7Ozs7OztBQ0FqQyxrQ0FBaUMsNHhDOzs7Ozs7O0FDQWpDLGtDQUFpQyxnd0M7Ozs7Ozs7QUNBakMsa0NBQWlDLG8yQjs7Ozs7OztBQ0FqQyxrQ0FBaUMsNDFDOzs7Ozs7O0FDQWpDLGtDQUFpQyx3dkM7Ozs7Ozs7QUNBakMsa0NBQWlDLGd5Qzs7Ozs7OztBQ0FqQyxrQ0FBaUMsd3VDOzs7Ozs7O0FDQWpDLGtDQUFpQyx3MEM7Ozs7Ozs7QUNBakMsa0NBQWlDLHdoQzs7Ozs7OztBQ0FqQyxrQ0FBaUMsdzJDOzs7Ozs7O0FDQWpDLGtDQUFpQyx3OEI7Ozs7Ozs7QUNBakMsa0NBQWlDLHdqQzs7Ozs7OztBQ0FqQyxrQ0FBaUMsb3RDOzs7Ozs7O0FDQWpDLGtDQUFpQyxneEM7Ozs7Ozs7QUNBakMsa0NBQWlDLDR0Qzs7Ozs7OztBQ0FqQyxrQ0FBaUMsb3pDOzs7Ozs7O0FDQWpDLGtDQUFpQyx3eEI7Ozs7Ozs7QUNBakMsa0NBQWlDLGc5Qjs7Ozs7OztBQ0FqQyxrQ0FBaUMsZ3dDOzs7Ozs7O0FDQWpDLGtDQUFpQyxveEM7Ozs7Ozs7QUNBakMsa0NBQWlDLHd0Qzs7Ozs7OztBQ0FqQyxrQ0FBaUMsZzhCIiwiZmlsZSI6ImpzLzIzLTBjMTc3MDQwYzQ1ZDI1YjkxN2IzLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgbGlzdCA9IFtdO1xyXG5cclxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXHJcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzW2ldO1xyXG5cdFx0XHRpZihpdGVtWzJdKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBpdGVtWzFdICsgXCJ9XCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKGl0ZW1bMV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0LmpvaW4oXCJcIik7XHJcblx0fTtcclxuXHJcblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcclxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XHJcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcclxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xyXG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XHJcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcclxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcclxuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxyXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xyXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxyXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxyXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xyXG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xyXG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblx0cmV0dXJuIGxpc3Q7XHJcbn07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4gKiogbW9kdWxlIGlkID0gMjUyXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSA2IDcgOCA5IDE4IDE5IDIwIDIzIDI0IDI1IDI2IDI3IDI4IDI5IDMwIDMxIDMyXG4gKiovIiwiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxudmFyIHN0eWxlc0luRG9tID0ge30sXHJcblx0bWVtb2l6ZSA9IGZ1bmN0aW9uKGZuKSB7XHJcblx0XHR2YXIgbWVtbztcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRcdHJldHVybiBtZW1vO1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cdGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIC9tc2llIFs2LTldXFxiLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpO1xyXG5cdH0pLFxyXG5cdGdldEhlYWRFbGVtZW50ID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcblx0fSksXHJcblx0c2luZ2xldG9uRWxlbWVudCA9IG51bGwsXHJcblx0c2luZ2xldG9uQ291bnRlciA9IDAsXHJcblx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AgPSBbXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xyXG5cdGlmKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xyXG5cdFx0aWYodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XHJcblx0fVxyXG5cclxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cclxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XHJcblxyXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiA8aGVhZD4uXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcclxuXHJcblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0KTtcclxuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcclxuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XHJcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xyXG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XHJcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcclxuXHRcdH1cclxuXHRcdGlmKG5ld0xpc3QpIHtcclxuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0KTtcclxuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcclxuXHRcdH1cclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xyXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XHJcblx0XHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKVxyXG5cdFx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oKTtcclxuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKSB7XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XHJcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcclxuXHRcdGlmKGRvbVN0eWxlKSB7XHJcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHBhcnRzID0gW107XHJcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMobGlzdCkge1xyXG5cdHZhciBzdHlsZXMgPSBbXTtcclxuXHR2YXIgbmV3U3R5bGVzID0ge307XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcclxuXHRcdHZhciBpZCA9IGl0ZW1bMF07XHJcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcclxuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XHJcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcclxuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcclxuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKVxyXG5cdFx0XHRzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XHJcblx0fVxyXG5cdHJldHVybiBzdHlsZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpIHtcclxuXHR2YXIgaGVhZCA9IGdldEhlYWRFbGVtZW50KCk7XHJcblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Bbc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XHJcblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcclxuXHRcdGlmKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xyXG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGhlYWQuZmlyc3RDaGlsZCk7XHJcblx0XHR9IGVsc2UgaWYobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcclxuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0XHR9XHJcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlRWxlbWVudCk7XHJcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XHJcblx0XHRoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnLiBNdXN0IGJlICd0b3AnIG9yICdib3R0b20nLlwiKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcclxuXHRzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdHZhciBpZHggPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlRWxlbWVudCk7XHJcblx0aWYoaWR4ID49IDApIHtcclxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcclxuXHR2YXIgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xyXG5cdHN0eWxlRWxlbWVudC50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xyXG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpO1xyXG5cdHJldHVybiBzdHlsZUVsZW1lbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpIHtcclxuXHR2YXIgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcclxuXHRsaW5rRWxlbWVudC5yZWwgPSBcInN0eWxlc2hlZXRcIjtcclxuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGlua0VsZW1lbnQpO1xyXG5cdHJldHVybiBsaW5rRWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU3R5bGUob2JqLCBvcHRpb25zKSB7XHJcblx0dmFyIHN0eWxlRWxlbWVudCwgdXBkYXRlLCByZW1vdmU7XHJcblxyXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xyXG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBzaW5nbGV0b25FbGVtZW50IHx8IChzaW5nbGV0b25FbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcclxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIGZhbHNlKTtcclxuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIHRydWUpO1xyXG5cdH0gZWxzZSBpZihvYmouc291cmNlTWFwICYmXHJcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xyXG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XHJcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XHJcblx0XHRcdGlmKHN0eWxlRWxlbWVudC5ocmVmKVxyXG5cdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGVFbGVtZW50LmhyZWYpO1xyXG5cdFx0fTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xyXG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XHJcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKG9iaik7XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZShuZXdPYmopIHtcclxuXHRcdGlmKG5ld09iaikge1xyXG5cdFx0XHRpZihuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXApXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cdH07XHJcbn1cclxuXHJcbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xyXG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xyXG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XHJcblx0fTtcclxufSkoKTtcclxuXHJcbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcoc3R5bGVFbGVtZW50LCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcclxuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XHJcblxyXG5cdGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XHJcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlRWxlbWVudC5jaGlsZE5vZGVzO1xyXG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xyXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGNzc05vZGUpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZUVsZW1lbnQsIG9iaikge1xyXG5cdHZhciBjc3MgPSBvYmouY3NzO1xyXG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcclxuXHJcblx0aWYobWVkaWEpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcclxuXHR9XHJcblxyXG5cdGlmKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR3aGlsZShzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xyXG5cdFx0fVxyXG5cdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlTGluayhsaW5rRWxlbWVudCwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IG9iai5jc3M7XHJcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XHJcblxyXG5cdGlmKHNvdXJjZU1hcCkge1xyXG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcclxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcclxuXHR9XHJcblxyXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xyXG5cclxuXHR2YXIgb2xkU3JjID0gbGlua0VsZW1lbnQuaHJlZjtcclxuXHJcblx0bGlua0VsZW1lbnQuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XHJcblxyXG5cdGlmKG9sZFNyYylcclxuXHRcdFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcclxufVxyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXG4gKiogbW9kdWxlIGlkID0gMjUzXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSA2IDcgOCA5IDE4IDE5IDIwIDIzIDI0IDI1IDI2IDI3IDI4IDI5IDMwIDMxIDMyXG4gKiovIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0ICcuL2xpYi93eXNpd3lnLWVkaXRvci5jc3MnXG5pbXBvcnQgJy4vV3lzaXd5Zy5jc3MnXG5pbXBvcnQgJy4vbGliL3d5c2l3eWcuanMnXG5pbXBvcnQgJy4vbGliL3d5c2l3eWctZWRpdG9yLmpzJ1xuaW1wb3J0IHNtaWxpZXMgZnJvbSAnLi9zbWlsZXkvaW5kZXguanN4J1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuXG5jbGFzcyBXeXNpd3lnIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3QgZWxlbSA9ICcjZWRpdG9yJ1xuICAgICQoZWxlbSkud3lzaXd5Zyh7XG4gICAgICBjbGFzczogJ2Zha2UtYm9vdHN0cmFwJyxcbiAgICAgIHRvb2xiYXI6ICd0b3Atc2VsZWN0aW9uJyxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgZHVtbXlidXR0b24xOiBmYWxzZSxcbiAgICAgICAgZHVtbXlidXR0b24yOiBmYWxzZSxcbiAgICAgICAgc21pbGllczoge1xuICAgICAgICAgIHRpdGxlOiAnU21pbGllcycsXG4gICAgICAgICAgaW1hZ2U6ICdcXHVmMTE4JyxcbiAgICAgICAgICBwb3B1cCgkcG9wdXAsICRidXR0b24pIHtcbiAgICAgICAgICAgIGNvbnN0IGxpc3RTbWlsaWVzID0gXy5tYXAoc21pbGllcyxcbiAgICAgICAgICAgICAgKHMpID0+IGA8aW1nIHNyYz0ke3N9IHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIGFsdD1cIlwiIC8+YClcbiAgICAgICAgICAgIGNvbnN0ICRzbWlsaWVzID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ3d5c2l3eWctcGx1Z2luLXNtaWxpZXMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cigndW5zZWxlY3RhYmxlJywgJ29uJylcbiAgICAgICAgICAgICQuZWFjaChsaXN0U21pbGllcywgKGksIHNtaWxleSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCAkaW1hZ2UgPSAkKHNtaWxleSkuYXR0cigndW5zZWxlY3RhYmxlJywgJ29uJylcbiAgICAgICAgICAgICAgLy8gQXBwZW5kIHNtaWxleVxuICAgICAgICAgICAgICBjb25zdCBpbWFnZWh0bWwgPSBgICR7JCgnPGRpdi8+JykuYXBwZW5kKCRpbWFnZS5jbG9uZSgpKS5odG1sKCl9IGBcbiAgICAgICAgICAgICAgJGltYWdlXG4gICAgICAgICAgICAgICAgLmNzcyh7IGN1cnNvcjogJ3BvaW50ZXInIH0pXG4gICAgICAgICAgICAgICAgLmNsaWNrKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICQoZWxlbSkud3lzaXd5Zygnc2hlbGwnKS5pbnNlcnRIVE1MKGltYWdlaHRtbClcbiAgICAgICAgICAgICAgICB9KS5hcHBlbmRUbygkc21pbGllcylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBjb25zdCAkY29udGFpbmVyID0gJChlbGVtKS53eXNpd3lnKCdjb250YWluZXInKVxuICAgICAgICAgICAgJHNtaWxpZXMuY3NzKHsgbWF4V2lkdGg6IGAke3BhcnNlSW50KCRjb250YWluZXIud2lkdGgoKSAqIDAuOTUsIDEwKX1weGAgfSlcbiAgICAgICAgICAgICRwb3B1cC5hcHBlbmQoJHNtaWxpZXMpXG4gICAgICAgICAgICBjb25zdCAkdG9vbGJhciA9ICRidXR0b24ucGFyZW50cygnLnd5c2l3eWctdG9vbGJhcicpXG4gICAgICAgICAgICBpZiAoISR0b29sYmFyLmxlbmd0aCkge1xuICAgICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgbGVmdDogcGFyc2VJbnQoKCR0b29sYmFyLm91dGVyV2lkdGgoKSAtICRwb3B1cC5vdXRlcldpZHRoKCkpIC8gMiwgMTApLFxuICAgICAgICAgICAgICB0b3A6IHBhcnNlSW50KCRidXR0b24ub3V0ZXJIZWlnaHQoKSAvIDQsIDEwKSAtICRwb3B1cC5oZWlnaHQoKSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNob3dzZWxlY3Rpb246IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBpbnNlcnRpbWFnZToge1xuICAgICAgICAgIHRpdGxlOiAnSW5zZXJ0IGltYWdlJyxcbiAgICAgICAgICBpbWFnZTogJ1xcdWYwMzAnLFxuICAgICAgICAgIHNob3dzZWxlY3Rpb246IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBpbnNlcnRsaW5rOiB7XG4gICAgICAgICAgdGl0bGU6ICdJbnNlcnQgbGluaycsXG4gICAgICAgICAgaW1hZ2U6ICdcXHVmMDhlJyxcbiAgICAgICAgfSxcbiAgICAgICAgZm9udG5hbWU6IHtcbiAgICAgICAgICB0aXRsZTogJ0ZvbnQnLFxuICAgICAgICAgIGltYWdlOiAnXFx1ZjAzMScsXG4gICAgICAgICAgcG9wdXAoJHBvcHVwKSB7XG4gICAgICAgICAgICBjb25zdCBsaXN0Rm9udG5hbWVzID0ge1xuICAgICAgICAgICAgICAnQXJpYWwsIEhlbHZldGljYSc6ICdBcmlhbCxIZWx2ZXRpY2EnLFxuICAgICAgICAgICAgICBWZXJkYW5hOiAnVmVyZGFuYSxHZW5ldmEnLFxuICAgICAgICAgICAgICBHZW9yZ2lhOiAnR2VvcmdpYScsXG4gICAgICAgICAgICAgICdDb3VyaWVyIE5ldyc6ICdDb3VyaWVyIE5ldyxDb3VyaWVyJyxcbiAgICAgICAgICAgICAgJ1RpbWVzIE5ldyBSb21hbic6ICdUaW1lcyBOZXcgUm9tYW4sVGltZXMnLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgJGxpc3QgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcygnd3lzaXd5Zy1wbHVnaW4tbGlzdCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCd1bnNlbGVjdGFibGUnLCAnb24nKVxuICAgICAgICAgICAgJC5lYWNoKGxpc3RGb250bmFtZXMsIChuYW1lLCBmb250KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0ICRsaW5rID0gJCgnPGEvPicpLmF0dHIoJ2hyZWYnLCAnIycpXG4gICAgICAgICAgICAgICAgLmNzcygnZm9udC1mYW1pbHknLCBmb250KVxuICAgICAgICAgICAgICAgIC5odG1sKG5hbWUpXG4gICAgICAgICAgICAgICAgLmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgJChlbGVtKS53eXNpd3lnKCdzaGVsbCcpLmZvbnROYW1lKGZvbnQpXG4gICAgICAgICAgICAgICAgICAuY2xvc2VQb3B1cCgpXG4gICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgJGxpc3QuYXBwZW5kKCRsaW5rKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICRwb3B1cC5hcHBlbmQoJGxpc3QpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaG93c2VsZWN0aW9uOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICAvLyBGb250c2l6ZSBwbHVnaW5cbiAgICAgICAgZm9udHNpemU6IHtcbiAgICAgICAgICB0aXRsZTogJ1NpemUnLFxuICAgICAgICAgIGltYWdlOiAnXFx1ZjAzNCcsXG4gICAgICAgICAgcG9wdXAoJHBvcHVwKSB7XG4gICAgICAgICAgICBjb25zdCBsaXN0Rm9udHNpemVzID0gW11cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSA4OyBpIDw9IDExOyArK2kpIHtcbiAgICAgICAgICAgICAgbGlzdEZvbnRzaXplcy5wdXNoKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxMjsgaSA8PSAyODsgaSArPSAyKSB7XG4gICAgICAgICAgICAgIGxpc3RGb250c2l6ZXMucHVzaChgJHtpfXB4YClcbiAgICAgICAgICAgICAgbGlzdEZvbnRzaXplcy5wdXNoKCczNnB4JylcbiAgICAgICAgICAgICAgbGlzdEZvbnRzaXplcy5wdXNoKCc0OHB4JylcbiAgICAgICAgICAgICAgbGlzdEZvbnRzaXplcy5wdXNoKCc3MnB4JylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgJGxpc3QgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcygnd3lzaXd5Zy1wbHVnaW4tbGlzdCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCd1bnNlbGVjdGFibGUnLCAnb24nKVxuICAgICAgICAgICAgJC5lYWNoKGxpc3RGb250c2l6ZXMsIChpbmRleCwgc2l6ZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCAkbGluayA9ICQoJzxhLz4nKS5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgICAgICAgICAgIC5odG1sKHNpemUpXG4gICAgICAgICAgICAgICAgLmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgJChlbGVtKS53eXNpd3lnKCdzaGVsbCcpLmZvbnRTaXplKDcpXG4gICAgICAgICAgICAgICAgICAuY2xvc2VQb3B1cCgpXG4gICAgICAgICAgICAgICAgICAkKGVsZW0pLnd5c2l3eWcoJ2NvbnRhaW5lcicpXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCdmb250W3NpemU9N10nKVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignc2l6ZScpXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoJ2ZvbnQtc2l6ZScsIHNpemUpXG4gICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgJGxpc3QuYXBwZW5kKCRsaW5rKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICRwb3B1cC5hcHBlbmQoJGxpc3QpXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgaGVhZGVyOiB7XG4gICAgICAgICAgdGl0bGU6ICdIZWFkZXInLFxuICAgICAgICAgIGltYWdlOiAnXFx1ZjFkYycsXG4gICAgICAgICAgcG9wdXAoJHBvcHVwKSB7XG4gICAgICAgICAgICBjb25zdCBsaXN0SGVhZGVycyA9IHtcbiAgICAgICAgICAgICAgLy8gTmFtZSA6IEZvbnRcbiAgICAgICAgICAgICAgJ0hlYWRlciAxJzogJzxoMT4nLFxuICAgICAgICAgICAgICAnSGVhZGVyIDInOiAnPGgyPicsXG4gICAgICAgICAgICAgICdIZWFkZXIgMyc6ICc8aDM+JyxcbiAgICAgICAgICAgICAgJ0hlYWRlciA0JzogJzxoND4nLFxuICAgICAgICAgICAgICAnSGVhZGVyIDUnOiAnPGg1PicsXG4gICAgICAgICAgICAgICdIZWFkZXIgNic6ICc8aDY+JyxcbiAgICAgICAgICAgICAgQ29kZTogJzxwcmU+JyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0ICRsaXN0ID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ3d5c2l3eWctcGx1Z2luLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cigndW5zZWxlY3RhYmxlJywgJ29uJylcbiAgICAgICAgICAgICQuZWFjaChsaXN0SGVhZGVycywgKG5hbWUsIGZvcm1hdCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCAkbGluayA9ICQoJzxhLz4nKS5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgICAgICAgICAgIC5jc3MoJ2ZvbnQtZmFtaWx5JywgZm9ybWF0KVxuICAgICAgICAgICAgICAgIC5odG1sKG5hbWUpXG4gICAgICAgICAgICAgICAgLmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgJChlbGVtKS53eXNpd3lnKCdzaGVsbCcpLmZvcm1hdChmb3JtYXQpXG4gICAgICAgICAgICAgICAgICAuY2xvc2VQb3B1cCgpXG4gICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgJGxpc3QuYXBwZW5kKCRsaW5rKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICRwb3B1cC5hcHBlbmQoJGxpc3QpXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYm9sZDoge1xuICAgICAgICAgIHRpdGxlOiAnQm9sZCAoQ3RybCtCKScsXG4gICAgICAgICAgaW1hZ2U6ICdcXHVmMDMyJyxcbiAgICAgICAgICBob3RrZXk6ICdiJyxcbiAgICAgICAgfSxcbiAgICAgICAgaXRhbGljOiB7XG4gICAgICAgICAgdGl0bGU6ICdJdGFsaWMgKEN0cmwrSSknLFxuICAgICAgICAgIGltYWdlOiAnXFx1ZjAzMycsXG4gICAgICAgICAgaG90a2V5OiAnaScsXG4gICAgICAgIH0sXG4gICAgICAgIHVuZGVybGluZToge1xuICAgICAgICAgIHRpdGxlOiAnVW5kZXJsaW5lIChDdHJsK1UpJyxcbiAgICAgICAgICBpbWFnZTogJ1xcdWYwY2QnLFxuICAgICAgICAgIGhvdGtleTogJ3UnLFxuICAgICAgICB9LFxuICAgICAgICBzdHJpa2V0aHJvdWdoOiB7XG4gICAgICAgICAgdGl0bGU6ICdTdHJpa2V0aHJvdWdoIChDdHJsK1MpJyxcbiAgICAgICAgICBpbWFnZTogJ1xcdWYwY2MnLFxuICAgICAgICAgIGhvdGtleTogJ3MnLFxuICAgICAgICB9LFxuICAgICAgICBmb3JlY29sb3I6IHtcbiAgICAgICAgICB0aXRsZTogJ1RleHQgY29sb3InLFxuICAgICAgICAgIGltYWdlOiAnXFx1ZjFmYycsXG4gICAgICAgIH0sXG4gICAgICAgIGhpZ2hsaWdodDoge1xuICAgICAgICAgIHRpdGxlOiAnQmFja2dyb3VuZCBjb2xvcicsXG4gICAgICAgICAgaW1hZ2U6ICdcXHVmMDQzJyxcbiAgICAgICAgfSxcbiAgICAgICAgYWxpZ25sZWZ0OiB7XG4gICAgICAgICAgdGl0bGU6ICdMZWZ0JyxcbiAgICAgICAgICBpbWFnZTogJ1xcdWYwMzYnLFxuICAgICAgICAgIHNob3dzZWxlY3Rpb246IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBhbGlnbmNlbnRlcjoge1xuICAgICAgICAgIHRpdGxlOiAnQ2VudGVyJyxcbiAgICAgICAgICBpbWFnZTogJ1xcdWYwMzcnLFxuICAgICAgICAgIHNob3dzZWxlY3Rpb246IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBhbGlnbnJpZ2h0OiB7XG4gICAgICAgICAgdGl0bGU6ICdSaWdodCcsXG4gICAgICAgICAgaW1hZ2U6ICdcXHVmMDM4JyxcbiAgICAgICAgICBzaG93c2VsZWN0aW9uOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgYWxpZ25qdXN0aWZ5OiB7XG4gICAgICAgICAgdGl0bGU6ICdKdXN0aWZ5JyxcbiAgICAgICAgICBpbWFnZTogJ1xcdWYwMzknLFxuICAgICAgICAgIHNob3dzZWxlY3Rpb246IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBzdWJzY3JpcHQ6IHtcbiAgICAgICAgICB0aXRsZTogJ1N1YnNjcmlwdCcsXG4gICAgICAgICAgaW1hZ2U6ICdcXHVmMTJjJyxcbiAgICAgICAgICBzaG93c2VsZWN0aW9uOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBzdXBlcnNjcmlwdDoge1xuICAgICAgICAgIHRpdGxlOiAnU3VwZXJzY3JpcHQnLFxuICAgICAgICAgIGltYWdlOiAnXFx1ZjEyYicsXG4gICAgICAgICAgc2hvd3NlbGVjdGlvbjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgaW5kZW50OiB7XG4gICAgICAgICAgdGl0bGU6ICdJbmRlbnQnLFxuICAgICAgICAgIGltYWdlOiAnXFx1ZjAzYycsXG4gICAgICAgICAgc2hvd3NlbGVjdGlvbjogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIG91dGRlbnQ6IHtcbiAgICAgICAgICB0aXRsZTogJ091dGRlbnQnLFxuICAgICAgICAgIGltYWdlOiAnXFx1ZjAzYicsXG4gICAgICAgICAgc2hvd3NlbGVjdGlvbjogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIG9yZGVyZWRMaXN0OiB7XG4gICAgICAgICAgdGl0bGU6ICdPcmRlcmVkIGxpc3QnLFxuICAgICAgICAgIGltYWdlOiAnXFx1ZjBjYicsXG4gICAgICAgICAgc2hvd3NlbGVjdGlvbjogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHVub3JkZXJlZExpc3Q6IHtcbiAgICAgICAgICB0aXRsZTogJ1Vub3JkZXJlZCBsaXN0JyxcbiAgICAgICAgICBpbWFnZTogJ1xcdWYwY2EnLFxuICAgICAgICAgIHNob3dzZWxlY3Rpb246IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICByZW1vdmVmb3JtYXQ6IHtcbiAgICAgICAgICB0aXRsZTogJ1JlbW92ZSBmb3JtYXQnLFxuICAgICAgICAgIGltYWdlOiAnXFx1ZjEyZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc2VsZWN0SW1hZ2U6ICdDbGljayBvciBkcm9wIGltYWdlJyxcbiAgICAgIHBsYWNlaG9sZGVyVXJsOiAnd3d3LmV4YW1wbGUuY29tJyxcbiAgICAgIHBsYWNlaG9sZGVyRW1iZWQ6ICc8ZW1iZWQvPicsXG4gICAgfSlcbiAgfVxuICBnZXRDb250ZW50ID0gKCkgPT4gJCgnI2VkaXRvcicpLnd5c2l3eWcoJ3NoZWxsJykuZ2V0SFRNTCgpXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzkwMHB4JywgbWFyZ2luOiAnMTAwcHggYXV0bycgfX0+XG4gICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgIGlkPVwiZWRpdG9yXCJcbiAgICAgICAgICBuYW1lPVwiZWRpdG9yXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIlR5cGUgeW91ciB0ZXh0IGhlcmUuLi5cIlxuICAgICAgICAgIHN0eWxlPXt7IGRpc3BsYXk6ICdub25lJyB9fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV3lzaXd5Z1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL1d5c2l3eWcuanN4XG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi93eXNpd3lnLWVkaXRvci5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vd3lzaXd5Zy1lZGl0b3IuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vd3lzaXd5Zy1lZGl0b3IuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9saWIvd3lzaXd5Zy1lZGl0b3IuY3NzXG4gKiogbW9kdWxlIGlkID0gNDA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIvKlxcbiAqIElmIHlvdSBwcmVmZXIgdG8gaG9zdCAnRm9udEF3ZXNvbWUnIG9uIHlvdXIgc2VydmVyXFxuQGZvbnQtZmFjZSB7XFxuICAgIGZvbnQtZmFtaWx5OiAnRm9udEF3ZXNvbWUnO1xcbiAgICBzcmM6IHVybCgnZm9udHMvZm9udGF3ZXNvbWUtd2ViZm9udC5lb3Q/dj00LjIuMCcpO1xcbiAgICBzcmM6IHVybCgnZm9udHMvZm9udGF3ZXNvbWUtd2ViZm9udC5lb3Q/I2llZml4JnY9NC4yLjAnKSBmb3JtYXQoJ2VtYmVkZGVkLW9wZW50eXBlJyksIHVybCgnZm9udHMvZm9udGF3ZXNvbWUtd2ViZm9udC53b2ZmP3Y9NC4yLjAnKSBmb3JtYXQoJ3dvZmYnKSwgdXJsKCdmb250cy9mb250YXdlc29tZS13ZWJmb250LnR0Zj92PTQuMi4wJykgZm9ybWF0KCd0cnVldHlwZScpLCB1cmwoJ2ZvbnRzL2ZvbnRhd2Vzb21lLXdlYmZvbnQuc3ZnP3Y9NC4yLjAjZm9udGF3ZXNvbWVyZWd1bGFyJykgZm9ybWF0KCdzdmcnKTtcXG4gICAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcXG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xcbn1cXG4qL1xcblxcbi53eXNpd3lnLWNvbnRhaW5lciB7XFxuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xcbiAgICBjb2xvcjogYmxhY2s7XFxuICAgIGJhY2tncm91bmQ6IG5vbmUgd2hpdGU7XFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZGRkZGQ7XFxuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcXG59XFxuLnd5c2l3eWctdGV4dGFyZWEge1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIG1pbi1oZWlnaHQ6IDEuNWVtO1xcbiAgICAvKiBzaG91bGQgYmUgZXF1YWwgdG8gbGluZS1oZWlnaHQgKi9cXG4gICAgcGFkZGluZzogMDtcXG4gICAgcmVzaXplOiBub25lO1xcbn1cXG4ud3lzaXd5Zy13cmFwcGVyIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG4ud3lzaXd5Zy1lZGl0b3Ige1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIG1pbi1oZWlnaHQ6IDEuNWVtO1xcbiAgICAvKiBzaG91bGQgYmUgZXF1YWwgdG8gbGluZS1oZWlnaHQgKi9cXG4gICAgcGFkZGluZzogNHB4IDZweDtcXG4gICAgb3ZlcmZsb3c6IGF1dG87XFxuICAgIG91dGxpbmU6IG5vbmU7XFxuICAgIGNvbG9yOiAjMTQxODI0O1xcbiAgICAtbXMtd29yZC13cmFwOiBicmVhay13b3JkO1xcbiAgICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7XFxufVxcbi53eXNpd3lnLXRvb2xiYXIge1xcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgICBwYWRkaW5nOiAwO1xcbn1cXG4ud3lzaXd5Zy10b29sYmFyLXRvcCB7XFxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGRkZGRkO1xcbn1cXG4ud3lzaXd5Zy10b29sYmFyLWJvdHRvbSB7XFxuICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZGRkZGRkO1xcbn1cXG4ud3lzaXd5Zy10b29sYmFyIGEge1xcbiAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xcbn1cXG4ud3lzaXd5Zy1wbGFjZWhvbGRlciB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiA0cHg7XFxuICAgIC8qIHNhbWUgYXMgcGFkZGluZyBpbiAud3lzaXd5Zy1lZGl0b3IgKi9cXG4gICAgbGVmdDogNnB4O1xcbiAgICBvcGFjaXR5OiAwLjU0O1xcbiAgICAvKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kZS9kb2NzL1dlYi9DU1MvJTNBJTNBLW1vei1wbGFjZWhvbGRlciAqL1xcbn1cXG4ud3lzaXd5Zy1wb3B1cCB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgei1pbmRleDogOTk5OTtcXG4gICAgY29sb3I6IGJsYWNrO1xcbiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcbiAgICBsZWZ0OiAtNTAlO1xcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZGRkZGRkO1xcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XFxuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAgIC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTtcXG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gICAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcXG59XFxuLnd5c2l3eWctcG9wdXAud3lzaXd5Zy1wb3B1cGhvdmVyIHtcXG4gICAgbWFyZ2luLXRvcDogOXB4O1xcbiAgICAvKi1tb3otYm94LXNoYWRvdzogMCAzcHggMTBweCByZ2JhKDUwLDUwLDUwLDAuMyk7XFxuICAgIC13ZWJraXQtYm94LXNoYWRvdzogMCAzcHggMTBweCByZ2JhKDUwLDUwLDUwLDAuMyk7XFxuICAgIGJveC1zaGFkb3c6IDAgM3B4IDEwcHggcmdiYSg1MCw1MCw1MCwwLjMpOyovXFxufVxcbi53eXNpd3lnLXBvcHVwLnd5c2l3eWctcG9wdXBob3ZlcjphZnRlciB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgbGVmdDogNTAlO1xcbiAgICBib3R0b206IDEwMCU7XFxuICAgIGJvcmRlcjogc29saWQgdHJhbnNwYXJlbnQ7XFxuICAgIGNvbnRlbnQ6ICcnO1xcbiAgICB3aWR0aDogMDtcXG4gICAgaGVpZ2h0OiAwO1xcbiAgICBtYXJnaW4tbGVmdDogLThweDtcXG4gICAgYm9yZGVyLWxlZnQ6IDlweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gICAgYm9yZGVyLXJpZ2h0OiA5cHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICAgIGJvcmRlci1ib3R0b206IDhweCBzb2xpZCAjZGRkZGRkO1xcbn1cXG4ud3lzaXd5Zy10b29sYmFyLWljb24ge1xcbiAgICBkaXNwbGF5OiAtbW96LWlubGluZS1zdGFjaztcXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgICAqZGlzcGxheTogaW5saW5lO1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIGNvbG9yOiAjOTk5OTk5O1xcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICAgICp6b29tOiAxO1xcbiAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAgIC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTtcXG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gICAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gICAgLyp3aWR0aDogMTZweDtcXG4gICAgaGVpZ2h0OiAxNnB4OyovXFxuICAgIHBhZGRpbmc6IDhweCAxMnB4O1xcbiAgICBmb250OiAxNnB4IEZvbnRBd2Vzb21lO1xcbiAgICAtd2Via2l0LXRyYW5zaXRpb246IGNvbG9yIDAuMnMsIGJhY2tncm91bmQgMC4ycztcXG4gICAgdHJhbnNpdGlvbjogY29sb3IgMC4ycywgYmFja2dyb3VuZCAwLjJzO1xcbn1cXG4ud3lzaXd5Zy10b29sYmFyLWljb246aG92ZXIge1xcbiAgICBjb2xvcjogSGlnaGxpZ2h0VGV4dDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogSGlnaGxpZ2h0O1xcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICAgIC13ZWJraXQtdHJhbnNpdGlvbjogY29sb3IgMC4ycywgYmFja2dyb3VuZCAwLjJzO1xcbiAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjJzLCBiYWNrZ3JvdW5kIDAuMnM7XFxufVxcbi53eXNpd3lnLXRvb2xiYXItZm9ybSB7XFxuICAgIHBhZGRpbmc6IDEwcHg7XFxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxufVxcbi53eXNpd3lnLXRvb2xiYXItZm9ybSAud3lzaXd5Zy10b29sYmFyLWljb24ge1xcbiAgICBtYXJnaW4tbGVmdDogNXB4O1xcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XFxufVxcbi53eXNpd3lnLXRvb2xiYXItY29sb3Ige1xcbiAgICB3aWR0aDogMTJweDtcXG4gICAgaGVpZ2h0OiAxMnB4O1xcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbi53eXNpd3lnLWlucHV0IHtcXG4gICAgZGlzcGxheTogLW1vei1pbmxpbmUtc3RhY2s7XFxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gICAgKmRpc3BsYXk6IGlubGluZTtcXG4gICAgY29sb3I6ICMxNDE4MjQ7XFxuICAgIGJhY2tncm91bmQ6IG5vbmUgd2hpdGU7XFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZGRkZGQ7XFxuICAgIHdpZHRoOiAyMGVtO1xcbiAgICBoZWlnaHQ6IDIwcHg7XFxuICAgIHBhZGRpbmc6IDVweCA2cHg7XFxuICAgIC8qIDggLSBleHRyYWhlaWdodCgyKSAtIGJvcmRlcigxKSA9IDUgKi9cXG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xcbiAgICBvdXRsaW5lOiBub25lO1xcbn1cXG4ud3lzaXd5Zy1pbnB1dC53eXNpd3lnLWlucHV0dGV4dGFyZWEge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgaGVpZ2h0OiA1ZW07XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICAgIHJlc2l6ZTogbm9uZTtcXG59XFxuLnd5c2l3eWctaW5wdXQ6aG92ZXIsIC53eXNpd3lnLWlucHV0OmFjdGl2ZSwgLnd5c2l3eWctaW5wdXQ6Zm9jdXMge1xcbiAgICBib3JkZXItY29sb3I6ICNkZGRkZGQ7XFxufVxcbi53eXNpd3lnLWJyb3dzZSB7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgbGVmdDogMDtcXG4gICAgdG9wOiAwO1xcbiAgICBoZWlnaHQ6IDNlbTtcXG4gICAgLypsaW5lLWhlaWdodDogM2VtOyovXFxuICAgIGNvbG9yOiAjNjY2NjY2O1xcbiAgICBib3JkZXI6IDJweCBkYXNoZWQgI2RkZGRkZDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjVmNTtcXG4gICAgcGFkZGluZzogMTBweDtcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgICBmb250LXdlaWdodDogYm9sZDtcXG4gICAgbWFyZ2luLWJvdHRvbTogMTBweDtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4ud3lzaXd5Zy1icm93c2U6aG92ZXIsIC53eXNpd3lnLWJyb3dzZTphY3RpdmUsIC53eXNpd3lnLWJyb3dzZTpmb2N1cyB7XFxuICAgIGNvbG9yOiAjMTQxODI0O1xcbiAgICBib3JkZXItY29sb3I6ICNkZGRkZGQ7XFxufVxcbi53eXNpd3lnLWVtYmVkY29kZSB7XFxuICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXIhLi9+L3Bvc3Rjc3MtbG9hZGVyIS4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9saWIvd3lzaXd5Zy1lZGl0b3IuY3NzXG4gKiogbW9kdWxlIGlkID0gNDEwXG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi9XeXNpd3lnLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi9XeXNpd3lnLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuL1d5c2l3eWcuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9XeXNpd3lnLmNzc1xuICoqIG1vZHVsZSBpZCA9IDQxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLyogQ1NTIGZvciB0aGUgZm9udC1uYW1lICsgZm9udC1zaXplIHBsdWdpbiAqL1xcblxcbi53eXNpd3lnLXBsdWdpbi1saXN0IHtcXG4gICAgbWF4LWhlaWdodDogMTZlbTtcXG4gICAgb3ZlcmZsb3c6IGF1dG87XFxuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcXG4gICAgb3ZlcmZsb3cteTogc2Nyb2xsO1xcbn1cXG4ud3lzaXd5Zy1wbHVnaW4tbGlzdCBhLCAud3lzaXd5Zy1wbHVnaW4tbGlzdCBhOmxpbmssIC53eXNpd3lnLXBsdWdpbi1saXN0IGE6dmlzaXRlZCB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICBjb2xvcjogYmxhY2s7XFxuICAgIHBhZGRpbmc6IDVweCAxMHB4O1xcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuLnd5c2l3eWctcGx1Z2luLWxpc3QgYTpob3ZlciB7XFxuICAgIGNvbG9yOiBIaWdobGlnaHRUZXh0O1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBIaWdobGlnaHQ7XFxufVxcblxcbi8qIENTUyBmb3IgdGhlIHNtaWxleSBwbHVnaW4gKi9cXG5cXG4ud3lzaXd5Zy1wbHVnaW4tc21pbGllcyB7XFxuICAgIHBhZGRpbmc6IDEwcHg7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgd2hpdGUtc3BhY2U6IG5vcm1hbDtcXG59XFxuLnd5c2l3eWctcGx1Z2luLXNtaWxpZXMgaW1nIHtcXG4gICAgZGlzcGxheTogLW1vei1pbmxpbmUtc3RhY2s7XFxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gICAgKmRpc3BsYXk6IGlubGluZTtcXG4gICAgcGFkZGluZy1sZWZ0OiAycHg7XFxufVxcbi5mYWtlLWJvb3RzdHJhcC53eXNpd3lnLWNvbnRhaW5lci53eXNpd3lnLWFjdGl2ZSB7XFxuICAgIGJvcmRlci1jb2xvcjogIzY2YWZlOTtcXG4gICAgYm94LXNoYWRvdzogMCAxcHggMXB4IHJnYmEoMCwgMCwgMCwgMC4wNzUpIGluc2V0LCAwIDAgOHB4IHJnYmEoMTAyLCAxNzUsIDIzMywgMC42KTtcXG59XFxuLmZha2UtdWlraXQud3lzaXd5Zy1jb250YWluZXIud3lzaXd5Zy1hY3RpdmUge1xcbiAgICBib3JkZXItY29sb3I6ICM5OWJhY2EgIWltcG9ydGFudDtcXG4gICAgYmFja2dyb3VuZDogI2Y1ZmJmZSAhaW1wb3J0YW50O1xcbn1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyIS4vfi9wb3N0Y3NzLWxvYWRlciEuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvV3lzaXd5Zy5jc3NcbiAqKiBtb2R1bGUgaWQgPSA0MTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCIoZnVuY3Rpb24oZmFjdG9yeSkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB3aW5kb3cud3lzaXd5ZyA9IGZhY3Rvcnkod2luZG93LCBkb2N1bWVudCk7XG59KShmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50KXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzk3OTYyL2RlYm91bmNlLWNsaWNrcy13aGVuLXN1Ym1pdHRpbmctYS13ZWItZm9ybVxuICAgIHZhciBkZWJvdW5jZSA9IGZ1bmN0aW9uKCBjYWxsYmFjaywgd2FpdCwgY2FuY2VscHJldmlvdXMgKVxuICAgIHtcbiAgICAgICAgdmFyIHRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKCB0aW1lb3V0IClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiggISBjYW5jZWxwcmV2aW91cyApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KCB0aW1lb3V0ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseSggY29udGV4dCwgYXJncyApO1xuICAgICAgICAgICAgICAgIH0sIHdhaXQgKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjk0OTU5MC9ob3ctdG8tZGV0YWNoLWV2ZW50LWluLWllLTYtNy04LTktdXNpbmctamF2YXNjcmlwdFxuICAgIHZhciBhZGRFdmVudCA9IGZ1bmN0aW9uKCBlbGVtZW50LCB0eXBlLCBoYW5kbGVyLCB1c2VDYXB0dXJlIClcbiAgICB7XG4gICAgICAgIGlmKCBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgKSB7XG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGhhbmRsZXIsIHVzZUNhcHR1cmUgPyB0cnVlIDogZmFsc2UgKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKCBlbGVtZW50LmF0dGFjaEV2ZW50ICkge1xuICAgICAgICAgICAgZWxlbWVudC5hdHRhY2hFdmVudCggJ29uJyArIHR5cGUsIGhhbmRsZXIgKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKCBlbGVtZW50ICE9IHdpbmRvdyApXG4gICAgICAgICAgICBlbGVtZW50WydvbicgKyB0eXBlXSA9IGhhbmRsZXI7XG4gICAgfTtcbiAgICB2YXIgcmVtb3ZlRXZlbnQgPSBmdW5jdGlvbiggZWxlbWVudCwgdHlwZSwgaGFuZGxlciwgdXNlQ2FwdHVyZSApXG4gICAge1xuICAgICAgICBpZiggZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyICkge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBoYW5kbGVyLCB1c2VDYXB0dXJlID8gdHJ1ZSA6IGZhbHNlICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiggZWxlbWVudC5kZXRhY2hFdmVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5kZXRhY2hFdmVudCggJ29uJyArIHR5cGUsIGhhbmRsZXIgKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKCBlbGVtZW50ICE9IHdpbmRvdyApXG4gICAgICAgICAgICBlbGVtZW50WydvbicgKyB0eXBlXSA9IG51bGw7XG4gICAgfTtcbiAgICAvLyBodHRwOi8vd3d3LmNyaXN0aW5hd2l0aG91dC5jb20vY29udGVudC9mdW5jdGlvbi10cmlnZ2VyLWV2ZW50cy1qYXZhc2NyaXB0XG4gICAgdmFyIGZpcmVFdmVudCA9IGZ1bmN0aW9uKCBlbGVtZW50LCB0eXBlLCBidWJibGVzLCBjYW5jZWxhYmxlIClcbiAgICB7XG4gICAgICAgIGlmKCBkb2N1bWVudC5jcmVhdGVFdmVudCApIHtcbiAgICAgICAgICAgIHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgZXZlbnQuaW5pdEV2ZW50KCB0eXBlLCBidWJibGVzICE9PSB1bmRlZmluZWQgPyBidWJibGVzIDogdHJ1ZSwgY2FuY2VsYWJsZSAhPT0gdW5kZWZpbmVkID8gY2FuY2VsYWJsZSA6IGZhbHNlICk7XG4gICAgICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoIGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0ICkgeyAvL0lFXG4gICAgICAgICAgICB2YXIgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudE9iamVjdCgpO1xuICAgICAgICAgICAgZWxlbWVudC5maXJlRXZlbnQoICdvbicgKyB0eXBlLCBldmVudCApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoIHR5cGVvZihlbGVtZW50WydvbicgKyB0eXBlXSkgPT0gJ2Z1bmN0aW9uJyApXG4gICAgICAgICAgICBlbGVtZW50WydvbicgKyB0eXBlXSgpO1xuICAgIH07XG4gICAgLy8gcHJldmVudCBkZWZhdWx0XG4gICAgdmFyIGNhbmNlbEV2ZW50ID0gZnVuY3Rpb24oIGUgKVxuICAgIHtcbiAgICAgICAgaWYoIGUucHJldmVudERlZmF1bHQgKVxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIGlmKCBlLnN0b3BQcm9wYWdhdGlvbiApXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBlLmNhbmNlbEJ1YmJsZSA9IHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMzM3Nzg4Ny9qYXZhc2NyaXB0LW5vZGUtdW5kZWZpbmVkLWluLWllOC1hbmQtdW5kZXJcbiAgICB2YXIgTm9kZV9FTEVNRU5UX05PREUgPSB0eXBlb2YoTm9kZSkgIT0gJ3VuZGVmaW5lZCcgPyBOb2RlLkVMRU1FTlRfTk9ERSA6IDE7XG4gICAgdmFyIE5vZGVfVEVYVF9OT0RFID0gdHlwZW9mKE5vZGUpICE9ICd1bmRlZmluZWQnID8gTm9kZS5URVhUX05PREUgOiAzO1xuXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMjM0OTc5L2hvdy10by1jaGVjay1pbi1qYXZhc2NyaXB0LWlmLW9uZS1lbGVtZW50LWlzLWEtY2hpbGQtb2YtYW5vdGhlclxuICAgIHZhciBpc09yQ29udGFpbnNOb2RlID0gZnVuY3Rpb24oIGFuY2VzdG9yLCBkZXNjZW5kYW50IClcbiAgICB7XG4gICAgICAgIHZhciBub2RlID0gZGVzY2VuZGFudDtcbiAgICAgICAgd2hpbGUoIG5vZGUgKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiggbm9kZSA9PT0gYW5jZXN0b3IgKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjY3OTUxL2hvdy10by1nZXQtbm9kZXMtbHlpbmctaW5zaWRlLWEtcmFuZ2Utd2l0aC1qYXZhc2NyaXB0XG4gICAgdmFyIG5leHROb2RlID0gZnVuY3Rpb24oIG5vZGUsIGNvbnRhaW5lciApXG4gICAge1xuICAgICAgICBpZiggbm9kZS5maXJzdENoaWxkIClcbiAgICAgICAgICAgIHJldHVybiBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIHdoaWxlKCBub2RlIClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYoIG5vZGUgPT0gY29udGFpbmVyICkgLy8gZG8gbm90IHdhbGsgb3V0IG9mIHRoZSBjb250YWluZXJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGlmKCBub2RlLm5leHRTaWJsaW5nIClcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5uZXh0U2libGluZztcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIC8vIHNhdmUvcmVzdG9yZSBzZWxlY3Rpb25cbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEzOTQ5MDU5L3BlcnNpc3RpbmctdGhlLWNoYW5nZXMtb2YtcmFuZ2Utb2JqZWN0cy1hZnRlci1zZWxlY3Rpb24taW4taHRtbC8xMzk1MDM3NiMxMzk1MDM3NlxuICAgIHZhciBzYXZlU2VsZWN0aW9uID0gZnVuY3Rpb24oIGNvbnRhaW5lck5vZGUgKVxuICAgIHtcbiAgICAgICAgaWYoIHdpbmRvdy5nZXRTZWxlY3Rpb24gKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICAgICAgaWYoIHNlbC5yYW5nZUNvdW50ID4gMCApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbC5nZXRSYW5nZUF0KDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoIGRvY3VtZW50LnNlbGVjdGlvbiApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb247XG4gICAgICAgICAgICByZXR1cm4gc2VsLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICB2YXIgcmVzdG9yZVNlbGVjdGlvbiA9IGZ1bmN0aW9uKCBjb250YWluZXJOb2RlLCBzYXZlZFNlbCApXG4gICAge1xuICAgICAgICBpZiggISBzYXZlZFNlbCApXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmKCB3aW5kb3cuZ2V0U2VsZWN0aW9uIClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgICAgIHNlbC5hZGRSYW5nZShzYXZlZFNlbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiggZG9jdW1lbnQuc2VsZWN0aW9uIClcbiAgICAgICAge1xuICAgICAgICAgICAgc2F2ZWRTZWwuc2VsZWN0KCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjYwMzM5Ny9jYWxjdWxhdGUtd2lkdGgtaGVpZ2h0LW9mLXRoZS1zZWxlY3RlZC10ZXh0LWphdmFzY3JpcHRcbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY4NDYyMzAvY29vcmRpbmF0ZXMtb2Ytc2VsZWN0ZWQtdGV4dC1pbi1icm93c2VyLXBhZ2VcbiAgICB2YXIgZ2V0U2VsZWN0aW9uUmVjdCA9IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIGlmKCB3aW5kb3cuZ2V0U2VsZWN0aW9uIClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIGlmKCAhIHNlbC5yYW5nZUNvdW50IClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB2YXIgcmFuZ2UgPSBzZWwuZ2V0UmFuZ2VBdCgwKS5jbG9uZVJhbmdlKCk7XG4gICAgICAgICAgICBpZiggcmFuZ2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0ICkgLy8gTWlzc2luZyBmb3IgRmlyZWZveCAzLjUrMy42XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHJlY3QgPSByYW5nZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICAvLyBTYWZhcmkgNS4xIHJldHVybnMgbnVsbCwgSUU5IHJldHVybnMgMC8wLzAvMCBpZiBpbWFnZSBzZWxlY3RlZFxuICAgICAgICAgICAgICAgIGlmKCByZWN0ICYmIHJlY3QubGVmdCAmJiByZWN0LnRvcCAmJiByZWN0LnJpZ2h0ICYmIHJlY3QuYm90dG9tIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1vZGVybiBicm93c2VycyByZXR1cm4gZmxvYXRpbmctcG9pbnQgbnVtYmVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogcGFyc2VJbnQocmVjdC5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogcGFyc2VJbnQocmVjdC50b3ApLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHBhcnNlSW50KHJlY3QucmlnaHQgLSByZWN0LmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBwYXJzZUludChyZWN0LmJvdHRvbSAtIHJlY3QudG9wKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIC8vIG9uIFdlYmtpdCAncmFuZ2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCknIHNvbWV0aW1lcyByZXR1cm4gMC8wLzAvMCAtIGJ1dCAncmFuZ2UuZ2V0Q2xpZW50UmVjdHMoKScgd29ya3NcbiAgICAgICAgICAgICAgICB2YXIgcmVjdHMgPSByYW5nZS5nZXRDbGllbnRSZWN0cyA/IHJhbmdlLmdldENsaWVudFJlY3RzKCkgOiBbXTtcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBpPTA7IGkgPCByZWN0cy5sZW5ndGg7ICsraSApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVjdCA9IHJlY3RzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiggcmVjdC5sZWZ0ICYmIHJlY3QudG9wICYmIHJlY3QucmlnaHQgJiYgcmVjdC5ib3R0b20gKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNb2Rlcm4gYnJvd3NlcnMgcmV0dXJuIGZsb2F0aW5nLXBvaW50IG51bWJlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBwYXJzZUludChyZWN0LmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogcGFyc2VJbnQocmVjdC50b3ApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBwYXJzZUludChyZWN0LnJpZ2h0IC0gcmVjdC5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHBhcnNlSW50KHJlY3QuYm90dG9tIC0gcmVjdC50b3ApXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAvLyBGYWxsIGJhY2sgdG8gaW5zZXJ0aW5nIGEgdGVtcG9yYXJ5IGVsZW1lbnQgKG9ubHkgZm9yIEZpcmVmb3ggMy41IGFuZCAzLjYpXG4gICAgICAgICAgICB2YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIGlmKCBzcGFuLmdldEJvdW5kaW5nQ2xpZW50UmVjdCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gRW5zdXJlIHNwYW4gaGFzIGRpbWVuc2lvbnMgYW5kIHBvc2l0aW9uIGJ5XG4gICAgICAgICAgICAgICAgLy8gYWRkaW5nIGEgemVyby13aWR0aCBzcGFjZSBjaGFyYWN0ZXJcbiAgICAgICAgICAgICAgICBzcGFuLmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnXFx1MjAwYicpICk7XG4gICAgICAgICAgICAgICAgcmFuZ2UuaW5zZXJ0Tm9kZSggc3BhbiApO1xuICAgICAgICAgICAgICAgIHZhciByZWN0ID0gc3Bhbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICB2YXIgc3BhblBhcmVudCA9IHNwYW4ucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBzcGFuUGFyZW50LnJlbW92ZUNoaWxkKCBzcGFuICk7XG4gICAgICAgICAgICAgICAgLy8gR2x1ZSBhbnkgYnJva2VuIHRleHQgbm9kZXMgYmFjayB0b2dldGhlclxuICAgICAgICAgICAgICAgIHNwYW5QYXJlbnQubm9ybWFsaXplKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogcGFyc2VJbnQocmVjdC5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBwYXJzZUludChyZWN0LnRvcCksXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBwYXJzZUludChyZWN0LnJpZ2h0IC0gcmVjdC5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBwYXJzZUludChyZWN0LmJvdHRvbSAtIHJlY3QudG9wKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAqL1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoIGRvY3VtZW50LnNlbGVjdGlvbiApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb247XG4gICAgICAgICAgICBpZiggc2VsLnR5cGUgIT0gJ0NvbnRyb2wnIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgcmFuZ2UgPSBzZWwuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICAvLyBJRTggcmV0dXJuIDAvMC8wLzAgaWYgY2FyZXQgcmlnaHQgYmVmb3JlIG5ld2xpbmVcbiAgICAgICAgICAgICAgICBpZiggcmFuZ2UuYm91bmRpbmdMZWZ0IHx8IHJhbmdlLmJvdW5kaW5nVG9wIHx8IHJhbmdlLmJvdW5kaW5nV2lkdGggfHwgcmFuZ2UuYm91bmRpbmdIZWlnaHQgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogcmFuZ2UuYm91bmRpbmdMZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiByYW5nZS5ib3VuZGluZ1RvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiByYW5nZS5ib3VuZGluZ1dpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiByYW5nZS5ib3VuZGluZ0hlaWdodFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgdmFyIGdldFNlbGVjdGlvbkNvbGxhcHNlZCA9IGZ1bmN0aW9uKCBjb250YWluZXJOb2RlIClcbiAgICB7XG4gICAgICAgIGlmKCB3aW5kb3cuZ2V0U2VsZWN0aW9uIClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIGlmKCBzZWwuaXNDb2xsYXBzZWQgKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoIGRvY3VtZW50LnNlbGVjdGlvbiApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb247XG4gICAgICAgICAgICBpZiggc2VsLnR5cGUgPT0gJ1RleHQnIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgcmFuZ2UgPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICB2YXIgdGV4dHJhbmdlID0gZG9jdW1lbnQuYm9keS5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgICAgICAgICB0ZXh0cmFuZ2UubW92ZVRvRWxlbWVudFRleHQoY29udGFpbmVyTm9kZSk7XG4gICAgICAgICAgICAgICAgdGV4dHJhbmdlLnNldEVuZFBvaW50KCdFbmRUb1N0YXJ0JywgcmFuZ2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiByYW5nZS5odG1sVGV4dC5sZW5ndGggPT0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCBzZWwudHlwZSA9PSAnQ29udHJvbCcgKSAvLyBlLmcuIGFuIGltYWdlIHNlbGVjdGVkXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgLy8gc2VsLnR5cGUgPT0gJ05vbmUnIC0+IGNvbGxhcHNlZCBzZWxlY3Rpb25cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83NzgxOTYzL2pzLWdldC1hcnJheS1vZi1hbGwtc2VsZWN0ZWQtbm9kZXMtaW4tY29udGVudGVkaXRhYmxlLWRpdlxuICAgIHZhciBnZXRTZWxlY3RlZE5vZGVzID0gZnVuY3Rpb24oIGNvbnRhaW5lck5vZGUgKVxuICAgIHtcbiAgICAgICAgaWYoIHdpbmRvdy5nZXRTZWxlY3Rpb24gKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICAgICAgaWYoICEgc2VsLnJhbmdlQ291bnQgKVxuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICAgICAgZm9yKCB2YXIgaT0wOyBpIDwgc2VsLnJhbmdlQ291bnQ7ICsraSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHJhbmdlID0gc2VsLmdldFJhbmdlQXQoaSksXG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSByYW5nZS5zdGFydENvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAgICAgZW5kTm9kZSA9IHJhbmdlLmVuZENvbnRhaW5lcjtcbiAgICAgICAgICAgICAgICB3aGlsZSggbm9kZSApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgdGhpcyBub2RlP1xuICAgICAgICAgICAgICAgICAgICBpZiggbm9kZSAhPSBjb250YWluZXJOb2RlIClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGVfaW5zaWRlX3NlbGVjdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHNlbC5jb250YWluc05vZGUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVfaW5zaWRlX3NlbGVjdGlvbiA9IHNlbC5jb250YWluc05vZGUoIG5vZGUsIHRydWUgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgLy8gSUUxMVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTg4NDIxMC9ob3ctdG8tZmluZC1pZi1hLWh0bWxlbGVtZW50LWlzLWVuY2xvc2VkLWluLXNlbGVjdGVkLXRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZXJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlcmFuZ2Uuc2VsZWN0Tm9kZUNvbnRlbnRzKCBub2RlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKCB2YXIgaT0wOyBpIDwgc2VsLnJhbmdlQ291bnQ7ICsraSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmFuZ2UgPSBzZWwuZ2V0UmFuZ2VBdChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3RhcnQgYWZ0ZXIgb3IgZW5kIGJlZm9yZSAtPiBza2lwIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHJhbmdlLmNvbXBhcmVCb3VuZGFyeVBvaW50cyhyYW5nZS5FTkRfVE9fU1RBUlQsbm9kZXJhbmdlKSA+PSAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYW5nZS5jb21wYXJlQm91bmRhcnlQb2ludHMocmFuZ2UuU1RBUlRfVE9fRU5ELG5vZGVyYW5nZSkgPD0gMCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVfaW5zaWRlX3NlbGVjdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBub2RlX2luc2lkZV9zZWxlY3Rpb24gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVzLnB1c2goIG5vZGUgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBub2RlID0gbmV4dE5vZGUoIG5vZGUsIG5vZGUgPT0gZW5kTm9kZSA/IGVuZE5vZGUgOiBjb250YWluZXJOb2RlICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRmFsbGJhY2tcbiAgICAgICAgICAgIGlmKCBub2Rlcy5sZW5ndGggPT0gMCAmJiBpc09yQ29udGFpbnNOb2RlKGNvbnRhaW5lck5vZGUsc2VsLmZvY3VzTm9kZSkgJiYgc2VsLmZvY3VzTm9kZSAhPSBjb250YWluZXJOb2RlIClcbiAgICAgICAgICAgICAgICBub2Rlcy5wdXNoKCBzZWwuZm9jdXNOb2RlICk7XG4gICAgICAgICAgICByZXR1cm4gbm9kZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiggZG9jdW1lbnQuc2VsZWN0aW9uIClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbjtcbiAgICAgICAgICAgIGlmKCBzZWwudHlwZSA9PSAnVGV4dCcgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciByYW5nZXMgPSBzZWwuY3JlYXRlUmFuZ2VDb2xsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgZm9yKCB2YXIgaT0wOyBpIDwgcmFuZ2VzLmxlbmd0aDsgKytpIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByYW5nZSA9IHJhbmdlc1tpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSByYW5nZS5wYXJlbnRFbGVtZW50KCksXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlID0gcGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUoIG5vZGUgKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBObyBjbHVlIGhvdyB0byBkZXRlY3Qgd2hldGhlciBhIFRleHROb2RlIGlzIHdpdGhpbiB0aGUgc2VsZWN0aW9uLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFbGVtZW50Tm9kZSBpcyBlYXN5OiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU4ODQyMTAvaG93LXRvLWZpbmQtaWYtYS1odG1sZWxlbWVudC1pcy1lbmNsb3NlZC1pbi1zZWxlY3RlZC10ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZXJhbmdlID0gcmFuZ2UuZHVwbGljYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlcmFuZ2UubW92ZVRvRWxlbWVudFRleHQoIG5vZGUubm9kZVR5cGUgIT0gTm9kZV9FTEVNRU5UX05PREUgPyBub2RlLnBhcmVudE5vZGUgOiBub2RlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzdGFydCBhZnRlciBvciBlbmQgYmVmb3JlIC0+IHNraXAgbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIG5vZGVyYW5nZS5jb21wYXJlRW5kUG9pbnRzKCdFbmRUb1N0YXJ0JyxyYW5nZSkgPj0gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVyYW5nZS5jb21wYXJlRW5kUG9pbnRzKCdTdGFydFRvRW5kJyxyYW5nZSkgPD0gMCApXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm8gXCJBcnJheS5pbmRleE9mKClcIiBpbiBJRThcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5fYXJyYXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IoIHZhciBqPTA7IGogPCBub2Rlcy5sZW5ndGg7ICsraiApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggbm9kZXNbal0gIT09IG5vZGUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluX2FycmF5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCAhIGluX2FycmF5IClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXMucHVzaCggbm9kZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9IG5leHROb2RlKCBub2RlLCBwYXJlbnROb2RlICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gRmFsbGJhY2tcbiAgICAgICAgICAgICAgICBpZiggbm9kZXMubGVuZ3RoID09IDAgJiYgaXNPckNvbnRhaW5zTm9kZShjb250YWluZXJOb2RlLGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT0gY29udGFpbmVyTm9kZSApXG4gICAgICAgICAgICAgICAgICAgIG5vZGVzLnB1c2goIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiggc2VsLnR5cGUgPT0gJ0NvbnRyb2wnICkgLy8gZS5nLiBhbiBpbWFnZSBzZWxlY3RlZFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9oaDgyNjAyMSUyOHY9dnMuODUlMjkuYXNweFxuICAgICAgICAgICAgICAgIHZhciByYW5nZSA9IHNlbC5jcmVhdGVSYW5nZSgpO1xuICAgICAgICAgICAgICAgIGZvciggdmFyIGk9MDsgaSA8IHJhbmdlLmxlbmd0aDsgKytpIClcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMucHVzaCggcmFuZ2UoaSkgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH07XG5cbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzg1MTMzNjgvY29sbGFwc2Utc2VsZWN0aW9uLXRvLXN0YXJ0LW9mLXNlbGVjdGlvbi1ub3QtZGl2XG4gICAgdmFyIGNvbGxhcHNlU2VsZWN0aW9uRW5kID0gZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgaWYoIHdpbmRvdy5nZXRTZWxlY3Rpb24gKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICAgICAgaWYoICEgc2VsLmlzQ29sbGFwc2VkIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBGb3JtLXN1Ym1pdHMgdmlhIEVudGVyIHRocm93ICdOU19FUlJPUl9GQUlMVVJFJyBvbiBGaXJlZm94IDM0XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsLmNvbGxhcHNlVG9FbmQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2goIGUgKSB7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoIGRvY3VtZW50LnNlbGVjdGlvbiApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb247XG4gICAgICAgICAgICBpZiggc2VsLnR5cGUgIT0gJ0NvbnRyb2wnIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgcmFuZ2UgPSBzZWwuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICByYW5nZS5jb2xsYXBzZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmFuZ2Uuc2VsZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNTE1NzQzNS9nZXQtbGFzdC1jaGFyYWN0ZXItYmVmb3JlLWNhcmV0LXBvc2l0aW9uLWluLWphdmFzY3JpcHRcbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzExMjQ3NzM3L2hvdy1jYW4taS1nZXQtdGhlLXdvcmQtdGhhdC10aGUtY2FyZXQtaXMtdXBvbi1pbnNpZGUtYS1jb250ZW50ZWRpdGFibGUtZGl2XG4gICAgdmFyIGV4cGFuZFNlbGVjdGlvbkNhcmV0ID0gZnVuY3Rpb24oIGNvbnRhaW5lck5vZGUsIHByZWNlZGluZywgZm9sbG93aW5nIClcbiAgICB7XG4gICAgICAgIGlmKCB3aW5kb3cuZ2V0U2VsZWN0aW9uIClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIGlmKCBzZWwubW9kaWZ5IClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBpPTA7IGkgPCBwcmVjZWRpbmc7ICsraSApXG4gICAgICAgICAgICAgICAgICAgIHNlbC5tb2RpZnkoJ2V4dGVuZCcsICdiYWNrd2FyZCcsICdjaGFyYWN0ZXInKTtcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBpPTA7IGkgPCBmb2xsb3dpbmc7ICsraSApXG4gICAgICAgICAgICAgICAgICAgIHNlbC5tb2RpZnkoJ2V4dGVuZCcsICdmb3J3YXJkJywgJ2NoYXJhY3RlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIG5vdCBzbyBlYXN5IGlmIHRoZSBzdGVwcyB3b3VsZCBjb3ZlciBtdWx0aXBsZSBub2RlcyAuLi5cbiAgICAgICAgICAgICAgICB2YXIgcmFuZ2UgPSBzZWwuZ2V0UmFuZ2VBdCgwKTtcbiAgICAgICAgICAgICAgICByYW5nZS5zZXRTdGFydCggcmFuZ2Uuc3RhcnRDb250YWluZXIsIHJhbmdlLnN0YXJ0T2Zmc2V0IC0gcHJlY2VkaW5nICk7XG4gICAgICAgICAgICAgICAgcmFuZ2Uuc2V0RW5kKCByYW5nZS5lbmRDb250YWluZXIsIHJhbmdlLmVuZE9mZnNldCArIGZvbGxvd2luZyApO1xuICAgICAgICAgICAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgICAgICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoIGRvY3VtZW50LnNlbGVjdGlvbiApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb247XG4gICAgICAgICAgICBpZiggc2VsLnR5cGUgIT0gJ0NvbnRyb2wnIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgcmFuZ2UgPSBzZWwuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICByYW5nZS5jb2xsYXBzZSh0cnVlKTtcbiAgICAgICAgICAgICAgICByYW5nZS5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIC1wcmVjZWRpbmcpO1xuICAgICAgICAgICAgICAgIHJhbmdlLm1vdmVFbmQoJ2NoYXJhY3RlcicsIGZvbGxvd2luZyk7XG4gICAgICAgICAgICAgICAgcmFuZ2Uuc2VsZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NjUyNzM0L3JldHVybi1odG1sLWZyb20tYS11c2VyLXNlbGVjdGVkLXRleHQvNDY1MjgyNCM0NjUyODI0XG4gICAgdmFyIGdldFNlbGVjdGlvbkh0bWwgPSBmdW5jdGlvbiggY29udGFpbmVyTm9kZSApXG4gICAge1xuICAgICAgICBpZiggZ2V0U2VsZWN0aW9uQ29sbGFwc2VkKCBjb250YWluZXJOb2RlICkgKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGlmKCB3aW5kb3cuZ2V0U2VsZWN0aW9uIClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIGlmKCBzZWwucmFuZ2VDb3VudCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgICAgICAgICBsZW4gPSBzZWwucmFuZ2VDb3VudDtcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBpPTA7IGkgPCBsZW47ICsraSApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudHMgPSBzZWwuZ2V0UmFuZ2VBdChpKS5jbG9uZUNvbnRlbnRzKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuaW5uZXJIVE1MO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoIGRvY3VtZW50LnNlbGVjdGlvbiApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb247XG4gICAgICAgICAgICBpZiggc2VsLnR5cGUgPT0gJ1RleHQnIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgcmFuZ2UgPSBzZWwuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFuZ2UuaHRtbFRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIHZhciBzZWxlY3Rpb25JbnNpZGUgPSBmdW5jdGlvbiggY29udGFpbmVyTm9kZSwgZm9yY2UgKVxuICAgIHtcbiAgICAgICAgLy8gc2VsZWN0aW9uIGluc2lkZSBlZGl0b3I/XG4gICAgICAgIGlmKCB3aW5kb3cuZ2V0U2VsZWN0aW9uIClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIGlmKCBpc09yQ29udGFpbnNOb2RlKGNvbnRhaW5lck5vZGUsc2VsLmFuY2hvck5vZGUpICYmIGlzT3JDb250YWluc05vZGUoY29udGFpbmVyTm9kZSxzZWwuZm9jdXNOb2RlKSApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAvLyBzZWxlY3Rpb24gYXQgbGVhc3QgcGFydGx5IG91dHNpZGUgZWRpdG9yXG4gICAgICAgICAgICBpZiggISBmb3JjZSApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgLy8gZm9yY2Ugc2VsZWN0aW9uIHRvIGVkaXRvclxuICAgICAgICAgICAgdmFyIHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyggY29udGFpbmVyTm9kZSApO1xuICAgICAgICAgICAgcmFuZ2UuY29sbGFwc2UoIGZhbHNlICk7XG4gICAgICAgICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICAgICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoIGRvY3VtZW50LnNlbGVjdGlvbiApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb247XG4gICAgICAgICAgICBpZiggc2VsLnR5cGUgPT0gJ0NvbnRyb2wnICkgLy8gZS5nLiBhbiBpbWFnZSBzZWxlY3RlZFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9oaDgyNjAyMSUyOHY9dnMuODUlMjkuYXNweFxuICAgICAgICAgICAgICAgIHZhciByYW5nZSA9IHNlbC5jcmVhdGVSYW5nZSgpO1xuICAgICAgICAgICAgICAgIGlmKCByYW5nZS5sZW5ndGggIT0gMCAmJiBpc09yQ29udGFpbnNOb2RlKGNvbnRhaW5lck5vZGUscmFuZ2UoMCkpICkgLy8gdGVzdCBvbmx5IHRoZSBmaXJzdCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSAvL2lmKCBzZWwudHlwZSA9PSAnVGV4dCcgfHwgc2VsLnR5cGUgPT0gJ05vbmUnIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBSYW5nZSBvZiBjb250YWluZXJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEyMjQzODk4L2hvdy10by1zZWxlY3QtYWxsLXRleHQtaW4tY29udGVudGVkaXRhYmxlLWRpdlxuICAgICAgICAgICAgICAgIHZhciByYW5nZUNvbnRhaW5lciA9IGRvY3VtZW50LmJvZHkuY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICAgICAgICAgICAgcmFuZ2VDb250YWluZXIubW92ZVRvRWxlbWVudFRleHQoY29udGFpbmVyTm9kZSk7XG4gICAgICAgICAgICAgICAgLy8gQ29tcGFyZSB3aXRoIHNlbGVjdGlvbiByYW5nZVxuICAgICAgICAgICAgICAgIHZhciByYW5nZSA9IHNlbC5jcmVhdGVSYW5nZSgpO1xuICAgICAgICAgICAgICAgIGlmKCByYW5nZUNvbnRhaW5lci5pblJhbmdlKHJhbmdlKSApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2VsZWN0aW9uIGF0IGxlYXN0IHBhcnRseSBvdXRzaWRlIGVkaXRvclxuICAgICAgICAgICAgaWYoICEgZm9yY2UgKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIC8vIGZvcmNlIHNlbGVjdGlvbiB0byBlZGl0b3JcbiAgICAgICAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTIyNDM4OTgvaG93LXRvLXNlbGVjdC1hbGwtdGV4dC1pbi1jb250ZW50ZWRpdGFibGUtZGl2XG4gICAgICAgICAgICB2YXIgcmFuZ2UgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgICAgICAgcmFuZ2UubW92ZVRvRWxlbWVudFRleHQoY29udGFpbmVyTm9kZSk7XG4gICAgICAgICAgICByYW5nZS5zZXRFbmRQb2ludCgnU3RhcnRUb0VuZCcscmFuZ2UpOyAvLyBjb2xsYXBzZVxuICAgICAgICAgICAgcmFuZ2Uuc2VsZWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIC8qXG4gICAgdmFyIGNsaXBTZWxlY3Rpb25UbyA9IGZ1bmN0aW9uKCBjb250YWluZXJOb2RlIClcbiAgICB7XG4gICAgICAgIGlmKCB3aW5kb3cuZ2V0U2VsZWN0aW9uICYmIGNvbnRhaW5lck5vZGUuY29tcGFyZURvY3VtZW50UG9zaXRpb24gKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICAgICAgdmFyIGxlZnRfbm9kZSA9IHNlbC5hbmNob3JOb2RlLFxuICAgICAgICAgICAgICAgIGxlZnRfb2Zmc2V0ID0gc2VsLmFuY2hvck9mZnNldCxcbiAgICAgICAgICAgICAgICByaWdodF9ub2RlID0gc2VsLmZvY3VzTm9kZSxcbiAgICAgICAgICAgICAgICByaWdodF9vZmZzZXQgPSBzZWwuZm9jdXNPZmZzZXQ7XG4gICAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNzEwNzMzL2RvbS1kZXRlcm1pbmUtaWYtdGhlLWFuY2hvcm5vZGUtb3ItZm9jdXNub2RlLWlzLW9uLXRoZS1sZWZ0LXNpZGVcbiAgICAgICAgICAgIGlmKCAobGVmdF9ub2RlID09IHJpZ2h0X25vZGUgJiYgbGVmdF9vZmZzZXQgPiByaWdodF9vZmZzZXQpIHx8XG4gICAgICAgICAgICAgICAgKGxlZnRfbm9kZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihyaWdodF9ub2RlKSAmIE5vZGUuRE9DVU1FTlRfUE9TSVRJT05fUFJFQ0VESU5HKSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gUmlnaHQtdG8tbGVmdCBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgICBsZWZ0X25vZGUgPSBzZWwuZm9jdXNOb2RlO1xuICAgICAgICAgICAgICAgIGxlZnRfb2Zmc2V0ID0gc2VsLmZvY3VzT2Zmc2V0O1xuICAgICAgICAgICAgICAgIHJpZ2h0X25vZGUgPSBzZWwuYW5jaG9yTm9kZSxcbiAgICAgICAgICAgICAgICByaWdodF9vZmZzZXQgPSBzZWwuYW5jaG9yT2Zmc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU3BlZWQgdXA6IHNlbGVjdGlvbiBpbnNpZGUgZWRpdG9yXG4gICAgICAgICAgICB2YXIgbGVmdF9pbnNpZGUgPSBpc09yQ29udGFpbnNOb2RlKGNvbnRhaW5lck5vZGUsbGVmdF9ub2RlKSxcbiAgICAgICAgICAgICAgICByaWdodF9pbnNpZGUgPSBpc09yQ29udGFpbnNOb2RlKGNvbnRhaW5lck5vZGUscmlnaHRfbm9kZSk7XG4gICAgICAgICAgICBpZiggbGVmdF9pbnNpZGUgJiYgcmlnaHRfaW5zaWRlIClcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIC8vIFNlbGVjdGlvbiBiZWZvcmUvYWZ0ZXIgY29udGFpbmVyP1xuICAgICAgICAgICAgaWYoICEgbGVmdF9pbnNpZGUgJiYgY29udGFpbmVyTm9kZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihsZWZ0X25vZGUpICYgTm9kZS5ET0NVTUVOVF9QT1NJVElPTl9GT0xMT1dJTkcgKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gc2VsZWN0aW9uIGFmdGVyXG4gICAgICAgICAgICBpZiggISByaWdodF9pbnNpZGUgJiYgY29udGFpbmVyTm9kZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihyaWdodF9ub2RlKSAmIE5vZGUuRE9DVU1FTlRfUE9TSVRJT05fUFJFQ0VESU5HIClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIHNlbGVjdGlvbiBiZWZvcmVcbiAgICAgICAgICAgIC8vIFNlbGVjdGlvbiBwYXJ0bHkgYmVmb3JlL2FmdGVyIGNvbnRhaW5lclxuICAgICAgICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjI0Mzg5OC9ob3ctdG8tc2VsZWN0LWFsbC10ZXh0LWluLWNvbnRlbnRlZGl0YWJsZS1kaXZcbiAgICAgICAgICAgIHZhciByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgICAgICByYW5nZS5zZWxlY3ROb2RlQ29udGVudHMoIGNvbnRhaW5lck5vZGUgKTtcbiAgICAgICAgICAgIGlmKCBsZWZ0X2luc2lkZSApXG4gICAgICAgICAgICAgICAgcmFuZ2Uuc2V0U3RhcnQoIGxlZnRfbm9kZSwgbGVmdF9vZmZzZXQgKTtcbiAgICAgICAgICAgIGlmKCByaWdodF9pbnNpZGUgKVxuICAgICAgICAgICAgICAgIHJhbmdlLnNldEVuZCggcmlnaHRfbm9kZSwgcmlnaHRfb2Zmc2V0ICk7XG4gICAgICAgICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICAgICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiggZG9jdW1lbnQuc2VsZWN0aW9uIClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbjtcbiAgICAgICAgICAgIGlmKCBzZWwudHlwZSA9PSAnVGV4dCcgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIFJhbmdlIG9mIGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTIyNDM4OTgvaG93LXRvLXNlbGVjdC1hbGwtdGV4dC1pbi1jb250ZW50ZWRpdGFibGUtZGl2XG4gICAgICAgICAgICAgICAgdmFyIHJhbmdlQ29udGFpbmVyID0gZG9jdW1lbnQuYm9keS5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgICAgICAgICByYW5nZUNvbnRhaW5lci5tb3ZlVG9FbGVtZW50VGV4dChjb250YWluZXJOb2RlKTtcbiAgICAgICAgICAgICAgICAvLyBDb21wYXJlIHdpdGggc2VsZWN0aW9uIHJhbmdlXG4gICAgICAgICAgICAgICAgdmFyIHJhbmdlID0gc2VsLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgICAgICAgICAgaWYoIHJhbmdlQ29udGFpbmVyLmluUmFuZ2UocmFuZ2UpIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0aW9uIGJlZm9yZS9hZnRlciBjb250YWluZXI/XG4gICAgICAgICAgICAgICAgaWYoIHJhbmdlQ29udGFpbmVyLmNvbXBhcmVFbmRQb2ludHMoJ1N0YXJ0VG9FbmQnLHJhbmdlKSA+IDAgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYoIHJhbmdlQ29udGFpbmVyLmNvbXBhcmVFbmRQb2ludHMoJ0VuZFRvU3RhcnQnLHJhbmdlKSA8IDAgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0aW9uIHBhcnRseSBiZWZvcmUvYWZ0ZXIgY29udGFpbmVyXG4gICAgICAgICAgICAgICAgaWYoIHJhbmdlQ29udGFpbmVyLmNvbXBhcmVFbmRQb2ludHMoJ1N0YXJ0VG9TdGFydCcscmFuZ2UpID4gMCApXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlLnNldEVuZFBvaW50KCdTdGFydFRvU3RhcnQnLHJhbmdlQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICBpZiggcmFuZ2VDb250YWluZXIuY29tcGFyZUVuZFBvaW50cygnRW5kVG9FbmQnLHJhbmdlKSA8IDAgKVxuICAgICAgICAgICAgICAgICAgICByYW5nZS5zZXRFbmRQb2ludCgnRW5kVG9FbmQnLHJhbmdlQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAvLyBzZWxlY3QgcmFuZ2VcbiAgICAgICAgICAgICAgICByYW5nZS5zZWxlY3QoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgICovXG5cbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY2OTA3NTIvaW5zZXJ0LWh0bWwtYXQtY2FyZXQtaW4tYS1jb250ZW50ZWRpdGFibGUtZGl2LzY2OTEyOTQjNjY5MTI5NFxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDgyMzY5MS9pbnNlcnQtYW4taHRtbC1lbGVtZW50LWluLWEtY29udGVudGVkaXRhYmxlLWVsZW1lbnRcbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzYxMzkxMDcvcHJvZ3JhbWF0aWNhbGx5LXNlbGVjdC10ZXh0LWluLWEtY29udGVudGVkaXRhYmxlLWh0bWwtZWxlbWVudFxuICAgIHZhciBwYXN0ZUh0bWxBdENhcmV0ID0gZnVuY3Rpb24oIGNvbnRhaW5lck5vZGUsIGh0bWwgKVxuICAgIHtcbiAgICAgICAgaWYoIHdpbmRvdy5nZXRTZWxlY3Rpb24gKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBJRTkgYW5kIG5vbi1JRVxuICAgICAgICAgICAgdmFyIHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIGlmKCBzZWwuZ2V0UmFuZ2VBdCAmJiBzZWwucmFuZ2VDb3VudCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHJhbmdlID0gc2VsLmdldFJhbmdlQXQoMCk7XG4gICAgICAgICAgICAgICAgLy8gUmFuZ2UuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KCkgd291bGQgYmUgdXNlZnVsIGhlcmUgYnV0IGlzXG4gICAgICAgICAgICAgICAgLy8gb25seSByZWxhdGl2ZWx5IHJlY2VudGx5IHN0YW5kYXJkaXplZCBhbmQgaXMgbm90IHN1cHBvcnRlZCBpblxuICAgICAgICAgICAgICAgIC8vIHNvbWUgYnJvd3NlcnMgKElFOSwgZm9yIG9uZSlcbiAgICAgICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBlbC5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICAgICAgICAgIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLCBub2RlLCBsYXN0Tm9kZTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoIChub2RlID0gZWwuZmlyc3RDaGlsZCkgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3ROb2RlID0gZnJhZy5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoIGlzT3JDb250YWluc05vZGUoY29udGFpbmVyTm9kZSwgcmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXIpIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJhbmdlLmRlbGV0ZUNvbnRlbnRzKCk7XG4gICAgICAgICAgICAgICAgICAgIHJhbmdlLmluc2VydE5vZGUoZnJhZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJOb2RlLmFwcGVuZENoaWxkKGZyYWcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBQcmVzZXJ2ZSB0aGUgc2VsZWN0aW9uXG4gICAgICAgICAgICAgICAgaWYoIGxhc3ROb2RlIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJhbmdlID0gcmFuZ2UuY2xvbmVSYW5nZSgpO1xuICAgICAgICAgICAgICAgICAgICByYW5nZS5zZXRTdGFydEFmdGVyKGxhc3ROb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2UuY29sbGFwc2UodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsLmFkZFJhbmdlKHJhbmdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiggZG9jdW1lbnQuc2VsZWN0aW9uIClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gSUUgPD0gOFxuICAgICAgICAgICAgdmFyIHNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbjtcbiAgICAgICAgICAgIGlmKCBzZWwudHlwZSAhPSAnQ29udHJvbCcgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBvcmlnaW5hbFJhbmdlID0gc2VsLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxSYW5nZS5jb2xsYXBzZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB2YXIgcmFuZ2UgPSBzZWwuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICBpZiggaXNPckNvbnRhaW5zTm9kZShjb250YWluZXJOb2RlLCByYW5nZS5wYXJlbnRFbGVtZW50KCkpIClcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2UucGFzdGVIVE1MKCBodG1sICk7XG4gICAgICAgICAgICAgICAgZWxzZSAvLyBzaW1wbHkgYXBwZW5kIHRvIEVkaXRvclxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRleHRSYW5nZSA9IGRvY3VtZW50LmJvZHkuY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRleHRSYW5nZS5tb3ZlVG9FbGVtZW50VGV4dChjb250YWluZXJOb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dFJhbmdlLmNvbGxhcHNlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dFJhbmdlLnNlbGVjdCgpO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0UmFuZ2UucGFzdGVIVE1MKCBodG1sICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFByZXNlcnZlIHRoZSBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgICByYW5nZSA9IHNlbC5jcmVhdGVSYW5nZSgpO1xuICAgICAgICAgICAgICAgIHJhbmdlLnNldEVuZFBvaW50KCdTdGFydFRvRW5kJywgb3JpZ2luYWxSYW5nZSk7XG4gICAgICAgICAgICAgICAgcmFuZ2Uuc2VsZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSW50ZXJmYWNlOiBDcmVhdGUgd3lzaXd5Z1xuICAgIHZhciB3eXNpd3lnID0gZnVuY3Rpb24oIG9wdGlvbiApXG4gICAge1xuICAgICAgICAvLyBPcHRpb25zXG4gICAgICAgIG9wdGlvbiA9IG9wdGlvbiB8fCB7fTtcbiAgICAgICAgdmFyIG9wdGlvbl9lbGVtZW50ID0gb3B0aW9uLmVsZW1lbnQgfHwgbnVsbDtcbiAgICAgICAgaWYoIHR5cGVvZihvcHRpb25fZWxlbWVudCkgPT0gJ3N0cmluZycgKVxuICAgICAgICAgICAgb3B0aW9uX2VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggb3B0aW9uX2VsZW1lbnQgKTtcbiAgICAgICAgdmFyIG9wdGlvbl9jb250ZW50ZWRpdGFibGUgPSBvcHRpb24uY29udGVudGVkaXRhYmxlIHx8IG51bGw7XG4gICAgICAgIGlmKCB0eXBlb2Yob3B0aW9uX2NvbnRlbnRlZGl0YWJsZSkgPT0gJ3N0cmluZycgKVxuICAgICAgICAgICAgb3B0aW9uX2NvbnRlbnRlZGl0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBvcHRpb25fY29udGVudGVkaXRhYmxlICk7XG4gICAgICAgIHZhciBvcHRpb25fb25rZXlkb3duID0gb3B0aW9uLm9uS2V5RG93biB8fCBudWxsO1xuICAgICAgICB2YXIgb3B0aW9uX29ua2V5cHJlc3MgPSBvcHRpb24ub25LZXlQcmVzcyB8fCBudWxsO1xuICAgICAgICB2YXIgb3B0aW9uX29ua2V5dXAgPSBvcHRpb24ub25LZXlVcCB8fCBudWxsO1xuICAgICAgICB2YXIgb3B0aW9uX29uc2VsZWN0aW9uID0gb3B0aW9uLm9uU2VsZWN0aW9uIHx8IG51bGw7XG4gICAgICAgIHZhciBvcHRpb25fb25wbGFjZWhvbGRlciA9IG9wdGlvbi5vblBsYWNlaG9sZGVyIHx8IG51bGw7XG4gICAgICAgIHZhciBvcHRpb25fb25vcGVucG9wdXAgPSBvcHRpb24ub25PcGVucG9wdXAgfHwgbnVsbDtcbiAgICAgICAgdmFyIG9wdGlvbl9vbmNsb3NlcG9wdXAgPSBvcHRpb24ub25DbG9zZXBvcHVwIHx8IG51bGw7XG4gICAgICAgIHZhciBvcHRpb25faGlqYWNrY29udGV4dG1lbnUgPSBvcHRpb24uaGlqYWNrQ29udGV4dG1lbnUgfHwgZmFsc2U7XG4gICAgICAgIHZhciBvcHRpb25fcmVhZG9ubHkgPSBvcHRpb24ucmVhZE9ubHkgfHwgZmFsc2U7XG5cbiAgICAgICAgLy8gS2VlcCB0ZXh0YXJlYSBpZiBicm93c2VyIGNhbid0IGhhbmRsZSBjb250ZW50LWVkaXRhYmxlXG4gICAgICAgIHZhciBpc190ZXh0YXJlYSA9IG9wdGlvbl9lbGVtZW50Lm5vZGVOYW1lID09ICdURVhUQVJFQScgfHwgb3B0aW9uX2VsZW1lbnQubm9kZU5hbWUgPT0gJ0lOUFVUJztcbiAgICAgICAgaWYoIGlzX3RleHRhcmVhIClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODgyMjA1L2hvdy1kby1pLWRldGVjdC1zdXBwb3J0LWZvci1jb250ZW50ZWRpdGFibGUtdmlhLWphdmFzY3JpcHRcbiAgICAgICAgICAgIHZhciBjYW5Db250ZW50RWRpdGFibGUgPSAnY29udGVudEVkaXRhYmxlJyBpbiBkb2N1bWVudC5ib2R5O1xuICAgICAgICAgICAgaWYoIGNhbkNvbnRlbnRFZGl0YWJsZSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gU25pZmZlciB1c2VyYWdlbnQuLi5cbiAgICAgICAgICAgICAgICB2YXIgd2Via2l0ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvKD86aVBhZHxpUGhvbmV8QW5kcm9pZCkuKiBBcHBsZVdlYktpdFxcLyhbXiBdKykvKTtcbiAgICAgICAgICAgICAgICBpZiggd2Via2l0ICYmIDQyMCA8PSBwYXJzZUludCh3ZWJraXRbMV0pICYmIHBhcnNlSW50KHdlYmtpdFsxXSkgPCA1MzQgKSAvLyBpUGhvbmUgMSB3YXMgV2Via2l0LzQyMFxuICAgICAgICAgICAgICAgICAgICBjYW5Db250ZW50RWRpdGFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCAhIGNhbkNvbnRlbnRFZGl0YWJsZSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gS2VlcCB0ZXh0YXJlYVxuICAgICAgICAgICAgICAgIHZhciBub2RlX3RleHRhcmVhID0gb3B0aW9uX2VsZW1lbnQ7XG4gICAgICAgICAgICAgICAgLy8gQWRkIGEgJ25ld2xpbmUnIGFmdGVyIGVhY2ggJzxicj4nXG4gICAgICAgICAgICAgICAgdmFyIG5ld2xpbmVBZnRlckJSID0gZnVuY3Rpb24oIGh0bWwgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBodG1sLnJlcGxhY2UoLzxiclsgXFwvXSo+XFxuPy9naSwnPGJyPlxcbicpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbm9kZV90ZXh0YXJlYS52YWx1ZSA9IG5ld2xpbmVBZnRlckJSKCBub2RlX3RleHRhcmVhLnZhbHVlICk7XG4gICAgICAgICAgICAgICAgLy8gQ29tbWFuZCBzdHJ1Y3R1cmVcbiAgICAgICAgICAgICAgICB2YXIgZHVtbXlfdGhpcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZhciBkdW1teV9udWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgbGVnYWN5OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAvLyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIGdldEVsZW1lbnQ6IGZ1bmN0aW9uKClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGVfdGV4dGFyZWE7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGdldEhUTUw6IGZ1bmN0aW9uKClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGVfdGV4dGFyZWEudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHNldEhUTUw6IGZ1bmN0aW9uKCBodG1sIClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZV90ZXh0YXJlYS52YWx1ZSA9IG5ld2xpbmVBZnRlckJSKCBodG1sICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2V0U2VsZWN0ZWRIVE1MOiBkdW1teV9udWxsLFxuICAgICAgICAgICAgICAgICAgICBzeW5jOiBkdW1teV90aGlzLFxuICAgICAgICAgICAgICAgICAgICByZWFkT25seTogZnVuY3Rpb24oIHJlYWRvbmx5IClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcXVlcnkgcmVhZC1vbmx5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggcmVhZG9ubHkgPT09IHVuZGVmaW5lZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGVfdGV4dGFyZWEuaGFzQXR0cmlidXRlID8gbm9kZV90ZXh0YXJlYS5oYXNBdHRyaWJ1dGUoJ3JlYWRvbmx5JykgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICEhbm9kZV90ZXh0YXJlYS5nZXRBdHRyaWJ1dGUoJ3JlYWRvbmx5Jyk7IC8vIElFN1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0IHJlYWQtb25seVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHJlYWRvbmx5IClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlX3RleHRhcmVhLnNldEF0dHJpYnV0ZSggJ3JlYWRvbmx5JywgJ3JlYWRvbmx5JyApO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVfdGV4dGFyZWEucmVtb3ZlQXR0cmlidXRlKCAncmVhZG9ubHknICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8gc2VsZWN0aW9uIGFuZCBwb3B1cFxuICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZVNlbGVjdGlvbjogZHVtbXlfdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgZXhwYW5kU2VsZWN0aW9uOiBkdW1teV90aGlzLFxuICAgICAgICAgICAgICAgICAgICBvcGVuUG9wdXA6IGR1bW15X251bGwsXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlUG9wdXA6IGR1bW15X3RoaXMsXG4gICAgICAgICAgICAgICAgICAgIC8vIGV4ZWMgY29tbWFuZHNcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRm9ybWF0OiBkdW1teV90aGlzLFxuICAgICAgICAgICAgICAgICAgICBib2xkOiBkdW1teV90aGlzLFxuICAgICAgICAgICAgICAgICAgICBpdGFsaWM6IGR1bW15X3RoaXMsXG4gICAgICAgICAgICAgICAgICAgIHVuZGVybGluZTogZHVtbXlfdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgc3RyaWtldGhyb3VnaDogZHVtbXlfdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgZm9yZWNvbG9yOiBkdW1teV90aGlzLFxuICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHQ6IGR1bW15X3RoaXMsXG4gICAgICAgICAgICAgICAgICAgIGZvbnROYW1lOiBkdW1teV90aGlzLFxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogZHVtbXlfdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0OiBkdW1teV90aGlzLFxuICAgICAgICAgICAgICAgICAgICBzdXBlcnNjcmlwdDogZHVtbXlfdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IGR1bW15X3RoaXMsXG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdDogZHVtbXlfdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50OiBkdW1teV90aGlzLFxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRMaW5rOiBkdW1teV90aGlzLFxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRJbWFnZTogZHVtbXlfdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0SFRNTDogZHVtbXlfdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0TGlzdDogZHVtbXlfdGhpc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjcmVhdGUgY29udGVudC1lZGl0YWJsZVxuICAgICAgICB2YXIgbm9kZV90ZXh0YXJlYSA9IG51bGwsXG4gICAgICAgICAgICBub2RlX3d5c2l3eWcgPSBudWxsO1xuICAgICAgICBpZiggaXNfdGV4dGFyZWEgKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBUZXh0YXJlYVxuICAgICAgICAgICAgbm9kZV90ZXh0YXJlYSA9IG9wdGlvbl9lbGVtZW50O1xuICAgICAgICAgICAgbm9kZV90ZXh0YXJlYS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgICAgICAgICAvLyBDb250ZW50ZWRpdGFibGVcbiAgICAgICAgICAgIGlmKCBvcHRpb25fY29udGVudGVkaXRhYmxlIClcbiAgICAgICAgICAgICAgICBub2RlX3d5c2l3eWcgPSBvcHRpb25fY29udGVudGVkaXRhYmxlO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5vZGVfd3lzaXd5ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdESVYnICk7XG4gICAgICAgICAgICAgICAgbm9kZV93eXNpd3lnLmlubmVySFRNTCA9IG5vZGVfdGV4dGFyZWEudmFsdWUgfHwgJyc7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IG5vZGVfdGV4dGFyZWEucGFyZW50Tm9kZSxcbiAgICAgICAgICAgICAgICAgICAgbmV4dCA9IG5vZGVfdGV4dGFyZWEubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgaWYoIG5leHQgKVxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKCBub2RlX3d5c2l3eWcsIG5leHQgKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCggbm9kZV93eXNpd3lnICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbm9kZV93eXNpd3lnID0gb3B0aW9uX2VsZW1lbnQ7XG4gICAgICAgIC8vIElmIG5vdCByZWFkLW9ubHlcbiAgICAgICAgaWYoICEgb3B0aW9uX3JlYWRvbmx5IClcbiAgICAgICAgICAgIG5vZGVfd3lzaXd5Zy5zZXRBdHRyaWJ1dGUoICdjb250ZW50RWRpdGFibGUnLCAndHJ1ZScgKTsgLy8gSUU3IGlzIGNhc2Ugc2Vuc2l0aXZlXG5cbiAgICAgICAgLy8gSUU4IHVzZXMgJ2RvY3VtZW50JyBpbnN0ZWFkIG9mICd3aW5kb3cnXG4gICAgICAgIC8vIGh0dHA6Ly90YW5hbGluLmNvbS9lbi9hcnRpY2xlcy9pZS12ZXJzaW9uLWpzLyAtIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA5NjQ5NjYvZGV0ZWN0LWllLXZlcnNpb24tcHJpb3ItdG8tdjktaW4tamF2YXNjcmlwdFxuICAgICAgICB2YXIgd2luZG93X2llOCA9IChkb2N1bWVudC5hbGwgJiYgKCEgZG9jdW1lbnQuZG9jdW1lbnRNb2RlIHx8IGRvY3VtZW50LmRvY3VtZW50TW9kZSA8PSA4KSkgPyBkb2N1bWVudCA6IHdpbmRvdztcblxuICAgICAgICAvLyBTeW5jIEVkaXRvciB3aXRoIFRleHRhcmVhXG4gICAgICAgIHZhciBzeW5jVGV4dGFyZWEgPSBudWxsLFxuICAgICAgICAgICAgY2FsbFVwZGF0ZXM7XG4gICAgICAgIGlmKCBpc190ZXh0YXJlYSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBwcmV2aW91c19odG1sID0gbm9kZV93eXNpd3lnLmlubmVySFRNTDtcbiAgICAgICAgICAgIHN5bmNUZXh0YXJlYSA9IGZ1bmN0aW9uKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3X2h0bWwgPSBub2RlX3d5c2l3eWcuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgIGlmKCBuZXdfaHRtbCA9PSBwcmV2aW91c19odG1sIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDtcbiAgICAgICAgICAgICAgICAvLyBIVE1MIGNoYW5nZWRcbiAgICAgICAgICAgICAgICBub2RlX3RleHRhcmVhLnZhbHVlID0gbmV3X2h0bWw7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNfaHRtbCA9IG5ld19odG1sO1xuICAgICAgICAgICAgICAgIC8vIEV2ZW50IEhhbmRsZXJcbiAgICAgICAgICAgICAgICBmaXJlRXZlbnQoIG5vZGVfdGV4dGFyZWEsICdjaGFuZ2UnLCBmYWxzZSApO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gaGFuZGxlIHJlc2V0IGV2ZW50XG4gICAgICAgICAgICB2YXIgZm9ybSA9IG5vZGVfdGV4dGFyZWEuZm9ybTtcbiAgICAgICAgICAgIGlmKCBmb3JtIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhZGRFdmVudCggZm9ybSwgJ3Jlc2V0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVfd3lzaXd5Zy5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgc3luY1RleHRhcmVhKCk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxVcGRhdGVzKCB0cnVlICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTaG93IHBsYWNlaG9sZGVyXG4gICAgICAgIHZhciBzaG93UGxhY2Vob2xkZXI7XG4gICAgICAgIGlmKCBvcHRpb25fb25wbGFjZWhvbGRlciApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlcl92aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBzaG93UGxhY2Vob2xkZXIgPSBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gVGVzdCBpZiB3eXNpd3lnIGhhcyBjb250ZW50XG4gICAgICAgICAgICAgICAgdmFyIHd5c2l3eWdfZW1wdHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciBub2RlID0gbm9kZV93eXNpd3lnO1xuICAgICAgICAgICAgICAgIHdoaWxlKCBub2RlIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSBuZXh0Tm9kZSggbm9kZSwgbm9kZV93eXNpd3lnICk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRlc3QgaWYgbm9kZSBjb250YWlucyBzb21ldGhpbmcgdmlzaWJsZVxuICAgICAgICAgICAgICAgICAgICBpZiggISBub2RlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiggbm9kZS5ub2RlVHlwZSA9PSBOb2RlX0VMRU1FTlRfTk9ERSApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBub2RlLm5vZGVOYW1lID09ICdJTUcnIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eXNpd3lnX2VtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiggbm9kZS5ub2RlVHlwZSA9PSBOb2RlX1RFWFRfTk9ERSApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gbm9kZS5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggdGV4dCAmJiB0ZXh0LnNlYXJjaCgvW15cXHNdLykgIT0gLTEgKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd5c2l3eWdfZW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiggcGxhY2Vob2xkZXJfdmlzaWJsZSAhPSB3eXNpd3lnX2VtcHR5IClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbl9vbnBsYWNlaG9sZGVyKCB3eXNpd3lnX2VtcHR5ICk7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyX3Zpc2libGUgPSB3eXNpd3lnX2VtcHR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzaG93UGxhY2Vob2xkZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhhbmRsZSBzZWxlY3Rpb25cbiAgICAgICAgdmFyIHBvcHVwX3NhdmVkX3NlbGVjdGlvbiA9IG51bGwsIC8vIHByZXNlcnZlIHNlbGVjdGlvbiBkdXJpbmcgcG9wdXBcbiAgICAgICAgICAgIGhhbmRsZVNlbGVjdGlvbiA9IG51bGwsXG4gICAgICAgICAgICBkZWJvdW5jZWRfaGFuZGxlU2VsZWN0aW9uID0gbnVsbDtcbiAgICAgICAgaWYoIG9wdGlvbl9vbnNlbGVjdGlvbiApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGhhbmRsZVNlbGVjdGlvbiA9IGZ1bmN0aW9uKCBjbGllbnRYLCBjbGllbnRZLCByaWdodGNsaWNrIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBEZXRlY3QgY29sbGFwc2VkIHNlbGVjdGlvblxuICAgICAgICAgICAgICAgIHZhciBjb2xsYXBzZWQgPSBnZXRTZWxlY3Rpb25Db2xsYXBzZWQoIG5vZGVfd3lzaXd5ZyApO1xuICAgICAgICAgICAgICAgIC8vIExpc3Qgb2YgYWxsIHNlbGVjdGVkIG5vZGVzXG4gICAgICAgICAgICAgICAgdmFyIG5vZGVzID0gZ2V0U2VsZWN0ZWROb2Rlcyggbm9kZV93eXNpd3lnICk7XG4gICAgICAgICAgICAgICAgLy8gUmVjdGFuZ2xlIG9mIHRoZSBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgICB2YXIgcmVjdCA9IChjbGllbnRYID09PSBudWxsIHx8IGNsaWVudFkgPT09IG51bGwpID8gbnVsbCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBjbGllbnRYLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IGNsaWVudFksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rpb25SZWN0ID0gZ2V0U2VsZWN0aW9uUmVjdCgpO1xuICAgICAgICAgICAgICAgIGlmKCBzZWxlY3Rpb25SZWN0IClcbiAgICAgICAgICAgICAgICAgICAgcmVjdCA9IHNlbGVjdGlvblJlY3Q7XG4gICAgICAgICAgICAgICAgaWYoIHJlY3QgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU28gZmFyICdyZWN0JyBpcyByZWxhdGl2ZSB0byB2aWV3cG9ydFxuICAgICAgICAgICAgICAgICAgICBpZiggbm9kZV93eXNpd3lnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1ha2UgaXQgcmVsYXRpdmUgdG8gdGhlIGVkaXRvciB2aWEgJ2dldEJvdW5kaW5nQ2xpZW50UmVjdCgpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJvdW5kaW5ncmVjdCA9IG5vZGVfd3lzaXd5Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY3QubGVmdCAtPSBwYXJzZUludChib3VuZGluZ3JlY3QubGVmdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWN0LnRvcCAtPSBwYXJzZUludChib3VuZGluZ3JlY3QudG9wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBub2RlID0gbm9kZV93eXNpd3lnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldExlZnQgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldFRvcCA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZml4ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXRMZWZ0ICs9IG5vZGUub2Zmc2V0TGVmdCA/IHBhcnNlSW50KG5vZGUub2Zmc2V0TGVmdCkgOiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldFRvcCArPSBub2RlLm9mZnNldFRvcCA/IHBhcnNlSW50KG5vZGUub2Zmc2V0VG9wKSA6IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIG5vZGUuc3R5bGUucG9zaXRpb24gPT0gJ2ZpeGVkJyApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpeGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlKCBub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY3QubGVmdCAtPSBvZmZzZXRMZWZ0IC0gKGZpeGVkID8gMCA6IHdpbmRvdy5wYWdlWE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWN0LnRvcCAtPSBvZmZzZXRUb3AgLSAoZml4ZWQgPyAwIDogd2luZG93LnBhZ2VZT2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBUcmltIHJlY3RhbmdsZSB0byB0aGUgZWRpdG9yXG4gICAgICAgICAgICAgICAgICAgIGlmKCByZWN0LmxlZnQgPCAwIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY3QubGVmdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmKCByZWN0LnRvcCA8IDAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjdC50b3AgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiggcmVjdC53aWR0aCA+IG5vZGVfd3lzaXd5Zy5vZmZzZXRXaWR0aCApXG4gICAgICAgICAgICAgICAgICAgICAgICByZWN0LndpZHRoID0gbm9kZV93eXNpd3lnLm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICBpZiggcmVjdC5oZWlnaHQgPiBub2RlX3d5c2l3eWcub2Zmc2V0SGVpZ2h0IClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY3QuaGVpZ2h0ID0gbm9kZV93eXNpd3lnLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiggbm9kZXMubGVuZ3RoIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdoYXQgZWxzZSBjb3VsZCB3ZSBkbz8gT2Zmc2V0IG9mIGZpcnN0IGVsZW1lbnQuLi5cbiAgICAgICAgICAgICAgICAgICAgZm9yKCB2YXIgaT0wOyBpIDwgbm9kZXMubGVuZ3RoOyArK2kgKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIG5vZGUubm9kZVR5cGUgIT0gTm9kZV9FTEVNRU5UX05PREUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogbm9kZS5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IG5vZGUub2Zmc2V0VG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogbm9kZS5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBub2RlLm9mZnNldEhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBDYWxsYmFja1xuICAgICAgICAgICAgICAgIG9wdGlvbl9vbnNlbGVjdGlvbiggY29sbGFwc2VkLCByZWN0LCBub2RlcywgcmlnaHRjbGljayApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRlYm91bmNlZF9oYW5kbGVTZWxlY3Rpb24gPSBkZWJvdW5jZSggaGFuZGxlU2VsZWN0aW9uLCAxICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPcGVuIHBvcHVwXG4gICAgICAgIHZhciBub2RlX3BvcHVwID0gbnVsbDtcbiAgICAgICAgdmFyIHBvcHVwQ2xpY2tDbG9zZSA9IGZ1bmN0aW9uKCBlIClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5xdWlya3Ntb2RlLm9yZy9qcy9ldmVudHNfcHJvcGVydGllcy5odG1sXG4gICAgICAgICAgICBpZiggIWUgKVxuICAgICAgICAgICAgICAgIHZhciBlID0gd2luZG93LmV2ZW50O1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcbiAgICAgICAgICAgIGlmKCB0YXJnZXQubm9kZVR5cGUgPT0gTm9kZV9URVhUX05PREUgKSAvLyBkZWZlYXQgU2FmYXJpIGJ1Z1xuICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgLy8gQ2xpY2sgd2l0aGluIHBvcHVwP1xuICAgICAgICAgICAgaWYoIGlzT3JDb250YWluc05vZGUobm9kZV9wb3B1cCx0YXJnZXQpIClcbiAgICAgICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICAgICAgLy8gY2xvc2UgcG9wdXBcbiAgICAgICAgICAgIHBvcHVwQ2xvc2UoKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHBvcHVwT3BlbiA9IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gQWxyZWFkeSBvcGVuP1xuICAgICAgICAgICAgaWYoIG5vZGVfcG9wdXAgKVxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlX3BvcHVwO1xuXG4gICAgICAgICAgICAvLyBHbG9iYWwgY2xpY2sgY2xvc2VzIHBvcHVwXG4gICAgICAgICAgICBhZGRFdmVudCggd2luZG93X2llOCwgJ21vdXNlZG93bicsIHBvcHVwQ2xpY2tDbG9zZSwgdHJ1ZSApO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgcG9wdXAgZWxlbWVudFxuICAgICAgICAgICAgbm9kZV9wb3B1cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdESVYnICk7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gbm9kZV93eXNpd3lnLnBhcmVudE5vZGUsXG4gICAgICAgICAgICAgICAgbmV4dCA9IG5vZGVfd3lzaXd5Zy5uZXh0U2libGluZztcbiAgICAgICAgICAgIGlmKCBuZXh0IClcbiAgICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKCBub2RlX3BvcHVwLCBuZXh0ICk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKCBub2RlX3BvcHVwICk7XG4gICAgICAgICAgICBpZiggb3B0aW9uX29ub3BlbnBvcHVwIClcbiAgICAgICAgICAgICAgICBvcHRpb25fb25vcGVucG9wdXAoKTtcbiAgICAgICAgICAgIHJldHVybiBub2RlX3BvcHVwO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgcG9wdXBDbG9zZSA9IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYoICEgbm9kZV9wb3B1cCApXG4gICAgICAgICAgICAgICAgcmV0dXJuIDtcbiAgICAgICAgICAgIG5vZGVfcG9wdXAucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggbm9kZV9wb3B1cCApO1xuICAgICAgICAgICAgbm9kZV9wb3B1cCA9IG51bGw7XG4gICAgICAgICAgICByZW1vdmVFdmVudCggd2luZG93X2llOCwgJ21vdXNlZG93bicsIHBvcHVwQ2xpY2tDbG9zZSwgdHJ1ZSApO1xuICAgICAgICAgICAgaWYoIG9wdGlvbl9vbmNsb3NlcG9wdXAgKVxuICAgICAgICAgICAgICAgIG9wdGlvbl9vbmNsb3NlcG9wdXAoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBGb2N1cy9CbHVyIGV2ZW50c1xuICAgICAgICBhZGRFdmVudCggbm9kZV93eXNpd3lnLCAnZm9jdXMnLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIGZvcndhcmQgZm9jdXMvYmx1ciB0byB0aGUgdGV4dGFyZWFcbiAgICAgICAgICAgIGlmKCBub2RlX3RleHRhcmVhIClcbiAgICAgICAgICAgICAgICBmaXJlRXZlbnQoIG5vZGVfdGV4dGFyZWEsICdmb2N1cycsIGZhbHNlICk7XG4gICAgICAgIH0pO1xuICAgICAgICBhZGRFdmVudCggbm9kZV93eXNpd3lnLCAnYmx1cicsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gc3luYyB0ZXh0YXJlYSBpbW1lZGlhdGVseVxuICAgICAgICAgICAgaWYoIHN5bmNUZXh0YXJlYSApXG4gICAgICAgICAgICAgICAgc3luY1RleHRhcmVhKCk7XG4gICAgICAgICAgICAvLyBmb3J3YXJkIGZvY3VzL2JsdXIgdG8gdGhlIHRleHRhcmVhXG4gICAgICAgICAgICBpZiggbm9kZV90ZXh0YXJlYSApXG4gICAgICAgICAgICAgICAgZmlyZUV2ZW50KCBub2RlX3RleHRhcmVhLCAnYmx1cicsIGZhbHNlICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENoYW5nZSBldmVudHNcbiAgICAgICAgdmFyIGRlYm91bmNlZF9jaGFuZ2VIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgaWYoIHNob3dQbGFjZWhvbGRlciB8fCBzeW5jVGV4dGFyZWEgKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBkZWJvdW5jZSAnc3luY1RleHRhcmVhJyBhIHNlY29uZCB0aW1lLCBiZWNhdXNlICdpbm5lckhUTUwnIGlzIHF1aXRlIGJ1cmRlbnNvbWVcbiAgICAgICAgICAgIHZhciBkZWJvdW5jZWRfc3luY1RleHRhcmVhID0gc3luY1RleHRhcmVhID8gZGVib3VuY2UoIHN5bmNUZXh0YXJlYSwgMjUwLCB0cnVlICkgOiBudWxsOyAvLyBoaWdoIHRpbWVvdXQgaXMgc2F2ZSwgYmVjYXVzZSBvZiBcIm9uYmx1clwiIGZpcmVzIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICB2YXIgY2hhbmdlSGFuZGxlciA9IGZ1bmN0aW9uKCBlIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiggc2hvd1BsYWNlaG9sZGVyIClcbiAgICAgICAgICAgICAgICAgICAgc2hvd1BsYWNlaG9sZGVyKCk7XG4gICAgICAgICAgICAgICAgaWYoIGRlYm91bmNlZF9zeW5jVGV4dGFyZWEgKVxuICAgICAgICAgICAgICAgICAgICBkZWJvdW5jZWRfc3luY1RleHRhcmVhKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGVib3VuY2VkX2NoYW5nZUhhbmRsZXIgPSBkZWJvdW5jZSggY2hhbmdlSGFuZGxlciwgMSApO1xuXG4gICAgICAgICAgICAvLyBDYXRjaCBjaGFuZ2UgZXZlbnRzXG4gICAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEzOTEyNzgvY29udGVudGVkaXRhYmxlLWNoYW5nZS1ldmVudHMvMTQxMTI5NiMxNDExMjk2XG4gICAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzg2OTQwNTQvb25jaGFuZ2UtZXZlbnQtd2l0aC1jb250ZW50ZWRpdGFibGUvODY5NDEyNSM4Njk0MTI1XG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWluZG11cC9ib290c3RyYXAtd3lzaXd5Zy9wdWxsLzUwL2ZpbGVzXG4gICAgICAgICAgICAvLyBodHRwOi8vY29kZWJpdHMuZ2xlbm5qb25lcy5uZXQvZWRpdGluZy9ldmVudHMtY29udGVudGVkaXRhYmxlLmh0bVxuICAgICAgICAgICAgYWRkRXZlbnQoIG5vZGVfd3lzaXd5ZywgJ2lucHV0JywgZGVib3VuY2VkX2NoYW5nZUhhbmRsZXIgKTtcbiAgICAgICAgICAgIGFkZEV2ZW50KCBub2RlX3d5c2l3eWcsICdET01Ob2RlSW5zZXJ0ZWQnLCBkZWJvdW5jZWRfY2hhbmdlSGFuZGxlciApO1xuICAgICAgICAgICAgYWRkRXZlbnQoIG5vZGVfd3lzaXd5ZywgJ0RPTU5vZGVSZW1vdmVkJywgZGVib3VuY2VkX2NoYW5nZUhhbmRsZXIgKTtcbiAgICAgICAgICAgIGFkZEV2ZW50KCBub2RlX3d5c2l3eWcsICdET01TdWJ0cmVlTW9kaWZpZWQnLCBkZWJvdW5jZWRfY2hhbmdlSGFuZGxlciApO1xuICAgICAgICAgICAgYWRkRXZlbnQoIG5vZGVfd3lzaXd5ZywgJ0RPTUNoYXJhY3RlckRhdGFNb2RpZmllZCcsIGRlYm91bmNlZF9jaGFuZ2VIYW5kbGVyICk7IC8vIHBvbHlmaWxsIGlucHV0IGluIElFIDktMTBcbiAgICAgICAgICAgIGFkZEV2ZW50KCBub2RlX3d5c2l3eWcsICdwcm9wZXJ0eWNoYW5nZScsIGRlYm91bmNlZF9jaGFuZ2VIYW5kbGVyICk7XG4gICAgICAgICAgICBhZGRFdmVudCggbm9kZV93eXNpd3lnLCAndGV4dElucHV0JywgZGVib3VuY2VkX2NoYW5nZUhhbmRsZXIgKTtcbiAgICAgICAgICAgIGFkZEV2ZW50KCBub2RlX3d5c2l3eWcsICdwYXN0ZScsIGRlYm91bmNlZF9jaGFuZ2VIYW5kbGVyICk7XG4gICAgICAgICAgICBhZGRFdmVudCggbm9kZV93eXNpd3lnLCAnY3V0JywgZGVib3VuY2VkX2NoYW5nZUhhbmRsZXIgKTtcbiAgICAgICAgICAgIGFkZEV2ZW50KCBub2RlX3d5c2l3eWcsICdkcm9wJywgZGVib3VuY2VkX2NoYW5nZUhhbmRsZXIgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEtleSBldmVudHNcbiAgICAgICAgLy8gaHR0cDovL3NhbmRib3gudGhld2lraWVzLmNvbS9odG1sNS1leHBlcmltZW50cy9rZXktZXZlbnRzLmh0bWxcbiAgICAgICAgdmFyIGtleUhhbmRsZXIgPSBmdW5jdGlvbiggZSwgcGhhc2UgKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBodHRwOi8vd3d3LnF1aXJrc21vZGUub3JnL2pzL2V2ZW50c19wcm9wZXJ0aWVzLmh0bWxcbiAgICAgICAgICAgIGlmKCAhZSApXG4gICAgICAgICAgICAgICAgdmFyIGUgPSB3aW5kb3cuZXZlbnQ7XG4gICAgICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudFxuICAgICAgICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNDQ0NDc3L2tleWNvZGUtYW5kLWNoYXJjb2RlXG4gICAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQyODU2MjcvamF2YXNjcmlwdC1rZXljb2RlLXZzLWNoYXJjb2RlLXV0dGVyLWNvbmZ1c2lvblxuICAgICAgICAgICAgLy8gaHR0cDovL3VuaXhwYXBhLmNvbS9qcy9rZXkuaHRtbFxuICAgICAgICAgICAgdmFyIGtleSA9IGUud2hpY2ggfHwgZS5rZXlDb2RlLFxuICAgICAgICAgICAgICAgIGNoYXJhY3RlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoa2V5IHx8IGUuY2hhckNvZGUpLFxuICAgICAgICAgICAgICAgIHNoaWZ0S2V5ID0gZS5zaGlmdEtleSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBhbHRLZXkgPSBlLmFsdEtleSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBjdHJsS2V5ID0gZS5jdHJsS2V5IHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIG1ldGFLZXkgPSBlLm1ldGFLZXkgfHwgZmFsc2U7XG4gICAgICAgICAgICAgaWYoIHBoYXNlID09IDEgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIENhbGxiYWNrXG4gICAgICAgICAgICAgICAgaWYoIG9wdGlvbl9vbmtleWRvd24gJiYgb3B0aW9uX29ua2V5ZG93bihrZXksIGNoYXJhY3Rlciwgc2hpZnRLZXksIGFsdEtleSwgY3RybEtleSwgbWV0YUtleSkgPT09IGZhbHNlIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbmNlbEV2ZW50KCBlICk7IC8vIGRpc21pc3Mga2V5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKCBwaGFzZSA9PSAyIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBDYWxsYmFja1xuICAgICAgICAgICAgICAgIGlmKCBvcHRpb25fb25rZXlwcmVzcyAmJiBvcHRpb25fb25rZXlwcmVzcyhrZXksIGNoYXJhY3Rlciwgc2hpZnRLZXksIGFsdEtleSwgY3RybEtleSwgbWV0YUtleSkgPT09IGZhbHNlIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbmNlbEV2ZW50KCBlICk7IC8vIGRpc21pc3Mga2V5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKCBwaGFzZSA9PSAzIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBDYWxsYmFja1xuICAgICAgICAgICAgICAgIGlmKCBvcHRpb25fb25rZXl1cCAmJiBvcHRpb25fb25rZXl1cChrZXksIGNoYXJhY3Rlciwgc2hpZnRLZXksIGFsdEtleSwgY3RybEtleSwgbWV0YUtleSkgPT09IGZhbHNlIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbmNlbEV2ZW50KCBlICk7IC8vIGRpc21pc3Mga2V5XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEtleXMgY2FuIGNoYW5nZSB0aGUgc2VsZWN0aW9uXG4gICAgICAgICAgICBpZiggcGhhc2UgPT0gMiB8fCBwaGFzZSA9PSAzIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwb3B1cF9zYXZlZF9zZWxlY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmKCBkZWJvdW5jZWRfaGFuZGxlU2VsZWN0aW9uIClcbiAgICAgICAgICAgICAgICAgICAgZGVib3VuY2VkX2hhbmRsZVNlbGVjdGlvbiggbnVsbCwgbnVsbCwgZmFsc2UgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE1vc3Qga2V5cyBjYW4gY2F1c2UgdGV4dC1jaGFuZ2VzXG4gICAgICAgICAgICBpZiggcGhhc2UgPT0gMiAmJiBkZWJvdW5jZWRfY2hhbmdlSGFuZGxlciApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3dpdGNoKCBrZXkgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzMzogLy8gcGFnZVVwXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzQ6IC8vIHBhZ2VEb3duXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzU6IC8vIGVuZFxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM2OiAvLyBob21lXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzc6IC8vIGxlZnRcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzODogLy8gdXBcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOTogLy8gcmlnaHRcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0MDogLy8gZG93blxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3Vyc29ycyBkbyBub3RcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCBjaGFuZ2UgaGFuZGxlclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVib3VuY2VkX2NoYW5nZUhhbmRsZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYWRkRXZlbnQoIG5vZGVfd3lzaXd5ZywgJ2tleWRvd24nLCBmdW5jdGlvbiggZSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBrZXlIYW5kbGVyKCBlLCAxICk7XG4gICAgICAgIH0pO1xuICAgICAgICBhZGRFdmVudCggbm9kZV93eXNpd3lnLCAna2V5cHJlc3MnLCBmdW5jdGlvbiggZSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBrZXlIYW5kbGVyKCBlLCAyICk7XG4gICAgICAgIH0pO1xuICAgICAgICBhZGRFdmVudCggbm9kZV93eXNpd3lnLCAna2V5dXAnLCBmdW5jdGlvbiggZSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBrZXlIYW5kbGVyKCBlLCAzICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE1vdXNlIGV2ZW50c1xuICAgICAgICB2YXIgbW91c2VIYW5kbGVyID0gZnVuY3Rpb24oIGUsIHJpZ2h0Y2xpY2sgKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBodHRwOi8vd3d3LnF1aXJrc21vZGUub3JnL2pzL2V2ZW50c19wcm9wZXJ0aWVzLmh0bWxcbiAgICAgICAgICAgIGlmKCAhZSApXG4gICAgICAgICAgICAgICAgdmFyIGUgPSB3aW5kb3cuZXZlbnQ7XG4gICAgICAgICAgICAvLyBtb3VzZSBwb3NpdGlvblxuICAgICAgICAgICAgdmFyIGNsaWVudFggPSBudWxsLFxuICAgICAgICAgICAgICAgIGNsaWVudFkgPSBudWxsO1xuICAgICAgICAgICAgaWYoIGUuY2xpZW50WCAmJiBlLmNsaWVudFkgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNsaWVudFggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICAgICAgY2xpZW50WSA9IGUuY2xpZW50WTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoIGUucGFnZVggJiYgZS5wYWdlWSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2xpZW50WCA9IGUucGFnZVggLSB3aW5kb3cucGFnZVhPZmZzZXQ7XG4gICAgICAgICAgICAgICAgY2xpZW50WSA9IGUucGFnZVkgLSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBtb3VzZSBidXR0b25cbiAgICAgICAgICAgIGlmKCBlLndoaWNoICYmIGUud2hpY2ggPT0gMyApXG4gICAgICAgICAgICAgICAgcmlnaHRjbGljayA9IHRydWU7XG4gICAgICAgICAgICBlbHNlIGlmKCBlLmJ1dHRvbiAmJiBlLmJ1dHRvbiA9PSAyIClcbiAgICAgICAgICAgICAgICByaWdodGNsaWNrID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgIHJlbW92ZUV2ZW50KCB3aW5kb3dfaWU4LCAnbW91c2V1cCcsIG1vdXNlSGFuZGxlciApO1xuICAgICAgICAgICAgLy8gQ2FsbGJhY2sgc2VsZWN0aW9uXG4gICAgICAgICAgICBwb3B1cF9zYXZlZF9zZWxlY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgaWYoICEgb3B0aW9uX2hpamFja2NvbnRleHRtZW51ICYmIHJpZ2h0Y2xpY2sgKVxuICAgICAgICAgICAgICAgIHJldHVybiA7XG4gICAgICAgICAgICBpZiggZGVib3VuY2VkX2hhbmRsZVNlbGVjdGlvbiApXG4gICAgICAgICAgICAgICAgZGVib3VuY2VkX2hhbmRsZVNlbGVjdGlvbiggY2xpZW50WCwgY2xpZW50WSwgcmlnaHRjbGljayApO1xuICAgICAgICB9O1xuICAgICAgICBhZGRFdmVudCggbm9kZV93eXNpd3lnLCAnbW91c2Vkb3duJywgZnVuY3Rpb24oIGUgKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBjYXRjaCBldmVudCBpZiAnbW91c2V1cCcgb3V0c2lkZSAnbm9kZV93eXNpd3lnJ1xuICAgICAgICAgICAgcmVtb3ZlRXZlbnQoIHdpbmRvd19pZTgsICdtb3VzZXVwJywgbW91c2VIYW5kbGVyICk7XG4gICAgICAgICAgICBhZGRFdmVudCggd2luZG93X2llOCwgJ21vdXNldXAnLCBtb3VzZUhhbmRsZXIgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFkZEV2ZW50KCBub2RlX3d5c2l3eWcsICdtb3VzZXVwJywgZnVuY3Rpb24oIGUgKVxuICAgICAgICB7XG4gICAgICAgICAgICBtb3VzZUhhbmRsZXIoIGUgKTtcbiAgICAgICAgICAgIC8vIFRyaWdnZXIgY2hhbmdlXG4gICAgICAgICAgICBpZiggZGVib3VuY2VkX2NoYW5nZUhhbmRsZXIgKVxuICAgICAgICAgICAgICAgIGRlYm91bmNlZF9jaGFuZ2VIYW5kbGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBhZGRFdmVudCggbm9kZV93eXNpd3lnLCAnZGJsY2xpY2snLCBmdW5jdGlvbiggZSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1vdXNlSGFuZGxlciggZSApO1xuICAgICAgICB9KTtcbiAgICAgICAgYWRkRXZlbnQoIG5vZGVfd3lzaXd5ZywgJ3NlbGVjdGlvbmNoYW5nZScsICBmdW5jdGlvbiggZSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1vdXNlSGFuZGxlciggZSApO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYoIG9wdGlvbl9oaWphY2tjb250ZXh0bWVudSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFkZEV2ZW50KCBub2RlX3d5c2l3eWcsICdjb250ZXh0bWVudScsIGZ1bmN0aW9uKCBlIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtb3VzZUhhbmRsZXIoIGUsIHRydWUgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FuY2VsRXZlbnQoIGUgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyBleGVjIGNvbW1hbmRcbiAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL2RvY3VtZW50LmV4ZWNDb21tYW5kXG4gICAgICAgIC8vIGh0dHA6Ly93d3cucXVpcmtzbW9kZS5vcmcvZG9tL2V4ZWNDb21tYW5kLmh0bWxcbiAgICAgICAgdmFyIGV4ZWNDb21tYW5kID0gZnVuY3Rpb24oIGNvbW1hbmQsIHBhcmFtLCBmb3JjZV9zZWxlY3Rpb24gKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBnaXZlIHNlbGVjdGlvbiB0byBjb250ZW50ZWRpdGFibGUgZWxlbWVudFxuICAgICAgICAgICAgcmVzdG9yZVNlbGVjdGlvbiggbm9kZV93eXNpd3lnLCBwb3B1cF9zYXZlZF9zZWxlY3Rpb24gKTtcbiAgICAgICAgICAgIC8vIHRyaWVkIHRvIGF2b2lkIGZvcmNpbmcgZm9jdXMoKSwgYnV0IC4uLiAtIGh0dHBzOi8vZ2l0aHViLmNvbS93eXNpd3lnanMvd3lzaXd5Zy5qcy9pc3N1ZXMvNTFcbiAgICAgICAgICAgIG5vZGVfd3lzaXd5Zy5mb2N1cygpO1xuICAgICAgICAgICAgaWYoICEgc2VsZWN0aW9uSW5zaWRlKG5vZGVfd3lzaXd5ZywgZm9yY2Vfc2VsZWN0aW9uKSApIC8vIHJldHVybnMgJ3NlbGVjdGlvbiBpbnNpZGUgZWRpdG9yJ1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgLy8gZm9yIHdlYmtpdCwgbW96aWxsYSwgb3BlcmFcbiAgICAgICAgICAgIGlmKCB3aW5kb3cuZ2V0U2VsZWN0aW9uIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBCdWdneSwgY2FsbCB3aXRoaW4gJ3RyeS9jYXRjaCdcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiggZG9jdW1lbnQucXVlcnlDb21tYW5kU3VwcG9ydGVkICYmICEgZG9jdW1lbnQucXVlcnlDb21tYW5kU3VwcG9ydGVkKGNvbW1hbmQpIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmV4ZWNDb21tYW5kKCBjb21tYW5kLCBmYWxzZSwgcGFyYW0gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2goIGUgKSB7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZm9yIElFXG4gICAgICAgICAgICBlbHNlIGlmKCBkb2N1bWVudC5zZWxlY3Rpb24gKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb247XG4gICAgICAgICAgICAgICAgaWYoIHNlbC50eXBlICE9ICdOb25lJyApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmFuZ2UgPSBzZWwuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQnVnZ3ksIGNhbGwgd2l0aGluICd0cnkvY2F0Y2gnXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggISByYW5nZS5xdWVyeUNvbW1hbmRFbmFibGVkKGNvbW1hbmQpIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmFuZ2UuZXhlY0NvbW1hbmQoIGNvbW1hbmQsIGZhbHNlLCBwYXJhbSApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoKCBlICkge1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFdvcmthcm91bmQgSUUxMSAtIGh0dHBzOi8vZ2l0aHViLmNvbS93eXNpd3lnanMvd3lzaXd5Zy5qcy9pc3N1ZXMvMTRcbiAgICAgICAgdmFyIHRyYWlsaW5nRGl2ID0gbnVsbDtcbiAgICAgICAgdmFyIElFdHJhaWxpbmdESVYgPSBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIERldGVjdCBJRSAtIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTc5MDc0NDUvaG93LXRvLWRldGVjdC1pZTExXG4gICAgICAgICAgICBpZiggZG9jdW1lbnQuYWxsIHx8ICEhd2luZG93Lk1TSW5wdXRNZXRob2RDb250ZXh0IClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0cmFpbGluZ0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdESVYnICk7XG4gICAgICAgICAgICAgICAgbm9kZV93eXNpd3lnLmFwcGVuZENoaWxkKCB0cmFpbGluZ0RpdiApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvLyBDb21tYW5kIHN0cnVjdHVyZVxuICAgICAgICBjYWxsVXBkYXRlcyA9IGZ1bmN0aW9uKCBzZWxlY3Rpb25fZGVzdHJveWVkIClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIElFMTEgd29ya2Fyb3VuZFxuICAgICAgICAgICAgaWYoIHRyYWlsaW5nRGl2IClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBub2RlX3d5c2l3eWcucmVtb3ZlQ2hpbGQoIHRyYWlsaW5nRGl2ICk7XG4gICAgICAgICAgICAgICAgdHJhaWxpbmdEaXYgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY2hhbmdlLWhhbmRsZXJcbiAgICAgICAgICAgIGlmKCBkZWJvdW5jZWRfY2hhbmdlSGFuZGxlciApXG4gICAgICAgICAgICAgICAgZGVib3VuY2VkX2NoYW5nZUhhbmRsZXIoKTtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBzYXZlZCBzZWxlY3Rpb25cbiAgICAgICAgICAgIGlmKCBzZWxlY3Rpb25fZGVzdHJveWVkIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb2xsYXBzZVNlbGVjdGlvbkVuZCgpO1xuICAgICAgICAgICAgICAgIHBvcHVwX3NhdmVkX3NlbGVjdGlvbiA9IG51bGw7IC8vIHNlbGVjdGlvbiBkZXN0cm95ZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoIHBvcHVwX3NhdmVkX3NlbGVjdGlvbiApXG4gICAgICAgICAgICAgICAgcG9wdXBfc2F2ZWRfc2VsZWN0aW9uID0gc2F2ZVNlbGVjdGlvbiggbm9kZV93eXNpd3lnICk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvLyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICBnZXRFbGVtZW50OiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGVfd3lzaXd5ZztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRIVE1MOiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGVfd3lzaXd5Zy5pbm5lckhUTUw7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0SFRNTDogZnVuY3Rpb24oIGh0bWwgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5vZGVfd3lzaXd5Zy5pbm5lckhUTUwgPSBodG1sIHx8ICc8YnI+JztcbiAgICAgICAgICAgICAgICBjYWxsVXBkYXRlcyggdHJ1ZSApOyAvLyBzZWxlY3Rpb24gZGVzdHJveWVkXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0U2VsZWN0ZWRIVE1MOiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVzdG9yZVNlbGVjdGlvbiggbm9kZV93eXNpd3lnLCBwb3B1cF9zYXZlZF9zZWxlY3Rpb24gKTtcbiAgICAgICAgICAgICAgICBpZiggISBzZWxlY3Rpb25JbnNpZGUobm9kZV93eXNpd3lnKSApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRTZWxlY3Rpb25IdG1sKCBub2RlX3d5c2l3eWcgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzeW5jOiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYoIHN5bmNUZXh0YXJlYSApXG4gICAgICAgICAgICAgICAgICAgIHN5bmNUZXh0YXJlYSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlYWRPbmx5OiBmdW5jdGlvbiggcmVhZG9ubHkgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIHF1ZXJ5IHJlYWQtb25seVxuICAgICAgICAgICAgICAgIGlmKCByZWFkb25seSA9PT0gdW5kZWZpbmVkIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGVfd3lzaXd5Zy5oYXNBdHRyaWJ1dGUgPyAhbm9kZV93eXNpd3lnLmhhc0F0dHJpYnV0ZSgnY29udGVudEVkaXRhYmxlJykgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFub2RlX3d5c2l3eWcuZ2V0QXR0cmlidXRlKCdjb250ZW50RWRpdGFibGUnKTsgLy8gSUU3XG4gICAgICAgICAgICAgICAgLy8gc2V0IHJlYWQtb25seVxuICAgICAgICAgICAgICAgIGlmKCByZWFkb25seSApXG4gICAgICAgICAgICAgICAgICAgIG5vZGVfd3lzaXd5Zy5yZW1vdmVBdHRyaWJ1dGUoICdjb250ZW50RWRpdGFibGUnICk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBub2RlX3d5c2l3eWcuc2V0QXR0cmlidXRlKCAnY29udGVudEVkaXRhYmxlJywgJ3RydWUnICk7IC8vIElFNyBpcyBjYXNlIHNlbnNpdGl2ZVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIHNlbGVjdGlvbiBhbmQgcG9wdXBcbiAgICAgICAgICAgIGNvbGxhcHNlU2VsZWN0aW9uOiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29sbGFwc2VTZWxlY3Rpb25FbmQoKTtcbiAgICAgICAgICAgICAgICBwb3B1cF9zYXZlZF9zZWxlY3Rpb24gPSBudWxsOyAvLyBzZWxlY3Rpb24gZGVzdHJveWVkXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXhwYW5kU2VsZWN0aW9uOiBmdW5jdGlvbiggcHJlY2VkaW5nLCBmb2xsb3dpbmcgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlc3RvcmVTZWxlY3Rpb24oIG5vZGVfd3lzaXd5ZywgcG9wdXBfc2F2ZWRfc2VsZWN0aW9uICk7XG4gICAgICAgICAgICAgICAgaWYoICEgc2VsZWN0aW9uSW5zaWRlKG5vZGVfd3lzaXd5ZykgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICBleHBhbmRTZWxlY3Rpb25DYXJldCggbm9kZV93eXNpd3lnLCBwcmVjZWRpbmcsIGZvbGxvd2luZyApO1xuICAgICAgICAgICAgICAgIHBvcHVwX3NhdmVkX3NlbGVjdGlvbiA9IHNhdmVTZWxlY3Rpb24oIG5vZGVfd3lzaXd5ZyApOyAvLyBzYXZlIG5ldyBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcGVuUG9wdXA6IGZ1bmN0aW9uKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiggISBwb3B1cF9zYXZlZF9zZWxlY3Rpb24gKVxuICAgICAgICAgICAgICAgICAgICBwb3B1cF9zYXZlZF9zZWxlY3Rpb24gPSBzYXZlU2VsZWN0aW9uKCBub2RlX3d5c2l3eWcgKTsgLy8gc2F2ZSBjdXJyZW50IHNlbGVjdGlvblxuICAgICAgICAgICAgICAgIHJldHVybiBwb3B1cE9wZW4oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZVBvcHVwOiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcG9wdXBDbG9zZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbW92ZUZvcm1hdDogZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGV4ZWNDb21tYW5kKCAncmVtb3ZlRm9ybWF0JyApO1xuICAgICAgICAgICAgICAgIGV4ZWNDb21tYW5kKCAndW5saW5rJyApO1xuICAgICAgICAgICAgICAgIGNhbGxVcGRhdGVzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9sZDogZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGV4ZWNDb21tYW5kKCAnYm9sZCcgKTtcbiAgICAgICAgICAgICAgICBjYWxsVXBkYXRlcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGl0YWxpYzogZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGV4ZWNDb21tYW5kKCAnaXRhbGljJyApO1xuICAgICAgICAgICAgICAgIGNhbGxVcGRhdGVzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdW5kZXJsaW5lOiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZXhlY0NvbW1hbmQoICd1bmRlcmxpbmUnICk7XG4gICAgICAgICAgICAgICAgY2FsbFVwZGF0ZXMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdHJpa2V0aHJvdWdoOiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZXhlY0NvbW1hbmQoICdzdHJpa2VUaHJvdWdoJyApO1xuICAgICAgICAgICAgICAgIGNhbGxVcGRhdGVzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9yZWNvbG9yOiBmdW5jdGlvbiggY29sb3IgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGV4ZWNDb21tYW5kKCAnZm9yZUNvbG9yJywgY29sb3IgKTtcbiAgICAgICAgICAgICAgICBjYWxsVXBkYXRlcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhpZ2hsaWdodDogZnVuY3Rpb24oIGNvbG9yIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI3NTY5MzEvaGlnaGxpZ2h0LXRoZS10ZXh0LW9mLXRoZS1kb20tcmFuZ2UtZWxlbWVudFxuICAgICAgICAgICAgICAgIGlmKCAhIGV4ZWNDb21tYW5kKCdoaWxpdGVDb2xvcicsY29sb3IpICkgLy8gc29tZSBicm93c2VycyBhcHBseSAnYmFja0NvbG9yJyB0byB0aGUgd2hvbGUgYmxvY2tcbiAgICAgICAgICAgICAgICAgICAgZXhlY0NvbW1hbmQoICdiYWNrQ29sb3InLCBjb2xvciApO1xuICAgICAgICAgICAgICAgIGNhbGxVcGRhdGVzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9udE5hbWU6IGZ1bmN0aW9uKCBuYW1lIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBleGVjQ29tbWFuZCggJ2ZvbnROYW1lJywgbmFtZSApO1xuICAgICAgICAgICAgICAgIGNhbGxVcGRhdGVzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9udFNpemU6IGZ1bmN0aW9uKCBzaXplIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBleGVjQ29tbWFuZCggJ2ZvbnRTaXplJywgc2l6ZSApO1xuICAgICAgICAgICAgICAgIGNhbGxVcGRhdGVzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3Vic2NyaXB0OiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZXhlY0NvbW1hbmQoICdzdWJzY3JpcHQnICk7XG4gICAgICAgICAgICAgICAgY2FsbFVwZGF0ZXMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdXBlcnNjcmlwdDogZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGV4ZWNDb21tYW5kKCAnc3VwZXJzY3JpcHQnICk7XG4gICAgICAgICAgICAgICAgY2FsbFVwZGF0ZXMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbGlnbjogZnVuY3Rpb24oIGFsaWduIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBJRXRyYWlsaW5nRElWKCk7XG4gICAgICAgICAgICAgICAgaWYoIGFsaWduID09ICdsZWZ0JyApXG4gICAgICAgICAgICAgICAgICAgIGV4ZWNDb21tYW5kKCAnanVzdGlmeUxlZnQnICk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiggYWxpZ24gPT0gJ2NlbnRlcicgKVxuICAgICAgICAgICAgICAgICAgICBleGVjQ29tbWFuZCggJ2p1c3RpZnlDZW50ZXInICk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiggYWxpZ24gPT0gJ3JpZ2h0JyApXG4gICAgICAgICAgICAgICAgICAgIGV4ZWNDb21tYW5kKCAnanVzdGlmeVJpZ2h0JyApO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYoIGFsaWduID09ICdqdXN0aWZ5JyApXG4gICAgICAgICAgICAgICAgICAgIGV4ZWNDb21tYW5kKCAnanVzdGlmeUZ1bGwnICk7XG4gICAgICAgICAgICAgICAgY2FsbFVwZGF0ZXMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXQ6IGZ1bmN0aW9uKCB0YWduYW1lIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBJRXRyYWlsaW5nRElWKCk7XG4gICAgICAgICAgICAgICAgZXhlY0NvbW1hbmQoICdmb3JtYXRCbG9jaycsIHRhZ25hbWUgKTtcbiAgICAgICAgICAgICAgICBjYWxsVXBkYXRlcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluZGVudDogZnVuY3Rpb24oIG91dGRlbnQgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIElFdHJhaWxpbmdESVYoKTtcbiAgICAgICAgICAgICAgICBleGVjQ29tbWFuZCggb3V0ZGVudCA/ICdvdXRkZW50JyA6ICdpbmRlbnQnICk7XG4gICAgICAgICAgICAgICAgY2FsbFVwZGF0ZXMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbnNlcnRMaW5rOiBmdW5jdGlvbiggdXJsIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBleGVjQ29tbWFuZCggJ2NyZWF0ZUxpbmsnLCB1cmwgKTtcbiAgICAgICAgICAgICAgICBjYWxsVXBkYXRlcyggdHJ1ZSApOyAvLyBzZWxlY3Rpb24gZGVzdHJveWVkXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5zZXJ0SW1hZ2U6IGZ1bmN0aW9uKCB1cmwgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGV4ZWNDb21tYW5kKCAnaW5zZXJ0SW1hZ2UnLCB1cmwsIHRydWUgKTtcbiAgICAgICAgICAgICAgICBjYWxsVXBkYXRlcyggdHJ1ZSApOyAvLyBzZWxlY3Rpb24gZGVzdHJveWVkXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5zZXJ0SFRNTDogZnVuY3Rpb24oIGh0bWwgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmKCAhIGV4ZWNDb21tYW5kKCdpbnNlcnRIVE1MJywgaHRtbCwgdHJ1ZSkgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSUUgMTEgc3RpbGwgZG9lcyBub3Qgc3VwcG9ydCAnaW5zZXJ0SFRNTCdcbiAgICAgICAgICAgICAgICAgICAgcmVzdG9yZVNlbGVjdGlvbiggbm9kZV93eXNpd3lnLCBwb3B1cF9zYXZlZF9zZWxlY3Rpb24gKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uSW5zaWRlKCBub2RlX3d5c2l3eWcsIHRydWUgKTtcbiAgICAgICAgICAgICAgICAgICAgcGFzdGVIdG1sQXRDYXJldCggbm9kZV93eXNpd3lnLCBodG1sICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGxVcGRhdGVzKCB0cnVlICk7IC8vIHNlbGVjdGlvbiBkZXN0cm95ZWRcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbnNlcnRMaXN0OiBmdW5jdGlvbiggb3JkZXJlZCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgSUV0cmFpbGluZ0RJVigpO1xuICAgICAgICAgICAgICAgIGV4ZWNDb21tYW5kKCBvcmRlcmVkID8gJ2luc2VydE9yZGVyZWRMaXN0JyA6ICdpbnNlcnRVbm9yZGVyZWRMaXN0JyApO1xuICAgICAgICAgICAgICAgIGNhbGxVcGRhdGVzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHJldHVybiB3eXNpd3lnO1xufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvbGliL3d5c2l3eWcuanNcbiAqKi8iLCIoZnVuY3Rpb24oZmFjdG9yeSkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbJ2pxdWVyeSddLCBmdW5jdGlvbigkKXtcbiAgICAgICAgICAgIHJldHVybiBmYWN0b3J5KHdpbmRvdywgZG9jdW1lbnQsICQpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkod2luZG93LCBkb2N1bWVudCwgcmVxdWlyZSgnanF1ZXJ5JykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWN0b3J5KHdpbmRvdywgZG9jdW1lbnQsIGpRdWVyeSk7XG4gICAgfVxufSkoZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNzI0MjE0NC9qYXZhc2NyaXB0LWNvbnZlcnQtaHNiLWhzdi1jb2xvci10by1yZ2ItYWNjdXJhdGVseVxuICAgIHZhciBIU1Z0b1JHQiA9IGZ1bmN0aW9uKCBoLCBzLCB2IClcbiAgICB7XG4gICAgICAgIHZhciByLCBnLCBiLCBpLCBmLCBwLCBxLCB0O1xuICAgICAgICBpID0gTWF0aC5mbG9vcihoICogNik7XG4gICAgICAgIGYgPSBoICogNiAtIGk7XG4gICAgICAgIHAgPSB2ICogKDEgLSBzKTtcbiAgICAgICAgcSA9IHYgKiAoMSAtIGYgKiBzKTtcbiAgICAgICAgdCA9IHYgKiAoMSAtICgxIC0gZikgKiBzKTtcbiAgICAgICAgc3dpdGNoIChpICUgNilcbiAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAwOiByID0gdiwgZyA9IHQsIGIgPSBwOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTogciA9IHEsIGcgPSB2LCBiID0gcDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6IHIgPSBwLCBnID0gdiwgYiA9IHQ7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOiByID0gcCwgZyA9IHEsIGIgPSB2OyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDogciA9IHQsIGcgPSBwLCBiID0gdjsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDU6IHIgPSB2LCBnID0gcCwgYiA9IHE7IGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHZhciBociA9IE1hdGguZmxvb3IociAqIDI1NSkudG9TdHJpbmcoMTYpO1xuICAgICAgICB2YXIgaGcgPSBNYXRoLmZsb29yKGcgKiAyNTUpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgdmFyIGhiID0gTWF0aC5mbG9vcihiICogMjU1KS50b1N0cmluZygxNik7XG4gICAgICAgIHJldHVybiAnIycgKyAoaHIubGVuZ3RoIDwgMiA/ICcwJyA6ICcnKSArIGhyICtcbiAgICAgICAgICAgICAgICAgICAgIChoZy5sZW5ndGggPCAyID8gJzAnIDogJycpICsgaGcgK1xuICAgICAgICAgICAgICAgICAgICAgKGhiLmxlbmd0aCA8IDIgPyAnMCcgOiAnJykgKyBoYjtcbiAgICB9O1xuXG4gICAgLy8gRW5jb2RlIGh0bWxlbnRpdGllcygpIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NDk5MDc4L2Zhc3Rlc3QtbWV0aG9kLXRvLWVzY2FwZS1odG1sLXRhZ3MtYXMtaHRtbC1lbnRpdGllc1xuICAgIHZhciBodG1sX2VuY29kZSA9IGZ1bmN0aW9uKCBzdHJpbmcgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bJjw+XCJdL2csIGZ1bmN0aW9uKHRhZylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGNoYXJzVG9SZXBsYWNlID0ge1xuICAgICAgICAgICAgICAgICcmJzogJyZhbXA7JyxcbiAgICAgICAgICAgICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICAgICAgICAgICAnPic6ICcmZ3Q7JyxcbiAgICAgICAgICAgICAgICAnXCInOiAnJnF1b3Q7J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBjaGFyc1RvUmVwbGFjZVt0YWddIHx8IHRhZztcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIENyZWF0ZSB0aGUgRWRpdG9yXG4gICAgdmFyIGNyZWF0ZV9lZGl0b3IgPSBmdW5jdGlvbiggJHRleHRhcmVhLCBjbGFzc2VzLCBwbGFjZWhvbGRlciwgdG9vbGJhcl9wb3NpdGlvbiwgdG9vbGJhcl9idXR0b25zLCB0b29sYmFyX3N1Ym1pdCwgbGFiZWxfc2VsZWN0SW1hZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJfdXJsLCBwbGFjZWhvbGRlcl9lbWJlZCwgbWF4X2ltYWdlc2l6ZSwgZmlsdGVyX2ltYWdlVHlwZSwgb25faW1hZ2V1cGxvYWQsIGZvcmNlX2ltYWdldXBsb2FkLCB2aWRlb19mcm9tX3VybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbl9rZXlkb3duLCBvbl9rZXlwcmVzcywgb25fa2V5dXAsIG9uX2F1dG9jb21wbGV0ZSApXG4gICAge1xuICAgICAgICAvLyBDb250ZW50OiBJbnNlcnQgbGlua1xuICAgICAgICB2YXIgd3lzaXd5Z2VkaXRvcl9pbnNlcnRMaW5rID0gZnVuY3Rpb24oIHd5c2l3eWdlZGl0b3IsIHVybCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKCAhIHVybCApXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgZWxzZSBpZiggd3lzaXd5Z2VkaXRvci5nZXRTZWxlY3RlZEhUTUwoKSApXG4gICAgICAgICAgICAgICAgd3lzaXd5Z2VkaXRvci5pbnNlcnRMaW5rKCB1cmwgKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB3eXNpd3lnZWRpdG9yLmluc2VydEhUTUwoICc8YSBocmVmPVwiJyArIGh0bWxfZW5jb2RlKHVybCkgKyAnXCI+JyArIGh0bWxfZW5jb2RlKHVybCkgKyAnPC9hPicgKTtcbiAgICAgICAgICAgIHd5c2l3eWdlZGl0b3IuY2xvc2VQb3B1cCgpLmNvbGxhcHNlU2VsZWN0aW9uKCk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBjb250ZW50X2luc2VydGxpbmsgPSBmdW5jdGlvbih3eXNpd3lnZWRpdG9yLCAkbW9kaWZ5X2xpbmspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciAkaW5wdXR1cmwgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIiB2YWx1ZT1cIlwiPicpLnZhbCggJG1vZGlmeV9saW5rID8gJG1vZGlmeV9saW5rLmF0dHIoJ2hyZWYnKSA6ICcnICkgIC8vIHByb3AoJ2hyZWYnKSBkb2VzIG5vdCByZWZsZWN0IHJlYWwgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCd3eXNpd3lnLWlucHV0JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmtleXByZXNzKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBldmVudC53aGljaCAhPSAxMCAmJiBldmVudC53aGljaCAhPSAxMyApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCAkbW9kaWZ5X2xpbmsgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRtb2RpZnlfbGluay5wcm9wKCAnaHJlZicsICRpbnB1dHVybC52YWwoKSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd5c2l3eWdlZGl0b3IuY2xvc2VQb3B1cCgpLmNvbGxhcHNlU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3lzaXd5Z2VkaXRvcl9pbnNlcnRMaW5rKCB3eXNpd3lnZWRpdG9yLCRpbnB1dHVybC52YWwoKSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmKCBwbGFjZWhvbGRlcl91cmwgKVxuICAgICAgICAgICAgICAgICRpbnB1dHVybC5wcm9wKCAncGxhY2Vob2xkZXInLCBwbGFjZWhvbGRlcl91cmwgKTtcbiAgICAgICAgICAgIHZhciAkb2theWJ1dHRvbiA9ICQoKTtcbiAgICAgICAgICAgIGlmKCB0b29sYmFyX3N1Ym1pdCApXG4gICAgICAgICAgICAgICAgJG9rYXlidXR0b24gPSB0b29sYmFyX2J1dHRvbih0b29sYmFyX3N1Ym1pdCkuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoICRtb2RpZnlfbGluayApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1vZGlmeV9saW5rLnByb3AoICdocmVmJywgJGlucHV0dXJsLnZhbCgpICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3lzaXd5Z2VkaXRvci5jbG9zZVBvcHVwKCkuY29sbGFwc2VTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eXNpd3lnZWRpdG9yX2luc2VydExpbmsoIHd5c2l3eWdlZGl0b3IsICRpbnB1dHVybC52YWwoKSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciAkY29udGVudCA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCd3eXNpd3lnLXRvb2xiYXItZm9ybScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5wcm9wKCd1bnNlbGVjdGFibGUnLCdvbicpO1xuICAgICAgICAgICAgJGNvbnRlbnQuYXBwZW5kKCRpbnB1dHVybCkuYXBwZW5kKCRva2F5YnV0dG9uKTtcbiAgICAgICAgICAgIHJldHVybiAkY29udGVudDtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBDb250ZW50OiBJbnNlcnQgaW1hZ2VcbiAgICAgICAgdmFyIGNvbnRlbnRfaW5zZXJ0aW1hZ2UgPSBmdW5jdGlvbih3eXNpd3lnZWRpdG9yKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBBZGQgaW1hZ2UgdG8gZWRpdG9yXG4gICAgICAgICAgICB2YXIgaW5zZXJ0X2ltYWdlX3d5c2l3eWcgPSBmdW5jdGlvbiggdXJsLCBmaWxlbmFtZSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSAnPGltZyBpZD1cInd5c2l3eWctaW5zZXJ0LWltYWdlXCIgc3JjPVwiXCIgYWx0PVwiXCInICsgKGZpbGVuYW1lID8gJyB0aXRsZT1cIicraHRtbF9lbmNvZGUoZmlsZW5hbWUpKydcIicgOiAnJykgKyAnPic7XG4gICAgICAgICAgICAgICAgd3lzaXd5Z2VkaXRvci5pbnNlcnRIVE1MKCBodG1sICkuY2xvc2VQb3B1cCgpLmNvbGxhcHNlU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgdmFyICRpbWFnZSA9ICQoJyN3eXNpd3lnLWluc2VydC1pbWFnZScpLnJlbW92ZUF0dHIoJ2lkJyk7XG4gICAgICAgICAgICAgICAgaWYoIG1heF9pbWFnZXNpemUgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJGltYWdlLmNzcyh7bWF4V2lkdGg6IG1heF9pbWFnZXNpemVbMF0rJ3B4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4SGVpZ2h0OiBtYXhfaW1hZ2VzaXplWzFdKydweCd9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAubG9hZCggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpbWFnZS5jc3Moe21heFdpZHRoOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4SGVpZ2h0OiAnJ30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZXNpemUgJGltYWdlIHRvIGZpdCBcImNsaXAtaW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2Vfd2lkdGggPSAkaW1hZ2Uud2lkdGgoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlX2hlaWdodCA9ICRpbWFnZS5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGltYWdlX3dpZHRoID4gbWF4X2ltYWdlc2l6ZVswXSB8fCBpbWFnZV9oZWlnaHQgPiBtYXhfaW1hZ2VzaXplWzFdIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIChpbWFnZV93aWR0aC9pbWFnZV9oZWlnaHQpID4gKG1heF9pbWFnZXNpemVbMF0vbWF4X2ltYWdlc2l6ZVsxXSkgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlX2hlaWdodCA9IHBhcnNlSW50KGltYWdlX2hlaWdodCAvIGltYWdlX3dpZHRoICogbWF4X2ltYWdlc2l6ZVswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2Vfd2lkdGggPSBtYXhfaW1hZ2VzaXplWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlX3dpZHRoID0gcGFyc2VJbnQoaW1hZ2Vfd2lkdGggLyBpbWFnZV9oZWlnaHQgKiBtYXhfaW1hZ2VzaXplWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZV9oZWlnaHQgPSBtYXhfaW1hZ2VzaXplWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGltYWdlLnByb3AoJ3dpZHRoJyxpbWFnZV93aWR0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5wcm9wKCdoZWlnaHQnLGltYWdlX2hlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJGltYWdlLnByb3AoJ3NyYycsIHVybCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gQ3JlYXRlIHBvcHVwXG4gICAgICAgICAgICB2YXIgJGNvbnRlbnQgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcygnd3lzaXd5Zy10b29sYmFyLWZvcm0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucHJvcCgndW5zZWxlY3RhYmxlJywnb24nKTtcbiAgICAgICAgICAgIC8vIEFkZCBpbWFnZSB2aWEgJ0Jyb3dzZS4uLidcbiAgICAgICAgICAgIHZhciAkZmlsZXVwbG9hZGVyID0gbnVsbCxcbiAgICAgICAgICAgICAgICAkZmlsZXVwbG9hZGVyX2lucHV0ID0gJCgnPGlucHV0IHR5cGU9XCJmaWxlXCI+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKHtwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcid9KTtcbiAgICAgICAgICAgIGlmKCAhIGZvcmNlX2ltYWdldXBsb2FkICYmIHdpbmRvdy5GaWxlICYmIHdpbmRvdy5GaWxlUmVhZGVyICYmIHdpbmRvdy5GaWxlTGlzdCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gRmlsZS1BUElcbiAgICAgICAgICAgICAgICB2YXIgbG9hZEltYWdlRnJvbUZpbGUgPSBmdW5jdGlvbiggZmlsZSApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IHByb2Nlc3MgaW1hZ2UgZmlsZXNcbiAgICAgICAgICAgICAgICAgICAgaWYoIHR5cGVvZihmaWx0ZXJfaW1hZ2VUeXBlKSA9PT0gJ2Z1bmN0aW9uJyAmJiAhIGZpbHRlcl9pbWFnZVR5cGUoZmlsZSkgKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKCAhIGZpbGUudHlwZS5tYXRjaChmaWx0ZXJfaW1hZ2VUeXBlKSApXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhdXJsID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydF9pbWFnZV93eXNpd3lnKCBkYXRhdXJsLCBmaWxlLm5hbWUgKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVhZCBpbiB0aGUgaW1hZ2UgZmlsZSBhcyBhIGRhdGEgVVJMXG4gICAgICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKCBmaWxlICk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAkZmlsZXVwbG9hZGVyID0gJGZpbGV1cGxvYWRlcl9pbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2RyYWdnYWJsZScsJ3RydWUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNoYW5nZShmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVzID0gZXZlbnQudGFyZ2V0LmZpbGVzOyAvLyBGaWxlTGlzdCBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaSA8IGZpbGVzLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkSW1hZ2VGcm9tRmlsZSggZmlsZXNbaV0gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2RyYWdvdmVyJyxmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdjb3B5JzsgLy8gRXhwbGljaXRseSBzaG93IHRoaXMgaXMgYSBjb3B5LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbignZHJvcCcsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZXMgPSBldmVudC5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5maWxlczsgLy8gRmlsZUxpc3Qgb2JqZWN0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpIDwgZmlsZXMubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRJbWFnZUZyb21GaWxlKCBmaWxlc1tpXSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKCBvbl9pbWFnZXVwbG9hZCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gVXBsb2FkIGltYWdlIHRvIGEgc2VydmVyXG4gICAgICAgICAgICAgICAgdmFyICRpbnB1dCA9ICRmaWxldXBsb2FkZXJfaW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jaGFuZ2UoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uX2ltYWdldXBsb2FkLmNhbGwoIHRoaXMsIGluc2VydF9pbWFnZV93eXNpd3lnICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkZmlsZXVwbG9hZGVyID0gJCgnPGZvcm0vPicpLmFwcGVuZCgkaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoICRmaWxldXBsb2FkZXIgKVxuICAgICAgICAgICAgICAgICQoJzxkaXYvPicpLmFkZENsYXNzKCAnd3lzaXd5Zy1icm93c2UnIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5odG1sKCBsYWJlbF9zZWxlY3RJbWFnZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCAkZmlsZXVwbG9hZGVyIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyggJGNvbnRlbnQgKTtcbiAgICAgICAgICAgIC8vIEFkZCBpbWFnZSB2aWEgJ1VSTCdcbiAgICAgICAgICAgIHZhciAkaW5wdXR1cmwgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIiB2YWx1ZT1cIlwiPicpLmFkZENsYXNzKCd3eXNpd3lnLWlucHV0JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmtleXByZXNzKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBldmVudC53aGljaCA9PSAxMCB8fCBldmVudC53aGljaCA9PSAxMyApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0X2ltYWdlX3d5c2l3eWcoICRpbnB1dHVybC52YWwoKSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmKCBwbGFjZWhvbGRlcl91cmwgKVxuICAgICAgICAgICAgICAgICRpbnB1dHVybC5wcm9wKCAncGxhY2Vob2xkZXInLCBwbGFjZWhvbGRlcl91cmwgKTtcbiAgICAgICAgICAgIHZhciAkb2theWJ1dHRvbiA9ICQoKTtcbiAgICAgICAgICAgIGlmKCB0b29sYmFyX3N1Ym1pdCApXG4gICAgICAgICAgICAgICAgJG9rYXlidXR0b24gPSB0b29sYmFyX2J1dHRvbih0b29sYmFyX3N1Ym1pdCkuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0X2ltYWdlX3d5c2l3eWcoICRpbnB1dHVybC52YWwoKSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRjb250ZW50LmFwcGVuZCggJCgnPGRpdi8+JykuYXBwZW5kKCRpbnB1dHVybCkuYXBwZW5kKCRva2F5YnV0dG9uKSApO1xuICAgICAgICAgICAgcmV0dXJuICRjb250ZW50O1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIENvbnRlbnQ6IEluc2VydCB2aWRlb1xuICAgICAgICB2YXIgY29udGVudF9pbnNlcnR2aWRlbyA9IGZ1bmN0aW9uKHd5c2l3eWdlZGl0b3IpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIEFkZCB2aWRlbyB0byBlZGl0b3JcbiAgICAgICAgICAgIHZhciBpbnNlcnRfdmlkZW9fd3lzaXd5ZyA9IGZ1bmN0aW9uKCB1cmwsIGh0bWwgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHVybCA9ICQudHJpbSh1cmx8fCcnKTtcbiAgICAgICAgICAgICAgICBodG1sID0gJC50cmltKGh0bWx8fCcnKTtcbiAgICAgICAgICAgICAgICB2YXIgd2Vic2l0ZV91cmwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiggdXJsLmxlbmd0aCAmJiAhIGh0bWwubGVuZ3RoIClcbiAgICAgICAgICAgICAgICAgICAgd2Vic2l0ZV91cmwgPSB1cmw7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiggaHRtbC5pbmRleE9mKCc8JykgPT0gLTEgJiYgaHRtbC5pbmRleE9mKCc+JykgPT0gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICBodG1sLm1hdGNoKC9eKD86aHR0cHM/OlxcLyk/XFwvPyg/OlteOlxcL1xcc10rKSg/Oig/OlxcL1xcdyspKlxcLykoPzpbXFx3XFwtXFwuXStbXiM/XFxzXSspKD86LiopPyg/OiNbXFx3XFwtXSspPyQvKSApXG4gICAgICAgICAgICAgICAgICAgIHdlYnNpdGVfdXJsID0gaHRtbDtcbiAgICAgICAgICAgICAgICBpZiggd2Vic2l0ZV91cmwgJiYgdmlkZW9fZnJvbV91cmwgKVxuICAgICAgICAgICAgICAgICAgICBodG1sID0gdmlkZW9fZnJvbV91cmwoIHdlYnNpdGVfdXJsICkgfHwgJyc7XG4gICAgICAgICAgICAgICAgaWYoICEgaHRtbC5sZW5ndGggJiYgd2Vic2l0ZV91cmwgKVxuICAgICAgICAgICAgICAgICAgICBodG1sID0gJzx2aWRlbyBzcmM9XCInICsgaHRtbF9lbmNvZGUod2Vic2l0ZV91cmwpICsgJ1wiPic7XG4gICAgICAgICAgICAgICAgd3lzaXd5Z2VkaXRvci5pbnNlcnRIVE1MKCBodG1sICkuY2xvc2VQb3B1cCgpLmNvbGxhcHNlU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gQ3JlYXRlIHBvcHVwXG4gICAgICAgICAgICB2YXIgJGNvbnRlbnQgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcygnd3lzaXd5Zy10b29sYmFyLWZvcm0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucHJvcCgndW5zZWxlY3RhYmxlJywnb24nKTtcbiAgICAgICAgICAgIC8vIEFkZCB2aWRlbyB2aWEgJzxlbWJlZC8+J1xuICAgICAgICAgICAgdmFyICR0ZXh0YXJlYWVtYmVkID0gJCgnPHRleHRhcmVhPicpLmFkZENsYXNzKCd3eXNpd3lnLWlucHV0IHd5c2l3eWctaW5wdXR0ZXh0YXJlYScpO1xuICAgICAgICAgICAgaWYoIHBsYWNlaG9sZGVyX2VtYmVkIClcbiAgICAgICAgICAgICAgICAkdGV4dGFyZWFlbWJlZC5wcm9wKCAncGxhY2Vob2xkZXInLCBwbGFjZWhvbGRlcl9lbWJlZCApO1xuICAgICAgICAgICAgJCgnPGRpdi8+JykuYWRkQ2xhc3MoICd3eXNpd3lnLWVtYmVkY29kZScgKVxuICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCAkdGV4dGFyZWFlbWJlZCApXG4gICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyggJGNvbnRlbnQgKTtcbiAgICAgICAgICAgIC8vIEFkZCB2aWRlbyB2aWEgJ1VSTCdcbiAgICAgICAgICAgIHZhciAkaW5wdXR1cmwgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIiB2YWx1ZT1cIlwiPicpLmFkZENsYXNzKCd3eXNpd3lnLWlucHV0JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmtleXByZXNzKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBldmVudC53aGljaCA9PSAxMCB8fCBldmVudC53aGljaCA9PSAxMyApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0X3ZpZGVvX3d5c2l3eWcoICRpbnB1dHVybC52YWwoKSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmKCBwbGFjZWhvbGRlcl91cmwgKVxuICAgICAgICAgICAgICAgICRpbnB1dHVybC5wcm9wKCAncGxhY2Vob2xkZXInLCBwbGFjZWhvbGRlcl91cmwgKTtcbiAgICAgICAgICAgIHZhciAkb2theWJ1dHRvbiA9ICQoKTtcbiAgICAgICAgICAgIGlmKCB0b29sYmFyX3N1Ym1pdCApXG4gICAgICAgICAgICAgICAgJG9rYXlidXR0b24gPSB0b29sYmFyX2J1dHRvbih0b29sYmFyX3N1Ym1pdCkuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0X3ZpZGVvX3d5c2l3eWcoICRpbnB1dHVybC52YWwoKSwgJHRleHRhcmVhZW1iZWQudmFsKCkgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkY29udGVudC5hcHBlbmQoICQoJzxkaXYvPicpLmFwcGVuZCgkaW5wdXR1cmwpLmFwcGVuZCgkb2theWJ1dHRvbikgKTtcbiAgICAgICAgICAgIHJldHVybiAkY29udGVudDtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBDb250ZW50OiBDb2xvciBwYWxldHRlXG4gICAgICAgIHZhciBjb250ZW50X2NvbG9ycGFsZXR0ZSA9IGZ1bmN0aW9uKCB3eXNpd3lnZWRpdG9yLCBmb3JlY29sb3IgKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgJGNvbnRlbnQgPSAkKCc8dGFibGUvPicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NlbGxwYWRkaW5nJywnMCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NlbGxzcGFjaW5nJywnMCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnByb3AoJ3Vuc2VsZWN0YWJsZScsJ29uJyk7XG4gICAgICAgICAgICBmb3IoIHZhciByb3c9MTsgcm93IDwgMTU7ICsrcm93ICkgLy8gc2hvdWxkIGJlICcxNicgLSBidXQgbGFzdCBsaW5lIGxvb2tzIHNvIGRhcmtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgJHJvd3MgPSAkKCc8dHIvPicpO1xuICAgICAgICAgICAgICAgIGZvciggdmFyIGNvbD0wOyBjb2wgPCAyNTsgKytjb2wgKSAvLyBsYXN0IGNvbHVtbiBpcyBncmF5c2NhbGVcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgaWYoIGNvbCA9PSAyNCApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncmF5ID0gTWF0aC5mbG9vcigyNTUgLyAxMyAqICgxNCAtIHJvdykpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoZXhnID0gKGdyYXkubGVuZ3RoIDwgMiA/ICcwJyA6ICcnKSArIGdyYXk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9ICcjJyArIGhleGcgKyBoZXhnICsgaGV4ZztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodWUgICAgICAgID0gY29sIC8gMjQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2F0dXJhdGlvbiA9IHJvdyA8PSA4ID8gcm93ICAgICAvOCA6IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgICAgICA9IHJvdyAgPiA4ID8gKDE2LXJvdykvOCA6IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9IEhTVnRvUkdCKCBodWUsIHNhdHVyYXRpb24sIHZhbHVlICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJCgnPHRkLz4nKS5hZGRDbGFzcygnd3lzaXd5Zy10b29sYmFyLWNvbG9yJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5wcm9wKCd0aXRsZScsIGNvbG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnByb3AoJ3Vuc2VsZWN0YWJsZScsJ29uJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3Moe2JhY2tncm91bmRDb2xvcjogY29sb3J9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gdGhpcy50aXRsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggZm9yZWNvbG9yIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3lzaXd5Z2VkaXRvci5mb3JlY29sb3IoIGNvbG9yICkuY2xvc2VQb3B1cCgpLmNvbGxhcHNlU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eXNpd3lnZWRpdG9yLmhpZ2hsaWdodCggY29sb3IgKS5jbG9zZVBvcHVwKCkuY29sbGFwc2VTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKCAkcm93cyApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkY29udGVudC5hcHBlbmQoICRyb3dzICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJGNvbnRlbnQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gSGFuZGxlcnNcbiAgICAgICAgdmFyIGdldF90b29sYmFyX2hhbmRsZXIgPSBmdW5jdGlvbiggbmFtZSwgcG9wdXBfY2FsbGJhY2sgKVxuICAgICAgICB7XG4gICAgICAgICAgICBzd2l0Y2goIG5hbWUgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2luc2VydGltYWdlJzpcbiAgICAgICAgICAgICAgICAgICAgaWYoICEgcG9wdXBfY2FsbGJhY2sgKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiggdGFyZ2V0ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXBfY2FsbGJhY2soIGNvbnRlbnRfaW5zZXJ0aW1hZ2Uod3lzaXd5Z2VkaXRvciksIHRhcmdldCApO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2luc2VydHZpZGVvJzpcbiAgICAgICAgICAgICAgICAgICAgaWYoICEgcG9wdXBfY2FsbGJhY2sgKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiggdGFyZ2V0ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXBfY2FsbGJhY2soIGNvbnRlbnRfaW5zZXJ0dmlkZW8od3lzaXd5Z2VkaXRvciksIHRhcmdldCApO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2luc2VydGxpbmsnOlxuICAgICAgICAgICAgICAgICAgICBpZiggISBwb3B1cF9jYWxsYmFjayApXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCB0YXJnZXQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cF9jYWxsYmFjayggY29udGVudF9pbnNlcnRsaW5rKHd5c2l3eWdlZGl0b3IpLCB0YXJnZXQgKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjYXNlICdib2xkJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd3lzaXd5Z2VkaXRvci5ib2xkKCk7IC8vIC5jbG9zZVBvcHVwKCkuY29sbGFwc2VTZWxlY3Rpb24oKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2l0YWxpYyc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHd5c2l3eWdlZGl0b3IuaXRhbGljKCk7IC8vIC5jbG9zZVBvcHVwKCkuY29sbGFwc2VTZWxlY3Rpb24oKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNhc2UgJ3VuZGVybGluZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHd5c2l3eWdlZGl0b3IudW5kZXJsaW5lKCk7IC8vIC5jbG9zZVBvcHVwKCkuY29sbGFwc2VTZWxlY3Rpb24oKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N0cmlrZXRocm91Z2gnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3eXNpd3lnZWRpdG9yLnN0cmlrZXRocm91Z2goKTsgLy8gLmNsb3NlUG9wdXAoKS5jb2xsYXBzZVNlbGVjdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY2FzZSAnZm9yZWNvbG9yJzpcbiAgICAgICAgICAgICAgICAgICAgaWYoICEgcG9wdXBfY2FsbGJhY2sgKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiggdGFyZ2V0ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXBfY2FsbGJhY2soIGNvbnRlbnRfY29sb3JwYWxldHRlKHd5c2l3eWdlZGl0b3IsdHJ1ZSksIHRhcmdldCApO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2hpZ2hsaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIGlmKCAhIHBvcHVwX2NhbGxiYWNrIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oIHRhcmdldCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwX2NhbGxiYWNrKCBjb250ZW50X2NvbG9ycGFsZXR0ZSh3eXNpd3lnZWRpdG9yLGZhbHNlKSwgdGFyZ2V0ICk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY2FzZSAnYWxpZ25sZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd3lzaXd5Z2VkaXRvci5hbGlnbignbGVmdCcpOyAvLyAuY2xvc2VQb3B1cCgpLmNvbGxhcHNlU2VsZWN0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjYXNlICdhbGlnbmNlbnRlcic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHd5c2l3eWdlZGl0b3IuYWxpZ24oJ2NlbnRlcicpOyAvLyAuY2xvc2VQb3B1cCgpLmNvbGxhcHNlU2VsZWN0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjYXNlICdhbGlnbnJpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd3lzaXd5Z2VkaXRvci5hbGlnbigncmlnaHQnKTsgLy8gLmNsb3NlUG9wdXAoKS5jb2xsYXBzZVNlbGVjdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY2FzZSAnYWxpZ25qdXN0aWZ5JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd3lzaXd5Z2VkaXRvci5hbGlnbignanVzdGlmeScpOyAvLyAuY2xvc2VQb3B1cCgpLmNvbGxhcHNlU2VsZWN0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjYXNlICdzdWJzY3JpcHQnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3eXNpd3lnZWRpdG9yLnN1YnNjcmlwdCgpOyAvLyAuY2xvc2VQb3B1cCgpLmNvbGxhcHNlU2VsZWN0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjYXNlICdzdXBlcnNjcmlwdCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHd5c2l3eWdlZGl0b3Iuc3VwZXJzY3JpcHQoKTsgLy8gLmNsb3NlUG9wdXAoKS5jb2xsYXBzZVNlbGVjdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY2FzZSAnaW5kZW50JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd3lzaXd5Z2VkaXRvci5pbmRlbnQoKTsgLy8gLmNsb3NlUG9wdXAoKS5jb2xsYXBzZVNlbGVjdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY2FzZSAnb3V0ZGVudCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHd5c2l3eWdlZGl0b3IuaW5kZW50KHRydWUpOyAvLyAuY2xvc2VQb3B1cCgpLmNvbGxhcHNlU2VsZWN0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjYXNlICdvcmRlcmVkTGlzdCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHd5c2l3eWdlZGl0b3IuaW5zZXJ0TGlzdCh0cnVlKTsgLy8gLmNsb3NlUG9wdXAoKS5jb2xsYXBzZVNlbGVjdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY2FzZSAndW5vcmRlcmVkTGlzdCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHd5c2l3eWdlZGl0b3IuaW5zZXJ0TGlzdCgpOyAvLyAuY2xvc2VQb3B1cCgpLmNvbGxhcHNlU2VsZWN0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjYXNlICdyZW1vdmVmb3JtYXQnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3eXNpd3lnZWRpdG9yLnJlbW92ZUZvcm1hdCgpLmNsb3NlUG9wdXAoKS5jb2xsYXBzZVNlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgdGhlIHRvb2xiYXJcbiAgICAgICAgdmFyIHRvb2xiYXJfYnV0dG9uID0gZnVuY3Rpb24oIGJ1dHRvbiApIHtcbiAgICAgICAgICAgIHZhciAkZWxlbWVudCA9ICQoJzxhLz4nKS5hZGRDbGFzcyggJ3d5c2l3eWctdG9vbGJhci1pY29uJyApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucHJvcCgnaHJlZicsJyMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnByb3AoJ3Vuc2VsZWN0YWJsZScsJ29uJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoYnV0dG9uLmltYWdlKTtcbiAgICAgICAgICAgIC8vIHBhc3Mgb3RoZXIgcHJvcGVydGllcyBhcyBcInByb3AoKVwiXG4gICAgICAgICAgICAkLmVhY2goIGJ1dHRvbiwgZnVuY3Rpb24oIG5hbWUsIHZhbHVlIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2goIG5hbWUgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2xhc3Nlc1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdjbGFzcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcyggdmFsdWUgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAvLyBzcGVjaWFsIG1lYW5pbmdcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaW1hZ2UnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncG9wdXAnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdjbGljayc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Nob3dzdGF0aWMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdzaG93c2VsZWN0aW9uJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAvLyBidXR0b24udGl0bGUsIC4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuYXR0ciggbmFtZSwgdmFsdWUgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuICRlbGVtZW50O1xuICAgICAgICB9O1xuICAgICAgICB2YXIgYWRkX2J1dHRvbnNfdG9fdG9vbGJhciA9IGZ1bmN0aW9uKCAkdG9vbGJhciwgc2VsZWN0aW9uLCBwb3B1cF9vcGVuX2NhbGxiYWNrLCBwb3B1cF9wb3NpdGlvbl9jYWxsYmFjayApXG4gICAgICAgIHtcbiAgICAgICAgICAgICQuZWFjaCggdG9vbGJhcl9idXR0b25zLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYoICEgdmFsdWUgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICAgICAgICAgIC8vIFNraXAgYnV0dG9ucyBvbiB0aGUgdG9vbGJhclxuICAgICAgICAgICAgICAgIGlmKCBzZWxlY3Rpb24gPT09IGZhbHNlICYmICdzaG93c3RhdGljJyBpbiB2YWx1ZSAmJiAhIHZhbHVlLnNob3dzdGF0aWMgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICAgICAgICAgIC8vIFNraXAgYnV0dG9ucyBvbiBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgICBpZiggc2VsZWN0aW9uID09PSB0cnVlICYmICdzaG93c2VsZWN0aW9uJyBpbiB2YWx1ZSAmJiAhIHZhbHVlLnNob3dzZWxlY3Rpb24gKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICAgICAgICAgIC8vIENsaWNrIGhhbmRsZXJcbiAgICAgICAgICAgICAgICB2YXIgdG9vbGJhcl9oYW5kbGVyO1xuICAgICAgICAgICAgICAgIGlmKCAnY2xpY2snIGluIHZhbHVlIClcbiAgICAgICAgICAgICAgICAgICAgdG9vbGJhcl9oYW5kbGVyID0gZnVuY3Rpb24oIHRhcmdldCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLmNsaWNrKCAkKHRhcmdldCkgKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmKCAncG9wdXAnIGluIHZhbHVlIClcbiAgICAgICAgICAgICAgICAgICAgdG9vbGJhcl9oYW5kbGVyID0gZnVuY3Rpb24oIHRhcmdldCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkcG9wdXAgPSBwb3B1cF9vcGVuX2NhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3ZlcndyaXRlX29mZnNldCA9IHZhbHVlLnBvcHVwKCAkcG9wdXAsICQodGFyZ2V0KSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXBfcG9zaXRpb25fY2FsbGJhY2soICRwb3B1cCwgdGFyZ2V0LCBvdmVyd3JpdGVfb2Zmc2V0ICk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0b29sYmFyX2hhbmRsZXIgPSBnZXRfdG9vbGJhcl9oYW5kbGVyKCBrZXksIGZ1bmN0aW9uKCAkY29udGVudCwgdGFyZ2V0ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRwb3B1cCA9IHBvcHVwX29wZW5fY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRwb3B1cC5hcHBlbmQoICRjb250ZW50ICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cF9wb3NpdGlvbl9jYWxsYmFjayggJHBvcHVwLCB0YXJnZXQgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRwb3B1cC5maW5kKCdpbnB1dFt0eXBlPXRleHRdOmZpcnN0JykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSB0b29sYmFyIGJ1dHRvblxuICAgICAgICAgICAgICAgIHZhciAkYnV0dG9uO1xuICAgICAgICAgICAgICAgIGlmKCB0b29sYmFyX2hhbmRsZXIgKVxuICAgICAgICAgICAgICAgICAgICAkYnV0dG9uID0gdG9vbGJhcl9idXR0b24oIHZhbHVlICkuY2xpY2soIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sYmFyX2hhbmRsZXIoIGV2ZW50LmN1cnJlbnRUYXJnZXQgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdpdmUgdGhlIGZvY3VzIGJhY2sgdG8gdGhlIGVkaXRvci4gVGVjaG5pY2FsbHkgbm90IG5lY2Vzc2FyeVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGdldF90b29sYmFyX2hhbmRsZXIoa2V5KSApIC8vIG9ubHkgaWYgbm90IGEgcG9wdXAtaGFuZGxlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd5c2l3eWdlZGl0b3IuZ2V0RWxlbWVudCgpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYoIHZhbHVlLmh0bWwgKVxuICAgICAgICAgICAgICAgICAgICAkYnV0dG9uID0gJCh2YWx1ZS5odG1sKTtcbiAgICAgICAgICAgICAgICBpZiggJGJ1dHRvbiApXG4gICAgICAgICAgICAgICAgICAgICR0b29sYmFyLmFwcGVuZCggJGJ1dHRvbiApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBwb3B1cF9wb3NpdGlvbiA9IGZ1bmN0aW9uKCAkcG9wdXAsICRjb250YWluZXIsIGxlZnQsIHRvcCApICAvLyBsZWZ0K3RvcCByZWxhdGl2ZSB0byAkY29udGFpbmVyXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIFRlc3QgcGFyZW50c1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lcl9ub2RlID0gJGNvbnRhaW5lci5nZXQoMCksXG4gICAgICAgICAgICAgICAgb2Zmc2V0cGFyZW50ID0gY29udGFpbmVyX25vZGUub2Zmc2V0UGFyZW50LFxuICAgICAgICAgICAgICAgIG9mZnNldHBhcmVudF9sZWZ0ID0gMCxcbiAgICAgICAgICAgICAgICBvZmZzZXRwYXJlbnRfdG9wID0gMCxcbiAgICAgICAgICAgICAgICBvZmZzZXRwYXJlbnRfYnJlYWsgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBvZmZzZXRwYXJlbnRfd2luZG93X2xlZnQgPSAwLCAgICAgLy8kLm9mZnNldCgpIGRvZXMgbm90IHdvcmsgd2l0aCBTYWZhcmkgMyBhbmQgJ3Bvc2l0aW9uOmZpeGVkJ1xuICAgICAgICAgICAgICAgIG9mZnNldHBhcmVudF93aW5kb3dfdG9wID0gMCxcbiAgICAgICAgICAgICAgICBvZmZzZXRwYXJlbnRfZml4ZWQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBvZmZzZXRwYXJlbnRfb3ZlcmZsb3cgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBwb3B1cF93aWR0aCA9ICRwb3B1cC53aWR0aCgpLFxuICAgICAgICAgICAgICAgIG5vZGUgPSBvZmZzZXRwYXJlbnQ7XG4gICAgICAgICAgICB3aGlsZSggbm9kZSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0cGFyZW50X3dpbmRvd19sZWZ0ICs9IG5vZGUub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgICAgICBvZmZzZXRwYXJlbnRfd2luZG93X3RvcCArPSBub2RlLm9mZnNldFRvcDtcbiAgICAgICAgICAgICAgICB2YXIgJG5vZGUgPSAkKG5vZGUpLFxuICAgICAgICAgICAgICAgICAgICBub2RlX3Bvc2l0aW9uID0gJG5vZGUuY3NzKCdwb3NpdGlvbicpO1xuICAgICAgICAgICAgICAgIGlmKCBub2RlX3Bvc2l0aW9uICE9ICdzdGF0aWMnIClcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0cGFyZW50X2JyZWFrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmKCAhIG9mZnNldHBhcmVudF9icmVhayApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXRwYXJlbnRfbGVmdCArPSBub2RlLm9mZnNldExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIG9mZnNldHBhcmVudF90b3AgKz0gbm9kZS5vZmZzZXRUb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKCBub2RlX3Bvc2l0aW9uID09ICdmaXhlZCcgKVxuICAgICAgICAgICAgICAgICAgICBvZmZzZXRwYXJlbnRfZml4ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmKCAkbm9kZS5jc3MoJ292ZXJmbG93JykgIT0gJ3Zpc2libGUnIClcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0cGFyZW50X292ZXJmbG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBNb3ZlICRwb3B1cCBhcyBoaWdoIGFzIHBvc3NpYmxlIGluIHRoZSBET00gdHJlZTogb2Zmc2V0UGFyZW50IG9mICRjb250YWluZXJcbiAgICAgICAgICAgIHZhciAkb2Zmc2V0cGFyZW50ID0gJChvZmZzZXRwYXJlbnQgfHwgZG9jdW1lbnQuYm9keSk7XG4gICAgICAgICAgICAkb2Zmc2V0cGFyZW50LmFwcGVuZCggJHBvcHVwICk7XG4gICAgICAgICAgICBsZWZ0ICs9IG9mZnNldHBhcmVudF9sZWZ0ICsgY29udGFpbmVyX25vZGUub2Zmc2V0TGVmdDsgLy8gJGNvbnRhaW5lci5wb3NpdGlvbigpIGRvZXMgbm90IHdvcmsgd2l0aCBTYWZhcmkgM1xuICAgICAgICAgICAgdG9wICs9IG9mZnNldHBhcmVudF90b3AgKyBjb250YWluZXJfbm9kZS5vZmZzZXRUb3A7XG4gICAgICAgICAgICAvLyBUcmltIHRvIG9mZnNldC1wYXJlbnRcbiAgICAgICAgICAgIGlmKCBvZmZzZXRwYXJlbnRfZml4ZWQgfHwgb2Zmc2V0cGFyZW50X292ZXJmbG93IClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiggbGVmdCArIHBvcHVwX3dpZHRoID4gJG9mZnNldHBhcmVudC53aWR0aCgpIC0gMSApXG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSAkb2Zmc2V0cGFyZW50LndpZHRoKCkgLSBwb3B1cF93aWR0aCAtIDE7XG4gICAgICAgICAgICAgICAgaWYoIGxlZnQgPCAxIClcbiAgICAgICAgICAgICAgICAgICAgbGVmdCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUcmltIHRvIHZpZXdwb3J0XG4gICAgICAgICAgICB2YXIgdmlld3BvcnRfd2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcbiAgICAgICAgICAgIGlmKCBvZmZzZXRwYXJlbnRfd2luZG93X2xlZnQgKyBsZWZ0ICsgcG9wdXBfd2lkdGggPiB2aWV3cG9ydF93aWR0aCAtIDEgKVxuICAgICAgICAgICAgICAgIGxlZnQgPSB2aWV3cG9ydF93aWR0aCAtIG9mZnNldHBhcmVudF93aW5kb3dfbGVmdCAtIHBvcHVwX3dpZHRoIC0gMTtcbiAgICAgICAgICAgIHZhciBzY3JvbGxfbGVmdCA9IG9mZnNldHBhcmVudF9maXhlZCA/IDAgOiAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpO1xuICAgICAgICAgICAgaWYoIG9mZnNldHBhcmVudF93aW5kb3dfbGVmdCArIGxlZnQgPCBzY3JvbGxfbGVmdCArIDEgKVxuICAgICAgICAgICAgICAgIGxlZnQgPSBzY3JvbGxfbGVmdCAtIG9mZnNldHBhcmVudF93aW5kb3dfbGVmdCArIDE7XG4gICAgICAgICAgICAvLyBTZXQgb2Zmc2V0XG4gICAgICAgICAgICAkcG9wdXAuY3NzKHsgbGVmdDogcGFyc2VJbnQobGVmdCkgKyAncHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogcGFyc2VJbnQodG9wKSArICdweCcgfSk7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvLyBUcmFuc2Zvcm0gdGhlIHRleHRhcmVhIHRvIGNvbnRlbnRlZGl0YWJsZVxuICAgICAgICB2YXIgaG90a2V5cyA9IHt9LFxuICAgICAgICAgICAgYXV0b2NvbXBsZXRlID0gbnVsbDtcbiAgICAgICAgdmFyIGNyZWF0ZV93eXNpd3lnID0gZnVuY3Rpb24oICR0ZXh0YXJlYSwgJGVkaXRvciwgJGNvbnRhaW5lciwgJHBsYWNlaG9sZGVyIClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGhhbmRsZV9hdXRvY29tcGxldGUgPSBmdW5jdGlvbigga2V5cHJlc3MsIGtleSwgY2hhcmFjdGVyLCBzaGlmdEtleSwgYWx0S2V5LCBjdHJsS2V5LCBtZXRhS2V5IClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiggISBvbl9hdXRvY29tcGxldGUgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICAgICAgICAgIHZhciB0eXBlZCA9IGF1dG9jb21wbGV0ZSB8fCAnJztcbiAgICAgICAgICAgICAgICBzd2l0Y2goIGtleSApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICA4OiAvLyBiYWNrc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVkID0gdHlwZWQuc3Vic3RyaW5nKCAwLCB0eXBlZC5sZW5ndGggLSAxICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmYWxsIHRocm91Z2hcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyNzogLy8gZXNjYXBlXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzM6IC8vIHBhZ2VVcFxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM0OiAvLyBwYWdlRG93blxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM1OiAvLyBlbmRcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzNjogLy8gaG9tZVxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM3OiAvLyBsZWZ0XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzg6IC8vIHVwXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDA6IC8vIGRvd25cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBrZXlwcmVzcyApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggISBrZXlwcmVzcyApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVkICs9IGNoYXJhY3RlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcmMgPSBvbl9hdXRvY29tcGxldGUoIHR5cGVkLCBrZXksIGNoYXJhY3Rlciwgc2hpZnRLZXksIGFsdEtleSwgY3RybEtleSwgbWV0YUtleSApO1xuICAgICAgICAgICAgICAgIGlmKCB0eXBlb2YocmMpID09ICdvYmplY3QnICYmIHJjLmxlbmd0aCApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyBTaG93IGF1dG9jb21wbGV0ZVxuICAgICAgICAgICAgICAgICAgICB2YXIgJHBvcHVwID0gJCh3eXNpd3lnZWRpdG9yLm9wZW5Qb3B1cCgpKTtcbiAgICAgICAgICAgICAgICAgICAgJHBvcHVwLmhpZGUoKS5hZGRDbGFzcyggJ3d5c2l3eWctcG9wdXAgd3lzaXd5Zy1wb3B1cGhvdmVyJyApIC8vIHNob3cgbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLmVtcHR5KCkuYXBwZW5kKCByYyApO1xuICAgICAgICAgICAgICAgICAgICBhdXRvY29tcGxldGUgPSB0eXBlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSGlkZSBhdXRvY29tcGxldGVcbiAgICAgICAgICAgICAgICAgICAgd3lzaXd5Z2VkaXRvci5jbG9zZVBvcHVwKCk7XG4gICAgICAgICAgICAgICAgICAgIGF1dG9jb21wbGV0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByYzsgLy8gc3dhbGxvdyBrZXkgaWYgJ2ZhbHNlJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIE9wdGlvbnMgdG8gd3lzaXd5Zy5qc1xuICAgICAgICAgICAgdmFyIG9wdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAkdGV4dGFyZWEuZ2V0KDApLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRlZGl0YWJsZTogJGVkaXRvciA/ICRlZGl0b3IuZ2V0KDApIDogbnVsbCxcbiAgICAgICAgICAgICAgICBvbktleURvd246IGZ1bmN0aW9uKCBrZXksIGNoYXJhY3Rlciwgc2hpZnRLZXksIGFsdEtleSwgY3RybEtleSwgbWV0YUtleSApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFzayBtYXN0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBvbl9rZXlkb3duICYmIG9uX2tleWRvd24oa2V5LCBjaGFyYWN0ZXIsIHNoaWZ0S2V5LCBhbHRLZXksIGN0cmxLZXksIG1ldGFLZXkpID09PSBmYWxzZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBzd2FsbG93IGtleVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXhlYyBob3RrZXkgKG9ua2V5ZG93biBiZWNhdXNlIGUuZy4gQ1RSTCtCIHdvdWxkIG9iZW4gdGhlIGJvb2ttYXJrcylcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBjaGFyYWN0ZXIgJiYgIXNoaWZ0S2V5ICYmICFhbHRLZXkgJiYgY3RybEtleSAmJiAhbWV0YUtleSApXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhvdGtleSA9IGNoYXJhY3Rlci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCAhIGhvdGtleXNbaG90a2V5XSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG90a2V5c1tob3RrZXldKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBwcmV2ZW50IGRlZmF1bHRcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBhdXRvY29tcGxldGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGVfYXV0b2NvbXBsZXRlKCBmYWxzZSwga2V5LCBjaGFyYWN0ZXIsIHNoaWZ0S2V5LCBhbHRLZXksIGN0cmxLZXksIG1ldGFLZXkgKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvbktleVByZXNzOiBmdW5jdGlvbigga2V5LCBjaGFyYWN0ZXIsIHNoaWZ0S2V5LCBhbHRLZXksIGN0cmxLZXksIG1ldGFLZXkgKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBc2sgbWFzdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggb25fa2V5cHJlc3MgJiYgb25fa2V5cHJlc3Moa2V5LCBjaGFyYWN0ZXIsIHNoaWZ0S2V5LCBhbHRLZXksIGN0cmxLZXksIG1ldGFLZXkpID09PSBmYWxzZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBzd2FsbG93IGtleVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIGF1dG9jb21wbGV0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZV9hdXRvY29tcGxldGUoIHRydWUsIGtleSwgY2hhcmFjdGVyLCBzaGlmdEtleSwgYWx0S2V5LCBjdHJsS2V5LCBtZXRhS2V5ICk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25LZXlVcDogZnVuY3Rpb24oIGtleSwgY2hhcmFjdGVyLCBzaGlmdEtleSwgYWx0S2V5LCBjdHJsS2V5LCBtZXRhS2V5IClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXNrIG1hc3RlclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIG9uX2tleXVwICYmIG9uX2tleXVwKGtleSwgY2hhcmFjdGVyLCBzaGlmdEtleSwgYWx0S2V5LCBjdHJsS2V5LCBtZXRhS2V5KSA9PT0gZmFsc2UgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gc3dhbGxvdyBrZXlcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvblNlbGVjdGlvbjogZnVuY3Rpb24oIGNvbGxhcHNlZCwgcmVjdCwgbm9kZXMsIHJpZ2h0Y2xpY2sgKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2hvd19wb3B1cCA9IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNwZWNpYWxfcG9wdXAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2xpY2sgb24gYSBsaW5rIG9wZW5zIHRoZSBsaW5rLXBvcHVwXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggY29sbGFwc2VkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goIG5vZGVzLCBmdW5jdGlvbihpbmRleCwgbm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGxpbmsgPSAkKG5vZGUpLmNsb3Nlc3QoJ2EnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoICRsaW5rLmxlbmd0aCAhPSAwICkgeyAvLyBvbmx5IGNsaWNrcyBvbiB0ZXh0LW5vZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3BlY2lhbF9wb3B1cCA9IGNvbnRlbnRfaW5zZXJ0bGluayggd3lzaXd5Z2VkaXRvciwgJGxpbmsgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBicmVha1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZWFkLU9ubHk/XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggd3lzaXd5Z2VkaXRvci5yZWFkT25seSgpIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93X3BvcHVwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXggdHlwZSBlcnJvciAtIGh0dHBzOi8vZ2l0aHViLmNvbS93eXNpd3lnanMvd3lzaXd5Zy5qcy9pc3N1ZXMvNFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiggISByZWN0IClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93X3BvcHVwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSBhIHNwZWNpYWwgcG9wdXA/XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKCAkc3BlY2lhbF9wb3B1cCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQSByaWdodC1jbGljayBhbHdheXMgb3BlbnMgdGhlIHBvcHVwXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKCByaWdodGNsaWNrIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBdXRvY29tcGxldGUgcG9wdXA/XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKCBhdXRvY29tcGxldGUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vIHNlbGVjdGlvbi1wb3B1cCB3YW50ZWQ/XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKCAkLmluQXJyYXkoJ3NlbGVjdGlvbicsdG9vbGJhcl9wb3NpdGlvbi5zcGxpdCgnLScpKSA9PSAtMSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd19wb3B1cCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2VsZWN0ZWQgcG9wdXAgd2FudGVkLCBidXQgbm90aGluZyBzZWxlY3RlZCAoPXNlbGVjdGlvbiBjb2xsYXBzZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKCBjb2xsYXBzZWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dfcG9wdXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9ubHkgb25lIGltYWdlPyBCZXR0ZXI6IERpc3BsYXkgYSBzcGVjaWFsIGltYWdlLXBvcHVwXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKCBub2Rlcy5sZW5ndGggPT0gMSAmJiBub2Rlc1swXS5ub2RlTmFtZSA9PSAnSU1HJyApIC8vIG5vZGVzIGlzIG5vdCBhIHNwYXJzZSBhcnJheVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dfcG9wdXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCAhIHNob3dfcG9wdXAgKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd5c2l3eWdlZGl0b3IuY2xvc2VQb3B1cCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBQb3B1cCBwb3NpdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRwb3B1cDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcHBseV9wb3B1cF9wb3NpdGlvbiA9IGZ1bmN0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9wdXBfd2lkdGggPSAkcG9wdXAub3V0ZXJXaWR0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBvaW50IGlzIHRoZSBjZW50ZXIgb2YgdGhlIHNlbGVjdGlvbiAtIHJlbGF0aXZlIHRvICRwYXJlbnQgbm90IHRoZSBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRwYXJlbnQgPSAkdGV4dGFyZWEucGFyZW50KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcl9vZmZzZXQgPSAkcGFyZW50Lm9mZnNldCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0b3Jfb2Zmc2V0ID0gJCh3eXNpd3lnZWRpdG9yLmdldEVsZW1lbnQoKSkub2Zmc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxlZnQgPSByZWN0LmxlZnQgKyBwYXJzZUludChyZWN0LndpZHRoIC8gMikgLSBwYXJzZUludChwb3B1cF93aWR0aCAvIDIpICsgZWRpdG9yX29mZnNldC5sZWZ0IC0gY29udGFpbmVyX29mZnNldC5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b3AgPSByZWN0LnRvcCArIHJlY3QuaGVpZ2h0ICsgZWRpdG9yX29mZnNldC50b3AgLSBjb250YWluZXJfb2Zmc2V0LnRvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cF9wb3NpdGlvbiggJHBvcHVwLCAkcGFyZW50LCBsZWZ0LCB0b3AgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVuIHBvcHVwXG4gICAgICAgICAgICAgICAgICAgICAgICAkcG9wdXAgPSAkKHd5c2l3eWdlZGl0b3Iub3BlblBvcHVwKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgd3JvbmcgcG9wdXAgLT4gY2xvc2UgYW5kIG9wZW4gYSBuZXcgb25lXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggISAkcG9wdXAuaGFzQ2xhc3MoJ3d5c2l3eWctcG9wdXBob3ZlcicpIHx8ICghJHBvcHVwLmRhdGEoJ3d5c2l3eWdqcy1zcGVjaWFsJykpICE9ICghJHNwZWNpYWxfcG9wdXApIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcG9wdXAgPSAkKHd5c2l3eWdlZGl0b3IuY2xvc2VQb3B1cCgpLm9wZW5Qb3B1cCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBhdXRvY29tcGxldGUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRwb3B1cC5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKCAhICRwb3B1cC5oYXNDbGFzcygnd3lzaXd5Zy1wb3B1cCcpIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgY2xhc3NlcyArIGJ1dHRvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcG9wdXAuYWRkQ2xhc3MoICd3eXNpd3lnLXBvcHVwIHd5c2l3eWctcG9wdXBob3ZlcicgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggJHNwZWNpYWxfcG9wdXAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcG9wdXAuZW1wdHkoKS5hcHBlbmQoICRzcGVjaWFsX3BvcHVwICkuZGF0YSgnd3lzaXd5Z2pzLXNwZWNpYWwnLHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkX2J1dHRvbnNfdG9fdG9vbGJhciggJHBvcHVwLCB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRwb3B1cC5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcGx5X3BvcHVwX3Bvc2l0aW9uICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBcHBseSBwb3NpdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlfcG9wdXBfcG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvbk9wZW5wb3B1cDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRfY2xhc3NfYWN0aXZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25DbG9zZXBvcHVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9jb21wbGV0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVfY2xhc3NfYWN0aXZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaGlqYWNrQ29udGV4dG1lbnU6ICh0b29sYmFyX3Bvc2l0aW9uID09ICdzZWxlY3Rpb24nKSxcbiAgICAgICAgICAgICAgICByZWFkT25seTogISEkdGV4dGFyZWEucHJvcCggJ3JlYWRvbmx5JyApXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYoICRwbGFjZWhvbGRlciApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgb3B0aW9uLm9uUGxhY2Vob2xkZXIgPSBmdW5jdGlvbiggdmlzaWJsZSApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIHZpc2libGUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgJHBsYWNlaG9sZGVyLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgJHBsYWNlaG9sZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgd3lzaXd5Z2VkaXRvciA9IHd5c2l3eWcoIG9wdGlvbiApO1xuICAgICAgICAgICAgcmV0dXJuIHd5c2l3eWdlZGl0b3I7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIENyZWF0ZSBhIGNvbnRhaW5lciBpZiBpdCBkb2VzIG5vdCBleGlzdCB5ZXRcbiAgICAgICAgdmFyICRjb250YWluZXIgPSAkdGV4dGFyZWEuY2xvc2VzdCggJy53eXNpd3lnLWNvbnRhaW5lcicgKTtcbiAgICAgICAgaWYoICRjb250YWluZXIubGVuZ3RoID09IDAgKVxuICAgICAgICB7XG4gICAgICAgICAgICAkY29udGFpbmVyID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ3d5c2l3eWctY29udGFpbmVyJyk7XG4gICAgICAgICAgICBpZiggY2xhc3NlcyApXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcyggY2xhc3NlcyApO1xuICAgICAgICAgICAgJHRleHRhcmVhLndyYXAoICRjb250YWluZXIgKTtcbiAgICAgICAgICAgICRjb250YWluZXIgPSAkdGV4dGFyZWEuY2xvc2VzdCggJy53eXNpd3lnLWNvbnRhaW5lcicgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgcGxhY2Vob2xkZXIgaWYgaXQgZG9lcyBub3QgZXhpc3QgeWV0IGFuZCB3ZSB3YW50IG9uZVxuICAgICAgICB2YXIgJHdyYXBwZXIgPSAkdGV4dGFyZWEuY2xvc2VzdCggJy53eXNpd3lnLXdyYXBwZXInICk7XG4gICAgICAgIGlmKCBwbGFjZWhvbGRlciAmJiAkd3JhcHBlci5sZW5ndGggPT0gMCApXG4gICAgICAgIHtcbiAgICAgICAgICAgICR3cmFwcGVyID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ3d5c2l3eWctd3JhcHBlcicpO1xuICAgICAgICAgICAgJHRleHRhcmVhLndyYXAoICR3cmFwcGVyICk7XG4gICAgICAgICAgICAkd3JhcHBlciA9ICR0ZXh0YXJlYS5jbG9zZXN0KCAnLnd5c2l3eWctd3JhcHBlcicgKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgJHBsYWNlaG9sZGVyID0gbnVsbDtcbiAgICAgICAgaWYoICR3cmFwcGVyLmxlbmd0aCAhPSAwIClcbiAgICAgICAgICAgICRwbGFjZWhvbGRlciA9ICR3cmFwcGVyLmZpbmQoICcud3lzaXd5Zy1wbGFjZWhvbGRlcicgKTtcbiAgICAgICAgaWYoIHBsYWNlaG9sZGVyICYmICghICRwbGFjZWhvbGRlciB8fCAkcGxhY2Vob2xkZXIubGVuZ3RoID09IDApIClcbiAgICAgICAge1xuICAgICAgICAgICAgJHBsYWNlaG9sZGVyID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoICd3eXNpd3lnLXBsYWNlaG9sZGVyJyApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5odG1sKCBwbGFjZWhvbGRlciApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5oaWRlKCk7XG4gICAgICAgICAgICAkd3JhcHBlci5wcmVwZW5kKCAkcGxhY2Vob2xkZXIgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgV1lTSVdZRyBFZGl0b3JcbiAgICAgICAgdmFyICRlZGl0b3IgPSAkY29udGFpbmVyLmZpbmQoICcud3lzaXd5Zy1lZGl0b3InICk7XG4gICAgICAgIGlmKCAkZWRpdG9yLmxlbmd0aCA9PSAwIClcbiAgICAgICAgICAgICRlZGl0b3IgPSBudWxsO1xuICAgICAgICB2YXIgd3lzaXd5Z2VkaXRvciA9IGNyZWF0ZV93eXNpd3lnKCAkdGV4dGFyZWEsICRlZGl0b3IsICRjb250YWluZXIsICRwbGFjZWhvbGRlciApO1xuICAgICAgICBpZiggd3lzaXd5Z2VkaXRvci5sZWdhY3kgKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiggJGVkaXRvciApXG4gICAgICAgICAgICAgICAgJGVkaXRvci5oaWRlKCk7XG4gICAgICAgICAgICBpZiggJHBsYWNlaG9sZGVyIClcbiAgICAgICAgICAgICAgICAkcGxhY2Vob2xkZXIuaGlkZSgpO1xuICAgICAgICAgICAgdmFyICR0ZXh0YXJlYSA9ICQod3lzaXd5Z2VkaXRvci5nZXRFbGVtZW50KCkpO1xuICAgICAgICAgICAgJHRleHRhcmVhLnNob3coKS5hZGRDbGFzcyggJ3d5c2l3eWctdGV4dGFyZWEnICk7XG4gICAgICAgICAgICBpZiggJHRleHRhcmVhLmlzKCc6dmlzaWJsZScpICkgLy8gaW5zaWRlIHRoZSBET01cbiAgICAgICAgICAgICAgICAkdGV4dGFyZWEud2lkdGgoICRjb250YWluZXIud2lkdGgoKSAtICgkdGV4dGFyZWEub3V0ZXJXaWR0aCgpIC0gJHRleHRhcmVhLndpZHRoKCkpICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiggISAkZWRpdG9yIClcbiAgICAgICAgICAgICAgICAkKHd5c2l3eWdlZGl0b3IuZ2V0RWxlbWVudCgpKS5hZGRDbGFzcyggJ3d5c2l3eWctZWRpdG9yJyApO1xuXG4gICAgICAgICAgICAvLyBDbGlja2luZyB0aGUgcGxhY2Vob2xkZXIgLT4gZm9jdXMgZWRpdG9yIC0gZml4ZXMgSUU2LUlFOFxuICAgICAgICAgICAgJHdyYXBwZXIuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB3eXNpd3lnZWRpdG9yLmdldEVsZW1lbnQoKS5mb2N1cygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFN1cHBvcnQgJzphY3RpdmUnLWNsYXNzXG4gICAgICAgICAgICB2YXIgcmVtb3ZlX2FjdGl2ZV90aW1lb3V0ID0gbnVsbCxcbiAgICAgICAgICAgICAgICBpbml0aWFsaXplX3Rvb2xiYXIgPSBudWxsO1xuICAgICAgICAgICAgdmFyIGFkZF9jbGFzc19hY3RpdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiggcmVtb3ZlX2FjdGl2ZV90aW1lb3V0IClcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KCByZW1vdmVfYWN0aXZlX3RpbWVvdXQgKTtcbiAgICAgICAgICAgICAgICByZW1vdmVfYWN0aXZlX3RpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmKCBpbml0aWFsaXplX3Rvb2xiYXIgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbGl6ZV90b29sYmFyKCk7XG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxpemVfdG9vbGJhciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoICd3eXNpd3lnLWFjdGl2ZScgKTtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoICcud3lzaXd5Zy10b29sYmFyLWZvY3VzJyApLnNsaWRlRG93bigyMDApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciByZW1vdmVfY2xhc3NfYWN0aXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYoIHJlbW92ZV9hY3RpdmVfdGltZW91dCB8fCBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09IHd5c2l3eWdlZGl0b3IuZ2V0RWxlbWVudCgpIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDtcbiAgICAgICAgICAgICAgICByZW1vdmVfYWN0aXZlX3RpbWVvdXQgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlX2FjdGl2ZV90aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5yZW1vdmVDbGFzcyggJ3d5c2l3eWctYWN0aXZlJyApO1xuICAgICAgICAgICAgICAgICAgICBpZiggJC50cmltKHd5c2l3eWdlZGl0b3IuZ2V0SFRNTCgpLnJlcGxhY2UoLzxiclxccypbXFwvXT8+L2dpLCcnKSkubGVuZ3RoID09IDAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKCAnLnd5c2l3eWctdG9vbGJhci1mb2N1cycgKS5zbGlkZVVwKDIwMCk7XG4gICAgICAgICAgICAgICAgfSwgMTAwICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJCh3eXNpd3lnZWRpdG9yLmdldEVsZW1lbnQoKSkuZm9jdXMoIGFkZF9jbGFzc19hY3RpdmUgKS5ibHVyKCByZW1vdmVfY2xhc3NfYWN0aXZlICk7XG4gICAgICAgICAgICAkdGV4dGFyZWEuY2xvc2VzdCggJ2Zvcm0nICkub24oICdyZXNldCcsIHJlbW92ZV9jbGFzc19hY3RpdmUgKTtcblxuICAgICAgICAgICAgLy8gSG90a2V5K0NvbW1hbmRzLUxpc3RcbiAgICAgICAgICAgIHZhciBjb21tYW5kcyA9IHt9O1xuICAgICAgICAgICAgJC5lYWNoKCB0b29sYmFyX2J1dHRvbnMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiggISB2YWx1ZSB8fCAhIHZhbHVlLmhvdGtleSApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA7XG4gICAgICAgICAgICAgICAgdmFyIHRvb2xiYXJfaGFuZGxlciA9IGdldF90b29sYmFyX2hhbmRsZXIoIGtleSApO1xuICAgICAgICAgICAgICAgIGlmKCAhIHRvb2xiYXJfaGFuZGxlciApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA7XG4gICAgICAgICAgICAgICAgaG90a2V5c1t2YWx1ZS5ob3RrZXkudG9Mb3dlckNhc2UoKV0gPSB0b29sYmFyX2hhbmRsZXI7XG4gICAgICAgICAgICAgICAgY29tbWFuZHNba2V5XSA9IHRvb2xiYXJfaGFuZGxlcjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBUb29sYmFyIG9uIHRvcCBvciBib3R0b21cbiAgICAgICAgICAgIGlmKCAhICQuaXNFbXB0eU9iamVjdCh0b29sYmFyX2J1dHRvbnMpICYmIHRvb2xiYXJfcG9zaXRpb24gIT0gJ3NlbGVjdGlvbicgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciB0b29sYmFyX3RvcCA9ICQuaW5BcnJheSggJ3RvcCcsIHRvb2xiYXJfcG9zaXRpb24uc3BsaXQoJy0nKSApICE9IC0xO1xuICAgICAgICAgICAgICAgIHZhciB0b29sYmFyX2ZvY3VzID0gJC5pbkFycmF5KCAnZm9jdXMnLCB0b29sYmFyX3Bvc2l0aW9uLnNwbGl0KCctJykgKSAhPSAtMTtcbiAgICAgICAgICAgICAgICAvLyBDYWxsYmFjayB0byBjcmVhdGUgdG9vbGJhciBvbiBkZW1hbmRcbiAgICAgICAgICAgICAgICB2YXIgY3JlYXRlX3Rvb2xiYXIgPSBmdW5jdGlvbigpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHRvb2xiYXIgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcyggJ3d5c2l3eWctdG9vbGJhcicgKS5hZGRDbGFzcyggdG9vbGJhcl90b3AgPyAnd3lzaXd5Zy10b29sYmFyLXRvcCcgOiAnd3lzaXd5Zy10b29sYmFyLWJvdHRvbScgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRvb2xiYXJfZm9jdXMgKVxuICAgICAgICAgICAgICAgICAgICAgICAgJHRvb2xiYXIuaGlkZSgpLmFkZENsYXNzKCAnd3lzaXd5Zy10b29sYmFyLWZvY3VzJyApO1xuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgYnV0dG9ucyB0byB0aGUgdG9vbGJhclxuICAgICAgICAgICAgICAgICAgICBhZGRfYnV0dG9uc190b190b29sYmFyKCAkdG9vbGJhciwgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVuIGEgcG9wdXAgZnJvbSB0aGUgdG9vbGJhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkcG9wdXAgPSAkKHd5c2l3eWdlZGl0b3Iub3BlblBvcHVwKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHdyb25nIHBvcHVwIC0+IGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggJHBvcHVwLmhhc0NsYXNzKCd3eXNpd3lnLXBvcHVwJykgJiYgJHBvcHVwLmhhc0NsYXNzKCd3eXNpd3lnLXBvcHVwaG92ZXInKSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRwb3B1cCA9ICQod3lzaXd5Z2VkaXRvci5jbG9zZVBvcHVwKCkub3BlblBvcHVwKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCAhICRwb3B1cC5oYXNDbGFzcygnd3lzaXd5Zy1wb3B1cCcpIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGNsYXNzZXMgKyBjb250ZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRwb3B1cC5hZGRDbGFzcyggJ3d5c2l3eWctcG9wdXAnICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRwb3B1cDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiggJHBvcHVwLCB0YXJnZXQsIG92ZXJ3cml0ZV9vZmZzZXQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUG9wdXAgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGJ1dHRvbiA9ICQodGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9wdXBfd2lkdGggPSAkcG9wdXAub3V0ZXJXaWR0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBvaW50IGlzIHRoZSB0b3AvYm90dG9tLWNlbnRlciBvZiB0aGUgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxlZnQgPSAkYnV0dG9uLm9mZnNldCgpLmxlZnQgLSAkY29udGFpbmVyLm9mZnNldCgpLmxlZnQgKyBwYXJzZUludCgkYnV0dG9uLndpZHRoKCkgLyAyKSAtIHBhcnNlSW50KHBvcHVwX3dpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvcCA9ICRidXR0b24ub2Zmc2V0KCkudG9wIC0gJGNvbnRhaW5lci5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHRvb2xiYXJfdG9wIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wICs9ICRidXR0b24ub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcCAtPSAkcG9wdXAub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggb3ZlcndyaXRlX29mZnNldCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gb3ZlcndyaXRlX29mZnNldC5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3AgPSBvdmVyd3JpdGVfb2Zmc2V0LnRvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXBfcG9zaXRpb24oICRwb3B1cCwgJGNvbnRhaW5lciwgbGVmdCwgdG9wICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRvb2xiYXJfdG9wIClcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb250YWluZXIucHJlcGVuZCggJHRvb2xiYXIgKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5hcHBlbmQoICR0b29sYmFyICk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiggISB0b29sYmFyX2ZvY3VzIClcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlX3Rvb2xiYXIoKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxpemVfdG9vbGJhciA9IGNyZWF0ZV90b29sYmFyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXhwb3J0IHVzZXJkYXRhXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3eXNpd3lnZWRpdG9yOiB3eXNpd3lnZWRpdG9yLFxuICAgICAgICAgICAgJGNvbnRhaW5lcjogJGNvbnRhaW5lclxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvLyBqUXVlcnkgSW50ZXJmYWNlXG4gICAgJC5mbi53eXNpd3lnID0gZnVuY3Rpb24oIG9wdGlvbiwgcGFyYW0gKVxuICAgIHtcbiAgICAgICAgaWYoICEgb3B0aW9uIHx8IHR5cGVvZihvcHRpb24pID09PSAnb2JqZWN0JyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9wdGlvbiA9ICQuZXh0ZW5kKCB7fSwgb3B0aW9uICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgLy8gQWxyZWFkeSBhbiBlZGl0b3JcbiAgICAgICAgICAgICAgICBpZiggJHRoYXQuZGF0YSggJ3d5c2l3eWdqcycpIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDtcblxuICAgICAgICAgICAgICAgIC8vIFR3byBtb2RlczogdG9vbGJhciBvbiB0b3AgYW5kIG9uIGJvdHRvbVxuICAgICAgICAgICAgICAgIHZhciBjbGFzc2VzID0gb3B0aW9uWydjbGFzcyddLFxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlciA9IG9wdGlvbi5wbGFjZWhvbGRlciB8fCAkdGhhdC5wcm9wKCdwbGFjZWhvbGRlcicpLFxuICAgICAgICAgICAgICAgICAgICB0b29sYmFyX3Bvc2l0aW9uID0gb3B0aW9uLnRvb2xiYXIgfHwgJ3RvcCcsXG4gICAgICAgICAgICAgICAgICAgIHRvb2xiYXJfYnV0dG9ucyA9IG9wdGlvbi5idXR0b25zIHx8IHt9LFxuICAgICAgICAgICAgICAgICAgICB0b29sYmFyX3N1Ym1pdCA9IG9wdGlvbi5zdWJtaXQsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsX3NlbGVjdEltYWdlID0gb3B0aW9uLnNlbGVjdEltYWdlLFxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcl91cmwgPSBvcHRpb24ucGxhY2Vob2xkZXJVcmwgfHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJfZW1iZWQgPSBvcHRpb24ucGxhY2Vob2xkZXJFbWJlZCB8fCBudWxsLFxuICAgICAgICAgICAgICAgICAgICBtYXhfaW1hZ2VzaXplID0gb3B0aW9uLm1heEltYWdlU2l6ZSB8fCBudWxsLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJfaW1hZ2VUeXBlID0gb3B0aW9uLmZpbHRlckltYWdlVHlwZSB8fCAnXmltYWdlLycsXG4gICAgICAgICAgICAgICAgICAgIG9uX2ltYWdldXBsb2FkID0gb3B0aW9uLm9uSW1hZ2VVcGxvYWQgfHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgZm9yY2VfaW1hZ2V1cGxvYWQgPSBvcHRpb24uZm9yY2VJbWFnZVVwbG9hZCAmJiBvbl9pbWFnZXVwbG9hZCxcbiAgICAgICAgICAgICAgICAgICAgdmlkZW9fZnJvbV91cmwgPSBvcHRpb24udmlkZW9Gcm9tVXJsIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIG9uX2tleWRvd24gPSBvcHRpb24ub25LZXlEb3duIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIG9uX2tleXByZXNzID0gb3B0aW9uLm9uS2V5UHJlc3MgfHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgb25fa2V5dXAgPSBvcHRpb24ub25LZXlVcCB8fCBudWxsLFxuICAgICAgICAgICAgICAgICAgICBvbl9hdXRvY29tcGxldGUgPSBvcHRpb24ub25BdXRvY29tcGxldGUgfHwgbnVsbDtcblxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgV1lTSVdZRyBFZGl0b3JcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGNyZWF0ZV9lZGl0b3IoICR0aGF0LCBjbGFzc2VzLCBwbGFjZWhvbGRlciwgdG9vbGJhcl9wb3NpdGlvbiwgdG9vbGJhcl9idXR0b25zLCB0b29sYmFyX3N1Ym1pdCwgbGFiZWxfc2VsZWN0SW1hZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcl91cmwsIHBsYWNlaG9sZGVyX2VtYmVkLCBtYXhfaW1hZ2VzaXplLCBmaWx0ZXJfaW1hZ2VUeXBlLCBvbl9pbWFnZXVwbG9hZCwgZm9yY2VfaW1hZ2V1cGxvYWQsIHZpZGVvX2Zyb21fdXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25fa2V5ZG93biwgb25fa2V5cHJlc3MsIG9uX2tleXVwLCBvbl9hdXRvY29tcGxldGUgKTtcbiAgICAgICAgICAgICAgICAkdGhhdC5kYXRhKCAnd3lzaXd5Z2pzJywgZGF0YSApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiggdGhpcy5sZW5ndGggPT0gMSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhKCd3eXNpd3lnanMnKTtcbiAgICAgICAgICAgIGlmKCAhIGRhdGEgKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgaWYoIG9wdGlvbiA9PSAnY29udGFpbmVyJyApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEuJGNvbnRhaW5lcjtcbiAgICAgICAgICAgIGlmKCBvcHRpb24gPT0gJ3NoZWxsJyApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEud3lzaXd5Z2VkaXRvcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvbGliL3d5c2l3eWctZWRpdG9yLmpzXG4gKiovIiwiaW1wb3J0IGFmcmFpZCBmcm9tICcuL2FmcmFpZC5wbmcnXG5pbXBvcnQgYW1vcm91cyBmcm9tICcuL2Ftb3JvdXMucG5nJ1xuaW1wb3J0IGFuZ2VsIGZyb20gJy4vYW5nZWwucG5nJ1xuaW1wb3J0IGFuZ3J5IGZyb20gJy4vYW5ncnkucG5nJ1xuaW1wb3J0IGJhdGhpbmcgZnJvbSAnLi9iYXRoaW5nLnBuZydcbmltcG9ydCBiZWVyIGZyb20gJy4vYmVlci5wbmcnXG5pbXBvcnQgYm9yZWQgZnJvbSAnLi9ib3JlZC5wbmcnXG5pbXBvcnQgYm95IGZyb20gJy4vYm95LnBuZydcbmltcG9ydCBjYW1lcmEgZnJvbSAnLi9jYW1lcmEucG5nJ1xuaW1wb3J0IGNoaWxsaSBmcm9tICcuL2NoaWxsaS5wbmcnXG5pbXBvcnQgY2lnYXJldHRlIGZyb20gJy4vY2lnYXJldHRlLnBuZydcbmltcG9ydCBjaW5lbWEgZnJvbSAnLi9jaW5lbWEucG5nJ1xuaW1wb3J0IGNvZmZlZSBmcm9tICcuL2NvZmZlZS5wbmcnXG5pbXBvcnQgY29sZCBmcm9tICcuL2NvbGQucG5nJ1xuaW1wb3J0IGNvbmZ1c2VkIGZyb20gJy4vY29uZnVzZWQucG5nJ1xuaW1wb3J0IGNvbnNvbGVQbmcgZnJvbSAnLi9jb25zb2xlLnBuZydcbmltcG9ydCBjcm9zcyBmcm9tICcuL2Nyb3NzLnBuZydcbmltcG9ydCBjcnlpbmcgZnJvbSAnLi9jcnlpbmcucG5nJ1xuaW1wb3J0IGRldmlsIGZyb20gJy4vZGV2aWwucG5nJ1xuaW1wb3J0IGRpc2FwcG9pbnRlZCBmcm9tICcuL2Rpc2FwcG9pbnRlZC5wbmcnXG5pbXBvcnQgZG9udEtub3cgZnJvbSAnLi9kb250LWtub3cucG5nJ1xuaW1wb3J0IGRyb29sIGZyb20gJy4vZHJvb2wucG5nJ1xuaW1wb3J0IGVtYmFycmFzc2VkIGZyb20gJy4vZW1iYXJyYXNzZWQucG5nJ1xuaW1wb3J0IGV4Y2l0ZWQgZnJvbSAnLi9leGNpdGVkLnBuZydcbmltcG9ydCBleGNydWNpYXRpbmcgZnJvbSAnLi9leGNydWNpYXRpbmcucG5nJ1xuaW1wb3J0IGV5ZXJvbGwgZnJvbSAnLi9leWVyb2xsLnBuZydcbmltcG9ydCBnaXJsIGZyb20gJy4vZ2lybC5wbmcnXG5pbXBvcnQgZ3J1bXB5IGZyb20gJy4vZ3J1bXB5LnBuZydcbmltcG9ydCBoYXBweSBmcm9tICcuL2hhcHB5LnBuZydcbmltcG9ydCBob3QgZnJvbSAnLi9ob3QucG5nJ1xuaW1wb3J0IGh1Z0xlZnQgZnJvbSAnLi9odWctbGVmdC5wbmcnXG5pbXBvcnQgaHVnUmlnaHQgZnJvbSAnLi9odWctcmlnaHQucG5nJ1xuaW1wb3J0IGh1bmdyeSBmcm9tICcuL2h1bmdyeS5wbmcnXG5pbXBvcnQgaW5Mb3ZlIGZyb20gJy4vaW5fbG92ZS5wbmcnXG5pbXBvcnQgaW50ZXJuZXQgZnJvbSAnLi9pbnRlcm5ldC5wbmcnXG5pbXBvcnQgaW52aW5jaWJsZSBmcm9tICcuL2ludmluY2libGUucG5nJ1xuaW1wb3J0IGtpc3MgZnJvbSAnLi9raXNzLnBuZydcbmltcG9ydCBsYW1wIGZyb20gJy4vbGFtcC5wbmcnXG5pbXBvcnQgbHlpbmcgZnJvbSAnLi9seWluZy5wbmcnXG5pbXBvcnQgbWVldGluZyBmcm9tICcuL21lZXRpbmcucG5nJ1xuaW1wb3J0IG1vYmlsZSBmcm9tICcuL21vYmlsZS5wbmcnXG5pbXBvcnQgbXJncmVlbiBmcm9tICcuL21yZ3JlZW4ucG5nJ1xuaW1wb3J0IG11c2ljIGZyb20gJy4vbXVzaWMucG5nJ1xuaW1wb3J0IG11c2ljYWxOb3RlIGZyb20gJy4vbXVzaWNhbC1ub3RlLnBuZydcbmltcG9ydCBuZXJkeSBmcm9tICcuL25lcmR5LnBuZydcbmltcG9ydCBuZXV0cmFsIGZyb20gJy4vbmV1dHJhbC5wbmcnXG5pbXBvcnQgcGFydHkgZnJvbSAnLi9wYXJ0eS5wbmcnXG5pbXBvcnQgcGhvbmUgZnJvbSAnLi9waG9uZS5wbmcnXG5pbXBvcnQgcGlyYXRlIGZyb20gJy4vcGlyYXRlLnBuZydcbmltcG9ydCBwaXNzZWRPZmYgZnJvbSAnLi9waXNzZWQtb2ZmLnBuZydcbmltcG9ydCBwbGF0ZSBmcm9tICcuL3BsYXRlLnBuZydcbmltcG9ydCBxdWVzdGlvbiBmcm9tICcuL3F1ZXN0aW9uLnBuZydcbmltcG9ydCByZXN0cm9vbSBmcm9tICcuL3Jlc3Ryb29tLnBuZydcbmltcG9ydCByb3NlIGZyb20gJy4vcm9zZS5wbmcnXG5pbXBvcnQgc2FkIGZyb20gJy4vc2FkLnBuZydcbmltcG9ydCBzZWFyY2ggZnJvbSAnLi9zZWFyY2gucG5nJ1xuaW1wb3J0IHNoYW1lIGZyb20gJy4vc2hhbWUucG5nJ1xuaW1wb3J0IHNob2NrZWQgZnJvbSAnLi9zaG9ja2VkLnBuZydcbmltcG9ydCBzaG9wcGluZyBmcm9tICcuL3Nob3BwaW5nLnBuZydcbmltcG9ydCBzaHV0TW91dGggZnJvbSAnLi9zaHV0LW1vdXRoLnBuZydcbmltcG9ydCBzaWNrIGZyb20gJy4vc2ljay5wbmcnXG5pbXBvcnQgc2lsZW50IGZyb20gJy4vc2lsZW50LnBuZydcbmltcG9ydCBzbGVlcHkgZnJvbSAnLi9zbGVlcHkucG5nJ1xuaW1wb3J0IHNsZWVwaW5nIGZyb20gJy4vc2xlZXBpbmcucG5nJ1xuaW1wb3J0IHN0YXIgZnJvbSAnLi9zdGFyLnBuZydcbmltcG9ydCBzdHJlc3NlZCBmcm9tICcuL3N0cmVzc2VkLnBuZydcbmltcG9ydCBzdHVkeWluZyBmcm9tICcuL3N0dWR5aW5nLnBuZydcbmltcG9ydCBzdWl0IGZyb20gJy4vc3VpdC5wbmcnXG5pbXBvcnQgc3VyZmluZyBmcm9tICcuL3N1cmZpbmcucG5nJ1xuaW1wb3J0IHRoaW5raW5nIGZyb20gJy4vdGhpbmtpbmcucG5nJ1xuaW1wb3J0IHRodW5kZXIgZnJvbSAnLi90aHVuZGVyLnBuZydcbmltcG9ydCB0b25ndWUgZnJvbSAnLi90b25ndWUucG5nJ1xuaW1wb3J0IHR2IGZyb20gJy4vdHYucG5nJ1xuaW1wb3J0IHR5cGluZyBmcm9tICcuL3R5cGluZy5wbmcnXG5pbXBvcnQgdWhtWWVhaCBmcm9tICcuL3VobS15ZWFoLnBuZydcbmltcG9ydCB3aW5rIGZyb20gJy4vd2luay5wbmcnXG5pbXBvcnQgd29ya2luZyBmcm9tICcuL3dvcmtpbmcucG5nJ1xuaW1wb3J0IHdyaXRpbmcgZnJvbSAnLi93cml0aW5nLnBuZydcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhZnJhaWQsXG4gIGFtb3JvdXMsXG4gIGFuZ2VsLFxuICBhbmdyeSxcbiAgYmF0aGluZyxcbiAgYmVlcixcbiAgYm9yZWQsXG4gIGJveSxcbiAgY2FtZXJhLFxuICBjaGlsbGksXG4gIGNpZ2FyZXR0ZSxcbiAgY2luZW1hLFxuICBjb2ZmZWUsXG4gIGNvbGQsXG4gIGNvbmZ1c2VkLFxuICBjb25zb2xlUG5nLFxuICBjcm9zcyxcbiAgY3J5aW5nLFxuICBkZXZpbCxcbiAgZGlzYXBwb2ludGVkLFxuICBkb250S25vdyxcbiAgZHJvb2wsXG4gIGVtYmFycmFzc2VkLFxuICBleGNpdGVkLFxuICBleGNydWNpYXRpbmcsXG4gIGV5ZXJvbGwsXG4gIGdpcmwsXG4gIGdydW1weSxcbiAgaGFwcHksXG4gIGhvdCxcbiAgaHVnTGVmdCxcbiAgaHVnUmlnaHQsXG4gIGh1bmdyeSxcbiAgaW5Mb3ZlLFxuICBpbnRlcm5ldCxcbiAgaW52aW5jaWJsZSxcbiAga2lzcyxcbiAgbGFtcCxcbiAgbHlpbmcsXG4gIG1lZXRpbmcsXG4gIG1vYmlsZSxcbiAgbXJncmVlbixcbiAgbXVzaWMsXG4gIG11c2ljYWxOb3RlLFxuICBuZXJkeSxcbiAgbmV1dHJhbCxcbiAgcGFydHksXG4gIHBob25lLFxuICBwaXJhdGUsXG4gIHBpc3NlZE9mZixcbiAgcGxhdGUsXG4gIHF1ZXN0aW9uLFxuICByZXN0cm9vbSxcbiAgcm9zZSxcbiAgc2FkLFxuICBzZWFyY2gsXG4gIHNoYW1lLFxuICBzaG9ja2VkLFxuICBzaG9wcGluZyxcbiAgc2h1dE1vdXRoLFxuICBzaWNrLFxuICBzaWxlbnQsXG4gIHNsZWVweSxcbiAgc2xlZXBpbmcsXG4gIHN0YXIsXG4gIHN0cmVzc2VkLFxuICBzdHVkeWluZyxcbiAgc3VpdCxcbiAgc3VyZmluZyxcbiAgdGhpbmtpbmcsXG4gIHRodW5kZXIsXG4gIHRvbmd1ZSxcbiAgdHYsXG4gIHR5cGluZyxcbiAgdWhtWWVhaCxcbiAgd2luayxcbiAgd29ya2luZyxcbiAgd3JpdGluZyxcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvaW5kZXguanN4XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFBZDBTVTFGQjlnTEVRTUNDZVJnVVhZQUFBTU5TVVJCVkRqTHBaTk5UQngxR01aL016di9HZGp0THNqUzNSYWxmRFRiRHdnZ05CcE4ybXFhWU5yR202MEg2OEhFVzlWNDBrUVRzMHVKamFRSEQzclVhUHhvakZSU1U5RklxNmFWR0Q4SXBZV2hXTHJzSWl1VXN0MXRZYitHMlptL0IrUEdpUEhpZTN1ZXcrOTk4cjU1NEgrTzhuY3hHTzNsYU45NUJwN2JLOExWN2g2QjNRUDRwS0taWmFGUFBIUHk0dUtaMkdNY2lZMXNCRVNqTWZyNllweUo5dTd5ZWFzdXRUYTNCc003dTFUTkd5QTk4NHRNSkJMNXpPMlZONTQ0OGQzckd4TDh0WG1vLytETHU3ZldEalJ2MDVHNmd4THBsSXEvVnBHSkdaVFZPNlNUYTF4WnlKMi9sUzg5NlJmNm5TT3hFVHdBZ3hmbkdJejI3b3JzN2puYjB1eWl6NDJEbERpaHNJSWlVVyttRU9ZNFJsT0lMYTBQYlA4OW5qQ09udmptYStCUHdNRHh2YUp4czMrcXV6M3NxNW9aSTNmZ2JmUzZMb3pKSWR4aURpTWZadldoMTlCVGNiVHlkUnhqODhPUFJtby8rdXlIK2F3S0VQYkpQUzNibW9OYStpcUZudU5vRFoxRVAvNlJiNmNrWXZJeXp3OWJ1SUZHQ3ZjL2l6NDNSVjI5amtQcGFRQVZRRmVjbnZyR0ZyVWdTdEtUK1FtdG5HZmFORmtVZ21KSEJ4TVRWMURzRWxwMmlsenpmZmlySllwZE9BYWdBVWpYOVduQ3dNWlJISDVGdmRiUCs2OEdVQlNKcmFvTXY5bUN1L0lCOXRvNHJxSGh3Y0VxV2ZVVndQcTZaYWJucjhsZ2NVM0JzTWpGTDJEbU50Ri96aUFVMnNwVCt3ME9lTjZCWUFPWjMxSm9Xd1NPYloyckFGYno1WW40N0kxOGNJZHZFOTBaQXVvT3hLbXZHRDU1R05jcFljOWNSdXc3akN0R3FHczd5T2hiUTVTSzJxZVZHN3o0cnJtNGtFcWNTaVhUZU5RSXEwc09aYThmYVJXUnBSTHJIc0h0NmV1SXFnNTUwNHlUV3NsZGZlSDBnMTlXM2dodzE5Y3gycWlrRHkxZG1ydzNIVittWjE4RUtWMWNwNHp1OTVLOXNjRFBuNHdwOGVsMGVTeFQ4MUtneVdzbWswbFpBY3pQSi9FRVF4ZUU3Z3R1MzluV0tmUWcxZFgzNEJFMXJHVlZzbGFBdVdWcjl2c0Y0NVgzbHJxR2ttTWoxb1l5dGJkSFZOc09lUjlwU25VM0dMbGpOWWI5T0ZMV1dJNDJ1bHlzL3VMemxaYXpJczlkSVc0VlRIUFcvWStTbnY0WDcwTmxmM2ViK2svM0Q0eHlTaTBiQTlGREFBQUFBRWxGVGtTdVFtQ0NcIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9hZnJhaWQucG5nXG4gKiogbW9kdWxlIGlkID0gNDE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUE3RkpSRUZVT01zbHkwOU1XM1VBQi9Edjc3MisvbnZ2RldoTHk1OTJ0R2tMWThpR0lFTVFEbWFnQ2N4a00wdlF1R1FhRDk0OEdCTWwwUTBPZWpEeFl1TE40QmJuYWVwY01FYUVqYzJCRzFIWm9uU2QvR21oNVJVb0xmMUwyOWZYOTM0ZS9Ody9aSEp5RWoxa0ZxOWNlWUNyVjg2QVYyaVRuamVkMXhFNkRJWWRCQUNvNnFKQ01WOHR5amNMZXNUZm5MeU5tYWwrL0VWZkJwbVo2djgvZnpoUVkyRDFGOXp1WTE4NFdueG1tN01XUW9NTElBVDUzUmhTZTBra0l1dEZLWjU0VjZiS2Q1Yyt2WitkbWVvSEFZQ3JFeS9VV00zQzU2M3RKOTl1TnFiQjZZcWdqUTJBdTRVU2hnTjJKWUtkS09RU2czamVoTFhOemE4eWN1WDlTNS9jeTdKZmYvUWlUQVFYT3dkR0p0MjFFalFtQVRqcktLTW5CQVlUb1ZRbFJNbEFFdzBVV3BwWWExam9SRTkzS3I2M01UWWNlRVMrLzNpa3lXWVIxN21sdUhudlFSaWVON3hJcnVXeCswOEtmWitOd2d6ZzBYcy93M3E2RWFhQUJhdlRxM0FNZWNFOVp5OW1DNVVBdy9IRzh6U1NNZHU4QXpoMy9WdDZzTUxEeG5kaTdPSTcrUFh5TEo1TTNjYm85RGV3KzBZZzNTbGovSU1KYWl3N2tZdWt6VVNudmFwanFUWnNFUVF3ckFIRmE5ZEkzNmxPa0VRQ3pFNFVKYmtLamFIQTlqWmM2VU00ZTN1Z3pNMFJsakRnVFhvVVZYbVlBU0dEamIxdENDLzlTTkhSQVN3c1FMK2Z3UDNnRTV3WTg2RCtyQmQvejgyRExSUkFGaGRSdGR2eDcwR1ErbnM4VUJWbGtORlVGYlUrRVFaL0NRdTNib0FNRG1KRHh5SmNqdUw1MTF2aGZjMkg5Y2hEN0xBc1NOZXptSG04ak9iVFpqVDRCQ2dWbWJEalE2NEJXNjE0M05QTGtjajJGcGJ1aENBaGlaY21Ua0swNnNFd0ZIWFBXUERiVDMvZzhkTk4ySWM0bkhtcmd5UmpaV3lIcFRuMlhGOXp2V2lwR3hXTUZiUjBHYWxNU3FUbmdoZjJZd0pvVlFVMEZYd3RCK2NKRVl4WXd1QzRqMnF5anNTMmk0akY5cjlreXZuQ0Q5Sld1S1F5VFZETEtuRjZPTWk1UXhCVkFWVmtVRVVHcWNvb1oxSndldlNvRmhVaWwzbkV3bEU1bjh2ZFpQMStzVkROSGlZdFlzUFpPbnNOekx5TThFcVVTa0dKNkkwNmxMSkhDQzZFVUV3WHFLL2JSUmpXaHJYVkE5ejdNM0o1SWVXZlozOWZQVVJMczJPdm1Jb0dCSk9qemVwd3dkVnFKVlNqa0o1S05MT2ZRNk92a1J6dmJ5ZUtZc1BhYWdLelM2SGw1WFQ5ZEZ3V2R0aDJsNEJmUW0wbG1DcnJzZkFtYURiWlUxVUYyQndOQ0hTZklrMnRmcUpwZW9RM2NsaFpEdUxHdzhTdGxVejlkVW0ycnBDalpJNEFRS0RGelJDbm16ZFVxMjRQWCtnTVdJN0dIR2FsUytBVUh5aElYdEdGOTQ2NFlDZ3IzdDJYK2JVS1pTSjZqdTV1aFVMbC93RHVOcWZKOC83Ti9nQUFBQUJKUlU1RXJrSmdnZz09XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvYW1vcm91cy5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0MTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBTlhTVVJCVkRpTlRkTkxhRnhWQUlEaC85elgzTWxrSmpQSlRES1RKazFiV3EwRml4Z1EyOGI0UXNVdWZJQ3JXcUZMUVYyNEVUZFMzQlVYb3FKWUVLR3JRTUVpMklxZ0dKSlFhQXZXME5SV3BZbHBIcFBYVEdZeW1lVE8zSHZ1T2NlVjJILzliejloakFGZzdKeXdrcDJsMFlTZmY4ZjFrcy9aanA4V3R1OEtJVEJhU2FPanBveGFFMUc0OVZXemZtL2kxSWRHQXdoakRKYyt6NytZU3BmR3NvWDluYVhCL1lsc3Zvam5kK0Y2SFlCRkxDT2ljSmZ0ZW9YMTVjV29zWGwvZDJlNy9PWXJiOC85Skw3N0xIY20wNzN2NitIalQvblp3aEN0ZG9JdzlER2tNQ1FSbG9kdEtRUXRQQzhpa1dpenZibk16Ry9YdzBaMTlqMzc5S3Y1eThNako3b3p1UkpMQ3p0VU55U3UxNGVYM0VNeXZROC92UStFVHhRcHF1c2JCRHROY2owZGRHVjlaMk8xUE94b3JSeU1CQ1E2YnFHa1FzbGQ0bWdieTNaUWNoc3BBK0t3UVJ3MWNVUWJqSWZSRXEya1k3OTJ2REJTcTYwY3p2Zm02Qi9zSlpWT1lIUkFITlZwN2F3U0JtVlE2OWhXbmU0ZTZNbGJiTmVYbWI1Mm5mSnNiZHloMlovYmUvZ1FOMzc5bVhSM0gvMURCK2d1RkVtbE0zaCtFckNRWVp1dzNXSmp1Y0xxNGlMTnhob0Y5bk5yb1pKejJyRTZPakQwSk1WTWxhMmdTblh1RHZOLzNrUXBRU1ExUWdnOHo4RjFiRHFUSFpUU09RNzNIRUcyOXRJTzd6enFTQ2t4T2dhbHlTWFRkR2Q3RVo2UGNEMndISVN3TUdoUUNoTkhtS2dOU29PS2tUSVdqcGJSN2NiYXdtZ21sYVhkWEdMeTBoODg4Y0lSS3F0TmhHTWpJNFZsQy9yMlpMbDdZNDVqengvRWNyTlVWbGJRU3Q2MmdraFByaTB0S1N0WnduVU1YVG1mS3hldThmdkVYK1I3VS9UdHlUQXo5VGMvZkRORkltR0JqaEdpazRYN1piWGJpaWZFdWJjZVB1aTV6dlRwVTI5MDJtb0dMVGNSam91d0hiQnNFQUtNQWEweEtrYllLWUo2aGkrKy9URUkydEZqOWkrM3FyWHhzVStpNnRyNnlDTkhUN2hHTlppZG1RZGo4RnlCa2pIMTlRYmxmNnIwRlBzUXBzVFl4ZkdnVXRzNisrWGs3aFZoak9HajF3Y3RSNmlKd2Y3aThNbVhuKzFBMUppNlBNN3FRZ1Zod2NDQklzZGVPb2JhdGJqNC9WU3d1RnFaRG1OR3oxOE50UGhQNHdjbmV5MkJmdCsyM1k5SEhuL0lIeGpvdFF2RkFrWXIxc3Nyek0rWDFkVE4yVENPNDdPeDV0UHpWNFAvTlQ3WXU4OWtEbUgwR2RmU1QwdkZVUURYNW5ZWU02RU5GODVmRGU0OStQOExQcHVvM3ZYKzV5d0FBQUFBU1VWT1JLNUNZSUk9XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvYW5nZWwucG5nXG4gKiogbW9kdWxlIGlkID0gNDE4XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQU05U1VSQlZEaU5iWk5kU0oxMUFNWi8vL2Q5ajhmMDdLanAwZVBIbW5OK2pWTGFGckthelcxQm1VRzB1dWlpUmtGZEZBeGpGSU9La2duUlRTeW9HRklNdG9KR2xLeWdVUTVXS201WVpORk9yUERibzlQajhXc3V6L0c4Ny92LzZDTGFGSHF1bitmaGdZZWZNTWF3VWQyZHJkVUNjOFJHdGhpc0JnQ0JqaW1jUG9QNDdLbTN2eC9kNkJmL0ZYUjN0bG9XdXQwSkJFN1VWbFhuRnBUZFplZEd0d09HdGRsUkZxZkgxZkRZWk1yMTNBNnArZURaZDN2MXJZTHV6bGJMUVY2S1JFcWJpbkx0bkxMbVpweVFSZ1NBUUJCMEZtclZZN3JuQXZHVlREcVJUUDdzS2V1aEYwNWUwUmFBaFc2UFJLSk51dzYxNWF5TVgyYXk1MlBjRzJOb2Z4WGpydUN0akRCeDhUUTNacS95UU92RE9ZVjUrVTNLOTE0QnNCdXN3V3JIc2M4MUhYd3NaTllIeVRkL2svejlMK0s5bDZrc3lzR2FtK0duVTZjUnkwdlUzRnVERlFsU0V0a1IrUFBhOEw2Qjg2ZSt0SlQwajFSWFZ1VUtLNGt6R1NQc2xGQi85QnYySE85QkxDdjhjRE83Myt5bnJ2MENZUXB3SnY0Z21LKzV1NnJzRGltOTV5empaVnJ5aW9wdHZUWkdjSEdGOUgydklTUDM4TVRMblh5WC9ReVhGcW80L09McnFNSjZVbnZmSUpoWVFMdEpJaVdGTnNvN1lHV2tiZ3pkV1lKS3o1UGFYb01PRmQvK3lNN2VkTEhhVWtHcWRpYzZzMFJlWVFFWlZ6WTR2dTlqdE1Rb2hXOWxFSXZmUXRFaHZ2cjhmY1ROUVlTd2VQRGNSK0FuWWZsSGZIc2RsQUFsOFgwcEhPMTdzZFhFMVA1d2JqN2FtNFA1aTRqbGZvUVRBTnZHQ0F1V2ZnQXRNZExIK0I3Q3ptTmhkaGF0L0ppVDluUmZZbnA2WC82dWNsdXR4OG1lU2hDTWo0THlOODNIRHVCVzFwRXBqV0k1SWFZbVl5cTFMbnNkMTVPZlh2azFkcXlxdmk1a1owWEltaG5DZnVrWFJMUnhVOTRrcmhMOFpDOXV4UTdXa2k1OVF5T3U2L2xuaFRHR2Q1NnVmSFZiZVdubjQwOCtrbU1QZjAwd2Z1My9GMnpiaVZkK1AyZk85cVRIWitZN1B1eEx2eWVNTWJ4MWVLdmxDTlc3dFN5NnArM1Jnem5ab1RUR1gwVExtLzhDRTlpQ3NNS2tGbnkrT04rZmpzOHQvT1pLOW5jTnBQVXRtSTYzRlZzQ2ZjeTJBeWVhZDlkbVYxUVUyNUZvQktNVjg5ZG5tWmk0cnZxSFJsMHBaWWZVbk93YVNOK0dhYU9PSGdqWFlQVHpBVXUzK0lwR2dJQk56SlgwYXNPWnJvSDB5RWIvUHh1OGpkczFUMDJ4QUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2FuZ3J5LnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQxOVxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFLdFNVUkJWRGlOblpOUGFGeDFFTWMvODN1LzkzYXptMDBOVzVwdE5VdTFMYVdCSUVaYmhRVVZ2QXFDZjZnWGs0dUNRaEdsZ2pRVnZZajFvQ2ppVldnTVdFR2tOMEZKMDROSkxscnhZSExSYUdJVDBvME43WGI3dWk5djM1dnhrRlp5MEJ3Y21OdDhQZ3pEZDhUTUFKaWRFTzhDL3dIaWpwdHF4UVhCUXQ3ZFBOVVlzd3ZzVkdhR21URTNHYnovNi9kUGRaTFdSVXZqSCt6R2xYUDI0MWY3T2pObmVlTE96TCsxdXlNU2NhUDNETDljUFBQUkY1dzg5UzdGVXNCOXgwNFhBaCtON3JTQVg5dS9md2g0Ym0rdHRqZDh1c3JhMmlxSVFMWkViL1V4TWVQSkhRVlhMbCtlQjVCbXhLQUluNTVwNEZ3UnBBek9BNFQvQmM5T1NNRS9rT2N5T3lGaDRFbkFuSWhIWEFIeGc4U3RlWndMZnRvR2pJaTRaNTBQanBucUVERGdBWndMM29qS2QrZG1pVE5OVWNDRmZXeXNuRXV5TFBubU52eUlqeXBUOWVIUlVsU3FTbGdvODh1RmNkemNwSCtsMUgvd3JhSEhQd3p6NUdjMGo5R3NEUlJZLy8wN2g5bGZzNSs3MTN6VU8zWGswZmZLdS9iVUpmVEwrRUlGRUx5SWUrZkEwZGRMZEJmSXNtVkVRc0FoM1JVT1BqenVtNHZuUDRsNnFyNTI2SmtpdWtMYW5rWTFKdWdaMlRxaXFRMkVoVjJrTjZhM1lQRUFhUHRiZXNxSDNMMGpML1pxM3FZYno5RDhZNHJxdmhxcUNXaTJKUUJRVGNqem00aDRRRWc3dHpCVnhDM2lJNC9tbTZ3di8wYWVkdEM4anlDcWt5YlhRQ3oySXBibTNYWUVaVFM3Q3VJSUFpWHRkdWkwV3NUWE4rZ21IY0ppeE1DQllhTEtRMlFwTEYzNjdKWnAvcXJNVGJxUEs5VWpMOVh2ZjZFa3RNalRKU3piUVBYbVZrSmRIK0w3OFlYRHFFWnMvSGt4YXk1T0o1cm5KeHBqTmlFelozRWk4cllFNFp1N0I0L3FYYlVIUzFGcEQwSFVENmFrblNhYjhTclhWaS9GMTlmblJVeS9WTFh4eHBnMUFXVGJOdzRBeDUxM3oyUFVUZGtOcURpV3dSWTB0L1BBMTQweDYyeFA0eitDLzF0L0E4dXNRV3BycldvT0FBQUFBRWxGVGtTdVFtQ0NcIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9iYXRoaW5nLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQyMFxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU5zQUFBRGJBQmZXVlorZ0FBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFLTlNVUkJWRGlOYlpJL2pGUlZGTVovOTgvTTdPejRCNFpsY1Yyak1ZdkpOaVprc2lGMjlqWmJMQVZ1Wnl3c1RIUUx1MDBzTEl5RmtTMm9DRGFRWU1GdVMwdS9DUVVrUThRQ0ZBT0xBdzdJN09POSsrNjk1MWk4eFN3VHYrYm01dWI4N2puZmQ0eXFzck96ODRIMy9yS0luSExPL1paUzJsTFZGOTc3czZyNmtZZ2NjYzdkU2lsOXRyYTJOdVNRelBiMmR0OTdmMjlsWmVYMStmbDVrMUppT0J3V0lRU1dsNWQ3czdPeldHc1pqOGZzN3U3ZVhGMWRQWFVZNEsyMVh5MHRMWFhtNXVaTVZWVzAyMjBHZzBGUFZZa3hVcFlsS1NYNi9UNGljcElwZVd2dG1ZV0ZoVTVWVmNRWXlUa1RRZ0FnNTB5TXNXblZHRlRWVHdQTStjL25jbnd4dHRNUC82ZFc5eWhmL3Z6RXZBSTQ5Nm5WTDM2NGpraENVbzNrdWpsVGplU0F4RUJPZ1J4TGRpNXNIcTdkQTc3eEFLcEtOYnBOcmd0Yzd3VGw2RGFwTG1pLzhTNlRCemZJcWVLMXhkUE5qOHIzQ2pYV3RGSDlzUUZJUmlXaWtzQTRKRWMwSjNBZXpSR0pOWkliTDc3K0pXOENiSzI3VFdEQnZnU0k1QWFrZ3Z4M0YwUVNPVXhJNVhqS1BTeUFCNGo3RDZuL2VZRGtHdE01UXB6c2thb0pydHVuZkhvZmlUVXpzWG9WSUZoTUUyTUlrMUVuRlNOU21HQzd4NmozSDVOalJTY0ZOTmVBRWtPQk1ZU1g5V3F3QnZETytTZmwvck5GTUVnK0dFTlNrNHBrSkNkd2JhcmlPZFlZMlZwMzU0QWF4V0hZODhhWXU4K2Y3aTIrT2ROQ0pEVno1M1FBYXJ4dzdRN0Yvak1BQjJ3MGkzVVFZMTJIUy9mdTNCd01Ubi9jTS81dkpGYUlDaUpDamlXMjFhWFZPODZqTzc4V1dYUmo0MHErZU5nS0Qxejk4Kzd3cDVtWjJmak9lKyszVERXaDk5YUhTS29KMVFTNmIvUDdIL2ZqNk5GREFhNU9iNmRSVmJiVzNRbnYzTGZHbWs5eWx1TWkwZ093MWhUVzhGaVZhMW4wdTQwcithOXB3TDlFNFl2anRjcURWUUFBQUFCSlJVNUVya0pnZ2c9PVwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2JlZXIucG5nXG4gKiogbW9kdWxlIGlkID0gNDIxXG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQUFsd1NGbHpBQUFMRXdBQUN4TUJBSnFjR0FBQUE0RkpSRUZVT01zRndWbG9ISFVjQi9Edjd6K3p1ek96czJjT041RTE5b2h0b3JGU3BVRUtLazB4S1dMeHBRL3hnT0tiK3FJUGlpaFVSYVdJRDBXeHZ2a1NWSXlpb2hXckpMVUhMVWxwUFpxeWpackRiSTV1TnNmZXg4ek8vUDgvUHg4YU8za0lkMFZ0UFBiU2p4aC8veUhUTXR2M0dYYmtGWTB3SWpSRUFBWHArVlZmOGkvTlJ1TlUzYTNmZU9iTnFlYmt4ME5ZcVFqUXhVK2Z4S012bnNIbkp3N3NUcVh2L3FTN1orZHc2czRJSXJZSGdSb0RDcjRmb0VaZFlTMWJ4SEkyTjdtUjMzN2grTHZUODVNZkRZRUE0SXUzQm5mMjdPNC9tK3lNM3hPSlc5eXMzb1psTXRyaUFTSVFpSmdkVnlKa3hsQXVPWFFyc3ptWC9XOTE1UGg3MDR2YTJJa0Jzek9WSG10THRROUd3b0oxSVVuWERCUktUTHFtRU5BSXl6bW03YktHelMySGRGMXlSM3U0clZKMjl6NCtHUDlXVDhTNzluVjBkWTBFRFdKZlNXclZmZmhTRVROakxlL0JORFJZVmhSMlJKRHZLeFJMRFdwTEJyaW41NDVoMTNVSGRNT3lYazkyeEpCZnY0MUF3R0FBSkpXQzd5dTBXaEtLQTlCMUQ0MG13L2NscEZSY0tOVFEzUjNGeXFyeHNxNEpESVVDVFRRZEg0QlB1aTdnTkYxSUJqeFB3WkFLNWFvTFpnV2xBTitYRkFveW13WVFDSW9uaEthTGNEd2U1aDBQak5MYnA2L2kxR2VYVVduWmtCSVFRcUJXYjhCMW1nQ0FWc3REeTVNUUJBcUd3SUdBaU9wUUNtQVh5ZlpPUFAzOEc1aWF2b2FEVDcyRDBzSlg0SG9HaWY3WE1IcHNHTGFoOE55eHc0Z1pEZGlXaEVZRTZVblF4T2tqMVVjTzlkcnJteDRicVdFS0ozYWhtSitCNVU2QnVJWm05Rm40eGw1Y3VuZ0JCeDkrRVByV2wwZ0dWemtRaXREa1JLYW11eTM1VzcxQlJ6dVRMaXBiNDF6Wk1Na01LbGltRGhKQk9GdGZBOEUrSE42ZkFCZS9RZFRLY1JBNlNpVVB6Ym96b1RjYnpzbnM0dWJSZXdjNkVZdnBwQVNEcEE0QUFCTVNVWWJpVzRBa1VCZ1FFRVF3ZVhFdWkycXQvcUVvVk1vMzV1ZFhKOVp6TllJa0prVmdBU2FkQUIwZ0VEUWhvR25FUWdLUXhNdlpJdDJjWGJ2MDF4SXkyazlYOHY2ZWxQbUg3OG9qOFVRa0VZdmJUT3pCS1ZkeDlmSU1mZmZyRXFhdnIrQytIVEdZRVF0ckt4VTZkMzRoZC9aYTZkVWZNb2wvdGYyOUNZeGZTRzlyK3RiTmNxRjh2L0Q5TGp1U29DQ0JZc0VnOTZWczdPbUtrQ2RzK2p1elF0K2ZXL3ZuNSt1MUR6TEZ0aXR4YkZjSUFIcDcwc0pKcEsxMDJOdlZuNUtEZlYwWWJZK0pBN1lwTERCUWMxUWpYMUMvLzdtS013c2Iya3paMWVhTUVPZVdabWVkL3dGOEhxdTQzQkVSeGdBQUFBQkpSVTVFcmtKZ2dnPT1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9ib3JlZC5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0MjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUFYTlNSMElBcnM0YzZRQUFBQVppUzBkRUFQOEEvd0Qvb0wybmt3QUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQXlsSlJFRlVPTXQxMDB1SUZGY1VCdUQvMXEydTZpNjdlN3JtMFozdW1UZ1lCdU1vQkFZTUtzRUVDWVNKRXRSRXNqQkVORU95Q01FaHF5d1RWeUd1M0FXRlVSZ2hFU0dMUEJiaVlxSWtSb2doaVk5eFlnK2o2WG4wKzFIOXFLcGJqM3R2Rm5GRVJPL3F3T1Y4bk1NNWgrQVpiK3V4eTRBU21JUVFOUWdFQWk1QVFBQUNxQW9oRVZWcHo4L3M5ZFJuQVFUUUpjZ1hnd09KNDAvN0w1YmJSd0NjZnlxd2Jlb1M1bWZlOEFCTXYvYlpMOGUzWkxTMXQzZG5jeTVqaFBrY1gxK3V3Mlk4QUFCbFBXbnpSejgrQXVabkpoL0YvOXh2MHorWHJOOFgxN3FrMUhCUWJkb0FBSVVRQUlBNi9zRWxMSnlkUlA3TVczamgyQStqbVVUc1U0MlN3NkdRUTVUaUwrYUwvSzV4ODJDdVgwV2xKY0g0d3hiWGdZV3prd0N1WU5QN3ZRTTd4c3dMazl2VGVyWmZBNEZFc2VsT1ZGdit4R2hhUjM3VnhvV3JsV3Q5cWZnckFLQnIveGV2QXNEZ084MmRiNzQ4Y203L3JyVGVzQnowSEFHRkVBZ2V3dk1jRkNvK3JzMzMwSFhrbE9OMkd3b1YzMmxVUkFGQTJmVGVUOUVkTC9aUDc5NW1wcGJMYlppSkdINWI2T0RVOTh2aTdySU5NeEdWcFVZUGcwbUNEVG8vbkovZFc1ZWNIZVdoTndjQWFpUWlvNE45a2RjOTM0ZW1Vc3pkckxGdnI1Uy9WQlY2ZXJYbXp1eDVLYmt2cmt0RVZRN0MzYU1BUHI4M2UrZ0JBR3crY2hGS3lLWEtoUnl5bVkrb1JuSDFWcXRTYkhaUEZyN1pWNEhQUHY1N3NSRjZBWWZOZkFTZXZmSHhjZWRuMzRWQ3FjSkRMbnNkMjBmTmNqRnNLdjFadzVzYTMvTmhObURONlpRaGFjMXlVYmRjY045WmVYSm5sTkQzdkhxcmQ5MFBnVnRMZFV5TXhlTmJSeE5mOGFIdGY0dzluL3Brb0U4anBZYURUc2RHNEZwelR3TFV1bjB4OE5PdnVrWlVQWlNNNitUZWNwUGswbkZ0Sk5PWENJU2dxelViaHFhZ1dseUJXcjErSW1kcTllSGhZVllxbHlVQVVHcUFEQ1JaZGJVZUdWSWorc1NHbUlaUzAwR3R6Y0M4RUxyQ1VWdGJFVUg1eHM5YVdGemlTbXh0Wk1Eb0xONHZTQUJRMHlOYlpJb1ZuTUJ6VDkrMUgvUU1jK04rTFpZY0ZZUkMrRXg0M2VvSzZTN2VpSVhWTzVDa1JEbGpWaStVangwZGtNbGthQzc3WEVKRTFJeEhFamtRbWlLZ0JwRUNSTHB1UlBvdFNkQWluRmVzaHRIOHQvQ3J0dzc4QjNxK2ZPSnNVeHBuQUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2JveS5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0MjNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBSVlTVVJCVkRpTnBaTkxTNVJ4Rk1aLzc4dzdNMjR5eThHRnpwaVFFNFJHMmk3YUJOSFNqWWdnK0NHRWpLQVBJSWxHdElqYUprcHUybFM3V3JUS1VVRkh6RlNNQ0hOd3hMd3k0Y3ovY2s0THJ3VVY0WUd6ZkM3bk9lY0Vxc3BwS25JcU5CQStlano0d0ZyYnE2clIvd0VHUWVCanNkZ2cvUU45VGtSMGZDS3JUNTg5MGV6NG1JcUkvbDRpOGtzN1o3Vi9vTTlGRHBVbkp5ZElwVk5rczJNVUNnV2NzMWhyc05aZ1RCbGpESjhXUGxJdWw1aWJud1VDVkRVYUFvZ0lUVTNONUhMVFpES1gyTjdlWm1Qak85Rm9sRVJGZ2tROFRqeWVJRjJYeGpwTGZlb0NJbjQvQTRDeUtaTnBiS1MydG81dnk4dThmdk9LenM0T0NQYm50ZDdnU3BZZmU0cXFvaWpKb09hWW9GZ3NzdlI1aVkzTkRmSXJlWFoyZHlCUVZFRlYyZHphNHZuUUtGUFRPYTYxWHFXN3U1T3F5dlBIYTdURzRNVGh2Y09MUjBTd3ptR2R4WG5MOFBBd0MxL21XSW0yOEg1cWhhR2hVWnczeHdUR0dyeHpPT2NSMlc5M0FMYk9NWk9ib2UzV0tqZGJsdGtOMCtSeXMzaC9JZ056NkVBYzN1ODc4QWNoQWJTME5yTys4cFliRitkWS83cEZRK29LWHVUWVFkbVVVUkgrZE5idEhaMFU1VFl2WHRhUWFiaE1WMWM3Y3RLQnRaWXdESW5GWWxSWEowbW42cW1xUEljQ3FGSjU1aXc5UGIyQUhvbnNsZllJZ3NDSGtVaWtWQ2lzVmlTVFNlTHhDdFlLYStUemVUTXlNaEwvMXltSFlUZ1lpa2piNHVMQ25mbDV1UTRFa1Vqa2cvZnU0YjI3OTkvOWplQ0k2TFR2L0JQSUFGbXBKTnlZdndBQUFBQkpSVTVFcmtKZ2dnPT1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9jYW1lcmEucG5nXG4gKiogbW9kdWxlIGlkID0gNDI0XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQUFsd1NGbHpBQUFMRXdBQUN4TUJBSnFjR0FBQUFweEpSRUZVT011TmtrK0lsSFVZeHovUDcvZk9PL091TVdPeHNzbG1PWDhJVnJkeFpyZEwyY0VTSGNXUUZJdWlRNFNIWmIxSVhUc1VDT1doNk9KRjZlQ2g4R1NRdU80TTRsNzJvaWtPQ0hyUlNjVDFJSnEyNjdyenpzenYvVDFkR3Bwa3FiNm43K0g1OG54NW5nLzhpeHJWSWdEMXlSTDF5VklBY09qckhUSjlkS2ZwendqL1EvVks0VTF4dnJhUXo1Ni92UFhGZVlFOXdIWEFCNFBiYXMwV0FET1Z3ckNJdkNCZ0JkNHh5L0V4QU92MU13QXZKTWJyY1VUdVNMOW1yZG5pYkRuL3VqVnlPQlI1VlZTSDFLc3hMaG5yQVNyVTI3bk1tVWZyb3FGZjN4ajVEcmdyOEdIUUQ4K1U4L3VlajhJVFhuVzQ0eElVSVRIZ3drQ0J3MnJNY0xUVS9lcWxCMDlIdXFHOU12LzIrcW1mRHMxY0ZZRFpTdUd0dFVPWitTY1BGdkZyMGxQQVpVQVJXZGpWYkQyc1Q1UW1wTk03dzlMS3FBZk11dHpKMnRWYm53SUVqV3B4TGJEL2o1VjQrKzZiOStiNk56bTFhYVBrUXBPZHJSYkhyVXQrTUozdWFHSU5rZzU2b25vSllQcm9UaXVOYW5FRG9MVm1hK0dYOFZleTFwaHhFUW9wSTJNV3hwUGx6dDUwYUhGZWNkYmMxSFRxWkdQUHk2ZmFROEZ2LzNqajJYSithazBZdkJlbDdHc1dSbEdGeE9ON0NTdmUwelhtdEZwekJOWGQ1a244emM4SE53TnNsbk5iOGxFVUJ1Y3lxZFEyUVJFRlFWR3Z0RjFDei90RlZZNTRrVW54V3BaT2I4eFo2UzZQUFBmdUIzTTNMZ1JHNUZnbWxkcTIxTzVNQTMzQ2NuLzVXWTljdCtqMzZaNzdLQUZjRkdKVmY4dzk2bHpzQXlUL1FlSEhjNVdDWHFnVTRucTErTWxxcVA5dG52RXpXL0xiNXlaS2ZuNmk1TTlYQ3RPcnpjaHFLRGVxUlp1TjBxN25YSndrUHVPVmJ4Kzc1SXNEMTI1M24yMW9Cc09OYW5GOW8xcjhQQnVsM2VKS3JQSGpwNWs0OGUrM0UvL2xnV3UzdTRPYlYyMEFsSUVJdUEvODdsV2RFWWxyelpZT05oelVueWxXSGRHYjIwR1pBQUFBQUVsRlRrU3VRbUNDXCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvY2hpbGxpLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQyNVxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFJOVNVUkJWRGlOeFpFN2FGTmhGTWYvMzNkdkh1WlZZbU5UbTBHeGRJaHRNY1Jxb0ViRklVSlFSQkFjcXZXMXFXQng3RkNTVGNSQkIxMkxKVVZ3Y0xCREVnaVNTQXNPdmdxTlNxTk54Q2JWNU1ab3pNM040M3J2NTJKRExLMEZGODl5T0hCK1B6ai9Bd0NJeCtQNmNEaXN3ejhVQllDbVdodW1XcnAvcytXWFozRndmaFJMTDg3QjJ4SXd4Z2dZRzZGTVBSRUlCT2hHOEt0UkhOWnNNVWQ3TDkzWnBlRzBrVlVKQlFCRlVSeTVYTmFheldadHdXRFF0QmFlSDhFUlRtOEtPOGZEQm0zeE5UcU5UUlBQTU5VUzFLb1NTU1RtM0J4UHJ1Z05tb3VNTWJJS3gySVJyMmJRZDljNUhqRW9UeVpRZVRhRllobFZoZUZDUzZEVDY5S0VrSzJFa0FGRlVmWHRNSy9qbzczWFozYkx5VWZQSys4U1dCWWdxY0N4dmRPWUJRQktDQUVoWkFFQXBZUjJjanpORXhERVloRXZwK1dqUTI2UFVaS3FLTzY1dHUrelpUaEpGQngzaC9DMC9Rc3MvV0Vwa1VsbmtnMjUyV0FxWTVQVGsxNnBVWXNPT0FlTkt5czVDRjhGdkUrbnhQeUJpY3V1QjRpMzU4TUJBTWRwSVFoQ3Y5bHNYckhiN1hXTlJudmZNK1F4TG1jL1FaWmxGSVF2SWhUNGZUNy8zTnFBT1FCSXBWTDFXcTJXNys1eDBDNjcvZllocjlmNE1aTkJVMjZnOUwwazZuamR1akFBOEwrN3VyT3ZyNys3Wi9zOXQ4dGxlSk5jQU9Vb0tsVkpOSmxOL2xNblQ2OEx0d3RnNmVnSWR0bHMrc1hGdDJDTTRGdjVoMml4bVB4alY4YzJoRnNuQUFEaCtWbFJsRHoxWm5OYnZsQ1VWSlg1YjkyNCtWZjREMEc1VkNvWXJOYkhpcXdjL2NuWW1ZZWgwS2J3LzZtWjg0NGQ3Zk12bXN2cHBSdnRTak1BQUFBQVNVVk9SSzVDWUlJPVwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2NpZ2FyZXR0ZS5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0MjZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBSVFTVVJCVkRpTmRaSk5TRlJSRklDLysrYmxsR0tta1VNR1VsS1FTUkdGSXhLQjBDSm9Fd250R3BJV1BhUDlyTnVxdVF4NW16YXpqSDVXYlNLUXdzMkw2QTlVSXBKaHpCeExrWG5QVitxOGMxcjRKc2R4UEhDNWw0OTd2blB1ajduVmU5YzJ4amgySXBFRktFZlJxS3E2QVBWNHpuUExWSVZ0akhGT25Ua3hmblZ3SUttcXZIenllbnp1YXdHQVBmaWpIWUtFWldYN3IvUW1QMDErSmhMaDlObVR5ZnkzK2F6QlVJL3ZFb2dxaGJrZi9GejZSVG1LV0E1S2lDb0c2dkxhc0VWazFIdno0ZUdSOXJiOTYrc2JGUEtMZjFWMFZGSHE4VXBpSnUzY05KYTViMjczRFM5R0lpbGpEQUJhVTZXYVc1WlZGSkVPWTh4WVMxdno4T3B5cWRHT1JGSkRkd1lSRVVRVkVVRkZFUlZFZEd2b0Zudng5RlhLV0dieWFHZnE0dldoYTQwVER4NWpBd1JySVNzTEs3R2trcmd0RkJFT3BWb0I2T3c2MW5ldXY2ZkJYL1czN2dBZ0NFTDhNSXczVjZwWHJ4VXJhQUNncGEyNVlmcmRMRjA5eDdjRmZoQVFySVUxMVhkMll2a0pBTDVQNTlmYk93NG5pNFdsYlVFcENFa2NzQ0VTREVxaStqTGpLU3BIQUt5RmY3ejUvT0tGVnIrbHFmSVRpMS9lejZaMlBYQ2RNTVlVVlhSZ2M2TTg5bnRweFFHYVRQV3paZExPRGVBWjRNZW9HUmpNZWU3eld0bi9mMUFSWk5MT1FXQUc2QUR1eGZzbWdBV2dPK2U1cFhwZFdWWHJrVGg1Q25Eak1SV3prVDJQcGFwazBzNGw0QzJ3Q1p6UGVlNU0zRlUzOEJIWUIxek9lZTVVcmVBZmIzNWdJUDBjMUR3QUFBQUFTVVZPUks1Q1lJST1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9jaW5lbWEucG5nXG4gKiogbW9kdWxlIGlkID0gNDI3XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQUpUU1VSQlZEaU5sWlBQUzFSUkZNZS85NzU3M3h0SEp4cWpYTm5DRmhGUkc4TW9sQ0tvSU51NG1BZ1g0YUpzN2JhdGYwQUxWMGxVOUpOcTRTSm9NR2hTaUNEQ1RRc1JDclNOMWd6aGM1elJlZDU3em1reDQ1UXBXQWUrSExoY1BuejVmdTlWSW9LL0o1L1BSMXJyVmlJS09jWEI0dGZGNHZEd3NOdDJFWURlNmREdXNSMG1vck1tMUZjaWJjNTNkblVlblptWnNmOEVHTXVQUlg3TmR6TkpIMEEzbUhEWUtPVGl1SFFFZ05vVjBKWHBTZ2RHSFZOS1g0TFNXYVVscHlBSG9kWGxxYW1wWUZkQWYyLy9zaUpYZ01Lc0FoNHJwZDR5MEN2Z1E1bE1acHNESlNJWUh4OVBwMXJEWld1RDBCb0xZeTJzTmJEV2dvamduR3ZJd3pzSDV6M0ZMYXVaa2R6SXV0cHM0ZG1MUngvTzlKMDdsYzIyUXlzRnJUVkVCTXdNRnE1dkpwVExaYnliTGlEVkV2NEVjTXRzV25FYkc4Ky8vMWpxVHJlbXc2Ulcrd05BOEVRZzhvakNDQ3ZsRlpDakIyakJiUUNGWmdicy9ldUZiL1BlQkFiTUJDSUNNNEdaSWNJUUVRVEdvbFFxcmpsS3BuTURnNThCdERVQlEwTTN2MVNyMWRVa3FRRktnZGczSUF4bWdZakFHSU9scFVVNHhzZVhFMCtQQTZoc2FZRzlmMVVzRlNVSUFoQVJpT3RpSmlpdDRKeERwVkpONzkrM2R4WkFZVXNHQUZCYlR5WVc1dWV2ZGh6b2FDTWlBSUJBSU13SVRZUTRYZ1lKZjhvTkRQWTBhM3o0NVA0a2dBdkdHUHhXQUdNTXROYnczbStYOC9DZUlNSnZURkpMUmxPcDZIVFBpWk50N2RuMnBoc1JnU2NQb25vV3ZyR0pQZUtWR0hPemM1VWsyUmhWSW9LNzkrNzBocUdkVkZxbmpRa1FCQVpCb0tHMWhvS0NvUDRlaUxnQjVEWHYzTVdoYTlmZnE1Mis4Ly9NTCsvdFc3S09oQmtzQUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2NvZmZlZS5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0MjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUFYTlNSMElBcnM0YzZRQUFBQVppUzBkRUFQOEEvd0Qvb0wybmt3QUFBQWx3U0ZsekFBQUxFd0FBQ3hNQkFKcWNHQUFBQTZWSlJFRlVPTXNseTMxTTFIVWN3UEgzNTNmSFBaOTMzUEVnaFBJVTh6Qk5CVlB6b1phaDZ3R2N0bkt4TmtwYzVUL1Y0cjgycmRac05mdWpMTmVtYld4dE5XdXM1VkJMdEMyWmloanlOSjRKQkVGZzRQRndEOXg1UCs1KzMvN285ZjlMOHQ3Yng1NGoxemhmQmptMVcreWVmTmxndHNyYlptdmlrTVc2NkFQUUUra0x5WVQxOTJSQy9SQzZyM3BuNmp2ajFUMXc0K3p6U0hVSG5DK0R2SGMyRldTV21zODZDdG1QMTBUVUZpZEJDZ0FySnB5UGJMQ1VJajRtVng4T0pOOTljSzU3dkxvSEJQN1BPVnR0alN2cndoc2ZXUlNhTWltWE9NV20yZEJFUXpkMFlpcXVER1dJck9pWWg5dzljM2NUQnliUGRZOExQOVdrYlE3MlhyS1VxZjJJU1dXdjJFV1BKVlJ3SmlTaHVUREptSTdENzhLZjYxWHBmcGNzcHhrcW9TVWwwcDY2MnUwTFZNcnhMYzV2N254VStvR3lLTFVxdUZaR0I1OGd5MTdLUzJXbE9FeVorSDFXREJXbGRXaU15eDI5UExabUdFZCtqNG9Sa3AxZmpaeVdzN21hYW4xbHQ1ck1xMkZMNWxNY2U3Rllpbktjb01kNG8rRW1weXAzNENHRnk1TU9RUDNsR2RYUTJVZit2ZE9VWC9sRE5FdEs0ZXJQa3ZLU0tqbFYrNlFVNVRocGIyOW4zOTRLZm1tK3pzck1GQzhmT01qMDlEUUFsZVU1VXJtelhGeVREckVZQ3Mxc0tGeExjMXlaR09MRzJBd0FoWVdGMU5RZXhaZVJ4ZjJrY09UTkdqSXlNakFNeFpuMmJtSUl6RDNBWkNnMEpaQ3dXbm5jbjhVWDE5c3dsTUxuODdIdDBHdHNMU3FoZm1DQ3QycVBZckZZYUw0M3lXL0RJOHduVFVxMzIxRUNwa3EzNmRPUndENVZVbkZZVXZveWY0MzhTK1NSenRkL2QzQnkxMTUrN2UxamFINkJnZGw1amwrN3krdmJxeGdNcDhRWTZWSnJwanJFdE4zdlBYWjd3MkYzb0h5cnNyalh5SGpVU2xkUUk4OWZRa2pjck00bzV2YXNvbWZKeXRxY2pVUTFEeWxOMU9Eb2hPUk50UzFJY2VXWHp3U2UzZDBjZUhvWGRac1ZxeXp3TUJJaDE3T0syVWdVQWJMZExxWkNZZEtkYnFJclVIdExtTzN0WU9wbTh3bnphRXRuUzhINndMZjYwdEw3S2NPbG1vYnV5Mkk4UWJiVHpudzhnUUErdTVXSmNKUlhOeFJqNEZBMlBTNFNqWnladjFEM3VZbDRuekUyNFcwcktNNEtUS2E4Z1lwMXVYaHRQcFhyOGVHMXAwdW15ODlxajA5NUhSa0VkYXY4M0JXVzBkNyt4bi9xZi95UXhZNllLZkR4WllJWDYrSjlJL1pySXNyMk1KemFsdWR3aTEybFNicFp3NDVHTktKa0xoaVRTM2VHMWEwYjdkKzFORnlzWS9qNytjQW5UUWg3VHJMK3VVMzBmMVlGL3RxMC9CZDJGSHE4cm9OdXUrMkFwckVKd0REb0RzVVRqZEh3OG9YeFAxdkdDTmF2QkU0ME1kamF6WDlDaVpwNXY3S1dQd0FBQUFCSlJVNUVya0pnZ2c9PVwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2NvbGQucG5nXG4gKiogbW9kdWxlIGlkID0gNDI5XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQU5QU1VSQlZEaU5WWk5MVEZ4VkFJYS9jKzhkbnNNd2RSaVlVaUNXOENoQ01mZ2dwcVZBcTZtVWxVM3RTbXMxdWpFeE5TYkdSQk1sc0RFeFdxTnBERXVyQm0wQ3VwQkVvd0dCSUcxVWFzdzBSaW1VVjh0alpoZ0x6dXZlZSs0NUxvd3RmdXMvMytiUEo3VFc3R1prb0tkT29NK1l5QzZOY1JCQW9LSWUxcVJHZkhycXJXL25kKy9GZjRLUmdSN0RRSjJ6Zkw3K2h0cTY0ajJWTldaeFpEK2dTYTNOazFpOTRjMHRMS1Z0eCs2VGlnK2ZmbnRDM1JHTURQUVlGbklzSE43YnZxK2lyT2ptejE5amIyOVJkK28wbG1XeFBQSUZlYVVod2kzZC9MbXltZG1JeFg1eVBPUFI1OC9QS0FQQVFKMExoeVB0YmNkNmk3TGJVYW9PM1Vmek02Y3BDQmFTSHl5ay9ybXpSTG9leHBVM09kUnp2Q2hVR216M1hPZGxBREhjLzNpZHp6Sm11MDg4R1JEeUYzeHJjK1RGYjRNUWVEVTFnSUc1c2dnYTNNb0libFU5dVdTQUw0ZEhVMWxidGhtZWRNL1UzVnRiTEl3WTFsSVVLMXRDdXZNOTBrZmVSU1E5M0VBSHFXTWZrZXIrQUdzbkQydnhHdmxCUlhOdFphR1V6bGxETzdtdTBySnlVNlVXeUUvOFJlYWhWNUhoRnA1NGNZQnZDcDVpTEY3THlSZGV4d3NkSVAzSUcrUnZ4RkYyakhCRnlNUnp1bzJjVkszK2V5cndNcHVrOTllai9PVjNQeklML25leFYxSkZ1cUVKbGR1aU5MU0huQzBQV3E3cm9wVkVleDZ1a1VNa1JxSHNHTU5EN3lOMnJpQ0V3WkhQTDRBYmcrUVB1R1lXUEFHZXhIV2xzSlRyUkxjM2xqc0R4VUdVc3c2YjN5R1NVd2pMQjZhSkZnWnNqWU9TYU9taVhRZGhsaEpmVzBONWJ0VEtPR3B5WTNYMWNMQnRuK2xsVjBBYWdBQ3R3RFA1TzdiRDFlRXJJT0RBMFNiQ05VRU15OC95VXRSTForV0VZVHZ5azVtcjBheVQ5V1BraGRIUzVmSm5QN0x4K3dwYk45YTVmSEdDeHE1R1dvNDNzekF6aHpDTFNjVnNKbWV2MjdialhqUy8veTJSSEI5NngwbHNiSFkwdFI3MmFXK2JRTWppMnRnZnhPYzNhWG1zaWZMYUVJVitIOVgzTnlMMFhvWXVqV2ZpeWR0OUZ5YlRvMEpyelpzbnF3MUxlQlBWbFpFSGUwOGNMU3J3WjlCdUFpVjMvZzNHVjRJd0FxVGpMcGUrbXNxc3JNZC90U1dkZzlNWmRTZW0xM3JMRFlGNnhUUjkvUjBQTkJSVVZaV2I0VWdZclR3MmI2Mnh1SGpMbTVxZHQ2V1VmVkp4Zm5BNmN6ZW0zYnpVSGFoSHEyZDlodXB5UFZvQmZDWlJXektoTkI4UFRtZXU3OTcvQStEQmw3WkFaQStQQUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2NvbmZ1c2VkLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQzMFxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFJeFNVUkJWRGlOalpOTlNGUlJGSUMvKys1N3Zmd1pGeTRxWk1RU1EzcU85SXNSUnJOb25adWdjdUZHYUJFSUlvZ2hnbUEwRUtTMHlvRis5aFc0cUgwTVN0UWlWOWtQS1NTVUkxcGhwalR2UFgzMzNSWXo4MmFtWnVIWjNNUGhuTy84M1NPMDFsU1RtUjRSbHdacHJVa1dUTE9oNXNibEYzcWwzRTlVQTh6MGlMaGhpSVhXMW5oOVUydTdHWnAxckM1L1VjdWYzMi9yVUhlV1E0eHEyUTFCdXFVbFh0L1NkdFNzMzFwQXJyMGxmdXlrUE5MUkZUTUU2UXJmYWdBTnljYm1kdE5kK2NEMmozVjJObGJKTGM1eG9ETXBOVkZMQUpnM1I0ZnYrTDQvckxXV1JlTjVZUkdhZFhpQkJBL0NFS2lWV1B0cVVjS0tEUTROYUNHRXNtMTdVZ3dPRFFSVGQrOUpLYzJJK3ViMkpjeXRieHhzTzQ2M05JY1drb2F1WHI0dnpwTlRrck5qei9IOUhVYkhScFNwdFpaU21teHMvSXdBaDYrbG1COVBJcXdhRHAyNmdtSFhzdjdwTlNzZjV6azlrV0Z6OHhleFdBTmE2N0swWldJM05uSG0xaXd2VTFmSkxrMERtdTI2Wmk1T1pMQWJtL0p6S215djZoQ0xrS3pUeDduN1M1eVlla2ZXNll1Q0FjTHdINERLcE5rWjcwUmxTbHN5RElubmVmaStqMkZVNXRJNnpHK2hCSmlHMzJ1b3pEVDZ3blVBRW9rT25qNTdBa0JISWtHZ2dnaFExQ05BME4yUGZQVVkxZDJQOG5JQU9JNkQ0emhSa0Z1dzU2c3pTb0RkWUpkNGJ3cDZVL2xxUWtXb0ZFb3BWRmg0VlZDbUszTHVueExnYTNZWjF5M1I5eUw3N1pvOFFBaWhQTmVWUlFOVUh0ZC9wNmFMN2JnSUlaUnBXZGJrd3dlUEtyN3lYa1FJb1N6TG12d0xIQy95UEZDeDE0QUFBQUFBU1VWT1JLNUNZSUk9XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvY29uc29sZS5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0MzFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBTkhTVVJCVkRpTlZaTmRUSlYxQU1aLy8vLzdIajRPY0lEZ3dKR1FKUVA2OEdQWmgydE9nYlFWY3BWVGIwcXlWamUwWnF2MXNkcVVvSXU2S0Z1T01XL2FXbTFaRTZvdHJXaXprRmhybFhQcmRGR0tvU0FJSE1Da2M5NXp6dnYvNnNKU2VyYm43cmZuNXRsUE9PZFltYUcramlhQjYvTFFiUTY1SGtCZ2t3Yi9sRU44dU92ZzErTXJlZkhmd0ZCZmg1VFkvWDRrMHR2UzJGUlNXZGZnbFNUV0FJNzB6RGdMVTMrYXMrY3ZaUEpodmtkYkR1OTlZOFJlSHhqcTY1QSsrbVE4dm1yVHpiWFYwVXMvZjBIKzZpSk51L2JnK3o0WGh6Nm1vTHlLK0xwMi9waWNDMmJuNTM4S2pkeis1S0VmckFTUTJQM3hlR0xUeG0yZDBlelZKUFdiNzJEdFkzc29xaWltc0tLWTVpZjJrV2k3RjZVdnNibmp3V2hWZWNVbW84Sm5BY1JnNzBOTkVWK2VidCt4T3liMEwwUm16bEtRK2d1RXdEUTBBQkp2Y2dJY3FMb0VxcjZaM0ZLTVR3ZVBwN041dlZFYXJicWFibWtzRVhJZS8wSVNQMXRHcHZWdE1sdmZRaXdaVkd3TDZXMERwTnZmeFY4dXdKLzRqY0lLeTlyR3VtS3R3MzNTaGJtMjh1b2F6NmJQVTdod2hlQ2VGOUR4ZFR6YzNjZFhSWTl5TXRYSXpxZGV3VlRkUnVhK1Z5bWNUV0h6ODhScnF6eE0yQzV6Mm00b3Zha1dFOHlSV2RPTUxhMjU4WkZYOUwrTFRWazltWmJic2JsRnlxc3F5ZVgxZWw4cGhiTWFad3hLNWhBTHg2RjZHNE1mdllOWS9oRWhKRnVQOW9PYWg2WHZVRjRXakFDalVVb0wzNm93ZVhYMlltdXNwQUliWG9hNWJ4Qkxvd2cvQXA2SEV4SVd2d1dyY1ZyaFZJand5a25OekdDTlNzb2d0S2RtcDZhTUxGNkZNK3BmS0UvL2k4ZHdZUjRYNXVoLy9paE9oZGVxRlVLVWN2SEN0TWxrOVloNHMrdldwb0tJZjJidkk3dExQZk1yVmkwaS9BakM4eG5vR1FiZzZkYzd3VnFjMFFpdmhPQktqTVB2blFpQ1hIaW5mUG1EMzhlRGRQcTE0UlBEZ1IvZGdQUXJjU3Brb0dlWTdvUGI2VDc0QUFNSHZzVHBQRUpHRVRiQnNjKy9EN0xaYkUvL3lOL25oSE9PQXp0WFMxK1lrZFYxaWJzN2Q5d2ZMU29OY0dvQnE1ZXZDUk1wUThnWW1aVGlrODlHZzhuTHFUTjVUZXVSc2NCZWwrbWx6aG9wc005NVhxUjN5MTB0UmZYMU5WNDhFY2Radzl6MERCTVQwMmIwOUhoZWE5MmpMWWVPakFVM1pGcVpaOXBqelRqN2VFVGFObVhZQUJEeFNPWTFJOWJ4L3BHeDROeEsvaC9XNTUyVkZsbFNsd0FBQUFCSlJVNUVya0pnZ2c9PVwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2Nyb3NzLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQzMlxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFOaFNVUkJWRGlOVlpOdlNOeDFBSWVmNysrUG52OXU3czdUVTFSVTd0U1ZDcTZ3VnFiT3hWSmZCR05HQkkwR2UxR0xXSTJpRjBHSnZobFJEWW9XMHBzTkJzTEdYTUVNVnFPaDVtSnJmMnJjV3VMT2FmTy9kOTVFN3M2NyszMS8zMTh2b3MyZTF4K2VOeDhlNFRnT1d4a2U2QW9JbkFNNnN0MUJhd1FRcUpDTk1lWWdUdS8vNUdKNDYxNzhKeGdlNk5JMDFCSEROUHRyYXdKNTI4c3E5VHgvTmVBUVh3d1RuYnR2VDAzUEp0S1pkSjlVZlBYNnNWSDFTREE4MEtVWnlKOTl2dEtXNmtCdHJ1NkdUSEtGemJWbFRNUEFWVnhCbHN0RGVtbU5PM2Vua3N1cnE3OWxiRzNQb2VPL0tnMUFReDN4K2Z3dHpaMDl1YW1OVzRST2ZzcnNqOS9qOGhTUTdjbG40ZUpaSms4ZFE2cDVudXZhbSt2ZFZ0aGlXNWwzQWNTNS9wY0NwcUhkN09qdWRRdDVBM054aXF6SU9naUJYVmtKYU9nUFpzQUJxOHlQVlI0a0ZYTnovdHhJZkRNdG16VmJXZ2NDVlRWNVFsdkZtQTFoYkJhUWFQdUN4QXVmSTJJMmxydVZlT2MzeER1K3hOakl3cGk1UTNhaDRzbWFzaHdwTTI5b1RpYlZ2cTJvV0ZmeGFiS2pEMGsrL1FIUzE4Q2JKK2U0VlBnMlkvRm0zdnAyQ3R0YlQveVpqOGhlanFEU3EvaEt2RHAycHNOSVNkV1U3eW5CZm5pRFJIVVFsVi84K0NQRDliK0x1eis3UjQ3eFBuczNaemxZSHlPVmxvMkdaVms0U3VMWU5obVJSb3VPUUZFbko5NXJRbXhjUlFpTlhVZWZCMnNWVHg0MDdxamovRFdOMTJxaVdKWVVockl5b1JOamR0dll3cXNrMG9JTHZVT0kyRGpDTUVIWGNZUUdhNWRCU1Y0T0JCaTZKZWtKTHJHeE1vK3lyWkN4bnNtNmNpSHNiZXQ4TnNqdDBKODQwbUorT3NiOXlWWG13aEdFcGxIOVJDbUJobEo2Z3duMlYxMUhkMVZ4NWFjRk83RXBSL1VYRzl4L1o3S0tEdDlkMGZWOWdTbXk1NjhSdWo1SGRaMlBsajExMU84c3g4NVkvUEhMTkxwUWVQMGxKTllNenY1d05aVktXNGYxUzdlanNjblRoNUtkMi85cWZhV3oxbHlhRGJOcmR6bmVrbnhNVTJBYUFvOHZoMkNEajZXNUZDV2xPeGc2Y3prWmlhMzNmVDJXR0JHTzQvRHh2Z3JORVBab1Jabi9xWjd1M2JtdS9DU09GVVhKalgrRE1Rc1FtcHRFeE9MTWQrUEpCMHVSMzlPU3RzR0pwSG9VMDRjOXhacEFIZFYxczc5MVo2MnJ2THhZOS9sOU9NcG1aV0dSbVprRmUveG1PQzJsN0pPSzQ0TVR5Y2N4YmVXZERuY1FSeDAwTmRWdTJUUUJtRHFodEdSVU9ad2FuRWplMjdyL0I1VFNqb1hKNERBekFBQUFBRWxGVGtTdVFtQ0NcIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9jcnlpbmcucG5nXG4gKiogbW9kdWxlIGlkID0gNDMzXG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQU5vU1VSQlZEaU5UWkZMVEZ4bEFJVy8vejZHVjRmSE1ETU1VRWJiRUNjRUtGR2FWQ01RWXRxZHNkRzB1dEVFRTllbW1waW9HOUxJaXBxcTZWS05ZMktNRGJLckpxWm9DYlJCU3ROU3BvV0dXaGdITG8vQURGT1kxNzF6Ny8rN2FOcjQ3VTV5OGkzT0VWYzdPMDhCZjUyOGQ4OERVR2ZQdHFQVWtKSnlFRTA3Qm9DVUNhRnBrd2dSRjJOakR3RW11cm9NNEtTNDJ0VlYxZ3lqSUlUNHVTY1NTZGZYMVgza3RyZFgwTlNrRXc2RGxDakxRbTF0ZWQ3S2lwM0paaS85czdmWHFLUjhSMGxwaWo5N2V2TGRRMFBWNmNWRjViZHR0N2F2ejh3dUxSS29yRVNsMHdDSWhnYlMrVHkxYlZGMmJ0MXlaU0JnQkRvNlNNVGpPZjM5dzRkZktlZHlSeU85dlhyZ3hBbTlORFBENHJWSmFuMEZqT29DeXRnbmwxbG5lZlkrVFdFZm9iN1hOTjFmaDNYamhtcy9mdnlIMFJrS0RlTTRwMm9qRWFNME44SDJ4anlpVWlleGtNSWZNUkRBL3BhTFhtbXl2ZjZBMXZveTFRMHY0bGlXWjdqdWVhUEc1M3VMamc1REZpMnMxVG15dmlqdEZ6OEVZUHU3UzBSZWZ4bjlhRCtlNDdMMjlWZUlCOHRFQjVvSlJhUEdTaUp4Uml1VVNnT0VnN3BYV0dRcjZkSjI3bU1PZFhieXdSY2piSngrbS9tcUdPOSs4aGsxc1JoSFB2K1VyVlVQV2JTb2JtN1ViY2NaMUlybGNyY1dDU0h6bTNTOTU2Zm11U0JQRVdZRktQa3NWN1MyMG4wbWpNcnRVeFVPa0xQdGJpUHZPSVRLRXZLVitOUXU2djczcUJmZTVKZHZ6eVBXeHNFemVmV0hMeEg3YTdEd0cyYTJCRjQ5SUNtVXl4Z2wyMDZVa3FsKzAzMGV0VkZFSE54RTNid09oZ3NDa0JwaWFocGhtMkNiaU9JaHRLb3dtZFVObkhJNW9lWEs1YW05Vk1yVEdsb1FPL1VrSm5LSTFURGF2eEcwVkJodExZUm1CV0d6Z2J0VEdjajRFYjRnYThta2x5MlZKcldjNC95NFBEdHJlNGFCRmdyaDAzMzhldVZ2bHVaM3lWc0crUTJkcFlVZHhuK2ZvY3FzUk5UVlVTcVdtSjZiczNPMkhkZC8ydG5KekYrNDRHUXRxNit0ZjhBTStpcW9RWkhjM09MNjNRVVdrMGtxVEpPWFlqR094R0tJWUpDeHk1Y0wyN3U3d3lPdWUwVW9wWWkzdEdoQ3FXdU5iVzNIKzArL1VXMUtpVXFuVVFjSFQrYXZxVUh6K3lrVmlveU5qeGZXTGV1T0xlWEFxRkpTS0tVQStDWVFFRkxLYzVwaGpCenY3YTFvaVViMWh1WUllSkxkVklxVlI0Kzg2ZHUzYmM5eGhsMmxMbzZxSi84K0V6eGwyT2RybDBvTkdUQm9lOTR4QUZQVEVyYVVrMUtwK0toU0QvL2Yvdy8rQXFlOTNnUG9VUUFBQUFCSlJVNUVya0pnZ2c9PVwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2RldmlsLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQzNFxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQVhOU1IwSUFyczRjNlFBQUFBWmlTMGRFQVA4QS93RC9vTDJua3dBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQWQwU1UxRkI5Z0xFUUlaTXYyZkdmOEFBQU1LU1VSQlZEakxwZE5OYUZ4bEZNYngvM3MvNXV2T0pKbE1RcUk0YlRLcFNhMW9JUkUwR0lvRjA2MmdyUnRkdUJQVWxhQWdDRE1STFFZRVZ5N2NDSW9yVXlsWWhaZ1NRb1RHU2x1TnpjZWt0dW1ZUkdaTVp0cVp6TWVkZTJmZWUxOVhSaVZMeis1c2Z1ZUJ3d1AvYzhTL2w1bjBKT2VtTGpQOStvVFpGL2JIVE5xamdLV0VzU2JOd1BJcjV4ZnpGekpuT0p1Wk93eWsweG1tcGpMTXBDZVBSeU9oSDFJRHFVVGZ5RW5OaUhSUTJyaW1jcmxjNC82OTRvY3Z2TGZ3d2FFRWYxKytPUFhzMjZrVFk5TVBQNTVFZFBvUTBKUXdUQUVCcUxZbzNOeGlmZm5ueTNzTjU4V1lHYWljemN6OWsyQW1QWGw4K05IUjdNQ3dRbWtWZEtzYkxSd0QzVVI1RXVYV1VVNExXZXBpL3Z2NWo4Kzl2L0FtZ0E0dy9kcUVtZXlOclo1OFl0Q1N6UTJFR1VLWUp2Zys0S1BhRHFydDRqdjdhSVlMcmVENE04TmRYMzY5dEZYV0FQb3NOVFo0WkNEaE9YZkI5OEN1SWpadXd0MTFWTE9PdUxZQWxSS3EyY0J6Q2lRU0poN095d0FhUUVCNG96M0pRVTNhdTBxdjFRaXU3UkhSSHlIays0aDdmMkpGVWhnNVFmRDJMWlJzRTdVRW9tMi9kQUFvMzdjTU00Z3ZtOExhTHFHZS81eDNsenBadks0SXJtWjVZNjRYWi9JanRPNVRxSFlMVFhpNGp0dHpBTFJhN2xwcEs2dDBvd00zR3NDVU5kYXp2MUd3YldSWGxPV1ZkWVIwOFl3MmVKTHEvVHBlMjcwRVlBQlVHM0o1OC9hZHhsTlBKNk4yVjVubXhqU2Z2VE1FdFRxMlp2RE4rWDY4clUrd1JSYmhLVXBGQjZmWi91cmdDN08vRkd1blJ3d2ozcDA4YlFYcktIY1g1ZVM1Y3pYSDdxMDhRbFlJRzNzSVh5bmRPQ1lXNTY3ZWVQV0xuYmNPQUlBLy9LTkwvVEozWnVURXFZYzAzUVZaSi81Z0p6M0pPT0dvaWZCQk40NkpieS9NdCtZMy9iVFJQYlJhS0JUOEF5QWVqNU52OE92dkt6ZU94c3lPb1VBd1FTUWNSemM2cUZkMHRuZmcwbmRMaGRuTndLZFhLZ01YOWRaK3VWZ3NxditVNmJIeEp5TytJNDRNeDhvVEthdjZYSC9JSGhmS3N5b3l2TGJUaUY2NXZ0ODNpeUtuaGRUMnlvOC8yWWZhT1BoQVhFaHQwS0EzRmlvMFF5RXBOUU1DbWhXb1labSs3QTg2VGpuZnNnMC9KM09Gc2dMNEMyNHJaT1lId1hSU0FBQUFBRWxGVGtTdVFtQ0NcIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9kaXNhcHBvaW50ZWQucG5nXG4gKiogbW9kdWxlIGlkID0gNDM1XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQU03U1VSQlZEaU5WWk5OVEZ4VkdJYWZjKzRkcGpBd1RBdkRuNFMwZENCV0xFbU5FdE5Dd1pvbzdVcFR1MnV0eG9VeE1UVW14b1dMRXRpWUdNWFVOS1lyZjJQRkJGZ29VYU9SUUVPNnFHS2pvd3NwQ0JRWUdSaG9xZk4zN3puM0hCZHRMWDJUYi9ma2VSZHZQbUd0Wlh0R0Jub1RBbnZLUVhkYjVINEFnVWtHdUpNVzhmbnhzOS9QYnVmRlhjSElRSytVbUROdUtOVGYycHlJN0d4b2NpSjFld0JMTmpWTFp1bnZZR1p1SWVmNVhwODJmSER5N1FuenYyQmtvRmU2NkovaThmcU9CMnFyeTVaLy9nWnZhNFBFOFJPNHJzdml5QkFsbFZYRUgrN2hyK3ZwL09yYTJoVS9rRSsrTkhqWlNBQ0pPUk9QMTNVY09IS3NyTENWcFBIZ1E3UTlmNElkc1ZMQ3NWSmFYanhOWGZkaktMM013ZDZueXFvcVl4MkI4bDhERU1QOVR5ZENycHp1T2ZwY1ZPaGZDS1ZtS0ZtL0NVSVFORFVCRXVmNlBGaFFEWFdveGhhS20xRkdoOGV5QlU4ZmtJRldweEs3bXlOQ3J1RXVKSEVMRmVRT3YwZXU2MTNFWm9DS2RwSTk4aUhabm5PNHQwcHc1LzhnSERPME5UZVVhdTJmbHRZdmRsZFcxemdtTzBjNGM0UDhvMi93ekNzRFRNemM0dDhuenVHMW5tVHl6elRQdm55VzNPTnZFVjVkeDNocnhHdXJIQUsvUnhhMWFTL2ZWVXVRVDVQYjA0SXByN20zVVNnQzNKczVxR2drMTdvUFU5eWdzbW9uUlUvdmQ1VlNXS094UVlDU1JVUm1qT0V2QmtFSVJHWVVJU1JkSFlmbyt2SThySStpbkFJRUFnS05VbHE0UnZuSnJkWEZ3OUZJRE9QL0Era2ZFSnVYRUc0SUhBY3JKR3lNZzlGWXJiREtSemlWcktkU21FQWxaZDQzazZ0TFM0RXNyY2NHNmc3a1laVkgrc3J2ekF4OVMzWTVoVlgrN2RNS0ljcFpYRmdKY2dVOUlUMWZmM2I1MTJUQkw1UWpTK0szQmRySEtvL3FCNXVvYWQ5TGF1b3ExdmZ1dEVmSXJubE1UbC96UEY5OTZ2ejRXMlp6L09JN2ZtWTEzYm12L1ZESUJsdFlsUVZyQVV1NG9wUmRpUVl3R3VHVUkydzlGNzhhejY5djN1dzdQNWtia3dCRlAzaC9ibUZ4ZW5qbzY3eXY5K0pXdENGRFZXQWRzQkxoeHBEaDNlUnZSUG5vNCsveUN5dnBxeXBnOEw1bmV2TllqUlNZMXgwbjFOLzVTT3VPeHNZYUoxNFh4NXFBOUVxSytmbVY0TkwwcktlMTd0T0d3UXRUZVhPZjRHNWU3WW0yWU0wTElXbTZWVUE3UU1naDZXa21qT1dUQzFQNWE5djUvd0Q0L0tuY1FCYW1iZ0FBQUFCSlJVNUVya0pnZ2c9PVwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2RvbnQta25vdy5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0MzZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUFYTlNSMElBcnM0YzZRQUFBQVppUzBkRUFQOEEvd0Qvb0wybmt3QUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQTVOSlJFRlVPTXNGd1Z0b1czVWNCL0R2NzM5T1RwT2NwSmxOMHFacFNzSzBwbDF4eUlZUG5SVW5WbjNRQ2h2b2czaDVtQThGWlNyNHNDS3NMVEpRUVdGN0VNRWlRL2VnakRtbGlCWW1UcWhkSzdhVFhtek5YSnBlYzJ2UzVuWk96dVYvL240K05ENCtqcE0wamVHeE83Zzg5aUtpdkJsVnZNb1pHV0lJakEwQ0FCdytZd202WmVuMnpWM0Z0L2Z1eFJ1WW1oakFnbmdPTkRVeGdPR3hPNWk4OEVRZzZNSkxrVmIzNVdBdzdBMGVmUWkraDQ4RHhGRDk5MitVNzYranRGL1U4alg3bmJLUXI1Kzc5RnRsYW1JQUJBQlhSeDhQdFBrQ254NkxoYzkxZGtoQUt3ZTVmYUI0ajRDa0FOa3RRdU1RdkdRaXUxSEM2cjR4V2RIMTk5KzQ5SHRGdWpyMk5OeU9lTFgveE9CNHBEY0FXRHR3WjlKQ0tBbzV3VERCc1VuYXkwQk8vU040U0NWdjhoaGN0dmRFS1YvOGIvalo1RjJtV29qR3VtSlhJakVQYU85UGVOYzMwZXdkSVNrUFNNc0xZT3RMWVBlS2FQYU5rRHUxQzNsN0VaR0VINUdRNzRxbjFvd3lSWFdmQ1Vkalh2QTBXbloyaFhacUZLWEVXYVQ2TDRBMmQwQ1pUZHlOdklKaTdBWFVUMzhFWlNzdEpGY1pvWTZRRjdJNHkyU0lvWUNmZ1RkTEVJd1JLVjdVYzJtOGZ2NEQxQXlPdXNGeC91TnZvQlUyUVZJTGhDUVJ0MnNJcUFMTU1ZWmtNRGFvK2xVWUI0ZENpNGJJVlYxR3BTR1E3UFRCNm0wRlNUSjZPelhrczl1STh6MW84UzRJdlNyOHJkM0V1VFVvT3c2SGNEZ0V0OEVWQldaakZ2M0JQQ1pIMjJCYVRZQVJQaC90Z0MzbW9GWFNrQlFGd2pUaGtBWGJOSWx4VTUrcEg1UkJ6RTBTdHpBMit4cEt1UXlFbGdjc0hUQjFDTDJJWWk2RGk3ZGZCdU1HR01sVUtSN0FNWTBaMXRTdFg4dGxIWkxrQmJkdDhXYnlPN3oxOHpQNFliVWI5WWFEZXNQQmphVTQzdjdwU1l6MGZ3dHUyWUlnb1Zpc1FkUE5XM0t6VnY5K041UCtKQkxwOHdpblFCMmVLZ0RnMm5JL3ZsNDZEa1ljQVBEWlU5TUl0MVFoTEU2bXBXSTduVEpxMWVwTmVlV2drYTFxMWZkQzdWMWZKQklKa0pZREFNUkRZWHo0Mkpmd1NEcHNoMkJ4SWNBRk1TbUUxRklXQyt2RmlibHFUMEdhWFNrajN0V2UwMHBiUFQ1UGUvSkl1QXVuanBaeHV2TXZ1SnlLNE53QnFJVmt5VXVtMVliVVNnSFRmNnpOengrRXY5b3pmRHRTWDh5SFg5YVNPanptdmUzMGZhQlNPS2s0aEFka0R0WFhTVVJIcUZLd3NKR3VZWEYrRmRmbkNqOHVIb2F2N1JwdGk5VFlyeElBOU1TN0dYVjBxeTIyM1oxUTY0LzB0RGFlYi9kYWovcGMxb01Rb0pvbHAzTU4xK3BheFg4N2I2Z3BVN0FOeFNXeW1iVzE1djk2OWNDbDU3SjZDd0FBQUFCSlJVNUVya0pnZ2c9PVwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2Ryb29sLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQzN1xuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQVhOU1IwSUFyczRjNlFBQUFBWmlTMGRFQVA4QS93RC9vTDJua3dBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBNEJKUkVGVU9Nc2wwYzF2RkdVY0IvRHY3NW1YbloyWDdyWmwyeTNiWlJWYWE2dGlsWENvWW9LaDBZT1NBRUZQSnBpWWNQU2lCN3pZOXFBSEV5OE5GeEpqU3VKTmd6RU5VVWhKSUFMYUNDMDBoY1h0RzIxMzIzWFk5KzN1enV3ek00OEgvb0RQNlVPVGs1TTRRdGR3Y3VJdnpFeWNnTUhGZnRVSW41WkpqSU5KeHdBQXZuK2JDOHg1VGZmWFBSVTduMDdld096VUdPNkw5MEd6VTJQUDhZVzNJaUZKUFp0TUhwanVTUjNTdTN1ak1PUDlBQkhxdTlzbzVndXdOMWFhdVIzN2MxZndYODU5KzJkMWRtb01CQUF6WDcwZDZkTE43MThhUHZ4WlFpdERrWnNRZlhFZ21STEVGR0EzUjhodXdXMHg3TlREeUt5dC9WQngyMStlKytaV1ZacVpPQUV0RUorOGN2VGR5WVMralVCNUJqOFdGU0JCcElWSkJCNEZqVEo4U3hNSXloVFZCR1R6d0p2RnZMMTY4cjJoUmRuZzJOK1g2SitPeDJYNDNFSElkcUJ1UHFGZ1h3ZGNNd0lpQm5VbEExYW9FTytOd0VtWWlCdGgyRmx6MnM3WGZtZXFvWjJPSmZwMUJCdFFONThLQ2gxRjl2Z2xQQ2lPUUhxNENQWndFUStLTHlONy9CSWdIMFpvTlNPa1VCbjdlcnQxeU9JTWt5SEdJenFEWDYxQXJkVElIZjRJUzJ0NW5MLzhHSzFzQWExdEcrY3ZQOGJTV2g3dThNZFFTaVh5SzAxRVZVQU8zSEVaakk2WmtnSC9xZ3czOWlMazhpS2lvU1JHVTUzZ0l4WUFodEY3REZFMWdGeGVnTnM0Q09tcWo4aUlCZUxCTzNMZyswRERlOTZkamtGazUvRDZtVmR4OFl0T2NMOEJNTUxGQ3haNDhBLzQzVFRZa3dnWVo0SjJPUWtuWUxMUG5kdDFYanFsRGJtZ2hJT2FxTU5idlE2THVxQmFZU0FnTkdzNTFIZVdvQ2s2OURkMEVKZW9BUTR2MTdvak95MStvOWgwVHZVbkNWNnJLTUtLUXZidUhrcjNpMmk3UGdCQTFSVG9FUTFXU29QbjFJUXM2WlRMT0tpNnpldXlVOSs3a3R0Yy95N2VOeHdXUEU4a0NmU2tPaEVFZ0FnQUVJRUlrR1FHQkQ0RTg4Z1ZPclkyLzNVcjFlb1ZhV0RBMnZPcXBVS0hGZit3TXhhQmFKY0JCSUlZRVdNRWlRRkVBdkE5UVlGSFRPcEdadmtaYnQzYitQcG1jV0JPdXJ0Y1FpclJrMjhXdHdiTmNNOVFaeXdCUmZhSkVFQUVYRUQ0WUV3bFdRcFRtM2NoczJ6ajJwMzAvSHc1OXVPT2EyYWw0WDRUZjZTSFdnaTNWN2JYMXlDcWhTT2VaMEZoQmd5emo0aWlWTFU1TnRicldKaC9oSi8vdG45YnFNUit5cmxkQzlRbzFBZ0FCbE5KUnIxSkkrUjV5UmVNdmRjR094b2Y5T2g4MUZUNElRaFFuY3ZyK1lieUtGMjFidjduR3BtMllCdXFJbmFmcHRQTy8wbmZxQUZRVUg3V0FBQUFBRWxGVGtTdVFtQ0NcIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9lbWJhcnJhc3NlZC5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0MzhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUFYTlNSMElBcnM0YzZRQUFBQVppUzBkRUFQOEEvd0Qvb0wybmt3QUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQTQ5SlJFRlVPTXNseTAxTW0zVWNCL0R2Ny8rODlHbWZweS9Bc0IxUWlpRU13Y2tJaWdtT3hKbWhPNWlaYlprZXpKS1pxRHN1bW5qUWkwQ2lKaDY4a095d3hCaDJkcEZORG90eEpPcFFoNXN5bUZCQ1ljQW90QlFlMmxMNlBIMWUveDc4M0Q4ME1qS0NGK2tubkIzK0UrUERwNkU2dkVsV2crZEY0a05nd2lBQXdQT21IWTY3cm1GTkhNcllmbTlrQ3BPakEvaWJud0ZOamc3OG56OTlKUm9RNUl2SlpPdllNNm4yVUVNOEJpM1JBaENoa3R1RW50OURZUzFqYkcwWHJscmN1WG41cTN2bHlkRUJFQUNNZjNZeVdoL1N2am5XMWZOK3MxS0VKQnJnUnhOQU1zV0pTVUJ1aTVCOUNzdGsySzRFc2J5NittM0pzais1L09XdlpXRjgrRFFVbjE5NnZ2KzFrZWJRSm54cEYxNWpqSU00a1JJazdydmtWNHZ3d2dxSFg2U1l3aUZxclgxNnZyQnk5bzNPV1ZGMTBIUzB1V1Vza1JEaE9UVUVDalhJRzB2a0g0bkEwcUlnWXBBenkyQjdKWExpVWRTYU5TVFVJQXBaYmF5UVA3akRaRlU1MzlqVUVvSy9CbmxqblZPZ0g5bFQxL0ZJNzRZd053czJONHRIK25QSW5yb09pRDBJckN4eklWREVrWGhEQ0NLL3dFVHdvV2lZd2JXS2tJc0haSFc5amZuVlBLN2NXSVNaM1lPNVdjQ1ZHNHVZWDgzRDZub0gwdjQrZVY0VlVSVmd2alVrZ3JGQk5hekNLaFY1dFRWT2dqNkxtSnhFYjZvT1RuY1lBRVB2UTRhWTdFUFluNFhSMWdKdWxIazRraVRQY3daRjMvY0Exd2FNS2x4WmhxZmZSRS85Q1Z5N3FzQjJxZ0FCMXo1UzRiRGY0SlFmZ3pNQ3FvZmdrZ1hYdGtuMDdOcTBrWDU0VHR2TkUyL3N4bjZwaUliWUhFcVZDdFNRQmdBb0dWbEV3MW5vcFJMcVl2VmcrZ3JwVWhtK1kwK0x0Wm83dFh2b25Bc2Rmd3ZlcTEvd3BibC9hS0QvSkRZVzUvRnNXenNBWUdOOUZjZTdlN0QwNEhlOGZLS1AwNzNQYWVmQnp6Qk0reTR6SzRjLzVNdW02YWR2QTZWMVVpVUN0NnRRQkIvTU5jRmNFNHJnZzl0VnFCSUJsUzF5SG4rUHJhSnBIWlFyRTJ4UkwrY1dudW9mUC9IaWtDYmVSVXhUd2JuUDFaQUdJZ0lSUVExcDROeEhUQXR6OGRZbFpDb0taakxHNkoxOGUwSDRZNkdJdGtSZHZ1cFNSeGdIbmFueWZiQ0FTZ2hFdVJTTUVBRVFhbnRjeWMyUSt0ZlhsTWtzNGNlTU1ITi9ML0pkemdwbnFhdEZRM3IvSmZGTTMyNWZSOVQrNFBXVThXRkh2WWptdG1OUUFrRUFISlpwSUx1V1JycGdZWEpkdTcxU2lkemFzV05UZ3JHN1RRRFFrVW95aWlmVmdPc20yOVRxQzUzUnlwdHh4ZXdOa2RrT0RxcjZ5cE44TGJqd2J6bnl5MDVOWGJZNVc1TWxubHRQcDJ2L0FUbVRzY0E0Mlo0eEFBQUFBRWxGVGtTdVFtQ0NcIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9leGNpdGVkLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQzOVxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQVhOU1IwSUFyczRjNlFBQUFBWmlTMGRFQVA4QS93RC9vTDJua3dBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBNHBKUkVGVU9NdE56VnRNbTJVY3gvSGYvM25mdmoyODdScEx4N0VkTEJ6S05uRWNZZ2lPWUNKRUV4Y1NRUzhYWnpTWjdzYkVhRXp3QnJqWW5XWUpOM3JoUlMvVXhNVEVPR2JtRWtZMlJ3UzNRVmVoRmptTk1TbWxwV2ZhdCsveDhXSTNmdTgvK2RMVTFCVDY2RFpHSnhjUm5oeUdyUE5HU1hhT2ljUkh3SVJCQUlCcEx1Z2NjMFpGL2ZsWVF1SzlxVHVZblI3QU1uOERORHM5OEJ4UFhQQTZTSGduRUFqTzFEYTN1bXJxZlhBM0JBRWlsQko3eUNRT2tkcmRxdXdmcEQ5V2lmOTArZHE5d3V6MEFBZ0F3aE1YdkQ2WC9GWEgrVmMrYUdyelEvQW9JQUdBdzg1SnNBRUdKeGlBZXFSaFAvWVVtL0cvdnMxcnhtZVhyOTByQ09ISllUZ3NmdWxjMzlCVTQya0NWLzRHcjJRNVgxMGsrT3NKcGtIVzhod3NYdUZnQlRyaDk4TEdQYjJady9UVzZPdWhpQ2pyYUd4b0NzelVOemxnbFNPd0x5MkNHU0pSU3dzMHZRb1lHaVRGaERVL1Q1Wk5oOXJiai9ybVZxUVM3cGxVc25pTFNiSmo3R1Jqd0FWekI5THVMcWV6NytKdy9DYWlwVjRJMFFoWU5JTEhoUzRjanQwQW5ia0VlL0tBQzFJVy9yb2FGMFEremtUd0VhK0h3VkJ6a0hKRlVrUGppRzRsY0NVY2cvTHZFWlJuS1Z3Snh4RGRTa0R0ZUJ1MlRJWk1zd3l2RERCTEhSSEIyS0Rza2FIbWM3eDhxbzZFVEFSRG9SNTBONzhBL2F3SEFFUDNJNGFoa0E5Q05vSktTd0M4VXVDZUUwRXlUWDFRdEN3VDNETEJEUU82M1E3amVCYU03ZUg2aHk2bzFSSkF3UFdyYmxpRm16RFZHTGpUQWE1cHNFaUhvV2trbXBxeWNKekx2aVV4QnhFTWxMYXpTQy9mUWptOGdmL25mdjlGMUx4a2d6ZmtCSkZJaFhRT2xxWXVzS3FpMzhsbUZZaVNqT0oybnE5ODhRRGw4QVphaDRmUUU1dEhUMndlcmNORFVIN1l3TXJFSDhpdFpiZ2dpRWluUzZnbzJoeUZyNTV2YkdqeWIvVy8xdVY4OE9uM09MY3ZRM2Jhd1RuSGNXZm44L3Y2T29nSVZWWERZMThSTDM5NUVYZHZQRlNmN0NYYnhMVmMrYUJZS1g1U2R5cjRqWElBL0o1UGdPY01UZ1JDY2djQVFBUnd6amtKSWpuaHdrWTBnZVYvMHROTGhmWVVBY0JIYjNZMGRmcXRyMThkN2g4OTNlYUJqYVZoV1ZWWXBzWTVPSmpvSUlGSnFDb3ViSzRsOGV2dDFUOFhNeldmNzZ1K0plRk13STNmNGlFRlRtM3o2Zm9takZTcVQ2dTR3SFFuSExaYXNuUVBaWjlWc1IzUDQ5SDlWZng0UC9uTFN2N2tkL3VxYjRYS1IwVUNnUGJtSUtPNm9HdzNqR0NMZk56VmZxSjhzZGFsZDd0dGVpczRxS1NMTzhteUxSWXZlTzRlcXZLR3h0a1R5Y1lQZHVQeDZuL3JiYmdFRXBLWE53QUFBQUJKUlU1RXJrSmdnZz09XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvZXhjcnVjaWF0aW5nLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ0MFxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQVhOU1IwSUFyczRjNlFBQUFBWmlTMGRFQVA4QS93RC9vTDJua3dBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBM2RKUkVGVU9Nc2x5MDlzazJVY3dQSHY3M25mbHJadlMvbXpqVzd0Vmd5Yll5S0JBREZabUNZR2pBZGNCSUplMUdEaTNYZ3dSbUp3MjRHTENSZk9Zamg0MDBpVWcwSkFJWUFLQVFTeTJUaWtXNENOMFcwdC9kLzNmWi8zZlR6NHVYOWtjbktTM1hLZThZay9PRE94RDhjM2ZWRW5mc2dXc3g5bGpRRVFCTmQ4dzBYZGNzODJvaXgrT0htSmMxT2ozRFp2SXVlbVJ2L1B4L2FtWTJJZHlRM2tUL1hrQnhNYk42MGptY21CQ1BYRlI2d3VyVkNhZjloYWVGcjYyRFhlOTBkUFhLMmVteHBGQU00YzI1dmVFRStjSE5yMTZrZTVaSTFJK3dsaExvdGs4MGFzS0xpZU1QczM3dElxaTUwMHMzTlB2bjdlYVg1NjlNVFZxblZtWWgreDBMeS83WlY5ay8zQlhhai9nKzdQR3VNNElyWXRoRnJDb0UxZ2F5TlJWOUxsSW5haWU5ZHExZjkzL0kyaHYyekhwNjgzbXp1VnlkZ0VqUUNLeXlTdVBCTTJiOEhkdmhORUVibC9GNWwvSU1IZ0lKMmhQTDI2bDFLMWVhcTBWUHRaUlozWW9lNitYSUtnQ01VQ3FZRjNhWDl3R1cvakFhTFQ5NGxPMzBQMXZVM3p2Vi9CM29ITTNFVEZhblQxYkV4Z204UEt4dXhQcHhUYXJaQ29ob3dkUDg5blgwd1FiaDFIcmRid0ZsWjQ3WlBUZkg1OENuZnJPeVNxSVVIUUlKMEVGYnI3RlVxTk9Ta0gyaFVUYkJzQVlIanJTMFFyTTNSZXpGUGZzaG1BSTRjUFlsWHUwaDU1QWRPcW10VGFCRUhnajlsaEdHRENBS00xaldpVUN5Y0hNT3VhdEJvL1FTSkNMQm5sMHVsUlBPN2hQYitQaWNjd25rY29QdHJ6UkFWZSsxcWpVa1pVVE5BYXQ5M0VXNzZKK0JVczQ2TkNIN2Z4aktCOEMrTzdHTzJoeEpicWNvWFFjNi9abmJaL3FWeHVIOHoySk5CZXk2QXRVWmJpOW9YcnJCU1dBT2dheWJEcjlUMkUyc1A0Mm9pOVJwYVg2N1RhM2tXN1UyLzhzREJmL0NxVEdZa1RsZ1R0RVFJdjd4a2gyREVNSWxnUlJlaTZvQVBRV2p6dDhMZzQ2OVpydGJQVzRHQ3FvYXZsbGJXcHpGdnJ1OUlZcndJbU5LSkVMRXRoMjRLSXdXaHRKTlNpckM1bXA1ZTVjbXZ1eTk5V0J5OWF2MCtYeVdkN2xscXJqNGFTOFo3aDlkMVpJbllnUW9nSmZZTUpVQ29xdGhVWHo5L0E3SFNKODljTE4yNVV1cjlaZEpOUHJKRmNrbDhLdzIzaTNvUEh4WWVZNnNwdXJWTkVsSU9UN0JXUmRWSXQrY3dWNjl5NU1jTjNmNVordlBPOCs5c0ZkOE1kYWE3VUJHQW8zNjlrVTcrelJ1dit6VTVqKzlEYTVvR2VoTDh6R2ZHM1lKQzZieGVYbXBHWlFqVjErWm5yekhwR3pVVWo1dWw4b2RENUQ1K0V1YjlKSGJxeEFBQUFBRWxGVGtTdVFtQ0NcIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9leWVyb2xsLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ0MVxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQVhOU1IwSUFyczRjNlFBQUFBWmlTMGRFQVA4QS93RC9vTDJua3dBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBelpKUkVGVU9NdGxrRjFzVTNVWWgzLy84N1hUdGV2YW5laytValBTalVXeWFUQUQzS3BCd0lSa0Z4UUNRalRlYVdKTWpER0tpWmdJVXdoY0xKa2FvaU9RbVBpOUNKRVF4VjFvNG5CQUI1U3h3YkFGQnlpajY5aTZjODUyMXRQejJmUDNRcm93OTk0L1Q1NzNSL0RnZm56bUkrdzQzNFVUcS9meVFzZ2Y0eXZFTjAwNXZ3TUF4TEMvejhwYnZZNm1YOWcxY3NBOTlleCtiRHUzRHdCQUFPQjR4OGZZTmZRT2ZsajdudWdMaGc5Rk5yYStYYk51Slh6aEFEeW5pRUpPdy8za09LYUdidmFRZWVYOStPVnVwOFJ3QUZETnBRQUFQRjlockhwbEk0SjFqOENZem9NWFJjRHpBSmNnRW10QmVXM2w3aisvR1BBQmVFUHlKUUVBTEFCOE5YRUYzMFhmalVYamJWc2YyOVJhcnQ5UmFLQXhSRkxmbklHU3poU2xsZ2pqeUFhdGpENUtITjFhOGJ3V0hkeWFQRG9KQUV4cEE5WW5iS2pmc0Nxa2prNVJwb0luMTQ3OE9wbE4zRnc5bVVoM3ByNGN5Skp5bGl6OHJkS2FOZEVRVjFhMnZzUXRDaWlsVVZFS2NMWnFFc2N3c0hCUDZYbnAycUdyTDQ0Yy9HMGhJeDgyRlEydVpoTWg1T2Q1djloZDRyaEZFMkZVU3kxNERNY3dMTWREQ1BoZStMNWx6ODhnQkdKVllCdkxDeWl5THB3NWc1cjV3aWZMQ29yd3ptVFAzdEFDS3lXNGlvM21uYkdPcXViNndYQmozV0JUZk4zVDFQRGdxd2tnT3p3K3IxUGpiSWtqZU9pT3QzVU50WGZ0YkhkeUZxaEg0VytvQkhVcDlMc3FxT3VoS0ZBa2pwd2FmblcwZTgyU2d2N093LzhOeVNJKzh1bnBjMlpoQVlRSDVBc1pLbC9LVUVvb05FMUY4dXYraEc3cld3RGdhTnVIU3d0T3hnNWdlMkl2K2xyM2hIeFM1WlpnUS9VSDBjNjF6VVhIdzQzK3hLMjVpWm1EczduWm45NGE3MVdPUGJVYnI0MzBMSC9oWkd3L0FLYXFvZjF4MlZKMTFHMStFcDdyWWZyMzZ5Z0wrM0YrNEE5SmdLQzgvZ0JlTWlJQWJFL3NnMnZaYkY3TG8vSGw5YkJ6Sm5WbVRMb2kzbzYvTW5jeHIrdnNMOUxWaDVHbEFnQ3dxVXZ5c29aN0Y5T2dsSUl5RkxlU1k1aVRaM0dIbncxbVRWT01TTkppT2Z0L1FVMmtuak5WZldZaW1hcDlZbk5ITGNNeHBPL3pZMk8zcmZ1OWFiOHlaWGwyV2FDNjJnc0tnaTJyS2wwbVlCb3F1RytGNGR2UGVVMmIvaGxOTjEyL2ZBVjVXR01uZ3FuUEJMQThReWxsT001Z1hMY3duY3ZSZndGMEEzRTZXVTMwSVFBQUFBQkpSVTVFcmtKZ2dnPT1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9naXJsLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ0MlxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQVhOU1IwSUFyczRjNlFBQUFBWmlTMGRFQVA4QS93RC9vTDJua3dBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQWQwU1UxRkI5b0ZEUklkSGNZenRaOEFBQUFaZEVWWWRFTnZiVzFsYm5RQVEzSmxZWFJsWkNCM2FYUm9JRWRKVFZCWGdRNFhBQUFDK1VsRVFWUTR5MzFSejJzVGFSaCt2cG52eTh3M21XUnNhc2Jhak81Z2w2NWlRZXRCcXE1V1JWUThLWjVXVWRnaS9RZVV4Y01lRmcrZXJJZ0hEMFdLWjBId3R3aTdDcnVJdGJ1SWFLRnFtOFkwcWFuNTBjNmt6U1NaeVdUMklCWFI2SE43SDE2ZTkzbWVsK0F6REE0T2lvUUcyK054L1d5eFVEaWs2L3BmK1dKaHFPa0dmdzRQRDN0b0FUSXdNQ0JRU2V4RmdBTkFvQm1HY1hCTDc1WWVXWllGeDNHQzhmSHhaRHFkdmdnU1JJT0FlQUJ1TjF3L09USXlFZ0FBbFdTMko2N0hMM2QzZDNkUmtiSklKRXBDSVVaODM0ZHQyNFF4dG80STVJcGhySzFIb3hFL204MGV0eTM3S0lCM0FFQitPM3ZtNzEwNyszZUVRbFRJenM2aVhDNGpIQTZEVVliUlo2UFkzYjhIc1ZnYnF0VXFrc2trYXZXNm44bGtyamViL3U5ZTNVOVJlN0c2VTFYRGNCd0hZMk5qbjdLWnBvbitYZjF3M1RvV0Z4ZWg2em9ZWTNpZmV5OXFtbllrazVscEw1VktaNmhUcWFTWGxpcHI3OTY3UTB6VGhHbWFvS0tJY0ZoRmRqWUR6L1hBT1lmak9LaldxZ2lDQUVZaUlSdUp4TjZubzAvL0VGZXU2bEFGUWVqanNrelhyLytKTEN3c1FGRVVVQ29pWDhqRDh6d1FRdUI1TG16YlFxMVdnNnFxNk9qb0VDWmV2MWtqYWl2akU4VlNDVnhpbTAzVGxHcTFLa0loQ1FCZzJSWmMxMFdsVW9GZHR1RjVIeitwaGxWd3pqSDIzM05Ibkp2Tk9xbXBxVWQ5MjdZV0dHUDc0bkdkTnYwbWFUUWFJQVNRSkJtY2MzRE9JVWtTUWl3RXpzT1llRDFaZi83aTVWV3lYTnJKa3llaVJkdTJsNjk4RDExZFB5Nmswek8zNWo3a3o5RmwwckxzTWdnaUFpR2RHOXRTUGJzNzM5NW83enZrbDBidmkvOWtWcDk2T05uNTcvSnVjZDd5Q0JIbUhDcFk1RXYxbTZmUkxvaGlzV2YvM2tZaDlhNVNTS1dQTmVydS9jTkRyZDBJclVpdVJSNERBVDVNVG10Qk14QUJrRy9GK1VxQXhXU0h5dXhWTTJoV2YvNzFsMXFic2ZxMnFyY2RmWEJlWWEwRXhNK0hCME9LSEkzcis0eU5HL29rVlpuT1RVMCtNWHMzNVFrVFlwNWZ6MTY3dXpUM3BjQ25FbTllQUZGaUdvOGxPalBLaXVpbFhHcktLdVptU3ZJSzlRY2xwbkZyUGpmZnlzSC9YSnM5NkJQTEdFWUFBQUFBU1VWT1JLNUNZSUk9XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvZ3J1bXB5LnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ0M1xuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFOS1NVUkJWRGlOVlpOZFNKNWxBSWF2NTNuZjcvUC9iL3I1TjVWTlZGcmJoUFVqc1p5YVFUbVBHbXRIdFZiVVNSQ0xJSUtDRWowSm9oYkZDSStpRmxnRHJRT0ZvdEJVVE1wbUk3NDZtTlA1NzlSUHY2YjQvYnp2ODd6UDA4Rm9zL3ZvUHJpNVRtNHVZYTFsZndaNk91b0U5cnlEYnJYSTR3QUNFdzF3eHl6aXE3UHYvVEM3ZnkvK0F3ejBkRWlKdWVpR1F0ME50WFU1UlpVMVRrNzVZY0N5dHpiTDF2S3RZR1p1SWVINVhwYzJmUHI4KzZQbUhtQ2dwME82Nk9GSXBLTHBZRmxKOXNydmczZzcyOVNkUFlmcnVpd09mRU80b0pqSXNUWnVMRzBrMXpjM3AveEFQdm55cFVrakFTVG1ZaVJTM25TaXZUTTd0Uk9sNnVTREhIM2hISm1GV1dRVVpsSC8wZ1hLV3g5RjZSVk9kanlWWFZ4UTJCUW8vM1VBMGQvOWRGM0lsZE50cDUvTkYvb2FvYlVad3JFN0lBUkJUUTBnY1pibXdZS3FMRWRWMVpPTzUvTnQvOUJleXRNblpLRFYrYnBEdFRsQ2J1SXVSSEZUZVNSYVBpSng2a05FUEVEbE43UFgvaGw3YlovZzdvWng1LzhpbzlCd3RMWXlTMnYvZ3JSK3VyV2dwTlF4ZTNOa2JQMUQ4cEUzMFpGalBQTnFEOTluUHNkd3JKWXpyN3hOVVB3QWljZmVJV005aHZFMmlaUVZPd1IrbTB4cjA1aDdvSXdndVVIaWNEMG10L1QrUjA3bS95NE84cXBJTkJ6QnBMY3BLQzRpN2VuanJsSUthelEyQ0ZBeWpkZ2FncEoyK3ZzK1J1eitpaENTVTE5ZkJyVUo4WjlSVGdvQ0FZRkdLUzFjby96b3p2cGlTMzVPSWNhL0RScy9JdUxqQ0RjRWpvTVZFclpId0dpc1ZsamxJNXdDWW10cm1FQkZaZEkzWSt2THk0SE1xc0FHaXIrbkZqQmVHcXM4ck85aC9idmRlQjdSWDJheFdpRkVMb3NMcTBFaXBVZWw1K3NyazM5RVUzNHFGeG1PRUhKZzhNb1VNOU1MSk9LN0pPSzd6Rnk3eGVEbmsyUm1DSVNUdzk2bXg5ajBUYy96MVpmT1QzOXV4VWY2UHZDMzFqZWFqelErSGlvNm9NbktDbGllaS9QYjhBdzNycThRRGtzYW13NVNYVmVEc0JYMFhSMUp4dUozdWk2UEpZYUV0WlozejFSTFZ3U2oxWlhsRDNlZWZpSTdNemVKVlZzWXZYdFhtRkFlUXVhVGlDbXVmamVlWExvZHUrNXBXbm9ua3VhZVRHOTFsa3FCZWNOeFF0M05EelZrVmxXVk9wSHlDTllFYkt5dU1UKy9Hb3hQejNwYTZ5NXR1TlE3a2J3djAvNjgxcFpmanpVdmhxUnBWUUdOQUNHSHFLY1pOWll2ZWllU04vZnYvd1gwMjZmc1JzK3hZQUFBQUFCSlJVNUVya0pnZ2c9PVwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2hhcHB5LnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ0NFxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQVhOU1IwSUFyczRjNlFBQUFBWmlTMGRFQVBBQTVBRFRBRVlRTUFBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQWQwU1UxRkI5b0ZEUklQTFpnZTllQUFBQUFaZEVWWWRFTnZiVzFsYm5RQVEzSmxZWFJsWkNCM2FYUm9JRWRKVFZCWGdRNFhBQUFEYTBsRVFWUTR5MDNTVFV3Y1pRQ0E0ZmViYjJiWllmOVlmaUpMeGJZZ1VLR0pMZGkwbE5UMllFbE5OT21CeE1TN0J5OG05ZWlKS0ltcE1UR05TUnNUdlhqMGd2SFNocHA0YUlRRFFtMXBLVlJUcEN6dUQ3REw3czdPN1B4K0h0cUR6LzI5dlFKZ2NIcE9pMkx5MU5GRXZmanB5VCtQdHBubVpVT1hrMGg5SEVBRjNxb2ZoRXRlcTNYWEM2T1ZtZGtGajVjRXdPdnZYeC9vNlVwOTJ5c0xlNTlkS0U1MzVvNTBwN3ZUaHRuVkEwTEQzaTlUM3p2d0svbWQvVUt4UE9lSHdTK1AxRlIrZG5ZVy9maVY2MFpiVEgvbjBwbWhxZDhXN1l5VlRURTZMQkJ4RUxFYVFocWtrdTBrWDlHTnJsd3ExLzRrUGJmNy9KL2hrODd2WHdONU9mem1WTTlBZjg4bjV5WkdUanRleEVlSjcyRG5NVXFMRUlrRUt2UmdleDIxY2dkWlhpZDFiTkNNSW5Pa2ZsamJuYms0OEVDZVAzZm1yWTBTWHgxNTdWVUNZYkR3VkRGOVZxTHBPbEhjaERCQU9FMUVSeGVxdlIzbDF6Q3ozYWJiY01idFJ2T2VQcGJkditTbFIvQXhXSHY4aUg0TVpDMkxwcXFFb2doQ1E1WnNGQmxrY0VqVXFXTVlGaDJkcWU2OWN1V3lOdGJWbkR5Yk8yQitmb0djVWVXOXMzMTRnMWZaQ01lUitRUGt6aDRid1NuY3dhdnNtVk1ZcFRJcXRFakVJMFBEUDY5bEU1eitjS0xCangvOHdlY25idlBHc1U2dTNaaW40R2ZBVStBcENuNkdhemZtcWNXUG9qa2V5cmN4VFIwVlJlTTZVVWdxNXBIc2FDQXpJRk41dnI5MWs4YmFEN2lORGhDQ3laUmtldVltalpWdmNISlpWT0FUaFQ2Qjd3azk5SnhWcDlHOEV0ZGpoSVJFelh0VWw3Y1FrUVhTZmJHS3M4amh5a09VVTBCcGdOSm8xaXdDdDdXcU9iYTcxS2k3dmhBbUtnekFhNktzWjBSdUJlVzVLTjlGdFNwRTFoYkt0MUJCQUpHa1dyRjl4Mmt0Nm81VnYxc3VGRC91elBiMVNpclkxUWJyOTdZby9sM2kvM3FIZWhsOWV3Z3pFY2QxZFZYYUxWV3NSdk5YdlZ5M1YrM1c5cGR4TS9IRjhlTkgwbVlpejhTN0owQWJBN1NYc3dNcUJDVUpneFNiajB2Ty9jMjlXMCtxbVVmeU1EWVlkY1djV3JOZXpVbmlnNWxzdDZFYkVvRjZFVVdBTUJDWXRKeDIxdGVLN3RMRDNjVUgrK1pQVDYzTWxqUk5Venh2SnUyVzV4ZExoVktFMHp3UkJIRmRxRFpoNkIyRWtVbjlJR0JucHhtdHIyM2JkKzRmM0Y2ckpIN2V0ak9yZ2VzZENvRFIwVkVwaytsMFNuakh4ckxXeGI1a2VLRTdvVWFUc2FoZktTVXNWK1RMbHZocnU2NHZiemJTeTA2b1B4T1NmMnVsb3ZVZkhKSzFnUXcyYm1VQUFBQUFTVVZPUks1Q1lJST1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9ob3QucG5nXG4gKiogbW9kdWxlIGlkID0gNDQ1XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQU5HU1VSQlZEaU5UWk5mYkZObEFNVi8zM2Z2YmRlVmRhelFzc2xnR3hZa3lJYUlxd21iYmhMVXlSTUczMlRCaEJkTkNNWUhmVEJSMkh3d2FvTEJ4SVJIamNrU0VoZi94S2hSL2cwbWltYUpjd2d5eHNZbzY3YXViR3kwWFh2dmQ3L1BCM1RzUEorYzVKeVRuekRHc0Z5OTNSMEpnZW0wVUcwRzJRZ2cwRU0rZHA5QmZMSHYzUjlIbHZ2Ri93RzkzUjFTb2cvYmp0TzFhVU1pWFBYUWVpdGMzUUFZY3VrUnNxbFJmL2pHelh6SkxSMVJtay8ydjM5T0x3WDBkbmRJRzNVNkZxdEpOclkrVjI1WHdaM2gzeGcvL1FPbHUzTWs5blZpSzhITnJ6L0gxVUxQT3F1dXpEbnhiUWVQWGRRMmdFUWZqc1dxazl0MzdTbFgraklxbnljL2VaMjYzVzBFcTFaaGZJVlFpMnpjL3pKdXhwZFhMcHg5Sk91NnJ3TWZpeSs3bms4NHRoeG9mK0dsQ09aUGpKbkhDcXdnTUQyTlBaRUd3S3V0UlNpRmZmc1dJQ2hXMUhQeXdvMzhRdEYvVFBySzYwelVid2dMbWNIUHBjQm9uUEZSWk1ZbG56eEtQbmtVbVZsRVJWckp0UjhuLzlSSEJEeVhYWWxRU0NuM2dEUnVzYTF5ZGR6U3VWR005akhLSTNCN2dzWG1OMUhWTzloNzZBTitLdStrdFBrQWZWZG4yZnZhZXhSMnZzMWFKeWZ4M1haWlZMcHBSWFFOZm1FS2ZBVytZbkZ6STM1RmZPa3FiWVdBQjNmN2tYWGs2bmRTTEtsRzIvTThqRllZMzBjWWhWRWVidENDaGJOUTJVSnZ6M0c0ZHhHeTM5S2FiS0cxNTFPWS9JYVNzZkU4Sld6dHVVUHpVK05QUjhJcjBlNGtLQmVFUkdUUElPYjZRRWd3QnJTQ3FlOHdiZ2xoUlpoSnUyamZHN0lMcnU2YlNxVmFDbXZLcklGTDh5QUUyN2RWTXBlK3c1WmtBOEtTLy9XNHY0LzJTdnd6a0dKK1FhRzBURm5QYkkybTBwbnN3Zm01ZkdEcmxpRHhtTU5mbDNQRUtuMSsrZjV2cE5HVUJTVmVvY2pZMVVsK1BUVkdOQnJuOU8vRDFOVEVxcXlmQjdPelozbytkSU5CNTltMU5RRUJrSmx4ZWJLNWluQkZrRnNqTTF3Nk5jeTF3UW1Db1JCTnlXYjYvN2pHK3Jvd2h0Q3NNTWJ3em92clpEaGtEMGFqS3g4TmhVTGlpUjExVks5V2FMVndIeGluQWlFajVHYzhUbjUxdmpSejl4NE5EOWROS21WZVhZTHByVDF4S2RCdldKYlQxZnI0cHJMYTJyZ1ZxNDVodE0vMFJKcXhzUW4vL01CSVNTbDFSR21PbmVndlBJQnB1UTYxUnpaaTlDdU8xRzJlVHhPQVl6RlVVcHpUaHM5TzlCZXVML2YvQ3pDN25aZ1gvcTZOQUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2h1Zy1sZWZ0LnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ0NlxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFOQVNVUkJWRGlOVlpOTlRGeGxHSVdmNzd2M3p0Q0JvaTB3QldlQUNnaTJnU3FDcVpCV3FMVXBxU3pRcGdzVG01RG93aVpOR3hkcTRrSUNMb3diWWt5TjdEUXh1bENJUHl0allnUkRxNUZLWWhGb00xTVovbVlRSE1mS3pKMlorL045THBvU2VuWW5PWGx5OHI0NVFtdk5iazJNOURVSjlIa0RyMGNqMndBRWFzN0huTktJVDgrKy9WMThkMTdjQTB5TTlFbUp1bVNhNW5CamZXMXBSZVNnVWZaUUUwSmFaRGVXU0s4bi9KdTNidVdLeGNLUXAvamdwWGNuMVE1Z1lxUlBoclpYZnkvTmJSdzI4V1I5LzR2NHBpTCs5WmNFOTFmdzhPa0JLbHE2Y1A0cU1QUEROL2I2K3NxdmppOVB2ang2VFVrQWlicFVhc25teHBQUHk2WnpMMkNXWmdrK0lHaDlaWkQ2VXlmSUptL2lGVzRneTFibzZqOFhPaEN1T2VxN3ptVUFNVDU4dXFsRXF0a1R6ZVY3Uy81TG9OSDROZFhvUUJBcnVRR0FWMWVIRzYxSHVYblFJWlRUd2hjZmY1UzE4OFYyNCt6eCtzdFBWWG5QbGx1V3NMdUhjQnI2MGNyQ1RQNUp2dU5OM0VndmdkaFZSQ0dOVnhaQ0Y5S1llL1poT3NKWVdrNXNTKzBVZXNKa3BOMzlGZ01YM21GcThSK2NSd2Y1UG5TZWdZdnY0VlYza0gveWRRS0pKZkFjdE9maTJRbkNrYWlCNy9US2dxZU9aQTkyNFpmWDducU9SaGw3ZHB5L04weitjRHZhZDhIM1VQWUc1VlVSQ2tXdnpYUmRsNkkyTVZiSEdmL3NDZ2dCbTE5eHZObm4yT2Z2STV3VWJGL0REU20wZTdjQlNxT1ZoK3Q2d2xTdU0vZnYxdWJUbFZZU3RmRXR3Z29pQWdFd0xVVG1wN3RBcmRDK2ovWmN0T2NnQXhYOHZYWWI1YnR6WnQ3UmE2bFVtczFVanBaV0N5a0VDRUJya0Q1YWFSWm1FdXlQVkRJN213RTBuVjFSMXVOeFA1ZjNKc1dIRng1YmN4MG4wdGxRUlh4eGdlYTJTcUtOVlFocHNyNmNZWEYyalVOUFJJa2xEVm9QaFFENFk5Rm5iajVtNTNMNXgwMURDcmM2RWlTZXVzUFJaNDV4ZS80R3YwMWZSeW1vYmF5Z3ZhdU9hTU0rWXNuTXpsRnpPVnZiMmV6UWxTazdabnFlZm5VckxjYlNXNW5xcVo4ZDhkeXA3bUQzR1JQdDMwSDdPUUNrOVNBZG5RZTRQck5FenJiMTJtcHF3ZlVadlc5TWI1d0pTNEY2VFVwanVMdXRycVMydHNZSVIyb1EwbUF6dGNYeVN0TC84WmY1b3VzNFE1NWlkR3phVnZjQjd1bGliL2tqYURWb1NkWGoraHdCc0F6bWloNlRTdlBKMkxRZDI1My9IKzh1bXBOR202WVlBQUFBQUVsRlRrU3VRbUNDXCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvaHVnLXJpZ2h0LnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ0N1xuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQVhOU1IwSUFyczRjNlFBQUFBWmlTMGRFQVA4QS93RC9vTDJua3dBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBNXRKUkVGVU9NdE53VnRNVzJVQUIvRC9kNjcwOVBSd3A5MUt1VjhMWWhiUlRHQVhGdStDY2ZwaTl1U0RKc1pvWW95UmtDd09INGlKMGZoQW92Rmhhb3dhZlNBOGJMcWJjWXl3VFRkZEhCdVhBZVVXMm82MjBKNzIwSjZleS9mNTZ1OUh4c2JHOEJpNWhPRXpOL0hUeUhGTzlzaGhVUlJlRmdoN252RjhEeWpkb2k2N1lETjIwVXhrcjUyYXVHN2pmOGk1ajUvRThKbWIrSDYwdjhZcksyL1VOalNQKzBOQlZCendRNHhlZzl2MExETFJMU1NpQ2NRM0lqOGErNW54WlBCVXlMVk4xWkhZQlFJQTM0ME9WRmVydnJPZFhUM0RmbUVIbkd3RGpTME1OUUZDQ2liRDZpS2htVHpTQlEvK2ZGaTZwSFU4VSs5VFZjL3E2dkpud3RuVEp5QlQrODJlL3VlR3lncXpjQlRLaUZjRFY4d1NydWdEeTJlSnE0cUFxcktxVklMb2UrMGRMeDBiaENBSXlCbkdCNEpHV1gxOVk4dEhtclpQWE42R0o2WVR3ZGlCMjNBQVJhMFVZaklHZVdFRmxBZHhXNnNoaUFJQXdnQVFBQkJrMVh1eUtsZ3J1L3Qzb1d3bFFadGV4N3pZQVhMakMzUVhibUJqbTBleTlUMkVRK1ZRL2gxSHBiU0x0ZlVJcWF5b3dPM2JmOTNoUklKQnRjUUNkVTJJaGcxMHZJaVJzVS94NFdVYlNNWHg5bmtCbzU5L0M2bXVGdzRmd3FNMVM3ZzZQUU1BaUVhakl4emp1VDZQaHdjcjV0bCtxQUlrTlllbmpoOURPRmdDUEJMR3ljZExFRzZ1QnpKcnNNb0F6V01pdHB0akJUMkx6ZTNvTXZuMWs2SGtrYU5kVlVYOUZpT1NUSWhTQTZtOEZWeHhCWmJMUStBcGlLY1ZWajREdGg4QnZ6aUhURFNORmIwTUs3cW5tMy90YU8xQWRYVjVPK2NtQ1JpRHMyZEEzTnlCU3dtWTdJSzVGTFFRQTRxN3NPZVh3YnhWS0gzbE1LcjhLcnpyZHhxNFF0NjZtc3RSRUhDZ2xvWGNaQXdsRTNGSVgyOUNVQmxvd1lTNW1ZUHg4emFNcFRpazNsNDQ1aXhUV2hUb3JqakE1WFY5S3JheGJoR2xEWVFWb1lRQWMyNEI3TXA5bk91YndxMVhyMkRqM1gvQUNSUmNPSUNsWDM1am5QZ0NpY3lra1VnVnYrTHJHN1NzbmQ0aHdZTnRnMTRmRDc2SklsZFh3Z29QMGlTbGlpaHYwRkQzVmlNOEF5cTg1UUhrVWh5NVBER3BiOXhmbTlRTDd2c0VBTjRaYW12dXJNRVBSL3FmT0J3TThlQ0ZQVkRKWVp4akVRYUJ3ZVVKc3ozWWlkcjRZL3B1K3ZkTitmVFV6UEtYQU1CM0IyV2N2M2NveDN1TnRmajZxa3J5K1U3bUtKQ1lSbVRSRHpNcmtNU1dnZmw3RDNGcDlzSGk5TGJ5elp3UnVOam1yOHdtMDNHSEFFQlhTeE5uVlFSOFB0ZHFiTmV5ZlhVKzgrbUFZaDJTT09lZ1E3bE1JaS9OYnh2UzN3dTVzdXQ1UjFxRGpDMmFUR1lYSXhINkg0ZmFxSG04U3ZKYUFBQUFBRWxGVGtTdVFtQ0NcIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9odW5ncnkucG5nXG4gKiogbW9kdWxlIGlkID0gNDQ4XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQUxNU1VSQlZEaU5iZExQYTVSSEhNZng5OHc4V1pOOTFnMEowYTJnaVZSdE5BcHBDSGhvckVtd3dYdXBJTjJENUMvb1Nmc25pRWZweVh2dFFiQkhFVmxKWTZWRWhDeTcwVzVLTlRiSlVwWDgzbXllWkorWlo3NDl1Q3UxOWZDNWZUNnZHWVpSSXNKdHBiNDBjTk5EUHhCb3BlWVRrUnQ1a1o4QWJpdjFyVkhxZXk5eUVuQWEva2pndTd6SXIrcEhPSllLdzlMUWxTdGg5L0F3Smd4Wm41cWljdTllVkt0V0N3RFp3NGUvNnArWVNIZU5qT0JxTmRaTEplYnUzTm1KbzJqUWZBTS9uTDU4K2ZQY3lJaTI1VEx1eFFzeUowN3c2YVZMYlc1MXRiZXJyKy9ZOExWcjZUYm4ySHY4R0Z1dGtqbDFpbFFtWTlZcWxRT0Jnck05UTBNbWZ2NGMyZGpBS0lVcmw2RmE1Y3prWklkNHo5NmpSOWpYcjVFNHhqY2E3TTdPMGowd1lCU2NEUVFPdG1XejJKY3ZVY2FnbE1Kb2phclhjZFBUZUd1aDBVQUZBY3A3bEhQNEtLSXRrMEhnb1BhUWtlMXRHc1Vpc3J1TE1nYTBCbU5RV2lQTjBJcFMySlVWMk52RFF5WXdVTjB1bGZwTUtrVlVLSkRxNlNIbzdDUklwNkc5SFJFaGlTSnNyWWF0MTRsWFY5SEhqN00xTjRlQmFpRHc0TTNUcDVOSFIwZUR1RlRDcnEzaE56ZXhXZ01nM3BNa0NVbVM0S3pGT2NmKy9uNFduenh4QWcrMGgrdUxsVW9zWVlnK2RBam5ITlphYkJ5L2k3WHZodGFTT0lmTzVaQjBtcjhYRm1JUDEzVmU1SlY0Zit2WjNidFJ4OFFFZnQrKzk0TVcxRHJadDdjVGpvOHpmLy8ram5oL0t5L3lTZ040dUxxMnNEQzdPRE5qT3k1Y3dDWEoreHUwb01SNzBtTmpWSXRGdTdHOFhQUndGVUNKQ00zdjJxWGg5OU1YTCtaQ1kxVDk0VVBFT1VRRU1ZYk0rZk5FM2t0bGF1cXRoNEc4eU1ZSFFCTTVvN1grN2JOejU4TE9iRlp2RndvQTdCOGZaM05yeS84NU03UGp2ZjhpTC9Lc3Rma0FhQ0luTlV6M0RnNTI1M3A3QTBSNHU3VGtsc3JsZFEramVaSDVmL2YvQnpTUlR6VDhjdURJa2FNQUs4dkxmM2tZeTR1OCtXLzNvMEFUeVdqNHVmbklYK2RGNmgvci9RTzBHNVAxMGFwbklRQUFBQUJKUlU1RXJrSmdnZz09XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvaW5fbG92ZS5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0NDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUFYTlNSMElBcnM0YzZRQUFBQVppUzBkRUFQOEEvd0Qvb0wybmt3QUFBQWx3U0ZsekFBQUxFd0FBQ3hNQkFKcWNHQUFBQUFkMFNVMUZCOWdKQkE0Uk5iOC9DLzBBQUFOblNVUkJWRGpMVmROZGFGdGxBTWJ4LzNsenprbWFOUDFJK3JWKzBuWlRzcTNPYnFOcmgxdXJqcm81RklhNEc1VVcwVHVGSWpncU9NUzdJVm9vZ2lncWRtaUg0QWN5ckI4NHkxdzd0K25Xcld1N1FheHBXZGMwclRSdFdwdms1Snp6dmw2TWpmbmNQNytiaDBkVFNuRmZ4S012ZnhUWnlOamRodWxwMXhSYnBWUW9UWnZLWksyelhsMGZ1UFRGS3pmdkwyaDNnZjdCVWYzVVQrUEhndm0rTjE5NGFyZDNWNlJLNVBsTWxGTGNTcVNZbkU2NFh3NWRzVmJYMDI5bkxQdmRtYUZlZVEvb0h4elZUMzQvTnJLM3VYN24wUVBiellEZlJ6Z1VKTEdTSVdkTDBwa2NpNGwvcUN3Tjh1bnBzZHlWcWJrL0hjZlpQelBVS3dYQXlSL0dYbTk1cUs3NVNIdkVIUDVqR2l0cmtkN0kwbGdScExMWXkveDhnc25wQmI0ZG51U2xwNXZOMWgyMXV6Vk5ldzFBYTNudS9ZalhhMXgrNDhVTy8zZzBUa05WbUdjT05LR1V3cklsSDMveUlTa1pKdWNKSTZXa3VyeUFoeCtzNHZnSFAyZG1iaWQzaUl6bGREMjI1NEc4OVkwc1phRjg2aXBEYUJyWXJtSitLVVg4ZG95Z1dxQStuQ1hTVU03MnpaVVloc0hSem1ZZm10WXRoQkR0NWFHQWR2MnZCRldieXFnb0swSktRSUhYMUFIb2ViVUgzVTZTbkx1SzF6Ull5em9VQmdPYTBMUU80U3AzVzFWRkVZME5OVlNVNUdQcUFsZEtzcmFEOE53QmhCQjBQZC9GbHRveWZqeDlpbDlISnJCekZrcXBKaUdsUWpkTVNvdjkrTDA2cHVIQmRpU1c3UkpiU04zYlcwckprNGNPMDc1M0YxYmlBcW5VNmgxY29rMUZaeGNSbXNEVVBZU0RYZ0R5VEIyUDBPNEJqbU9UeTFtMDdXbmw0T1A3U0VTSENRZnNtTzdtbk9HSmFMekZid2hoZUNCdDVkakl1dmg5SGhaWE1nQzRyb3ZydW9EQ2RWMXFxMnNvS2dqd1NQMTZxVzY3N3NDRmEzLzNiSzR1OWtmUDM2U2tMRXg4T1UzanBrTGl5WDhCc0N3TDI3YVpuWTJ4a0Vnd01ucU9HNHMrZXlWdEhQR3NSTThrMy90OEpKZGN5N1EzVmhick4rSnBiaTJ0c1phMktTbnc0U3hQSVpYaXEyKytabVkyeGhPZEI3azJmcFdwdU41L2J2Q3R6d1NBVXFwdk5yNXkrYmV4V0RaU0hXUnJUUWpic1RFOEdxNVJ5QzhYbzZRQ08xbDMvRXhNWHFldHRZMjIydFU2QUFFd005UXJsWlQ3NXhLcnh3ZS9PNStlbjE5MHczbUNVTDVKZWVRUXVlQTI0c3UyZTJiQ3lsNjg5THVxcmFrRDJQZS9OOTVOL2VFVFcwRHIxb1RXa1dmcVRRckk1cHdKSmRWWlVBUFBOaTExQXNlQXZuZE85UFgvQjY4R2xoM0pDamo3QUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2ludGVybmV0LnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ1MFxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQVhOU1IwSUFyczRjNlFBQUFBWmlTMGRFQVA4QS93RC9vTDJua3dBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQWQwU1UxRkI5b0ZEUklXTEhRWmJHNEFBQUFaZEVWWWRFTnZiVzFsYm5RQVEzSmxZWFJsWkNCM2FYUm9JRWRKVFZCWGdRNFhBQUFEVkVsRVFWUTR5NTNMdlc4YlpRREg4ZDl6ejNOM1BwOTlmb2xmWXNkcDNEcHRHcWNvS3FFREZBaFFKU0NRdXRDRkNZRVlXU29ocGd3ZStBZjRFMWlyRHFnU0FsR0VLcUFOcWlHaDJBcnBDMG5jMlBYWnNZMTlQdnZlNzVoQXpIekdyL1FsK0krYmxVMUJvSFJObEtRTm50RVhRZG56QUJDNDlvN2pldHUyYWQ2MlBmL1hhNVZ2N1g4ZUFnQ1ZTZ1VYeU4wQ1Q5blZmS0d3bGN6TnBaU1V3a3N6YVlCd21QYTYwRTc2enFCNTNHdXIzYzhjejcxVkR5NDNLNVVLS0FCOC9EcGZVQ0xSVDA0WGk5ZUxDVGNkRjBkVWlQcmdranlvNkVDd2U0aGFYUnJqL1NnVG95OVpsaTNIM2NQNmpUc0hHcjFaMlJSNHh0NHJubHU1WGtnWUNZNTJFSVE1Z0FZZ29SQUMzMEdnOXhCUUd4eVpRQW1Ma3M4U1M5cHcxTHEyZnVZQkV5aGR5K1Z6VzdtY21JQTNBaHNaRUorMjRHWG00ZklTQ09IQUdpM1FUZ1BXYkJKK1dzSnNTRW5vdzhpV3FnNTJtU0NGTnVLcFpJb0xWUER0Smd6NU5meVNXVVNSdGpCN1dBVkFvTklYY0pTNWloWHlCRkxyTG9JY2ozZ3ltanJwRGpiSXB4OWN1Zi9uZ0x1RS8rR1VyRmU1dFpKeTlzTjNscENOR2VDQ01RQkFIVGt3WFdCNUhsaWVKLzgyQU9DZ0k1c3c4ZjRiS2F6bXlUazJFeWIyNmxrSm83NkFILzd3b1JrbVN2a1FrZ3J3N3BzcGdBQmZmTldISEJIZ09pWmlFc1BMWlJHWEZubjhyRG9PODJ4ang1cE0zbHEvRU1icGpJL2FvWU5raHNQNWhUQm1rd0ZBZ0kvZWp1TGhrWUYrRDNpdUZNSkNPZ1JqcU1PMXpCMW1USzN0c1daZHljeEkvR0oyakpnOWdaVGdvTVJGRU04Q0NFRStGa0RPVG1HSVUyU3lJZ2loYUErbWptR1k5emhEMTI1MzIycmY5ZU1nWUpBVkFmdDM5dkQ0cDMxb2FoK2Eyc2VqSC9ldy8zME5zaUlDSG1CTldOQnBkUWI2ZVBJZGZYVWxmcUpybWlFSXl1VjRNaW1LZ29uMHFSaU9mbXZpeWYwRE5PdE53UFd3dXJrTVNaYmd1UXIyNjEyaldtOTl2bnVpM0tKRG9lVFBDTVpvb3YyVm93aVZZb2tVTDBvQzVwYXlPSE94Z05MRkJjd3R6NFB4TWt3ampMMmFhbTMvM3JyM29DZmRlS1RIRHFra1NlVHBKREkxYlVmdHREcytqTWw1MXcweEVvaUVaM0Y0dmdTdDcrTDRlT0x2MVJyVGIzYjdYOWNHOHBlTmFXekh0ZXdoQVlCeXVVeHBSRkdpeEM2dUpQVDFmTVI3SlNVSDVZamd6d2RCUUhTTE5MczZlZHpRV1BYaFdLa2FIanNnRk05R0hWWC9HNWkrZVFTOEt5VzVBQUFBQUVsRlRrU3VRbUNDXCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvaW52aW5jaWJsZS5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0NTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBTjJTVVJCVkRpTlZaTkpURndGQUVEZjM2WXd3TUE0ekRBVXNDbHJFMlFwdHBncUZHcU5CZUxGVnRRWWkwUVBUWVcwOW1MMG9BUXVqUjdheEhqZ1l0S0swU1l0TmxhTWpZYVdRVUt3aEtVZHRiR2x3TEE1TU1NbXMvRG5iNTdhNER1L3ZOc1RMTXRpSjcxZERZVUMxa2tKdmM1Q0xBTVFNUDBHc3M5QzZEbng2YzJwbmI3d09ORGIxU0NLbUdka1Jla3N6aTlNY2U1K1drcng3Z1VzSWt0VGhPZW5qUWVQWnFOcVF1M1FUYjU0Ky95QStTVFEyOVVneXVqOWJuZDJkVm5OeTNiWkNZSXRqcUFBeWk0d2JSQVhpQWVXR2ZYMXg0SXJLM2NTaG5qMHZRdkRwZ3dnWXA1eHU3M1YrNDgwMnYzWEw3STA4UWYyVENmbHJjMFltc0c5UzFjeEVnbThGYVU4My9DbTNmZERYL1hDY3Znc2NGRzQxbm1zVUpIRnNmckcxeHpSMEczdS8zU0wwdWFYMkpoZlpmWFJBcEtzNEg2bWlMUXNKNU9YcjFQZTNJaGs1Zkw5dGI1SVhOWDNTeWRxOTV6ZFYxaDhORDFMRWtWamhwd0RKVWhKU2RnY0dlUTlWNDZub3BoVVR6cXlUU1Mzc2dCSlZGSHNEcXlOcURRWERHM0pWbUs3TGozVEk1bVJhYlJ0RGQ5bnd3UitEeExmU2xEeGVobUtYV0g4bTBtUzdBcTVWVjVlL0xnS1cvSUs3aXlYeE9SZjllSzJicGFuUHBXRkVRdlNmMzZDNUUwUHJlKzIwWGE2amNqTldiUS9CVTYxZjhBN0xhZVE3djNMeng4TllXNnZrdTV5c3EzcVpiS21hVmltam1VWVRJK3M4SDc3VzRnakkxanI2elM1dlNndjFLRU5Ea0kweXFHMERMNmFtQWJUQUVOSDAzUkJOcldFZnpNWU9PeEl5Y0R1VU9pNzhoMXJvVENHWlhIUTVjTHM2ZUZPT0l3aWlxVHRVa2gxMkVCSUlyUzBoR2xvZmpHV01IM0IrWGxEVE02bTluUStEeFlXT2VoeWNTdzdtNG0xTmZ6cjY3eVNrME9sMDhsY0pNcUJscjBJUWlxQjJVVWpHdGNIWkRXaGZ6MDg3aitYdjY4a2RVOTFJY25KZjFOeS9EaTJtUmxhWEM0RUFFRWdPeGJqZm1LTE5FOEdrUlVWMzloRFZVMW9sNlZmNzRiWGJuMzdlU0ljWEs0cHJheFJ0TWdTdzc5TWtsMVdRWEpwS1VKQkFXc2JHNHdIcHBsVDR4dzZXY3ZWRzcvRlFtc2JIVi82b24yQ1pWbDg4bXFlS0F2R1FONXU3N05OalVmc2dWRS9kNitNRXdwc1lnRVpianVaUlc2cTNxamt4OXVqc2JsL1FoT3F6dUh1b1pqNVpLWVBtenlpZ0hsT2twVE9tcXJpcE54Y2orVDJ1ckZNZytYRkpXWm1GbzNCc1NsVjEvVU8zZVJDOTFETS9OK05qMm12ZHhSaG1hMkthTlpwQnVVQWlvUmYxUmt3TFM1MUQ4VWU3dlQvQTBhZm1OcjhzTzRsQUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L2tpc3MucG5nXG4gKiogbW9kdWxlIGlkID0gNDUyXG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUF3MUpSRUZVT010MWtsdG9WR2NVaGRmL243azZKbU9jQ1FSTlNhQUVTOUg2SXZaaWFaT0FWU2d0OWlHaDlLVXZTc1VvTFpVUzJrSUphWkZXaWc5TkN3WVVsVkJMSnc5RldxMlJVbXR2bWpTaFFobVJYTWpOU2VKa1pwTEpuRG5uL09lL2JCL3FoS2p0OTdUWnJMVllzRGZEZmRwU0tmUzN0K090azhPUlNNRGFXWitNSERXRTV6a0FBN282djJqM3p0dmxYNzk5dDBXMGRhWFEzOVVPQUdDVmdJL09qV0t5a04yNHJURng1cmt0aVZlZnFJOGp3QUZsQ0w0MG1MeGJ3dVhobWUvVGs3bjltMnByc2w4ZWVnYXJ2SFBtYndEQXg2bjBsVXplb2FXeW9EdDVoMGJuVnN6SWVONE1qdWJvMXAwaVpmSTJkWjc2NHlJQXZONTlFUUJnQWNDTkM3MDRjbnBreDlOTmlVKzNOMjVBeVZPUTBrQWF3MXpmTU52VHNEMkpXRGdFUURlaFlmZGdxdXVWY1FEZ2xSWkI0TFBXYlVtVWhZSXhCS2tKdmlRNHZrVEo5ZUY0R3BtQ2c1YW5IZ1BuNXYyS2J6VkFDUEY0VlRRTVh4bnlmQTJwTklxT2orV1NoTzBxdUw2QzQydGFGd2tobTh1OVVQRUZLb015YXFyc3lRYk9BR2tJYzBzZVpuTmxsSVZHME9JSUJpMEVPWU1yRmRheTJzQnhuV09YL3BwQ0xCcGtuQVBab29kcjZVVU1qeGNndFVFMGFDRlJIV1kvL25rYmpMR1hId2g0OC9NQjlMMjM5OHJ3N2JuZmlpVVhWWkVBaERKVUVmbktVREllUmwyVmhjdERZN2o2eGY1THJXK2Z3aVBzN09qYjFObjdjL3A2ZXBZY29jMC8wOHRtWkNKdkNpV2ZobTdOMHBFVEZ5WTI3L3VrSHY5Rlc5ZS9kOFVBWWQ4SDN4enJHN2hKYzNtWHBoZkwxUHZkRFhxanU1K2ViRDF0QWNDdXd6MzRYMTdyUEE4QTZEaCtmcWhRY21seDJhRUQzV2QvQUlDYWxqMlA2Tm5EaTRNSEQrR2xXQ3FxYTdaTy94THNxQVUzZUxiMFZTNDNkYlBoeEU4eEVVOVVVWFB6SHVycDZhSDE2KzkvWW9WNHZEa2d4TVM2SlRkVzI3N0RmTGgzaTZLV3VobXdsYkhZdWNIcXI1MVFUVFRBcWlNTEN6TmM2NlFwRkVJVVdOdW1ya21IcEFva003WnU5RndIbWN3TVkyQW9MTnZJaTloV0M5d3gzRi94ZlQ2L2NYTTR1eUtVdlRZQWxyUUlnTEtsVlI2YnpWNFQ0dTZMQUdpaGFINzNUTFVOd0djY0FocUtTVEpjYzl3RG4xbVZkNUZEZi93QUFBQUFTVVZPUks1Q1lJST1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9sYW1wLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ1M1xuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQVhOU1IwSUFyczRjNlFBQUFBWmlTMGRFQVA4QS93RC9vTDJua3dBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBM2hKUkVGVU9NczF6MTFzVTJVQWdPSDMrM3JPNmM5cDZSaHNhOWVWRW5IT1lTUW9rakFrSVFhaUZ3WWRabHlZbUdEaXZZbUppWHExN2NLZkdFd00xOFp3NFFYSlZHS1dxQ1NRZ0VXVUVFRE55SENEYnJCMUsyZHJ6OWF1UCtmMzg0TDQzcjhYajVpWW1PQ0F1TWlKOFQ4NE4zNE0wMVA5aGhrL3FRbDFIQms1QWtBUVhQTVVsL3lXYzJITFlPWGRpY3RNVDQ1d1M3MkdtSjRjZVRKL2ZEZ2RqUmhqK2Z5dXM3MkZQWWtkZlYwa013TWdCSTNWSmFxVmRheUYrVlo1eFhyZlVkNzNwejhyYms1UGppQUF6bjN5Y3JvN2tmenFtZUY5NytWaU5ycldRbVV6a0M4b0lYVllMUXVXSCtHMEpTdU5PSE1QSG55ejRiZ2ZudjcwNm1iazNQZ3hZcUY2NTdtRHIwemtFa3VFK2hwQlQ1ZENLQ0ZpY2FGQ1g0Uk5teUFWVTRTMjZJb3B0T1N1RjZzVjYvNkpWNGZ1YUtaSGZ6WTNjRGFUMFFpOERsR3JnN0Y0VHdRN3QrRW0wd2doMGVmbmlLeHRDQytUcHBOTGtqSGpXTXZKczFhbC9vczB6TmpKbnY2QkJPRUN4c05GSll5RE5FYlBJL3RIaWM3OGd6SHpOekw3Qm8wM3o0TzJqK2o5T1JXSjJ1enMyNUZBVTI5SkRYVThuWkw0am8xaDE0V3pkd3pSdERoVHJPT3VWSEhMNjV3cDFoRXRDK2ZaVStpMW1naUNKbWtUWk9nY2wwaDV4RXlaMExaVmMxY2ZrZXBmQUJTdkZHazhYYUF4K0JURjM2NERFS25QME5wVFFMWHJLclV0UVJCNFI3UXdERkJoZ1BKOXZHZ1V2ekdORmkwejlma0FybDFoN2VZbHZqNEsxZzlYQWNnMjI5VE11Tml4L3hTKzZ3b3RjTnZYdHV6YXFDRmpBdDhGS1FtcU53bTBLRUpLZHI1MEZEd1g0WGJBOWZCcmo4RmVZM1BkSm5TZGExcW43VjJ1MWRxanVkNEV2dHRTK0JFQkFxVWNUQTBFUHVIeUUxYTU2Z0RRcy9jUWMvTjFXbTMza3RacGJQMVlYaXg5bWNrTXh3a3RnZStpVUNSMGpiRXZERUJuNnFNWGFEc2gyN05QcUU3UXhWTHBqdE9vMXkvSUdidTUrdTk4NllPSHBUb3l0aHZsQnlqUFZhSG44bi9LY3dsZFIrRzdTTm5OL2J1cjNMcTNOdmx6WmRDS1hKK3BVY2oxVmxyVlI0UEplTy9ROXA0Y3VoWUl6dzk1KzNCTGpSMXk2UGk2MENOeDRYcmR6TTFZWFB4OTlzWU51K2ZiRlNlNUhCa2VTUExyN0ZDYnVEdS9WSHFBMmx3LzRQc3BkR2xpeExQQ0Q5TmkwL0pZS0RXNGZlTXVVMzlhUDkzZTZQbXU3SFRmRnMzMXVnQVlMT1NsNk11YlVkL1A3emEzbmgvYzFueTlOK0h0VCtyZUhoU2k0V21sU2xPL083dVp1dkxZTWVkY0pSY01YYTB1enM1Mi9nTUxsNy9mLzd0TXVBQUFBQUJKUlU1RXJrSmdnZz09XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvbHlpbmcucG5nXG4gKiogbW9kdWxlIGlkID0gNDU0XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFBZDBTVTFGQjlnTEVBSUhDRmR1bVBjQUFBTHlTVVJCVkRqTHBaTTliRnRsR0lXZjcvNzRYcnQySE1mWFRZZ3JrbFFLcVp1RktBVXFtdEFJV0JpZ0kwS3dWT3JTQlZXd01ER0JoSmlRV1BnUnFoVFNoUTVRd2RZT0JUVk5SV2x4a2VxRUJKVFdTUk03eEk3L3IrLzFkKy9IRWlvRVplS1ozdVVjdlRvNkIvNG5Ba0Q5ZFR5Q2I5ODllWHBpK3RnN2RxYi9jQ2pEWHV0QitWcisrdEs1Tno3K3VjRGZkU0dJeSsrLytJVXpQUGFjMTZsM0tuK1VQMWNobFpPblhyNGdZa1dNMUdPZ1J3aWFEVFp2bGlxNVZ6OTFIaHBjZUd0NmNucG1kdkZRTHAwMGg5SUl6YWExdmtsbDAxV1ovb0pZL0QzQzgzUGpYTDFaWVdiU0lxaExmdmp1OWlldnZIZmpyQUV3OWRTekh3ME9scEt5MTRXNkJGM0h0UGRJajZiRnlnMmZXTk5uNmVzQ3FZU2lXVTBTMXhVSDdPZ2NnQUZnR28wVFFiZkI5VUtYdVJNbTErNDBHRHZnRVhnaHVXZGV3TTRNSU93WWNxOUc4WmQxcW8xVjJ2VnFCMEFERUVvYXl2ZVl5UmtFN1RwSE14N0NHMkkwRjBXWW0waTVoZlEzQ0swcTJTT1MxUEFUdUJqM0FYU0FNeTlOdnA2STFweGF1VTU3dDBHOTFzZkl4Q0E5ZHcwUmlhS0VCaXBBK1M2aDM4YU9lT0RGRHg4YkRoWjBnT05EM2ZiNDBlT25iS3RLTEdIUlZXUFk4amFhR1VYb0JpaUZDSHFFUFEvbHV3U2RYUkx4eC9YZlZncDVIZUNiVzlWOFRuOVFqRVFPNWpxdE1JSHQ2SEdyak5CMGhDWUFoUW9sU0IvbHVTaS9neTVpWXVYdXhxS3gzd0cwK2UzenpHK2ZCOGpQajlkVXowOHF3eWYwWExRd1JBa05vZFQrRjExOHY2ZmM2azVGZTVqa1BsK2VlNUpLcWZTOUdaOUFlVTJsUEpldzIwRjViY0p1Rzd3T2hoWmo1YzV5V054emwvUi9WbGMvTklzcTM5cHhrZ2RmU3ptMkVmb3RsQXBCU2xUUVEvVjg5bllzTGw2K2UrbURuODUrOWk4RHk3Sll1UExtL2JSeHNUOGkrcWFHTWdPR2JjWFFOQnVreWRxdkhwZXVyT1cvV3M5K09PcXNianh5UTBkR1JvU1p6VG9aV2svUE9xVzNuV2c0cFJtR1VXdjUyei91T2d1cjNZR3JocVV0eTYydDNmOGFJYm5SVWRHT1phMWlKMlBpK2hHa3J0TW53K3hBTTBoSjN3M3FPOTd5dlh2cVQvVVJZZ0x2R3I4bEFBQUFBRWxGVGtTdVFtQ0NcIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9tZWV0aW5nLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ1NVxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQUdwU1VSQlZEaU5wWk83UzF4UkVNWi81MXpYeCtMNklCb0lMbVFORmxFN095WEVZSnF3Q3JiQkp2b1hDRlphYmRMb2lrUUxLeXZ0QkJ2RnFJMGdrWUJZbVFmUk5ZaXVvQ1FMUGhZTkc5bU45MHdhNy9WR1hWM3dnMkhnT3pNZjN3eHpFQkdjQ0lVSDZrTGhBWitYdXl2eXVFQjFhL1E1OEFqWWRMalp1ZW1UV0N4V1FoYlVQcTA5VlNKQ2RXdTBDQmdEdXJXaHBpaVEvdnA5S3BJWkhPcVh6czZ1YlAxTVRJeTdEanFBRFlWZElzcHFYNmR1elZ2WU03ejBYNk1nalBTOEJFQmZjSytCUlVIM28vVHlrOS9iRFkvYm91WGVwdEtLU2dJUEt2aWovS3pGZnJtOEl4QUNmb0p1dE1UK0lwcUluUy9PRzJmcHYrd2ZwdmkyYzh6ZVFZcHoyN2dDemdoQjRBaWtLbmlXU2U3NkMycDh5VXdLZkFCOC9wRUFFbTZUWmFsckFzZEFBRWpzbGxGTWhxUU9GRDRFRzRBUDcxOWxXZVBsQ090QVVDayttWFIrdlViZUdJemZLZnE0dEh4ajlncXNBRTFHbTJGTHFhYWRoYjZ0K0d5ZmV3OHZXcHB2ekY2QlVlQ1pzdldXMHRZTWI5OWREcG1MZy9oODd4RXdDWVNOc2VNU2lSaXZRQzRPaU0vM3pnR3JRTUhWUmQzbVFJbkkxWG9YdVp6eXJRSTVmNmI3NEIvdUc5WXM2ZzdGdXdBQUFBQkpSVTVFcmtKZ2dnPT1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9tb2JpbGUucG5nXG4gKiogbW9kdWxlIGlkID0gNDU2XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQUFsd1NGbHpBQUFMRXdBQUN4TUJBSnFjR0FBQUExNUpSRUZVT01zOWtrdG9YR1VjeFgvZmZjemNlU2VUeVV6YWtkcW10R29hR2lwUlkwdnFyaW9XUXpiV1JPblNMaFEzdWhCZEtLSWl1aW1Db0JWRUlqaXRJbFNKS0Nwb2swb0lpSy9VYWhwTmJKSW1tWms3NzBubWNlLzlQaGRwODE4ZHpqbWN4VGwvRVJsTFVNdllSTVlTQm5CQ0tUVUkvSTFpc242aHNBVVFQdFZsSVRnSjlBa2hmZ1crcm1Wc056S1dRSER6SW1PSjE1VlNMNktZY3BYY0sxMXZRWXNaQzBLQnJNb0R1cUVkMElUNEQ4RnhJY1FidFl6OUVyQWRFSDY4cXh2SVBUSSt6RmVmVEhOczVJaU14eUthM3pKeGNDalZ5bVFMUlRuLzdhcDJ5eU9FU05ZeWRsNERjSlFYTUFQbXBmbWxWZnFHN2lLVzZ4TDUxUmJMclJXcVZvbjFZcGxJTmlIR0h6M0ZsWVZsQUR3cExRRE5mREptZE8vdGVQckU2TkFEYXcyYjdzK0tiSDQ2Sjg0ZWZZdmM5UWF1SnluT0ZBaE5yb3NiNy83SWhRY25DQjd5MGJrbi9JeC9MRzdvd2Z1aUIzZW5rNW0rZS9aZzF3cFVXdzc5Wmc4L2FGZG9weXFFUWdhVmVvdUJlZyt0M2dnL0JlY0kzTjVtcStBY2EyNjJNM3BzdVBQczRhTzloNlcvclFJSlRkUzdYUDVJMmF6ckt3UkRKbzJ0TmxwVTQycTZSQzVkUVNXcXhPTlI1Yk4wVVZqZDdEUUUya2c0YXZIWDVTV1JMQ1VZTkE5eG01bWtRNDhpcWpzalVmS3FyTGw1VnE5bldlcmNFT21CT0FKR0RWOVFEN3QxcVQ0WStVamN2ZThJelVZVEsyRFJhcmZ4KzN3QU8vaVdkdm5QYVY2ZWUwNzVBa1pRYzVvdWJiZEpJWi9iYmhjRmdPdTZLS1dRVXVJNnpqWW5QUUJXRnhjUlN1QzJQZlRndlpHVGdZU2VYdnA0aHZYcE9WYVdGbEdlaDZicldKYUZZWnBVU2lYc3RUV3V6czR5K2Q3N2ZEZjdKZmErbHJCWDZqOGJVc3B6NVhKak1CamZVcjljK2tLb0tZUHZKM3hFL0NGOHBnVUlQT2xTYmRWeDNSWkN0U2tNK1ZTbExJU1M4cHpPbmY1L05NVER2djd3cnFCS3EvN09QbUVFZzhpMmkzYnowNFdtRTAzMnNEdTluN1g5Zm5Wam9DSHM1ZHB2dFh6emVhTXhVYWphVDZnenVxNWQxSWJacGVvcFhoMTlXOTJST2lnODVlMnNNTDl4VGIxeThUV3hFdGdRdVd1VjllSnkvVXpqZkxFcUlxZFQxQ2F5R0k5MTNOL1RHM3N6a3ZRZmQzRUlZbUZJUXdGNHdoT2Jzb0dPUVQzZm1zcitXMzNCK2J3OEV4dVBJV0pQcGNDRnlvZFpyUEY0eVBUckE0R0k3MWtFRCttR0ZnT0Y1NmdLVW4zVHFEdnZPRTMzOStiNTBtYnNkQnhNay84QnIvK1JyR3REQjlJQUFBQUFTVVZPUks1Q1lJST1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9tcmdyZWVuLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ1N1xuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFHNFNVUkJWRGlOcFpLL2F4UkJGSUMvMloyN05VMjBzckVJWVZGMmNoS0kwY0trQ1FncDBoeEJzYmRZc1BkUW9oQWJpUkMwVWxRSVlpTllTSXBMa2NhVEMva0RCQkhkZzJOZHd4RWozRUh3Qjk1dWJtL0d3ZzM0SXpGMytPQXh6ZnUrbWZmbUNXTU0veE95bjJMWFUza2dBU0xnSVhDL0x3R1FadWN3c0Fqa1JMOHR1SjR5d0ZIZ0xqRDIxd3VLUzg0b1VBUWNvSjNsV3RsUFh1M1doTFdnNlhycUJyQW1md0ZIZ0FYZ0NQQUFxR2R3RExUK3ZDaXNCUTNYVXhXWndTZUFaZUEyOExUc0o3ckhqdFpsY2NrWkJCNEJWOHArc25yeHVjalBQblptdEJZemdBWDY4NWVQbld2Vm15YmRVd0JNQWRVTUhvaTM4MDhFNUN4TDNFdFRVUi9JSmUxOVlNSmEwSkRBV2VBWlFMenRYQlpDYjY3NG5aS2h0KytSL0p4MkJDQ0VPWU9kS3hsMmpPc3BDWlNrYlovdmFsMndMZXR0MnUwdTd5VjREeHdHdmdLTmp2amVBYkNFdURvNU9URS9mVzdLTVZwVEQ4UFRsZXI2eWEydFQ3OEpMS0FLZkFNNDVlL01yVjR5VGRkVHRwUnk3c0pzMFltaWlCY3ZLN1JhVFlhSGpoMENjRDFsN3dyMjNjVGphdVI2b2FEbXg4ZEduU1JKK0xDeHdlczNRVHR1eDdmcXdidUZBd1gvbU1HZHNCYWtCd3A2alI5UmlMWmZQVkJ5YXdBQUFBQkpSVTVFcmtKZ2dnPT1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9tdXNpYy5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0NThcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBSE5TVVJCVkRpTnBkRk5heE5SRkFiZzk1dzdaa2FrZnJhRzdFSVhsaFRGTGtRc3BlamVmWDVDY1Jzc1hiZ29SQkVrRkxyM0o3Z1JGSXU2RUVXSTZLYWxpLzRBSVoxa2t0Wm1wamJ6Y2U4OWJpUzFkbUlWei9LYzl6eHd6eVVSd2YrVTgzdmozdjNyYld1cCtEZkx6Tkk1QmxoTHhmcUR4MkFxZ0ZpQm9BQmlRQVFDQ3hFTmF6TVllNENIVHg0Vmp3RUFrR2JmNEFjdndjcURvMDVEcVROUTdFSHJmYVM2RDIwaWxNYnY1ajhCQUpJa1FLdDFBSEFLcGdHWVF3QUVzUVpHWWxnYjQveVkvd2NnMjhHbnowRWNSb21YTno4N1ZvZ255MSs5a1lEV0VjSW84WjZ1YmxEZWZLRTJJMG0yQ3dEZ3ZBQ1J5bXNmclorL253djBvODBUOXp1OU42T0IzbDd6Uk1CS05ocjRsM0lXYWpNT0VXcU9ZNnJHOERYWFZXbmgxTVhDcjZIOHpJVUNBRGpNc25TMU1yMThlLzZPZTNsOENpSWEzZDEzQU5hR0FMTXNWYWF1TE0vUHpib1RseVlCMGVqdGZRVHdBUTR6TDg3TjNuQUhTUk5mTnVzUU1RakRHRVRsOUJDZ3hWczNLMjZjTnJHKzFZQ0lRUlNsSUNxbmJLMWRlYkgyUE41dWQwRTBBYjl0c0xGZUdoQ2hQanlZbFpWWHI5L0dMVDhBNUJ6YUhSbG1IR3Vwc2UzdlowRzNYeldHcDVVcWJXbXRub2xnOVJDZ1JpZUlzNTMzMzZ2R2VFY3lQd0RpMjl5YnMxUEw1UUFBQUFCSlJVNUVya0pnZ2c9PVwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L211c2ljYWwtbm90ZS5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0NTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBTnRTVVJCVkRpTlZaTnJUSlYxQUllZi8vODlMeHhlRVFvNDNBUUpQTndLTVhHamxWd3N0Z1J0YlNXMFB1VG1saXV6aHJtMWF1dmlaR3V0MmtRYmJYeHhzeXdhQnJNeDJJeUFPSTZvVlZoMEZncmlFRUk4Y0JDNWVlaWM5L0x2VTBxL3o4K2VMODkrUWluRityVTNWSHNGYXIrR1ZhbVFXd0VFanQvRzVWT0lzL3ZldnpDK25oZi9DZG9icXFYRXFkZlhibjFnck16RU9KR1E4TlljUkpPS3FRdW5RWGVyUlhmNjJvb2UvNDdsOE9rTEgvWTdkd1h0RGRYU2hkWHI4YVNWSnVpV0VadVZSblNpZ2RBVVVvOENwUk9aVzJSbGJKVHJ5eW9VbUp2N0pXTExxaGRQRERvdUFJbFQ3L0drbG1hVzFoaE4vWXRjNmpJd29oVTdDMDJRa3NFUm5UdmhUWlJrZVRsY2JobG1UMGZwOU96OEVhQlJ0QjNmN2RWZGNxaW9vamJ1Y0p1Z2JyT2ZKNk9HQ2FrbytsVUpJTmdsaGpCRWhHNTdCOTlNUE1pcDNYL2o2L3AyZFMxc2JkZjJsV2NkS2ZEbVZaMGVTWmJsY2NNY3lKakVWZllXRzcxbGxLNTBVRlQwRUJ1Mjc4ZTlwWkxTNVM1TUdhWW5rRWw1WWtDYkNnUlh4TjVYR20vUFdwNzdYRkp4cnFDWitLYyt3azRzb0xiMk9WNnZQd1NhbTVPTkoybHJPNGUyTk1GeXh4dlVqUnpFY2dRSnpzeVNyRE5hVmM5THE4VHFZZFl5SDhDSlRiN1hTSFAvTDdHOU1ZTzE3QzNFUmtYb2ZQWTNLbGFhY0ptbWlYSXN0bmx1MFR1VHd2UHpuWkQwQkcwdGpZamxueEZDVXY1MUU1aHpzUEFEdmRNZUhrNlpBOXZDTkMzaGNzeUlmeWt3V1hHb1pKNVh1eDhGTVVwbDlpZjhnNXZCNlhSQThOam1VOFJvWVh6WFVqbC8yY3RuTlQ4U25GN0dzVTIvVnJYTmszTy80UzdMeWttUjVRaytlcVp5T2ZObk1ZT1RhU1FiSVNLVzRLcy9jdW00a2syME5IbjNrVDQ4Y1J2eEQ0M2JZNVBCTDEzaGlQWEY0Q1gvMFp5Qy9GaFBuTUhUOGl4djc4MUV1blNRR2dqQnk4VUtaZG44OWVza1NiSDVyTTZGOFExZERZY2o1dWZhOThQekMzMHRIMGZtQTdObGhjVTc5ZHV6a3d4K040SkE0WTZSbUdzUnJsOEo4RlAzS09sWktTUW01ZEhTMmhjS0xpd2VhL0xkNlJSS0tkNTdKbE82aE4yZm1aNjZZMC9ONDBZd01NWTEvMldteG04aXBTQzdjQlBlcmZsc2lJcW45ZnpGME5UTjRPOWhpNHJtZ1pCejkweHY3a21XQXVlb3B1bkh5MHJ5M0JrWnlab24xWU55YkdadnpEQXhjY08rT0RRZXRpenJtT1Z3b25rZ2RPOU02L2ZhcnJoY2xITkFsMDZsYVZNTW9HdjR3eGI5anVKTTgwRG82bnIrWC9kZ2gwN3c5WGRuQUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L25lcmR5LnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ2MFxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFNc1NVUkJWRGlOYlpOTGFGeGxHSWFmL3o5bmNzOWs0bVJ5YTJqVG1NUnEya0pGZzVRMkNSRnM3RUtxdGJqUVdtOGJRU3BGRVhSaFNFRGMxQlF2U0ZlMlZkQXVFaEV0VklYV3BKUWlhbFFZTjdaSmN4OHprMHROeVV6bW5QL21vcTBtNEFQdjRvT0hkL1B5Q2VjYzZ4bnE3MmtXdU1NZXV0TWhkd0FJYk5MZ2p6akVad2ZmL25ac3ZTL3VGQXoxOTBpSlBlcEhJbjJ0VGMybGxmV2J2ZExhcllCak5UWEc0c3gxYzNWOE1odUVRYSsyZlBETXU4UDIzNEtoL2g3cG95OGtFblh0bTJxcVNtWi8vb1pnWllubWc0ZndmWitwb2JNVVZNUkpiTy9peitsMGJqNlQrU2swOHVFWEI2NVlDU0N4UnhPSjJ2WmQzZnRMMWxhU05PeStqN1puRDFFVUs2WXdWa3pMODBlbzdYd1FwV2ZaM2ZOSVNid2kxbTVVK0NxQUdPemIxeHp4NVdqWG8wOUdoZjZGU09vcUJRdC9neENZelpzQmlUYzlBUTVVZlMycW9ZWDhjcFF2QjgrdHJnVjZselJhSFc1dWJDb1ZNb00vbWNSZkt5ZmI4UjdadmNjUnl3WVYzY05xOThlc2RyMlBmN01BZitJUENtT1d0cWI2WXEzREk5S0YrYzZLcW1yUHJvNVR1SGlEM0FPdm94UGJPZkJ5UCtlTG51YkNRaE9Qdi9RbUpyNk43RU52VVRpL2dBMHlKR3JpSGlic2tubHRkNWJkVllQSnBjbHViY0dXVmYrM2tWZTBZV0pUM2tDMjlWNXNmb21LZUNYNVFPL3dsVkk0cTNIR29HUWVzWGdPcXJvWi9Qd0U0dWFQQ0NIWis4VkhvREt3L0FQS1d3TWp3R2lVMHNLM0treXV6RTkxUkV0ajJQQXZTSCtQV0w2RThDUGdlVGdoWWVraVdJM1RDcWRDaEZmQlFpcUZOU29wYzZFZG1aK1pNYks0RG1mVWJTbTRsVERBaGZuYmQzZ3JXaUZFR1ZPVGN5YTdwb2Y5SU5TZlh2azFlYXhwMnoxbFhrR0NyMDVkSkRXOXd2OVJ2NldTQXk5MHNKb0pHQm05RmdTaE9pT2NjN3p6Vk9Ocld6YlY5VC8yeEw0U25mMGRxNVlSbmc5U0FnSnc0Q3pDSzBlNE9rNmYrUzUzZlRiZCsrRkk3cmdFeUlmbXhQamsxT2pnMmE5em9iNGJ2N3dOR1ltRDg4QkpoQjlERmphU3V4SGxrMVBuYzVOejZkK1VZV0RETTcyeHYxb0s3REhQaS9UdHViKzFxS0doMmt2VUpuRFdrSjVMTVRFeFp5Nk5qZ1ZhNjE1dEdUaDVPV2MzRk56aGxhNW9DODQrRjVHMlV4bDJBa1E4a29GbTJEcE9uN3ljdTdiZS93ZGhRNVJXbitVbGtBQUFBQUJKUlU1RXJrSmdnZz09XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvbmV1dHJhbC5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0NjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQXVWSlJFRlVPSTExa2w5STFXY1l4ei92Ky9PY0haV1VtanN4S3NvekZYUTVjVEQyeHdMREMyR0RWVEtJZ2JWT0Y3dG9OYnFZazNWc3NnM0hZQVRhVFNCa0pYWVRzWGxSckFZTmkvU3drWE9WdWExakZzY1U5U2lhNTNoTy9uN245ejY3MFBRdzdMbDhuK2Y1UE8vMyt6d0tvR0ZQcUFJWStyRzd4ZUVGMFFWVmxsTHRCa28wUEhCRlBxMkhYcjJjLzh2UyttTERucEIrUVhOeGxzOTM3YzI2dXJMMzI5cXkzZzBHeTd5NXVkZTZvRmdEYUV1enRYaExyYVYxKzFvQUJRZUthbXE4R3dJQjNMNCsvS1dsbE8vYjU5VktIZEJMQllxYUQzZG1iOXpzLzdpeDdzUVBhd0FPRlFRQ0hudGtCR2RtaG9YcjE4bGZ0ODZqNEpBR0VJVEZwRTNWcnJkeXZGN1AwY2E5VFYvOEgvSTBIQ2JlMjB1aXY1L0U4RENMMDlNQUxHa1dTTTR0TUhZdlNtbGhZWTYyOUxkZjdtMEtQbThXNkloRm83Ykp5OFBSR2xOUXdQamdvRzFFT3BaK0lFSnFQb21kZHBpTHo3UEo3OC9XV3M2MEhkbmR0QXpvbklyRm5KbFlER2Y5ZWlaSFI0bmV2KzhJZEs0QWJ2YmNsS0dIdytSdnk4ZjFDY1lvTlQ3KytuZmRKNHZhNnlGaVJHcEhaMmVIN2tRaVBCNGJHM0xUNmRwNmlLaGI1NmllalZkZkxhOXBmV2xUb1E5dFdTaWRUekx1RUxuM0JQWDBjREl4MC8vQmpvUDByQ3BDclpnVDd0STM0cE9YeEU3MHlJbmpRWEh0aUJoM1ZwcS8va3BNZWxKU2MzOUkrSUxuUm9hZmttbHVsakZTNmNsK2xkVDBhVnhuRExQNEQ5cXpCVEVKSkQxQmxqY1BjVTBsUU85NVdwN1pDcDlQdFZUdE42R1ZMYmpPT01hZHAvR3pWM0NTZitLaytnazE3TVI1OWpldTh3UlpIWG9zc1AxdGxLaGp6eCswVWd6RXAzNEQ2MlYrK2VreTBRZFhHUDMzWjdyUEhzWTRFOHhQL1lyV2VtQzV2blZrOEhlVVVxMnJFbHhwanQ3cHVsTDBUakNucEt5RTIrRzdLS0Mwb2h3NzlZaEh0enNXM0hTNkdhRHFFMElnSDBGNk9PTktvYStUN3kyUDcvT05yMVhrWnVmNlFibWs0akVtSHQ1ZE1LNTk2cjM5Y2p6RHR6ZUE4MERsQ2dEZzFqbXF0Y1UzSXNzSnBRYU1LODBaNjFzei9nTTN0MHd6eXUxWi9nQUFBQUJKUlU1RXJrSmdnZz09XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvcGFydHkucG5nXG4gKiogbW9kdWxlIGlkID0gNDYyXG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQUloU1VSQlZEaU54WlBOUzFSaEZNYWY4OTczenN4TkdXOGF5dlZqSE1hK2l5UnJzb2tDSVJDWExpSUNRUWpSYU5VLzBMSi9JQkNDcUVXazBLS2d2VVF0ekE4RSs3RGxYR2FtaGxLWm5NaVBjZTU5My9lMFNBZUNhbVBRMlR5cjUvZkFPZWNoWnNaZVJ1ekovUzhBRWdEU1k1T3QwaEszbVRFQ2NPVHZGZ3BBZUtpMXViTndmK2d6blIyZEdIQ2k5dE5MUGNsSXp4SFBqa1VscENBSUFnd0QyakNVTVZDYW9Rd2pERFdXc2l2aHpOdENVS21HVnlnOU5sa1p2SHd5WnRrMjFpc0syZHd5KzRWVitsMTJLdEhNcVdRTHVYVTJkQmppK1lzUDI1S1pZNW9zYkc0cEZKZkx5QmRMdURwd0d0R0loTFIrcmtocGcycWc4R3pxSFJyaSsrQkVYQkJaWU9ZWW5ic3h1V3dNdHhCQkN5RkVYL29nSmJ6OXVON1gra3Y2NCtrdnlIMWF3OHVGTEJ2RGhwa3RJV2lGZHY4Z2MvUEpkTytwenQ1VTRvQnNkVzBjYmZxR1pIc1g4a1VmeWZZdVRDMnRvYmdXd1A5WVV2UHZDL096OTY1ZEJIYk9tQjZkR0hialR2ZXhWTE1zYndUd0dteDBlRW5raTM1TlBkZEdlVFBBOGE1bTZjWmozVDBqajRackFEWjZ2UC9Db2ZxdkcxVUV5c0J6Sll6UmFHdnBxS25YSUJHRUJxWDFLdm96aCtzRjgzanREMVNvbkthNGc5enFKb3hoUEhpMUFpRUl1NmRnQUlZWllDRFVCbTJOZFFoRDVkUUFSRFQzZXRFL2YrWkVRamJHSFZnV2dVQ2dIY0tPRjBvYmxMOXZZV1l4cTRoNHJnYllYcThNemk3NmQrZmUrQm10VFNjelczK29tTGFsVldEbTJiQ2lid0VBL2ZjMi9nRDNRdnZiVThGMUZBQUFBQUJKUlU1RXJrSmdnZz09XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvcGhvbmUucG5nXG4gKiogbW9kdWxlIGlkID0gNDYzXG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUE2OUpSRUZVT01zRndWdE1XMlVBQi9ELzk1M1RDNzFRWUVDaFVBcUR3WmpCVk5nSXlGakNTcWFaYThBc2hoblJ4ZmpnSlNicVprajJBcWpSK09JTFdlS0xNY1RzemVneWlYR0x6SzBaRGpCUU51WGFyUVhIclRkYWV2UDA5SHpuZlA1K1pIeDhIQjNrRHJ4anMvQmRQNHVIanpTWHBxT1gzVTZqRzFUb0JRQm82b3pDeWJRaXNaczdlc3ZlSjZNL1llcXpiaXp5bHlCYzdaUGhIWnZGNUxVZW01ekZzTVBwdVAyRDc2RGY0em5aNnJub05UVTg3emFWRzNIY29xVE9peXp6dmw3S1J2dDdHNE92Zi81QXZ0b25nd0RBNUxVZVc1bkovRTJ6dStlZDJnb05ZY0w0MjFmdWthKy84dkR1VTdXUWcwOElzb2RRVXd4Ny8yYXdHc3QrbDVMeW4xNyswcGNTSnNjOE1HcDgrTG1PTStPT0Jnb2Vub1UxdjQrQlN5Zkp1MWQ4cExuSlFvNmVzSU5ZVFZ3elUyS3Vja0NuV3RvUElyR24zbk10UzZKWmdhTzZwbmFpcXNZQUxiMEVRNEZCM0k0US9jb3lmcDI0Z0V1ajg2ZzJFd1IyRlRMWWFjQWJReTVVdTZvUTNiTk1STVBwMzRUaGwwKzg1VHJhTkdDeGhLSGYydURVY3BwRXVyOUFNTTVScndhd0VxRVE3RjNvNmo2RmhTMkd5TVk2OTV3cElVd3k2TEtwUkVnVXdmdHRWZ29tSjJGSnBrbXUrelU4M3RqSDZQZC80K0ZRRkRQL0dOQjdGbmkwdEloU213MDNIc2hreXY4WWJmVkZDTzNuUHhSQjZXbXoxUXo1TU1semRYWWlIQ3loUk8rRTIxVUtxZFVLYjI4YVUzL2NoOTNwd0Zwd0J4OE4ybkN1czRocnJJYmMvWDNCSVdxYUNxNnA0SXhCTVJqQXNsTm9LMzhCMTBkS29TZzV2UG1xQ2FwQTRmUEg4SUhYaElFdUhWUzVBQ3B5R0ZCUVJiVWd6V1NUaVVFOU5SSXdCWGtwRFpPd0NKbm9BU3JDU0FrK3ZsaUNrYUZpSEViUzBGZ0JsSWdrRlV0Q0s4Z3pOQzhwZHhNSkNZSmdBampqOFZBVWlXY0hFQVVOaEJVQXBRQkZZZGhhM2NQTytpN0FWRTRnSUJiTDREK3BNRTN6bWV6UHUxc2hTYVVPY0thU3lycGlCQmFDOFAreWlHd3NpV3c4Q2YrdGVRVCtDcUN5cmhTYXdrZ2hiOFoyNkptY1NhZHZDazFOMWl4TEplTEYxcW9McGVVMkVDMkZLbGNaM3c3R1NHZ3VpSjNsSGRBaUVlMTlMVndVUVNnOWdzQnlETDZGemRGN0IwM1RCQURlTzk5Y2M3eEMrL2JGem5adlEyTXhkRFFLUWhWd0tCd0FRUFFFbW9DOFpNYlQxWDNjK1hOOWZqWitaR1JYTHBzVFdtc3R1TDNXSXFHbzhHUTdGQVJQeFRzWXMwS0FDVWFqbldpYWxTVERNalpER2ZqblYvRGpYUFNXLzdEaXhxNWM1aWU1ZUpvQXdER1hreEs3MDJ4Z3pGbHZ6cllkSzg2OVVtbFMzQmFkMGdnT2tsSEVVRGluVzFsTFdlOUhaSE9nd09tbVhzZjN0OWJXOHY4RG1XUEN0ZktYZ0hRQUFBQUFTVVZPUks1Q1lJST1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9waXJhdGUucG5nXG4gKiogbW9kdWxlIGlkID0gNDY0XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUEyZEpSRUZVT010VnpFdHNWSFVZUVBIejNkZThMc3gwT2xOZ3BzVktXeVFZTTYwUUlhU2lJRW9pZFdQU2pkR0ZTNE1MZGVOTzNicHAzQmdUb25HREJrUVRUWGdJYlZBRE5rWklOWlNDbmJiVFV1alVQbWM2N3p2M3p2MjdjYUZuL3p2eUVmQ1NwbkhFOTdrR3RDQmxCUUxEaG1tZFVLaEJBSUdiVGRjZEt6bk9oVHJrWHdlKzBqUm1mQjhaL3hkZmdwakFjTmkyejNRK1A0amRuU1Rja3dhZ2xzdXp0YkRLeXZTOE81dWRQbDJIQzZlaCtMbW1JUUNYSUJZT2gwZVNKMCsrR1c4VGpJTTJ5bW9nMnpVbHVvWTRJdElNNHZ4V1pubHFsYW1KVzE5dVZLdnZ2UXRGL1JyZ3d4dXBvYUVQMnRJZWY0NU9Fa3Q1U2srR3hPcXdSWThFcEQ2OVF1V1BPWFYzTENjOXo2V0pKUGNOelB4MVAvY0VUR2d0U0VWcysweGlWNWlHWGVYQXFRejN2czJMZjNrTGNRUkR0d2d1UlptK1hwUm5YanRFYTBlTFZGZVk3cjY5bjNaQlNyTUN3ZUhPWjQ5UU05ZUlGRzBWemd4eGVIU014Y092b0NiQS9jVWhtejdFNGRFeHJNZGVJTGdhVXE1ZHBMUDNjZE1MQkljMXd6UlBCSk14bk9JNlFjY1c5OWd4eG5Pem5QN3hDclc4VUZ1Q3Q2OWVaVHczaTNmOE9JRktVQnJsRFRwMnhqQk04NFNtVUVQV3pnUk9yYUZLc29aMS9oelJwa2NtWk9ORlMzaXhFcG1RVGJUcFlaMC9SOFVxMEt6V1ZkdXVEaHpVb0FGQVMwSE5veFJZaGR6UDlPZnVNYklIdGlKRlJCTkcrcUxvMzMvTmxybEJXVzNnMXp4VXk4Y0REQkc1Nk9SWGg2U3BpVmQyV1NrL1lMNTRGeFJvdWc0SWloYWk2MFRhdDJNYU9scERaUDNSQ3BySVRjTnozYkhHWm1sSU43ZmhWRGJWNGxSQnV0OTVIL3ZvVWY1YjljWU41ai81bU42RFNSVXc0N0s0WHFMV2RNZmtDcVJDdHIzVWMrcEZsaGR1czdGV3AxdzE4RjMzZndNeERHSlJTS1J0RXVsK0x0K2FkRzluczN1TUI1SEljcnhTZWN0YUtYd1dENmZ3dHo4a25oQ2xCeXhCMXhFQnBRQ3ZwWHdYc2EwTzVoeU5YN096SHo3c1A3Q3FYM1JkZXFLeFpjbm45KzdjbjluYm5ralRxamZFMjZyUkxOVlVxK3FpZVpxRXd1M1NsdDdQb2hYam0rdlhmOCttTzc4b3hOc2U2Wm1Rd1hjdnYxcjNOemRuSGs3ZUViUFJmRHFjU05PVzZtYkhrd01TNzk0bktoZ2o3NXFNejh4eDlzN2tEM003ZHAwdHRIZE0rT3RySlFIbzI5MmwwYlU3RXFxNlhkM2x3bE85NWRLcGRzOGJNTnhtVHhNb1dkYjgzN281dFJDTC9WU0tiTXU2dWpGdjZ2N3l3djM3alg4QVVJeDlhZG1maFdFQUFBQUFTVVZPUks1Q1lJST1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9waXNzZWQtb2ZmLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ2NVxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFLSFNVUkJWRGlOblpQTFMxdEJGTWEvbVRzeDk5NUtLSlFrdFJzVk42bVlVQVVYMVYzQWhidGkxNHF0QktGTFFRVC9BRUVFbDRVMnUrenJVa0V4bTRxYlJrUFRhRXRCclkvNFdqV1ArNXc3TTEwazFqNmdZRDg0ekdMTy9EZ2ZjejZpbE1KZHRiaTBRQUJnYm5aZWtic0NGcGNXT2hsajd3QWdDSUxuN09aaUk3OUdDQ0VaU3VtRWxESUZBSlRTa3BReXA1VEtqcVJIRlFDRVFxSGxvYUhoZ1ZxOXFzcWZ5c3VzOWZnUnBYUWxIbnVZN09yc01VM0RBQURZamozODdmaXcvK3I2OHVWR2ZtMXNKRDE2THFWTVAwa05rSzhIKzZUMHNaU202NXVyaEJDeTBwdElEdlltK2t4Q0FNdHVvR0UzQUFDUEUzMW1iNkp2a0JDeXNyNjVTcHBnQzBKS0FBQVRRbVJpMFhneUZvM1RXcjJHaG1XaFhxOERvSWkwdDhQelBVU2pjZnJnK2lKNWVYbVJvWlRtZDR1Rlo1YmRBS1UwVDVWVUU5MWRQYWJ0V3JCdEI5VnFEWXlGb0drVWRhc0J6M1ZoV1hWMGQvYVlTcW9KenZsTXNWaThZb3hkY2M1bktBOTRTdGNOQkFHSDQ3clF3enJhUW0wSXR6WEw1eHcrOTJIb0JuakFVM096ODhkU3lvNW9MTm94Tnp0L3pJSkFRRW9KS1NVWW93QUlOS29CUkVGVEJDQUVVa2dJS1JFRTR1ZDNPcllEQUtCS3lsSzlWZ1VCUVRnY0J0TTBhSXcyejFEVENxRVV0ZHAzU0NsS053RGJhUUU4MzgvdGZkNnp3bUVkUWdsb2pFS2pCQnFqSUpBSUFnN1RNTEgvWmQveWZaNzdhd0xPZWZhc2NsbytQRG9Ra1hzUmdBQSs5K0c1THBRQ0lwSDdPRHc2RUpYS1dabHpucjBGMkUzQTVQaVU4ajF2YkdmblEyRnIrNzNsMkE0TTNZQnVtSEFkRjl2Ylc5YnVicUhnZTk3WTVQaVUrdE1DQTRDcEY5UG5iN0t2bjU2ZW5HVE9LNVhmVmxrSWtWTktaYWN6cjI1RFE5QzRzZkF6QzYyR3Q2MzZwNVJHKzIzdU5Wbi9FK2RmOVFOa0tsZEQxUk5VaEFBQUFBQkpSVTVFcmtKZ2dnPT1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9wbGF0ZS5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0NjZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUFYTlNSMElBcnM0YzZRQUFBQVppUzBkRUFQOEEvd0Qvb0wybmt3QUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUFkMFNVMUZCOWdMRUFJS0xhbkVNdjBBQUFORFNVUkJWRGpMcFpQYlQxc0ZBTVovNS9TYzlxeUhXOWZpUUVtNURxWm1EaVE2Z1MxalFSRXgwU1Z6Y2ZHU3pNVEVSTE9IUGFoeFBzaDBMbWFMODhVWFkweU04MldHaFdSb1JOaWNpMUtIZzEwQzZFUlpnVEpLS2RDVzNrNTdiajdaekdlL1ArQ1g3OHYzZmZBL0pRQjB2ejNRc2IzYSszR1QzOU1TUzJhVDEvNWNPWC9RUFBsRkpwdmRBYWkySUUwYnN2UEdvUk9YbC9yN3VubXViL2kvZ0NPZlhncWRmcU96S3EzbGNidWNYTGdXNHJjZkIrd2pQYXBnSzJXczNycHFCNFBCOVBwYTlLUDk3MS82OEc0SElrQkxRM21WYVJoODhHV0FsVmlLcnVaS2UzeWxWSENyTTdaVXNVWkZSNzNRL3FpL3FOVmZlbnprUk5mSTUrOCtYdGJmMXcyQUF5RHQyKzJmajJ5MFhKOEpjNmozSVlMaHBMQ3lPTXJ1dWxWQmx4WHNWQlJUWDBmeE9ibFhWdXZ1UkRPdUE4ZUdmeWdBWnErY085L1JWSEw0eWQ1bjNBMzNsWEgwOUZuMkNBSHVkMmlZVHAybFc0dk1qTVdwZDlwWTl5all0cnV0czdIczYzT0IrWmdJTUhxOCtiRy9jclhlQTUyTlBILzBMRnVqWnpnMXNveXg1eVN1c1FBL1haampuYUVrVnRjbktMOWZaN1BQaFluMkVvQUVrRFpkRDVlb01tZStueVNibU9mVjNpMjA3bnVCL0VZRXllZWpzNk1TZjg4Kzhva0lZcW1iSWhVRVBmTWljRXdDeUJtb05XVW1KYXJNamdlYnVhbjl3U05OaytqeFg5Q3JLeWszRGJ6S0ZQbmxJU3h2TVE3YklLZmxmSVVXVkNFNS9mTjBncWZhRysyRFBhM2NqZ0R4Y2V6VVBLS1JReFFzaUYzRlNzMkRaYkt4bnNMVWM0T0ZDSDh2bXpkZXFSMVA3My85bExyTk04ZGJlMWV3OGpLV3FYTjdjb0U3VTR2c2Vya2RXOWNSVElQVnFJYVcxYjhwdERBNHNaWjgrZ0VjaDU5dzcrMXBtc1UwTkVBZ0dVbGdaSE5zM1ZtTEtGb0lwbUU3NUFiaDh2Q1ZpZGUrQ3IxWkFBQ0V6SnFBTnpmWFhiK3RzMHAwYUtBbmNha3l4VjQza21RaldEWU91VUg0dHY5aS91S3M5WjYwdVg0cUhBNWJCWURINDJFcHpjMjV5WW5xWXJtazN1bnk0dDdrUVpKTFNjVWRMSVJnOEx0QWVHalcrZGxvdkdiQWtVL0VvdEdvTGR5OTYrMXRPOTJXSnZnYmkyTzc2dFNOWnl1VVRKdGdtMnJjMkRRZFNoZU5qaWUyREdFVEZCVjdZZkxYc1V6aFRQK3F0dElqR0dLdFJIbXhFczRxaW1HSUVqaEYxWmxFbFMyandxVnBzYVY4UnJLQ1JqQWNzd0grQWFBT2NaVnFOY2tuQUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3F1ZXN0aW9uLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ2N1xuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFKSlNVUkJWRGlOcFpPN2F4UlJGTWEvT3p1VGZjd0tiaExqQTQxQlZwQVUyZ1dSclFTeHNmQVBzUFFQaUVpTWFDRVdGaEZqWW05bFpkQm9HaEVMdTFTQ01TQ0tBUXMzbTQySmJzaGpObk5uNWo0K2kreVRhT1hwTG9mdmQ3N3pIYTRnaWY4cHQvTXhQWDMvWUtUY3l6MmVOK0ttdkpMU3lUQUFlSzczTlZGNlhodjFJZVBwZDZPajk3YWFHdEYwTURIeG9PUmxldVl1bkMvNWd5Y0dNNFZDTDlMcE5FaGlkN2VPMmthTjVlVnk5R254WTZpaTVPcjQrTjE1QUFCSmtCU1BweDc5Q0lJZGFxMnBWTUxQNzUveTJkaFp2cG00eUpYRlY1UXlwSlFocTlVVlRqK1pySkFVSk9FQWdCQUMyVnptcE8vbkllVXVsRkxZWFB1T3FMNkJPTnlHM0Y2SFVnbWtEQkVuTWZ4ODdyZ1FvcDBCU1U1T1BZUXhCc3VWTXZMK0FaeTVOSXB6VjI2REpLUU1VYXY5Um5WMUZaWHFNclF4WUdQM3JoQWR4MEdoMElzd0NoRnRTd2hIZ0NTQ1lBZWJXNXVJb3dSRFEwTllXRmpZZjRXOUxDeUVFRWc1RGhJYW1FUWpDT29RQUFZR0RzTVJBbkVVdzJqVEh0cnBvQkVvU0F2U0FnQzBWdWp2UHdUWGRSRktDVVBDbURiQTNRK3dzQTBRQUJodFFCTEdhQUFFVFRlZ3k0RzF0c05GQTJCTXl3MEpXUHdEMEJSMVRtOENtbjJBb0cyTHV3QnV5aXV2cmY5RUxwdER1aWNOei9VZ2hBTnREQ3dKRUFBRW9qaUdFS0kxb1pWQkVrZlhabCsvbkN1ZUttYjcrdnV5ZnQ0WHZ1KzNNdGc3cWNYU3R5VUs0SGxUSnpydE5qK1RtM0pIVW81VE10WU1GMDhYODBlT0hzT3Z0WFZUV2Fsb0dZWXp4dGpyNDJOMzFEN0EzMnAyYmlhTzQyUXgyQWxlMU92MXR6ZHYzUHJTMmY4RHhDYUIreWNlR0lzQUFBQUFTVVZPUks1Q1lJST1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9yZXN0cm9vbS5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0NjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUFYTlNSMElBcnM0YzZRQUFBQVppUzBkRUFQOEEvd0Qvb0wybmt3QUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQWkxSlJFRlVPTXVWa2o5b0UxRWN4ejkzdmJza0RXbE5UR1AvbUF4S2grSXFsb0l1VHFXYlF6RmlMU0lvZENoVW9adWxBWmNPUmhkeEVCRlRCek9KbzB1aExnb0s3YVJpaHNaRTJwd2hObTFDZTlmYzVUMm5sQmh5Z3QvcCs5N3ZmYi92OTAraEEzbUl1NGxFTVdEYmppTEVXck5TdVNkZzd4Q3NNZGhUT3Q3L2RTNkExa2drbk1Ga0VtZGdBTjB3TU5OcFpEQ0kzbXgrK1pYTDNkYmc0L2syamRwdUlDRVFIaHVUWmphTFB4eVdaam9OUU8vVUZLNXRuL09Qamk3dWdwNXEwMmlkSmVDNkFKalpyREswc0lCVHJWTEpaQUJvUmlKWGF0Q2JndjJ1R1dpR2NWbTNiV1ZrZXBwbUxzZTM1V1UyVmxZb3V5NkJ5VWtxaGNJN0NWYktxd1RITUo3NjV1Y2hIR1p3WW9KRU5NcXAvbjVPNkRxMmxCeTRickFHaXFmQm9aVERxbUVnZG5hazFIV2FRdUFJZ1YycjBkallRSTNGTHUyREh5OERXNGozQjV1YllOdUt6T2N4ZkQ1OHdTQnFKSUo2T281bFdma0dPSGcxMGV5eDUvb3ltYSt4ZUp5ZUMrTUUvSDVwVkt0S3NWUmlmZk16aFI3elNSZ091eHJNemZoNVpZanQ4WXVTazJzL3NET2ZjT3NDRWRLbE9TeVZrYVd6ZkY4dlZkL2svN0ZJajEvRVpYSExBdUJEMURxVDdJdHNGYmNzeXZXRHBWZ28rS0JjcXQ4TS9BNW1uci9kcFN0dXpJUjhMYjZZOGlsMzcwZGw2bEZVdHU2U3Q0ekE5YXNlR2N6T2hsaGRyUU53N1k3QjhKQ2lqY1JqanFMQzlzK3kvbkQ1eU8zMjZmRVVXbUtBMTg4YUtLcEVVZHVXM0FPYVowUnFDS0ZhTFE2Ti96TVFJaUFhUityTEZ1K1kzakgrQUphZTVHUCs3a2FIQUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3Jvc2UucG5nXG4gKiogbW9kdWxlIGlkID0gNDY5XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQU5SU1VSQlZEaU5WWk5MYUZ4VkFJYS9jKzY5ZVQrbW1keGtrazZEQ1VuYU5Ha3dWWU8yYVY0RlRiT3kxSzYwVnFtYmdsUUVFUlEwSkJ0QnRLSVV5VklRb3BWRUYwWVVwVEdKUVlxMWFCa1gydVk5YVI0ems3RUo4NzdubnV0Q2JPTzMvdmsyUDUvd1BJKzlUSXdNTkFxOGN3YXF4ME1lQVJEb2tJczU0eUUrUGZQMmQvTjc5K0kvd2NUSWdKVG9TNlpsRFRjM05CYnZxNjB6aWdQMWdFZGlmWjVZZU5HOXZiQ2N6T2F5UTByejBYUHZUT3Y3Z29tUkFXbWlydGwyVGVmKzZzcWl0UnRmazkzWnB2SE1XVXpUWkdYaWMvTEsvZGh0dmZ5MXVwWGFqRVIreWJueTVJWExQMnNKSU5HWGJEdlEyZEUvV0pUZUNSRThkcGpXNTg5UzRDc2szMWRJMDR2bkNmUThocVBXT0Rid1pKRy8zTmZwT3JsWEFNVDQ4Rk9ObGlsdjlwNTZwa3lvWDdIV2I1TVh2UWRDNE5iVkFSSmpkUWs4Y0dvRE9NRW1NdkV5dmh5ZlRLU3pxa082eWpuWCtGQkRzWkFSek9VUVpycVVaUGY3SkUrOGg0aTdPR1ZkSlBvL0p0SDdJZVp1SHViU0grVDdOSzBOdFlWSzVjNUxMNWZwS2Erc01uUmlnZnpZMzZRZWZRMWx0L0gweFJHK0xYaVdhOUVHVHIvMEJxNy9FTW5IM3lSL000ck9SckNyL1FadXJsZG1sRzR2cWFqR1RXMlJyRzlDbDFROStNZ28rTi9GYm1tUVpITUxPck5OdVg4Zm1hdzZZanFPZzZjVm51dml5QXdpTmdtVi9ZeVBmWURZdlk0UWtoT2ZYUUVuQXZFZmNZdzB1QUpjaGVNb1lXb25GOXJaWE9rdUsvYWhjeHV3OVQwaVBvc3dMVEFNUENGaGV3cTB3bE1PbnBOREdPVkUxOWZScmhNeVV6azlzeGtPSC9kMTdEZmM5Q29veWRwQ25NVS9JNFRub3dncHFUOWNRMk5iRFhhZ0dFODVTTE9FbGVXUW0weXJhYU92clNLOEhvbGRhRzE1T00rUUNlN2NXaVIwSTB6OVFadk9rd2M1ZERTSW0zUDQvYWNGREtIeEI2cEpicHQ4OGMzMVRDYnJYRFIrdUJXTFQ0MjltNHR0Ym5XMXRCKzNOcGJuZWFJdmlMKzZCTXNTV0thZ3dpNmtxYzFtSTV5aHVxYUZzYXRUcVdqODN0Q1ZtZVNrOER5UHQwNGZrS1p3cHcvVUJoNFpQTlZYVkZDU3duTmlhTFg3YnpCV0tVS1drWXc2WFAxcU5yVzZFZjB0cStnZW5VdnArekc5UGxnbEJmcFZ3N0NHdTQ0MkZ3U0RWWVlkc1BHMHk5YmRkWmFXN3Jxek4rZXpTcWtocGJrOE9wZDZFTk5lWHU0dGE4TFRMMWhTOXpndTdRQ1dRU2lybU5ZZW40ek9wZTdzM2Y4RDJIK1Bwc1VTUWFJQUFBQUFTVVZPUks1Q1lJST1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9zYWQucG5nXG4gKiogbW9kdWxlIGlkID0gNDcwXG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQUFsd1NGbHpBQUFMRXdBQUN4TUJBSnFjR0FBQUFBZDBTVTFGQjlnTEVBUVZIdC9ESWNjQUFBS0pTVVJCVkRqTHBWSlpTSlJoRkQzZjhzL2lhRHFPb1JKcHBaSmloV2x1b1BnZ3BCRVVZWUZvbGd1WVFrRVBRVVRTSWlSQjlOQkNKU2lCTFJEMXBnOUNFbVZpcGcyVk1pcENhVTMyVUU2T051by8vL0o5UFZsa1l3VGRwOHZsM01NNWh3UDg1NUNWaDRqOHBsekdhWTRRd2tFSjlmajdtanYvUnNDWGw0VFNGcGhDdHU0cnlhd3B6a3RWSEhZTDNLTmUwZVlNbjFGVmJldjA0Nll2U2FWbjhhNzdmR2dGNjNaZWFEMWVXMUlmRnhjTlZkTmx1SldTcUhBck5CMjQxdEV6MFhPamRqT2tCTWp2b3RteTdQSTl1VmUzcDI5Z0Rvc0FKU0JXVGhHbUVFVFlDS0tpSWwzamdZM1NYMW40YktVRkNnQ00wNXppdkZSRlNsMVNRaEFUenFHYkVyb3BvT29DeVlreDRJeFdoOHFBQW9BUXd1R3dXN0FRRk1Rd0JaWTBBVlV6TWE4S3pBWU1NTVpoQ3VGYU5VUktxTWM5NmhVT3A1TitWelZJVTRKekJzMDBRQWl3b1ByQktPdGFWWUcvcjdtejdVSHZUT3dhSzZaOVFjd3VtcGhmTWpDM2FNQnVzK0w1NEFTa0ZtZ0FnTXJzdWo5REJJQ3d4S0lPNzJmZjN1elVPRmY4MmtqRVJOcEJUQU85QTZPWUhPeGFUUHM2eDdiRVpvbjc3dmFwcXB4R0RFKy9DbDJramJzdm51R01WcHRDdUJobFhWSUxOT3p3ZlR4WmQ2THk5SnQrRDk3Mmp4MjRPM1RyVVZWV0krNjRiLzU2VE41MURwQXlaTnZLTTJxS1d1b3Z5ZEhlWVhINTJCVlpsbmE0WnRrTytkZk9IOHhzMkorZWtmUXdKMzhiWHI0WWhtZGt2UERlVUhzZlh3bE1LU2hRYkl1R0ZWUlhwQ0Fja2hKQ0pKNndydTc1Z2FLamFrQzlucklwQVJOOHNoT0E4eWRCVm1ZbWRKc3RUQVNETGs2STB4UXNCa1JFZ3lJYVV2cGNSdnkzS2Z2WVUvM0RVdGw3NzZmYlJPQlV5QkRYVjFSUXUyZFNjUkJxQ1hMVm9raFFFOXlnQ2pTMndQVFhJLzNhTXZaUTdoSDhBSHVTQjJ6dkR5MW9BQUFBQUVsRlRrU3VRbUNDXCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvc2VhcmNoLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ3MVxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFOS1NVUkJWRGlOVlpOTGFGeFZBSWEvY3g4emVjNGtUaWJ2bGpaTWduMEZXelZLbXlheFFrMnpNdFN1dEZiUmpTQVZRUVFGRGNsR0VLMVVpbVRwQTZLRnBDNHNLSlRHcElRcTF2cm9pQ1hweEx5YWRES1RwRW1ZdVROMzdybm51Q2kyOFY5Ly9Qenc4d210TlZzek10QWRFK2lUSnJKVFkrd0RFS2k0anpXdUVWOGRmLytIeEZaZS9GY3dNdEJ0R0tqVGxtMzN0elRGU2l2cnQ1dWx0VHNCVFdZcHdjckNQLzdVOUd6V0xiaDlVdkhwQ3grTXFmc0ZJd1BkaG9XOEhJM1d0VFhVVkpYY3Z2WWQ3c1lxc2VNbnNDeUx1WkZ2Q0lRalJQZDJNVG0vN0NSVHFWOEt2dkgwSzJldUtnUEFRSjJPUm12YjloL3BLY2x0eEdrOHVKczlMNTZncUtLWVlFVXh6Uytmb3JiemNUeDVtNFBkUjBzaTRZbzIzeXU4QVNDRys1K0oyWlp4dmV2WWN5RWhmOFZlbWlLUVhnY2g4TGR2Qnd6TStSblE0TlhYNGpVMmsxOExjV0g0WWlibnl2MkdMNzJUc1IxTnBjSklZYzNHc1hMbFpEcytKbnY0SThTYWp4ZHFKM1BrTXpKZFo3RTJBMWd6ZnhHc1VPeHBxaStXc25ESzBJVjhaN2lxMmxTWmFZSXJkM0VlZXdzWjNjdXpydzN3ZmRIelhFNDMwZnZxTy9pUmg4aysrUzdCWkJybHBvaldSRXo4UXBlUmw2cTE3S0VhZkdlWjdNNW1WRm4xZzQvTW92OWQ3SmMza20zWmhjcXZFbzVVa25mbFBzdnpQTFNTc0pSSEpuT0krYlB3UkMvRFE1OGdObjlHQ0lQRFg1OERMd1UzTGlCdnBCQktJT29xOFR3cExPVVY0aHZKdVk3d2VnQTl0WVkycmlFQ0NXZ0pnV21paFFHcm82QWtUTjVGMzh5QUNMRGhMS0o4TDI0NUJUV2VYRmc0Rkk3dE1IVXVEWlZCZEoxQWVDNzRKZ2h4YjcveTBYVUc1R3lNU0FPSnlSay9tNU5qaGx1UVgxNzlMWjd6aXFyZ1FBT3FVVEEvdll6TTVkQ2VpL1pjcE9Nd2YzTUpYYXJna1NveVpRRisvQ1BodWdYdkMvUFNueXRybzBNZkZsYVN5KzI3V2cvWjJ0L0F0dkw4ZENuQnJmZ1NzMzhudVRPM1NteDNCRHNZUXVnNmhzNlBPdW0xOWI1ejQ5bUxRbXZOZTczYkRFdjRZOXZxYXgvdE9mWlVTVkdaZy9aV1VITHpuakIyT2NJSWtVMTduUC8yaWpOL0ovMjdLK2tZbkhEVWZabmU3cWsyQk9wTjA3VDcydyswRkRVMlZwdlIyaWhhK1N3dkxqRXpzK2hmdVo1d3BaUjlVbkZtY01KNUlOUFd2TjRWYWthcmwyeERkWG8rclFDMlNkeVZqQ25ONTRNVHpxMnQvTCtqRHBwZHJSMlJVd0FBQUFCSlJVNUVya0pnZ2c9PVwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3NoYW1lLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ3MlxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFNMVNVUkJWRGlOVFpOZlNKMTFHTWMvdi9jOXJ4NlBKNC9PSFQwNkxWcTI0V3FHRzNtek5SMWRwTHZZaW1UZE5BcnFNb3dJSW9nYUNoRzFXQkM3OENhb0ZndERTMnFEUlRTT1EyVFVyTldKOVdjeS8yenFPZjVMNS9FOXZ1L3ZYeGN1NXhlZWl3YytmQi80UG55RnRaYXRHdWhwYnhEWUV5NnExZUxzQlJDWWpDWXlaQkZubjMzbjR0aFdYdnh2TU5EVDdqaVlMcSt3K0c1c2RhYkVoTDVvNkhnWjE3Rk1YZndFdktoZGp0WVdWcjNFVzhydzhmUHZwYzJtd1VCUHV4TkIvWmhNMXJSczgxUXMva0NLNHNwU2hHdHh2Q0t3SHVIY01xdi8vTTNFSGV0bjUrWitDclh6NUV1blIwd0V3TUYwSlpPcGx1YkQ3VEV4ZllHaXlXRzQ3YUFhSDBXRUVkeS9ybU9OcG1MUGJtb1QrMkpEMzE1b3VaMWJlQlg0U1BSM1A5WGdSWnpSdG83T01tLzJPNHB5U3hRZWZ4MkEyTlZUeUpvbTVJNE9BRXArUG9XOHY1cTgyOGpYL2VmemhVQTFSN1NTSnhvYkdrdUZNNGVYbTZhdy8wM2tqZ01Bck1VcVVlVzdRRGdiaWVrdW90YytwUGl4M1R5eXM3YmtTbWJzQmNlRzY2Mko3Vld1eWQ4RXJkSGI5d0RRMlhtYzlQVWxoa2V1ME5sNUhBQ1Zhc1lXUnpIQkhNbnFTaGNkdGpucnlqVEZ0MVdqL1N6NUIrc3cwWW90VDlLQTJ0eXNWNEpmWDRWWlh5UlJXY0Y2b1BaR3BKUllvN0JhWTZ4RVRKeUIxRkg2djNnZnNYSUpZU1ZQbk8wRy8wOVkvQjZqQXpBQ3RFSktKU0pHaHBtVjdPU2hzdEp5VERnTC8xNUY1UDlnZkdLRndhOStCd0ZQUDVkbTUwTVZXQ1d4TWtTNENlWm5aakJhWmh3L05FUFpXN2UwVTFLRDFmSXVGRERZZDQycDhVV21iaTR5K09Vb1ZvWWJveVJDeEptY21OWnJCWlYyZ2xCOVB2SkxwaEFXNGpoRnlRMERGWUkxOTZLd0Zoc0dkNitYa3A4TEdCcTlFUVNoL016OTRiZUZwVXZuUGdnWHNybURqVTBIUEt0WHNESlBkWFdjYkc2TlJLS1lvOGNhS0MrTElOdzR3dFp3cnUrU1A3KzBmUExNME5wNVlhM2w3V2ZxbllqUTZmcmExUDRqSFlkajBiaVBsUXNZZFdlak1ONTlDS2VNdFhsSjN6ZVgvYW5aK1Y4RHhhSGVZZDlzbHVtTkkxV093THptdWw3M3dYMjdvblYxVlc0eWxjUWFUVzU2aHZIeGFYMTVkQ3hRU3AxVWh0Tzl3LzY5TW0zVksyMWxEMlBOaTU1aldxV21DY0J6eVFTS3RMRjgyanZzMzlqSy93ZndnYWlDWDhtWFl3QUFBQUJKUlU1RXJrSmdnZz09XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvc2hvY2tlZC5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0NzNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBSUNTVVJCVkRpTmZaSlBheFJCRU1WZno4Nk1tMlIzd1lzZ0huS1Y0S2NRRVMrZUJCVkV5RW04SllZRVF4WkNJcWpSUkVJdUtuaEtCUEVmZ29yZ3AvQnJySDhPNnM3T2RFOVhWWmVIbmV4dVlySU5SUjJLOSt0WGp6S3FpbkZ2ZTJkcmxZamFxcG9hWTN5U0pQZnZ6QzNlMjUvSFk5VUFpS2g5N2VyMVRxdlo0bTdXamQrOGZkMEdNQUNZNHh4czcyeXVFL0dLcXY3M2lUR0c0emg1c2pDL3VBeFZQYkllYnowc3M2eXJaZW5VT2F1RkxUVFBNKzFtZi9YbnIrLzZhUE1CcWVwd2hXZXpFNnQrZE5jekY5SWttVWRSNUdCbVNHQ3dDRUlRTkthYTJIYzJBSGlpOXVVck56dU5Sb3Q3dlc3OCtjT3JhVldGVkNLUlVIV0JCQm1zRXorZG5Wd25vaFZWalQrOTM1c2UzZlhGclpPWU9YOGJNNWVXRG9oRlJnRE10SHhqYmlkT0oxdFFWWWkzWUY5QXlLTDQ4d05mM2ozSDJZc0xrQ0FJWWVoaUFBZ2hwT2xFQTY3ekRleHprT3VCeWh4Y0ZxaWZPb2NnZEVpc1lPRWhBQUEwTUlRZDJOdXFDcEMzcVBrY0FJYmlFS0RheitRZ1FBaENEdUp0MVIyRUxNVDFBQUQxRTNWd0VDUlZCdFlXTU1id0FNQytBSHNIcHNvRk9iQjNvRElEQU96dTdSNCtKRityUlJzRGdGU2hDWTFBdkVYaytvQzdTeXZteUhNRkVBRUFsem1ZU3JCM0VDcjd4UTZCN0hHNllRWlJGUG5lNzA0YVQ1MkdKazNBNVVEYWd5bHpPSnZCR1BCWVFDMnFyWDM5K0hKTlZkUERRMlBnSTJNMnhnSCtBUStzazUwb28zQUpBQUFBQUVsRlRrU3VRbUNDXCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvc2hvcHBpbmcucG5nXG4gKiogbW9kdWxlIGlkID0gNDc0XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUE1SkpSRUZVT01zRndVMU1tM1VjQi9EdjczbW5UNSsyRkZiNktnZ3k2QllWMlRSQjBSQWxtWW1iQ1VhTk1SNDRtQjI5R0Qxb3pDQWU5T0NKN0xLREx5UWVUTlJzRVkwWllVYkZqVzNPZFRESG1BemFwZ1VLTFFWYTJqNTlYdjUvUHgrYW1KakFDYnFNTStjVzhNM0VTL0JhaUVvZWRVd21qRUlVaHdFQXpQM0w0VFJuMVJvWGF6SnRqazlld2N6a0VQN2hwMEF6azBNNGMyNEIweDg5NzFkSmZqMFdEVTJGdXJvOXdZNDIrS0tkSUVGQ3RiQ0I4bllaMittSDlWd3UrMTdUdFg0WS8vemF3Y3prRUFnQXBqOSt3UjlRMVM5NmUzcmVqZWxWcUpvTEZvMkI0bDBjZ2dUYXpCRTJOdUJZS2piTUFCNHNMMzVacmgrK1AvN1oxUU54K3ROVFVCMytUdkxZOFlsRW9BUzBISUlkYWVNZ1RxUnBCR1lUcTVYaEdBcm5icEg4Q29mYy9zUmdLWjkrZVByRngxSlNTOVdNZG9UOVU1R1lBaVlKVUxkTktKbGxZbTErTkhVRFJBS1V0VlVJeFgyeVF6NllNUVBSb0laU1BENjFsZC8rVllERVgyczcwdW9oY1FkcU5zMUpQWW44eUFYY0tTY2hMcVlnTEtad3A5U1AvTWdGUUg0UzZ0b3FCL0lJUlJNZVJkZkdCSUUxUjMwNkIzTnFrTXNWYWliZndOSmFBV2VubDlISWw5REk3ZURzOURLVzFncG9KdCtFdkZzbXg5cUR6eWRCQWgrVlhNY2VOZ3dOcnJuRmE0K0VTTnhOSWFBa01ORFpDdnVZQVVEQXdDMEJBWVZCTEtkUWZ6UUdWdHZqdXRGUEVJUmh5YkV0QW5NQTE0V3RhbkJxUHlOcEhNZjVEd0t3blRwQWhQTWZldEd3cjhJeVY4QlZEYkNiQUhQQm1BdHhiTkQvWEtqZDM2ZDViQUlZWE52QnRhOHZ3YTVYMFdKb2NPb20wamZ1NHQrZkxpT1c3QUJ4QjBRcTFXc2E4dG44ck5Rd3JibGk2ZkRWUUZDRzR4eHlVVlpwNksxbnNQRGRUZVNXc2dEbkFCR2VmWHNJSWpGdzIrYUNHcUJ5b1k1R3cvNU5zT3ZWSC9QcG5HazF2WURMaUZzMnFqdjc0SndoM2g5R0xCa0JaeTRxaFRLNGJRUE1KY2JEeUdmV3piMVM1YUw0VkxUanNGb3RGZzNkZDdvOTNBckhyQ0ExK3dBblhrNGkxTjJPWU1TSDluZ1FpM01yaUhZSEllcGR5S3cxOE1mMXU1LzhrdlhQaWZQciswaEVnb1ZhcWRDcnkwWmZleVNPdnFlamtCUVJ6TEU0Wnd5YTEwdTlKNCtDaVYxWVg2MWg5czliTitjM1BWL2xxa3BlUEJwV2NXVjNwQ0hLOWRWc0prZHNyemhvbVJvazB1SHhSa2dVMnFoUzVzaWtHN2o5OXoxOFA1KzVkS09nZjV1dGVtK0xacmxDQU5EYm1SQ0VjRUpYYkNmUjJWSjl2TmRmZTZWRHR3ZThzdE1ERHFyYThucWhMdDliT1RCK0w1aWUveXd1cEJXWmIyWHUzemYvQjBjWHNYY2VENXNEQUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3NodXQtbW91dGgucG5nXG4gKiogbW9kdWxlIGlkID0gNDc1XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQU13U1VSQlZEaU5WWk5MYUp4VkhNVi85MzUzSHBtWlRLWXhUMnVycmFudlJGTnRxRktTb2d1RElBaUpYUWdCaS9zc0JNRlZTb01yb1ZVc2dpRFloenMxQzR0SUVJeDlxVWxFcHhocUtnbFIwa3lUVEpMSlpDYnp6WHlQZTYrTDBwcWV6WjhEaHgvOE9SeGhyV1dueGtiN093UjJ5Q0hzczhoT0FJR1owYWpMRnZIbHdNajQvTTY4dUFzWUcrMlhFak9zSERtNk82bVNFU1hrM3Q0M0VRSnlWNzZpNWdjbVY2RVNHRHRpa0o4TWpJeWJlNEN4MFg2cENIOXNibTd2aVcwdUpBSi9pMmc2UmFLdGhZaFMxRlpXQ1VwbGhGV1VHeDUxTjRxYjB5SHFsWUdSY2FNQUpHYTR1Ym10cC92bDF4SmVlWko0YVFrUnFjUHNmd29oRmM0L3M5akFvNWJaalNNZlR2d3g4ZE9oOWEzeU1QQ3grT2JrcXgzUmlQTjdYLzlBMmlsT2tKak5FclkrQndoVVBvdXB5MkF5VDRDd3FLVkpxcy8yVU5PUGNPM2FWQ25ROW5rbHNFTUg5dTFQQ3BrbnVqaVBlK2c5L0k3WEFWREx2NkZibnNZNkNRQmljOThTdmZrNXVtc1ArMW96eWJuYmhTSHBFUFkxTkxVNlpuc0JIRVhZZGhDQXdjRmpYRm9JdURwNW5jSEJZd0Q0ZTNzeDhSU210a29xazNLMncrMCthWkdkeVYwdGFIZUY4b083TU9yL1dyVXBvazNwbmplT3hkM1RoUEVLSk5OcDhuNjFTNFhXWUUySTFScGhBNHJ6NytObEh1ZlVtV2ZZOE05aHBPVER6MTVnS1g4S1cvNlRlcTNKbURqR0JHd0VybFRGWUh1bXVMYllsNDVsS09sYkZERnN1dE5zcVlBZnBuTm9MRWNPcjFGdklqVG9DTm82eEdTUy9OcHRTbUZsUnE0RTNwWEZsVVV0NjlxcFdZK3E4YW5ZS2tWY09sNnM0NkdYSXF5Sk1rVmNLclpHMVhqVW5DZzNsbk02NTdtWFpkNTNMMXljdlY3MXZCUXkwbmpuSGFQQmFMQVdzSGV1TVZpakVUS09Xd2k1c0hERFd3MHE1NTJwWHpjSzV5OSs0TjlhWHo3Uzg5amhpRzhLaExvS0FwU1ZKTFdpWGl2cVE0Y0dteUlkdG5ObTRtZjMzM0x4eE5RWC9uY0tZTld2ZkxTWisvdU53dmVWZys4YzdVMDBKeHVKbXpYcTlUWmFXSlNNVTBjYXNhWDQ5T292MWIvVzg5bkFjdnErTVhVZlZ6SWllRGVtb2lmZmVySXIxdEhlNURRK2tNYmFrUHo2Qm5NcmVmMzF6WG5QRDRNVGdlVjA5bXhvN2dQY1ZmZHhkY0FSdkowUUhQVXNuUUF4d1l4cnVhUXQ1N0pudzdtZCtmOEFuYnlpbmJkSnZCMEFBQUFBU1VWT1JLNUNZSUk9XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvc2ljay5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0NzZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBTk9TVVJCVkRpTlhaSkxURnhsSE1WLzl6RThDek4wWm1CbXBGZ1FHcldsRFlsaVU2VlExRXFOQ3cxMlUxc2JVeGU2cVFzZmlTNGtaZU9tWW56RWRPY3I4WkVBMFZEVExteUVwaVhWRm1veVJpT1BHVjZaR1dZQWdjN3IzdnZkNzNPaHJlalpuTTAvditUOHo5R1VVbXpWVUg5UHM0WTZZU0E2RlhvcmdJYU11cGhqQ3UyTDNyY3Z6bXk5MTI0RGh2cDdkQjE1MnZSNHp1eHFhcTZzaVRRWWxhRkdRSkZOekxDeUdIT25adWR5bG0zMUNja0h4OThabFhjQVEvMDl1b200RkF5RzIrK3FDMVFzWFIvQjJsaWx1ZmNvcG1reVAvUTFKVjQvd1QxZC9MR3duRStsMHovYnJ2N29xWUZ4cVFQb3lOUEJZS2k5cmZ2SmlzSkdsUG9EOTdQNythT1UrY29wOVpYVDhzSkpRcDBQNG9nbER2UWNydkI3ZmUydVk3OENvQTJlZWFMWlkrb1RYVWVlcmRiRURUeUpLVW95NjZCcHVBME5nSTZ4RUFjRlRpU0VVOTlDY2EyYTRjSHoyWUlsMm5SWE9DZWFkelpWYW5vYWN5NktXYWdpZC9CZGNoMW4wZFpjbk9wSHlIWi9UTGJyZmN6TkVzejRyNVQ2Skx1Ykl1VkMyQ2QxWlJjN3ZZRmFRMlpuS1YzNWsvd0RyeUdDZTNqNjVYNHVsRDNIcFV3VHo3ejRKcTcvWG5MNzM2STBsVUZhYVlKMWZnUFg3dEtMUXU3ZHRyME9ONzlNcnJFRnVhMzIzNDZNc3Y5VTdGYlZrOXQxSDdLNGl0ZGZROUVTcmFiak9DZ3BVSzZMb3hmUlZzNURvSnZCTDk5RDI3eUdwdWwwZlBVUk9HbFkreEhIS0lDcmdTdHdIS0daMHJHakc2bjVnOVdWUHVaWGJhN1AzR0tqOFAzdG1memozd0lLYjRYTFE2RktkdFJJTW9rRTBuV2ladDZXWTZuRnhZZEhWZGk0R2JQWjBWREd2clpXd3BFd0FNbEVFb0J3SkV3cW1lS24zeVFOMjVlWW40dTZ1WUlZMVMxYmZINHh1aW9TMlNxT0hUOUdvVmhnZlgyZFpDSkpNcEVrSEFrVGpvUkpKcElvcFVEVHlhWXR4aWFtTGN0MlB0T1VVcnp4Nmt0ekhZLzEzTjNZdUpONGZJN3hxK1A0YTN6OFg5NXlsLzExcS93dy9GMCt0clRjOStGWS9xd0pZT09wRFFRQ0RBMlBjUGp4UXpoV25sUDc0a2l4K2ZjblBGVm9lalc1ak1NM2c1ZnpDOG5NVGNkbEFNQUVNQXhqWkhKeXNyZjdVSWN4T1hHRG9IbExMY2JSZ3FGN1VOSmxPWllnSHYvRnZUd3hZd2toK29SazROeVZ2THdEc0czNzlkaHNqT21wNmFkMEpjYnMzMGRuUDdtV2FYTmM5Z0o0REtLV1lGUXFQajEzSlQrOU5kWmZzbmFZWHNJTUdqNEFBQUFBU1VWT1JLNUNZSUk9XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvc2lsZW50LnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ3N1xuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFNa1NVUkJWRGlOWlpOTlRGeFZIRWZQdTI5bW1JSGhjL3BtZ0lCYWc5aHFRQUhEUXFsZ213Q2xpWW1wN2pScDZ0YTBNVEh1bE1ER3hFVk5qQXQyVmt5YUVJdkVCRDhTVThJZ2RNRkhxeGx0YktGUVFCQVlySzNPMTN2M3ZudGRFSkhJV1orYy9KTi9mcFl4aG9PTUR2WTJXSmczYkZTblFUUUJXT2lVVHlCcHNENC8rLzUzU3dkOTY5L0E2R0N2RU9nTGdXQndvUEh4aHBMSzJrZnNrdXFqZ0NHenVjVHUrckovNSs2OXJPdTUvVXJ6OGVzZlRPcjl3T2hncndpZ3JqbE9UWHRUUjNkeG9CS3NVQjRyQ0FTTFFJY2diNUZmM1dZdWVTMjN0Yk16Ni9uaTFKdVhydXNBZ0VCZmNKenE5cGFUZmNYTE04T3N6Y3lpUE1VejUxN0R5eFg0OVl1dnNXeEJRMDhYei9kMkZ5ZS9HbS8vYlh2M0l2Q1JkWFdncHlFWUVBdGRwMTh0eTJ4UE1QZnBLRzNuWDhiM0JkS1YyS0Vpd2xYbHFHeUcrYUVSVHJ4ekhncHh2cnc2bnNtN3FzVStlK0xSaThjYUdrK1ZKMnhCWVJIbnFjY29yMDlRSEsraXJEWkJTWFdNb21nUjRkSXdsZlZIQ0VjTW9kSUt6SU9zdmJhVi9qdGd2RUpuK1pHNHJUUExpSUJGcVZNS1NqTHh6U3pKYjFNQWRKNTVscE5ubXFpb2k2SGRITnJkd1VuRWJINjgxUlVvS04wY3JVcmcvemtQUW9HditPWEdDbVBETS91dkdyczhSU0llNGZqVGNmQWxXdjVCZWF5ZWdxdWFoSlFTb3hYRzk4RlhHQ1dabjduTC81bjc0UTVHZVJnbFFlKzVVaXBMYU9tbEhtNnRJb0lWR0Y5aGxNZnRXOXVIQXJkLzNzUklGeU05c01La056ZlJ2a3lKbktlVFcrdnJ2b2pVWUh5SlVaTEdKMk9IQW8zSEhJemN1OEN5b3F6ZTIvQ3plVFVwWEU4Tlg3K1J5bnY1S0NMa1lKU2t0U1YrS05EV21zQklEOHN1SWJQamtseFlkRjFQZm1aLy85UHUvWWtySDNxN1c5c2R4NXRmQ0JyL0liRUtUVGdTWWllZEl4SUowTjF6bE9kYUhTdzdpbVZxdURJeWtVdmZmOUQvU1RJN2JobGplTytWZWhHdy9NbjYydXEydnRNdkZZZWpPWXpjUmF1LzlnWVRMTVVTWldUVGtwR3hxZHphNyttYnJ1TEZvZW1jM2gvVHUzMXhZYUhmdHUzZ1FFZHJZN2l1TG00NzFRNUcrMnh2YkxLeXN1RlBMU3k1U3FsK3BiazBOSjM3YjB3SGVhdXI3QW1NUGhjVXVsUDZOQU1FYlZLdVlsSWJMZzlONXhZUCt2OEFZS0dRRUtLVzF3UUFBQUFBU1VWT1JLNUNZSUk9XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvc2xlZXB5LnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ3OFxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQVhOU1IwSUFyczRjNlFBQUFBWmlTMGRFQVA4QS93RC9vTDJua3dBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBNEZKUkVGVU9Nc3R3VXRzVkZVY0IrRGYvOXc3ZDE0ZFpxYTFMYWdkZ1VLbCtFaWhHSXNDRnBCSFJBd21HbmFHcFFadE5Mb3lSc2FOY2F1SnhrUkQxQlEzZGtHS0JTc3hmV2hCRnJSSXNDbTFXTzIwblRLZGRoNTM1ajdPdWVjY04zNGY0WDhEMmFONEpmc3pQdXM3Z25UTWo0ZTBpSUpnUVNNSUtPUXVkSDNTTkhwdGJzaTE3WjBhZ0pJS2lWVDZjOHBtcytpbVladzhkeDNmdnJlM29TRVc2WHVnc1hsL1BKbnVadEVOemNxdjE3M1M2dFNzazFvcGJqbHo0dENlSGRGRXlFTnh6Y1pIMzl5d3piMDBpR1BuSnZIOUI4LzF4cXp3RjN1ZVBkeVplS1FWb2JpR0VUV2hsQmtYTmI2dlk3bWt6NDlmRnorVW5lQ05rNDhaNXk5UHU2V3ljOXpvSDgzand2djduM3FvWmVQQWdaZGUzUkpKcjJ1d0hNZ1FwSTBBUUIyRWRTelZKUTNOYkRQZVBiMmJmWDNwRGszY1dnaHhuNWRZZjE5UHBDbVp5ajd4VE84bVhoL1hvdjQzUVNwU2lrTnpCNXE3VUlLalhxc0FBSXB1R0tlZTc4YVhINTZHWmVDRUdXOUpIMnhyMy9tQ0VkeUdVbVZpTEFFVmNCamNnMVlhZ0FZQ2dZNW1EMmQ3UmxHZXVnTFBleERqRXpPWDRIVzhiVnFHZVRTVjBGRHVDbUF4a0JSZ3dvY2lCcVlrQUVBSEFreHhiRTA3a05FYWxJckF5cTJsdDBXR1ZrM0djQ3dXTnlCZFQxTVFKcGdDV3Brd0ZFUEFKUXdHUUVvdzZVTUVBbEFCbUN6RGlsaTdHWGVpVElQYVRBUFF3aWRJZ2F1VEhQbUNpeXRqQlZqazQ2ZVJaZGdWQjhQWHlqQTBCNFFBcEFzTnhManZtMHh5NTQ3bnVJQW1qVUFnbC9meCtzZDNrY3Y3TUFJWHVieVBsOSs1aVZ6ZUIwa09yUUlvYVVEVXEwVWRjRzc2cmhpMkszN1BCb3RJeVFCbmVobk92cGdCVndibWIrZncycUVVM2p5MUE2N0Q0WHNjRUZ3SENGT3BXSnFzZWR4bDlWcHRjR1c1Q0lxMEFjS0Y1QUxWaWdldjdtSm0xb0ZidGxFdE8rQ2VEM0FQaHRWSTY3bVNYaW1zL3JxMFpEdkdnVWNUaGNwYUlaM1ozUFcwWmJsYTh3cUJDS1NCVENZS004UUFLYUVsQjJPV0p0NUtGeStPelArK0dIL3JxNG1pYlF6L3NhWTcyMUtMNWVWN3ZROW5kalZIR3FJZ1dRZWd0SllCUVd2TmlJZ29Ec2R1cEI4SHg1d2J5K2FuL1V1N3hvNXNEd3ZqNEpPdHVERFdzMjRsNzgvbjd2N1pFcEswMVRBYllZV1NGSWsxUWZnUldsK1YrR3UyZ3N1L1RNMlBMSVMvKzYyeWVhRFRLaGJuN3Y4VEVBQTh2cjJkdWFtTmlaVHkyanVUMVgyWkJEL2NHaGRkWVNZM0NVV1ZnaE9hWHJSRE42ZXJ5UWs3Q005UkdQL3E0bXAxZXU2ZStnOTJtZU5XNWtKTHp3QUFBQUJKUlU1RXJrSmdnZz09XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvc2xlZXBpbmcucG5nXG4gKiogbW9kdWxlIGlkID0gNDc5XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQXJKSlJFRlVPTXVWazFsSVZHRVlodDl6Zm1kR25jNmtUaU5wSmxhYUdTV1JsaEdGa1JRV0VoUkJaSlFsa2pjVkNHRkZFRm5SUmRwQ0VyUkFOM1VYQ1cyaTBiNklTNWtrUTdsVmdvNFpPamJqekp3NXkvOS9YWmlKRjRxOTF5L1A5NzNmQWt3anFrcE1vYXJFbE9rOEVkTUNKSDRlRWdqQW52OENVRlVpTU9wMW1NbHBXU0NBVHZzY1psU00zM0xzSjJZc1VXRmJiWFJXazk1eGxYaUZkZFZVUG5sS3dMelU0MXl4d0ZSa2hPWXNQRFpsQkZHVnNFdUNkQUo2MklBWkJpZUNvWnVtRWJzb3g1QUdBVkpoeHFScy8zN2thd01uTUlNREpxd2tMRFlMNTNSaHJGcGw3Rm50ZldsQU45cElNejZKc040b1F2NEhOTlM1anJ6ZmRndlZkNGMwOVNIcDJsTXlqUmJ5MUJVRm0wdmxTZ0NReGxzSm5KMmRiV2VzUlR0OEYrSFJMaklOanlTTEVVQjRJZmd3R0dNVTdTcVNPcW9yZllGZWQvN2FtN3h4RWdBQWVrcWpvcXpKY1YrZEpaZVNRK3BIeU9TRE1Od0FnTWhaZS9INTRpblB1eGJ2MHZJM2hpOCtmeU8yMnBTSklYNHBjMkRSRFZVTk0xdVBFQ1lBZ2pEY2tHVG4zOTBHRVpSdGcrVURXNXpMczljc2p2c1ZUUG93UEtTd2NjQzFSZzNOKzdIQW5yN3lTbFRHRWpER1lKSFhRV1pwWU5Zd0JQVkNIYkFscUQvYVAvZWJzYnJFVFhDUWYxS0VuL1VIS1Rabkc1amRpZDRuMVdpdGZmM0M0SVRNdkRVYk0zWVdnMnZBOVlLQ3BzcmdoaDJLNFIxT1NKcXZNUUI0VkJpQm9qUXgxNVprTDdUR1pTaHZ6eFQzMWRhM1h6N1RzZnoyMDM3WE0rRisxVFgwNnY2U3VVdHpaanRjSVlXM05keDczdXJ4ZEhaMlRRenhjU0Vyc1RsamJuRmlPTmNVbitmUkhjUDJTT0VYSlBrSFI4RlhLRjduMGRVajNhTmhIVC82dFd2bGZia25LZEF4RWFIdVVEeGRhSGFsZEllY2hqSXJISkM5WHJWOVdhYUptaHI2bHpHOVRJN1cyaUpyQ3R6Qi9Mb3NWNDdydHc4QThQSkF4TmhWUjZSS216Zmx6dWhYOXExUGt1R014eDkvckVSd285NVhhQUFBQUFCSlJVNUVya0pnZ2c9PVwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3N0YXIucG5nXG4gKiogbW9kdWxlIGlkID0gNDgwXG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQUFsd1NGbHpBQUFMRXdBQUN4TUJBSnFjR0FBQUE1dEpSRUZVT01zMTBzOVAyM1VjeC9IWCsvdnB0KzIzM3kvOVBUcVFkaFJvS0w4a0NsSURha3kyekhDUXVIbGdpd2QxQnoxNDhhQkdveGNQaHFrSDR0VEV1Qmt2aE9vU1RReHo4Y0RVbUlFVWhvQTRjV3hRZnE3cGJDbUY5ZHQrKy8zeDhhQStUNDgvNEVuZmpQVEI1VzdFNEN1WDhkVjd2WklzQmJ0VmUraTFkNlgrWnk5WWsxeGtGZ3pkT0RSTS9rTlpWVWRMbXJyMDNOdlRaZndYL1kreGR4NXFDUjJMZlJKdWJIN3E5RllqQUNEMTVCM3VZaVlNUTZSU3ljTGRyUUkyTjdPVGw4dFBmMGkrNE9MVy9NUTlBb0RQUGpqVDB4MzJKcHVhM2JIYWVzWXQvUkFDTTJGVkRPS2N3T3dXQjNGQWNHTjNXNk9UZjNVREFQcXNrSWZPWGJnWW1aR3R6VTlEYWZSRTl2aFBjNXhXdG1YdXNGblUzM0VBQUppKzZZWm1DTHd0WEtJVGZjUXplWkYrWGNqUDdKWFVFN2FUMWU4Ylp1UkI5RVRMU0Y1bGRPckZFUXdGUEFRQWZ5d3RBd0JlZmFZTEFPanZmQkZqWDc1Rkw1MW1YQzNZSDEyOWxlMWlMNStLZjN6K2NSYWZtVnZqOFlFM0tSb05vMXF0SXBmTG9iRXBDbC9BaDN3K0Q2ZlRDVVdXNEZBYStmTHNkK2hvRGRIdVRxRldFQmlPaXc0ZEczZE50TVNpNEp3ak5adkNtYlBEbUpxNmptUXlpUmZPUFkvMTlEb0FvQ1VXcGEyTWpwb2FBaE9zNHdLekNUSVk1MjErUnZNTGl5QWlPT3gyT0NVSmlxeEFVUlJJa2d1aVRRUUF6Qzhzb3MzSENJeHpnYmhMZ0duQk1pMGtJZ3BXeDBlUlhsOURXN3dENDJQak1DdjdpTlQ1Y09uekx4QUlCcEZlWDhQcStDZ1NFUVdXQ1ZpbUJadGUxVXFHVGdwdmtQaHdRcWNiRjkvQU5Ibmc4RE4wZG1vQWdHdVhrdEQyVElSUnhIQkNSUFVCaVpQR1NkZU5razJybWorVzdsdERMZ2x3Sm56OGlTNkRVRFlBTjZBTEVnQWdIcmFBQXc1SWZsaXlqZXNWRThWOUhacW1YN09WMWNySTVucHVxTE9yRnFuVUptVnpCbVJKd01CanRXRDgzMUhMbkhCOXFZQ1NhaUYweEVhOXZSR2V2ck9GKzJyNVBEdnhpRGV2VmZRK3ZTbzBoeHNVM3Q1UlE5dGJLdllMRmJpOUlxb1ZFNm5aSEdSWjVBUDlRWklrTzcrOWtxUGxsWjFmbGpiTWo5aVZxYXpSR3BKK0UyM0NZSDI5MytmeDFmQWpBUUhwRFpVeU8yVmtzbVVjRFRsNVIzc043SFlSKzN0Vm1rNXRaSzZraXE5UDNQU3Vzb2RqUG56OWMwT2VpZm5sL1h6eFFjRXc2dndCUDhWYkEyaHU4ZkNtcUJlQmdFSUhoMFRMYzJ2MDdlVDJyYXMzU3UvL1dmQlBlWkUvSUFDSUhRc0xGVi9ZRlpiMTV2YWpacUt0RG1lREhxRlBjUW91Y09Dd1lxblpQWE4rY1pjbTF1NngzNHNhdSsxMDhNekd5a3JsSDJwTm5mcmdDanJRQUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3N0cmVzc2VkLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ4MVxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFKTFNVUkJWRGlOdFpMZlM1TmhGTWMvejk1WDNlYVB1ZW1jTWtzWElsNUlrREdJb0tJSXBJZ0lJWWdZNFlVTmpMcm9GLzROM2RSZHdwQWcyVjJCU0tHSlpXYVI0a2d0NnFKRXJiUlNNMm56ZFZwN24rZnBKb1hRNnNvRDUrYkwrWDRQblBPQnJheElPT3FNaEtQT2Y4Mkl2eGdOSVVTVFlSalhBS1NVTFZycnRuZ2lKdjhiRUFsSGo1cW1jYk9xSnVRL2ZIeWZHNkMzY3lBOThmYjlWOXVXNStLSldOZW1BWkZ3ZEZlV2FiWVdCWHkxUnhvTzVoWjY4cGtkL3dKQWFWVXBpOTlUOUhUMEx5L01MNzYyYmRrY1Q4UkdBVVFrSEMwM1RmTzZ5KzA4Vm4vaWdMTWlGQlR6azNPa0ZsSW9wZFk3MTVlUFAxVEN4NmxQdXYvQjRPcHErc2Q5S2VVbDBiaW5lZERqelErZk9YL1NzRmN5VEkxTkltMkpVaHFwRkVxdmhXZzBtc3FkSVl3Y2s0NzJMcm1VWEU0WXRXVjFQVUtveXlORGIxWTh2b0tzOHVvZ2FXc0ZLN1ZNeHJiNW1iSEpaR3hjSGhmQm1tM01mSmlscDZOL0pXMnRkaXFsbWdUQTdTdTNkTytUb1RyRGNJeDRpNzNzUGJTYlhMZUw2ZkVabEZLVTdTakRzdElNUHgwaitTMkZVcXB1N1FZT2dIZWZ4NGtuWXFOU0tud2xIcnJ2OWpId2NCaHZzQWh2c0lqbmoxL1FkKzhaeFNWZWxGS3NtUUZNZ0VwL2FQMHRCWVY1K0FNK3JLUkY5NTFIQU9UbXVmRUhmSGg4K1J1WU1RRmVUcno2UTh6SnpzTHRkeElJK0FEUUdwU1NDTEdST3hPZ3RDRDRtd3BoS1Z2bFZWUnZKOXMwTVJ3T0FLVFcyTFpOTXJtRUVNTDZBNlFMOVZlMXMwaVFsWEV6TXoxM1ZtdDFReXVkdDJFVklCekNFc0p4c1gyb3RXMWRiQWlmMHJHV05uMTZmNlBlekxUbDlRdjlSQUdsWUdrRVdRQUFBQUJKUlU1RXJrSmdnZz09XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvc3R1ZHlpbmcucG5nXG4gKiogbW9kdWxlIGlkID0gNDgyXG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQUtoU1VSQlZEaU5mZEZkU0pOUkdBZncvM1BlZDI1dTZqSlRVMXRzUzUySUxsTkw4Q0trajVzTXdqNFVzWXRsZHhaNEZ4cFlGRjBZWFZka0Yxb0VFU0pDSVdUU0Z4R0ZhTnFIWGhpNjZic1VsNXFicjc3YjJNN3BvaFEzeXYvVmVlRHc0OC96a0JBQ205UHJzdW1ZUkplSk1SZVA4RjFNWmw0UjVmYzVGemRydXR4UnhJVTJBNzB1bTA2UzJXQ0d3K25JTzF5YmFNb3FnUHJqS3laZWRxOHRmQi8vRm8zd3luaUV4UXlNcm1UbUYrYnZyV3RPbEJHQTVobUFqcTJpNU13RjR3NTdYaEdUcUdYTEJ0ZFBGZnA2WnBMVDR6K3Q1K1R1bGJtclBlUFovMjNnVE5GUzMzVTJiOHl2YmgzZGVMKys2OEplY3pBMUhwVmpOSWw1VjJaR3JBTTN5c0ZEZmtSVzU5RGZsZytXWUlLcWZJRWswVXc4RU5OQWNQRm9hdkNqSmhrekFKSVJYZk1CSURDOUdWUERJeHJuNHVHV1FLdlBOVHptQ2VsSG53OGdHR1NRMDV3SWhtU01ETHpIbUlLRVMvT05uK0tCalNYYXF0c2JrazJHamlPVmhVWTI4Z0FWaWVPUWduNUVER1o4MElxd25Ic2FnNk9UcTJ2QjhEbDNYMHQzVEFOYmRYc3FZK3pPc1VQN2pKTnpLNkNTQml5VU51SGFXRG9XUzVzZ2w5Umpka25EZ2RJQ0UyUFVZYXR1VDRrQmlLaXR5R0hSQzZiRGNrQkZWYmtkaXVJRkFDaUtGMVhsZGdRQ0tnUmpzRnAyR29pb05YWUhSTWNkOWl5OVp6NkF0UlVWRmNVV1RDc0tBR0JhVVZCUmJFRkkwK0QxcWJCa3B4bEFkQ0lXRU1LYWJOUmpjVmtEa3hpVy9CcVV2NENpS0ZqeWF5QWlxRm9ZeVVrR1FBaGJmQVAzNHJJS2E2WUpLV1l6dXA0Tm9iNnVGZ0JRWDFlTHpxZEQwQnVUc0NkbkczNzVWd0dpaVhWQS9uTi8zdHovOW5OUG5qMG5JV043a3Z4bTJJTVh0eHV4djZ3TXhjVk9IRHgvRDdtNUZ2ejBMWVRkMC9OaHdmbkZmNTJ4Z0lqT2dxZ0dRbVFBTUNYb21KNXpoQ0pScm9Kb1ZuRHhCQkNQM1gwdG5uWGdONXJSRmN3TXkvZ2xBQUFBQUVsRlRrU3VRbUNDXCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvc3VpdC5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0ODNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUFYTlNSMElBcnM0YzZRQUFBQVppUzBkRUFQOEEvd0Qvb0wybmt3QUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUFkMFNVMUZCOWdIRUFzeEdYN2ovLzRBQUFNWFNVUkJWRGpMZFpOZmFGdGxBTVYvMzNkdmJwS2JKa3ZTcG4vUzFEYU4yQTA3QjhYTk1jY0VOLzlnTmdSbCtGb1JCZ1UzOGExNzBSY2ZJaWdLUTMyUTRjTUVoZm9pV0FZcWM0bzRIVHBrdXJsdXFXSHQydG8xTVVtVDNEKzV5ZjE4Y09yUWVaNFBoL003Y0lSU2l0dVZ6UmVpd0pOQ3lpTW90UjJFaDZDbWZQOEU4RjVwZnJaNXUxLzhPMkQ4NEtzTHZjbll5T1RFU0hpZ040WVEwTEljZmltdTJZdlhmM09WVW8rVjVtZlAvK1dYL0ZkelppaEFLaG5qcTRzcmZQN2ROWDYrZXAzeGRFLzR3WjBUY1NIRUY5bDg0ZEgvRFZCS3ZiSzhXbW02YmhzekdBQTlpS2ZGdUZCcW9Qa09EKys5ejVSU3ptWHpoY0U3SXR6Q2VIdkh2ZGtaR1FneEV6b09Sb0xqeFJsU0lZdiszZ1NXUytmN2k3K2VVOHAvNkU0SUNDRXlJU1BnQncyTmlkMkh5UXlsbUV4Wm5IcDZpVXExU201MFFJL0h6Q21FT1BaM2cyeStZQUQ3ZFYyYmpVWkM5eDg4TUdWZUtsVTRQTDdJSStPL0ExQTR2NVV2aXpDVWpKQko5WEQ2ekErV25zMFg4a0ZEUDZKcDhrQzZQOUhaUHBHSkRnMGt4Y3pvSjVEN3A5VkxaOGU0V3RYeHV5N3JWWXVSZ1JoMzV6S0cyRFA5enViK1BkdWlZOE45Mk8wdWl6ZXFyTmRhZUo1UHVXNnpiN2pNaTZtUE9MTWU0Y1JQazVqRE8ybmFIZ3JGQTlzR2tTOGZQUlROamFWWnF6cGNXYXBRYmpoWVRwZW03ZkhDVkpHanUxWTUrZTBLKzNidklMZjZKckoybVpiallUa2RsamVheVBKbW01YmJwbEhiUUhSZHdrWUFLY0dzbm1QdnFNVUg3Ny9MWkh3TmdLR29SNkwwRnR6YXJiaFVSaW9VNFlCZzlLNFIwb1A5UkUwRGMrMDBtWTFUQUV4dFRlTUx5V3R2dk01U2F3c0w4V25hVmhYbGQvR2NKdnBHcFlhUU9xNm5hTmdlelVzZmttNThTdjZwWnlpV1Z0aXdnbnoybzA4dFBNWGkyRFFkRlVCNk5zcnZJRFFkdlY1djRYa093WjRrbmwybGUva2tUengzRElURzJhKy80ZHJDQXJYUloxazJkaEVMNitoU1lYc2g2dlVhVWd1Z2Q2U0JGZzVpdXg1dFh3ZWhNLy94SEp2MUtqY1RqM1B6bnVleFhZOU9vNExiMGpEQ1c0aEZBc1NqWVpwdERYMno2UkkxZ3dRMGlSazI2ZWJuV0w2eHdQcEFIS2NOcnROR0FVWWsrZWRYZ0hLNVRGOWZIMXFud3g5WkFsRU1ONm5WVWdBQUFBQkpSVTVFcmtKZ2dnPT1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS9zdXJmaW5nLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ4NFxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFOQlNVUkJWRGlOVlpOTFRGeGxBSVcvLzc5M2hzTEFNRElNRERBQ1JjQXFmUVNqeEVCVENFYUtYYml3RWpmV2F0eTRNRFdOeG9VTENTVEdqV0xVVFZkSzY2WXg0RUtiK0VxMWtLWTFXdFJrdXJIbE1ieWZ3Nk5oSHZmZS8vNi9DNnloWjMzeW5aT2NIR0dNWWI5R0Izc2JCZWFNaGVvMHlDTUFBcDMwc2NjTTRxdlQ3Lzh3dWQ4djdnTkdCM3VsUkorekE0R0I1b2JHMEVQVnRWWW9maEF3N0M1TnNqRS83ZCtaU21VYzErbFhtczllL3ZDYS9oOHdPdGdyYmRUVldLeXFyYWF5dkdqaGorOXdkdEkwbnU3RHRtMW1SeThUTEkwU085ekZQM09yMlpXMXRkOWRYejd6K3RBTkxRRWsrbHdzRm05cjdUNVZsTnRKa21oL25KWlgramdRS2FRZ1VralRhMmVKZHo2RnB4Wm83KzBwaXBaRzJuelBmUXRBakF5Y2JBelljcUxydVJmRFF0MGlzSFNINFBvMkNJRmZXd3RJckxrWk1PQlZ4L0VTVGVRM3czd3pjbVUzNTZoVzZTdnZUR045UTBqSU5leFVFanRYUXViRXgvUU1DOFp2Ym5OMU9rSFBwUUM3WFo5aTN3dGl6OXltSUtKcGFhZ3VWTW85SzQyYjd5d3RyN0QwN2hRRkcxdGtuM3dIRlR1TUNaYVFQZllHWGswM3hpN0NqeDRpOC9SN0ZLeXNvNTAxWXBWUkM5L3Rzdk5LSHkwdXE4VGZ1a1htWUJPNnVBS0FrWkd2Z2IyRmpuZTBBK0NYSk1nMFA0Yk9weW1OUGt6ZVVVZHN6L013V21GOEgwL21FUnRYb0x3YmhFRGMrdzBoSkNiY3NUZjY1cTk0Vmc1OEFiN0M4NVN3dGVjbWQxWm1UNFJERWJTN0RLcy9JVGJIRVhZQUxBc2pKS1IvQWEwd3lzTjRMc0lxWlgxcENlMTdTVHZyNnJHVitmbU9TR3VONWVmbVFFbEFrTm5Kc2p5M3pmSnNtdVZVbWtnMHhMTjl4ekRLUTlyRnpLYVNmaWFucnRtT3F5N2QrRE41dnVIUW84VldNSWIyMHZ3OGVwdWR6Unp4dWpLcTZzcG9iYThqVkJ6OEx6M0U3cHJEMk1SZHgzRzlpOElZd3djdjFiOWRWMU0xK1B3TEo0dFU1bSswdDRtd2JKQjdiY0NBMFFpckJHR3FHTDc0WTNaNlliWC84N0hzUnhJZzcvcWZUS1ZtSjBZdWY1dDExU1BZSlMzSVFCU01CVVlpN0FpeW9KN3NWcGd2dnZ3K20xcGMvY3Z6R1hyZ1RPK2VxcEFDZmQ2eUFnUEhuMmcra0VoVVdMRjRES045VmhlWG1KbFo5TWNuSmgybFZML1NERjI0bnRVUEFPN3J6YTV3RTBhL0dwQzYwL001Q2hDd1NEcUthOW93Zk9GNjl1NSsvNzgxTm8zT2R0ZThwd0FBQUFCSlJVNUVya0pnZ2c9PVwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3RoaW5raW5nLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ4NVxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQVhOU1IwSUFyczRjNlFBQUFBWmlTMGRFQVA4QS93RC9vTDJua3dBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQWQwU1UxRkI5b0ZEUklkSGNZenRaOEFBQUFaZEVWWWRFTnZiVzFsYm5RQVEzSmxZWFJsWkNCM2FYUm9JRWRKVFZCWGdRNFhBQUFDK1VsRVFWUTR5MzFSejJzVGFSaCt2cG52eTh3M21XUnNhc2Jhak81Z2w2NWlRZXRCcXE1V1JWUThLWjVXVWRnaS9RZVV4Y01lRmcrZXJJZ0hEMFdLWjBId3R3aTdDcnVJdGJ1SWFLRnFtOFkwcWFuNTBjNmt6U1NaeVdUMklCWFI2SE43SDE2ZTkzbWVsK0F6REE0T2lvUUcyK054L1d5eFVEaWs2L3BmK1dKaHFPa0dmdzRQRDN0b0FUSXdNQ0JRU2V4RmdBTkFvQm1HY1hCTDc1WWVXWllGeDNHQzhmSHhaRHFkdmdnU1JJT0FlQUJ1TjF3L09USXlFZ0FBbFdTMko2N0hMM2QzZDNkUmtiSklKRXBDSVVaODM0ZHQyNFF4dG80STVJcGhySzFIb3hFL204MGV0eTM3S0lCM0FFQitPM3ZtNzEwNyszZUVRbFRJenM2aVhDNGpIQTZEVVliUlo2UFkzYjhIc1ZnYnF0VXFrc2trYXZXNm44bGtyamViL3U5ZTNVOVJlN0c2VTFYRGNCd0hZMk5qbjdLWnBvbitYZjF3M1RvV0Z4ZWg2em9ZWTNpZmV5OXFtbllrazVscEw1VktaNmhUcWFTWGxpcHI3OTY3UTB6VGhHbWFvS0tJY0ZoRmRqWUR6L1hBT1lmak9LaldxZ2lDQUVZaUlSdUp4TjZubzAvL0VGZXU2bEFGUWVqanNrelhyLytKTEN3c1FGRVVVQ29pWDhqRDh6d1FRdUI1TG16YlFxMVdnNnFxNk9qb0VDWmV2MWtqYWl2akU4VlNDVnhpbTAzVGxHcTFLa0loQ1FCZzJSWmMxMFdsVW9GZHR1RjVIeitwaGxWd3pqSDIzM05Ibkp2Tk9xbXBxVWQ5MjdZV0dHUDc0bkdkTnYwbWFUUWFJQVNRSkJtY2MzRE9JVWtTUWl3RXpzT1llRDFaZi83aTVWV3lYTnJKa3llaVJkdTJsNjk4RDExZFB5Nmswek8zNWo3a3o5RmwwckxzTWdnaUFpR2RHOXRTUGJzNzM5NW83enZrbDBidmkvOWtWcDk2T05uNTcvSnVjZDd5Q0JIbUhDcFk1RXYxbTZmUkxvaGlzV2YvM2tZaDlhNVNTS1dQTmVydS9jTkRyZDBJclVpdVJSNERBVDVNVG10Qk14QUJrRy9GK1VxQXhXU0h5dXhWTTJoV2YvNzFsMXFic2ZxMnFyY2RmWEJlWWEwRXhNK0hCME9LSEkzcis0eU5HL29rVlpuT1RVMCtNWHMzNVFrVFlwNWZ6MTY3dXpUM3BjQ25FbTllQUZGaUdvOGxPalBLaXVpbFhHcktLdVptU3ZJSzlRY2xwbkZyUGpmZnlzSC9YSnM5NkJQTEdFWUFBQUFBU1VWT1JLNUNZSUk9XCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvdGh1bmRlci5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0ODZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBTmRTVVJCVkRpTlZaTkxhRnhsQUViUGZVeG1Na2ttazA3dlpNeExNMHhlcG9sRWJaQTJUV0lGbTJhanBXYWx0WXB1QktrVXBHQkZRK0pDRUsxVVNnMnVmRUNya0xRTEN4V2xKU21oUWpXS25ZcDlKQ2FaTk05SjBxYk02ODY5Ly8rN0VOdDQxaDluODNFMHBSU2JHUm5zaVdtb0F3WnVsMEp2QWRDUWNZRTVwdEMrMmYvK0Q1T2I5OXAvZ3BIQkhsMUhIakk5bm9INmFLeW9yS0xHS0lyVUFvclV3aVNyYzMrTG0xTXphVHR2OTd1U3oxNzZjRlRlRjR3TTl1Z203Z1hMZXFpOXNueXIvL1l2MzJOdnJCSGIzNGRwbXN5T2ZFdEJhUWhyV3pjM0VzdVpwWldWSzNtaFAvUGFzY3RTQjlDUmh5d3IwdDYydTllZjNZaFR0ZU5SbWwvdXd4Y3N4QnNzcE83VmcwUzZ0dU80dDluUjg2dy9WQnBzRjA3K0xRQnRlR0JQekdQcUU5MTdYd2hvN3E5NEZtNVNrTHdMbW9hb3FRRjBqTVEwS0hBcUlqaFZkZVRXQTV3WlBwZksybTZiTGx6blFPeVJhSkdtcjJET3hER3pKYVE3UHlHOTYyTzBkWUVUNkNDMSt5U3A3dU9ZOXdvd3A2L2hEVXFhb3hXRnJwcy9xS3Q4cnF0MGE5aVFxU204cTNmSVBQazJycldONTk4WTVMenZSUzRrbyt4Ny9SMUVxSkgwVTBmeExpV1I5Z3BXZWNoQTVMdjFuQ3RiaTdlVUl6TExwR3Zya01YaEJ4OFp2djlkTEVxcVNOYzNJWE5ybEliS3lObHVpKzQ0RGtxNktDRnc5RFRYenJ5THlpVVlQdlVwdXhvVzZXeGNadVQwQ1hDV1dienlCWTZSQlNsQXVEaU9xNW5TeWNjM2xtWTdBMFZCWkg0UlBYT2RjMGQ3YU5vZXBiSStnbEl3Ty9FNWYvNTRuY1p3Q0t1dkhqTmtrVnhZUUFvbmJtYnljbXhwYm01bnNLM1NFTmtFRFMxaC9NVmVwbThzOHZQNXF4aWF6cGEvTWp4V1ZFdlptby9rQjFlcE9QNGNzek54a2M2Nm82YWRkNysrL0Z2OGNMU3hvZGdvc0pET0d0VzFwZFRFUXFBM2c2YVJ2ampQblpOVGFBL1hvdnU5cEZac3hpWnUyWGJlK2NyNDZZL1Y5WXVuUHNxdkxpMTNOTFh1OUNpeGdYSlNvQlFvQ1VMZ3FTbEVMOUd3RTJ1RWoremg5Tm14VEhMOWJ2K0pzZlE1VFNuRmUvdXFkVk1UbzlVVmtTZDY5ejd0OXhWblVNNHEwcjMzYnpDZUVqUTlRRHJwOE4zWlM1bkVZdkozMjZWemFEd2o3OGQwcERlc2E4akRodUVaNkhpODNsZFZGVGFzaUlXU2d1WDVCYWFuNThXbGlVbmJkZDErVjNKc2FEenpJS2JOdk5rZHFFUEpWenk2N0hJRXJRQWVnN2p0TWlvVlh3Nk5aMjV0M3Y4RGQ0R1k3SDNJem5vQUFBQUFTVVZPUks1Q1lJST1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS90b25ndWUucG5nXG4gKiogbW9kdWxlIGlkID0gNDg3XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFBZDBTVTFGQjlnTEVBSU1OZXp5RFMwQUFBSE1TVVJCVkRqTHhaTy9heFJCR0lhZjJiMGZVZkJpRWtGSmpCeTVTRERZQ3lJU2xjUS93a29zUkdzUnNSRXJrYUNOZ2swU0M3VVdFZXl0aFdBVXdTVGVRVkNJN04zdDdPV3k3czdzN296RjRYbVNNd29XZmpEVjhMemZ2UE85SC96dkVnRHo5KzVpVElZeDV1OGdJWEFjbCt2WGJwQURVRXBkbUpvNituVFB3RjRjUi93VzFGcGpqQVVzbjZyVjE4Qk1ybk9oSnFlUEhlZm1yZHZVYWh0OTRVSWh6NVhMRnhrL1BNckk4QUZXMTlaT0E1MFhkTW95TWpURTFUdVgwRm9SeUJZeThQRjlTZENTbEVxRHJMejd3R1NsVE01MXUxU3V0MHMrWDhEelBKSWt3WmMrc3VuVDhKdjR2aytwTk1oQXNjakRSMHZNblR2YlpaeGVnU1JKYURZYlNDa0p3NUJJeFdpZGtHVVpBR21XY3Vya0NZNk1qL1VYaUpYQzgrclVHM1VDS1dtMzI0VGhkczgvRkZoOC9Jemx0Ky83VzFCeFRMMVJ4eHFMMGdxdDlDK2pUWk9VdWRrWktoTmxhdFgxL2hhQ0lLQzExU0tPWTR3MUNQRnpyRW1hY243MkRKV0o4azRMUWdqQzZCc3FzVHRPYWgzZUxLOHdObnFJNXk5ZThYRjEzZjRJWWE0RE81blNNUS91eisrYVFHdHRwNnNqeEpmUEc2b3JzTG41OWNuQ3d0TEJLSXIyQ3lGMnpiTTF4cldRbHpKNENSUjdjMXNDaG9IdFA2ekNQc0FGUEdEcm43ZnhPNVVCNENwYS9rYjFBQUFBQUVsRlRrU3VRbUNDXCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvd3lzaXd5Zy9zbWlsZXkvdHYucG5nXG4gKiogbW9kdWxlIGlkID0gNDg4XG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQUpTU1VSQlZEaU5uWkxkYTgxeEhNZGYzOS92cDVOcGlrMFpaeml4MWNTVk9lZGdEMXlOdzB6NUQ1UzFXYUo1dWxMdXBnMHBEN2xCdTVPU0c3bVdoKzFDeW9VU1NSNUtNWnVIdzg0NTM5LzM4L202c1AzSUZ1VjkrKzM5NnZYcC9UWGVld0RPbkIzcVU5VWhFWm5MWHhJRVlTazBIT252UDNZQkFPODkzbnVHVHArY2pPUFkveXZXV2o5NGFtQnl1aGROazBWa2JoUkZqRStNSVNLSUNxcUNxcUxlZy9jWVkxaVd6cUNxaVdYMHA2S3Fjdi9CQTFRRTlZcXE0dmtKeU9Wek0wNmFGWkRMWlJGeHY1bm8xSnZNQkdTMm4vUUFQWnVuQUY0WkhSbE5UaEFWVkpUMXVXWWdUSXJUdmNUZzBwMkEyb2FIRlBKMTVQSlpuRGhFSEU0RUVjZlVXSnkvTnNLbE8wRUNNaXNLQTJsZ0E3QnZYbFdxelZvWHhHNm1La0FVQmN5SklpMlY3VjNnSWpCcXB2L0J5czdCdThkN3Q3Vit0ZkRveFFTcFZFUVVoWWdvNVVwTXFXUnBxcDlQcERGWGI0emNlM25yYUJ0QUFOQlFPSmZ5M21lYk1vdDQ4bXFDNGNQdEJHSEl4ZDQ4SmdnWVB0U09lcyt6dDUrcHIxc0ErR3hENFZ3cUFWaGZiRm0rdENiK1huWjgvRkptWFdjZmNTeHMySDBBYXgzck92c1FVVDRWeXhSTGpwb0YxZGI2WWtzQ0NNSnd4OXJHZE5YakYyUFkySkhKZG5INXdDWXkyVjFjT2RqQzh1YWQzRHl4bFRnV25yOFpwMzVKN2J3Z0RIY2tBR05NVnlaZEV6eDlQWTZMSFpXeVpXMUhONlhKTW1zNnVxbFVMSTFiOW1Eam1EZnZpOVF1ckE2TU1WMi96eGg5bVBqR3h0V0w4UmhFUFpMZmozTks2NXBlS3RiUnZHb3YxZ2syRnQ2K0cwKzZFWUFpUGRkdlB4eFVyMDE0Zm8wOFd3d2FtT0NwSWtjQmtobi9OejhBdWRCaW82K0ViaVlBQUFBQVNVVk9SSzVDWUlJPVwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3R5cGluZy5wbmdcbiAqKiBtb2R1bGUgaWQgPSA0ODlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMjNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBTTNTVVJCVkRpTlZaTk5URnhWR0lhZmMrNGRZQmdLYldINGp3V2thRXZiaE1aZ1VyV1FtbGpzUW8zVk5QNVVUVnlabUpxcWNhY0VFdU5DQTJwZGRLT1dtcWdMTUttU2lDWlZwamFrc1ZKTVptVUxkQ2JBeUF4L2JXVXU5K2ZjYzF4UUduaVRkL0VsYjU3RjkzNmZNTWF3V1VPOVhjMENjOUpDZFJqa2ZnQ0JUb2JZQ1lQNDV2Z0hJNU9iODJJRE1OVGJKU1g2bEIySjlMUTBOY2QyMU41bnhhb2JBY05xWnBMRm1lbncrbFFxNy9sZXQ5SjgvdkpIby9vZVlLaTNTOXFvaS9GNFRYdGRWVVh4N05XZjhHNHYwWHo4ZWFvZWZnUjBBYXdKMXRKWnJpWXVPdk81M0o5K0tCOS92VzlNMndBU2ZTb2VyMjV2TzNLc09EMzJKZldIOWxJVXIwWkVvaGh2aFluUHpuQnJhcHF5eGtZT25YaTdPSEZodUgwMnUvZ1cwQzhHZTQ0MlIydzUzdm5rYzZWQy9VVWtjNTJDaFZzZ0JHRkRJNnFsRlNNdFRPQ2kzZjhnak9BdHhQaGhjSGgxelZOdGRxaUNrM3VhOThTRXpHR25rdGhoQmZuRDd3TVFuZmdVMi8wSHVaakN1ck9FTGl6RzNWVkhZVlViclUyMTBTdkp5VmVsOGQyT3NvcEtTNjlPVWJpNGd2UFF1Nmo0UHA1NW81ZVI2SXVNbUJkNDRud1JLeS85UWI3alk2S3BHYlNYSTE1VmJoSDZuZEpWK2tESnppcENKMHUrY1RlNnBQSmVSVVlXYlpRRndrSlY3Q1Bmc2hmdExsRld2Z1BYVS92dElBZ3dXbUhDa0VDNmlNVmhxRGpDNExmOWlEdFhFRUx5MkhkZlFKQ0Q1ZDhKckRVSUJZU0tJRkRDMW9HZnZEMmZQbHdhMjQ3Mi80WHNyNGpsU3dnN0FwYUZFUktXZmdPdE1DckFCRDdDS21NaGswR0hRVkk2dms3TXo4eUVNbHFEQ1lPN0lXL2R2b2Z4M2J1enYyNFZJRVFKNmRSY21GOVRvN2JucS9OajE1S25teDU4b01RcWlLT0RKUzRNWENPVFh0bHk0clVOTzNuNmxZTUlLOFpxemlNeGZzUHovR0JBR0dQNDhFVERPN3ZxYW5xZmV2Wm9zY3IvalE2V0VaWU5VcTR2RUFOR0k2eHRDRlBEdVlGZm5PblpiUGVaaFBPSkJIRDlzSDhxbFI0Zi9QNUh4MWYzWTI5clJVYkt3VmhnSk1MZWppeHN3RmtwNWF1dmYzWlNjOW1KSUtSdnl6TzlkNnhTQ3ZScHk0cjBQSHF3cGFpK3Z0S0tWOGN4T2lRN2wrSG16Ym53MHZpa3A1VHFWcHErczVjZHZRV3dvVGM3UzNkajlHc1JxVHVDa0FNQUVZdWtweGpWaG5Obkx6czNOdWYvQnhBN29OYkluTFk3QUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3VobS15ZWFoLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ5MFxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFOR1NVUkJWRGlOVlpOZFNKMTFBTVovLy8vN25xUEg0enc2TzA3dHVKYW9hNWpDaWttVVRWdXduSGVqTGhzcjZqSVczUVFGSlhvejZFSW9SbmdWdGRGcU1JdllMb3FZMCtFV3lXeXJzeUEvNXNlY1RzL1IwNVR6OWI3di82T0xNYkhuNnJsNCtOMDgvSVMxbHAwWkh1aHBFdGdURHFyTEl0c0FCQ2FwY2NjczR0enJuLzQ4dTNNdkhnT0dCM3FreEp4eVE2SCtsc2FtYUZYOVhpZGErelJneWE3TXNyNDBwNmZ2THVRODMrdFRoaS9lUEQxcXRnSERBejNTUlYySngrczYyanFQbHJsVklNSUZSQWcyL3JyTjR2RDNoR1BWeEovdFp1cmVXbjQxbFpyd3RYejFuY0ViUmdKSXpLbDR2TGJqNEpIZU10eC9VTGxKZEhFWkUyeFNVaG1oK2UyVDFIWWRJbEQzZWJIbmFGbDFyTEpEQi83N0FPSmkvMnROSVZkT2RoOTdvd0o3RzJzM2taRVlzclFjNFRpRVptZHdGbWJCUWxCZlM1Qm9wcGlwNEllTGw3TUZUeDJVV2dVbm12WTFSb1ZNb2JOTFlBMVcreGhWaEdJQlA5Wko5c2lYWkxzL3g5MEs0ODdmb2FUUzBOcFlIMUhLUHltdFgreUtQVkhqbU93YzFtaW1ydC9ocDlQbitHWHdXOUxyWll5c1BzWHhkejlDVno5RDdvV1BLVmxOWTd3VThUM1ZEdHJ2ZG92S3RKZnYzb1ArOXlaSVJjUCtlaEt0KzloWWZzaGE4amRJSE5xK1RPOUtrR3M1Z0NsdUVLdHVvT2lwTmpjSUFxeFJXSzBSVmxFYWlTRENZYUt0Q1pBdSt5dldlUG03TXhDa0lIT1Z3Q21BRnFBVlFhQ0Vhd0kvdWJtNmVMZ2lXb254SDREeVFVaXdGaHdGbWF1d01RSkdZVldBRFh5RUV5Tzlzb0xSUVZMbWZUTzJ1clNrWmFRT3F3UCtubGpBZUVWczRHRjlEK3MvNnNielNGNmZ4YW9BSWNwWlhGald1WUlhbFo2dnp0NzRJMW53QytYSWNKeVFBNWZPVGpBOXVVQXVzMFV1czhYMHpUa3VmWFdEMGhLQmNLSmtVeDVqa3pPZTV3ZmZPTC8rdVo0Wk9mK1p2NzY2MW5tZy9hVlExVzVGSktKWnVwdmg5eXZUVE4yNlR6Z3NhZTk0a29hbXZRaGJ4L2tMSS9sMDVtSGZtYkhjWldHdDVaUGpEZElWZXJTaHZ2YjUzbU92bEpXVzU3SEJPa1p0UFJJbXRBc2hLOGlsQXk3OGVDMS83MEg2bHFjNFBEU2VOOXN5ZmRoYkl3WG1BOGNKOVhjKzExS2FTTlE0OGRvNDFtaldsbGVZbjEvVzF5Wm5QYVZVbnpJTURvM256ZjlzZkp6M3VpdWFzZWF0a0RSZGdhWWRJT1NROUJTanh2TDEwSGgrWnVmK1A5bFF0clNyYzZLSEFBQUFBRWxGVGtTdVFtQ0NcIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS93aW5rLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ5MVxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFNWlNVUkJWRGlOWmRQUGExeFZISWJ4NTV4NzdzemNtV2t6YmNlWVJoTmJvdEZXYlVNV3V0Q0ZvZFZXVktSVlVBcUtpQVRFZmVuR3JiaXFncmhSS1FTRUxneWlGQkdMdjJnTjFSYXh5VUswVFdoTmsybk5UTkxKWkdidTNIdlBPVjgzVW9vK2Y4Qm44L0lxRWVIMlpxWlVGWGc5TUxsbnZIT1BvRlNNQ243ek52dmk4ZGZjQi93bmRUc3dNNlg2ZEpEN1pYanM2RWhsY01JVXl2Y2gzcEowRmxpY2ZTK3BMNTcrMUZuNzFzUWJrdndQT0R1bER3UTZkM0xYeEluTmZkdWZEQ1JiQkR3S0VBS3lKS0IyK1pOa2NlN2p0clhKNGYyVGN1WVdjT2FFNnRNbWYzWDgyUzhydVdnQVpUWWg2VHhhRjBDQlRkZUpOeHFVdDQyVHhnMW1wcDl1T0p1TkhIaFRXaG9BYlk0UFB6eFpDc0ljU2VjbkpMdU9keHZZcklGTkd5VHhEWFRRSWV2K2pNbVZHZHA5ZUJNNk9BNmd2dnVJdkFyQ200OGVPaFZsOFFVVWdnNGlkSkREMnhhQ0k3NDVUeGlCeVEvZ3NoNG1lb3l6MDY5MG5MVmJqUmYyYmUwZmM4N1dTYnNMS0IzaTByOEk4NE80YkFXQUxHMkRpaERmSllrYkZNTlJLbmMrNU90TEYvY1pVTTlWdHU4dHhhM3paTDBhNHRzZ0tkNGxlRWtSOFNDZU5JMUpranJpSGIzMkxOVzc5NVRyUzdQUEd5L3FZTEZ2V0xYWFBrT2tneEpQLzg2am1OeGRlTi9HOWk2eHZqWkhjKzBLcGNJNjRoM2V6MUxxZTBwNVliOXh6a2ZlZGNuU05ieHRvcFRCOXE2eGZPbHRGT3JmdFlYYVVvOGRReUVpRGkrR1VCS2NrNHIybm05YXF3dVNMKzVDQnhYUVJiTDBiNXhOeWRJV1dkckMycFJ1WEVCVWhBcTJFRWFqZEpyTGlIREJXTWRYemNhMUY0ZEh4NHJPcmhPWUxUZ2Zzcm4vRUVybFFDbndsbnZEbUtqVXd0a20rV2lFeG8wL2tzenlyZkdlNzFlWC96UWplMS9BWnF1QTRMekhoRldVTGdBS2tZeHQxUTdlR2xDR1hPbCs2cld2VXhIT0tSSGg4L2ZWcVoyN256aDR6NE12RzV2VVVMcUEwbm1VMGtDQVNJTDRIdUl0SmovSTZ2VTUrZldIRDJlOVk5d0EySXpKK2JrZnoyYzJYNjBPN2lsRTVUc29sSWZJUndQb0lNSzdGSnMyNlc1YzVjcnZwN1BMRjZkWHZPT2xJOGRFYnAzcDVMdXFLUENxMG94cXpRUEFEdkZxVUNsVEZyRXRwV1VGV0JMUE9lOTU1OGd4aVFIK0FTNExyZUM4QndmdkFBQUFBRWxGVGtTdVFtQ0NcIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy93eXNpd3lnL3NtaWxleS93b3JraW5nLnBuZ1xuICoqIG1vZHVsZSBpZCA9IDQ5MlxuICoqIG1vZHVsZSBjaHVua3MgPSAyM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFKSFNVUkJWRGlOalpKTFNOUlJHTVYvOTk1L1U1TTRhbzRQY21HSTltNWhKYW5STWx3VUdFSXJsZG9JZ29zZ0ZCOVEwS0t3cEtpV2JTTUlRNkZkb05FTEdhd0lDZ1F4TmRQR1IyK2FjTEQ1My91MTBKa3hFK3FEQStkZU9JZHp6M2VWaUJDNWJjNktTTGRTcWdQZ1g3eXEwVjVqWlV3b082T2xhTlBnamIxVlI4ekN6SFNOQ0RYLzR2Y2VCVDlYVngxK0FhQ2RjejFLS1FDVVV2d1BGeWM5eVFUYVdodmNkckNIa2VFSTRWM255ZDE1anBIaENEbmJ1OGdwNjJSa09FSldhUWRaWlIyTURFY29McjlNOE9tejRCMmxhZ0ZVOTVXTDB0N1d4YWZQSDNIT1lsZmduTVU1aDRnZ0lzc0pyQ042cGhYdjF4S3g2Wm5GTDZPanQzUXlpcE9reU9Lc3hhN0F0ejdXK3ZpL2xoaHJhaVl6RUdESC9nTVU1K1Z0Rm1qeGtnWWlnaFBCT1ljVGgzTXVuY1Mzdkc5dUlUOGpSRkU0ekh4L1AyL0h4aFlWUFB6RFFFUVFKTTFGc0lrRUU2Y2FLY3dNVTVRWllyYXZqM2V4SDhUaHNZTzYxQlBTazI0YkVjYWJHc2dQaE5ocUFrUjdlNW1LZmVkYlNRa09hdXRGZkoyV3FkUzZ0TkpvclZsNGVSY3Y4Uk1UbldWaGNKRG9CazJ3K2hBZlR6ZFFMK0lEcEEzV2lCT0pCSzhpQSt4dFAwYncrRzdtUWh1UmZhVWNIWGdDT2gwOHhiVFdLUmhqR0JwNnpyelp3NXVaNzB6bXhRaTBucURpL2dPVWw2b05BRysxUWZxbmFUN016dkY2NGl1ZWw4Zkp1azRLUzhwUld2M1YyQ29Eczl5RUtNYW5KZ2w0SGxjdVhhQ3dvQUNVUXFIUTZ4a1lZK0srN3dkenNyZWtMc081K1ZSV1ZQNjlJTUQzZll3eDhaU0IxcnJ0K3MyclBkYmE0THFLTldPTWlXdXQyNUxuMzMzMEpaZWQ0UGt2QUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3d5c2l3eWcvc21pbGV5L3dyaXRpbmcucG5nXG4gKiogbW9kdWxlIGlkID0gNDkzXG4gKiogbW9kdWxlIGNodW5rcyA9IDIzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==