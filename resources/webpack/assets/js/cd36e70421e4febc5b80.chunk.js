webpackJsonp([20],{

/***/ 256:
/***/ function(module, exports) {

	eval("/*\r\n\tMIT License http://www.opensource.org/licenses/mit-license.php\r\n\tAuthor Tobias Koppers @sokra\r\n*/\r\n// css base code, injected by the css-loader\r\nmodule.exports = function() {\r\n\tvar list = [];\r\n\r\n\t// return the list of modules as css string\r\n\tlist.toString = function toString() {\r\n\t\tvar result = [];\r\n\t\tfor(var i = 0; i < this.length; i++) {\r\n\t\t\tvar item = this[i];\r\n\t\t\tif(item[2]) {\r\n\t\t\t\tresult.push(\"@media \" + item[2] + \"{\" + item[1] + \"}\");\r\n\t\t\t} else {\r\n\t\t\t\tresult.push(item[1]);\r\n\t\t\t}\r\n\t\t}\r\n\t\treturn result.join(\"\");\r\n\t};\r\n\r\n\t// import a list of modules into the list\r\n\tlist.i = function(modules, mediaQuery) {\r\n\t\tif(typeof modules === \"string\")\r\n\t\t\tmodules = [[null, modules, \"\"]];\r\n\t\tvar alreadyImportedModules = {};\r\n\t\tfor(var i = 0; i < this.length; i++) {\r\n\t\t\tvar id = this[i][0];\r\n\t\t\tif(typeof id === \"number\")\r\n\t\t\t\talreadyImportedModules[id] = true;\r\n\t\t}\r\n\t\tfor(i = 0; i < modules.length; i++) {\r\n\t\t\tvar item = modules[i];\r\n\t\t\t// skip already imported module\r\n\t\t\t// this implementation is not 100% perfect for weird media query combinations\r\n\t\t\t//  when a module is imported multiple times with different media queries.\r\n\t\t\t//  I hope this will never occur (Hey this way we have smaller bundles)\r\n\t\t\tif(typeof item[0] !== \"number\" || !alreadyImportedModules[item[0]]) {\r\n\t\t\t\tif(mediaQuery && !item[2]) {\r\n\t\t\t\t\titem[2] = mediaQuery;\r\n\t\t\t\t} else if(mediaQuery) {\r\n\t\t\t\t\titem[2] = \"(\" + item[2] + \") and (\" + mediaQuery + \")\";\r\n\t\t\t\t}\r\n\t\t\t\tlist.push(item);\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n\treturn list;\r\n};\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/css-loader/lib/css-base.js\n ** module id = 256\n ** module chunks = 1 2 3 4 5 6 7 8 9 18 19 20 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38\n **/\n//# sourceURL=webpack:///./~/css-loader/lib/css-base.js?");

/***/ },

/***/ 257:
/***/ function(module, exports, __webpack_require__) {

	eval("/*\r\n\tMIT License http://www.opensource.org/licenses/mit-license.php\r\n\tAuthor Tobias Koppers @sokra\r\n*/\r\nvar stylesInDom = {},\r\n\tmemoize = function(fn) {\r\n\t\tvar memo;\r\n\t\treturn function () {\r\n\t\t\tif (typeof memo === \"undefined\") memo = fn.apply(this, arguments);\r\n\t\t\treturn memo;\r\n\t\t};\r\n\t},\r\n\tisOldIE = memoize(function() {\r\n\t\treturn /msie [6-9]\\b/.test(window.navigator.userAgent.toLowerCase());\r\n\t}),\r\n\tgetHeadElement = memoize(function () {\r\n\t\treturn document.head || document.getElementsByTagName(\"head\")[0];\r\n\t}),\r\n\tsingletonElement = null,\r\n\tsingletonCounter = 0,\r\n\tstyleElementsInsertedAtTop = [];\r\n\r\nmodule.exports = function(list, options) {\r\n\tif(true) {\r\n\t\tif(typeof document !== \"object\") throw new Error(\"The style-loader cannot be used in a non-browser environment\");\r\n\t}\r\n\r\n\toptions = options || {};\r\n\t// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>\r\n\t// tags it will allow on a page\r\n\tif (typeof options.singleton === \"undefined\") options.singleton = isOldIE();\r\n\r\n\t// By default, add <style> tags to the bottom of <head>.\r\n\tif (typeof options.insertAt === \"undefined\") options.insertAt = \"bottom\";\r\n\r\n\tvar styles = listToStyles(list);\r\n\taddStylesToDom(styles, options);\r\n\r\n\treturn function update(newList) {\r\n\t\tvar mayRemove = [];\r\n\t\tfor(var i = 0; i < styles.length; i++) {\r\n\t\t\tvar item = styles[i];\r\n\t\t\tvar domStyle = stylesInDom[item.id];\r\n\t\t\tdomStyle.refs--;\r\n\t\t\tmayRemove.push(domStyle);\r\n\t\t}\r\n\t\tif(newList) {\r\n\t\t\tvar newStyles = listToStyles(newList);\r\n\t\t\taddStylesToDom(newStyles, options);\r\n\t\t}\r\n\t\tfor(var i = 0; i < mayRemove.length; i++) {\r\n\t\t\tvar domStyle = mayRemove[i];\r\n\t\t\tif(domStyle.refs === 0) {\r\n\t\t\t\tfor(var j = 0; j < domStyle.parts.length; j++)\r\n\t\t\t\t\tdomStyle.parts[j]();\r\n\t\t\t\tdelete stylesInDom[domStyle.id];\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n}\r\n\r\nfunction addStylesToDom(styles, options) {\r\n\tfor(var i = 0; i < styles.length; i++) {\r\n\t\tvar item = styles[i];\r\n\t\tvar domStyle = stylesInDom[item.id];\r\n\t\tif(domStyle) {\r\n\t\t\tdomStyle.refs++;\r\n\t\t\tfor(var j = 0; j < domStyle.parts.length; j++) {\r\n\t\t\t\tdomStyle.parts[j](item.parts[j]);\r\n\t\t\t}\r\n\t\t\tfor(; j < item.parts.length; j++) {\r\n\t\t\t\tdomStyle.parts.push(addStyle(item.parts[j], options));\r\n\t\t\t}\r\n\t\t} else {\r\n\t\t\tvar parts = [];\r\n\t\t\tfor(var j = 0; j < item.parts.length; j++) {\r\n\t\t\t\tparts.push(addStyle(item.parts[j], options));\r\n\t\t\t}\r\n\t\t\tstylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};\r\n\t\t}\r\n\t}\r\n}\r\n\r\nfunction listToStyles(list) {\r\n\tvar styles = [];\r\n\tvar newStyles = {};\r\n\tfor(var i = 0; i < list.length; i++) {\r\n\t\tvar item = list[i];\r\n\t\tvar id = item[0];\r\n\t\tvar css = item[1];\r\n\t\tvar media = item[2];\r\n\t\tvar sourceMap = item[3];\r\n\t\tvar part = {css: css, media: media, sourceMap: sourceMap};\r\n\t\tif(!newStyles[id])\r\n\t\t\tstyles.push(newStyles[id] = {id: id, parts: [part]});\r\n\t\telse\r\n\t\t\tnewStyles[id].parts.push(part);\r\n\t}\r\n\treturn styles;\r\n}\r\n\r\nfunction insertStyleElement(options, styleElement) {\r\n\tvar head = getHeadElement();\r\n\tvar lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];\r\n\tif (options.insertAt === \"top\") {\r\n\t\tif(!lastStyleElementInsertedAtTop) {\r\n\t\t\thead.insertBefore(styleElement, head.firstChild);\r\n\t\t} else if(lastStyleElementInsertedAtTop.nextSibling) {\r\n\t\t\thead.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);\r\n\t\t} else {\r\n\t\t\thead.appendChild(styleElement);\r\n\t\t}\r\n\t\tstyleElementsInsertedAtTop.push(styleElement);\r\n\t} else if (options.insertAt === \"bottom\") {\r\n\t\thead.appendChild(styleElement);\r\n\t} else {\r\n\t\tthrow new Error(\"Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.\");\r\n\t}\r\n}\r\n\r\nfunction removeStyleElement(styleElement) {\r\n\tstyleElement.parentNode.removeChild(styleElement);\r\n\tvar idx = styleElementsInsertedAtTop.indexOf(styleElement);\r\n\tif(idx >= 0) {\r\n\t\tstyleElementsInsertedAtTop.splice(idx, 1);\r\n\t}\r\n}\r\n\r\nfunction createStyleElement(options) {\r\n\tvar styleElement = document.createElement(\"style\");\r\n\tstyleElement.type = \"text/css\";\r\n\tinsertStyleElement(options, styleElement);\r\n\treturn styleElement;\r\n}\r\n\r\nfunction createLinkElement(options) {\r\n\tvar linkElement = document.createElement(\"link\");\r\n\tlinkElement.rel = \"stylesheet\";\r\n\tinsertStyleElement(options, linkElement);\r\n\treturn linkElement;\r\n}\r\n\r\nfunction addStyle(obj, options) {\r\n\tvar styleElement, update, remove;\r\n\r\n\tif (options.singleton) {\r\n\t\tvar styleIndex = singletonCounter++;\r\n\t\tstyleElement = singletonElement || (singletonElement = createStyleElement(options));\r\n\t\tupdate = applyToSingletonTag.bind(null, styleElement, styleIndex, false);\r\n\t\tremove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);\r\n\t} else if(obj.sourceMap &&\r\n\t\ttypeof URL === \"function\" &&\r\n\t\ttypeof URL.createObjectURL === \"function\" &&\r\n\t\ttypeof URL.revokeObjectURL === \"function\" &&\r\n\t\ttypeof Blob === \"function\" &&\r\n\t\ttypeof btoa === \"function\") {\r\n\t\tstyleElement = createLinkElement(options);\r\n\t\tupdate = updateLink.bind(null, styleElement);\r\n\t\tremove = function() {\r\n\t\t\tremoveStyleElement(styleElement);\r\n\t\t\tif(styleElement.href)\r\n\t\t\t\tURL.revokeObjectURL(styleElement.href);\r\n\t\t};\r\n\t} else {\r\n\t\tstyleElement = createStyleElement(options);\r\n\t\tupdate = applyToTag.bind(null, styleElement);\r\n\t\tremove = function() {\r\n\t\t\tremoveStyleElement(styleElement);\r\n\t\t};\r\n\t}\r\n\r\n\tupdate(obj);\r\n\r\n\treturn function updateStyle(newObj) {\r\n\t\tif(newObj) {\r\n\t\t\tif(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)\r\n\t\t\t\treturn;\r\n\t\t\tupdate(obj = newObj);\r\n\t\t} else {\r\n\t\t\tremove();\r\n\t\t}\r\n\t};\r\n}\r\n\r\nvar replaceText = (function () {\r\n\tvar textStore = [];\r\n\r\n\treturn function (index, replacement) {\r\n\t\ttextStore[index] = replacement;\r\n\t\treturn textStore.filter(Boolean).join('\\n');\r\n\t};\r\n})();\r\n\r\nfunction applyToSingletonTag(styleElement, index, remove, obj) {\r\n\tvar css = remove ? \"\" : obj.css;\r\n\r\n\tif (styleElement.styleSheet) {\r\n\t\tstyleElement.styleSheet.cssText = replaceText(index, css);\r\n\t} else {\r\n\t\tvar cssNode = document.createTextNode(css);\r\n\t\tvar childNodes = styleElement.childNodes;\r\n\t\tif (childNodes[index]) styleElement.removeChild(childNodes[index]);\r\n\t\tif (childNodes.length) {\r\n\t\t\tstyleElement.insertBefore(cssNode, childNodes[index]);\r\n\t\t} else {\r\n\t\t\tstyleElement.appendChild(cssNode);\r\n\t\t}\r\n\t}\r\n}\r\n\r\nfunction applyToTag(styleElement, obj) {\r\n\tvar css = obj.css;\r\n\tvar media = obj.media;\r\n\r\n\tif(media) {\r\n\t\tstyleElement.setAttribute(\"media\", media)\r\n\t}\r\n\r\n\tif(styleElement.styleSheet) {\r\n\t\tstyleElement.styleSheet.cssText = css;\r\n\t} else {\r\n\t\twhile(styleElement.firstChild) {\r\n\t\t\tstyleElement.removeChild(styleElement.firstChild);\r\n\t\t}\r\n\t\tstyleElement.appendChild(document.createTextNode(css));\r\n\t}\r\n}\r\n\r\nfunction updateLink(linkElement, obj) {\r\n\tvar css = obj.css;\r\n\tvar sourceMap = obj.sourceMap;\r\n\r\n\tif(sourceMap) {\r\n\t\t// http://stackoverflow.com/a/26603875\r\n\t\tcss += \"\\n/*# sourceMappingURL=data:application/json;base64,\" + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + \" */\";\r\n\t}\r\n\r\n\tvar blob = new Blob([css], { type: \"text/css\" });\r\n\r\n\tvar oldSrc = linkElement.href;\r\n\r\n\tlinkElement.href = URL.createObjectURL(blob);\r\n\r\n\tif(oldSrc)\r\n\t\tURL.revokeObjectURL(oldSrc);\r\n}\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/style-loader/addStyles.js\n ** module id = 257\n ** module chunks = 1 2 3 4 5 6 7 8 9 18 19 20 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38\n **/\n//# sourceURL=webpack:///./~/style-loader/addStyles.js?");

/***/ },

/***/ 403:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _Paging = __webpack_require__(404);\n\nvar _Paging2 = _interopRequireDefault(_Paging);\n\nvar _Pagination = __webpack_require__(406);\n\nvar _Pagination2 = _interopRequireDefault(_Pagination);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar Paging = function (_React$Component) {\n  _inherits(Paging, _React$Component);\n\n  function Paging(props) {\n    _classCallCheck(this, Paging);\n\n    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Paging).call(this, props));\n\n    _this.onChange = function (page) {\n      _this.setState({\n        currentPage: page\n      });\n    };\n\n    _this.state = {\n      pages: 20,\n      currentPage: 1\n    };\n    return _this;\n  }\n\n  _createClass(Paging, [{\n    key: 'render',\n    value: function render() {\n      var _state = this.state;\n      var pages = _state.pages;\n      var currentPage = _state.currentPage;\n\n      return _react2.default.createElement(\n        'div',\n        { className: _Paging2.default.stage },\n        _react2.default.createElement(_Pagination2.default, { pages: pages, currentPage: currentPage, onChange: this.onChange })\n      );\n    }\n  }]);\n\n  return Paging;\n}(_react2.default.Component);\n\nmodule.exports = Paging;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/demos/routes/paging/Paging.js\n ** module id = 403\n ** module chunks = 20\n **/\n//# sourceURL=webpack:///./src/entry/routes/demos/routes/paging/Paging.js?");

