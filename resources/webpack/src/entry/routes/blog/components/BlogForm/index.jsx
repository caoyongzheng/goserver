import React, { PropTypes } from 'react'
import TextField from 'material-ui/TextField'
import MDEditor from 'react-mdeditor'
import { DispatchListener } from 'react-store-set'
import RaisedButton from 'material-ui/RaisedButton'

class BlogEditForm extends React.Component {
  state = {}
  handleGetBlog = ({ state }) => this.editor.codeMirror.setValue(state.content)
  render() {
    const { title, handleTitleChange, handleContentChange, content, handleSubmit } = this.props
    return (
      <div>
        <DispatchListener
          name={'BlogForm'}
          type={'GetBlog'}
          handler={this.handleGetBlog}
        />
        <TextField
          hintText="博文标题"
          fullWidth
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
        /><br />
        <div style={{ marginTop: '15px' }}>
          <MDEditor
            zIndex={2000}
            ref={(editor) => (this.editor = editor)}
            onChange={(cm) => handleContentChange(cm.getValue())}
          />
        </div>
        <div style={{ marginTop: '15px', display: 'flex' }}>
          <div style={{ flex: 1 }} />
          <RaisedButton
            label="保存"
            primary
            disabled={!title || !content}
            onTouchTap={handleSubmit}
          />
        </div>
      </div>
    )
  }
}
BlogEditForm.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  handleTitleChange: PropTypes.func.isRequired,
  handleContentChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
}
export default BlogEditForm
