import React, { PropTypes } from 'react'
import Button from 'Button'

function NameEdit({ editName, onEditName, cancelEditName, saveEditName }) {
  return (
    <div>
      <input placeholder="章节名" value={editName} onChange={(e) => onEditName(e.target.value)} />
      <Button onClick={cancelEditName}>{'取消'}</Button>
      <Button onClick={saveEditName}>{'保存'}</Button>
    </div>
  )
}

NameEdit.propTypes = {
  editName: PropTypes.string.isRequired,
  onEditName: PropTypes.func.isRequired,
  cancelEditName: PropTypes.func.isRequired,
  saveEditName: PropTypes.func.isRequired,
}

export default NameEdit
