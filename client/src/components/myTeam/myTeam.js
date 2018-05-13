import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Modal } from "react-bootstrap"
import api from './api'
import Moment from 'moment'
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap"
import SearchInput, {createFilter} from 'react-search-input'

const KEYS_TO_FILTERS = ['user.firstName', 'user.lastName', 'user.uciId']

class MyTeam extends Component {
    constructor(props){
        super(props)
        this.state = {
          user: this.props.user,
          requests: null,
          deleteBtn: false,
          approveBtn: false,
          saveClicked: false,
          showErrors: false,
          firstName: '',
          lastName: '',
          uciCode: '',
          team: '',
          nationality: '',
          category: '',
          gender: '',
          birthday: null,
          searchTerm: '',
          eventId: 10,
        }

        this.deleteUser = this.deleteUser.bind(this)
        this.searchUpdated = this.searchUpdated.bind(this)
        this.getRequests = this.getRequests.bind(this)
        this.approve = this.approve.bind(this)
        this.onSaveButtonClick = this.onSaveButtonClick.bind(this)
        this.handleChangeFirstName = this.handleChangeFirstName.bind(this)
        this.handleChangeGender = this.handleChangeGender.bind(this)
        this.handleChangeBirthday = this.handleChangeBirthday.bind(this)
        this.handleChangeLastName = this.handleChangeLastName.bind(this)
        this.handleChangeUCICode = this.handleChangeUCICode.bind(this)
        this.handleChangeTeam = this.handleChangeTeam.bind(this)
        this.handleChangeNationality = this.handleChangeNationality.bind(this)
        this.handleChangeCategory = this.handleChangeCategory.bind(this)
        this.validation = this.validation.bind(this)
        this.setCyclistData = this.setCyclistData.bind(this)
        this.validateData = this.validateData.bind(this)
      }

   componentWillMount() {
    this.setState({
      phone: null,
      firstName: null,
      lastName: null,
      email: null,
    })
    this.getRequests()

   }

   deleteUser(id) {
       api.deleteUser(this.props.user, id).then(() => {
        this.props.newUserRequests(this.props.user)
        this.getRequests()
       })
   }

   approve(id){
       api.approveUser(this.props.user, id).then(() => {
         this.props.newUserRequests(this.props.user)
         this.getRequests()
       })
   }

   getRequests() {
     console.log(this.props.user)
      // api.getUserRequests(this.props.user).then((requests) => {
      //   this.setState({
      //     requests
      //   })
      // })
   }

   handleChangeFirstName(e) {
    this.setState({
      firstName: e.target.value
    })
  }

  handleChangeBirthday(e){
    this.setState({
      birthday: e.target.value
    })
  }

  handleChangeGender(e){
    this.setState({
      gender: e.target.value
    })
  }

  handleChangeLastName(e) {
    this.setState({
      lastName: e.target.value
    })
  }

  handleChangeUCICode(e) {
    this.setState({
      uciCode: e.target.value
    })
  }

  handleChangeTeam(e) {
    this.setState({
      team: e.target.value
    })
  }

  handleChangeNationality(e) {
    this.setState({
      nationality: e.target.value
    })
  }

  handleChangeCategory(e) {
    this.setState({
      category: e.target.value
    })
  }


