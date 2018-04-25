import React from 'react'
import { Link } from 'react-router-dom'

const EditConfirmation = () => (
  <div>
    <h1>Your changes have been saved.</h1>
    <Link to='/'>Go back to the homepage.</Link>
  </div>
)

export default EditConfirmation;
