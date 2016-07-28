import React, { PropTypes } from 'react'

import _ from 'lodash'

const styles = {
  notify: {
    position: 'fixed',
    minHeight: '30px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    margin: 'auto',
    padding: '0 10px',
    top: 0,
    width: '100px',
  },
  center: {
    transition: 'top 300ms cubic-bezier(0.23, 1, 0.32, 1) 0ms,' +
    'visibility 300ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    transform: 'translateX(-50%)',
    left: '50%',
  },
  hide: {
    display: 'none',
  },
}

class NotifyView extends React.Component {
  componentDidMount() {

  }
  render() {
    const { data, style } = this.props
    return (
      <div
        style={_.merge({}, styles.notify, styles.center, style)}
      >
        {data}
      </div>
    )
  }
}

NotifyView.propTypes = {
  style: PropTypes.object,
  data: PropTypes.string.isRequired,
}
export default NotifyView
