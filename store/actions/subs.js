import React from 'react'
import axios from 'axios'

export const setSubs = (subs) => ({
  type: 'SET SUBS',
  subs
})

//Get default subs and populate posts from backend
export const getSubs = () => {
  return (dispatch) => {
    axios.get('/defaultsubs')
    .then( (response) => {
      dispatch(setSubs(response.data))
    })
  }
}
