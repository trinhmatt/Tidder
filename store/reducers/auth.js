const authDefaultState = {}

export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        displayName: action.displayName
      }
    case 'LOGOUT':
      return state;
    default:
      return state;
  }
}
