import React, { PropTypes } from 'react'

const styles = {
  login: {
    display: 'block',
    margin: 'auto',
    width: '400px',
    height: '300px',
    backgroundColor: 'rgb(255, 255, 255)',
    color: '#000',
  },
}

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
    }
  }
  handleChangeUserName = (e) => {
    this.setState({
      username: e.target.value,
    })
  }
  handleLogin = () => {
    this.props.onChange(this.state.username)
  }
  render() {
    const { username } = this.state
    return (
      <div name="login" style={styles.login}>
        <div name="title">
          登录
        </div>
        <div name="form">
          <label htmlFor="user">Username</label>
          <input value={username} onChange={this.handleChangeUserName} />
          <div name="submit">
            <button onClick={this.handleLogin}>登录</button>
          </div>
        </div>
      </div>
    )
  }
}
Login.propTypes = {
  onChange: PropTypes.func.isRequired,
}
export default Login
