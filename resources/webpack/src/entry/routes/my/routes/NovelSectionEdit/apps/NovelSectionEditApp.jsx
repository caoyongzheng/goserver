import React, { PropTypes } from 'react'
import { Store, Provider } from 'react-app-store'
import actionFactorys from '../actions'

import NameEdit from '../components/NameEdit'

class NovelSectionEditApp extends React.Component {
  constructor(props) {
    super(props)
    this.store = new Store({
      state: {
        id: '',
        name: '',
        content: '',
        editName: '',
        editContent: '',
      },
      actionFactorys,
    })
    const { location } = props
    const { sectionId } = location.query
    if (sectionId) {
      this.store.actions.getSection(sectionId)
    }
  }
  render() {
    return (
      <div>
        <div>
          <Provider
            Component={NameEdit}
            connects={[
              {
                store: this.store,
                propsFn: ({ editName }) => ({ editName }),
                actionsFn: ({ onEditName, cancelEditName, saveEditName }) =>
                ({ onEditName, cancelEditName, saveEditName }),
              },
            ]}
          />
        </div>
      </div>
    )
  }
}

NovelSectionEditApp.propTypes = {
  className: PropTypes.string,
}

module.exports = NovelSectionEditApp
