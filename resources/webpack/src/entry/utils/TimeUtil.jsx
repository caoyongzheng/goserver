export function format(pattern, dateString) {
  const date = new Date(dateString)
  const fullYear = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  switch (pattern) {
    case 'yyyy-MM-dd HH:mm:ss':
      return `${fullYear}-${month}-${day} ${hours}:${minutes}:${seconds}`
    default:
      return date.toString()
  }
}
