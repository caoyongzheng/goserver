import React, { PropTypes } from 'react'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import FlatButton from 'material-ui/FlatButton'

function UserToolBar({ add, del, refresh }) {
  return (
    <Toolbar style={{ overflow: 'auto' }}>
      <ToolbarGroup firstChild>
        <FlatButton label="新增" primary onTouchTap={add} />
        <FlatButton label="修改" primary />
        <FlatButton label="删除" onTouchTap={del} />
        <FlatButton label="刷新" onTouchTap={refresh} />
      </ToolbarGroup>
    </Toolbar>
  )
}
UserToolBar.propTypes = {
  add: PropTypes.func.isRequired,
  del: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
}
export default UserToolBar
