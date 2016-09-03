import React, { PropTypes } from 'react'

import Comment from './components/Comment.jsx'
import MDEditor from 'react-mdeditor'
import css from './Comments.scss'
import request from 'superagent'
import Pagination from 'Pagination'
import _ from 'lodash'
import { imageURL } from 'PathUtil'

class Comments extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      comments: [],
      pagesize: 5,
      currentPage: 1,
      pages: 1,
      size: 0,
    }
    this.setCurrentPage(1)
  }
  setCurrentPage = (page) => {
    const { pagesize } = this.state
    const { blogId } = this.props
    request.get('/api/blogComment')
    .query({ blogId })
    .query({ page, pagesize })
    .then((res) => {
      const result = res.body
      if (result.success) {
        const { comments, size } = result.data
        this.setState({
          comments: comments || [],
          currentPage: page,
          size,
        })
        return
      }
      $.notify(result.desc)
    }, (err) => {
      $.notify(err)
    })
  }
  getPages = (size, pagesize) => (
    Math.floor(size / pagesize) + Math.ceil(size % pagesize / pagesize)
  )
  handleSubmit = () => {
    const comment = {
      blogId: this.props.blogId,
      content: this.refs.mdEditor.codeMirror.getValue(),
    }
    if (_.isEmpty(comment.content)) {
      $.notify('content should not be Empty!')
      return
    }
    request.post('/api/blogComment')
    .send(comment)
    .then((res) => {
      const result = JSON.parse(res.text)
      if (result.success) {
        const { size, pagesize } = this.state
        this.setCurrentPage(this.getPages(size + 1, pagesize))
        return
      }
      $.notify(result.desc)
    }, (err) => {
      $.notify(err)
    })
  }
  render() {
    const { comments, size, currentPage, pagesize } = this.state
    const pages = this.getPages(size, pagesize)
    return (
      <div name="comments" className={css.comments}>
        {
          comments.map((c, i) =>
            <Comment
              key={c.id}
              floor={(currentPage - 1) * pagesize + i + 1}
              content={c.content}
              date={c.date}
              headerIcon={imageURL(c.headerIcon)}
              name={c.name}
            />
          )
        }
        <div
          style={{ display: pages === 1 ? 'none' : 'block' }}
          className={css.pagination}
        >
          <Pagination
            pages={pages}
            currentPage={currentPage}
            onChange={this.setCurrentPage}
          />
        </div>
        <div name="post" className={css.post}>
          <MDEditor ref="mdEditor" mode="tab" height={200} />
          <div name="action" className={css.action}>
            <div style={{ flex: 1 }} />
            <button
              className={`${css.submit} ${css.right}`}
              onClick={this.handleSubmit}
            >
              {'保存'}
            </button>
          </div>
        </div>
      </div>
    )
  }
}
Comments.propTypes = {
  blogId: PropTypes.string.isRequired,
}
export default Comments
