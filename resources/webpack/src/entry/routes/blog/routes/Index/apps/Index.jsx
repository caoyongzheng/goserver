import React from 'react'
import css from './Index.scss'
import BlogIndexBox from 'BlogIndexBox'
import { imageURL } from 'PathUtil'
import DefaultHeaderIcon from 'DefaultHeaderIcon'
import R from 'R'

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      pagesize: 10,
      total: 0,
      blogs: [],
    }
    this.getBlogPage(1, 10)
  }
  getBlogPage = (page, pagesize) => {
    $.ajax({
      url: `/api/blog/page?page=${page}&pagesize=${pagesize}`,
      success: (result) => {
        const { success, total, elements } = result
        if (success) {
          this.setState({
            blogs: elements,
            total,
          })
        } else {
          $.notify(result.desc)
        }
      },
    })
  }
  render() {
    const { blogs } = this.state
    return (
      <div name="homeStage" className={css.homeStage}>
        {
          blogs.map(({ _id, title, content, authorName, authorIcon,
            viewTimes, commentSize, updateDate }) => (
            <BlogIndexBox
              key={_id}
              url={`${R.BlogView}?blogId=${_id}`}
              title={title}
              content={`${content.substr(0, 250)}${content.length > 250 ? '...' : ''}`}
              authorName={authorName}
              authorIcon={imageURL(authorIcon) || DefaultHeaderIcon}
              viewTimes={viewTimes}
              commentSize={commentSize}
              time={updateDate}
            />
          ))
        }
      </div>
    )
  }
}

module.exports = Index
