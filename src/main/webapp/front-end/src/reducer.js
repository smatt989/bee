import { SET_USER } from './actions.js'

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return Object.assign({}, state, {
          userId: action.userId
      })
    default:
      return state
  }
}