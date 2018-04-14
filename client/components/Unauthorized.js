import React from 'react'
import { Link } from 'react-router-dom'

const Unauthorized = () => (
  <div>
    <h1>You do not have permission to access this page.</h1>
    <h2>Please login and try again.</h2>
    <Link to='/'>Go home</Link>
  </div>
)

export default Unauthorized;
