import browserHistory from 'react-router/lib/browserHistory'
import _ from 'lodash'
import { storeSet } from 'react-store-set'

class Page {
  constructor({ pathname, parentName, parentPathname, name, auth }) {
    this.name = name || 'App'
    this.pathname = pathname
    this.parentName = parentName || 'App'
    this.parentPathname = parentPathname || '/'
    this.auth = auth || 0
  }
  go = (query = {}) => {
    browserHistory.push({ pathname: this.pathname, query })
  }
  goParent = (query = {}) => {
    browserHistory.push({ pathname: this.parentPathname, query })
  }
}

const R = {

  App: new Page({ name: 'App', pathname: '/app' }),

  AdminUser: new Page({
    name: '用户管理', pathname: '/app/admin/user', parentName: 'Admin', auth: 4,
  }),

  Blog: new Page({ name: '博客', pathname: '/app/blog' }),
  BlogEdit: new Page({ name: '编辑博文', pathname: '/app/blog/edit', auth: 2 }),
  BlogIndex: new Page({ name: '博客', pathname: '/app/blog/index' }),
  BlogNew: new Page({ name: '新建博文', pathname: '/app/blog/new', auth: 2 }),
  BlogView: new Page({ name: '博文浏览', pathname: '/app/blog/view' }),
}

function getPage(pathname) {
  return _.find(R, (p) => p.pathname === pathname)
}

R.getPage = getPage

function verifyAuth({ page, replace, next }) {
  const userRole = storeSet.stores.Auth.state.role
  if (userRole < page.auth) { // 如果用户权限小于页面权限
    if (userRole === 0) { // 如果用户为游客
      storeSet.stores.SignModal.actions.onSignIn()
    }
    replace(R.BlogIndex.pathname)
  }
  next()
}

R.verifyAuth = verifyAuth

export default R
