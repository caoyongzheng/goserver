webpackJsonp([21],{

/***/ 401:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Room = __webpack_require__(402);
	
	var _Room2 = _interopRequireDefault(_Room);
	
	var _Login = __webpack_require__(404);
	
	var _Login2 = _interopRequireDefault(_Login);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var styles = {
	  chat: {
	    position: 'relative',
	    width: '100%',
	    height: '100%',
	    overflow: 'auto'
	  }
	};
	
	var Chat = function (_React$Component) {
	  _inherits(Chat, _React$Component);
	
	  function Chat(props) {
	    _classCallCheck(this, Chat);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Chat).call(this, props));
	
	    _this.handleChangeUserName = function (username) {
	      _this.setState({
	        username: username
	      });
	    };
	
	    _this.state = {
	      username: ''
	    };
	    return _this;
	  }
	
	  _createClass(Chat, [{
	    key: 'render',
	    value: function render() {
	      var username = this.state.username;
	
	      return _react2.default.createElement(
	        'div',
	        { name: 'chat', style: styles.chat },
	        username ? _react2.default.createElement(_Room2.default, { username: username }) : _react2.default.createElement(_Login2.default, { onChange: this.handleChangeUserName })
	      );
	    }
	  }]);
	
	  return Chat;
	}(_react2.default.Component);
	
	module.exports = Chat;

/***/ },

/***/ 402:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _MyChat = __webpack_require__(403);
	
	var _MyChat2 = _interopRequireDefault(_MyChat);
	
	var _lodash = __webpack_require__(236);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var styles = {
	  groupsStage: {
	    position: 'absolute',
	    width: '200px',
	    height: '100%',
	    left: 0,
	    top: 0,
	    backgroundColor: 'rgba(255, 148, 124, 0.45)'
	  },
	  group: {
	    position: 'relative',
	    width: '100%',
	    height: '30px',
	    cursor: 'pointer'
	  },
	  groupItem: {
	    position: 'absolute',
	    width: '100%',
	    height: '30px'
	  },
	  deleteItem: {
	    position: 'absolute',
	    right: 0,
	    height: '30px',
	    padding: '0 10px',
	    backgroundColor: 'rgb(0, 0, 0)'
	  },
	  msgStage: {
	    position: 'absolute',
	    height: '100%',
	    top: 0,
	    left: '200px',
	    right: '200px',
	    backgroundColor: 'rgb(255, 37, 37)'
	  },
	  msgView: {
	    position: 'absolute',
	    width: '100%',
	    top: 0,
	    bottom: '120px',
	    overflow: 'auto',
	    backgroundColor: 'rgb(249, 232, 61)'
	  },
	  msgPost: {
	    position: 'absolute',
	    width: '100%',
	    bottom: 0,
	    height: '120px',
	    display: 'flex',
	    alignItems: 'center',
	    justifyContent: 'center',
	    overflow: 'auto'
	  },
	  msgInput: {
	    height: '25px',
	    width: '75%',
	    border: 'solid 1px #ddd',
	    outline: 'none'
	  },
	  msgButton: {
	    height: '25px',
	    width: '40px',
	    border: 'solid 1px #ddd',
	    outline: 'none'
	  },
	  msg: {
	    width: '100%',
	    padding: '6px 10px',
	    color: '#000',
	    backgroundColor: 'rgb(55, 161, 18)',
	    border: 'solid 1px rgb(241, 244, 24)',
	    marginTop: '-1px'
	  },
	  membersStage: {
	    position: 'absolute',
	    width: '200px',
	    height: '100%',
	    right: 0,
	    top: 0,
	    backgroundColor: 'rgba(255, 148, 124, 0.45)'
	  }
	};
	
	var Room = function (_React$Component) {
	  _inherits(Room, _React$Component);
	
	  function Room(props) {
	    _classCallCheck(this, Room);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Room).call(this, props));
	
	    _this.joinGroup = function (groupPath) {
	      _this.myChat.subscription(groupPath).handleSuccess(function () {
	        var group = {
	          path: groupPath,
	          msgs: [],
	          members: []
	        };
	        var groups = _this.state.groups;
	
	        groups[groupPath] = group;
	        _this.setState({
	          groups: groups
	        });
	        _this.listen(groupPath);
	      }).handleError(function () {
	        console.log('Failed to join group:' + groupPath);
	      });
	    };
	
	    _this.listen = function (groupPath) {
	      var accepter = _this.myChat.accept(groupPath);
	      accepter.handleSuccess(function (data) {
	        if (data.dataName === 'Msg') {
	          var g1 = _this.state.groups[groupPath];
	          g1.msgs.push(data.content);
	          _this.setState({
	            groups: _this.state.groups
	          });
	        } else if (data.dataName === 'Members') {
	          var g2 = _this.state.groups[groupPath];
	          g2.members = data.content;
	          _this.setState({
	            groups: _this.state.groups
	          });
	        }
	      });
	    };
	
	    _this.handleClickAdd = function () {
	      _this.joinGroup(_this.state.path);
	      _this.setState({
	        path: ''
	      });
	    };
	
	    _this.handleClickPost = function () {
	      var _this$state = _this.state;
	      var msg = _this$state.msg;
	      var active = _this$state.active;
	
	      if (!msg) {
	        return;
	      }
	      if (active) {
	        _this.myChat.broadcast(active, 'Msg', msg);
	      } else {
	        console.log('faild to send message,should select a group');
	      }
	    };
	
	    _this.clickGroup = function (i) {
	      _this.setState({
	        active: i
	      });
	    };
	
	    _this.handleExitGroup = function (e, path) {
	      e.preventDefault();
	      _this.myChat.send({
	        path: path,
	        kind: 'ExitGroup'
	      });
	    };
	
	    _this.handleChangeMsg = function (e) {
	      _this.setState({
	        msg: e.target.value
	      });
	    };
	
	    _this.handleChangePath = function (e) {
	      _this.setState({
	        path: e.target.value
	      });
	    };
	
	    _this.state = {
	      groups: {},
	      active: '',
	      path: '',
	      msg: ''
	    };
	    return _this;
	  }
	
	  _createClass(Room, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.myChat = new _MyChat2.default('ws://localhost:5050/?id=' + this.props.username);
	
	      this.myChat.onopen(function () {
	        console.log('Connection stated');
	      });
	
	      this.myChat.onclose(function () {
	        console.log('Connection closed');
	      });
	    }
	  }, {
	    key: 'renderGroups',
	    value: function renderGroups(groups, active) {
	      var _this2 = this;
	
	      return _lodash2.default.map(groups, function (g, i) {
	        var activeStyle = {};
	        if (i === active) {
	          activeStyle = { backgroundColor: 'rgb(40, 157, 223)' };
	        }
	        return _react2.default.createElement(
	          'div',
	          { style: [styles.group, activeStyle], key: i },
	          _react2.default.createElement(
	            'div',
	            {
	              name: 'group',
	              style: styles.groupItem,
	              onClick: function onClick() {
	                _this2.clickGroup(i);
	              }
	            },
	            i
	          ),
	          _react2.default.createElement(
	            'div',
	            {
	              style: styles.deleteItem,
	              onClick: function onClick(e) {
	                _this2.handleExitGroup(e, i);
	              }
	            },
	            'X'
	          )
	        );
	      });
	    }
	  }, {
	    key: 'renderMsg',
	    value: function renderMsg(msgs) {
	      return msgs.map(function (m, i) {
	        return _react2.default.createElement(
	          'div',
	          { key: i, style: styles.msg },
	          m
	        );
	      });
	    }
	  }, {
	    key: 'renderMembers',
	    value: function renderMembers(members) {
	      return members.map(function (member, i) {
	        return _react2.default.createElement(
	          'div',
	          { key: i },
	          member
	        );
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _state = this.state;
	      var path = _state.path;
	      var msg = _state.msg;
	      var groups = _state.groups;
	      var active = _state.active;
	
	      var _ref = groups[active] ? groups[active] : { msgs: [], members: [] };
	
	      var msgs = _ref.msgs;
	      var members = _ref.members;
	
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'section',
	          { name: 'groupsStage', style: styles.groupsStage },
	          this.renderGroups(groups, active),
	          _react2.default.createElement('input', { value: path, onChange: this.handleChangePath }),
	          _react2.default.createElement(
	            'button',
	            { type: 'button', style: styles.msgButton, onClick: this.handleClickAdd },
	            'Add'
	          )
	        ),
	        _react2.default.createElement(
	          'section',
	          { name: 'msgStage', style: styles.msgStage },
	          _react2.default.createElement(
	            'div',
	            { name: 'msgView', style: styles.msgView },
	            this.renderMsg(msgs)
	          ),
	          _react2.default.createElement(
	            'div',
	            { name: 'msgPost', style: styles.msgPost },
	            _react2.default.createElement('input', {
	              value: msg,
	              onChange: this.handleChangeMsg,
	              style: styles.msgInput
	            }),
	            _react2.default.createElement(
	              'button',
	              {
	                type: 'button',
	                style: styles.msgButton,
	                onClick: this.handleClickPost
	              },
	              'Post'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'section',
	          { name: 'membersStage', style: styles.membersStage },
	          this.renderMembers(members)
	        )
	      );
	    }
	  }]);
	
	  return Room;
	}(_react2.default.Component);
	
	Room.propTypes = {
	  username: _react.PropTypes.string.isRequired
	};
	
	exports.default = Room;

