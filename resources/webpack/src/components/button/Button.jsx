import React, { Component } from 'react'
import css from './Button.scss'
import cx from 'classnames'

class Button extends Component {
  state = {}
  render() {
    const { children, ...others } = this.props
    return (
      <button {...others} className={cx(css.button, css.defaults)}>
        {children}
      </button>
    )
  }
}

export default Button
