import React, { PropTypes } from 'react'
import { Connector } from 'react-store-set'
import BlogIndexList from 'BlogIndexList'
import Pagination from 'Pagination'
import R from 'R'

class BlogList extends React.Component {
  state = {}
  render() {
    const { getPages } = this.props
    return (
      <div>
        <Connector
          component={BlogIndexList}
          connects={{ Auth: ['id'], Blog: ['blogs'] }}
          setProps={({ Auth, Blog, DelBlogModal }) => ({
            userId: Auth.state.id,
            blogs: Blog.state.blogs,
            onDelBlog: DelBlogModal.actions.onDelBlog,
            toBlogEdit: (blogId) => R.BlogEdit.go({ blogId }),
          })}
        />
        <Connector
          component={Pagination}
          connects={{ Blog: ['total', 'pagesize', 'page'] }}
          setProps={({ Blog }) => ({
            currentPage: Blog.state.page,
            pages: getPages(Blog.state.total, Blog.state.pagesize),
            style: {
              display: getPages(Blog.state.total, Blog.state.pagesize) < 2 ? 'none' : 'block',
              textAlign: 'center',
            },
            onChange(newpage) {
              Blog.actions.getBlogPage({ page: newpage, pagesize: Blog.state.pagesize })
            },
          })}
        />
      </div>
    )
  }
}
BlogList.propTypes = {
  getPages: PropTypes.func.isRequired,
}
export default BlogList
