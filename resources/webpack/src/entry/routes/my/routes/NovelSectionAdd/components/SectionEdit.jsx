import React, { PropTypes } from 'react'

class SectionEdit extends React.Component {
  state = {}
  render() {
    const { editName, editContent, onEditName, onEditContent } = this.props
    return (
      <div>
        <div>
          <input
            placeholder="章节名"
            value={editName}
            onChange={(e) => onEditName(e.target.value)}
          />
        </div>
        <div>
          <textarea
            placeholder="内容"
            value={editContent}
            onChange={(e) => onEditContent(e.target.value)}
          />
        </div>
      </div>
    )
  }
}
SectionEdit.propTypes = {
  editName: PropTypes.string.isRequired,
  editContent: PropTypes.string.isRequired,
  onEditName: PropTypes.func.isRequired,
  onEditContent: PropTypes.func.isRequired,
}
export default SectionEdit
