import React, { PropTypes } from 'react'
import Comments from './components/comments/Comments'
import { storeSet, DispatchListener } from 'react-store-set'
import DelBlogModalStore from '../../stores/DelBlogModalStore'
import DelBlogModal from '../../components/DelBlogModal'
import BlogViewStore from './stores/BlogViewStore'
import BlogView from './components/BlogView'

const styles = {
  stage: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 10px',
    position: 'relative',
    height: '100%',
  },
  comments: {
    position: 'relative',
    marginTop: '20px',
  },
}

class BlogViewApp extends React.Component {
  constructor(props) {
    super(props)
    storeSet.addStore('BlogView', BlogViewStore)
    storeSet.addStore('DelBlogModal', DelBlogModalStore)
    BlogViewStore.actions.getBlog(this.getBlogId())
  }
  componentWillUnmount() {
    storeSet.delStore('BlogView')
    storeSet.delStore('DelBlogModal')
  }
  getBlogId = () => this.props.location.query.blogId
  updateViewTimes = () => {
    $.ajax({ url: '/api/blog/update,viewtimes', data: { blogId: this.getBlogId() } })
  }
  render() {
    const { location } = this.props
    return (
      <div style={styles.stage}>
        <DispatchListener
          name={'BlogView'}
          type={'GetBlog'}
          handler={this.updateViewTimes}
        />
        <div style={{ marginTop: '40px' }}>
          <BlogView />
        </div>
        <div style={styles.comments}>
          <Comments blogId={location.query.blogId} />
        </div>
        <DelBlogModal />
      </div>
    )
  }
}
BlogViewApp.propTypes = {
  location: PropTypes.object.isRequired,
}
module.exports = BlogViewApp
