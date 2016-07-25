import React,{PropTypes} from 'react'

import styles from './Gallery.scss'

import imageMetaArray from './images/images.json'

import cx from 'classnames'

//加载图片
imageMetaArray.forEach((value,k)=>{
    value.imageUrl=require(`./images/${value.fileName}`)
    value.id=k
})

class ImgFigure extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {imageUrl,title,style,className,desc,id,onClick,inverse} = this.props
        return (
            <figure className={cx(styles['img-figure'],className)}
                style={style}
                onClick={(e)=>{onClick(e,id)}}>
                <img src={imageUrl} alt={title} className={cx(styles.img,{[styles.hide]:inverse})}/>
                <figcaption className={cx(styles.title,{[styles.hide]:inverse})}>
                    {title}
                </figcaption>
                <div className={cx(styles['img-back'],{[styles.hide]:!inverse})}>
                    {desc}
                </div>
            </figure>
        )
    }
}
ImgFigure.propTypes={
    id:PropTypes.number.isRequired,
    imageUrl:PropTypes.string.isRequired,
    title:PropTypes.string.isRequired,
    desc:PropTypes.string,
    onClick:PropTypes.func.isRequired,
    inverse:PropTypes.bool
}

//Gallery Component
class Gallery extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            cursor:0,
            inverse:false
        }
    }
    Constant = {
        imgFigure:{
            width:260,
            height:300
        }
    }
    render() {
        const {cursor,inverse} = this.state
        const {leftImages,centerImage,rightImages} =
        this.getImageGroups(imageMetaArray,cursor)
        return (
            <section className={styles.gallery} ref="stage">
                <section className={styles.imgs}>
                    <div className={styles.left}>
                        <div style={{position:'absolute',bottom:'150px',top:'0px',width:'100%'}}>
                            {this.renderLeftImages(leftImages)}
                        </div>
                    </div>
                    <div className={styles.center}>
                        {this.renderCenterImage(centerImage,inverse)}
                    </div>
                    <div className={styles.right}>
                        <div style={{position:'absolute',bottom:'150px',top:'0px',width:'100%'}}>
                            {this.renderRightImages(rightImages)}
                        </div>
                    </div>
                </section>
                <nav className={styles.nav}>
                    nav
                </nav>
            </section>
        )
    }
    handleClick=(e,id)=>{
        e.preventDefault()
        e.stopPropagation()
        const cursor = this.state.cursor
        if (cursor == id) {
            this.setState({
                inverse:!this.state.inverse
            });
        }else {
            this.setState({
                cursor: id,
                inverse: false
            })
        }
    }
    renderCenterImage=(centerImage,inverse)=>{
        const style={
            left:'50%',
            top:'50%',
            transform: 'translate(-50%,-50%)',
            zIndex:2
        }
        return (
            <ImgFigure {...centerImage}
                inverse={inverse}
                style={style}
                onClick={this.handleClick}/>
        )
    }
    renderLeftImages=(leftImages)=>{
        return leftImages.map((image,k)=>{
            const style={
                left:`${this.getRandomNum(0,100)}%`,
                top:`${this.getRandomNum(0,100)}%`,
                transform:`translate(0,-50%) rotate(${this.getRandomNum(-30,30)}deg)`
            }
            return (
                <ImgFigure key={k}
                    {...image}
                    style={style}
                    onClick={this.handleClick}
                    className={styles.left} />)
        })
    }
    renderRightImages=(rightImages)=>{
        return rightImages.map((image,k)=>{
            const style={
                left:`${this.getRandomNum(0,100)}%`,
                top:`${this.getRandomNum(0,100)}%`,
                transform:`translate(-100%,-50%) rotate(${this.getRandomNum(-30,30)}deg)`
            }
            return (
                <ImgFigure key={k}
                    {...image}
                    style={style}
                    onClick={this.handleClick}
                    className={styles.right}/>
            )
        })
    }
    getImageGroups(imagesMeta,cursor){
        let leftImages=[],centerImage,rightImages=[]
        centerImage = imagesMeta[cursor]
        const len = imagesMeta.length
        const middle = Math.ceil(len / 2)
        for (let i = 0; i < middle; i++) {
            if (i !== cursor) {
                leftImages.push(imagesMeta[i])
            }
        }
        for (let j = middle; j < len; j++) {
            if (j !== cursor) {
                rightImages.push(imagesMeta[j])
            }
        }
        return {leftImages,centerImage,rightImages}
    }
    getRandomNum(begin=0,end=0){
        return Math.random() * (end-begin) + begin
    }
}
module.exports = Gallery
