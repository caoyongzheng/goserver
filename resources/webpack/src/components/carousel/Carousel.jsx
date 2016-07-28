import React, { PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import styles from './Carousel.scss'
import Selecter from './Selecter/Selecter.jsx'

const transitionName = {
  enter: styles.enter,
  enterActive: styles.enterActive,
  leave: styles.leave,
  leaveActive: styles.leaveActive,
}

class Carousel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 0,
    }
    this.start = true
  }
  componentDidMount() {
    this.startCarousel()
  }
  componentWillUnmount() {
    this.stopCarousel()
  }
  onMouseOver() {
    this.stopCarousel()
  }
  onMouseOut() {
    this.startCarousel()
  }
  changeActive(i) {
    this.setState({
      active: i,
    })
  }
  nextActive = () => {
    const size = this.props.imgs.length
    const oldActive = this.state.active
    const newActive = (oldActive + 1) % size
    this.setState({
      active: newActive,
    })
  }
  startCarousel() {
    this.setI = setInterval(this.nextActive, 1000 * 3)
  }
  stopCarousel() {
    clearInterval(this.setI)
  }
  render() {
    const { imgs, time, width, height } = this.props
    const { active } = this.state
    return (
      <div
        className={styles.carousel}
        style={{ width, height }}
        onMouseOver={() => { this.onMouseOver() }}
        onMouseOut={() => { this.onMouseOut() }}
      >
        <ReactCSSTransitionGroup
          transitionName={transitionName}
          transitionEnterTimeout={time}
          transitionLeaveTimeout={time}
        >
          <img
            className={styles.img}
            role="presentation"
            src={imgs[active]}
            key={imgs[active]}
          />
        </ReactCSSTransitionGroup>
        <Selecter
          size={imgs.length}
          active={active}
          onSelect={(i) => { this.changeActive(i) }}
        />
      </div>
    )
  }
}
Carousel.defaultProps = {
  time: 300,
  width: '600px',
  height: '300px',
}
Carousel.propTypes = {
  imgs: PropTypes.arrayOf(PropTypes.string).isRequired,
  time: PropTypes.number,
  width: PropTypes.string,
  height: PropTypes.string,
}
module.exports = Carousel
