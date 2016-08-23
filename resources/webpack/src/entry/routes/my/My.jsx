import React from 'react'
import _ from 'lodash'
import Nav from 'Nav'
import { Store, Provider, GlobalStores } from 'react-app-store'
import LayoutStyle from 'LayoutStyle'
import LeftNav from './components/LeftNav.jsx'
import actionFactorys from './actions'

class My extends React.Component {
  constructor(props) {
    super(props)
    GlobalStores.add('My', new Store({
      data: {
        novels: {},
      },
      actionFactorys,
    }))
  }
  render() {
    const { children } = this.props
    return (
      <div name="my" style={LayoutStyle.stageCol}>
        <Nav />
        <div name="body" style={_.merge({}, LayoutStyle.body, { display: 'flex' })}>
          <div name={"left"}>
            <LeftNav />
          </div>
          <div name={"right"} style={{ flex: 1 }}>
            <Provider
              props={{ store: GlobalStores.get('My'), appStore: GlobalStores.get('App') }}
              connects={[
                { store: GlobalStores.get('App') },
                { store: GlobalStores.get('My') },
              ]}
            >
              {children}
            </Provider>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = My
