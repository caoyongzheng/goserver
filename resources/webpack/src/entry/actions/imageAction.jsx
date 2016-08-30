// import request from 'superagent'
import { ImgHost } from 'PathUtil'

export function uploadImage(image, { successHandle, failHandle, errHandle }) {
  const formData = new FormData()
  formData.append('fileType', image.type)
  formData.append('image', image)
  $.ajax({
    type: 'POST',
    url: `${ImgHost}/api/image/add`,
    processData: false,
    contentType: false,
    data: formData,
    success(result) {
      if (result.success && successHandle) {
        successHandle(result)
      } else if (!result.success && failHandle) {
        failHandle(result)
      }
    },
    error(err) {
      errHandle(err)
    },
  })
}
