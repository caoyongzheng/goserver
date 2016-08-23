import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import BlogViewBox from 'BlogViewBox'
import icons from './icons.json'
import SvgIcon from 'SvgIcon'
import css from './BlogView.scss'

class BlogView extends React.Component {
  toEditBlog = () => {
    const { router, id } = this.props
    router.push({ pathname: '/app/blog/edit', query: { blogId: id } })
  }
  render() {
    const { title, html, authorName, authorIcon,
      viewTimes, commentSize, time, currentUserId, userId } = this.props
    const isOwner = currentUserId && userId && currentUserId === userId
    return (
      <div className={css.blogView}>
        {
          isOwner ? <SvgIcon {...icons.edit} onClick={this.toEditBlog} /> : null
        }
        <BlogViewBox
          title={title}
          html={html}
          authorName={authorName}
          authorIcon={authorIcon}
          viewTimes={viewTimes}
          commentSize={commentSize}
          time={time}
        />
      </div>
    )
  }
}
BlogView.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  html: PropTypes.string,
  authorName: PropTypes.string,
  authorIcon: PropTypes.string,
  viewTimes: PropTypes.number,
  commentSize: PropTypes.number,
  time: PropTypes.string,
  userId: PropTypes.string,
  currentUserId: PropTypes.string,
}
export default withRouter(BlogView)
