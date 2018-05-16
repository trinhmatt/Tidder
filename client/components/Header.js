import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => (
  <div>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">Tidder</a>
      <div className='ml-auto'>
        <Link to='/register'>Register</Link>
        <Link className='header-login' to='/login'>Login</Link>
      </div>
    </nav>
  </div>
)

export default Header;
