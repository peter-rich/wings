import { combineReducers } from 'redux'
import { authReducer } from './auth/authReducer'

const RootReducer = combineReducers({
  auth: authReducer
})

export default RootReducer
