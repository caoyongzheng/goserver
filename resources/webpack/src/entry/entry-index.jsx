import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { storeSet, StoreSetProvider } from 'react-store-set'
import AuthStore from './stores/AuthStore'
import RouterStore from './stores/RouterStore'
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
  ],
}

const divElem = document.createElement('div')
divElem.setAttribute('name', 'app-anchor')
divElem.setAttribute('style', 'height:100%;width:100%;')
document.querySelector('body').appendChild(divElem)


// 初始化RouterStore
storeSet.addStore('RouterStore', RouterStore)
RouterStore.actions.initHistory(browserHistory)
browserHistory.listen(RouterStore.actions.locationChange)

// 初始化AuthStore
storeSet.addStore('Auth', AuthStore)
AuthStore.actions.login(() => {
  ReactDOM.render(
    <StoreSetProvider storeSet={storeSet}>
      <Router history={browserHistory} routes={AppRoute} />
    </StoreSetProvider>,
    divElem
  )
})
