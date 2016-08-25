import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import R from 'R'
import css from './NewBlog.scss'

class NewBlog extends React.Component {
  toBlogNew = () => {
    this.props.router.push(R.BlogNew)
  }
  render() {
    return (
      <button className={css.link} onClick={this.toBlogNew}>
        {'新建博文'}
      </button>
    )
  }
}
NewBlog.propTypes = {
  className: PropTypes.string,
}
export default withRouter(NewBlog)
