import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Navbar, Nav, NavDropdown, NavItem, MenuItem } from 'react-bootstrap'
import { startLogout } from '../../store/actions/auth'
import HeaderSearch from './HeaderSearch'

const Header = (props) => (
  <div>
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/">Tidder</a>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <NavItem>
          <HeaderSearch />
        </NavItem>
      </Nav>
      <Nav pullRight>
        {
          props.auth.id ?
          <NavDropdown title={props.auth.username} id="basic-nav-dropdown">
            <MenuItem href={`/user/${props.auth.username}`}>Profile</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={ () => props.dispatch(startLogout())}>Logout</MenuItem>
          </NavDropdown>
           :
           <div>
             <NavItem href="/register">
               Register
             </NavItem>
             <NavItem href="/login">
               Login
             </NavItem>
           </div>
        }
      </Nav>
    </Navbar>
  </div>
)

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Header);
