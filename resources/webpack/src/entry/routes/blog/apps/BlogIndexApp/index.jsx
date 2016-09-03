import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import { globalAppStores, DispatchListener } from 'react-appstores'
import BlogStore from './stores/BlogStore'
import DelBlogModalStore from '../../stores/DelBlogModalStore'
import BlogList from './components/BlogList'
import DelBlogModal from '../../components/DelBlogModal'

const styles = {
  stage: {
    position: 'relative',
  },
  blogList: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 10px',
    position: 'relative',
    height: '100%',
  },
}

class BlogIndexApp extends React.Component {
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
      <div style={styles.stage}>
        <DispatchListener
          storeName={'DelBlogModal'}
          type={'DelBlog'}
          handle={this.handleDidDelBlog}
        />
        <div style={styles.blogList}>
          <BlogList getPages={this.getPages} />
        </div>
        <DelBlogModal />
      </div>
    )
  }
}

BlogIndexApp.propTypes = {
  location: PropTypes.object,
}

module.exports = withRouter(BlogIndexApp)