/***/ },

/***/ 404:
/***/ function(module, exports, __webpack_require__) {

	eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(405);\nif(typeof content === 'string') content = [[module.id, content, '']];\n// add the styles to the DOM\nvar update = __webpack_require__(257)(content, {});\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {\n\t// When the styles change, update the <style> tags\n\tif(!content.locals) {\n\t\tmodule.hot.accept(\"!!./../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../node_modules/postcss-loader/index.js!./../../../../../../node_modules/sass-loader/index.js!./Paging.scss\", function() {\n\t\t\tvar newContent = require(\"!!./../../../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../../../node_modules/postcss-loader/index.js!./../../../../../../node_modules/sass-loader/index.js!./Paging.scss\");\n\t\t\tif(typeof newContent === 'string') newContent = [[module.id, newContent, '']];\n\t\t\tupdate(newContent);\n\t\t});\n\t}\n\t// When the module is disposed, remove the <style> tags\n\tmodule.hot.dispose(function() { update(); });\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entry/routes/demos/routes/paging/Paging.scss\n ** module id = 404\n ** module chunks = 20\n **/\n//# sourceURL=webpack:///./src/entry/routes/demos/routes/paging/Paging.scss?");

/***/ },

/***/ 405:
/***/ function(module, exports, __webpack_require__) {

	eval("exports = module.exports = __webpack_require__(256)();\n// imports\n\n\n// module\nexports.push([module.id, \".Paging__stage___2Zinu {\\n  position: relative;\\n  overflow: auto;\\n  width: 100%;\\n  height: 100%;\\n  display: -webkit-box;\\n  display: -ms-flexbox;\\n  display: flex;\\n  -webkit-box-align: center;\\n      -ms-flex-align: center;\\n          align-items: center;\\n  -webkit-box-pack: center;\\n      -ms-flex-pack: center;\\n          justify-content: center; }\\n\", \"\"]);\n\n// exports\nexports.locals = {\n\t\"stage\": \"Paging__stage___2Zinu\"\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./~/postcss-loader!./~/sass-loader!./src/entry/routes/demos/routes/paging/Paging.scss\n ** module id = 405\n ** module chunks = 20\n **/\n//# sourceURL=webpack:///./src/entry/routes/demos/routes/paging/Paging.scss?./~/css-loader?modules&importLoaders=1&localIdentName=%5Bname%5D__%5Blocal%5D___%5Bhash:base64:5%5D!./~/postcss-loader!./~/sass-loader");

/***/ },

