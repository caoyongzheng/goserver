import React from 'react'
import ReactDOM from 'react-dom'
import { Router, hashHistory } from 'react-router'
import { Store, GlobalStores } from 'react-app-store'
import 'Notify'
import App from './apps/App.jsx'
import actionFactorys from './actions'

GlobalStores.add('App', new Store({
  state: {
    user: {},
    loginState: '',
  },
  data: {
    loginStates: {
      LOGIN: 'login',
      LOGOUT: 'logout',
    },
  },
  actionFactorys,
}))
GlobalStores.get('App').actions.login()

const AppRoute = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/home') },
  childRoutes: [
    require('./routes/home/index.jsx'),
    require('./routes/demos/index.jsx'),
    require('./routes/video/index.jsx'),
    require('./routes/blog/index.jsx'),
    require('./routes/novel/reader/index.jsx'),
    require('./routes/my/index.jsx'),
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
