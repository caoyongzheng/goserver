import React from 'react'

import Header from './components/header/Header.jsx'
import css from './blog.scss'

function Blog({ children }) {
  return (
    <div name="blog-router" className={css.blogState}>
      <Header />
      <div name="blog-body" className={css.body}>
        {children}
      </div>
    </div>
  )
}

module.exports = Blog
