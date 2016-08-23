export default function Actions({ dispatch }) {

  function onEditName(editName) {
    dispatch({
      type: 'OnEditName',
      state: { editName },
    })
  }

  function onEditContent(editContent) {
    dispatch({
      type: 'OnEditContent',
      state: { editContent },
    })
  }

  return { onEditName, onEditContent }
}
