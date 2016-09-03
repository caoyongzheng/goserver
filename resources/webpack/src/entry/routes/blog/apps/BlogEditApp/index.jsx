import React, { PropTypes } from 'react'
import css from './Edit.scss'
import { withRouter } from 'react-router'
import BlogEditForm from './components/BlogEditForm'
import BlogFormStore from '../../stores/BlogFormStore'
import { globalAppStores } from 'react-appstores'

class Edit extends React.Component {
  constructor(props) {
    super(props)
    globalAppStores.addStore('BlogForm', BlogFormStore)
    const { location } = this.props
    globalAppStores.actions.BlogForm.getBlog(location.query.blogId)
  }
  componentWillUnmount() {
    globalAppStores.delStore('BlogForm')
  }
  render() {
    return (
      <div className={css.stage}>
        <div style={{ marginTop: '20px' }}>
          <BlogEditForm />
        </div>
      </div>
    )
  }
}
Edit.propTypes = {
  location: PropTypes.object.isRequired,
}
module.exports = withRouter(Edit)
