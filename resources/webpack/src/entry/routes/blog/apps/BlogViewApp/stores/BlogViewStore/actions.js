import initState from './initState.js'
import R from 'R'
import { imageURL } from 'PathUtil'

function getBlog(blogId) {
  const { dispatch } = this
  $.ajax({
    url: '/api/blog',
    data: { blogId },
    success(result) {
      const { success, data } = result
      if (success) {
        const { id, title, content, author, updateDate, viewTimes, commentSize } = data
        dispatch({
          type: 'GetBlog',
          state: {
            id,
            title,
            content,
            author: {
              id: author.id,
              username: author.username,
              headerIcon: imageURL(author.headerIcon) || initState.author.headerIcon,
            },
            updateDate,
            viewTimes,
            commentSize,
          },
        })
      }
    },
  })
}

export default { getBlog }
