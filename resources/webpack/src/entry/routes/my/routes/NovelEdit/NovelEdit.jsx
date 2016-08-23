import React, { PropTypes } from 'react'
import _ from 'lodash'
import Button from 'Button'
import { withRouter } from 'react-router'
import R from 'R'

class NovelEdit extends React.Component {
  constructor(props) {
    super(props)
    const { location, store } = props
    const { novelId } = location.query
    if (_.isEmpty(novelId)) {
      return
    }
    store.actions.getNovelCatalog(novelId)
  }
  onAddSection = (novelId) => {
    this.props.router.push({
      pathname: R.MyNovelSectionAdd,
      query: { novelId },
    })
  }
  render() {
    const { location, store } = this.props
    const { novelId } = location.query
    const novel = store.data.novels[novelId] || {}
    return (
      <div>
        <div>
          <label>{'名字：'}</label>
          <span>{novel.name}</span>
        </div>
        <div>
          <label>{'作者：'}</label>
          <span>{novel.author}</span>
        </div>
        <div>
          <label>{'章节'}</label>
          {
            _.map(novel.sections, (s) => (
              <div key={s.id}>{s.name}</div>
            ))
          }
          <div>
            <Button onClick={() => this.onAddSection(novelId)}>{'新增'}</Button>
          </div>
        </div>
      </div>
    )
  }
}
NovelEdit.propTypes = {
  location: PropTypes.object,
  store: PropTypes.object,
}
module.exports = withRouter(NovelEdit)
