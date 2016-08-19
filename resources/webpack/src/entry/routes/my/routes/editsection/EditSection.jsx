import React, { PropTypes } from 'react'

class EditSection extends React.Component {
  state = {
    name: '',
    paragraphs: [],
  }
  render() {
    const { name, paragraphs } = this.state
    return (
      <div>
        <input value={} />
      </div>
    )
  }
}
EditSection.propTypes = {
  className: PropTypes.string,
}
export default EditSection
