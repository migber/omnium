import React, { Component } from 'react'
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap"
import Moment from 'moment'
import api from './api'

class CyclistScoreModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      eventId: '',
      scoreId: '',
      id: '',
      raceNo: '',
      bk: null,
      dns: null,
      firstName: '',
      lastName: '',
      uciCode: '',
      team: '',
      nationality: '',
      category: '',
      approved: false,
      gender: '',
    }
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this)
    this.handleChangeLastName = this.handleChangeLastName.bind(this)
    this.handleChangeUCICode = this.handleChangeUCICode.bind(this)
    this.handleChangeTeam = this.handleChangeTeam.bind(this)
    this.handleChangeNationality = this.handleChangeNationality.bind(this)
    this.handleChangeCategory = this.handleChangeCategory.bind(this)
    this.handleChangeDNS = this.handleChangeDNS.bind(this)
    this.handleChangeBK = this.handleChangeBK.bind(this)
    this.handleChangeRaceNo = this.handleChangeRaceNo.bind(this)
  }

  componentWillMount(){
    const { cyclist, eventId } = this.props
      this.setState({
        eventId,
        scoreId: cyclist.id,
        id: cyclist.Cyclist.id,
        firstName: cyclist.Cyclist.firstName,
        lastName: cyclist.Cyclist.lastName,
        uciCode: cyclist.Cyclist.uciCode,
        team: cyclist.Cyclist.team,
        nationality: cyclist.Cyclist.nationality,
        category: cyclist.Cyclist.category,
        gender: cyclist.Cyclist.gender,
        approved: cyclist.Cyclist.approved,
        raceNo: cyclist.raceNumber,
        bk: cyclist.bk,
        dns: cyclist.dns
      })
  }

  updateCyclist() {
    const score = {
      raceNumber: this.state.raceNo,
      dns: this.state.dns,
      bk: this.state.bk,
      eventId: this.state.eventId,
    }
    const cyclist = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      uciCode: this.state.uciCode,
      team: this.state.team,
      nationality: this.state.nationality,
      category: this.state.category,
      approved: this.state.approved,
      birthdate: Moment(this.state.birthdate).format('YYYY-MM-YY'),
      gender: this.state.gender,
    }
    api.updateCyclist(this.props.user, this.state.id, cyclist).then(() => {})
    api.updateScore(this.props.user, this.state.eventId, this.state.scoreId, score).then(() => {})
    localStorage.setItem('category', JSON.stringify(this.state.category))
    this.props.action(this.state.category)
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

  handleChangeCategory(e) {
    this.setState({
      category: e.target.value
    })
  }

  handleChangeBK(e){
    const bk = e.target.value === 'on' ? true : false
    this.setState({
      bk: !this.state.bk
    })
  }

  handleChangeDNS(e){
    this.setState({
      dns: !this.state.dns
    })
  }

  handleChangeRaceNo(e){
    this.setState({
      raceNo: e.target.value
    })
  }

  render() {
    const { lastName,
            firstName,
            uciCode,
            nationality,
            birthdate,
            category,
            team,
            bk,
            raceNo,
            dns } = this.state
    return (
      <form>
       <FormGroup controlId="formRaceNo" >
        <ControlLabel>Race number</ControlLabel>
        <FormControl
          type="text"
          value={raceNo}
          placeholder="Enter text"
          onChange={this.handleChangeRaceNo}
        />
        <FormControl.Feedback />
        </FormGroup>

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
        <ControlLabel>UCI ID</ControlLabel>
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

        <ControlLabel>Did not start</ControlLabel>
        <div className="contact-selector">
            <input type="checkbox"
                   checked={this.state.dns}
                onChange={this.handleChangeDNS} />
        </div>

        <ControlLabel>b/k</ControlLabel>
        <div className="contact-selector">
            <input type="checkbox"
                  checked={this.state.bk}
                  onChange={this.handleChangeBK}
            />
        </div>

        <Button onClick={this.props.onCloseButtonClick}>Close</Button>
        <Button onClick={() => this.updateCyclist()} bsStyle="primary">Save changes</Button>
      </form>
    )
  }
}

export default CyclistScoreModal