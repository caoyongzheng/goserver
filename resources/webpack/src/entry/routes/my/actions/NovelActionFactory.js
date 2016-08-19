import _ from 'lodash'

function NovelActionFactory({ setData }) {
  function getMyNovels(userId) {
    $.ajax({
      url: `/api/novel/userId/${userId}`,
      success: (novels) => {
        const novelObj = {}
        _.forEach(novels, (novel) => {
          novelObj[novel.id] = novel
        })
        setData({ novels: novelObj })
      },
    })
  }
  function getNovelCatalog(novelId) {
    $.ajax({
      url: `/api/novel/catalog/${novelId}`,
      success: (result) => {
        const { success, data, desc } = result
        if (success) {
          setData({
            novels: { [data.id]: data }
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
