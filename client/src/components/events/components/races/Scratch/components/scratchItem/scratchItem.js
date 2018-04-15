import React, { Component } from 'react'
import api from './api'

class ScratchItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      rankId: null,
      raceNumber: 0,
      eventId: null,
      scoreId: null,
      bk: null,
      dns: null,
      dnf: null,
      dnq: null,
      lapPlusPoints: null,
      lapMinusPoints: null,
      positionBefore: null,
      points: null,
      finishPlace: null,
      place: null,
      totalPoints: null,
      firstName: null,
      lastName: null,
      uciCode: null,
      nationality: null,
    }
    this.changeRaceNumber = this.changeRaceNumber.bind(this)
    this.deleteScore = this.deleteScore.bind(this)
  }

  componentWillMount(){
    const { score, eventId, rankId } = this.props
      this.setState({
        rankId: rankId,
        raceNumber: score.raceNumber,
        eventId: eventId,
        scoreId: score.id,
        bk: score.bk,
        dns: score.dns,
        dnf: score.dnf,
        dnq: score.dnq,
        positionBefore: score.positionBefore,
        lapPlusPoints: score.lapPlusPoints,
        lapMinusPoints: score.lapMinusPoints,
        points: score.points,
        finishPlace: score.finishPlace,
        place: score.place,
        totalPoints: score.totalPoints,
        firstName: score.Cyclist.firstName,
        lastName: score.Cyclist.lastName,
        uciCode: score.Cyclist.uciCode,
        nationality: score.Cyclist.nationality,
      })
  }

  updateRaceNumber() {
    const score = {
      raceNumber: this.state.raceNumber,
      eventId: this.state.eventId
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

  deleteScore(){
    api.deleteScore(this.props.user, this.state.scoreId).then(() => {
      console.log(`Score id:${this.state.scoreId} was deleted`)
    })
    window.location.reload()
  }

  render() {
    const {
      rankId,
      raceNumber,
      scoreId,
      bk,
      dns,
      dnf,
      dnq,
      positionBefore,
      lapPlusPoints,
      lapMinusPoints,
      points,
      finishPlace,
      place,
      totalPoints,
      firstName,
      lastName,
      uciCode,
      nationality,
    } = this.state
    const { isStartList } = this.props
    return (
      <tr>
        {
          !isStartList && dns ? (
            <td className="txt-big text">DNS</td>
          ) : dnf ? (
            <td className="txt-big text">DNF</td>
          ) : dnq ? (
            <td className="txt-big text">DNQ</td>
          ) : (
            !isStartList ? (
              <td className="txt-big text">{place}</td>
            ) : (
              <td className="txt-big text">{rankId + 1}</td>
            )
          )
        }
        <td className="raceNo txt-big text">{raceNumber}</td>
        <td className="txt-big text">{lastName} {firstName}</td>
        <td className="txt-big text">{uciCode}</td>
        <td className="txt-big text">{nationality}</td>
        {
          !isStartList && (
            <td className="txt-big text">+{lapPlusPoints}</td>
            )
          }
        {
          !isStartList && (
            <td className="txt-big text">-{lapMinusPoints}</td>
          )
        }
        {
          !isStartList && (
            (!dns && !dnq && !dnf) ?(
              <td className="txt-big text">{finishPlace}</td>
            ) : (
              <td className="txt-big text"></td>
            )
          )
        }
        {
          !isStartList && (
              (!dns && !dnq && !dnf) ?(
                <td className="txt-big text">{totalPoints}</td>
              ) : (
                <td className="txt-big text"></td>
              )
          )
        }
    </tr>
    )
  }
}

export default ScratchItem