webpackJsonp([10],{

/***/ 310:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.initShaders = initShaders;
	/**
	 * Create a program object and make current
	 * @param gl GL context
	 * @param vshader a vertex shader program (string)
	 * @param fshader a fragment shader program (string)
	 * @return true, if the program object was created and successfully made current
	 */
	function initShaders(gl, vshader, fshader) {
	  var program = createProgram(gl, vshader, fshader);
	  if (!program) {
	    console.log('Failed to create program');
	    return false;
	  }
	
	  gl.useProgram(program);
	  gl.program = program;
	
	  return true;
	}
	
	/**
	 * Create the linked program object
	 * @param gl GL context
	 * @param vshader a vertex shader program (string)
	 * @param fshader a fragment shader program (string)
	 * @return created program object, or null if the creation has failed
	 */
	function createProgram(gl, vshader, fshader) {
	  // Create shader object
	  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
	  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
	  if (!vertexShader || !fragmentShader) {
	    return null;
	  }
	
	  // Create a program object
	  var program = gl.createProgram();
	  if (!program) {
	    return null;
	  }
	
	  // Attach the shader objects
	  gl.attachShader(program, vertexShader);
	  gl.attachShader(program, fragmentShader);
	
	  // Link the program object
	  gl.linkProgram(program);
	
	  // Check the result of linking
	  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	  if (!linked) {
	    var error = gl.getProgramInfoLog(program);
	    console.log('Failed to link program: ' + error);
	    gl.deleteProgram(program);
	    gl.deleteShader(fragmentShader);
	    gl.deleteShader(vertexShader);
	    return null;
	  }
	  return program;
	}
	
	/**
	 * Create a shader object
	 * @param gl GL context
	 * @param type the type of the shader object to be created
	 * @param source shader program (string)
	 * @return created shader object, or null if the creation has failed.
	 */
	function loadShader(gl, type, source) {
	  // Create shader object
	  var shader = gl.createShader(type);
	  if (shader == null) {
	    console.log('unable to create shader');
	    return null;
	  }
	
	  // Set the shader program
	  gl.shaderSource(shader, source);
	
	  // Compile the shader
	  gl.compileShader(shader);
	
	  // Check the result of compilation
	  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	  if (!compiled) {
	    var error = gl.getShaderInfoLog(shader);
	    console.log('Failed to compile shader: ' + error);
	    gl.deleteShader(shader);
	    return null;
	  }
	
	  return shader;
	}

/***/ },

/***/ 320:
/***/ function(module, exports) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Matrix4 = function Matrix4(matrix) {
	    _classCallCheck(this, Matrix4);
	
	    _initialiseProps.call(this);
	
	    this.matrix = matrix || Matrix4.unitMatrix4();
	}
	/**
	 * 求一个矩阵的逆矩阵
	 * @param  {Matrix4} matrix 矩阵
	 * @return {Float32Array}   矩阵数组
	 */
	
	/**
	 * 获取透视投影矩阵
	 * @param  fov    指定垂直视角，即可视空间顶面和底面间的夹角，必须大于0
	 * @param  aspect 指定近剪裁面的宽高比（宽度／高度）
	 * @param  near   指定近剪裁面的位置，即可视空间的近边界
	 * @param  far    指定远剪裁面的位置，即可视空间的远边界
	 * @return matrix 透视投影矩阵
	 */
	;
	
	Matrix4.inverseOf = function (matrix) {
	    var i = void 0,
	        s = void 0,
	        d = void 0,
	        inv = void 0,
	        det = void 0;
	
	    s = matrix.matrix;
	    d = new Float32Array(16);
	    inv = new Float32Array(16);
	
	    inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15] + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
	    inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15] - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
	    inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15] + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
	    inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14] - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];
	
	    inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15] - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
	    inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15] + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
	    inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15] - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
	    inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14] + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];
	
	    inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15] + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
	    inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15] - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
	    inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15] + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
	    inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14] - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];
	
	    inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11] - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
	    inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11] + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
	    inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11] - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
	    inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10] + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];
	
	    det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
	    if (det === 0) {
	        return;
	    }
	
	    det = 1 / det;
	    for (i = 0; i < 16; i++) {
	        d[i] = inv[i] * det;
	    }
	
	    return d;
	};
	
	Matrix4.perspectiveMatrix = function (fov, aspect, near, far) {
	    var matrix = void 0,
	        rd = void 0,
	        s = void 0,
	        ct = void 0;
	
	    if (near === far || aspect === 0) {
	        throw 'null frustum';
	    }
	    if (near <= 0) {
	        throw 'near <= 0';
	    }
	    if (far <= 0) {
	        throw 'far <= 0';
	    }
	
	    fov = Math.PI * fov / 180 / 2;
	    s = Math.sin(fov);
	    if (s === 0) {
	        throw 'null frustum';
	    }
	    rd = 1 / (far - near);
	    ct = Math.cos(fov) / s;
	
	    matrix = new Float32Array(16);
	
	    matrix[0] = ct / aspect;
	    matrix[1] = 0;
	    matrix[2] = 0;
	    matrix[3] = 0;
	
	    matrix[4] = 0;
	    matrix[5] = ct;
	    matrix[6] = 0;
	    matrix[7] = 0;
	
	    matrix[8] = 0;
	    matrix[9] = 0;
	    matrix[10] = -(far + near) * rd;
	    matrix[11] = -1;
	
	    matrix[12] = 0;
	    matrix[13] = 0;
	    matrix[14] = -2 * near * far * rd;
	    matrix[15] = 0;
	    return matrix;
	};
	
	Matrix4.orthoMatrix = function (left, right, bottom, top, near, far) {
	    var matrix = void 0,
	        rw = void 0,
	        rh = void 0,
	        rd = void 0;
	
	    if (left === right || bottom === top || near === far) {
	        throw 'null frustum';
	    }
	
	    rw = 1 / (right - left);
	    rh = 1 / (top - bottom);
	    rd = 1 / (far - near);
	
	    matrix = new Float32Array(16);
	
	    matrix[0] = 2 * rw;
	    matrix[1] = 0;
	    matrix[2] = 0;
	    matrix[3] = 0;
	
	    matrix[4] = 0;
	    matrix[5] = 2 * rh;
	    matrix[6] = 0;
	    matrix[7] = 0;
	
	    matrix[8] = 0;
	    matrix[9] = 0;
	    matrix[10] = -2 * rd;
	    matrix[11] = 0;
	
	    matrix[12] = -(right + left) * rw;
	    matrix[13] = -(top + bottom) * rh;
	    matrix[14] = -(far + near) * rd;
	    matrix[15] = 1;
	
	    return matrix;
	};
	
	Matrix4.viewMatrix = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
	    var e = void 0,
	        fx = void 0,
	        fy = void 0,
	        fz = void 0,
	        rlf = void 0,
	        sx = void 0,
	        sy = void 0,
	        sz = void 0,
	        rls = void 0,
	        ux = void 0,
	        uy = void 0,
	        uz = void 0;
	
	    fx = centerX - eyeX;
	    fy = centerY - eyeY;
	    fz = centerZ - eyeZ;
	
	    // Normalize f.
	    rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
	    fx *= rlf;
	    fy *= rlf;
	    fz *= rlf;
	
	    // Calculate cross product of f and up.
	    sx = fy * upZ - fz * upY;
	    sy = fz * upX - fx * upZ;
	    sz = fx * upY - fy * upX;
	
	    // Normalize s.
	    rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
	    sx *= rls;
	    sy *= rls;
	    sz *= rls;
	
	    // Calculate cross product of s and f.
	    ux = sy * fz - sz * fy;
	    uy = sz * fx - sx * fz;
	    uz = sx * fy - sy * fx;
	
	    var matrix = new Float32Array(16);
	    matrix[0] = sx;
	    matrix[1] = ux;
	    matrix[2] = -fx;
	    matrix[3] = 0;
	
	    matrix[4] = sy;
	    matrix[5] = uy;
	    matrix[6] = -fy;
	    matrix[7] = 0;
	
	    matrix[8] = sz;
	    matrix[9] = uz;
	    matrix[10] = -fz;
	    matrix[11] = 0;
	
	    matrix[12] = 0;
	    matrix[13] = 0;
	    matrix[14] = 0;
	    matrix[15] = 1;
	
	    return Matrix4.multiply(matrix, Matrix4.translateMatrix(-eyeX, -eyeY, -eyeZ));
	};
	
	Matrix4.rotateMatrix = function (angel, x, y, z) {
	    var radian = Math.PI * angel / 180.0;
	    var s = Math.sin(radian);
	    var c = Math.cos(radian);
	
	    if (x !== 0 && y === 0 && z === 0) {
	        if (x < 0) {
	            s = -s;
	        }
	        return Matrix4.rotateXMatrix(s, c);
	    }
	    if (x === 0 && y !== 0 && z === 0) {
	        if (y < 0) {
	            s = -s;
	        }
	        return Matrix4.rotateYMatrix(s, c);
	    }
	    if (x === 0 && y === 0 && z !== 0) {
	        if (z < 0) {
	            s = -s;
	        }
	        return Matrix4.rotateZMatrix(s, c);
	    }
	    var matrix = new Float32Array(16);
	    len = Math.sqrt(x * x + y * y + z * z);
	    if (len !== 1) {
	        rlen = 1 / len;
	        x *= rlen;
	        y *= rlen;
	        z *= rlen;
	    }
	    nc = 1 - c;
	    xy = x * y;
	    yz = y * z;
	    zx = z * x;
	    xs = x * s;
	    ys = y * s;
	    zs = z * s;
	
	    matrix[0] = x * x * nc + c;
	    matrix[1] = xy * nc + zs;
	    matrix[2] = zx * nc - ys;
	    matrix[3] = 0;
	
	    matrix[4] = xy * nc - zs;
	    matrix[5] = y * y * nc + c;
	    matrix[6] = yz * nc + xs;
	    matrix[7] = 0;
	
	    matrix[8] = zx * nc + ys;
	    matrix[9] = yz * nc - xs;
	    matrix[10] = z * z * nc + c;
	    matrix[11] = 0;
	
	    matrix[12] = 0;
	    matrix[13] = 0;
	    matrix[14] = 0;
	    matrix[15] = 1;
	
	    return matrix;
	};
	
	Matrix4.translateMatrix = function (x, y, z) {
	    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
	};
	
	Matrix4.scaleMatrix = function (Sx, Sy, Sz) {
	    return new Float32Array([Sx, 0, 0, 0, 0, Sy, 0, 0, 0, 0, Sz, 0, 0, 0, 0, 1]);
	};
	
	Matrix4.unitMatrix4 = function () {
	    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	};
	
	Matrix4.rotateXMatrix = function (s, c) {
	    return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
	};
	
	Matrix4.rotateYMatrix = function (s, c) {
	    return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
	};
	
	Matrix4.rotateZMatrix = function (s, c) {
	    return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	};
	
	Matrix4.add = function (matrix1, matrix2) {
	    var len1 = matrix1.length,
	        len2 = matrix2.length;
	    if (len1 != len2) {
	        throw '矩阵1和矩阵2长度不一致';
	    }
	    var matrix = new Float32Array(len1);
	    for (var i = 0; i < len1; i++) {
	        matrix[i] = matrix1[i] + matrix2[i];
	    }
	    return matrix;
	};
	
	Matrix4.subtract = function (matrix1, matrix2) {
	    var matrix = new Float32Array(16);
	    for (var i = 0; i < 16; i++) {
	        matrix[i] = matrix1[i] - matrix2[i];
	    }
	    return matrix;
	};
	
	Matrix4.multiply = function (matrix1, matrix2) {
	    var matrix = new Float32Array(16);
	
	    matrix[0] = matrix1[0] * matrix2[0] + matrix1[4] * matrix2[1] + matrix1[8] * matrix2[2] + matrix1[12] * matrix2[3];
	    matrix[4] = matrix1[0] * matrix2[4] + matrix1[4] * matrix2[5] + matrix1[8] * matrix2[6] + matrix1[12] * matrix2[7];
	    matrix[8] = matrix1[0] * matrix2[8] + matrix1[4] * matrix2[9] + matrix1[8] * matrix2[10] + matrix1[12] * matrix2[11];
	    matrix[12] = matrix1[0] * matrix2[12] + matrix1[4] * matrix2[13] + matrix1[8] * matrix2[14] + matrix1[12] * matrix2[15];
	
	    matrix[1] = matrix1[1] * matrix2[0] + matrix1[5] * matrix2[1] + matrix1[9] * matrix2[2] + matrix1[13] * matrix2[3];
	    matrix[5] = matrix1[1] * matrix2[4] + matrix1[5] * matrix2[5] + matrix1[9] * matrix2[6] + matrix1[13] * matrix2[7];
	    matrix[9] = matrix1[1] * matrix2[8] + matrix1[5] * matrix2[9] + matrix1[9] * matrix2[10] + matrix1[13] * matrix2[11];
	    matrix[13] = matrix1[1] * matrix2[12] + matrix1[5] * matrix2[13] + matrix1[9] * matrix2[14] + matrix1[13] * matrix2[15];
	
	    matrix[2] = matrix1[2] * matrix2[0] + matrix1[6] * matrix2[1] + matrix1[10] * matrix2[2] + matrix1[14] * matrix2[3];
	    matrix[6] = matrix1[2] * matrix2[4] + matrix1[6] * matrix2[5] + matrix1[10] * matrix2[6] + matrix1[14] * matrix2[7];
	    matrix[10] = matrix1[2] * matrix2[8] + matrix1[6] * matrix2[9] + matrix1[10] * matrix2[10] + matrix1[14] * matrix2[11];
	    matrix[14] = matrix1[2] * matrix2[12] + matrix1[6] * matrix2[13] + matrix1[10] * matrix2[14] + matrix1[14] * matrix2[15];
	
	    matrix[3] = matrix1[3] * matrix2[0] + matrix1[7] * matrix2[1] + matrix1[11] * matrix2[2] + matrix1[15] * matrix2[3];
	    matrix[7] = matrix1[3] * matrix2[4] + matrix1[7] * matrix2[5] + matrix1[11] * matrix2[6] + matrix1[15] * matrix2[7];
	    matrix[11] = matrix1[3] * matrix2[8] + matrix1[7] * matrix2[9] + matrix1[11] * matrix2[10] + matrix1[15] * matrix2[11];
	    matrix[15] = matrix1[3] * matrix2[12] + matrix1[7] * matrix2[13] + matrix1[11] * matrix2[14] + matrix1[15] * matrix2[15];
	
	    return matrix;
	};
	
	var _initialiseProps = function _initialiseProps() {
	    var _this = this;
	
	    this.init = function (matrix) {
	        _this.matrix = matrix || Matrix4.unitMatrix4();
	        return _this;
	    };
	
	    this.multiply = function (matrix) {
	        _this.matrix = Matrix4.multiply(_this.matrix, matrix);
	    };
	
	    this.rotate = function (angel, x, y, z) {
	        _this.matrix = Matrix4.multiply(Matrix4.rotateMatrix(angel, x, y, z), _this.matrix);
	        return _this;
	    };
	
	    this.rotate4 = function (angel, vector, dot) {
	        _this.translate(-dot.x, -dot.y, -dot.z);
	        _this.rotate(angel, vector.x, vector.y, vector.z);
	        _this.translate(dot.x, dot.y, dot.z);
	        return _this;
	    };
	
	    this.translate = function (x, y, z) {
	        _this.matrix = Matrix4.multiply(Matrix4.translateMatrix(x, y, z), _this.matrix);
	        return _this;
	    };
	
	    this.scale = function (Sx, Sy, Sz) {
	        _this.matrix = Matrix4.multiply(Matrix4.scaleMatrix(Sx, Sy, Sz), _this.matrix);
	        return _this;
	    };
	
	    this.view = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
	        _this.matrix = Matrix4.multiply(Matrix4.viewMatrix(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ), _this.matrix);
	        return _this;
	    };
	
	    this.ortho = function (left, right, bottom, top, near, far) {
	        _this.matrix = Matrix4.multiply(Matrix4.orthoMatrix(left, right, bottom, top, near, far), _this.matrix);
	        return _this;
	    };
	
	    this.perspective = function (fov, aspect, near, far) {
	        _this.matrix = Matrix4.multiply(Matrix4.perspectiveMatrix(fov, aspect, near, far), _this.matrix);
	        return _this;
	    };
	
	    this.transpose = function () {
	        var e = void 0,
	            t = void 0;
	
	        e = _this.matrix;
	
	        t = e[1];e[1] = e[4];e[4] = t;
	        t = e[2];e[2] = e[8];e[8] = t;
	        t = e[3];e[3] = e[12];e[12] = t;
	        t = e[6];e[6] = e[9];e[9] = t;
	        t = e[7];e[7] = e[13];e[13] = t;
	        t = e[11];e[11] = e[14];e[14] = t;
	
	        return _this;
	    };
	
	    this.setOrtho = function (left, right, bottom, top, near, far) {
	        _this.matrix = Matrix4.orthoMatrix(left, right, bottom, top, near, far);
	        return _this;
	    };
	
	    this.setRotate = function (angel, x, y, z) {
	        _this.matrix = Matrix4.rotateMatrix(angel, x, y, z);
	        return _this;
	    };
	
	    this.setTranslate = function (x, y, z) {
	        _this.matrix = Matrix4.translateMatrix(x, y, z);
	        return _this;
	    };
	
	    this.setScale = function (Sx, Sy, Sz) {
	        _this.matrix = Matrix4.scaleMatrix(Sx, Sy, Sz);
	        return _this;
	    };
	
	    this.setView = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
	        _this.matrix = Matrix4.viewMatrix(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
	        return _this;
	    };
	
	    this.setPerspective = function (fov, aspect, near, far) {
	        _this.matrix = Matrix4.perspectiveMatrix(fov, aspect, near, far);
	        return _this;
	    };
	
	    this.setInverseOf = function (matrix) {
	        var inverseMatrix = Matrix4.inverseOf(matrix);
	        if (inverseMatrix) {
	            _this.matrix = inverseMatrix;
	        }
	        return _this;
	    };
	};
	
	module.exports = Matrix4;

