webpackJsonp([15],{17:function(e,t,n){var o,r;!function(){"use strict";function n(){for(var e=[],t=0;t<arguments.length;t++){var o=arguments[t];if(o){var r=typeof o;if("string"===r||"number"===r)e.push(o);else if(Array.isArray(o))e.push(n.apply(null,o));else if("object"===r)for(var l in o)a.call(o,l)&&o[l]&&e.push(l)}}return e.join(" ")}var a={}.hasOwnProperty;"undefined"!=typeof e&&e.exports?e.exports=n:(o=[],r=function(){return n}.apply(t,o),!(void 0!==r&&(e.exports=r)))}()},42:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){var n={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},c=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(1),f=o(s),d=n(52),p=o(d),v=n(17),_=o(v),h=function(e){function t(){var e,n,o,r;a(this,t);for(var u=arguments.length,i=Array(u),c=0;c<u;c++)i[c]=arguments[c];return n=o=l(this,(e=Object.getPrototypeOf(t)).call.apply(e,[this].concat(i))),o.state={},r=n,l(o,r)}return u(t,e),c(t,[{key:"render",value:function(){var e=this.props,t=e.children,n=r(e,["children"]);return f["default"].createElement("button",i({},n,{className:(0,_["default"])(p["default"].button,p["default"].defaults)}),t)}}]),t}(s.Component);t["default"]=h},51:function(e,t,n){t=e.exports=n(2)(),t.push([e.id,".Button__button___3B9Ox{display:inline-block;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:1px solid transparent;border-radius:4px;outline:none}.Button__defaults___k0czm{color:#333;background-color:#fff;border-color:#ccc}.Button__defaults___k0czm:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}",""]),t.locals={button:"Button__button___3B9Ox",defaults:"Button__defaults___k0czm"}},52:function(e,t,n){var o=n(51);"string"==typeof o&&(o=[[e.id,o,""]]),n(3)(o,{}),o.locals&&(e.exports=o.locals)},141:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={ToAddNovel:"ToAddNovel",CancelAddNovel:"CancelAddNovel",AddNovel:"AddNovel",NameChange:"NameChange",AuthorChange:"AuthorChange"}},263:function(e,t,n){(function(e){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function r(t){function n(e){i({type:l["default"].NameChange,state:{name:e}})}function o(e){i({type:l["default"].AuthorChange,state:{author:e}})}function r(){i({type:l["default"].ToAddNovel,state:{name:"",author:"",isAdd:!0}})}function a(){i({type:l["default"].CancelAddNovel,state:{name:"",author:"",isAdd:!1}})}function u(){var t=c(),n=t.name,o=t.author;e.ajax({type:"POST",url:"/api/novel",data:{author:o,name:n},success:function(t){t.success?i({type:l["default"].AddNovel,state:{name:"",author:"",isAdd:!1}}):e.notify(t.desc)},error:function(e,t,n){console.log(e),console.log(t),console.log(n)}})}var i=t.dispatch,c=t.getState;return{onName:n,onAuthor:o,onToAddNovel:r,onCancelAddNovel:a,onAddNovel:u}}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r;var a=n(141),l=o(a)}).call(t,n(11))},264:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=n(1),c=o(i),s=n(42),f=o(s),d=n(13),p=n(8),v=o(p),_=n(7),h=o(_),y=n(19),b=n(393),m=o(b),g=n(322),N=o(g),w=n(265),O=o(w),x=n(141),P=o(x),C=function(e){function t(e){r(this,t);var n=a(this,Object.getPrototypeOf(t).call(this,e));return n.onEditNovel=function(e){n.props.router.push({pathname:v["default"].MyNovelEdit,query:{novelId:e}})},n.store=new y.Store({state:{isAdd:!1,name:"",author:""},actionFactorys:N["default"],didDispatch:function(t){var n=t.type;P["default"].AddNovel===n&&e.store.actions.getMyNovels(e.appStore.data.user.id)}}),e.store.actions.getMyNovels(e.appStore.data.user.id),n}return l(t,e),u(t,[{key:"render",value:function(){var e=this,t=this.props.store.data.novels;return c["default"].createElement("div",null,c["default"].createElement("div",{className:m["default"].controlPanel},c["default"].createElement(f["default"],{onClick:this.store.actions.onToAddNovel},"新增")),c["default"].createElement(y.Provider,{Component:O["default"],connects:[{store:this.store,propsFn:function(e){var t=e.isAdd,n=e.name,o=e.author;return{show:t,name:n,author:o}},actionsFn:function(e){var t=e.onName,n=e.onAuthor,o=e.onAddNovel,r=e.onCancelAddNovel;return{onName:t,onAuthor:n,onSubmit:o,onCancel:r}}}]}),c["default"].createElement("div",{className:m["default"].novelList},h["default"].map(t,function(t,n){return c["default"].createElement("div",{key:n,className:m["default"].novel},c["default"].createElement("div",{className:m["default"].rowCell},t.name),c["default"].createElement("div",{className:m["default"].rowCell},t.author),c["default"].createElement(f["default"],{onClick:function(){return e.onEditNovel(t.id)}},"修改"),c["default"].createElement(f["default"],null,"删除"))})))}}]),t}(c["default"].Component);C.defaultProps={user:{}},C.propTypes={user:i.PropTypes.object.isRequired,store:i.PropTypes.object,appStore:i.PropTypes.object},e.exports=(0,d.withRouter)(C)},265:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=n(1),c=o(i),s=n(42),f=o(s),d=function(e){function t(){var e,n,o,l;r(this,t);for(var u=arguments.length,i=Array(u),c=0;c<u;c++)i[c]=arguments[c];return n=o=a(this,(e=Object.getPrototypeOf(t)).call.apply(e,[this].concat(i))),o.state={},l=n,a(o,l)}return l(t,e),u(t,[{key:"render",value:function(){var e=this.props,t=e.show,n=e.name,o=e.author,r=e.onName,a=e.onAuthor,l=e.onSubmit,u=e.onCancel;return c["default"].createElement("div",{style:{display:t?"block":"none"}},c["default"].createElement("input",{placeholder:"书名",value:n,onChange:function(e){return r(e.target.value)}}),c["default"].createElement("input",{placeholder:"作者",value:o,onChange:function(e){return a(e.target.value)}}),c["default"].createElement(f["default"],{onClick:u},"取消"),c["default"].createElement(f["default"],{onClick:l},"保存"))}}]),t}(c["default"].Component);d.propTypes={show:i.PropTypes.bool.isRequired,name:i.PropTypes.string.isRequired,author:i.PropTypes.string.isRequired,onName:i.PropTypes.func.isRequired,onAuthor:i.PropTypes.func.isRequired,onCancel:i.PropTypes.func.isRequired,onSubmit:i.PropTypes.func.isRequired},t["default"]=d},322:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(263),a=o(r);t["default"]=[a["default"]]},362:function(e,t,n){t=e.exports=n(2)(),t.push([e.id,".NovelList__controlPanel___tONOA{margin:10px 15px;padding:8px}.NovelList__novelList___3c-yg{margin:10px 20px}.NovelList__novel___zh00C{display:-webkit-box;display:-ms-flexbox;display:flex;margin-top:-1px}.NovelList__novel___zh00C:last-child{margin-top:0}.NovelList__rowCell___1BDUd{-webkit-box-flex:1;-ms-flex:1;flex:1;padding:4px 6px;border:1px solid #ddd;margin-left:-1px}.NovelList__rowCell___1BDUd:first-child{margin-left:0}",""]),t.locals={controlPanel:"NovelList__controlPanel___tONOA",novelList:"NovelList__novelList___3c-yg",novel:"NovelList__novel___zh00C",rowCell:"NovelList__rowCell___1BDUd"}},393:function(e,t,n){var o=n(362);"string"==typeof o&&(o=[[e.id,o,""]]),n(3)(o,{}),o.locals&&(e.exports=o.locals)}});