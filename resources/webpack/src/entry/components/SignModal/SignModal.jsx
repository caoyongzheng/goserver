import React, { PropTypes } from 'react'
import SignInModal from './components/SignInModal'
import SignUpModal from './components/SignUpModal'

class SignModal extends React.Component {
  state = {}
  render() {
    const { open, cancel, type, submitSignIn, submitSignUp } = this.props
    if (type === 'SignIn') {
      return <SignInModal open={open} cancel={cancel} submitSignIn={submitSignIn} />
    }
    return <SignUpModal open={open} cancel={cancel} submitSignUp={submitSignUp} />
  }
}

SignModal.propTypes = {
  type: PropTypes.oneOf(['SignIn', 'SignUp']).isRequired,
  open: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  submitSignIn: PropTypes.func.isRequired,
  submitSignUp: PropTypes.func.isRequired,
}
export default SignModal
