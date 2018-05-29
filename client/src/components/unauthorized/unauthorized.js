import React, { Component } from 'react'
import toyger from '../../Tigriukas-02.png'

class Unauthorize extends Component {
  render() {
    return (
      <div className="container">
        <p>
          <h4> Not authorized. Please login. </h4>
        </p>
       <img alt="meaninful string" src={toyger}  width="600" height="500"/>
     </div>
  )
}
}

export default Unauthorize
