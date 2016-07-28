import React from 'react'
import ReactDOM from 'react-dom'

import { initShaders } from 'WeBGLUtils'

import sky from '../../images/sky.jpg'
import circle from '../../images/circle.gif'

class MultiTexture extends React.Component {
  constructor(props) {
    super(props)
    this.VSHADER_SOURCE = `
      precision mediump float;
      attribute vec4 a_Position;
      attribute vec2 a_TexCoord;
      varying vec2 v_TexCoord;
      void main(){
          gl_Position = a_Position;
          v_TexCoord = a_TexCoord;
      }
    `

    this.FSHADER_SOURCE = `
      precision mediump float;
      uniform sampler2D u_Sampler0;
      uniform sampler2D u_Sampler1;
      varying vec2 v_TexCoord;
      void main(){
          vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
          vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
          gl_FragColor = color0*color1;
      }
    `
  }
  componentDidMount() {
    try {
      const canvas = ReactDOM.findDOMNode(this.refs.canvas)
      const gl = canvas.getContext('webgl')
      if (!gl) {
        console.log('Failed to get the rendering context for WebGL')
        return
      }

      if (!initShaders(gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders')
        return
      }

      const n = this.initVertexBuffers(gl)

      gl.clearColor(0.0, 0.0, 0.0, 1.0)

      this.initTextures(gl, n)
    } catch (e) {
      console.log(e)
    }
  }
  initVertexBuffers = (gl) => {
    const vertexs = new Float32Array([
      -0.5, 0.5, 0.0, 1.0,
      -0.5, -0.5, 0.0, 0.0,
      0.5, 0.5, 1.0, 1.0,
      0.5, -0.5, 1.0, 0.0,
    ])

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW)

    const FSIZE = vertexs.BYTES_PER_ELEMENT

    // aPosition
    const aPosition = gl.getAttribLocation(gl.program, 'a_Position')
    if (aPosition < 0) {
      console.log('Failed to get the storage location of a_Position')
      return -1
    }
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 4, 0)
    gl.enableVertexAttribArray(aPosition)

    // a_TexCoord
    const aTexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord')
    if (aTexCoord < 0) {
      console.log('Failed to get the storage location of a_TexCoord')
      return -1
    }
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
    gl.enableVertexAttribArray(aTexCoord)
    return 4
  }
  initTextures = (gl, n) => {
    const texture0 = gl.createTexture()
    const texture1 = gl.createTexture()

    // u_Sampler
    const uSampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0')
    if (!uSampler0) {
      console.log('Failed to get the storage location of u_Sampler0')
      return
    }
    const uSampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1')
    if (!uSampler1) {
      console.log('Failed to get the storage location of u_Sampler1')
      return
    }

    const image0 = new Image()
    const image1 = new Image()
    image0.onload = () => {
      this.loadTexture(gl, n, texture0, uSampler0, image0, 0)
    }
    image1.onload = () => {
      this.loadTexture(gl, n, texture1, uSampler1, image1, 1)
    }
    image0.src = sky
    image1.src = circle
  }
  loadTexture = (gl, n, texture, uSampler, image, index) => {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.activeTexture(gl[`TEXTURE${index}`])
    this[`TEXTURE${index}`] = true
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
    gl.uniform1i(uSampler, index)
    if (this.TEXTURE0 && this.TEXTURE1) {
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
    }
  }
  render() {
    return (
      <div>
        <div style={{ fontSize: '28px', margin: '40px 0' }}>{'多纹理纹理叠加'}</div>
        <div>
          <canvas ref="canvas">
            {'the brower don`t support canvas, please change another brower'}
          </canvas>
        </div>
      </div>
    )
  }
}

module.exports = MultiTexture
