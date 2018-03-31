import React, { Component } from 'react'
import api from '../api'

class AssignNumberCyclistItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      raceNumber: 0,
      eventId: '',
      scoreId: '',
      bk: null,
      dns: null,
      firstName: '',
      lastName: '',
      uciCode: '',
      team: '',
      nationality: '',
      category: '',
      counter: 0,
    }
    this.changeRaceNumber = this.changeRaceNumber.bind(this)
  }

  componentWillMount(){
    console.log('inside')
    const { score, eventId } = this.props
      this.setState({
        raceNumber: score.raceNumber,
        eventId: eventId,
        scoreId: score.id,
        bk: score.bk,
        dns: score.dns,
        firstName: score.Cyclist.firstName,
        lastName: score.Cyclist.lastName,
        uciCode: score.Cyclist.uciCode,
        team: score.Cyclist.team,
        nationality: score.Cyclist.nationality,
        category: score.Cyclist.category
      })
  }

  updateRaceNumber() {
    console.log('inside update')
    const score = {
      raceNumber: this.state.raceNumber
    }
    api.updateCyclistRaceNumber(this.props.user, this.state.eventId, this.state.scoreId, score).then(() => {
      console.log('Cyclist number was updated')
    })
    window.location.reload()
  }

  changeRaceNumber(event){
    this.setState({
      raceNumber: event.target.value
    })
  }
  render() {
    const {
            raceNumber,
            lastName,
            firstName,
            uciCode,
            nationality,
            birthdate,
            category,
            bk,
            dns,
            scoreId,
            team } = this.state
    return (
      <tr className="inp-size">
          <td>
          <div class="inp-size input-group">
             <input type="number" value={raceNumber} class="txt-inside bord inp-size" onChange={this.changeRaceNumber}/>
          </div>
          </td>
          <td className="txt-big text">{firstName}</td>
          <td className="txt-big text">{lastName}</td>
          <td className="txt-big text"> {uciCode}</td>
          <td className="txt-big text"> {team}</td>
          <td className="txt-big text"> {nationality}</td>
          <td className="txt-big text"> {category}</td>
          <td>
            <button type="button" onClick={() => this.updateRaceNumber()} className="btn-approve btn-float btn btn-success">Assign</button>
          </td>
      </tr>
    )
  }
}

export default AssignNumberCyclistItem