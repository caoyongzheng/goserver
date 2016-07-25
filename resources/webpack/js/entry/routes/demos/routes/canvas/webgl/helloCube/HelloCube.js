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

class HelloCube extends React.Component {
  constructor(props) {
      super(props)
  }
  componentDidMount() {
      try {
          const canvas = ReactDOM.findDOMNode(this.refs['canvas'])
          canvas.width = 500
          canvas.height = 500

          const gl = canvas.getContext('webgl')

          if (!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)) {
              console.log('Faild to init Shaders')
              return
          }

          const n = this.initVertexBuffer(gl)

          gl.clearColor(0.0,0.0,0.0,1.0)
          gl.enable(gl.DEPTH_TEST)

          const u_MvpMatrix = gl.getUniformLocation(gl.program,'u_MvpMatrix')
          if (!u_MvpMatrix) {
              console.log('Failed to get the storage location of u_MvpMatrix')
              return
          }

          const mvpMatrix = new Matrix4()
          mvpMatrix.setView(3, 3, 7, 0, 0, 0, 0, 1, 0)
                      .perspective(30, 1, 1, 100)
          gl.uniformMatrix4fv(u_MvpMatrix,false,mvpMatrix.matrix)

          gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)

          gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0)
      } catch (e) {
          console.log(e)
      }
  }
  initVertexBuffer = (gl) => {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    const vertexs = new Float32Array([
      // Vertex coordinates and color
      1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
      -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
      -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
      1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
      1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
      1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
      -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
      -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black
    ])

    // Indices of the vertices
    const indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        0, 3, 4,   0, 4, 5,    // right
        0, 5, 6,   0, 6, 1,    // up
        1, 6, 7,   1, 7, 2,    // left
        7, 4, 3,   7, 3, 2,    // down
        4, 7, 6,   4, 6, 5     // back
    ])

    const FSIZE = vertexs.BYTES_PER_ELEMENT

    const vertexBuffer = gl.createBuffer()
    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,vertexs,gl.STATIC_DRAW)

    //a_Position
    const a_Position = gl.getAttribLocation(gl.program,'a_Position')
    if (a_Position < 0) {
        throw 'Failed to get the storage location of a_Position'
    }
    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,FSIZE * 6,0)
    gl.enableVertexAttribArray(a_Position)

    //a_Color
    const a_Color = gl.getAttribLocation(gl.program,'a_Color')
    if (a_Color < 0) {
        throw 'Failed to get the storage location of a_Color'
    }
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,FSIZE * 6,FSIZE*3)
    gl.enableVertexAttribArray(a_Color)

    // Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return indices.length
  }
  render() {
    return (
      <figure>
        <figcaption>{'立方体'}</figcaption>
        <canvas ref="canvas">
          {'your current brower don\'t support canvas,please change another one'}
        </canvas>
      </figure>
    )
  }
}
module.exports = HelloCube
