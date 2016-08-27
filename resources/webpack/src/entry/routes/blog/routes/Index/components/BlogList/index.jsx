import React, { PropTypes } from 'react'
import _ from 'lodash'
import BlogIndexBox from 'BlogIndexBox'
import R from 'R'
import DefaultHeaderIcon from 'DefaultHeaderIcon'
import { imageURL } from 'PathUtil'
import SvgIcon from 'SvgIcon'
import icons from '../../../icons.json'

function isOwner(userId, authorId) {
  return userId && authorId === userId
}

class BlogList extends React.Component {
  state = {}
  render() {
    const { blogs, userId, onDelBlog, toBlogEdit } = this.props
    return (
      <div>
        {
          _.map(blogs, ({ id, title, content, author, viewTimes, commentSize, updateDate }) => (
            <div style={{ margin: '40px auto', position: 'relative' }} key={id}>
              {isOwner(userId, author.id) ?
                <SvgIcon {...icons.del} onClick={() => onDelBlog(id)} /> : null}
              {isOwner(userId, author.id) ?
                <SvgIcon {...icons.edit} onClick={() => toBlogEdit(id)} /> : null}
              <BlogIndexBox
                url={`${R.BlogView}?blogId=${id}`}
                title={title}
                content={`${content.substr(0, 250)}${content.length > 250 ? '...' : ''}`}
                authorName={author.username}
                authorIcon={imageURL(author.headerIcon) || DefaultHeaderIcon}
                viewTimes={viewTimes}
                commentSize={commentSize}
                time={updateDate}
              />
            </div>
          ))
        }
      </div>
    )
  }
}
BlogList.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object),
  userId: PropTypes.string,
  onDelBlog: PropTypes.func.isRequired,
  toBlogEdit: PropTypes.func.isRequired,
}
export default BlogList
