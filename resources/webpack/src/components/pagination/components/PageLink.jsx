import React, { PropTypes } from 'react'
import styles from './PageLink.scss'

const PageLink = ({ onClick, page, currentPage }) => {
  let kind = 'common'
  if (page === 0) {
    kind = 'disable'
  } else if (page === currentPage) {
    kind = 'active'
  }
  return (
    <li onClick={() => onClick(page)} className={styles.pagelink}>
      <span key={page} className={styles[kind]}>{page || '...'}</span>
    </li>
  )
}

PageLink.propTypes = {
  currentPage: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
}
export default PageLink
