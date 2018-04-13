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
  checkUser = () => {
    axios.get('/currentuser')
      .then( (response) => console.log('axios data', response.data))
      .catch( () => console.log('axios get failed'))

  }
  render() {
    return (
      <div>
        <h1>Test!!!</h1>
        <a href='/register'>Register</a>
        <a href='/login'>Login</a>
        <a href='/createpost'>Create post</a>
        <a href='/createsubtidder'>Create subtidder</a>
        <button onClick={this.checkUser}>Check user</button>
      </div>
    )
  }
}

export default App;
