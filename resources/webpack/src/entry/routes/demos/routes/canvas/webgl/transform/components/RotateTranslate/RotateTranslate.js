import React from 'react'
import ReactDOM from 'react-dom'

import {initShaders} from 'WeBGLUtils'
import Matrix4 from 'Matrix4'

//顶点着色器
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_xformMatrix;
    void main(){
        gl_Position = u_xformMatrix*a_Position;
    }
`

//片元着色器
const FSHADER_SOURCE = `
    void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`

class RotateTranslate extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        const canvas = ReactDOM.findDOMNode(this.refs['canvas'])

        const gl = canvas.getContext('webgl')

        if (!gl) {
            console.log('Failed to get the rendering context for WebGL')
            return
        }

        if (!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)) {
            console.log('Failed to intialize shaders.')
            return
        }

        const n = this.initVertexBuffers(gl)
        if (n<0) {
            console.log('Failed to set the positions of the vertices')
            return
        }
        const matrix4 = new Matrix4()
        matrix4.translate(0.5,0,0)
        matrix4.rotate(60,0,0,1)
        let xformMatrix = matrix4.matrix

        const u_xformMatrix = gl.getUniformLocation(gl.program,'u_xformMatrix')
        if (!u_xformMatrix) {
            return
        }
        gl.uniformMatrix4fv(u_xformMatrix,false,xformMatrix)

        gl.clearColor(0.0, 0.0, 0.0, 1.0)

        gl.clear(gl.COLOR_BUFFER_BIT)

        gl.drawArrays(gl.TRIANGLES,0,n)
    }
    initVertexBuffers=(gl)=>{
        const vertexs = new Float32Array([
            0.0,0.3, -0.3,-0.3, 0.3,-0.3
        ])

        const vertexBuffer = gl.createBuffer()
        if (!vertexBuffer) {
            console.log('Failed to create the buffer object')
            return -1
        }

        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer)

        gl.bufferData(gl.ARRAY_BUFFER,vertexs,gl.STATIC_DRAW)

        const a_Position = gl.getAttribLocation(gl.program,'a_Position')
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position')
            return -1
        }

        gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0)

        gl.enableVertexAttribArray(a_Position)

        return 3
    }
    render() {
        return (
            <div>
                <div style={{fontSize:'28px',margin:'40px 0'}}>{'RotateAndTranslate'}</div>
                <div>
                    <canvas ref="canvas">
                        {'the brower don`t support canvas,please change another brower'}
                    </canvas>
                </div>
            </div>
        )
    }
}
module.exports = RotateTranslate
