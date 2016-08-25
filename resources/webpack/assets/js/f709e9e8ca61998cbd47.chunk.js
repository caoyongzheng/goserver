webpackJsonp([36],{9:function(t,r){"use strict";function e(t,r,e){var a=n(t,r,e);return a?(t.useProgram(a),t.program=a,!0):(console.log("Failed to create program"),!1)}function n(t,r,e){var n=a(t,t.VERTEX_SHADER,r),i=a(t,t.FRAGMENT_SHADER,e);if(!n||!i)return null;var o=t.createProgram();if(!o)return null;t.attachShader(o,n),t.attachShader(o,i),t.linkProgram(o);var u=t.getProgramParameter(o,t.LINK_STATUS);if(!u){var l=t.getProgramInfoLog(o);return console.log("Failed to link program: "+l),t.deleteProgram(o),t.deleteShader(i),t.deleteShader(n),null}return o}function a(t,r,e){var n=t.createShader(r);if(null==n)return console.log("unable to create shader"),null;t.shaderSource(n,e),t.compileShader(n);var a=t.getShaderParameter(n,t.COMPILE_STATUS);if(!a){var i=t.getShaderInfoLog(n);return console.log("Failed to compile shader: "+i),t.deleteShader(n),null}return n}Object.defineProperty(r,"__esModule",{value:!0}),r.initShaders=e},14:function(t,r){"use strict";function e(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}var n=function i(t){e(this,i),a.call(this),this.matrix=t||i.unitMatrix4()};n.inverseOf=function(t){var r=void 0,e=void 0,n=void 0,a=void 0,i=void 0;if(e=t.matrix,n=new Float32Array(16),a=new Float32Array(16),a[0]=e[5]*e[10]*e[15]-e[5]*e[11]*e[14]-e[9]*e[6]*e[15]+e[9]*e[7]*e[14]+e[13]*e[6]*e[11]-e[13]*e[7]*e[10],a[4]=-e[4]*e[10]*e[15]+e[4]*e[11]*e[14]+e[8]*e[6]*e[15]-e[8]*e[7]*e[14]-e[12]*e[6]*e[11]+e[12]*e[7]*e[10],a[8]=e[4]*e[9]*e[15]-e[4]*e[11]*e[13]-e[8]*e[5]*e[15]+e[8]*e[7]*e[13]+e[12]*e[5]*e[11]-e[12]*e[7]*e[9],a[12]=-e[4]*e[9]*e[14]+e[4]*e[10]*e[13]+e[8]*e[5]*e[14]-e[8]*e[6]*e[13]-e[12]*e[5]*e[10]+e[12]*e[6]*e[9],a[1]=-e[1]*e[10]*e[15]+e[1]*e[11]*e[14]+e[9]*e[2]*e[15]-e[9]*e[3]*e[14]-e[13]*e[2]*e[11]+e[13]*e[3]*e[10],a[5]=e[0]*e[10]*e[15]-e[0]*e[11]*e[14]-e[8]*e[2]*e[15]+e[8]*e[3]*e[14]+e[12]*e[2]*e[11]-e[12]*e[3]*e[10],a[9]=-e[0]*e[9]*e[15]+e[0]*e[11]*e[13]+e[8]*e[1]*e[15]-e[8]*e[3]*e[13]-e[12]*e[1]*e[11]+e[12]*e[3]*e[9],a[13]=e[0]*e[9]*e[14]-e[0]*e[10]*e[13]-e[8]*e[1]*e[14]+e[8]*e[2]*e[13]+e[12]*e[1]*e[10]-e[12]*e[2]*e[9],a[2]=e[1]*e[6]*e[15]-e[1]*e[7]*e[14]-e[5]*e[2]*e[15]+e[5]*e[3]*e[14]+e[13]*e[2]*e[7]-e[13]*e[3]*e[6],a[6]=-e[0]*e[6]*e[15]+e[0]*e[7]*e[14]+e[4]*e[2]*e[15]-e[4]*e[3]*e[14]-e[12]*e[2]*e[7]+e[12]*e[3]*e[6],a[10]=e[0]*e[5]*e[15]-e[0]*e[7]*e[13]-e[4]*e[1]*e[15]+e[4]*e[3]*e[13]+e[12]*e[1]*e[7]-e[12]*e[3]*e[5],a[14]=-e[0]*e[5]*e[14]+e[0]*e[6]*e[13]+e[4]*e[1]*e[14]-e[4]*e[2]*e[13]-e[12]*e[1]*e[6]+e[12]*e[2]*e[5],a[3]=-e[1]*e[6]*e[11]+e[1]*e[7]*e[10]+e[5]*e[2]*e[11]-e[5]*e[3]*e[10]-e[9]*e[2]*e[7]+e[9]*e[3]*e[6],a[7]=e[0]*e[6]*e[11]-e[0]*e[7]*e[10]-e[4]*e[2]*e[11]+e[4]*e[3]*e[10]+e[8]*e[2]*e[7]-e[8]*e[3]*e[6],a[11]=-e[0]*e[5]*e[11]+e[0]*e[7]*e[9]+e[4]*e[1]*e[11]-e[4]*e[3]*e[9]-e[8]*e[1]*e[7]+e[8]*e[3]*e[5],a[15]=e[0]*e[5]*e[10]-e[0]*e[6]*e[9]-e[4]*e[1]*e[10]+e[4]*e[2]*e[9]+e[8]*e[1]*e[6]-e[8]*e[2]*e[5],i=e[0]*a[0]+e[1]*a[4]+e[2]*a[8]+e[3]*a[12],0!==i){for(i=1/i,r=0;r<16;r++)n[r]=a[r]*i;return n}},n.perspectiveMatrix=function(t,r,e,n){var a=void 0,i=void 0,o=void 0,u=void 0;if(e===n||0===r)throw"null frustum";if(e<=0)throw"near <= 0";if(n<=0)throw"far <= 0";if(t=Math.PI*t/180/2,o=Math.sin(t),0===o)throw"null frustum";return i=1/(n-e),u=Math.cos(t)/o,a=new Float32Array(16),a[0]=u/r,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=u,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=-(n+e)*i,a[11]=-1,a[12]=0,a[13]=0,a[14]=-2*e*n*i,a[15]=0,a},n.orthoMatrix=function(t,r,e,n,a,i){var o=void 0,u=void 0,l=void 0,c=void 0;if(t===r||e===n||a===i)throw"null frustum";return u=1/(r-t),l=1/(n-e),c=1/(i-a),o=new Float32Array(16),o[0]=2*u,o[1]=0,o[2]=0,o[3]=0,o[4]=0,o[5]=2*l,o[6]=0,o[7]=0,o[8]=0,o[9]=0,o[10]=-2*c,o[11]=0,o[12]=-(r+t)*u,o[13]=-(n+e)*l,o[14]=-(i+a)*c,o[15]=1,o},n.viewMatrix=function(t,r,e,a,i,o,u,l,c){var f=void 0,s=void 0,v=void 0,d=void 0,h=void 0,x=void 0,m=void 0,y=void 0,p=void 0,w=void 0,M=void 0;f=a-t,s=i-r,v=o-e,d=1/Math.sqrt(f*f+s*s+v*v),f*=d,s*=d,v*=d,h=s*c-v*l,x=v*u-f*c,m=f*l-s*u,y=1/Math.sqrt(h*h+x*x+m*m),h*=y,x*=y,m*=y,p=x*v-m*s,w=m*f-h*v,M=h*s-x*f;var g=new Float32Array(16);return g[0]=h,g[1]=p,g[2]=-f,g[3]=0,g[4]=x,g[5]=w,g[6]=-s,g[7]=0,g[8]=m,g[9]=M,g[10]=-v,g[11]=0,g[12]=0,g[13]=0,g[14]=0,g[15]=1,n.multiply(g,n.translateMatrix(-t,-r,-e))},n.rotateMatrix=function(t,r,e,a){var i=Math.PI*t/180,o=Math.sin(i),u=Math.cos(i);if(0!==r&&0===e&&0===a)return r<0&&(o=-o),n.rotateXMatrix(o,u);if(0===r&&0!==e&&0===a)return e<0&&(o=-o),n.rotateYMatrix(o,u);if(0===r&&0===e&&0!==a)return a<0&&(o=-o),n.rotateZMatrix(o,u);var l=new Float32Array(16);return len=Math.sqrt(r*r+e*e+a*a),1!==len&&(rlen=1/len,r*=rlen,e*=rlen,a*=rlen),nc=1-u,xy=r*e,yz=e*a,zx=a*r,xs=r*o,ys=e*o,zs=a*o,l[0]=r*r*nc+u,l[1]=xy*nc+zs,l[2]=zx*nc-ys,l[3]=0,l[4]=xy*nc-zs,l[5]=e*e*nc+u,l[6]=yz*nc+xs,l[7]=0,l[8]=zx*nc+ys,l[9]=yz*nc-xs,l[10]=a*a*nc+u,l[11]=0,l[12]=0,l[13]=0,l[14]=0,l[15]=1,l},n.translateMatrix=function(t,r,e){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,t,r,e,1])},n.scaleMatrix=function(t,r,e){return new Float32Array([t,0,0,0,0,r,0,0,0,0,e,0,0,0,0,1])},n.unitMatrix4=function(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])},n.rotateXMatrix=function(t,r){return new Float32Array([1,0,0,0,0,r,t,0,0,-t,r,0,0,0,0,1])},n.rotateYMatrix=function(t,r){return new Float32Array([r,0,-t,0,0,1,0,0,t,0,r,0,0,0,0,1])},n.rotateZMatrix=function(t,r){return new Float32Array([r,t,0,0,-t,r,0,0,0,0,1,0,0,0,0,1])},n.add=function(t,r){var e=t.length,n=r.length;if(e!=n)throw"矩阵1和矩阵2长度不一致";for(var a=new Float32Array(e),i=0;i<e;i++)a[i]=t[i]+r[i];return a},n.subtract=function(t,r){for(var e=new Float32Array(16),n=0;n<16;n++)e[n]=t[n]-r[n];return e},n.multiply=function(t,r){var e=new Float32Array(16);return e[0]=t[0]*r[0]+t[4]*r[1]+t[8]*r[2]+t[12]*r[3],e[4]=t[0]*r[4]+t[4]*r[5]+t[8]*r[6]+t[12]*r[7],e[8]=t[0]*r[8]+t[4]*r[9]+t[8]*r[10]+t[12]*r[11],e[12]=t[0]*r[12]+t[4]*r[13]+t[8]*r[14]+t[12]*r[15],e[1]=t[1]*r[0]+t[5]*r[1]+t[9]*r[2]+t[13]*r[3],e[5]=t[1]*r[4]+t[5]*r[5]+t[9]*r[6]+t[13]*r[7],e[9]=t[1]*r[8]+t[5]*r[9]+t[9]*r[10]+t[13]*r[11],e[13]=t[1]*r[12]+t[5]*r[13]+t[9]*r[14]+t[13]*r[15],e[2]=t[2]*r[0]+t[6]*r[1]+t[10]*r[2]+t[14]*r[3],e[6]=t[2]*r[4]+t[6]*r[5]+t[10]*r[6]+t[14]*r[7],e[10]=t[2]*r[8]+t[6]*r[9]+t[10]*r[10]+t[14]*r[11],e[14]=t[2]*r[12]+t[6]*r[13]+t[10]*r[14]+t[14]*r[15],e[3]=t[3]*r[0]+t[7]*r[1]+t[11]*r[2]+t[15]*r[3],e[7]=t[3]*r[4]+t[7]*r[5]+t[11]*r[6]+t[15]*r[7],e[11]=t[3]*r[8]+t[7]*r[9]+t[11]*r[10]+t[15]*r[11],e[15]=t[3]*r[12]+t[7]*r[13]+t[11]*r[14]+t[15]*r[15],e};var a=function(){var t=this;this.init=function(r){return t.matrix=r||n.unitMatrix4(),t},this.multiply=function(r){t.matrix=n.multiply(t.matrix,r)},this.rotate=function(r,e,a,i){return t.matrix=n.multiply(n.rotateMatrix(r,e,a,i),t.matrix),t},this.rotate4=function(r,e,n){return t.translate(-n.x,-n.y,-n.z),t.rotate(r,e.x,e.y,e.z),t.translate(n.x,n.y,n.z),t},this.translate=function(r,e,a){return t.matrix=n.multiply(n.translateMatrix(r,e,a),t.matrix),t},this.scale=function(r,e,a){return t.matrix=n.multiply(n.scaleMatrix(r,e,a),t.matrix),t},this.view=function(r,e,a,i,o,u,l,c,f){return t.matrix=n.multiply(n.viewMatrix(r,e,a,i,o,u,l,c,f),t.matrix),t},this.ortho=function(r,e,a,i,o,u){return t.matrix=n.multiply(n.orthoMatrix(r,e,a,i,o,u),t.matrix),t},this.perspective=function(r,e,a,i){return t.matrix=n.multiply(n.perspectiveMatrix(r,e,a,i),t.matrix),t},this.transpose=function(){var r=void 0,e=void 0;return r=t.matrix,e=r[1],r[1]=r[4],r[4]=e,e=r[2],r[2]=r[8],r[8]=e,e=r[3],r[3]=r[12],r[12]=e,e=r[6],r[6]=r[9],r[9]=e,e=r[7],r[7]=r[13],r[13]=e,e=r[11],r[11]=r[14],r[14]=e,t},this.setOrtho=function(r,e,a,i,o,u){return t.matrix=n.orthoMatrix(r,e,a,i,o,u),t},this.setRotate=function(r,e,a,i){return t.matrix=n.rotateMatrix(r,e,a,i),t},this.setTranslate=function(r,e,a){return t.matrix=n.translateMatrix(r,e,a),t},this.setScale=function(r,e,a){return t.matrix=n.scaleMatrix(r,e,a),t},this.setView=function(r,e,a,i,o,u,l,c,f){return t.matrix=n.viewMatrix(r,e,a,i,o,u,l,c,f),t},this.setPerspective=function(r,e,a,i){return t.matrix=n.perspectiveMatrix(r,e,a,i),t},this.setInverseOf=function(r){var e=n.inverseOf(r);return e&&(t.matrix=e),t}};t.exports=n},302:function(t,r,e){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}function a(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}function i(t,r){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?t:r}function o(t,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);t.prototype=Object.create(r&&r.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(t,r):t.__proto__=r)}var u=function(){function t(t,r){for(var e=0;e<r.length;e++){var n=r[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(r,e,n){return e&&t(r.prototype,e),n&&t(r,n),r}}(),l=e(1),c=n(l),f=e(12),s=n(f),v=e(9),d=e(14),h=n(d),x="\n    attribute vec4 a_Position;\n    attribute vec4 a_Color;\n    uniform mat4 u_ViewMatrix;\n    varying vec4 v_Color;\n    void main(){\n        gl_Position = u_ViewMatrix * a_Position;\n        v_Color = a_Color;\n    }\n",m="\n    precision mediump float;\n    varying vec4 v_Color;\n    void main(){\n        gl_FragColor = v_Color;\n    }\n",y=function(t){function r(t){a(this,r);var e=i(this,Object.getPrototypeOf(r).call(this,t));return e.handleKeyDown=function(t,r,n,a,i,o){if(39==t.keyCode)o.x+=.01;else{if(37!=t.keyCode)return;o.x-=.01}e.draw(r,n,a,i,o)},e.draw=function(t,r,e,n,a){var i=a.x,o=a.y,u=a.z;n.setView(i,o,u,0,0,0,0,1,0),t.uniformMatrix4fv(e,!1,n.matrix),t.clear(t.COLOR_BUFFER_BIT),t.drawArrays(t.TRIANGLES,0,r)},e}return o(r,t),u(r,[{key:"componentDidMount",value:function(){var t=this;try{!function(){var r=s["default"].findDOMNode(t.refs.canvas);r.width=800,r.height=600;var e=r.getContext("webgl");if(!(0,v.initShaders)(e,x,m))throw"Faild to init Shaders";var n=t.initVertexBuffer(e),a=e.getUniformLocation(e.program,"u_ViewMatrix");if(!a)throw"can not find storage location of u_ViewMatrix";var i=new h["default"],o={x:.2,y:.25,z:.25};t.handleKeyDownWrap=function(r){t.handleKeyDown(r,e,n,a,i,o)},document.addEventListener("keydown",t.handleKeyDownWrap),e.clearColor(0,0,0,1),t.draw(e,n,a,i,o)}()}catch(r){console.log(r)}}},{key:"componentWillUnmount",value:function(){document.removeEventListener("keydown",this.handleKeyDownWrap)}},{key:"initVertexBuffer",value:function(t){var r=new Float32Array([0,.5,-.4,.4,1,.4,-.5,-.5,-.4,.4,1,.4,.5,-.5,-.4,1,.4,.4,.5,.4,-.2,1,.4,.4,-.5,.5,-.2,1,1,.4,0,.6,-.2,1,1,.4,0,.5,0,.4,.4,1,-.5,-.5,0,.4,.4,1,.5,-.5,0,1,.4,.4]),e=r.BYTES_PER_ELEMENT,n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,r,t.STATIC_DRAW);var a=t.getAttribLocation(t.program,"a_Position");if(a<0)throw"can not find storage location of a_Position";t.vertexAttribPointer(a,3,t.FLOAT,!1,6*e,0),t.enableVertexAttribArray(a);var i=t.getAttribLocation(t.program,"a_Color");if(a<0)throw"can not find storage location of a_Color";return t.vertexAttribPointer(i,3,t.FLOAT,!1,6*e,3*e),t.enableVertexAttribArray(i),9}},{key:"render",value:function(){return c["default"].createElement("figure",null,c["default"].createElement("figcaption",null,"改变观察者视点"),c["default"].createElement("canvas",{ref:"canvas"},"your current brower don't support canvas,please change another one"))}}]),r}(c["default"].Component);t.exports=y}});