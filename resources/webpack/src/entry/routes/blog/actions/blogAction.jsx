import request from 'superagent'

export function getBlog(blogId, { successHandle }) {
  request.get('/api/blog')
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

export function editBlog(blog, { successHandle }) {
  if (!blog.id) {
    $.notify('blog ID shouldn`t be Empty!')
    return
  }
  if (!blog.title) {
    $.notify('blog title shouldn`t be Empty!')
    return
  }
  if (!blog.content) {
    $.notify('blog content shouldn`t be Empty!')
    return
  }
  request.put('/api/blog')
  .send(blog)
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .then((res) => {
    const result = JSON.parse(res.text)
    if (result.success) {
      if (successHandle) {
        successHandle(result)
      }
      $.notify(result.desc, 'success')
    } else {
      $.notify(result.desc)
    }
  }, (err) => {
    console.log(err)
  })
}