/***/ },

/***/ 335:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _WeBGLUtils = __webpack_require__(310);
	
	var _Matrix = __webpack_require__(320);
	
	var _Matrix2 = _interopRequireDefault(_Matrix);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var VSHADER_SOURCE = '\n    attribute vec4 a_Position;\n    attribute vec4 a_Color;\n    uniform mat4 u_ViewMatrix;\n    varying vec4 v_Color;\n    void main(){\n        gl_Position = u_ViewMatrix * a_Position;\n        v_Color = a_Color;\n    }\n';
	
	var FSHADER_SOURCE = '\n    precision mediump float;\n    varying vec4 v_Color;\n    void main(){\n        gl_FragColor = v_Color;\n    }\n';
	
	var LookAtTriangles = function (_React$Component) {
	    _inherits(LookAtTriangles, _React$Component);
	
	    function LookAtTriangles(props) {
	        _classCallCheck(this, LookAtTriangles);
	
	        return _possibleConstructorReturn(this, Object.getPrototypeOf(LookAtTriangles).call(this, props));
	    }
	
	    _createClass(LookAtTriangles, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            try {
	                var canvas = _reactDom2.default.findDOMNode(this.refs['canvas']);
	                canvas.width = 800;
	                canvas.height = 600;
	
	                var gl = canvas.getContext('webgl');
	                if (!(0, _WeBGLUtils.initShaders)(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	                    throw 'Faild to init Shaders';
	                }
	
	                var n = this.initVertexBuffer(gl);
	
	                var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
	                if (!u_ViewMatrix) {
	                    throw 'can not find storage location of u_ViewMatrix';
	                }
	
	                var viewMatrix = new _Matrix2.default();
	                viewMatrix.setView(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
	
	                gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.matrix);
	
	                gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	                gl.clear(gl.COLOR_BUFFER_BIT);
	
	                gl.drawArrays(gl.TRIANGLES, 0, n);
	            } catch (e) {
	                console.log(e);
	            }
	        }
	    }, {
	        key: 'initVertexBuffer',
	        value: function initVertexBuffer(gl) {
	            //顶点坐标和颜色
	            var vertexs = new Float32Array([0.0, 0.5, -0.4, 0.4, 1.0, 0.4, -0.5, -0.5, -0.4, 0.4, 1.0, 0.4, 0.5, -0.5, -0.4, 1.0, 0.4, 0.4, 0.5, 0.4, -0.2, 1.0, 0.4, 0.4, -0.5, 0.5, -0.2, 1.0, 1.0, 0.4, 0.0, 0.6, -0.2, 1.0, 1.0, 0.4, 0.0, 0.5, 0.0, 0.4, 0.4, 1.0, -0.5, -0.5, 0.0, 0.4, 0.4, 1.0, 0.5, -0.5, 0.0, 1.0, 0.4, 0.4]);
	            var FSIZE = vertexs.BYTES_PER_ELEMENT;
	
	            var vertexBuffer = gl.createBuffer();
	            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	            gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW);
	
	            //a_Position
	            var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	            if (a_Position < 0) {
	                throw 'can not find storage location of a_Position';
	            }
	            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
	            gl.enableVertexAttribArray(a_Position);
	
	            //a_Color
	            var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	            if (a_Position < 0) {
	                throw 'can not find storage location of a_Color';
	            }
	            gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
	            gl.enableVertexAttribArray(a_Color);
	            return 9;
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                'figure',
	                null,
	                _react2.default.createElement(
	                    'figcaption',
	                    null,
	                    '看三角形'
	                ),
	                _react2.default.createElement(
	                    'canvas',
	                    { ref: 'canvas' },
	                    'your current brower don\'t support canvas,please change another one'
	                )
	            );
	        }
	    }]);
	
	    return LookAtTriangles;
	}(_react2.default.Component);
	
	module.exports = LookAtTriangles;

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbGliL3dlYmdsL3V0aWxzLmpzPzVkMDcqKioqIiwid2VicGFjazovLy8uL3NyYy9saWIvd2ViZ2wvbWF0cml4NC5qcz8yNDk0Iiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC9sb29rQXRUcmlhbmdsZXMvTG9va0F0VHJpYW5nbGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7U0FPZ0IsVyxHQUFBLFc7QUFQaEI7Ozs7Ozs7QUFPTyxVQUFTLFdBQVQsQ0FBcUIsRUFBckIsRUFBeUIsT0FBekIsRUFBa0MsT0FBbEMsRUFBMkM7QUFDaEQsT0FBSSxVQUFVLGNBQWMsRUFBZCxFQUFrQixPQUFsQixFQUEyQixPQUEzQixDQUFkO0FBQ0EsT0FBSSxDQUFDLE9BQUwsRUFBYztBQUNaLGFBQVEsR0FBUixDQUFZLDBCQUFaO0FBQ0EsWUFBTyxLQUFQO0FBQ0Q7O0FBRUQsTUFBRyxVQUFILENBQWMsT0FBZDtBQUNBLE1BQUcsT0FBSCxHQUFhLE9BQWI7O0FBRUEsVUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxVQUFTLGFBQVQsQ0FBdUIsRUFBdkIsRUFBMkIsT0FBM0IsRUFBb0MsT0FBcEMsRUFBNkM7QUFDM0M7QUFDQSxPQUFJLGVBQWUsV0FBVyxFQUFYLEVBQWUsR0FBRyxhQUFsQixFQUFpQyxPQUFqQyxDQUFuQjtBQUNBLE9BQUksaUJBQWlCLFdBQVcsRUFBWCxFQUFlLEdBQUcsZUFBbEIsRUFBbUMsT0FBbkMsQ0FBckI7QUFDQSxPQUFJLENBQUMsWUFBRCxJQUFpQixDQUFDLGNBQXRCLEVBQXNDO0FBQ3BDLFlBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0EsT0FBSSxVQUFVLEdBQUcsYUFBSCxFQUFkO0FBQ0EsT0FBSSxDQUFDLE9BQUwsRUFBYztBQUNaLFlBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0EsTUFBRyxZQUFILENBQWdCLE9BQWhCLEVB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Y2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZSBhIHByb2dyYW0gb2JqZWN0IGFuZCBtYWtlIGN1cnJlbnRcbiAqIEBwYXJhbSBnbCBHTCBjb250ZXh0XG4gKiBAcGFyYW0gdnNoYWRlciBhIHZlcnRleCBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHBhcmFtIGZzaGFkZXIgYSBmcmFnbWVudCBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHJldHVybiB0cnVlLCBpZiB0aGUgcHJvZ3JhbSBvYmplY3Qgd2FzIGNyZWF0ZWQgYW5kIHN1Y2Nlc3NmdWxseSBtYWRlIGN1cnJlbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRTaGFkZXJzKGdsLCB2c2hhZGVyLCBmc2hhZGVyKSB7XG4gIHZhciBwcm9ncmFtID0gY3JlYXRlUHJvZ3JhbShnbCwgdnNoYWRlciwgZnNoYWRlcik7XG4gIGlmICghcHJvZ3JhbSkge1xuICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gY3JlYXRlIHByb2dyYW0nKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xuICBnbC5wcm9ncmFtID0gcHJvZ3JhbTtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgdGhlIGxpbmtlZCBwcm9ncmFtIG9iamVjdFxuICogQHBhcmFtIGdsIEdMIGNvbnRleHRcbiAqIEBwYXJhbSB2c2hhZGVyIGEgdmVydGV4IHNoYWRlciBwcm9ncmFtIChzdHJpbmcpXG4gKiBAcGFyYW0gZnNoYWRlciBhIGZyYWdtZW50IHNoYWRlciBwcm9ncmFtIChzdHJpbmcpXG4gKiBAcmV0dXJuIGNyZWF0ZWQgcHJvZ3JhbSBvYmplY3QsIG9yIG51bGwgaWYgdGhlIGNyZWF0aW9uIGhhcyBmYWlsZWRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlUHJvZ3JhbShnbCwgdnNoYWRlciwgZnNoYWRlcikge1xuICAvLyBDcmVhdGUgc2hhZGVyIG9iamVjdFxuICB2YXIgdmVydGV4U2hhZGVyID0gbG9hZFNoYWRlcihnbCwgZ2wuVkVSVEVYX1NIQURFUiwgdnNoYWRlcik7XG4gIHZhciBmcmFnbWVudFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wsIGdsLkZSQUdNRU5UX1NIQURFUiwgZnNoYWRlcik7XG4gIGlmICghdmVydGV4U2hhZGVyIHx8ICFmcmFnbWVudFNoYWRlcikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gQ3JlYXRlIGEgcHJvZ3JhbSBvYmplY3RcbiAgdmFyIHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gIGlmICghcHJvZ3JhbSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gQXR0YWNoIHRoZSBzaGFkZXIgb2JqZWN0c1xuICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdmVydGV4U2hhZGVyKTtcbiAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZyYWdtZW50U2hhZGVyKTtcblxuICAvLyBMaW5rIHRoZSBwcm9ncmFtIG9iamVjdFxuICBnbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcblxuICAvLyBDaGVjayB0aGUgcmVzdWx0IG9mIGxpbmtpbmdcbiAgdmFyIGxpbmtlZCA9IGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpO1xuICBpZiAoIWxpbmtlZCkge1xuICAgIHZhciBlcnJvciA9IGdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pO1xuICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gbGluayBwcm9ncmFtOiAnICsgZXJyb3IpO1xuICAgIGdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSk7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKGZyYWdtZW50U2hhZGVyKTtcbiAgICBnbC5kZWxldGVTaGFkZXIodmVydGV4U2hhZGVyKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gcHJvZ3JhbTtcbn1cblxuXG4vKipcbiAqIENyZWF0ZSBhIHNoYWRlciBvYmplY3RcbiAqIEBwYXJhbSBnbCBHTCBjb250ZXh0XG4gKiBAcGFyYW0gdHlwZSB0aGUgdHlwZSBvZiB0aGUgc2hhZGVyIG9iamVjdCB0byBiZSBjcmVhdGVkXG4gKiBAcGFyYW0gc291cmNlIHNoYWRlciBwcm9ncmFtIChzdHJpbmcpXG4gKiBAcmV0dXJuIGNyZWF0ZWQgc2hhZGVyIG9iamVjdCwgb3IgbnVsbCBpZiB0aGUgY3JlYXRpb24gaGFzIGZhaWxlZC5cbiAqL1xuZnVuY3Rpb24gbG9hZFNoYWRlcihnbCwgdHlwZSwgc291cmNlKSB7XG4gIC8vIENyZWF0ZSBzaGFkZXIgb2JqZWN0XG4gIHZhciBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodHlwZSk7XG4gIGlmIChzaGFkZXIgPT0gbnVsbCkge1xuICAgIGNvbnNvbGUubG9nKCd1bmFibGUgdG8gY3JlYXRlIHNoYWRlcicpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gU2V0IHRoZSBzaGFkZXIgcHJvZ3JhbVxuICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzb3VyY2UpO1xuXG4gIC8vIENvbXBpbGUgdGhlIHNoYWRlclxuICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XG5cbiAgLy8gQ2hlY2sgdGhlIHJlc3VsdCBvZiBjb21waWxhdGlvblxuICB2YXIgY29tcGlsZWQgPSBnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUyk7XG4gIGlmICghY29tcGlsZWQpIHtcbiAgICB2YXIgZXJyb3IgPSBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcik7XG4gICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBjb21waWxlIHNoYWRlcjogJyArIGVycm9yKTtcbiAgICBnbC5kZWxldGVTaGFkZXIoc2hhZGVyKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBzaGFkZXI7XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9saWIvd2ViZ2wvdXRpbHMuanNcbiAqKi8iLCJjbGFzcyBNYXRyaXg0IHtcbiAgICBjb25zdHJ1Y3RvcihtYXRyaXgpIHtcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXRyaXggfHwgTWF0cml4NC51bml0TWF0cml4NCgpXG4gICAgfVxuICAgIGluaXQgPSAobWF0cml4KT0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdHJpeCB8fCBNYXRyaXg0LnVuaXRNYXRyaXg0KClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgbXVsdGlwbHkgPSAobWF0cml4KSA9PiB7XG4gICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQubXVsdGlwbHkodGhpcy5tYXRyaXgsIG1hdHJpeClcbiAgICB9XG4gICAgcm90YXRlID0gKGFuZ2VsLHgseSx6KT0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQubXVsdGlwbHkoTWF0cml4NC5yb3RhdGVNYXRyaXgoYW5nZWwseCx5LHopLHRoaXMubWF0cml4KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICByb3RhdGU0ID0gKGFuZ2VsLHZlY3Rvcixkb3QpPT57XG4gICAgICAgIHRoaXMudHJhbnNsYXRlKC1kb3QueCwtZG90LnksLWRvdC56KVxuICAgICAgICB0aGlzLnJvdGF0ZShhbmdlbCx2ZWN0b3IueCx2ZWN0b3IueSx2ZWN0b3IueilcbiAgICAgICAgdGhpcy50cmFuc2xhdGUoZG90LngsZG90LnksZG90LnopXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHRyYW5zbGF0ZSA9ICh4LHkseik9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0Lm11bHRpcGx5KE1hdHJpeDQudHJhbnNsYXRlTWF0cml4KHgseSx6KSx0aGlzLm1hdHJpeClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgc2NhbGUgPSAoU3gsU3ksU3opPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseShNYXRyaXg0LnNjYWxlTWF0cml4KFN4LFN5LFN6KSx0aGlzLm1hdHJpeClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgdmlldyA9IChleWVYLCBleWVZLCBleWVaLCBjZW50ZXJYLCBjZW50ZXJZLCBjZW50ZXJaLCB1cFgsIHVwWSwgdXBaKSA9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0Lm11bHRpcGx5KE1hdHJpeDQudmlld01hdHJpeChleWVYLCBleWVZLCBleWVaLCBjZW50ZXJYLCBjZW50ZXJZLCBjZW50ZXJaLCB1cFgsIHVwWSwgdXBaKSx0aGlzLm1hdHJpeClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgb3J0aG8gPSAobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpID0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQubXVsdGlwbHkoTWF0cml4NC5vcnRob01hdHJpeChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhciksdGhpcy5tYXRyaXgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHBlcnNwZWN0aXZlID0gKGZvdiwgYXNwZWN0LCBuZWFyLCBmYXIpID0+IHtcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0Lm11bHRpcGx5KE1hdHJpeDQucGVyc3BlY3RpdmVNYXRyaXgoZm92LCBhc3BlY3QsIG5lYXIsIGZhciksdGhpcy5tYXRyaXgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHRyYW5zcG9zZSA9ICgpID0+IHtcbiAgICAgIGxldCBlLCB0XG5cbiAgICAgIGUgPSB0aGlzLm1hdHJpeFxuXG4gICAgICB0ID0gZVsgMV07ICBlWyAxXSA9IGVbIDRdOyAgZVsgNF0gPSB0O1xuICAgICAgdCA9IGVbIDJdOyAgZVsgMl0gPSBlWyA4XTsgIGVbIDhdID0gdDtcbiAgICAgIHQgPSBlWyAzXTsgIGVbIDNdID0gZVsxMl07ICBlWzEyXSA9IHQ7XG4gICAgICB0ID0gZVsgNl07ICBlWyA2XSA9IGVbIDldOyAgZVsgOV0gPSB0O1xuICAgICAgdCA9IGVbIDddOyAgZVsgN10gPSBlWzEzXTsgIGVbMTNdID0gdDtcbiAgICAgIHQgPSBlWzExXTsgIGVbMTFdID0gZVsxNF07ICBlWzE0XSA9IHQ7XG5cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHNldE9ydGhvID0gKGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSA9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0Lm9ydGhvTWF0cml4KGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2V0Um90YXRlID0gKGFuZ2VsLHgseSx6KT0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQucm90YXRlTWF0cml4KGFuZ2VsLHgseSx6KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBzZXRUcmFuc2xhdGUgPSAoeCx5LHopPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC50cmFuc2xhdGVNYXRyaXgoeCx5LHopXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHNldFNjYWxlID0gKFN4LFN5LFN6KT0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQuc2NhbGVNYXRyaXgoU3gsU3ksU3opXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHNldFZpZXcgPSAoZXllWCwgZXllWSwgZXllWiwgY2VudGVyWCwgY2VudGVyWSwgY2VudGVyWiwgdXBYLCB1cFksIHVwWik9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0LnZpZXdNYXRyaXgoZXllWCwgZXllWSwgZXllWiwgY2VudGVyWCwgY2VudGVyWSwgY2VudGVyWiwgdXBYLCB1cFksIHVwWilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBzZXRQZXJzcGVjdGl2ZSA9IChmb3YsIGFzcGVjdCwgbmVhciwgZmFyKSA9PiB7XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5wZXJzcGVjdGl2ZU1hdHJpeChmb3YsIGFzcGVjdCwgbmVhciwgZmFyKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBzZXRJbnZlcnNlT2YgPSAobWF0cml4KSA9PiB7XG4gICAgICBjb25zdCBpbnZlcnNlTWF0cml4ID0gTWF0cml4NC5pbnZlcnNlT2YobWF0cml4KVxuICAgICAgaWYgKGludmVyc2VNYXRyaXgpIHtcbiAgICAgICAgdGhpcy5tYXRyaXggPSBpbnZlcnNlTWF0cml4XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDmsYLkuIDkuKrnn6npmLXnmoTpgIbnn6npmLVcbiAgICAgKiBAcGFyYW0gIHtNYXRyaXg0fSBtYXRyaXgg55+p6Zi1XG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5fSAgIOefqemYteaVsOe7hFxuICAgICAqL1xuICAgIHN0YXRpYyBpbnZlcnNlT2YgPSAobWF0cml4KSA9PiB7XG4gICAgICBsZXQgaSwgcywgZCwgaW52LCBkZXRcblxuICAgICAgcyA9IG1hdHJpeC5tYXRyaXg7XG4gICAgICBkID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XG4gICAgICBpbnYgPSBuZXcgRmxvYXQzMkFycmF5KDE2KTtcblxuICAgICAgaW52WzBdICA9ICAgc1s1XSpzWzEwXSpzWzE1XSAtIHNbNV0gKnNbMTFdKnNbMTRdIC0gc1s5XSAqc1s2XSpzWzE1XVxuICAgICAgICAgICAgICAgICsgc1s5XSpzWzddICpzWzE0XSArIHNbMTNdKnNbNl0gKnNbMTFdIC0gc1sxM10qc1s3XSpzWzEwXTtcbiAgICAgIGludls0XSAgPSAtIHNbNF0qc1sxMF0qc1sxNV0gKyBzWzRdICpzWzExXSpzWzE0XSArIHNbOF0gKnNbNl0qc1sxNV1cbiAgICAgICAgICAgICAgICAtIHNbOF0qc1s3XSAqc1sxNF0gLSBzWzEyXSpzWzZdICpzWzExXSArIHNbMTJdKnNbN10qc1sxMF07XG4gICAgICBpbnZbOF0gID0gICBzWzRdKnNbOV0gKnNbMTVdIC0gc1s0XSAqc1sxMV0qc1sxM10gLSBzWzhdICpzWzVdKnNbMTVdXG4gICAgICAgICAgICAgICAgKyBzWzhdKnNbN10gKnNbMTNdICsgc1sxMl0qc1s1XSAqc1sxMV0gLSBzWzEyXSpzWzddKnNbOV07XG4gICAgICBpbnZbMTJdID0gLSBzWzRdKnNbOV0gKnNbMTRdICsgc1s0XSAqc1sxMF0qc1sxM10gKyBzWzhdICpzWzVdKnNbMTRdXG4gICAgICAgICAgICAgICAgLSBzWzhdKnNbNl0gKnNbMTNdIC0gc1sxMl0qc1s1XSAqc1sxMF0gKyBzWzEyXSpzWzZdKnNbOV07XG5cbiAgICAgIGludlsxXSAgPSAtIHNbMV0qc1sxMF0qc1sxNV0gKyBzWzFdICpzWzExXSpzWzE0XSArIHNbOV0gKnNbMl0qc1sxNV1cbiAgICAgICAgICAgICAgICAtIHNbOV0qc1szXSAqc1sxNF0gLSBzWzEzXSpzWzJdICpzWzExXSArIHNbMTNdKnNbM10qc1sxMF07XG4gICAgICBpbnZbNV0gID0gICBzWzBdKnNbMTBdKnNbMTVdIC0gc1swXSAqc1sxMV0qc1sxNF0gLSBzWzhdICpzWzJdKnNbMTVdXG4gICAgICAgICAgICAgICAgKyBzWzhdKnNbM10gKnNbMTRdICsgc1sxMl0qc1syXSAqc1sxMV0gLSBzWzEyXSpzWzNdKnNbMTBdO1xuICAgICAgaW52WzldICA9IC0gc1swXSpzWzldICpzWzE1XSArIHNbMF0gKnNbMTFdKnNbMTNdICsgc1s4XSAqc1sxXSpzWzE1XVxuICAgICAgICAgICAgICAgIC0gc1s4XSpzWzNdICpzWzEzXSAtIHNbMTJdKnNbMV0gKnNbMTFdICsgc1sxMl0qc1szXSpzWzldO1xuICAgICAgaW52WzEzXSA9ICAgc1swXSpzWzldICpzWzE0XSAtIHNbMF0gKnNbMTBdKnNbMTNdIC0gc1s4XSAqc1sxXSpzWzE0XVxuICAgICAgICAgICAgICAgICsgc1s4XSpzWzJdICpzWzEzXSArIHNbMTJdKnNbMV0gKnNbMTBdIC0gc1sxMl0qc1syXSpzWzldO1xuXG4gICAgICBpbnZbMl0gID0gICBzWzFdKnNbNl0qc1sxNV0gLSBzWzFdICpzWzddKnNbMTRdIC0gc1s1XSAqc1syXSpzWzE1XVxuICAgICAgICAgICAgICAgICsgc1s1XSpzWzNdKnNbMTRdICsgc1sxM10qc1syXSpzWzddICAtIHNbMTNdKnNbM10qc1s2XTtcbiAgICAgIGludls2XSAgPSAtIHNbMF0qc1s2XSpzWzE1XSArIHNbMF0gKnNbN10qc1sxNF0gKyBzWzRdICpzWzJdKnNbMTVdXG4gICAgICAgICAgICAgICAgLSBzWzRdKnNbM10qc1sxNF0gLSBzWzEyXSpzWzJdKnNbN10gICsgc1sxMl0qc1szXSpzWzZdO1xuICAgICAgaW52WzEwXSA9ICAgc1swXSpzWzVdKnNbMTVdIC0gc1swXSAqc1s3XSpzWzEzXSAtIHNbNF0gKnNbMV0qc1sxNV1cbiAgICAgICAgICAgICAgICArIHNbNF0qc1szXSpzWzEzXSArIHNbMTJdKnNbMV0qc1s3XSAgLSBzWzEyXSpzWzNdKnNbNV07XG4gICAgICBpbnZbMTRdID0gLSBzWzBdKnNbNV0qc1sxNF0gKyBzWzBdICpzWzZdKnNbMTNdICsgc1s0XSAqc1sxXSpzWzE0XVxuICAgICAgICAgICAgICAgIC0gc1s0XSpzWzJdKnNbMTNdIC0gc1sxMl0qc1sxXSpzWzZdICArIHNbMTJdKnNbMl0qc1s1XTtcblxuICAgICAgaW52WzNdICA9IC0gc1sxXSpzWzZdKnNbMTFdICsgc1sxXSpzWzddKnNbMTBdICsgc1s1XSpzWzJdKnNbMTFdXG4gICAgICAgICAgICAgICAgLSBzWzVdKnNbM10qc1sxMF0gLSBzWzldKnNbMl0qc1s3XSAgKyBzWzldKnNbM10qc1s2XTtcbiAgICAgIGludls3XSAgPSAgIHNbMF0qc1s2XSpzWzExXSAtIHNbMF0qc1s3XSpzWzEwXSAtIHNbNF0qc1syXSpzWzExXVxuICAgICAgICAgICAgICAgICsgc1s0XSpzWzNdKnNbMTBdICsgc1s4XSpzWzJdKnNbN10gIC0gc1s4XSpzWzNdKnNbNl07XG4gICAgICBpbnZbMTFdID0gLSBzWzBdKnNbNV0qc1sxMV0gKyBzWzBdKnNbN10qc1s5XSAgKyBzWzRdKnNbMV0qc1sxMV1cbiAgICAgICAgICAgICAgICAtIHNbNF0qc1szXSpzWzldICAtIHNbOF0qc1sxXSpzWzddICArIHNbOF0qc1szXSpzWzVdO1xuICAgICAgaW52WzE1XSA9ICAgc1swXSpzWzVdKnNbMTBdIC0gc1swXSpzWzZdKnNbOV0gIC0gc1s0XSpzWzFdKnNbMTBdXG4gICAgICAgICAgICAgICAgKyBzWzRdKnNbMl0qc1s5XSAgKyBzWzhdKnNbMV0qc1s2XSAgLSBzWzhdKnNbMl0qc1s1XTtcblxuICAgICAgZGV0ID0gc1swXSppbnZbMF0gKyBzWzFdKmludls0XSArIHNbMl0qaW52WzhdICsgc1szXSppbnZbMTJdO1xuICAgICAgaWYgKGRldCA9PT0gMCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgZGV0ID0gMSAvIGRldDtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICAgIGRbaV0gPSBpbnZbaV0gKiBkZXQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkXG4gICAgfVxuICAgIC8qKlxuICAgICAqIOiOt+WPlumAj+inhuaKleW9seefqemYtVxuICAgICAqIEBwYXJhbSAgZm92ICAgIOaMh+WumuWeguebtOinhuinku+8jOWNs+WPr+inhuepuumXtOmhtumdouWSjOW6lemdoumXtOeahOWkueinku+8jOW/hemhu+Wkp+S6jjBcbiAgICAgKiBAcGFyYW0gIGFzcGVjdCDmjIflrprov5Hliaroo4HpnaLnmoTlrr3pq5jmr5TvvIjlrr3luqbvvI/pq5jluqbvvIlcbiAgICAgKiBAcGFyYW0gIG5lYXIgICDmjIflrprov5Hliaroo4HpnaLnmoTkvY3nva7vvIzljbPlj6/op4bnqbrpl7TnmoTov5HovrnnlYxcbiAgICAgKiBAcGFyYW0gIGZhciAgICDmjIflrprov5zliaroo4HpnaLnmoTkvY3nva7vvIzljbPlj6/op4bnqbrpl7TnmoTov5zovrnnlYxcbiAgICAgKiBAcmV0dXJuIG1hdHJpeCDpgI/op4bmipXlvbHnn6npmLVcbiAgICAgKi9cbiAgICBzdGF0aWMgcGVyc3BlY3RpdmVNYXRyaXggPSAoZm92LCBhc3BlY3QsIG5lYXIsIGZhcikgPT4ge1xuICAgICAgICBsZXQgbWF0cml4LCByZCwgcywgY3RcblxuICAgICAgICBpZiAobmVhciA9PT0gZmFyIHx8IGFzcGVjdCA9PT0gMCkge1xuICAgICAgICAgIHRocm93ICdudWxsIGZydXN0dW0nXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5lYXIgPD0gMCkge1xuICAgICAgICAgIHRocm93ICduZWFyIDw9IDAnXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZhciA8PSAwKSB7XG4gICAgICAgICAgdGhyb3cgJ2ZhciA8PSAwJ1xuICAgICAgICB9XG5cbiAgICAgICAgZm92ID0gTWF0aC5QSSAqIGZvdiAvIDE4MCAvIDJcbiAgICAgICAgcyA9IE1hdGguc2luKGZvdilcbiAgICAgICAgaWYgKHMgPT09IDApIHtcbiAgICAgICAgICB0aHJvdyAnbnVsbCBmcnVzdHVtJ1xuICAgICAgICB9XG4gICAgICAgIHJkID0gMSAvIChmYXIgLSBuZWFyKVxuICAgICAgICBjdCA9IE1hdGguY29zKGZvdikgLyBzXG5cbiAgICAgICAgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheSgxNilcblxuICAgICAgICBtYXRyaXhbMF0gID0gY3QgLyBhc3BlY3RcbiAgICAgICAgbWF0cml4WzFdICA9IDBcbiAgICAgICAgbWF0cml4WzJdICA9IDBcbiAgICAgICAgbWF0cml4WzNdICA9IDBcblxuICAgICAgICBtYXRyaXhbNF0gID0gMFxuICAgICAgICBtYXRyaXhbNV0gID0gY3RcbiAgICAgICAgbWF0cml4WzZdICA9IDBcbiAgICAgICAgbWF0cml4WzddICA9IDBcblxuICAgICAgICBtYXRyaXhbOF0gID0gMFxuICAgICAgICBtYXRyaXhbOV0gID0gMFxuICAgICAgICBtYXRyaXhbMTBdID0gLShmYXIgKyBuZWFyKSAqIHJkXG4gICAgICAgIG1hdHJpeFsxMV0gPSAtMVxuXG4gICAgICAgIG1hdHJpeFsxMl0gPSAwXG4gICAgICAgIG1hdHJpeFsxM10gPSAwXG4gICAgICAgIG1hdHJpeFsxNF0gPSAtMiAqIG5lYXIgKiBmYXIgKiByZFxuICAgICAgICBtYXRyaXhbMTVdID0gMFxuICAgICAgICByZXR1cm4gbWF0cml4XG4gICAgfVxuICAgIHN0YXRpYyBvcnRob01hdHJpeCA9IChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhcikgPT4ge1xuICAgICAgICBsZXQgbWF0cml4LCBydywgcmgsIHJkO1xuXG4gICAgICAgIGlmIChsZWZ0ID09PSByaWdodCB8fCBib3R0b20gPT09IHRvcCB8fCBuZWFyID09PSBmYXIpIHtcbiAgICAgICAgICB0aHJvdyAnbnVsbCBmcnVzdHVtJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJ3ID0gMSAvIChyaWdodCAtIGxlZnQpO1xuICAgICAgICByaCA9IDEgLyAodG9wIC0gYm90dG9tKTtcbiAgICAgICAgcmQgPSAxIC8gKGZhciAtIG5lYXIpO1xuXG4gICAgICAgIG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpXG5cbiAgICAgICAgbWF0cml4WzBdICA9IDIgKiBydztcbiAgICAgICAgbWF0cml4WzFdICA9IDA7XG4gICAgICAgIG1hdHJpeFsyXSAgPSAwO1xuICAgICAgICBtYXRyaXhbM10gID0gMDtcblxuICAgICAgICBtYXRyaXhbNF0gID0gMDtcbiAgICAgICAgbWF0cml4WzVdICA9IDIgKiByaDtcbiAgICAgICAgbWF0cml4WzZdICA9IDA7XG4gICAgICAgIG1hdHJpeFs3XSAgPSAwO1xuXG4gICAgICAgIG1hdHJpeFs4XSAgPSAwO1xuICAgICAgICBtYXRyaXhbOV0gID0gMDtcbiAgICAgICAgbWF0cml4WzEwXSA9IC0yICogcmQ7XG4gICAgICAgIG1hdHJpeFsxMV0gPSAwO1xuXG4gICAgICAgIG1hdHJpeFsxMl0gPSAtKHJpZ2h0ICsgbGVmdCkgKiBydztcbiAgICAgICAgbWF0cml4WzEzXSA9IC0odG9wICsgYm90dG9tKSAqIHJoO1xuICAgICAgICBtYXRyaXhbMTRdID0gLShmYXIgKyBuZWFyKSAqIHJkO1xuICAgICAgICBtYXRyaXhbMTVdID0gMTtcblxuICAgICAgICByZXR1cm4gbWF0cml4XG4gICAgfVxuICAgIHN0YXRpYyB2aWV3TWF0cml4ID0gKGV5ZVgsIGV5ZVksIGV5ZVosIGNlbnRlclgsIGNlbnRlclksIGNlbnRlclosIHVwWCwgdXBZLCB1cFopPT57XG4gICAgICAgIGxldCBlLCBmeCwgZnksIGZ6LCBybGYsIHN4LCBzeSwgc3osIHJscywgdXgsIHV5LCB1elxuXG4gICAgICAgIGZ4ID0gY2VudGVyWCAtIGV5ZVhcbiAgICAgICAgZnkgPSBjZW50ZXJZIC0gZXllWVxuICAgICAgICBmeiA9IGNlbnRlclogLSBleWVaXG5cbiAgICAgICAgLy8gTm9ybWFsaXplIGYuXG4gICAgICAgIHJsZiA9IDEgLyBNYXRoLnNxcnQoZngqZnggKyBmeSpmeSArIGZ6KmZ6KVxuICAgICAgICBmeCAqPSBybGZcbiAgICAgICAgZnkgKj0gcmxmXG4gICAgICAgIGZ6ICo9IHJsZlxuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBjcm9zcyBwcm9kdWN0IG9mIGYgYW5kIHVwLlxuICAgICAgICBzeCA9IGZ5ICogdXBaIC0gZnogKiB1cFlcbiAgICAgICAgc3kgPSBmeiAqIHVwWCAtIGZ4ICogdXBaXG4gICAgICAgIHN6ID0gZnggKiB1cFkgLSBmeSAqIHVwWFxuXG4gICAgICAgIC8vIE5vcm1hbGl6ZSBzLlxuICAgICAgICBybHMgPSAxIC8gTWF0aC5zcXJ0KHN4KnN4ICsgc3kqc3kgKyBzeipzeilcbiAgICAgICAgc3ggKj0gcmxzXG4gICAgICAgIHN5ICo9IHJsc1xuICAgICAgICBzeiAqPSBybHNcblxuICAgICAgICAvLyBDYWxjdWxhdGUgY3Jvc3MgcHJvZHVjdCBvZiBzIGFuZCBmLlxuICAgICAgICB1eCA9IHN5ICogZnogLSBzeiAqIGZ5XG4gICAgICAgIHV5ID0gc3ogKiBmeCAtIHN4ICogZnpcbiAgICAgICAgdXogPSBzeCAqIGZ5IC0gc3kgKiBmeFxuXG4gICAgICAgIGxldCBtYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KDE2KVxuICAgICAgICBtYXRyaXhbMF0gPSBzeFxuICAgICAgICBtYXRyaXhbMV0gPSB1eFxuICAgICAgICBtYXRyaXhbMl0gPSAtZnhcbiAgICAgICAgbWF0cml4WzNdID0gMFxuXG4gICAgICAgIG1hdHJpeFs0XSA9IHN5XG4gICAgICAgIG1hdHJpeFs1XSA9IHV5XG4gICAgICAgIG1hdHJpeFs2XSA9IC1meVxuICAgICAgICBtYXRyaXhbN10gPSAwXG5cbiAgICAgICAgbWF0cml4WzhdID0gc3pcbiAgICAgICAgbWF0cml4WzldID0gdXpcbiAgICAgICAgbWF0cml4WzEwXSA9IC1melxuICAgICAgICBtYXRyaXhbMTFdID0gMFxuXG4gICAgICAgIG1hdHJpeFsxMl0gPSAwXG4gICAgICAgIG1hdHJpeFsxM10gPSAwXG4gICAgICAgIG1hdHJpeFsxNF0gPSAwXG4gICAgICAgIG1hdHJpeFsxNV0gPSAxXG5cbiAgICAgICAgcmV0dXJuIE1hdHJpeDQubXVsdGlwbHkobWF0cml4LE1hdHJpeDQudHJhbnNsYXRlTWF0cml4KC1leWVYLCAtZXllWSwgLWV5ZVopKVxuICAgIH1cbiAgICBzdGF0aWMgcm90YXRlTWF0cml4ID0gKGFuZ2VsLHgseSx6KSA9PiB7XG4gICAgICAgIGxldCByYWRpYW4gPSBNYXRoLlBJICogYW5nZWwgLyAxODAuMFxuICAgICAgICBsZXQgcyA9IE1hdGguc2luKHJhZGlhbilcbiAgICAgICAgbGV0IGMgPSBNYXRoLmNvcyhyYWRpYW4pXG5cbiAgICAgICAgaWYgKHghPT0wJiZ5PT09MCYmej09PTApIHtcbiAgICAgICAgICAgIGlmICh4IDwgMCkge1xuICAgICAgICAgICAgICBzID0gLXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBNYXRyaXg0LnJvdGF0ZVhNYXRyaXgocyxjKVxuICAgICAgICB9XG4gICAgICAgIGlmICh4PT09MCYmeSE9PTAmJno9PT0wKSB7XG4gICAgICAgICAgICBpZiAoeSA8IDApIHtcbiAgICAgICAgICAgICAgcyA9IC1zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTWF0cml4NC5yb3RhdGVZTWF0cml4KHMsYylcbiAgICAgICAgfVxuICAgICAgICBpZiAoeD09PTAmJnk9PT0wJiZ6IT09MCkge1xuICAgICAgICAgICAgaWYgKHo8MCkge1xuICAgICAgICAgICAgICAgIHMgPSAtc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE1hdHJpeDQucm90YXRlWk1hdHJpeChzLGMpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpXG4gICAgICAgIGxlbiA9IE1hdGguc3FydCh4KnggKyB5KnkgKyB6KnopXG4gICAgICAgIGlmIChsZW4gIT09IDEpIHtcbiAgICAgICAgICBybGVuID0gMSAvIGxlblxuICAgICAgICAgIHggKj0gcmxlblxuICAgICAgICAgIHkgKj0gcmxlblxuICAgICAgICAgIHogKj0gcmxlblxuICAgICAgICB9XG4gICAgICAgIG5jID0gMSAtIGNcbiAgICAgICAgeHkgPSB4ICogeVxuICAgICAgICB5eiA9IHkgKiB6XG4gICAgICAgIHp4ID0geiAqIHhcbiAgICAgICAgeHMgPSB4ICogc1xuICAgICAgICB5cyA9IHkgKiBzXG4gICAgICAgIHpzID0geiAqIHNcblxuICAgICAgICBtYXRyaXhbIDBdID0geCp4Km5jICsgIGNcbiAgICAgICAgbWF0cml4WyAxXSA9IHh5ICpuYyArIHpzXG4gICAgICAgIG1hdHJpeFsgMl0gPSB6eCAqbmMgLSB5c1xuICAgICAgICBtYXRyaXhbIDNdID0gMFxuXG4gICAgICAgIG1hdHJpeFsgNF0gPSB4eSAqbmMgLSB6c1xuICAgICAgICBtYXRyaXhbIDVdID0geSp5Km5jICsgIGNcbiAgICAgICAgbWF0cml4WyA2XSA9IHl6ICpuYyArIHhzXG4gICAgICAgIG1hdHJpeFsgN10gPSAwXG5cbiAgICAgICAgbWF0cml4WyA4XSA9IHp4ICpuYyArIHlzXG4gICAgICAgIG1hdHJpeFsgOV0gPSB5eiAqbmMgLSB4c1xuICAgICAgICBtYXRyaXhbMTBdID0geip6Km5jICsgIGNcbiAgICAgICAgbWF0cml4WzExXSA9IDBcblxuICAgICAgICBtYXRyaXhbMTJdID0gMFxuICAgICAgICBtYXRyaXhbMTNdID0gMFxuICAgICAgICBtYXRyaXhbMTRdID0gMFxuICAgICAgICBtYXRyaXhbMTVdID0gMVxuXG4gICAgICAgIHJldHVybiBtYXRyaXhcbiAgICB9XG4gICAgc3RhdGljIHRyYW5zbGF0ZU1hdHJpeCA9ICh4LHkseik9PntcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEsMCwwLDAsIDAsMSwwLDAsIDAsMCwxLDAsIHgseSx6LDFdKVxuICAgIH1cbiAgICBzdGF0aWMgc2NhbGVNYXRyaXggPSAoU3gsU3ksU3opPT57XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtTeCwwLDAsMCwgMCxTeSwwLDAsIDAsMCxTeiwwLCAwLDAsMCwxXSlcbiAgICB9XG4gICAgc3RhdGljIHVuaXRNYXRyaXg0ID0gKCk9PntcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEsMCwwLDAsIDAsMSwwLDAsIDAsMCwxLDAsIDAsMCwwLDFdKVxuICAgIH1cbiAgICBzdGF0aWMgcm90YXRlWE1hdHJpeCA9IChzLGMpPT57XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLDAsMCwwLCAwLGMscywwLCAwLC1zLGMsMCwgMCwwLDAsMV0pXG4gICAgfVxuICAgIHN0YXRpYyByb3RhdGVZTWF0cml4ID0gKHMsYyk9PntcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2MsMCwtcywwLCAwLDEsMCwwLCBzLDAsYywwLCAwLDAsMCwxXSlcbiAgICB9XG4gICAgc3RhdGljIHJvdGF0ZVpNYXRyaXggPSAocyxjKT0+e1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYyxzLDAsMCwgLXMsYywwLDAsIDAsMCwxLDAsIDAsMCwwLDFdKVxuICAgIH1cbiAgICBzdGF0aWMgYWRkID0gKG1hdHJpeDEsbWF0cml4Mik9PntcbiAgICAgICAgY29uc3QgbGVuMSA9IG1hdHJpeDEubGVuZ3RoLCBsZW4yID0gbWF0cml4Mi5sZW5ndGhcbiAgICAgICAgaWYgKGxlbjEgIT0gbGVuMikge1xuICAgICAgICAgICAgdGhyb3cgJ+efqemYtTHlkoznn6npmLUy6ZW/5bqm5LiN5LiA6Ie0J1xuICAgICAgICB9XG4gICAgICAgIGxldCBtYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KGxlbjEpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuMTsgaSsrKSB7XG4gICAgICAgICAgICBtYXRyaXhbaV0gPSBtYXRyaXgxW2ldICsgbWF0cml4MltpXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXRyaXhcbiAgICB9XG4gICAgc3RhdGljIHN1YnRyYWN0ID0gKG1hdHJpeDEsbWF0cml4Mik9PntcbiAgICAgICAgbGV0IG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKykge1xuICAgICAgICAgICAgbWF0cml4W2ldID0gbWF0cml4MVtpXSAtIG1hdHJpeDJbaV1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF0cml4XG4gICAgfVxuICAgIHN0YXRpYyBtdWx0aXBseSA9IChtYXRyaXgxLG1hdHJpeDIpPT57XG4gICAgICAgIGxldCBtYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KDE2KVxuXG4gICAgICAgIG1hdHJpeFswXSA9IG1hdHJpeDFbMF0qbWF0cml4MlswXSArIG1hdHJpeDFbNF0qbWF0cml4MlsxXSArIG1hdHJpeDFbOF0qbWF0cml4MlsyXSArIG1hdHJpeDFbMTJdKm1hdHJpeDJbM11cbiAgICAgICAgbWF0cml4WzRdID0gbWF0cml4MVswXSptYXRyaXgyWzRdICsgbWF0cml4MVs0XSptYXRyaXgyWzVdICsgbWF0cml4MVs4XSptYXRyaXgyWzZdICsgbWF0cml4MVsxMl0qbWF0cml4Mls3XVxuICAgICAgICBtYXRyaXhbOF0gPSBtYXRyaXgxWzBdKm1hdHJpeDJbOF0gKyBtYXRyaXgxWzRdKm1hdHJpeDJbOV0gKyBtYXRyaXgxWzhdKm1hdHJpeDJbMTBdICsgbWF0cml4MVsxMl0qbWF0cml4MlsxMV1cbiAgICAgICAgbWF0cml4WzEyXSA9IG1hdHJpeDFbMF0qbWF0cml4MlsxMl0gKyBtYXRyaXgxWzRdKm1hdHJpeDJbMTNdICsgbWF0cml4MVs4XSptYXRyaXgyWzE0XSArIG1hdHJpeDFbMTJdKm1hdHJpeDJbMTVdXG5cbiAgICAgICAgbWF0cml4WzFdID0gbWF0cml4MVsxXSptYXRyaXgyWzBdICsgbWF0cml4MVs1XSptYXRyaXgyWzFdICsgbWF0cml4MVs5XSptYXRyaXgyWzJdICsgbWF0cml4MVsxM10qbWF0cml4MlszXVxuICAgICAgICBtYXRyaXhbNV0gPSBtYXRyaXgxWzFdKm1hdHJpeDJbNF0gKyBtYXRyaXgxWzVdKm1hdHJpeDJbNV0gKyBtYXRyaXgxWzldKm1hdHJpeDJbNl0gKyBtYXRyaXgxWzEzXSptYXRyaXgyWzddXG4gICAgICAgIG1hdHJpeFs5XSA9IG1hdHJpeDFbMV0qbWF0cml4Mls4XSArIG1hdHJpeDFbNV0qbWF0cml4Mls5XSArIG1hdHJpeDFbOV0qbWF0cml4MlsxMF0gKyBtYXRyaXgxWzEzXSptYXRyaXgyWzExXVxuICAgICAgICBtYXRyaXhbMTNdID0gbWF0cml4MVsxXSptYXRyaXgyWzEyXSArIG1hdHJpeDFbNV0qbWF0cml4MlsxM10gKyBtYXRyaXgxWzldKm1hdHJpeDJbMTRdICsgbWF0cml4MVsxM10qbWF0cml4MlsxNV1cblxuICAgICAgICBtYXRyaXhbMl0gPSBtYXRyaXgxWzJdKm1hdHJpeDJbMF0gKyBtYXRyaXgxWzZdKm1hdHJpeDJbMV0gKyBtYXRyaXgxWzEwXSptYXRyaXgyWzJdICsgbWF0cml4MVsxNF0qbWF0cml4MlszXVxuICAgICAgICBtYXRyaXhbNl0gPSBtYXRyaXgxWzJdKm1hdHJpeDJbNF0gKyBtYXRyaXgxWzZdKm1hdHJpeDJbNV0gKyBtYXRyaXgxWzEwXSptYXRyaXgyWzZdICsgbWF0cml4MVsxNF0qbWF0cml4Mls3XVxuICAgICAgICBtYXRyaXhbMTBdID0gbWF0cml4MVsyXSptYXRyaXgyWzhdICsgbWF0cml4MVs2XSptYXRyaXgyWzldICsgbWF0cml4MVsxMF0qbWF0cml4MlsxMF0gKyBtYXRyaXgxWzE0XSptYXRyaXgyWzExXVxuICAgICAgICBtYXRyaXhbMTRdID0gbWF0cml4MVsyXSptYXRyaXgyWzEyXSArIG1hdHJpeDFbNl0qbWF0cml4MlsxM10gKyBtYXRyaXgxWzEwXSptYXRyaXgyWzE0XSArIG1hdHJpeDFbMTRdKm1hdHJpeDJbMTVdXG5cbiAgICAgICAgbWF0cml4WzNdID0gbWF0cml4MVszXSptYXRyaXgyWzBdICsgbWF0cml4MVs3XSptYXRyaXgyWzFdICsgbWF0cml4MVsxMV0qbWF0cml4MlsyXSArIG1hdHJpeDFbMTVdKm1hdHJpeDJbM11cbiAgICAgICAgbWF0cml4WzddID0gbWF0cml4MVszXSptYXRyaXgyWzRdICsgbWF0cml4MVs3XSptYXRyaXgyWzVdICsgbWF0cml4MVsxMV0qbWF0cml4Mls2XSArIG1hdHJpeDFbMTVdKm1hdHJpeDJbN11cbiAgICAgICAgbWF0cml4WzExXSA9IG1hdHJpeDFbM10qbWF0cml4Mls4XSArIG1hdHJpeDFbN10qbWF0cml4Mls5XSArIG1hdHJpeDFbMTFdKm1hdHJpeDJbMTBdICsgbWF0cml4MVsxNV0qbWF0cml4MlsxMV1cbiAgICAgICAgbWF0cml4WzE1XSA9IG1hdHJpeDFbM10qbWF0cml4MlsxMl0gKyBtYXRyaXgxWzddKm1hdHJpeDJbMTNdICsgbWF0cml4MVsxMV0qbWF0cml4MlsxNF0gKyBtYXRyaXgxWzE1XSptYXRyaXgyWzE1XVxuXG4gICAgICAgIHJldHVybiBtYXRyaXhcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IE1hdHJpeDRcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xpYi93ZWJnbC9tYXRyaXg0LmpzXG4gKiovIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcblxuaW1wb3J0IHtpbml0U2hhZGVyc30gZnJvbSAnV2VCR0xVdGlscydcblxuaW1wb3J0IE1hdHJpeDQgZnJvbSAnTWF0cml4NCdcblxuY29uc3QgVlNIQURFUl9TT1VSQ0UgPSBgXG4gICAgYXR0cmlidXRlIHZlYzQgYV9Qb3NpdGlvbjtcbiAgICBhdHRyaWJ1dGUgdmVjNCBhX0NvbG9yO1xuICAgIHVuaWZvcm0gbWF0NCB1X1ZpZXdNYXRyaXg7XG4gICAgdmFyeWluZyB2ZWM0IHZfQ29sb3I7XG4gICAgdm9pZCBtYWluKCl7XG4gICAgICAgIGdsX1Bvc2l0aW9uID0gdV9WaWV3TWF0cml4ICogYV9Qb3NpdGlvbjtcbiAgICAgICAgdl9Db2xvciA9IGFfQ29sb3I7XG4gICAgfVxuYFxuXG5jb25zdCBGU0hBREVSX1NPVVJDRSA9IGBcbiAgICBwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcbiAgICB2YXJ5aW5nIHZlYzQgdl9Db2xvcjtcbiAgICB2b2lkIG1haW4oKXtcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdl9Db2xvcjtcbiAgICB9XG5gXG5cbmNsYXNzIExvb2tBdFRyaWFuZ2xlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpXG4gICAgfVxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY2FudmFzID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzWydjYW52YXMnXSlcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IDgwMFxuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IDYwMFxuXG4gICAgICAgICAgICBjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpXG4gICAgICAgICAgICBpZiAoIWluaXRTaGFkZXJzKGdsLFZTSEFERVJfU09VUkNFLEZTSEFERVJfU09VUkNFKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdGYWlsZCB0byBpbml0IFNoYWRlcnMnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG4gPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoZ2wpXG5cbiAgICAgICAgICAgIGNvbnN0IHVfVmlld01hdHJpeCA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihnbC5wcm9ncmFtLCd1X1ZpZXdNYXRyaXgnKVxuICAgICAgICAgICAgaWYgKCF1X1ZpZXdNYXRyaXgpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnY2FuIG5vdCBmaW5kIHN0b3JhZ2UgbG9jYXRpb24gb2YgdV9WaWV3TWF0cml4J1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB2aWV3TWF0cml4ID0gbmV3IE1hdHJpeDQoKVxuICAgICAgICAgICAgdmlld01hdHJpeC5zZXRWaWV3KDAuMjAsMC4yNSwwLjI1LCAwLDAsMCwgMCwxLDApXG5cbiAgICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXg0ZnYodV9WaWV3TWF0cml4LGZhbHNlLHZpZXdNYXRyaXgubWF0cml4KVxuXG4gICAgICAgICAgICBnbC5jbGVhckNvbG9yKDAuMCwwLjAsMC4wLDEuMClcblxuICAgICAgICAgICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVClcblxuICAgICAgICAgICAgZ2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRVMsMCxuKVxuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgIH1cbiAgICB9XG4gICAgaW5pdFZlcnRleEJ1ZmZlcihnbCl7XG4gICAgICAgIC8v6aG254K55Z2Q5qCH5ZKM6aKc6ImyXG4gICAgICAgIGNvbnN0IHZlcnRleHMgPSBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICAgICAgIDAuMCwwLjUsLTAuNCwgMC40LDEuMCwwLjQsXG4gICAgICAgICAgICAtMC41LC0wLjUsLTAuNCwgMC40LDEuMCwwLjQsXG4gICAgICAgICAgICAwLjUsLTAuNSwtMC40LCAxLjAsMC40LDAuNCxcblxuICAgICAgICAgICAgMC41LDAuNCwtMC4yLCAxLjAsMC40LDAuNCxcbiAgICAgICAgICAgIC0wLjUsMC41LC0wLjIsIDEuMCwxLjAsMC40LFxuICAgICAgICAgICAgMC4wLDAuNiwtMC4yLCAxLjAsMS4wLDAuNCxcblxuICAgICAgICAgICAgMC4wLDAuNSwwLjAsIDAuNCwwLjQsMS4wLFxuICAgICAgICAgICAgLTAuNSwtMC41LDAuMCwgMC40LDAuNCwxLjAsXG4gICAgICAgICAgICAwLjUsLTAuNSwwLjAsIDEuMCwwLjQsMC40XG4gICAgICAgIF0pXG4gICAgICAgIGNvbnN0IEZTSVpFID0gdmVydGV4cy5CWVRFU19QRVJfRUxFTUVOVFxuXG4gICAgICAgIGNvbnN0IHZlcnRleEJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLHZlcnRleEJ1ZmZlcilcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsdmVydGV4cyxnbC5TVEFUSUNfRFJBVylcblxuICAgICAgICAvL2FfUG9zaXRpb25cbiAgICAgICAgY29uc3QgYV9Qb3NpdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKGdsLnByb2dyYW0sJ2FfUG9zaXRpb24nKVxuICAgICAgICBpZiAoYV9Qb3NpdGlvbiA8IDApIHtcbiAgICAgICAgICAgIHRocm93ICdjYW4gbm90IGZpbmQgc3RvcmFnZSBsb2NhdGlvbiBvZiBhX1Bvc2l0aW9uJ1xuICAgICAgICB9XG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYV9Qb3NpdGlvbiwzLGdsLkZMT0FULGZhbHNlLEZTSVpFKjYsMClcbiAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYV9Qb3NpdGlvbilcblxuICAgICAgICAvL2FfQ29sb3JcbiAgICAgICAgY29uc3QgYV9Db2xvciA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKGdsLnByb2dyYW0sJ2FfQ29sb3InKVxuICAgICAgICBpZiAoYV9Qb3NpdGlvbiA8IDApIHtcbiAgICAgICAgICAgIHRocm93ICdjYW4gbm90IGZpbmQgc3RvcmFnZSBsb2NhdGlvbiBvZiBhX0NvbG9yJ1xuICAgICAgICB9XG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYV9Db2xvciwzLGdsLkZMT0FULGZhbHNlLEZTSVpFKjYsRlNJWkUqMylcbiAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYV9Db2xvcilcbiAgICAgICAgcmV0dXJuIDlcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGZpZ3VyZT5cbiAgICAgICAgICAgICAgICA8ZmlnY2FwdGlvbj57J+eci+S4ieinkuW9oid9PC9maWdjYXB0aW9uPlxuICAgICAgICAgICAgICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCI+XG4gICAgICAgICAgICAgICAgICAgIHsneW91ciBjdXJyZW50IGJyb3dlciBkb25cXCd0IHN1cHBvcnQgY2FudmFzLHBsZWFzZSBjaGFuZ2UgYW5vdGhlciBvbmUnfVxuICAgICAgICAgICAgICAgIDwvY2FudmFzPlxuICAgICAgICAgICAgPC9maWd1cmU+XG4gICAgICAgIClcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IExvb2tBdFRyaWFuZ2xlc1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvbG9va0F0VHJpYW5nbGVzL0xvb2tBdFRyaWFuZ2xlcy5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=