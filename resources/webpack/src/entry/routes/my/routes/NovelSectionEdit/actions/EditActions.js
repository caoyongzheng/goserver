import C from './Consants'

export default function EditActions({ dispatch, getState }) {

  function onEditName(editName) {
    dispatch({
      type: C.OnEditName,
      state: { editName },
    })
  }

  function toEditName() {
    dispatch({
      type: C.ToEditName,
      state: { editName: '', isEditName: 'true' },
    })
  }

  function cancelEditName() {
    dispatch({
      type: C.CancelEditName,
      state: { editName: '', isEditName: 'false' },
    })
  }

  function saveEditName() {
    const { editName } = getState()
    dispatch({
      type: C.SaveEditName,
      state: { editName: '', isEditName: 'false', name: editName },
    })
  }

  return { onEditName, toEditName, cancelEditName, saveEditName }
}
