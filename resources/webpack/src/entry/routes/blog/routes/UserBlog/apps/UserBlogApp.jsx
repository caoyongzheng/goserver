import React, { PropTypes } from 'react'
import { Store, Provider } from 'react-app-store'
import BlogList from '../components/BlogList'
import NewBlog from '../components/NewBlog'
import css from './UserBlogApp.scss'
import actionFactorys from '../actions'

class UserBlogApp extends React.Component {
  constructor(props) {
    super(props)
    this.store = new Store({
      state: {
        blogs: [],
      },
      actionFactorys,
    })
    const { location } = this.props
    const { userId } = location.query
    this.store.actions.getUserBlogs(userId)
  }
  render() {
    return (
      <div className={css.userBlogApp}>
        <div className={css.userBlogs}>
          <Provider
            Component={BlogList}
            connects={[{
              store: this.store,
              propsFn({ blogs }) {
                return { blogs }
              },
              linkStates: ['blogs'],
            }]}
          />
        </div>
        <div className={css.newBlog}>
          <NewBlog />
        </div>
      </div>
    )
  }
}
UserBlogApp.propTypes = {
  location: PropTypes.object.isRequired,
}
module.exports = UserBlogApp
