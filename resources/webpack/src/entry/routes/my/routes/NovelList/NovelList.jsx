import React, { PropTypes } from 'react'
import Button from 'Button'
import { withRouter } from 'react-router'
import R from 'R'
import _ from 'lodash'
import css from './NovelList.scss'

class NovelList extends React.Component {
  state = {
    novels: [],
  }
  componentDidMount() {
    this.props.store.actions.getMyNovels(this.props.user.id)
  }
  onEditNovel = (novelId) => {
    this.props.router.push({
      pathname: R.MyNovelEdit,
      query: { novelId },
    })
  }
  addBook = () => {
    this.props.router.push(R.myaddnovel)
  }
  render() {
    const { novels } = this.props.store.data
    return (
      <div>
        <div className={css.controlPanel}>
          <Button onClick={this.addBook}>
            {'新增'}
          </Button>
        </div>
        <div className={css.novelList}>
          {
            _.map(novels, (n, k) => (
              <div key={k} className={css.novel}>
                <div className={css.rowCell}>
                  {n.name}
                </div>
                <div className={css.rowCell}>{n.author}</div>
                <Button onClick={() => this.onEditNovel(n.id)}>
                  {'修改'}
                </Button>
                <Button>
                  {'删除'}
                </Button>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}
NovelList.defaultProps = {
  user: {},
}
NovelList.propTypes = {
  user: PropTypes.object.isRequired,
  store: PropTypes.object,
}
module.exports = withRouter(NovelList)
