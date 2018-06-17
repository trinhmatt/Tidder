import React from 'react'
import { Link } from 'react-router-dom'

class CreateSuccess extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      type: '',
      subKey: this.props.location.state.subKey
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
        {!!this.state.subKey && (
          <div>
            <p>The password for your subtidder is: {this.state.subKey}</p>
            <p>Users must use the password in order to join your subtidder.</p>
          </div>
        )}
      </div>
    )
  }
}

export default CreateSuccess;
