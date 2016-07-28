import React from 'react'

import styles from './Paging.scss'

import Pagination from 'Pagination'

class Paging extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        pages: 20,
        currentPage: 1,
      }
  }
  onChange = (page) => {
    this.setState({
      currentPage: page,
    })
  }
  render() {
    const { pages, currentPage } = this.state
    return (
      <div className={styles.stage}>
        <Pagination pages={pages} currentPage={currentPage} onChange={this.onChange} />
      </div>
    )
  }
}
module.exports = Paging
