import React from 'react'
const stores = {}

import _ from 'lodash'

export function addStore(key, data = {}) {
  stores[key] = {
    data,
    connectors: {},
  }
}


export function setState(key, data = {}) {
  const storeData = stores[key].data
  _.merge(storeData, data)
  _.forEach(stores[key].connectors, (c) => {
    c.setState(storeData)
  })
}

export function deleteStore(key) {
  delete stores[key]
}

export function connect(key, { propsFn, actions = {} }, Component) {
  return class Connect extends React.Component {
    constructor(props) {
      super(props)
      this.id = _.uniqueId()
      this.connectToStore()
      this.state = propsFn(stores[key].data)
    }
    componentWillUnmount() {
      delete stores[key].connectors[this.id]
    }
    connectToStore = () => {
      const c = {
        setState: (data) => this.setState(propsFn(data)),
      }
      stores[key].connectors[this.id] = c
    }
    render() {
      return (
        <Component {...this.state} {...actions} {...this.props} />
      )
    }
  }
}
