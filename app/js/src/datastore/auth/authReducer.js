import _ from 'lodash'
import {
  REQUEST_USER_BEGIN,
  REQUEST_USER_SUCCESS,
  REQUEST_USER_FAIL,
} from './authAction'

const initialState = {
  isFetching: false,
  completed: false,
  loginSuccess: false,
  user: null,
}

// The auth reducer. The starting state sets authentication
// based on a token being in session storage. In a real app,
// we would also want a util to check if the token is expired.
export function authReducer (state = initialState, action) {
  const newState = _.cloneDeep(state)
  switch (action.type) {
    case REQUEST_USER_BEGIN:
      return Object.assign({}, state, {
        isFetching: true,
        completed: false
      })

    case REQUEST_USER_SUCCESS:
      newState.completed = true
      newState.loginSuccess = true
      newState.user = action.payload
      return Object.assign({}, newState)

    case REQUEST_USER_FAIL:
      return Object.assign({}, state, {
        isFetching: false,
        loginSuccess: false,
        completed: true,
        user: null
      })

    default:
      return state
  }
}