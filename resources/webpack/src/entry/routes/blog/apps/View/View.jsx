import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import { Store, Provider, GlobalStores } from 'react-app-store'
import Comments from './components/comments/Comments'
import BlogView from './components/BlogView'
import actionFactorys from './actions'
import css from './ViewApp.scss'
import { globalAppStores } from 'react-appstores'
import DelBlogModalStore from '../../stores/DelBlogModalStore'
import DelBlogModal from '../../components/DelBlogModal'

class ViewApp extends React.Component {
  constructor(props) {
    super(props)
    globalAppStores.addStore('DelBlogModal', DelBlogModalStore)
    this.store = new Store({
      state: {
        blog: {},
        delBlogPopupShow: false,
        confirmTitle: '',
      },
      actionFactorys,
      didDispatch: ({ type }) => {
        if (type === 'GetBlog') {
          $.ajax({
            url: `/api/blog/update,viewtimes?blogId=${this.getBlogId()}`,
          })
        }
      },
    })
    this.getBlog()
  }
  componentWillUnmount() {
    globalAppStores.delStore('DelBlogModal')
  }
  getBlog = () => {
    this.store.actions.getBlog(this.getBlogId())
  }
  getBlogId = () => this.props.location.query.blogId
  render() {
    const { location } = this.props
    return (
      <div name="viewStage" className={css.viewStage}>
        <Provider
          Component={BlogView}
          connects={[
            {
              store: this.store,
              propsFn: ({ blog }) => ({ blog }),
              linkStates: ['blog'],
              actionsFn() {
                return { onDelBlog: globalAppStores.actions.DelBlogModal.onDelBlog }
              },
            },
            {
              store: GlobalStores.get('App'),
              propsFn({ user }) {
                return { userId: user.id }
              },
              linkStates: ['user'],
            },
          ]}
        />
        <div className={css.comments}>
          <Comments blogId={location.query.blogId} />
        </div>
        <DelBlogModal />
      </div>
    )
  }
}
ViewApp.propTypes = {
  location: PropTypes.object.isRequired,
}
module.exports = withRouter(ViewApp)
