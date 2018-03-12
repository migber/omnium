
import React, { Component } from 'react'
import { Navbar, Button } from 'react-bootstrap'
import './cyclists.css'
import Overall from '../overall/overall'

class Cyclists extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: null
    }
  }

  onAboutClick() {
    console.log('click!')
    this.setState({
    })
  }

  render() {
    const { authenticated, user } = this.state
    console.log(user)
    return (
      <div className="container">
       <div className="left-half">
        <h1>Left Half</h1>
        <p className="App-intro">
           To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
      <Overall />
    </div>
    )
  }
}

export default Cyclists

