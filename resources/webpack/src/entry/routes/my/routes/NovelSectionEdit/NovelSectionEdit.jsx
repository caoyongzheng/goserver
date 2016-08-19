import React, { PropTypes } from 'react'
import _ from 'lodash'

class NovelSectionEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      name: '',
      paragraphs: [],
    }
    const { location } = props
    const { query } = location
    const { novelId, sectionId } = query
    this.getSection(novelId, sectionId)
  }
  getSection = (novelId, sectionId) => {
    if (_.isEmpty(novelId)) {
      $.notify('获取章节失败,小说ID不能为空')
    }
    if (_.isEmpty(sectionId)) {
      return
    }
    $.ajax({
      url: `/api/novel/section/${novelId}/${sectionId}`,
      success: (result) => {
        console.log(result)
      },
    })
  }
  render() {
    return (
      <div>123</div>
    )
  }
}

NovelSectionEdit.propTypes = {
  className: PropTypes.string,
}

module.exports = NovelSectionEdit
