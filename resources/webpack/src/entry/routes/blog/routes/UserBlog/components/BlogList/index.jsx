import React, { PropTypes } from 'react'
import BlogIndexBox from 'BlogIndexBox'
import R from 'R'
import _ from 'lodash'
import { imageURL } from 'PathUtil'
import DefaultHeaderIcon from 'DefaultHeaderIcon'

function UserBlogs({ blogs }) {
  return (
    <div>
      {
        _.map(blogs, ({ id, title, content, authorName, authorIcon,
          viewTimes, commentSize, updateDate }) => (
          <div key={id} style={{ paddingTop: '40px', position: 'relative' }}>
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

UserBlogs.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object),
}
export default UserBlogs
