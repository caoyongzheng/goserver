webpackJsonp([22],{

/***/ 406:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Popups = function (_React$Component) {
	  _inherits(Popups, _React$Component);
	
	  function Popups() {
	    var _Object$getPrototypeO;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Popups);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Popups)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.showPopup = function () {
	      $.notify('Hello World');
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(Popups, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'button',
	          { onClick: this.showPopup },
	          'show'
	        ),
	        _react2.default.createElement(
	          'button',
	          { onClick: this.hidePopup },
	          'hide'
	        )
	      );
	    }
	  }]);
	
	  return Popups;
	}(_react2.default.Component);
	
	module.exports = Popups;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(239)))

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9wb3B1cHZpZXcvUG9wdXBWaWV3LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0tBRU0sTTs7Ozs7Ozs7Ozs7Ozs7cU1BQ0osUyxHQUFZLFlBQU07QUFDaEIsU0FBRSxNQUFGLENBQVMsYUFBVDtBQUNELE07Ozs7OzhCQUNRO0FBQ1AsY0FDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsYUFBUSxTQUFTLEtBQUssU0FBdEI7QUFBQTtBQUFBLFVBREY7QUFFRTtBQUFBO0FBQUEsYUFBUSxTQUFTLEtBQUssU0FBdEI7QUFBQTtBQUFBO0FBRkYsUUFERjtBQU1EOzs7O0dBWGtCLGdCQUFNLFM7O0FBYzNCLFFBQU8sT0FBUCxHQUFpQixNQUFqQixDIiwiZmlsZSI6ImpzLzIyLTBjMTc3MDQwYzQ1ZDI1YjkxN2IzLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuXG5jbGFzcyBQb3B1cHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzaG93UG9wdXAgPSAoKSA9PiB7XG4gICAgJC5ub3RpZnkoJ0hlbGxvIFdvcmxkJylcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5zaG93UG9wdXB9PnNob3c8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmhpZGVQb3B1cH0+aGlkZTwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUG9wdXBzXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL3BvcHVwdmlldy9Qb3B1cFZpZXcuanN4XG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==