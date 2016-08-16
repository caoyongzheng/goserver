import React from 'react'
import css from './Catalog.scss'
import DataStores from 'DataStores'
import _ from 'lodash'
import { withRouter } from 'react-router'

class Catalog extends React.Component {
  handleClick = (id) => {
    this.props.router.push(`/novelreader/viewer/${id}`)
  }
  render() {
    const sections = DataStores.get('novelreader').get('novel').sections
    return (
      <section className={css.catalog}>
        {
          _.map(sections, (s, i) => (
            <div key={i} onClick={() => this.handleClick(s.id)}>{s.name}</div>
          ))
        }
      </section>
    )
  }
}

module.exports = withRouter(Catalog)
