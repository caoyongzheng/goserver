import React, { PropTypes } from 'react'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

function ToolbarView({ add, del, refresh, search, onSearchChange, handleSearch }) {
  return (
    <Toolbar style={{ overflow: 'auto' }}>
      <ToolbarGroup firstChild>
        <FlatButton label="新增" primary onTouchTap={add} />
        <FlatButton label="修改" primary />
        <FlatButton label="删除" onTouchTap={del} />
        <FlatButton label="刷新" onTouchTap={refresh} />
      </ToolbarGroup>
      <ToolbarGroup>
        <TextField
          hintText={'search'}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              handleSearch()
            }
          }}
        />
      </ToolbarGroup>
    </Toolbar>
  )
}
ToolbarView.propTypes = {
  search: PropTypes.string.isRequired,
  add: PropTypes.func.isRequired,
  del: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
}
export default ToolbarView
