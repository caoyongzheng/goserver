import React, { PropTypes } from 'react'
import Drawer from 'material-ui/Drawer'
import { List, ListItem } from 'material-ui/List'
import R from 'R'

const styles = {
  active: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
}

function LeftNav({ open, handleClose, page, role }) {
  const blogNestedItems = [
    <ListItem
      key={'blogindex'}
      primaryText="博文列表"
      onTouchTap={() => R.BlogIndex.go()}
      style={R.BlogIndex.pathname === page.pathname ? styles.active : null}
    />,
    <ListItem
      key={'blognew'}
      primaryText="新增博文"
      onTouchTap={() => R.BlogNew.go()}
      style={R.BlogNew.pathname === page.pathname ? styles.active : null}
    />,
  ]
  const adminNestedItems = [
    <ListItem
      key={'adminuser'}
      primaryText="用户管理"
      nestedLevel={1}
      onTouchTap={() => R.AdminUser.go()}
      style={R.AdminUser.pathname === page.pathname ? styles.active : null}
    />,
  ]
  return (
    <Drawer
      docked={false}
      width={250}
      open={open}
      docked
      onRequestChange={handleClose}
    >
      <div
        style={{
          cursor: 'pointer',
          fontSize: '24px',
          color: 'rgb(255, 255, 255)',
          lineHeight: '64px',
          fontWeight: '300',
          paddingLeft: '24px',
          marginBottom: '8px',
          backgroundColor: 'rgb(0, 188, 212)',
        }}
        onTouchTap={handleClose}
      >
        {page.name}
      </div>
      <List>
        <ListItem
          primaryText="博客"
          primaryTogglesNestedList
          nestedItems={blogNestedItems}
        />
        {
          role === 4 && (
            <ListItem
              primaryText="后台管理"
              primaryTogglesNestedList
              nestedItems={adminNestedItems}
            />
          )
        }
      </List>
    </Drawer>
  )
}
LeftNav.propTypes = {
  role: PropTypes.number.isRequired,
  page: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}
export default LeftNav
