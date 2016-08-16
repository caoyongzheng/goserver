import React, { Component } from 'react'
import Button from 'Button'
import request from 'superagent'

class AddNovel extends Component {
  state = {
    name: '',
    author: '',
  }
  onSave = () => {
    request.post('/api/novel/add')
    .send({
      name: this.state.name,
      author: this.state.author,
    })
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .then((res) => {
      const result = res.body
      if (result.success) {
        $.notify(result.desc, 'success')
      }
    }, (err) => {
      $.notify(err)
    })
  }
  setName = (name) => this.setState({ name })
  setAuthor = (author) => this.setState({ author })
  render() {
    const { name, author } = this.state
    return (
      <div>
        <label>{'Name:'}</label>
        <input value={name} onChange={(e) => this.setName(e.target.value)} />
        <label>{'Author:'}</label>
        <input value={author} onChange={(e) => this.setAuthor(e.target.value)} />
        <Button onClick={this.onSave}>{'保存'}</Button>
      </div>
    )
  }
}

module.exports = AddNovel
