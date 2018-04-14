import React from 'react'
import { Link } from 'react-router-dom'

class CreateSubSuccess extends React.Component {
  constructor(props) {
    super(props)

    this.state={}
  }
  render() {
    return (
      <div>
        <h1>Sub successfully created</h1>
        <Link to='/'>Go home</Link>
      </div>
    )
  }
}

export default CreateSubSuccess;
