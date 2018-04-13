import React from 'react'

class Home extends React.Component {
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
        <h1>Test!!!</h1>
        <a href='/register'>Register</a>
        <a href='/login'>Login</a>
        <a href='/createpost'>Create post</a>
        <a href='/createsubtidder'>Create subtidder</a>
      </div>
    )
  }
}

export default Home;
