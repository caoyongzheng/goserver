import React from 'react'

class Popups extends React.Component {
  showPopup = () => {
    $.notify('Hello World')
  }
  render() {
    return (
      <div>
        <button onClick={this.showPopup}>show</button>
        <button onClick={this.hidePopup}>hide</button>
      </div>
    )
  }
}

module.exports = Popups
