import React from 'react'
import ReactDOM from 'react-dom'

import { initShaders } from 'WeBGLUtils'

import Matrix4 from 'Matrix4'

const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_MvpMatrix;
  varying vec4 v_Color;
  void main(){
      gl_Position = u_MvpMatrix * a_Position;
      v_Color = a_Color;
  }
`

const FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_Color;
  void main(){
      gl_FragColor = v_Color;
  }
`

class ColoredCube extends React.Component {
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
      if (!uMvpMatrix) {
        console.log('Failed to get the storage location of u_MvpMatrix')
        return
      }

      const mvpMatrix = new Matrix4()
      mvpMatrix.setView(3, 3, 7, 0, 0, 0, 0, 1, 0)
                  .perspective(30, 1, 1, 100)
      gl.uniformMatrix4fv(uMvpMatrix, false, mvpMatrix.matrix)

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
    } catch (e) {
      console.log(e)
    }
  }
  initVertexBuffers = (gl) => {
    //  Create a cube
    //     v6----- v5
    //    /|      /|
    //   v1------v0|
    //   | |     | |
    //   | |v7---|-|v4
    //   |/      |/
    //   v2------v3
    const vertexs = new Float32Array([
      1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,   //  v0-v1-v2-v3 front
      1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,   //  v0-v3-v4-v5 right
      1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,   //  v0-v5-v6-v1 up
      -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,   //  v1-v6-v7-v2 left
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,   //  v7-v4-v3-v2 down
      1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0,   //  v4-v7-v6-v5 back
    ])

    //  Colors
    const colors = new Float32Array([
      0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0,   //  v0-v1-v2-v3 front(blue)
      0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4,   //  v0-v3-v4-v5 right(green)
      1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4,   //  v0-v5-v6-v1 up(red)
      1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4,   //  v1-v6-v7-v2 left
      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,   //  v7-v4-v3-v2 down
      0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0,   //  v4-v7-v6-v5 back
    ])

     //  Indices of the vertices
    const indices = new Uint8Array([
      0, 1, 2, 0, 2, 3,     //  front
      4, 5, 6, 4, 6, 7,     //  right
      8, 9, 10, 8, 10, 11,     //  up
      12, 13, 14, 12, 14, 15,     //  left
      16, 17, 18, 16, 18, 19,     //  down
      20, 21, 22, 20, 22, 23,     //  back
    ])

    //  Create a buffer object
    const indexBuffer = gl.createBuffer()
    if (!indexBuffer) {
      return -1
    }

    //  Write the vertex coordinates and color to the buffer object
    if (!this.initArrayBuffer(gl, vertexs, 3, gl.FLOAT, 'a_Position')) {
      return -1
    }

    if (!this.initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) {
      return -1
    }

    //  Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return indices.length
  }
  initArrayBuffer = (gl, data, num, type, attribute) => {
    //  Create a buffer object
    const buffer = gl.createBuffer()
    if (!buffer) {
      console.log('Failed to create the buffer object')
      return false
    }
    //  Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    //  Assign the buffer object to the attribute variable
    const aAttribute = gl.getAttribLocation(gl.program, attribute)
    if (aAttribute < 0) {
      console.log(`Failed to get the storage location of ${attribute}`)
      return false
    }
    gl.vertexAttribPointer(aAttribute, num, type, false, 0, 0)
    //  Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(aAttribute)

    return true
  }
  render() {
    return (
      <figure>
        <figcaption>{'单一颜色立方体'}</figcaption>
        <canvas ref="canvas">
          {'your current brower don\'t support canvas, please change another one'}
        </canvas>
      </figure>
    )
  }
}
module.exports = ColoredCube
