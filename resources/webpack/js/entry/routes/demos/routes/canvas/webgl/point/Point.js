import React from 'react'
import ReactDOM from 'react-dom'

import styles from './Point.scss'
import {initShaders} from 'WeBGLUtils'

class Test extends React.Component {
    constructor(props) {
        super(props)
        //定点着色器程序
        this.VSHADER_SOURCE = `
            attribute vec4 a_Position;
            void main(){
                gl_Position = a_Position;
                gl_PointSize = 10.0;
            }
        `
        //片元着色器程序
        this.FSHADER_SOURCE = `
            precision mediump float;
            uniform vec4 u_FragColor;
            void main(){
                gl_FragColor = u_FragColor;
            }
        `
        this.g_points=[]
        this.g_colors=[]
    }
    componentDidMount() {
        const canvas = ReactDOM.findDOMNode(this.refs['canvas'])
        canvas.width = 400
        canvas.height = 400

        const gl = canvas.getContext('experimental-webgl') || canvas.getContext('webgl')
        if (!gl) {
            return
        }

        if(!initShaders(gl,this.VSHADER_SOURCE,this.FSHADER_SOURCE)) {
            return
        }

        //获取a_Position变量的储存位置
        let a_Position = gl.getAttribLocation(gl.program,'a_Position')
        if (a_Position < 0) {
            console.log('Failed to get the storage Location of a_Position')
            return
        }
        //获取u_FragColor变量的存储位置
        let u_FragColor = gl.getUniformLocation(gl.program,'u_FragColor')
        if (!u_FragColor) {
            console.log('Failed to get the storage Location of u_FragColor')
            return
        }

        //注册鼠标点击事件响应函数
        canvas.onmousedown=(e)=>{this.onClick(e,gl,canvas,a_Position,u_FragColor)}

        gl.clearColor(0.0,0.0,0.0,1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)
    }
    onClick=(e,gl,canvas,a_Position,u_FragColor)=>{
        let x = e.clientX
        let y = e.clientY
        let rect = e.target.getBoundingClientRect()
        x = (x-rect.left-canvas.width/2)/(canvas.width/2)
        y = (canvas.height/2-(y-rect.top))/(canvas.height/2)

        this.g_points.push({x:x,y:y})
        if (x>=0.0&&y>=0.0) {
            this.g_colors.push([1.0,0.0,0.0,1.0])
        }else if(x < 0.0 && y < 0.0){
            this.g_colors.push([0.0,1.0,0.0,1.0])
        }else {
            this.g_colors.push([1.0,1.0,1.0,1.0])
        }

        gl.clear(gl.COLOR_BUFFER_BIT)

        const len = this.g_points.length
        for (let i = 0; i < len; i++) {
            gl.vertexAttrib2f(a_Position,this.g_points[i].x,this.g_points[i].y)
            gl.uniform4f(u_FragColor,this.g_colors[i][0],this.g_colors[i][1],
            this.g_colors[i][2],this.g_colors[i][3])
            gl.drawArrays(gl.POINTS, 0, 1)
        }
    }
    render() {
        return (
            <canvas ref="canvas" className={styles.canvas}>
                {'the brower don`t support canvas,please change another brower'}
            </canvas>
        )
    }
}
module.exports = Test
