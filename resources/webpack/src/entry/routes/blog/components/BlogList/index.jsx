import React, { PropTypes } from 'react'
import _ from 'lodash'
import BlogIndexBox from 'BlogIndexBox'
import R from 'R'
import DefaultHeaderIcon from 'DefaultHeaderIcon'
import { imageURL } from 'PathUtil'
import SvgIcon from 'SvgIcon'
import icons from './icons.json'
import css from './BlogList.scss'

function isOwner(userId, authorId) {
  return userId && authorId === userId
}

function BlogList({ blogs, userId, onDelBlog, toBlogEdit }) {
  return (
    <div style={{ paddingTop: '40px' }}>
      {
        _.map(blogs, ({ id, title, content, author, viewTimes, commentSize, updateDate }) => (
          <div className={css.indexBoxWrap} key={id}>
            <div className={css.controlIcons}>
              {isOwner(userId, author.id) ?
                <SvgIcon {...icons.del} onClick={() => onDelBlog(id)} /> : null}
              {isOwner(userId, author.id) ?
                <SvgIcon {...icons.edit} onClick={() => toBlogEdit(id)} /> : null}
            </div>
            <BlogIndexBox
              url={`${R.BlogView.pathname}?blogId=${id}`}
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

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object),
  userId: PropTypes.string,
  onDelBlog: PropTypes.func.isRequired,
  toBlogEdit: PropTypes.func.isRequired,
}
export default BlogList
