import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import BlogViewBox from 'BlogViewBox'
import icons from '../../../icons.json'
import SvgIcon from 'SvgIcon'
import css from './BlogView.scss'
import _ from 'lodash'
import marked from 'Marked'
import { imageURL } from 'PathUtil'
import DefaultHeaderIcon from 'DefaultHeaderIcon'

class BlogView extends React.Component {
  toEditBlog = () => {
    const { router, blog } = this.props
    router.push({ pathname: '/app/blog/edit', query: { blogId: blog.id } })
  }
  isOwner = (userId, authorId) => userId === authorId && userId
  render() {
    const { blog, userId, onDelBlog } = this.props
    const { title, content, author, viewTimes, commentSize, updateDate } = blog
    const isEmpty = _.isEmpty(blog)
    const isOwner = this.isOwner(userId, _.get(author, 'id'))

    return (
      <div className={css.blogView}>
        {!isEmpty && isOwner ? <SvgIcon {...icons.del} onClick={onDelBlog} /> : null}
        {!isEmpty && isOwner ? <SvgIcon {...icons.edit} onClick={this.toEditBlog} /> : null}
        {
          isEmpty ? null : (
            <BlogViewBox
              title={title}
              html={marked(content)}
              authorName={author.username}
              authorIcon={imageURL(author.headerIcon) || DefaultHeaderIcon}
              viewTimes={viewTimes}
              commentSize={commentSize}
              time={updateDate}
            />
          )
        }
      </div>
    )
  }
}
BlogView.propTypes = {
  blog: PropTypes.object,
  userId: PropTypes.string,
  onDelBlog: PropTypes.func.isRequired,
}
export default withRouter(BlogView)
