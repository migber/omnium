import React, { Component } from 'react'
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap"
import Moment from 'moment'
import api from './api'

class CyclistModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      id: '',
      firstName: '',
      lastName: '',
      uciCode: '',
      team: '',
      nationality: '',
      birthdate: null,
      category: '',
      gender: '',
    }
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this)
    this.handleChangeLastName = this.handleChangeLastName.bind(this)
    this.handleChangeUCICode = this.handleChangeUCICode.bind(this)
    this.handleChangeTeam = this.handleChangeTeam.bind(this)
    this.handleChangeNationality = this.handleChangeNationality.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleChangeCategory = this.handleChangeCategory.bind(this)
  }

  componentWillMount(){
    const { cyclist } = this.props
      this.setState({
        id: cyclist.id,
        firstName: cyclist.firstName,
        lastName: cyclist.lastName,
        uciCode: cyclist.uciCode,
        team: cyclist.team,
        nationality: cyclist.nationality,
        birthdate: cyclist.date,
        category: cyclist.category,
        gender: cyclist.gender,
      })
  }

  updateCyclist() {
    console.log('here update cyclist')
    const cyclist = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      uciCode: this.state.uciCode,
      team: this.state.team,
      nationality: this.state.nationality,
      category: this.state.category,
      approved: false,
      birthdate: Moment(this.state.birthdate).format('YYYY-MM-YY'),
      gender: this.state.gender,
    }
    api.updateCyclist(this.props.user, this.state.id, cyclist).then(() => {
      this.props.action()
    })
  }

  handleChangeFirstName(e) {
    this.setState({
      firstName: e.target.value
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

  handleChangeDate(e) {
    this.setState({
      birthdate: e.target.value
    })
  }

  handleChangeCategory(e) {
    this.setState({
      category: e.target.value
    })
  }

  render() {
    const { lastName,
            firstName,
            uciCode,
            nationality,
            birthdate,
            category,
            team } = this.state
    return (
      <form>
      <FormGroup controlId="formFirstName" >
      <ControlLabel>First name</ControlLabel>
      <FormControl
        type="text"
        value={firstName}
        placeholder="Enter text"
        onChange={this.handleChangeFirstName}
      />
      <FormControl.Feedback />
      </FormGroup>

      <FormGroup controlId="formLastName">
      <ControlLabel>Last name</ControlLabel>
      <FormControl
        type="text"
        value={lastName}
        placeholder="Enter text"
        onChange={this.handleChangeLastName}
      />
      <FormControl.Feedback />
      </FormGroup>

      <FormGroup controlId="uciCode" >
      <ControlLabel>UCI code</ControlLabel>
      <FormControl
        type="text"
        value={uciCode}
        placeholder="Enter text"
        onChange={this.handleChangeUCICode}
      />
      <FormControl.Feedback />
      </FormGroup>


      <FormGroup controlId="formTeam" >
      <ControlLabel>Team</ControlLabel>
      <FormControl
        type="text"
        value={team}
        placeholder="Enter text"
        onChange={this.handleChangeTeam}
      />
      <FormControl.Feedback />
      </FormGroup>

      <FormGroup controlId="formBasicText" >
      <ControlLabel>Nationality</ControlLabel>
      <FormControl
        type="text"
        value={nationality}
        placeholder="Enter text"
        onChange={this.handleChangeNationality}
      />
      <FormControl.Feedback />
      </FormGroup>

      <FormGroup controlId="fromBasicDate">
      <ControlLabel>Birthdate</ControlLabel>
      <FormControl
        type="date"
        value={Moment(birthdate).format('YYYY-MM-YY')}
        placeholder="Enter text"
        onChange={this.handleChangeDate}
      />
      <FormControl.Feedback />
      </FormGroup>

      <FormGroup controlId="fromBasicDate" >
      <ControlLabel>Category</ControlLabel>
      <FormControl
        type="text"
        value={category}
        placeholder="Enter text"
        onChange={this.handleChangeCategory}
      />
      <FormControl.Feedback />
      </FormGroup>

      <Button onClick={this.props.onCloseButtonClick}>Close</Button>
      <Button onClick={() => this.updateCyclist()} bsStyle="primary">Save changes</Button>
      </form>
    )
  }
}

export default CyclistModal