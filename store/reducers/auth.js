const authDefaultState = {}

export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        username: action.username,
        id: action.id,
        subs: action.subs,
        votedPosts: action.votedPosts,
        savedPosts: action.savedPosts
      }
    case 'LOGOUT':
      return state;
    default:
      return state;
  }
}
