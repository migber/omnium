import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import logo from './ltu-timing.png'
import './App.css'
import MenuBar             from './components/menuBar/menuBar'
import Footer from './components/footer/footer'
import Share from './components/share/share'
import Requests from './components/requests/requests'
import Cyclists from './components/cyclists/cyclists'
import Event from './components/events'
import Register from './components/registration/registration'
import { VIP_EMAIL } from './config/env'
import { request } from 'https'
import api from './components/requests/api'
import apiUsers from './api'
import AssignNumbers from './components/assignNumbers/assignNumbers'
import apiAssignment from './components/assignNumbers/api'
import Users from './components/users/user'
import UserRequests from './components/userRequests/userRequests'
import apiUserRequests from './components/userRequests/api'
import MyTeam from './components/myTeam/myTeam'
import RegistrationRedirect from './components/registration/registrationRedirect'

const AUTHORISE_URL = 'https://omnium.herokuapp.com/api/users/createLogged'
const EXISTS_URL = 'https://omnium.herokuapp.com/api/users/exists'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null,
      authenticated: false,
      badges: 0,
      assignBadges: 0,
      userRequests: 0,
      show: true,
      showLoginMessage: false,
    }
    this.onLogin = this.onLogin.bind(this)
    this.onLogout = this.onLogout.bind(this)
    this.newUserRequests = this.newUserRequests.bind(this)
    this.badgeSet = this.badgeSet.bind(this)
    this.badgeSetAssign = this.badgeSetAssign.bind(this)
  }

  componentWillMount() {
    const user = JSON.parse(localStorage.getItem('user'))
    if (localStorage.getItem('authenticated')) {
      this.badgeSet(user)
      this.badgeSetAssign(user)
      this.newUserRequests(user)
      this.setState({ authenticated: true, user })
    } else {
      this.setState({ authenticated: false, user: {} })
    }
  }

  onLogin(response) {
    const { profileObj } = response
    const user = {
      email: profileObj.email,
      accessToken: response.accessToken,
      googleId: profileObj.googleId,
      img: profileObj.imageUrl,
      counter: 0,
    }
    const data = {
      email: profileObj.email,
      accessToken: response.accessToken,
      googleId: profileObj.googleId,
      img: profileObj.imageUrl,
    }
    apiUsers.getUser(user, data).then((approvedUser) => {
      console.log(approvedUser)
      if (approvedUser) {
        this.badgeSet(approvedUser)
        this.badgeSetAssign(approvedUser)
        localStorage.setItem('user', JSON.stringify(approvedUser))
        localStorage.setItem('authenticated', true)
        this.setState({
          authenticated: true,
          user: approvedUser,
          showLoginMessage: false,
         })
      } else {
        this.setState({
          showLoginMessage: true
        })
      }
    })
  }

  onLogout() {
    localStorage.removeItem('user')
    localStorage.removeItem('authenticated')
    this.setState({ authenticated: false, user: {} })
  }

  badgeSet(user){
    api.getRequests(user).then((requests) => {
      this.setState({ badges: requests.length })
    })
  }

  badgeSetAssign(user){
    apiAssignment.getScoresForBagdes(user).then( scores => {
      this.setState({ assignBadges: scores.length })
    })
  }

  newUserRequests(user){
    apiUserRequests.getUserRequests(user).then((users) => {
      this.setState({ userRequests: users.length })
    })
  }

  render() {
    const {
      authenticated,
      user,
      counter,
      badges,
      assignBadges,
      userRequests,
      showLoginMessage,
     } = this.state
    return (
      <Router>
      <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">LTU timing</h1>
      </header>
      <MenuBar
       fixesTop={JSON.stringify(true)}
       responsive={JSON.stringify(true)}
       onLogin={this.onLogin}
       onLogout={this.onLogout}
       authenticated={authenticated}
       user={user}
       counter={counter}
       badges={badges}
       assignBadges={assignBadges}
       newUserRequests={userRequests}
       />
       <div>
       <Switch>
       <Route exact path="/" render={()=>(
         <Redirect to="/events" />
        )} />
        <Route path='/events' render={( props ) =>
          <Event {...props}
            user={user}
            show={true}
          />}
          />
       </Switch>
        <Route
            exact path='/cyclists'
            render={( props ) => <Cyclists {...props} user={user} authenticated={authenticated} />}
        />
         <Route
            exact path='/myTeam'
            render={( props ) => <MyTeam {...props} user={user} authenticated={authenticated} />}
        />
        <Route
          path='/userRegistration' render={( props ) =>
          <Users {...props}
            user={user}
            authenticated={authenticated}
          />}
        />
        <Route path='/register' render={( props ) =>
        authenticated ? (
            <Register
              {...props}
              authenticated={authenticated}
              user={user}
              badgeSet={this.badgeSet}
             />
        ) : (
            <RegistrationRedirect
              {...props}
              authenticated={authenticated}
              user={user}
              badgeSet={this.badgeSet}
             />
        )}
        />

        { user && user.email == VIP_EMAIL && (
          <div>
         <Route
            path='/requests' render={( props ) =>
            <Requests {...props}
              user={user}
              authenticated={authenticated}
              badgeSet={this.badgeSet}
            />}
        />
        <Route
            path='/UserRequests' render={( props ) =>
            <UserRequests {...props}
              user={user}
              newUserRequests={this.newUserRequests}
            />}
        />
        <Route
        path='/assignNumbers' render={( props ) =>
        <AssignNumbers {...props}
          user={user}
          authenticated={authenticated}
          badgeSet={this.badgeSet}
          badgeSetAssign={this.badgeSetAssign}
        />}
       />
       </div>
      )
    }
          </div>
      {
        showLoginMessage && (
          <div className="errorMsg">
            <h5>Your account was not approved yet by admin.</h5>
          </div>
        )
      }
       <Share/>
      <Footer />
      </div>
      </Router>
    );
  }
}

export default App;
