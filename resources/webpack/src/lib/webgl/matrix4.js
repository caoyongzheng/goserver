class Matrix4 {
    constructor(matrix) {
        this.matrix = matrix || Matrix4.unitMatrix4()
    }
    init = (matrix)=>{
        this.matrix = matrix || Matrix4.unitMatrix4()
        return this
    }
    multiply = (matrix) => {
      this.matrix = Matrix4.multiply(this.matrix, matrix)
    }
    rotate = (angel,x,y,z)=>{
        this.matrix = Matrix4.multiply(Matrix4.rotateMatrix(angel,x,y,z),this.matrix)
        return this
    }
    rotate4 = (angel,vector,dot)=>{
        this.translate(-dot.x,-dot.y,-dot.z)
        this.rotate(angel,vector.x,vector.y,vector.z)
        this.translate(dot.x,dot.y,dot.z)
        return this
    }
    translate = (x,y,z)=>{
        this.matrix = Matrix4.multiply(Matrix4.translateMatrix(x,y,z),this.matrix)
        return this
    }
    scale = (Sx,Sy,Sz)=>{
        this.matrix = Matrix4.multiply(Matrix4.scaleMatrix(Sx,Sy,Sz),this.matrix)
        return this
    }
    view = (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) =>{
        this.matrix = Matrix4.multiply(Matrix4.viewMatrix(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ),this.matrix)
        return this
    }
    ortho = (left, right, bottom, top, near, far) =>{
        this.matrix = Matrix4.multiply(Matrix4.orthoMatrix(left, right, bottom, top, near, far),this.matrix)
        return this
    }
    perspective = (fov, aspect, near, far) => {
        this.matrix = Matrix4.multiply(Matrix4.perspectiveMatrix(fov, aspect, near, far),this.matrix)
        return this
    }
    transpose = () => {
      let e, t

      e = this.matrix

      t = e[ 1];  e[ 1] = e[ 4];  e[ 4] = t;
      t = e[ 2];  e[ 2] = e[ 8];  e[ 8] = t;
      t = e[ 3];  e[ 3] = e[12];  e[12] = t;
      t = e[ 6];  e[ 6] = e[ 9];  e[ 9] = t;
      t = e[ 7];  e[ 7] = e[13];  e[13] = t;
      t = e[11];  e[11] = e[14];  e[14] = t;

      return this
    }
    setOrtho = (left, right, bottom, top, near, far) =>{
        this.matrix = Matrix4.orthoMatrix(left, right, bottom, top, near, far)
        return this;
    }
    setRotate = (angel,x,y,z)=>{
        this.matrix = Matrix4.rotateMatrix(angel,x,y,z)
        return this
    }
    setTranslate = (x,y,z)=>{
        this.matrix = Matrix4.translateMatrix(x,y,z)
        return this
    }
    setScale = (Sx,Sy,Sz)=>{
        this.matrix = Matrix4.scaleMatrix(Sx,Sy,Sz)
        return this
    }
    setView = (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ)=>{
        this.matrix = Matrix4.viewMatrix(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ)
        return this
    }

    setPerspective = (fov, aspect, near, far) => {
        this.matrix = Matrix4.perspectiveMatrix(fov, aspect, near, far)
        return this
    }
    setInverseOf = (matrix) => {
      const inverseMatrix = Matrix4.inverseOf(matrix)
      if (inverseMatrix) {
        this.matrix = inverseMatrix
      }
      return this
    }
    /**
     * 求一个矩阵的逆矩阵
     * @param  {Matrix4} matrix 矩阵
     * @return {Float32Array}   矩阵数组
     */
    static inverseOf = (matrix) => {
      let i, s, d, inv, det

      s = matrix.matrix;
      d = new Float32Array(16);
      inv = new Float32Array(16);

      inv[0]  =   s[5]*s[10]*s[15] - s[5] *s[11]*s[14] - s[9] *s[6]*s[15]
                + s[9]*s[7] *s[14] + s[13]*s[6] *s[11] - s[13]*s[7]*s[10];
      inv[4]  = - s[4]*s[10]*s[15] + s[4] *s[11]*s[14] + s[8] *s[6]*s[15]
                - s[8]*s[7] *s[14] - s[12]*s[6] *s[11] + s[12]*s[7]*s[10];
      inv[8]  =   s[4]*s[9] *s[15] - s[4] *s[11]*s[13] - s[8] *s[5]*s[15]
                + s[8]*s[7] *s[13] + s[12]*s[5] *s[11] - s[12]*s[7]*s[9];
      inv[12] = - s[4]*s[9] *s[14] + s[4] *s[10]*s[13] + s[8] *s[5]*s[14]
                - s[8]*s[6] *s[13] - s[12]*s[5] *s[10] + s[12]*s[6]*s[9];

      inv[1]  = - s[1]*s[10]*s[15] + s[1] *s[11]*s[14] + s[9] *s[2]*s[15]
                - s[9]*s[3] *s[14] - s[13]*s[2] *s[11] + s[13]*s[3]*s[10];
      inv[5]  =   s[0]*s[10]*s[15] - s[0] *s[11]*s[14] - s[8] *s[2]*s[15]
                + s[8]*s[3] *s[14] + s[12]*s[2] *s[11] - s[12]*s[3]*s[10];
      inv[9]  = - s[0]*s[9] *s[15] + s[0] *s[11]*s[13] + s[8] *s[1]*s[15]
                - s[8]*s[3] *s[13] - s[12]*s[1] *s[11] + s[12]*s[3]*s[9];
      inv[13] =   s[0]*s[9] *s[14] - s[0] *s[10]*s[13] - s[8] *s[1]*s[14]
                + s[8]*s[2] *s[13] + s[12]*s[1] *s[10] - s[12]*s[2]*s[9];

      inv[2]  =   s[1]*s[6]*s[15] - s[1] *s[7]*s[14] - s[5] *s[2]*s[15]
                + s[5]*s[3]*s[14] + s[13]*s[2]*s[7]  - s[13]*s[3]*s[6];
      inv[6]  = - s[0]*s[6]*s[15] + s[0] *s[7]*s[14] + s[4] *s[2]*s[15]
                - s[4]*s[3]*s[14] - s[12]*s[2]*s[7]  + s[12]*s[3]*s[6];
      inv[10] =   s[0]*s[5]*s[15] - s[0] *s[7]*s[13] - s[4] *s[1]*s[15]
                + s[4]*s[3]*s[13] + s[12]*s[1]*s[7]  - s[12]*s[3]*s[5];
      inv[14] = - s[0]*s[5]*s[14] + s[0] *s[6]*s[13] + s[4] *s[1]*s[14]
                - s[4]*s[2]*s[13] - s[12]*s[1]*s[6]  + s[12]*s[2]*s[5];

      inv[3]  = - s[1]*s[6]*s[11] + s[1]*s[7]*s[10] + s[5]*s[2]*s[11]
                - s[5]*s[3]*s[10] - s[9]*s[2]*s[7]  + s[9]*s[3]*s[6];
      inv[7]  =   s[0]*s[6]*s[11] - s[0]*s[7]*s[10] - s[4]*s[2]*s[11]
                + s[4]*s[3]*s[10] + s[8]*s[2]*s[7]  - s[8]*s[3]*s[6];
      inv[11] = - s[0]*s[5]*s[11] + s[0]*s[7]*s[9]  + s[4]*s[1]*s[11]
                - s[4]*s[3]*s[9]  - s[8]*s[1]*s[7]  + s[8]*s[3]*s[5];
      inv[15] =   s[0]*s[5]*s[10] - s[0]*s[6]*s[9]  - s[4]*s[1]*s[10]
                + s[4]*s[2]*s[9]  + s[8]*s[1]*s[6]  - s[8]*s[2]*s[5];

      det = s[0]*inv[0] + s[1]*inv[4] + s[2]*inv[8] + s[3]*inv[12];
      if (det === 0) {
        return
      }

      det = 1 / det;
      for (i = 0; i < 16; i++) {
        d[i] = inv[i] * det;
      }

      return d
    }
    /**
     * 获取透视投影矩阵
     * @param  fov    指定垂直视角，即可视空间顶面和底面间的夹角，必须大于0
     * @param  aspect 指定近剪裁面的宽高比（宽度／高度）
     * @param  near   指定近剪裁面的位置，即可视空间的近边界
     * @param  far    指定远剪裁面的位置，即可视空间的远边界
     * @return matrix 透视投影矩阵
     */
    static perspectiveMatrix = (fov, aspect, near, far) => {
        let matrix, rd, s, ct

        if (near === far || aspect === 0) {
          throw 'null frustum'
        }
        if (near <= 0) {
          throw 'near <= 0'
        }
        if (far <= 0) {
          throw 'far <= 0'
        }

        fov = Math.PI * fov / 180 / 2
        s = Math.sin(fov)
        if (s === 0) {
          throw 'null frustum'
        }
        rd = 1 / (far - near)
        ct = Math.cos(fov) / s

        matrix = new Float32Array(16)

        matrix[0]  = ct / aspect
        matrix[1]  = 0
        matrix[2]  = 0
        matrix[3]  = 0

        matrix[4]  = 0
        matrix[5]  = ct
        matrix[6]  = 0
        matrix[7]  = 0

        matrix[8]  = 0
        matrix[9]  = 0
        matrix[10] = -(far + near) * rd
        matrix[11] = -1

        matrix[12] = 0
        matrix[13] = 0
        matrix[14] = -2 * near * far * rd
        matrix[15] = 0
        return matrix
    }
    static orthoMatrix = (left, right, bottom, top, near, far) => {
        let matrix, rw, rh, rd;

        if (left === right || bottom === top || near === far) {
          throw 'null frustum';
        }

        rw = 1 / (right - left);
        rh = 1 / (top - bottom);
        rd = 1 / (far - near);

        matrix = new Float32Array(16)

        matrix[0]  = 2 * rw;
        matrix[1]  = 0;
        matrix[2]  = 0;
        matrix[3]  = 0;

        matrix[4]  = 0;
        matrix[5]  = 2 * rh;
        matrix[6]  = 0;
        matrix[7]  = 0;

        matrix[8]  = 0;
        matrix[9]  = 0;
        matrix[10] = -2 * rd;
        matrix[11] = 0;

        matrix[12] = -(right + left) * rw;
        matrix[13] = -(top + bottom) * rh;
        matrix[14] = -(far + near) * rd;
        matrix[15] = 1;

        return matrix
    }
    static viewMatrix = (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ)=>{
        let e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz

        fx = centerX - eyeX
        fy = centerY - eyeY
        fz = centerZ - eyeZ

        // Normalize f.
        rlf = 1 / Math.sqrt(fx*fx + fy*fy + fz*fz)
        fx *= rlf
        fy *= rlf
        fz *= rlf

        // Calculate cross product of f and up.
        sx = fy * upZ - fz * upY
        sy = fz * upX - fx * upZ
        sz = fx * upY - fy * upX

        // Normalize s.
        rls = 1 / Math.sqrt(sx*sx + sy*sy + sz*sz)
        sx *= rls
        sy *= rls
        sz *= rls

        // Calculate cross product of s and f.
        ux = sy * fz - sz * fy
        uy = sz * fx - sx * fz
        uz = sx * fy - sy * fx

        let matrix = new Float32Array(16)
        matrix[0] = sx
        matrix[1] = ux
        matrix[2] = -fx
        matrix[3] = 0

        matrix[4] = sy
        matrix[5] = uy
        matrix[6] = -fy
        matrix[7] = 0

        matrix[8] = sz
        matrix[9] = uz
        matrix[10] = -fz
        matrix[11] = 0

        matrix[12] = 0
        matrix[13] = 0
        matrix[14] = 0
        matrix[15] = 1

        return Matrix4.multiply(matrix,Matrix4.translateMatrix(-eyeX, -eyeY, -eyeZ))
    }
    static rotateMatrix = (angel,x,y,z) => {
        let radian = Math.PI * angel / 180.0
        let s = Math.sin(radian)
        let c = Math.cos(radian)

        if (x!==0&&y===0&&z===0) {
            if (x < 0) {
              s = -s
            }
            return Matrix4.rotateXMatrix(s,c)
        }
        if (x===0&&y!==0&&z===0) {
            if (y < 0) {
              s = -s
            }
            return Matrix4.rotateYMatrix(s,c)
        }
        if (x===0&&y===0&&z!==0) {
            if (z<0) {
                s = -s
            }
            return Matrix4.rotateZMatrix(s,c)
        }
        let matrix = new Float32Array(16)
        len = Math.sqrt(x*x + y*y + z*z)
        if (len !== 1) {
          rlen = 1 / len
          x *= rlen
          y *= rlen
          z *= rlen
        }
        nc = 1 - c
        xy = x * y
        yz = y * z
        zx = z * x
        xs = x * s
        ys = y * s
        zs = z * s

        matrix[ 0] = x*x*nc +  c
        matrix[ 1] = xy *nc + zs
        matrix[ 2] = zx *nc - ys
        matrix[ 3] = 0

        matrix[ 4] = xy *nc - zs
        matrix[ 5] = y*y*nc +  c
        matrix[ 6] = yz *nc + xs
        matrix[ 7] = 0

        matrix[ 8] = zx *nc + ys
        matrix[ 9] = yz *nc - xs
        matrix[10] = z*z*nc +  c
        matrix[11] = 0

        matrix[12] = 0
        matrix[13] = 0
        matrix[14] = 0
        matrix[15] = 1

        return matrix
    }
    static translateMatrix = (x,y,z)=>{
        return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1])
    }
    static scaleMatrix = (Sx,Sy,Sz)=>{
        return new Float32Array([Sx,0,0,0, 0,Sy,0,0, 0,0,Sz,0, 0,0,0,1])
    }
    static unitMatrix4 = ()=>{
        return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1])
    }
    static rotateXMatrix = (s,c)=>{
        return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1])
    }
    static rotateYMatrix = (s,c)=>{
        return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1])
    }
    static rotateZMatrix = (s,c)=>{
        return new Float32Array([c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1])
    }
    static add = (matrix1,matrix2)=>{
        const len1 = matrix1.length, len2 = matrix2.length
        if (len1 != len2) {
            throw '矩阵1和矩阵2长度不一致'
        }
        let matrix = new Float32Array(len1)
        for (let i = 0; i < len1; i++) {
            matrix[i] = matrix1[i] + matrix2[i]
        }
        return matrix
    }
    static subtract = (matrix1,matrix2)=>{
        let matrix = new Float32Array(16)
        for (let i = 0; i < 16; i++) {
            matrix[i] = matrix1[i] - matrix2[i]
        }
        return matrix
    }
    static multiply = (matrix1,matrix2)=>{
        let matrix = new Float32Array(16)

        matrix[0] = matrix1[0]*matrix2[0] + matrix1[4]*matrix2[1] + matrix1[8]*matrix2[2] + matrix1[12]*matrix2[3]
        matrix[4] = matrix1[0]*matrix2[4] + matrix1[4]*matrix2[5] + matrix1[8]*matrix2[6] + matrix1[12]*matrix2[7]
        matrix[8] = matrix1[0]*matrix2[8] + matrix1[4]*matrix2[9] + matrix1[8]*matrix2[10] + matrix1[12]*matrix2[11]
        matrix[12] = matrix1[0]*matrix2[12] + matrix1[4]*matrix2[13] + matrix1[8]*matrix2[14] + matrix1[12]*matrix2[15]

        matrix[1] = matrix1[1]*matrix2[0] + matrix1[5]*matrix2[1] + matrix1[9]*matrix2[2] + matrix1[13]*matrix2[3]
        matrix[5] = matrix1[1]*matrix2[4] + matrix1[5]*matrix2[5] + matrix1[9]*matrix2[6] + matrix1[13]*matrix2[7]
        matrix[9] = matrix1[1]*matrix2[8] + matrix1[5]*matrix2[9] + matrix1[9]*matrix2[10] + matrix1[13]*matrix2[11]
        matrix[13] = matrix1[1]*matrix2[12] + matrix1[5]*matrix2[13] + matrix1[9]*matrix2[14] + matrix1[13]*matrix2[15]

        matrix[2] = matrix1[2]*matrix2[0] + matrix1[6]*matrix2[1] + matrix1[10]*matrix2[2] + matrix1[14]*matrix2[3]
        matrix[6] = matrix1[2]*matrix2[4] + matrix1[6]*matrix2[5] + matrix1[10]*matrix2[6] + matrix1[14]*matrix2[7]
        matrix[10] = matrix1[2]*matrix2[8] + matrix1[6]*matrix2[9] + matrix1[10]*matrix2[10] + matrix1[14]*matrix2[11]
        matrix[14] = matrix1[2]*matrix2[12] + matrix1[6]*matrix2[13] + matrix1[10]*matrix2[14] + matrix1[14]*matrix2[15]

        matrix[3] = matrix1[3]*matrix2[0] + matrix1[7]*matrix2[1] + matrix1[11]*matrix2[2] + matrix1[15]*matrix2[3]
        matrix[7] = matrix1[3]*matrix2[4] + matrix1[7]*matrix2[5] + matrix1[11]*matrix2[6] + matrix1[15]*matrix2[7]
        matrix[11] = matrix1[3]*matrix2[8] + matrix1[7]*matrix2[9] + matrix1[11]*matrix2[10] + matrix1[15]*matrix2[11]
        matrix[15] = matrix1[3]*matrix2[12] + matrix1[7]*matrix2[13] + matrix1[11]*matrix2[14] + matrix1[15]*matrix2[15]

        return matrix
    }
}
module.exports = Matrix4
