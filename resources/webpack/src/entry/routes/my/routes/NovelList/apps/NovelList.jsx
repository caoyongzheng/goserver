import React, { PropTypes } from 'react'
import Button from 'Button'
import { withRouter } from 'react-router'
import R from 'R'
import _ from 'lodash'
import { Provider, Store } from 'react-app-store'
import css from './NovelList.scss'
import actionFactorys from '../actions'
import AddNovelForm from '../components/AddNovelForm'
import C from '../actions/Consants'

class NovelList extends React.Component {
  constructor(props) {
    super(props)
    this.store = new Store({
      state: {
        isAdd: false,
        name: '',
        author: '',
      },
      actionFactorys,
      didDispatch({ type }) {
        if (C.AddNovel === type) {
          props.store.actions.getMyNovels(props.appStore.data.user.id)
        }
      },
    })
    props.store.actions.getMyNovels(props.appStore.data.user.id)
  }
  onEditNovel = (novelId) => {
    this.props.router.push({
      pathname: R.MyNovelEdit,
      query: { novelId },
    })
  }
  render() {
    const { novels } = this.props.store.data
    return (
      <div>
        <div className={css.controlPanel}>
          <Button onClick={this.store.actions.onToAddNovel}>
            {'新增'}
          </Button>
        </div>
        <Provider
          Component={AddNovelForm}
          connects={[
            {
              store: this.store,
              propsFn: ({ isAdd, name, author }) => ({ show: isAdd, name, author }),
              actionsFn: ({ onName, onAuthor, onAddNovel, onCancelAddNovel }) => (
                { onName, onAuthor, onSubmit: onAddNovel, onCancel: onCancelAddNovel }
              ),
            },
          ]}
        />
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
  appStore: PropTypes.object,
}
module.exports = withRouter(NovelList)
