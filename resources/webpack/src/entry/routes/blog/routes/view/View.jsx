import React, { PropTypes } from 'react'

import BlogContainer from 'BlogContainer'
import BlogView from 'BlogView'
import Comments from './components/comments/Comments'
import { getBlog } from '../../actions/blogAction'
import { withRouter } from 'react-router'

import css from './View.scss'

class View extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blog: {},
    }
    this.getBlog()
  }
  getBlog = () => {
    const { location } = this.props
    getBlog(location.query.blogId, {
      successHandle: (result) => {
        this.setState({
          blog: result.data,
        })
      },
    })
  }
  render() {
    const { location } = this.props
    const { blog } = this.state
    return (
      <div name="viewStage" className={css.viewStage}>
        <BlogContainer>
          <BlogView blog={blog} />
          <div name="comments-conatiner" className={css.comments}>
            <Comments blogId={location.query.blogId} getBlog={this.getBlog} />
          </div>
        </BlogContainer>
      </div>
    )
  }
}
View.propTypes = {
  location: PropTypes.object.isRequired,
}
module.exports = withRouter(View)
