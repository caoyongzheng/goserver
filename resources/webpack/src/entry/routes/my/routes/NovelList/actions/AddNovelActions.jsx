import C from './Consants'

export default function AddNovelActions({ dispatch, getState }) {
  function onName(name) {
    dispatch({
      type: C.NameChange,
      state: { name },
    })
  }
  function onAuthor(author) {
    dispatch({
      type: C.AuthorChange,
      state: { author },
    })
  }
  function onToAddNovel() {
    dispatch({
      type: C.ToAddNovel,
      state: { name: '', author: '', isAdd: true },
    })
  }
  function onCancelAddNovel() {
    dispatch({
      type: C.CancelAddNovel,
      state: { name: '', author: '', isAdd: false },
    })
  }

  function onAddNovel() {
    const { name, author } = getState()
    $.ajax({
      type: 'POST',
      url: '/api/novel',
      data: { author, name },
      success: (result) => {
        if (result.success) {
          dispatch({
            type: C.AddNovel,
            state: { name: '', author: '', isAdd: false },
          })
        } else {
          $.notify(result.desc)
        }
      },
      error: (xml, err, throwObj) => {
        console.log(xml)
        console.log(err)
        console.log(throwObj)
      },
    })
  }

  return { onName, onAuthor, onToAddNovel, onCancelAddNovel, onAddNovel }
}
