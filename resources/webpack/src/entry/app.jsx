import React from 'react'
import ReactDOM from 'react-dom'
import { Router, hashHistory } from 'react-router'

import { addStore, deleteStore } from 'Stores'
import 'Notify'

import { getUser } from 'LoginAction'

const styles = {
  app: {
    width: '100%',
    height: '100%',
  },
}

class App extends React.Component {
  constructor(props) {
    super(props)
    addStore('app')
  }
  componentDidMount() {
    getUser()
  }
  componentWillUnmount() {
    deleteStore('app')
  }
  getState = () => this.state
  render() {
    return (
      <div name="app" style={styles.app} >
        {this.props.children}
      </div>
    )
  }
}

const AppRoute = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/home') },
  childRoutes: [
    require('./routes/home/index.jsx'),
    require('./routes/demos/index.jsx'),
    require('./routes/video/index.jsx'),
    require('./routes/blog/index.jsx'),
  ],
}

const divElem = document.createElement('div')
divElem.setAttribute('name', 'app-anchor')
divElem.setAttribute('style', 'height:100%;width:100%;')
document.querySelector('body').appendChild(divElem)

ReactDOM.render(
  <Router history={hashHistory} routes={AppRoute} />,
  divElem
)
