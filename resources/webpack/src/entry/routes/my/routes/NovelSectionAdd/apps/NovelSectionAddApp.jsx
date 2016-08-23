import React, { PropTypes } from 'react'
import { Provider, Store } from 'react-app-store'
import actionFactorys from '../actions'
import SectionEdit from '../components/SectionEdit'

class NovelSectionAddApp extends React.Component {
  constructor(props) {
    super(props)
    this.store = new Store({
      state: {
        editName: '',
        editContent: '',
      },
      actionFactorys,
    })
  }
  render() {
    return (
      <div>
        <Provider
          Component={SectionEdit}
          connects={[
            {
              store: this.store,
              propsFn: ({ editName, editContent }) => ({ editName, editContent }),
              actionsFn: ({ onEditName, onEditContent }) => ({ onEditName, onEditContent }),
            },
          ]}
        />
      </div>
    )
  }
}
NovelSectionAddApp.propTypes = {
  className: PropTypes.string,
}
module.exports = NovelSectionAddApp
