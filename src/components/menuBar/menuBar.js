import React, { Component } from 'react'
import {
  Navbar,
  NavItem,
  Nav,
} from "react-bootstrap"
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './menuBar.css'
import { GoogleLogin } from 'react-google-login'
import { VIP_EMAIL } from '../../config/env'
import Requests from '../requests/requests'
import OmniumResults from '../omniumResults/omniumResults'
import Cyclists from '../cyclists/cyclists'
// import Auth from '../Auth/Auth'
// import Requests from '../requests/requests'

class MenuBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null,
      authenticated: false
    }

    this.onLogin = this.onLogin.bind(this)
    this.onLogout = this.onLogout.bind(this)
  }

  onLogin(response) {
    console.log("login")

    const { profileObj } = response
    const user = {
      email: profileObj.email,
      accessToken: response.accessToken,
      googleId: profileObj.googleId,
      img: profileObj.imageUrl
    }
    this.setState({ authenticated: true, user })
    console.log(user)
  }

  onLogout() {
    console.log('logout')
    localStorage.removeItem('user')
    this.setState({ authenticated: false, user: null })
  }

  render() {
    const { authenticated, user } = this.state
    console.log(this.state)
    const responseGoogle = (response) => {
      console.log(response)
    }
    return (
      <div>
        <Router>
        <Navbar collapse navbar-collapse className="extra-features">
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/">Omnium</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav className="img-div">
          <NavItem eventKey={1} href="/about">About</NavItem>
          <NavItem eventKey={2} href="/home">Contacts</NavItem>
          <NavItem eventKey={1} href="/profile"> Profile</NavItem>
          { authenticated && (user.email === VIP_EMAIL) &&  ( <NavItem eventKey={4} href="/requests"> Approve requests</NavItem>)}
          { authenticated && (user.email === VIP_EMAIL) && (<NavItem eventKey={5} href="/assignNumber">Assign numbers</NavItem>)}
          <NavItem eventKey={6} href="/cyclists" user={user}>Cyclists</NavItem>
        </Nav>
        <Nav pullRight >
        {
          !authenticated && (
          <NavItem>
           <GoogleLogin className="google-login-btn"
           clientId="308977226751-dqstcngaqgj8vk5i50fj2mgedcoau9eh.apps.googleusercontent.com"
           buttonText="Login"
           onSuccess={this.onLogin}
           onFailure={responseGoogle}/>
           </NavItem>
          )}
        {
          authenticated && (
            <NavItem >
            <div className="img-div">
           <img className="img-circle" src={user.img}/>
           </div>
           </NavItem>
          )}
          {
          authenticated && (
          <NavItem onClick={this.onLogout}>Log out</NavItem>
          )}
          <NavItem eventKey={1}> API explorer</NavItem>
         {/* )} */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    </Router>
    </div>
  )
}
}

export default MenuBar
