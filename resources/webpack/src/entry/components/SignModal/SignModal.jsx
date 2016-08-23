import React, { PropTypes } from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'
import _ from 'lodash'
import { Provider } from 'react-app-store'
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

class SignModal extends React.Component {
  handleClick = (e) => {
    if (e.target === e.currentTarget) {
      this.props.onSignModalDisplay('None')
    }
  }
  render() {
    const { signModalDisplay, onSignModalDisplay, store } = this.props
    const loginStyle = _.merge({}, styles.cover,
      signModalDisplay === 'None' ? styles.hide : {})
    const inTabStyle = _.merge({}, styles.tab,
      signModalDisplay === 'SignIn' ? styles.activeTab : {})
    const upTabStyle = _.merge({}, styles.tab,
      signModalDisplay === 'SignUp' ? styles.activeTab : {})
    return (
      <div
        name="login"
        style={loginStyle}
        onClick={this.handleClick}
      >
        <div style={styles.stage}>
          <div style={styles.header}>
            <div style={inTabStyle} onClick={() => onSignModalDisplay('SignIn')}>
              {'登 录'}
            </div>
            <div style={upTabStyle} onClick={() => onSignModalDisplay('SignUp')}>
              {'注 册'}
            </div>
          </div>
          <div style={styles.body}>
            {
              signModalDisplay === 'SignIn' ? (
                <Provider
                  Component={SignIn}
                  connects={[
                    {
                      store,
                      actionsFn: (actions) => ({
                        onLogin: actions.onLogin,
                        onSignModalDisplay: actions.onSignModalDisplay,
                      }),
                    },
                  ]}
                />
              ) : null
            }
            {
              signModalDisplay === 'SignUp' ? (
                <Provider
                  Component={SignUp}
                  connects={[
                    {
                      store,
                      actionsFn: (actions) => ({
                        onLogin: actions.onLogin,
                        onSignModalDisplay: actions.onSignModalDisplay,
                      }),
                    },
                  ]}
                />
              ) : null
            }
          </div>
        </div>
      </div>
    )
  }
}

SignModal.propTypes = {
  store: PropTypes.object.isRequired,
  signModalDisplay: PropTypes.oneOf(['None', 'SignIn', 'SignUp']).isRequired,
  onSignModalDisplay: PropTypes.func.isRequired,
}

export default SignModal
