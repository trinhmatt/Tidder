import axios from 'axios'
import React from 'react'
import { history } from '../../client/routes/AppRouter'

export const login = (user) => ({
  type: 'LOGIN',
  id: user._id,
  username: user.username,
  subs: user.subs
})

export const startLogin = (username, password) => {
  return (dispatch) => {
    axios.post('/login', {
      username: username,
      password: password
    })
    .then( (response) => {
      
      const user = response.data
      dispatch(login(user))
      history.push('/')
    })
    .catch( () => console.log('login failed'))
  }
}
