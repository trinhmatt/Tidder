import React from 'react'
import { startLogin } from '../../store/actions/auth'

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: ''
    }
  }
  onUserChange = (e) => {
    const username = e.target.value

    this.setState( () => ({username}))
  }
  onPassChange = (e) => {
    const password = e.target.value

    this.setState( () => ({password}))
  }
  logIn = (e) => {
    e.preventDefault();

    const username = this.state.username,
          password = this.state.password

    startLogin(username, password)
  }
  render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.logIn}>
          <input
            type='text'
            placeholder='username'
            value={this.state.username}
            onChange={this.onUserChange}
          />
          <input
            type='password'
            placeholder='password'
            value={this.state.password}
            onChange={this.onPassChange}
          />
          <button>Login</button>
        </form>
      </div>
    )
  }
}

export default Login;
