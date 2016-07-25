import React from 'react'

import css from './Header.scss'
import blogImage from './images/blog.png'
import homeImage from './images/home.jpeg'
import LoginControl from 'LoginControl'
import { Link } from 'react-router'

function Header() {
  return (
    <header className={css.header}>
      <div className={css.wrap}>
        <section className={css.item}>
          <Link to="/" className={css.item}>
            <img src={homeImage} alt="home" className={css.img} />
          </Link>
        </section>
        <section className={css.item}>
          <Link to="/blog" className={css.item}>
            <img src={blogImage} alt="blog" className={css.img} />
          </Link>
        </section>
        <section style={{ flex: 1 }} className={css.item} />
        <section className={css.item}>
          <LoginControl />
        </section>
      </div>
    </header>
  )
}

export default Header
