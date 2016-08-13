import React from 'react'

import { addStore, deleteStore } from 'StateStores'
import { getUser } from 'LoginAction'

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
    return this.props.children
  }
}

export default App
