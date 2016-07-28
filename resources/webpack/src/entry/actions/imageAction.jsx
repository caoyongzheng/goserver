import request from 'superagent'

export function uploadImage(image, { successHandle, failHandle, errHandle }) {
  const formData = new FormData()
  formData.append('fileType', image.type)
  formData.append('image', image)
  request.post('/api/image/add')
    .send(formData)
    .then((res) => {
      const result = JSON.parse(res.text)
      if (result.success && successHandle) {
        successHandle(result)
      } else if (!result.success && failHandle) {
        failHandle(result)
      }
    }, (err) => {
      if (errHandle) {
        errHandle(err)
      }
    })
}
