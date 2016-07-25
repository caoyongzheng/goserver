import React from 'react'
import ReactDOM from 'react-dom'

import _ from 'lodash'
import NotifyView from './NotifyView'

import { TransitionMotion, spring } from 'react-motion'

class Notify extends React.Component {
  state = {
    msgs: [],
  }
  showMsg = (msg, option = { time: 2000 }) => {
    const msgObj = {
      key: _.uniqueId(),
      data: msg,
    }
    const { msgs } = this.state
    msgs.push(msgObj)
    this.setState({
      msgs,
    })
    setTimeout(() => {
      this.setState({
        msgs: _.remove(this.state.msgs, value => value.key !== msgObj.key),
      })
    }, option.time)
  }
  willLeave() {
    return { top: spring(0) }
  }
  render() {
    const { msgs } = this.state
    return (
      <TransitionMotion
        willLeave={this.willLeave}
        styles={msgs.map(msg => ({ ...msg, style: { top: 10 } }))}
      >
        {
          interpolatedStyles =>
            <div>
              {
                interpolatedStyles.map(c =>
                  <NotifyView {...c} />
                )
              }
            </div>
        }
      </TransitionMotion>
    )
  }
}

const anchor = document.createElement('div')
anchor.setAttribute('name', 'notify-anchor')
document.body.appendChild(anchor)

export default ReactDOM.render(
  <Notify />,
  anchor
)
