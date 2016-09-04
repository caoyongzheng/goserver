import React from 'react'
import { globalAppStores, DispatchListener } from 'react-appstores'
import Paper from 'material-ui/Paper'

import UserAdminStore from './stores/UserAdminStore'
import UserToolBar from './components/UserToolBar'
import UserTable from './components/UserTable.jsx'
import NewUserModal from './components/NewUserModal'
import DelUserModal from './components/DelUserModal'

class UserApp extends React.Component {
  constructor(props) {
    super(props)
    globalAppStores.addStore('UserAdmin', UserAdminStore)
    globalAppStores.actions.UserAdmin.getUserPage(1, 10)
  }
  componentWillUnmount() {
    globalAppStores.delStore('UserAdmin')
  }
  render() {
    return (
      <div>
        <Paper style={{ maxWidth: '980px', width: '100%', margin: '30px auto' }}>
          <DispatchListener
            storeName={'UserAdmin'}
            type={'DelUser'}
            handle={globalAppStores.actions.UserAdmin.refresh}
          />
          <DispatchListener
            storeName={'UserAdmin'}
            type={'NewUser'}
            handle={globalAppStores.actions.UserAdmin.refresh}
          />
          <UserToolBar
            add={globalAppStores.actions.UserAdmin.nHandleOpen}
            del={globalAppStores.actions.UserAdmin.handleDOpen}
            refresh={globalAppStores.actions.UserAdmin.refresh}
          />
          <UserTable />
          <NewUserModal />
          <DelUserModal />
        </Paper>
      </div>
    )
  }
}

module.exports = UserApp
