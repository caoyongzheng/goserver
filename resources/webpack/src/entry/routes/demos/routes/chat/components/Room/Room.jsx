import React, { PropTypes } from 'react'

import MyChat from '../MyChat.jsx'
import _ from 'lodash'
const styles = {
  groupsStage: {
    position: 'absolute',
    width: '200px',
    height: '100%',
    left: 0,
    top: 0,
    backgroundColor: 'rgba(255, 148, 124, 0.45)',
  },
  group: {
    position: 'relative',
    width: '100%',
    height: '30px',
    cursor: 'pointer',
  },
  groupItem: {
    position: 'absolute',
    width: '100%',
    height: '30px',
  },
  deleteItem: {
    position: 'absolute',
    right: 0,
    height: '30px',
    padding: '0 10px',
    backgroundColor: 'rgb(0, 0, 0)',
  },
  msgStage: {
    position: 'absolute',
    height: '100%',
    top: 0,
    left: '200px',
    right: '200px',
    backgroundColor: 'rgb(255, 37, 37)',
  },
  msgView: {
    position: 'absolute',
    width: '100%',
    top: 0,
    bottom: '120px',
    overflow: 'auto',
    backgroundColor: 'rgb(249, 232, 61)',
  },
  msgPost: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto',
  },
  msgInput: {
    height: '25px',
    width: '75%',
    border: 'solid 1px #ddd',
    outline: 'none',
  },
  msgButton: {
    height: '25px',
    width: '40px',
    border: 'solid 1px #ddd',
    outline: 'none',
  },
  msg: {
    width: '100%',
    padding: '6px 10px',
    color: '#000',
    backgroundColor: 'rgb(55, 161, 18)',
    border: 'solid 1px rgb(241, 244, 24)',
    marginTop: '-1px',
  },
  membersStage: {
    position: 'absolute',
    width: '200px',
    height: '100%',
    right: 0,
    top: 0,
    backgroundColor: 'rgba(255, 148, 124, 0.45)',
  },
}

class Room extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      groups: {},
      active: '',
      path: '',
      msg: '',
    }
  }
  componentDidMount() {
    this.myChat = new MyChat(`ws://localhost:5050/?id=${this.props.username}`)

    this.myChat.onopen(() => {
      console.log('Connection stated')
    })

    this.myChat.onclose(() => {
      console.log('Connection closed')
    })
  }
  joinGroup = (groupPath) => {
    this.myChat.subscription(groupPath)
                .handleSuccess(() => {
                  const group = {
                    path: groupPath,
                    msgs: [],
                    members: [],
                  }
                  const { groups } = this.state
                  groups[groupPath] = group
                  this.setState({
                    groups,
                  })
                  this.listen(groupPath)
                })
                .handleError(() => {
                  console.log(`Failed to join group:${groupPath}`)
                })
  }
  listen = (groupPath) => {
    const accepter = this.myChat.accept(groupPath)
    accepter.handleSuccess((data) => {
      if (data.dataName === 'Msg') {
        const g1 = this.state.groups[groupPath]
        g1.msgs.push(data.content)
        this.setState({
          groups: this.state.groups,
        })
      } else if (data.dataName === 'Members') {
        const g2 = this.state.groups[groupPath]
        g2.members = data.content
        this.setState({
          groups: this.state.groups,
        })
      }
    })
  }
  handleClickAdd = () => {
    this.joinGroup(this.state.path)
    this.setState({
      path: '',
    })
  }
  handleClickPost = () => {
    const { msg, active } = this.state
    if (!msg) {
      return
    }
    if (active) {
      this.myChat.broadcast(active, 'Msg', msg)
    } else {
      console.log('faild to send message,should select a group')
    }
  }
  clickGroup = (i) => {
    this.setState({
      active: i,
    })
  }
  handleExitGroup = (e, path) => {
    e.preventDefault()
    this.myChat.send({
      path,
      kind: 'ExitGroup',
    })
  }
  handleChangeMsg = (e) => {
    this.setState({
      msg: e.target.value,
    })
  }
  handleChangePath = (e) => {
    this.setState({
      path: e.target.value,
    })
  }
  renderGroups(groups, active) {
    return _.map(groups, (g, i) => {
      let activeStyle = {}
      if (i === active) {
        activeStyle = { backgroundColor: 'rgb(40, 157, 223)' }
      }
      return (
        <div style={[styles.group, activeStyle]} key={i}>
          <div
            name="group"
            style={styles.groupItem}
            onClick={() => { this.clickGroup(i) }}
          >{i}</div>
          <div
            style={styles.deleteItem}
            onClick={e => { this.handleExitGroup(e, i) }}
          >X</div>
        </div>
      )
    })
  }
  renderMsg(msgs) {
    return msgs.map((m, i) =>
      <div key={i} style={styles.msg}>{m}</div>
    )
  }
  renderMembers(members) {
    return members.map((member, i) =>
      <div key={i}>{member}</div>
    )
  }
  render() {
    const { path, msg, groups, active } = this.state
    const { msgs, members } = groups[active] ? groups[active] : { msgs: [], members: [] }
    return (
      <div>
        <section name="groupsStage" style={styles.groupsStage}>
          {this.renderGroups(groups, active)}
          <input value={path} onChange={this.handleChangePath} />
          <button type="button" style={styles.msgButton} onClick={this.handleClickAdd}>Add</button>
        </section>
        <section name="msgStage" style={styles.msgStage}>
          <div name="msgView" style={styles.msgView}>
            {this.renderMsg(msgs)}
          </div>
          <div name="msgPost" style={styles.msgPost}>
            <input
              value={msg}
              onChange={this.handleChangeMsg}
              style={styles.msgInput}
            />
            <button
              type="button"
              style={styles.msgButton}
              onClick={this.handleClickPost}
            >
              Post
            </button>
          </div>
        </section>
        <section name="membersStage" style={styles.membersStage}>
          {this.renderMembers(members)}
        </section>
      </div>
    )
  }
}
Room.propTypes = {
  username: PropTypes.string.isRequired,
}

export default Room
