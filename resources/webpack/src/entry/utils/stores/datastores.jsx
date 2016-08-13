import _ from 'lodash'

class DataStore {
  constructor(data) {
    this.data = data || {}
  }
  get = (key) => {
    return this.data[key]
  }
  set = (key, value) => {
    this.data[key] = value
  }
  del = (key) => {
    if (!_.isEmpty(this.data[key])) {
      delete this.data[key]
    }
  }
}

class DataStores {
  constructor() {
    this.datastores = {}
  }
  add = (key, data = {}) => {
    if (_.isEmpty(this.datastores[key])) {
      this.datastores[key] = new DataStore(data)
    }
    return this.datastores[key]
  }
  get = (key) => {
    return this.datastores[key]
  }
  del = (key) => {
    if (!_.isEmpty(this.datastores[key])) {
      delete this.datastores[key]
    }
  }
}

export default new DataStores()
