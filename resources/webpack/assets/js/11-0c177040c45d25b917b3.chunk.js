webpackJsonp([11],{

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

/***/ 337:
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
	
	var LookAtTrianglesWithKeys = function (_React$Component) {
	    _inherits(LookAtTrianglesWithKeys, _React$Component);
	
	    function LookAtTrianglesWithKeys(props) {
	        _classCallCheck(this, LookAtTrianglesWithKeys);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LookAtTrianglesWithKeys).call(this, props));
	
	        _this.handleKeyDown = function (e, gl, n, u_ViewMatrix, viewMatrix, eye) {
	            if (e.keyCode == 39) {
	                eye.x += 0.01;
	            } else if (e.keyCode == 37) {
	                eye.x -= 0.01;
	            } else {
	                return;
	            }
	            _this.draw(gl, n, u_ViewMatrix, viewMatrix, eye);
	        };
	
	        _this.draw = function (gl, n, u_ViewMatrix, viewMatrix, _ref) {
	            var x = _ref.x;
	            var y = _ref.y;
	            var z = _ref.z;
	
	            viewMatrix.setView(x, y, z, 0, 0, 0, 0, 1, 0);
	
	            gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.matrix);
	
	            gl.clear(gl.COLOR_BUFFER_BIT);
	
	            gl.drawArrays(gl.TRIANGLES, 0, n);
	        };
	
	        return _this;
	    }
	
	    _createClass(LookAtTrianglesWithKeys, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var _this2 = this;
	
	            try {
	                (function () {
	                    var canvas = _reactDom2.default.findDOMNode(_this2.refs['canvas']);
	                    canvas.width = 800;
	                    canvas.height = 600;
	
	                    var gl = canvas.getContext('webgl');
	                    if (!(0, _WeBGLUtils.initShaders)(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	                        throw 'Faild to init Shaders';
	                    }
	
	                    var n = _this2.initVertexBuffer(gl);
	
	                    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
	                    if (!u_ViewMatrix) {
	                        throw 'can not find storage location of u_ViewMatrix';
	                    }
	
	                    var viewMatrix = new _Matrix2.default();
	                    var eye = { x: 0.20, y: 0.25, z: 0.25 };
	                    _this2.handleKeyDownWrap = function (e) {
	                        _this2.handleKeyDown(e, gl, n, u_ViewMatrix, viewMatrix, eye);
	                    };
	                    document.addEventListener('keydown', _this2.handleKeyDownWrap);
	
	                    gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	                    _this2.draw(gl, n, u_ViewMatrix, viewMatrix, eye);
	                })();
	            } catch (e) {
	                console.log(e);
	            }
	        }
	    }, {
	        key: 'componentWillUnmount',
	        value: function componentWillUnmount() {
	            document.removeEventListener('keydown', this.handleKeyDownWrap);
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
	                    '改变观察者视点'
	                ),
	                _react2.default.createElement(
	                    'canvas',
	                    { ref: 'canvas' },
	                    'your current brower don\'t support canvas,please change another one'
	                )
	            );
	        }
	    }]);
	
	    return LookAtTrianglesWithKeys;
	}(_react2.default.Component);
	
	module.exports = LookAtTrianglesWithKeys;

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbGliL3dlYmdsL3V0aWxzLmpzPzVkMDcqKioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL3dlYmdsL21hdHJpeDQuanM/MjQ5NCoiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2FudmFzL3dlYmdsL2xvb2tBdFRyaWFuZ2xlc1dpdGhLZXlzL0xvb2tBdFRyaWFuZ2xlc1dpdGhLZXlzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7U0FPZ0IsVyxHQUFBLFc7QUFQaEI7Ozs7Ozs7QUFPTyxVQUFTLFdBQVQsQ0FBcUIsRUFBckIsRUFBeUIsT0FBekIsRUFBa0MsT0FBbEMsRUFBMkM7QUFDaEQsT0FBSSxVQUFVLGNBQWMsRUFBZCxFQUFrQixPQUFsQixFQUEyQixPQUEzQixDQUFkO0FBQ0EsT0FBSSxDQUFDLE9BQUwsRUFBYztBQUNaLGFBQVEsR0FBUixDQUFZLDBCQUFaO0FBQ0EsWUFBTyxLQUFQO0FBQ0Q7O0FBRUQsTUFBRyxVQUFILENBQWMsT0FBZDtBQUNBLE1BQUcsT0FBSCxHQUFhLE9BQWI7O0FBRUEsVUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxVQUFTLGFBQVQsQ0FBdUIsRUFBdkIsRUFBMkIsT0FBM0IsRUFBb0MsT0FBcEMsRUFBNkM7QUFDM0M7QUFDQSxPQUFJLGVBQWUsV0FBVyxFQUFYLEVBQWUsR0FBRyxhQUFsQixFQUFpQyxPQUFqQyxDQUFuQjtBQUNBLE9BQUksaUJBQWlCLFdBQVcsRUFBWCxFQUFlLEdBQUcsZUFBbEIsRUFBbUMsT0FBbkMsQ0FBckI7QUFDQSxPQUFJLENBQUMsWUFBRCxJQUFpQixDQUFDLGNBQXRCLEVBQXNDO0FBQ3BDLFlBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0EsT0FBSSxVQUFVLEdBQUcsYUFBSCxFQUFkO0FBQ0EsT0FBSSxDQUFDLE9BQUwsRUFBYztBQUNaLFlBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0EsTUFBRyxZ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LzExLTBjMTc3MDQwYzQ1ZDI1YjkxN2IzLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGUgYSBwcm9ncmFtIG9iamVjdCBhbmQgbWFrZSBjdXJyZW50XG4gKiBAcGFyYW0gZ2wgR0wgY29udGV4dFxuICogQHBhcmFtIHZzaGFkZXIgYSB2ZXJ0ZXggc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEBwYXJhbSBmc2hhZGVyIGEgZnJhZ21lbnQgc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEByZXR1cm4gdHJ1ZSwgaWYgdGhlIHByb2dyYW0gb2JqZWN0IHdhcyBjcmVhdGVkIGFuZCBzdWNjZXNzZnVsbHkgbWFkZSBjdXJyZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0U2hhZGVycyhnbCwgdnNoYWRlciwgZnNoYWRlcikge1xuICB2YXIgcHJvZ3JhbSA9IGNyZWF0ZVByb2dyYW0oZ2wsIHZzaGFkZXIsIGZzaGFkZXIpO1xuICBpZiAoIXByb2dyYW0pIHtcbiAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGNyZWF0ZSBwcm9ncmFtJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcbiAgZ2wucHJvZ3JhbSA9IHByb2dyYW07XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBsaW5rZWQgcHJvZ3JhbSBvYmplY3RcbiAqIEBwYXJhbSBnbCBHTCBjb250ZXh0XG4gKiBAcGFyYW0gdnNoYWRlciBhIHZlcnRleCBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHBhcmFtIGZzaGFkZXIgYSBmcmFnbWVudCBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHJldHVybiBjcmVhdGVkIHByb2dyYW0gb2JqZWN0LCBvciBudWxsIGlmIHRoZSBjcmVhdGlvbiBoYXMgZmFpbGVkXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVByb2dyYW0oZ2wsIHZzaGFkZXIsIGZzaGFkZXIpIHtcbiAgLy8gQ3JlYXRlIHNoYWRlciBvYmplY3RcbiAgdmFyIHZlcnRleFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wsIGdsLlZFUlRFWF9TSEFERVIsIHZzaGFkZXIpO1xuICB2YXIgZnJhZ21lbnRTaGFkZXIgPSBsb2FkU2hhZGVyKGdsLCBnbC5GUkFHTUVOVF9TSEFERVIsIGZzaGFkZXIpO1xuICBpZiAoIXZlcnRleFNoYWRlciB8fCAhZnJhZ21lbnRTaGFkZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIHByb2dyYW0gb2JqZWN0XG4gIHZhciBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICBpZiAoIXByb2dyYW0pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEF0dGFjaCB0aGUgc2hhZGVyIG9iamVjdHNcbiAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRleFNoYWRlcik7XG4gIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmFnbWVudFNoYWRlcik7XG5cbiAgLy8gTGluayB0aGUgcHJvZ3JhbSBvYmplY3RcbiAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XG5cbiAgLy8gQ2hlY2sgdGhlIHJlc3VsdCBvZiBsaW5raW5nXG4gIHZhciBsaW5rZWQgPSBnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIGdsLkxJTktfU1RBVFVTKTtcbiAgaWYgKCFsaW5rZWQpIHtcbiAgICB2YXIgZXJyb3IgPSBnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKTtcbiAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGxpbmsgcHJvZ3JhbTogJyArIGVycm9yKTtcbiAgICBnbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xuICAgIGdsLmRlbGV0ZVNoYWRlcihmcmFnbWVudFNoYWRlcik7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKHZlcnRleFNoYWRlcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHByb2dyYW07XG59XG5cblxuLyoqXG4gKiBDcmVhdGUgYSBzaGFkZXIgb2JqZWN0XG4gKiBAcGFyYW0gZ2wgR0wgY29udGV4dFxuICogQHBhcmFtIHR5cGUgdGhlIHR5cGUgb2YgdGhlIHNoYWRlciBvYmplY3QgdG8gYmUgY3JlYXRlZFxuICogQHBhcmFtIHNvdXJjZSBzaGFkZXIgcHJvZ3JhbSAoc3RyaW5nKVxuICogQHJldHVybiBjcmVhdGVkIHNoYWRlciBvYmplY3QsIG9yIG51bGwgaWYgdGhlIGNyZWF0aW9uIGhhcyBmYWlsZWQuXG4gKi9cbmZ1bmN0aW9uIGxvYWRTaGFkZXIoZ2wsIHR5cGUsIHNvdXJjZSkge1xuICAvLyBDcmVhdGUgc2hhZGVyIG9iamVjdFxuICB2YXIgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUpO1xuICBpZiAoc2hhZGVyID09IG51bGwpIHtcbiAgICBjb25zb2xlLmxvZygndW5hYmxlIHRvIGNyZWF0ZSBzaGFkZXInKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFNldCB0aGUgc2hhZGVyIHByb2dyYW1cbiAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcblxuICAvLyBDb21waWxlIHRoZSBzaGFkZXJcbiAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xuXG4gIC8vIENoZWNrIHRoZSByZXN1bHQgb2YgY29tcGlsYXRpb25cbiAgdmFyIGNvbXBpbGVkID0gZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpO1xuICBpZiAoIWNvbXBpbGVkKSB7XG4gICAgdmFyIGVycm9yID0gZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpO1xuICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gY29tcGlsZSBzaGFkZXI6ICcgKyBlcnJvcik7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gc2hhZGVyO1xufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbGliL3dlYmdsL3V0aWxzLmpzXG4gKiovIiwiY2xhc3MgTWF0cml4NCB7XG4gICAgY29uc3RydWN0b3IobWF0cml4KSB7XG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0cml4IHx8IE1hdHJpeDQudW5pdE1hdHJpeDQoKVxuICAgIH1cbiAgICBpbml0ID0gKG1hdHJpeCk9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXRyaXggfHwgTWF0cml4NC51bml0TWF0cml4NCgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIG11bHRpcGx5ID0gKG1hdHJpeCkgPT4ge1xuICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0Lm11bHRpcGx5KHRoaXMubWF0cml4LCBtYXRyaXgpXG4gICAgfVxuICAgIHJvdGF0ZSA9IChhbmdlbCx4LHkseik9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0Lm11bHRpcGx5KE1hdHJpeDQucm90YXRlTWF0cml4KGFuZ2VsLHgseSx6KSx0aGlzLm1hdHJpeClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgcm90YXRlNCA9IChhbmdlbCx2ZWN0b3IsZG90KT0+e1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZSgtZG90LngsLWRvdC55LC1kb3QueilcbiAgICAgICAgdGhpcy5yb3RhdGUoYW5nZWwsdmVjdG9yLngsdmVjdG9yLnksdmVjdG9yLnopXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKGRvdC54LGRvdC55LGRvdC56KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICB0cmFuc2xhdGUgPSAoeCx5LHopPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseShNYXRyaXg0LnRyYW5zbGF0ZU1hdHJpeCh4LHkseiksdGhpcy5tYXRyaXgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHNjYWxlID0gKFN4LFN5LFN6KT0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQubXVsdGlwbHkoTWF0cml4NC5zY2FsZU1hdHJpeChTeCxTeSxTeiksdGhpcy5tYXRyaXgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHZpZXcgPSAoZXllWCwgZXllWSwgZXllWiwgY2VudGVyWCwgY2VudGVyWSwgY2VudGVyWiwgdXBYLCB1cFksIHVwWikgPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseShNYXRyaXg0LnZpZXdNYXRyaXgoZXllWCwgZXllWSwgZXllWiwgY2VudGVyWCwgY2VudGVyWSwgY2VudGVyWiwgdXBYLCB1cFksIHVwWiksdGhpcy5tYXRyaXgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIG9ydGhvID0gKGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSA9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0Lm11bHRpcGx5KE1hdHJpeDQub3J0aG9NYXRyaXgobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpLHRoaXMubWF0cml4KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBwZXJzcGVjdGl2ZSA9IChmb3YsIGFzcGVjdCwgbmVhciwgZmFyKSA9PiB7XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseShNYXRyaXg0LnBlcnNwZWN0aXZlTWF0cml4KGZvdiwgYXNwZWN0LCBuZWFyLCBmYXIpLHRoaXMubWF0cml4KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICB0cmFuc3Bvc2UgPSAoKSA9PiB7XG4gICAgICBsZXQgZSwgdFxuXG4gICAgICBlID0gdGhpcy5tYXRyaXhcblxuICAgICAgdCA9IGVbIDFdOyAgZVsgMV0gPSBlWyA0XTsgIGVbIDRdID0gdDtcbiAgICAgIHQgPSBlWyAyXTsgIGVbIDJdID0gZVsgOF07ICBlWyA4XSA9IHQ7XG4gICAgICB0ID0gZVsgM107ICBlWyAzXSA9IGVbMTJdOyAgZVsxMl0gPSB0O1xuICAgICAgdCA9IGVbIDZdOyAgZVsgNl0gPSBlWyA5XTsgIGVbIDldID0gdDtcbiAgICAgIHQgPSBlWyA3XTsgIGVbIDddID0gZVsxM107ICBlWzEzXSA9IHQ7XG4gICAgICB0ID0gZVsxMV07ICBlWzExXSA9IGVbMTRdOyAgZVsxNF0gPSB0O1xuXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBzZXRPcnRobyA9IChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhcikgPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5vcnRob01hdHJpeChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhcilcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNldFJvdGF0ZSA9IChhbmdlbCx4LHkseik9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0LnJvdGF0ZU1hdHJpeChhbmdlbCx4LHkseilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgc2V0VHJhbnNsYXRlID0gKHgseSx6KT0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQudHJhbnNsYXRlTWF0cml4KHgseSx6KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBzZXRTY2FsZSA9IChTeCxTeSxTeik9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0LnNjYWxlTWF0cml4KFN4LFN5LFN6KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBzZXRWaWV3ID0gKGV5ZVgsIGV5ZVksIGV5ZVosIGNlbnRlclgsIGNlbnRlclksIGNlbnRlclosIHVwWCwgdXBZLCB1cFopPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC52aWV3TWF0cml4KGV5ZVgsIGV5ZVksIGV5ZVosIGNlbnRlclgsIGNlbnRlclksIGNlbnRlclosIHVwWCwgdXBZLCB1cFopXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgc2V0UGVyc3BlY3RpdmUgPSAoZm92LCBhc3BlY3QsIG5lYXIsIGZhcikgPT4ge1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQucGVyc3BlY3RpdmVNYXRyaXgoZm92LCBhc3BlY3QsIG5lYXIsIGZhcilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgc2V0SW52ZXJzZU9mID0gKG1hdHJpeCkgPT4ge1xuICAgICAgY29uc3QgaW52ZXJzZU1hdHJpeCA9IE1hdHJpeDQuaW52ZXJzZU9mKG1hdHJpeClcbiAgICAgIGlmIChpbnZlcnNlTWF0cml4KSB7XG4gICAgICAgIHRoaXMubWF0cml4ID0gaW52ZXJzZU1hdHJpeFxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgLyoqXG4gICAgICog5rGC5LiA5Liq55+p6Zi155qE6YCG55+p6Zi1XG4gICAgICogQHBhcmFtICB7TWF0cml4NH0gbWF0cml4IOefqemYtVxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheX0gICDnn6npmLXmlbDnu4RcbiAgICAgKi9cbiAgICBzdGF0aWMgaW52ZXJzZU9mID0gKG1hdHJpeCkgPT4ge1xuICAgICAgbGV0IGksIHMsIGQsIGludiwgZGV0XG5cbiAgICAgIHMgPSBtYXRyaXgubWF0cml4O1xuICAgICAgZCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xuICAgICAgaW52ID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XG5cbiAgICAgIGludlswXSAgPSAgIHNbNV0qc1sxMF0qc1sxNV0gLSBzWzVdICpzWzExXSpzWzE0XSAtIHNbOV0gKnNbNl0qc1sxNV1cbiAgICAgICAgICAgICAgICArIHNbOV0qc1s3XSAqc1sxNF0gKyBzWzEzXSpzWzZdICpzWzExXSAtIHNbMTNdKnNbN10qc1sxMF07XG4gICAgICBpbnZbNF0gID0gLSBzWzRdKnNbMTBdKnNbMTVdICsgc1s0XSAqc1sxMV0qc1sxNF0gKyBzWzhdICpzWzZdKnNbMTVdXG4gICAgICAgICAgICAgICAgLSBzWzhdKnNbN10gKnNbMTRdIC0gc1sxMl0qc1s2XSAqc1sxMV0gKyBzWzEyXSpzWzddKnNbMTBdO1xuICAgICAgaW52WzhdICA9ICAgc1s0XSpzWzldICpzWzE1XSAtIHNbNF0gKnNbMTFdKnNbMTNdIC0gc1s4XSAqc1s1XSpzWzE1XVxuICAgICAgICAgICAgICAgICsgc1s4XSpzWzddICpzWzEzXSArIHNbMTJdKnNbNV0gKnNbMTFdIC0gc1sxMl0qc1s3XSpzWzldO1xuICAgICAgaW52WzEyXSA9IC0gc1s0XSpzWzldICpzWzE0XSArIHNbNF0gKnNbMTBdKnNbMTNdICsgc1s4XSAqc1s1XSpzWzE0XVxuICAgICAgICAgICAgICAgIC0gc1s4XSpzWzZdICpzWzEzXSAtIHNbMTJdKnNbNV0gKnNbMTBdICsgc1sxMl0qc1s2XSpzWzldO1xuXG4gICAgICBpbnZbMV0gID0gLSBzWzFdKnNbMTBdKnNbMTVdICsgc1sxXSAqc1sxMV0qc1sxNF0gKyBzWzldICpzWzJdKnNbMTVdXG4gICAgICAgICAgICAgICAgLSBzWzldKnNbM10gKnNbMTRdIC0gc1sxM10qc1syXSAqc1sxMV0gKyBzWzEzXSpzWzNdKnNbMTBdO1xuICAgICAgaW52WzVdICA9ICAgc1swXSpzWzEwXSpzWzE1XSAtIHNbMF0gKnNbMTFdKnNbMTRdIC0gc1s4XSAqc1syXSpzWzE1XVxuICAgICAgICAgICAgICAgICsgc1s4XSpzWzNdICpzWzE0XSArIHNbMTJdKnNbMl0gKnNbMTFdIC0gc1sxMl0qc1szXSpzWzEwXTtcbiAgICAgIGludls5XSAgPSAtIHNbMF0qc1s5XSAqc1sxNV0gKyBzWzBdICpzWzExXSpzWzEzXSArIHNbOF0gKnNbMV0qc1sxNV1cbiAgICAgICAgICAgICAgICAtIHNbOF0qc1szXSAqc1sxM10gLSBzWzEyXSpzWzFdICpzWzExXSArIHNbMTJdKnNbM10qc1s5XTtcbiAgICAgIGludlsxM10gPSAgIHNbMF0qc1s5XSAqc1sxNF0gLSBzWzBdICpzWzEwXSpzWzEzXSAtIHNbOF0gKnNbMV0qc1sxNF1cbiAgICAgICAgICAgICAgICArIHNbOF0qc1syXSAqc1sxM10gKyBzWzEyXSpzWzFdICpzWzEwXSAtIHNbMTJdKnNbMl0qc1s5XTtcblxuICAgICAgaW52WzJdICA9ICAgc1sxXSpzWzZdKnNbMTVdIC0gc1sxXSAqc1s3XSpzWzE0XSAtIHNbNV0gKnNbMl0qc1sxNV1cbiAgICAgICAgICAgICAgICArIHNbNV0qc1szXSpzWzE0XSArIHNbMTNdKnNbMl0qc1s3XSAgLSBzWzEzXSpzWzNdKnNbNl07XG4gICAgICBpbnZbNl0gID0gLSBzWzBdKnNbNl0qc1sxNV0gKyBzWzBdICpzWzddKnNbMTRdICsgc1s0XSAqc1syXSpzWzE1XVxuICAgICAgICAgICAgICAgIC0gc1s0XSpzWzNdKnNbMTRdIC0gc1sxMl0qc1syXSpzWzddICArIHNbMTJdKnNbM10qc1s2XTtcbiAgICAgIGludlsxMF0gPSAgIHNbMF0qc1s1XSpzWzE1XSAtIHNbMF0gKnNbN10qc1sxM10gLSBzWzRdICpzWzFdKnNbMTVdXG4gICAgICAgICAgICAgICAgKyBzWzRdKnNbM10qc1sxM10gKyBzWzEyXSpzWzFdKnNbN10gIC0gc1sxMl0qc1szXSpzWzVdO1xuICAgICAgaW52WzE0XSA9IC0gc1swXSpzWzVdKnNbMTRdICsgc1swXSAqc1s2XSpzWzEzXSArIHNbNF0gKnNbMV0qc1sxNF1cbiAgICAgICAgICAgICAgICAtIHNbNF0qc1syXSpzWzEzXSAtIHNbMTJdKnNbMV0qc1s2XSAgKyBzWzEyXSpzWzJdKnNbNV07XG5cbiAgICAgIGludlszXSAgPSAtIHNbMV0qc1s2XSpzWzExXSArIHNbMV0qc1s3XSpzWzEwXSArIHNbNV0qc1syXSpzWzExXVxuICAgICAgICAgICAgICAgIC0gc1s1XSpzWzNdKnNbMTBdIC0gc1s5XSpzWzJdKnNbN10gICsgc1s5XSpzWzNdKnNbNl07XG4gICAgICBpbnZbN10gID0gICBzWzBdKnNbNl0qc1sxMV0gLSBzWzBdKnNbN10qc1sxMF0gLSBzWzRdKnNbMl0qc1sxMV1cbiAgICAgICAgICAgICAgICArIHNbNF0qc1szXSpzWzEwXSArIHNbOF0qc1syXSpzWzddICAtIHNbOF0qc1szXSpzWzZdO1xuICAgICAgaW52WzExXSA9IC0gc1swXSpzWzVdKnNbMTFdICsgc1swXSpzWzddKnNbOV0gICsgc1s0XSpzWzFdKnNbMTFdXG4gICAgICAgICAgICAgICAgLSBzWzRdKnNbM10qc1s5XSAgLSBzWzhdKnNbMV0qc1s3XSAgKyBzWzhdKnNbM10qc1s1XTtcbiAgICAgIGludlsxNV0gPSAgIHNbMF0qc1s1XSpzWzEwXSAtIHNbMF0qc1s2XSpzWzldICAtIHNbNF0qc1sxXSpzWzEwXVxuICAgICAgICAgICAgICAgICsgc1s0XSpzWzJdKnNbOV0gICsgc1s4XSpzWzFdKnNbNl0gIC0gc1s4XSpzWzJdKnNbNV07XG5cbiAgICAgIGRldCA9IHNbMF0qaW52WzBdICsgc1sxXSppbnZbNF0gKyBzWzJdKmludls4XSArIHNbM10qaW52WzEyXTtcbiAgICAgIGlmIChkZXQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGRldCA9IDEgLyBkZXQ7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkrKykge1xuICAgICAgICBkW2ldID0gaW52W2ldICogZGV0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZFxuICAgIH1cbiAgICAvKipcbiAgICAgKiDojrflj5bpgI/op4bmipXlvbHnn6npmLVcbiAgICAgKiBAcGFyYW0gIGZvdiAgICDmjIflrprlnoLnm7Top4bop5LvvIzljbPlj6/op4bnqbrpl7TpobbpnaLlkozlupXpnaLpl7TnmoTlpLnop5LvvIzlv4XpobvlpKfkuo4wXG4gICAgICogQHBhcmFtICBhc3BlY3Qg5oyH5a6a6L+R5Ymq6KOB6Z2i55qE5a696auY5q+U77yI5a695bqm77yP6auY5bqm77yJXG4gICAgICogQHBhcmFtICBuZWFyICAg5oyH5a6a6L+R5Ymq6KOB6Z2i55qE5L2N572u77yM5Y2z5Y+v6KeG56m66Ze055qE6L+R6L6555WMXG4gICAgICogQHBhcmFtICBmYXIgICAg5oyH5a6a6L+c5Ymq6KOB6Z2i55qE5L2N572u77yM5Y2z5Y+v6KeG56m66Ze055qE6L+c6L6555WMXG4gICAgICogQHJldHVybiBtYXRyaXgg6YCP6KeG5oqV5b2x55+p6Zi1XG4gICAgICovXG4gICAgc3RhdGljIHBlcnNwZWN0aXZlTWF0cml4ID0gKGZvdiwgYXNwZWN0LCBuZWFyLCBmYXIpID0+IHtcbiAgICAgICAgbGV0IG1hdHJpeCwgcmQsIHMsIGN0XG5cbiAgICAgICAgaWYgKG5lYXIgPT09IGZhciB8fCBhc3BlY3QgPT09IDApIHtcbiAgICAgICAgICB0aHJvdyAnbnVsbCBmcnVzdHVtJ1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZWFyIDw9IDApIHtcbiAgICAgICAgICB0aHJvdyAnbmVhciA8PSAwJ1xuICAgICAgICB9XG4gICAgICAgIGlmIChmYXIgPD0gMCkge1xuICAgICAgICAgIHRocm93ICdmYXIgPD0gMCdcbiAgICAgICAgfVxuXG4gICAgICAgIGZvdiA9IE1hdGguUEkgKiBmb3YgLyAxODAgLyAyXG4gICAgICAgIHMgPSBNYXRoLnNpbihmb3YpXG4gICAgICAgIGlmIChzID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgJ251bGwgZnJ1c3R1bSdcbiAgICAgICAgfVxuICAgICAgICByZCA9IDEgLyAoZmFyIC0gbmVhcilcbiAgICAgICAgY3QgPSBNYXRoLmNvcyhmb3YpIC8gc1xuXG4gICAgICAgIG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpXG5cbiAgICAgICAgbWF0cml4WzBdICA9IGN0IC8gYXNwZWN0XG4gICAgICAgIG1hdHJpeFsxXSAgPSAwXG4gICAgICAgIG1hdHJpeFsyXSAgPSAwXG4gICAgICAgIG1hdHJpeFszXSAgPSAwXG5cbiAgICAgICAgbWF0cml4WzRdICA9IDBcbiAgICAgICAgbWF0cml4WzVdICA9IGN0XG4gICAgICAgIG1hdHJpeFs2XSAgPSAwXG4gICAgICAgIG1hdHJpeFs3XSAgPSAwXG5cbiAgICAgICAgbWF0cml4WzhdICA9IDBcbiAgICAgICAgbWF0cml4WzldICA9IDBcbiAgICAgICAgbWF0cml4WzEwXSA9IC0oZmFyICsgbmVhcikgKiByZFxuICAgICAgICBtYXRyaXhbMTFdID0gLTFcblxuICAgICAgICBtYXRyaXhbMTJdID0gMFxuICAgICAgICBtYXRyaXhbMTNdID0gMFxuICAgICAgICBtYXRyaXhbMTRdID0gLTIgKiBuZWFyICogZmFyICogcmRcbiAgICAgICAgbWF0cml4WzE1XSA9IDBcbiAgICAgICAgcmV0dXJuIG1hdHJpeFxuICAgIH1cbiAgICBzdGF0aWMgb3J0aG9NYXRyaXggPSAobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpID0+IHtcbiAgICAgICAgbGV0IG1hdHJpeCwgcncsIHJoLCByZDtcblxuICAgICAgICBpZiAobGVmdCA9PT0gcmlnaHQgfHwgYm90dG9tID09PSB0b3AgfHwgbmVhciA9PT0gZmFyKSB7XG4gICAgICAgICAgdGhyb3cgJ251bGwgZnJ1c3R1bSc7XG4gICAgICAgIH1cblxuICAgICAgICBydyA9IDEgLyAocmlnaHQgLSBsZWZ0KTtcbiAgICAgICAgcmggPSAxIC8gKHRvcCAtIGJvdHRvbSk7XG4gICAgICAgIHJkID0gMSAvIChmYXIgLSBuZWFyKTtcblxuICAgICAgICBtYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KDE2KVxuXG4gICAgICAgIG1hdHJpeFswXSAgPSAyICogcnc7XG4gICAgICAgIG1hdHJpeFsxXSAgPSAwO1xuICAgICAgICBtYXRyaXhbMl0gID0gMDtcbiAgICAgICAgbWF0cml4WzNdICA9IDA7XG5cbiAgICAgICAgbWF0cml4WzRdICA9IDA7XG4gICAgICAgIG1hdHJpeFs1XSAgPSAyICogcmg7XG4gICAgICAgIG1hdHJpeFs2XSAgPSAwO1xuICAgICAgICBtYXRyaXhbN10gID0gMDtcblxuICAgICAgICBtYXRyaXhbOF0gID0gMDtcbiAgICAgICAgbWF0cml4WzldICA9IDA7XG4gICAgICAgIG1hdHJpeFsxMF0gPSAtMiAqIHJkO1xuICAgICAgICBtYXRyaXhbMTFdID0gMDtcblxuICAgICAgICBtYXRyaXhbMTJdID0gLShyaWdodCArIGxlZnQpICogcnc7XG4gICAgICAgIG1hdHJpeFsxM10gPSAtKHRvcCArIGJvdHRvbSkgKiByaDtcbiAgICAgICAgbWF0cml4WzE0XSA9IC0oZmFyICsgbmVhcikgKiByZDtcbiAgICAgICAgbWF0cml4WzE1XSA9IDE7XG5cbiAgICAgICAgcmV0dXJuIG1hdHJpeFxuICAgIH1cbiAgICBzdGF0aWMgdmlld01hdHJpeCA9IChleWVYLCBleWVZLCBleWVaLCBjZW50ZXJYLCBjZW50ZXJZLCBjZW50ZXJaLCB1cFgsIHVwWSwgdXBaKT0+e1xuICAgICAgICBsZXQgZSwgZngsIGZ5LCBmeiwgcmxmLCBzeCwgc3ksIHN6LCBybHMsIHV4LCB1eSwgdXpcblxuICAgICAgICBmeCA9IGNlbnRlclggLSBleWVYXG4gICAgICAgIGZ5ID0gY2VudGVyWSAtIGV5ZVlcbiAgICAgICAgZnogPSBjZW50ZXJaIC0gZXllWlxuXG4gICAgICAgIC8vIE5vcm1hbGl6ZSBmLlxuICAgICAgICBybGYgPSAxIC8gTWF0aC5zcXJ0KGZ4KmZ4ICsgZnkqZnkgKyBmeipmeilcbiAgICAgICAgZnggKj0gcmxmXG4gICAgICAgIGZ5ICo9IHJsZlxuICAgICAgICBmeiAqPSBybGZcblxuICAgICAgICAvLyBDYWxjdWxhdGUgY3Jvc3MgcHJvZHVjdCBvZiBmIGFuZCB1cC5cbiAgICAgICAgc3ggPSBmeSAqIHVwWiAtIGZ6ICogdXBZXG4gICAgICAgIHN5ID0gZnogKiB1cFggLSBmeCAqIHVwWlxuICAgICAgICBzeiA9IGZ4ICogdXBZIC0gZnkgKiB1cFhcblxuICAgICAgICAvLyBOb3JtYWxpemUgcy5cbiAgICAgICAgcmxzID0gMSAvIE1hdGguc3FydChzeCpzeCArIHN5KnN5ICsgc3oqc3opXG4gICAgICAgIHN4ICo9IHJsc1xuICAgICAgICBzeSAqPSBybHNcbiAgICAgICAgc3ogKj0gcmxzXG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGNyb3NzIHByb2R1Y3Qgb2YgcyBhbmQgZi5cbiAgICAgICAgdXggPSBzeSAqIGZ6IC0gc3ogKiBmeVxuICAgICAgICB1eSA9IHN6ICogZnggLSBzeCAqIGZ6XG4gICAgICAgIHV6ID0gc3ggKiBmeSAtIHN5ICogZnhcblxuICAgICAgICBsZXQgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheSgxNilcbiAgICAgICAgbWF0cml4WzBdID0gc3hcbiAgICAgICAgbWF0cml4WzFdID0gdXhcbiAgICAgICAgbWF0cml4WzJdID0gLWZ4XG4gICAgICAgIG1hdHJpeFszXSA9IDBcblxuICAgICAgICBtYXRyaXhbNF0gPSBzeVxuICAgICAgICBtYXRyaXhbNV0gPSB1eVxuICAgICAgICBtYXRyaXhbNl0gPSAtZnlcbiAgICAgICAgbWF0cml4WzddID0gMFxuXG4gICAgICAgIG1hdHJpeFs4XSA9IHN6XG4gICAgICAgIG1hdHJpeFs5XSA9IHV6XG4gICAgICAgIG1hdHJpeFsxMF0gPSAtZnpcbiAgICAgICAgbWF0cml4WzExXSA9IDBcblxuICAgICAgICBtYXRyaXhbMTJdID0gMFxuICAgICAgICBtYXRyaXhbMTNdID0gMFxuICAgICAgICBtYXRyaXhbMTRdID0gMFxuICAgICAgICBtYXRyaXhbMTVdID0gMVxuXG4gICAgICAgIHJldHVybiBNYXRyaXg0Lm11bHRpcGx5KG1hdHJpeCxNYXRyaXg0LnRyYW5zbGF0ZU1hdHJpeCgtZXllWCwgLWV5ZVksIC1leWVaKSlcbiAgICB9XG4gICAgc3RhdGljIHJvdGF0ZU1hdHJpeCA9IChhbmdlbCx4LHkseikgPT4ge1xuICAgICAgICBsZXQgcmFkaWFuID0gTWF0aC5QSSAqIGFuZ2VsIC8gMTgwLjBcbiAgICAgICAgbGV0IHMgPSBNYXRoLnNpbihyYWRpYW4pXG4gICAgICAgIGxldCBjID0gTWF0aC5jb3MocmFkaWFuKVxuXG4gICAgICAgIGlmICh4IT09MCYmeT09PTAmJno9PT0wKSB7XG4gICAgICAgICAgICBpZiAoeCA8IDApIHtcbiAgICAgICAgICAgICAgcyA9IC1zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTWF0cml4NC5yb3RhdGVYTWF0cml4KHMsYylcbiAgICAgICAgfVxuICAgICAgICBpZiAoeD09PTAmJnkhPT0wJiZ6PT09MCkge1xuICAgICAgICAgICAgaWYgKHkgPCAwKSB7XG4gICAgICAgICAgICAgIHMgPSAtc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE1hdHJpeDQucm90YXRlWU1hdHJpeChzLGMpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHg9PT0wJiZ5PT09MCYmeiE9PTApIHtcbiAgICAgICAgICAgIGlmICh6PDApIHtcbiAgICAgICAgICAgICAgICBzID0gLXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBNYXRyaXg0LnJvdGF0ZVpNYXRyaXgocyxjKVxuICAgICAgICB9XG4gICAgICAgIGxldCBtYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KDE2KVxuICAgICAgICBsZW4gPSBNYXRoLnNxcnQoeCp4ICsgeSp5ICsgeip6KVxuICAgICAgICBpZiAobGVuICE9PSAxKSB7XG4gICAgICAgICAgcmxlbiA9IDEgLyBsZW5cbiAgICAgICAgICB4ICo9IHJsZW5cbiAgICAgICAgICB5ICo9IHJsZW5cbiAgICAgICAgICB6ICo9IHJsZW5cbiAgICAgICAgfVxuICAgICAgICBuYyA9IDEgLSBjXG4gICAgICAgIHh5ID0geCAqIHlcbiAgICAgICAgeXogPSB5ICogelxuICAgICAgICB6eCA9IHogKiB4XG4gICAgICAgIHhzID0geCAqIHNcbiAgICAgICAgeXMgPSB5ICogc1xuICAgICAgICB6cyA9IHogKiBzXG5cbiAgICAgICAgbWF0cml4WyAwXSA9IHgqeCpuYyArICBjXG4gICAgICAgIG1hdHJpeFsgMV0gPSB4eSAqbmMgKyB6c1xuICAgICAgICBtYXRyaXhbIDJdID0genggKm5jIC0geXNcbiAgICAgICAgbWF0cml4WyAzXSA9IDBcblxuICAgICAgICBtYXRyaXhbIDRdID0geHkgKm5jIC0genNcbiAgICAgICAgbWF0cml4WyA1XSA9IHkqeSpuYyArICBjXG4gICAgICAgIG1hdHJpeFsgNl0gPSB5eiAqbmMgKyB4c1xuICAgICAgICBtYXRyaXhbIDddID0gMFxuXG4gICAgICAgIG1hdHJpeFsgOF0gPSB6eCAqbmMgKyB5c1xuICAgICAgICBtYXRyaXhbIDldID0geXogKm5jIC0geHNcbiAgICAgICAgbWF0cml4WzEwXSA9IHoqeipuYyArICBjXG4gICAgICAgIG1hdHJpeFsxMV0gPSAwXG5cbiAgICAgICAgbWF0cml4WzEyXSA9IDBcbiAgICAgICAgbWF0cml4WzEzXSA9IDBcbiAgICAgICAgbWF0cml4WzE0XSA9IDBcbiAgICAgICAgbWF0cml4WzE1XSA9IDFcblxuICAgICAgICByZXR1cm4gbWF0cml4XG4gICAgfVxuICAgIHN0YXRpYyB0cmFuc2xhdGVNYXRyaXggPSAoeCx5LHopPT57XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLDAsMCwwLCAwLDEsMCwwLCAwLDAsMSwwLCB4LHkseiwxXSlcbiAgICB9XG4gICAgc3RhdGljIHNjYWxlTWF0cml4ID0gKFN4LFN5LFN6KT0+e1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbU3gsMCwwLDAsIDAsU3ksMCwwLCAwLDAsU3osMCwgMCwwLDAsMV0pXG4gICAgfVxuICAgIHN0YXRpYyB1bml0TWF0cml4NCA9ICgpPT57XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLDAsMCwwLCAwLDEsMCwwLCAwLDAsMSwwLCAwLDAsMCwxXSlcbiAgICB9XG4gICAgc3RhdGljIHJvdGF0ZVhNYXRyaXggPSAocyxjKT0+e1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwwLDAsMCwgMCxjLHMsMCwgMCwtcyxjLDAsIDAsMCwwLDFdKVxuICAgIH1cbiAgICBzdGF0aWMgcm90YXRlWU1hdHJpeCA9IChzLGMpPT57XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtjLDAsLXMsMCwgMCwxLDAsMCwgcywwLGMsMCwgMCwwLDAsMV0pXG4gICAgfVxuICAgIHN0YXRpYyByb3RhdGVaTWF0cml4ID0gKHMsYyk9PntcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2MscywwLDAsIC1zLGMsMCwwLCAwLDAsMSwwLCAwLDAsMCwxXSlcbiAgICB9XG4gICAgc3RhdGljIGFkZCA9IChtYXRyaXgxLG1hdHJpeDIpPT57XG4gICAgICAgIGNvbnN0IGxlbjEgPSBtYXRyaXgxLmxlbmd0aCwgbGVuMiA9IG1hdHJpeDIubGVuZ3RoXG4gICAgICAgIGlmIChsZW4xICE9IGxlbjIpIHtcbiAgICAgICAgICAgIHRocm93ICfnn6npmLUx5ZKM55+p6Zi1MumVv+W6puS4jeS4gOiHtCdcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheShsZW4xKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjE7IGkrKykge1xuICAgICAgICAgICAgbWF0cml4W2ldID0gbWF0cml4MVtpXSArIG1hdHJpeDJbaV1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF0cml4XG4gICAgfVxuICAgIHN0YXRpYyBzdWJ0cmFjdCA9IChtYXRyaXgxLG1hdHJpeDIpPT57XG4gICAgICAgIGxldCBtYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KDE2KVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICAgICAgICAgIG1hdHJpeFtpXSA9IG1hdHJpeDFbaV0gLSBtYXRyaXgyW2ldXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdHJpeFxuICAgIH1cbiAgICBzdGF0aWMgbXVsdGlwbHkgPSAobWF0cml4MSxtYXRyaXgyKT0+e1xuICAgICAgICBsZXQgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheSgxNilcblxuICAgICAgICBtYXRyaXhbMF0gPSBtYXRyaXgxWzBdKm1hdHJpeDJbMF0gKyBtYXRyaXgxWzRdKm1hdHJpeDJbMV0gKyBtYXRyaXgxWzhdKm1hdHJpeDJbMl0gKyBtYXRyaXgxWzEyXSptYXRyaXgyWzNdXG4gICAgICAgIG1hdHJpeFs0XSA9IG1hdHJpeDFbMF0qbWF0cml4Mls0XSArIG1hdHJpeDFbNF0qbWF0cml4Mls1XSArIG1hdHJpeDFbOF0qbWF0cml4Mls2XSArIG1hdHJpeDFbMTJdKm1hdHJpeDJbN11cbiAgICAgICAgbWF0cml4WzhdID0gbWF0cml4MVswXSptYXRyaXgyWzhdICsgbWF0cml4MVs0XSptYXRyaXgyWzldICsgbWF0cml4MVs4XSptYXRyaXgyWzEwXSArIG1hdHJpeDFbMTJdKm1hdHJpeDJbMTFdXG4gICAgICAgIG1hdHJpeFsxMl0gPSBtYXRyaXgxWzBdKm1hdHJpeDJbMTJdICsgbWF0cml4MVs0XSptYXRyaXgyWzEzXSArIG1hdHJpeDFbOF0qbWF0cml4MlsxNF0gKyBtYXRyaXgxWzEyXSptYXRyaXgyWzE1XVxuXG4gICAgICAgIG1hdHJpeFsxXSA9IG1hdHJpeDFbMV0qbWF0cml4MlswXSArIG1hdHJpeDFbNV0qbWF0cml4MlsxXSArIG1hdHJpeDFbOV0qbWF0cml4MlsyXSArIG1hdHJpeDFbMTNdKm1hdHJpeDJbM11cbiAgICAgICAgbWF0cml4WzVdID0gbWF0cml4MVsxXSptYXRyaXgyWzRdICsgbWF0cml4MVs1XSptYXRyaXgyWzVdICsgbWF0cml4MVs5XSptYXRyaXgyWzZdICsgbWF0cml4MVsxM10qbWF0cml4Mls3XVxuICAgICAgICBtYXRyaXhbOV0gPSBtYXRyaXgxWzFdKm1hdHJpeDJbOF0gKyBtYXRyaXgxWzVdKm1hdHJpeDJbOV0gKyBtYXRyaXgxWzldKm1hdHJpeDJbMTBdICsgbWF0cml4MVsxM10qbWF0cml4MlsxMV1cbiAgICAgICAgbWF0cml4WzEzXSA9IG1hdHJpeDFbMV0qbWF0cml4MlsxMl0gKyBtYXRyaXgxWzVdKm1hdHJpeDJbMTNdICsgbWF0cml4MVs5XSptYXRyaXgyWzE0XSArIG1hdHJpeDFbMTNdKm1hdHJpeDJbMTVdXG5cbiAgICAgICAgbWF0cml4WzJdID0gbWF0cml4MVsyXSptYXRyaXgyWzBdICsgbWF0cml4MVs2XSptYXRyaXgyWzFdICsgbWF0cml4MVsxMF0qbWF0cml4MlsyXSArIG1hdHJpeDFbMTRdKm1hdHJpeDJbM11cbiAgICAgICAgbWF0cml4WzZdID0gbWF0cml4MVsyXSptYXRyaXgyWzRdICsgbWF0cml4MVs2XSptYXRyaXgyWzVdICsgbWF0cml4MVsxMF0qbWF0cml4Mls2XSArIG1hdHJpeDFbMTRdKm1hdHJpeDJbN11cbiAgICAgICAgbWF0cml4WzEwXSA9IG1hdHJpeDFbMl0qbWF0cml4Mls4XSArIG1hdHJpeDFbNl0qbWF0cml4Mls5XSArIG1hdHJpeDFbMTBdKm1hdHJpeDJbMTBdICsgbWF0cml4MVsxNF0qbWF0cml4MlsxMV1cbiAgICAgICAgbWF0cml4WzE0XSA9IG1hdHJpeDFbMl0qbWF0cml4MlsxMl0gKyBtYXRyaXgxWzZdKm1hdHJpeDJbMTNdICsgbWF0cml4MVsxMF0qbWF0cml4MlsxNF0gKyBtYXRyaXgxWzE0XSptYXRyaXgyWzE1XVxuXG4gICAgICAgIG1hdHJpeFszXSA9IG1hdHJpeDFbM10qbWF0cml4MlswXSArIG1hdHJpeDFbN10qbWF0cml4MlsxXSArIG1hdHJpeDFbMTFdKm1hdHJpeDJbMl0gKyBtYXRyaXgxWzE1XSptYXRyaXgyWzNdXG4gICAgICAgIG1hdHJpeFs3XSA9IG1hdHJpeDFbM10qbWF0cml4Mls0XSArIG1hdHJpeDFbN10qbWF0cml4Mls1XSArIG1hdHJpeDFbMTFdKm1hdHJpeDJbNl0gKyBtYXRyaXgxWzE1XSptYXRyaXgyWzddXG4gICAgICAgIG1hdHJpeFsxMV0gPSBtYXRyaXgxWzNdKm1hdHJpeDJbOF0gKyBtYXRyaXgxWzddKm1hdHJpeDJbOV0gKyBtYXRyaXgxWzExXSptYXRyaXgyWzEwXSArIG1hdHJpeDFbMTVdKm1hdHJpeDJbMTFdXG4gICAgICAgIG1hdHJpeFsxNV0gPSBtYXRyaXgxWzNdKm1hdHJpeDJbMTJdICsgbWF0cml4MVs3XSptYXRyaXgyWzEzXSArIG1hdHJpeDFbMTFdKm1hdHJpeDJbMTRdICsgbWF0cml4MVsxNV0qbWF0cml4MlsxNV1cblxuICAgICAgICByZXR1cm4gbWF0cml4XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBNYXRyaXg0XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9saWIvd2ViZ2wvbWF0cml4NC5qc1xuICoqLyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5cbmltcG9ydCB7aW5pdFNoYWRlcnN9IGZyb20gJ1dlQkdMVXRpbHMnXG5cbmltcG9ydCBNYXRyaXg0IGZyb20gJ01hdHJpeDQnXG5cbmNvbnN0IFZTSEFERVJfU09VUkNFID0gYFxuICAgIGF0dHJpYnV0ZSB2ZWM0IGFfUG9zaXRpb247XG4gICAgYXR0cmlidXRlIHZlYzQgYV9Db2xvcjtcbiAgICB1bmlmb3JtIG1hdDQgdV9WaWV3TWF0cml4O1xuICAgIHZhcnlpbmcgdmVjNCB2X0NvbG9yO1xuICAgIHZvaWQgbWFpbigpe1xuICAgICAgICBnbF9Qb3NpdGlvbiA9IHVfVmlld01hdHJpeCAqIGFfUG9zaXRpb247XG4gICAgICAgIHZfQ29sb3IgPSBhX0NvbG9yO1xuICAgIH1cbmBcblxuY29uc3QgRlNIQURFUl9TT1VSQ0UgPSBgXG4gICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gICAgdmFyeWluZyB2ZWM0IHZfQ29sb3I7XG4gICAgdm9pZCBtYWluKCl7XG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHZfQ29sb3I7XG4gICAgfVxuYFxuXG5jbGFzcyBMb29rQXRUcmlhbmdsZXNXaXRoS2V5cyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpXG4gICAgfVxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY2FudmFzID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzWydjYW52YXMnXSlcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IDgwMFxuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IDYwMFxuXG4gICAgICAgICAgICBjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpXG4gICAgICAgICAgICBpZiAoIWluaXRTaGFkZXJzKGdsLFZTSEFERVJfU09VUkNFLEZTSEFERVJfU09VUkNFKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdGYWlsZCB0byBpbml0IFNoYWRlcnMnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG4gPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXIoZ2wpXG5cbiAgICAgICAgICAgIGNvbnN0IHVfVmlld01hdHJpeCA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihnbC5wcm9ncmFtLCd1X1ZpZXdNYXRyaXgnKVxuICAgICAgICAgICAgaWYgKCF1X1ZpZXdNYXRyaXgpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnY2FuIG5vdCBmaW5kIHN0b3JhZ2UgbG9jYXRpb24gb2YgdV9WaWV3TWF0cml4J1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB2aWV3TWF0cml4ID0gbmV3IE1hdHJpeDQoKVxuICAgICAgICAgICAgY29uc3QgZXllID0ge3g6MC4yMCx5OjAuMjUsejowLjI1fVxuICAgICAgICAgICAgdGhpcy5oYW5kbGVLZXlEb3duV3JhcCA9IChlKT0+e3RoaXMuaGFuZGxlS2V5RG93bihlLGdsLG4sdV9WaWV3TWF0cml4LHZpZXdNYXRyaXgsZXllKX1cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLHRoaXMuaGFuZGxlS2V5RG93bldyYXApXG5cbiAgICAgICAgICAgIGdsLmNsZWFyQ29sb3IoMC4wLDAuMCwwLjAsMS4wKVxuXG4gICAgICAgICAgICB0aGlzLmRyYXcoZ2wsbix1X1ZpZXdNYXRyaXgsdmlld01hdHJpeCxleWUpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgIH1cbiAgICB9XG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLHRoaXMuaGFuZGxlS2V5RG93bldyYXApXG4gICAgfVxuICAgIGhhbmRsZUtleURvd24gPSAoZSxnbCxuLHVfVmlld01hdHJpeCx2aWV3TWF0cml4LGV5ZSk9PntcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAzOSkge1xuICAgICAgICAgICAgZXllLnggKz0gMC4wMVxuICAgICAgICB9ZWxzZSBpZiAoZS5rZXlDb2RlID09IDM3KSB7XG4gICAgICAgICAgICBleWUueCAtPSAwLjAxXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJhdyhnbCxuLHVfVmlld01hdHJpeCx2aWV3TWF0cml4LGV5ZSlcbiAgICB9XG4gICAgZHJhdz0oZ2wsbix1X1ZpZXdNYXRyaXgsdmlld01hdHJpeCx7eCx5LHp9KT0+e1xuICAgICAgICB2aWV3TWF0cml4LnNldFZpZXcoeCx5LHosMCwwLDAsMCwxLDApXG5cbiAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDRmdih1X1ZpZXdNYXRyaXgsZmFsc2Usdmlld01hdHJpeC5tYXRyaXgpXG5cbiAgICAgICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVClcblxuICAgICAgICBnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFUywwLG4pXG4gICAgfVxuICAgIGluaXRWZXJ0ZXhCdWZmZXIoZ2wpe1xuICAgICAgICAvL+mhtueCueWdkOagh+WSjOminOiJslxuICAgICAgICBjb25zdCB2ZXJ0ZXhzID0gbmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAgICAgICAwLjAsMC41LC0wLjQsIDAuNCwxLjAsMC40LFxuICAgICAgICAgICAgLTAuNSwtMC41LC0wLjQsIDAuNCwxLjAsMC40LFxuICAgICAgICAgICAgMC41LC0wLjUsLTAuNCwgMS4wLDAuNCwwLjQsXG5cbiAgICAgICAgICAgIDAuNSwwLjQsLTAuMiwgMS4wLDAuNCwwLjQsXG4gICAgICAgICAgICAtMC41LDAuNSwtMC4yLCAxLjAsMS4wLDAuNCxcbiAgICAgICAgICAgIDAuMCwwLjYsLTAuMiwgMS4wLDEuMCwwLjQsXG5cbiAgICAgICAgICAgIDAuMCwwLjUsMC4wLCAwLjQsMC40LDEuMCxcbiAgICAgICAgICAgIC0wLjUsLTAuNSwwLjAsIDAuNCwwLjQsMS4wLFxuICAgICAgICAgICAgMC41LC0wLjUsMC4wLCAxLjAsMC40LDAuNFxuICAgICAgICBdKVxuICAgICAgICBjb25zdCBGU0laRSA9IHZlcnRleHMuQllURVNfUEVSX0VMRU1FTlRcblxuICAgICAgICBjb25zdCB2ZXJ0ZXhCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKVxuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUix2ZXJ0ZXhCdWZmZXIpXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLHZlcnRleHMsZ2wuU1RBVElDX0RSQVcpXG5cbiAgICAgICAgLy9hX1Bvc2l0aW9uXG4gICAgICAgIGNvbnN0IGFfUG9zaXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihnbC5wcm9ncmFtLCdhX1Bvc2l0aW9uJylcbiAgICAgICAgaWYgKGFfUG9zaXRpb24gPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyAnY2FuIG5vdCBmaW5kIHN0b3JhZ2UgbG9jYXRpb24gb2YgYV9Qb3NpdGlvbidcbiAgICAgICAgfVxuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGFfUG9zaXRpb24sMyxnbC5GTE9BVCxmYWxzZSxGU0laRSo2LDApXG4gICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGFfUG9zaXRpb24pXG5cbiAgICAgICAgLy9hX0NvbG9yXG4gICAgICAgIGNvbnN0IGFfQ29sb3IgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihnbC5wcm9ncmFtLCdhX0NvbG9yJylcbiAgICAgICAgaWYgKGFfUG9zaXRpb24gPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyAnY2FuIG5vdCBmaW5kIHN0b3JhZ2UgbG9jYXRpb24gb2YgYV9Db2xvcidcbiAgICAgICAgfVxuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGFfQ29sb3IsMyxnbC5GTE9BVCxmYWxzZSxGU0laRSo2LEZTSVpFKjMpXG4gICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGFfQ29sb3IpXG4gICAgICAgIHJldHVybiA5XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxmaWd1cmU+XG4gICAgICAgICAgICAgICAgPGZpZ2NhcHRpb24+eyfmlLnlj5jop4Llr5/ogIXop4bngrknfTwvZmlnY2FwdGlvbj5cbiAgICAgICAgICAgICAgICA8Y2FudmFzIHJlZj1cImNhbnZhc1wiPlxuICAgICAgICAgICAgICAgICAgICB7J3lvdXIgY3VycmVudCBicm93ZXIgZG9uXFwndCBzdXBwb3J0IGNhbnZhcyxwbGVhc2UgY2hhbmdlIGFub3RoZXIgb25lJ31cbiAgICAgICAgICAgICAgICA8L2NhbnZhcz5cbiAgICAgICAgICAgIDwvZmlndXJlPlxuICAgICAgICApXG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBMb29rQXRUcmlhbmdsZXNXaXRoS2V5c1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvbG9va0F0VHJpYW5nbGVzV2l0aEtleXMvTG9va0F0VHJpYW5nbGVzV2l0aEtleXMuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9