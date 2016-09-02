import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import { Provider, GlobalStores, Store } from 'react-app-store'
import R from 'R'
import DelBlogPopup from 'DelBlogPopup'
import Pagination from 'Pagination'
import css from './Index.scss'
import BlogIndexList from 'BlogIndexList'
import actionFactorys from '../actions'

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.store = new Store({
      state: {
        // Pagination
        page: 1,
        pagesize: 10,
        total: 0,
        // BlogIndexList
        blogs: [],
        // DelBlogPopup
        delBlog: {},
        delBlogPopupShow: false,
        confirmTitle: '',
      },
      actionFactorys,
      didDispatch: ({ type, state }) => {
        if (type === 'DelBlog') {
          const { page, pagesize, total } = state
          this.getBlogs(
            Math.max(1, Math.min(this.getPages(total - 1, pagesize), page)),
            pagesize,
            this.props.location.query,
          )
        }
      },
    })
    this.getBlogs(1, 10, props.location.query)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.query !== this.props.location.query) {
      const { page, pagesize } = this.store.getState()
      this.getBlogs(page, pagesize, nextProps.location.query)
    }
  }
  getBlogs = (page, pagesize, query) => {
    this.store.actions.getBlogPage({
      page,
      pagesize,
      ...query,
    })
  }
  getPages = (total, pagesize) =>
  Math.floor(total / pagesize) + Math.ceil(total % pagesize / pagesize)
  toBlogEdit = (blogId) => {
    this.props.router.push({ pathname: R.BlogEdit.pathname, query: { blogId } })
  }
  render() {
    return (
      <div className={css.stage}>
        <div className={css.blogList}>
          <Provider
            Component={BlogIndexList}
            props={{ toBlogEdit: this.toBlogEdit }}
            connects={[{
              store: GlobalStores.get('App'),
              propsFn: ({ user }) => ({ userId: user.id }),
              linkStates: ['user'],
            }, {
              store: this.store,
              propsFn: ({ blogs }) => ({ blogs }),
              linkStates: ['blogs'],
              actionsFn: ({ delBlogPopupShow }) => ({ onDelBlog: delBlogPopupShow }),
            }]}
          />
        </div>
        <Provider
          Component={Pagination}
          connects={[{
            store: this.store,
            propsFn: ({ total, pagesize, page }) => ({
              currentPage: page,
              pages: this.getPages(total, pagesize),
              style: {
                display: this.getPages(total, pagesize) < 2 ? 'none' : 'block',
                textAlign: 'center',
              },
            }),
            linkStates: ['total', 'pagesize', 'page'],
            actionsFn: ({ getBlogPage }) =>
            ({ onChange: (page) => getBlogPage(page, this.store.getState().pagesize) }),
          }]}
        />
        <Provider
          Component={DelBlogPopup}
          connects={[{
            store: this.store,
            propsFn({ delBlog, delBlogPopupShow, confirmTitle }) {
              return { blogTitle: delBlog.title, show: delBlogPopupShow, confirmTitle }
            },
            linkStates: ['delBlog', 'delBlogPopupShow', 'confirmTitle'],
            actionsFn({ delBlogPopupClose, delBlog, onConfirmTitle }) {
              return { close: delBlogPopupClose, delBlog, onConfirmTitle }
            },
          }]}
        />
      </div>
    )
  }
}

Index.propTypes = {
  location: PropTypes.object,
}

module.exports = withRouter(Index)
