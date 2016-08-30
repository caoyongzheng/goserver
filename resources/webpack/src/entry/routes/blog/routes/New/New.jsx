import React from 'react'
import { withRouter } from 'react-router'
import MDEditor from 'react-mdeditor'
import Input from 'Input'
import css from './New.scss'
import { uploadImage } from 'ImageAction'
import { Host, imageURL } from 'PathUtil'
import R from 'R'
import { GlobalStores } from 'react-app-store'

class NewApp extends React.Component {
  state = {
    title: '',
    image: null,
  }
  onTitleChange = (e) => {
    this.setState({
      title: e.target.value,
    })
  }
  handleSave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const blog = {
      title: this.state.title,
      content: this.refs.mdEditor.codeMirror.getValue(),
      contentType: 'markdown',
    }
    if (!blog.title) {
      $.notify('blog title shouldn`t be Empty!')
      return
    }
    if (!blog.content) {
      $.notify('blog content shouldn`t be Empty!')
      return
    }
    $.ajax({
      type: 'POST',
      url: `${Host}/api/blog/new`,
      data: blog,
      success: (result) => {
        if (result.success) {
          this.props.router.push({
            pathname: R.BlogIndex,
            query: { userId: GlobalStores.get('App').getState().user.id },
          })
          $.notify(result.desc, 'success')
        } else {
          $.notify(result.desc)
        }
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
      const cm = this.refs.mdEditor.codeMirror
      const startPoint = cm.getCursor('start')
      const endPoint = cm.getCursor('end')

      const imageUrl = imageURL(result.data)
      cm.replaceSelection(`${cm.getSelection()}![](${imageUrl})`)
      startPoint.ch = endPoint.ch
      endPoint.ch += imageUrl.length + 5
      cm.setSelection(startPoint, endPoint)
      cm.focus()
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
          <button className={css.button} onClick={this.handleSave}>{'保存'}</button>
        </div>
      </div>
    )
  }
}
module.exports = withRouter(NewApp)
