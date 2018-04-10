import React from 'react'

class Register extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: ''
    }
  }
  onRegister = (e) => {
    e.preventDefault()

    const userInfo = {username: this.state.username, password: this.state.password}

    axios.post('/register', userInfo)
    .then( () => this.props.history.push('/registersuccess'))
    .catch( (err) => console.log(err));

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
        <h1>Register</h1>
        <form onSubmit={this.onRegister}>
          <input type='text' placeholder='username' value={this.state.username} onChange={this.onUserChange} />
          <input type='password' placeholder='password' value={this.state.password} onChange={this.onPassChange} />
          <button>Register</button>
        </form>
      </div>
    )
  }
}

export default Register;
