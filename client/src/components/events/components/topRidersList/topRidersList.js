
import React, { Component } from 'react'
import './topRidersList.css'

class FirstRidersList extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render() {
   const { eventName } = this.props
   console.log('Riders List')
    return (
      <div className="from-left right-half">
      <h1>Right Half</h1>
      </div>
    )
  }
}

export default FirstRidersList

