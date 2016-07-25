import React, { PropTypes } from 'react'

import DefaultHeaderIcon from 'DefaultHeaderIcon'
import { format } from 'TimeUtil'
import marked from 'Marked'

const styles = {
  comment: {
    border: 'solid 1px #ddd',
    minHeight: '10px',
    marginTop: '10px',
    padding: '10px 10px',
    borderRadius: '4px',
    backgroundColor: '#fff',
  },
  headerIcon: {
    borderRadius: '50%',
    height: '40px',
    width: '40px',
  },
}

const Comment = ({ headerIcon, name, content, date, floor }) => (
  <section name="comment" style={styles.comment}>
    <div name="infos" style={{ position: 'relative', height: '45px' }}>
      <img
        src={headerIcon}
        alt="headerIcon"
        style={styles.headerIcon}
      />
      <div style={{ position: 'absolute', top: 0, left: '65px' }}>
        <div name="by" style={{ paddingBottom: '3px' }}>
          {`#${floor}`} {name}
        </div>
        <div name="date" style={{ paddingBottom: '3px', fontSize: '13px' }}>
          {format('yyyy-MM-dd HH:mm:ss', date)}
        </div>
      </div>
    </div>
    <div
      name="content"
      className="markdown-body"
      style={{ padding: '10px 0' }}
      dangerouslySetInnerHTML={{ __html: marked(content || '') }}
    />
  </section>
)

Comment.defaultProps = {
  headerIcon: DefaultHeaderIcon,
  name: '匿名',
}

Comment.propTypes = {
  headerIcon: PropTypes.string,
  name: PropTypes.string,
  content: PropTypes.string,
  date: PropTypes.string,
  floor: PropTypes.number.isRequired,
}

export default Comment
