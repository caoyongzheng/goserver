import _ from 'lodash'

export default function userActions({ setState, getState }) {
  function getUserPage(page, pagesize) {
    $.ajax({
      url: '/api/admin/userpage',
      data: { page, pagesize },
      success(result) {
        const { data, success } = result
        if (success) {
          setState({
            page: data.page,
            pagesize: data.pagesize,
            users: data.elements,
            total: data.total,
          })
        }
      },
    })
  }

  function refresh() {
    const { page, pagesize } = getState()
    $.ajax({
      url: '/api/admin/userpage',
      data: { page, pagesize },
      success(result) {
        const { data, success } = result
        if (success) {
          setState({
            page: data.page,
            pagesize: data.pagesize,
            users: data.elements,
            total: data.total,
          })
          console.log('success')
        }
      },
    })
  }

  function onRowSelection(selectedRows) {
    const { users } = getState()
    setState({
      selectedUsers: _.map(selectedRows, (r) => users[r].id),
    })
  }

  function delUser() {
    const { selectedUsers } = getState()
    if (selectedUsers.length > 0) {
      $.ajax({
        type: 'DELETE',
        url: `/api/admin/user/${selectedUsers[0]}`,
        success(result) {
          if (result) {
            getUserPage(1, 10)
          }
        },
      })
    }
  }

  return { getUserPage, refresh, onRowSelection, delUser }
}
