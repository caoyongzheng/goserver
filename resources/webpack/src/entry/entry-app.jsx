import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Store, GlobalStores } from 'react-app-store'
import 'Notify'
import App from './apps/App.jsx'
import actionFactorys from './actions'
import R from 'R'

GlobalStores.add('App', new Store({
  state: {
    logStatus: 'LOGOUT', // 登录状态, oneOf ['LOGIN', 'LOGOUT'],
    signModalDisplay: 'None', // 登录Modal显示状态, oneOf ['None', 'SignIn', 'SignOut'],
    user: { // 当前会话用户信息
      logStatus: 'LOGOUT', // 登录状态, oneOf ['LOGIN', 'LOGOUT'],
    },
  },
  actionFactorys,
}))
GlobalStores.get('App').actions.onLogin()

const AppRoute = {
  path: '/app',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace(R.Blog) },
  childRoutes: [
    require('./routes/home/index.jsx'),
    require('./routes/demos/index.jsx'),
    require('./routes/video/index.jsx'),
    require('./routes/blog/index.jsx'),
    require('./routes/novel/reader/index.jsx'),
    require('./routes/novel/SectionAdd'),
    require('./routes/my/index.jsx'),
  ],
}

const divElem = document.createElement('div')
divElem.setAttribute('name', 'app-anchor')
divElem.setAttribute('style', 'height:100%;width:100%;')
document.querySelector('body').appendChild(divElem)

ReactDOM.render(
  <Router history={browserHistory} routes={AppRoute} />,
  divElem
)
