webpackJsonp([32],{9:function(t,r){"use strict";function e(t,r,e){var o=n(t,r,e);return o?(t.useProgram(o),t.program=o,!0):(console.log("Failed to create program"),!1)}function n(t,r,e){var n=o(t,t.VERTEX_SHADER,r),i=o(t,t.FRAGMENT_SHADER,e);if(!n||!i)return null;var a=t.createProgram();if(!a)return null;t.attachShader(a,n),t.attachShader(a,i),t.linkProgram(a);var u=t.getProgramParameter(a,t.LINK_STATUS);if(!u){var l=t.getProgramInfoLog(a);return console.log("Failed to link program: "+l),t.deleteProgram(a),t.deleteShader(i),t.deleteShader(n),null}return a}function o(t,r,e){var n=t.createShader(r);if(null==n)return console.log("unable to create shader"),null;t.shaderSource(n,e),t.compileShader(n);var o=t.getShaderParameter(n,t.COMPILE_STATUS);if(!o){var i=t.getShaderInfoLog(n);return console.log("Failed to compile shader: "+i),t.deleteShader(n),null}return n}Object.defineProperty(r,"__esModule",{value:!0}),r.initShaders=e},14:function(t,r){"use strict";function e(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}var n=function i(t){e(this,i),o.call(this),this.matrix=t||i.unitMatrix4()};n.inverseOf=function(t){var r=void 0,e=void 0,n=void 0,o=void 0,i=void 0;if(e=t.matrix,n=new Float32Array(16),o=new Float32Array(16),o[0]=e[5]*e[10]*e[15]-e[5]*e[11]*e[14]-e[9]*e[6]*e[15]+e[9]*e[7]*e[14]+e[13]*e[6]*e[11]-e[13]*e[7]*e[10],o[4]=-e[4]*e[10]*e[15]+e[4]*e[11]*e[14]+e[8]*e[6]*e[15]-e[8]*e[7]*e[14]-e[12]*e[6]*e[11]+e[12]*e[7]*e[10],o[8]=e[4]*e[9]*e[15]-e[4]*e[11]*e[13]-e[8]*e[5]*e[15]+e[8]*e[7]*e[13]+e[12]*e[5]*e[11]-e[12]*e[7]*e[9],o[12]=-e[4]*e[9]*e[14]+e[4]*e[10]*e[13]+e[8]*e[5]*e[14]-e[8]*e[6]*e[13]-e[12]*e[5]*e[10]+e[12]*e[6]*e[9],o[1]=-e[1]*e[10]*e[15]+e[1]*e[11]*e[14]+e[9]*e[2]*e[15]-e[9]*e[3]*e[14]-e[13]*e[2]*e[11]+e[13]*e[3]*e[10],o[5]=e[0]*e[10]*e[15]-e[0]*e[11]*e[14]-e[8]*e[2]*e[15]+e[8]*e[3]*e[14]+e[12]*e[2]*e[11]-e[12]*e[3]*e[10],o[9]=-e[0]*e[9]*e[15]+e[0]*e[11]*e[13]+e[8]*e[1]*e[15]-e[8]*e[3]*e[13]-e[12]*e[1]*e[11]+e[12]*e[3]*e[9],o[13]=e[0]*e[9]*e[14]-e[0]*e[10]*e[13]-e[8]*e[1]*e[14]+e[8]*e[2]*e[13]+e[12]*e[1]*e[10]-e[12]*e[2]*e[9],o[2]=e[1]*e[6]*e[15]-e[1]*e[7]*e[14]-e[5]*e[2]*e[15]+e[5]*e[3]*e[14]+e[13]*e[2]*e[7]-e[13]*e[3]*e[6],o[6]=-e[0]*e[6]*e[15]+e[0]*e[7]*e[14]+e[4]*e[2]*e[15]-e[4]*e[3]*e[14]-e[12]*e[2]*e[7]+e[12]*e[3]*e[6],o[10]=e[0]*e[5]*e[15]-e[0]*e[7]*e[13]-e[4]*e[1]*e[15]+e[4]*e[3]*e[13]+e[12]*e[1]*e[7]-e[12]*e[3]*e[5],o[14]=-e[0]*e[5]*e[14]+e[0]*e[6]*e[13]+e[4]*e[1]*e[14]-e[4]*e[2]*e[13]-e[12]*e[1]*e[6]+e[12]*e[2]*e[5],o[3]=-e[1]*e[6]*e[11]+e[1]*e[7]*e[10]+e[5]*e[2]*e[11]-e[5]*e[3]*e[10]-e[9]*e[2]*e[7]+e[9]*e[3]*e[6],o[7]=e[0]*e[6]*e[11]-e[0]*e[7]*e[10]-e[4]*e[2]*e[11]+e[4]*e[3]*e[10]+e[8]*e[2]*e[7]-e[8]*e[3]*e[6],o[11]=-e[0]*e[5]*e[11]+e[0]*e[7]*e[9]+e[4]*e[1]*e[11]-e[4]*e[3]*e[9]-e[8]*e[1]*e[7]+e[8]*e[3]*e[5],o[15]=e[0]*e[5]*e[10]-e[0]*e[6]*e[9]-e[4]*e[1]*e[10]+e[4]*e[2]*e[9]+e[8]*e[1]*e[6]-e[8]*e[2]*e[5],i=e[0]*o[0]+e[1]*o[4]+e[2]*o[8]+e[3]*o[12],0!==i){for(i=1/i,r=0;r<16;r++)n[r]=o[r]*i;return n}},n.perspectiveMatrix=function(t,r,e,n){var o=void 0,i=void 0,a=void 0,u=void 0;if(e===n||0===r)throw"null frustum";if(e<=0)throw"near <= 0";if(n<=0)throw"far <= 0";if(t=Math.PI*t/180/2,a=Math.sin(t),0===a)throw"null frustum";return i=1/(n-e),u=Math.cos(t)/a,o=new Float32Array(16),o[0]=u/r,o[1]=0,o[2]=0,o[3]=0,o[4]=0,o[5]=u,o[6]=0,o[7]=0,o[8]=0,o[9]=0,o[10]=-(n+e)*i,o[11]=-1,o[12]=0,o[13]=0,o[14]=-2*e*n*i,o[15]=0,o},n.orthoMatrix=function(t,r,e,n,o,i){var a=void 0,u=void 0,l=void 0,c=void 0;if(t===r||e===n||o===i)throw"null frustum";return u=1/(r-t),l=1/(n-e),c=1/(i-o),a=new Float32Array(16),a[0]=2*u,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=2*l,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=-2*c,a[11]=0,a[12]=-(r+t)*u,a[13]=-(n+e)*l,a[14]=-(i+o)*c,a[15]=1,a},n.viewMatrix=function(t,r,e,o,i,a,u,l,c){var f=void 0,s=void 0,v=void 0,m=void 0,h=void 0,d=void 0,y=void 0,p=void 0,x=void 0,g=void 0,_=void 0;f=o-t,s=i-r,v=a-e,m=1/Math.sqrt(f*f+s*s+v*v),f*=m,s*=m,v*=m,h=s*c-v*l,d=v*u-f*c,y=f*l-s*u,p=1/Math.sqrt(h*h+d*d+y*y),h*=p,d*=p,y*=p,x=d*v-y*s,g=y*f-h*v,_=h*s-d*f;var A=new Float32Array(16);return A[0]=h,A[1]=x,A[2]=-f,A[3]=0,A[4]=d,A[5]=g,A[6]=-s,A[7]=0,A[8]=y,A[9]=_,A[10]=-v,A[11]=0,A[12]=0,A[13]=0,A[14]=0,A[15]=1,n.multiply(A,n.translateMatrix(-t,-r,-e))},n.rotateMatrix=function(t,r,e,o){var i=Math.PI*t/180,a=Math.sin(i),u=Math.cos(i);if(0!==r&&0===e&&0===o)return r<0&&(a=-a),n.rotateXMatrix(a,u);if(0===r&&0!==e&&0===o)return e<0&&(a=-a),n.rotateYMatrix(a,u);if(0===r&&0===e&&0!==o)return o<0&&(a=-a),n.rotateZMatrix(a,u);var l=new Float32Array(16);return len=Math.sqrt(r*r+e*e+o*o),1!==len&&(rlen=1/len,r*=rlen,e*=rlen,o*=rlen),nc=1-u,xy=r*e,yz=e*o,zx=o*r,xs=r*a,ys=e*a,zs=o*a,l[0]=r*r*nc+u,l[1]=xy*nc+zs,l[2]=zx*nc-ys,l[3]=0,l[4]=xy*nc-zs,l[5]=e*e*nc+u,l[6]=yz*nc+xs,l[7]=0,l[8]=zx*nc+ys,l[9]=yz*nc-xs,l[10]=o*o*nc+u,l[11]=0,l[12]=0,l[13]=0,l[14]=0,l[15]=1,l},n.translateMatrix=function(t,r,e){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,t,r,e,1])},n.scaleMatrix=function(t,r,e){return new Float32Array([t,0,0,0,0,r,0,0,0,0,e,0,0,0,0,1])},n.unitMatrix4=function(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])},n.rotateXMatrix=function(t,r){return new Float32Array([1,0,0,0,0,r,t,0,0,-t,r,0,0,0,0,1])},n.rotateYMatrix=function(t,r){return new Float32Array([r,0,-t,0,0,1,0,0,t,0,r,0,0,0,0,1])},n.rotateZMatrix=function(t,r){return new Float32Array([r,t,0,0,-t,r,0,0,0,0,1,0,0,0,0,1])},n.add=function(t,r){var e=t.length,n=r.length;if(e!=n)throw"矩阵1和矩阵2长度不一致";for(var o=new Float32Array(e),i=0;i<e;i++)o[i]=t[i]+r[i];return o},n.subtract=function(t,r){for(var e=new Float32Array(16),n=0;n<16;n++)e[n]=t[n]-r[n];return e},n.multiply=function(t,r){var e=new Float32Array(16);return e[0]=t[0]*r[0]+t[4]*r[1]+t[8]*r[2]+t[12]*r[3],e[4]=t[0]*r[4]+t[4]*r[5]+t[8]*r[6]+t[12]*r[7],e[8]=t[0]*r[8]+t[4]*r[9]+t[8]*r[10]+t[12]*r[11],e[12]=t[0]*r[12]+t[4]*r[13]+t[8]*r[14]+t[12]*r[15],e[1]=t[1]*r[0]+t[5]*r[1]+t[9]*r[2]+t[13]*r[3],e[5]=t[1]*r[4]+t[5]*r[5]+t[9]*r[6]+t[13]*r[7],e[9]=t[1]*r[8]+t[5]*r[9]+t[9]*r[10]+t[13]*r[11],e[13]=t[1]*r[12]+t[5]*r[13]+t[9]*r[14]+t[13]*r[15],e[2]=t[2]*r[0]+t[6]*r[1]+t[10]*r[2]+t[14]*r[3],e[6]=t[2]*r[4]+t[6]*r[5]+t[10]*r[6]+t[14]*r[7],e[10]=t[2]*r[8]+t[6]*r[9]+t[10]*r[10]+t[14]*r[11],e[14]=t[2]*r[12]+t[6]*r[13]+t[10]*r[14]+t[14]*r[15],e[3]=t[3]*r[0]+t[7]*r[1]+t[11]*r[2]+t[15]*r[3],e[7]=t[3]*r[4]+t[7]*r[5]+t[11]*r[6]+t[15]*r[7],e[11]=t[3]*r[8]+t[7]*r[9]+t[11]*r[10]+t[15]*r[11],e[15]=t[3]*r[12]+t[7]*r[13]+t[11]*r[14]+t[15]*r[15],e};var o=function(){var t=this;this.init=function(r){return t.matrix=r||n.unitMatrix4(),t},this.multiply=function(r){t.matrix=n.multiply(t.matrix,r)},this.rotate=function(r,e,o,i){return t.matrix=n.multiply(n.rotateMatrix(r,e,o,i),t.matrix),t},this.rotate4=function(r,e,n){return t.translate(-n.x,-n.y,-n.z),t.rotate(r,e.x,e.y,e.z),t.translate(n.x,n.y,n.z),t},this.translate=function(r,e,o){return t.matrix=n.multiply(n.translateMatrix(r,e,o),t.matrix),t},this.scale=function(r,e,o){return t.matrix=n.multiply(n.scaleMatrix(r,e,o),t.matrix),t},this.view=function(r,e,o,i,a,u,l,c,f){return t.matrix=n.multiply(n.viewMatrix(r,e,o,i,a,u,l,c,f),t.matrix),t},this.ortho=function(r,e,o,i,a,u){return t.matrix=n.multiply(n.orthoMatrix(r,e,o,i,a,u),t.matrix),t},this.perspective=function(r,e,o,i){return t.matrix=n.multiply(n.perspectiveMatrix(r,e,o,i),t.matrix),t},this.transpose=function(){var r=void 0,e=void 0;return r=t.matrix,e=r[1],r[1]=r[4],r[4]=e,e=r[2],r[2]=r[8],r[8]=e,e=r[3],r[3]=r[12],r[12]=e,e=r[6],r[6]=r[9],r[9]=e,e=r[7],r[7]=r[13],r[13]=e,e=r[11],r[11]=r[14],r[14]=e,t},this.setOrtho=function(r,e,o,i,a,u){return t.matrix=n.orthoMatrix(r,e,o,i,a,u),t},this.setRotate=function(r,e,o,i){return t.matrix=n.rotateMatrix(r,e,o,i),t},this.setTranslate=function(r,e,o){return t.matrix=n.translateMatrix(r,e,o),t},this.setScale=function(r,e,o){return t.matrix=n.scaleMatrix(r,e,o),t},this.setView=function(r,e,o,i,a,u,l,c,f){return t.matrix=n.viewMatrix(r,e,o,i,a,u,l,c,f),t},this.setPerspective=function(r,e,o,i){return t.matrix=n.perspectiveMatrix(r,e,o,i),t},this.setInverseOf=function(r){var e=n.inverseOf(r);return e&&(t.matrix=e),t}};t.exports=n},100:function(t,r,e){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}function o(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0}),r.Vector4=r.Vector3=void 0;var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},a=e(7),u=n(a),l=(r.Vector3=function c(t){o(this,c),l.call(this);var r=new Float32Array(3);t&&u["default"].isArray(t)&&(r[0]=t[0],r[1]=t[1],r[2]=t[2]),this.elements=r},function(){var t=this;this.normalize=function(){var r=t.elements,e=r[0],n=r[1],o=r[2],i=Math.sqrt(e*e+n*n+o*o);return i?1==i?t:(i=1/i,r[0]=e*i,r[1]=n*i,r[2]=o*i,t):(r[0]=0,r[1]=0,r[2]=0,t)}});r.Vector4=function f(t){o(this,f);var r=new Float32Array(4);opt_src&&"object"===("undefined"==typeof opt_src?"undefined":i(opt_src))&&(r[0]=t[0],r[1]=t[1],r[2]=t[2],r[3]=t[3]),this.elements=r}},235:function(t,r,e){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}function o(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}function i(t,r){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?t:r}function a(t,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);t.prototype=Object.create(r&&r.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(t,r):t.__proto__=r)}var u=function(){function t(t,r){for(var e=0;e<r.length;e++){var n=r[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(r,e,n){return e&&t(r.prototype,e),n&&t(r,n),r}}(),l=e(1),c=n(l),f=e(12),s=n(f),v=e(9),m=e(100),h=e(14),d=n(h),y="\n    attribute vec4 a_Position;\n    attribute vec4 a_Color;\n    attribute vec4 a_Normal;\n    uniform mat4 u_MvpMatrix;\n    uniform vec3 u_LightColor;\n    uniform vec3 u_LightDirection;\n    uniform vec3 u_AmbientLight;\n    varying vec4 v_Color;\n    void main(){\n        gl_Position = u_MvpMatrix * a_Position;\n        vec3 normal = normalize(a_Normal.xyz);\n        float nDotL = max(dot(u_LightDirection, normal), 0.0);\n        vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n        vec3 ambient = u_AmbientLight * a_Color.rgb;\n        v_Color = vec4(diffuse + ambient, a_Color.a);\n    }\n",p="\n    precision mediump float;\n    varying vec4 v_Color;\n    void main(){\n        gl_FragColor = v_Color;\n    }\n",x=function(t){function r(){var t,e,n,a;o(this,r);for(var u=arguments.length,l=Array(u),c=0;c<u;c++)l[c]=arguments[c];return e=n=i(this,(t=Object.getPrototypeOf(r)).call.apply(t,[this].concat(l))),n.initVertexBuffers=function(t){var r=new Float32Array([1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,1,-1,-1,1,-1,-1,1,1,-1,1,1,-1,1,-1,-1,-1,-1,-1,-1,1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,-1,-1,-1,-1,1,-1,1,1,-1]),e=new Float32Array([1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0]),o=new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1]),i=new Uint8Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]),a=t.createBuffer();return a&&n.initArrayBuffer(t,r,3,t.FLOAT,"a_Position")&&n.initArrayBuffer(t,e,3,t.FLOAT,"a_Color")&&n.initArrayBuffer(t,o,3,t.FLOAT,"a_Normal")?(t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,a),t.bufferData(t.ELEMENT_ARRAY_BUFFER,i,t.STATIC_DRAW),i.length):-1},n.initArrayBuffer=function(t,r,e,n,o){var i=t.createBuffer();if(!i)return console.log("Failed to create the buffer object"),!1;t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,r,t.STATIC_DRAW);var a=t.getAttribLocation(t.program,o);return a<0?(console.log("Failed to get the storage location of "+o),!1):(t.vertexAttribPointer(a,e,n,!1,0,0),t.enableVertexAttribArray(a),!0)},a=e,i(n,a)}return a(r,t),u(r,[{key:"componentDidMount",value:function(){try{var t=s["default"].findDOMNode(this.refs.canvas);t.width=500,t.height=500;var r=t.getContext("webgl");if(!(0,v.initShaders)(r,y,p))return void console.log("Faild to init Shaders");var e=this.initVertexBuffers(r);if(e<0)return void console.log("Failed to set the vertex information");r.clearColor(0,0,0,1),r.enable(r.DEPTH_TEST);var n=r.getUniformLocation(r.program,"u_MvpMatrix"),o=r.getUniformLocation(r.program,"u_LightColor"),i=r.getUniformLocation(r.program,"u_LightDirection"),a=r.getUniformLocation(r.program,"u_AmbientLight");if(!(n&&o&&i&&a))return void console.log("Failed to get the storage location");r.uniform3f(o,1,1,1);var u=new m.Vector3([.5,3,4]);u.normalize(),r.uniform3fv(i,u.elements),r.uniform3f(a,.2,.2,.2);var l=new d["default"];l.setView(3,3,7,0,0,0,0,1,0).perspective(30,t.width/t.height,1,100),r.uniformMatrix4fv(n,!1,l.matrix),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),r.drawElements(r.TRIANGLES,e,r.UNSIGNED_BYTE,0)}catch(c){console.log(c)}}},{key:"render",value:function(){return c["default"].createElement("figure",null,c["default"].createElement("figcaption",null,"光照立方体"),c["default"].createElement("canvas",{ref:"canvas"},"your current brower don't support canvas,please change another one"))}}]),r}(c["default"].Component);t.exports=x}});