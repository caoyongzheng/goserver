import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import R from 'R'
import css from './NewBlogButton.scss'
import { GlobalStores } from 'react-app-store'

class NewBlog extends React.Component {
  toBlogNew = () => {
    const user = GlobalStores.get('App').getState().user
    if (user.logStatus === 'LOGOUT') {
      GlobalStores.get('App').actions.onSignModalDisplay('SignIn')
      return
    }
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
