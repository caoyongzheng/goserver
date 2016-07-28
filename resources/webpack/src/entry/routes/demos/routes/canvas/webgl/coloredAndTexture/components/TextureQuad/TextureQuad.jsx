import React from 'react'
import ReactDOM from 'react-dom'

import { initShaders } from 'WeBGLUtils'

import sky from '../../images/sky.jpg'

class TextureQuad extends React.Component {
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
      uniform sampler2D u_Sampler;
      varying vec2 v_TexCoord;
      void main(){
          gl_FragColor = texture2D(u_Sampler, v_TexCoord);
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
      -0.5, 0.5, 0.0, 2.0,
      -0.5, -0.5, 0.0, 0.0,
      0.5, 0.5, 2.0, 2.0,
      0.5, -0.5, 2.0, 0.0,
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

    // aTexCoord
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
    const texture = gl.createTexture()

    // u_Sampler
    const uSampler = gl.getUniformLocation(gl.program, 'u_Sampler')
    if (!uSampler) {
      console.log('Failed to get the storage location of u_Sampler')
      return
    }

    const image = new Image()
    image.onload = () => {
      this.loadTexture(gl, n, texture, uSampler, image)
    }
    image.src = sky
  }
  loadTexture = (gl, n, texture, uSampler, image) => {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
    gl.uniform1i(uSampler, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
  }
  render() {
    return (
      <div>
        <div style={{ fontSize: '28px', margin: '40px 0' }}>{'四边形纹理'}</div>
        <div>
          <canvas ref="canvas">
            {'the brower don`t support canvas, please change another brower'}
          </canvas>
        </div>
      </div>
    )
  }
}

module.exports = TextureQuad
