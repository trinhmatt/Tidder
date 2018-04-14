import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => (
  <div>
    <h1>Oops! We couldn't find the requested page.</h1>
    <Link to='/'>Go home</Link>
  </div>
)

export default NotFound;
