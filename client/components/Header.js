import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const Header = (props) => (
  <div>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">Tidder.</a>
      {
        props.auth.id ?
          <div className='ml-auto'>
            <Link to={`/user/${props.auth.username}`}>{props.auth.username}</Link>
          </div> :
          <div className='ml-auto'>
            <Link to='/register'>Register</Link>
            <Link className='header-login' to='/login'>Login</Link>
          </div>
      }
    </nav>
  </div>
)

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Header);
