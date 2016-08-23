import React, { PropTypes } from 'react'

import Comments from '../components/comments/Comments'
import { withRouter } from 'react-router'
import css from './View.scss'
import ViewBox from '../components/ViewBox'
import marked from 'Marked'
import { imageURL } from 'PathUtil'
import DefaultHeaderIcon from 'DefaultHeaderIcon'
import { Store, Provider } from 'react-app-store'
import actionFactorys from '../actions'

class View extends React.Component {
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
          Component={ViewBox}
          connects={[
            {
              store: this.store,
              propsFn: ({ blog }) =>
                ({
                  title: blog.title,
                  html: marked(blog.content || ''),
                  authorName: blog.authorName,
                  authorIcon: imageURL(blog.authorIcon) || DefaultHeaderIcon,
                  viewTimes: blog.viewTimes,
                  commentSize: blog.commentSize,
                  time: blog.updateDate,
                }),
            },
          ]}
        />
        <div className={css.comments}>
          <Comments blogId={location.query.blogId} getBlog={this.getBlog} />
        </div>
      </div>
    )
  }
}
View.propTypes = {
  location: PropTypes.object.isRequired,
}
module.exports = withRouter(View)
