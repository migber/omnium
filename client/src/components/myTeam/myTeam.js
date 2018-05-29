import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Modal } from "react-bootstrap"
import api from './api'
import './myTeam.css'
import logo from '../../LDSTS_logo-02.svg'
import eventsApi from '../events/api'
import Moment from 'moment'
import helper from './helper'
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap"
import SearchInput, {createFilter} from 'react-search-input'

const KEYS_TO_FILTERS = ['firstName', 'lastName', 'uciId']

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
          eventId: null,
          cyclists: null,
          analytics: null,
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
        this.openForm = this.openForm.bind(this)
      }

   componentWillMount() {
    this.setState({
      phone: null,
      firstName: null,
      lastName: null,
      email: null,
    })
    eventsApi.getEvents(this.props.user).then((events) => {
      if (events) {
        this.setState({
          eventId: events[events.length-1].id
        })
        console.log(this.state.eventId)
      }
    })
    api.getCyclists(this.props.user).then((cyclists) => {
      this.setState({
        cyclists,
      })
    })
    this.getRequests()
    api.getCyclistsAnalytics(this.props.user).then((cyclists) => {
      console.log(cyclists)
      const analytics = helper.getAnalyticsData(cyclists)
      console.log(analytics)
      this.setState({
        analytics
      })
    })
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

  openForm(){
    this.setState({
      saveClicked: false,
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

  setCyclistData(cyclist){
    this.setState({
      firstName: cyclist.firstName,
      lastName: cyclist.lastName,
      category: cyclist.category,
      gender: cyclist.gender,
      nationality: cyclist.nationality,
      birthday: cyclist.birthdate,
      uciCode: cyclist.uciCode,
      team: cyclist.team,
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
          cyclists,
          analytics,
        } = this.state
        const filteredEmails = cyclists && cyclists.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
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
                      <th scope="col">Events</th>
                      <th scope="col">Scratch avg. rank</th>
                      <th scope="col">Tempo race avg. rank</th>
                      <th scope="col">Elimination avg. rank</th>
                      <th scope="col">Omnium points</th>
                      <th scope="col">Omnium avg. rank</th>
                      {/* <th scope="col">Avg. position in race</th> */}
                  </tr>
                  </thead>
            { analytics && analytics.map((cyclist, index) => {
                    return (
                      <tbody key={cyclist.id} className="left">
                          <td>{cyclist.firstName}</td>
                          <td className="twofing">    {cyclist.lastName}</td>
                          <td className="txt-align">{cyclist.events}</td>
                          <td className="txt-align">{cyclist.positionScratch}</td>
                          <td className="txt-align">{cyclist.positionElim}</td>
                          <td className="txt-align">{cyclist.positionTempo}</td>
                          <td className="txt-align">{cyclist.pointrace}</td>
                          <td className="txt-align">{cyclist.positionPointRace}</td>
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
            {
              !saveClicked && (
                <p>
                 <h4>Please provide cyclists information.</h4>
                </p>
              )
            }
          </div>
          {
            showErrors && (
              <div className="errorMsg">
                <h5>Provided data is not valid.</h5>
             </div>
            )
          }
        </article>
        {
          !saveClicked && (
        <div>
        <div>
        <SearchInput className="search-input" onChange={this.searchUpdated} />
        {filteredEmails && filteredEmails.map((email) => {
          return (
            searchTerm && (
              <div className="mail" key={email.id}>
                 <a key={email.id} onClick={() => this.setCyclistData(email)} className="list-group-item list-group-item-action list-group-item-primary">
                 {email.firstName} {email.lastName} {email.uciCode}</a>
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
          <ControlLabel>UCI ID</ControlLabel>
          <FormControl
            type="number"
            value={uciCode}
            placeholder="Enter UCI ID"
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
            value={Moment(birthday).format('YYYY-MM-DD')}
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
          )
        }
        {
          saveClicked && (
            <div>
              <p>
                 <h4>Cyclist was submited</h4>
              </p>
              <div className="img-div">
                <img alt="meaninful string" src={logo}  width="200" height="150"/>
              </div>
              <Button onClick={() => this.openForm()} bsStyle="primary">Add cyclist</Button>
            </div>
          )
        }
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