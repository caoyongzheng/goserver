import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import { globalAppStores, DispatchListener } from 'react-appstores'
import css from './Index.scss'
import BlogStore from './stores/BlogStore'
import DelBlogModalStore from '../../stores/DelBlogModalStore'
import BlogList from './components/BlogList'
import DelBlogModal from '../../components/DelBlogModal'

class Index extends React.Component {
  constructor(props) {
    super(props)
    globalAppStores.addStore('Blog', BlogStore)
    globalAppStores.addStore('DelBlogModal', DelBlogModalStore)
    globalAppStores.actions.Blog.getBlogPage({
      page: 1, pagesize: 10, ...props.location.query,
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.query !== this.props.location.query) {
      const { page, pagesize } = globalAppStores.states.Blog
      globalAppStores.actions.Blog.getBlogPage({
        page,
        pagesize,
        ...nextProps.location.query,
      })
    }
  }
  componentWillUnmount() {
    globalAppStores.delStore('Blog')
    globalAppStores.delStore('DelBlogModal')
  }
  getPages = (total, pagesize) =>
  Math.floor(total / pagesize) + Math.ceil(total % pagesize / pagesize)
  handleDidDelBlog = ({ states }) => {
    const { page, pagesize, total } = states.Blog
    globalAppStores.actions.Blog.getBlogPage({
      page: Math.max(1, Math.min(this.getPages(total - 1, pagesize), page)),
      pagesize,
      ...this.props.location.query,
    })
  }
  render() {
    return (
      <div className={css.stage}>
        <DispatchListener
          storeName={'DelBlogModal'}
          type={'DelBlog'}
          handle={this.handleDidDelBlog}
        />
        <div className={css.blogList}>
          <BlogList getPages={this.getPages} />
        </div>
        <DelBlogModal />
      </div>
    )
  }
}

Index.propTypes = {
  location: PropTypes.object,
}

module.exports = withRouter(Index)
