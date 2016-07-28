import React from 'react'
import Carousel from 'Carousel'
import armenia from './armenia.jpg'
import bridge from './bridge.jpg'
import calkmks from './calkmks.jpg'
class CarouselView extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const imgs=[armenia,bridge,calkmks]
        return (
            <Carousel imgs={imgs}/>
        )
    }
}

module.exports=CarouselView
