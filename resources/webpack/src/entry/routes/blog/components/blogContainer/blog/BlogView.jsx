import React, { PropTypes } from 'react'

import icons from './icons.json'
import SvgIcon from 'SvgIcon'
import SideInfo from './components/SideInfo.jsx'
import marked from 'Marked'
import { withRouter } from 'react-router'

import { connect } from 'Stores'

const styles = {
  viewBox: {
    position: 'relative',
    padding: '20px 0 40px',
  },
  viewStage: {
    paddingLeft: '120px',
    paddingTop: '20px',
  },
  view: {
    boxShadow: '1px 1px 2px rgba(0,0,0,.08)',
    border: '1px solid #dee8ef',
    background: '#fff',
    padding: '25px 40px',
    position: 'relative',
  },
  arrow: {
    position: 'absolute',
    left: '-0.6em',
    top: '28px',
    width: '1.2em',
    height: '1.2em',
    transform: 'rotate(45deg)',
    transition: 'background 0.1s linear',
    backgroundColor: '#fff',
    borderLeft: '1px solid #dee8ef',
    borderBottom: '1px solid #dee8ef',
    zIndex: 2,
  },
  title: {
    fontSize: '24px',
    paddingBottom: '20px',
    lineHeight: '30px',
  },
  infoBox: {
    height: '60px',
    lineHeight: '60px',
    background: '#f3f6f7',
    padding: '0 40px',
    position: 'relative',
    margin: '0 -40px -25px',
  },
  avatar: {
    marginRight: '15px',
    display: 'inline-block',
  },
  headerImg: {
    width: '32px',
    height: '32px',
    borderRadius: '32px',
    verticalAlign: 'middle',
    backgroundColor: '#fff',
  },
  name: {
    fontSize: '14px',
    color: '#0078c9',
    marginRight: '20px',
  },
  views: {
    fontSize: '14px',
    color: 'rgba(41,46,53,0.6)',
    marginRight: '20px',
  },
  comments: {
    fontSize: '14px',
    color: 'rgba(41,46,53,0.6)',
    marginRight: '20px',
  },
  edit: {
    position: 'absolute',
    right: '12px',
    top: '12px',
    padding: '3px',
    cursor: 'pointer',
  },
}
function BlogView({ blog, router, user }) {
  const { id, content, title, updateDate, views,
    headerIcon, authorName, userId, commentSize } = blog
  return (
    <section style={styles.viewBox}>
      <SideInfo
        time={updateDate}
        headerIcon={headerIcon}
        name={authorName}
      />
      <div style={styles.viewStage}>
        <div style={styles.view}>
          {
            user.id !== userId ? null :
              <div
                style={styles.edit}
                onClick={() => router.push({ pathname: '/blog/edit/', query: { blogId: id } })}
              >
                <SvgIcon {...icons.edit} />
              </div>
          }
          <div style={styles.arrow} />
          <div style={styles.content}>
            <div style={styles.title}>
              {title}
            </div>
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: marked(content || '') }}
            />
          </div>
          <div style={styles.infoBox}>
            <span style={styles.views}>
              <SvgIcon {...icons.view} />
              <span>{views}</span>
            </span>
            <span style={styles.comments}>
              <SvgIcon {...icons.comment} />
              <span>{commentSize}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

BlogView.defaultProps = {
  user: {},
}
BlogView.propTypes = {
  user: PropTypes.object,
  blog: PropTypes.object.isRequired,
}

const propsFn = (state) => ({
  user: state.user,
})

export default withRouter(connect('app', { propsFn }, BlogView))
