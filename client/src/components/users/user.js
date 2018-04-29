
import React, { Component } from 'react'
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap"
import api from './api'
import './user.css'
import logo from '../../LDSTS_logo-02.svg'

class Users extends Component {
  constructor(props){
    super(props)
    this.state = {
      email: 'example@gmail.com',
      phone: 'phone',
      firstName: 'firstName',
      lastName: 'lastName',
      saveClicked: false,
      showErrors: false,
    }
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this)
    this.handleChangePhone = this.handleChangePhone.bind(this)
    this.handleChangeEmail = this.handleChangeEmail.bind(this)
    this.handleChangeLastName = this.handleChangeLastName.bind(this)
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this)
    this.validation = this.validation.bind(this)
    }

  componentWillMount() {
    this.setState({
      phone: null,
      firstName: null,
      lastName: null,
      email: null,
    })
   }

   handleChangeEmail(e) {
    this.setState({
      email: e.target.value
    })
   }

   handleChangeLastName(e){
    this.setState({
      lastName: e.target.value
    })
   }

   handleChangeFirstName(e){
    this.setState({
      firstName: e.target.value
    })
   }

   handleChangePhone(e){
    this.setState({
      phone: e.target.value
    })
   }

  onSaveButtonClick(){
    const userData = {
      email: this.state.email,
      name: this.state.firstName,
      surname: this.state.lastName,
      phone: this.state.phone
    }
    if(this.validation(userData)) {
      api.postUserRequest(userData).then((resp) => {
        this.setState({
          saveClicked: true,
          name: null,
          surname: null,
          phone: null,
          email: null,
        })
      })
    } else {
      this.setState({
        showErrors: true
      })
    }
  }

  handleChange(event){
    this.setState({
      selectedValue: event.target.value,
      eventId: event.target.value
    })
    this.findParticipants(event.target.value)
  }

  validation(userData){
    if(userData.email && userData.phone){
      if(!userData.email.includes('@')) {
        return false
      } else if (!userData.phone.includes('+3')){
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }

  render() {
    const { phone,
            firstName,
            lastName,
            email,
            saveClicked,
            showErrors,
          } = this.state
    return (
      <div className="container">
      {
        !saveClicked ? (
         <div>
            <article>
            <div className="border-bottom">
              <h1>Registration</h1>
            </div>
            <div className="from-top">
            <p>
              <h4>Please provide your information and submit the request.</h4>
            </p>
          </div>
          {
            showErrors && (
              <div className="errorMsg">
                <h3>Provided data is not valid.</h3>
             </div>
            )
          }
        </article>
          <form>
          <FormGroup controlId="formFirstName" >
          <ControlLabel>First name</ControlLabel>
          <FormControl
            type="text"
            value={firstName}
            placeholder="Enter name"
            onChange={this.handleChangeFirstName}
          />
          <FormControl.Feedback />
          </FormGroup>

          <FormGroup controlId="formLastName">
          <ControlLabel>Last name</ControlLabel>
          <FormControl
            type="text"
            value={lastName}
            placeholder="Enter surname"
            onChange={this.handleChangeLastName}
          />
          <FormControl.Feedback />
          </FormGroup>

          <FormGroup controlId="phone" >
          <ControlLabel>Phone</ControlLabel>
          <FormControl
            type="text"
            value={phone}
            placeholder="+370XXXXXXXX"
            onChange={this.handleChangePhone}
          />
          <FormControl.Feedback />
          </FormGroup>


          <FormGroup controlId="emailId" >
          <ControlLabel>Email</ControlLabel>
          <FormControl
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={this.handleChangeEmail}
          />
          <FormControl.Feedback />
          </FormGroup>

          <Button onClick={() => this.onSaveButtonClick()} bsStyle="primary">Save changes</Button>
          </form>
      </div>
        ) : (
          <article>
            <div className="border-bottom">
              <h1>Registration</h1>
            </div>
            <div className="from-top">
              <h4>Thank you! Soon your request will be approved. </h4>
              <img src={logo} className="App-logo" alt="logo" />
          </div>
        </article>
        )
      }
      </div>
    )
  }
}

export default Users