/***/ 406:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _PageLink = __webpack_require__(407);\n\nvar _PageLink2 = _interopRequireDefault(_PageLink);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar Pagination = function (_React$Component) {\n  _inherits(Pagination, _React$Component);\n\n  function Pagination() {\n    var _Object$getPrototypeO;\n\n    var _temp, _this, _ret;\n\n    _classCallCheck(this, Pagination);\n\n    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Pagination)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.onClick = function (page) {\n      if (page > 0) {\n        _this.props.onChange(page);\n      }\n    }, _this.getInterval = function () {\n      var _this$props = _this.props;\n      var currentPage = _this$props.currentPage;\n      var displayedPages = _this$props.displayedPages;\n      var pages = _this$props.pages;\n\n      var halfDisplayed = Math.floor(displayedPages / 2);\n      return {\n        start: Math.ceil(currentPage > halfDisplayed ? Math.max(Math.min(currentPage - halfDisplayed, pages - displayedPages), 1) : 1),\n        end: Math.ceil(currentPage > halfDisplayed ? Math.min(currentPage + halfDisplayed, pages) : Math.min(displayedPages, pages))\n      };\n    }, _this.renderStart = function (edges, start, currentPage) {\n      var end = Math.min(edges, start);\n      var starts = [];\n      if (start > edges) {\n        for (var i = 1; i <= end; i++) {\n          starts.push(_react2.default.createElement(_PageLink2.default, { key: i, onClick: _this.onClick, page: i, currentPage: currentPage }));\n        }\n      }\n      if (start - end === 2) {\n        starts.push(_react2.default.createElement(_PageLink2.default, {\n          key: end + 1,\n          onClick: _this.onClick,\n          page: end + 1,\n          currentPage: currentPage\n        }));\n      }\n      if (start - end > 2) {\n        starts.push(_react2.default.createElement(_PageLink2.default, { key: 'a', onClick: _this.onClick, page: 0, currentPage: currentPage }));\n      }\n      return starts;\n    }, _this.renderInterval = function (start, end, currentPage) {\n      var intervals = [];\n      for (var i = start; i <= end; i++) {\n        intervals.push(_react2.default.createElement(_PageLink2.default, { key: i, onClick: _this.onClick, page: i, currentPage: currentPage }));\n      }\n      return intervals;\n    }, _this.renderEnd = function (edges, end, pages, currentPage) {\n      var ends = [];\n      var begin = Math.max(end + 1, pages - edges + 1);\n      if (begin - end === 2) {\n        ends.push(_react2.default.createElement(_PageLink2.default, {\n          key: begin - 1,\n          onClick: _this.onClick,\n          page: begin - 1,\n          currentPage: currentPage\n        }));\n      }\n      if (begin - end > 2) {\n        ends.push(_react2.default.createElement(_PageLink2.default, { key: 'b', onClick: _this.onClick, page: 0, currentPage: currentPage }));\n      }\n      for (var i = begin; i <= pages; i++) {\n        ends.push(_react2.default.createElement(_PageLink2.default, { key: i, onClick: _this.onClick, page: i, currentPage: currentPage }));\n      }\n      return ends;\n    }, _temp), _possibleConstructorReturn(_this, _ret);\n  }\n\n  _createClass(Pagination, [{\n    key: 'render',\n    value: function render() {\n      var _props = this.props;\n      var pages = _props.pages;\n      var edges = _props.edges;\n      var currentPage = _props.currentPage;\n      var style = _props.style;\n      var className = _props.className;\n\n      var _getInterval = this.getInterval();\n\n      var start = _getInterval.start;\n      var end = _getInterval.end;\n\n      return _react2.default.createElement(\n        'ul',\n        { style: style, className: className },\n        this.renderStart(edges, start, currentPage),\n        this.renderInterval(start, end, currentPage),\n        this.renderEnd(edges, end, pages, currentPage)\n      );\n    }\n  }]);\n\n  return Pagination;\n}(_react2.default.Component);\n\nPagination.defaultProps = {\n  pages: 1,\n  edges: 1,\n  displayedPages: 6,\n  currentPage: 1,\n  onChange: function onChange() {}\n};\nPagination.propTypes = {\n  pages: _react.PropTypes.number,\n  edges: _react.PropTypes.number,\n  displayedPages: _react.PropTypes.number,\n  currentPage: _react.PropTypes.number,\n  onChange: _react.PropTypes.func\n};\nexports.default = Pagination;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/components/pagination/Pagination.jsx\n ** module id = 406\n ** module chunks = 20 30\n **/\n//# sourceURL=webpack:///./src/components/pagination/Pagination.jsx?");

