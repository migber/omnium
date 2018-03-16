import React, { Component } from 'react'
import './footer.css'

class Footer extends Component {

  render() {
    // const {eventId} = this.props
    // const { isAuthenticated } = this.props.auth

    return (
      <div className="footer">
      <p className="text-center text-muted">© Copyright 2018 Emdzyel, Kaunas, Lithuania </p>
      </div>
    )
  }
}

export default Footer