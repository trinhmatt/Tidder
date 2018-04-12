import axios from 'axios'
import React from 'react'

export const login = (id, username) => ({
  type: 'LOGIN',
  id,
  username
})

export const startLogin = (username, password) => {
  return (dispatch) => {
    axios.post('/login', {
      username: username,
      password: password
    })
    .then( (response) => {
      const username = response.data.username,
            id = response.data.id
      dispatch(login(id, username))
    })
    .catch( () => console.log('login failed'))
  }
}
