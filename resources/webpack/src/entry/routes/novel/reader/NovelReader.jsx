import React, { Component } from 'react'
import css from './NovelReader.scss'
import novel from './novel.json'
import DataStores from 'DataStores'

class NovelReader extends Component {
  constructor(props) {
    super(props)
    this.dataStore = DataStores.add('novelreader')
    this.dataStore.set('novel', novel)
  }
  componentWillUnmount() {
    DataStores.del('novelreader')
  }
  render() {
    const { children } = this.props
    return (
      <div className={css.stage}>
        <div className={css.readerStage}>
          {children}
        </div>
      </div>
    )
  }
}

module.exports = NovelReader
