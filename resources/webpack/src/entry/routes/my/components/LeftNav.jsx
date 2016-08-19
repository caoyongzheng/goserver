import React, { Component } from 'react'
import R from 'R'
import { withRouter } from 'react-router'
const styles = {
  stage: {
    width: '200px',
    height: '100%',
    backgroundColor: '#efefef',
  },
  item: {
    padding: '10px 16px',
    cursor: 'pointer',
  },
}

class LeftNav extends Component {
  linkTo = (route) => {
    this.props.router.push(route)
  }
  render() {
    return (
      <div style={styles.stage}>
        <div style={styles.item} onClick={() => this.linkTo(R.MyNovelList)}>{'我的小说'}</div>
      </div>
    )
  }
}

export default withRouter(LeftNav)
