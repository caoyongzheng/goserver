import React from 'react'
import ReactDOM from 'react-dom'

import { initShaders } from 'WeBGLUtils'
import { Vector3 } from 'Vector'

import Matrix4 from 'Matrix4'

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    attribute vec4 a_Normal;
    uniform mat4 u_MvpMatrix;
    uniform mat4 uMormalMatrix;
    uniform vec3 u_LightColor;
    uniform vec3 u_LightDirection;
    uniform vec3 u_AmbientLight;
    varying vec4 v_Color;
    void main(){
        gl_Position = u_MvpMatrix * a_Position;
        vec3 normal = normalize(vec3(uMormalMatrix * a_Normal));
        float nDotL = max(dot(u_LightDirection, normal), 0.0);
        vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;
        vec3 ambient = u_AmbientLight * a_Color.rgb;
        v_Color = vec4(diffuse + ambient, a_Color.a);
    }
`

const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor = v_Color;
    }
`

class LightedTranslatedRotatedCube extends React.Component {
  componentDidMount() {
    try {
      const canvas = ReactDOM.findDOMNode(this.refs.canvas)
      canvas.width = 500
      canvas.height = 500

      const gl = canvas.getContext('webgl')

      if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Faild to init Shaders')
        return
      }

      const n = this.initVertexBuffers(gl)
      if (n < 0) {
        console.log('Failed to set the vertex information')
        return
      }

      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.enable(gl.DEPTH_TEST)

      const uMvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
      const uLightColor = gl.getUniformLocation(gl.program, 'u_LightColor')
      const uLightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection')
      const uAmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight')
      const uNormalMatrix = gl.getUniformLocation(gl.program, 'uMormalMatrix')
      if (!uMvpMatrix || !uLightColor || !uLightDirection || !uAmbientLight || !uNormalMatrix) {
        console.log('Failed to get the storage location')
        return
      }
      // Set the light color (white)
      gl.uniform3f(uLightColor, 1.0, 1.0, 1.0)
      // Set the light direction (in the world coordinate)
      const lightDirection = new Vector3([0.5, 3.0, 4.0])
      lightDirection.normalize()
      gl.uniform3fv(uLightDirection, lightDirection.elements)
      // Set the ambient light
      gl.uniform3f(uAmbientLight, 0.2, 0.2, 0.2)

      //  模型矩阵
      const modelMatrix = new Matrix4()
      modelMatrix.setRotate(90, 0, 0, 1)
      modelMatrix.translate(0, 0.9, 0)

      // 向量矩阵
      const normalMatrix = new Matrix4()
      normalMatrix.setInverseOf(modelMatrix)
      normalMatrix.transpose()
      gl.uniformMatrix4fv(uNormalMatrix, false, normalMatrix.matrix)

      // 视图模型矩阵
      const mvpMatrix = new Matrix4()
      mvpMatrix.setView(3, 3, 7, 0, 0, 0, 0, 1, 0)
                .perspective(30, canvas.width / canvas.height, 1, 100)
                .multiply(modelMatrix.matrix)
      gl.uniformMatrix4fv(uMvpMatrix, false, mvpMatrix.matrix)

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
    } catch (e) {
      console.log(e)
    }
  }
  initVertexBuffers = (gl) => {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    const vertexs = new Float32Array([
      1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,  // v0-v1-v2-v3 front
      1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,  // v0-v3-v4-v5 right
      1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
      -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,  // v1-v6-v7-v2 left
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,  // v7-v4-v3-v2 down
      1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0,  // v4-v7-v6-v5 back
    ])

    const colors = new Float32Array([     // Colors
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v0-v1-v2-v3 front
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v0-v3-v4-v5 right
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v0-v5-v6-v1 up
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v1-v6-v7-v2 left
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v7-v4-v3-v2 down
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v4-v7-v6-v5 back
    ])

    const normals = new Float32Array([    // Normal
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
      -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,  // v7-v4-v3-v2 down
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,   // v4-v7-v6-v5 back
    ])

     // Indices of the vertices
    const indices = new Uint8Array([
      0, 1, 2, 0, 2, 3,    // front
      4, 5, 6, 4, 6, 7,    // right
      8, 9, 10, 8, 10, 11,    // up
      12, 13, 14, 12, 14, 15,    // left
      16, 17, 18, 16, 18, 19,    // down
      20, 21, 22, 20, 22, 23,    // back
    ])

    // Create a buffer object
    const indexBuffer = gl.createBuffer()
    if (!indexBuffer) {
      return -1
    }

    // Write the vertex coordinates and color to the buffer object
    if (!this.initArrayBuffer(gl, vertexs, 3, gl.FLOAT, 'a_Position')) {
      return -1
    }
    if (!this.initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) {
      return -1
    }
    if (!this.initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal')) {
      return -1
    }

    // Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return indices.length
  }
  initArrayBuffer=(gl, data, num, type, attribute) => {
    const buffer = gl.createBuffer()   // Create a buffer object
    if (!buffer) {
      console.log('Failed to create the buffer object')
      return false
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    // Assign the buffer object to the attribute variable
    const aAttribute = gl.getAttribLocation(gl.program, attribute)
    if (aAttribute < 0) {
      console.log(`Failed to get the storage location of ${attribute}`)
      return false
    }
    gl.vertexAttribPointer(aAttribute, num, type, false, 0, 0)
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(aAttribute)

    return true
  }
  render() {
    return (
      <figure>
        <figcaption>{'光照平移旋转立方体'}</figcaption>
        <canvas ref="canvas">
          {'your current brower don\'t support canvas,please change another one'}
        </canvas>
      </figure>
    )
  }
}
module.exports = LightedTranslatedRotatedCube
