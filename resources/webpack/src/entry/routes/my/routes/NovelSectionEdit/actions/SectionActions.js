import C from './Consants'

export default function SectionActions({ dispatch }) {
  function getSection(sectionId) {
    $.ajax({
      url: `/api/novel/section/${sectionId}`,
      success: (result) => {
        const { success, data, desc } = result
        const { id, name, content } = data
        if (success) {
          dispatch({
            type: C.GetSection,
            state: { id, name, content },
          })
        } else {
          $.notify(desc)
        }
      }
    })
  }
}
