import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { globalAppStores } from 'react-appstores'
import AuthStore from './stores/AuthStore'
import 'Notify'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()
import R from 'R'

import App from './App'
import './app.scss'

const AppRoute = {
  path: '/app',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace(R.Blog) },
  childRoutes: [
    require('./routes/admin/UserAdminApp'),
    require('./routes/blog/index.jsx'),
    // require('./routes/home/index.jsx'),
    // require('./routes/demos/index.jsx'),
    // require('./routes/video/index.jsx'),
    // require('./routes/novel/reader/index.jsx'),
    // require('./routes/novel/SectionAdd'),
    // require('./routes/my/index.jsx'),
  ],
}

const divElem = document.createElement('div')
divElem.setAttribute('name', 'app-anchor')
divElem.setAttribute('style', 'height:100%;width:100%;')
document.querySelector('body').appendChild(divElem)

globalAppStores.addStore('Auth', AuthStore)
globalAppStores.actions.Auth.login(() => {
  ReactDOM.render(
    <Router history={browserHistory} routes={AppRoute} />,
    divElem
  )
})
