import React, { PropTypes } from 'react'

import css from './SideInfo.scss'
import DefaultHeaderIcon from 'DefaultHeaderIcon'
import { imageURL } from 'PathUtil'

function SideInfo({ time, headerIcon, name }) {
  const date = new Date(time)
  const timeFormat = `${date.getMonth() + 1}月${date.getDate()}日`
  return (
    <div className={css.sideInfo}>
      <a className={css.headerIconLink}>
        <img
          src={imageURL(headerIcon) || DefaultHeaderIcon}
          className={css.headerIcon}
          alt="authorIcon"
        />
      </a>
      <div className={css.time}>{timeFormat}</div>
      <div className={css.author}>
        <a className={css.authorLink}>{name || 'anonymous'}</a>
      </div>
    </div>
  )
}

SideInfo.propTypes = {
  time: PropTypes.string,
  headerIcon: PropTypes.string,
  name: PropTypes.string,
}

export default SideInfo
