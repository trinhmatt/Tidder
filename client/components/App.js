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
  onRegister = (e) => {
    e.preventDefault()

    const info = {username: this.state.username, password: this.state.password}

    axios.post('/register', info)
    .then( () => this.props.history.push('/registersuccess'))
    .catch( () => console.log('error'));

  }
  onUserChange = (e) => {
    const username = e.target.value

    this.setState( () => ({username}))
  }
  onPassChange = (e) => {
    const password = e.target.value

    this.setState( () => ({password}))
  }
  render() {
    return (
      <div>
        <h1>Test!!!s</h1>
        <a href='/test'>test</a>
        <form onSubmit={this.onRegister}>
          <input type='text' placeholder='username' value={this.state.username} onChange={this.onUserChange} />
          <input type='password' placeholder='password' value={this.state.password} onChange={this.onPassChange} />
          <button>Register</button>
        </form>
      </div>
    )
  }
}

export default App;
