import React, { PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

class DelBlogModal extends React.Component {
  state = {
    confirmTitle: '',
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.open && nextProps.open) {
      this.setState({
        confirmTitle: '',
      })
    }
  }
  onConfirmTitle = (confirmTitle) => this.setState({ confirmTitle })
  render() {
    const { open, handleClose, title, delBlog } = this.props
    const { confirmTitle } = this.state
    return (
      <Dialog
        title="请确认，是否删除博文？"
        open={open}
        contentStyle={{ width: '450px' }}
        onRequestClose={handleClose}
      >
        {'请输入博文名:'}
        <div style={{ fontWeight: 'bold', color: '#000', marginTop: '10px' }}>
          {title}
        </div>
        <TextField
          id="blogTitle"
          hintText="blog title"
          style={{ marginTop: '10px' }}
          fullWidth
          value={confirmTitle}
          onChange={(e) => this.onConfirmTitle(e.target.value)}
        /><br />
        <RaisedButton
          style={{ marginTop: '10px' }}
          label="删除博文"
          fullWidth
          primary
          onTouchTap={delBlog}
          disabled={confirmTitle !== title && !!title}
        />
      </Dialog>
    )
  }
}
DelBlogModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  delBlog: PropTypes.func.isRequired,
}
export default DelBlogModal