/***/ },

/***/ 403:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Accepter = function Accepter(path, kind) {
	  var _this = this;
	
	  _classCallCheck(this, Accepter);
	
	  this.handleSuccess = function (handleFn) {
	    _this.handleSuccessFn = handleFn;
	    return _this;
	  };
	
	  this.onSuccess = function (data) {
	    if (_this.handleSuccessFn) {
	      _this.handleSuccessFn(data);
	    }
	  };
	
	  this.handleError = function (handleErrFn) {
	    _this.handleErrorFn = handleErrFn;
	    return _this;
	  };
	
	  this.onError = function (data) {
	    if (_this.handleErrorFn) {
	      _this.handleErrorFn(data);
	    }
	  };
	
	  this.path = path;
	  this.kind = kind;
	};
	
	var MyChat = function MyChat(url) {
	  var _this2 = this;
	
	  _classCallCheck(this, MyChat);
	
	  this.broadcast = function (path, dataName, content) {
	    _this2.send({
	      path: path,
	      dataName: dataName,
	      content: content,
	      kind: 'Broadcast'
	    });
	  };
	
	  this.subscription = function (path) {
	    if (_this2.webSocket.readyState === 0) {
	      _this2.toSubscriptions(function () {
	        _this2.send({
	          path: path,
	          kind: 'Subscription'
	        });
	      });
	    } else {
	      _this2.send({
	        path: path,
	        kind: 'Subscription'
	      });
	    }
	    return _this2.accept(path, 'Subscription');
	  };
	
	  this.accept = function (path) {
	    var kind = arguments.length <= 1 || arguments[1] === undefined ? 'Broadcast' : arguments[1];
	
	    var accepter = new Accepter(path, kind);
	    _this2.accepts[path + ':' + kind] = accepter;
	    return accepter;
	  };
	
	  this.onopen = function (handleOpen) {
	    _this2.handleOpen = handleOpen;
	  };
	
	  this.onclose = function (handleClose) {
	    _this2.handleClose = handleClose;
	  };
	
	  this.send = function (obj) {
	    _this2.webSocket.send(JSON.stringify(obj));
	  };
	
	  this.webSocket = new WebSocket(url);
	  this.accepts = {};
	  this.toSubscriptions = [];
	  this.webSocket.onmessage = function (e) {
	    var data = JSON.parse(e.data);
	    var accept = _this2.accepts[data.path + ':' + data.kind];
	    if (accept) {
	      if (data.status && accept.onSuccess) {
	        accept.onSuccess(data);
	      } else if (!data.status && accept.onError) {
	        accept.onError(data);
	      }
	    }
	  };
	  this.webSocket.onopen = function () {
	    if (_this2.handleOpen) {
	      _this2.handleOpen();
	    }
	    _this2.toSubscriptions.forEach(function (subscription) {
	      subscription();
	    });
	  };
	  this.webSocket.onclose = function () {
	    if (_this2.handleClose) {
	      _this2.handleClose();
	    }
	  };
	};
	
	exports.default = MyChat;

/***/ },

