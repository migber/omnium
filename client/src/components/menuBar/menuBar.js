import React, { Component } from 'react'
import {
  Navbar,
  NavItem,
  Nav,
} from "react-bootstrap"
import { Link } from 'react-router-dom'
// import { BrowserRouter as Router, Route } from 'react-router-dom'
import './menuBar.css'
import { GoogleLogin } from 'react-google-login'
import { VIP_EMAIL } from '../../config/env'
// import Requests from '../requests/requests'
// import OmniumResults from '../omniumResults/omniumResults'
// import Cyclists from '../cyclists/cyclists'
// import Auth from '../Auth/Auth'
// import Requests from '../requests/requests'

class MenuBar extends Component {
  constructor(props) {
    super(props)
    this.onLoginFail = this.onLoginFail.bind(this)
  }

  onLoginFail(resp) {
    console.log(resp)
  }

  render() {
    const { authenticated, user } = this.props
    console.log(user)
    return (
      <div>
        <Navbar className="extra-features">
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/events">Omnium</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav className="img-div">
          <NavItem eventKey={1} href="/about">About</NavItem>
          <NavItem eventKey={2} href="/home">Contacts</NavItem>
          <NavItem eventKey={1} href="/profile"> Profile</NavItem>
          { authenticated && (
            <NavItem eventKey={4} href="/requests"> New Requests <span className="badge-right badge">{this.props.counter}</span>
            </NavItem>)}
          { authenticated && (<NavItem eventKey={5} href="/assignNumber">Assign numbers</NavItem>)}
          <NavItem eventKey={6} href="/cyclists" user={user}>Cyclists</NavItem>
        </Nav>
        <Nav pullRight >
        {
          !authenticated && (
          <NavItem>
           <GoogleLogin className="google-login-btn"
           clientId="308977226751-dqstcngaqgj8vk5i50fj2mgedcoau9eh.apps.googleusercontent.com"
           buttonText="Login"
           onSuccess={this.props.onLogin}
           onFailure={this.onLoginFail}/>
           </NavItem>
          )}
        {
          authenticated && (
            <NavItem >
            <div className="img-div">
           <img className="img-circle" alt="meaninful string" src={user.img}/>
           </div>
           </NavItem>
          )}
          {
          authenticated && (
          <NavItem onClick={this.props.onLogout}>Log out</NavItem>
          )}
          <NavItem eventKey={1}> API explorer</NavItem>
         {/* )} */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    </div>
  )
}
}

export default MenuBar
