
import React, { Component } from 'react'
import { Navbar, Button } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import './home.css'

class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      clickCount: 0,
      eventId: null,
      user: this.user,
      token: null,
      redirect: true,
    }
  }

  render() {
    const { redirect } = this.state
    if (redirect) {
      return <Redirect to='/events' push/>
    }
    console.log(this.state.user)
    return (
      <div className="container">
      <div className="left-half">
      <h1>Left Half</h1>
      <p className="App-intro">
      To get started, edit <code>src/App.js</code> and save to reload.
      </p>
      </div>
      <div className="right-half">
      <h1>Right Half</h1>
      </div>
      </div>
    )
  }
}

export default Home;

