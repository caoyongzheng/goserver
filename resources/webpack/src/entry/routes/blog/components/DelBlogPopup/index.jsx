import React, { PropTypes } from 'react'
import css from './DelBlogPopup.scss'
import SvgIcon from 'SvgIcon'
import icons from './icons.json'

function DelBlogPopup({ show, blogTitle, close, delBlog, confirmTitle, onConfirmTitle }) {
  const disable = confirmTitle !== blogTitle
  return (
    <div
      className={`${css.cover} ${css[show ? 'show' : 'hide']}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          close()
        }
      }}
    >
      <div className={css.dialog}>
        <div className={css.header}>
          <span>{'请确认，是否删除博文？'}</span>
          <div className={css.closePosition}>
            <span className={css.closeIconWrap} onClick={close}>
              <SvgIcon {...icons.close} className={css.close} />
            </span>
          </div>
        </div>
        <div className={css.body}>
          <div className={css.warnBanner}>
            {'注意：该操将导致博客永久删除！'}
          </div>
        </div>
        <div className={css.footer}>
          <div className={css.form}>
            <lable className={css.confirmTitleLabel}>
              {'请输入博文名: '}
              <span style={{ fontWeight: 'bold' }}>{blogTitle}</span>
            </lable>
            <input
              className={css.confirmTitleInput}
              value={confirmTitle}
              onChange={(e) => onConfirmTitle(e.target.value)}
            />
            <button
              className={`${css.deleteButton} ${disable ? css.disable : css.success}`}
              onClick={delBlog}
            >
              {'删除博文'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
DelBlogPopup.propTypes = {
  show: PropTypes.bool,
  blogTitle: PropTypes.string,
  close: PropTypes.func.isRequired,
  delBlog: PropTypes.func.isRequired,
  confirmTitle: PropTypes.string,
  onConfirmTitle: PropTypes.func.isRequired,
}
export default DelBlogPopup
