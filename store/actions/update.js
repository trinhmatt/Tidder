import React from 'react'
import axios from 'axios'

export const startSubscribe = (id) => {
  return (dispatch) => {
    axios.post('/subscribe')
  }
}
