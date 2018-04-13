import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
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
          password = this.state.password;

    this.props.startLogin(username, password)
  }
  checkUser = () => {
    axios.get('/currentuser')
      .then( (response) => console.log('axios data', response.data))
      .catch( () => console.log('axios get failed'))
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
        <Link to='/'>Home</Link>
        <button onClick={this.checkUser}>Check user</button>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  startLogin: (email, password) => dispatch(startLogin(email, password))
})

export default connect(undefined, mapDispatchToProps)(Login);
