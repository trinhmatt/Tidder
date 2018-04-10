import React from 'react'
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: ''
    }
  }
  render() {
    return (
      <div>
        <h1>Test!!!s</h1>
        <a href='/register'>Register</a>
        <a href='/login'>Login</a>
        <a href='/createpost'>Create post</a>
      </div>
    )
  }
}

export default App;
