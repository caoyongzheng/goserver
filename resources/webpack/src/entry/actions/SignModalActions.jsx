import C from './Consants.js'
export default function SignModalActions({ dispatch }) {
  function onSignModalDisplay(signModalDisplay) {
    dispatch({
      type: C.SignModalDisplay,
      state: { signModalDisplay },
    })
  }
  return { onSignModalDisplay }
}
