import request from 'superagent'
import { Host } from 'PathUtil'

export function getBlog(blogId, { successHandle }) {
  request.get(`${Host}/api/blog`)
  .query({ blogId })
  .then((res) => {
    const result = JSON.parse(res.text)
    if (result.success && successHandle) {
      successHandle(result)
    } else {
      $.notify(result.desc)
    }
  }, (err) => {
    $.notify(err)
  })
}
