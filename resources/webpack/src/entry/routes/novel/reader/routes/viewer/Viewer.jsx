import React, { PropTypes } from 'react'
import css from './Viewer.scss'
import _ from 'lodash'
import DataStores from 'DataStores'

class Viewer extends React.Component {
  state = {}
  render() {
    const { params } = this.props
    const novel = DataStores.get('novelreader').get('novel')
    console.log(novel)
    const section = _.find(novel.sections, { id: params.sectionID })
    return (
      <section className={css.textBox}>
        <div className={css.titleBox}>
          <h1 className={css.textTitle}>{section.name}</h1>
          <p className={css.textInfo}>
            {'小说：'}
            <a style={{ marginRight: '10px' }}>{novel.name}</a>
            {'作者：'}
            <a style={{ marginRight: '10px' }}>{novel.author}</a>
            {'字数：'}
            <a style={{ marginRight: '10px' }}>{3009}</a>
            {'时间：'}
            <a style={{ marginRight: '10px' }}>{section.time}</a>
          </p>
        </div>
        <section className={css.text}>
          {
            _.map(section.paragraphs, (p, i) => (
              <p key={i}><span style={{ paddingLeft: '2em', height: '1em' }} />{p}</p>
            ))
          }
        </section>
      </section>
    )
  }
}
Viewer.propTypes = {
  params: PropTypes.object,
}
module.exports = Viewer
