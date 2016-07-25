import React from 'react'

import styles from './Tangram.scss'

const tangram = [
    {p:[{x:0,y:0},{x:800,y:0},{x:400,y:400}],color:'#caff67'},
    {p:[{x:0,y:0},{x:400,y:400},{x:0,y:800}],color:'#67beef'},
    {p:[{x:800,y:0},{x:800,y:400},{x:600,y:600},{x:600,y:200}],color:'#ef3d61'},
    {p:[{x:600,y:200},{x:600,y:600},{x:400,y:400}],color:'#f9f5ea'},
    {p:[{x:400,y:400},{x:600,y:600},{x:400,y:800},{x:200,y:600}],color:'#a594c0'},
    {p:[{x:200,y:600},{x:400,y:800},{x:0,y:800}],color:'#fa8ecc'},
    {p:[{x:800,y:400},{x:800,y:800},{x:400,y:800}],color:'#f6ca29'}
]

class Tangram extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        let canvas = document.getElementById('canvas')
        canvas.width=400
        canvas.height=400
        const scale=[canvas.width/800,canvas.height/800]
        try {
            let context = canvas.getContext('2d')

            for (let i = 0; i < tangram.length; i++) {
                this.drawPiece(tangram[i],context,scale)
            }
        } catch (e) {
            console.log(e)
        }

    }
    render() {
        return (
            <canvas id="canvas" width="1024" height="768"  className={styles.canvas}>
            </canvas>
        )
    }
    drawPiece(piece,context,scale){
        const dots = piece.p
        context.beginPath()
        context.moveTo(dots[0].x*scale[0],dots[0].y*scale[1])
        for (let i = 1; i < dots.length; i++) {
            context.lineTo(dots[i].x*scale[0],dots[i].y*scale[1])
        }
        context.closePath()
        context.fillStyle = piece.color
        context.fill()

        context.lineWidth = 5
        context.strokeStyle = '#000000'
        context.stroke()
    }
}
module.exports = Tangram
