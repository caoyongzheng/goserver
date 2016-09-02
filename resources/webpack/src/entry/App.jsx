import React from 'react'
import { AppStoresProvider, globalAppStores, Connector, DispatchListener } from 'react-appstores'
import { withRouter } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Header from './components/Header'
import AuthStore from './stores/AuthStore'
import SignModalStore from './stores/SignModalStore'
import PageStore from './stores/PageStore'
import LeftNavStore from './stores/LeftNavStore'
import SignModal from './components/SignModal'
import LeftNav from './components/LeftNav'
import R from 'R'

globalAppStores.addStore('Auth', AuthStore)
globalAppStores.addStore('SignModal', SignModalStore)
globalAppStores.addStore('Page', PageStore)
globalAppStores.addStore('LeftNav', LeftNavStore)

globalAppStores.actions.Auth.login()

class App extends React.Component {
  constructor(props) {
    super(props)
    globalAppStores.actions.Page.setPage(this.props.location.pathname)
  }
  componentDidUpdate() {
    globalAppStores.actions.Page.setPage(this.props.location.pathname)
  }
  handleLogout = ({ states }) => {
    const page = states.Page.page
    if (page.auth > 0) {
      R.BlogIndex.go()
    }
  }
  handleLogin = ({ states }) => {
    const page = states.Page.page
    if (page.auth > 2) {
      R.BlogIndex.go()
    }
  }
  render() {
    const { children } = this.props
    return (
      <AppStoresProvider appstores={globalAppStores}>
        <MuiThemeProvider>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
            <DispatchListener storeName="Auth" type="Logout" handle={this.handleLogout} />
            <DispatchListener storeName="Auth" type="Login" handle={this.handleLogin} />
            <div>
              <Header />
              <SignModal />
              <LeftNav />
            </div>
            <Connector
              component={({ open }) => (
                <div
                  style={{ flex: 1, position: 'relative', marginLeft: `${open ? 250 : 0}px` }}
                >
                  {React.cloneElement(children, { appstores: globalAppStores })}
                </div>
              )}
              connects={{ LeftNav: ['open'] }}
              setProps={({ LeftNav: { open } }) => ({ open })}
            />
          </div>
        </MuiThemeProvider>
      </AppStoresProvider>
    )
  }
}
App.propTypes = {
  location: React.PropTypes.object.isRequired,
}
export default withRouter(App)
