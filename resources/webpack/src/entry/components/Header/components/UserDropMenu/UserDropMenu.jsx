import React from 'react'
import _ from 'lodash'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

class UserDropMenu extends React.Component {
  getMenuItems = (role) => {
    const { logout, onSignIn, onSignUp } = this.props
    switch (role) {
      case 4:
        return [
          { primaryText: '登出', onTouchTap: logout },
        ]
      case 2:
        return [
          { primaryText: '登出', onTouchTap: logout },
        ]
      default:
        return [
          { primaryText: '登录', onTouchTap: onSignIn },
          { primaryText: '注册', onTouchTap: onSignUp },
        ]
    }
  }
  render() {
    const { userRole } = this.props
    const menuItems = this.getMenuItems(userRole)
    return (
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon color="#fff" /></IconButton>}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        {
          _.map(menuItems, (m, i) => (
            <MenuItem key={i} {...m} />
          ))
        }
      </IconMenu>
    )
  }
}
UserDropMenu.propTypes = {
  userRole: React.PropTypes.oneOf([0, 2, 4]).isRequired,
  onSignIn: React.PropTypes.func.isRequired,
  onSignUp: React.PropTypes.func.isRequired,
  logout: React.PropTypes.func.isRequired,
}
export default UserDropMenu
