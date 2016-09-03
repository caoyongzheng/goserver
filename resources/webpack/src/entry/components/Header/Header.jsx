import React, { PropTypes } from 'react'
import AppBar from 'material-ui/AppBar'
import UserDropMenu from './components/UserDropMenu'
import Avatar from 'material-ui/Avatar'

function Header({ username, headerIcon, page, onLeftIconButtonTouchTap, onTitleTouchTap }) {
  return (
    <div style={{ position: 'relative', height: '64px' }}>
      <AppBar
        title={page.name}
        onLeftIconButtonTouchTap={onLeftIconButtonTouchTap}
        onTitleTouchTap={onTitleTouchTap}
        style={{ position: 'fixed', zIndex: 1101, top: 0 }}
        iconElementRight={(
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {headerIcon ? <Avatar src={headerIcon} size={30} /> : null}
            <span style={{ color: '#fff', marginLeft: '8px' }}>{username}</span>
            <UserDropMenu />
          </div>
        )}
      />
    </div>
  )
}
Header.propTypes = {
  username: PropTypes.string,
  headerIcon: PropTypes.string,
  page: PropTypes.object.isRequired,
  onLeftIconButtonTouchTap: PropTypes.func.isRequired,
  onTitleTouchTap: PropTypes.func,
}
export default Header
