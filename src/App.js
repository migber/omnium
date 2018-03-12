import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import logo from './ltu-timing.png'
import './App.css'
import MenuBar             from './components/menuBar/menuBar'
import Footer from './components/footer/footer'
import OmniumResults from './components/omniumResults/omniumResults'
import Home from './components/home/home'
import Share from './components/share/share'
import Requests from './components/requests/requests'
import Cyclists from './components/cyclists/cyclists'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: null,
      profile: this.props.profile,
      omniumId: null,
    }

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.goTo = this.goTo.bind(this)
  }

  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  render() {
    return (
      <Router>
      <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">LTU timing</h1>
      </header>
      <MenuBar
       fixesTop={true}
       responsive={true}
       login={this.login.bind(this)}
       logout={this.logout.bind(this)}
       auth={this.props.auth}
       goTo={this.goTo.bind(this)}
       />
       <div>
        <Route
            path='/cyclists'
            render={({ match }) => <Cyclists/>}
        />
          <Route
            path='/requests'
            component={Requests}/>
          </div>
       <body >
       <div id="root"></div>
        </body>
       {/* <Home/> */}
       <Share/>
      <Footer />
      </div>
      </Router>
    );
  }
}

export default App;
