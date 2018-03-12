import React, { Component } from 'react'
import './Auth.css'
import FacebookLogin from 'react-facebook-login'
import { GoogleLogin } from 'react-google-login'

class OAuth extends Component {

  constructor(props){
    super(props)
    this.state = {
      redirect: false,
    }
  }

  render() {

    const responseGoogle = (response) => {
      console.log(response)
    }

    const responseFacebook = (response) => {
      console.log(response)
    }

    return (
      <div className="container">
      <div className="form_login">
          </div>
          <div className="button-login">
          <GoogleLogin
    clientId="308977226751-dqstcngaqgj8vk5i50fj2mgedcoau9eh.apps.googleusercontent.com"
    buttonText="Login"
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
  />
  </div>
  <div className="button-login">
   <FacebookLogin
    appId="1699379480156978"
    autoLoad={true}
    fields="name,email,picture"
    onClick={responseFacebook}
    callback={responseFacebook} />
      </div>
      </div>
  )
}
}

export default OAuth
