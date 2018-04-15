import React from 'react'
import { Link } from 'react-router-dom'

const CreateFail = () => (
  <div>
    <h1>Something went wrong! Try again.</h1>
    <Link to='/'>Go back</Link>
  </div>
)

export default CreateFail;