/***/ },

/***/ 407:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _PageLink = __webpack_require__(408);\n\nvar _PageLink2 = _interopRequireDefault(_PageLink);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar PageLink = function PageLink(_ref) {\n  var _onClick = _ref.onClick;\n  var page = _ref.page;\n  var currentPage = _ref.currentPage;\n\n  var kind = 'common';\n  if (page === 0) {\n    kind = 'disable';\n  } else if (page === currentPage) {\n    kind = 'active';\n  }\n  return _react2.default.createElement(\n    'li',\n    { onClick: function onClick() {\n        return _onClick(page);\n      }, className: _PageLink2.default.pagelink },\n    _react2.default.createElement(\n      'span',\n      { key: page, className: _PageLink2.default[kind] },\n      page || '...'\n    )\n  );\n};\n\nPageLink.propTypes = {\n  currentPage: _react.PropTypes.number.isRequired,\n  onClick: _react.PropTypes.func.isRequired,\n  page: _react.PropTypes.number.isRequired\n};\nexports.default = PageLink;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/components/pagination/components/PageLink.jsx\n ** module id = 407\n ** module chunks = 20 30\n **/\n//# sourceURL=webpack:///./src/components/pagination/components/PageLink.jsx?");

/***/ },

/***/ 408:
/***/ function(module, exports, __webpack_require__) {

	eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(409);\nif(typeof content === 'string') content = [[module.id, content, '']];\n// add the styles to the DOM\nvar update = __webpack_require__(257)(content, {});\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {\n\t// When the styles change, update the <style> tags\n\tif(!content.locals) {\n\t\tmodule.hot.accept(\"!!./../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./PageLink.scss\", function() {\n\t\t\tvar newContent = require(\"!!./../../../../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./PageLink.scss\");\n\t\t\tif(typeof newContent === 'string') newContent = [[module.id, newContent, '']];\n\t\t\tupdate(newContent);\n\t\t});\n\t}\n\t// When the module is disposed, remove the <style> tags\n\tmodule.hot.dispose(function() { update(); });\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/components/pagination/components/PageLink.scss\n ** module id = 408\n ** module chunks = 20 30\n **/\n//# sourceURL=webpack:///./src/components/pagination/components/PageLink.scss?");

/***/ },

