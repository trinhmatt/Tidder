const subDefaultState = []

export default (state = [], action) => {
  switch (action.type) {
    case 'SET SUBS':
      return action.subs
    default:
      return state;
  }
}
