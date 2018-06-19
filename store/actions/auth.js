import axios from 'axios'
import React from 'react'
import { history } from '../../client/routes/AppRouter'

export const login = (user) => ({
  type: 'LOGIN',
  id: user._id,
  username: user.username,
  subs: user.subs,
  votedPosts: user.votedPosts,
  savedPosts: user.savedPosts
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

export const logout = () => ({
  type: 'LOGOUT'
})

export const startLogout = () => {
  return (dispatch) => {
    axios.get('/logout')
    .then( (response) => {

      dispatch(logout())
      history.replace('/')
    })
    .catch( () => console.log('logout failed'))
  }
}
