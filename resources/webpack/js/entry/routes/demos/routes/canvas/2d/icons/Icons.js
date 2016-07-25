import React from 'react'
import ReactDOM from 'react-dom'

import styles from './Icons.scss'

class Icons extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount=() => {
        const canvas = ReactDOM.findDOMNode(this.refs['canvas'])
        canvas.width = 1024
        canvas.height = 600

        const context = canvas.getContext('2d')
        if (!context) {
            return
        }
        //arrow
        this.drarArrow(context,1,0,0,1,0,0)

        //star
        this.drawStar(context,250,60,20,0)

        //RoundRect
        this.drawRoundRect(context,350,20,120,80,10)

        //Moon
        this.drawMoon(context,500,70,40,20,0)
    }
    render() {
        return (
            <canvas ref="canvas" className={styles.canvas}>
                该浏览器不支持canvas,请切换浏览器！
            </canvas>
        )
    }
    setPaths = (context,points) => {
        const len = points.length
        context.beginPath()
        for (let i = 0; i < len; i++) {
            context.lineTo(points[i].x,points[i].y)
        }
        context.closePath()
    }
    drarArrow(context,...transform){
        context.save()

        context.transform(...transform)
        this.arrowPath(context)

        context.fillStyle='#008888'
        context.fill()
        context.stroke()

        context.restore()
    }
    arrowPath(context){
        context.beginPath()
        context.lineTo(50,50)
        context.lineTo(125,50)
        context.lineTo(125,20)
        context.lineTo(150,60)
        context.lineTo(125,100)
        context.lineTo(125,70)
        context.lineTo(50,70)
        context.closePath()
    }
    drawStar=(context,x,y,R,rot)=>{
        context.save()
        context.transform(R,0,0,R,x,y)
        context.rotate(rot/180*Math.PI)
        this.starPath(context)
        context.fillStyle = '#fb3'
        context.strokeStyle = '#fb5'
        context.fill()
        context.stroke()
        context.restore()
    }
    starPath=(context)=>{
        context.beginPath()
        for (let i = 0; i < 5; i++) {
            context.lineTo(Math.cos( (18+i*72)/180*Math.PI ),
                -Math.sin( (18+i*72)/180*Math.PI ))
            context.lineTo(Math.cos( (54+i*72)/180*Math.PI )*0.5 ,
                -Math.sin( (54+i*72)/180*Math.PI )*0.5 )
        }
        context.closePath()
    }
    drawRoundRect(context,x,y,width,height,radius){
        if (2*radius>width||2*radius>height) {
            return
        }
        context.save()
        context.translate(x,y)
        this.roundRectPath(context,width,height,radius)
        context.strokeStyle = '#000'
        context.stroke()
        context.restore()
    }
    roundRectPath(context,width,height,radius){
        context.beginPath()
        context.arc(width-radius,height-radius,radius,0,Math.PI/2)
        context.lineTo(radius,height)
        context.arc(radius,height-radius,radius,0.5*Math.PI,Math.PI)
        context.lineTo(0,height-radius)
        context.arc(radius,radius,radius,Math.PI,1.5*Math.PI)
        context.lineTo(width-radius,0)
        context.arc(width-radius,radius,radius,1.5*Math.PI,2*Math.PI)
        context.closePath()
    }
    drawMoon(context,x,y,R,d,rotate,color){
        context.save()
        context.rotate(rotate/180*Math.PI)
        context.translate(x,y)
        this.moonPath(context,R,d)
        context.fillStyle = color || 'yellow'
        context.fill()
        context.restore()
    }
    moonPath(context,R,d){
        context.beginPath()
        context.arc(0,0,R,Math.PI*0.5,Math.PI*1.5,true)
        context.arc(-d,0,Math.sqrt(Math.pow(R,2)+Math.pow(d,2)),-Math.atan(R/d),Math.atan(R/d))
        context.closePath()
    }
}
module.exports = Icons
