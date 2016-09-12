import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import { storeSet, DispatchListener } from 'react-store-set'
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
    storeSet.addStore('Blog', BlogStore)
    storeSet.addStore('DelBlogModal', DelBlogModalStore)
    BlogStore.actions.getBlogPage({
      page: 1, pagesize: 10, ...props.location.query,
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.query !== this.props.location.query) {
      const { page, pagesize } = BlogStore.state
      BlogStore.actions.getBlogPage({
        page,
        pagesize,
        ...nextProps.location.query,
      })
    }
  }
  componentWillUnmount() {
    storeSet.delStore('Blog')
    storeSet.delStore('DelBlogModal')
  }
  getPages = (total, pagesize) =>
  Math.floor(total / pagesize) + Math.ceil(total % pagesize / pagesize)
  handleDidDelBlog = ({ state }) => {
    const { page, pagesize, total } = state
    BlogStore.actions.getBlogPage({
      page: Math.max(1, Math.min(this.getPages(total - 1, pagesize), page)),
      pagesize,
      ...this.props.location.query,
    })
  }
  render() {
    return (
      <div style={styles.stage}>
        <DispatchListener
          name={'DelBlogModal'}
          type={'DelBlog'}
          handler={this.handleDidDelBlog}
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
