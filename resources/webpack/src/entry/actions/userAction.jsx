import request from 'superagent'
import { Host } from 'PathUtil'

export function setHeaderIcon(filename, { successHandle, failHandle, errHandle }) {
  request.put(`${Host}/api/user/headerIcon`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({ filename })
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
