import React from 'react'

import plyr from 'Plyr'

class View extends React.Component {
  componentDidMount() {
    plyr.setup()
  }
  render() {
    return (
      <div style={{ position: 'relative', height: '1000px', width: '600px' }}>
        <video
          controls="controls"
          src="/resources/videos/movie.ogg"
        />
      </div>
    )
  }
}
module.exports = View
