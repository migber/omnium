import React, { Component } from 'react'
import {
  Navbar,
  NavItem,
  Nav,
} from "react-bootstrap"
import { Link } from 'react-router-dom'
import './menuBar.css'
import { GoogleLogin } from 'react-google-login'
import { VIP_EMAIL } from '../../config/env'


class MenuBar extends Component {
  constructor(props) {
    super(props)
    this.onLoginFail = this.onLoginFail.bind(this)
  }

  onLoginFail(resp) {
  }

  render() {
    const { authenticated, user } = this.props
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
        { authenticated && (
          <NavItem eventKey={1} href="/myTeam">My Team</NavItem>
        )}
          <NavItem eventKey={7} href="/userRegistration">Registration</NavItem>
          <NavItem eventKey={2} href="/home">Contacts</NavItem>
          { authenticated && user.email == VIP_EMAIL && (
            <NavItem eventKey={1} href="/assignNumbers"> Assign Numbers
                <span className={(this.props.assignBadges === 0) ? "badge-right bd-success glyphicon glyphicon-user" : "badge-right bd-warning glyphicon glyphicon-user" }></span>
            </NavItem>
          )}
           { authenticated && user.email == VIP_EMAIL && (
              <NavItem eventKey={4} href="/requests"> New Requests
                <span className="badge-right badge">{this.props.badges}</span>
              </NavItem>
            )}
             { authenticated && user.email == VIP_EMAIL && (
              <NavItem eventKey={5} href="/UserRequests"> New User Requests
                <span className={(this.props.newUserRequests === 0) ? "badge-right bd-success glyphicon glyphicon-user" : "badge-right bd-warning glyphicon glyphicon-user" }></span>
              </NavItem>
            )}
          <NavItem eventKey={6} href="/register">Register for race</NavItem>
          <NavItem eventKey={7} href="/cyclists" user={user}>Cyclists</NavItem>
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
          <NavItem eventKey={44}> API explorer</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    </div>
  )
}
}

export default MenuBar
