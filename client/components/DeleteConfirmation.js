import React from 'react'
import { Link } from 'react-router-dom'

const DeleteConfirmation = (props) => (
  <div>
    <h1>Delete Succesful.</h1>
    <Link to='/'>Go back to homepage.</Link>
  </div>
)

export default DeleteConfirmation;
