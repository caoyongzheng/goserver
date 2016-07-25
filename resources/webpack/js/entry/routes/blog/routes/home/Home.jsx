import React from 'react'

import request from 'superagent'

import css from './Home.scss'
import BlogContainer from 'BlogContainer'
import BlogBox from 'BlogBox'

class Home extends React.Component {
  state = {
    blogs: [],
  }
  componentDidMount() {
    this.getBlogPage(1, 10)
  }
  getBlogPage = (page, pagesize) => {
    request
      .get('/api/blog/page')
      .query({ page, pagesize })
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
  render() {
    const { blogs } = this.state
    return (
      <div name="homeStage" className={css.homeStage}>
        <BlogContainer>
          {
            blogs.map((blog, i) => <BlogBox key={i} blog={blog} />)
          }
        </BlogContainer>
      </div>
    )
  }
}

module.exports = Home
