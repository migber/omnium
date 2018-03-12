import React, { Component } from 'react'
import './omniumResults.css'
import {
  FacebookShareCount,
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  TwitterShareCount,
} from 'react-share'

class OmniumResults extends Component {

  render() {

    return (
      <div className="container">
      <div className="left-half">
      <h1>Left Half</h1>
      <p className="App-intro">
         To get started, edit <code>src/App.js</code> and save to reload.
      </p>
      </div>
      <div class="right-half">
      <h1>Right Half</h1>
      </div>
    </div>
  )
}
}

export default OmniumResults
