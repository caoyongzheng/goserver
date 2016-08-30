import React, { PropTypes } from 'react'
import MDEditor from 'react-mdeditor'
import Input from 'Input'
import css from './Edit.scss'
import { uploadImage } from 'ImageAction'
import { imageURL } from 'PathUtil'
import { getBlog, editBlog } from '../../actions/blogAction.jsx'
import { withRouter } from 'react-router'
import R from 'R'

class Edit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      image: null,
    }
  }
  componentDidMount() {
    this.getBlog()
  }
  onTitleChange = (e) => {
    this.setState({
      title: e.target.value,
    })
  }
  getBlog = () => {
    const { location } = this.props
    getBlog(location.query.blogId, {
      successHandle: (result) => {
        const { title, content } = result.data
        this.setState({ title })
        this.refs.mdEditor.codeMirror.setValue(content)
      },
    })
  }
  handleEdit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { location } = this.props
    const blog = {
      id: location.query.blogId,
      title: this.state.title,
      content: this.refs.mdEditor.codeMirror.getValue(),
      contentType: 'markdown',
    }
    editBlog(blog, {
      successHandle: () => {
        this.props.router.push({ pathname: R.BlogView, query: { blogId: location.query.blogId } })
      },
    })
  }
  handleImage = (e) => {
    const image = e.target.files[0]
    this.setState({
      image,
    })
  }
  uploadImage = () => {
    const { image } = this.state
    if (!image) {
      $.notify('请选择上传图片')
    }
    const successHandle = (result) => {
      const imageUrl = imageURL(result.data)
      this.refs.mdEditor.addImage(imageUrl)
    }
    const failHandle = (result) => $.notify(result.desc)
    const errHandle = (err) => $.notify(err)
    uploadImage(image, { successHandle, failHandle, errHandle })
  }
  render() {
    const { title } = this.state
    return (
      <div className={css.stage}>
        <div className={css.title}>
          <Input value={title} onChange={this.onTitleChange} placeholder="title" />
        </div>
        <MDEditor ref="mdEditor" />
        <div>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={this.handleImage}
          />
          <button onClick={this.uploadImage}>上传</button>
        </div>
        <div className={css.submit}>
          <button className={css.button} onClick={this.handleEdit}>{'修改'}</button>
        </div>
      </div>
    )
  }
}
Edit.propTypes = {
  location: PropTypes.object.isRequired,
}
module.exports = withRouter(Edit)
