import React, { PropTypes } from 'react'
import _ from 'lodash'
import BlogIndexBox from 'BlogIndexBox'
import R from 'R'
import DefaultHeaderIcon from 'DefaultHeaderIcon'
import { imageURL } from 'PathUtil'
import SvgIcon from 'SvgIcon'
import icons from '../../../icons.json'

function isOwner(currentUserId, userId) {
  return currentUserId && currentUserId === userId
}

class BlogIndexs extends React.Component {
  state = {}
  render() {
    const { blogs, currentUserId, onDelBlog, toBlogEdit } = this.props
    return (
      <div>
        {
          _.map(blogs, ({ id, title, content, authorName, authorIcon,
            viewTimes, commentSize, updateDate, userId }) => (
            <div style={{ margin: '40px auto', position: 'relative' }} key={id}>
              {isOwner(currentUserId, userId) ?
                <SvgIcon {...icons.del} onClick={() => onDelBlog(id)} /> : null}
              {isOwner(currentUserId, userId) ?
                <SvgIcon {...icons.edit} onClick={() => toBlogEdit(id)} /> : null}
              <BlogIndexBox
                url={`${R.BlogView}?blogId=${id}`}
                title={title}
                content={`${content.substr(0, 250)}${content.length > 250 ? '...' : ''}`}
                authorName={authorName}
                authorIcon={imageURL(authorIcon) || DefaultHeaderIcon}
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
BlogIndexs.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object),
  currentUserId: PropTypes.string,
  onDelBlog: PropTypes.func.isRequired,
  toBlogEdit: PropTypes.func.isRequired,
}
export default BlogIndexs
