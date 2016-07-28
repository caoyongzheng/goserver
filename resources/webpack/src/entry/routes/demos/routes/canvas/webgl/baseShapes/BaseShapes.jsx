import React from 'react'
import ReactDOM from 'react-dom'

import styles from './BaseShapes.scss'

import { initShaders } from 'WeBGLUtils'

class BaseShapes extends React.Component {
  constructor(props) {
    super(props)
    // 定点着色器程序with size
    this.VSHADER_SOURCE1 = `
        attribute vec4 a_Position;
        void main(){
            gl_Position = a_Position;
            gl_PointSize = 10.0;
        }
    `
    // 定点着色器程序with size
    this.VSHADER_SOURCE2 = `
        attribute vec4 a_Position;
        void main(){
            gl_Position = a_Position;
        }
    `
    // 片元着色器程序
    this.FSHADER_SOURCE = `
        void main(){
            gl_FragColor = vec4(1.0,  0.0,  0.0,  1.0);
        }
    `
  }
  componentDidMount() {
    // Triangle
    const vertexs1 = new Float32Array([
      0.0, 0.5, -0.5, -0.5, 0.5, -0.5,
    ])
    const canvas1 = ReactDOM.findDOMNode(this.refs.canvas1)
    const gl1 = this.drawCanvas(canvas1, this.VSHADER_SOURCE1, vertexs1)
    gl1.drawArrays(gl1.POINTS, 0, 3)

    const canvas2 = ReactDOM.findDOMNode(this.refs.canvas2)
    const gl2 = this.drawCanvas(canvas2, this.VSHADER_SOURCE2, vertexs1)
    gl2.drawArrays(gl2.LINE_LOOP, 0, 3)

    const canvas3 = ReactDOM.findDOMNode(this.refs.canvas3)
    const gl3 = this.drawCanvas(canvas3, this.VSHADER_SOURCE2, vertexs1)
    gl3.drawArrays(gl3.TRIANGLES, 0, 3)

    // Rectangle
    const vertexs2 = new Float32Array([
      -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5,
    ])

    const canvas4 = ReactDOM.findDOMNode(this.refs.canvas4)
    const gl4 = this.drawCanvas(canvas4, this.VSHADER_SOURCE2, vertexs2)
    gl4.drawArrays(gl4.TRIANGLE_STRIP, 0, 4)

    const canvas5 = ReactDOM.findDOMNode(this.refs.canvas5)
    const gl5 = this.drawCanvas(canvas5, this.VSHADER_SOURCE2, vertexs2)
    gl5.drawArrays(gl5.TRIANGLE_FAN, 0, 4)
  }
  drawCanvas=(canvas, VSHADER_SOURCE, vertexs) => {
    const gl = canvas.getContext('webgl')
    if (!gl) {
      return null
    }
    if (!initShaders(gl, VSHADER_SOURCE, this.FSHADER_SOURCE)) {
      return null
    }

    // 设置顶点位置
    this.initVertexBuffers(gl, vertexs)

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    return gl
  }
  initVertexBuffers = (gl, vertexs) => {
    const vertexBuffer = gl.createBuffer()
    if (!vertexBuffer) {
      console.log('Failed to create Buffer object')
      return -1
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW)

    const aPosition = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    gl.enableVertexAttribArray(aPosition)

    return 3
  }
  render() {
    return (
      <div>
        <canvas ref="canvas1" className={styles.canvas}>
          {'the brower don`t support canvas, please change another brower'}
        </canvas>
        <canvas ref="canvas2" className={styles.canvas}>
          {'the brower don`t support canvas, please change another brower'}
        </canvas>
        <canvas ref="canvas3" className={styles.canvas}>
          {'the brower don`t support canvas, please change another brower'}
        </canvas>
        <canvas ref="canvas4" className={styles.canvas}>
          {'the brower don`t support canvas, please change another brower'}
        </canvas>
        <canvas ref="canvas5" className={styles.canvas}>
          {'the brower don`t support canvas, please change another brower'}
        </canvas>
      </div>
    )
  }
}

module.exports = BaseShapes