/***/ 409:
/***/ function(module, exports, __webpack_require__) {

	eval("exports = module.exports = __webpack_require__(256)();\n// imports\n\n\n// module\nexports.push([module.id, \".PageLink__pagelink___2YYG- {\\n  display: inline-block;\\n  font-size: 1rem;\\n  vertical-align: top; }\\n\\n.PageLink__pagelink___2YYG-:nth-child(n+2) {\\n  margin-left: 5px; }\\n\\n.PageLink__pagelink___2YYG- span {\\n  display: inline-block;\\n  min-width: 16px;\\n  padding: 3px 5px;\\n  line-height: 20px;\\n  background: #f7f7f7;\\n  color: #666;\\n  text-align: center;\\n  box-sizing: content-box; }\\n\\n.PageLink__pagelink___2YYG- .PageLink__common___2agXM {\\n  border: 1px solid rgba(0, 0, 0, 0.2);\\n  border-radius: 4px;\\n  border-bottom-color: rgba(0, 0, 0, 0.3);\\n  text-shadow: 0 1px 0 #fff;\\n  background-origin: border-box;\\n  background-image: -webkit-linear-gradient(top, #fff, #eee);\\n  background-image: linear-gradient(to bottom, #fff, #eee);\\n  cursor: pointer; }\\n\\n.PageLink__pagelink___2YYG- .PageLink__common___2agXM:hover {\\n  background-color: #fafafa;\\n  color: #666;\\n  outline: 0;\\n  background-image: none; }\\n\\n.PageLink__pagelink___2YYG- .PageLink__active___j_4hN {\\n  border: 1px solid rgba(0, 0, 0, 0.2);\\n  border-radius: 4px;\\n  border-bottom-color: rgba(0, 0, 0, 0.4);\\n  background: #009dd8;\\n  color: #fff;\\n  box-sizing: content-box;\\n  background-image: -webkit-linear-gradient(top, #00b4f5, #008dc5);\\n  background-image: linear-gradient(to bottom, #00b4f5, #008dc5);\\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.2); }\\n\", \"\"]);\n\n// exports\nexports.locals = {\n\t\"pagelink\": \"PageLink__pagelink___2YYG-\",\n\t\"common\": \"PageLink__common___2agXM\",\n\t\"active\": \"PageLink__active___j_4hN\"\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./~/postcss-loader!./~/sass-loader!./src/components/pagination/components/PageLink.scss\n ** module id = 409\n ** module chunks = 20 30\n **/\n//# sourceURL=webpack:///./src/components/pagination/components/PageLink.scss?./~/css-loader?modules&importLoaders=1&localIdentName=%5Bname%5D__%5Blocal%5D___%5Bhash:base64:5%5D!./~/postcss-loader!./~/sass-loader");

/***/ }

});