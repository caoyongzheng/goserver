import React, { PropTypes } from 'react'
import Comments from '../components/comments/Comments'
import { withRouter } from 'react-router'
import css from './ViewApp.scss'
import BlogView from '../components/BlogView'
import marked from 'Marked'
import { imageURL } from 'PathUtil'
import DefaultHeaderIcon from 'DefaultHeaderIcon'
import { Store, Provider, GlobalStores } from 'react-app-store'
import actionFactorys from '../actions'

class ViewApp extends React.Component {
  constructor(props) {
    super(props)
    this.store = new Store({
      state: {
        blog: {},
      },
      actionFactorys,
    })
    this.getBlog()
  }
  getBlog = () => {
    const { location } = this.props
    this.store.actions.getBlog(location.query.blogId)
  }
  render() {
    const { location } = this.props
    return (
      <div name="viewStage" className={css.viewStage}>
        <Provider
          Component={BlogView}
          connects={[
            {
              store: this.store,
              propsFn: ({ blog }) =>
                ({
                  id: blog._id,
                  title: blog.title,
                  html: marked(blog.content || ''),
                  authorName: blog.authorName,
                  authorIcon: imageURL(blog.authorIcon) || DefaultHeaderIcon,
                  viewTimes: blog.viewTimes,
                  commentSize: blog.commentSize,
                  time: blog.updateDate,
                  userId: blog.userId,
                }),
              linkStates: ['blog'],
            },
            {
              store: GlobalStores.get('App'),
              propsFn({ user }) {
                return { currentUserId: user.id }
              },
              linkStates: ['user'],
            },
          ]}
        />
        <div className={css.comments}>
          <Comments blogId={location.query.blogId} />
        </div>
      </div>
    )
  }
}
ViewApp.propTypes = {
  location: PropTypes.object.isRequired,
}
module.exports = withRouter(ViewApp)
