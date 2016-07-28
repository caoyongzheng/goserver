import React, { PropTypes } from 'react'

import styles from './Selecter.scss'

import Dot from './Dot/Dot.jsx'

class Selecter extends React.Component {
  onClick(e, onSelect) {
    e.preventDefault()
    if (onSelect && e.currentTarget !== e.target) {
      onSelect(Number(e.target.attributes.name.value))
    }
  }
  renderDots(size, active) {
    const dots = []
    for (let i = 0; i < size; i++) {
      dots.push(<Dot key={i} name={i} active={i === active} />)
    }
    return dots
  }
  render() {
    const { size, active, onSelect } = this.props
    return (
      <div className={styles.selecter} onClick={(e) => { this.onClick(e, onSelect) }}>
        {this.renderDots(size, active)}
      </div>
    )
  }
}
Selecter.propTypes = {
  size: PropTypes.number.isRequired,
  active: PropTypes.number.isRequired,
  onSelect: PropTypes.func,
}
module.exports = Selecter
