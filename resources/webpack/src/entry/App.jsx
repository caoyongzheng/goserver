import React from 'react'
import { storeSet, Connector, DispatchListener } from 'react-store-set'
import { withRouter } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Header from './components/Header'
import SignModalStore from './stores/SignModalStore'
import LeftNavStore from './stores/LeftNavStore'
import SignModal from './components/SignModal'
import LeftNav from './components/LeftNav'
import R from 'R'

storeSet.addStore('SignModal', SignModalStore)
storeSet.addStore('LeftNav', LeftNavStore)

class App extends React.Component {
  handleLogout = () => {
    const { location } = storeSet.stores.RouterStore.state
    const page = R.getPage(location.pathname)
    if (page.auth > 0) {
      R.BlogIndex.go()
    }
  }
  handleLogin = () => {
    const { location } = storeSet.stores.RouterStore.state
    const page = R.getPage(location.pathname)
    if (page.auth > 0) {
      R.BlogIndex.go()
    }
  }
  render() {
    const { children } = this.props
    return (
      <MuiThemeProvider>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
          <DispatchListener name="Auth" type="Logout" handler={this.handleLogout} />
          <DispatchListener name="Auth" type="Login" handler={this.handleLogin} />
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
                {children}
              </div>
            )}
            connects={{ LeftNav: ['open'] }}
            setProps={(stores) => ({ open: stores.LeftNav.state.open })}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}
App.propTypes = {
  location: React.PropTypes.object.isRequired,
}
export default withRouter(App)
