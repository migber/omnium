import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import logo from './ltu-timing.png'
import './App.css'
import MenuBar             from './components/menuBar/menuBar'
import Footer from './components/footer/footer'
import Share from './components/share/share'
import Requests from './components/requests/requests'
import Cyclists from './components/cyclists/cyclists'
import Event from './components/events'
import Home from './components/home/home'
import Register from './components/registration/registration'
import { VIP_EMAIL } from './config/env'
import { request } from 'https'
import api from './components/requests/api'

const AUTHORISE_URL = 'https://omnium.herokuapp.com/api/users/createLogged'
const EXISTS_URL = 'https://omnium.herokuapp.com/api/users/exists'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null,
      authenticated: false,
      badges: 0,
    }
    this.onLogin = this.onLogin.bind(this)
    this.onLogout = this.onLogout.bind(this)
    this.badgeSet = this.badgeSet.bind(this)
  }

  componentWillMount() {
    console.log(localStorage)
    const user = JSON.parse(localStorage.getItem('user'))
    if (localStorage.getItem('authenticated')) {
      this.badgeSet(user)
      this.setState({ authenticated: true, user })
    } else {
      this.setState({ authenticated: false, user: {} })
    }
  }

  onLogin(response) {
    console.log("login")
    const { profileObj } = response
    const user = {
      email: profileObj.email,
      accessToken: response.accessToken,
      googleId: profileObj.googleId,
      img: profileObj.imageUrl,
      counter: 0,
    }
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('authenticated', true)
    this.setState({ authenticated: true, user })
    this.badgeSet(user)
    window.location.reload()
    console.log(user)
  }

  onLogout() {
    console.log('logout')
    localStorage.removeItem('user')
    localStorage.removeItem('authenticated')
    this.setState({ authenticated: false, user: null })
    window.location.reload()
  }

  badgeSet(user){
    api.getRequests(user).then( requests => {
      this.setState({ badges: requests.length })
    })
  }

  render() {
    const { authenticated, user, counter, badges } = this.state
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
       />
       <div>
       <Switch>
        <Route
            exact path='/'
            render={( props ) => <Home {...props} user={user} authenticated={authenticated} />}
         />
       </Switch>
        <Route
            path='/cyclists'
            render={( props ) => <Cyclists {...props} user={user} authenticated={authenticated} />}
        />
        <Route path='/register' render={( props ) =>
         <Register {...props} authenticated={authenticated} user={user} />
        }
        />
        <Route path='/events' render={( props ) =>
        <Event {...props} user={user}/>}
        />
        { user.email == VIP_EMAIL && (
         <Route
         path='/requests' render={( props ) =>
         <Requests {...props}
           user={user}
           authenticated={authenticated}
           badgeSet={this.badgeSet} />}
        />
      )
    }
          </div>
       <div id="root"></div>
       {/* <Home/> */}
       <Share/>
      <Footer />
      </div>
      </Router>
    );
  }
}

export default App;