/***/ 404:
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
	
	var styles = {
	  login: {
	    display: 'block',
	    margin: 'auto',
	    width: '400px',
	    height: '300px',
	    backgroundColor: 'rgb(255, 255, 255)',
	    color: '#000'
	  }
	};
	
	var Login = function (_React$Component) {
	  _inherits(Login, _React$Component);
	
	  function Login(props) {
	    _classCallCheck(this, Login);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Login).call(this, props));
	
	    _this.handleChangeUserName = function (e) {
	      _this.setState({
	        username: e.target.value
	      });
	    };
	
	    _this.handleLogin = function () {
	      _this.props.onChange(_this.state.username);
	    };
	
	    _this.state = {
	      username: ''
	    };
	    return _this;
	  }
	
	  _createClass(Login, [{
	    key: 'render',
	    value: function render() {
	      var username = this.state.username;
	
	      return _react2.default.createElement(
	        'div',
	        { name: 'login', style: styles.login },
	        _react2.default.createElement(
	          'div',
	          { name: 'title' },
	          '登录'
	        ),
	        _react2.default.createElement(
	          'div',
	          { name: 'form' },
	          _react2.default.createElement(
	            'label',
	            { htmlFor: 'user' },
	            'Username'
	          ),
	          _react2.default.createElement('input', { value: username, onChange: this.handleChangeUserName }),
	          _react2.default.createElement(
	            'div',
	            { name: 'submit' },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleLogin },
	              '登录'
	            )
	          )
	        )
	      );
	    }
	  }]);
	
	  return Login;
	}(_react2.default.Component);
	
	Login.propTypes = {
	  onChange: _react.PropTypes.func.isRequired
	};
	exports.default = Login;

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jaGF0L0NoYXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2hhdC9jb21wb25lbnRzL1Jvb20vUm9vbS5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2hhdC9jb21wb25lbnRzL015Q2hhdC5qc3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2hhdC9jb21wb25lbnRzL0xvZ2luL0xvZ2luLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLEtBQU0sU0FBUztBQUNiLFNBQUs7QUFDSCxlQUFTLFVBRE47QUFFSCxZQUFNLE1BRkg7QUFHSCxhQUFPLE1BSEo7QUFJSCxlQUFTO0FBSk47QUFEUSxFQUFmOztLQVNNLEk7OztBQUNKLGlCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSx5RkFDWCxLQURXOztBQUFBLFdBZ0JuQixvQkFoQm1CLEdBZ0JFLFVBQUMsUUFBRCxFQUFZO0FBQy9CLGFBQUssUUFBTCxDQUFjO0FBQ1osbUJBQVM7QUFERyxRQUFkO0FBR0QsTUFwQmtCOztBQUVqQixXQUFLLEtBQUwsR0FBVztBQUNULGlCQUFTO0FBREEsTUFBWDtBQUZpQjtBQUtsQjs7Ozs4QkFDUTtBQUFBLFdBQ0EsUUFEQSxHQUNZLEtBQUssS0FEakIsQ0FDQSxRQURBOztBQUVQLGNBQ0U7QUFBQTtBQUFBLFdBQUssTUFBSyxNQUFWLEVBQWlCLE9BQU8sT0FBTyxJQUEvQjtBQUVNLG9CQUFTLGdEQUFNLFVBQVUsUUFBaEIsR0FBVCxHQUFxQyxpREFBTyxVQUFVLEtBQUssb0JBQXRCO0FBRjNDLFFBREY7QUFPRDs7OztHQWhCZ0IsZ0JBQU0sUzs7QUF1QnpCLFFBQU8sT0FBUCxHQUFpQixJQUFqQixDOzs7Ozs7Ozs7Ozs7Ozs7QUNyQ0E7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFDQSxLQUFNLFNBQVM7QUFDYixnQkFBYTtBQUNYLGVBQVUsVUFEQztBQUVYLFlBQU8sT0FGSTtBQUdYLGFBQVEsTUFIRztBQUlYLFdBQU0sQ0FKSztBQUtYLFVBQUssQ0FMTTtBQU1YLHNCQUFpQjtBQU5OLElBREE7QUFTYixVQUFPO0FBQ0wsZUFBVSxVQURMO0FBRUwsWUFBTyxNQUZGO0FBR0wsYUFBUSxNQUhIO0FBSUwsYUFBUTtBQUpILElBVE07QUFlYixjQUFXO0FBQ1QsZUFBVSxVQUREO0FBRVQsWUFBTyxNQUZFO0FBR1QsYUFBUTtBQUhDLElBZkU7QUFvQmIsZUFBWTtBQUNWLGVBQVUsVUFEQTtBQUVWLFlBQU8sQ0FGRztBQUdWLGFBQVEsTUFIRTtBQUlWLGNBQVMsUUFKQztBQUtWLHNCQUFpQjtBQUxQLElBcEJDO0FBMkJiLGFBQVU7QUFDUixlQUFVLFVBREY7QUFFUixhQUFRLE1BRkE7QUFHUixVQUFLLENBSEc7QUFJUixXQUFNLE9BSkU7QUFLUixZQUFPLE9BTEM7QUFNUixzQkFBaUI7QUFOVCxJQTNCRztBQW1DYixZQUFTO0FBQ1AsZUFBVSxVQURIO0FBRVAsWUFBTyxNQUZBO0FBR1AsVUFBSyxDQUhFO0FBSVAsYUFBUSxPQUpEO0FBS1AsZUFBVSxNQUxIO0FBTVAsc0JBQWlCO0FBTlYsSUFuQ0k7QUEyQ2IsWUFBUztBQUNQLGVBQVUsVUFESDtBQUVQLFlBQU8sTUFGQTtBQUdQLGFBQVEsQ0FIRDtBQUlQLGFBQVEsT0FKRDtBQUtQLGNBQVMsTUFMRjtBQU1QLGlCQUFZLFFBTkw7QUFPUCxxQkFBZ0IsUUFQVDtBQVFQLGVBQVU7QUFSSCxJQTNDSTtBQXFEYixhQUFVO0FBQ1IsYUFBUSxNQURBO0FBRVIsWUFBTyxLQUZDO0FBR1IsYUFBUSxnQkFIQTtBQUlSLGNBQVM7QUFKRCxJQXJERztBQTJEYixjQUFXO0FBQ1QsYUFBUSxNQURDO0FBRVQsWUFBTyxNQUZFO0FBR1QsYUFBUSxnQkFIQztBQUlULGNBQVM7QUFKQSxJQTNERTtBQWlFYixRQUFLO0FBQ0gsWUFBTyxNQURKO0FBRUgsY0FBUyxVQUZOO0FBR0gsWUFBTyxNQUhKO0FBSUgsc0JBQWlCLGtCQUpkO0FBS0gsYUFBUSw2QkFMTDtBQU1ILGdCQUFXO0FBTlIsSUFqRVE7QUF5RWIsaUJBQWM7QUFDWixlQUFVLFVBREU7QUFFWixZQUFPLE9BRks7QUFHWixhQUFRLE1BSEk7QUFJWixZQUFPLENBSks7QUFLWixVQUFLLENBTE87QUFNWixzQkFBaUI7QUFOTDtBQXpFRCxFQUFmOztLQW1GTSxJOzs7QUFDSixpQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEseUZBQ1gsS0FEVzs7QUFBQSxXQW9CbkIsU0FwQm1CLEdBb0JQLFVBQUMsU0FBRCxFQUFlO0FBQ3pCLGFBQUssTUFBTCxDQUFZLFlBQVosQ0FBeUIsU0FBekIsRUFDYSxhQURiLENBQzJCLFlBQU07QUFDbkIsYUFBTSxRQUFRO0FBQ1osaUJBQU0sU0FETTtBQUVaLGlCQUFNLEVBRk07QUFHWixvQkFBUztBQUhHLFVBQWQ7QUFEbUIsYUFNWCxNQU5XLEdBTUEsTUFBSyxLQU5MLENBTVgsTUFOVzs7QUFPbkIsZ0JBQU8sU0FBUCxJQUFvQixLQUFwQjtBQUNBLGVBQUssUUFBTCxDQUFjO0FBQ1o7QUFEWSxVQUFkO0FBR0EsZUFBSyxNQUFMLENBQVksU0FBWjtBQUNELFFBYmIsRUFjYSxXQWRiLENBY3lCLFlBQU07QUFDakIsaUJBQVEsR0FBUiwyQkFBb0MsU0FBcEM7QUFDRCxRQWhCYjtBQWlCRCxNQXRDa0I7O0FBQUEsV0F1Q25CLE1BdkNtQixHQXVDVixVQUFDLFNBQUQsRUFBZTtBQUN0QixXQUFNLFdBQVcsTUFBSyxNQUFMLENBQVksTUFBWixDQUFtQixTQUFuQixDQUFqQjtBQUNBLGdCQUFTLGFBQVQsQ0FBdUIsVUFBQyxJQUFELEVBQVU7QUFDL0IsYUFBSSxLQUFLLFFBQUwsS0FBa0IsS0FBdEIsRUFBNkI7QUFDM0IsZUFBTSxLQUFLLE1BQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsU0FBbEIsQ0FBWDtBQUNBLGNBQUcsSUFBSCxDQUFRLElBQVIsQ0FBYSxLQUFLLE9BQWxCO0FBQ0EsaUJBQUssUUFBTCxDQUFjO0FBQ1oscUJBQVEsTUFBSyxLQUFMLENBQVc7QUFEUCxZQUFkO0FBR0QsVUFORCxNQU1PLElBQUksS0FBSyxRQUFMLEtBQWtCLFNBQXRCLEVBQWlDO0FBQ3RDLGVBQU0sS0FBSyxNQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLFNBQWxCLENBQVg7QUFDQSxjQUFHLE9BQUgsR0FBYSxLQUFLLE9BQWxCO0FBQ0EsaUJBQUssUUFBTCxDQUFjO0FBQ1oscUJBQVEsTUFBSyxLQUFMLENBQVc7QUFEUCxZQUFkO0FBR0Q7QUFDRixRQWREO0FBZUQsTUF4RGtCOztBQUFBLFdBeURuQixjQXpEbUIsR0F5REYsWUFBTTtBQUNyQixhQUFLLFNBQUwsQ0FBZSxNQUFLLEtBQUwsQ0FBVyxJQUExQjtBQUNBLGFBQUssUUFBTCxDQUFjO0FBQ1osZUFBTTtBQURNLFFBQWQ7QUFHRCxNQTlEa0I7O0FBQUEsV0ErRG5CLGVBL0RtQixHQStERCxZQUFNO0FBQUEseUJBQ0UsTUFBSyxLQURQO0FBQUEsV0FDZCxHQURjLGVBQ2QsR0FEYztBQUFBLFdBQ1QsTUFEUyxlQUNULE1BRFM7O0FBRXRCLFdBQUksQ0FBQyxHQUFMLEVBQVU7QUFDUjtBQUNEO0FBQ0QsV0FBSSxNQUFKLEVBQVk7QUFDVixlQUFLLE1BQUwsQ0FBWSxTQUFaLENBQXNCLE1BQXRCLEVBQThCLEtBQTlCLEVBQXFDLEdBQXJDO0FBQ0QsUUFGRCxNQUVPO0FBQ0wsaUJBQVEsR0FBUixDQUFZLDZDQUFaO0FBQ0Q7QUFDRixNQXpFa0I7O0FBQUEsV0EwRW5CLFVBMUVtQixHQTBFTixVQUFDLENBQUQsRUFBTztBQUNsQixhQUFLLFFBQUwsQ0FBYztBQUNaLGlCQUFRO0FBREksUUFBZDtBQUdELE1BOUVrQjs7QUFBQSxXQStFbkIsZUEvRW1CLEdBK0VELFVBQUMsQ0FBRCxFQUFJLElBQUosRUFBYTtBQUM3QixTQUFFLGNBQUY7QUFDQSxhQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCO0FBQ2YsbUJBRGU7QUFFZixlQUFNO0FBRlMsUUFBakI7QUFJRCxNQXJGa0I7O0FBQUEsV0FzRm5CLGVBdEZtQixHQXNGRCxVQUFDLENBQUQsRUFBTztBQUN2QixhQUFLLFFBQUwsQ0FBYztBQUNaLGNBQUssRUFBRSxNQUFGLENBQVM7QUFERixRQUFkO0FBR0QsTUExRmtCOztBQUFBLFdBMkZuQixnQkEzRm1CLEdBMkZBLFVBQUMsQ0FBRCxFQUFPO0FBQ3hCLGFBQUssUUFBTCxDQUFjO0FBQ1osZUFBTSxFQUFFLE1BQUYsQ0FBUztBQURILFFBQWQ7QUFHRCxNQS9Ga0I7O0FBRWpCLFdBQUssS0FBTCxHQUFhO0FBQ1gsZUFBUSxFQURHO0FBRVgsZUFBUSxFQUZHO0FBR1gsYUFBTSxFQUhLO0FBSVgsWUFBSztBQUpNLE1BQWI7QUFGaUI7QUFRbEI7Ozs7eUNBQ21CO0FBQ2xCLFlBQUssTUFBTCxHQUFjLGtEQUFzQyxLQUFLLEtBQUwsQ0FBVyxRQUFqRCxDQUFkOztBQUVBLFlBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsWUFBTTtBQUN2QixpQkFBUSxHQUFSLENBQVksbUJBQVo7QUFDRCxRQUZEOztBQUlBLFlBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0IsWUFBTTtBQUN4QixpQkFBUSxHQUFSLENBQVksbUJBQVo7QUFDRCxRQUZEO0FBR0Q7OztrQ0E2RVksTSxFQUFRLE0sRUFBUTtBQUFBOztBQUMzQixjQUFPLGlCQUFFLEdBQUYsQ0FBTSxNQUFOLEVBQWMsVUFBQyxDQUFELEVBQUksQ0FBSixFQUFVO0FBQzdCLGFBQUksY0FBYyxFQUFsQjtBQUNBLGFBQUksTUFBTSxNQUFWLEVBQWtCO0FBQ2hCLHlCQUFjLEVBQUUsaUJBQWlCLG1CQUFuQixFQUFkO0FBQ0Q7QUFDRCxnQkFDRTtBQUFBO0FBQUEsYUFBSyxPQUFPLENBQUMsT0FBTyxLQUFSLEVBQWUsV0FBZixDQUFaLEVBQXlDLEtBQUssQ0FBOUM7QUFDRTtBQUFBO0FBQUE7QUFDRSxxQkFBSyxPQURQO0FBRUUsc0JBQU8sT0FBTyxTQUZoQjtBQUdFLHdCQUFTLG1CQUFNO0FBQUUsd0JBQUssVUFBTCxDQUFnQixDQUFoQjtBQUFvQjtBQUh2QztBQUlFO0FBSkYsWUFERjtBQU1FO0FBQUE7QUFBQTtBQUNFLHNCQUFPLE9BQU8sVUFEaEI7QUFFRSx3QkFBUyxvQkFBSztBQUFFLHdCQUFLLGVBQUwsQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7QUFBNEI7QUFGOUM7QUFBQTtBQUFBO0FBTkYsVUFERjtBQWFELFFBbEJNLENBQVA7QUFtQkQ7OzsrQkFDUyxJLEVBQU07QUFDZCxjQUFPLEtBQUssR0FBTCxDQUFTLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxnQkFDZDtBQUFBO0FBQUEsYUFBSyxLQUFLLENBQVYsRUFBYSxPQUFPLE9BQU8sR0FBM0I7QUFBaUM7QUFBakMsVUFEYztBQUFBLFFBQVQsQ0FBUDtBQUdEOzs7bUNBQ2EsTyxFQUFTO0FBQ3JCLGNBQU8sUUFBUSxHQUFSLENBQVksVUFBQyxNQUFELEVBQVMsQ0FBVDtBQUFBLGdCQUNqQjtBQUFBO0FBQUEsYUFBSyxLQUFLLENBQVY7QUFBYztBQUFkLFVBRGlCO0FBQUEsUUFBWixDQUFQO0FBR0Q7Ozs4QkFDUTtBQUFBLG9CQUMrQixLQUFLLEtBRHBDO0FBQUEsV0FDQyxJQURELFVBQ0MsSUFERDtBQUFBLFdBQ08sR0FEUCxVQUNPLEdBRFA7QUFBQSxXQUNZLE1BRFosVUFDWSxNQURaO0FBQUEsV0FDb0IsTUFEcEIsVUFDb0IsTUFEcEI7O0FBQUEsa0JBRW1CLE9BQU8sTUFBUCxJQUFpQixPQUFPLE1BQVAsQ0FBakIsR0FBa0MsRUFBRSxNQUFNLEVBQVIsRUFBWSxTQUFTLEVBQXJCLEVBRnJEOztBQUFBLFdBRUMsSUFGRCxRQUVDLElBRkQ7QUFBQSxXQUVPLE9BRlAsUUFFTyxPQUZQOztBQUdQLGNBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGFBQVMsTUFBSyxhQUFkLEVBQTRCLE9BQU8sT0FBTyxXQUExQztBQUNHLGdCQUFLLFlBQUwsQ0FBa0IsTUFBbEIsRUFBMEIsTUFBMUIsQ0FESDtBQUVFLG9EQUFPLE9BQU8sSUFBZCxFQUFvQixVQUFVLEtBQUssZ0JBQW5DLEdBRkY7QUFHRTtBQUFBO0FBQUEsZUFBUSxNQUFLLFFBQWIsRUFBc0IsT0FBTyxPQUFPLFNBQXBDLEVBQStDLFNBQVMsS0FBSyxjQUE3RDtBQUFBO0FBQUE7QUFIRixVQURGO0FBTUU7QUFBQTtBQUFBLGFBQVMsTUFBSyxVQUFkLEVBQXlCLE9BQU8sT0FBTyxRQUF2QztBQUNFO0FBQUE7QUFBQSxlQUFLLE1BQUssU0FBVixFQUFvQixPQUFPLE9BQU8sT0FBbEM7QUFDRyxrQkFBSyxTQUFMLENBQWUsSUFBZjtBQURILFlBREY7QUFJRTtBQUFBO0FBQUEsZUFBSyxNQUFLLFNBQVYsRUFBb0IsT0FBTyxPQUFPLE9BQWxDO0FBQ0U7QUFDRSxzQkFBTyxHQURUO0FBRUUseUJBQVUsS0FBSyxlQUZqQjtBQUdFLHNCQUFPLE9BQU87QUFIaEIsZUFERjtBQU1FO0FBQUE7QUFBQTtBQUNFLHVCQUFLLFFBRFA7QUFFRSx3QkFBTyxPQUFPLFNBRmhCO0FBR0UsMEJBQVMsS0FBSztBQUhoQjtBQUFBO0FBQUE7QUFORjtBQUpGLFVBTkY7QUF5QkU7QUFBQTtBQUFBLGFBQVMsTUFBSyxjQUFkLEVBQTZCLE9BQU8sT0FBTyxZQUEzQztBQUNHLGdCQUFLLGFBQUwsQ0FBbUIsT0FBbkI7QUFESDtBQXpCRixRQURGO0FBK0JEOzs7O0dBbEtnQixnQkFBTSxTOztBQW9LekIsTUFBSyxTQUFMLEdBQWlCO0FBQ2YsYUFBVSxpQkFBVSxNQUFWLENBQWlCO0FBRFosRUFBakI7O21CQUllLEk7Ozs7Ozs7Ozs7Ozs7OztLQy9QVCxRLEdBQ0osa0JBQVksSUFBWixFQUFrQixJQUFsQixFQUF3QjtBQUFBOztBQUFBOztBQUFBLFFBSXhCLGFBSndCLEdBSVIsVUFBQyxRQUFELEVBQWM7QUFDNUIsV0FBSyxlQUFMLEdBQXVCLFFBQXZCO0FBQ0E7QUFDRCxJQVB1Qjs7QUFBQSxRQVF4QixTQVJ3QixHQVFaLFVBQUMsSUFBRCxFQUFVO0FBQ3BCLFNBQUksTUFBSyxlQUFULEVBQTBCO0FBQ3hCLGFBQUssZUFBTCxDQUFxQixJQUFyQjtBQUNEO0FBQ0YsSUFadUI7O0FBQUEsUUFheEIsV0Fid0IsR0FhVixVQUFDLFdBQUQsRUFBaUI7QUFDN0IsV0FBSyxhQUFMLEdBQXFCLFdBQXJCO0FBQ0E7QUFDRCxJQWhCdUI7O0FBQUEsUUFpQnhCLE9BakJ3QixHQWlCZCxVQUFDLElBQUQsRUFBVTtBQUNsQixTQUFJLE1BQUssYUFBVCxFQUF3QjtBQUN0QixhQUFLLGFBQUwsQ0FBbUIsSUFBbkI7QUFDRDtBQUNGLElBckJ1Qjs7QUFDdEIsUUFBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFFBQUssSUFBTCxHQUFZLElBQVo7QUFDRCxFOztLQXFCa0IsTSxHQUNuQixnQkFBWSxHQUFaLEVBQWlCO0FBQUE7O0FBQUE7O0FBQUEsUUE2QmpCLFNBN0JpQixHQTZCTCxVQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEVBQTZCO0FBQ3ZDLFlBQUssSUFBTCxDQUFVO0FBQ1IsaUJBRFE7QUFFUix5QkFGUTtBQUdSLHVCQUhRO0FBSVIsYUFBTTtBQUpFLE1BQVY7QUFNRCxJQXBDZ0I7O0FBQUEsUUFxQ2pCLFlBckNpQixHQXFDRixVQUFDLElBQUQsRUFBVTtBQUN2QixTQUFJLE9BQUssU0FBTCxDQUFlLFVBQWYsS0FBOEIsQ0FBbEMsRUFBcUM7QUFDbkMsY0FBSyxlQUFMLENBQXFCLFlBQU07QUFDekIsZ0JBQUssSUFBTCxDQUFVO0FBQ1IscUJBRFE7QUFFUixpQkFBTTtBQUZFLFVBQVY7QUFJRCxRQUxEO0FBTUQsTUFQRCxNQU9PO0FBQ0wsY0FBSyxJQUFMLENBQVU7QUFDUixtQkFEUTtBQUVSLGVBQU07QUFGRSxRQUFWO0FBSUQ7QUFDRCxZQUFPLE9BQUssTUFBTCxDQUFZLElBQVosRUFBa0IsY0FBbEIsQ0FBUDtBQUNELElBcERnQjs7QUFBQSxRQXFEakIsTUFyRGlCLEdBcURSLFVBQUMsSUFBRCxFQUE4QjtBQUFBLFNBQXZCLElBQXVCLHlEQUFoQixXQUFnQjs7QUFDckMsU0FBTSxXQUFXLElBQUksUUFBSixDQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBakI7QUFDQSxZQUFLLE9BQUwsQ0FBZ0IsSUFBaEIsU0FBd0IsSUFBeEIsSUFBa0MsUUFBbEM7QUFDQSxZQUFPLFFBQVA7QUFDRCxJQXpEZ0I7O0FBQUEsUUEwRGpCLE1BMURpQixHQTBEUixVQUFDLFVBQUQsRUFBZ0I7QUFDdkIsWUFBSyxVQUFMLEdBQWtCLFVBQWxCO0FBQ0QsSUE1RGdCOztBQUFBLFFBNkRqQixPQTdEaUIsR0E2RFAsVUFBQyxXQUFELEVBQWlCO0FBQ3pCLFlBQUssV0FBTCxHQUFtQixXQUFuQjtBQUNELElBL0RnQjs7QUFBQSxRQWdFakIsSUFoRWlCLEdBZ0VWLFVBQUMsR0FBRCxFQUFTO0FBQ2QsWUFBSyxTQUFMLENBQWUsSUFBZixDQUFvQixLQUFLLFNBQUwsQ0FBZSxHQUFmLENBQXBCO0FBQ0QsSUFsRWdCOztBQUNmLFFBQUssU0FBTCxHQUFpQixJQUFJLFNBQUosQ0FBYyxHQUFkLENBQWpCO0FBQ0EsUUFBSyxPQUFMLEdBQWUsRUFBZjtBQUNBLFFBQUssZUFBTCxHQUF1QixFQUF2QjtBQUNBLFFBQUssU0FBTCxDQUFlLFNBQWYsR0FBMkIsVUFBQyxDQUFELEVBQU87QUFDaEMsU0FBTSxPQUFPLEtBQUssS0FBTCxDQUFXLEVBQUUsSUFBYixDQUFiO0FBQ0EsU0FBTSxTQUFTLE9BQUssT0FBTCxDQUFnQixLQUFLLElBQXJCLFNBQTZCLEtBQUssSUFBbEMsQ0FBZjtBQUNBLFNBQUksTUFBSixFQUFZO0FBQ1YsV0FBSSxLQUFLLE1BQUwsSUFBZSxPQUFPLFNBQTFCLEVBQXFDO0FBQ25DLGdCQUFPLFNBQVAsQ0FBaUIsSUFBakI7QUFDRCxRQUZELE1BRU8sSUFBSSxDQUFDLEtBQUssTUFBTixJQUFnQixPQUFPLE9BQTNCLEVBQW9DO0FBQ3pDLGdCQUFPLE9BQVAsQ0FBZSxJQUFmO0FBQ0Q7QUFDRjtBQUNGLElBVkQ7QUFXQSxRQUFLLFNBQUwsQ0FBZSxNQUFmLEdBQXdCLFlBQU07QUFDNUIsU0FBSSxPQUFLLFVBQVQsRUFBcUI7QUFDbkIsY0FBSyxVQUFMO0FBQ0Q7QUFDRCxZQUFLLGVBQUwsQ0FBcUIsT0FBckIsQ0FBNkIsVUFBQyxZQUFELEVBQWtCO0FBQzdDO0FBQ0QsTUFGRDtBQUdELElBUEQ7QUFRQSxRQUFLLFNBQUwsQ0FBZSxPQUFmLEdBQXlCLFlBQU07QUFDN0IsU0FBSSxPQUFLLFdBQVQsRUFBc0I7QUFDcEIsY0FBSyxXQUFMO0FBQ0Q7QUFDRixJQUpEO0FBS0QsRTs7bUJBN0JrQixNOzs7Ozs7Ozs7Ozs7Ozs7QUN6QnJCOzs7Ozs7Ozs7Ozs7QUFFQSxLQUFNLFNBQVM7QUFDYixVQUFPO0FBQ0wsY0FBUyxPQURKO0FBRUwsYUFBUSxNQUZIO0FBR0wsWUFBTyxPQUhGO0FBSUwsYUFBUSxPQUpIO0FBS0wsc0JBQWlCLG9CQUxaO0FBTUwsWUFBTztBQU5GO0FBRE0sRUFBZjs7S0FXTSxLOzs7QUFDSixrQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsMEZBQ1gsS0FEVzs7QUFBQSxXQU1uQixvQkFObUIsR0FNSSxVQUFDLENBQUQsRUFBTztBQUM1QixhQUFLLFFBQUwsQ0FBYztBQUNaLG1CQUFVLEVBQUUsTUFBRixDQUFTO0FBRFAsUUFBZDtBQUdELE1BVmtCOztBQUFBLFdBV25CLFdBWG1CLEdBV0wsWUFBTTtBQUNsQixhQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLE1BQUssS0FBTCxDQUFXLFFBQS9CO0FBQ0QsTUFia0I7O0FBRWpCLFdBQUssS0FBTCxHQUFhO0FBQ1gsaUJBQVU7QUFEQyxNQUFiO0FBRmlCO0FBS2xCOzs7OzhCQVNRO0FBQUEsV0FDQyxRQURELEdBQ2MsS0FBSyxLQURuQixDQUNDLFFBREQ7O0FBRVAsY0FDRTtBQUFBO0FBQUEsV0FBSyxNQUFLLE9BQVYsRUFBa0IsT0FBTyxPQUFPLEtBQWhDO0FBQ0U7QUFBQTtBQUFBLGFBQUssTUFBSyxPQUFWO0FBQUE7QUFBQSxVQURGO0FBSUU7QUFBQTtBQUFBLGFBQUssTUFBSyxNQUFWO0FBQ0U7QUFBQTtBQUFBLGVBQU8sU0FBUSxNQUFmO0FBQUE7QUFBQSxZQURGO0FBRUUsb0RBQU8sT0FBTyxRQUFkLEVBQXdCLFVBQVUsS0FBSyxvQkFBdkMsR0FGRjtBQUdFO0FBQUE7QUFBQSxlQUFLLE1BQUssUUFBVjtBQUNFO0FBQUE7QUFBQSxpQkFBUSxTQUFTLEtBQUssV0FBdEI7QUFBQTtBQUFBO0FBREY7QUFIRjtBQUpGLFFBREY7QUFjRDs7OztHQS9CaUIsZ0JBQU0sUzs7QUFpQzFCLE9BQU0sU0FBTixHQUFrQjtBQUNoQixhQUFVLGlCQUFVLElBQVYsQ0FBZTtBQURULEVBQWxCO21CQUdlLEsiLCJmaWxlIjoianMvMjEtMGMxNzcwNDBjNDVkMjViOTE3YjMuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5cbmltcG9ydCBSb29tIGZyb20gJy4vY29tcG9uZW50cy9Sb29tL1Jvb20uanN4J1xuaW1wb3J0IExvZ2luIGZyb20gJy4vY29tcG9uZW50cy9Mb2dpbi9Mb2dpbi5qc3gnXG5cbmNvbnN0IHN0eWxlcyA9IHtcbiAgY2hhdDp7XG4gICAgcG9zaXRpb246J3JlbGF0aXZlJyxcbiAgICB3aWR0aDonMTAwJScsXG4gICAgaGVpZ2h0OicxMDAlJyxcbiAgICBvdmVyZmxvdzonYXV0bydcbiAgfVxufVxuXG5jbGFzcyBDaGF0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnN0YXRlPXtcbiAgICAgIHVzZXJuYW1lOicnXG4gICAgfVxuICB9XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7dXNlcm5hbWV9ID0gdGhpcy5zdGF0ZVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IG5hbWU9XCJjaGF0XCIgc3R5bGU9e3N0eWxlcy5jaGF0fT5cbiAgICAgICAge1xuICAgICAgICAgICAgdXNlcm5hbWU/PFJvb20gdXNlcm5hbWU9e3VzZXJuYW1lfS8+OjxMb2dpbiBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VVc2VyTmFtZX0vPlxuICAgICAgICB9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbiAgaGFuZGxlQ2hhbmdlVXNlck5hbWU9KHVzZXJuYW1lKT0+e1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdXNlcm5hbWU6dXNlcm5hbWVcbiAgICB9KVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IENoYXRcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2hhdC9DaGF0LmpzXG4gKiovIiwiaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuXG5pbXBvcnQgTXlDaGF0IGZyb20gJy4uL015Q2hhdC5qc3gnXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5jb25zdCBzdHlsZXMgPSB7XG4gIGdyb3Vwc1N0YWdlOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgd2lkdGg6ICcyMDBweCcsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgbGVmdDogMCxcbiAgICB0b3A6IDAsXG4gICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgyNTUsIDE0OCwgMTI0LCAwLjQ1KScsXG4gIH0sXG4gIGdyb3VwOiB7XG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICczMHB4JyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgfSxcbiAgZ3JvdXBJdGVtOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICczMHB4JyxcbiAgfSxcbiAgZGVsZXRlSXRlbToge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHJpZ2h0OiAwLFxuICAgIGhlaWdodDogJzMwcHgnLFxuICAgIHBhZGRpbmc6ICcwIDEwcHgnLFxuICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYigwLCAwLCAwKScsXG4gIH0sXG4gIG1zZ1N0YWdlOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgdG9wOiAwLFxuICAgIGxlZnQ6ICcyMDBweCcsXG4gICAgcmlnaHQ6ICcyMDBweCcsXG4gICAgYmFja2dyb3VuZENvbG9yOiAncmdiKDI1NSwgMzcsIDM3KScsXG4gIH0sXG4gIG1zZ1ZpZXc6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIHRvcDogMCxcbiAgICBib3R0b206ICcxMjBweCcsXG4gICAgb3ZlcmZsb3c6ICdhdXRvJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2IoMjQ5LCAyMzIsIDYxKScsXG4gIH0sXG4gIG1zZ1Bvc3Q6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGJvdHRvbTogMCxcbiAgICBoZWlnaHQ6ICcxMjBweCcsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICBvdmVyZmxvdzogJ2F1dG8nLFxuICB9LFxuICBtc2dJbnB1dDoge1xuICAgIGhlaWdodDogJzI1cHgnLFxuICAgIHdpZHRoOiAnNzUlJyxcbiAgICBib3JkZXI6ICdzb2xpZCAxcHggI2RkZCcsXG4gICAgb3V0bGluZTogJ25vbmUnLFxuICB9LFxuICBtc2dCdXR0b246IHtcbiAgICBoZWlnaHQ6ICcyNXB4JyxcbiAgICB3aWR0aDogJzQwcHgnLFxuICAgIGJvcmRlcjogJ3NvbGlkIDFweCAjZGRkJyxcbiAgICBvdXRsaW5lOiAnbm9uZScsXG4gIH0sXG4gIG1zZzoge1xuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgcGFkZGluZzogJzZweCAxMHB4JyxcbiAgICBjb2xvcjogJyMwMDAnLFxuICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYig1NSwgMTYxLCAxOCknLFxuICAgIGJvcmRlcjogJ3NvbGlkIDFweCByZ2IoMjQxLCAyNDQsIDI0KScsXG4gICAgbWFyZ2luVG9wOiAnLTFweCcsXG4gIH0sXG4gIG1lbWJlcnNTdGFnZToge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHdpZHRoOiAnMjAwcHgnLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIHJpZ2h0OiAwLFxuICAgIHRvcDogMCxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDI1NSwgMTQ4LCAxMjQsIDAuNDUpJyxcbiAgfSxcbn1cblxuY2xhc3MgUm9vbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGdyb3Vwczoge30sXG4gICAgICBhY3RpdmU6ICcnLFxuICAgICAgcGF0aDogJycsXG4gICAgICBtc2c6ICcnLFxuICAgIH1cbiAgfVxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLm15Q2hhdCA9IG5ldyBNeUNoYXQoYHdzOi8vbG9jYWxob3N0OjUwNTAvP2lkPSR7dGhpcy5wcm9wcy51c2VybmFtZX1gKVxuXG4gICAgdGhpcy5teUNoYXQub25vcGVuKCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdDb25uZWN0aW9uIHN0YXRlZCcpXG4gICAgfSlcblxuICAgIHRoaXMubXlDaGF0Lm9uY2xvc2UoKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ0Nvbm5lY3Rpb24gY2xvc2VkJylcbiAgICB9KVxuICB9XG4gIGpvaW5Hcm91cCA9IChncm91cFBhdGgpID0+IHtcbiAgICB0aGlzLm15Q2hhdC5zdWJzY3JpcHRpb24oZ3JvdXBQYXRoKVxuICAgICAgICAgICAgICAgIC5oYW5kbGVTdWNjZXNzKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwID0ge1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiBncm91cFBhdGgsXG4gICAgICAgICAgICAgICAgICAgIG1zZ3M6IFtdLFxuICAgICAgICAgICAgICAgICAgICBtZW1iZXJzOiBbXSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNvbnN0IHsgZ3JvdXBzIH0gPSB0aGlzLnN0YXRlXG4gICAgICAgICAgICAgICAgICBncm91cHNbZ3JvdXBQYXRoXSA9IGdyb3VwXG4gICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBzLFxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuKGdyb3VwUGF0aClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5oYW5kbGVFcnJvcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRmFpbGVkIHRvIGpvaW4gZ3JvdXA6JHtncm91cFBhdGh9YClcbiAgICAgICAgICAgICAgICB9KVxuICB9XG4gIGxpc3RlbiA9IChncm91cFBhdGgpID0+IHtcbiAgICBjb25zdCBhY2NlcHRlciA9IHRoaXMubXlDaGF0LmFjY2VwdChncm91cFBhdGgpXG4gICAgYWNjZXB0ZXIuaGFuZGxlU3VjY2VzcygoZGF0YSkgPT4ge1xuICAgICAgaWYgKGRhdGEuZGF0YU5hbWUgPT09ICdNc2cnKSB7XG4gICAgICAgIGNvbnN0IGcxID0gdGhpcy5zdGF0ZS5ncm91cHNbZ3JvdXBQYXRoXVxuICAgICAgICBnMS5tc2dzLnB1c2goZGF0YS5jb250ZW50KVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBncm91cHM6IHRoaXMuc3RhdGUuZ3JvdXBzLFxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChkYXRhLmRhdGFOYW1lID09PSAnTWVtYmVycycpIHtcbiAgICAgICAgY29uc3QgZzIgPSB0aGlzLnN0YXRlLmdyb3Vwc1tncm91cFBhdGhdXG4gICAgICAgIGcyLm1lbWJlcnMgPSBkYXRhLmNvbnRlbnRcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgZ3JvdXBzOiB0aGlzLnN0YXRlLmdyb3VwcyxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIGhhbmRsZUNsaWNrQWRkID0gKCkgPT4ge1xuICAgIHRoaXMuam9pbkdyb3VwKHRoaXMuc3RhdGUucGF0aClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHBhdGg6ICcnLFxuICAgIH0pXG4gIH1cbiAgaGFuZGxlQ2xpY2tQb3N0ID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgbXNnLCBhY3RpdmUgfSA9IHRoaXMuc3RhdGVcbiAgICBpZiAoIW1zZykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChhY3RpdmUpIHtcbiAgICAgIHRoaXMubXlDaGF0LmJyb2FkY2FzdChhY3RpdmUsICdNc2cnLCBtc2cpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdmYWlsZCB0byBzZW5kIG1lc3NhZ2Usc2hvdWxkIHNlbGVjdCBhIGdyb3VwJylcbiAgICB9XG4gIH1cbiAgY2xpY2tHcm91cCA9IChpKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBhY3RpdmU6IGksXG4gICAgfSlcbiAgfVxuICBoYW5kbGVFeGl0R3JvdXAgPSAoZSwgcGF0aCkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMubXlDaGF0LnNlbmQoe1xuICAgICAgcGF0aCxcbiAgICAgIGtpbmQ6ICdFeGl0R3JvdXAnLFxuICAgIH0pXG4gIH1cbiAgaGFuZGxlQ2hhbmdlTXNnID0gKGUpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1zZzogZS50YXJnZXQudmFsdWUsXG4gICAgfSlcbiAgfVxuICBoYW5kbGVDaGFuZ2VQYXRoID0gKGUpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHBhdGg6IGUudGFyZ2V0LnZhbHVlLFxuICAgIH0pXG4gIH1cbiAgcmVuZGVyR3JvdXBzKGdyb3VwcywgYWN0aXZlKSB7XG4gICAgcmV0dXJuIF8ubWFwKGdyb3VwcywgKGcsIGkpID0+IHtcbiAgICAgIGxldCBhY3RpdmVTdHlsZSA9IHt9XG4gICAgICBpZiAoaSA9PT0gYWN0aXZlKSB7XG4gICAgICAgIGFjdGl2ZVN0eWxlID0geyBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2IoNDAsIDE1NywgMjIzKScgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17W3N0eWxlcy5ncm91cCwgYWN0aXZlU3R5bGVdfSBrZXk9e2l9PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIG5hbWU9XCJncm91cFwiXG4gICAgICAgICAgICBzdHlsZT17c3R5bGVzLmdyb3VwSXRlbX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgdGhpcy5jbGlja0dyb3VwKGkpIH19XG4gICAgICAgICAgPntpfTwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXtzdHlsZXMuZGVsZXRlSXRlbX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4geyB0aGlzLmhhbmRsZUV4aXRHcm91cChlLCBpKSB9fVxuICAgICAgICAgID5YPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0pXG4gIH1cbiAgcmVuZGVyTXNnKG1zZ3MpIHtcbiAgICByZXR1cm4gbXNncy5tYXAoKG0sIGkpID0+XG4gICAgICA8ZGl2IGtleT17aX0gc3R5bGU9e3N0eWxlcy5tc2d9PnttfTwvZGl2PlxuICAgIClcbiAgfVxuICByZW5kZXJNZW1iZXJzKG1lbWJlcnMpIHtcbiAgICByZXR1cm4gbWVtYmVycy5tYXAoKG1lbWJlciwgaSkgPT5cbiAgICAgIDxkaXYga2V5PXtpfT57bWVtYmVyfTwvZGl2PlxuICAgIClcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBwYXRoLCBtc2csIGdyb3VwcywgYWN0aXZlIH0gPSB0aGlzLnN0YXRlXG4gICAgY29uc3QgeyBtc2dzLCBtZW1iZXJzIH0gPSBncm91cHNbYWN0aXZlXSA/IGdyb3Vwc1thY3RpdmVdIDogeyBtc2dzOiBbXSwgbWVtYmVyczogW10gfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8c2VjdGlvbiBuYW1lPVwiZ3JvdXBzU3RhZ2VcIiBzdHlsZT17c3R5bGVzLmdyb3Vwc1N0YWdlfT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJHcm91cHMoZ3JvdXBzLCBhY3RpdmUpfVxuICAgICAgICAgIDxpbnB1dCB2YWx1ZT17cGF0aH0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlUGF0aH0gLz5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBzdHlsZT17c3R5bGVzLm1zZ0J1dHRvbn0gb25DbGljaz17dGhpcy5oYW5kbGVDbGlja0FkZH0+QWRkPC9idXR0b24+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgPHNlY3Rpb24gbmFtZT1cIm1zZ1N0YWdlXCIgc3R5bGU9e3N0eWxlcy5tc2dTdGFnZX0+XG4gICAgICAgICAgPGRpdiBuYW1lPVwibXNnVmlld1wiIHN0eWxlPXtzdHlsZXMubXNnVmlld30+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJNc2cobXNncyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBuYW1lPVwibXNnUG9zdFwiIHN0eWxlPXtzdHlsZXMubXNnUG9zdH0+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgdmFsdWU9e21zZ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlTXNnfVxuICAgICAgICAgICAgICBzdHlsZT17c3R5bGVzLm1zZ0lucHV0fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIHN0eWxlPXtzdHlsZXMubXNnQnV0dG9ufVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrUG9zdH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgUG9zdFxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgPHNlY3Rpb24gbmFtZT1cIm1lbWJlcnNTdGFnZVwiIHN0eWxlPXtzdHlsZXMubWVtYmVyc1N0YWdlfT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJNZW1iZXJzKG1lbWJlcnMpfVxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblJvb20ucHJvcFR5cGVzID0ge1xuICB1c2VybmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxufVxuXG5leHBvcnQgZGVmYXVsdCBSb29tXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NoYXQvY29tcG9uZW50cy9Sb29tL1Jvb20uanN4XG4gKiovIiwiY2xhc3MgQWNjZXB0ZXIge1xuICBjb25zdHJ1Y3RvcihwYXRoLCBraW5kKSB7XG4gICAgdGhpcy5wYXRoID0gcGF0aFxuICAgIHRoaXMua2luZCA9IGtpbmRcbiAgfVxuICBoYW5kbGVTdWNjZXNzID0gKGhhbmRsZUZuKSA9PiB7XG4gICAgdGhpcy5oYW5kbGVTdWNjZXNzRm4gPSBoYW5kbGVGblxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgb25TdWNjZXNzID0gKGRhdGEpID0+IHtcbiAgICBpZiAodGhpcy5oYW5kbGVTdWNjZXNzRm4pIHtcbiAgICAgIHRoaXMuaGFuZGxlU3VjY2Vzc0ZuKGRhdGEpXG4gICAgfVxuICB9XG4gIGhhbmRsZUVycm9yID0gKGhhbmRsZUVyckZuKSA9PiB7XG4gICAgdGhpcy5oYW5kbGVFcnJvckZuID0gaGFuZGxlRXJyRm5cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIG9uRXJyb3IgPSAoZGF0YSkgPT4ge1xuICAgIGlmICh0aGlzLmhhbmRsZUVycm9yRm4pIHtcbiAgICAgIHRoaXMuaGFuZGxlRXJyb3JGbihkYXRhKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNeUNoYXQge1xuICBjb25zdHJ1Y3Rvcih1cmwpIHtcbiAgICB0aGlzLndlYlNvY2tldCA9IG5ldyBXZWJTb2NrZXQodXJsKVxuICAgIHRoaXMuYWNjZXB0cyA9IHt9XG4gICAgdGhpcy50b1N1YnNjcmlwdGlvbnMgPSBbXVxuICAgIHRoaXMud2ViU29ja2V0Lm9ubWVzc2FnZSA9IChlKSA9PiB7XG4gICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShlLmRhdGEpXG4gICAgICBjb25zdCBhY2NlcHQgPSB0aGlzLmFjY2VwdHNbYCR7ZGF0YS5wYXRofToke2RhdGEua2luZH1gXVxuICAgICAgaWYgKGFjY2VwdCkge1xuICAgICAgICBpZiAoZGF0YS5zdGF0dXMgJiYgYWNjZXB0Lm9uU3VjY2Vzcykge1xuICAgICAgICAgIGFjY2VwdC5vblN1Y2Nlc3MoZGF0YSlcbiAgICAgICAgfSBlbHNlIGlmICghZGF0YS5zdGF0dXMgJiYgYWNjZXB0Lm9uRXJyb3IpIHtcbiAgICAgICAgICBhY2NlcHQub25FcnJvcihkYXRhKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMud2ViU29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLmhhbmRsZU9wZW4pIHtcbiAgICAgICAgdGhpcy5oYW5kbGVPcGVuKClcbiAgICAgIH1cbiAgICAgIHRoaXMudG9TdWJzY3JpcHRpb25zLmZvckVhY2goKHN1YnNjcmlwdGlvbikgPT4ge1xuICAgICAgICBzdWJzY3JpcHRpb24oKVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy53ZWJTb2NrZXQub25jbG9zZSA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLmhhbmRsZUNsb3NlKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBicm9hZGNhc3QgPSAocGF0aCwgZGF0YU5hbWUsIGNvbnRlbnQpID0+IHtcbiAgICB0aGlzLnNlbmQoe1xuICAgICAgcGF0aCxcbiAgICAgIGRhdGFOYW1lLFxuICAgICAgY29udGVudCxcbiAgICAgIGtpbmQ6ICdCcm9hZGNhc3QnLFxuICAgIH0pXG4gIH1cbiAgc3Vic2NyaXB0aW9uID0gKHBhdGgpID0+IHtcbiAgICBpZiAodGhpcy53ZWJTb2NrZXQucmVhZHlTdGF0ZSA9PT0gMCkge1xuICAgICAgdGhpcy50b1N1YnNjcmlwdGlvbnMoKCkgPT4ge1xuICAgICAgICB0aGlzLnNlbmQoe1xuICAgICAgICAgIHBhdGgsXG4gICAgICAgICAga2luZDogJ1N1YnNjcmlwdGlvbicsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbmQoe1xuICAgICAgICBwYXRoLFxuICAgICAgICBraW5kOiAnU3Vic2NyaXB0aW9uJyxcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFjY2VwdChwYXRoLCAnU3Vic2NyaXB0aW9uJylcbiAgfVxuICBhY2NlcHQgPSAocGF0aCwga2luZCA9ICdCcm9hZGNhc3QnKSA9PiB7XG4gICAgY29uc3QgYWNjZXB0ZXIgPSBuZXcgQWNjZXB0ZXIocGF0aCwga2luZClcbiAgICB0aGlzLmFjY2VwdHNbYCR7cGF0aH06JHtraW5kfWBdID0gYWNjZXB0ZXJcbiAgICByZXR1cm4gYWNjZXB0ZXJcbiAgfVxuICBvbm9wZW4gPSAoaGFuZGxlT3BlbikgPT4ge1xuICAgIHRoaXMuaGFuZGxlT3BlbiA9IGhhbmRsZU9wZW5cbiAgfVxuICBvbmNsb3NlID0gKGhhbmRsZUNsb3NlKSA9PiB7XG4gICAgdGhpcy5oYW5kbGVDbG9zZSA9IGhhbmRsZUNsb3NlXG4gIH1cbiAgc2VuZCA9IChvYmopID0+IHtcbiAgICB0aGlzLndlYlNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KG9iaikpXG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2hhdC9jb21wb25lbnRzL015Q2hhdC5qc3hcbiAqKi8iLCJpbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnXG5cbmNvbnN0IHN0eWxlcyA9IHtcbiAgbG9naW46IHtcbiAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgIG1hcmdpbjogJ2F1dG8nLFxuICAgIHdpZHRoOiAnNDAwcHgnLFxuICAgIGhlaWdodDogJzMwMHB4JyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2IoMjU1LCAyNTUsIDI1NSknLFxuICAgIGNvbG9yOiAnIzAwMCcsXG4gIH0sXG59XG5cbmNsYXNzIExvZ2luIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdXNlcm5hbWU6ICcnLFxuICAgIH1cbiAgfVxuICBoYW5kbGVDaGFuZ2VVc2VyTmFtZSA9IChlKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB1c2VybmFtZTogZS50YXJnZXQudmFsdWUsXG4gICAgfSlcbiAgfVxuICBoYW5kbGVMb2dpbiA9ICgpID0+IHtcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMuc3RhdGUudXNlcm5hbWUpXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMuc3RhdGVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBuYW1lPVwibG9naW5cIiBzdHlsZT17c3R5bGVzLmxvZ2lufT5cbiAgICAgICAgPGRpdiBuYW1lPVwidGl0bGVcIj5cbiAgICAgICAgICDnmbvlvZVcbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgbmFtZT1cImZvcm1cIj5cbiAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInVzZXJcIj5Vc2VybmFtZTwvbGFiZWw+XG4gICAgICAgICAgPGlucHV0IHZhbHVlPXt1c2VybmFtZX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlVXNlck5hbWV9IC8+XG4gICAgICAgICAgPGRpdiBuYW1lPVwic3VibWl0XCI+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlTG9naW59PueZu+W9lTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuTG9naW4ucHJvcFR5cGVzID0ge1xuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbn1cbmV4cG9ydCBkZWZhdWx0IExvZ2luXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NoYXQvY29tcG9uZW50cy9Mb2dpbi9Mb2dpbi5qc3hcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9