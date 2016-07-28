import React from 'react'

import digit from './digit'
import styles from './CountDown.scss'
import _ from 'lodash'

import {RandomUitl,Ball,MotionBall,Balls} from './Models'

const Colors = ['#000000','003333','#006666','#009999','#00CCCC','#00FFFF','#3300CC','#333399',
'#336666','#339933','#33CC00','#33FF33','#660066','#663399','#6666CC','#6699FF','#66CCCC','#66FF99',
'#9900CC','#9933FF','#9966CC','#999999','#99CC66','#99FF33','#CC0000','#CC3333','#CC6666','#CC9999']

const randomUitl = new RandomUitl(Colors.length,80,-300)

class CountDown extends React.Component {
    constructor(props) {
        super(props)
        this.width = 1024
        this.height = 600
        this.Top = 200
        this.Left = 200
        this.Radius = 5
        this.RadiusBlank = 1
        this.DigitBlank = 8
        this.Frequency = 20
        this.color = '#228855'

        this.endTime = new Date()
        this.endTime.setTime(this.endTime.getTime()+3600*1000)
    }
    componentDidMount() {
        const canvas = document.getElementById('canvas')
        canvas.width = this.width
        canvas.height = this.height

        const context = canvas.getContext('2d')

        this.lastTime = this.getTime()
        let digitsBalls = this.getTimeDigits(this.lastTime)
        let motionBalls = new Object()
        this.setI = setInterval(
            ()=>{
                //update
                const lastTime = this.getTime()

                if (this.lastTime[7] != lastTime[7]) {
                    digitsBalls = this.getTimeDigits(lastTime)
                    this.setNewMotionBalls(motionBalls,digitsBalls,this.lastTime,lastTime)
                    this.lastTime = lastTime
                }
                this.updateMotionBalls(motionBalls,context)
                //init
                context.clearRect(0,0,this.width,this.height)

                //render
                //render digists
                for (let i = 0; i < digitsBalls.length; i++) {
                    digitsBalls[i].render(context)
                }
                //render MotionBalls
                this.renderMotionBalls(motionBalls,context)
            },
            1000/this.Frequency
        )
    }
    componentWillUnmount() {
        clearInterval(this.setI)
    }
    render() {
        return (
            <canvas id="canvas" className={styles.canvas}>
                该浏览器不支持canvas,请切换浏览器！
            </canvas>
        )
    }
    setNewMotionBalls(motionBalls,digitsBalls,lastTime1,lastTime2){
        for (let i = 0; i < lastTime1.length; i++) {
            if (lastTime1[i]!=lastTime2[i]) {
                const balls = digitsBalls[i].elems
                const len = balls.length
                for (let j = 0; j < len; j++) {
                    motionBalls[_.uniqueId()]=new MotionBall(
                        randomUitl.getV(),randomUitl.getY(),1000,
                        balls[j].x,balls[j].y,balls[j].radius,Colors[randomUitl.getLen()]
                    )
                }
            }
        }
    }
    updateMotionBalls = (motionBalls)=>{
        _.forOwn(motionBalls, (motionBall, key) => {
            motionBall.vY += motionBall.g/this.Frequency
            motionBall.x += motionBall.vX/this.Frequency
            motionBall.y += motionBall.vY/this.Frequency

            if ((motionBall.y+this.Radius) > this.height && motionBall.vY > 0 ) {
                motionBall.vY = -motionBall.vY*0.75
                motionBall.y = this.height - this.Radius
            }

            if (motionBall.isOut(this.width,this.height)) {
                _.unset(motionBalls,key)
            }
        })
    }
    getTime=()=>{
        const seconds = Math.round((this.endTime.getTime() - new Date().getTime())/1000)
        const totalSeconds = Math.max(seconds,0)
        const hour = Math.floor(totalSeconds/3600%99)
        const minute = Math.floor((totalSeconds%3600)/60)
        const second = totalSeconds%60
        return [
            parseInt(hour/10),parseInt(hour%10),
            10,
            parseInt(minute/10),parseInt(minute%10),
            10,
            parseInt(second/10),parseInt(second%10)
        ]
    }
    getTimeDigits=(timeItems)=>{
        let digits = []

        let currentTop = this.Top
        let currentLeft = this.Left

        for (let i = 0; i < timeItems.length; i++) {
            digits.push(this.getDigitBalls(
                digit[timeItems[i]],
                currentLeft,
                currentTop,
                this.Radius,
                this.color
            ))
            currentLeft += digits[i].width + this.DigitBlank
        }
        return digits
    }
    getDigitBalls=(d,x,y,radius,color)=>{
        const balls = []
        for (let i = 0; i < d.length; i++) {
            for (let j = 0; j < d[i].length; j++) {
                if (d[i][j]==1) {
                    balls.push(new Ball(
                        x+(2*j+1)*(radius+1),
                        y+(2*i+1)*(radius+1),
                        radius,
                        color
                    ))
                }
            }
        }
        return new Balls(x,y,balls,d[0].length * 2 * (this.Radius + this.RadiusBlank))
    }
    renderMotionBalls=(motionBalls,context)=>{
        _.forOwn(motionBalls,(motionBall)=>{
            motionBall.render(context)
        })
    }
}
module.exports = CountDown
