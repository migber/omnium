import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import logo from './ltu-timing.png'
import './App.css'
import MenuBar             from './components/menuBar/menuBar'
import Footer from './components/footer/footer'
// import OmniumResults from './components/omniumResults/omniumResults'
// import Home from './components/home/home'
import Share from './components/share/share'
import Requests from './components/requests/requests'
import Cyclists from './components/cyclists/cyclists'
import Event from './components/events'
import Home from './components/home/home'

// const AUTH_URL = 'http://localhost:3001/created'
const AUTHORISE_URL = 'https://omnium.herokuapp.com/api/users/createLogged'
const EXISTS_URL = 'https://omnium.herokuapp.com/api/users/exists'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null,
      authenticated: false
    }

    this.onLogin = this.onLogin.bind(this)
    this.onLogout = this.onLogout.bind(this)
  }
  componentWillMount() {
    console.log(localStorage)
    const user = JSON.parse(localStorage.getItem('user'))
    if (localStorage.getItem('authenticated')) {
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
      img: profileObj.imageUrl
    }
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('authenticated', true)
    this.setState({ authenticated: true, user })
    console.log(user)
  }

  onLogout() {
    console.log('logout')
    localStorage.removeItem('user')
    localStorage.removeItem('authenticated')
    this.setState({ authenticated: false, user: null })
  }


  render() {
    const { authenticated, user } = this.state
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
       />
       <div>
       <Switch>
        <Route
            path='/'
            render={( props ) => <Home {...props} user={user} authenticated={authenticated} />}
         />
         <Redirect to='/event'/>
       </Switch>
        <Route
            path='/cyclists'
            render={( props ) => <Cyclists {...props} user={user} authenticated={authenticated} />}
        />
        <Route
          path='/requests' render={( props ) =>
          <Requests {...props} user={user} authenticated={authenticated} />}
         />
        <Route path='/events' render={( props ) =>
        <Event {...props} user={user}/>}
        />
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
