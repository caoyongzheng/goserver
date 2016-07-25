import React, { PropTypes } from 'react'

import { withRouter } from 'react-router'

import Node from './routeTree.json'

import _ from 'lodash'
import LayoutStyle from 'LayoutStyle'
import Nav from 'Nav'
import { TreeNode, Header } from 'react-treenode'

const styles = {
  treeview: {
    backgroundColor: '#e9e9e9',
    width: '300px',
    paddingTop: '5px',
    position: 'relative',
  },
  hide: {
    display: 'none',
  },
}

const treestyles = {
  header: {
    color: '#000',
  },
  active: {
    backgroundColor: 'rgba(60, 60, 60, 0.1)',
  },
}

class Demos extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cursor: {},
      hide: this.props.location.pathname !== '/demos',
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname === '/demos') {
      this.setState({
        hide: false,
      })
    }
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  }
  onClick = (e, node) => {
    e.preventDefault()
    const cursor = this.state.cursor
    cursor.active = false
    node.open = !node.open
    node.active = true
    this.setState({
      cursor: node,
    })
    if (node.leaf) {
      this.props.router.push(node.link)
    }
  }
  onKeyDown = e => {
    if (e.metaKey && e.key === '\\') {
      this.setState({
        hide: !this.state.hide,
      })
    }
  }
  getHeader = (props) => <Header {...props} onClick={this.onClick} styles={treestyles} />
  sortFn = (node1, node2) => {
    if (node1.leaf === node2.leaf) {
      return node1.name > node2.name ? 1 : -1
    } else if (!node1.leaf) {
      return -1
    }
    return 1
  }
  render() {
    const { hide } = this.state
    const bodyStyle = _.merge({}, LayoutStyle.body, LayoutStyle.stageRow)
    const treeviewStyle = _.merge({}, styles.treeview)
    if (hide) {
      _.merge(treeviewStyle, styles.hide)
    }
    return (
      <div name="demos" style={LayoutStyle.stageCol}>
        <Nav />
        <div
          style={bodyStyle}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
        >
          <div style={treeviewStyle}>
            <TreeNode node={Node} Header={this.getHeader} sortFn={this.sortFn} />
          </div>
          <div style={LayoutStyle.body}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
Demos.propTypes = {
  location: PropTypes.object.isRequired,
}
module.exports = withRouter(Demos)
