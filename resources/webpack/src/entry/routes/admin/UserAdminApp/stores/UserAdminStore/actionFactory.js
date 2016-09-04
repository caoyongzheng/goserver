import initState from './initState.js'
import R from 'R'
import _ from 'lodash'

export default function actionFactory({ dispatch, getState }) {
  // 获取对应页码用户数据
  function getUserPage(page, pagesize) {
    $.ajax({
      url: '/api/admin/userpage',
      data: { page, pagesize },
      success(result) {
        const { data, success } = result
        if (success) {
          dispatch({
            type: 'GetUserPage',
            state: {
              page: data.page,
              pagesize: data.pagesize,
              users: data.elements,
              total: data.total,
            }
          })
        }
      },
    })
  }

  // 重新获取用户数据
  function refresh() {
    const { page, pagesize } = getState()
    $.ajax({
      url: '/api/admin/userpage',
      data: { page, pagesize },
      success(result) {
        const { data, success } = result
        if (success) {
          dispatch({
            type: 'Refresh',
            state: {
              page: data.page,
              pagesize: data.pagesize,
              users: data.elements,
              total: data.total,
            }
          })
        }
      },
    })
  }

  // 设置用户选择列表行
  function onRowSelection(selectedRows) {
    const { users } = getState()
    dispatch({
      type: 'OnRowSelection',
      state: {
        selectedUsers: _.map(selectedRows, (r) => users[r].id),
      },
    })
  }

  // 处理新增用户弹窗关闭
  function nHandleClose() {
    dispatch({
      type: 'NHandleClose',
      state: { nOpen: false },
    })
  }
  // 处理新增用户弹窗弹出
  function nHandleOpen() {
    dispatch({
      type: 'NHandleOpen',
      state: { nOpen: true },
    })
  }

  function handleNUsernameChange(nUsername) {
    dispatch({
      type: 'HandleNUsernameChange',
      state: { nUsername },
    })
  }

  function handleNPasswordChange(nPassword) {
    dispatch({
      type: 'HandleNPasswordChange',
      state: { nPassword },
    })
  }

  function handleNSubmit() {
    const { nUsername, nPassword } = getState()
    $.ajax({
      type: 'POST',
      url: '/api/admin/user',
      data: { username: nUsername, password: nPassword },
      success(result) {
        if (result.success) {
          dispatch({
            type: 'NewUser',
            state: {
              nOpen: false,
              nUsername: '',
              nPassword: '123456',
            }
          })
        }
      },
    })
  }

  function handleDClose() {
    dispatch({
      type: 'HandleDClose',
      state: { dOpen: false },
    })
  }

  function handleDOpen() {
    const { selectedUsers, users } = getState()
    if (selectedUsers.length > 0) {
      const { id, username } = _.find(users, (u) => selectedUsers[0] === u.id)
      dispatch({
        type: 'HandleDOpen',
        state: {
          dOpen: true,
          dUserId: id,
          dUsername: username,
          confirmTitle: '',
        },
      })
    }
  }

  function handleComfirmUsernameChange(comfirmUsername) {
    dispatch({
      type: 'HandleComfirmUsernameChange',
      state: { comfirmUsername },
    })
  }

  function delUser() {
    const { dUserId, total, users } = getState()
    if (dUserId) {
      $.ajax({
        type: 'DELETE',
        url: `/api/admin/user/${dUserId}`,
        success(result) {
          if (result) {
            dispatch({
              type: 'DelUser',
              state: {
                dOpen: false,
                total: total - 1,
                users: _.filter(users, (u) => u.id !== dUserId),
              }
            })
          }
        },
      })
    }
  }

  return {
    getUserPage,
    refresh,
    delUser,
    onRowSelection,
    nHandleClose,
    nHandleOpen,
    handleNUsernameChange,
    handleNPasswordChange,
    handleNSubmit,
    handleDClose,
    handleDOpen,
    handleComfirmUsernameChange,
  }
}
