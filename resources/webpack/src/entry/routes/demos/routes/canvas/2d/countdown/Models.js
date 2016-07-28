export class RandomUitl {
    constructor(len,v,y) {
        this.len = len
        this.v = v
        this.y = y
    }
    getLen(){
        return  Math.floor(Math.random()*this.len)
    }
    getV(){
        return Math.pow(-1,Math.round(Math.random()*1000))*(this.v+this.v*(Math.random()-0.5)*0.5)
    }
    getY(){
        return this.y+this.y*(Math.random()-0.5)*0.3
    }
}

//Ball 球（静态）
export class Ball {
    constructor(x,y,radius,color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }
    render=(context)=>{
        context.fillStyle = this.color
        context.beginPath()
        context.arc(this.x,this.y,this.radius,0,2*Math.PI)
        context.closePath()
        context.fill()
    }
}

//MotionBall 球（动态）
export class MotionBall extends Ball {
    constructor(vX,vY,g,...ball) {
        super(...ball)
        this.vX = vX
        this.vY = vY
        this.g = g
    }
    isOut=(width,height)=>{
        return (this.x+this.radius) < 0 || (this.x-this.radius) > width ||
            (this.y+this.radius) < 0 || (this.y-this.radius) > height
    }
}

//Balls 球组成的多球对象（可能是数字或其他）
export class Balls {
    constructor(x,y,elems,width,height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.elems = elems
    }
    render=(context)=>{
        const len = this.elems.length
        for (let i = 0; i < len; i++) {
            this.elems[i].render(context)
        }
    }
}
