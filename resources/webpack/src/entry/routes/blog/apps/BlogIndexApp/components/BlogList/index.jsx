import React, { PropTypes } from 'react'
import { Connector } from 'react-appstores'
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
          props={{ toBlogEdit: (blogId) => R.BlogEdit.go({ blogId }) }}
          connects={{ Auth: ['id'], Blog: ['blogs'] }}
          setProps={({ Auth: { id }, Blog: { blogs } }) => ({
            userId: id, blogs,
          })}
          setActions={({ DelBlogModal: { onDelBlog } }) => ({
            onDelBlog,
          })}
        />
        <Connector
          component={Pagination}
          connects={{ Blog: ['total', 'pagesize', 'page'] }}
          setProps={({ Blog: { total, pagesize, page } }, { Blog: { getBlogPage } }) => ({
            currentPage: page,
            pages: getPages(total, pagesize),
            style: {
              display: getPages(total, pagesize) < 2 ? 'none' : 'block',
              textAlign: 'center',
            },
            onChange(newpage) { getBlogPage({ page: newpage, pagesize }) },
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
