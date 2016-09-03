import React, { PropTypes } from 'react'
import css from './IndexBox.scss'
import { Link } from 'react-router'
import Paper from 'material-ui/Paper'

function IndexBox({ url, title, content, authorName, authorIcon,
  viewTimes, commentSize, time }) {
  const date = new Date(time)
  const now = new Date()
  let year = ''
  if (now.getYear() > date.getYear()) {
    year = `${now.getYear()}年`
  }
  const timeFormat = `${year}${date.getMonth() + 1}月${date.getDate()}日`
  return (
    <Paper style={{ padding: '20px 40px' }}>
      <div className={css.header}>
        <Link to={url}>
          {title}
        </Link>
      </div>
      <div className={css.body}>
        <p>
          {content}
        </p>
      </div>
      <div className={css.footer}>
        <img
          src={authorIcon}
          title="作者"
          alt={authorName}
          width={30}
          height={30}
          className={css.headerIcon}
        />
        <span style={{ marginLeft: '5px' }}>{authorName}</span>
        <span style={{ marginLeft: '20px' }}>{'浏览'}</span>
        <span style={{ marginLeft: '5px' }}>{viewTimes}</span>
        <span style={{ marginLeft: '20px' }}>{'评论'}</span>
        <span style={{ marginLeft: '5px' }}>{commentSize}</span>
        <span style={{ marginLeft: '20px' }}>{'更新时间'}</span>
        <span style={{ marginLeft: '5px' }}>{timeFormat}</span>
      </div>
    </Paper>
  )
}

IndexBox.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  authorIcon: PropTypes.string.isRequired,
  viewTimes: PropTypes.number.isRequired,
  commentSize: PropTypes.number.isRequired,
  time: PropTypes.string.isRequired,
}
export default IndexBox
