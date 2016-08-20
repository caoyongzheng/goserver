import React from 'react'
import SignModal from '../components/SignModal/SignModal'
import { Provider, GlobalStores } from 'react-app-store'

export default function App({ children }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {children}
      <Provider
        Component={SignModal}
        props={{ store: GlobalStores.get('App') }}
        connects={[
          {
            store: GlobalStores.get('App'),
            propsFn: ({ signModalDisplay }) => ({ signModalDisplay }),
            actionsFn: (actions) => ({ onSignModalDisplay: actions.onSignModalDisplay }),
          },
        ]}
      />
    </div>
  )
}
