webpackJsonp([16],{

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

/***/ 347:
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
	
	var VSHADER_SOURCE = '\n    attribute vec4 a_Position;\n    attribute vec4 a_Color;\n    attribute vec4 a_Normal;\n    uniform mat4 u_MvpMatrix;\n    uniform vec3 u_LightColor;\n    uniform vec3 u_LightDirection;\n    uniform vec3 u_AmbientLight;\n    varying vec4 v_Color;\n    void main(){\n        gl_Position = u_MvpMatrix * a_Position;\n        vec3 normal = normalize(a_Normal.xyz);\n        float nDotL = max(dot(u_LightDirection, normal), 0.0);\n        vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n        vec3 ambient = u_AmbientLight * a_Color.rgb;\n        v_Color = vec4(diffuse + ambient, a_Color.a);\n    }\n';
	
	var FSHADER_SOURCE = '\n    precision mediump float;\n    varying vec4 v_Color;\n    void main(){\n        gl_FragColor = v_Color;\n    }\n';
	
	var LightedCube = function (_React$Component) {
	  _inherits(LightedCube, _React$Component);
	
	  function LightedCube() {
	    var _Object$getPrototypeO;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, LightedCube);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(LightedCube)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.initVertexBuffers = function (gl) {
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
	
	  _createClass(LightedCube, [{
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
	        if (!uMvpMatrix || !uLightColor || !uLightDirection || !uAmbientLight) {
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
	        var mvpMatrix = new _Matrix2.default();
	        mvpMatrix.setView(3, 3, 7, 0, 0, 0, 0, 1, 0).perspective(30, canvas.width / canvas.height, 1, 100);
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
	          '光照立方体'
	        ),
	        _react2.default.createElement(
	          'canvas',
	          { ref: 'canvas' },
	          'your current brower don\'t support canvas,please change another one'
	        )
	      );
	    }
	  }]);
	
	  return LightedCube;
	}(_react2.default.Component);
	
	module.exports = LightedCube;

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

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbGliL3dlYmdsL3V0aWxzLmpzPzVkMDcqKioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi93ZWJnbC9tYXRyaXg0LmpzPzI0OTQqKioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJ5L3JvdXRlcy9kZW1vcy9yb3V0ZXMvY2FudmFzL3dlYmdsL2xpZ2h0ZWRDdWJlL0xpZ2h0ZWRDdWJlLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL3dlYmdsL3ZlY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O1NBT2dCLFcsR0FBQSxXO0FBUGhCOzs7Ozs7O0FBT08sVUFBUyxXQUFULENBQXFCLEVBQXJCLEVBQXlCLE9BQXpCLEVBQWtDLE9BQWxDLEVBQTJDO0FBQ2hELE9BQUksVUFBVSxjQUFjLEVBQWQsRUFBa0IsT0FBbEIsRUFBMkIsT0FBM0IsQ0FBZDtBQUNBLE9BQUksQ0FBQyxPQUFMLEVBQWM7QUFDWixhQUFRLEdBQVIsQ0FBWSwwQkFBWjtBQUNBLFlBQU8sS0FBUDtBQUNEOztBQUVELE1BQUcsVUFBSCxDQUFjLE9BQWQ7QUFDQSxNQUFHLE9BQUgsR0FBYSxPQUFiOztBQUVBLFVBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBT0EsVUFBUyxhQUFULENBQXVCLEVBQXZCLEVBQTJCLE9BQTNCLEVBQW9DLE9BQXBDLEVBQTZDO0FBQzNDO0FBQ0EsT0FBSSxlQUFlLFdBQVcsRUFBWCxFQUFlLEdBQUcsYUFBbEIsRUFBaUMsT0FBakMsQ0FBbkI7QUFDQSxPQUFJLGlCQUFpQixXQUFXLEVBQVgsRUFBZSxHQUFHLGVBQWxCLEVBQW1DLE9BQW5DLENBQXJCO0FBQ0EsT0FBSSxDQUFDLFlBQUQsSUFBaUIsQ0FBQyxjQUF0QixFQUFzQztBQUNwQyxZQUFPLElBQVA7QUFDRDs7QUFFRDtBQUNBLE9BQUksVUFBVSxHQUFHLGFBQUgsRUFBZDtBQUNBLE9BQUksQ0FBQyxPQUFMLEVBQWM7QUFDWixZQUFPLElBQVA7QUFDRDs7QUFFRDtBQUNBLE1BQUcsWUFBSCxDQUFnQixPQUFoQixFQUF5QixZQUF6QjtBQUNBLE1BQUcsWUFBSCxDQUFnQixPQUFoQixFQUF5QixjQUF6Qjs7QUFFQTtBQUNBLE1BQUcsV0FBSCxDQUFlLE9BQWY7O0FBRUE7QUFDQSxPQUFJLFNBQVMsR0FBRyxtQkFBSCxDQUF1QixPQUF2QixFQUFnQyxHQUFHLFdBQW5DLENBQWI7QUFDQSxPQUFJLENBQUMsTUFBTCxFQUFhO0FBQ1gsU0FBSSxRQUFRLEdBQUcsaUJBQUgsQ0FBcUIsT0FBckIsQ0FBWjtBQUNBLGFBQVEsR0FBUixDQUFZLDZCQUE2QixLQUF6QztBQUNBLFFBQUcsYUFBSCxDQUFpQixPQUFqQjtBQUNBLFFBQUcsWUFBSCxDQUFnQixjQUFoQjtBQUNBLFFBQUcsWUFBSCxDQUFnQixZQUFoQjtBQUNBLFlBQU8sSUFBUDtBQUNEO0FBQ0QsVUFBTyxPQUFQO0FBQ0Q7O0FBR0Q7Ozs7Ozs7QUFPQSxVQUFTLFVBQVQsQ0FBb0IsRUFBcEIsRUFBd0IsSUFBeEIsRUFBOEIsTUFBOUIsRUFBc0M7QUFDcEM7QUFDQSxPQUFJLFNBQVMsR0FBRyxZQUFILENBQWdCLElBQWhCLENBQWI7QUFDQSxPQUFJLFVBQVUsSUFBZCxFQUFvQjtBQUNsQixhQUFRLEdBQVIsQ0FBWSx5QkFBWjtBQUNBLFlBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0EsTUFBRyxZQUFILENBQWdCLE1BQWhCLEVBQXdCLE1BQXhCOztBQUVBO0FBQ0EsTUFBRyxhQUFILENBQWlCLE1BQWpCOztBQUVBO0FBQ0EsT0FBSSxXQUFXLEdBQUcsa0JBQUgsQ0FBc0IsTUFBdEIsRUFBOEIsR0FBRyxjQUFqQyxDQUFmO0FBQ0EsT0FBSSxDQUFDLFFBQUwsRUFBZTtBQUNiLFNBQUksUUFBUSxHQUFHLGdCQUFILENBQW9CLE1BQXBCLENBQVo7QUFDQSxhQUFRLEdBQVIsQ0FBWSwrQkFBK0IsS0FBM0M7QUFDQSxRQUFHLFlBQUgsQ0FBZ0IsTUFBaEI7QUFDQSxZQUFPLElBQVA7QUFDRDs7QUFFRCxVQUFPLE1BQVA7QUFDRCxFOzs7Ozs7Ozs7OztLQzdGSyxPLEdBQ0YsaUJBQVksTUFBWixFQUFvQjtBQUFBOztBQUFBOztBQUNoQixVQUFLLE1BQUwsR0FBYyxVQUFVLFFBQVEsV0FBUixFQUF4QjtBQUNIO0FBb0ZEOzs7Ozs7QUE0REE7Ozs7Ozs7Ozs7QUFuSkUsUSxDQTRGSyxTLEdBQVksVUFBQyxNQUFELEVBQVk7QUFDN0IsU0FBSSxVQUFKO0FBQUEsU0FBTyxVQUFQO0FBQUEsU0FBVSxVQUFWO0FBQUEsU0FBYSxZQUFiO0FBQUEsU0FBa0IsWUFBbEI7O0FBRUEsU0FBSSxPQUFPLE1BQVg7QUFDQSxTQUFJLElBQUksWUFBSixDQUFpQixFQUFqQixDQUFKO0FBQ0EsV0FBTSxJQUFJLFlBQUosQ0FBaUIsRUFBakIsQ0FBTjs7QUFFQSxTQUFJLENBQUosSUFBWSxFQUFFLENBQUYsSUFBSyxFQUFFLEVBQUYsQ0FBTCxHQUFXLEVBQUUsRUFBRixDQUFYLEdBQW1CLEVBQUUsQ0FBRixJQUFNLEVBQUUsRUFBRixDQUFOLEdBQVksRUFBRSxFQUFGLENBQS9CLEdBQXVDLEVBQUUsQ0FBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBQWxELEdBQ0EsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVyxFQUFFLEVBQUYsQ0FEWCxHQUNtQixFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFZLEVBQUUsRUFBRixDQUQvQixHQUN1QyxFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUQ5RDtBQUVBLFNBQUksQ0FBSixJQUFVLENBQUUsRUFBRSxDQUFGLENBQUYsR0FBTyxFQUFFLEVBQUYsQ0FBUCxHQUFhLEVBQUUsRUFBRixDQUFiLEdBQXFCLEVBQUUsQ0FBRixJQUFNLEVBQUUsRUFBRixDQUFOLEdBQVksRUFBRSxFQUFGLENBQWpDLEdBQXlDLEVBQUUsQ0FBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBQXBELEdBQ0UsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVyxFQUFFLEVBQUYsQ0FEYixHQUNxQixFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFZLEVBQUUsRUFBRixDQURqQyxHQUN5QyxFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUQ5RDtBQUVBLFNBQUksQ0FBSixJQUFZLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVcsRUFBRSxFQUFGLENBQVgsR0FBbUIsRUFBRSxDQUFGLElBQU0sRUFBRSxFQUFGLENBQU4sR0FBWSxFQUFFLEVBQUYsQ0FBL0IsR0FBdUMsRUFBRSxDQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLEVBQUYsQ0FBbEQsR0FDQSxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFXLEVBQUUsRUFBRixDQURYLEdBQ21CLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVksRUFBRSxFQUFGLENBRC9CLEdBQ3VDLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxDQUFGLENBRDlEO0FBRUEsU0FBSSxFQUFKLElBQVUsQ0FBRSxFQUFFLENBQUYsQ0FBRixHQUFPLEVBQUUsQ0FBRixDQUFQLEdBQWEsRUFBRSxFQUFGLENBQWIsR0FBcUIsRUFBRSxDQUFGLElBQU0sRUFBRSxFQUFGLENBQU4sR0FBWSxFQUFFLEVBQUYsQ0FBakMsR0FBeUMsRUFBRSxDQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLEVBQUYsQ0FBcEQsR0FDRSxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFXLEVBQUUsRUFBRixDQURiLEdBQ3FCLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVksRUFBRSxFQUFGLENBRGpDLEdBQ3lDLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxDQUFGLENBRDlEOztBQUdBLFNBQUksQ0FBSixJQUFVLENBQUUsRUFBRSxDQUFGLENBQUYsR0FBTyxFQUFFLEVBQUYsQ0FBUCxHQUFhLEVBQUUsRUFBRixDQUFiLEdBQXFCLEVBQUUsQ0FBRixJQUFNLEVBQUUsRUFBRixDQUFOLEdBQVksRUFBRSxFQUFGLENBQWpDLEdBQXlDLEVBQUUsQ0FBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBQXBELEdBQ0UsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVyxFQUFFLEVBQUYsQ0FEYixHQUNxQixFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFZLEVBQUUsRUFBRixDQURqQyxHQUN5QyxFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUQ5RDtBQUVBLFNBQUksQ0FBSixJQUFZLEVBQUUsQ0FBRixJQUFLLEVBQUUsRUFBRixDQUFMLEdBQVcsRUFBRSxFQUFGLENBQVgsR0FBbUIsRUFBRSxDQUFGLElBQU0sRUFBRSxFQUFGLENBQU4sR0FBWSxFQUFFLEVBQUYsQ0FBL0IsR0FBdUMsRUFBRSxDQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLEVBQUYsQ0FBbEQsR0FDQSxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFXLEVBQUUsRUFBRixDQURYLEdBQ21CLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVksRUFBRSxFQUFGLENBRC9CLEdBQ3VDLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBRDlEO0FBRUEsU0FBSSxDQUFKLElBQVUsQ0FBRSxFQUFFLENBQUYsQ0FBRixHQUFPLEVBQUUsQ0FBRixDQUFQLEdBQWEsRUFBRSxFQUFGLENBQWIsR0FBcUIsRUFBRSxDQUFGLElBQU0sRUFBRSxFQUFGLENBQU4sR0FBWSxFQUFFLEVBQUYsQ0FBakMsR0FBeUMsRUFBRSxDQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLEVBQUYsQ0FBcEQsR0FDRSxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFXLEVBQUUsRUFBRixDQURiLEdBQ3FCLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVksRUFBRSxFQUFGLENBRGpDLEdBQ3lDLEVBQUUsRUFBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxDQUFGLENBRDlEO0FBRUEsU0FBSSxFQUFKLElBQVksRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVyxFQUFFLEVBQUYsQ0FBWCxHQUFtQixFQUFFLENBQUYsSUFBTSxFQUFFLEVBQUYsQ0FBTixHQUFZLEVBQUUsRUFBRixDQUEvQixHQUF1QyxFQUFFLENBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUFsRCxHQUNBLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVcsRUFBRSxFQUFGLENBRFgsR0FDbUIsRUFBRSxFQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBWSxFQUFFLEVBQUYsQ0FEL0IsR0FDdUMsRUFBRSxFQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLENBQUYsQ0FEOUQ7O0FBR0EsU0FBSSxDQUFKLElBQVksRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLEVBQUYsQ0FBVixHQUFrQixFQUFFLENBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUE3QixHQUFxQyxFQUFFLENBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUFoRCxHQUNBLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxFQUFGLENBRFYsR0FDa0IsRUFBRSxFQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLENBQUYsQ0FEN0IsR0FDcUMsRUFBRSxFQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLENBQUYsQ0FENUQ7QUFFQSxTQUFJLENBQUosSUFBVSxDQUFFLEVBQUUsQ0FBRixDQUFGLEdBQU8sRUFBRSxDQUFGLENBQVAsR0FBWSxFQUFFLEVBQUYsQ0FBWixHQUFvQixFQUFFLENBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUEvQixHQUF1QyxFQUFFLENBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsRUFBRixDQUFsRCxHQUNFLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxFQUFGLENBRFosR0FDb0IsRUFBRSxFQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLENBQUYsQ0FEL0IsR0FDdUMsRUFBRSxFQUFGLElBQU0sRUFBRSxDQUFGLENBQU4sR0FBVyxFQUFFLENBQUYsQ0FENUQ7QUFFQSxTQUFJLEVBQUosSUFBWSxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsRUFBRixDQUFWLEdBQWtCLEVBQUUsQ0FBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBQTdCLEdBQXFDLEVBQUUsQ0FBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBQWhELEdBQ0EsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLEVBQUYsQ0FEVixHQUNrQixFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsQ0FBRixDQUQ3QixHQUNxQyxFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsQ0FBRixDQUQ1RDtBQUVBLFNBQUksRUFBSixJQUFVLENBQUUsRUFBRSxDQUFGLENBQUYsR0FBTyxFQUFFLENBQUYsQ0FBUCxHQUFZLEVBQUUsRUFBRixDQUFaLEdBQW9CLEVBQUUsQ0FBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBQS9CLEdBQXVDLEVBQUUsQ0FBRixJQUFNLEVBQUUsQ0FBRixDQUFOLEdBQVcsRUFBRSxFQUFGLENBQWxELEdBQ0UsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLEVBQUYsQ0FEWixHQUNvQixFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsQ0FBRixDQUQvQixHQUN1QyxFQUFFLEVBQUYsSUFBTSxFQUFFLENBQUYsQ0FBTixHQUFXLEVBQUUsQ0FBRixDQUQ1RDs7QUFHQSxTQUFJLENBQUosSUFBVSxDQUFFLEVBQUUsQ0FBRixDQUFGLEdBQU8sRUFBRSxDQUFGLENBQVAsR0FBWSxFQUFFLEVBQUYsQ0FBWixHQUFvQixFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsRUFBRixDQUE5QixHQUFzQyxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsRUFBRixDQUFoRCxHQUNFLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxFQUFGLENBRFosR0FDb0IsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLENBQUYsQ0FEOUIsR0FDc0MsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLENBQUYsQ0FEMUQ7QUFFQSxTQUFJLENBQUosSUFBWSxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsRUFBRixDQUFWLEdBQWtCLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxFQUFGLENBQTVCLEdBQW9DLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxFQUFGLENBQTlDLEdBQ0EsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLEVBQUYsQ0FEVixHQUNrQixFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsQ0FBRixDQUQ1QixHQUNvQyxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsQ0FBRixDQUQxRDtBQUVBLFNBQUksRUFBSixJQUFVLENBQUUsRUFBRSxDQUFGLENBQUYsR0FBTyxFQUFFLENBQUYsQ0FBUCxHQUFZLEVBQUUsRUFBRixDQUFaLEdBQW9CLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxDQUFGLENBQTlCLEdBQXNDLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxFQUFGLENBQWhELEdBQ0UsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLENBQUYsQ0FEWixHQUNvQixFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsQ0FBRixDQUQ5QixHQUNzQyxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsQ0FBRixDQUQxRDtBQUVBLFNBQUksRUFBSixJQUFZLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxFQUFGLENBQVYsR0FBa0IsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLENBQUYsQ0FBNUIsR0FBb0MsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQUwsR0FBVSxFQUFFLEVBQUYsQ0FBOUMsR0FDQSxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBTCxHQUFVLEVBQUUsQ0FBRixDQURWLEdBQ2tCLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxDQUFGLENBRDVCLEdBQ29DLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFMLEdBQVUsRUFBRSxDQUFGLENBRDFEOztBQUdBLFdBQU0sRUFBRSxDQUFGLElBQUssSUFBSSxDQUFKLENBQUwsR0FBYyxFQUFFLENBQUYsSUFBSyxJQUFJLENBQUosQ0FBbkIsR0FBNEIsRUFBRSxDQUFGLElBQUssSUFBSSxDQUFKLENBQWpDLEdBQTBDLEVBQUUsQ0FBRixJQUFLLElBQUksRUFBSixDQUFyRDtBQUNBLFNBQUksUUFBUSxDQUFaLEVBQWU7QUFDYjtBQUNEOztBQUVELFdBQU0sSUFBSSxHQUFWO0FBQ0EsVUFBSyxJQUFJLENBQVQsRUFBWSxJQUFJLEVBQWhCLEVBQW9CLEdBQXBCLEVBQXlCO0FBQ3ZCLFdBQUUsQ0FBRixJQUFPLElBQUksQ0FBSixJQUFTLEdBQWhCO0FBQ0Q7O0FBRUQsWUFBTyxDQUFQO0FBQ0QsRTs7QUFsSkMsUSxDQTJKSyxpQixHQUFvQixVQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsSUFBZCxFQUFvQixHQUFwQixFQUE0QjtBQUNuRCxTQUFJLGVBQUo7QUFBQSxTQUFZLFdBQVo7QUFBQSxTQUFnQixVQUFoQjtBQUFBLFNBQW1CLFdBQW5COztBQUVBLFNBQUksU0FBUyxHQUFULElBQWdCLFdBQVcsQ0FBL0IsRUFBa0M7QUFDaEMsZUFBTSxjQUFOO0FBQ0Q7QUFDRCxTQUFJLFFBQVEsQ0FBWixFQUFlO0FBQ2IsZUFBTSxXQUFOO0FBQ0Q7QUFDRCxTQUFJLE9BQU8sQ0FBWCxFQUFjO0FBQ1osZUFBTSxVQUFOO0FBQ0Q7O0FBRUQsV0FBTSxLQUFLLEVBQUwsR0FBVSxHQUFWLEdBQWdCLEdBQWhCLEdBQXNCLENBQTVCO0FBQ0EsU0FBSSxLQUFLLEdBQUwsQ0FBUyxHQUFULENBQUo7QUFDQSxTQUFJLE1BQU0sQ0FBVixFQUFhO0FBQ1gsZUFBTSxjQUFOO0FBQ0Q7QUFDRCxVQUFLLEtBQUssTUFBTSxJQUFYLENBQUw7QUFDQSxVQUFLLEtBQUssR0FBTCxDQUFTLEdBQVQsSUFBZ0IsQ0FBckI7O0FBRUEsY0FBUyxJQUFJLFlBQUosQ0FBaUIsRUFBakIsQ0FBVDs7QUFFQSxZQUFPLENBQVAsSUFBYSxLQUFLLE1BQWxCO0FBQ0EsWUFBTyxDQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sQ0FBUCxJQUFhLENBQWI7QUFDQSxZQUFPLENBQVAsSUFBYSxDQUFiOztBQUVBLFlBQU8sQ0FBUCxJQUFhLENBQWI7QUFDQSxZQUFPLENBQVAsSUFBYSxFQUFiO0FBQ0EsWUFBTyxDQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sQ0FBUCxJQUFhLENBQWI7O0FBRUEsWUFBTyxDQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sQ0FBUCxJQUFhLENBQWI7QUFDQSxZQUFPLEVBQVAsSUFBYSxFQUFFLE1BQU0sSUFBUixJQUFnQixFQUE3QjtBQUNBLFlBQU8sRUFBUCxJQUFhLENBQUMsQ0FBZDs7QUFFQSxZQUFPLEVBQVAsSUFBYSxDQUFiO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sRUFBUCxJQUFhLENBQUMsQ0FBRCxHQUFLLElBQUwsR0FBWSxHQUFaLEdBQWtCLEVBQS9CO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sTUFBUDtBQUNILEU7O0FBdE1DLFEsQ0F1TUssVyxHQUFjLFVBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxNQUFkLEVBQXNCLEdBQXRCLEVBQTJCLElBQTNCLEVBQWlDLEdBQWpDLEVBQXlDO0FBQzFELFNBQUksZUFBSjtBQUFBLFNBQVksV0FBWjtBQUFBLFNBQWdCLFdBQWhCO0FBQUEsU0FBb0IsV0FBcEI7O0FBRUEsU0FBSSxTQUFTLEtBQVQsSUFBa0IsV0FBVyxHQUE3QixJQUFvQyxTQUFTLEdBQWpELEVBQXNEO0FBQ3BELGVBQU0sY0FBTjtBQUNEOztBQUVELFVBQUssS0FBSyxRQUFRLElBQWIsQ0FBTDtBQUNBLFVBQUssS0FBSyxNQUFNLE1BQVgsQ0FBTDtBQUNBLFVBQUssS0FBSyxNQUFNLElBQVgsQ0FBTDs7QUFFQSxjQUFTLElBQUksWUFBSixDQUFpQixFQUFqQixDQUFUOztBQUVBLFlBQU8sQ0FBUCxJQUFhLElBQUksRUFBakI7QUFDQSxZQUFPLENBQVAsSUFBYSxDQUFiO0FBQ0EsWUFBTyxDQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sQ0FBUCxJQUFhLENBQWI7O0FBRUEsWUFBTyxDQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sQ0FBUCxJQUFhLElBQUksRUFBakI7QUFDQSxZQUFPLENBQVAsSUFBYSxDQUFiO0FBQ0EsWUFBTyxDQUFQLElBQWEsQ0FBYjs7QUFFQSxZQUFPLENBQVAsSUFBYSxDQUFiO0FBQ0EsWUFBTyxDQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sRUFBUCxJQUFhLENBQUMsQ0FBRCxHQUFLLEVBQWxCO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBYjs7QUFFQSxZQUFPLEVBQVAsSUFBYSxFQUFFLFFBQVEsSUFBVixJQUFrQixFQUEvQjtBQUNBLFlBQU8sRUFBUCxJQUFhLEVBQUUsTUFBTSxNQUFSLElBQWtCLEVBQS9CO0FBQ0EsWUFBTyxFQUFQLElBQWEsRUFBRSxNQUFNLElBQVIsSUFBZ0IsRUFBN0I7QUFDQSxZQUFPLEVBQVAsSUFBYSxDQUFiOztBQUVBLFlBQU8sTUFBUDtBQUNILEU7O0FBek9DLFEsQ0EwT0ssVSxHQUFhLFVBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLE9BQW5CLEVBQTRCLE9BQTVCLEVBQXFDLE9BQXJDLEVBQThDLEdBQTlDLEVBQW1ELEdBQW5ELEVBQXdELEdBQXhELEVBQThEO0FBQzlFLFNBQUksVUFBSjtBQUFBLFNBQU8sV0FBUDtBQUFBLFNBQVcsV0FBWDtBQUFBLFNBQWUsV0FBZjtBQUFBLFNBQW1CLFlBQW5CO0FBQUEsU0FBd0IsV0FBeEI7QUFBQSxTQUE0QixXQUE1QjtBQUFBLFNBQWdDLFdBQWhDO0FBQUEsU0FBb0MsWUFBcEM7QUFBQSxTQUF5QyxXQUF6QztBQUFBLFNBQTZDLFdBQTdDO0FBQUEsU0FBaUQsV0FBakQ7O0FBRUEsVUFBSyxVQUFVLElBQWY7QUFDQSxVQUFLLFVBQVUsSUFBZjtBQUNBLFVBQUssVUFBVSxJQUFmOztBQUVBO0FBQ0EsV0FBTSxJQUFJLEtBQUssSUFBTCxDQUFVLEtBQUcsRUFBSCxHQUFRLEtBQUcsRUFBWCxHQUFnQixLQUFHLEVBQTdCLENBQVY7QUFDQSxXQUFNLEdBQU47QUFDQSxXQUFNLEdBQU47QUFDQSxXQUFNLEdBQU47O0FBRUE7QUFDQSxVQUFLLEtBQUssR0FBTCxHQUFXLEtBQUssR0FBckI7QUFDQSxVQUFLLEtBQUssR0FBTCxHQUFXLEtBQUssR0FBckI7QUFDQSxVQUFLLEtBQUssR0FBTCxHQUFXLEtBQUssR0FBckI7O0FBRUE7QUFDQSxXQUFNLElBQUksS0FBSyxJQUFMLENBQVUsS0FBRyxFQUFILEdBQVEsS0FBRyxFQUFYLEdBQWdCLEtBQUcsRUFBN0IsQ0FBVjtBQUNBLFdBQU0sR0FBTjtBQUNBLFdBQU0sR0FBTjtBQUNBLFdBQU0sR0FBTjs7QUFFQTtBQUNBLFVBQUssS0FBSyxFQUFMLEdBQVUsS0FBSyxFQUFwQjtBQUNBLFVBQUssS0FBSyxFQUFMLEdBQVUsS0FBSyxFQUFwQjtBQUNBLFVBQUssS0FBSyxFQUFMLEdBQVUsS0FBSyxFQUFwQjs7QUFFQSxTQUFJLFNBQVMsSUFBSSxZQUFKLENBQWlCLEVBQWpCLENBQWI7QUFDQSxZQUFPLENBQVAsSUFBWSxFQUFaO0FBQ0EsWUFBTyxDQUFQLElBQVksRUFBWjtBQUNBLFlBQU8sQ0FBUCxJQUFZLENBQUMsRUFBYjtBQUNBLFlBQU8sQ0FBUCxJQUFZLENBQVo7O0FBRUEsWUFBTyxDQUFQLElBQVksRUFBWjtBQUNBLFlBQU8sQ0FBUCxJQUFZLEVBQVo7QUFDQSxZQUFPLENBQVAsSUFBWSxDQUFDLEVBQWI7QUFDQSxZQUFPLENBQVAsSUFBWSxDQUFaOztBQUVBLFlBQU8sQ0FBUCxJQUFZLEVBQVo7QUFDQSxZQUFPLENBQVAsSUFBWSxFQUFaO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBQyxFQUFkO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBYjs7QUFFQSxZQUFPLEVBQVAsSUFBYSxDQUFiO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sRUFBUCxJQUFhLENBQWI7QUFDQSxZQUFPLEVBQVAsSUFBYSxDQUFiOztBQUVBLFlBQU8sUUFBUSxRQUFSLENBQWlCLE1BQWpCLEVBQXdCLFFBQVEsZUFBUixDQUF3QixDQUFDLElBQXpCLEVBQStCLENBQUMsSUFBaEMsRUFBc0MsQ0FBQyxJQUF2QyxDQUF4QixDQUFQO0FBQ0gsRTs7QUE3UkMsUSxDQThSSyxZLEdBQWUsVUFBQyxLQUFELEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWlCO0FBQ25DLFNBQUksU0FBUyxLQUFLLEVBQUwsR0FBVSxLQUFWLEdBQWtCLEtBQS9CO0FBQ0EsU0FBSSxJQUFJLEtBQUssR0FBTCxDQUFTLE1BQVQsQ0FBUjtBQUNBLFNBQUksSUFBSSxLQUFLLEdBQUwsQ0FBUyxNQUFULENBQVI7O0FBRUEsU0FBSSxNQUFJLENBQUosSUFBTyxNQUFJLENBQVgsSUFBYyxNQUFJLENBQXRCLEVBQXlCO0FBQ3JCLGFBQUksSUFBSSxDQUFSLEVBQVc7QUFDVCxpQkFBSSxDQUFDLENBQUw7QUFDRDtBQUNELGdCQUFPLFFBQVEsYUFBUixDQUFzQixDQUF0QixFQUF3QixDQUF4QixDQUFQO0FBQ0g7QUFDRCxTQUFJLE1BQUksQ0FBSixJQUFPLE1BQUksQ0FBWCxJQUFjLE1BQUksQ0FBdEIsRUFBeUI7QUFDckIsYUFBSSxJQUFJLENBQVIsRUFBVztBQUNULGlCQUFJLENBQUMsQ0FBTDtBQUNEO0FBQ0QsZ0JBQU8sUUFBUSxhQUFSLENBQXNCLENBQXRCLEVBQXdCLENBQXhCLENBQVA7QUFDSDtBQUNELFNBQUksTUFBSSxDQUFKLElBQU8sTUFBSSxDQUFYLElBQWMsTUFBSSxDQUF0QixFQUF5QjtBQUNyQixhQUFJLElBQUUsQ0FBTixFQUFTO0FBQ0wsaUJBQUksQ0FBQyxDQUFMO0FBQ0g7QUFDRCxnQkFBTyxRQUFRLGFBQVIsQ0FBc0IsQ0FBdEIsRUFBd0IsQ0FBeEIsQ0FBUDtBQUNIO0FBQ0QsU0FBSSxTQUFTLElBQUksWUFBSixDQUFpQixFQUFqQixDQUFiO0FBQ0EsV0FBTSxLQUFLLElBQUwsQ0FBVSxJQUFFLENBQUYsR0FBTSxJQUFFLENBQVIsR0FBWSxJQUFFLENBQXhCLENBQU47QUFDQSxTQUFJLFFBQVEsQ0FBWixFQUFlO0FBQ2IsZ0JBQU8sSUFBSSxHQUFYO0FBQ0EsY0FBSyxJQUFMO0FBQ0EsY0FBSyxJQUFMO0FBQ0EsY0FBSyxJQUFMO0FBQ0Q7QUFDRCxVQUFLLElBQUksQ0FBVDtBQUNBLFVBQUssSUFBSSxDQUFUO0FBQ0EsVUFBSyxJQUFJLENBQVQ7QUFDQSxVQUFLLElBQUksQ0FBVDtBQUNBLFVBQUssSUFBSSxDQUFUO0FBQ0EsVUFBSyxJQUFJLENBQVQ7QUFDQSxVQUFLLElBQUksQ0FBVDs7QUFFQSxZQUFRLENBQVIsSUFBYSxJQUFFLENBQUYsR0FBSSxFQUFKLEdBQVUsQ0FBdkI7QUFDQSxZQUFRLENBQVIsSUFBYSxLQUFJLEVBQUosR0FBUyxFQUF0QjtBQUNBLFlBQVEsQ0FBUixJQUFhLEtBQUksRUFBSixHQUFTLEVBQXRCO0FBQ0EsWUFBUSxDQUFSLElBQWEsQ0FBYjs7QUFFQSxZQUFRLENBQVIsSUFBYSxLQUFJLEVBQUosR0FBUyxFQUF0QjtBQUNBLFlBQVEsQ0FBUixJQUFhLElBQUUsQ0FBRixHQUFJLEVBQUosR0FBVSxDQUF2QjtBQUNBLFlBQVEsQ0FBUixJQUFhLEtBQUksRUFBSixHQUFTLEVBQXRCO0FBQ0EsWUFBUSxDQUFSLElBQWEsQ0FBYjs7QUFFQSxZQUFRLENBQVIsSUFBYSxLQUFJLEVBQUosR0FBUyxFQUF0QjtBQUNBLFlBQVEsQ0FBUixJQUFhLEtBQUksRUFBSixHQUFTLEVBQXRCO0FBQ0EsWUFBTyxFQUFQLElBQWEsSUFBRSxDQUFGLEdBQUksRUFBSixHQUFVLENBQXZCO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBYjs7QUFFQSxZQUFPLEVBQVAsSUFBYSxDQUFiO0FBQ0EsWUFBTyxFQUFQLElBQWEsQ0FBYjtBQUNBLFlBQU8sRUFBUCxJQUFhLENBQWI7QUFDQSxZQUFPLEVBQVAsSUFBYSxDQUFiOztBQUVBLFlBQU8sTUFBUDtBQUNILEU7O0FBMVZDLFEsQ0EyVkssZSxHQUFrQixVQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFTO0FBQzlCLFlBQU8sSUFBSSxZQUFKLENBQWlCLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBWSxDQUFaLEVBQWMsQ0FBZCxFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFxQixDQUFyQixFQUF1QixDQUF2QixFQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUE4QixDQUE5QixFQUFnQyxDQUFoQyxFQUFrQyxDQUFsQyxDQUFqQixDQUFQO0FBQ0gsRTs7QUE3VkMsUSxDQThWSyxXLEdBQWMsVUFBQyxFQUFELEVBQUksRUFBSixFQUFPLEVBQVAsRUFBWTtBQUM3QixZQUFPLElBQUksWUFBSixDQUFpQixDQUFDLEVBQUQsRUFBSSxDQUFKLEVBQU0sQ0FBTixFQUFRLENBQVIsRUFBVyxDQUFYLEVBQWEsRUFBYixFQUFnQixDQUFoQixFQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF1QixDQUF2QixFQUF5QixFQUF6QixFQUE0QixDQUE1QixFQUErQixDQUEvQixFQUFpQyxDQUFqQyxFQUFtQyxDQUFuQyxFQUFxQyxDQUFyQyxDQUFqQixDQUFQO0FBQ0gsRTs7QUFoV0MsUSxDQWlXSyxXLEdBQWMsWUFBSTtBQUNyQixZQUFPLElBQUksWUFBSixDQUFpQixDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsRUFBVSxDQUFWLEVBQVksQ0FBWixFQUFjLENBQWQsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBcUIsQ0FBckIsRUFBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBOEIsQ0FBOUIsRUFBZ0MsQ0FBaEMsRUFBa0MsQ0FBbEMsQ0FBakIsQ0FBUDtBQUNILEU7O0FBbldDLFEsQ0FvV0ssYSxHQUFnQixVQUFDLENBQUQsRUFBRyxDQUFILEVBQU87QUFDMUIsWUFBTyxJQUFJLFlBQUosQ0FBaUIsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFZLENBQVosRUFBYyxDQUFkLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXFCLENBQUMsQ0FBdEIsRUFBd0IsQ0FBeEIsRUFBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsRUFBK0IsQ0FBL0IsRUFBaUMsQ0FBakMsRUFBbUMsQ0FBbkMsQ0FBakIsQ0FBUDtBQUNILEU7O0FBdFdDLFEsQ0F1V0ssYSxHQUFnQixVQUFDLENBQUQsRUFBRyxDQUFILEVBQU87QUFDMUIsWUFBTyxJQUFJLFlBQUosQ0FBaUIsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUMsQ0FBTixFQUFRLENBQVIsRUFBVyxDQUFYLEVBQWEsQ0FBYixFQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsRUFBc0IsQ0FBdEIsRUFBd0IsQ0FBeEIsRUFBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsRUFBK0IsQ0FBL0IsRUFBaUMsQ0FBakMsRUFBbUMsQ0FBbkMsQ0FBakIsQ0FBUDtBQUNILEU7O0FBeldDLFEsQ0EwV0ssYSxHQUFnQixVQUFDLENBQUQsRUFBRyxDQUFILEVBQU87QUFDMUIsWUFBTyxJQUFJLFlBQUosQ0FBaUIsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVUsQ0FBQyxDQUFYLEVBQWEsQ0FBYixFQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsRUFBc0IsQ0FBdEIsRUFBd0IsQ0FBeEIsRUFBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsRUFBK0IsQ0FBL0IsRUFBaUMsQ0FBakMsRUFBbUMsQ0FBbkMsQ0FBakIsQ0FBUDtBQUNILEU7O0FBNVdDLFEsQ0E2V0ssRyxHQUFNLFVBQUMsT0FBRCxFQUFTLE9BQVQsRUFBbUI7QUFDNUIsU0FBTSxPQUFPLFFBQVEsTUFBckI7QUFBQSxTQUE2QixPQUFPLFFBQVEsTUFBNUM7QUFDQSxTQUFJLFFBQVEsSUFBWixFQUFrQjtBQUNkLGVBQU0sY0FBTjtBQUNIO0FBQ0QsU0FBSSxTQUFTLElBQUksWUFBSixDQUFpQixJQUFqQixDQUFiO0FBQ0EsVUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLElBQXBCLEVBQTBCLEdBQTFCLEVBQStCO0FBQzNCLGdCQUFPLENBQVAsSUFBWSxRQUFRLENBQVIsSUFBYSxRQUFRLENBQVIsQ0FBekI7QUFDSDtBQUNELFlBQU8sTUFBUDtBQUNILEU7O0FBdlhDLFEsQ0F3WEssUSxHQUFXLFVBQUMsT0FBRCxFQUFTLE9BQVQsRUFBbUI7QUFDakMsU0FBSSxTQUFTLElBQUksWUFBSixDQUFpQixFQUFqQixDQUFiO0FBQ0EsVUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEVBQXBCLEVBQXdCLEdBQXhCLEVBQTZCO0FBQ3pCLGdCQUFPLENBQVAsSUFBWSxRQUFRLENBQVIsSUFBYSxRQUFRLENBQVIsQ0FBekI7QUFDSDtBQUNELFlBQU8sTUFBUDtBQUNILEU7O0FBOVhDLFEsQ0ErWEssUSxHQUFXLFVBQUMsT0FBRCxFQUFTLE9BQVQsRUFBbUI7QUFDakMsU0FBSSxTQUFTLElBQUksWUFBSixDQUFpQixFQUFqQixDQUFiOztBQUVBLFlBQU8sQ0FBUCxJQUFZLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFYLEdBQXdCLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFuQyxHQUFnRCxRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBM0QsR0FBd0UsUUFBUSxFQUFSLElBQVksUUFBUSxDQUFSLENBQWhHO0FBQ0EsWUFBTyxDQUFQLElBQVksUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQVgsR0FBd0IsUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQW5DLEdBQWdELFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUEzRCxHQUF3RSxRQUFRLEVBQVIsSUFBWSxRQUFRLENBQVIsQ0FBaEc7QUFDQSxZQUFPLENBQVAsSUFBWSxRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBWCxHQUF3QixRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBbkMsR0FBZ0QsUUFBUSxDQUFSLElBQVcsUUFBUSxFQUFSLENBQTNELEdBQXlFLFFBQVEsRUFBUixJQUFZLFFBQVEsRUFBUixDQUFqRztBQUNBLFlBQU8sRUFBUCxJQUFhLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFYLEdBQXlCLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFwQyxHQUFrRCxRQUFRLENBQVIsSUFBVyxRQUFRLEVBQVIsQ0FBN0QsR0FBMkUsUUFBUSxFQUFSLElBQVksUUFBUSxFQUFSLENBQXBHOztBQUVBLFlBQU8sQ0FBUCxJQUFZLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFYLEdBQXdCLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFuQyxHQUFnRCxRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBM0QsR0FBd0UsUUFBUSxFQUFSLElBQVksUUFBUSxDQUFSLENBQWhHO0FBQ0EsWUFBTyxDQUFQLElBQVksUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQVgsR0FBd0IsUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQW5DLEdBQWdELFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUEzRCxHQUF3RSxRQUFRLEVBQVIsSUFBWSxRQUFRLENBQVIsQ0FBaEc7QUFDQSxZQUFPLENBQVAsSUFBWSxRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBWCxHQUF3QixRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBbkMsR0FBZ0QsUUFBUSxDQUFSLElBQVcsUUFBUSxFQUFSLENBQTNELEdBQXlFLFFBQVEsRUFBUixJQUFZLFFBQVEsRUFBUixDQUFqRztBQUNBLFlBQU8sRUFBUCxJQUFhLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFYLEdBQXlCLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFwQyxHQUFrRCxRQUFRLENBQVIsSUFBVyxRQUFRLEVBQVIsQ0FBN0QsR0FBMkUsUUFBUSxFQUFSLElBQVksUUFBUSxFQUFSLENBQXBHOztBQUVBLFlBQU8sQ0FBUCxJQUFZLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFYLEdBQXdCLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFuQyxHQUFnRCxRQUFRLEVBQVIsSUFBWSxRQUFRLENBQVIsQ0FBNUQsR0FBeUUsUUFBUSxFQUFSLElBQVksUUFBUSxDQUFSLENBQWpHO0FBQ0EsWUFBTyxDQUFQLElBQVksUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQVgsR0FBd0IsUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQW5DLEdBQWdELFFBQVEsRUFBUixJQUFZLFFBQVEsQ0FBUixDQUE1RCxHQUF5RSxRQUFRLEVBQVIsSUFBWSxRQUFRLENBQVIsQ0FBakc7QUFDQSxZQUFPLEVBQVAsSUFBYSxRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBWCxHQUF3QixRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBbkMsR0FBZ0QsUUFBUSxFQUFSLElBQVksUUFBUSxFQUFSLENBQTVELEdBQTBFLFFBQVEsRUFBUixJQUFZLFFBQVEsRUFBUixDQUFuRztBQUNBLFlBQU8sRUFBUCxJQUFhLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFYLEdBQXlCLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFwQyxHQUFrRCxRQUFRLEVBQVIsSUFBWSxRQUFRLEVBQVIsQ0FBOUQsR0FBNEUsUUFBUSxFQUFSLElBQVksUUFBUSxFQUFSLENBQXJHOztBQUVBLFlBQU8sQ0FBUCxJQUFZLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFYLEdBQXdCLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFuQyxHQUFnRCxRQUFRLEVBQVIsSUFBWSxRQUFRLENBQVIsQ0FBNUQsR0FBeUUsUUFBUSxFQUFSLElBQVksUUFBUSxDQUFSLENBQWpHO0FBQ0EsWUFBTyxDQUFQLElBQVksUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQVgsR0FBd0IsUUFBUSxDQUFSLElBQVcsUUFBUSxDQUFSLENBQW5DLEdBQWdELFFBQVEsRUFBUixJQUFZLFFBQVEsQ0FBUixDQUE1RCxHQUF5RSxRQUFRLEVBQVIsSUFBWSxRQUFRLENBQVIsQ0FBakc7QUFDQSxZQUFPLEVBQVAsSUFBYSxRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBWCxHQUF3QixRQUFRLENBQVIsSUFBVyxRQUFRLENBQVIsQ0FBbkMsR0FBZ0QsUUFBUSxFQUFSLElBQVksUUFBUSxFQUFSLENBQTVELEdBQTBFLFFBQVEsRUFBUixJQUFZLFFBQVEsRUFBUixDQUFuRztBQUNBLFlBQU8sRUFBUCxJQUFhLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFYLEdBQXlCLFFBQVEsQ0FBUixJQUFXLFFBQVEsRUFBUixDQUFwQyxHQUFrRCxRQUFRLEVBQVIsSUFBWSxRQUFRLEVBQVIsQ0FBOUQsR0FBNEUsUUFBUSxFQUFSLElBQVksUUFBUSxFQUFSLENBQXJHOztBQUVBLFlBQU8sTUFBUDtBQUNILEU7Ozs7O1VBblpELEksR0FBTyxVQUFDLE1BQUQsRUFBVTtBQUNiLGVBQUssTUFBTCxHQUFjLFVBQVUsUUFBUSxXQUFSLEVBQXhCO0FBQ0E7QUFDSCxNOztVQUNELFEsR0FBVyxVQUFDLE1BQUQsRUFBWTtBQUNyQixlQUFLLE1BQUwsR0FBYyxRQUFRLFFBQVIsQ0FBaUIsTUFBSyxNQUF0QixFQUE4QixNQUE5QixDQUFkO0FBQ0QsTTs7VUFDRCxNLEdBQVMsVUFBQyxLQUFELEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWU7QUFDcEIsZUFBSyxNQUFMLEdBQWMsUUFBUSxRQUFSLENBQWlCLFFBQVEsWUFBUixDQUFxQixLQUFyQixFQUEyQixDQUEzQixFQUE2QixDQUE3QixFQUErQixDQUEvQixDQUFqQixFQUFtRCxNQUFLLE1BQXhELENBQWQ7QUFDQTtBQUNILE07O1VBQ0QsTyxHQUFVLFVBQUMsS0FBRCxFQUFPLE1BQVAsRUFBYyxHQUFkLEVBQW9CO0FBQzFCLGVBQUssU0FBTCxDQUFlLENBQUMsSUFBSSxDQUFwQixFQUFzQixDQUFDLElBQUksQ0FBM0IsRUFBNkIsQ0FBQyxJQUFJLENBQWxDO0FBQ0EsZUFBSyxNQUFMLENBQVksS0FBWixFQUFrQixPQUFPLENBQXpCLEVBQTJCLE9BQU8sQ0FBbEMsRUFBb0MsT0FBTyxDQUEzQztBQUNBLGVBQUssU0FBTCxDQUFlLElBQUksQ0FBbkIsRUFBcUIsSUFBSSxDQUF6QixFQUEyQixJQUFJLENBQS9CO0FBQ0E7QUFDSCxNOztVQUNELFMsR0FBWSxVQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFTO0FBQ2pCLGVBQUssTUFBTCxHQUFjLFFBQVEsUUFBUixDQUFpQixRQUFRLGVBQVIsQ0FBd0IsQ0FBeEIsRUFBMEIsQ0FBMUIsRUFBNEIsQ0FBNUIsQ0FBakIsRUFBZ0QsTUFBSyxNQUFyRCxDQUFkO0FBQ0E7QUFDSCxNOztVQUNELEssR0FBUSxVQUFDLEVBQUQsRUFBSSxFQUFKLEVBQU8sRUFBUCxFQUFZO0FBQ2hCLGVBQUssTUFBTCxHQUFjLFFBQVEsUUFBUixDQUFpQixRQUFRLFdBQVIsQ0FBb0IsRUFBcEIsRUFBdUIsRUFBdkIsRUFBMEIsRUFBMUIsQ0FBakIsRUFBK0MsTUFBSyxNQUFwRCxDQUFkO0FBQ0E7QUFDSCxNOztVQUNELEksR0FBTyxVQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixPQUFuQixFQUE0QixPQUE1QixFQUFxQyxPQUFyQyxFQUE4QyxHQUE5QyxFQUFtRCxHQUFuRCxFQUF3RCxHQUF4RCxFQUErRDtBQUNsRSxlQUFLLE1BQUwsR0FBYyxRQUFRLFFBQVIsQ0FBaUIsUUFBUSxVQUFSLENBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLElBQS9CLEVBQXFDLE9BQXJDLEVBQThDLE9BQTlDLEVBQXVELE9BQXZELEVBQWdFLEdBQWhFLEVBQXFFLEdBQXJFLEVBQTBFLEdBQTFFLENBQWpCLEVBQWdHLE1BQUssTUFBckcsQ0FBZDtBQUNBO0FBQ0gsTTs7VUFDRCxLLEdBQVEsVUFBQyxJQUFELEVBQU8sS0FBUCxFQUFjLE1BQWQsRUFBc0IsR0FBdEIsRUFBMkIsSUFBM0IsRUFBaUMsR0FBakMsRUFBd0M7QUFDNUMsZUFBSyxNQUFMLEdBQWMsUUFBUSxRQUFSLENBQWlCLFFBQVEsV0FBUixDQUFvQixJQUFwQixFQUEwQixLQUExQixFQUFpQyxNQUFqQyxFQUF5QyxHQUF6QyxFQUE4QyxJQUE5QyxFQUFvRCxHQUFwRCxDQUFqQixFQUEwRSxNQUFLLE1BQS9FLENBQWQ7QUFDQTtBQUNILE07O1VBQ0QsVyxHQUFjLFVBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxJQUFkLEVBQW9CLEdBQXBCLEVBQTRCO0FBQ3RDLGVBQUssTUFBTCxHQUFjLFFBQVEsUUFBUixDQUFpQixRQUFRLGlCQUFSLENBQTBCLEdBQTFCLEVBQStCLE1BQS9CLEVBQXVDLElBQXZDLEVBQTZDLEdBQTdDLENBQWpCLEVBQW1FLE1BQUssTUFBeEUsQ0FBZDtBQUNBO0FBQ0gsTTs7VUFDRCxTLEdBQVksWUFBTTtBQUNoQixhQUFJLFVBQUo7QUFBQSxhQUFPLFVBQVA7O0FBRUEsYUFBSSxNQUFLLE1BQVQ7O0FBRUEsYUFBSSxFQUFHLENBQUgsQ0FBSixDQUFZLEVBQUcsQ0FBSCxJQUFRLEVBQUcsQ0FBSCxDQUFSLENBQWdCLEVBQUcsQ0FBSCxJQUFRLENBQVI7QUFDNUIsYUFBSSxFQUFHLENBQUgsQ0FBSixDQUFZLEVBQUcsQ0FBSCxJQUFRLEVBQUcsQ0FBSCxDQUFSLENBQWdCLEVBQUcsQ0FBSCxJQUFRLENBQVI7QUFDNUIsYUFBSSxFQUFHLENBQUgsQ0FBSixDQUFZLEVBQUcsQ0FBSCxJQUFRLEVBQUUsRUFBRixDQUFSLENBQWdCLEVBQUUsRUFBRixJQUFRLENBQVI7QUFDNUIsYUFBSSxFQUFHLENBQUgsQ0FBSixDQUFZLEVBQUcsQ0FBSCxJQUFRLEVBQUcsQ0FBSCxDQUFSLENBQWdCLEVBQUcsQ0FBSCxJQUFRLENBQVI7QUFDNUIsYUFBSSxFQUFHLENBQUgsQ0FBSixDQUFZLEVBQUcsQ0FBSCxJQUFRLEVBQUUsRUFBRixDQUFSLENBQWdCLEVBQUUsRUFBRixJQUFRLENBQVI7QUFDNUIsYUFBSSxFQUFFLEVBQUYsQ0FBSixDQUFZLEVBQUUsRUFBRixJQUFRLEVBQUUsRUFBRixDQUFSLENBQWdCLEVBQUUsRUFBRixJQUFRLENBQVI7O0FBRTVCO0FBQ0QsTTs7VUFDRCxRLEdBQVcsVUFBQyxJQUFELEVBQU8sS0FBUCxFQUFjLE1BQWQsRUFBc0IsR0FBdEIsRUFBMkIsSUFBM0IsRUFBaUMsR0FBakMsRUFBd0M7QUFDL0MsZUFBSyxNQUFMLEdBQWMsUUFBUSxXQUFSLENBQW9CLElBQXBCLEVBQTBCLEtBQTFCLEVBQWlDLE1BQWpDLEVBQXlDLEdBQXpDLEVBQThDLElBQTlDLEVBQW9ELEdBQXBELENBQWQ7QUFDQTtBQUNILE07O1VBQ0QsUyxHQUFZLFVBQUMsS0FBRCxFQUFPLENBQVAsRUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFlO0FBQ3ZCLGVBQUssTUFBTCxHQUFjLFFBQVEsWUFBUixDQUFxQixLQUFyQixFQUEyQixDQUEzQixFQUE2QixDQUE3QixFQUErQixDQUEvQixDQUFkO0FBQ0E7QUFDSCxNOztVQUNELFksR0FBZSxVQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFTO0FBQ3BCLGVBQUssTUFBTCxHQUFjLFFBQVEsZUFBUixDQUF3QixDQUF4QixFQUEwQixDQUExQixFQUE0QixDQUE1QixDQUFkO0FBQ0E7QUFDSCxNOztVQUNELFEsR0FBVyxVQUFDLEVBQUQsRUFBSSxFQUFKLEVBQU8sRUFBUCxFQUFZO0FBQ25CLGVBQUssTUFBTCxHQUFjLFFBQVEsV0FBUixDQUFvQixFQUFwQixFQUF1QixFQUF2QixFQUEwQixFQUExQixDQUFkO0FBQ0E7QUFDSCxNOztVQUNELE8sR0FBVSxVQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixPQUFuQixFQUE0QixPQUE1QixFQUFxQyxPQUFyQyxFQUE4QyxHQUE5QyxFQUFtRCxHQUFuRCxFQUF3RCxHQUF4RCxFQUE4RDtBQUNwRSxlQUFLLE1BQUwsR0FBYyxRQUFRLFVBQVIsQ0FBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0IsSUFBL0IsRUFBcUMsT0FBckMsRUFBOEMsT0FBOUMsRUFBdUQsT0FBdkQsRUFBZ0UsR0FBaEUsRUFBcUUsR0FBckUsRUFBMEUsR0FBMUUsQ0FBZDtBQUNBO0FBQ0gsTTs7VUFFRCxjLEdBQWlCLFVBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxJQUFkLEVBQW9CLEdBQXBCLEVBQTRCO0FBQ3pDLGVBQUssTUFBTCxHQUFjLFFBQVEsaUJBQVIsQ0FBMEIsR0FBMUIsRUFBK0IsTUFBL0IsRUFBdUMsSUFBdkMsRUFBNkMsR0FBN0MsQ0FBZDtBQUNBO0FBQ0gsTTs7VUFDRCxZLEdBQWUsVUFBQyxNQUFELEVBQVk7QUFDekIsYUFBTSxnQkFBZ0IsUUFBUSxTQUFSLENBQWtCLE1BQWxCLENBQXRCO0FBQ0EsYUFBSSxhQUFKLEVBQW1CO0FBQ2pCLG1CQUFLLE1BQUwsR0FBYyxhQUFkO0FBQ0Q7QUFDRDtBQUNELE07OztBQW1VTCxRQUFPLE9BQVAsR0FBaUIsT0FBakIsQzs7Ozs7Ozs7Ozs7QUN6WkE7Ozs7QUFDQTs7OztBQUVBOztBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUFFQSxLQUFNLG1uQkFBTjs7QUFtQkEsS0FBTSx3SUFBTjs7S0FRTSxXOzs7Ozs7Ozs7Ozs7OzswTUFtREosaUIsR0FBb0IsVUFBQyxFQUFELEVBQVE7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQU0sVUFBVSxJQUFJLFlBQUosQ0FBaUIsQ0FDL0IsR0FEK0IsRUFDMUIsR0FEMEIsRUFDckIsR0FEcUIsRUFDaEIsQ0FBQyxHQURlLEVBQ1YsR0FEVSxFQUNMLEdBREssRUFDQSxDQUFDLEdBREQsRUFDTSxDQUFDLEdBRFAsRUFDWSxHQURaLEVBQ2lCLEdBRGpCLEVBQ3NCLENBQUMsR0FEdkIsRUFDNEIsR0FENUIsRUFDa0M7QUFDakUsVUFGK0IsRUFFMUIsR0FGMEIsRUFFckIsR0FGcUIsRUFFaEIsR0FGZ0IsRUFFWCxDQUFDLEdBRlUsRUFFTCxHQUZLLEVBRUEsR0FGQSxFQUVLLENBQUMsR0FGTixFQUVXLENBQUMsR0FGWixFQUVpQixHQUZqQixFQUVzQixHQUZ0QixFQUUyQixDQUFDLEdBRjVCLEVBRWtDO0FBQ2pFLFVBSCtCLEVBRzFCLEdBSDBCLEVBR3JCLEdBSHFCLEVBR2hCLEdBSGdCLEVBR1gsR0FIVyxFQUdOLENBQUMsR0FISyxFQUdBLENBQUMsR0FIRCxFQUdNLEdBSE4sRUFHVyxDQUFDLEdBSFosRUFHaUIsQ0FBQyxHQUhsQixFQUd1QixHQUh2QixFQUc0QixHQUg1QixFQUdrQztBQUNqRSxRQUFDLEdBSjhCLEVBSXpCLEdBSnlCLEVBSXBCLEdBSm9CLEVBSWYsQ0FBQyxHQUpjLEVBSVQsR0FKUyxFQUlKLENBQUMsR0FKRyxFQUlFLENBQUMsR0FKSCxFQUlRLENBQUMsR0FKVCxFQUljLENBQUMsR0FKZixFQUlvQixDQUFDLEdBSnJCLEVBSTBCLENBQUMsR0FKM0IsRUFJZ0MsR0FKaEMsRUFJc0M7QUFDckUsUUFBQyxHQUw4QixFQUt6QixDQUFDLEdBTHdCLEVBS25CLENBQUMsR0FMa0IsRUFLYixHQUxhLEVBS1IsQ0FBQyxHQUxPLEVBS0YsQ0FBQyxHQUxDLEVBS0ksR0FMSixFQUtTLENBQUMsR0FMVixFQUtlLEdBTGYsRUFLb0IsQ0FBQyxHQUxyQixFQUswQixDQUFDLEdBTDNCLEVBS2dDLEdBTGhDLEVBS3NDO0FBQ3JFLFVBTitCLEVBTTFCLENBQUMsR0FOeUIsRUFNcEIsQ0FBQyxHQU5tQixFQU1kLENBQUMsR0FOYSxFQU1SLENBQUMsR0FOTyxFQU1GLENBQUMsR0FOQyxFQU1JLENBQUMsR0FOTCxFQU1VLEdBTlYsRUFNZSxDQUFDLEdBTmhCLEVBTXFCLEdBTnJCLEVBTTBCLEdBTjFCLEVBTStCLENBQUMsR0FOaEMsQ0FBakIsQ0FBaEI7O0FBU0EsV0FBTSxTQUFTLElBQUksWUFBSixDQUFpQixDQUFNO0FBQ3BDLFFBRDhCLEVBQzNCLENBRDJCLEVBQ3hCLENBRHdCLEVBQ3JCLENBRHFCLEVBQ2xCLENBRGtCLEVBQ2YsQ0FEZSxFQUNaLENBRFksRUFDVCxDQURTLEVBQ04sQ0FETSxFQUNILENBREcsRUFDQSxDQURBLEVBQ0csQ0FESCxFQUNVO0FBQ3hDLFFBRjhCLEVBRTNCLENBRjJCLEVBRXhCLENBRndCLEVBRXJCLENBRnFCLEVBRWxCLENBRmtCLEVBRWYsQ0FGZSxFQUVaLENBRlksRUFFVCxDQUZTLEVBRU4sQ0FGTSxFQUVILENBRkcsRUFFQSxDQUZBLEVBRUcsQ0FGSCxFQUVVO0FBQ3hDLFFBSDhCLEVBRzNCLENBSDJCLEVBR3hCLENBSHdCLEVBR3JCLENBSHFCLEVBR2xCLENBSGtCLEVBR2YsQ0FIZSxFQUdaLENBSFksRUFHVCxDQUhTLEVBR04sQ0FITSxFQUdILENBSEcsRUFHQSxDQUhBLEVBR0csQ0FISCxFQUdVO0FBQ3hDLFFBSjhCLEVBSTNCLENBSjJCLEVBSXhCLENBSndCLEVBSXJCLENBSnFCLEVBSWxCLENBSmtCLEVBSWYsQ0FKZSxFQUlaLENBSlksRUFJVCxDQUpTLEVBSU4sQ0FKTSxFQUlILENBSkcsRUFJQSxDQUpBLEVBSUcsQ0FKSCxFQUlVO0FBQ3hDLFFBTDhCLEVBSzNCLENBTDJCLEVBS3hCLENBTHdCLEVBS3JCLENBTHFCLEVBS2xCLENBTGtCLEVBS2YsQ0FMZSxFQUtaLENBTFksRUFLVCxDQUxTLEVBS04sQ0FMTSxFQUtILENBTEcsRUFLQSxDQUxBLEVBS0csQ0FMSCxFQUtVO0FBQ3hDLFFBTjhCLEVBTTNCLENBTjJCLEVBTXhCLENBTndCLEVBTXJCLENBTnFCLEVBTWxCLENBTmtCLEVBTWYsQ0FOZSxFQU1aLENBTlksRUFNVCxDQU5TLEVBTU4sQ0FOTSxFQU1ILENBTkcsRUFNQSxDQU5BLEVBTUcsQ0FOSCxDQUFqQixDQUFmOztBQVNBLFdBQU0sVUFBVSxJQUFJLFlBQUosQ0FBaUIsQ0FBSztBQUNwQyxVQUQrQixFQUMxQixHQUQwQixFQUNyQixHQURxQixFQUNoQixHQURnQixFQUNYLEdBRFcsRUFDTixHQURNLEVBQ0QsR0FEQyxFQUNJLEdBREosRUFDUyxHQURULEVBQ2MsR0FEZCxFQUNtQixHQURuQixFQUN3QixHQUR4QixFQUM4QjtBQUM3RCxVQUYrQixFQUUxQixHQUYwQixFQUVyQixHQUZxQixFQUVoQixHQUZnQixFQUVYLEdBRlcsRUFFTixHQUZNLEVBRUQsR0FGQyxFQUVJLEdBRkosRUFFUyxHQUZULEVBRWMsR0FGZCxFQUVtQixHQUZuQixFQUV3QixHQUZ4QixFQUU4QjtBQUM3RCxVQUgrQixFQUcxQixHQUgwQixFQUdyQixHQUhxQixFQUdoQixHQUhnQixFQUdYLEdBSFcsRUFHTixHQUhNLEVBR0QsR0FIQyxFQUdJLEdBSEosRUFHUyxHQUhULEVBR2MsR0FIZCxFQUdtQixHQUhuQixFQUd3QixHQUh4QixFQUc4QjtBQUM3RCxRQUFDLEdBSjhCLEVBSXpCLEdBSnlCLEVBSXBCLEdBSm9CLEVBSWYsQ0FBQyxHQUpjLEVBSVQsR0FKUyxFQUlKLEdBSkksRUFJQyxDQUFDLEdBSkYsRUFJTyxHQUpQLEVBSVksR0FKWixFQUlpQixDQUFDLEdBSmxCLEVBSXVCLEdBSnZCLEVBSTRCLEdBSjVCLEVBSWtDO0FBQ2pFLFVBTCtCLEVBSzFCLENBQUMsR0FMeUIsRUFLcEIsR0FMb0IsRUFLZixHQUxlLEVBS1YsQ0FBQyxHQUxTLEVBS0osR0FMSSxFQUtDLEdBTEQsRUFLTSxDQUFDLEdBTFAsRUFLWSxHQUxaLEVBS2lCLEdBTGpCLEVBS3NCLENBQUMsR0FMdkIsRUFLNEIsR0FMNUIsRUFLa0M7QUFDakUsVUFOK0IsRUFNMUIsR0FOMEIsRUFNckIsQ0FBQyxHQU5vQixFQU1mLEdBTmUsRUFNVixHQU5VLEVBTUwsQ0FBQyxHQU5JLEVBTUMsR0FORCxFQU1NLEdBTk4sRUFNVyxDQUFDLEdBTlosRUFNaUIsR0FOakIsRUFNc0IsR0FOdEIsRUFNMkIsQ0FBQyxHQU41QixDQUFqQixDQUFoQjs7QUFTQztBQUNELFdBQU0sVUFBVSxJQUFJLFVBQUosQ0FBZSxDQUM3QixDQUQ2QixFQUMxQixDQUQwQixFQUN2QixDQUR1QixFQUNwQixDQURvQixFQUNqQixDQURpQixFQUNkLENBRGMsRUFDUjtBQUNyQixRQUY2QixFQUUxQixDQUYwQixFQUV2QixDQUZ1QixFQUVwQixDQUZvQixFQUVqQixDQUZpQixFQUVkLENBRmMsRUFFUjtBQUNyQixRQUg2QixFQUcxQixDQUgwQixFQUd2QixFQUh1QixFQUduQixDQUhtQixFQUdoQixFQUhnQixFQUdaLEVBSFksRUFHTDtBQUN4QixTQUo2QixFQUl6QixFQUp5QixFQUlyQixFQUpxQixFQUlqQixFQUppQixFQUliLEVBSmEsRUFJVCxFQUpTLEVBSUY7QUFDM0IsU0FMNkIsRUFLekIsRUFMeUIsRUFLckIsRUFMcUIsRUFLakIsRUFMaUIsRUFLYixFQUxhLEVBS1QsRUFMUyxFQUtGO0FBQzNCLFNBTjZCLEVBTXpCLEVBTnlCLEVBTXJCLEVBTnFCLEVBTWpCLEVBTmlCLEVBTWIsRUFOYSxFQU1ULEVBTlMsQ0FBZixDQUFoQjs7QUFTQTtBQUNBLFdBQU0sY0FBYyxHQUFHLFlBQUgsRUFBcEI7QUFDQSxXQUFJLENBQUMsV0FBTCxFQUFrQjtBQUNoQixnQkFBTyxDQUFDLENBQVI7QUFDRDs7QUFFRDtBQUNBLFdBQUksQ0FBQyxNQUFLLGVBQUwsQ0FBcUIsRUFBckIsRUFBeUIsT0FBekIsRUFBa0MsQ0FBbEMsRUFBcUMsR0FBRyxLQUF4QyxFQUErQyxZQUEvQyxDQUFMLEVBQW1FO0FBQ2pFLGdCQUFPLENBQUMsQ0FBUjtBQUNEO0FBQ0QsV0FBSSxDQUFDLE1BQUssZUFBTCxDQUFxQixFQUFyQixFQUF5QixNQUF6QixFQUFpQyxDQUFqQyxFQUFvQyxHQUFHLEtBQXZDLEVBQThDLFNBQTlDLENBQUwsRUFBK0Q7QUFDN0QsZ0JBQU8sQ0FBQyxDQUFSO0FBQ0Q7QUFDRCxXQUFJLENBQUMsTUFBSyxlQUFMLENBQXFCLEVBQXJCLEVBQXlCLE9BQXpCLEVBQWtDLENBQWxDLEVBQXFDLEdBQUcsS0FBeEMsRUFBK0MsVUFBL0MsQ0FBTCxFQUFpRTtBQUMvRCxnQkFBTyxDQUFDLENBQVI7QUFDRDs7QUFFRDtBQUNBLFVBQUcsVUFBSCxDQUFjLEdBQUcsb0JBQWpCLEVBQXVDLFdBQXZDO0FBQ0EsVUFBRyxVQUFILENBQWMsR0FBRyxvQkFBakIsRUFBdUMsT0FBdkMsRUFBZ0QsR0FBRyxXQUFuRDs7QUFFQSxjQUFPLFFBQVEsTUFBZjtBQUNELE0sUUFDRCxlLEdBQWdCLFVBQUMsRUFBRCxFQUFLLElBQUwsRUFBVyxHQUFYLEVBQWdCLElBQWhCLEVBQXNCLFNBQXRCLEVBQW9DO0FBQ2xELFdBQU0sU0FBUyxHQUFHLFlBQUgsRUFBZixDQUFtQztBQUNuQyxXQUFJLENBQUMsTUFBTCxFQUFhO0FBQ1gsaUJBQVEsR0FBUixDQUFZLG9DQUFaO0FBQ0EsZ0JBQU8sS0FBUDtBQUNEO0FBQ0Q7QUFDQSxVQUFHLFVBQUgsQ0FBYyxHQUFHLFlBQWpCLEVBQStCLE1BQS9CO0FBQ0EsVUFBRyxVQUFILENBQWMsR0FBRyxZQUFqQixFQUErQixJQUEvQixFQUFxQyxHQUFHLFdBQXhDO0FBQ0E7QUFDQSxXQUFNLGFBQWEsR0FBRyxpQkFBSCxDQUFxQixHQUFHLE9BQXhCLEVBQWlDLFNBQWpDLENBQW5CO0FBQ0EsV0FBSSxhQUFhLENBQWpCLEVBQW9CO0FBQ2xCLGlCQUFRLEdBQVIsNENBQXFELFNBQXJEO0FBQ0EsZ0JBQU8sS0FBUDtBQUNEO0FBQ0QsVUFBRyxtQkFBSCxDQUF1QixVQUF2QixFQUFtQyxHQUFuQyxFQUF3QyxJQUF4QyxFQUE4QyxLQUE5QyxFQUFxRCxDQUFyRCxFQUF3RCxDQUF4RDtBQUNBO0FBQ0EsVUFBRyx1QkFBSCxDQUEyQixVQUEzQjs7QUFFQSxjQUFPLElBQVA7QUFDRCxNOzs7Ozt5Q0EzSW1CO0FBQ2xCLFdBQUk7QUFDRixhQUFNLFNBQVMsbUJBQVMsV0FBVCxDQUFxQixLQUFLLElBQUwsQ0FBVSxNQUEvQixDQUFmO0FBQ0EsZ0JBQU8sS0FBUCxHQUFlLEdBQWY7QUFDQSxnQkFBTyxNQUFQLEdBQWdCLEdBQWhCOztBQUVBLGFBQU0sS0FBSyxPQUFPLFVBQVAsQ0FBa0IsT0FBbEIsQ0FBWDs7QUFFQSxhQUFJLENBQUMsNkJBQVksRUFBWixFQUFnQixjQUFoQixFQUFnQyxjQUFoQyxDQUFMLEVBQXNEO0FBQ3BELG1CQUFRLEdBQVIsQ0FBWSx1QkFBWjtBQUNBO0FBQ0Q7O0FBRUQsYUFBTSxJQUFJLEtBQUssaUJBQUwsQ0FBdUIsRUFBdkIsQ0FBVjtBQUNBLGFBQUksSUFBSSxDQUFSLEVBQVc7QUFDVCxtQkFBUSxHQUFSLENBQVksc0NBQVo7QUFDQTtBQUNEOztBQUVELFlBQUcsVUFBSCxDQUFjLEdBQWQsRUFBbUIsR0FBbkIsRUFBd0IsR0FBeEIsRUFBNkIsR0FBN0I7QUFDQSxZQUFHLE1BQUgsQ0FBVSxHQUFHLFVBQWI7O0FBRUEsYUFBTSxhQUFhLEdBQUcsa0JBQUgsQ0FBc0IsR0FBRyxPQUF6QixFQUFrQyxhQUFsQyxDQUFuQjtBQUNBLGFBQU0sY0FBYyxHQUFHLGtCQUFILENBQXNCLEdBQUcsT0FBekIsRUFBa0MsY0FBbEMsQ0FBcEI7QUFDQSxhQUFNLGtCQUFrQixHQUFHLGtCQUFILENBQXNCLEdBQUcsT0FBekIsRUFBa0Msa0JBQWxDLENBQXhCO0FBQ0EsYUFBTSxnQkFBZ0IsR0FBRyxrQkFBSCxDQUFzQixHQUFHLE9BQXpCLEVBQWtDLGdCQUFsQyxDQUF0QjtBQUNBLGFBQUksQ0FBQyxVQUFELElBQWUsQ0FBQyxXQUFoQixJQUErQixDQUFDLGVBQWhDLElBQW1ELENBQUMsYUFBeEQsRUFBdUU7QUFDckUsbUJBQVEsR0FBUixDQUFZLG9DQUFaO0FBQ0E7QUFDRDtBQUNEO0FBQ0EsWUFBRyxTQUFILENBQWEsV0FBYixFQUEwQixHQUExQixFQUErQixHQUEvQixFQUFvQyxHQUFwQztBQUNBO0FBQ0EsYUFBTSxpQkFBaUIsb0JBQVksQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsQ0FBWixDQUF2QjtBQUNBLHdCQUFlLFNBQWY7QUFDQSxZQUFHLFVBQUgsQ0FBYyxlQUFkLEVBQStCLGVBQWUsUUFBOUM7QUFDQTtBQUNBLFlBQUcsU0FBSCxDQUFhLGFBQWIsRUFBNEIsR0FBNUIsRUFBaUMsR0FBakMsRUFBc0MsR0FBdEM7QUFDQSxhQUFNLFlBQVksc0JBQWxCO0FBQ0EsbUJBQVUsT0FBVixDQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixDQUEzQixFQUE4QixDQUE5QixFQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1QyxDQUF2QyxFQUEwQyxDQUExQyxFQUNXLFdBRFgsQ0FDdUIsRUFEdkIsRUFDMkIsT0FBTyxLQUFQLEdBQWUsT0FBTyxNQURqRCxFQUN5RCxDQUR6RCxFQUM0RCxHQUQ1RDtBQUVBLFlBQUcsZ0JBQUgsQ0FBb0IsVUFBcEIsRUFBZ0MsS0FBaEMsRUFBdUMsVUFBVSxNQUFqRDs7QUFFQSxZQUFHLEtBQUgsQ0FBUyxHQUFHLGdCQUFILEdBQXNCLEdBQUcsZ0JBQWxDOztBQUVBLFlBQUcsWUFBSCxDQUFnQixHQUFHLFNBQW5CLEVBQThCLENBQTlCLEVBQWlDLEdBQUcsYUFBcEMsRUFBbUQsQ0FBbkQ7QUFDRCxRQTdDRCxDQTZDRSxPQUFPLENBQVAsRUFBVTtBQUNWLGlCQUFRLEdBQVIsQ0FBWSxDQUFaO0FBQ0Q7QUFDRjs7OzhCQTJGUTtBQUNQLGNBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQWE7QUFBYixVQURGO0FBRUU7QUFBQTtBQUFBLGFBQVEsS0FBSSxRQUFaO0FBQ0c7QUFESDtBQUZGLFFBREY7QUFRRDs7OztHQXRKdUIsZ0JBQU0sUzs7QUF3SmhDLFFBQU8sT0FBUCxHQUFpQixXQUFqQixDOzs7Ozs7Ozs7Ozs7Ozs7O0FDM0xBOzs7Ozs7OztLQUVhLE8sV0FBQSxPLEdBQ1QsaUJBQVksR0FBWixFQUFpQjtBQUFBOztBQUFBOztBQUNiLE9BQUksSUFBSSxJQUFJLFlBQUosQ0FBaUIsQ0FBakIsQ0FBUjtBQUNBLE9BQUksT0FBTyxpQkFBRSxPQUFGLENBQVUsR0FBVixDQUFYLEVBQTJCO0FBQ3pCLE9BQUUsQ0FBRixJQUFPLElBQUksQ0FBSixDQUFQO0FBQ0EsT0FBRSxDQUFGLElBQU8sSUFBSSxDQUFKLENBQVA7QUFDQSxPQUFFLENBQUYsSUFBTyxJQUFJLENBQUosQ0FBUDtBQUNEO0FBQ0QsUUFBSyxRQUFMLEdBQWdCLENBQWhCO0FBQ0gsRTs7Ozs7UUFDRCxTLEdBQVksWUFBTTtBQUNoQixTQUFJLElBQUksTUFBSyxRQUFiO0FBQ0EsU0FBSSxJQUFJLEVBQUUsQ0FBRixDQUFSO0FBQUEsU0FBYyxJQUFJLEVBQUUsQ0FBRixDQUFsQjtBQUFBLFNBQXdCLElBQUksRUFBRSxDQUFGLENBQTVCO0FBQUEsU0FBa0MsSUFBSSxLQUFLLElBQUwsQ0FBVSxJQUFFLENBQUYsR0FBSSxJQUFFLENBQU4sR0FBUSxJQUFFLENBQXBCLENBQXRDO0FBQ0EsU0FBRyxDQUFILEVBQUs7QUFDSCxXQUFHLEtBQUssQ0FBUixFQUNJO0FBQ0osTUFIRixNQUdRO0FBQ0wsU0FBRSxDQUFGLElBQU8sQ0FBUCxDQUFVLEVBQUUsQ0FBRixJQUFPLENBQVAsQ0FBVSxFQUFFLENBQUYsSUFBTyxDQUFQO0FBQ3BCO0FBQ0Q7QUFDRCxTQUFJLElBQUUsQ0FBTjtBQUNBLE9BQUUsQ0FBRixJQUFPLElBQUUsQ0FBVCxDQUFZLEVBQUUsQ0FBRixJQUFPLElBQUUsQ0FBVCxDQUFZLEVBQUUsQ0FBRixJQUFPLElBQUUsQ0FBVDtBQUN4QjtBQUNGLEk7OztLQUdRLE8sV0FBQSxPLEdBQ1gsaUJBQVksR0FBWixFQUFpQjtBQUFBOztBQUNmLE9BQUksSUFBSSxJQUFJLFlBQUosQ0FBaUIsQ0FBakIsQ0FBUjtBQUNBLE9BQUksV0FBVyxRQUFPLE9BQVAseUNBQU8sT0FBUCxPQUFtQixRQUFsQyxFQUE0QztBQUMxQyxPQUFFLENBQUYsSUFBTyxJQUFJLENBQUosQ0FBUDtBQUNBLE9BQUUsQ0FBRixJQUFPLElBQUksQ0FBSixDQUFQO0FBQ0EsT0FBRSxDQUFGLElBQU8sSUFBSSxDQUFKLENBQVA7QUFDQSxPQUFFLENBQUYsSUFBTyxJQUFJLENBQUosQ0FBUDtBQUNEO0FBQ0QsUUFBSyxRQUFMLEdBQWdCLENBQWhCO0FBQ0QsRSIsImZpbGUiOiJqcy8xNi0wYzE3NzA0MGM0NWQyNWI5MTdiMy5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlIGEgcHJvZ3JhbSBvYmplY3QgYW5kIG1ha2UgY3VycmVudFxuICogQHBhcmFtIGdsIEdMIGNvbnRleHRcbiAqIEBwYXJhbSB2c2hhZGVyIGEgdmVydGV4IHNoYWRlciBwcm9ncmFtIChzdHJpbmcpXG4gKiBAcGFyYW0gZnNoYWRlciBhIGZyYWdtZW50IHNoYWRlciBwcm9ncmFtIChzdHJpbmcpXG4gKiBAcmV0dXJuIHRydWUsIGlmIHRoZSBwcm9ncmFtIG9iamVjdCB3YXMgY3JlYXRlZCBhbmQgc3VjY2Vzc2Z1bGx5IG1hZGUgY3VycmVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdFNoYWRlcnMoZ2wsIHZzaGFkZXIsIGZzaGFkZXIpIHtcbiAgdmFyIHByb2dyYW0gPSBjcmVhdGVQcm9ncmFtKGdsLCB2c2hhZGVyLCBmc2hhZGVyKTtcbiAgaWYgKCFwcm9ncmFtKSB7XG4gICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBjcmVhdGUgcHJvZ3JhbScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XG4gIGdsLnByb2dyYW0gPSBwcm9ncmFtO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIENyZWF0ZSB0aGUgbGlua2VkIHByb2dyYW0gb2JqZWN0XG4gKiBAcGFyYW0gZ2wgR0wgY29udGV4dFxuICogQHBhcmFtIHZzaGFkZXIgYSB2ZXJ0ZXggc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEBwYXJhbSBmc2hhZGVyIGEgZnJhZ21lbnQgc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEByZXR1cm4gY3JlYXRlZCBwcm9ncmFtIG9iamVjdCwgb3IgbnVsbCBpZiB0aGUgY3JlYXRpb24gaGFzIGZhaWxlZFxuICovXG5mdW5jdGlvbiBjcmVhdGVQcm9ncmFtKGdsLCB2c2hhZGVyLCBmc2hhZGVyKSB7XG4gIC8vIENyZWF0ZSBzaGFkZXIgb2JqZWN0XG4gIHZhciB2ZXJ0ZXhTaGFkZXIgPSBsb2FkU2hhZGVyKGdsLCBnbC5WRVJURVhfU0hBREVSLCB2c2hhZGVyKTtcbiAgdmFyIGZyYWdtZW50U2hhZGVyID0gbG9hZFNoYWRlcihnbCwgZ2wuRlJBR01FTlRfU0hBREVSLCBmc2hhZGVyKTtcbiAgaWYgKCF2ZXJ0ZXhTaGFkZXIgfHwgIWZyYWdtZW50U2hhZGVyKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBDcmVhdGUgYSBwcm9ncmFtIG9iamVjdFxuICB2YXIgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcbiAgaWYgKCFwcm9ncmFtKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBBdHRhY2ggdGhlIHNoYWRlciBvYmplY3RzXG4gIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpO1xuICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xuXG4gIC8vIExpbmsgdGhlIHByb2dyYW0gb2JqZWN0XG4gIGdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xuXG4gIC8vIENoZWNrIHRoZSByZXN1bHQgb2YgbGlua2luZ1xuICB2YXIgbGlua2VkID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5MSU5LX1NUQVRVUyk7XG4gIGlmICghbGlua2VkKSB7XG4gICAgdmFyIGVycm9yID0gZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSk7XG4gICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBsaW5rIHByb2dyYW06ICcgKyBlcnJvcik7XG4gICAgZ2wuZGVsZXRlUHJvZ3JhbShwcm9ncmFtKTtcbiAgICBnbC5kZWxldGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpO1xuICAgIGdsLmRlbGV0ZVNoYWRlcih2ZXJ0ZXhTaGFkZXIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBwcm9ncmFtO1xufVxuXG5cbi8qKlxuICogQ3JlYXRlIGEgc2hhZGVyIG9iamVjdFxuICogQHBhcmFtIGdsIEdMIGNvbnRleHRcbiAqIEBwYXJhbSB0eXBlIHRoZSB0eXBlIG9mIHRoZSBzaGFkZXIgb2JqZWN0IHRvIGJlIGNyZWF0ZWRcbiAqIEBwYXJhbSBzb3VyY2Ugc2hhZGVyIHByb2dyYW0gKHN0cmluZylcbiAqIEByZXR1cm4gY3JlYXRlZCBzaGFkZXIgb2JqZWN0LCBvciBudWxsIGlmIHRoZSBjcmVhdGlvbiBoYXMgZmFpbGVkLlxuICovXG5mdW5jdGlvbiBsb2FkU2hhZGVyKGdsLCB0eXBlLCBzb3VyY2UpIHtcbiAgLy8gQ3JlYXRlIHNoYWRlciBvYmplY3RcbiAgdmFyIHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcbiAgaWYgKHNoYWRlciA9PSBudWxsKSB7XG4gICAgY29uc29sZS5sb2coJ3VuYWJsZSB0byBjcmVhdGUgc2hhZGVyJyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBTZXQgdGhlIHNoYWRlciBwcm9ncmFtXG4gIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XG5cbiAgLy8gQ29tcGlsZSB0aGUgc2hhZGVyXG4gIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcblxuICAvLyBDaGVjayB0aGUgcmVzdWx0IG9mIGNvbXBpbGF0aW9uXG4gIHZhciBjb21waWxlZCA9IGdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKTtcbiAgaWYgKCFjb21waWxlZCkge1xuICAgIHZhciBlcnJvciA9IGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKTtcbiAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGNvbXBpbGUgc2hhZGVyOiAnICsgZXJyb3IpO1xuICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHNoYWRlcjtcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xpYi93ZWJnbC91dGlscy5qc1xuICoqLyIsImNsYXNzIE1hdHJpeDQge1xuICAgIGNvbnN0cnVjdG9yKG1hdHJpeCkge1xuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdHJpeCB8fCBNYXRyaXg0LnVuaXRNYXRyaXg0KClcbiAgICB9XG4gICAgaW5pdCA9IChtYXRyaXgpPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0cml4IHx8IE1hdHJpeDQudW5pdE1hdHJpeDQoKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBtdWx0aXBseSA9IChtYXRyaXgpID0+IHtcbiAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseSh0aGlzLm1hdHJpeCwgbWF0cml4KVxuICAgIH1cbiAgICByb3RhdGUgPSAoYW5nZWwseCx5LHopPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseShNYXRyaXg0LnJvdGF0ZU1hdHJpeChhbmdlbCx4LHkseiksdGhpcy5tYXRyaXgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHJvdGF0ZTQgPSAoYW5nZWwsdmVjdG9yLGRvdCk9PntcbiAgICAgICAgdGhpcy50cmFuc2xhdGUoLWRvdC54LC1kb3QueSwtZG90LnopXG4gICAgICAgIHRoaXMucm90YXRlKGFuZ2VsLHZlY3Rvci54LHZlY3Rvci55LHZlY3Rvci56KVxuICAgICAgICB0aGlzLnRyYW5zbGF0ZShkb3QueCxkb3QueSxkb3QueilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgdHJhbnNsYXRlID0gKHgseSx6KT0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQubXVsdGlwbHkoTWF0cml4NC50cmFuc2xhdGVNYXRyaXgoeCx5LHopLHRoaXMubWF0cml4KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBzY2FsZSA9IChTeCxTeSxTeik9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0Lm11bHRpcGx5KE1hdHJpeDQuc2NhbGVNYXRyaXgoU3gsU3ksU3opLHRoaXMubWF0cml4KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICB2aWV3ID0gKGV5ZVgsIGV5ZVksIGV5ZVosIGNlbnRlclgsIGNlbnRlclksIGNlbnRlclosIHVwWCwgdXBZLCB1cFopID0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQubXVsdGlwbHkoTWF0cml4NC52aWV3TWF0cml4KGV5ZVgsIGV5ZVksIGV5ZVosIGNlbnRlclgsIGNlbnRlclksIGNlbnRlclosIHVwWCwgdXBZLCB1cFopLHRoaXMubWF0cml4KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBvcnRobyA9IChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhcikgPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5tdWx0aXBseShNYXRyaXg0Lm9ydGhvTWF0cml4KGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSx0aGlzLm1hdHJpeClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgcGVyc3BlY3RpdmUgPSAoZm92LCBhc3BlY3QsIG5lYXIsIGZhcikgPT4ge1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQubXVsdGlwbHkoTWF0cml4NC5wZXJzcGVjdGl2ZU1hdHJpeChmb3YsIGFzcGVjdCwgbmVhciwgZmFyKSx0aGlzLm1hdHJpeClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgdHJhbnNwb3NlID0gKCkgPT4ge1xuICAgICAgbGV0IGUsIHRcblxuICAgICAgZSA9IHRoaXMubWF0cml4XG5cbiAgICAgIHQgPSBlWyAxXTsgIGVbIDFdID0gZVsgNF07ICBlWyA0XSA9IHQ7XG4gICAgICB0ID0gZVsgMl07ICBlWyAyXSA9IGVbIDhdOyAgZVsgOF0gPSB0O1xuICAgICAgdCA9IGVbIDNdOyAgZVsgM10gPSBlWzEyXTsgIGVbMTJdID0gdDtcbiAgICAgIHQgPSBlWyA2XTsgIGVbIDZdID0gZVsgOV07ICBlWyA5XSA9IHQ7XG4gICAgICB0ID0gZVsgN107ICBlWyA3XSA9IGVbMTNdOyAgZVsxM10gPSB0O1xuICAgICAgdCA9IGVbMTFdOyAgZVsxMV0gPSBlWzE0XTsgIGVbMTRdID0gdDtcblxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgc2V0T3J0aG8gPSAobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpID0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQub3J0aG9NYXRyaXgobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzZXRSb3RhdGUgPSAoYW5nZWwseCx5LHopPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5yb3RhdGVNYXRyaXgoYW5nZWwseCx5LHopXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHNldFRyYW5zbGF0ZSA9ICh4LHkseik9PntcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0LnRyYW5zbGF0ZU1hdHJpeCh4LHkseilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgc2V0U2NhbGUgPSAoU3gsU3ksU3opPT57XG4gICAgICAgIHRoaXMubWF0cml4ID0gTWF0cml4NC5zY2FsZU1hdHJpeChTeCxTeSxTeilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgc2V0VmlldyA9IChleWVYLCBleWVZLCBleWVaLCBjZW50ZXJYLCBjZW50ZXJZLCBjZW50ZXJaLCB1cFgsIHVwWSwgdXBaKT0+e1xuICAgICAgICB0aGlzLm1hdHJpeCA9IE1hdHJpeDQudmlld01hdHJpeChleWVYLCBleWVZLCBleWVaLCBjZW50ZXJYLCBjZW50ZXJZLCBjZW50ZXJaLCB1cFgsIHVwWSwgdXBaKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHNldFBlcnNwZWN0aXZlID0gKGZvdiwgYXNwZWN0LCBuZWFyLCBmYXIpID0+IHtcbiAgICAgICAgdGhpcy5tYXRyaXggPSBNYXRyaXg0LnBlcnNwZWN0aXZlTWF0cml4KGZvdiwgYXNwZWN0LCBuZWFyLCBmYXIpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIHNldEludmVyc2VPZiA9IChtYXRyaXgpID0+IHtcbiAgICAgIGNvbnN0IGludmVyc2VNYXRyaXggPSBNYXRyaXg0LmludmVyc2VPZihtYXRyaXgpXG4gICAgICBpZiAoaW52ZXJzZU1hdHJpeCkge1xuICAgICAgICB0aGlzLm1hdHJpeCA9IGludmVyc2VNYXRyaXhcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIC8qKlxuICAgICAqIOaxguS4gOS4quefqemYteeahOmAhuefqemYtVxuICAgICAqIEBwYXJhbSAge01hdHJpeDR9IG1hdHJpeCDnn6npmLVcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXl9ICAg55+p6Zi15pWw57uEXG4gICAgICovXG4gICAgc3RhdGljIGludmVyc2VPZiA9IChtYXRyaXgpID0+IHtcbiAgICAgIGxldCBpLCBzLCBkLCBpbnYsIGRldFxuXG4gICAgICBzID0gbWF0cml4Lm1hdHJpeDtcbiAgICAgIGQgPSBuZXcgRmxvYXQzMkFycmF5KDE2KTtcbiAgICAgIGludiA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xuXG4gICAgICBpbnZbMF0gID0gICBzWzVdKnNbMTBdKnNbMTVdIC0gc1s1XSAqc1sxMV0qc1sxNF0gLSBzWzldICpzWzZdKnNbMTVdXG4gICAgICAgICAgICAgICAgKyBzWzldKnNbN10gKnNbMTRdICsgc1sxM10qc1s2XSAqc1sxMV0gLSBzWzEzXSpzWzddKnNbMTBdO1xuICAgICAgaW52WzRdICA9IC0gc1s0XSpzWzEwXSpzWzE1XSArIHNbNF0gKnNbMTFdKnNbMTRdICsgc1s4XSAqc1s2XSpzWzE1XVxuICAgICAgICAgICAgICAgIC0gc1s4XSpzWzddICpzWzE0XSAtIHNbMTJdKnNbNl0gKnNbMTFdICsgc1sxMl0qc1s3XSpzWzEwXTtcbiAgICAgIGludls4XSAgPSAgIHNbNF0qc1s5XSAqc1sxNV0gLSBzWzRdICpzWzExXSpzWzEzXSAtIHNbOF0gKnNbNV0qc1sxNV1cbiAgICAgICAgICAgICAgICArIHNbOF0qc1s3XSAqc1sxM10gKyBzWzEyXSpzWzVdICpzWzExXSAtIHNbMTJdKnNbN10qc1s5XTtcbiAgICAgIGludlsxMl0gPSAtIHNbNF0qc1s5XSAqc1sxNF0gKyBzWzRdICpzWzEwXSpzWzEzXSArIHNbOF0gKnNbNV0qc1sxNF1cbiAgICAgICAgICAgICAgICAtIHNbOF0qc1s2XSAqc1sxM10gLSBzWzEyXSpzWzVdICpzWzEwXSArIHNbMTJdKnNbNl0qc1s5XTtcblxuICAgICAgaW52WzFdICA9IC0gc1sxXSpzWzEwXSpzWzE1XSArIHNbMV0gKnNbMTFdKnNbMTRdICsgc1s5XSAqc1syXSpzWzE1XVxuICAgICAgICAgICAgICAgIC0gc1s5XSpzWzNdICpzWzE0XSAtIHNbMTNdKnNbMl0gKnNbMTFdICsgc1sxM10qc1szXSpzWzEwXTtcbiAgICAgIGludls1XSAgPSAgIHNbMF0qc1sxMF0qc1sxNV0gLSBzWzBdICpzWzExXSpzWzE0XSAtIHNbOF0gKnNbMl0qc1sxNV1cbiAgICAgICAgICAgICAgICArIHNbOF0qc1szXSAqc1sxNF0gKyBzWzEyXSpzWzJdICpzWzExXSAtIHNbMTJdKnNbM10qc1sxMF07XG4gICAgICBpbnZbOV0gID0gLSBzWzBdKnNbOV0gKnNbMTVdICsgc1swXSAqc1sxMV0qc1sxM10gKyBzWzhdICpzWzFdKnNbMTVdXG4gICAgICAgICAgICAgICAgLSBzWzhdKnNbM10gKnNbMTNdIC0gc1sxMl0qc1sxXSAqc1sxMV0gKyBzWzEyXSpzWzNdKnNbOV07XG4gICAgICBpbnZbMTNdID0gICBzWzBdKnNbOV0gKnNbMTRdIC0gc1swXSAqc1sxMF0qc1sxM10gLSBzWzhdICpzWzFdKnNbMTRdXG4gICAgICAgICAgICAgICAgKyBzWzhdKnNbMl0gKnNbMTNdICsgc1sxMl0qc1sxXSAqc1sxMF0gLSBzWzEyXSpzWzJdKnNbOV07XG5cbiAgICAgIGludlsyXSAgPSAgIHNbMV0qc1s2XSpzWzE1XSAtIHNbMV0gKnNbN10qc1sxNF0gLSBzWzVdICpzWzJdKnNbMTVdXG4gICAgICAgICAgICAgICAgKyBzWzVdKnNbM10qc1sxNF0gKyBzWzEzXSpzWzJdKnNbN10gIC0gc1sxM10qc1szXSpzWzZdO1xuICAgICAgaW52WzZdICA9IC0gc1swXSpzWzZdKnNbMTVdICsgc1swXSAqc1s3XSpzWzE0XSArIHNbNF0gKnNbMl0qc1sxNV1cbiAgICAgICAgICAgICAgICAtIHNbNF0qc1szXSpzWzE0XSAtIHNbMTJdKnNbMl0qc1s3XSAgKyBzWzEyXSpzWzNdKnNbNl07XG4gICAgICBpbnZbMTBdID0gICBzWzBdKnNbNV0qc1sxNV0gLSBzWzBdICpzWzddKnNbMTNdIC0gc1s0XSAqc1sxXSpzWzE1XVxuICAgICAgICAgICAgICAgICsgc1s0XSpzWzNdKnNbMTNdICsgc1sxMl0qc1sxXSpzWzddICAtIHNbMTJdKnNbM10qc1s1XTtcbiAgICAgIGludlsxNF0gPSAtIHNbMF0qc1s1XSpzWzE0XSArIHNbMF0gKnNbNl0qc1sxM10gKyBzWzRdICpzWzFdKnNbMTRdXG4gICAgICAgICAgICAgICAgLSBzWzRdKnNbMl0qc1sxM10gLSBzWzEyXSpzWzFdKnNbNl0gICsgc1sxMl0qc1syXSpzWzVdO1xuXG4gICAgICBpbnZbM10gID0gLSBzWzFdKnNbNl0qc1sxMV0gKyBzWzFdKnNbN10qc1sxMF0gKyBzWzVdKnNbMl0qc1sxMV1cbiAgICAgICAgICAgICAgICAtIHNbNV0qc1szXSpzWzEwXSAtIHNbOV0qc1syXSpzWzddICArIHNbOV0qc1szXSpzWzZdO1xuICAgICAgaW52WzddICA9ICAgc1swXSpzWzZdKnNbMTFdIC0gc1swXSpzWzddKnNbMTBdIC0gc1s0XSpzWzJdKnNbMTFdXG4gICAgICAgICAgICAgICAgKyBzWzRdKnNbM10qc1sxMF0gKyBzWzhdKnNbMl0qc1s3XSAgLSBzWzhdKnNbM10qc1s2XTtcbiAgICAgIGludlsxMV0gPSAtIHNbMF0qc1s1XSpzWzExXSArIHNbMF0qc1s3XSpzWzldICArIHNbNF0qc1sxXSpzWzExXVxuICAgICAgICAgICAgICAgIC0gc1s0XSpzWzNdKnNbOV0gIC0gc1s4XSpzWzFdKnNbN10gICsgc1s4XSpzWzNdKnNbNV07XG4gICAgICBpbnZbMTVdID0gICBzWzBdKnNbNV0qc1sxMF0gLSBzWzBdKnNbNl0qc1s5XSAgLSBzWzRdKnNbMV0qc1sxMF1cbiAgICAgICAgICAgICAgICArIHNbNF0qc1syXSpzWzldICArIHNbOF0qc1sxXSpzWzZdICAtIHNbOF0qc1syXSpzWzVdO1xuXG4gICAgICBkZXQgPSBzWzBdKmludlswXSArIHNbMV0qaW52WzRdICsgc1syXSppbnZbOF0gKyBzWzNdKmludlsxMl07XG4gICAgICBpZiAoZGV0ID09PSAwKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBkZXQgPSAxIC8gZGV0O1xuICAgICAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICAgICAgZFtpXSA9IGludltpXSAqIGRldDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRcbiAgICB9XG4gICAgLyoqXG4gICAgICog6I635Y+W6YCP6KeG5oqV5b2x55+p6Zi1XG4gICAgICogQHBhcmFtICBmb3YgICAg5oyH5a6a5Z6C55u06KeG6KeS77yM5Y2z5Y+v6KeG56m66Ze06aG26Z2i5ZKM5bqV6Z2i6Ze055qE5aS56KeS77yM5b+F6aG75aSn5LqOMFxuICAgICAqIEBwYXJhbSAgYXNwZWN0IOaMh+Wumui/keWJquijgemdoueahOWuvemrmOavlO+8iOWuveW6pu+8j+mrmOW6pu+8iVxuICAgICAqIEBwYXJhbSAgbmVhciAgIOaMh+Wumui/keWJquijgemdoueahOS9jee9ru+8jOWNs+WPr+inhuepuumXtOeahOi/kei+ueeVjFxuICAgICAqIEBwYXJhbSAgZmFyICAgIOaMh+Wumui/nOWJquijgemdoueahOS9jee9ru+8jOWNs+WPr+inhuepuumXtOeahOi/nOi+ueeVjFxuICAgICAqIEByZXR1cm4gbWF0cml4IOmAj+inhuaKleW9seefqemYtVxuICAgICAqL1xuICAgIHN0YXRpYyBwZXJzcGVjdGl2ZU1hdHJpeCA9IChmb3YsIGFzcGVjdCwgbmVhciwgZmFyKSA9PiB7XG4gICAgICAgIGxldCBtYXRyaXgsIHJkLCBzLCBjdFxuXG4gICAgICAgIGlmIChuZWFyID09PSBmYXIgfHwgYXNwZWN0ID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgJ251bGwgZnJ1c3R1bSdcbiAgICAgICAgfVxuICAgICAgICBpZiAobmVhciA8PSAwKSB7XG4gICAgICAgICAgdGhyb3cgJ25lYXIgPD0gMCdcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmFyIDw9IDApIHtcbiAgICAgICAgICB0aHJvdyAnZmFyIDw9IDAnXG4gICAgICAgIH1cblxuICAgICAgICBmb3YgPSBNYXRoLlBJICogZm92IC8gMTgwIC8gMlxuICAgICAgICBzID0gTWF0aC5zaW4oZm92KVxuICAgICAgICBpZiAocyA9PT0gMCkge1xuICAgICAgICAgIHRocm93ICdudWxsIGZydXN0dW0nXG4gICAgICAgIH1cbiAgICAgICAgcmQgPSAxIC8gKGZhciAtIG5lYXIpXG4gICAgICAgIGN0ID0gTWF0aC5jb3MoZm92KSAvIHNcblxuICAgICAgICBtYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KDE2KVxuXG4gICAgICAgIG1hdHJpeFswXSAgPSBjdCAvIGFzcGVjdFxuICAgICAgICBtYXRyaXhbMV0gID0gMFxuICAgICAgICBtYXRyaXhbMl0gID0gMFxuICAgICAgICBtYXRyaXhbM10gID0gMFxuXG4gICAgICAgIG1hdHJpeFs0XSAgPSAwXG4gICAgICAgIG1hdHJpeFs1XSAgPSBjdFxuICAgICAgICBtYXRyaXhbNl0gID0gMFxuICAgICAgICBtYXRyaXhbN10gID0gMFxuXG4gICAgICAgIG1hdHJpeFs4XSAgPSAwXG4gICAgICAgIG1hdHJpeFs5XSAgPSAwXG4gICAgICAgIG1hdHJpeFsxMF0gPSAtKGZhciArIG5lYXIpICogcmRcbiAgICAgICAgbWF0cml4WzExXSA9IC0xXG5cbiAgICAgICAgbWF0cml4WzEyXSA9IDBcbiAgICAgICAgbWF0cml4WzEzXSA9IDBcbiAgICAgICAgbWF0cml4WzE0XSA9IC0yICogbmVhciAqIGZhciAqIHJkXG4gICAgICAgIG1hdHJpeFsxNV0gPSAwXG4gICAgICAgIHJldHVybiBtYXRyaXhcbiAgICB9XG4gICAgc3RhdGljIG9ydGhvTWF0cml4ID0gKGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSA9PiB7XG4gICAgICAgIGxldCBtYXRyaXgsIHJ3LCByaCwgcmQ7XG5cbiAgICAgICAgaWYgKGxlZnQgPT09IHJpZ2h0IHx8IGJvdHRvbSA9PT0gdG9wIHx8IG5lYXIgPT09IGZhcikge1xuICAgICAgICAgIHRocm93ICdudWxsIGZydXN0dW0nO1xuICAgICAgICB9XG5cbiAgICAgICAgcncgPSAxIC8gKHJpZ2h0IC0gbGVmdCk7XG4gICAgICAgIHJoID0gMSAvICh0b3AgLSBib3R0b20pO1xuICAgICAgICByZCA9IDEgLyAoZmFyIC0gbmVhcik7XG5cbiAgICAgICAgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheSgxNilcblxuICAgICAgICBtYXRyaXhbMF0gID0gMiAqIHJ3O1xuICAgICAgICBtYXRyaXhbMV0gID0gMDtcbiAgICAgICAgbWF0cml4WzJdICA9IDA7XG4gICAgICAgIG1hdHJpeFszXSAgPSAwO1xuXG4gICAgICAgIG1hdHJpeFs0XSAgPSAwO1xuICAgICAgICBtYXRyaXhbNV0gID0gMiAqIHJoO1xuICAgICAgICBtYXRyaXhbNl0gID0gMDtcbiAgICAgICAgbWF0cml4WzddICA9IDA7XG5cbiAgICAgICAgbWF0cml4WzhdICA9IDA7XG4gICAgICAgIG1hdHJpeFs5XSAgPSAwO1xuICAgICAgICBtYXRyaXhbMTBdID0gLTIgKiByZDtcbiAgICAgICAgbWF0cml4WzExXSA9IDA7XG5cbiAgICAgICAgbWF0cml4WzEyXSA9IC0ocmlnaHQgKyBsZWZ0KSAqIHJ3O1xuICAgICAgICBtYXRyaXhbMTNdID0gLSh0b3AgKyBib3R0b20pICogcmg7XG4gICAgICAgIG1hdHJpeFsxNF0gPSAtKGZhciArIG5lYXIpICogcmQ7XG4gICAgICAgIG1hdHJpeFsxNV0gPSAxO1xuXG4gICAgICAgIHJldHVybiBtYXRyaXhcbiAgICB9XG4gICAgc3RhdGljIHZpZXdNYXRyaXggPSAoZXllWCwgZXllWSwgZXllWiwgY2VudGVyWCwgY2VudGVyWSwgY2VudGVyWiwgdXBYLCB1cFksIHVwWik9PntcbiAgICAgICAgbGV0IGUsIGZ4LCBmeSwgZnosIHJsZiwgc3gsIHN5LCBzeiwgcmxzLCB1eCwgdXksIHV6XG5cbiAgICAgICAgZnggPSBjZW50ZXJYIC0gZXllWFxuICAgICAgICBmeSA9IGNlbnRlclkgLSBleWVZXG4gICAgICAgIGZ6ID0gY2VudGVyWiAtIGV5ZVpcblxuICAgICAgICAvLyBOb3JtYWxpemUgZi5cbiAgICAgICAgcmxmID0gMSAvIE1hdGguc3FydChmeCpmeCArIGZ5KmZ5ICsgZnoqZnopXG4gICAgICAgIGZ4ICo9IHJsZlxuICAgICAgICBmeSAqPSBybGZcbiAgICAgICAgZnogKj0gcmxmXG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGNyb3NzIHByb2R1Y3Qgb2YgZiBhbmQgdXAuXG4gICAgICAgIHN4ID0gZnkgKiB1cFogLSBmeiAqIHVwWVxuICAgICAgICBzeSA9IGZ6ICogdXBYIC0gZnggKiB1cFpcbiAgICAgICAgc3ogPSBmeCAqIHVwWSAtIGZ5ICogdXBYXG5cbiAgICAgICAgLy8gTm9ybWFsaXplIHMuXG4gICAgICAgIHJscyA9IDEgLyBNYXRoLnNxcnQoc3gqc3ggKyBzeSpzeSArIHN6KnN6KVxuICAgICAgICBzeCAqPSBybHNcbiAgICAgICAgc3kgKj0gcmxzXG4gICAgICAgIHN6ICo9IHJsc1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBjcm9zcyBwcm9kdWN0IG9mIHMgYW5kIGYuXG4gICAgICAgIHV4ID0gc3kgKiBmeiAtIHN6ICogZnlcbiAgICAgICAgdXkgPSBzeiAqIGZ4IC0gc3ggKiBmelxuICAgICAgICB1eiA9IHN4ICogZnkgLSBzeSAqIGZ4XG5cbiAgICAgICAgbGV0IG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpXG4gICAgICAgIG1hdHJpeFswXSA9IHN4XG4gICAgICAgIG1hdHJpeFsxXSA9IHV4XG4gICAgICAgIG1hdHJpeFsyXSA9IC1meFxuICAgICAgICBtYXRyaXhbM10gPSAwXG5cbiAgICAgICAgbWF0cml4WzRdID0gc3lcbiAgICAgICAgbWF0cml4WzVdID0gdXlcbiAgICAgICAgbWF0cml4WzZdID0gLWZ5XG4gICAgICAgIG1hdHJpeFs3XSA9IDBcblxuICAgICAgICBtYXRyaXhbOF0gPSBzelxuICAgICAgICBtYXRyaXhbOV0gPSB1elxuICAgICAgICBtYXRyaXhbMTBdID0gLWZ6XG4gICAgICAgIG1hdHJpeFsxMV0gPSAwXG5cbiAgICAgICAgbWF0cml4WzEyXSA9IDBcbiAgICAgICAgbWF0cml4WzEzXSA9IDBcbiAgICAgICAgbWF0cml4WzE0XSA9IDBcbiAgICAgICAgbWF0cml4WzE1XSA9IDFcblxuICAgICAgICByZXR1cm4gTWF0cml4NC5tdWx0aXBseShtYXRyaXgsTWF0cml4NC50cmFuc2xhdGVNYXRyaXgoLWV5ZVgsIC1leWVZLCAtZXllWikpXG4gICAgfVxuICAgIHN0YXRpYyByb3RhdGVNYXRyaXggPSAoYW5nZWwseCx5LHopID0+IHtcbiAgICAgICAgbGV0IHJhZGlhbiA9IE1hdGguUEkgKiBhbmdlbCAvIDE4MC4wXG4gICAgICAgIGxldCBzID0gTWF0aC5zaW4ocmFkaWFuKVxuICAgICAgICBsZXQgYyA9IE1hdGguY29zKHJhZGlhbilcblxuICAgICAgICBpZiAoeCE9PTAmJnk9PT0wJiZ6PT09MCkge1xuICAgICAgICAgICAgaWYgKHggPCAwKSB7XG4gICAgICAgICAgICAgIHMgPSAtc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE1hdHJpeDQucm90YXRlWE1hdHJpeChzLGMpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHg9PT0wJiZ5IT09MCYmej09PTApIHtcbiAgICAgICAgICAgIGlmICh5IDwgMCkge1xuICAgICAgICAgICAgICBzID0gLXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBNYXRyaXg0LnJvdGF0ZVlNYXRyaXgocyxjKVxuICAgICAgICB9XG4gICAgICAgIGlmICh4PT09MCYmeT09PTAmJnohPT0wKSB7XG4gICAgICAgICAgICBpZiAoejwwKSB7XG4gICAgICAgICAgICAgICAgcyA9IC1zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTWF0cml4NC5yb3RhdGVaTWF0cml4KHMsYylcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheSgxNilcbiAgICAgICAgbGVuID0gTWF0aC5zcXJ0KHgqeCArIHkqeSArIHoqeilcbiAgICAgICAgaWYgKGxlbiAhPT0gMSkge1xuICAgICAgICAgIHJsZW4gPSAxIC8gbGVuXG4gICAgICAgICAgeCAqPSBybGVuXG4gICAgICAgICAgeSAqPSBybGVuXG4gICAgICAgICAgeiAqPSBybGVuXG4gICAgICAgIH1cbiAgICAgICAgbmMgPSAxIC0gY1xuICAgICAgICB4eSA9IHggKiB5XG4gICAgICAgIHl6ID0geSAqIHpcbiAgICAgICAgenggPSB6ICogeFxuICAgICAgICB4cyA9IHggKiBzXG4gICAgICAgIHlzID0geSAqIHNcbiAgICAgICAgenMgPSB6ICogc1xuXG4gICAgICAgIG1hdHJpeFsgMF0gPSB4KngqbmMgKyAgY1xuICAgICAgICBtYXRyaXhbIDFdID0geHkgKm5jICsgenNcbiAgICAgICAgbWF0cml4WyAyXSA9IHp4ICpuYyAtIHlzXG4gICAgICAgIG1hdHJpeFsgM10gPSAwXG5cbiAgICAgICAgbWF0cml4WyA0XSA9IHh5ICpuYyAtIHpzXG4gICAgICAgIG1hdHJpeFsgNV0gPSB5KnkqbmMgKyAgY1xuICAgICAgICBtYXRyaXhbIDZdID0geXogKm5jICsgeHNcbiAgICAgICAgbWF0cml4WyA3XSA9IDBcblxuICAgICAgICBtYXRyaXhbIDhdID0genggKm5jICsgeXNcbiAgICAgICAgbWF0cml4WyA5XSA9IHl6ICpuYyAtIHhzXG4gICAgICAgIG1hdHJpeFsxMF0gPSB6KnoqbmMgKyAgY1xuICAgICAgICBtYXRyaXhbMTFdID0gMFxuXG4gICAgICAgIG1hdHJpeFsxMl0gPSAwXG4gICAgICAgIG1hdHJpeFsxM10gPSAwXG4gICAgICAgIG1hdHJpeFsxNF0gPSAwXG4gICAgICAgIG1hdHJpeFsxNV0gPSAxXG5cbiAgICAgICAgcmV0dXJuIG1hdHJpeFxuICAgIH1cbiAgICBzdGF0aWMgdHJhbnNsYXRlTWF0cml4ID0gKHgseSx6KT0+e1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwwLDAsMCwgMCwxLDAsMCwgMCwwLDEsMCwgeCx5LHosMV0pXG4gICAgfVxuICAgIHN0YXRpYyBzY2FsZU1hdHJpeCA9IChTeCxTeSxTeik9PntcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW1N4LDAsMCwwLCAwLFN5LDAsMCwgMCwwLFN6LDAsIDAsMCwwLDFdKVxuICAgIH1cbiAgICBzdGF0aWMgdW5pdE1hdHJpeDQgPSAoKT0+e1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwwLDAsMCwgMCwxLDAsMCwgMCwwLDEsMCwgMCwwLDAsMV0pXG4gICAgfVxuICAgIHN0YXRpYyByb3RhdGVYTWF0cml4ID0gKHMsYyk9PntcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEsMCwwLDAsIDAsYyxzLDAsIDAsLXMsYywwLCAwLDAsMCwxXSlcbiAgICB9XG4gICAgc3RhdGljIHJvdGF0ZVlNYXRyaXggPSAocyxjKT0+e1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYywwLC1zLDAsIDAsMSwwLDAsIHMsMCxjLDAsIDAsMCwwLDFdKVxuICAgIH1cbiAgICBzdGF0aWMgcm90YXRlWk1hdHJpeCA9IChzLGMpPT57XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtjLHMsMCwwLCAtcyxjLDAsMCwgMCwwLDEsMCwgMCwwLDAsMV0pXG4gICAgfVxuICAgIHN0YXRpYyBhZGQgPSAobWF0cml4MSxtYXRyaXgyKT0+e1xuICAgICAgICBjb25zdCBsZW4xID0gbWF0cml4MS5sZW5ndGgsIGxlbjIgPSBtYXRyaXgyLmxlbmd0aFxuICAgICAgICBpZiAobGVuMSAhPSBsZW4yKSB7XG4gICAgICAgICAgICB0aHJvdyAn55+p6Zi1MeWSjOefqemYtTLplb/luqbkuI3kuIDoh7QnXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkobGVuMSlcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW4xOyBpKyspIHtcbiAgICAgICAgICAgIG1hdHJpeFtpXSA9IG1hdHJpeDFbaV0gKyBtYXRyaXgyW2ldXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdHJpeFxuICAgIH1cbiAgICBzdGF0aWMgc3VidHJhY3QgPSAobWF0cml4MSxtYXRyaXgyKT0+e1xuICAgICAgICBsZXQgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheSgxNilcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICAgICAgICBtYXRyaXhbaV0gPSBtYXRyaXgxW2ldIC0gbWF0cml4MltpXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXRyaXhcbiAgICB9XG4gICAgc3RhdGljIG11bHRpcGx5ID0gKG1hdHJpeDEsbWF0cml4Mik9PntcbiAgICAgICAgbGV0IG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpXG5cbiAgICAgICAgbWF0cml4WzBdID0gbWF0cml4MVswXSptYXRyaXgyWzBdICsgbWF0cml4MVs0XSptYXRyaXgyWzFdICsgbWF0cml4MVs4XSptYXRyaXgyWzJdICsgbWF0cml4MVsxMl0qbWF0cml4MlszXVxuICAgICAgICBtYXRyaXhbNF0gPSBtYXRyaXgxWzBdKm1hdHJpeDJbNF0gKyBtYXRyaXgxWzRdKm1hdHJpeDJbNV0gKyBtYXRyaXgxWzhdKm1hdHJpeDJbNl0gKyBtYXRyaXgxWzEyXSptYXRyaXgyWzddXG4gICAgICAgIG1hdHJpeFs4XSA9IG1hdHJpeDFbMF0qbWF0cml4Mls4XSArIG1hdHJpeDFbNF0qbWF0cml4Mls5XSArIG1hdHJpeDFbOF0qbWF0cml4MlsxMF0gKyBtYXRyaXgxWzEyXSptYXRyaXgyWzExXVxuICAgICAgICBtYXRyaXhbMTJdID0gbWF0cml4MVswXSptYXRyaXgyWzEyXSArIG1hdHJpeDFbNF0qbWF0cml4MlsxM10gKyBtYXRyaXgxWzhdKm1hdHJpeDJbMTRdICsgbWF0cml4MVsxMl0qbWF0cml4MlsxNV1cblxuICAgICAgICBtYXRyaXhbMV0gPSBtYXRyaXgxWzFdKm1hdHJpeDJbMF0gKyBtYXRyaXgxWzVdKm1hdHJpeDJbMV0gKyBtYXRyaXgxWzldKm1hdHJpeDJbMl0gKyBtYXRyaXgxWzEzXSptYXRyaXgyWzNdXG4gICAgICAgIG1hdHJpeFs1XSA9IG1hdHJpeDFbMV0qbWF0cml4Mls0XSArIG1hdHJpeDFbNV0qbWF0cml4Mls1XSArIG1hdHJpeDFbOV0qbWF0cml4Mls2XSArIG1hdHJpeDFbMTNdKm1hdHJpeDJbN11cbiAgICAgICAgbWF0cml4WzldID0gbWF0cml4MVsxXSptYXRyaXgyWzhdICsgbWF0cml4MVs1XSptYXRyaXgyWzldICsgbWF0cml4MVs5XSptYXRyaXgyWzEwXSArIG1hdHJpeDFbMTNdKm1hdHJpeDJbMTFdXG4gICAgICAgIG1hdHJpeFsxM10gPSBtYXRyaXgxWzFdKm1hdHJpeDJbMTJdICsgbWF0cml4MVs1XSptYXRyaXgyWzEzXSArIG1hdHJpeDFbOV0qbWF0cml4MlsxNF0gKyBtYXRyaXgxWzEzXSptYXRyaXgyWzE1XVxuXG4gICAgICAgIG1hdHJpeFsyXSA9IG1hdHJpeDFbMl0qbWF0cml4MlswXSArIG1hdHJpeDFbNl0qbWF0cml4MlsxXSArIG1hdHJpeDFbMTBdKm1hdHJpeDJbMl0gKyBtYXRyaXgxWzE0XSptYXRyaXgyWzNdXG4gICAgICAgIG1hdHJpeFs2XSA9IG1hdHJpeDFbMl0qbWF0cml4Mls0XSArIG1hdHJpeDFbNl0qbWF0cml4Mls1XSArIG1hdHJpeDFbMTBdKm1hdHJpeDJbNl0gKyBtYXRyaXgxWzE0XSptYXRyaXgyWzddXG4gICAgICAgIG1hdHJpeFsxMF0gPSBtYXRyaXgxWzJdKm1hdHJpeDJbOF0gKyBtYXRyaXgxWzZdKm1hdHJpeDJbOV0gKyBtYXRyaXgxWzEwXSptYXRyaXgyWzEwXSArIG1hdHJpeDFbMTRdKm1hdHJpeDJbMTFdXG4gICAgICAgIG1hdHJpeFsxNF0gPSBtYXRyaXgxWzJdKm1hdHJpeDJbMTJdICsgbWF0cml4MVs2XSptYXRyaXgyWzEzXSArIG1hdHJpeDFbMTBdKm1hdHJpeDJbMTRdICsgbWF0cml4MVsxNF0qbWF0cml4MlsxNV1cblxuICAgICAgICBtYXRyaXhbM10gPSBtYXRyaXgxWzNdKm1hdHJpeDJbMF0gKyBtYXRyaXgxWzddKm1hdHJpeDJbMV0gKyBtYXRyaXgxWzExXSptYXRyaXgyWzJdICsgbWF0cml4MVsxNV0qbWF0cml4MlszXVxuICAgICAgICBtYXRyaXhbN10gPSBtYXRyaXgxWzNdKm1hdHJpeDJbNF0gKyBtYXRyaXgxWzddKm1hdHJpeDJbNV0gKyBtYXRyaXgxWzExXSptYXRyaXgyWzZdICsgbWF0cml4MVsxNV0qbWF0cml4Mls3XVxuICAgICAgICBtYXRyaXhbMTFdID0gbWF0cml4MVszXSptYXRyaXgyWzhdICsgbWF0cml4MVs3XSptYXRyaXgyWzldICsgbWF0cml4MVsxMV0qbWF0cml4MlsxMF0gKyBtYXRyaXgxWzE1XSptYXRyaXgyWzExXVxuICAgICAgICBtYXRyaXhbMTVdID0gbWF0cml4MVszXSptYXRyaXgyWzEyXSArIG1hdHJpeDFbN10qbWF0cml4MlsxM10gKyBtYXRyaXgxWzExXSptYXRyaXgyWzE0XSArIG1hdHJpeDFbMTVdKm1hdHJpeDJbMTVdXG5cbiAgICAgICAgcmV0dXJuIG1hdHJpeFxuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gTWF0cml4NFxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbGliL3dlYmdsL21hdHJpeDQuanNcbiAqKi8iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xuXG5pbXBvcnQgeyBpbml0U2hhZGVycyB9IGZyb20gJ1dlQkdMVXRpbHMnXG5pbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSAnVmVjdG9yJ1xuXG5pbXBvcnQgTWF0cml4NCBmcm9tICdNYXRyaXg0J1xuXG5jb25zdCBWU0hBREVSX1NPVVJDRSA9IGBcbiAgICBhdHRyaWJ1dGUgdmVjNCBhX1Bvc2l0aW9uO1xuICAgIGF0dHJpYnV0ZSB2ZWM0IGFfQ29sb3I7XG4gICAgYXR0cmlidXRlIHZlYzQgYV9Ob3JtYWw7XG4gICAgdW5pZm9ybSBtYXQ0IHVfTXZwTWF0cml4O1xuICAgIHVuaWZvcm0gdmVjMyB1X0xpZ2h0Q29sb3I7XG4gICAgdW5pZm9ybSB2ZWMzIHVfTGlnaHREaXJlY3Rpb247XG4gICAgdW5pZm9ybSB2ZWMzIHVfQW1iaWVudExpZ2h0O1xuICAgIHZhcnlpbmcgdmVjNCB2X0NvbG9yO1xuICAgIHZvaWQgbWFpbigpe1xuICAgICAgICBnbF9Qb3NpdGlvbiA9IHVfTXZwTWF0cml4ICogYV9Qb3NpdGlvbjtcbiAgICAgICAgdmVjMyBub3JtYWwgPSBub3JtYWxpemUoYV9Ob3JtYWwueHl6KTtcbiAgICAgICAgZmxvYXQgbkRvdEwgPSBtYXgoZG90KHVfTGlnaHREaXJlY3Rpb24sIG5vcm1hbCksIDAuMCk7XG4gICAgICAgIHZlYzMgZGlmZnVzZSA9IHVfTGlnaHRDb2xvciAqIGFfQ29sb3IucmdiICogbkRvdEw7XG4gICAgICAgIHZlYzMgYW1iaWVudCA9IHVfQW1iaWVudExpZ2h0ICogYV9Db2xvci5yZ2I7XG4gICAgICAgIHZfQ29sb3IgPSB2ZWM0KGRpZmZ1c2UgKyBhbWJpZW50LCBhX0NvbG9yLmEpO1xuICAgIH1cbmBcblxuY29uc3QgRlNIQURFUl9TT1VSQ0UgPSBgXG4gICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gICAgdmFyeWluZyB2ZWM0IHZfQ29sb3I7XG4gICAgdm9pZCBtYWluKCl7XG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHZfQ29sb3I7XG4gICAgfVxuYFxuXG5jbGFzcyBMaWdodGVkQ3ViZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjYW52YXMgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMuY2FudmFzKVxuICAgICAgY2FudmFzLndpZHRoID0gNTAwXG4gICAgICBjYW52YXMuaGVpZ2h0ID0gNTAwXG5cbiAgICAgIGNvbnN0IGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJylcblxuICAgICAgaWYgKCFpbml0U2hhZGVycyhnbCwgVlNIQURFUl9TT1VSQ0UsIEZTSEFERVJfU09VUkNFKSkge1xuICAgICAgICBjb25zb2xlLmxvZygnRmFpbGQgdG8gaW5pdCBTaGFkZXJzJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG4gPSB0aGlzLmluaXRWZXJ0ZXhCdWZmZXJzKGdsKVxuICAgICAgaWYgKG4gPCAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gc2V0IHRoZSB2ZXJ0ZXggaW5mb3JtYXRpb24nKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApXG4gICAgICBnbC5lbmFibGUoZ2wuREVQVEhfVEVTVClcblxuICAgICAgY29uc3QgdU12cE1hdHJpeCA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihnbC5wcm9ncmFtLCAndV9NdnBNYXRyaXgnKVxuICAgICAgY29uc3QgdUxpZ2h0Q29sb3IgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oZ2wucHJvZ3JhbSwgJ3VfTGlnaHRDb2xvcicpXG4gICAgICBjb25zdCB1TGlnaHREaXJlY3Rpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oZ2wucHJvZ3JhbSwgJ3VfTGlnaHREaXJlY3Rpb24nKVxuICAgICAgY29uc3QgdUFtYmllbnRMaWdodCA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihnbC5wcm9ncmFtLCAndV9BbWJpZW50TGlnaHQnKVxuICAgICAgaWYgKCF1TXZwTWF0cml4IHx8ICF1TGlnaHRDb2xvciB8fCAhdUxpZ2h0RGlyZWN0aW9uIHx8ICF1QW1iaWVudExpZ2h0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gZ2V0IHRoZSBzdG9yYWdlIGxvY2F0aW9uJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBTZXQgdGhlIGxpZ2h0IGNvbG9yICh3aGl0ZSlcbiAgICAgIGdsLnVuaWZvcm0zZih1TGlnaHRDb2xvciwgMS4wLCAxLjAsIDEuMClcbiAgICAgIC8vIFNldCB0aGUgbGlnaHQgZGlyZWN0aW9uIChpbiB0aGUgd29ybGQgY29vcmRpbmF0ZSlcbiAgICAgIGNvbnN0IGxpZ2h0RGlyZWN0aW9uID0gbmV3IFZlY3RvcjMoWzAuNSwgMy4wLCA0LjBdKVxuICAgICAgbGlnaHREaXJlY3Rpb24ubm9ybWFsaXplKClcbiAgICAgIGdsLnVuaWZvcm0zZnYodUxpZ2h0RGlyZWN0aW9uLCBsaWdodERpcmVjdGlvbi5lbGVtZW50cylcbiAgICAgIC8vIFNldCB0aGUgYW1iaWVudCBsaWdodFxuICAgICAgZ2wudW5pZm9ybTNmKHVBbWJpZW50TGlnaHQsIDAuMiwgMC4yLCAwLjIpXG4gICAgICBjb25zdCBtdnBNYXRyaXggPSBuZXcgTWF0cml4NCgpXG4gICAgICBtdnBNYXRyaXguc2V0VmlldygzLCAzLCA3LCAwLCAwLCAwLCAwLCAxLCAwKVxuICAgICAgICAgICAgICAgIC5wZXJzcGVjdGl2ZSgzMCwgY2FudmFzLndpZHRoIC8gY2FudmFzLmhlaWdodCwgMSwgMTAwKVxuICAgICAgZ2wudW5pZm9ybU1hdHJpeDRmdih1TXZwTWF0cml4LCBmYWxzZSwgbXZwTWF0cml4Lm1hdHJpeClcblxuICAgICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpXG5cbiAgICAgIGdsLmRyYXdFbGVtZW50cyhnbC5UUklBTkdMRVMsIG4sIGdsLlVOU0lHTkVEX0JZVEUsIDApXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9XG4gIH1cbiAgaW5pdFZlcnRleEJ1ZmZlcnMgPSAoZ2wpID0+IHtcbiAgICAvLyBDcmVhdGUgYSBjdWJlXG4gICAgLy8gICAgdjYtLS0tLSB2NVxuICAgIC8vICAgL3wgICAgICAvfFxuICAgIC8vICB2MS0tLS0tLXYwfFxuICAgIC8vICB8IHwgICAgIHwgfFxuICAgIC8vICB8IHx2Ny0tLXwtfHY0XG4gICAgLy8gIHwvICAgICAgfC9cbiAgICAvLyAgdjItLS0tLS12M1xuICAgIGNvbnN0IHZlcnRleHMgPSBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgIDEuMCwgMS4wLCAxLjAsIC0xLjAsIDEuMCwgMS4wLCAtMS4wLCAtMS4wLCAxLjAsIDEuMCwgLTEuMCwgMS4wLCAgLy8gdjAtdjEtdjItdjMgZnJvbnRcbiAgICAgIDEuMCwgMS4wLCAxLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIC0xLjAsIDEuMCwgMS4wLCAtMS4wLCAgLy8gdjAtdjMtdjQtdjUgcmlnaHRcbiAgICAgIDEuMCwgMS4wLCAxLjAsIDEuMCwgMS4wLCAtMS4wLCAtMS4wLCAxLjAsIC0xLjAsIC0xLjAsIDEuMCwgMS4wLCAgLy8gdjAtdjUtdjYtdjEgdXBcbiAgICAgIC0xLjAsIDEuMCwgMS4wLCAtMS4wLCAxLjAsIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsIDEuMCwgIC8vIHYxLXY2LXY3LXYyIGxlZnRcbiAgICAgIC0xLjAsIC0xLjAsIC0xLjAsIDEuMCwgLTEuMCwgLTEuMCwgMS4wLCAtMS4wLCAxLjAsIC0xLjAsIC0xLjAsIDEuMCwgIC8vIHY3LXY0LXYzLXYyIGRvd25cbiAgICAgIDEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgMS4wLCAtMS4wLCAxLjAsIDEuMCwgLTEuMCwgIC8vIHY0LXY3LXY2LXY1IGJhY2tcbiAgICBdKVxuXG4gICAgY29uc3QgY29sb3JzID0gbmV3IEZsb2F0MzJBcnJheShbICAgICAvLyBDb2xvcnNcbiAgICAgIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsICAgICAvLyB2MC12MS12Mi12MyBmcm9udFxuICAgICAgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgICAgIC8vIHYwLXYzLXY0LXY1IHJpZ2h0XG4gICAgICAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAgICAgLy8gdjAtdjUtdjYtdjEgdXBcbiAgICAgIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsICAgICAvLyB2MS12Ni12Ny12MiBsZWZ0XG4gICAgICAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAgICAgLy8gdjctdjQtdjMtdjIgZG93blxuICAgICAgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgICAgIC8vIHY0LXY3LXY2LXY1IGJhY2tcbiAgICBdKVxuXG4gICAgY29uc3Qgbm9ybWFscyA9IG5ldyBGbG9hdDMyQXJyYXkoWyAgICAvLyBOb3JtYWxcbiAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMC4wLCAxLjAsIDAuMCwgMC4wLCAxLjAsIDAuMCwgMC4wLCAxLjAsICAvLyB2MC12MS12Mi12MyBmcm9udFxuICAgICAgMS4wLCAwLjAsIDAuMCwgMS4wLCAwLjAsIDAuMCwgMS4wLCAwLjAsIDAuMCwgMS4wLCAwLjAsIDAuMCwgIC8vIHYwLXYzLXY0LXY1IHJpZ2h0XG4gICAgICAwLjAsIDEuMCwgMC4wLCAwLjAsIDEuMCwgMC4wLCAwLjAsIDEuMCwgMC4wLCAwLjAsIDEuMCwgMC4wLCAgLy8gdjAtdjUtdjYtdjEgdXBcbiAgICAgIC0xLjAsIDAuMCwgMC4wLCAtMS4wLCAwLjAsIDAuMCwgLTEuMCwgMC4wLCAwLjAsIC0xLjAsIDAuMCwgMC4wLCAgLy8gdjEtdjYtdjctdjIgbGVmdFxuICAgICAgMC4wLCAtMS4wLCAwLjAsIDAuMCwgLTEuMCwgMC4wLCAwLjAsIC0xLjAsIDAuMCwgMC4wLCAtMS4wLCAwLjAsICAvLyB2Ny12NC12My12MiBkb3duXG4gICAgICAwLjAsIDAuMCwgLTEuMCwgMC4wLCAwLjAsIC0xLjAsIDAuMCwgMC4wLCAtMS4wLCAwLjAsIDAuMCwgLTEuMCwgICAvLyB2NC12Ny12Ni12NSBiYWNrXG4gICAgXSlcblxuICAgICAvLyBJbmRpY2VzIG9mIHRoZSB2ZXJ0aWNlc1xuICAgIGNvbnN0IGluZGljZXMgPSBuZXcgVWludDhBcnJheShbXG4gICAgICAwLCAxLCAyLCAwLCAyLCAzLCAgICAvLyBmcm9udFxuICAgICAgNCwgNSwgNiwgNCwgNiwgNywgICAgLy8gcmlnaHRcbiAgICAgIDgsIDksIDEwLCA4LCAxMCwgMTEsICAgIC8vIHVwXG4gICAgICAxMiwgMTMsIDE0LCAxMiwgMTQsIDE1LCAgICAvLyBsZWZ0XG4gICAgICAxNiwgMTcsIDE4LCAxNiwgMTgsIDE5LCAgICAvLyBkb3duXG4gICAgICAyMCwgMjEsIDIyLCAyMCwgMjIsIDIzLCAgICAvLyBiYWNrXG4gICAgXSlcblxuICAgIC8vIENyZWF0ZSBhIGJ1ZmZlciBvYmplY3RcbiAgICBjb25zdCBpbmRleEJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpXG4gICAgaWYgKCFpbmRleEJ1ZmZlcikge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuXG4gICAgLy8gV3JpdGUgdGhlIHZlcnRleCBjb29yZGluYXRlcyBhbmQgY29sb3IgdG8gdGhlIGJ1ZmZlciBvYmplY3RcbiAgICBpZiAoIXRoaXMuaW5pdEFycmF5QnVmZmVyKGdsLCB2ZXJ0ZXhzLCAzLCBnbC5GTE9BVCwgJ2FfUG9zaXRpb24nKSkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIGlmICghdGhpcy5pbml0QXJyYXlCdWZmZXIoZ2wsIGNvbG9ycywgMywgZ2wuRkxPQVQsICdhX0NvbG9yJykpIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICBpZiAoIXRoaXMuaW5pdEFycmF5QnVmZmVyKGdsLCBub3JtYWxzLCAzLCBnbC5GTE9BVCwgJ2FfTm9ybWFsJykpIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cblxuICAgIC8vIFdyaXRlIHRoZSBpbmRpY2VzIHRvIHRoZSBidWZmZXIgb2JqZWN0XG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgaW5kZXhCdWZmZXIpXG4gICAgZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgaW5kaWNlcywgZ2wuU1RBVElDX0RSQVcpXG5cbiAgICByZXR1cm4gaW5kaWNlcy5sZW5ndGhcbiAgfVxuICBpbml0QXJyYXlCdWZmZXI9KGdsLCBkYXRhLCBudW0sIHR5cGUsIGF0dHJpYnV0ZSkgPT4ge1xuICAgIGNvbnN0IGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpICAgLy8gQ3JlYXRlIGEgYnVmZmVyIG9iamVjdFxuICAgIGlmICghYnVmZmVyKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGNyZWF0ZSB0aGUgYnVmZmVyIG9iamVjdCcpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgLy8gV3JpdGUgZGF0ZSBpbnRvIHRoZSBidWZmZXIgb2JqZWN0XG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcilcbiAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgZGF0YSwgZ2wuU1RBVElDX0RSQVcpXG4gICAgLy8gQXNzaWduIHRoZSBidWZmZXIgb2JqZWN0IHRvIHRoZSBhdHRyaWJ1dGUgdmFyaWFibGVcbiAgICBjb25zdCBhQXR0cmlidXRlID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oZ2wucHJvZ3JhbSwgYXR0cmlidXRlKVxuICAgIGlmIChhQXR0cmlidXRlIDwgMCkge1xuICAgICAgY29uc29sZS5sb2coYEZhaWxlZCB0byBnZXQgdGhlIHN0b3JhZ2UgbG9jYXRpb24gb2YgJHthdHRyaWJ1dGV9YClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGFBdHRyaWJ1dGUsIG51bSwgdHlwZSwgZmFsc2UsIDAsIDApXG4gICAgLy8gRW5hYmxlIHRoZSBhc3NpZ25tZW50IG9mIHRoZSBidWZmZXIgb2JqZWN0IHRvIHRoZSBhdHRyaWJ1dGUgdmFyaWFibGVcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhQXR0cmlidXRlKVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxmaWd1cmU+XG4gICAgICAgIDxmaWdjYXB0aW9uPnsn5YWJ54Wn56uL5pa55L2TJ308L2ZpZ2NhcHRpb24+XG4gICAgICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCI+XG4gICAgICAgICAgeyd5b3VyIGN1cnJlbnQgYnJvd2VyIGRvblxcJ3Qgc3VwcG9ydCBjYW52YXMscGxlYXNlIGNoYW5nZSBhbm90aGVyIG9uZSd9XG4gICAgICAgIDwvY2FudmFzPlxuICAgICAgPC9maWd1cmU+XG4gICAgKVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IExpZ2h0ZWRDdWJlXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyeS9yb3V0ZXMvZGVtb3Mvcm91dGVzL2NhbnZhcy93ZWJnbC9saWdodGVkQ3ViZS9MaWdodGVkQ3ViZS5qc3hcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5cbmV4cG9ydCBjbGFzcyBWZWN0b3IzIHtcbiAgICBjb25zdHJ1Y3RvcihhcnIpIHtcbiAgICAgICAgbGV0IHYgPSBuZXcgRmxvYXQzMkFycmF5KDMpXG4gICAgICAgIGlmIChhcnIgJiYgXy5pc0FycmF5KGFycikpIHtcbiAgICAgICAgICB2WzBdID0gYXJyWzBdXG4gICAgICAgICAgdlsxXSA9IGFyclsxXVxuICAgICAgICAgIHZbMl0gPSBhcnJbMl1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnRzID0gdlxuICAgIH1cbiAgICBub3JtYWxpemUgPSAoKSA9PiB7XG4gICAgICBsZXQgdiA9IHRoaXMuZWxlbWVudHM7XG4gICAgICBsZXQgYyA9IHZbMF0sIGQgPSB2WzFdLCBlID0gdlsyXSwgZyA9IE1hdGguc3FydChjKmMrZCpkK2UqZSlcbiAgICAgIGlmKGcpe1xuICAgICAgICBpZihnID09IDEpXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgIH0gZWxzZSB7XG4gICAgICAgICB2WzBdID0gMDsgdlsxXSA9IDA7IHZbMl0gPSAwXG4gICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgIH1cbiAgICAgICBnID0gMS9nO1xuICAgICAgIHZbMF0gPSBjKmc7IHZbMV0gPSBkKmc7IHZbMl0gPSBlKmdcbiAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZlY3RvcjQge1xuICBjb25zdHJ1Y3RvcihhcnIpIHtcbiAgICBsZXQgdiA9IG5ldyBGbG9hdDMyQXJyYXkoNCk7XG4gICAgaWYgKG9wdF9zcmMgJiYgdHlwZW9mIG9wdF9zcmMgPT09ICdvYmplY3QnKSB7XG4gICAgICB2WzBdID0gYXJyWzBdXG4gICAgICB2WzFdID0gYXJyWzFdXG4gICAgICB2WzJdID0gYXJyWzJdXG4gICAgICB2WzNdID0gYXJyWzNdXG4gICAgfVxuICAgIHRoaXMuZWxlbWVudHMgPSB2XG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xpYi93ZWJnbC92ZWN0b3IuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9