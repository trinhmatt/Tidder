import React from 'react'
import { Link } from 'react-router-dom'

class CreateSuccess extends React.Component {
  constructor(props) {
    super(props)

    this.state={
      type: ''
    }
  }
  componentDidMount() {
    let type;

    if (this.props.location.pathname.indexOf('/t/') > -1) {
      type = 'Post'
    } else {
      type = 'Subtidder'
    }
    this.setState( () => ({type}))
  }
  render() {
    return (
      <div>
        <h1>{this.state.type} successfully created</h1>
        <a href='/'>Go home</a>
      </div>
    )
  }
}

export default CreateSuccess;
