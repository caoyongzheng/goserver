import React from 'react'
import { storeSet, DispatchListener } from 'react-store-set'
import Paper from 'material-ui/Paper'

import UserAdminStore from './stores/UserAdminStore'
import Toolbar from './components/Toolbar'
import UserTable from './components/UserTable.jsx'
import NewUserModal from './components/NewUserModal'
import DelUserModal from './components/DelUserModal'

class UserApp extends React.Component {
  constructor(props) {
    super(props)
    storeSet.addStore('UserAdmin', UserAdminStore)
    UserAdminStore.actions.getUserPage(1, 10)
  }
  componentWillUnmount() {
    storeSet.delStore('UserAdmin')
  }
  render() {
    return (
      <div>
        <Paper style={{ maxWidth: '980px', width: '100%', margin: '30px auto' }}>
          <DispatchListener
            name={'UserAdmin'}
            type={'DelUser'}
            handler={UserAdminStore.actions.refresh}
          />
          <DispatchListener
            name={'UserAdmin'}
            type={'NewUser'}
            handler={UserAdminStore.actions.refresh}
          />
          <Toolbar />
          <UserTable />
          <NewUserModal />
          <DelUserModal />
        </Paper>
      </div>
    )
  }
}

module.exports = UserApp
