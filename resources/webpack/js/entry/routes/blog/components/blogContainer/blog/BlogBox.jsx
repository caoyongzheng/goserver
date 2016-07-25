import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'

import SvgIcon from 'SvgIcon'
import icons from './icons.json'

import { withRouter } from 'react-router'

import SideInfo from './components/SideInfo.jsx'

import clamp from 'Clamp'

const styles = {
  blogBox: {
    position: 'relative',
    padding: '20px 0 40px',
  },
  blogConciseBox: {
    paddingLeft: '120px',
    marginTop: '20px',
  },
  blogConcise: {
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
  titleLink: {
    color: '#0078c9',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  blogCover: {
    overflow: 'hidden',
    maxHeight: '200px',
    marginBottom: '32px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  blogCoverImg: {
    maxWidth: '100%',
    height: 'auto',
    verticalAlign: 'top',
  },
  blogText: {
    fontSize: '14px',
    fontWeight: 300,
    color: '#464b52',
    lineHeight: '28px',
  },
  blogStatistics: {
    paddingTop: '20px',
    fontSize: '14px',
    color: '#999',
  },
  blogStatisticsItem: {
    marginRight: '20px',
  },
  blogStatisticsItemLink: {
    color: 'rgba(41,46,53,0.6)',
    textDecoration: 'none',
    cursor: 'pointer',
  },
}

class BlogBox extends React.Component {
  componentDidMount() {
    clamp(ReactDOM.findDOMNode(this.refs.text), { clamp: 3 })
  }
  toBlog = () => {
    const { router, blog } = this.props
    router.push({
      pathname: '/blog/view',
      query: {
        blogId: blog.id,
      },
    })
  }
  render() {
    const { title, cover, content, updateDate, views,
      authorName, headerIcon, commentSize } = this.props.blog
    return (
      <section style={styles.blogBox}>
        <SideInfo
          category={icons.golang}
          time={updateDate}
          headerIcon={headerIcon}
          name={authorName}
        />
        <div style={styles.blogConciseBox}>
          <div style={styles.blogConcise}>
            <div style={styles.arrow} />
            <div name="blog-title" style={styles.title}>
              <a onClick={this.toBlog} style={styles.titleLink}>{title}</a>
            </div>
            {
              cover ? (
                <div style={styles.blogCover}>
                  <img src={cover} alt="blogCover" style={styles.blogCoverImg} />
                </div>
              ) : null
            }
            <div ref="text" name="blog-text" style={styles.blogText}>
              {content}
            </div>
            <div style={styles.blogStatistics}>
              <span style={styles.blogStatisticsItem}>
                <a onClick={this.toBlog} style={styles.blogStatisticsItemLink}>
                  <span><SvgIcon {...icons.view} /></span>
                  <span style={{ marginRight: '20px' }}>{views}</span>
                </a>
              </span>
              <span style={styles.blogStatisticsItem}>
                <a onClick={this.toBlog} style={styles.blogStatisticsItemLink}>
                  <span><SvgIcon {...icons.comment} /></span>
                  <span style={{ marginRight: '20px' }}>{commentSize}</span>
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
BlogBox.propTypes = {
  blog: PropTypes.object.isRequired,
}
export default withRouter(BlogBox)
