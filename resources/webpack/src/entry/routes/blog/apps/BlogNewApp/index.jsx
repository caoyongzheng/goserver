import React from 'react'
import { storeSet } from 'react-store-set'
import BlogNewForm from './components/BlogNewForm'
import BlogFormStore from '../../stores/BlogFormStore'

const styles = {
  stage: {
    maxWidth: '980px',
    margin: '0 auto',
    padding: '0 1em',
  },
}

class BlogNewApp extends React.Component {
  constructor(props) {
    super(props)
    storeSet.addStore('BlogForm', BlogFormStore)
  }
  componentWillUnmount() {
    storeSet.delStore('BlogForm')
  }
  render() {
    return (
      <div style={styles.stage}>
        <div style={{ marginTop: '20px' }}>
          <BlogNewForm />
        </div>
      </div>
    )
  }
}
module.exports = BlogNewApp
