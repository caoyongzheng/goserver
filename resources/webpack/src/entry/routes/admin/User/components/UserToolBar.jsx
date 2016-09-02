import React, { PropTypes } from 'react'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import FlatButton from 'material-ui/FlatButton'

function UserToolBar({ actions }) {
  const { refresh, delUser } = actions
  return (
    <Toolbar style={{ overflow: 'auto' }}>
      <ToolbarGroup firstChild>
        <FlatButton label="新增" primary />
        <FlatButton label="修改" primary />
        <FlatButton label="删除" onTouchTap={delUser} />
        <FlatButton label="刷新" onTouchTap={refresh} />
      </ToolbarGroup>
    </Toolbar>
  )
}
UserToolBar.propTypes = {
  actions: PropTypes.object.isRequired,
}
export default UserToolBar
