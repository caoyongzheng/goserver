import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import { Store, Provider, GlobalStores } from 'react-app-store'
import DelBlogPopup from 'DelBlogPopup'
import Comments from '../components/comments/Comments'
import BlogView from '../components/BlogView'
import actionFactorys from '../actions'
import css from './ViewApp.scss'

class ViewApp extends React.Component {
  constructor(props) {
    super(props)
    this.store = new Store({
      state: {
        blog: {},
        delBlogPopupShow: false,
        confirmTitle: '',
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
              propsFn: ({ blog }) => ({ blog }),
              linkStates: ['blog'],
              actionsFn({ delBlogPopupShow }) {
                return { onDelBlog: delBlogPopupShow }
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
        <Provider
          Component={DelBlogPopup}
          connects={[{
            store: this.store,
            propsFn({ blog, delBlogPopupShow, confirmTitle }) {
              return { blogTitle: blog.title, show: delBlogPopupShow, confirmTitle }
            },
            linkStates: ['blog', 'delBlogPopupShow', 'confirmTitle'],
            actionsFn({ delBlogPopupClose, delBlog, onConfirmTitle }) {
              return { close: delBlogPopupClose, delBlog, onConfirmTitle }
            },
          }]}
        />
      </div>
    )
  }
}
ViewApp.propTypes = {
  location: PropTypes.object.isRequired,
}
module.exports = withRouter(ViewApp)
/*
id: blog.id,
title: blog.title,
html: marked(blog.content || ''),
authorName: blog.author.username,
authorIcon: imageURL(blog.author.headerIcon) || DefaultHeaderIcon,
viewTimes: blog.viewTimes,
commentSize: blog.commentSize,
time: blog.updateDate,
userId: blog.author.id,
 */
