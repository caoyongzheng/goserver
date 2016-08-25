import React from 'react'
import { withRouter } from 'react-router'
import { Provider, GlobalStores, Store } from 'react-app-store'
import R from 'R'
import DelBlogPopup from 'DelBlogPopup'
import Pagination from 'Pagination'
import css from './Index.scss'
import BlogList from '../components/BlogList'
import actionFactorys from '../actions'

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.store = new Store({
      state: {
        page: 1,
        pagesize: 10,
        total: 0,
        blogs: [],
        delBlog: {},
        delBlogPopupShow: false,
        confirmTitle: '',
      },
      actionFactorys,
      didDispatch: ({ type, state }) => {
        if (type === 'DelBlog') {
          const { page, pagesize, total } = state
          this.store.actions.getBlogPage(
            Math.max(1, Math.min(this.getPages(total - 1, pagesize), page)),
            pagesize
          )
        }
      },
    })
    this.store.actions.getBlogPage(1, 10)
  }
  getPages = (total, pagesize) =>
  Math.floor(total / pagesize) + Math.ceil(total % pagesize / pagesize)
  toBlogEdit = (blogId) => {
    this.props.router.push({ pathname: R.BlogEdit, query: { blogId } })
  }
  render() {
    return (
      <div name="homeStage" className={css.homeStage}>
        <Provider
          Component={BlogList}
          props={{ toBlogEdit: this.toBlogEdit }}
          connects={[{
            store: GlobalStores.get('App'),
            propsFn({ user }) {
              return { currentUserId: user.id }
            },
            linkStates: ['user'],
          }, {
            store: this.store,
            propsFn({ blogs }) {
              return { blogs }
            },
            linkStates: ['blogs'],
            actionsFn({ delBlogPopupShow }) {
              return { onDelBlog: delBlogPopupShow }
            },
          }]}
        />
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

module.exports = withRouter(Index)
