import React from 'react'
import ReactDOM from 'react-dom'

import {initShaders} from 'WeBGLUtils'

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

class PerspectiveView extends React.Component {
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
            gl.enable(gl.DEPTH_TEST)
            gl.clearColor(0.0,0.0,0.0,1.0)
            const n = this.initVertexBuffer(gl)

            const u_MvpMatrix = gl.getUniformLocation(gl.program,'u_MvpMatrix')
            if (!u_MvpMatrix) {
                console.log('Failed to get the storage location of u_MvpMatrix')
                return
            }
            const mvpMatrix = new Matrix4()
            gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
            mvpMatrix.setTranslate(0.75, 0, 0)
                        .view(0, 0, 5, 0, 0, -100, 0, 1, 0)
                        .perspective(30, canvas.width/canvas.height, 1, 100)
            gl.uniformMatrix4fv(u_MvpMatrix,false,mvpMatrix.matrix)
            gl.drawArrays(gl.TRIANGLES, 0, n)

            mvpMatrix.setTranslate(-0.75, 0, 0)
                        .view(0, 0, 5, 0, 0, -100, 0, 1, 0)
                        .perspective(30, canvas.width/canvas.height, 1, 100)
            gl.uniformMatrix4fv(u_MvpMatrix,false,mvpMatrix.matrix)
            gl.drawArrays(gl.TRIANGLES, 0, n)

        } catch (e) {
            console.log(e)
        }
    }
    initVertexBuffer = (gl) => {
        const vertexs = new Float32Array([
            // Vertex coordinates and color
            0.0,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
            -0.5, -1.0,  -4.0,  0.4,  1.0,  0.4,
            0.5, -1.0,  -4.0,  1.0,  0.4,  0.4,

            0.0,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
            -0.5, -1.0,  -2.0,  1.0,  1.0,  0.4,
            0.5, -1.0,  -2.0,  1.0,  0.4,  0.4,

            0.0,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one
            -0.5, -1.0,   0.0,  0.4,  0.4,  1.0,
            0.5, -1.0,   0.0,  1.0,  0.4,  0.4
        ])

        const FSIZE = vertexs.BYTES_PER_ELEMENT

        const vertexBuffer = gl.createBuffer()
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

        return 9
    }
    render() {
        return (
            <figure>
                <figcaption>{'透视投影'}</figcaption>
                <canvas ref="canvas">
                    {'your current brower don\'t support canvas,please change another one'}
                </canvas>
            </figure>
        )
    }
}
module.exports = PerspectiveView
