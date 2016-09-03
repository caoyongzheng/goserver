import { Store } from 'react-appstores'
import actionFactory from './actionFactory'
import initState from './initState'

export default new Store({
  actionFactory,
  state: initState,
})
