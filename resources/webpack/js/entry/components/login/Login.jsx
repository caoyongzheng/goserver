import React from 'react'
import ReactDOM from 'react-dom'

import SignIn from './SignIn'
import SignUp from './SignUp'

import _ from 'lodash'

const styles = {
  cover: {
    left: 0,
    top: 0,
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 10,
  },
  stage: {
    position: 'relative',
    backgroundColor: '#fff',
    margin: '200px auto 0',
    width: '360px',
    height: 'auto',
  },
  header: {
    marginLeft: '20px',
    marginRight: '20px',
  },
  tab: {
    display: 'inline-block',
    padding: '0px 15px',
    height: '50px',
    lineHeight: '50px',
    fontWeight: '500',
    textAlign: 'center',
    cursor: 'pointer',
  },
  activeTab: {
    borderBottom: '2px solid red',
  },
  body: {
    marginTop: '-1px',
    marginLeft: '20px',
    marginRight: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #ddd',
  },
  hide: {
    display: 'none',
  },
}

class Login extends React.Component {
  state = {
    status: 'None',
  }
  showSignIn = () => {
    this.setState({
      status: 'SignIn',
    })
  }
  showSignUp = () => {
    this.setState({
      status: 'SignUp',
    })
  }
  handleClick = (e) => {
    if (e.target === e.currentTarget) {
      this.hide()
    }
  }
  hide = () => {
    this.setState({
      status: 'None',
    })
  }
  render() {
    const { status } = this.state
    const loginStyle = _.merge({}, styles.cover, status === 'None' ? styles.hide : {})
    const inTabStyle = _.merge({}, styles.tab, status === 'SignIn' ? styles.activeTab : {})
    const upTabStyle = _.merge({}, styles.tab, status === 'SignUp' ? styles.activeTab : {})
    return (
      <div
        name="login"
        style={loginStyle}
        onClick={this.handleClick}
      >
        <div style={styles.stage}>
          <div style={styles.header}>
            <div style={inTabStyle} onClick={this.showSignIn}>
              {'登 录'}
            </div>
            <div style={upTabStyle} onClick={this.showSignUp}>
              {'注 册'}
            </div>
          </div>
          <div style={styles.body}>
            {
              status === 'SignIn' ? <SignIn /> : null
            }
            {
              status === 'SignUp' ? <SignUp /> : null
            }
          </div>
        </div>
      </div>
    )
  }
}

const anchor = document.createElement('div')
anchor.setAttribute('name', 'login-anchor')
document.body.appendChild(anchor)

export default ReactDOM.render(
  <Login />,
  anchor
)
