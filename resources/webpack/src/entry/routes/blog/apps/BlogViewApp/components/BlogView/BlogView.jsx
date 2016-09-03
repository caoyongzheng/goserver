import React, { PropTypes } from 'react'
import css from './BlogView.scss'
import Paper from 'material-ui/Paper'
import icons from 'BlogIcons'
import SvgIcon from 'SvgIcon'

function ViewBox({ id, title, html, authorName, authorIcon,
  viewTimes, commentSize, time, isOwner, onEdit, onDel }) {
  const date = new Date(time)
  const now = new Date()
  let year = ''
  if (now.getYear() > date.getYear()) {
    year = `${now.getYear()}年`
  }
  const timeFormat = `${year}${date.getMonth() + 1}月${date.getDate()}日`
  return (
    <Paper>
      {isOwner ? <SvgIcon {...icons.del} onClick={() => onDel(id)} /> : null}
      {isOwner ? <SvgIcon {...icons.edit} onClick={onEdit} /> : null}
      <div className={css.header}>
        {title}
      </div>
      <div className={css.body}>
        <div
          className={`${css.content} markdown-body`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <div className={css.footer}>
        <img
          src={authorIcon}
          title="作者"
          alt={authorName}
          width={30}
          height={30}
          style={{ borderRadius: '50%', verticalAlign: 'middle' }}
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

ViewBox.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  html: PropTypes.string,
  authorName: PropTypes.string,
  authorIcon: PropTypes.string,
  viewTimes: PropTypes.number,
  commentSize: PropTypes.number,
  time: PropTypes.string,
  isOwner: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDel: PropTypes.func.isRequired,
}
export default ViewBox
