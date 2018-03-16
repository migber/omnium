
import React, { Component } from 'react'
// import { Navbar, Button } from 'react-bootstrap'
import './overall.css'

class Overall extends Component {
  constructor(props){
    super(props)
    this.state = {
      clickCount: 0,
      eventId: null,
      profile: this.props.profile,
      token: null
    }
  }

  onAboutClick() {
    console.log('click!')
    this.setState({
    })
  }

  render() {
    return (
      <div className="right-half">
      <h4>Omnium overall</h4>
      </div>
    )
  }
}

export default Overall

