webpackJsonp([26],{65:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=a(7),i=n(r),l=function u(e){var t=this;o(this,u),this.get=function(e){return t.data[e]},this.set=function(e,a){t.data[e]=a},this.del=function(e){i["default"].isEmpty(t.data[e])||delete t.data[e]},this.data=e||{}},s=function c(){var e=this;o(this,c),this.add=function(t){var a=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];return i["default"].isEmpty(e.datastores[t])&&(e.datastores[t]=new l(a)),e.datastores[t]},this.get=function(t){return e.datastores[t]},this.del=function(t){i["default"].isEmpty(e.datastores[t])||delete e.datastores[t]},this.datastores={}};t["default"]=new s},277:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var l=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),s=a(1),u=n(s),c=a(396),f=n(c),d=a(7),p=n(d),_=a(65),x=n(_),m=function(e){function t(){var e,a,n,i;o(this,t);for(var l=arguments.length,s=Array(l),u=0;u<l;u++)s[u]=arguments[u];return a=n=r(this,(e=Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),n.state={},i=a,r(n,i)}return i(t,e),l(t,[{key:"render",value:function(){var e=this.props.params,t=x["default"].get("novelreader").get("novel");console.log(t);var a=p["default"].find(t.sections,{id:e.sectionID});return u["default"].createElement("section",{className:f["default"].textBox},u["default"].createElement("div",{className:f["default"].titleBox},u["default"].createElement("h1",{className:f["default"].textTitle},a.name),u["default"].createElement("p",{className:f["default"].textInfo},"小说：",u["default"].createElement("a",{style:{marginRight:"10px"}},t.name),"作者：",u["default"].createElement("a",{style:{marginRight:"10px"}},t.author),"字数：",u["default"].createElement("a",{style:{marginRight:"10px"}},3009),"时间：",u["default"].createElement("a",{style:{marginRight:"10px"}},a.time))),u["default"].createElement("section",{className:f["default"].text},p["default"].map(a.paragraphs,function(e,t){return u["default"].createElement("p",{key:t},u["default"].createElement("span",{style:{paddingLeft:"2em",height:"1em"}}),e)})))}}]),t}(u["default"].Component);m.propTypes={params:s.PropTypes.object},e.exports=m},365:function(e,t,a){t=e.exports=a(2)(),t.push([e.id,".Viewer__textBox___2iGRI{width:100%;margin:0 auto 30px;border-radius:3px;padding-bottom:40px;box-shadow:0 0 15px 0 #ccc;background:#f6f4ec}.Viewer__titleBox___1RZA7{width:88%;margin:0 auto;padding:0 0 10px 10px;border-bottom:1px solid #e3e1d9;position:relative}.Viewer__textTitle___1XDgb{padding-top:24px;font:26px/1 Microsoft YaHei;margin-bottom:10px;color:#000}.Viewer__textInfo___3UyDZ{color:#999;font:12px/1.8 Microsoft YaHei;position:relative}.Viewer__text___1CvGG{width:88%;margin:0 auto;font-size:22px}.Viewer__text___1CvGG p{margin:.8em 0;line-height:1.8}",""]),t.locals={textBox:"Viewer__textBox___2iGRI",titleBox:"Viewer__titleBox___1RZA7",textTitle:"Viewer__textTitle___1XDgb",textInfo:"Viewer__textInfo___3UyDZ",text:"Viewer__text___1CvGG"}},396:function(e,t,a){var n=a(365);"string"==typeof n&&(n=[[e.id,n,""]]),a(3)(n,{}),n.locals&&(e.exports=n.locals)}});