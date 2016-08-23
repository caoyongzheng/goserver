import React from 'react'
import Nav from 'Nav'
import css from './BlogApp.scss'

function Blog({ children }) {
  return (
    <div name="blog-router" className={css.blogState}>
      <div>
        <Nav />
      </div>
      <div name="blog-body" className={css.body}>
        {children}
      </div>
    </div>
  )
}

module.exports = Blog
