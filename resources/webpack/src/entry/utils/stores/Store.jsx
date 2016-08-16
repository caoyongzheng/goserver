import React from 'react'
export default class Store {
  constructor(options) {
    const { state, data, actionFn } = options
    this.state = state || {}
    this.data = data || {}
    this.actions = actionFn
    this.Providers = {}
  }
  getState = () => this.state
  setState = (key, value) => {
    this.state[key] = value
  }
  getData = () => this.data
  setData = (key, value) => { this.data[key] = value }
}
