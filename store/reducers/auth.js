const authDefaultState = {}

export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        username: action.username,
        id: action.id,
        subs: action.subs
      }
    case 'LOGOUT':
      return state;
    default:
      return state;
  }
}
