import React, { PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'
import _ from 'lodash'

import UserToolBar from '../components/UserToolBar'
import userActions from '../actions/userActions'

class UserApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      pagesize: 10,
      users: [],
      total: 0,
      selectedUsers: [],
    }
    this.actions = userActions({
      setState: (state) => this.setState(state),
      getState: () => this.state,
    })
    this.actions.getUserPage(1, 10)
  }
  isSelected = (userId) => _.findIndex(this.state.selectedUsers, (id) => id === userId) !== -1
  render() {
    const { users, page, pagesize } = this.state
    return (
      <div>
        <Paper style={{ maxWidth: '980px', width: '100%', margin: '30px auto' }}>
          <UserToolBar actions={this.actions} />
          <Table onRowSelection={this.actions.onRowSelection}>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>{'#'}</TableHeaderColumn>
                <TableHeaderColumn>{'用户名'}</TableHeaderColumn>
                <TableHeaderColumn>{'角色'}</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={false}>
              {
                _.map(users, (user, i) => (
                  <TableRow key={user.id} selected={this.isSelected(user.id)}>
                    <TableRowColumn>{(page - 1) * pagesize + i}</TableRowColumn>
                    <TableRowColumn>{user.username}</TableRowColumn>
                    <TableRowColumn>{user.role}</TableRowColumn>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}
UserApp.propTypes = {
  className: PropTypes.string,
}
module.exports = UserApp
