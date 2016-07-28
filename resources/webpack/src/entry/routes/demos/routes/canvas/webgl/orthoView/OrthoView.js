import React from 'react'
import ReactDOM from 'react-dom'
import {initShaders} from 'WeBGLUtils'
import Matrix4 from 'Matrix4'

const VSHADER_SOURCE=`
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ProjMatrix;
    varying vec4 v_Color;
    void main(){
        gl_Position = u_ProjMatrix*a_Position;
        v_Color = a_Color;
    }
`

const FSHADER_SOURCE=`
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor = v_Color;
    }
`

class OrthoView extends React.Component {
    constructor(props) {
        super(props)
        this.nf = {
            near:0.0,
            far:0.5
        }
    }
    componentDidMount() {
        try {
            const canvas = ReactDOM.findDOMNode(this.refs['canvas'])
            canvas.width = 600
            canvas.height = 600
            const nf = ReactDOM.findDOMNode(this.refs['nearFarInfo'])
            const gl = canvas.getContext('webgl')

            if (!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)) {
                console.log('Faild to init Shaders')
                return
            }
            const n = this.initVertexBuffer(gl)

            const u_ProjMatrix = gl.getUniformLocation(gl.program,'u_ProjMatrix')
            if (!u_ProjMatrix) {
                console.log('Faild to find storage location of u_ProjMatrix')
                return
            }
            const projMatrix = new Matrix4()

            this.keydownFn=(e)=>{this.handleKeyDown(e,gl,n,u_ProjMatrix,projMatrix,nf)}
            document.addEventListener('keydown',this.keydownFn)

            gl.clearColor(0.0, 0.0, 0.0, 1.0)
            this.draw(gl,n,u_ProjMatrix,projMatrix,nf)

        } catch (e) {
            console.log(e)
        }
    }
    componentWillUnmount(){
        document.removeEventListener('keydown',this.keydownFn)
    }
    handleKeyDown=(e,gl,n,u_ProjMatrix,projMatrix,nf)=>{
        switch (e.keyCode) {
        case 39: //右方向键
            this.nf.near += 0.01
            break
        case 37: //左方向键
            this.nf.near -= 0.01
            break
        case 38: //上方向键
            this.nf.far += 0.01
            break
        case 40: //下方向键
            this.nf.far -= 0.01
            break;
        default:
            return
        }
        this.draw(gl,n,u_ProjMatrix,projMatrix,nf)
    }
    draw=(gl,n,u_ProjMatrix,projMatrix,nf)=>{
        projMatrix.setOrtho(-1,1,-1,1,this.nf.near,this.nf.far)

        gl.uniformMatrix4fv(u_ProjMatrix,false,projMatrix.matrix)

        gl.clear(gl.COLOR_BUFFER_BIT)

        nf.innerHTML = `near:${Math.round(this.nf.near*100)/100},far:${Math.round(this.nf.far*100)/100}`

        gl.drawArrays(gl.TRIANGLES,0,n)
    }
    initVertexBuffer=(gl)=>{
        //顶点坐标和颜色
        const vertexs = new Float32Array([
            // Vertex coordinates and color
            0.0 ,  0.6,  -0.4,  0.4,  1.0,  0.4, // The back green one
            -0.5, -0.4,  -0.4,  0.4,  1.0,  0.4,
            0.5 , -0.4,  -0.4,  1.0,  0.4,  0.4,

            0.5 ,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
            -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
            0.0 , -0.6,  -0.2,  1.0,  1.0,  0.4,

            0.0 ,  0.5,   0.0,  0.4,  0.4,  1.0, // The front blue one
            -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
            0.5 , -0.5,   0.0,  1.0,  0.4,  0.4
        ])
        const FSIZE = vertexs.BYTES_PER_ELEMENT

        const vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER,vertexs,gl.STATIC_DRAW)

        //a_Position
        const a_Position = gl.getAttribLocation(gl.program,'a_Position')
        if (a_Position < 0) {
            throw 'can not find storage location of a_Position'
        }
        gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,FSIZE*6,0)
        gl.enableVertexAttribArray(a_Position)

        //a_Color
        const a_Color = gl.getAttribLocation(gl.program,'a_Color')
        if (a_Position < 0) {
            throw 'can not find storage location of a_Color'
        }
        gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,FSIZE*6,FSIZE*3)
        gl.enableVertexAttribArray(a_Color)
        return 9
    }
    render() {
        return (
            <figure>
                <figcaption>{'正射投影'}</figcaption>
                <canvas ref="canvas">
                    {'your current brower don\'t support canvas,please change another one'}
                </canvas>
                <div ref="nearFarInfo"></div>
            </figure>
        )
    }
}
module.exports = OrthoView
