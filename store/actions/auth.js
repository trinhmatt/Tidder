import axios from 'axios'

export const startLogin = (username, password) => {
  return (dispatch) => {
    axios.post('/login', {
      username: username,
      password: password
    })
    .then( (response) => console.log(response))
    .catch( () => console.log('login failed'))
  }
}
