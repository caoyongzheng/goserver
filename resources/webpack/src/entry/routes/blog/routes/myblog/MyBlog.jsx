import React, { PropTypes } from 'react'

import request from 'superagent'
import css from './MyBlog.scss'
import BlogContainer from 'BlogContainer'
import BlogBox from 'BlogBox'
import { withRouter } from 'react-router'

class MyBlog extends React.Component {
  state = {
    blogs: [],
  }
  componentDidMount() {
    const { location } = this.props
    const userId = location.query.userId
    this.getBlogPage(1, 10, userId)
  }
  getBlogPage = (page, pagesize, userId) => {
    request
      .get('/api/blog/page')
      .query({ page, pagesize, userId })
      .then((res) => {
        const result = JSON.parse(res.text)
        if (result.success) {
          this.setState({
            blogs: result.data.elements,
          })
        } else {
          $.notify(result.desc)
        }
      }, (err) => {
        $.notify(err)
      })
  }
  toAdd = () => {
    this.props.router.push('/blog/add')
  }
  render() {
    const { blogs } = this.state
    return (
      <div className={css.stage}>
        <BlogContainer>
          <div className={css.ops}>
            <div className={css.add} onClick={this.toAdd}>
              新增
            </div>
          </div>
          {
            blogs.map((blog, i) => <BlogBox key={i} blog={blog} />)
          }
        </BlogContainer>
      </div>
    )
  }
}
MyBlog.propTypes = {
  location: PropTypes.object,
}
module.exports = withRouter(MyBlog)
