import React, { PropTypes } from 'react'
import Button from 'Button'

class AddNovelForm extends React.Component {
  state = {}
  render() {
    const { show, name, author, onName, onAuthor, onSubmit, onCancel } = this.props
    return (
      <div style={{ display: show ? 'block' : 'none' }}>
        <input placeholder="书名" value={name} onChange={(e) => onName(e.target.value)} />
        <input placeholder="作者" value={author} onChange={(e) => onAuthor(e.target.value)} />
        <Button onClick={onCancel}>{'取消'}</Button>
        <Button onClick={onSubmit}>{'保存'}</Button>
      </div>
    )
  }
}
AddNovelForm.propTypes = {
  show: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  onName: PropTypes.func.isRequired,
  onAuthor: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
export default AddNovelForm
