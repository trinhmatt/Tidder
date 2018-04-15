import React from 'react'
import { Link } from 'react-router-dom'

class Home extends React.Component {
  constructor(props) {
    super(props)

  }
  render() {
    return (
      <div>
        <h1>Test!!!</h1>
        <Link to='/register'>Register</Link>
        <Link to='/login'>Login</Link>
        <Link to='/createsubtidder'>Create subtidder</Link>
      </div>
    )
  }
}

export default Home;
