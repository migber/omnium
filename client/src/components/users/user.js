
import React, { Component } from 'react'
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap"

class Users extends Component {
  constructor(props){
    super(props)
    this.state = {
      email: null,
      approved: null,
      accessToken: null,
      lastLoggedIn: null,
      firstlogedIn: null,
      submitted: null,
      phone: null,
      name: null,
      surname: null,
      googleId: null,
      img: null,
    }
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this)
    this.handleChangePhone = this.handleChangePhone.bind(this)
    this.handleChangeEmail = this.handleChangeEmail.bind(this)
    this.handleChangeLastName = this.handleChangeLastName.bind(this)
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this)
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

  onSaveButtonClick(category){
    this.setState({
        edit: false,
        btnActive: category,
    })
  }

  handleChange(event){
    this.setState({
      selectedValue: event.target.value,
      eventId: event.target.value
    })
    this.findParticipants(event.target.value)
  }

  render() {
    const { phone,
            firstName,
            lastName,
            email,
          } = this.state
    return (
      <div className="container">
      <article>
        <div className="border-bottom">
          <h1>Registration</h1>
        </div>
        <div className="from-top">
          <p>
            <h4>Please provide your information and submit the request.</h4>
          </p>
         </div>
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
        type="text"
        value={email}
        placeholder="Enter email"
        onChange={this.handleChangeEmail}
      />
      <FormControl.Feedback />
      </FormGroup>

      <Button onClick={() => this.onSaveButtonClick()} bsStyle="primary">Save changes</Button>
      </form>
      </div>
    )
  }
}

export default Users

