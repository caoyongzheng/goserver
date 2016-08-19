import React from 'react'
import Nav from 'Nav'
import css from './blog.scss'

function Blog({ children }) {
  return (
    <div name="blog-router" className={css.blogState}>
      <Nav />
      <div name="blog-body" className={css.body}>
        {children}
      </div>
    </div>
  )
}

module.exports = Blog