  onSaveButtonClick(){
    const data = {
      cyclist: {
        firstName: `${this.state.firstName[0].toUpperCase()}${this.state.firstName.substr(1)}`,
        lastName: this.state.lastName.toUpperCase(),
        uciCode: this.state.uciCode,
        team: this.state.team,
        gender: this.state.gender.toLowerCase(),
        category: this.state.category.toLowerCase(),
        birthdate: this.state.birthday,
        nationality: this.state.nationality.toUpperCase(),
        userId: this.state.user.id,
      },
      eventId: this.state.eventId,
    }
    console.log(data)
    if(this.validation(data.cyclist)) {
      api.postCyclist(this.props.user, data).then((resp) => {
        this.setState({
          firstName: null,
          lastName: null,
          category: null,
          gender: null,
          birthday: null,
          uciCode: null,
          team: null,
          saveClicked: true,
          showErrors: false,
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

  validation(data){
    console.log(data)
    console.log(data.uciCode.length)
    if(data.firstName && data.lastName &&
       data.uciCode && data.nationality &&
       data.birthdate && data.team &&
       data.gender && data.category){
      if(data.uciCode.length !== 11) {
        console.log('here')
        return false
      } else if (this.validateData(data)){
        console.log('here true')
        return true
      }
    } else {
      console.log('here false')
      return false
    }
  }

  validateData(data) {
    const validRegEx = /^[^\\\/&.*#%]*$/
    if (!data.firstName.match(validRegEx)) {
      return false
    }
    if (!data.lastName.match(validRegEx)) {
      return false
    }
    if (!data.nationality.match(validRegEx)) {
      return false
    }
    if (!data.team.match(validRegEx)) {
      return false
    }
    if (!data.gender.match(validRegEx)) {
      return false
    }
    if (!data.category.match(validRegEx)) {
      return false
    }
    return true
  }

  searchUpdated (term) {
    this.setState({searchTerm: term})
  }

  setCyclistData(cyclistId){
    this.setState({
      firstName: "Migle",
      lastName: "Beresineviciute",
      category: "som",
      gender: "female",
      birthday: '1995-04-16',
      uciCode: 90987876756,
      team: "LTU",
    })
  }

    render() {
        const { requests, deleteBtn, edit } = this.state
        const { lastName,
          firstName,
          uciCode,
          nationality,
          birthdate,
          category,
          team,
          saveClicked,
          showErrors,
          birthday,
          gender,
          searchTerm,
        } = this.state
        const emails = [{
          id: 1,
          user :{
            firstName: 'Migle',
            uciId: 90987876756,
            lastName: 'Beresineviciute'
          },
        },
        {
          id: 2,
          user: {
            name: 'Anne',
          },
        },
        {
          id: 3,
          user: {
            name: 'Tom',
          },
        }]
        const filteredEmails = emails.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
        return (
          <div className="container">
          {
            this.props.authenticated && (
              <div>
              <div className="left-half">
              <div className="row">
                  <div className="listPosition col-sm-8">
                  <div className="border-bottom" >
                      <h1 className="display-3">Team</h1>
                  </div>
            <table className="fit table table-striped">
                  <thead className="left">
                      <tr >
                      <th scope="col">First name</th>
                      <th scope="col">Last name</th>
                      <th scope="col">UCI ID</th>
                      <th scope="col">Category</th>
                      <th scope="col">Races</th>
                      <th scope="col">Scratch points</th>
                      <th scope="col">Tempo Points</th>
                      <th scope="col">Elimination Points</th>
                      <th scope="col">Point Race points</th>
                      <th scope="col">Avg. position in race</th>
                  </tr>
                  </thead>
            { requests && requests.map((request, index) => {
                    return (
                      <tbody key={request.id} className="left">
                          <td>{request.name}</td>
                          <td>{request.surname}</td>
                          <td> {request.phone}</td>
                          <td> {request.email}</td>
                          <button onClick={() => this.deleteUser(request.id)} type="button" className="btn-delete btn-float btn">Delete</button>
                          <button type="button" onClick={() => this.approve(request.id)} className="btn-approve btn-float btn btn-success">Approve</button>
                      </tbody>
                    )
                  })
                }
          </table>
          </div>
          </div>
          </div>
      <div className="right-half">
         <div>
            <article>
            <div className="border-bottom">
              <h1>Cyclist registration</h1>
            </div>
            <div className="from-top">
            <p>
              <h4>Please provide cyclists information.</h4>
            </p>
          </div>
          {
            showErrors && (
              <div className="errorMsg">
                <h5>Provided data is not valid.</h5>
             </div>
            )
          }
        </article>
        <div>
        <SearchInput className="search-input" onChange={this.searchUpdated} />
        {filteredEmails.map((email) => {
          return (
            searchTerm && (
              <div className="mail" key={email.id}>
                 <a key={email.id} onClick={() => this.setCyclistData(email.id)} className="list-group-item list-group-item-action list-group-item-primary">
                 {email.user.firstName} {email.user.lastName} {email.user.uciId}</a>
            </div>
            )
          )
        })}
      </div>
          <form>
          <FormGroup controlId="formFirstName" >
          <ControlLabel>First name</ControlLabel>
          <FormControl
            type="text"
            value={firstName}
            placeholder="Enter first name"
            onChange={this.handleChangeFirstName}
          />
          <FormControl.Feedback />
          </FormGroup>

          <FormGroup controlId="formLastName">
          <ControlLabel>Last name</ControlLabel>
          <FormControl
            type="text"
            value={lastName}
            placeholder="Enter last name"
            onChange={this.handleChangeLastName}
          />
          <FormControl.Feedback />
          </FormGroup>

          <FormGroup controlId="uciCode" >
          <ControlLabel>UCI code</ControlLabel>
          <FormControl
            type="number"
            value={uciCode}
            placeholder="Enter UCI code"
            onChange={this.handleChangeUCICode}
          />
          <FormControl.Feedback />
          </FormGroup>

          <FormGroup controlId="formTeam" >
          <ControlLabel>Team</ControlLabel>
          <FormControl
            type="text"
            value={team}
            placeholder="Enter team"
            onChange={this.handleChangeTeam}
          />
          <FormControl.Feedback />
          </FormGroup>

          <FormGroup controlId="formBasicText" >
          <ControlLabel>Nationality</ControlLabel>
          <FormControl
            type="text"
            value={nationality}
            placeholder="Enter nationality"
            onChange={this.handleChangeNationality}
          />
          <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="Birthday">
          <ControlLabel>Birthday</ControlLabel>
          <FormControl
            type="date"
            value={birthday}
            onChange={this.handleChangeBirthday}
          />
          <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="fromCategory" >
          <ControlLabel>Category</ControlLabel>
          <FormControl
            type="text"
            value={category}
            placeholder="Enter category"
            onChange={this.handleChangeCategory}
          />
          <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="gender">
          <ControlLabel>Gender</ControlLabel>
          <FormControl
            type="text"
            value={gender}
            placeholder="Female/Male"
            onChange={this.handleChangeGender}
          />
          <FormControl.Feedback />
          </FormGroup>
          <Button onClick={() => this.onSaveButtonClick()} bsStyle="primary">Add cyclist</Button>
          </form>
      </div>
         </div>
         </div>
            )
          }
      </div>
        )
    }
}

export default MyTeam