import React from 'react'

import Room from './components/Room/Room.jsx'
import Login from './components/Login/Login.jsx'

const styles = {
  chat:{
    position:'relative',
    width:'100%',
    height:'100%',
    overflow:'auto'
  }
}

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      username:''
    }
  }
  render() {
    const {username} = this.state
    return (
      <div name="chat" style={styles.chat}>
        {
            username?<Room username={username}/>:<Login onChange={this.handleChangeUserName}/>
        }
      </div>
    )
  }
  handleChangeUserName=(username)=>{
    this.setState({
      username:username
    })
  }
}
module.exports = Chat
