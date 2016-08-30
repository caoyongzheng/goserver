export const Host = ''// 'http://www1.caoyongzheng.com:3000'
export const ImgHost = '' // 'http://localhost:3000'

export function imageURL(filename) {
  if (!filename) {
    return filename
  }
  return `${ImgHost}/resources/imgs/${filename.substr(0, 3)}/${filename}`
}
