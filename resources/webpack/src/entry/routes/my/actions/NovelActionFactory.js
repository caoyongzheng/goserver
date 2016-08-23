import _ from 'lodash'
import C from './Consants'

function NovelActionFactory({ dispatch }) {
  function getMyNovels(userId) {
    $.ajax({
      url: `/api/novel/userId/${userId}`,
      success: (novels) => {
        const novelObj = {}
        _.forEach(novels, (novel) => {
          novelObj[novel.id] = novel
        })
        dispatch({
          type: C.GetMyNovels,
          data: { novels: novelObj },
        })
      },
    })
  }
  function getNovelCatalog(novelId) {
    $.ajax({
      url: `/api/novel/catalog/${novelId}`,
      success: (result) => {
        const { success, data, desc } = result
        if (success) {
          dispatch({
            type: C.GetNovelCatalog,
            data: { novels: { [data.id]: data } }
          })
        } else {
          $.notify(desc)
        }
      },
    })
  }
  return { getMyNovels, getNovelCatalog }
}

export default NovelActionFactory
