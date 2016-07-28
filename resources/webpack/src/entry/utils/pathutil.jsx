export function imageURL(filename) {
  if (!filename) {
    return filename
  }
  return `/resources/imgs/${filename.substr(0, 3)}/${filename}`
}
