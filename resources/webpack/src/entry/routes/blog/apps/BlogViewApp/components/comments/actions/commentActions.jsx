import request from 'superagent'
import _ from 'lodash'

export function getComments(query, { successHandle }) {
  request.get('/api/blogComment')
  .query(query)
  .then((res) => {
    const result = JSON.parse(res.text)
    if (result.success && successHandle) {
      successHandle(result)
      return
    }
    $.notify(result.desc)
  }, (err) => {
    $.notify(err)
  })
}

export function handleSubmit(comment, { successHandle }) {
  if (_.isEmpty(comment.content)) {
    $.notify('content should not be Empty!')
    return
  }
  request.post('/api/blogComment')
  .send(comment)
  .then((res) => {
    const result = JSON.parse(res.text)
    if (result.success && successHandle) {
      successHandle(result)
      return
    }
    $.notify(result.desc)
  }, (err) => {
    $.notify(err)
  })
}
