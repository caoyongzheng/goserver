webpackJsonp([15],{

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

/***/ 345:
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
	
	var VSHADER_SOURCE = '\n  attribute vec4 a_Position;\n  attribute vec4 a_Color;\n  uniform mat4 u_MvpMatrix;\n  varying vec4 v_Color;\n  void main(){\n      gl_Position = u_MvpMatrix * a_Position;\n      v_Color = a_Color;\n  }\n';
	
	var FSHADER_SOURCE = '\n  precision mediump float;\n  varying vec4 v_Color;\n  void main(){\n      gl_FragColor = v_Color;\n  }\n';
	
	var ColoredCube = function (_React$Component) {
	  _inherits(ColoredCube, _React$Component);
	
	  function ColoredCube() {
	    var _Object$getPrototypeO;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, ColoredCube);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(ColoredCube)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.initVertexBuffers = function (gl) {
	      //  Create a cube
	      //     v6----- v5
	      //    /|      /|
	      //   v1------v0|
	      //   | |     | |
	      //   | |v7---|-|v4
	      //   |/      |/
	      //   v2------v3
	      var vertexs = new Float32Array([1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, //  v0-v1-v2-v3 front
	      1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, //  v0-v3-v4-v5 right
	      1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, //  v0-v5-v6-v1 up
	      -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, //  v1-v6-v7-v2 left
	      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, //  v7-v4-v3-v2 down
	      1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0]);
	
	      //  Colors
	      var colors = new Float32Array([0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, //  v0-v1-v2-v3 front(blue)
	      0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, //  v0-v3-v4-v5 right(green)
	      1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, //  v0-v5-v6-v1 up(red)
	      1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, //  v1-v6-v7-v2 left
	      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, //  v7-v4-v3-v2 down
	      0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0]);
	
	      //  Indices of the vertices
	      var indices = new Uint8Array([0, 1, 2, 0, 2, 3, //  front
	      4, 5, 6, 4, 6, 7, //  right
	      8, 9, 10, 8, 10, 11, //  up
	      12, 13, 14, 12, 14, 15, //  left
	      16, 17, 18, 16, 18, 19, //  down
	      20, 21, 22, 20, 22, 23]);
	
	      //  Create a buffer object
	      var indexBuffer = gl.createBuffer();
	      if (!indexBuffer) {
	        return -1;
	      }
	
	      //  Write the vertex coordinates and color to the buffer object
	      if (!_this.initArrayBuffer(gl, vertexs, 3, gl.FLOAT, 'a_Position')) {
	        return -1;
	      }
	
	      if (!_this.initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) {
	        return -1;
	      }
	
	      //  Write the indices to the buffer object
	      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	
	      return indices.length;
	    }, _this.initArrayBuffer = function (gl, data, num, type, attribute) {
	      //  Create a buffer object
	      var buffer = gl.createBuffer();
	      if (!buffer) {
	        console.log('Failed to create the buffer object');
	        return false;
	      }
	      //  Write date into the buffer object
	      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	      //  Assign the buffer object to the attribute variable
	      var aAttribute = gl.getAttribLocation(gl.program, attribute);
	      if (aAttribute < 0) {
	        console.log('Failed to get the storage location of ' + attribute);
	        return false;
	      }
	      gl.vertexAttribPointer(aAttribute, num, type, false, 0, 0);
	      //  Enable the assignment of the buffer object to the attribute variable
	      gl.enableVertexAttribArray(aAttribute);
	
	      return true;
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(ColoredCube, [{
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
	        if (!uMvpMatrix) {
	          console.log('Failed to get the storage location of u_MvpMatrix');
	          return;
	        }
	
	        var mvpMatrix = new _Matrix2.default();
	        mvpMatrix.setView(3, 3, 7, 0, 0, 0, 0, 1, 0).perspective(30, 1, 1, 100);
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
	          '单一颜色立方体'
	        ),
	        _react2.default.createElement(
	          'canvas',
	          { ref: 'canvas' },
	          'your current brower don\'t support canvas, please change another one'
	        )
	      );
	    }
	  }]);
	
	  return ColoredCube;
	}(_react2.default.Component);
	
	module.exports = ColoredCube;

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbGliL3dlYmdsL3V0aWxzLmpzPzVkMDcqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL3dlYmdsL21hdHJpeDQuanM/MjQ5NCoqKioqIiwid2VicGFjazovLy8uL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC9jb2xvcmVkQ3ViZS9Db2xvcmVkQ3ViZS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztTQU9nQixXLEdBQUEsVztBQVBoQjs7Ozs7OztBQU9PLFVBQVMsV0FBVCxDQUFxQixFQUFyQixFQUF5QixPQUF6QixFQUFrQyxPQUFsQyxFQUEyQztBQUNoRCxPQUFJLFVBQVUsY0FBYyxFQUFkLEVBQWtCLE9BQWxCLEVBQTJCLE9BQTNCLENBQWQ7QUFDQSxPQUFJLENBQUMsT0FBTCxFQUFjO0FBQ1osYUFBUSxHQUFSLENBQVksMEJBQVo7QUFDQSxZQUFPLEtBQVA7QUFDRDs7QUFFRCxNQUFHLFVBQUgsQ0FBYyxPQUFkO0FBQ0EsTUFBRyxPQUFILEdBQWEsT0FBYjs7QUFFQSxVQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsYUFBVCxDQUF1QixFQUF2QixFQUEyQixPQUEzQixFQUFvQyxPQUFwQyxFQUE2QztBQUMzQztBQUNBLE9BQUksZUFBZSxXQUFXLEVBQVgsRUFBZSxHQUFHLGFBQWxCLEVBQWlDLE9BQWpDLENBQW5CO0FBQ0EsT0FBSSxpQkFBaUIsV0FBVyxFQUFYLEVBQWUsR0FBRyxlQUFsQixFQUFtQyxPQUFuQyxDQUFyQjtBQUNBLE9BQUksQ0FBQyxZQUFELElBQWlCLENBQUMsY0FBdEIsRUFBc0M7QUFDcEMsWUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxPQUFJLFVBQVUsR0FBRyxhQUFILEVBQWQ7QUFDQSxPQUFJLENBQUMsT0FBTCxFQUFjO0FBQ1osWUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFHLFlBQUgsQ0FBZ0IsT0FBaEIs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RUFDZ0MsQ0FEaEMsRUFDbUMsR0FEbkM7QUFFQSxZQUFHLGdCQUFILENBQW9CLFVBQXBCLEVBQWdDLEtBQWhDLEVBQXVDLFVBQVUsTUFBakQ7O0FBRUEsWUFBRyxLQUFILENBQVMsR0FBRyxnQkFBSCxHQUFzQixHQUFHLGdCQUFsQzs7QUFFQSxZQUFHLFlBQUgsQ0FBZ0IsR0FBRyxTQUFuQixFQUE4QixDQUE5QixFQUFpQyxHQUFHLGFBQXBDLEVBQW1ELENBQW5EO0FBQ0QsUUFuQ0QsQ0FtQ0UsT0FBTyxDQUFQLEVBQVU7QUFDVixpQkFBUSxHQUFSLENBQVksQ0FBWjtBQUNEO0FBQ0Y7Ozs4QkFrRlE7QUFDUCxjQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFhO0FBQWIsVUFERjtBQUVFO0FBQUE7QUFBQSxhQUFRLEtBQUksUUFBWjtBQUNHO0FBREg7QUFGRixRQURGO0FBUUQ7Ozs7R0FuSXVCLGdCQUFNLFM7O0FBcUloQyxRQUFPLE9BQVAsR0FBaUIsV0FBakIsQyIsImZpbGUiOiJqcy8xNS0wYzE3NzA0MGM0NWQyNWI5MTdiMy5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlIGEgcHJvZ3JhbSBvYmplY3QgYW5kIG1ha2UgY3VycmVudFxuICogQHBhcmFtIGdsIEdMIGNvbnRleHRcbiAqIEBwYXJhbSB2c2hhZGVyIGEgdmVydGV4IHNoYWRlciBwcm9ncmFtIChzdHJpbmcpXG4gKiBAcGFyYW0gZnNoYWRlciBhIGZyYWdtZW50IHNoYWRlciBwcm9ncmFtIChzdHJpbmcpXG4gKiBAcmV0dXJuIHRydWUsIGlmIHRoZSBwcm9ncmFtIG9iamVjdCB3YXMgY3JlYXRlZCBhbmQgc3VjY2Vzc2Z1bGx5IG1hZGUgY3VycmVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdFNoYWRlcnMoZ2wsIHZzaGFkZXIsIGZzaGFkZXIpIHtcbiAgdmFyIHByb2dyYW0gPSBjcmVhdGVQcm9ncmFtKGdsLCB2c2hhZGVyLCBmc2hhZGVyKTtcbiAgaWYgKCFwcm9ncmFtKSB7XG4gICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBjcmVhdGUgcHJvZ3JhbScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XG4gIGdsLnByb2dyYW0gPSBwcm9ncmFtO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIENyZWF0ZSB0aGUgbGlua2VkIHByb2dyYW0gb2JqZWN0XG4gKiBAcGFyYW0gZ2wgR0wgY29udGV4dFxuICogQHBhcmFtIHZzaGFkZXIgYSB2ZXJ0ZXggc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEBwYXJhbSBmc2hhZGVyIGEgZnJhZ21lbnQgc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEByZXR1cm4gY3JlYXRlZCBwcm9ncmFtIG9iamVjdCwgb3IgbnVsbCBpZiB0aGUgY3JlYXRpb24gaGFzIGZhaWxlZFxuICovXG5mdW5jdGlvbiBjcmVhdGVQcm9ncmFtKGdsLCB2c2hhZGVyLCBmc2hhZGVyKSB7XG4gIC8vIENyZWF0ZSBzaGFkZXIgb2JqZWN0XG4gIHZhciB2ZXJ0ZXhTaGFkZXIgPSBsb2FkU2hhZGVyKGdsLCBnbC5WRVJURVhfU0hBREVSLCB2c2hhZGVyKTtcbiAgdmFyIGZyYWdtZW50U2hhZGVyID0gbG9hZFNoYWRlcihnbCwgZ2wuRlJBR01FTlRfU0hBREVSLCBmc2hhZGVyKTtcbiAgaWYgKCF2ZXJ0ZXhTaGFkZXIgfHwgIWZyYWdtZW50U2hhZGVyKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBDcmVhdGUgYSBwcm9ncmFtIG9iamVjdFxuICB2YXIgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcbiAgaWYgKCFwcm9ncmFtKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBBdHRhY2ggdGhlIHNoYWRlciBvYmplY3RzXG4gIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpO1xuICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xuXG4gIC8vIExpbmsgdGhlIHByb2dyYW0gb2JqZWN0XG4gIGdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xuXG4gIC8vIENoZWNrIHRoZSByZXN1bHQgb2YgbGlua2luZ1xuICB2YXIgbGlua2VkID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5MSU5LX1NUQVRVUyk7XG4gIGlmICghbGlua2VkKSB7XG4gICAgdmFyIGVycm9yID0gZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSk7XG4gICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBsaW5rIHByb2dyYW06ICcgKyBlcnJvcik7XG4gICAgZ2wuZGVsZXRlUHJvZ3JhbShwcm9ncmFtKTtcbiAgICBnbC5kZWxldGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpO1xuICAgIGdsLmRlbGV0ZVNoYWRlcih2ZXJ0ZXhTaGFkZXIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBwcm9ncmFtO1xufVxuXG5cbi8qKlxuICogQ3JlYXRlIGEgc2hhZGVyIG9iamVjdFxuICogQHBhcmFtIGdsIEdMIGNvbnRleHRcbiAqIEBwYXJhbSB0eXBlIHRoZSB0eXBlIG9mIHRoZSBzaGFkZXIgb2JqZWN0IHRvIGJlIGNyZWF0ZWRcbiAqIEBwYXJhbSBzb3VyY2Ugc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEByZXR1cm4gY3JlYXRlZCBzaGFkZXIgb2JqZWN0LCBvciBudWxsIGlmIHRoZSBjcmVhdGlvbiBoYXMgZmFpbGVkLlxuICovXG5mdW5jdGlvbiBsb2FkU2hhZGVyKGdsLCB0eXBlLCBzb3VyY2UpIHtcbiAgLy8gQ3JlYXRlIHNoYWRlciBvYmplY3RcbiAgdmFyIHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcbiAgaWYgKHNoYWRlciA9PSBudWxsKSB7XG4gICAgY29uc29sZS5sb2coJ3VuYWJsZSB0byBjcmVhdGUgc2hhZGVyJyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBTZXQgdGhlIHNoYWRlciBwcm9ncmFtXG4gIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XG5cbiAgLy8gQ29tcGlsZSB0aGUgc2hhZGVyXG4gIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcblxuICAvLyBDaGVjayB0aGUgcmVzdWx0IG9mIGNvbXBpbGF0aW9uXG4gIHZhciBjb21waWxlZCA9IGdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKTtcbiAgaWYgKCFjb21waWxlZCkge1xuICAgIHZhciBlcnJvciA9IGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKTtcbiAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGNvbXBpbGUgc2hhZGVyOiAnICsgZXJyb3IpO1xuICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHNoYWRlcjtcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xpYi93ZWJnbC91dGlscy5qc1xuICoqLyIsImNsYXNzIE1hdHJpeDQge1xuICAgIGNvbnN0cnVjdG9yKG1hdHJpeCkge1xuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdHJpeCB8fCBNYXRyaXg0LnVuaXRNYXRyaXg0KClcbiAgICB9XG4gICAgaW5pdCA9IChtYXRyaXgpPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0cml4IHx8IE1hdHJpeDQudW5pdE1hdHJpeDQoKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBtdWx0aXBseSA9IChtYXRyaXgpID0+IHtcbiAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseSh0aGlzLm1hdHJpeCwgbWF0cml4KVxuICAgIH1cbiAgICByb3RhdGUgPSAoYW5nZWwseCx5LHopPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseShNYXRyaXg0LnJvdGF0ZU1hdHJpeChhbmdlbCx4LHkseiksdGhpcy5tYXRyaXgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHJvdGF0ZTQgPSAoYW5nZWwsdmVjdG9yLGRvdCk9PntcbiAgICAgICAgdGhpcy50cmFuc2xhdGUoLWRvdC54LC1kb3QueSwtZG90LnopXG4gICAgICAgIHRoaXMucm90YXRlKGFuZ2VsLHZlY3Rvci54LHZlY3Rvci55LHZlY3Rvci56KVxuICAgICAgICB0aGlzLnRyYW5zbGF0ZShkb3QueCxkb3QueSxkb3QueilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgdHJhbnNsYXRlID0gKHgseSx6KT0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQubXVsdGlwbHkoTWF0cml4NC50cmFuc2xhdGVNYXRyaXgoeCx5LHopLHRoaXMubWF0cml4KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBzY2FsZSA9IChTeCxTeSxTeik9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0Lm11bHRpcGx5KE1hdHJpeDQuc2NhbGVNYXRyaXgoU3gsU3ksU3opLHRoaXMubWF0cml4KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICB2aWV3ID0gKGV5ZVgsIGV5ZVksIGV5ZVosIGNlbnRlclgsIGNlbnRlclksIGNlbnRlclosIHVwWCwgdXBZLCB1cFopID0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQubXVsdGlwbHkoTWF0cml4NC52aWV3TWF0cml4KGV5ZVgsIGV5ZVksIGV5ZVosIGNlbnRlclgsIGNlbnRlclksIGNlbnRlclosIHVwWCwgdXBZLCB1cFopLHRoaXMubWF0cml4KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBvcnRobyA9IChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhcikgPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseShNYXRyaXg0Lm9ydGhvTWF0cml4KGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSx0aGlzLm1hdHJpeClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgcGVyc3BlY3RpdmUgPSAoZm92LCBhc3BlY3QsIG5lYXIsIGZhcikgPT4ge1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQubXVsdGlwbHkoTWF0cml4NC5wZXJzcGVjdGl2ZU1hdHJpeChmb3YsIGFzcGVjdCwgbmVhciwgZmFyKSx0aGlzLm1hdHJpeClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgdHJhbnNwb3NlID0gKCkgPT4ge1xuICAgICAgbGV0IGUsIHRcblxuICAgICAgZSA9IHRoaXMubWF0cml4XG5cbiAgICAgIHQgPSBlWyAxXTsgIGVbIDFdID0gZVsgNF07ICBlWyA0XSA9IHQ7XG4gICAgICB0ID0gZVsgMl07ICBlWyAyXSA9IGVbIDhdOyAgZVsgOF0gPSB0O1xuICAgICAgdCA9IGVbIDNdOyAgZVsgM10gPSBlWzEyXTsgIGVbMTJdID0gdDtcbiAgICAgIHQgPSBlWyA2XTsgIGVbIDZdID0gZVsgOV07ICBlWyA5XSA9IHQ7XG4gICAgICB0ID0gZVsgN107ICBlWyA3XSA9IGVbMTNdOyAgZVsxM10gPSB0O1xuICAgICAgdCA9IGVbMTFdOyAgZVsxMV0gPSBlWzE0XTsgIGVbMTRdID0gdDtcblxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgc2V0T3J0aG8gPSAobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpID0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQub3J0aG9NYXRyaXgobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzZXRSb3RhdGUgPSAoYW5nZWwseCx5LHopPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5yb3RhdGVNYXRyaXgoYW5nZWwseCx5LHopXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHNldFRyYW5zbGF0ZSA9ICh4LHkseik9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0LnRyYW5zbGF0ZU1hdHJpeCh4LHkseilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgc2V0U2NhbGUgPSAoU3gsU3ksU3opPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5zY2FsZU1hdHJpeChTeCxTeSxTeilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgc2V0VmlldyA9IChleWVYLCBleWVZLCBleWVaLCBjZW50ZXJYLCBjZW50ZXJZLCBjZW50ZXJaLCB1cFgsIHVwWSwgdXBaKT0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQudmlld01hdHJpeChleWVYLCBleWVZLCBleWVaLCBjZW50ZXJYLCBjZW50ZXJZLCBjZW50ZXJaLCB1cFgsIHVwWSwgdXBaKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHNldFBlcnNwZWN0aXZlID0gKGZvdiwgYXNwZWN0LCBuZWFyLCBmYXIpID0+IHtcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0LnBlcnNwZWN0aXZlTWF0cml4KGZvdiwgYXNwZWN0LCBuZWFyLCBmYXIpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHNldEludmVyc2VPZiA9IChtYXRyaXgpID0+IHtcbiAgICAgIGNvbnN0IGludmVyc2VNYXRyaXggPSBNYXRyaXg0LmludmVyc2VPZihtYXRyaXgpXG4gICAgICBpZiAoaW52ZXJzZU1hdHJpeCkge1xuICAgICAgICB0aGlzLm1hdHJpeCA9IGludmVyc2VNYXRyaXhcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIC8qKlxuICAgICAqIOaxguS4gOS4quefqemYteeahOmAhuefqemYtVxuICAgICAqIEBwYXJhbSAge01hdHJpeDR9IG1hdHJpeCDnn6npmLVcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXl9ICAg55+p6Zi15pWw57uEXG4gICAgICovXG4gICAgc3RhdGljIGludmVyc2VPZiA9IChtYXRyaXgpID0+IHtcbiAgICAgIGxldCBpLCBzLCBkLCBpbnYsIGRldFxuXG4gICAgICBzID0gbWF0cml4Lm1hdHJpeDtcbiAgICAgIGQgPSBuZXcgRmxvYXQzMkFycmF5KDE2KTtcbiAgICAgIGludiA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xuXG4gICAgICBpbnZbMF0gID0gICBzWzVdKnNbMTBdKnNbMTVdIC0gc1s1XSAqc1sxMV0qc1sxNF0gLSBzWzldICpzWzZdKnNbMTVdXG4gICAgICAgICAgICAgICAgKyBzWzldKnNbN10gKnNbMTRdICsgc1sxM10qc1s2XSAqc1sxMV0gLSBzWzEzXSpzWzddKnNbMTBdO1xuICAgICAgaW52WzRdICA9IC0gc1s0XSpzWzEwXSpzWzE1XSArIHNbNF0gKnNbMTFdKnNbMTRdICsgc1s4XSAqc1s2XSpzWzE1XVxuICAgICAgICAgICAgICAgIC0gc1s4XSpzWzddICpzWzE0XSAtIHNbMTJdKnNbNl0gKnNbMTFdICsgc1sxMl0qc1s3XSpzWzEwXTtcbiAgICAgIGludls4XSAgPSAgIHNbNF0qc1s5XSAqc1sxNV0gLSBzWzRdICpzWzExXSpzWzEzXSAtIHNbOF0gKnNbNV0qc1sxNV1cbiAgICAgICAgICAgICAgICArIHNbOF0qc1s3XSAqc1sxM10gKyBzWzEyXSpzWzVdICpzWzExXSAtIHNbMTJdKnNbN10qc1s5XTtcbiAgICAgIGludlsxMl0gPSAtIHNbNF0qc1s5XSAqc1sxNF0gKyBzWzRdICpzWzEwXSpzWzEzXSArIHNbOF0gKnNbNV0qc1sxNF1cbiAgICAgICAgICAgICAgICAtIHNbOF0qc1s2XSAqc1sxM10gLSBzWzEyXSpzWzVdICpzWzEwXSArIHNbMTJdKnNbNl0qc1s5XTtcblxuICAgICAgaW52WzFdICA9IC0gc1sxXSpzWzEwXSpzWzE1XSArIHNbMV0gKnNbMTFdKnNbMTRdICsgc1s5XSAqc1syXSpzWzE1XVxuICAgICAgICAgICAgICAgIC0gc1s5XSpzWzNdICpzWzE0XSAtIHNbMTNdKnNbMl0gKnNbMTFdICsgc1sxM10qc1szXSpzWzEwXTtcbiAgICAgIGludls1XSAgPSAgIHNbMF0qc1sxMF0qc1sxNV0gLSBzWzBdICpzWzExXSpzWzE0XSAtIHNbOF0gKnNbMl0qc1sxNV1cbiAgICAgICAgICAgICAgICArIHNbOF0qc1szXSAqc1sxNF0gKyBzWzEyXSpzWzJdICpzWzExXSAtIHNbMTJdKnNbM10qc1sxMF07XG4gICAgICBpbnZbOV0gID0gLSBzWzBdKnNbOV0gKnNbMTVdICsgc1swXSAqc1sxMV0qc1sxM10gKyBzWzhdICpzWzFdKnNbMTVdXG4gICAgICAgICAgICAgICAgLSBzWzhdKnNbM10gKnNbMTNdIC0gc1sxMl0qc1sxXSAqc1sxMV0gKyBzWzEyXSpzWzNdKnNbOV07XG4gICAgICBpbnZbMTNdID0gICBzWzBdKnNbOV0gKnNbMTRdIC0gc1swXSAqc1sxMF0qc1sxM10gLSBzWzhdICpzWzFdKnNbMTRdXG4gICAgICAgICAgICAgICAgKyBzWzhdKnNbMl0gKnNbMTNdICsgc1sxMl0qc1sxXSAqc1sxMF0gLSBzWzEyXSpzWzJdKnNbOV07XG5cbiAgICAgIGludlsyXSAgPSAgIHNbMV0qc1s2XSpzWzE1XSAtIHNbMV0gKnNbN10qc1sxNF0gLSBzWzVdICpzWzJdKnNbMTVdXG4gICAgICAgICAgICAgICAgKyBzWzVdKnNbM10qc1sxNF0gKyBzWzEzXSpzWzJdKnNbN10gIC0gc1sxM10qc1szXSpzWzZdO1xuICAgICAgaW52WzZdICA9IC0gc1swXSpzWzZdKnNbMTVdICsgc1swXSAqc1s3XSpzWzE0XSArIHNbNF0gKnNbMl0qc1sxNV1cbiAgICAgICAgICAgICAgICAtIHNbNF0qc1szXSpzWzE0XSAtIHNbMTJdKnNbMl0qc1s3XSAgKyBzWzEyXSpzWzNdKnNbNl07XG4gICAgICBpbnZbMTBdID0gICBzWzBdKnNbNV0qc1sxNV0gLSBzWzBdICpzWzddKnNbMTNdIC0gc1s0XSAqc1sxXSpzWzE1XVxuICAgICAgICAgICAgICAgICsgc1s0XSpzWzNdKnNbMTNdICsgc1sxMl0qc1sxXSpzWzddICAtIHNbMTJdKnNbM10qc1s1XTtcbiAgICAgIGludlsxNF0gPSAtIHNbMF0qc1s1XSpzWzE0XSArIHNbMF0gKnNbNl0qc1sxM10gKyBzWzRdICpzWzFdKnNbMTRdXG4gICAgICAgICAgICAgICAgLSBzWzRdKnNbMl0qc1sxM10gLSBzWzEyXSpzWzFdKnNbNl0gICsgc1sxMl0qc1syXSpzWzVdO1xuXG4gICAgICBpbnZbM10gID0gLSBzWzFdKnNbNl0qc1sxMV0gKyBzWzFdKnNbN10qc1sxMF0gKyBzWzVdKnNbMl0qc1sxMV1cbiAgICAgICAgICAgICAgICAtIHNbNV0qc1szXSpzWzEwXSAtIHNbOV0qc1syXSpzWzddICArIHNbOV0qc1szXSpzWzZdO1xuICAgICAgaW52WzddICA9ICAgc1swXSpzWzZdKnNbMTFdIC0gc1swXSpzWzddKnNbMTBdIC0gc1s0XSpzWzJdKnNbMTFdXG4gICAgICAgICAgICAgICAgKyBzWzRdKnNbM10qc1sxMF0gKyBzWzhdKnNbMl0qc1s3XSAgLSBzWzhdKnNbM10qc1s2XTtcbiAgICAgIGludlsxMV0gPSAtIHNbMF0qc1s1XSpzWzExXSArIHNbMF0qc1s3XSpzWzldICArIHNbNF0qc1sxXSpzWzExXVxuICAgICAgICAgICAgICAgIC0gc1s0XSpzWzNdKnNbOV0gIC0gc1s4XSpzWzFdKnNbN10gICsgc1s4XSpzWzNdKnNbNV07XG4gICAgICBpbnZbMTVdID0gICBzWzBdKnNbNV0qc1sxMF0gLSBzWzBdKnNbNl0qc1s5XSAgLSBzWzRdKnNbMV0qc1sxMF1cbiAgICAgICAgICAgICAgICArIHNbNF0qc1syXSpzWzldICArIHNbOF0qc1sxXSpzWzZdICAtIHNbOF0qc1syXSpzWzVdO1xuXG4gICAgICBkZXQgPSBzWzBdKmludlswXSArIHNbMV0qaW52WzRdICsgc1syXSppbnZbOF0gKyBzWzNdKmludlsxMl07XG4gICAgICBpZiAoZGV0ID09PSAwKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBkZXQgPSAxIC8gZGV0O1xuICAgICAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICAgICAgZFtpXSA9IGludltpXSAqIGRldDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRcbiAgICB9XG4gICAgLyoqXG4gICAgICog6I635Y+W6YCP6KeG5oqV5b2x55+p6Zi1XG4gICAgICogQHBhcmFtICBmb3YgICAg5oyH5a6a5Z6C55u06KeG6KeS77yM5Y2z5Y+v6KeG56m66Ze06aG26Z2i5ZKM5bqV6Z2i6Ze055qE5aS56KeS77yM5b+F6aG75aSn5LqOMFxuICAgICAqIEBwYXJhbSAgYXNwZWN0IOaMh+Wumui/keWJquijgemdoueahOWuvemrmOavlO+8iOWuveW6pu+8j+mrmOW6pu+8iVxuICAgICAqIEBwYXJhbSAgbmVhciAgIOaMh+Wumui/keWJquijgemdoueahOS9jee9ru+8jOWNs+WPr+inhuepuumXtOeahOi/kei+ueeVjFxuICAgICAqIEBwYXJhbSAgZmFyICAgIOaMh+Wumui/nOWJquijgemdoueahOS9jee9ru+8jOWNs+WPr+inhuepuumXtOeahOi/nOi+ueeVjFxuICAgICAqIEByZXR1cm4gbWF0cml4IOmAj+inhuaKleW9seefqemYtVxuICAgICAqL1xuICAgIHN0YXRpYyBwZXJzcGVjdGl2ZU1hdHJpeCA9IChmb3YsIGFzcGVjdCwgbmVhciwgZmFyKSA9PiB7XG4gICAgICAgIGxldCBtYXRyaXgsIHJkLCBzLCBjdFxuXG4gICAgICAgIGlmIChuZWFyID09PSBmYXIgfHwgYXNwZWN0ID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgJ251bGwgZnJ1c3R1bSdcbiAgICAgICAgfVxuICAgICAgICBpZiAobmVhciA8PSAwKSB7XG4gICAgICAgICAgdGhyb3cgJ25lYXIgPD0gMCdcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmFyIDw9IDApIHtcbiAgICAgICAgICB0aHJvdyAnZmFyIDw9IDAnXG4gICAgICAgIH1cblxuICAgICAgICBmb3YgPSBNYXRoLlBJICogZm92IC8gMTgwIC8gMlxuICAgICAgICBzID0gTWF0aC5zaW4oZm92KVxuICAgICAgICBpZiAocyA9PT0gMCkge1xuICAgICAgICAgIHRocm93ICdudWxsIGZydXN0dW0nXG4gICAgICAgIH1cbiAgICAgICAgcmQgPSAxIC8gKGZhciAtIG5lYXIpXG4gICAgICAgIGN0ID0gTWF0aC5jb3MoZm92KSAvIHNcblxuICAgICAgICBtYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KDE2KVxuXG4gICAgICAgIG1hdHJpeFswXSAgPSBjdCAvIGFzcGVjdFxuICAgICAgICBtYXRyaXhbMV0gID0gMFxuICAgICAgICBtYXRyaXhbMl0gID0gMFxuICAgICAgICBtYXRyaXhbM10gID0gMFxuXG4gICAgICAgIG1hdHJpeFs0XSAgPSAwXG4gICAgICAgIG1hdHJpeFs1XSAgPSBjdFxuICAgICAgICBtYXRyaXhbNl0gID0gMFxuICAgICAgICBtYXRyaXhbN10gID0gMFxuXG4gICAgICAgIG1hdHJpeFs4XSAgPSAwXG4gICAgICAgIG1hdHJpeFs5XSAgPSAwXG4gICAgICAgIG1hdHJpeFsxMF0gPSAtKGZhciArIG5lYXIpICogcmRcbiAgICAgICAgbWF0cml4WzExXSA9IC0xXG5cbiAgICAgICAgbWF0cml4WzEyXSA9IDBcbiAgICAgICAgbWF0cml4WzEzXSA9IDBcbiAgICAgICAgbWF0cml4WzE0XSA9IC0yICogbmVhciAqIGZhciAqIHJkXG4gICAgICAgIG1hdHJpeFsxNV0gPSAwXG4gICAgICAgIHJldHVybiBtYXRyaXhcbiAgICB9XG4gICAgc3RhdGljIG9ydGhvTWF0cml4ID0gKGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSA9PiB7XG4gICAgICAgIGxldCBtYXRyaXgsIHJ3LCByaCwgcmQ7XG5cbiAgICAgICAgaWYgKGxlZnQgPT09IHJpZ2h0IHx8IGJvdHRvbSA9PT0gdG9wIHx8IG5lYXIgPT09IGZhcikge1xuICAgICAgICAgIHRocm93ICdudWxsIGZydXN0dW0nO1xuICAgICAgICB9XG5cbiAgICAgICAgcncgPSAxIC8gKHJpZ2h0IC0gbGVmdCk7XG4gICAgICAgIHJoID0gMSAvICh0b3AgLSBib3R0b20pO1xuICAgICAgICByZCA9IDEgLyAoZmFyIC0gbmVhcik7XG5cbiAgICAgICAgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheSgxNilcblxuICAgICAgICBtYXRyaXhbMF0gID0gMiAqIHJ3O1xuICAgICAgICBtYXRyaXhbMV0gID0gMDtcbiAgICAgICAgbWF0cml4WzJdICA9IDA7XG4gICAgICAgIG1hdHJpeFszXSAgPSAwO1xuXG4gICAgICAgIG1hdHJpeFs0XSAgPSAwO1xuICAgICAgICBtYXRyaXhbNV0gID0gMiAqIHJoO1xuICAgICAgICBtYXRyaXhbNl0gID0gMDtcbiAgICAgICAgbWF0cml4WzddICA9IDA7XG5cbiAgICAgICAgbWF0cml4WzhdICA9IDA7XG4gICAgICAgIG1hdHJpeFs5XSAgPSAwO1xuICAgICAgICBtYXRyaXhbMTBdID0gLTIgKiByZDtcbiAgICAgICAgbWF0cml4WzExXSA9IDA7XG5cbiAgICAgICAgbWF0cml4WzEyXSA9IC0ocmlnaHQgKyBsZWZ0KSAqIHJ3O1xuICAgICAgICBtYXRyaXhbMTNdID0gLSh0b3AgKyBib3R0b20pICogcmg7XG4gICAgICAgIG1hdHJpeFsxNF0gPSAtKGZhciArIG5lYXIpICogcmQ7XG4gICAgICAgIG1hdHJpeFsxNV0gPSAxO1xuXG4gICAgICAgIHJldHVybiBtYXRyaXhcbiAgICB9XG4gICAgc3RhdGljIHZpZXdNYXRyaXggPSAoZXllWCwgZXllWSwgZXllWiwgY2VudGVyWCwgY2VudGVyWSwgY2VudGVyWiwgdXBYLCB1cFksIHVwWik9PntcbiAgICAgICAgbGV0IGUsIGZ4LCBmeSwgZnosIHJsZiwgc3gsIHN5LCBzeiwgcmxzLCB1eCwgdXksIHV6XG5cbiAgICAgICAgZnggPSBjZW50ZXJYIC0gZXllWFxuICAgICAgICBmeSA9IGNlbnRlclkgLSBleWVZXG4gICAgICAgIGZ6ID0gY2VudGVyWiAtIGV5ZVpcblxuICAgICAgICAvLyBOb3JtYWxpemUgZi5cbiAgICAgICAgcmxmID0gMSAvIE1hdGguc3FydChmeCpmeCArIGZ5KmZ5ICsgZnoqZnopXG4gICAgICAgIGZ4ICo9IHJsZlxuICAgICAgICBmeSAqPSBybGZcbiAgICAgICAgZnogKj0gcmxmXG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGNyb3NzIHByb2R1Y3Qgb2YgZiBhbmQgdXAuXG4gICAgICAgIHN4ID0gZnkgKiB1cFogLSBmeiAqIHVwWVxuICAgICAgICBzeSA9IGZ6ICogdXBYIC0gZnggKiB1cFpcbiAgICAgICAgc3ogPSBmeCAqIHVwWSAtIGZ5ICogdXBYXG5cbiAgICAgICAgLy8gTm9ybWFsaXplIHMuXG4gICAgICAgIHJscyA9IDEgLyBNYXRoLnNxcnQoc3gqc3ggKyBzeSpzeSArIHN6KnN6KVxuICAgICAgICBzeCAqPSBybHNcbiAgICAgICAgc3kgKj0gcmxzXG4gICAgICAgIHN6ICo9IHJsc1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBjcm9zcyBwcm9kdWN0IG9mIHMgYW5kIGYuXG4gICAgICAgIHV4ID0gc3kgKiBmeiAtIHN6ICogZnlcbiAgICAgICAgdXkgPSBzeiAqIGZ4IC0gc3ggKiBmelxuICAgICAgICB1eiA9IHN4ICogZnkgLSBzeSAqIGZ4XG5cbiAgICAgICAgbGV0IG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpXG4gICAgICAgIG1hdHJpeFswXSA9IHN4XG4gICAgICAgIG1hdHJpeFsxXSA9IHV4XG4gICAgICAgIG1hdHJpeFsyXSA9IC1meFxuICAgICAgICBtYXRyaXhbM10gPSAwXG5cbiAgICAgICAgbWF0cml4WzRdID0gc3lcbiAgICAgICAgbWF0cml4WzVdID0gdXlcbiAgICAgICAgbWF0cml4WzZdID0gLWZ5XG4gICAgICAgIG1hdHJpeFs3XSA9IDBcblxuICAgICAgICBtYXRyaXhbOF0gPSBzelxuICAgICAgICBtYXRyaXhbOV0gPSB1elxuICAgICAgICBtYXRyaXhbMTBdID0gLWZ6XG4gICAgICAgIG1hdHJpeFsxMV0gPSAwXG5cbiAgICAgICAgbWF0cml4WzEyXSA9IDBcbiAgICAgICAgbWF0cml4WzEzXSA9IDBcbiAgICAgICAgbWF0cml4WzE0XSA9IDBcbiAgICAgICAgbWF0cml4WzE1XSA9IDFcblxuICAgICAgICByZXR1cm4gTWF0cml4NC5tdWx0aXBseShtYXRyaXgsTWF0cml4NC50cmFuc2xhdGVNYXRyaXgoLWV5ZVgsIC1leWVZLCAtZXllWikpXG4gICAgfVxuICAgIHN0YXRpYyByb3RhdGVNYXRyaXggPSAoYW5nZWwseCx5LHopID0+IHtcbiAgICAgICAgbGV0IHJhZGlhbiA9IE1hdGguUEkgKiBhbmdlbCAvIDE4MC4wXG4gICAgICAgIGxldCBzID0gTWF0aC5zaW4ocmFkaWFuKVxuICAgICAgICBsZXQgYyA9IE1hdGguY29zKHJhZGlhbilcblxuICAgICAgICBpZiAoeCE9PTAmJnk9PT0wJiZ6PT09MCkge1xuICAgICAgICAgICAgaWYgKHggPCAwKSB7XG4gICAgICAgICAgICAgIHMgPSAtc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE1hdHJpeDQucm90YXRlWE1hdHJpeChzLGMpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHg9PT0wJiZ5IT09MCYmej09PTApIHtcbiAgICAgICAgICAgIGlmICh5IDwgMCkge1xuICAgICAgICAgICAgICBzID0gLXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBNYXRyaXg0LnJvdGF0ZVlNYXRyaXgocyxjKVxuICAgICAgICB9XG4gICAgICAgIGlmICh4PT09MCYmeT09PTAmJnohPT0wKSB7XG4gICAgICAgICAgICBpZiAoejwwKSB7XG4gICAgICAgICAgICAgICAgcyA9IC1zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTWF0cml4NC5yb3RhdGVaTWF0cml4KHMsYylcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheSgxNilcbiAgICAgICAgbGVuID0gTWF0aC5zcXJ0KHgqeCArIHkqeSArIHoqeilcbiAgICAgICAgaWYgKGxlbiAhPT0gMSkge1xuICAgICAgICAgIHJsZW4gPSAxIC8gbGVuXG4gICAgICAgICAgeCAqPSBybGVuXG4gICAgICAgICAgeSAqPSBybGVuXG4gICAgICAgICAgeiAqPSBybGVuXG4gICAgICAgIH1cbiAgICAgICAgbmMgPSAxIC0gY1xuICAgICAgICB4eSA9IHggKiB5XG4gICAgICAgIHl6ID0geSAqIHpcbiAgICAgICAgenggPSB6ICogeFxuICAgICAgICB4cyA9IHggKiBzXG4gICAgICAgIHlzID0geSAqIHNcbiAgICAgICAgenMgPSB6ICogc1xuXG4gICAgICAgIG1hdHJpeFsgMF0gPSB4KngqbmMgKyAgY1xuICAgICAgICBtYXRyaXhbIDFdID0geHkgKm5jICsgenNcbiAgICAgICAgbWF0cml4WyAyXSA9IHp4ICpuYyAtIHlzXG4gICAgICAgIG1hdHJpeFsgM10gPSAwXG5cbiAgICAgICAgbWF0cml4WyA0XSA9IHh5ICpuYyAtIHpzXG4gICAgICAgIG1hdHJpeFsgNV0gPSB5KnkqbmMgKyAgY1xuICAgICAgICBtYXRyaXhbIDZdID0geXogKm5jICsgeHNcbiAgICAgICAgbWF0cml4WyA3XSA9IDBcblxuICAgICAgICBtYXRyaXhbIDhdID0genggKm5jICsgeXNcbiAgICAgICAgbWF0cml4WyA5XSA9IHl6ICpuYyAtIHhzXG4gICAgICAgIG1hdHJpeFsxMF0gPSB6KnoqbmMgKyAgY1xuICAgICAgICBtYXRyaXhbMTFdID0gMFxuXG4gICAgICAgIG1hdHJpeFsxMl0gPSAwXG4gICAgICAgIG1hdHJpeFsxM10gPSAwXG4gICAgICAgIG1hdHJpeFsxNF0gPSAwXG4gICAgICAgIG1hdHJpeFsxNV0gPSAxXG5cbiAgICAgICAgcmV0dXJuIG1hdHJpeFxuICAgIH1cbiAgICBzdGF0aWMgdHJhbnNsYXRlTWF0cml4ID0gKHgseSx6KT0+e1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwwLDAsMCwgMCwxLDAsMCwgMCwwLDEsMCwgeCx5LHosMV0pXG4gICAgfVxuICAgIHN0YXRpYyBzY2FsZU1hdHJpeCA9IChTeCxTeSxTeik9PntcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW1N4LDAsMCwwLCAwLFN5LDAsMCwgMCwwLFN6LDAsIDAsMCwwLDFdKVxuICAgIH1cbiAgICBzdGF0aWMgdW5pdE1hdHJpeDQgPSAoKT0+e1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwwLDAsMCwgMCwxLDAsMCwgMCwwLDEsMCwgMCwwLDAsMV0pXG4gICAgfVxuICAgIHN0YXRpYyByb3RhdGVYTWF0cml4ID0gKHMsYyk9PntcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEsMCwwLDAsIDAsYyxzLDAsIDAsLXMsYywwLCAwLDAsMCwxXSlcbiAgICB9XG4gICAgc3RhdGljIHJvdGF0ZVlNYXRyaXggPSAocyxjKT0+e1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYywwLC1zLDAsIDAsMSwwLDAsIHMsMCxjLDAsIDAsMCwwLDFdKVxuICAgIH1cbiAgICBzdGF0aWMgcm90YXRlWk1hdHJpeCA9IChzLGMpPT57XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtjLHMsMCwwLCAtcyxjLDAsMCwgMCwwLDEsMCwgMCwwLDAsMV0pXG4gICAgfVxuICAgIHN0YXRpYyBhZGQgPSAobWF0cml4MSxtYXRyaXgyKT0+e1xuICAgICAgICBjb25zdCBsZW4xID0gbWF0cml4MS5sZW5ndGgsIGxlbjIgPSBtYXRyaXgyLmxlbmd0aFxuICAgICAgICBpZiAobGVuMSAhPSBsZW4yKSB7XG4gICAgICAgICAgICB0aHJvdyAn55+p6Zi1MeWSjOefqemYtTLplb/luqbkuI3kuIDoh7QnXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkobGVuMSlcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW4xOyBpKyspIHtcbiAgICAgICAgICAgIG1hdHJpeFtpXSA9IG1hdHJpeDFbaV0gKyBtYXRyaXgyW2ldXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdHJpeFxuICAgIH1cbiAgICBzdGF0aWMgc3VidHJhY3QgPSAobWF0cml4MSxtYXRyaXgyKT0+e1xuICAgICAgICBsZXQgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheSgxNilcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICAgICAgICBtYXRyaXhbaV0gPSBtYXRyaXgxW2ldIC0gbWF0cml4MltpXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXRyaXhcbiAgICB9XG4gICAgc3RhdGljIG11bHRpcGx5ID0gKG1hdHJpeDEsbWF0cml4Mik9PntcbiAgICAgICAgbGV0IG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpXG5cbiAgICAgICAgbWF0cml4WzBdID0gbWF0cml4MVswXSptYXRyaXgyWzBdICsgbWF0cml4MVs0XSptYXRyaXgyWzFdICsgbWF0cml4MVs4XSptYXRyaXgyWzJdICsgbWF0cml4MVsxMl0qbWF0cml4MlszXVxuICAgICAgICBtYXRyaXhbNF0gPSBtYXRyaXgxWzBdKm1hdHJpeDJbNF0gKyBtYXRyaXgxWzRdKm1hdHJpeDJbNV0gKyBtYXRyaXgxWzhdKm1hdHJpeDJbNl0gKyBtYXRyaXgxWzEyXSptYXRyaXgyWzddXG4gICAgICAgIG1hdHJpeFs4XSA9IG1hdHJpeDFbMF0qbWF0cml4Mls4XSArIG1hdHJpeDFbNF0qbWF0cml4Mls5XSArIG1hdHJpeDFbOF0qbWF0cml4MlsxMF0gKyBtYXRyaXgxWzEyXSptYXRyaXgyWzExXVxuICAgICAgICBtYXRyaXhbMTJdID0gbWF0cml4MVswXSptYXRyaXgyWzEyXSArIG1hdHJpeDFbNF0qbWF0cml4MlsxM10gKyBtYXRyaXgxWzhdKm1hdHJpeDJbMTRdICsgbWF0cml4MVsxMl0qbWF0cml4MlsxNV1cblxuICAgICAgICBtYXRyaXhbMV0gPSBtYXRyaXgxWzFdKm1hdHJpeDJbMF0gKyBtYXRyaXgxWzVdKm1hdHJpeDJbMV0gKyBtYXRyaXgxWzldKm1hdHJpeDJbMl0gKyBtYXRyaXgxWzEzXSptYXRyaXgyWzNdXG4gICAgICAgIG1hdHJpeFs1XSA9IG1hdHJpeDFbMV0qbWF0cml4Mls0XSArIG1hdHJpeDFbNV0qbWF0cml4Mls1XSArIG1hdHJpeDFbOV0qbWF0cml4Mls2XSArIG1hdHJpeDFbMTNdKm1hdHJpeDJbN11cbiAgICAgICAgbWF0cml4WzldID0gbWF0cml4MVsxXSptYXRyaXgyWzhdICsgbWF0cml4MVs1XSptYXRyaXgyWzldICsgbWF0cml4MVs5XSptYXRyaXgyWzEwXSArIG1hdHJpeDFbMTNdKm1hdHJpeDJbMTFdXG4gICAgICAgIG1hdHJpeFsxM10gPSBtYXRyaXgxWzFdKm1hdHJpeDJbMTJdICsgbWF0cml4MVs1XSptYXRyaXgyWzEzXSArIG1hdHJpeDFbOV0qbWF0cml4MlsxNF0gKyBtYXRyaXgxWzEzXSptYXRyaXgyWzE1XVxuXG4gICAgICAgIG1hdHJpeFsyXSA9IG1hdHJpeDFbMl0qbWF0cml4MlswXSArIG1hdHJpeDFbNl0qbWF0cml4MlsxXSArIG1hdHJpeDFbMTBdKm1hdHJpeDJbMl0gKyBtYXRyaXgxWzE0XSptYXRyaXgyWzNdXG4gICAgICAgIG1hdHJpeFs2XSA9IG1hdHJpeDFbMl0qbWF0cml4Mls0XSArIG1hdHJpeDFbNl0qbWF0cml4Mls1XSArIG1hdHJpeDFbMTBdKm1hdHJpeDJbNl0gKyBtYXRyaXgxWzE0XSptYXRyaXgyWzddXG4gICAgICAgIG1hdHJpeFsxMF0gPSBtYXRyaXgxWzJdKm1hdHJpeDJbOF0gKyBtYXRyaXgxWzZdKm1hdHJpeDJbOV0gKyBtYXRyaXgxWzEwXSptYXRyaXgyWzEwXSArIG1hdHJpeDFbMTRdKm1hdHJpeDJbMTFdXG4gICAgICAgIG1hdHJpeFsxNF0gPSBtYXRyaXgxWzJdKm1hdHJpeDJbMTJdICsgbWF0cml4MVs2XSptYXRyaXgyWzEzXSArIG1hdHJpeDFbMTBdKm1hdHJpeDJbMTRdICsgbWF0cml4MVsxNF0qbWF0cml4MlsxNV1cblxuICAgICAgICBtYXRyaXhbM10gPSBtYXRyaXgxWzNdKm1hdHJpeDJbMF0gKyBtYXRyaXgxWzddKm1hdHJpeDJbMV0gKyBtYXRyaXgxWzExXSptYXRyaXgyWzJdICsgbWF0cml4MVsxNV0qbWF0cml4MlszXVxuICAgICAgICBtYXRyaXhbN10gPSBtYXRyaXgxWzNdKm1hdHJpeDJbNF0gKyBtYXRyaXgxWzddKm1hdHJpeDJbNV0gKyBtYXRyaXgxWzExXSptYXRyaXgyWzZdICsgbWF0cml4MVsxNV0qbWF0cml4Mls3XVxuICAgICAgICBtYXRyaXhbMTFdID0gbWF0cml4MVszXSptYXRyaXgyWzhdICsgbWF0cml4MVs3XSptYXRyaXgyWzldICsgbWF0cml4MVsxMV0qbWF0cml4MlsxMF0gKyBtYXRyaXgxWzE1XSptYXRyaXgyWzExXVxuICAgICAgICBtYXRyaXhbMTVdID0gbWF0cml4MVszXSptYXRyaXgyWzEyXSArIG1hdHJpeDFbN10qbWF0cml4MlsxM10gKyBtYXRyaXgxWzExXSptYXRyaXgyWzE0XSArIG1hdHJpeDFbMTVdKm1hdHJpeDJbMTVdXG5cbiAgICAgICAgcmV0dXJuIG1hdHJpeFxuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gTWF0cml4NFxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbGliL3dlYmdsL21hdHJpeDQuanNcbiAqKi8iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xuXG5pbXBvcnQgeyBpbml0U2hhZGVycyB9IGZyb20gJ1dlQkdMVXRpbHMnXG5cbmltcG9ydCBNYXRyaXg0IGZyb20gJ01hdHJpeDQnXG5cbmNvbnN0IFZTSEFERVJfU09VUkNFID0gYFxuICBhdHRyaWJ1dGUgdmVjNCBhX1Bvc2l0aW9uO1xuICBhdHRyaWJ1dGUgdmVjNCBhX0NvbG9yO1xuICB1bmlmb3JtIG1hdDQgdV9NdnBNYXRyaXg7XG4gIHZhcnlpbmcgdmVjNCB2X0NvbG9yO1xuICB2b2lkIG1haW4oKXtcbiAgICAgIGdsX1Bvc2l0aW9uID0gdV9NdnBNYXRyaXggKiBhX1Bvc2l0aW9uO1xuICAgICAgdl9Db2xvciA9IGFfQ29sb3I7XG4gIH1cbmBcblxuY29uc3QgRlNIQURFUl9TT1VSQ0UgPSBgXG4gIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICB2YXJ5aW5nIHZlYzQgdl9Db2xvcjtcbiAgdm9pZCBtYWluKCl7XG4gICAgICBnbF9GcmFnQ29sb3IgPSB2X0NvbG9yO1xuICB9XG5gXG5cbmNsYXNzIENvbG9yZWRDdWJlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNhbnZhcyA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmcy5jYW52YXMpXG4gICAgICBjYW52YXMud2lkdGggPSA1MDBcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSA1MDBcblxuICAgICAgY29uc3QgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnKVxuXG4gICAgICBpZiAoIWluaXRTaGFkZXJzKGdsLCBWU0hBREVSX1NPVVJDRSwgRlNIQURFUl9TT1VSQ0UpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZCB0byBpbml0IFNoYWRlcnMnKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgbiA9IHRoaXMuaW5pdFZlcnRleEJ1ZmZlcnMoZ2wpXG4gICAgICBpZiAobiA8IDApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBzZXQgdGhlIHZlcnRleCBpbmZvcm1hdGlvbicpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBnbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMClcbiAgICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKVxuXG4gICAgICBjb25zdCB1TXZwTWF0cml4ID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKGdsLnByb2dyYW0sICd1X012cE1hdHJpeCcpXG4gICAgICBpZiAoIXVNdnBNYXRyaXgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBnZXQgdGhlIHN0b3JhZ2UgbG9jYXRpb24gb2YgdV9NdnBNYXRyaXgnKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgbXZwTWF0cml4ID0gbmV3IE1hdHJpeDQoKVxuICAgICAgbXZwTWF0cml4LnNldFZpZXcoMywgMywgNywgMCwgMCwgMCwgMCwgMSwgMClcbiAgICAgICAgICAgICAgICAgIC5wZXJzcGVjdGl2ZSgzMCwgMSwgMSwgMTAwKVxuICAgICAgZ2wudW5pZm9ybU1hdHJpeDRmdih1TXZwTWF0cml4LCBmYWxzZSwgbXZwTWF0cml4Lm1hdHJpeClcblxuICAgICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpXG5cbiAgICAgIGdsLmRyYXdFbGVtZW50cyhnbC5UUklBTkdMRVMsIG4sIGdsLlVOU0lHTkVEX0JZVEUsIDApXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9XG4gIH1cbiAgaW5pdFZlcnRleEJ1ZmZlcnMgPSAoZ2wpID0+IHtcbiAgICAvLyAgQ3JlYXRlIGEgY3ViZVxuICAgIC8vICAgICB2Ni0tLS0tIHY1XG4gICAgLy8gICAgL3wgICAgICAvfFxuICAgIC8vICAgdjEtLS0tLS12MHxcbiAgICAvLyAgIHwgfCAgICAgfCB8XG4gICAgLy8gICB8IHx2Ny0tLXwtfHY0XG4gICAgLy8gICB8LyAgICAgIHwvXG4gICAgLy8gICB2Mi0tLS0tLXYzXG4gICAgY29uc3QgdmVydGV4cyA9IG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgMS4wLCAxLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIC0xLjAsIDEuMCwgMS4wLCAtMS4wLCAxLjAsICAgLy8gIHYwLXYxLXYyLXYzIGZyb250XG4gICAgICAxLjAsIDEuMCwgMS4wLCAxLjAsIC0xLjAsIDEuMCwgMS4wLCAtMS4wLCAtMS4wLCAxLjAsIDEuMCwgLTEuMCwgICAvLyAgdjAtdjMtdjQtdjUgcmlnaHRcbiAgICAgIDEuMCwgMS4wLCAxLjAsIDEuMCwgMS4wLCAtMS4wLCAtMS4wLCAxLjAsIC0xLjAsIC0xLjAsIDEuMCwgMS4wLCAgIC8vICB2MC12NS12Ni12MSB1cFxuICAgICAgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIDEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgMS4wLCAgIC8vICB2MS12Ni12Ny12MiBsZWZ0XG4gICAgICAtMS4wLCAtMS4wLCAtMS4wLCAxLjAsIC0xLjAsIC0xLjAsIDEuMCwgLTEuMCwgMS4wLCAtMS4wLCAtMS4wLCAxLjAsICAgLy8gIHY3LXY0LXYzLXYyIGRvd25cbiAgICAgIDEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgMS4wLCAtMS4wLCAxLjAsIDEuMCwgLTEuMCwgICAvLyAgdjQtdjctdjYtdjUgYmFja1xuICAgIF0pXG5cbiAgICAvLyAgQ29sb3JzXG4gICAgY29uc3QgY29sb3JzID0gbmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAwLjQsIDAuNCwgMS4wLCAwLjQsIDAuNCwgMS4wLCAwLjQsIDAuNCwgMS4wLCAwLjQsIDAuNCwgMS4wLCAgIC8vICB2MC12MS12Mi12MyBmcm9udChibHVlKVxuICAgICAgMC40LCAxLjAsIDAuNCwgMC40LCAxLjAsIDAuNCwgMC40LCAxLjAsIDAuNCwgMC40LCAxLjAsIDAuNCwgICAvLyAgdjAtdjMtdjQtdjUgcmlnaHQoZ3JlZW4pXG4gICAgICAxLjAsIDAuNCwgMC40LCAxLjAsIDAuNCwgMC40LCAxLjAsIDAuNCwgMC40LCAxLjAsIDAuNCwgMC40LCAgIC8vICB2MC12NS12Ni12MSB1cChyZWQpXG4gICAgICAxLjAsIDEuMCwgMC40LCAxLjAsIDEuMCwgMC40LCAxLjAsIDEuMCwgMC40LCAxLjAsIDEuMCwgMC40LCAgIC8vICB2MS12Ni12Ny12MiBsZWZ0XG4gICAgICAxLjAsIDEuMCwgMS4wLCAxLjAsIDEuMCwgMS4wLCAxLjAsIDEuMCwgMS4wLCAxLjAsIDEuMCwgMS4wLCAgIC8vICB2Ny12NC12My12MiBkb3duXG4gICAgICAwLjQsIDEuMCwgMS4wLCAwLjQsIDEuMCwgMS4wLCAwLjQsIDEuMCwgMS4wLCAwLjQsIDEuMCwgMS4wLCAgIC8vICB2NC12Ny12Ni12NSBiYWNrXG4gICAgXSlcblxuICAgICAvLyAgSW5kaWNlcyBvZiB0aGUgdmVydGljZXNcbiAgICBjb25zdCBpbmRpY2VzID0gbmV3IFVpbnQ4QXJyYXkoW1xuICAgICAgMCwgMSwgMiwgMCwgMiwgMywgICAgIC8vICBmcm9udFxuICAgICAgNCwgNSwgNiwgNCwgNiwgNywgICAgIC8vICByaWdodFxuICAgICAgOCwgOSwgMTAsIDgsIDEwLCAxMSwgICAgIC8vICB1cFxuICAgICAgMTIsIDEzLCAxNCwgMTIsIDE0LCAxNSwgICAgIC8vICBsZWZ0XG4gICAgICAxNiwgMTcsIDE4LCAxNiwgMTgsIDE5LCAgICAgLy8gIGRvd25cbiAgICAgIDIwLCAyMSwgMjIsIDIwLCAyMiwgMjMsICAgICAvLyAgYmFja1xuICAgIF0pXG5cbiAgICAvLyAgQ3JlYXRlIGEgYnVmZmVyIG9iamVjdFxuICAgIGNvbnN0IGluZGV4QnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKClcbiAgICBpZiAoIWluZGV4QnVmZmVyKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG5cbiAgICAvLyAgV3JpdGUgdGhlIHZlcnRleCBjb29yZGluYXRlcyBhbmQgY29sb3IgdG8gdGhlIGJ1ZmZlciBvYmplY3RcbiAgICBpZiAoIXRoaXMuaW5pdEFycmF5QnVmZmVyKGdsLCB2ZXJ0ZXhzLCAzLCBnbC5GTE9BVCwgJ2FfUG9zaXRpb24nKSkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmluaXRBcnJheUJ1ZmZlcihnbCwgY29sb3JzLCAzLCBnbC5GTE9BVCwgJ2FfQ29sb3InKSkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuXG4gICAgLy8gIFdyaXRlIHRoZSBpbmRpY2VzIHRvIHRoZSBidWZmZXIgb2JqZWN0XG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgaW5kZXhCdWZmZXIpXG4gICAgZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgaW5kaWNlcywgZ2wuU1RBVElDX0RSQVcpXG5cbiAgICByZXR1cm4gaW5kaWNlcy5sZW5ndGhcbiAgfVxuICBpbml0QXJyYXlCdWZmZXIgPSAoZ2wsIGRhdGEsIG51bSwgdHlwZSwgYXR0cmlidXRlKSA9PiB7XG4gICAgLy8gIENyZWF0ZSBhIGJ1ZmZlciBvYmplY3RcbiAgICBjb25zdCBidWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKVxuICAgIGlmICghYnVmZmVyKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGNyZWF0ZSB0aGUgYnVmZmVyIG9iamVjdCcpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgLy8gIFdyaXRlIGRhdGUgaW50byB0aGUgYnVmZmVyIG9iamVjdFxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpXG4gICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGRhdGEsIGdsLlNUQVRJQ19EUkFXKVxuICAgIC8vICBBc3NpZ24gdGhlIGJ1ZmZlciBvYmplY3QgdG8gdGhlIGF0dHJpYnV0ZSB2YXJpYWJsZVxuICAgIGNvbnN0IGFBdHRyaWJ1dGUgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihnbC5wcm9ncmFtLCBhdHRyaWJ1dGUpXG4gICAgaWYgKGFBdHRyaWJ1dGUgPCAwKSB7XG4gICAgICBjb25zb2xlLmxvZyhgRmFpbGVkIHRvIGdldCB0aGUgc3RvcmFnZSBsb2NhdGlvbiBvZiAke2F0dHJpYnV0ZX1gKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYUF0dHJpYnV0ZSwgbnVtLCB0eXBlLCBmYWxzZSwgMCwgMClcbiAgICAvLyAgRW5hYmxlIHRoZSBhc3NpZ25tZW50IG9mIHRoZSBidWZmZXIgb2JqZWN0IHRvIHRoZSBhdHRyaWJ1dGUgdmFyaWFibGVcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhQXR0cmlidXRlKVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxmaWd1cmU+XG4gICAgICAgIDxmaWdjYXB0aW9uPnsn5Y2V5LiA6aKc6Imy56uL5pa55L2TJ308L2ZpZ2NhcHRpb24+XG4gICAgICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCI+XG4gICAgICAgICAgeyd5b3VyIGN1cnJlbnQgYnJvd2VyIGRvblxcJ3Qgc3VwcG9ydCBjYW52YXMsIHBsZWFzZSBjaGFuZ2UgYW5vdGhlciBvbmUnfVxuICAgICAgICA8L2NhbnZhcz5cbiAgICAgIDwvZmlndXJlPlxuICAgIClcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBDb2xvcmVkQ3ViZVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cnkvcm91dGVzL2RlbW9zL3JvdXRlcy9jYW52YXMvd2ViZ2wvY29sb3JlZEN1YmUvQ29sb3JlZEN1YmUuanN4XG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==