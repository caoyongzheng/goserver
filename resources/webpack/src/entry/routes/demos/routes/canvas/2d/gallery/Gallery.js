import React from 'react'
import ReactDOM from 'react-dom'

import styles from './Gallery.scss'
import image1 from './images/1.jpg'
import image2 from './images/2.jpg'
import image3 from './images/3.jpg'
import image4 from './images/4.jpg'
import image5 from './images/5.jpg'
import image6 from './images/6.jpg'
import image7 from './images/7.jpg'
import image8 from './images/8.jpg'
import image9 from './images/9.jpg'
import image10 from './images/10.jpg'
import image11 from './images/11.jpg'
import image12 from './images/12.jpg'
import image13 from './images/12.jpg'
import image14 from './images/13.jpg'
import image15 from './images/14.jpg'
import image16 from './images/15.jpg'
import image17 from './images/16.jpg'

const Images = [
    image1,image2,image3,image4,image5,image6,image7,image8,image9,
    image10,image11,image12,image13,image14,image15,image16,image17
]

class Gallery extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            image:-1
        }
        this.imageShow = 't2b'
    }
    componentDidUpdate(prevProps,prevState) {
        if (prevState.image != this.state.image) {
            this.loadImagesOrImage(this.context,Images,this.canvas)
        }
    }
    componentDidMount() {
        const cantainer = ReactDOM.findDOMNode(this.refs['cantainer'])
        this.canvas = ReactDOM.findDOMNode(this.refs['canvas'])
        this.context = this.canvas.getContext('2d')
        this.width = Number(cantainer.offsetWidth)
        this.height = Number(cantainer.offsetHeight)
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.initCanvas(this.width,this.height)
        this.loadImagesOrImage(this.context,Images,this.canvas)
    }
    initCanvas=(width,height)=>{
        this.setState({
            width: width,
            height: height
        })
    }
    loadImagesOrImage=(context,images,canvas)=>{
        const {image} = this.state
        if (image < 0) {
            this.loadImages(context,Images,canvas)
        }else {
            this.loadImage(context,Images[image],canvas)
        }
    }
    loadImages=(context,images,canvas)=>{
        const cWidth = Number(canvas.width)
        const cHeight = Number(canvas.height)
        const width = Math.floor(cWidth/4) - 2
        const height = width
        const blank = (cWidth - 4 * width) / 3
        this.imageWidth = width
        this.imageHeight = height
        this.imageBlank = blank

        context.clearRect(0,0,cWidth,cHeight)
        images.forEach((value,i)=>{
            const image = new Image()
            image.onload = ()=>{
                const row = Math.floor(i/4)
                const col = i%4
                const x = col*width + col*blank
                const y = row*height + row*blank
                this.drawImages(context,image,x,y,width,height)
            }
            image.src = value
        })
    }
    drawImages=(context,image,x,y,width,height,time=300)=>{
        let scale = 0.6
        const speed = 0.2 * 1000 / time
        let lastTime = Date.now()
        let cx = x + (1-scale) * width / 2
        let cy = y + (1-scale) * width / 2
        let draw = ()=>{
            context.clearRect(cx,cy,scale*width,scale*height)
            let now = Date.now()
            let eslapes = now - lastTime
            lastTime = now
            scale += eslapes*speed /1000.0
            scale = Math.min(scale,1.0)
            cx = x + (1-scale) * width / 2
            cy = y + (1-scale) * width / 2
            context.drawImage(image,cx,cy,scale*width,scale*height)
            if (scale < 1.0) {
                requestAnimationFrame(draw)
            }
        }
        draw()
    }
    loadImage=(context,image,canvas)=>{
        const cWidth = Number(canvas.width)
        const cHeight = Number(canvas.height)
        context.clearRect(0,0,cWidth,cHeight)
        this.initCanvas(this.width,this.height)
        let img = new Image()
        img.onload = ()=>{
            let width = Number(img.width)
            let height = Number(img.height)
            if (width>=height) {
                height = Math.min(height/width * this.width,this.height)
                width = this.width
            }else {
                width = Math.min(width/height * this.height,this.width)
                height = this.height
            }
            const x = (this.width - width)/2
            const y = (this.height - height)/2

            this.drawImage(context,img,x,y,width,height,this.imageShow,300)
        }
        img.src = image
    }
    drawImage=(context,image,x=0,y=0,width,height,direction='t2b',time=300)=>{
        const positions = {
            t2b:{x:x,y:y - height,axis:'y',distance:height,inc:1,
                promise: a => Math.min(a,y),isDraw: a => a < y},
            b2t:{x:x,y:y + height,axis:'y',distance:height,inc:-1,
                promise: a => Math.max(a,y),isDraw: a => a > y},
            l2r:{x:x - width,y:y,axis:'x',distance:width,inc:1,
                promise: a => Math.min(a,x),isDraw: a => a < x},
            r2l:{x:x + width,y:y,axis:'x',distance:width,inc:-1,
                promise: a => Math.max(a,x),isDraw: a => a > x}
        }
        const position = positions[direction] || positions.t2b
        const SPEED = position.distance * 1000.0 / time
        let lastTime = Date.now()
        let draw = ()=>{
            context.clearRect(0,0,this.width,this.height)
            let now = Date.now()
            let eslapes = now - lastTime
            lastTime = now
            position[position.axis] += (SPEED * eslapes / 1000.0)*position.inc
            position[position.axis] = position.promise(position[position.axis])
            context.drawImage(image,position.x,position.y,width,height)
            if (position.isDraw(position[position.axis])) {
                requestAnimationFrame(draw)
            }
        }
        draw()
    }
    render() {
        const {image,width,height} = this.state
        return (
            <div className={styles.gallery}>
                <div ref="cantainer" className={styles.cantainer} onClick={this.onTouchStart}>
                    <canvas ref="canvas" width={width} height={height} onClick={this.handleClick}/>
                </div>
                {
                    image < 0?null:
                    <div className={styles.button} onClick={()=>{
                        this.setState({ image:-1 })
                    }}>
                        {'图片列表'}
                    </div>
                }
            </div>
        )
    }
    onTouchStart=(e)=>{
        const dataId = e.target.attributes['data-id']
        if (dataId) {
            this.setState({
                image:Number(dataId.value)
            })
        }
    }
    handleClick=(e)=>{
        e.preventDefault()
        const {image} = this.state
        if (image < 0) {
            const rect = e.target.getBoundingClientRect()
            const x = e.pageX - rect.left
            const y = e.pageY - rect.top
            const col = Math.max(Math.floor(x/(this.imageWidth+this.imageBlank)),0)
            const row = Math.max(Math.floor(y/(this.imageHeight+this.imageBlank)),0)
            const index = 4 * row +col
            if (index < 17) {
                this.setState({
                    image:index
                })
            }
        }else {
            const random = Math.floor(Math.random()*5)
            const shows = ['t2b','b2t','l2r','r2l']
            this.imageShow = shows[random]
            this.setState({
                image:(this.state.image+1)%4
            })
        }
    }
}
module.exports=Gallery
