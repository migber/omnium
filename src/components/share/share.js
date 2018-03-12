import React, { Component } from 'react'
import './share.css'
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share'

class Share extends Component {


  render() {
    const title = "Omnium"
    const siteUrl = "http://localhost:3000/results"
    return (
      <div className="container">
      <div className="horizontal">
      <FacebookShareButton
            url={siteUrl}
            quote={title}
            className="btn-share">
            <FacebookIcon
              size={32}
              round />
          </FacebookShareButton>
          <TwitterShareButton
            url={siteUrl}
            title={title}
            className="btn-share">
            <TwitterIcon
              size={32}
              round />
          </TwitterShareButton>
          </div>
    </div>
  )
}
}

export default Share
