webpackJsonp([17],{

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

/***/ 348:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Vector4 = exports.Vector3 = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _lodash = __webpack_require__(236);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Vector3 = exports.Vector3 = function Vector3(arr) {
	  _classCallCheck(this, Vector3);
	
	  _initialiseProps.call(this);
	
	  var v = new Float32Array(3);
	  if (arr && _lodash2.default.isArray(arr)) {
	    v[0] = arr[0];
	    v[1] = arr[1];
	    v[2] = arr[2];
	  }
	  this.elements = v;
	};
	
	var _initialiseProps = function _initialiseProps() {
	  var _this = this;
	
	  this.normalize = function () {
	    var v = _this.elements;
	    var c = v[0],
	        d = v[1],
	        e = v[2],
	        g = Math.sqrt(c * c + d * d + e * e);
	    if (g) {
	      if (g == 1) return _this;
	    } else {
	      v[0] = 0;v[1] = 0;v[2] = 0;
	      return _this;
	    }
	    g = 1 / g;
	    v[0] = c * g;v[1] = d * g;v[2] = e * g;
	    return _this;
	  };
	};
	
	var Vector4 = exports.Vector4 = function Vector4(arr) {
	  _classCallCheck(this, Vector4);
	
	  var v = new Float32Array(4);
	  if (opt_src && (typeof opt_src === 'undefined' ? 'undefined' : _typeof(opt_src)) === 'object') {
	    v[0] = arr[0];
	    v[1] = arr[1];
	    v[2] = arr[2];
	    v[3] = arr[3];
	  }
	  this.elements = v;
	};

/***/ },

/***/ 350:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _WeBGLUtils = __webpack_require__(310);
	
	var _Vector = __webpack_require__(348);
	
	var _Matrix = __webpack_require__(320);
	
	var _Matrix2 = _interopRequireDefault(_Matrix);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var VSHADER_SOURCE = '\n    attribute vec4 a_Position;\n    attribute vec4 a_Color;\n    attribute vec4 a_Normal;\n    uniform mat4 u_MvpMatrix;\n    uniform mat4 uMormalMatrix;\n    uniform vec3 u_LightColor;\n    uniform vec3 u_LightDirection;\n    uniform vec3 u_AmbientLight;\n    varying vec4 v_Color;\n    void main(){\n        gl_Position = u_MvpMatrix * a_Position;\n        vec3 normal = normalize(vec3(uMormalMatrix * a_Normal));\n        float nDotL = max(dot(u_LightDirection, normal), 0.0);\n        vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n        vec3 ambient = u_AmbientLight * a_Color.rgb;\n        v_Color = vec4(diffuse + ambient, a_Color.a);\n    }\n';
	
	var FSHADER_SOURCE = '\n    precision mediump float;\n    varying vec4 v_Color;\n    void main(){\n        gl_FragColor = v_Color;\n    }\n';
	
	var LightedTranslatedRotatedCube = function (_React$Component) {
	  _inherits(LightedTranslatedRotatedCube, _React$Component);
	
	  function LightedTranslatedRotatedCube() {
	    var _Object$getPrototypeO;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, LightedTranslatedRotatedCube);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(LightedTranslatedRotatedCube)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.initVertexBuffers = function (gl) {
	      // Create a cube
	      //    v6----- v5
	      //   /|      /|
	      //  v1------v0|
	      //  | |     | |
	      //  | |v7---|-|v4
	      //  |/      |/
	      //  v2------v3
	      var vertexs = new Float32Array([1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // v0-v1-v2-v3 front
	      1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // v0-v3-v4-v5 right
	      1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
	      -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, // v1-v6-v7-v2 left
	      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // v7-v4-v3-v2 down
	      1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0]);
	
	      var colors = new Float32Array([// Colors
	      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v1-v2-v3 front
	      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v3-v4-v5 right
	      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v5-v6-v1 up
	      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v1-v6-v7-v2 left
	      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v7-v4-v3-v2 down
	      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0]);
	
	      var normals = new Float32Array([// Normal
	      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // v0-v1-v2-v3 front
	      1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // v0-v3-v4-v5 right
	      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v5-v6-v1 up
	      -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
	      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // v7-v4-v3-v2 down
	      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0]);
	
	      // Indices of the vertices
	      var indices = new Uint8Array([0, 1, 2, 0, 2, 3, // front
	      4, 5, 6, 4, 6, 7, // right
	      8, 9, 10, 8, 10, 11, // up
	      12, 13, 14, 12, 14, 15, // left
	      16, 17, 18, 16, 18, 19, // down
	      20, 21, 22, 20, 22, 23]);
	
	      // Create a buffer object
	      var indexBuffer = gl.createBuffer();
	      if (!indexBuffer) {
	        return -1;
	      }
	
	      // Write the vertex coordinates and color to the buffer object
	      if (!_this.initArrayBuffer(gl, vertexs, 3, gl.FLOAT, 'a_Position')) {
	        return -1;
	      }
	      if (!_this.initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) {
	        return -1;
	      }
	      if (!_this.initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal')) {
	        return -1;
	      }
	
	      // Write the indices to the buffer object
	      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	
	      return indices.length;
	    }, _this.initArrayBuffer = function (gl, data, num, type, attribute) {
	      var buffer = gl.createBuffer(); // Create a buffer object
	      if (!buffer) {
	        console.log('Failed to create the buffer object');
	        return false;
	      }
	      // Write date into the buffer object
	      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	      // Assign the buffer object to the attribute variable
	      var aAttribute = gl.getAttribLocation(gl.program, attribute);
	      if (aAttribute < 0) {
	        console.log('Failed to get the storage location of ' + attribute);
	        return false;
	      }
	      gl.vertexAttribPointer(aAttribute, num, type, false, 0, 0);
	      // Enable the assignment of the buffer object to the attribute variable
	      gl.enableVertexAttribArray(aAttribute);
	
	      return true;
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(LightedTranslatedRotatedCube, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      try {
	        var canvas = _reactDom2.default.findDOMNode(this.refs.canvas);
	        canvas.width = 500;
	        canvas.height = 500;
	
	        var gl = canvas.getContext('webgl');
	
	        if (!(0, _WeBGLUtils.initShaders)(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	          console.log('Faild to init Shaders');
	          return;
	        }
	
	        var n = this.initVertexBuffers(gl);
	        if (n < 0) {
	          console.log('Failed to set the vertex information');
	          return;
	        }
	
	        gl.clearColor(0.0, 0.0, 0.0, 1.0);
	        gl.enable(gl.DEPTH_TEST);
	
	        var uMvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
	        var uLightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
	        var uLightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
	        var uAmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
	        var uNormalMatrix = gl.getUniformLocation(gl.program, 'uMormalMatrix');
	        if (!uMvpMatrix || !uLightColor || !uLightDirection || !uAmbientLight || !uNormalMatrix) {
	          console.log('Failed to get the storage location');
	          return;
	        }
	        // Set the light color (white)
	        gl.uniform3f(uLightColor, 1.0, 1.0, 1.0);
	        // Set the light direction (in the world coordinate)
	        var lightDirection = new _Vector.Vector3([0.5, 3.0, 4.0]);
	        lightDirection.normalize();
	        gl.uniform3fv(uLightDirection, lightDirection.elements);
	        // Set the ambient light
	        gl.uniform3f(uAmbientLight, 0.2, 0.2, 0.2);
	
	        //  模型矩阵
	        var modelMatrix = new _Matrix2.default();
	        modelMatrix.setRotate(90, 0, 0, 1);
	        modelMatrix.translate(0, 0.9, 0);
	
	        // 向量矩阵
	        var normalMatrix = new _Matrix2.default();
	        normalMatrix.setInverseOf(modelMatrix);
	        normalMatrix.transpose();
	        gl.uniformMatrix4fv(uNormalMatrix, false, normalMatrix.matrix);
	
	        // 视图模型矩阵
	        var mvpMatrix = new _Matrix2.default();
	        mvpMatrix.setView(3, 3, 7, 0, 0, 0, 0, 1, 0).perspective(30, canvas.width / canvas.height, 1, 100).multiply(modelMatrix.matrix);
	        gl.uniformMatrix4fv(uMvpMatrix, false, mvpMatrix.matrix);
	
	        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
	      } catch (e) {
	        console.log(e);
	      }
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
	          '光照平移旋转立方体'
	        ),
	        _react2.default.createElement(
	          'canvas',
	          { ref: 'canvas' },
	          'your current brower don\'t support canvas,please change another one'
	        )
	      );
	    }
	  }]);
	
	  return LightedTranslatedRotatedCube;
	}(_react2.default.Component);
	
	module.exports = LightedTranslatedRotatedCube;

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbGliL3dlYmdsL3V0aWxzLmpzPzVkMDcqKioqKioqKioqIiwid2VicGFjazovLy8uL3NyYy9saWIvd2ViZ2wvbWF0cml4NC5qcz8yNDk0KioqKioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL3dlYmdsL3ZlY3Rvci5qcz9kNjBkIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC9saWdodGVkVHJhbnNsYXRlZFJvdGF0ZWRDdWJlL0xpZ2h0ZWRUcmFuc2xhdGVkUm90YXRlZEN1YmUuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7U0FPZ0IsVyxHQUFBLFc7QUFQaEI7Ozs7Ozs7QUFPTyxVQUFTLFdBQVQsQ0FBcUIsRUFBckIsRUFBeUIsT0FBekIsRUFBa0MsT0FBbEMsRUFBMkM7QUFDaEQsT0FBSSxVQUFVLGNBQWMsRUFBZCxFQUFrQixPQUFsQixFQUEyQixPQUEzQixDQUFkO0FBQ0EsT0FBSSxDQUFDLE9BQUwsRUFBYztBQUNaLGFBQVEsR0FBUixDQUFZLDBCQUFaO0FBQ0EsWUFBTyxLQUFQO0FBQ0Q7O0FBRUQsTUFBRyxVQUFILENBQWMsT0FBZDtBQUNBLE1BQUcsT0FBSCxHQUFhLE9BQWI7O0FBRUEsVUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxVQUFTLGFBQVQsQ0FBdUIsRUFBdkIsRUFBMkIsT0FBM0IsRUFBb0MsT0FBcEMsRUFBNkM7QUFDM0M7QUFDQSxPQUFJLGVBQWUsV0FBVyxFQUFYLEVBQWUsR0FBRyxhQUFsQixFQUFpQyxPQUFqQyxDQUFuQjtBQUNBLE9BQUksaUJBQWlCLFdBQVcsRUFBWCxFQUFlLEdBQUcsZUFBbEIsRUFBbUMsT0FBbkMsQ0FBckI7QUFDQSxPQUFJLENBQUMsWUFBRCxJQUFpQixDQUFDLGNBQXRCLEVBQXNDO0FBQ3BDLFlBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0EsT0FBSSxVQUFVLEdBQUcsYUFBSCxF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QixDIiwiZmlsZSI6ImpzLzE3LTBjMTc3MDQwYzQ1ZDI1YjkxN2IzLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGUgYSBwcm9ncmFtIG9iamVjdCBhbmQgbWFrZSBjdXJyZW50XG4gKiBAcGFyYW0gZ2wgR0wgY29udGV4dFxuICogQHBhcmFtIHZzaGFkZXIgYSB2ZXJ0ZXggc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEBwYXJhbSBmc2hhZGVyIGEgZnJhZ21lbnQgc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEByZXR1cm4gdHJ1ZSwgaWYgdGhlIHByb2dyYW0gb2JqZWN0IHdhcyBjcmVhdGVkIGFuZCBzdWNjZXNzZnVsbHkgbWFkZSBjdXJyZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0U2hhZGVycyhnbCwgdnNoYWRlciwgZnNoYWRlcikge1xuICB2YXIgcHJvZ3JhbSA9IGNyZWF0ZVByb2dyYW0oZ2wsIHZzaGFkZXIsIGZzaGFkZXIpO1xuICBpZiAoIXByb2dyYW0pIHtcbiAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGNyZWF0ZSBwcm9ncmFtJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcbiAgZ2wucHJvZ3JhbSA9IHByb2dyYW07XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBsaW5rZWQgcHJvZ3JhbSBvYmplY3RcbiAqIEBwYXJhbSBnbCBHTCBjb250ZXh0XG4gKiBAcGFyYW0gdnNoYWRlciBhIHZlcnRleCBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHBhcmFtIGZzaGFkZXIgYSBmcmFnbWVudCBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHJldHVybiBjcmVhdGVkIHByb2dyYW0gb2JqZWN0LCBvciBudWxsIGlmIHRoZSBjcmVhdGlvbiBoYXMgZmFpbGVkXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVByb2dyYW0oZ2wsIHZzaGFkZXIsIGZzaGFkZXIpIHtcbiAgLy8gQ3JlYXRlIHNoYWRlciBvYmplY3RcbiAgdmFyIHZlcnRleFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wsIGdsLlZFUlRFWF9TSEFERVIsIHZzaGFkZXIpO1xuICB2YXIgZnJhZ21lbnRTaGFkZXIgPSBsb2FkU2hhZGVyKGdsLCBnbC5GUkFHTUVOVF9TSEFERVIsIGZzaGFkZXIpO1xuICBpZiAoIXZlcnRleFNoYWRlciB8fCAhZnJhZ21lbnRTaGFkZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIHByb2dyYW0gb2JqZWN0XG4gIHZhciBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICBpZiAoIXByb2dyYW0pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEF0dGFjaCB0aGUgc2hhZGVyIG9iamVjdHNcbiAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRleFNoYWRlcik7XG4gIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmFnbWVudFNoYWRlcik7XG5cbiAgLy8gTGluayB0aGUgcHJvZ3JhbSBvYmplY3RcbiAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XG5cbiAgLy8gQ2hlY2sgdGhlIHJlc3VsdCBvZiBsaW5raW5nXG4gIHZhciBsaW5rZWQgPSBnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIGdsLkxJTktfU1RBVFVTKTtcbiAgaWYgKCFsaW5rZWQpIHtcbiAgICB2YXIgZXJyb3IgPSBnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKTtcbiAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGxpbmsgcHJvZ3JhbTogJyArIGVycm9yKTtcbiAgICBnbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xuICAgIGdsLmRlbGV0ZVNoYWRlcihmcmFnbWVudFNoYWRlcik7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKHZlcnRleFNoYWRlcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHByb2dyYW07XG59XG5cblxuLyoqXG4gKiBDcmVhdGUgYSBzaGFkZXIgb2JqZWN0XG4gKiBAcGFyYW0gZ2wgR0wgY29udGV4dFxuICogQHBhcmFtIHR5cGUgdGhlIHR5cGUgb2YgdGhlIHNoYWRlciBvYmplY3QgdG8gYmUgY3JlYXRlZFxuICogQHBhcmFtIHNvdXJjZSBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHJldHVybiBjcmVhdGVkIHNoYWRlciBvYmplY3QsIG9yIG51bGwgaWYgdGhlIGNyZWF0aW9uIGhhcyBmYWlsZWQuXG4gKi9cbmZ1bmN0aW9uIGxvYWRTaGFkZXIoZ2wsIHR5cGUsIHNvdXJjZSkge1xuICAvLyBDcmVhdGUgc2hhZGVyIG9iamVjdFxuICB2YXIgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUpO1xuICBpZiAoc2hhZGVyID09IG51bGwpIHtcbiAgICBjb25zb2xlLmxvZygndW5hYmxlIHRvIGNyZWF0ZSBzaGFkZXInKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFNldCB0aGUgc2hhZGVyIHByb2dyYW1cbiAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcblxuICAvLyBDb21waWxlIHRoZSBzaGFkZXJcbiAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xuXG4gIC8vIENoZWNrIHRoZSByZXN1bHQgb2YgY29tcGlsYXRpb25cbiAgdmFyIGNvbXBpbGVkID0gZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpO1xuICBpZiAoIWNvbXBpbGVkKSB7XG4gICAgdmFyIGVycm9yID0gZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpO1xuICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gY29tcGlsZSBzaGFkZXI6ICcgKyBlcnJvcik7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gc2hhZGVyO1xufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbGliL3dlYmdsL3V0aWxzLmpzXG4gKiovIiwiY2xhc3MgTWF0cml4NCB7XG4gICAgY29uc3RydWN0b3IobWF0cml4KSB7XG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0cml4IHx8IE1hdHJpeDQudW5pdE1hdHJpeDQoKVxuICAgIH1cbiAgICBpbml0ID0gKG1hdHJpeCk9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXRyaXggfHwgTWF0cml4NC51bml0TWF0cml4NCgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIG11bHRpcGx5ID0gKG1hdHJpeCkgPT4ge1xuICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0Lm11bHRpcGx5KHRoaXMubWF0cml4LCBtYXRyaXgpXG4gICAgfVxuICAgIHJvdGF0ZSA9IChhbmdlbCx4LHkseik9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0Lm11bHRpcGx5KE1hdHJpeDQucm90YXRlTWF0cml4KGFuZ2VsLHgseSx6KSx0aGlzLm1hdHJpeClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgcm90YXRlNCA9IChhbmdlbCx2ZWN0b3IsZG90KT0+e1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZSgtZG90LngsLWRvdC55LC1kb3QueilcbiAgICAgICAgdGhpcy5yb3RhdGUoYW5nZWwsdmVjdG9yLngsdmVjdG9yLnksdmVjdG9yLnopXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKGRvdC54LGRvdC55LGRvdC56KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICB0cmFuc2xhdGUgPSAoeCx5LHopPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseShNYXRyaXg0LnRyYW5zbGF0ZU1hdHJpeCh4LHkseiksdGhpcy5tYXRyaXgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHNjYWxlID0gKFN4LFN5LFN6KT0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQubXVsdGlwbHkoTWF0cml4NC5zY2FsZU1hdHJpeChTeCxTeSxTeiksdGhpcy5tYXRyaXgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHZpZXcgPSAoZXllWCwgZXllWSwgZXllWiwgY2VudGVyWCwgY2VudGVyWSwgY2VudGVyWiwgdXBYLCB1cFksIHVwWikgPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseShNYXRyaXg0LnZpZXdNYXRyaXgoZXllWCwgZXllWSwgZXllWiwgY2VudGVyWCwgY2VudGVyWSwgY2VudGVyWiwgdXBYLCB1cFksIHVwWiksdGhpcy5tYXRyaXgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIG9ydGhvID0gKGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSA9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0Lm11bHRpcGx5KE1hdHJpeDQub3J0aG9NYXRyaXgobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpLHRoaXMubWF0cml4KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBwZXJzcGVjdGl2ZSA9IChmb3YsIGFzcGVjdCwgbmVhciwgZmFyKSA9PiB7XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseShNYXRyaXg0LnBlcnNwZWN0aXZlTWF0cml4KGZvdiwgYXNwZWN0LCBuZWFyLCBmYXIpLHRoaXMubWF0cml4KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICB0cmFuc3Bvc2UgPSAoKSA9PiB7XG4gICAgICBsZXQgZSwgdFxuXG4gICAgICBlID0gdGhpcy5tYXRyaXhcblxuICAgICAgdCA9IGVbIDFdOyAgZVsgMV0gPSBlWyA0XTsgIGVbIDRdID0gdDtcbiAgICAgIHQgPSBlWyAyXTsgIGVbIDJdID0gZVsgOF07ICBlWyA4XSA9IHQ7XG4gICAgICB0ID0gZVsgM107ICBlWyAzXSA9IGVbMTJdOyAgZVsxMl0gPSB0O1xuICAgICAgdCA9IGVbIDZdOyAgZVsgNl0gPSBlWyA5XTsgIGVbIDldID0gdDtcbiAgICAgIHQgPSBlWyA3XTsgIGVbIDddID0gZVsxM107ICBlWzEzXSA9IHQ7XG4gICAgICB0ID0gZVsxMV07ICBlWzExXSA9IGVbMTRdOyAgZVsxNF0gPSB0O1xuXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBzZXRPcnRobyA9IChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhcikgPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5vcnRob01hdHJpeChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhcilcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNldFJvdGF0ZSA9IChhbmdlbCx4LHkseik9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0LnJvdGF0ZU1hdHJpeChhbmdlbCx4LHkseilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgc2V0VHJhbnNsYXRlID0gKHgseSx6KT0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQudHJhbnNsYXRlTWF0cml4KHgseSx6KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBzZXRTY2FsZSA9IChTeCxTeSxTeik9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0LnNjYWxlTWF0cml4KFN4LFN5LFN6KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBzZXRWaWV3ID0gKGV5ZVgsIGV5ZVksIGV5ZVosIGNlbnRlclgsIGNlbnRlclksIGNlbnRlclosIHVwWCwgdXBZLCB1cFopPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC52aWV3TWF0cml4KGV5ZVgsIGV5ZVksIGV5ZVosIGNlbnRlclgsIGNlbnRlclksIGNlbnRlclosIHVwWCwgdXBZLCB1cFopXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgc2V0UGVyc3BlY3RpdmUgPSAoZm92LCBhc3BlY3QsIG5lYXIsIGZhcikgPT4ge1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQucGVyc3BlY3RpdmVNYXRyaXgoZm92LCBhc3BlY3QsIG5lYXIsIGZhcilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgc2V0SW52ZXJzZU9mID0gKG1hdHJpeCkgPT4ge1xuICAgICAgY29uc3QgaW52ZXJzZU1hdHJpeCA9IE1hdHJpeDQuaW52ZXJzZU9mKG1hdHJpeClcbiAgICAgIGlmIChpbnZlcnNlTWF0cml4KSB7XG4gICAgICAgIHRoaXMubWF0cml4ID0gaW52ZXJzZU1hdHJpeFxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgLyoqXG4gICAgICog5rGC5LiA5Liq55+p6Zi155qE6YCG55+p6Zi1XG4gICAgICogQHBhcmFtICB7TWF0cml4NH0gbWF0cml4IOefqemYtVxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheX0gICDnn6npmLXmlbDnu4RcbiAgICAgKi9cbiAgICBzdGF0aWMgaW52ZXJzZU9mID0gKG1hdHJpeCkgPT4ge1xuICAgICAgbGV0IGksIHMsIGQsIGludiwgZGV0XG5cbiAgICAgIHMgPSBtYXRyaXgubWF0cml4O1xuICAgICAgZCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xuICAgICAgaW52ID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XG5cbiAgICAgIGludlswXSAgPSAgIHNbNV0qc1sxMF0qc1sxNV0gLSBzWzVdICpzWzExXSpzWzE0XSAtIHNbOV0gKnNbNl0qc1sxNV1cbiAgICAgICAgICAgICAgICArIHNbOV0qc1s3XSAqc1sxNF0gKyBzWzEzXSpzWzZdICpzWzExXSAtIHNbMTNdKnNbN10qc1sxMF07XG4gICAgICBpbnZbNF0gID0gLSBzWzRdKnNbMTBdKnNbMTVdICsgc1s0XSAqc1sxMV0qc1sxNF0gKyBzWzhdICpzWzZdKnNbMTVdXG4gICAgICAgICAgICAgICAgLSBzWzhdKnNbN10gKnNbMTRdIC0gc1sxMl0qc1s2XSAqc1sxMV0gKyBzWzEyXSpzWzddKnNbMTBdO1xuICAgICAgaW52WzhdICA9ICAgc1s0XSpzWzldICpzWzE1XSAtIHNbNF0gKnNbMTFdKnNbMTNdIC0gc1s4XSAqc1s1XSpzWzE1XVxuICAgICAgICAgICAgICAgICsgc1s4XSpzWzddICpzWzEzXSArIHNbMTJdKnNbNV0gKnNbMTFdIC0gc1sxMl0qc1s3XSpzWzldO1xuICAgICAgaW52WzEyXSA9IC0gc1s0XSpzWzldICpzWzE0XSArIHNbNF0gKnNbMTBdKnNbMTNdICsgc1s4XSAqc1s1XSpzWzE0XVxuICAgICAgICAgICAgICAgIC0gc1s4XSpzWzZdICpzWzEzXSAtIHNbMTJdKnNbNV0gKnNbMTBdICsgc1sxMl0qc1s2XSpzWzldO1xuXG4gICAgICBpbnZbMV0gID0gLSBzWzFdKnNbMTBdKnNbMTVdICsgc1sxXSAqc1sxMV0qc1sxNF0gKyBzWzldICpzWzJdKnNbMTVdXG4gICAgICAgICAgICAgICAgLSBzWzldKnNbM10gKnNbMTRdIC0gc1sxM10qc1syXSAqc1sxMV0gKyBzWzEzXSpzWzNdKnNbMTBdO1xuICAgICAgaW52WzVdICA9ICAgc1swXSpzWzEwXSpzWzE1XSAtIHNbMF0gKnNbMTFdKnNbMTRdIC0gc1s4XSAqc1syXSpzWzE1XVxuICAgICAgICAgICAgICAgICsgc1s4XSpzWzNdICpzWzE0XSArIHNbMTJdKnNbMl0gKnNbMTFdIC0gc1sxMl0qc1szXSpzWzEwXTtcbiAgICAgIGludls5XSAgPSAtIHNbMF0qc1s5XSAqc1sxNV0gKyBzWzBdICpzWzExXSpzWzEzXSArIHNbOF0gKnNbMV0qc1sxNV1cbiAgICAgICAgICAgICAgICAtIHNbOF0qc1szXSAqc1sxM10gLSBzWzEyXSpzWzFdICpzWzExXSArIHNbMTJdKnNbM10qc1s5XTtcbiAgICAgIGludlsxM10gPSAgIHNbMF0qc1s5XSAqc1sxNF0gLSBzWzBdICpzWzEwXSpzWzEzXSAtIHNbOF0gKnNbMV0qc1sxNF1cbiAgICAgICAgICAgICAgICArIHNbOF0qc1syXSAqc1sxM10gKyBzWzEyXSpzWzFdICpzWzEwXSAtIHNbMTJdKnNbMl0qc1s5XTtcblxuICAgICAgaW52WzJdICA9ICAgc1sxXSpzWzZdKnNbMTVdIC0gc1sxXSAqc1s3XSpzWzE0XSAtIHNbNV0gKnNbMl0qc1sxNV1cbiAgICAgICAgICAgICAgICArIHNbNV0qc1szXSpzWzE0XSArIHNbMTNdKnNbMl0qc1s3XSAgLSBzWzEzXSpzWzNdKnNbNl07XG4gICAgICBpbnZbNl0gID0gLSBzWzBdKnNbNl0qc1sxNV0gKyBzWzBdICpzWzddKnNbMTRdICsgc1s0XSAqc1syXSpzWzE1XVxuICAgICAgICAgICAgICAgIC0gc1s0XSpzWzNdKnNbMTRdIC0gc1sxMl0qc1syXSpzWzddICArIHNbMTJdKnNbM10qc1s2XTtcbiAgICAgIGludlsxMF0gPSAgIHNbMF0qc1s1XSpzWzE1XSAtIHNbMF0gKnNbN10qc1sxM10gLSBzWzRdICpzWzFdKnNbMTVdXG4gICAgICAgICAgICAgICAgKyBzWzRdKnNbM10qc1sxM10gKyBzWzEyXSpzWzFdKnNbN10gIC0gc1sxMl0qc1szXSpzWzVdO1xuICAgICAgaW52WzE0XSA9IC0gc1swXSpzWzVdKnNbMTRdICsgc1swXSAqc1s2XSpzWzEzXSArIHNbNF0gKnNbMV0qc1sxNF1cbiAgICAgICAgICAgICAgICAtIHNbNF0qc1syXSpzWzEzXSAtIHNbMTJdKnNbMV0qc1s2XSAgKyBzWzEyXSpzWzJdKnNbNV07XG5cbiAgICAgIGludlszXSAgPSAtIHNbMV0qc1s2XSpzWzExXSArIHNbMV0qc1s3XSpzWzEwXSArIHNbNV0qc1syXSpzWzExXVxuICAgICAgICAgICAgICAgIC0gc1s1XSpzWzNdKnNbMTBdIC0gc1s5XSpzWzJdKnNbN10gICsgc1s5XSpzWzNdKnNbNl07XG4gICAgICBpbnZbN10gID0gICBzWzBdKnNbNl0qc1sxMV0gLSBzWzBdKnNbN10qc1sxMF0gLSBzWzRdKnNbMl0qc1sxMV1cbiAgICAgICAgICAgICAgICArIHNbNF0qc1szXSpzWzEwXSArIHNbOF0qc1syXSpzWzddICAtIHNbOF0qc1szXSpzWzZdO1xuICAgICAgaW52WzExXSA9IC0gc1swXSpzWzVdKnNbMTFdICsgc1swXSpzWzddKnNbOV0gICsgc1s0XSpzWzFdKnNbMTFdXG4gICAgICAgICAgICAgICAgLSBzWzRdKnNbM10qc1s5XSAgLSBzWzhdKnNbMV0qc1s3XSAgKyBzWzhdKnNbM10qc1s1XTtcbiAgICAgIGludlsxNV0gPSAgIHNbMF0qc1s1XSpzWzEwXSAtIHNbMF0qc1s2XSpzWzldICAtIHNbNF0qc1sxXSpzWzEwXVxuICAgICAgICAgICAgICAgICsgc1s0XSpzWzJdKnNbOV0gICsgc1s4XSpzWzFdKnNbNl0gIC0gc1s4XSpzWzJdKnNbNV07XG5cbiAgICAgIGRldCA9IHNbMF0qaW52WzBdICsgc1sxXSppbnZbNF0gKyBzWzJdKmludls4XSArIHNbM10qaW52WzEyXTtcbiAgICAgIGlmIChkZXQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGRldCA9IDEgLyBkZXQ7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkrKykge1xuICAgICAgICBkW2ldID0gaW52W2ldICogZGV0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZFxuICAgIH1cbiAgICAvKipcbiAgICAgKiDojrflj5bpgI/op4bmipXlvbHnn6npmLVcbiAgICAgKiBAcGFyYW0gIGZvdiAgICDmjIflrprlnoLnm7Top4bop5LvvIzljbPlj6/op4bnqbrpl7TpobbpnaLlkozlupXpnaLpl7TnmoTlpLnop5LvvIzlv4XpobvlpKfkuo4wXG4gICAgICogQHBhcmFtICBhc3BlY3Qg5oyH5a6a6L+R5Ymq6KOB6Z2i55qE5a696auY5q+U77yI5a695bqm77yP6auY5bqm77yJXG4gICAgICogQHBhcmFtICBuZWFyICAg5oyH5a6a6L+R5Ymq6KOB6Z2i55qE5L2N572u77yM5Y2z5Y+v6KeG56m66Ze055qE6L+R6L6555WMXG4gICAgICogQHBhcmFtICBmYXIgICAg5oyH5a6a6L+c5Ymq6KOB6Z2i55qE5L2N572u77yM5Y2z5Y+v6KeG56m66Ze055qE6L+c6L6555WMXG4gICAgICogQHJldHVybiBtYXRyaXgg6YCP6KeG5oqV5b2x55+p6Zi1XG4gICAgICovXG4gICAgc3RhdGljIHBlcnNwZWN0aXZlTWF0cml4ID0gKGZvdiwgYXNwZWN0LCBuZWFyLCBmYXIpID0+IHtcbiAgICAgICAgbGV0IG1hdHJpeCwgcmQsIHMsIGN0XG5cbiAgICAgICAgaWYgKG5lYXIgPT09IGZhciB8fCBhc3BlY3QgPT09IDApIHtcbiAgICAgICAgICB0aHJvdyAnbnVsbCBmcnVzdHVtJ1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZWFyIDw9IDApIHtcbiAgICAgICAgICB0aHJvdyAnbmVhciA8PSAwJ1xuICAgICAgICB9XG4gICAgICAgIGlmIChmYXIgPD0gMCkge1xuICAgICAgICAgIHRocm93ICdmYXIgPD0gMCdcbiAgICAgICAgfVxuXG4gICAgICAgIGZvdiA9IE1hdGguUEkgKiBmb3YgLyAxODAgLyAyXG4gICAgICAgIHMgPSBNYXRoLnNpbihmb3YpXG4gICAgICAgIGlmIChzID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgJ251bGwgZnJ1c3R1bSdcbiAgICAgICAgfVxuICAgICAgICByZCA9IDEgLyAoZmFyIC0gbmVhcilcbiAgICAgICAgY3QgPSBNYXRoLmNvcyhmb3YpIC8gc1xuXG4gICAgICAgIG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpXG5cbiAgICAgICAgbWF0cml4WzBdICA9IGN0IC8gYXNwZWN0XG4gICAgICAgIG1hdHJpeFsxXSAgPSAwXG4gICAgICAgIG1hdHJpeFsyXSAgPSAwXG4gICAgICAgIG1hdHJpeFszXSAgPSAwXG5cbiAgICAgICAgbWF0cml4WzRdICA9IDBcbiAgICAgICAgbWF0cml4WzVdICA9IGN0XG4gICAgICAgIG1hdHJpeFs2XSAgPSAwXG4gICAgICAgIG1hdHJpeFs3XSAgPSAwXG5cbiAgICAgICAgbWF0cml4WzhdICA9IDBcbiAgICAgICAgbWF0cml4WzldICA9IDBcbiAgICAgICAgbWF0cml4WzEwXSA9IC0oZmFyICsgbmVhcikgKiByZFxuICAgICAgICBtYXRyaXhbMTFdID0gLTFcblxuICAgICAgICBtYXRyaXhbMTJdID0gMFxuICAgICAgICBtYXRyaXhbMTNdID0gMFxuICAgICAgICBtYXRyaXhbMTRdID0gLTIgKiBuZWFyICogZmFyICogcmRcbiAgICAgICAgbWF0cml4WzE1XSA9IDBcbiAgICAgICAgcmV0dXJuIG1hdHJpeFxuICAgIH1cbiAgICBzdGF0aWMgb3J0aG9NYXRyaXggPSAobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpID0+IHtcbiAgICAgICAgbGV0IG1hdHJpeCwgcncsIHJoLCByZDtcblxuICAgICAgICBpZiAobGVmdCA9PT0gcmlnaHQgfHwgYm90dG9tID09PSB0b3AgfHwgbmVhciA9PT0gZmFyKSB7XG4gICAgICAgICAgdGhyb3cgJ251bGwgZnJ1c3R1bSc7XG4gICAgICAgIH1cblxuICAgICAgICBydyA9IDEgLyAocmlnaHQgLSBsZWZ0KTtcbiAgICAgICAgcmggPSAxIC8gKHRvcCAtIGJvdHRvbSk7XG4gICAgICAgIHJkID0gMSAvIChmYXIgLSBuZWFyKTtcblxuICAgICAgICBtYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KDE2KVxuXG4gICAgICAgIG1hdHJpeFswXSAgPSAyICogcnc7XG4gICAgICAgIG1hdHJpeFsxXSAgPSAwO1xuICAgICAgICBtYXRyaXhbMl0gID0gMDtcbiAgICAgICAgbWF0cml4WzNdICA9IDA7XG5cbiAgICAgICAgbWF0cml4WzRdICA9IDA7XG4gICAgICAgIG1hdHJpeFs1XSAgPSAyICogcmg7XG4gICAgICAgIG1hdHJpeFs2XSAgPSAwO1xuICAgICAgICBtYXRyaXhbN10gID0gMDtcblxuICAgICAgICBtYXRyaXhbOF0gID0gMDtcbiAgICAgICAgbWF0cml4WzldICA9IDA7XG4gICAgICAgIG1hdHJpeFsxMF0gPSAtMiAqIHJkO1xuICAgICAgICBtYXRyaXhbMTFdID0gMDtcblxuICAgICAgICBtYXRyaXhbMTJdID0gLShyaWdodCArIGxlZnQpICogcnc7XG4gICAgICAgIG1hdHJpeFsxM10gPSAtKHRvcCArIGJvdHRvbSkgKiByaDtcbiAgICAgICAgbWF0cml4WzE0XSA9IC0oZmFyICsgbmVhcikgKiByZDtcbiAgICAgICAgbWF0cml4WzE1XSA9IDE7XG5cbiAgICAgICAgcmV0dXJuIG1hdHJpeFxuICAgIH1cbiAgICBzdGF0aWMgdmlld01hdHJpeCA9IChleWVYLCBleWVZLCBleWVaLCBjZW50ZXJYLCBjZW50ZXJZLCBjZW50ZXJaLCB1cFgsIHVwWSwgdXBaKT0+e1xuICAgICAgICBsZXQgZSwgZngsIGZ5LCBmeiwgcmxmLCBzeCwgc3ksIHN6LCBybHMsIHV4LCB1eSwgdXpcblxuICAgICAgICBmeCA9IGNlbnRlclggLSBleWVYXG4gICAgICAgIGZ5ID0gY2VudGVyWSAtIGV5ZVlcbiAgICAgICAgZnogPSBjZW50ZXJaIC0gZXllWlxuXG4gICAgICAgIC8vIE5vcm1hbGl6ZSBmLlxuICAgICAgICBybGYgPSAxIC8gTWF0aC5zcXJ0KGZ4KmZ4ICsgZnkqZnkgKyBmeipmeilcbiAgICAgICAgZnggKj0gcmxmXG4gICAgICAgIGZ5ICo9IHJsZlxuICAgICAgICBmeiAqPSBybGZcblxuICAgICAgICAvLyBDYWxjdWxhdGUgY3Jvc3MgcHJvZHVjdCBvZiBmIGFuZCB1cC5cbiAgICAgICAgc3ggPSBmeSAqIHVwWiAtIGZ6ICogdXBZXG4gICAgICAgIHN5ID0gZnogKiB1cFggLSBmeCAqIHVwWlxuICAgICAgICBzeiA9IGZ4ICogdXBZIC0gZnkgKiB1cFhcblxuICAgICAgICAvLyBOb3JtYWxpemUgcy5cbiAgICAgICAgcmxzID0gMSAvIE1hdGguc3FydChzeCpzeCArIHN5KnN5ICsgc3oqc3opXG4gICAgICAgIHN4ICo9IHJsc1xuICAgICAgICBzeSAqPSBybHNcbiAgICAgICAgc3ogKj0gcmxzXG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGNyb3NzIHByb2R1Y3Qgb2YgcyBhbmQgZi5cbiAgICAgICAgdXggPSBzeSAqIGZ6IC0gc3ogKiBmeVxuICAgICAgICB1eSA9IHN6ICogZnggLSBzeCAqIGZ6XG4gICAgICAgIHV6ID0gc3ggKiBmeSAtIHN5ICogZnhcblxuICAgICAgICBsZXQgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheSgxNilcbiAgICAgICAgbWF0cml4WzBdID0gc3hcbiAgICAgICAgbWF0cml4WzFdID0gdXhcbiAgICAgICAgbWF0cml4WzJdID0gLWZ4XG4gICAgICAgIG1hdHJpeFszXSA9IDBcblxuICAgICAgICBtYXRyaXhbNF0gPSBzeVxuICAgICAgICBtYXRyaXhbNV0gPSB1eVxuICAgICAgICBtYXRyaXhbNl0gPSAtZnlcbiAgICAgICAgbWF0cml4WzddID0gMFxuXG4gICAgICAgIG1hdHJpeFs4XSA9IHN6XG4gICAgICAgIG1hdHJpeFs5XSA9IHV6XG4gICAgICAgIG1hdHJpeFsxMF0gPSAtZnpcbiAgICAgICAgbWF0cml4WzExXSA9IDBcblxuICAgICAgICBtYXRyaXhbMTJdID0gMFxuICAgICAgICBtYXRyaXhbMTNdID0gMFxuICAgICAgICBtYXRyaXhbMTRdID0gMFxuICAgICAgICBtYXRyaXhbMTVdID0gMVxuXG4gICAgICAgIHJldHVybiBNYXRyaXg0Lm11bHRpcGx5KG1hdHJpeCxNYXRyaXg0LnRyYW5zbGF0ZU1hdHJpeCgtZXllWCwgLWV5ZVksIC1leWVaKSlcbiAgICB9XG4gICAgc3RhdGljIHJvdGF0ZU1hdHJpeCA9IChhbmdlbCx4LHkseikgPT4ge1xuICAgICAgICBsZXQgcmFkaWFuID0gTWF0aC5QSSAqIGFuZ2VsIC8gMTgwLjBcbiAgICAgICAgbGV0IHMgPSBNYXRoLnNpbihyYWRpYW4pXG4gICAgICAgIGxldCBjID0gTWF0aC5jb3MocmFkaWFuKVxuXG4gICAgICAgIGlmICh4IT09MCYmeT09PTAmJno9PT0wKSB7XG4gICAgICAgICAgICBpZiAoeCA8IDApIHtcbiAgICAgICAgICAgICAgcyA9IC1zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTWF0cml4NC5yb3RhdGVYTWF0cml4KHMsYylcbiAgICAgICAgfVxuICAgICAgICBpZiAoeD09PTAmJnkhPT0wJiZ6PT09MCkge1xuICAgICAgICAgICAgaWYgKHkgPCAwKSB7XG4gICAgICAgICAgICAgIHMgPSAtc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE1hdHJpeDQucm90YXRlWU1hdHJpeChzLGMpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHg9PT0wJiZ5PT09MCYmeiE9PTApIHtcbiAgICAgICAgICAgIGlmICh6PDApIHtcbiAgICAgICAgICAgICAgICBzID0gLXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBNYXRyaXg0LnJvdGF0ZVpNYXRyaXgocyxjKVxuICAgICAgICB9XG4gICAgICAgIGxldCBtYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KDE2KVxuICAgICAgICBsZW4gPSBNYXRoLnNxcnQoeCp4ICsgeSp5ICsgeip6KVxuICAgICAgICBpZiAobGVuICE9PSAxKSB7XG4gICAgICAgICAgcmxlbiA9IDEgLyBsZW5cbiAgICAgICAgICB4ICo9IHJsZW5cbiAgICAgICAgICB5ICo9IHJsZW5cbiAgICAgICAgICB6ICo9IHJsZW5cbiAgICAgICAgfVxuICAgICAgICBuYyA9IDEgLSBjXG4gICAgICAgIHh5ID0geCAqIHlcbiAgICAgICAgeXogPSB5ICogelxuICAgICAgICB6eCA9IHogKiB4XG4gICAgICAgIHhzID0geCAqIHNcbiAgICAgICAgeXMgPSB5ICogc1xuICAgICAgICB6cyA9IHogKiBzXG5cbiAgICAgICAgbWF0cml4WyAwXSA9IHgqeCpuYyArICBjXG4gICAgICAgIG1hdHJpeFsgMV0gPSB4eSAqbmMgKyB6c1xuICAgICAgICBtYXRyaXhbIDJdID0genggKm5jIC0geXNcbiAgICAgICAgbWF0cml4WyAzXSA9IDBcblxuICAgICAgICBtYXRyaXhbIDRdID0geHkgKm5jIC0genNcbiAgICAgICAgbWF0cml4WyA1XSA9IHkqeSpuYyArICBjXG4gICAgICAgIG1hdHJpeFsgNl0gPSB5eiAqbmMgKyB4c1xuICAgICAgICBtYXRyaXhbIDddID0gMFxuXG4gICAgICAgIG1hdHJpeFsgOF0gPSB6eCAqbmMgKyB5c1xuICAgICAgICBtYXRyaXhbIDldID0geXogKm5jIC0geHNcbiAgICAgICAgbWF0cml4WzEwXSA9IHoqeipuYyArICBjXG4gICAgICAgIG1hdHJpeFsxMV0gPSAwXG5cbiAgICAgICAgbWF0cml4WzEyXSA9IDBcbiAgICAgICAgbWF0cml4WzEzXSA9IDBcbiAgICAgICAgbWF0cml4WzE0XSA9IDBcbiAgICAgICAgbWF0cml4WzE1XSA9IDFcblxuICAgICAgICByZXR1cm4gbWF0cml4XG4gICAgfVxuICAgIHN0YXRpYyB0cmFuc2xhdGVNYXRyaXggPSAoeCx5LHopPT57XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLDAsMCwwLCAwLDEsMCwwLCAwLDAsMSwwLCB4LHkseiwxXSlcbiAgICB9XG4gICAgc3RhdGljIHNjYWxlTWF0cml4ID0gKFN4LFN5LFN6KT0+e1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbU3gsMCwwLDAsIDAsU3ksMCwwLCAwLDAsU3osMCwgMCwwLDAsMV0pXG4gICAgfVxuICAgIHN0YXRpYyB1bml0TWF0cml4NCA9ICgpPT57XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLDAsMCwwLCAwLDEsMCwwLCAwLDAsMSwwLCAwLDAsMCwxXSlcbiAgICB9XG4gICAgc3RhdGljIHJvdGF0ZVhNYXRyaXggPSAocyxjKT0+e1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwwLDAsMCwgMCxjLHMsMCwgMCwtcyxjLDAsIDAsMCwwLDFdKVxuICAgIH1cbiAgICBzdGF0aWMgcm90YXRlWU1hdHJpeCA9IChzLGMpPT57XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtjLDAsLXMsMCwgMCwxLDAsMCwgcywwLGMsMCwgMCwwLDAsMV0pXG4gICAgfVxuICAgIHN0YXRpYyByb3RhdGVaTWF0cml4ID0gKHMsYyk9PntcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2MscywwLDAsIC1zLGMsMCwwLCAwLDAsMSwwLCAwLDAsMCwxXSlcbiAgICB9XG4gICAgc3RhdGljIGFkZCA9IChtYXRyaXgxLG1hdHJpeDIpPT57XG4gICAgICAgIGNvbnN0IGxlbjEgPSBtYXRyaXgxLmxlbmd0aCwgbGVuMiA9IG1hdHJpeDIubGVuZ3RoXG4gICAgICAgIGlmIChsZW4xICE9IGxlbjIpIHtcbiAgICAgICAgICAgIHRocm93ICfnn6npmLUx5ZKM55+p6Zi1MumVv+W6puS4jeS4gOiHtCdcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheShsZW4xKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjE7IGkrKykge1xuICAgICAgICAgICAgbWF0cml4W2ldID0gbWF0cml4MVtpXSArIG1hdHJpeDJbaV1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF0cml4XG4gICAgfVxuICAgIHN0YXRpYyBzdWJ0cmFjdCA9IChtYXRyaXgxLG1hdHJpeDIpPT57XG4gICAgICAgIGxldCBtYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KDE2KVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICAgICAgICAgIG1hdHJpeFtpXSA9IG1hdHJpeDFbaV0gLSBtYXRyaXgyW2ldXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdHJpeFxuICAgIH1cbiAgICBzdGF0aWMgbXVsdGlwbHkgPSAobWF0cml4MSxtYXRyaXgyKT0+e1xuICAgICAgICBsZXQgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheSgxNilcblxuICAgICAgICBtYXRyaXhbMF0gPSBtYXRyaXgxWzBdKm1hdHJpeDJbMF0gKyBtYXRyaXgxWzRdKm1hdHJpeDJbMV0gKyBtYXRyaXgxWzhdKm1hdHJpeDJbMl0gKyBtYXRyaXgxWzEyXSptYXRyaXgyWzNdXG4gICAgICAgIG1hdHJpeFs0XSA9IG1hdHJpeDFbMF0qbWF0cml4Mls0XSArIG1hdHJpeDFbNF0qbWF0cml4Mls1XSArIG1hdHJpeDFbOF0qbWF0cml4Mls2XSArIG1hdHJpeDFbMTJdKm1hdHJpeDJbN11cbiAgICAgICAgbWF0cml4WzhdID0gbWF0cml4MVswXSptYXRyaXgyWzhdICsgbWF0cml4MVs0XSptYXRyaXgyWzldICsgbWF0cml4MVs4XSptYXRyaXgyWzEwXSArIG1hdHJpeDFbMTJdKm1hdHJpeDJbMTFdXG4gICAgICAgIG1hdHJpeFsxMl0gPSBtYXRyaXgxWzBdKm1hdHJpeDJbMTJdICsgbWF0cml4MVs0XSptYXRyaXgyWzEzXSArIG1hdHJpeDFbOF0qbWF0cml4MlsxNF0gKyBtYXRyaXgxWzEyXSptYXRyaXgyWzE1XVxuXG4gICAgICAgIG1hdHJpeFsxXSA9IG1hdHJpeDFbMV0qbWF0cml4MlswXSArIG1hdHJpeDFbNV0qbWF0cml4MlsxXSArIG1hdHJpeDFbOV0qbWF0cml4MlsyXSArIG1hdHJpeDFbMTNdKm1hdHJpeDJbM11cbiAgICAgICAgbWF0cml4WzVdID0gbWF0cml4MVsxXSptYXRyaXgyWzRdICsgbWF0cml4MVs1XSptYXRyaXgyWzVdICsgbWF0cml4MVs5XSptYXRyaXgyWzZdICsgbWF0cml4MVsxM10qbWF0cml4Mls3XVxuICAgICAgICBtYXRyaXhbOV0gPSBtYXRyaXgxWzFdKm1hdHJpeDJbOF0gKyBtYXRyaXgxWzVdKm1hdHJpeDJbOV0gKyBtYXRyaXgxWzldKm1hdHJpeDJbMTBdICsgbWF0cml4MVsxM10qbWF0cml4MlsxMV1cbiAgICAgICAgbWF0cml4WzEzXSA9IG1hdHJpeDFbMV0qbWF0cml4MlsxMl0gKyBtYXRyaXgxWzVdKm1hdHJpeDJbMTNdICsgbWF0cml4MVs5XSptYXRyaXgyWzE0XSArIG1hdHJpeDFbMTNdKm1hdHJpeDJbMTVdXG5cbiAgICAgICAgbWF0cml4WzJdID0gbWF0cml4MVsyXSptYXRyaXgyWzBdICsgbWF0cml4MVs2XSptYXRyaXgyWzFdICsgbWF0cml4MVsxMF0qbWF0cml4MlsyXSArIG1hdHJpeDFbMTRdKm1hdHJpeDJbM11cbiAgICAgICAgbWF0cml4WzZdID0gbWF0cml4MVsyXSptYXRyaXgyWzRdICsgbWF0cml4MVs2XSptYXRyaXgyWzVdICsgbWF0cml4MVsxMF0qbWF0cml4Mls2XSArIG1hdHJpeDFbMTRdKm1hdHJpeDJbN11cbiAgICAgICAgbWF0cml4WzEwXSA9IG1hdHJpeDFbMl0qbWF0cml4Mls4XSArIG1hdHJpeDFbNl0qbWF0cml4Mls5XSArIG1hdHJpeDFbMTBdKm1hdHJpeDJbMTBdICsgbWF0cml4MVsxNF0qbWF0cml4MlsxMV1cbiAgICAgICAgbWF0cml4WzE0XSA9IG1hdHJpeDFbMl0qbWF0cml4MlsxMl0gKyBtYXRyaXgxWzZdKm1hdHJpeDJbMTNdICsgbWF0cml4MVsxMF0qbWF0cml4MlsxNF0gKyBtYXRyaXgxWzE0XSptYXRyaXgyWzE1XVxuXG4gICAgICAgIG1hdHJpeFszXSA9IG1hdHJpeDFbM10qbWF0cml4MlswXSArIG1hdHJpeDFbN10qbWF0cml4MlsxXSArIG1hdHJpeDFbMTFdKm1hdHJpeDJbMl0gKyBtYXRyaXgxWzE1XSptYXRyaXgyWzNdXG4gICAgICAgIG1hdHJpeFs3XSA9IG1hdHJpeDFbM10qbWF0cml4Mls0XSArIG1hdHJpeDFbN10qbWF0cml4Mls1XSArIG1hdHJpeDFbMTFdKm1hdHJpeDJbNl0gKyBtYXRyaXgxWzE1XSptYXRyaXgyWzddXG4gICAgICAgIG1hdHJpeFsxMV0gPSBtYXRyaXgxWzNdKm1hdHJpeDJbOF0gKyBtYXRyaXgxWzddKm1hdHJpeDJbOV0gKyBtYXRyaXgxWzExXSptYXRyaXgyWzEwXSArIG1hdHJpeDFbMTVdKm1hdHJpeDJbMTFdXG4gICAgICAgIG1hdHJpeFsxNV0gPSBtYXRyaXgxWzNdKm1hdHJpeDJbMTJdICsgbWF0cml4MVs3XSptYXRyaXgyWzEzXSArIG1hdHJpeDFbMTFdKm1hdHJpeDJbMTRdICsgbWF0cml4MVsxNV0qbWF0cml4MlsxNV1cblxuICAgICAgICByZXR1cm4gbWF0cml4XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBNYXRyaXg0XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9saWIvd2ViZ2wvbWF0cml4NC5qc1xuICoqLyIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCdcblxuZXhwb3J0IGNsYXNzIFZlY3RvcjMge1xuICAgIGNvbnN0cnVjdG9yKGFycikge1xuICAgICAgICBsZXQgdiA9IG5ldyBGbG9hdDMyQXJyYXkoMylcbiAgICAgICAgaWYgKGFyciAmJiBfLmlzQXJyYXkoYXJyKSkge1xuICAgICAgICAgIHZbMF0gPSBhcnJbMF1cbiAgICAgICAgICB2WzFdID0gYXJyWzFdXG4gICAgICAgICAgdlsyXSA9IGFyclsyXVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSB2XG4gICAgfVxuICAgIG5vcm1hbGl6ZSA9ICgpID0+IHtcbiAgICAgIGxldCB2ID0gdGhpcy5lbGVtZW50cztcbiAgICAgIGxldCBjID0gdlswXSwgZCA9IHZbMV0sIGUgPSB2WzJdLCBnID0gTWF0aC5zcXJ0KGMqYytkKmQrZSplKVxuICAgICAgaWYoZyl7XG4gICAgICAgIGlmKGcgPT0gMSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHZbMF0gPSAwOyB2WzFdID0gMDsgdlsyXSA9IDBcbiAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgfVxuICAgICAgIGcgPSAxL2c7XG4gICAgICAgdlswXSA9IGMqZzsgdlsxXSA9IGQqZzsgdlsyXSA9IGUqZ1xuICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVmVjdG9yNCB7XG4gIGNvbnN0cnVjdG9yKGFycikge1xuICAgIGxldCB2ID0gbmV3IEZsb2F0MzJBcnJheSg0KTtcbiAgICBpZiAob3B0X3NyYyAmJiB0eXBlb2Ygb3B0X3NyYyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHZbMF0gPSBhcnJbMF1cbiAgICAgIHZbMV0gPSBhcnJbMV1cbiAgICAgIHZbMl0gPSBhcnJbMl1cbiAgICAgIHZbM10gPSBhcnJbM11cbiAgICB9XG4gICAgdGhpcy5lbGVtZW50cyA9IHZcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbGliL3dlYmdsL3ZlY3Rvci5qc1xuICoqLyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5cbmltcG9ydCB7IGluaXRTaGFkZXJzIH0gZnJvbSAnV2VCR0xVdGlscydcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tICdWZWN0b3InXG5cbmltcG9ydCBNYXRyaXg0IGZyb20gJ01hdHJpeDQnXG5cbmNvbnN0IFZTSEFERVJfU09VUkNFID0gYFxuICAgIGF0dHJpYnV0ZSB2ZWM0IGFfUG9zaXRpb247XG4gICAgYXR0cmlidXRlIHZlYzQgYV9Db2xvcjtcbiAgICBhdHRyaWJ1dGUgdmVjNCBhX05vcm1hbDtcbiAgICB1bmlmb3JtIG1hdDQgdV9NdnBNYXRyaXg7XG4gICAgdW5pZm9ybSBtYXQ0IHVNb3JtYWxNYXRyaXg7XG4gICAgdW5pZm9ybSB2ZWMzIHVfTGlnaHRDb2xvcjtcbiAgICB1bmlmb3JtIHZlYzMgdV9MaWdodERpcmVjdGlvbjtcbiAgICB1bmlmb3JtIHZlYzMgdV9BbWJpZW50TGlnaHQ7XG4gICAgdmFyeWluZyB2ZWM0IHZfQ29sb3I7XG4gICAgdm9pZCBtYWluKCl7XG4gICAgICAgIGdsX1Bvc2l0aW9uID0gdV9NdnBNYXRyaXggKiBhX1Bvc2l0aW9uO1xuICAgICAgICB2ZWMzIG5vcm1hbCA9IG5vcm1hbGl6ZSh2ZWMzKHVNb3JtYWxNYXRyaXggKiBhX05vcm1hbCkpO1xuICAgICAgICBmbG9hdCBuRG90TCA9IG1heChkb3QodV9MaWdodERpcmVjdGlvbiwgbm9ybWFsKSwgMC4wKTtcbiAgICAgICAgdmVjMyBkaWZmdXNlID0gdV9MaWdodENvbG9yICogYV9Db2xvci5yZ2IgKiBuRG90TDtcbiAgICAgICAgdmVjMyBhbWJpZW50ID0gdV9BbWJpZW50TGlnaHQgKiBhX0NvbG9yLnJnYjtcbiAgICAgICAgdl9Db2xvciA9IHZlYzQoZGlmZnVzZSArIGFtYmllbnQsIGFfQ29sb3IuYSk7XG4gICAgfVxuYFxuXG5jb25zdCBGU0hBREVSX1NPVVJDRSA9IGBcbiAgICBwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcbiAgICB2YXJ5aW5nIHZlYzQgdl9Db2xvcjtcbiAgICB2b2lkIG1haW4oKXtcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdl9Db2xvcjtcbiAgICB9XG5gXG5cbmNsYXNzIExpZ2h0ZWRUcmFuc2xhdGVkUm90YXRlZEN1YmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY2FudmFzID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLmNhbnZhcylcbiAgICAgIGNhbnZhcy53aWR0aCA9IDUwMFxuICAgICAgY2FudmFzLmhlaWdodCA9IDUwMFxuXG4gICAgICBjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpXG5cbiAgICAgIGlmICghaW5pdFNoYWRlcnMoZ2wsIFZTSEFERVJfU09VUkNFLCBGU0hBREVSX1NPVVJDRSkpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxkIHRvIGluaXQgU2hhZGVycycpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBuID0gdGhpcy5pbml0VmVydGV4QnVmZmVycyhnbClcbiAgICAgIGlmIChuIDwgMCkge1xuICAgICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIHNldCB0aGUgdmVydGV4IGluZm9ybWF0aW9uJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKVxuICAgICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpXG5cbiAgICAgIGNvbnN0IHVNdnBNYXRyaXggPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oZ2wucHJvZ3JhbSwgJ3VfTXZwTWF0cml4JylcbiAgICAgIGNvbnN0IHVMaWdodENvbG9yID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKGdsLnByb2dyYW0sICd1X0xpZ2h0Q29sb3InKVxuICAgICAgY29uc3QgdUxpZ2h0RGlyZWN0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKGdsLnByb2dyYW0sICd1X0xpZ2h0RGlyZWN0aW9uJylcbiAgICAgIGNvbnN0IHVBbWJpZW50TGlnaHQgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oZ2wucHJvZ3JhbSwgJ3VfQW1iaWVudExpZ2h0JylcbiAgICAgIGNvbnN0IHVOb3JtYWxNYXRyaXggPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oZ2wucHJvZ3JhbSwgJ3VNb3JtYWxNYXRyaXgnKVxuICAgICAgaWYgKCF1TXZwTWF0cml4IHx8ICF1TGlnaHRDb2xvciB8fCAhdUxpZ2h0RGlyZWN0aW9uIHx8ICF1QW1iaWVudExpZ2h0IHx8ICF1Tm9ybWFsTWF0cml4KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gZ2V0IHRoZSBzdG9yYWdlIGxvY2F0aW9uJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBTZXQgdGhlIGxpZ2h0IGNvbG9yICh3aGl0ZSlcbiAgICAgIGdsLnVuaWZvcm0zZih1TGlnaHRDb2xvciwgMS4wLCAxLjAsIDEuMClcbiAgICAgIC8vIFNldCB0aGUgbGlnaHQgZGlyZWN0aW9uIChpbiB0aGUgd29ybGQgY29vcmRpbmF0ZSlcbiAgICAgIGNvbnN0IGxpZ2h0RGlyZWN0aW9uID0gbmV3IFZlY3RvcjMoWzAuNSwgMy4wLCA0LjBdKVxuICAgICAgbGlnaHREaXJlY3Rpb24ubm9ybWFsaXplKClcbiAgICAgIGdsLnVuaWZvcm0zZnYodUxpZ2h0RGlyZWN0aW9uLCBsaWdodERpcmVjdGlvbi5lbGVtZW50cylcbiAgICAgIC8vIFNldCB0aGUgYW1iaWVudCBsaWdodFxuICAgICAgZ2wudW5pZm9ybTNmKHVBbWJpZW50TGlnaHQsIDAuMiwgMC4yLCAwLjIpXG5cbiAgICAgIC8vICDmqKHlnovnn6npmLVcbiAgICAgIGNvbnN0IG1vZGVsTWF0cml4ID0gbmV3IE1hdHJpeDQoKVxuICAgICAgbW9kZWxNYXRyaXguc2V0Um90YXRlKDkwLCAwLCAwLCAxKVxuICAgICAgbW9kZWxNYXRyaXgudHJhbnNsYXRlKDAsIDAuOSwgMClcblxuICAgICAgLy8g5ZCR6YeP55+p6Zi1XG4gICAgICBjb25zdCBub3JtYWxNYXRyaXggPSBuZXcgTWF0cml4NCgpXG4gICAgICBub3JtYWxNYXRyaXguc2V0SW52ZXJzZU9mKG1vZGVsTWF0cml4KVxuICAgICAgbm9ybWFsTWF0cml4LnRyYW5zcG9zZSgpXG4gICAgICBnbC51bmlmb3JtTWF0cml4NGZ2KHVOb3JtYWxNYXRyaXgsIGZhbHNlLCBub3JtYWxNYXRyaXgubWF0cml4KVxuXG4gICAgICAvLyDop4blm77mqKHlnovnn6npmLVcbiAgICAgIGNvbnN0IG12cE1hdHJpeCA9IG5ldyBNYXRyaXg0KClcbiAgICAgIG12cE1hdHJpeC5zZXRWaWV3KDMsIDMsIDcsIDAsIDAsIDAsIDAsIDEsIDApXG4gICAgICAgICAgICAgICAgLnBlcnNwZWN0aXZlKDMwLCBjYW52YXMud2lkdGggLyBjYW52YXMuaGVpZ2h0LCAxLCAxMDApXG4gICAgICAgICAgICAgICAgLm11bHRpcGx5KG1vZGVsTWF0cml4Lm1hdHJpeClcbiAgICAgIGdsLnVuaWZvcm1NYXRyaXg0ZnYodU12cE1hdHJpeCwgZmFsc2UsIG12cE1hdHJpeC5tYXRyaXgpXG5cbiAgICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKVxuICAgICAgZ2wuZHJhd0VsZW1lbnRzKGdsLlRSSUFOR0xFUywgbiwgZ2wuVU5TSUdORURfQllURSwgMClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cbiAgfVxuICBpbml0VmVydGV4QnVmZmVycyA9IChnbCkgPT4ge1xuICAgIC8vIENyZWF0ZSBhIGN1YmVcbiAgICAvLyAgICB2Ni0tLS0tIHY1XG4gICAgLy8gICAvfCAgICAgIC98XG4gICAgLy8gIHYxLS0tLS0tdjB8XG4gICAgLy8gIHwgfCAgICAgfCB8XG4gICAgLy8gIHwgfHY3LS0tfC18djRcbiAgICAvLyAgfC8gICAgICB8L1xuICAgIC8vICB2Mi0tLS0tLXYzXG4gICAgY29uc3QgdmVydGV4cyA9IG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgMS4wLCAxLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIC0xLjAsIDEuMCwgMS4wLCAtMS4wLCAxLjAsICAvLyB2MC12MS12Mi12MyBmcm9udFxuICAgICAgMS4wLCAxLjAsIDEuMCwgMS4wLCAtMS4wLCAxLjAsIDEuMCwgLTEuMCwgLTEuMCwgMS4wLCAxLjAsIC0xLjAsICAvLyB2MC12My12NC12NSByaWdodFxuICAgICAgMS4wLCAxLjAsIDEuMCwgMS4wLCAxLjAsIC0xLjAsIC0xLjAsIDEuMCwgLTEuMCwgLTEuMCwgMS4wLCAxLjAsICAvLyB2MC12NS12Ni12MSB1cFxuICAgICAgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIDEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgMS4wLCAgLy8gdjEtdjYtdjctdjIgbGVmdFxuICAgICAgLTEuMCwgLTEuMCwgLTEuMCwgMS4wLCAtMS4wLCAtMS4wLCAxLjAsIC0xLjAsIDEuMCwgLTEuMCwgLTEuMCwgMS4wLCAgLy8gdjctdjQtdjMtdjIgZG93blxuICAgICAgMS4wLCAtMS4wLCAtMS4wLCAtMS4wLCAtMS4wLCAtMS4wLCAtMS4wLCAxLjAsIC0xLjAsIDEuMCwgMS4wLCAtMS4wLCAgLy8gdjQtdjctdjYtdjUgYmFja1xuICAgIF0pXG5cbiAgICBjb25zdCBjb2xvcnMgPSBuZXcgRmxvYXQzMkFycmF5KFsgICAgIC8vIENvbG9yc1xuICAgICAgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgICAgIC8vIHYwLXYxLXYyLXYzIGZyb250XG4gICAgICAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAgICAgLy8gdjAtdjMtdjQtdjUgcmlnaHRcbiAgICAgIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsICAgICAvLyB2MC12NS12Ni12MSB1cFxuICAgICAgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgICAgIC8vIHYxLXY2LXY3LXYyIGxlZnRcbiAgICAgIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsICAgICAvLyB2Ny12NC12My12MiBkb3duXG4gICAgICAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAgICAgLy8gdjQtdjctdjYtdjUgYmFja1xuICAgIF0pXG5cbiAgICBjb25zdCBub3JtYWxzID0gbmV3IEZsb2F0MzJBcnJheShbICAgIC8vIE5vcm1hbFxuICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAwLjAsIDEuMCwgMC4wLCAwLjAsIDEuMCwgMC4wLCAwLjAsIDEuMCwgIC8vIHYwLXYxLXYyLXYzIGZyb250XG4gICAgICAxLjAsIDAuMCwgMC4wLCAxLjAsIDAuMCwgMC4wLCAxLjAsIDAuMCwgMC4wLCAxLjAsIDAuMCwgMC4wLCAgLy8gdjAtdjMtdjQtdjUgcmlnaHRcbiAgICAgIDAuMCwgMS4wLCAwLjAsIDAuMCwgMS4wLCAwLjAsIDAuMCwgMS4wLCAwLjAsIDAuMCwgMS4wLCAwLjAsICAvLyB2MC12NS12Ni12MSB1cFxuICAgICAgLTEuMCwgMC4wLCAwLjAsIC0xLjAsIDAuMCwgMC4wLCAtMS4wLCAwLjAsIDAuMCwgLTEuMCwgMC4wLCAwLjAsICAvLyB2MS12Ni12Ny12MiBsZWZ0XG4gICAgICAwLjAsIC0xLjAsIDAuMCwgMC4wLCAtMS4wLCAwLjAsIDAuMCwgLTEuMCwgMC4wLCAwLjAsIC0xLjAsIDAuMCwgIC8vIHY3LXY0LXYzLXYyIGRvd25cbiAgICAgIDAuMCwgMC4wLCAtMS4wLCAwLjAsIDAuMCwgLTEuMCwgMC4wLCAwLjAsIC0xLjAsIDAuMCwgMC4wLCAtMS4wLCAgIC8vIHY0LXY3LXY2LXY1IGJhY2tcbiAgICBdKVxuXG4gICAgIC8vIEluZGljZXMgb2YgdGhlIHZlcnRpY2VzXG4gICAgY29uc3QgaW5kaWNlcyA9IG5ldyBVaW50OEFycmF5KFtcbiAgICAgIDAsIDEsIDIsIDAsIDIsIDMsICAgIC8vIGZyb250XG4gICAgICA0LCA1LCA2LCA0LCA2LCA3LCAgICAvLyByaWdodFxuICAgICAgOCwgOSwgMTAsIDgsIDEwLCAxMSwgICAgLy8gdXBcbiAgICAgIDEyLCAxMywgMTQsIDEyLCAxNCwgMTUsICAgIC8vIGxlZnRcbiAgICAgIDE2LCAxNywgMTgsIDE2LCAxOCwgMTksICAgIC8vIGRvd25cbiAgICAgIDIwLCAyMSwgMjIsIDIwLCAyMiwgMjMsICAgIC8vIGJhY2tcbiAgICBdKVxuXG4gICAgLy8gQ3JlYXRlIGEgYnVmZmVyIG9iamVjdFxuICAgIGNvbnN0IGluZGV4QnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKClcbiAgICBpZiAoIWluZGV4QnVmZmVyKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG5cbiAgICAvLyBXcml0ZSB0aGUgdmVydGV4IGNvb3JkaW5hdGVzIGFuZCBjb2xvciB0byB0aGUgYnVmZmVyIG9iamVjdFxuICAgIGlmICghdGhpcy5pbml0QXJyYXlCdWZmZXIoZ2wsIHZlcnRleHMsIDMsIGdsLkZMT0FULCAnYV9Qb3NpdGlvbicpKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgaWYgKCF0aGlzLmluaXRBcnJheUJ1ZmZlcihnbCwgY29sb3JzLCAzLCBnbC5GTE9BVCwgJ2FfQ29sb3InKSkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIGlmICghdGhpcy5pbml0QXJyYXlCdWZmZXIoZ2wsIG5vcm1hbHMsIDMsIGdsLkZMT0FULCAnYV9Ob3JtYWwnKSkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuXG4gICAgLy8gV3JpdGUgdGhlIGluZGljZXMgdG8gdGhlIGJ1ZmZlciBvYmplY3RcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpbmRleEJ1ZmZlcilcbiAgICBnbC5idWZmZXJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpbmRpY2VzLCBnbC5TVEFUSUNfRFJBVylcblxuICAgIHJldHVybiBpbmRpY2VzLmxlbmd0aFxuICB9XG4gIGluaXRBcnJheUJ1ZmZlcj0oZ2wsIGRhdGEsIG51bSwgdHlwZSwgYXR0cmlidXRlKSA9PiB7XG4gICAgY29uc3QgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCkgICAvLyBDcmVhdGUgYSBidWZmZXIgb2JqZWN0XG4gICAgaWYgKCFidWZmZXIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gY3JlYXRlIHRoZSBidWZmZXIgb2JqZWN0JylcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICAvLyBXcml0ZSBkYXRlIGludG8gdGhlIGJ1ZmZlciBvYmplY3RcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgYnVmZmVyKVxuICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBkYXRhLCBnbC5TVEFUSUNfRFJBVylcbiAgICAvLyBBc3NpZ24gdGhlIGJ1ZmZlciBvYmplY3QgdG8gdGhlIGF0dHJpYnV0ZSB2YXJpYWJsZVxuICAgIGNvbnN0IGFBdHRyaWJ1dGUgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihnbC5wcm9ncmFtLCBhdHRyaWJ1dGUpXG4gICAgaWYgKGFBdHRyaWJ1dGUgPCAwKSB7XG4gICAgICBjb25zb2xlLmxvZyhgRmFpbGVkIHRvIGdldCB0aGUgc3RvcmFnZSBsb2NhdGlvbiBvZiAke2F0dHJpYnV0ZX1gKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYUF0dHJpYnV0ZSwgbnVtLCB0eXBlLCBmYWxzZSwgMCwgMClcbiAgICAvLyBFbmFibGUgdGhlIGFzc2lnbm1lbnQgb2YgdGhlIGJ1ZmZlciBvYmplY3QgdG8gdGhlIGF0dHJpYnV0ZSB2YXJpYWJsZVxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGFBdHRyaWJ1dGUpXG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGZpZ3VyZT5cbiAgICAgICAgPGZpZ2NhcHRpb24+eyflhYnnhaflubPnp7vml4vovaznq4vmlrnkvZMnfTwvZmlnY2FwdGlvbj5cbiAgICAgICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIj5cbiAgICAgICAgICB7J3lvdXIgY3VycmVudCBicm93ZXIgZG9uXFwndCBzdXBwb3J0IGNhbnZhcyxwbGVhc2UgY2hhbmdlIGFub3RoZXIgb25lJ31cbiAgICAgICAgPC9jYW52YXM+XG4gICAgICA8L2ZpZ3VyZT5cbiAgICApXG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gTGlnaHRlZFRyYW5zbGF0ZWRSb3RhdGVkQ3ViZVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvbGlnaHRlZFRyYW5zbGF0ZWRSb3RhdGVkQ3ViZS9MaWdodGVkVHJhbnNsYXRlZFJvdGF0ZWRDdWJlLmpzeFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=