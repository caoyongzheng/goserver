import { Store } from 'react-store-set'
import actions from './actions'
import initState from './initState'

export default new Store({
  actions,
  state: {...initState},
})
