import React from 'react'
import ReactDOM from 'react-dom'

import { initShaders } from 'WeBGLUtils'

// 顶点着色器
const VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    void main(){
        gl_Position = a_Position;
        v_Color = a_Color;
    }
`

// 片元着色器
const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor = v_Color;
    }
`

class ColoredTriangle extends React.Component {
  componentDidMount() {
    const canvas = ReactDOM.findDOMNode(this.refs.canvas)

    const gl = canvas.getContext('webgl')

    if (!gl) {
      console.log('Failed to get the rendering context for WebGL')
      return
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.')
      return
    }

    const n = this.initVertexBuffers(gl)
    if (n < 0) {
      console.log('Failed to set the positions of the vertices')
      return
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLES, 0, n)
  }
  initVertexBuffers = (gl) => {
    const vertexsColors = new Float32Array([
      0.0, 0.5, 1.0, 0.0, 0.0,
      -0.5, -0.5, 0.0, 1.0, 0.0,
      0.5, -0.5, 0.0, 0.0, 1.0,
    ])
    const vertexColorBuffer = gl.createBuffer()
    if (!vertexColorBuffer) {
      console.log('Failed to create the buffer object')
      return -1
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)

    gl.bufferData(gl.ARRAY_BUFFER, vertexsColors, gl.STATIC_DRAW)

    const FSIZE = vertexsColors.BYTES_PER_ELEMENT

    // a_Position
    const aPosition = gl.getAttribLocation(gl.program, 'a_Position')
    if (aPosition < 0) {
      console.log('Failed to get the storage location of a_Position')
      return -1
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 5, 0)

    gl.enableVertexAttribArray(aPosition)

    // a_Color
    const aColor = gl.getAttribLocation(gl.program, 'a_Color')
    if (aColor < 0) {
      console.log('Failed to get the storage location of a_Color')
      return -1
    }

    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2)

    gl.enableVertexAttribArray(aColor)
    return 3
  }
  render() {
    return (
      <div>
        <div style={{ fontSize: '28px', margin: '40px 0' }}>{'彩色三角形'}</div>
        <div>
          <canvas ref="canvas">
            {'the brower don`t support canvas, please change another brower'}
          </canvas>
        </div>
      </div>
    )
  }
}
module.exports = ColoredTriangle
