import React, { Component } from 'react'
import api from './api'

class TempoItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      rankId: props.rankId,
      raceNumber: props.score.raceNumber,
      eventId: props.eventId,
      scoreId: props.score.id,
      bk: props.score.bk,
      dns: props.score.dns,
      dnf: props.score.dnf,
      dnq: props.score.dnq,
      lapPlusPoints: props.score.lapPlusPoints,
      lapMinusPoints: props.score.lapMinusPoints,
      positionBefore: props.score.positionBefore,
      points: props.score.points,
      finishPlace: props.score.finishPlace,
      place: props.score.place,
      totalPoints: props.score.totalPoints,
      firstName: props.score.Cyclist.firstName,
      lastName: props.score.Cyclist.lastName,
      uciCode: props.score.Cyclist.uciCode,
      nationality: props.score.Cyclist.nationality,
      sprintsString: null,
    }
    this.changeRaceNumber = this.changeRaceNumber.bind(this)
    this.deleteScore = this.deleteScore.bind(this)
  }

  componentDidMount(){
    const sprints = this.props.score.Sprints
    sprints.sort((a, b) => {
      return a.sprintNumber - b.sprintNumber
    })
    var sprintsString = sprints.map((sprint) => {
      return sprint.sprintNumber
    }).join(",")
    this.setState({
      sprintsString
    })
    console.log(sprintsString)
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
      sprintsString
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
            <td className="txt-big text">{rankId + 1}</td>
          )
        }
        <td className="raceNo txt-big text">{raceNumber}</td>
        <td className="txt-big text">{lastName} {firstName}</td>
        {
          isStartList && (
            <td className="txt-big text">{uciCode}</td>
          )
        }
        <td className="txt-big text">{nationality}</td>
        {
          !isStartList && (
              <td className="txt-big text">{sprintsString}</td>
          )
        }
        {
          !isStartList && (
            <td className="txt-big text">{finishPlace}</td>
          )
        }
        {
          !isStartList && (
              (lapPlusPoints === 0) ? (
                <td className="txt-big text"></td>
              ) : (
                <td className="txt-big text">+{lapPlusPoints}</td>
              )
            )
          }
        {
          !isStartList && (
           (lapMinusPoints === 0) ? (
                <td className="txt-big text"></td>
              ) : (
                <td className="txt-big text">-{lapMinusPoints}</td>
              )
          )
        }
        {
          !isStartList && (
              (!dns && !dnq && !dnf) ? (
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

export default TempoItem